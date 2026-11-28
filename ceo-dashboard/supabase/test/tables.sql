-- LOCAL / CI TEST HARNESS ONLY. The shared-workspace tables were created outside this repo's
-- migrations; this reconstructs the columns the MCP store adapter reads/writes so MCP tool calls
-- can be exercised end to end. It is NOT the production DDL.
create table if not exists public.ai_consensus_requests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  origin text not null, question text not null, status text not null default 'open',
  idempotency_key text not null, created_at timestamptz not null default now(),
  unique (owner_id, idempotency_key)
);
create table if not exists public.ai_consensus_contributions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.ai_consensus_requests(id) on delete cascade,
  agent text not null, content text not null, provenance text not null default 'user_supplied',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.ai_consensus_requests, public.ai_consensus_contributions to service_role;
