-- PREPRODUCTION ONLY. Review before applying. Not applied to any production database by this PR.
-- Refresh-token grants with rotation, reuse detection, atomic update and revocation.
--
-- Model: one owner approval (consent) creates one GRANT. A grant owns a chain ("family") of
-- single-use refresh tokens. Every refresh consumes the presented token and issues its successor
-- in ONE transaction. Presenting a token that was already consumed is treated as theft:
-- the whole grant is revoked, so neither the thief nor the legitimate holder can continue.
-- Only SHA-256 digests of refresh tokens are stored; raw tokens never reach the database.

create table if not exists public.ai_consensus_oauth_grants (
  grant_id uuid primary key,
  subject uuid not null references auth.users(id) on delete cascade,
  client_id text not null check (length(client_id) between 1 and 256),
  scopes text[] not null check (
    cardinality(scopes) between 1 and 2
    and scopes <@ array['consensus.read','consensus.write']::text[]
    and (cardinality(scopes) = 1 or scopes[1] <> scopes[2])
  ),
  -- Authorization code that produced this grant (digest only). Lets a replayed code revoke it.
  origin_code_digest text unique check (origin_code_digest ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  -- Absolute lifetime: a grant can never be refreshed forever.
  expires_at timestamptz not null,
  revoked_at timestamptz,
  revoke_reason text check (revoke_reason in
    ('owner','client','refresh_reuse','code_reuse','admin')),
  constraint grant_revoke_consistent check ((revoked_at is null) = (revoke_reason is null)),
  constraint grant_lifetime check (expires_at > created_at and expires_at <= created_at + interval '90 days')
);
create index if not exists ai_consensus_oauth_grants_owner_idx
  on public.ai_consensus_oauth_grants(subject, created_at desc);

create table if not exists public.ai_consensus_oauth_refresh_tokens (
  token_digest text primary key check (token_digest ~ '^[0-9a-f]{64}$'),
  grant_id uuid not null references public.ai_consensus_oauth_grants(grant_id) on delete cascade,
  -- Sliding expiry, always capped at the grant's absolute expiry.
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  -- Set exactly once, when the token is exchanged for its successor.
  rotated_at timestamptz,
  replaced_by text unique references public.ai_consensus_oauth_refresh_tokens(token_digest),
  constraint token_rotation_consistent check ((rotated_at is null) = (replaced_by is null))
);
create index if not exists ai_consensus_oauth_refresh_tokens_grant_idx
  on public.ai_consensus_oauth_refresh_tokens(grant_id);

alter table public.ai_consensus_oauth_grants enable row level security;
alter table public.ai_consensus_oauth_refresh_tokens enable row level security;
-- No end-user policies: every access goes through a trusted server route using service_role.
revoke all on public.ai_consensus_oauth_grants from public, anon, authenticated;
revoke all on public.ai_consensus_oauth_refresh_tokens from public, anon, authenticated;
grant select on public.ai_consensus_oauth_grants to service_role;
grant select on public.ai_consensus_oauth_refresh_tokens to service_role;
-- Writes happen ONLY inside the SECURITY DEFINER functions below, never by direct table access.

-- 1) Create a grant and its first refresh token atomically (after the authorization code was consumed).
create or replace function public.create_ai_consensus_oauth_grant(
  p_grant_id uuid, p_token_digest text, p_subject uuid, p_client_id text, p_scopes text[],
  p_origin_code_digest text, p_token_expires_at timestamptz, p_grant_expires_at timestamptz
) returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_token_expires_at > p_grant_expires_at then
    raise exception 'refresh token cannot outlive its grant';
  end if;
  insert into public.ai_consensus_oauth_grants
    (grant_id, subject, client_id, scopes, origin_code_digest, expires_at)
  values
    (p_grant_id, p_subject, p_client_id, p_scopes, p_origin_code_digest, p_grant_expires_at);
  insert into public.ai_consensus_oauth_refresh_tokens (token_digest, grant_id, expires_at)
  values (p_token_digest, p_grant_id, p_token_expires_at);
  return true;
end;
$$;

