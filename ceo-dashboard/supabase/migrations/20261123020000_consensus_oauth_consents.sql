-- PREPRODUCTION ONLY. Must be reviewed and applied manually before enabling OAuth.
-- Consent is a durable, owner-bound audit event, not a reusable permission grant.
create table if not exists public.ai_consensus_oauth_consents (
  id uuid primary key default gen_random_uuid(),
  subject uuid not null references auth.users(id) on delete cascade,
  client_id text not null check (length(client_id) between 1 and 256),
  redirect_uri text not null,
  scopes text[] not null check (
    cardinality(scopes) between 1 and 2
    and scopes <@ array['consensus.read','consensus.write']::text[]
    and (cardinality(scopes)=1 or scopes[1] <> scopes[2])
  ),
  code_digest text not null unique references public.ai_consensus_oauth_codes(code_digest),
  approved_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint consent_time_reasonable check (
    approved_at <= created_at + interval '1 minute'
    and approved_at >= created_at - interval '10 minutes'
  )
);
create index if not exists ai_consensus_oauth_consents_owner_idx
  on public.ai_consensus_oauth_consents(subject, approved_at desc);
alter table public.ai_consensus_oauth_consents enable row level security;
-- No user-facing direct access. Authenticated owners must consent through a
-- server-side route that verifies session, CSRF, displayed request and approval.
revoke all on public.ai_consensus_oauth_consents from public, anon, authenticated;
grant select, insert on public.ai_consensus_oauth_consents to service_role;
-- No update or delete grant: historical consent must not be silently rewritten.
-- A separate owner-requested deletion flow requires explicit design and review.
