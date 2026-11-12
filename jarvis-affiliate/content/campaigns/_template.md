---
# ファイル名が _ で始まるものはLPとして公開されない（テンプレート）
slug: new-campaign-slug
status: draft
title: 【対象者】向け【カテゴリ】N社比較｜【ベネフィット】
description: 120字以内。誰の・どんな悩みを・どう解決する比較ページか。
publishedAt: 2026-01-01
updatedAt: 2026-01-01
category: category-id
author: 編集部
target:
  persona: 具体的な1人（年代・職業・状況）
  situation: その人がいま困っている場面
pains:
  - 悩み1（読者の言葉で）
  - 悩み2
  - 悩み3
benefits:
  - 得られること1
  - 得られること2
  - 得られること3
hero:
  eyebrow: 2026年版 ○○向け
  headline: 誰の・どんな悩みが・どうなるか（1文）
  subheadline: 比較の軸と、最初の一歩
  primaryProgramId: affiliates.json の id
  ctaLabel: 行動＋得られるもの（案件名を含める）
  microcopy: 不安を消す一言（事実として言える範囲で）
appeals:
  - { axis: 価格, message: 訴求メッセージ }
comparison:
  caption: 比較表の説明（出典を書く）
  programIds: [program-a, program-b]
  columns:
    - { key: monthlyPrice, label: 月額, type: number, unit: 円 }
    - { key: freeTrial, label: 無料体験, type: boolean }
ranking:
  - programId: program-a
    catchcopy: 一言で言うと誰向けか
    reason: 選んだ理由（事実ベース）
    recommendedFor: [こんな人1, こんな人2]
faq:
  - q: 申込前によくある不安
    a: 事実に基づく回答
socialAngles:
  - SNSでの切り口
compliance:
  regulatedCategory: none   # none / cosmetics / health_food / medical / finance
  sources:
    - { label: 出典名, url: "https://..." }
seo:
  keywords: [メインKW, サブKW]
---

## 本文（選び方・使い方・よくある失敗）
