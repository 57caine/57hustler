# MITAMA 継続原稿 2026-11-08〜14（継続設定実装・CI待ち）

11/3作成。既存の毎日1本・mitama.wisdom・日本文化の問いかけを維持。継続設定を実装。docs/draftsは確認用で、公開原稿は既存data/mitama-threads-posts.jsonへ追加。未マージ・CI待ち・実投稿未確認。URL・広告・画像・新規サービスなし。

## 次回の実装範囲

- 既存原稿1〜24をそのまま残し、25〜31をdata/mitama-threads-posts.jsonへ追加。
- 既存cronの時刻15 0,3,6,9は維持し、日付範囲を11/14まで延長。既存1〜7の日付対応を変更せず、8〜14はday=日+17。年ガード・終了ガードを維持。
- CLIのMITAMA上限のみ24→31。楽旅/レンズ上限14、アカウント照合、履歴全件検査、重複防止、失敗時停止を維持。
- 原稿文字数・全稿重複・日付境界・既存分の不変・誤アカウント・重複時POSTなしをテスト。CI合格後に既存継続承認の範囲で適用。手動投稿/再実行なし。
- 11/5準備期限、11/7既存最終。次の準備期限11/12、11/14継続終了。期限ガードを無期限化しない。
- 戻す場合は継続変更のrevert。ただし実投稿済み原稿は消して再送せず、Threadsの履歴で重複防止。

## 原稿（英語が公開候補、日本語は確認用）

### 2026-11-08 / day 25

In Japan, "mottainai" can be a reminder to notice what we already have.

Before replacing something today, try asking: could I repair it, share it, or use it differently?

What is one everyday object you have kept for years?

日本語：日本の「もったいない」は、今あるものに目を向けるきっかけにもなります。買い替える前に、直す・分ける・別の使い方をする余地を考えてみる。長く使っている日用品は何ですか？

### 2026-11-09 / day 26

The Japanese word "komorebi" describes sunlight filtering through leaves.

On a busy day, noticing that light can be a small pause. No special destination required.

Where did you notice a little beauty on your usual route?

日本語：「木漏れ日」は葉の間から差す光。忙しい日にも、その光に気づくことが小さな休みになります。いつもの道で、どんな小さな美しさに気づきましたか？

### 2026-11-10 / day 27

"Otsukaresama" recognizes effort in Japanese.

Sometimes the work that matters most is the work nobody sees: preparing, cleaning up, or quietly helping someone.

Whose unseen effort would you like to thank today?

日本語：「お疲れさま」は相手の労をねぎらう言葉。準備や片づけ、そっと誰かを助けることなど、見えにくい働きもあります。今日は誰の見えない努力に感謝を伝えたいですか？

### 2026-11-11 / day 28

In Japanese, "ma" can refer to a space or pause.

Here is a small experiment: leave a moment after someone finishes speaking before you reply.

Does that pause feel welcoming or awkward in your culture?

日本語：「間」は空間やひと呼吸を表すことがあります。相手が話し終えてから、少し待って返事をしてみる。その間は、あなたの文化では心地よいものですか、それとも気まずいものですか？

### 2026-11-12 / day 29

"Itadakimasu" is a Japanese expression said before a meal.

Even on a rushed day, a brief pause can help us notice the food and the people behind it.

What helps you slow down before you eat?

日本語：「いただきます」は食事の前の言葉。慌ただしい日でも、ひと呼吸おくと食べ物や関わった人に目を向けられます。食べ始める前に落ち着くため、何をしていますか？

### 2026-11-13 / day 30

In Japan, "osusowake" is sharing a little of something with others.

A few pieces of fruit or a small portion of homemade food can carry a simple message: I thought of you.

What small thing do people like to share where you live?

日本語：「おすそ分け」は何かを少し分けること。果物や手料理の一部には、あなたを思い浮かべた、という気持ちも込められます。住んでいる地域では、どんなものを分け合いますか？

### 2026-11-14 / day 31

"Tadaima" and "okaeri" are familiar Japanese words for coming home and welcoming someone back.

A greeting can be a small daily ritual of connection.

What makes you feel welcome when you return home?

日本語：「ただいま」と「おかえり」は帰宅と出迎えの言葉。あいさつは日々のつながりを感じる小さな習慣にもなります。帰宅したとき、どんなことで迎えられていると感じますか？


## 実装時の確認

オーナーの「未完了は全てGO」を受けて継続実装を開始。新規媒体・頻度増・課金なし。既存24本が不変であることを比較確認。日付判定は明示的なJSTとし、11/14終了・翌年停止を維持。ローカル21テスト合格、実API送信なし。CI合格後のmain反映は設定反映であり、11/8以降の実投稿成功はActions投稿IDで別途確認する。
