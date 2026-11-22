-- PREPRODUCTION ONLY: review before applying. Retain revoked jti until token expiry.
create table if not exists public.ai_consensus_oauth_revocations (
  jti text primary key check (jti ~ '^[0-9a-f]{32}$'),
  subject uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null,
  revoked_at timestamptz not null default now(),
  constraint revocation_expiry_after_revoke check (expires_at > revoked_at)
);
create index if not exists ai_consensus_oauth_revocations_expiry_idx
  on public.ai_consensus_oauth_revocations(expires_at);
alter table public.ai_consensus_oauth_revocations enable row level security;
revoke all on public.ai_consensus_oauth_revocations from public, anon, authenticated;
grant select, insert, delete on public.ai_consensus_oauth_revocations to service_role;
-- Revocation queries must fail closed if the database cannot be reached.
-- Do not delete unexpired revocations. Cleanup only when expires_at < now().
