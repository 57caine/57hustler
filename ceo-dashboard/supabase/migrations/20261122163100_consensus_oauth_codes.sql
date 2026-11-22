-- PREPRODUCTION ONLY. This migration must be reviewed before applying to any production DB.
-- Authorization codes are persisted as SHA-256 digests; never store the bearer code itself.
create table if not exists public.ai_consensus_oauth_codes (
  code_digest text primary key check (code_digest ~ '^[0-9a-f]{64}$'),
  client_id text not null check (length(client_id) between 1 and 256),
  redirect_uri text not null,
  subject uuid not null references auth.users(id) on delete cascade,
  challenge text not null check (challenge ~ '^[A-Za-z0-9_-]{43}$'),
  scopes text[] not null check (
    cardinality(scopes) between 1 and 2
    and scopes <@ array['consensus.read','consensus.write']::text[]
    and cardinality(scopes) = (select count(distinct s) from unnest(scopes) s)
  ),
  consented_at timestamptz not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint oauth_code_short_lived check (expires_at > consented_at and expires_at <= consented_at + interval '10 minutes')
);
create index if not exists ai_consensus_oauth_codes_expiry_idx
  on public.ai_consensus_oauth_codes(expires_at);

alter table public.ai_consensus_oauth_codes enable row level security;
-- Deliberately no SELECT/INSERT/UPDATE/DELETE policies for end users.
revoke all on public.ai_consensus_oauth_codes from public, anon, authenticated;
grant select, insert, update, delete on public.ai_consensus_oauth_codes to service_role;

-- Atomic single-use consumption: exactly one concurrent exchange can obtain the record.
-- The server must validate client_id, subject, redirect URI and PKCE before issuing a token.
-- A mismatched request burns the code (fail closed), never restores it.
create or replace function public.consume_ai_consensus_oauth_code(p_digest text)
returns table (
  client_id text, redirect_uri text, subject uuid, challenge text,
  scopes text[], consented_at timestamptz, expires_at timestamptz
)
language sql
security invoker
set search_path = ''
as $$
  update public.ai_consensus_oauth_codes c
     set consumed_at = now()
   where c.code_digest = p_digest
     and c.consumed_at is null
     and c.expires_at > now()
  returning c.client_id, c.redirect_uri, c.subject, c.challenge,
            c.scopes, c.consented_at, c.expires_at;
$$;
revoke all on function public.consume_ai_consensus_oauth_code(text) from public, anon, authenticated;
grant execute on function public.consume_ai_consensus_oauth_code(text) to service_role;

-- Explicitly verify function grants and RLS before enabling any OAuth endpoint.
-- A scheduled cleanup can remove expired rows later; it must not reset consumed_at.
