# Make.com × Instagram 自動投稿 設定手順

GitHub Actions が画像を生成・コミットした後、Make の Webhook 経由で Instagram に投稿するシナリオを構築します。

---

## 事前準備

- Make.com のアカウント（無料プランで動作します）
- Instagram ビジネス / クリエイターアカウント（個人アカウントは Instagram API に非対応）
- Facebook ページ（Instagram をリンクしておく必要があります）

---

## 1. Make.com でアカウント作成

1. [https://www.make.com](https://www.make.com) にアクセスし「Get started free」をクリック
2. メールアドレスまたは Google アカウントで登録
3. ダッシュボードが表示されたら準備完了

---

## 2. 新規シナリオ作成

1. ダッシュボード左メニューの **Scenarios** をクリック
2. 右上の **Create a new scenario** をクリック
3. 最初のモジュール選択画面で、一旦 × で閉じる（次のステップで Webhook を追加します）

---

## 3. Webhook モジュールの設定

### 3-1. Webhooks モジュールを追加

1. シナリオ画面の「＋」をクリック → 検索欄に **Webhooks** と入力
2. **Webhooks > Custom webhook** を選択
3. 「Add」ボタンをクリックし、Webhook 名を入力（例: `instagram-auto-post`）
4. **Save** → Webhook URL が生成されます（例: `https://hook.eu2.make.com/xxxxxxxxxx`）
5. この URL をコピーして GitHub Secrets に登録します（後述）

### 3-2. データ構造の定義

1. 生成された Webhook モジュールをクリック → **Determine data structure** を選択
2. **Add** ボタン → 以下の JSON をサンプルとして貼り付け

```json
{
  "post_type": "fortune",
  "caption": "今日の運勢テキスト",
  "image_urls": [
    "https://raw.githubusercontent.com/57caine/57hustler/main/instagram/output/fortune-2024-01-01.png"
  ]
}
```

3. **Save** をクリック → フィールドが自動認識されます

---

## 4. Router モジュールの設定（fortune / swipe の振り分け）

1. Webhook モジュールの右の「＋」→ **Flow Control > Router** を選択
2. Router が追加されたら、2本のルートが出ます

### Route 1: fortune（シングル画像）

1. Router の上側ルートの「＋」→ **Instagram for Business > Create a Photo Post** を選択
2. 初回は Instagram アカウントとの接続を求められます：
   - **Add** をクリック → Facebook でログイン → Instagram ビジネスアカウントを選択
3. 各フィールドを設定：

| フィールド | 設定値 |
|-----------|--------|
| Page ID | ドロップダウンから Instagram ページを選択 |
| Photo URL | `{{1.image_urls[].value}}` （配列の1番目） |
| Caption | `{{1.caption}}` |

4. Router の上側ルートをクリック → **Set up a filter** で条件を設定：
   - Label: `fortune`
   - Condition: `{{1.post_type}}` **Equal to** `fortune`

### Route 2: swipe（カルーセル）

1. Router の下側ルートの「＋」→ **Instagram for Business > Create a Carousel Post** を選択
2. 各フィールドを設定：

| フィールド | 設定値 |
|-----------|--------|
| Page ID | ドロップダウンから Instagram ページを選択 |
| Children | `{{1.image_urls}}` （配列をそのままマッピング） |
| Caption | `{{1.caption}}` |

3. Router の下側ルートをクリック → **Set up a filter** で条件を設定：
   - Label: `swipe`
   - Condition: `{{1.post_type}}` **Equal to** `swipe`

---

## 5. GitHub Secrets への Webhook URL 登録

1. GitHub リポジトリ（`57caine/57hustler`）を開く
2. **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
3. 以下を登録：

| Name | Value |
|------|-------|
| `MAKE_WEBHOOK_URL` | Make でコピーした Webhook URL |

---

## 6. シナリオの有効化

1. Make のシナリオ画面に戻る
2. 左下の **ON / OFF** トグルを **ON** にする
3. シナリオが「Active」になれば完了

---

## 7. テスト方法

### 手動テスト（curl）

ターミナルで以下を実行し、Make が受信→Instagram 投稿できるか確認します：

```bash
curl -X POST "https://hook.eu2.make.com/xxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "post_type": "fortune",
    "caption": "テスト投稿です",
    "image_urls": [
      "https://raw.githubusercontent.com/57caine/57hustler/main/instagram/output/fortune-2024-01-01.png"
    ]
  }'
```

### GitHub Actions 手動実行

1. GitHub リポジトリ → **Actions** → **Instagram 自動投稿**
2. **Run workflow** → `post_type` を `fortune` または `swipe` で選択 → **Run workflow**
3. ワークフローログで「Webhook status: 200」が表示されれば成功
4. Make のシナリオ画面 → **History** タブで受信ログを確認

---

## スケジュール

自動実行スケジュール（`.github/workflows/instagram-post.yml` に設定済み）：

| 投稿タイプ | 実行時刻（JST） | 頻度 |
|-----------|---------------|------|
| fortune（運勢カード） | 毎日 7:00 | 毎日 |
| swipe（スワイプ投稿） | 19:00 | 月・水・金 |

---

## トラブルシューティング

| 症状 | 確認箇所 |
|------|---------|
| Webhook が届かない | GitHub Secrets の `MAKE_WEBHOOK_URL` が正しいか確認 |
| Make がエラーになる | Make の History タブでエラー詳細を確認 |
| Instagram 投稿が失敗する | Instagram アカウントがビジネス/クリエイターか確認。Facebook ページとのリンクを確認 |
| 画像が表示されない | コミット後 15 秒待ってから送信しているが、稀に遅延あり。手動テストで画像 URL をブラウザで開いて確認 |
