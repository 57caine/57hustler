-- PREPRODUCTION ONLY. Review before applying. Not applied to any production database by this PR.
-- Shared (cross-instance) fixed-window rate limiter for the consensus OAuth/MCP endpoints.
-- Keys are SHA-256 digests computed by the application, so raw IP addresses are never stored.
-- Additive only: creates one new table and one function. No existing table is touched.

create table if not exists public.ai_consensus_rate_limits (
  key_digest text primary key check (length(key_digest) = 64),
  window_start timestamptz not null,
  hits integer not null check (hits >= 0)
);
alter table public.ai_consensus_rate_limits enable row level security;
revoke all on public.ai_consensus_rate_limits from public, anon, authenticated;

-- Returns true when the call is allowed. Atomic: the row lock taken by ON CONFLICT serialises
-- concurrent callers of the same key, so two instances can never both take the last slot.
create or replace function public.consume_ai_consensus_rate_limit(
  p_key_digest text, p_limit integer, p_window_seconds integer
) returns boolean
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  v_hits integer;
begin
  if p_limit < 1 or p_limit > 100000 or p_window_seconds < 1 or p_window_seconds > 3600 then
    raise exception 'invalid rate limit parameters';
  end if;
  insert into public.ai_consensus_rate_limits as r (key_digest, window_start, hits)
  values (p_key_digest, now(), 1)
  on conflict (key_digest) do update
    set window_start = case when r.window_start <= now() - make_interval(secs => p_window_seconds) then now() else r.window_start end,
        hits = case when r.window_start <= now() - make_interval(secs => p_window_seconds) then 1 else r.hits + 1 end
  returning hits into v_hits;
  -- Opportunistic cleanup keeps the table small without a scheduled job.
  if random() < 0.01 then
    delete from public.ai_consensus_rate_limits where window_start < now() - interval '1 hour';
  end if;
  return v_hits <= p_limit;
end;
$$;
revoke all on function public.consume_ai_consensus_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_ai_consensus_rate_limit(text, integer, integer) to service_role;
