# Threads fortune generation failure — 2026-10-28

- Evidence: run 40663292162, job 122731395234 (09:19 UTC / 18:19 JST).
- Three attempts failed the existing abstract-expression validator for star 9; attempt 2 also failed star 1 length validation. No container creation or publish call was reached in that run. Rejected text was not logged, so the exact rejected wording is unknown.
- main cf4eceb records lastPostedDate=2026-10-28 as a pre-publish reservation, not proof of publication. Leave this history untouched. Do not rerun posting or clear the reservation automatically.
- Prompt examples were abstract despite requiring concrete advice; retries repeated the request without failure feedback. Replace examples with concrete actions, list the validator's forbidden expressions, and feed failed star numbers and reasons into the next attempt. This addresses an observed instruction gap; live generation success is not yet verified.
- Preserve validator regexes, three-attempt limit, model, schedule, credentials, claims, publish order and links. No new paid services or live API tests.
- Existing draft PR #102 addresses failure status only; main already throws on exhaustion. This change addresses generation guidance, without duplicating that PR's status change.
- Validation: five offline tests and scoped TypeScript check. Independent review not performed. CI result is recorded in the PR.
- Release requires owner approval of this change. After merge, next scheduled run must be checked for quality outcome and post ID. Today's missed post remains unresolved deliberately; this PR does not recover it.
- Rollback: revert the PR; no data migration.
