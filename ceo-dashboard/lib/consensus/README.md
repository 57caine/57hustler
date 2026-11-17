# 3AI consensus core (Issue #242)

`engine.ts` is a provider-neutral, **non-billing** peer-review orchestrator.

## What works
- Explicit cross-provider sharing permission required.
- Independent first round via `Promise.allSettled`.
- Cross-review of other providers' opinions, up to six directed reviews.
- Participating-provider status and disputed claims returned explicitly.
- Partial failures do not masquerade as unanimous reviews.

## What does **not** work yet
- No OpenAI/Google/Anthropic provider adapters or credential wiring.
- No source verification, final adjudication, rate limiting, persistence, or UI.
- No guarantee of routing messages from the proprietary ChatGPT/Gemini/Claude chat apps.
- No live model call and **no paid API consumption** in this change.

## Integration requirements
1. Confirm approved data-sharing boundaries and costs before enabling adapters.
2. Add provider adapters with bounded timeout, token budget, model IDs fetched from current provider catalogs, JSON validation and redaction.
3. Ground every claim in authoritative sources (URLs alone do not establish validity).
4. Build an adjudication stage which makes one answer and marks contested points as unresolved.
5. Add authenticated API, idempotency and anti-abuse controls; then integrate existing JARVIS chat UI.
6. Write tests for full success, one failure, empty adapters, invalid data, refusal to share, review exceptions and cost cap.

Never show '3 AI verified' unless three valid model responses and the expected peer reviews actually completed.
