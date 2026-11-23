-- PREPRODUCTION ONLY. Review before applying. Not applied to any database by this PR.
-- Persist the one-time code digest and its consent audit row in ONE transaction, so a
-- code can never exist without a matching owner-bound consent record (and vice versa).
create or replace function public.issue_ai_consensus_oauth_code_with_consent(
  p_digest text, p_client_id text, p_redirect_uri text, p_subject uuid,
  p_challenge text, p_scopes text[], p_approved_at timestamptz, p_expires_at timestamptz
) returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.ai_consensus_oauth_codes
    (code_digest, client_id, redirect_uri, subject, challenge, scopes, consented_at, expires_at)
  values
    (p_digest, p_client_id, p_redirect_uri, p_subject, p_challenge, p_scopes, p_approved_at, p_expires_at);
  insert into public.ai_consensus_oauth_consents
    (subject, client_id, redirect_uri, scopes, code_digest, approved_at)
  values
    (p_subject, p_client_id, p_redirect_uri, p_scopes, p_digest, p_approved_at);
  return true;
end;
$$;
revoke all on function public.issue_ai_consensus_oauth_code_with_consent(text,text,text,uuid,text,text[],timestamptz,timestamptz)
  from public, anon, authenticated;
grant execute on function public.issue_ai_consensus_oauth_code_with_consent(text,text,text,uuid,text,text[],timestamptz,timestamptz)
  to service_role;
-- Any constraint violation raises and rolls back both inserts (fail closed).
