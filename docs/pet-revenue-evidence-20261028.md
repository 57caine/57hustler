# Pet disaster revenue investigation — 2026-10-28 JST

## Evidence and limits
Owner reports a pet-goods purchase in Rakuten and suspects this site. Earlier conversation described 13 clicks, 1 sale, order value JPY 4,599 and reward JPY 183 in a seven-day screenshot. The screenshot itself and order-level item/date/approval status were not available in this investigation. Treat these as reported values, not independently verified data. Site attribution and confirmed reward remain unknown. Do not attribute this purchase to a particular animal/category or funnel.

## Public checks performed
- https://pet-bousai-pi.vercel.app/ : HTTP 200, robots noindex/nofollow.
- /dog/carrier: HTTP 200, no data-item-id or data-compare-link attributes.
- /dog/evacuation-carrier, /dog/water-food, /dog/toilet: HTTP 404.
- main 20a697f contains the new dog comparison routes and item_id / card-table position tracking. This source is not proof those features are public.
- scripts/fetch-ga4-analytics.ts PROPERTIES contains lens and school only. No pet traffic/outbound figures were retrieved; unavailable is not zero.
- Existing pet-bousai-preview.yml requires main + confirm_public_deploy=true; builds with current Rakuten data and runs HTTP/mobile checks. No deployment or affiliate clicks were triggered here.

## Next single improvement
Prioritize review and verification of the existing unpublished dog comparison + item tracking MVP before building another feature. Reuse the dedicated pet CI, verify current product data and official-source claims, then obtain approval for a concrete public release. Preserve affiliate IDs/URLs, noindex, prices policy, credentials and posting schedules. Do not claim the new pages explain the reported sale; they are currently unavailable publicly.

Owner input useful for choosing a category: purchased item name (order date and reward approval status if visible), with buyer details hidden. No new account or paid service needed. After that, match it to published outbound item/category evidence where available; cross-product Rakuten purchases mean item type alone cannot prove source site.

No source implementation or production release in this investigation because the sold item, site attribution and traffic evidence remain unknown. No independent review performed. Next work should first reconcile this note with any intervening release/PR to avoid duplicate implementation.
