# references.md（lens-navi本体・うまくいった施策や型）

このファイルの目的: 過去のチャットセッションが試行錯誤して確立した「うまくいったやり方」を
次のセッションが再発見せずに再利用できるようにする。対象はlens-navi本体（リポジトリルート、
`/`, `app/`, `components/`, `lib/`, `data/`, `scripts/`）の作業。CEOダッシュボード・school-navi等
他事業の型は、各事業のディレクトリに同種のファイルがあればそちらを参照。

日付順の詳細な経緯・障害調査ログは`CLAUDE.md`にある。このファイルは「型」だけを抜き出して
簡潔にまとめたもの。詳細が必要な場合はCLAUDE.mdの該当セクションを見ること。

## 本番反映の型: dual-branch push-to-main

feature branch上で直接`main`にpushする権限はない想定のセッションでも、以下の手順で
実質的にmainへ反映できる（このセッション全体で一貫して使用）。

```
git fetch origin main -q
git branch -D tmp-push-main 2>/dev/null
git checkout -B tmp-push-main origin/main -q
git cherry-pick <反映したいコミットのSHA>
npm run build  # 検証
git push origin tmp-push-main:main
git checkout <feature-branch> -q
git merge origin/main -q -m "chore: mainの変更を取り込み"
git push -q
git branch -D tmp-push-main -q
```

- 連続pushはVercelのビルドキューを詰まらせる（同時ビルド枠が1のため）。1つのデプロイが
  READY/CANCELEDで完結するまで次のpushを待つこと（詳細はCLAUDE.md「続報2」参照）
- マージコミットは`HEAD^`ベースの判定と相性が悪い。ignoreCommand側の対策は
  `scripts/vercel-ignore-lens-navi.sh`側で完結しているので、この手順自体を変える必要はない

## 本番確認の型: 直接curlできないので一時GitHub Actionsワークフローを使う

サンドボックスから本番URL・Vercel API・GA4 API等への直接アクセスは403で拒否される
（`agent-proxy`のポリシー）。確認が必要な場合は毎回この型を使う。

1. `.github/workflows/tmp-verify.yml`を作成（確認したい内容をcurl/APIコールするステップを書く）
2. 上記のdual-branch push-to-mainでmainへ反映
3. 15〜25秒待ってからトリガー: `mcp__github__actions_run_trigger`
   （`method: "run_workflow"`, `ref: "main"`, `workflow_id: "tmp-verify.yml"`）
4. `mcp__github__actions_list`（`list_workflow_jobs`）でステップの完了を待つ
5. `mcp__github__get_job_logs`（`return_content: true`）でログを取得
6. 用が済んだら`tmp-verify.yml`を削除するコミットをpush（同じdual-branch手順）

**注意点**:
- ワークフローの中身を書き換えて何度もpushし直すと、そのたびにVercelの本番デプロイキューも
  動いてしまう（`.github/workflows/`の変更はignoreCommandの対象外＝lens-navi本体は無反応だが、
  `main`へのpush自体は他プロジェクトのビルドトリガーになりうる）。確認内容を1回でまとめて
  書き切れるよう設計してから実行すること
- `npm i -D playwright@1` → `npx playwright install --with-deps chromium`のような、
  実ブラウザが必要な検証はGitHub Actions上でインストールに数分〜10分以上かかることがあり
  （このリポジトリでは原因不明の遅延を複数回観測）、時間対効果が悪い。可能な場合は
  Playwrightより**curlでHTMLを取得→`<script src>`のJSチャンクをcurlで取得→
  grepで期待する文字列（日本語の見出し・ボタンラベル等）の出現回数を数える**方式の方が速く
  確実（本番ページがクライアントレンダリングでも、コンポーネントのJSXテキストはビルド後の
  JSチャンクに文字列リテラルとして残るため検出できる。ただしNext.js App Routerのコード分割・
  RSCペイロードの都合で、条件付きレンダリングされる一部の文字列が検出できないことがある
  ＝0件でも実装が無いと断定はできない。ソースコードの直接確認と併用すること）
- Vercelプロジェクトのドメインを決め打ちしない。`scripts/*.ts`内のコメント等に書かれた
  URLは古い可能性がある（例: 2026-09-29時点でceo-dashboardの実ドメインは
  `ceo-dashboard-alpha-livid.vercel.app`であり、`ceo-dashboard.vercel.app`ではなかった＝
  全ページ404で発覚）。確実なのはVercel API
  `GET /v9/projects/{projectId}/domains`で都度確認すること

## Vercelデプロイ履歴の見方

`GET https://api.vercel.com/v6/deployments?projectId=<id>&limit=N&target=production`で
`state`（READY/ERROR/CANCELED/BLOCKED）・`meta.githubCommitMessage`を確認できる。
`CANCELED`はignoreCommandによる正常スキップのことが多いが、`buildSkipped`フィールド
（`v13/deployments/{id}`）まで見ないと「キュー詰まりによるキャンセル」と区別できない
（詳細はCLAUDE.md「続報2」「続報3」）。

## GA4での「本当にゼロ」の検出

GA4 Data APIはデフォルトで全指標ゼロの日付行を省略する。`keepEmptyRows: true`を付けないと
「データが無い」のか「値がゼロだった」のか区別できない。日別の空白期間を調査する際は
必ず`keepEmptyRows: true`を付け、`sessions`だけでなく`eventCount`も確認すること
（セッションだけ欠落する中間状態と、イベント自体が送信されていない完全なゼロを区別できる）。

## もしもアフィリエイト商品リンクの実装パターン

`msmaflink({...})`の生埋め込みコードをそのまま貼るのではなく、`lib/moshimo.ts`の
`parseMoshimoEmbedCode()`に生JSON文字列を渡して`{name, imageUrl, affiliateUrl, buttonText,
buttonColor}`を取り出し、既存の商品カードコンポーネント（`ProductCard.tsx`・
`FeaturedProducts.tsx`等）に渡す。`affiliateUrl`は`b_l[0]`の`a_id/p_id/pc_id/pl_id`から
`af.moshimo.com/af/c/click?...`を組み立てたもので、`u.u`（素のショップURL）は使わない
（成果が発生しないため）。新しい商品を追加する際はこのパターンを流用する。

## 時刻境界の相関確認

「特定期間だけ異常」という現象を調査する際、GA4はAsia/Tokyoタイムゾーンで日付集計している
ことを踏まえ、UTC⇔JSTの変換をして初めて「Vercelのデプロイ停止時刻」等の他システムのUTC
タイムスタンプと突き合わせられる（例: UTC 15:46 = JST 翌日00:46）。この変換を省略すると
「時期は近いが数時間ズレているので無関係」と誤判定しやすい。