-- 2) Rotate: consume the presented token and issue its successor in ONE transaction.
--    The row lock serializes concurrent presentations of the same token; the loser observes
--    rotated_at and is classified as reuse. Reuse revokes the whole grant and COMMITS (no raise).
create or replace function public.rotate_ai_consensus_refresh_token(
  p_old_digest text, p_new_digest text, p_client_id text, p_new_expires_at timestamptz
) returns table (
  status text, grant_id uuid, subject uuid, client_id text, scopes text[], token_expires_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  t public.ai_consensus_oauth_refresh_tokens%rowtype;
  g public.ai_consensus_oauth_grants%rowtype;
  v_expires timestamptz;
begin
  select * into t from public.ai_consensus_oauth_refresh_tokens
   where token_digest = p_old_digest for update;
  if not found then
    return query select 'invalid'::text, null::uuid, null::uuid, null::text, null::text[], null::timestamptz;
    return;
  end if;
  select * into g from public.ai_consensus_oauth_grants where grant_id = t.grant_id for update;
  -- A different client presenting the token is not the legitimate holder; no side effects.
  if g.client_id <> p_client_id then
    return query select 'invalid'::text, null::uuid, null::uuid, null::text, null::text[], null::timestamptz;
    return;
  end if;
  if g.revoked_at is not null or g.expires_at <= now() or t.expires_at <= now() then
    return query select 'invalid'::text, null::uuid, null::uuid, null::text, null::text[], null::timestamptz;
    return;
  end if;
  if t.rotated_at is not null then
    -- Reuse of a consumed token: assume compromise and kill the entire grant.
    update public.ai_consensus_oauth_grants
       set revoked_at = now(), revoke_reason = 'refresh_reuse'
     where grant_id = g.grant_id and revoked_at is null;
    return query select 'reuse_detected'::text, g.grant_id, g.subject, g.client_id, g.scopes, null::timestamptz;
    return;
  end if;
  v_expires := least(p_new_expires_at, g.expires_at);
  insert into public.ai_consensus_oauth_refresh_tokens (token_digest, grant_id, expires_at)
  values (p_new_digest, g.grant_id, v_expires);
  update public.ai_consensus_oauth_refresh_tokens
     set rotated_at = now(), replaced_by = p_new_digest
   where token_digest = p_old_digest;
  return query select 'rotated'::text, g.grant_id, g.subject, g.client_id, g.scopes, v_expires;
end;
$$;

-- 3) Revocation operations. All idempotent; the first reason recorded is preserved.
create or replace function public.revoke_ai_consensus_oauth_grant(
  p_grant_id uuid, p_reason text, p_subject uuid default null, p_client_id text default null
) returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare n integer;
begin
  -- Optional ownership guards make "owner may revoke only their own" and
  -- "client may revoke only its own" enforceable inside the database.
  update public.ai_consensus_oauth_grants
     set revoked_at = now(), revoke_reason = p_reason
   where grant_id = p_grant_id and revoked_at is null
     and (p_subject is null or subject = p_subject)
     and (p_client_id is null or client_id = p_client_id);
  get diagnostics n = row_count;
  return n > 0;
end;
$$;

-- Revoke by refresh-token digest (RFC 7009). Returns the grant id, or null when unknown/foreign.
create or replace function public.revoke_ai_consensus_refresh_token(
  p_digest text, p_client_id text
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare v_grant uuid;
begin
  select t.grant_id into v_grant
    from public.ai_consensus_oauth_refresh_tokens t
    join public.ai_consensus_oauth_grants g on g.grant_id = t.grant_id
   where t.token_digest = p_digest and g.client_id = p_client_id;
  if v_grant is null then return null; end if;
  update public.ai_consensus_oauth_grants
     set revoked_at = now(), revoke_reason = 'client'
   where grant_id = v_grant and revoked_at is null;
  return v_grant;
end;
$$;

-- A replayed authorization code means the code leaked: revoke whatever it produced (OAuth 2.1 §4.1.3).
create or replace function public.revoke_ai_consensus_grant_by_code(p_code_digest text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare n integer;
begin
  update public.ai_consensus_oauth_grants
     set revoked_at = now(), revoke_reason = 'code_reuse'
   where origin_code_digest = p_code_digest and revoked_at is null;
  get diagnostics n = row_count;
  return n > 0;
end;
$$;

-- Access-token check: returns true when the grant is revoked, expired or unknown (fail closed).
create or replace function public.ai_consensus_oauth_grant_is_dead(p_grant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (
    select 1 from public.ai_consensus_oauth_grants g
     where g.grant_id = p_grant_id and g.revoked_at is null and g.expires_at > now()
  );
$$;

-- Owner view: grants for ONE subject, never other people's, never token material.
create or replace function public.list_ai_consensus_oauth_grants(p_subject uuid)
returns table (
  grant_id uuid, client_id text, scopes text[], created_at timestamptz,
  expires_at timestamptz, revoked_at timestamptz, revoke_reason text
)
language sql
stable
security definer
set search_path = ''
as $$
  select g.grant_id, g.client_id, g.scopes, g.created_at, g.expires_at, g.revoked_at, g.revoke_reason
    from public.ai_consensus_oauth_grants g
   where g.subject = p_subject
   order by g.created_at desc
   limit 50;
$$;

-- Housekeeping: removes only dead material. Never un-revokes anything.
create or replace function public.purge_ai_consensus_oauth_expired()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare n integer;
begin
  delete from public.ai_consensus_oauth_grants
   where expires_at < now() - interval '7 days';
  get diagnostics n = row_count;
  return n;
end;
$$;

do $$
declare f text;
begin
  foreach f in array array[
    'create_ai_consensus_oauth_grant(uuid,text,uuid,text,text[],text,timestamptz,timestamptz)',
    'rotate_ai_consensus_refresh_token(text,text,text,timestamptz)',
    'revoke_ai_consensus_oauth_grant(uuid,text,uuid,text)',
    'revoke_ai_consensus_refresh_token(text,text)',
    'revoke_ai_consensus_grant_by_code(text)',
    'ai_consensus_oauth_grant_is_dead(uuid)',
    'list_ai_consensus_oauth_grants(uuid)',
    'purge_ai_consensus_oauth_expired()'
  ] loop
    execute format('revoke all on function public.%s from public, anon, authenticated', f);
    execute format('grant execute on function public.%s to service_role', f);
  end loop;
end $$;
-- SECURITY DEFINER is deliberate: service_role gets NO direct write grant on these tables, so
-- state can only change through these audited transitions. search_path is pinned to ''.
