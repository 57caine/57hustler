# 57hustler AI development handoff

## Mission
Increase qualified search and social traffic and measurable affiliate conversions without new subscriptions, misleading claims, broken links, or repeated owner operations.

## Roles
- ChatGPT: evidence gathering, prioritization, task briefs and owner decisions.
- Codex: scoped code changes, tests and PRs when available.
- Claude Code: independent review of risky changes and alternative hypotheses when available.
- GitHub Actions: deterministic checks and existing approved posting workflows.
These roles are a TARGET PROCESS, not proof of an active Codex-Claude integration.

## Single-task contract
Every task should include: problem and dated baseline, target metric, allowed files, forbidden side effects, tests, rollback, decision needed, and proof links. Do not declare metrics or deployments verified from merged code alone.

## Approval gates
AI may investigate, write drafts, create branches, tests, issues and PRs. Preserve existing posting schedules, credentials, tracking and affiliate links. Do not enable new paid services, alter payout settings, change account access, publish a new campaign, or deploy major behavior changes without explicit approval. Follow any stricter project-specific approval instructions. For small reversible Rakutabi display/copy/internal-navigation/accessibility changes, the owner granted continuing implementation/release approval on 2026-10-29; the narrow scope and checks are recorded in `docs/rakutabi-growth-loop.md`. This does not authorize new campaigns, tracking scope, paid services or major behavior changes.

## Growth priorities
1. Rakutabi (owner direction 2026-10-29): improve mobile usability and qualified outbound traffic. Follow `docs/rakutabi-growth-loop.md` for evidence, bounded continuing approval, settled periods and post-release observation. Preserve noindex and affiliate destinations.
2. Lens: maintain existing operations; GSC query/page impressions and CTR; GA4 landing-page and outbound clicks; A8 vs Rakuten attribution separated.
3. Other projects: do not increase volume until traffic source and purchase funnel can be measured.
Never treat 12 Rakuten clicks and zero sales as statistically decisive.

## Independent review protocol
Implementer opens PR with tests and evidence. Reviewer critiques assumptions, link safety, measurement and regression risks. Implementer addresses comments. GitHub checks must pass. If no second agent is connected, record 'review not performed'; do not fabricate sign-off.

## Daily / weekly loop
Daily deterministic diagnostics produce an artifact; weekly analysis compares settled periods, ranks one hypothesis by expected value and reversibility, then opens a scoped task. PR merge is not evidence of improved traffic; observe actual results before repeating.

## Cost safety
Use existing account entitlements and free deterministic workflows. Codex GitHub Actions API-key use and Claude API-key use can incur extra charges; do not enable either automatically. Avoid new Copilot subscriptions.
