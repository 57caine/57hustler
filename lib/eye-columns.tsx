import Link from 'next/link';

export type EyeColumnMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  section: 'megane' | 'vr' | 'lasik' | 'eye-care' | 'eye-goods';
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  headings?: string[];
  faqs?: { q: string; a: string }[];
};

const AMZN = (kw: string) => `https://www.amazon.co.jp/s?k=${encodeURIComponent(kw)}&tag=hustle-digger-22`;
const RAKUTEN = (kw: string) => `https://hb.afl.rakuten.co.jp/ichiba/5567171b.a80702dc.5567171c.a1d1b6fc/?pc=${encodeURIComponent('https://search.rakuten.co.jp/search/mall/' + kw + '/')}`;

export const eyeColumns: EyeColumnMeta[] = [
  {
    slug: 'megane-kaomikata',
    title: '眼鏡の選び方【顔型別ガイド2026】丸顔・面長・卵型・ベース型別おすすめフレーム',
    description: '顔の形に合った眼鏡フレームの選び方を徹底解説。丸顔・面長・卵型・ベース型それぞれに似合うデザインと、オンラインで失敗しない試着方法。',
    category: '眼鏡・サングラス',
    section: 'megane',
    publishedAt: '2026-07-13',
    updatedAt: '2026-07-14',
    readingTime: 8,
    headings: ['顔型の調べ方', '顔型別おすすめフレーム', 'レンズの種類と選び方', 'フレーム素材の比較', 'オンライン購入のポイント'],
    faqs: [
      { q: '顔型に合わない眼鏡を選ぶとどうなりますか？', a: '顔全体のバランスが崩れて見えたり、顔の特徴（丸み・長さ・輪郭）が強調されすぎることがあります。例えば丸顔に丸いフレームを選ぶと顔の丸さがさらに目立ちます。正しいフレームを選ぶことで顔の輪郭を補正する効果があります。' },
      { q: 'PDはどこで測ってもらえますか？', a: '眼科・眼鏡店（JINS・Zoff・眼鏡市場など）で無料測定できます。処方箋発行時に眼科でも確認できます。成人の平均PDは60〜68mmです。左右が異なる場合は「右PD」「左PD」として別々に記録します。' },
      { q: '子どもの眼鏡はどう選べばよいですか？', a: '子ども用は耐久性・安全性を最優先に。TR-90やチタン製のフレームは軽くて丈夫でおすすめです。鼻パッドが調節できるタイプが日本人の子どもの顔型に合いやすいです。年1〜2回の度数チェックも忘れずに。' },
      { q: 'フレームのサイズはどう確認しますか？', a: 'フレームには「レンズ幅 - ブリッジ幅 - テンプル長」が表示されています（例：52□18-140）。レンズ幅と自分の顔幅の比較が最重要です。顔幅（耳〜耳の距離）と（レンズ幅×2 + ブリッジ幅）が近いサイズが基本です。' },
    ],
  },
  {
    slug: 'blue-light-megane-kouka',
    title: 'ブルーライトカット眼鏡の効果は本当にある？科学的根拠と正しい選び方',
    description: 'ブルーライトカット眼鏡の効果について科学的根拠を解説。度なし・度ありの違い、PCメガネの選び方、おすすめ商品まで。',
    category: '眼鏡・サングラス',
    section: 'megane',
    publishedAt: '2026-07-13',
    updatedAt: '2026-07-14',
    readingTime: 6,
    headings: ['ブルーライトとは', '科学的根拠の実態', '度なし vs 度あり', '選び方のポイント', 'おすすめ商品'],
    faqs: [
      { q: 'ブルーライトカット眼鏡は目の疲れに効果がありますか？', a: '目の疲れへの効果については科学的根拠が限定的です（2021年アメリカ眼科学会発表）。疲れ目の主因はブルーライトより「長時間同じ距離を見ること」や「瞬きの減少」です。20-20-20ルールの方が有効とされています。' },
      { q: '子供にブルーライトカット眼鏡は必要ですか？', a: '現時点でブルーライトが子どもの目に特別なダメージを与えるという明確なエビデンスはありません。ただし夜間のスマホ・タブレット使用は睡眠への影響があるため、ブルーライトカットよりも「夜9時以降のスクリーン禁止」が有効です。' },
      { q: 'ブルーライトカット率は何%がおすすめですか？', a: 'カット率30〜40%が一般的です。50%以上になるとレンズが黄みがかかり、色の見え方が変わってデザイン作業や映像鑑賞に支障が出ます。夜間のみ使用するならカット率高め、日常使いはクリアタイプが使いやすいです。' },
    ],
  },
  {
    slug: 'megane-online-shopping',
    title: '眼鏡をオンラインで買う方法【Zoff・JINS・Warby Parker】失敗しない選び方',
    description: 'JINSやZoff、楽天眼鏡など主要オンラインショップの比較。度数入力の方法、フィッティング、返品対応まで解説。',
    category: '眼鏡・サングラス',
    section: 'megane',
    publishedAt: '2026-07-13',
    updatedAt: '2026-07-14',
    readingTime: 7,
    headings: ['オンライン購入のメリット・デメリット', '主要ショップ比較', '度数の入力方法', 'バーチャル試着の使い方', '返品・調整サービス'],
    faqs: [
      { q: 'オンラインで購入した眼鏡が合わなかった場合は返品できますか？', a: 'JINS・Zoffのオンラインショップは度なしフレームは返品可能（未使用の場合）ですが、度入りレンズは作成後の返品不可が一般的です。購入前に各ショップの返品ポリシーを確認してください。' },
      { q: 'フレームだけ購入してレンズだけ近くの眼鏡店で入れてもらえますか？', a: '可能なショップもありますが、フレームとレンズのメーカーが異なると対応を断られることもあります。フレーム購入先と同じショップでレンズを入れるか、対応可能かを事前に確認することをおすすめします。' },
      { q: 'オンライン眼鏡の平均価格はいくらですか？', a: 'フレーム＋単焦点レンズで5,500〜15,000円が相場です。JINSやZoffは5,500円均一のレンズが多く、プレミアムコーティング追加で+3,300〜5,500円。楽天・Amazonでは度なしフレーム単体で1,000〜5,000円のものも豊富です。' },
    ],
  },
  {
    slug: 'vr-shiryoku-warui',
    title: '視力が悪い人のVRゴーグル対策【コンタクト・度付きインサート・メガネスペーサー完全ガイド】',
    description: '近視・乱視があってもVRを快適に楽しむ3つの方法を解説。Meta Quest対応の度付きインサートレンズも紹介。',
    category: 'VR・スマートグラス',
    section: 'vr',
    publishedAt: '2026-07-13',
    updatedAt: '2026-07-14',
    readingTime: 7,
    headings: ['視力が悪い人の3つの選択肢', 'コンタクトレンズで使う', '度付きインサートレンズ', 'メガネスペーサーを使う', 'ドライアイ対策'],
    faqs: [
      { q: 'Meta Quest 3は視力が悪くても使えますか？', a: 'Meta Quest 3には付属のメガネスペーサーがあり多くの眼鏡に対応します。また度付きインサートレンズ（prescription lens insert）をゴーグル内側に装着することでコンタクト・眼鏡なしでも使用可能です。' },
      { q: 'コンタクトを付けたままVRゴーグルを使っても目に影響はありませんか？', a: 'ソフトコンタクトレンズであれば基本的に問題ありません。ただしVR使用中は瞬きが通常の1/3程度に減少するためドライアイになりやすいです。防腐剤フリーのコンタクト用目薬を手元に置き、1〜2時間ごとに目を休めることを推奨します。' },
      { q: '度付きインサートレンズの価格はいくらですか？', a: 'Meta Quest 3用は5,000〜15,000円が相場です（球面度数のみ対応は安く、乱視・遠視対応は高め）。Zenni OpticalやFramesToFaceなど海外ブランドが多く、国内でも取り扱いがあります。一度作れば交換不要なため長期的にはコスパが良いです。' },
    ],
  },
  {
    slug: 'smart-glass-2026',
    title: 'スマートグラス・VRゴーグル おすすめ2026【Meta Quest 3・Ray-Ban Meta・Vision Pro比較】',
    description: '2026年最新のVRゴーグル・スマートグラスを徹底比較。視力対応状況、価格、用途別おすすめも解説。',
    category: 'VR・スマートグラス',
    section: 'vr',
    publishedAt: '2026-07-13',
    updatedAt: '2026-07-14',
    readingTime: 8,
    headings: ['VRゴーグル vs スマートグラスの違い', 'Meta Quest 3レビュー', 'Ray-Ban Metaレビュー', 'Apple Vision Proレビュー', '用途別おすすめ'],
    faqs: [
      { q: 'Meta Quest 3とApple Vision Proはどちらがおすすめですか？', a: 'Quest 3（¥74,800〜）はゲーム・映画・フィットネスに幅広く使えるコスパモデル。Vision Pro（¥599,800〜）は業務・クリエイティブ用途で最高品質ですが価格が高く一般消費者向けではまだ限定的です。入門にはQuest 3が最適です。' },
      { q: 'スマートグラスは普通の眼鏡の代わりになりますか？', a: 'Ray-Ban MetaはデザインがRay-Banのサングラス・眼鏡そのもので、度付きレンズへの交換が可能です。ただし現時点ではARディスプレイ機能はなく、カメラ・マイク・スピーカー内蔵の「スマートな眼鏡」です。普通の眼鏡の代替としても使えます。' },
      { q: 'VRゴーグルを子供に使わせても大丈夫ですか？', a: 'Meta Quest 3は対象年齢10歳以上を推奨しています。長時間使用は視力発達に影響する可能性があるため1日30分〜1時間以内が推奨です。Apple Vision ProとRay-Ban Metaは13歳以上を推奨しています。' },
    ],
  },
  {
    slug: 'vr-game-osusume-2026',
    title: 'VRゲーム・アプリおすすめ2026【Meta Quest 3対応・ジャンル別ランキング】',
    description: 'Beat Saber・VRChat・Superhot VRなどMeta Quest 3で遊べるおすすめVRゲームをジャンル別にランキング。初心者向けの選び方も解説。',
    category: 'VR・スマートグラス',
    section: 'vr',
    publishedAt: '2026-07-15',
    updatedAt: '2026-07-15',
    readingTime: 7,
    headings: ['VRゲームジャンル別おすすめ', 'Meta Quest 3 おすすめアプリ一覧', 'VRゲームを始めるのに必要なもの'],
    faqs: [
      { q: 'VRゲームはPCなしでできますか？', a: 'Meta Quest 3はスタンドアロン型のため、PCなしで単体で動作します。ゲームはMeta Questストアからダウンロードできます。PSVR2はPS5が必要です。PCに接続してPCVRゲームをプレイすることも可能（Air Link機能）です。' },
      { q: 'Beat Saberは無料ですか？', a: 'Beat Saber本体は有料（約¥2,990）です。基本楽曲は収録されていますが、追加楽曲パック（DLC）は別途購入が必要です。Meta Quest版・PSVR版・PC版があります。' },
      { q: 'VRゲームに年齢制限はありますか？', a: 'Meta Quest 3は10歳以上を推奨。個々のゲームによってはPEGI 16・18等のレーティングがあります。ホラー・暴力表現のあるゲームは子どもに適さない場合があります。保護者のMeta Quests親アカウントで子どものプレイ時間管理が可能です。' },
      { q: 'VRゲームで消費カロリーはどのくらいですか？', a: 'Beat Saberの激しいプレイで30分あたり200〜400kcal程度という報告があります（個人差あり）。通常のゲームよりは多いですが、効率的なワークアウトとして使うなら専用フィットネスアプリ（Supernatural・BoxVR等）がおすすめです。' },
      { q: 'Meta Quest 3のバッテリーはどのくらい持ちますか？', a: '連続使用で約2〜3時間（プレイ内容により変動）。充電しながら使用できるUSB-Cケーブルが便利です。専用バッテリーストラップ（Elite Strap Battery等）を使うと約5〜6時間の連続使用が可能になります。' },
    ],
  },
  {
    slug: 'vr-yoi-taisaku',
    title: 'VR酔い対策完全ガイド【原因・防ぐ方法・Meta Quest設定】',
    description: 'VR酔い（シミュレーター酔い）の原因から、テレポート移動・ビネット設定・プレイ時間管理など7つの具体的対策を解説。',
    category: 'VR・スマートグラス',
    section: 'vr',
    publishedAt: '2026-07-15',
    updatedAt: '2026-07-15',
    readingTime: 7,
    headings: ['VR酔いの原因', '酔いやすい/にくいコンテンツ', 'VR酔いを防ぐ7つの対策', 'VR酔いした後の対処法'],
    faqs: [
      { q: 'VR酔いはなぜ起こりますか？', a: '目から入る「動いている」という視覚情報と、体が感じる「静止している」という前庭感覚（三半規管）のズレが原因です。脳がこの矛盾した情報に混乱し、乗り物酔いと同じような症状を引き起こします。' },
      { q: 'VR酔いは慣れますか？', a: 'ほとんどの人は2〜4週間の定期的な使用で慣れてきます。最初は15〜20分から始め、毎日少しずつプレイ時間を延ばすことで脳が適応します。ただし個人差があり、一定の割合でVR酔いが続く方もいます。' },
      { q: 'Beat Saberは酔いにくいですか？', a: 'Beat Saberは基本的に定位置でプレイするため、VR酔いが起きにくいゲームの代表例です。自分は動かずブロックだけが来る設計なので、感覚のズレが生じにくいです。VRゲームの入門として最もおすすめです。' },
      { q: 'Meta Questのコンフォートモードとは何ですか？', a: 'Meta Questの設定にある「快適さの設定（Comfort Settings）」の機能で、移動時に視野の端を暗くすること（ビネット）や、移動速度の制限などを設定できます。VR酔いを軽減する効果があります。初めてVRをプレイする方はオンにすることを推奨します。' },
    ],
  },
  {
    slug: 'vr-business-metaverse-2026',
    title: 'VRビジネス活用・メタバース最新動向2026【XR会議・トレーニング・産業活用】',
    description: 'VR会議・バーチャルトレーニング・建築確認など企業のXR活用事例と2026年のメタバース業界トレンドを解説。',
    category: 'VR・スマートグラス',
    section: 'vr',
    publishedAt: '2026-07-15',
    updatedAt: '2026-07-15',
    readingTime: 8,
    headings: ['ビジネスVRの主要活用シーン', '2026年メタバース・XR業界トレンド', 'ビジネス用途別おすすめデバイス'],
    faqs: [
      { q: 'Meta Horizon WorkroomsはMeta Quest 3で使えますか？', a: 'はい、Meta Quest 2以降のデバイスで使用できます。Quest 3では更に高解像度のデスクトップPCとの連携（Remote Desktop）や、現実の机・キーボードをVR内に表示するPassthrough機能が利用できます。無料で使用できます。' },
      { q: 'Apple Vision Proは法人向けですか？', a: 'Apple Vision Proは個人向けにも販売されていますが、価格（¥599,800〜）と機能特性から法人・プロフェッショナル用途での活用が進んでいます。空間コンピューティングとして3DモデルのレビューやCAD確認、マルチウィンドウ作業に特に強みがあります。' },
      { q: 'XRとVRの違いは何ですか？', a: 'XR（Extended Reality / クロスリアリティ）はVR（仮想現実）・AR（拡張現実）・MR（複合現実）を包括する総称です。VRは現実を完全に遮断、ARは現実に情報を重ねる、MRは現実と仮想を融合する技術です。Meta Quest 3のPassthrough機能はMRに相当します。' },
    ],
  },
  {
    slug: 'lasik-hiyo-risk',
    title: 'レーシックとは？費用・リスク・メリット・デメリット完全解説【2026年版】',
    description: '費用相場・リスク・術後のケア・クリニック選びまで、レーシックに関するすべての疑問に答える完全ガイド。',
    category: 'レーシック・視力矯正',
    section: 'lasik',
    publishedAt: '2026-07-13',
    updatedAt: '2026-07-14',
    readingTime: 10,
    headings: ['レーシックの仕組み', '費用相場', 'メリット・デメリット', 'リスクと副作用', 'クリニック選びのポイント'],
    faqs: [
      { q: 'レーシックは何歳から受けられますか？', a: '原則として18歳以上、かつ過去1〜2年間で度数が安定していることが条件です。多くのクリニックは20歳以上を推奨しています。上限年齢の制限は明確ではありませんが、40代以降は老眼の問題もあるため、ICLや多焦点レンズへの対応も合わせて相談することを推奨します。' },
      { q: 'レーシック手術後の視力はどのくらい持続しますか？', a: '多くの方で術後10年以上視力が安定しています。ただし加齢による老眼は避けられないため、40歳代以降は遠くは見えても近くが見づらくなることがあります。一部の方は近視が戻る（後戻り）こともあり、その場合は追加矯正（Enhancement）で対応できることが多いです。' },
      { q: 'レーシック手術中は痛みがありますか？', a: '手術中は点眼麻酔を使用するため痛みはほとんどありません。術後数時間は異物感・かすみ目・光がにじむことがありますが翌日には大幅に改善します。術後1〜3日は目をこすらないよう注意が必要です。' },
      { q: 'ドライアイがあってもレーシックを受けられますか？', a: '術前検査でドライアイと診断された場合は、術後のドライアイ悪化リスクが高いためレーシック不適応と判断されることがあります。その場合はSMILE（フラップを作らない術式でドライアイリスクが低い）やICLが代替案として検討されます。' },
    ],
  },
  {
    slug: 'icl-to-ha',
    title: 'ICL（眼内コンタクト）とは？レーシックとの違い・費用・向いている人を解説',
    description: '強度近視・角膜が薄い方に向いているICL手術の仕組み・費用・リスクをレーシックと比較。手術を検討中の方必読。',
    category: 'レーシック・視力矯正',
    section: 'lasik',
    publishedAt: '2026-07-13',
    updatedAt: '2026-07-14',
    readingTime: 8,
    headings: ['ICLとは', 'レーシックとの違い', 'ICLの費用', '向いている人・向いていない人', '術後の生活'],
    faqs: [
      { q: 'ICLのレンズは一生使えますか？', a: '基本的には一生使えます。ただし将来的に白内障になった場合はICLを取り外してから白内障手術を行います（その後は眼内レンズが入るため視力矯正は継続されます）。ICLレンズ自体の耐用年数は20〜30年以上とされています。' },
      { q: 'ICL手術後の生活制限はありますか？', a: '術後1週間は洗顔・シャワーは目に水が入らないよう注意。プール・温泉・コンタクト装用は1ヶ月禁止。運動も強度によって制限があります。仕事復帰は翌日〜数日後が一般的です。定期検診は術後1日・1週・1ヶ月・3ヶ月・6ヶ月・1年が目安です。' },
      { q: 'ICLの手術は痛いですか？', a: '手術中は点眼麻酔・点滴・内服薬を使用するため痛みはほとんどありません。手術時間は両眼で30〜60分程度です。術後は異物感・ぼやけ・光のにじみを感じることがありますが通常1〜数日で改善します。' },
    ],
  },
  {
    slug: 'contact-megusuri-erabikata',
    title: 'コンタクト用目薬の選び方【ソフト・ハード対応・防腐剤フリー】おすすめランキング',
    description: 'コンタクト装用中に使える目薬の選び方・防腐剤フリーの重要性・症状別おすすめランキング。ドライアイ対策にも。',
    category: 'アイケア・目薬',
    section: 'eye-care',
    publishedAt: '2026-07-13',
    updatedAt: '2026-07-14',
    readingTime: 7,
    headings: ['コンタクト対応目薬の見分け方', '防腐剤フリーが重要な理由', 'ソフト・ハード別おすすめ', 'ドライアイ向け目薬', '目薬の正しい使い方'],
    faqs: [
      { q: 'コンタクトを付けたまま目薬をさしても大丈夫ですか？', a: 'パッケージに「コンタクトレンズ装用中に使えます」と記載されている目薬であれば使用できます。ただし「塩化ベンザルコニウム」を含む目薬はコンタクトに吸収されて角膜に影響するため、装用中は使用不可です。防腐剤フリー（ソフトサンティア等）が最も安心です。' },
      { q: 'ドライアイに最も効果的なコンタクト用目薬は何ですか？', a: '水分補給には「ヒアルロン酸Na」配合のものが効果的です。おすすめはソフトサンティア（防腐剤フリー）、ロートモイストアイ。ドライアイが重度の場合は処方薬のヒアレイン点眼液（0.1%・0.3%）が有効です。眼科で相談してみてください。' },
      { q: '目薬は何本まで同時に使えますか？', a: '複数の目薬を使う場合は5分以上間隔を空けることが重要です。同時にさすと先の目薬が流れてしまいます。また1回にさす量は1〜2滴で十分です。たくさんさしても効果は上がりません（あふれるだけです）。' },
      { q: '防腐剤フリーの目薬はどこが違うのですか？', a: '従来の目薬は開封後の細菌繁殖を防ぐため防腐剤（塩化ベンザルコニウム等）を使用します。防腐剤フリーは使い捨て容器か特殊なバリア容器で除菌しています。コンタクト装用者・アレルギーがある方・長期使用する方には防腐剤フリーが推奨されます。' },
    ],
  },
  {
    slug: 'dryeye-taisaku',
    title: 'ドライアイ・疲れ目の対策【目薬・生活習慣・サプリで症状改善】原因と対処法',
    description: 'ドライアイの原因から目薬・サプリ・生活習慣による対策まで徹底解説。コンタクト装用者向け情報も充実。',
    category: 'アイケア・目薬',
    section: 'eye-care',
    publishedAt: '2026-07-13',
    updatedAt: '2026-07-14',
    readingTime: 8,
    headings: ['ドライアイの原因', '目薬で改善する方法', 'ホットアイマスクの効果', 'ルテインサプリの活用', '生活習慣の改善'],
    faqs: [
      { q: 'ドライアイはコンタクトレンズを外せば治りますか？', a: '一時的には改善することが多いです。ただし慢性化したドライアイはコンタクトを外しても完全には改善しません。根本的な治療には眼科での検査と適切な目薬（ヒアレイン等）の処方が有効です。コンタクトの種類を「低含水率」や「シリコーンハイドロゲル素材」に変えることも有効です。' },
      { q: 'ドライアイのコンタクトレンズはどの素材がおすすめですか？', a: 'シリコーンハイドロゲル素材（例：アキュビューオアシス、デイリーズトータル1）は酸素透過率が高く含水率が安定しているためドライアイに向いています。従来の含水率50〜70%のコンタクトは乾燥すると角膜から涙液を吸収してしまうため、低含水率（40%以下）のものも選択肢です。' },
      { q: '「マイボーム腺機能不全（MGD）」とはどんな状態ですか？', a: 'まぶたの縁にある脂質（油分）を分泌するマイボーム腺が詰まった状態です。涙の油層が不安定になり蒸発性ドライアイを起こします。ホットアイマスクで温めて詰まりをほぐすことが有効で、眼科ではIPL治療やリピフロー治療が行われます。' },
    ],
  },
  {
    slug: 'hot-eye-mask-osusume',
    title: 'ホットアイマスクおすすめランキング2026【Panasonic・使い捨て・繰り返し使用タイプ比較】',
    description: 'Panasonic EH-SW68・花王めぐりズム・アイリスオーヤマなど人気ホットアイマスクを徹底比較。選び方のポイントも解説。',
    category: '目の雑貨・グッズ',
    section: 'eye-goods',
    publishedAt: '2026-07-13',
    updatedAt: '2026-07-14',
    readingTime: 6,
    headings: ['ホットアイマスクの効果', '繰り返し使用タイプの比較', '使い捨てタイプの比較', '選び方のポイント', 'おすすめランキング'],
    faqs: [
      { q: 'ホットアイマスクは毎日使っても大丈夫ですか？', a: '40〜45℃の適切な温度であれば毎日使用できます。ただし目に異常感（痛み・充血・かすみ）がある場合は使用を中止して眼科を受診してください。コンタクトレンズを装用している場合は必ず外してから使用してください。' },
      { q: 'Panasonic EH-SW68は充電式ですか？コードレスで使えますか？', a: 'EH-SW68はUSB充電式でコードレス使用が可能です。1回の充電で連続約10分（1回分）使用できます。充電時間は約80分。スチーム量は約3ml/回で、40℃前後の蒸気が目元を包みます。' },
      { q: 'ホットアイマスクとアイウォーマーの違いは何ですか？', a: '基本的に同じ機能を指します。「ホットアイマスク」は温熱型のアイマスク全般を指し、「アイウォーマー」はメーカーによっては振動機能や空気圧マッサージ機能を追加したものを指すことがあります。機能・価格帯で選びましょう。' },
    ],
  },
  {
    slug: 'eye-goods-pc',
    title: 'PC作業で目を守るグッズおすすめ10選【ブルーライトカット・モニターライト・目薬】',
    description: 'PC・在宅ワークの目疲れを防ぐグッズを厳選。BenQ ScreenBarやブルーライトカット眼鏡のおすすめも紹介。',
    category: '目の雑貨・グッズ',
    section: 'eye-goods',
    publishedAt: '2026-07-13',
    updatedAt: '2026-07-14',
    readingTime: 6,
    headings: ['PC作業で目が疲れる原因', 'モニターライトの効果', 'ブルーライトカット眼鏡', 'モニターフィルター', '目薬・サプリの活用'],
    faqs: [
      { q: 'BenQ ScreenBarはどのモニターにも取り付けられますか？', a: 'ScreenBarはモニター上部のベゼル（枠）に引っかけて固定するクリップ式です。ベゼル厚が1〜30mm程度のモニターに対応しています。超薄型ベゼルやフレームレスモニターは対応外のことがあります。BenQ公式サイトで互換性チェックが可能です。' },
      { q: 'モニターライトの適切な明るさはいくつですか？', a: '一般的なPCデスク作業では500lux程度が目安です。BenQ ScreenBar Plusは最大1000luxに対応し、周囲の明るさに応じて自動調整する「オートディマー」機能があります。モニターと手元の明るさの差が少ないほど目の疲労が軽減されます。' },
      { q: 'PC用目薬は何時間おきにさすのがよいですか？', a: 'コンタクト装用中は2〜3時間おき、裸眼の場合は疲れを感じたときにさすのが基本です。1日の使用回数制限（多くは5〜6回まで）がある目薬もあるため、パッケージの指示に従ってください。防腐剤フリーの目薬は比較的回数制限が緩いものが多いです。' },
    ],
  },
];

const AffiliateBtns = ({ amzn, rakuten }: { amzn: string; rakuten: string }) => (
  <div className="flex gap-2 my-4">
    <a href={AMZN(amzn)} target="_blank" rel="noopener noreferrer nofollow"
      className="flex-1 text-center text-xs font-medium bg-amber-400 hover:bg-amber-300 text-gray-900 px-3 py-2 rounded-lg transition-colors">
      Amazon で探す
    </a>
    <a href={RAKUTEN(rakuten)} target="_blank" rel="noopener noreferrer nofollow"
      className="flex-1 text-center text-xs font-medium bg-red-500 hover:bg-red-400 text-white px-3 py-2 rounded-lg transition-colors">
      楽天で探す
    </a>
  </div>
);

export const eyeColumnContent: Record<string, React.ReactNode> = {
  'megane-kaomikata': (
    <article className="prose prose-sm max-w-none">
      <p className="lead text-gray-600 text-base leading-relaxed mb-6">
        眼鏡選びで最も重要なのは「顔型に合ったフレーム」を選ぶことです。このガイドでは顔型の見つけ方から、それぞれの顔型に似合うフレームを詳しく解説します。
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">顔型の調べ方</h2>
      <p className="text-gray-700 mb-4">
        髪をまとめて顔の輪郭をはっきりさせた状態で鏡を見てください。顔の横幅と縦の長さ、顎のライン、頬骨の張りを確認します。
      </p>
      <div className="bg-gray-50 rounded-xl p-5 mb-6">
        <ul className="space-y-2 text-sm text-gray-700">
          <li><strong>丸顔：</strong>縦横の長さがほぼ同じで、顎が丸い</li>
          <li><strong>卵型：</strong>顔の上部がやや広く、顎に向かって細くなる（最も眼鏡が似合う顔型）</li>
          <li><strong>面長：</strong>縦の長さが横より明らかに長い</li>
          <li><strong>ベース型：</strong>頬骨が張っており、顎がしっかりしている</li>
        </ul>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">顔型別おすすめフレーム</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-indigo-50">
              <th className="text-left p-3 border border-gray-200">顔型</th>
              <th className="text-left p-3 border border-gray-200">おすすめ</th>
              <th className="text-left p-3 border border-gray-200">避けたいスタイル</th>
            </tr>
          </thead>
          <tbody>
            {[
              { face: '丸顔', rec: '角張ったスクエア・ウェリントン', avoid: '丸い・オーバルフレーム' },
              { face: '卵型', rec: 'ほぼ何でも似合う・ウェイファーラーが定番', avoid: '極端に大きすぎるフレーム' },
              { face: '面長', rec: '大きめの丸・オーバル・ウェリントン', avoid: '縦に細いフレーム' },
              { face: 'ベース型', rec: '細め・リムレス・ラウンド', avoid: '角張った幅広フレーム' },
            ].map(r => (
              <tr key={r.face} className="border-b border-gray-100">
                <td className="p-3 border border-gray-200 font-medium">{r.face}</td>
                <td className="p-3 border border-gray-200 text-green-700">{r.rec}</td>
                <td className="p-3 border border-gray-200 text-red-600">{r.avoid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">レンズの種類と選び方</h2>
      <p className="text-gray-700 mb-3">眼鏡レンズはフレームと同様に重要です。主なレンズの種類：</p>
      <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
        <li><strong>単焦点レンズ：</strong>近視・遠視・乱視の矯正に。最もシンプルで費用も安い</li>
        <li><strong>遠近両用（累進レンズ）：</strong>老眼・近視の両方を1枚でカバー</li>
        <li><strong>ブルーライトカットレンズ：</strong>PC・スマホ使用が多い方に。ただし効果は限定的</li>
        <li><strong>調光レンズ（フォトクロミック）：</strong>紫外線に反応してサングラスになる</li>
      </ul>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">フレーム素材の比較</h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { mat: 'プラスチック（アセテート）', feat: '軽量・豊富な色・低価格', price: '¥3,000〜' },
          { mat: 'メタル（チタン等）', feat: '耐久性が高い・軽い・シンプル', price: '¥10,000〜' },
          { mat: 'TR-90', feat: '超軽量・柔軟性・スポーツ向け', price: '¥5,000〜' },
        ].map(m => (
          <div key={m.mat} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-bold text-gray-800 text-sm mb-1">{m.mat}</p>
            <p className="text-xs text-gray-500 mb-2">{m.feat}</p>
            <p className="text-xs font-bold text-indigo-600">{m.price}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">オンライン購入のポイント</h2>
      <p className="text-gray-700 mb-3">
        オンラインで眼鏡を購入する場合は、PD（瞳孔間距離）の測定と、フレームサイズの確認が重要です。JINSやZoffのような主要チェーンはオンラインでも試着サービスを提供しています。
      </p>
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6">
        <p className="font-bold text-indigo-800 text-sm mb-2">PDの調べ方</p>
        <p className="text-sm text-gray-700">
          眼科で処方箋をもらう際にPD値も確認しましょう。眼鏡店では無料で測定してもらえます。スマートフォンのアプリでも大まかに測定できます。
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">おすすめ眼鏡を探す</p>
        <AffiliateBtns amzn="眼鏡フレーム おすすめ" rakuten="眼鏡フレーム" />
      </div>
    </article>
  ),

  'blue-light-megane-kouka': (
    <article className="prose prose-sm max-w-none">
      <p className="lead text-gray-600 text-base leading-relaxed mb-6">
        「ブルーライトカット眼鏡は本当に効果があるの？」という疑問を持つ方は多いです。科学的根拠をもとに、効果と正しい選び方を解説します。
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ブルーライトとは</h2>
      <p className="text-gray-700 mb-4">
        ブルーライトは波長380〜500nmの青色光で、スマートフォンやPCのLEDディスプレイから多く放出されます。太陽光にも含まれており、人体への影響は昼間と夜間で大きく異なります。
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-800"><strong>夜間のブルーライト：</strong>メラトニン（睡眠ホルモン）の分泌を抑制し、睡眠の質を低下させる可能性があります。</p>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">科学的根拠の実態</h2>
      <p className="text-gray-700 mb-4">
        2021年にアメリカ眼科学会（AAO）は「ブルーライトカット眼鏡が眼精疲労を軽減するという科学的根拠はない」と発表しました。目の疲れの主な原因は：
      </p>
      <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
        <li>画面を見ているときの瞬き減少（通常の1/3程度に減少）</li>
        <li>同じ距離を長時間見続けることによる毛様体筋の疲労</li>
        <li>画面の明るさや姿勢の問題</li>
      </ul>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800"><strong>ポイント：</strong>ブルーライトカット眼鏡よりも「20-20-20ルール（20分おきに20フィート先を20秒見る）」の方が疲れ目に効果的とされています。</p>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">度なし vs 度あり</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="font-bold text-gray-800 mb-2">度なしブルーライトカット眼鏡</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>✓ 視力が正常な方に</li>
            <li>✓ 価格が安い（¥1,000〜）</li>
            <li>✓ 夜間のスマホ使用に効果的</li>
            <li>✗ 疲れ目への効果は限定的</li>
          </ul>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="font-bold text-gray-800 mb-2">度ありブルーライトカット眼鏡</p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>✓ 近視・遠視の矯正も同時に</li>
            <li>✓ 長時間PC作業に最適</li>
            <li>✓ 専用の度数設定も可能</li>
            <li>✗ 価格が高い（¥15,000〜）</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">選び方のポイント</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
        <li><strong>カット率：</strong>30〜40%カットが一般的。高すぎると色が黄ばんで見える</li>
        <li><strong>レンズの色：</strong>クリアタイプがデザイン面で使いやすい</li>
        <li><strong>フレームの重さ：</strong>長時間装用するため軽量素材を選ぶ</li>
        <li><strong>価格：</strong>度なしなら安価なもので十分。度ありなら眼鏡店での処方が安心</li>
      </ul>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">ブルーライトカット眼鏡を探す</p>
        <AffiliateBtns amzn="ブルーライトカット 眼鏡 PC" rakuten="ブルーライトカット眼鏡" />
      </div>
    </article>
  ),

  'megane-online-shopping': (
    <article className="prose prose-sm max-w-none">
      <p className="lead text-gray-600 text-base leading-relaxed mb-6">
        眼鏡のオンライン購入は、店頭より安く多くの選択肢から選べるメリットがあります。失敗しないためのポイントを解説します。
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">オンライン購入のメリット・デメリット</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="font-bold text-green-800 mb-2">メリット</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✓ 実店舗より30〜50%安い</li>
            <li>✓ デザインの選択肢が豊富</li>
            <li>✓ 24時間注文可能</li>
            <li>✓ 海外ブランドも購入しやすい</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="font-bold text-red-800 mb-2">デメリット</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✗ フィッティング調整が難しい</li>
            <li>✗ 実際の色味が異なる場合も</li>
            <li>✗ PD測定が必要</li>
            <li>✗ 返品・交換に時間がかかる</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">主要ショップ比較</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-indigo-50">
              <th className="text-left p-3 border border-gray-200">ショップ</th>
              <th className="text-left p-3 border border-gray-200">価格帯</th>
              <th className="text-left p-3 border border-gray-200">特徴</th>
            </tr>
          </thead>
          <tbody>
            {[
              { shop: 'JINS オンライン', price: '¥5,500〜', feat: 'バーチャル試着あり・全国で調整可能' },
              { shop: 'Zoff オンライン', price: '¥5,500〜', feat: '豊富なデザイン・店舗でのアフターケアあり' },
              { shop: '楽天市場 眼鏡', price: '¥1,000〜', feat: '激安フレームが豊富・ポイント還元' },
              { shop: 'Amazon 眼鏡', price: '¥1,000〜', feat: '即日配送・レビューが参考になる' },
            ].map(r => (
              <tr key={r.shop} className="border-b border-gray-100">
                <td className="p-3 border border-gray-200 font-medium">{r.shop}</td>
                <td className="p-3 border border-gray-200 text-indigo-700 font-bold">{r.price}</td>
                <td className="p-3 border border-gray-200 text-gray-600 text-xs">{r.feat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">PDの入力方法</h2>
      <p className="text-gray-700 mb-4">
        PD（瞳孔間距離）はオンライン購入で最も重要な数値です。眼科処方箋に記載されているか、眼鏡店で無料測定できます。通常60〜70mmが成人の平均値です。
      </p>
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-indigo-800">
          <strong>PDを自分で測る方法：</strong>定規を目の前に当て、鏡を見ながら右目の瞳孔の中心から左目の瞳孔の中心までの距離を測ります。誤差±2mm以内が理想的です。
        </p>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">バーチャル試着の使い方</h2>
      <p className="text-gray-700 mb-4">
        JINSやZoffのアプリでは、スマートフォンのカメラを使ったバーチャル試着が可能です。顔の輪郭に合わせてフレームがリアルタイムで表示されるため、大まかなイメージを確認できます。
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">オンラインで眼鏡を探す</p>
        <AffiliateBtns amzn="眼鏡フレーム おしゃれ" rakuten="眼鏡フレーム おしゃれ" />
      </div>
    </article>
  ),

  'vr-shiryoku-warui': (
    <article className="prose prose-sm max-w-none">
      <p className="lead text-gray-600 text-base leading-relaxed mb-6">
        視力が悪くてもVRゴーグルを快適に楽しめます。3つの方法とそれぞれのメリット・デメリットを詳しく解説します。
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">視力が悪い人の3つの選択肢</h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { num: '①', title: 'コンタクトレンズ', merit: '最もシンプル・画質への影響なし', demerit: 'ドライアイになりやすい', cost: 'ランニングコストあり' },
          { num: '②', title: '度付きインサートレンズ', merit: '眼鏡・コンタクト不要', demerit: 'ゴーグル専用なので別途購入', cost: '¥5,000〜15,000（一度だけ）' },
          { num: '③', title: 'メガネスペーサー', merit: '眼鏡をかけたまま使用', demerit: '眼鏡の形状によっては使えない', cost: '無料〜¥2,000' },
        ].map(m => (
          <div key={m.num} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-lg font-bold text-violet-600 mb-1">{m.num}</p>
            <p className="font-bold text-gray-800 text-sm mb-2">{m.title}</p>
            <p className="text-xs text-green-700 mb-1">✓ {m.merit}</p>
            <p className="text-xs text-red-600 mb-2">✗ {m.demerit}</p>
            <p className="text-xs text-gray-500">{m.cost}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">コンタクトレンズで使う（最もおすすめ）</h2>
      <p className="text-gray-700 mb-4">
        ソフトコンタクトレンズを装用したままVRゴーグルを使うのが最も手軽で画質への影響もありません。ただし注意点があります：
      </p>
      <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
        <li>VR使用中は瞬きが減少しドライアイになりやすい → 目薬を準備</li>
        <li>ワンデーコンタクトが衛生面でおすすめ</li>
        <li>1回の使用は1〜2時間程度にとどめる</li>
        <li>ハードコンタクトはズレやすいため非推奨</li>
      </ul>
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6">
        <p className="font-bold text-sky-800 mb-2">VR用コンタクトを探す</p>
        <p className="text-sm text-gray-700 mb-3">ワンデーのソフトコンタクトが最適です。</p>
        <Link href="/category/1day" className="inline-block bg-sky-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-sky-500 transition-colors">
          ワンデーコンタクトを比較する →
        </Link>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">度付きインサートレンズ</h2>
      <p className="text-gray-700 mb-4">
        VRゴーグルの内側に装着する度付きレンズです。Meta Quest 3対応品が多数販売されています。乱視矯正にも対応した製品があります。
      </p>
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">VR度付きインサートレンズを探す</p>
        <AffiliateBtns amzn="VR 度付き インサートレンズ Meta Quest" rakuten="VR インサートレンズ 度付き" />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">メガネスペーサーを使う</h2>
      <p className="text-gray-700 mb-4">
        Meta Quest 3にはメガネスペーサーが付属しています。ゴーグル内部を広げて眼鏡をかけたまま使用できます。ただしフレームが大きすぎる場合は装着できないことがあります。
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ドライアイ対策</h2>
      <p className="text-gray-700 mb-3">
        VR使用中のドライアイ対策として、コンタクト対応の防腐剤フリー目薬を手元に置いておくことをおすすめします。
      </p>
      <AffiliateBtns amzn="コンタクト 目薬 防腐剤フリー" rakuten="コンタクト用 目薬 防腐剤なし" />
    </article>
  ),

  'smart-glass-2026': (
    <article className="prose prose-sm max-w-none">
      <p className="lead text-gray-600 text-base leading-relaxed mb-6">
        2026年のVRゴーグル・スマートグラス市場は急速に進化しています。主要製品の最新スペックと視力対応状況を比較します。
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">VRゴーグル vs スマートグラスの違い</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
          <p className="font-bold text-violet-800 mb-2">VRゴーグル</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>現実を完全に遮断して仮想空間に没入</li>
            <li>ゲーム・映画・トレーニングに最適</li>
            <li>代表：Meta Quest 3、Apple Vision Pro</li>
            <li>価格：¥50,000〜</li>
          </ul>
        </div>
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
          <p className="font-bold text-sky-800 mb-2">スマートグラス</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>現実世界にデジタル情報をオーバーレイ</li>
            <li>カメラ・音楽・通話機能を搭載</li>
            <li>代表：Ray-Ban Meta、XREAL Air 2</li>
            <li>価格：¥20,000〜</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Meta Quest 3</h2>
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">メガネ対応○</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">インサートレンズ対応○</span>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">価格 ¥74,800〜</span>
        </div>
        <p className="text-sm text-gray-700 mb-3">
          2023年発売。カラーパススルーで現実とVRをシームレスに切り替えられるミックスリアリティ対応。
          度付きインサートレンズはZendure等が対応品を販売。眼鏡スペーサーも付属。
        </p>
        <AffiliateBtns amzn="Meta Quest 3" rakuten="Meta Quest 3" />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Ray-Ban Meta Smart Glasses</h2>
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">普通の眼鏡型</span>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">度付きレンズ交換可</span>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">価格 ¥40,000〜</span>
        </div>
        <p className="text-sm text-gray-700 mb-3">
          Ray-BanのサングラスにカメラとスピーカーとAIを内蔵。度付きレンズへの交換が可能なため、視力が悪い方も使いやすい。
          Meta AIとの連携でリアルタイム翻訳・情報取得も可能。
        </p>
        <AffiliateBtns amzn="Ray-Ban Meta Smart Glasses" rakuten="Ray-Ban Meta スマートグラス" />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Apple Vision Pro</h2>
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Zeiss光学インサート対応</span>
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">価格 ¥599,800〜</span>
        </div>
        <p className="text-sm text-gray-700 mb-3">
          Apple純正のZeissオプティカルインサートを購入することで視力矯正が可能（別途¥20,000〜）。
          世界最高品質のディスプレイとAR機能を持つが、価格が高い。
        </p>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">用途別おすすめ</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-violet-50">
              <th className="text-left p-3 border border-gray-200">用途</th>
              <th className="text-left p-3 border border-gray-200">おすすめ</th>
            </tr>
          </thead>
          <tbody>
            {[
              { use: 'VRゲーム・映画鑑賞', rec: 'Meta Quest 3' },
              { use: '日常使い・SNS・音楽', rec: 'Ray-Ban Meta' },
              { use: '仕事・プレゼン・クリエイティブ', rec: 'Apple Vision Pro' },
              { use: '映像視聴（大画面）', rec: 'XREAL Air 2 Pro' },
            ].map(r => (
              <tr key={r.use} className="border-b border-gray-100">
                <td className="p-3 border border-gray-200 text-gray-700">{r.use}</td>
                <td className="p-3 border border-gray-200 font-medium text-violet-700">{r.rec}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  ),

  'lasik-hiyo-risk': (
    <article className="prose prose-sm max-w-none">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
        <p className="text-xs text-amber-700">※ 当記事は医療情報の提供を目的としており、最終的な手術の判断は必ず眼科専門医にご相談ください。</p>
      </div>

      <p className="lead text-gray-600 text-base leading-relaxed mb-6">
        レーシックは近視・乱視・遠視を手術で矯正する方法です。費用・リスク・術後ケアまで徹底解説します。
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">レーシックの仕組み</h2>
      <p className="text-gray-700 mb-4">
        レーシック（LASIK：Laser-Assisted In Situ Keratomileusis）は、角膜にフラップを作成し、エキシマレーザーで角膜の形状を削って視力を矯正する手術です。手術時間は両眼合わせて10〜15分程度です。
      </p>
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {[
          { step: 'STEP 1', title: 'フラップ作成', desc: 'フェムトセカンドレーザーまたはマイクロケラトームで薄い角膜フラップを作成' },
          { step: 'STEP 2', title: 'レーザー照射', desc: 'エキシマレーザーで角膜を削り、屈折を矯正' },
          { step: 'STEP 3', title: 'フラップを戻す', desc: 'フラップを元の位置に戻して自然に接着。縫合不要' },
        ].map(s => (
          <div key={s.step} className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <p className="text-xs font-bold text-emerald-600 mb-1">{s.step}</p>
            <p className="font-bold text-gray-800 text-sm mb-1">{s.title}</p>
            <p className="text-xs text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">費用相場</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-emerald-50">
              <th className="text-left p-3 border border-gray-200">プラン</th>
              <th className="text-left p-3 border border-gray-200">費用（両眼）</th>
              <th className="text-left p-3 border border-gray-200">特徴</th>
            </tr>
          </thead>
          <tbody>
            {[
              { plan: '標準レーシック', cost: '15〜20万円', feat: '最もポピュラー・回復が早い' },
              { plan: 'プレミアムレーシック', cost: '25〜35万円', feat: 'アマリスレッド等の最新機器・精度が高い' },
              { plan: 'スマイル（SMILE）', cost: '20〜30万円', feat: 'フラップを作らない・ドライアイになりにくい' },
              { plan: 'ICL（眼内コンタクト）', cost: '50〜70万円', feat: '角膜を削らない・強度近視に対応・可逆性あり' },
            ].map(r => (
              <tr key={r.plan} className="border-b border-gray-100">
                <td className="p-3 border border-gray-200 font-medium">{r.plan}</td>
                <td className="p-3 border border-gray-200 text-emerald-700 font-bold">{r.cost}</td>
                <td className="p-3 border border-gray-200 text-gray-600 text-xs">{r.feat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">メリット・デメリット</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="font-bold text-green-800 mb-2">メリット</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✓ 眼鏡・コンタクトが不要になる</li>
            <li>✓ 手術翌日から視力が回復</li>
            <li>✓ 効果は基本的に永続</li>
            <li>✓ スポーツ・水泳が快適に</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="font-bold text-red-800 mb-2">デメリット</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✗ ドライアイが悪化することがある</li>
            <li>✗ ハロー・グレア（光のにじみ）</li>
            <li>✗ 角膜が薄い方は手術できない</li>
            <li>✗ 老眼には対応できない</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">リスクと副作用</h2>
      <div className="bg-red-50 border border-red-100 rounded-xl p-5 mb-6">
        <ul className="space-y-2 text-sm text-gray-700">
          <li><strong>ドライアイの悪化：</strong>最も多い副作用。術後3〜6ヶ月で改善することが多い</li>
          <li><strong>ハロー・グレア：</strong>夜間に光がにじんで見える。通常は数ヶ月で軽減</li>
          <li><strong>矯正不足・過矯正：</strong>追加矯正（Enhancement）で対応可能なことが多い</li>
          <li><strong>角膜フラップのトラブル：</strong>SMILEや最新フェムトレーシックで大幅にリスク低減</li>
          <li><strong>感染症：</strong>発生率は0.1%未満。術後のケアで予防可能</li>
        </ul>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">クリニック選びのポイント</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
        <li>術前検査が十分か（角膜形状・厚みを詳しく測定するか）</li>
        <li>アフターケア・保証制度（無料再手術の条件など）</li>
        <li>使用する機器のメーカー・型番を公開しているか</li>
        <li>眼科専門医が手術を担当するか</li>
        <li>複数クリニックでのカウンセリングを比較する</li>
      </ul>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">術後の目薬・アイケアグッズ</p>
        <AffiliateBtns amzn="目薬 防腐剤フリー 術後" rakuten="防腐剤フリー 目薬" />
      </div>
    </article>
  ),

  'icl-to-ha': (
    <article className="prose prose-sm max-w-none">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
        <p className="text-xs text-amber-700">※ 当記事は医療情報の提供を目的としており、最終的な手術の判断は必ず眼科専門医にご相談ください。</p>
      </div>

      <p className="lead text-gray-600 text-base leading-relaxed mb-6">
        ICL（Implantable Collamer Lens）は眼内にレンズを挿入する視力矯正手術です。レーシックが適応外の強度近視や角膜が薄い方の選択肢として注目されています。
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ICLとは</h2>
      <p className="text-gray-700 mb-4">
        ICLはコラーゲンとHEMAで作られた柔らかいレンズを、虹彩と水晶体の間（後房）に挿入する手術です。角膜を削らないため、角膜の形状が保たれます。スイスのSTAAR Surgical社が開発しました。
      </p>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-emerald-800">
          <strong>最大の特徴：</strong>レンズを取り出すことができる「可逆性」があります。将来的に白内障手術が必要になっても対応可能です。
        </p>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">レーシックとの違い</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-emerald-50">
              <th className="text-left p-3 border border-gray-200">比較項目</th>
              <th className="text-left p-3 border border-gray-200">レーシック</th>
              <th className="text-left p-3 border border-gray-200">ICL</th>
            </tr>
          </thead>
          <tbody>
            {[
              { item: '手術方法', lasik: '角膜を削る', icl: 'レンズを挿入' },
              { item: '可逆性', lasik: 'なし（元に戻せない）', icl: 'あり（レンズ取り出し可）' },
              { item: '費用', lasik: '15〜30万円', icl: '50〜70万円' },
              { item: '強度近視', lasik: '〜-8D程度まで', icl: '〜-18D程度まで対応' },
              { item: 'ドライアイ', lasik: '悪化しやすい', icl: '比較的少ない' },
              { item: '術後視力の質', lasik: '良好', icl: '非常に良好（コントラスト感度が高い）' },
            ].map(r => (
              <tr key={r.item} className="border-b border-gray-100">
                <td className="p-3 border border-gray-200 font-medium">{r.item}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{r.lasik}</td>
                <td className="p-3 border border-gray-200 text-emerald-700 font-medium">{r.icl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">向いている人・向いていない人</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="font-bold text-green-800 mb-2">ICLが向いている人</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✓ 強度近視（-6D以上）の方</li>
            <li>✓ 角膜が薄くレーシック不適応の方</li>
            <li>✓ 乾燥した環境で働く方</li>
            <li>✓ 将来の可逆性を重視する方</li>
            <li>✓ 視力の質（コントラスト）を求める方</li>
          </ul>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="font-bold text-red-800 mb-2">ICLが向いていない人</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✗ 前房が浅い方</li>
            <li>✗ 21歳未満</li>
            <li>✗ 白内障・緑内障がある方</li>
            <li>✗ 費用を抑えたい方</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">術後の生活</h2>
      <p className="text-gray-700 mb-4">
        手術翌日から大幅に視力が改善します。術後1週間は目を触らない・プールは1ヶ月禁止などの制限があります。定期検査は術後1日・1週・1ヶ月・3ヶ月・6ヶ月・1年後が目安です。
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">術後のアイケアグッズ</p>
        <AffiliateBtns amzn="ルテイン サプリ 目 健康" rakuten="ルテイン サプリ 目" />
      </div>
    </article>
  ),

  'contact-megusuri-erabikata': (
    <article className="prose prose-sm max-w-none">
      <p className="lead text-gray-600 text-base leading-relaxed mb-6">
        コンタクトレンズ装用中でも使える目薬の選び方を解説します。「防腐剤フリー」が重要な理由と、症状別のおすすめを紹介します。
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">コンタクト対応目薬の見分け方</h2>
      <p className="text-gray-700 mb-4">
        コンタクト装用中に使える目薬かどうかは、パッケージの表示で確認できます。「コンタクトレンズ装用中に使えます」という表示があるものを選びましょう。
      </p>
      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mb-6">
        <p className="font-bold text-cyan-800 mb-2">必ず確認すること</p>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• パッケージの「コンタクトレンズ装用中に使えます」表示</li>
          <li>• 防腐剤（塩化ベンザルコニウム）の有無</li>
          <li>• ソフト・ハード・O2（ハード）対応か</li>
        </ul>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">防腐剤フリーが重要な理由</h2>
      <p className="text-gray-700 mb-4">
        多くの一般的な目薬に含まれる「塩化ベンザルコニウム」はコンタクトレンズに吸収・蓄積し、角膜を傷める可能性があります。コンタクト装用者には防腐剤フリー（無防腐剤）または防腐剤不使用の目薬が推奨されます。
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">症状別おすすめ目薬</h2>
      <div className="space-y-4 mb-6">
        {[
          { symptom: 'ドライアイ・乾燥', recs: ['ソフトサンティア（防腐剤フリー）', 'ロートモイストアイ', 'ヒアレイン点眼液（処方薬）'], key: 'ヒアルロン酸Na配合を選ぶ' },
          { symptom: '疲れ目・眼精疲労', recs: ['ロートビタ40α', 'サンテFXネオ', 'ロートデジアイ'], key: 'ビタミンB12・タウリン配合を選ぶ' },
          { symptom: '充血', recs: ['サンテボーティエ', 'ロートクール40α'], key: '血管収縮剤入りは連用注意' },
        ].map(s => (
          <div key={s.symptom} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-bold text-gray-800 mb-1">{s.symptom}</p>
            <p className="text-xs text-cyan-600 mb-2">選び方：{s.key}</p>
            <ul className="text-sm text-gray-600 space-y-0.5">
              {s.recs.map(r => <li key={r}>• {r}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">コンタクト用目薬を探す</p>
        <AffiliateBtns amzn="コンタクト 目薬 防腐剤フリー ドライアイ" rakuten="コンタクト用 目薬 防腐剤なし" />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">目薬の正しい使い方</h2>
      <ul className="list-decimal pl-5 space-y-2 text-gray-700 mb-4">
        <li>使用前に手を石けんで洗う</li>
        <li>容器の先が目やまつ毛に触れないように1滴さす</li>
        <li>1〜2分間は目頭を軽く押さえて涙点からの流出を防ぐ</li>
        <li>複数の目薬は5分以上間隔をあける</li>
        <li>コンタクトを装用している場合は15分後に装用が目安（防腐剤フリーでも）</li>
      </ul>
    </article>
  ),

  'dryeye-taisaku': (
    <article className="prose prose-sm max-w-none">
      <p className="lead text-gray-600 text-base leading-relaxed mb-6">
        ドライアイは日本で推定800万人以上が悩む症状です。原因から効果的な対処法まで、コンタクト装用者向けの情報を中心に解説します。
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ドライアイの原因</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="font-bold text-gray-800 mb-2">環境・行動的原因</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• PC・スマホの長時間使用（瞬き減少）</li>
            <li>• エアコン・暖房による乾燥</li>
            <li>• コンタクトレンズ（特に含水率が高いソフト）</li>
            <li>• 睡眠不足・ストレス</li>
          </ul>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="font-bold text-gray-800 mb-2">体質・疾患的原因</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 加齢（涙液分泌の減少）</li>
            <li>• マイボーム腺機能不全（MGD）</li>
            <li>• シェーグレン症候群</li>
            <li>• 一部の薬の副作用</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">目薬で改善する方法</h2>
      <p className="text-gray-700 mb-3">
        ドライアイの種類（水分不足型・油分不足型）によって適切な目薬が異なります。
      </p>
      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-cyan-800">
          <strong>水分不足型：</strong>ヒアルロン酸Na・ポリビニルアルコール配合の目薬が効果的<br />
          <strong>油分不足型（MGD）：</strong>ホットアイマスクでマイボーム腺を温めることが有効
        </p>
      </div>
      <AffiliateBtns amzn="ドライアイ 目薬 防腐剤フリー おすすめ" rakuten="ドライアイ 目薬 コンタクト" />

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ホットアイマスクの効果</h2>
      <p className="text-gray-700 mb-3">
        ホットアイマスクは40〜45℃の温熱でまぶたを温め、マイボーム腺から油分の分泌を促進します。油分不足型のドライアイに特に効果的です。1回10〜15分が目安。
      </p>
      <AffiliateBtns amzn="ホットアイマスク ドライアイ おすすめ" rakuten="ホットアイマスク ドライアイ" />

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ルテインサプリの活用</h2>
      <p className="text-gray-700 mb-3">
        ルテイン・ゼアキサンチンは目の黄斑部に集中する天然色素で、光ダメージから目を守ります。食事（ほうれん草・ケール等）からの摂取が難しい場合はサプリメントが有効です。1日10mg以上が目安。
      </p>
      <AffiliateBtns amzn="ルテイン サプリ 目 ドライアイ" rakuten="ルテイン アスタキサンチン サプリ" />

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">生活習慣の改善</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
        <li><strong>20-20-20ルール：</strong>20分に1度、20フィート（約6m）先を20秒間見る</li>
        <li><strong>意識的な瞬き：</strong>PC作業中は意識的に瞬きを増やす</li>
        <li><strong>加湿器の使用：</strong>室内湿度を50〜60%に保つ</li>
        <li><strong>スクリーンの位置：</strong>目線より少し下に調整し、まぶたの開きを小さくする</li>
        <li><strong>オメガ3脂肪酸：</strong>青魚・亜麻仁油の摂取でドライアイ改善の報告あり</li>
      </ul>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <p className="text-sm text-amber-800">
          <strong>眼科受診の目安：</strong>目薬や生活習慣の改善で2週間以上改善しない場合、目の痛み・充血が強い場合は眼科を受診してください。
        </p>
      </div>
    </article>
  ),

  'hot-eye-mask-osusume': (
    <article className="prose prose-sm max-w-none">
      <p className="lead text-gray-600 text-base leading-relaxed mb-6">
        疲れ目・ドライアイ・肩こりに効果的なホットアイマスク。繰り返し使えるタイプから使い捨てまで、2026年のおすすめランキングを紹介します。
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ホットアイマスクの効果</h2>
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {[
          { effect: 'ドライアイ改善', desc: 'マイボーム腺を温めて油分分泌を促進' },
          { effect: '疲れ目・眼精疲労', desc: '血行促進でピント調節筋の疲労回復' },
          { effect: '睡眠の質向上', desc: '就寝前の使用でリラックス効果' },
        ].map(e => (
          <div key={e.effect} className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
            <p className="font-bold text-orange-700 text-sm mb-1">{e.effect}</p>
            <p className="text-xs text-gray-600">{e.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">繰り返し使用タイプの比較</h2>
      <div className="space-y-4 mb-6">
        {[
          {
            name: 'Panasonic EH-SW68',
            price: '¥7,000〜10,000',
            features: ['スチーム式・潤いが高い', '温度4段階調節', '充電式コードレス', '連続使用約10分'],
            verdict: '総合最高峰。スチームで目元に潤いを与えたい方に',
          },
          {
            name: 'アイリスオーヤマ HOT17',
            price: '¥3,000〜4,000',
            features: ['USB充電式', '温度3段階', '振動機能付き', '軽量180g'],
            verdict: 'コスパ最強。初めてのホットアイマスクに最適',
          },
        ].map(p => (
          <div key={p.name} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex justify-between items-start mb-2">
              <p className="font-bold text-gray-800">{p.name}</p>
              <p className="text-sm font-bold text-orange-600">{p.price}</p>
            </div>
            <ul className="text-xs text-gray-600 grid grid-cols-2 gap-1 mb-2">
              {p.features.map(f => <li key={f}>• {f}</li>)}
            </ul>
            <p className="text-xs text-gray-500 italic">{p.verdict}</p>
          </div>
        ))}
      </div>
      <AffiliateBtns amzn="ホットアイマスク Panasonic 繰り返し" rakuten="ホットアイマスク 繰り返し おすすめ" />

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">使い捨てタイプの比較</h2>
      <div className="space-y-3 mb-6">
        {[
          { name: '花王 めぐりズム 蒸気でホットアイマスク', price: '14枚 ¥700〜', feat: '約40℃・約10分持続。ラベンダー・ローズ等5種の香り。旅行・出張に最適' },
          { name: 'バブ メディキュア ホットアイマスク', price: '5枚 ¥500〜', feat: '45℃の高温で強力なホット感。寝る前の集中ケアに' },
        ].map(p => (
          <div key={p.name} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="font-bold text-gray-800 text-sm">{p.name}</p>
              <p className="text-xs font-bold text-orange-600">{p.price}</p>
            </div>
            <p className="text-xs text-gray-600">{p.feat}</p>
          </div>
        ))}
      </div>
      <AffiliateBtns amzn="花王 めぐりズム ホットアイマスク" rakuten="めぐりズム アイマスク ホット" />

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">選び方のポイント</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-orange-50">
              <th className="text-left p-3 border border-gray-200">こんな方に</th>
              <th className="text-left p-3 border border-gray-200">おすすめタイプ</th>
            </tr>
          </thead>
          <tbody>
            {[
              { user: '毎日使いたい・コスパ重視', rec: '繰り返し使用タイプ（アイリスオーヤマ等）' },
              { user: '潤い・スチーム効果を求める', rec: 'Panasonic EH-SW68' },
              { user: '出張・旅行が多い', rec: '使い捨て（花王めぐりズム）' },
              { user: '香りでリラックスしたい', rec: '使い捨て（各種香りバリエーション）' },
            ].map(r => (
              <tr key={r.user} className="border-b border-gray-100">
                <td className="p-3 border border-gray-200 text-gray-700">{r.user}</td>
                <td className="p-3 border border-gray-200 font-medium text-orange-700">{r.rec}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  ),

  'vr-game-osusume-2026': (
    <article className="prose prose-sm max-w-none">
      <p className="lead text-gray-600 text-base leading-relaxed mb-6">
        Meta Quest 3でプレイできるVRゲーム・アプリのおすすめを2026年最新情報でランキング。ジャンル別・初心者向けに厳選しました。
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">VRゲームジャンル別おすすめ</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {[
          { genre: 'リズム・音楽', title: 'Beat Saber', desc: '光の剣でブロックを斬るリズムゲーム。VR入門として世界で最も人気。無数の楽曲DLCあり。' },
          { genre: 'ソーシャルVR', title: 'VRChat / Horizon Worlds', desc: 'アバターで世界中のユーザーと交流。Meta Quest対応。無料で始められる。' },
          { genre: 'シューティング', title: 'Superhot VR / Pistol Whip', desc: '時間の流れを操るスタイリッシュシューター。VRならではの没入感。' },
          { genre: 'フィットネス', title: 'Supernatural / FitXR', desc: 'VRワークアウト。音楽に合わせて全身を動かす。続けやすいと口コミ評価が高い。' },
        ].map(g => (
          <div key={g.genre} className="bg-white border border-gray-200 rounded-xl p-4">
            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded font-medium">{g.genre}</span>
            <p className="font-bold text-gray-800 text-sm mt-2 mb-1">{g.title}</p>
            <p className="text-xs text-gray-600">{g.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Meta Quest 3 おすすめアプリ一覧</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-violet-50">
              <th className="text-left p-3 border border-gray-200">アプリ名</th>
              <th className="text-left p-3 border border-gray-200">ジャンル</th>
              <th className="text-left p-3 border border-gray-200">価格</th>
              <th className="text-left p-3 border border-gray-200">特徴</th>
            </tr>
          </thead>
          <tbody>
            {[
              { app: 'Beat Saber', genre: 'リズム', price: '¥2,990', feat: 'VR入門No.1。楽曲DLC豊富' },
              { app: 'Superhot VR', genre: 'アクション', price: '¥2,490', feat: '動いたときだけ時間が流れる独特のシステム' },
              { app: 'VRChat', genre: 'ソーシャル', price: '無料', feat: '世界最大のソーシャルVRプラットフォーム' },
              { app: 'Pistol Whip', genre: 'リズムシューター', price: '¥2,490', feat: 'アクション映画の主人公になれる' },
              { app: 'Resident Evil 4 VR', genre: 'ホラーアクション', price: '¥4,990', feat: 'バイオハザード4をVRで完全体験' },
              { app: "Asgard's Wrath 2", genre: 'RPG', price: '¥5,490', feat: 'Meta Quest最高峰のRPG。100時間超のボリューム' },
            ].map(r => (
              <tr key={r.app} className="border-b border-gray-100">
                <td className="p-3 border border-gray-200 font-medium">{r.app}</td>
                <td className="p-3 border border-gray-200 text-xs text-gray-600">{r.genre}</td>
                <td className="p-3 border border-gray-200 text-violet-700 font-bold text-xs">{r.price}</td>
                <td className="p-3 border border-gray-200 text-xs text-gray-600">{r.feat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">VRゲームを始めるのに必要なもの</h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { item: 'Meta Quest 3', role: 'VRヘッドセット本体', price: '¥74,800〜', note: 'スタンドアロン型。PCなしでOK' },
          { item: 'コントローラー', role: '操作デバイス', price: '付属', note: 'Quest 3付属のTouch Plus' },
          { item: 'プレイスペース', role: '安全な空間', price: '無料', note: '最低1.5m×1.5mのスペースを確保' },
        ].map(i => (
          <div key={i.item} className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-center">
            <p className="font-bold text-violet-800 text-sm mb-1">{i.item}</p>
            <p className="text-xs text-gray-600 mb-1">{i.role}</p>
            <p className="text-xs font-bold text-violet-600 mb-1">{i.price}</p>
            <p className="text-xs text-gray-500">{i.note}</p>
          </div>
        ))}
      </div>
      <AffiliateBtns amzn="Meta Quest 3 VRゴーグル" rakuten="Meta Quest 3" />
    </article>
  ),

  'vr-yoi-taisaku': (
    <article className="prose prose-sm max-w-none">
      <p className="lead text-gray-600 text-base leading-relaxed mb-6">
        VR酔いは多くのVR初心者が経験する症状です。原因と効果的な対策を解説します。正しい対策で快適なVR体験を続けましょう。
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">VR酔いの原因</h2>
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
        <p className="font-bold text-red-800 mb-2">感覚のズレが酔いの原因</p>
        <p className="text-sm text-gray-700">
          目から入る「動いている」という視覚情報と、体が感じる「静止している」という前庭感覚のズレが脳に混乱を引き起こします。これが乗り物酔いと同じメカニズムです。
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {[
          { label: '酔いやすいコンテンツ', items: ['スムーズ移動（スティック操作）のゲーム', '乗り物シミュレーター', '激しいカメラ揺れのあるコンテンツ', 'FPS視点の素早い移動'] },
          { label: '酔いにくいコンテンツ', items: ['Beat Saberなど定位置プレイ', 'テレポート移動のゲーム', '360度動画・バーチャル観光', 'VRChat（自分が動かない場合）'] },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-bold text-gray-800 mb-2 text-sm">{s.label}</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {s.items.map(i => <li key={i}>• {i}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">VR酔いを防ぐ7つの対策</h2>
      <div className="space-y-3 mb-6">
        {[
          { num: '1', title: '短時間から始める', desc: '最初は15〜20分から。慣れてきたら徐々に時間を延ばす。急に長時間プレイしない。' },
          { num: '2', title: 'テレポート移動を選ぶ', desc: 'ゲーム内の移動設定をスムーズ移動からテレポートに切り替える。Meta Questの多くのゲームで設定可能。' },
          { num: '3', title: 'ビネット（視野絞り）をON', desc: 'Meta Questの設定でComfort Modeをオン。移動時に視野の端を暗くすることで酔いを軽減。' },
          { num: '4', title: 'フレームレートを最大に', desc: '低いフレームレートは酔いを増加させる。Quest 3は90Hzに設定。グラフィック品質より優先。' },
          { num: '5', title: 'ヘッドセットのフィットを確認', desc: 'レンズと目の距離（IPD）が合っていないと酔いやすい。Meta Quest 3は58/63/68mmの3段階調整。' },
          { num: '6', title: 'コンタクト・眼鏡の度数確認', desc: '視力矯正が不適切だと疲れやすく酔いやすい。VR用度付きインサートレンズも検討。' },
          { num: '7', title: 'VR酔い慣らし期間を設ける', desc: '多くの人は2〜4週間で耐性がつく。毎日少しずつプレイすることで脳が慣れていく。' },
        ].map(s => (
          <div key={s.num} className="flex gap-3 bg-white border border-gray-200 rounded-xl p-4">
            <span className="text-xl font-bold text-violet-300 shrink-0 w-6">{s.num}</span>
            <div>
              <p className="font-bold text-gray-800 text-sm mb-0.5">{s.title}</p>
              <p className="text-xs text-gray-600">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">VR酔いした後の対処法</h2>
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6">
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• すぐにヘッドセットを外し、外の空気を吸う</li>
          <li>• 水平線・遠くの景色を見て三半規管を落ち着かせる</li>
          <li>• 水を飲んで30分〜1時間休憩する</li>
          <li>• 翌日以降に少しずつ慣らすことで耐性がつく</li>
        </ul>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <p className="font-bold text-gray-800 mb-2">視力が悪い方はコンタクトでVRを快適に</p>
        <p className="text-sm text-gray-600 mb-3">度数が合っていないと酔いやすくなります。ワンデーコンタクトでVRを試してみてください。</p>
        <AffiliateBtns amzn="ワンデーコンタクト 1day おすすめ" rakuten="1day コンタクト ワンデー" />
      </div>
    </article>
  ),

  'vr-business-metaverse-2026': (
    <article className="prose prose-sm max-w-none">
      <p className="lead text-gray-600 text-base leading-relaxed mb-6">
        VR・XR技術のビジネス活用が本格化しています。VR会議・リモートトレーニング・メタバース空間でのビジネスなど、2026年最新のトレンドを解説します。
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ビジネスVRの主要活用シーン</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {[
          { icon: '🤝', title: 'バーチャル会議・コラボレーション', desc: 'Meta Horizon Workrooms、Microsoft Mesh、Spatial等を使った3D会議空間。遠隔でもホワイトボード・3Dモデル共有が可能。' },
          { icon: '🎓', title: 'VRトレーニング・教育', desc: '製造業の安全訓練・医療トレーニング・接客研修をVR化。実際の現場に近い環境でリスクゼロで練習できる。' },
          { icon: '🏗️', title: '建築・設計・不動産', desc: 'CADモデルをVRでウォークスルー。建築前に実寸大で確認。不動産内見もVRで対応が増加中。' },
          { icon: '🛍️', title: 'バーチャルショールーム', desc: '商品を実寸・3Dで確認してから購入できるEC体験。家具・自動車・眼鏡など試着・試用体験に活用。' },
        ].map(s => (
          <div key={s.title} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="font-bold text-gray-800 text-sm mb-1">{s.title}</p>
            <p className="text-xs text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2026年メタバース・XR業界トレンド</h2>
      <div className="space-y-4 mb-6">
        {[
          { trend: 'Apple Vision Proの法人普及', desc: '2025年から法人向け販売が本格化。ANA・大手製造業が業務活用を開始。¥599,800〜という価格も企業導入には障壁が低い。' },
          { trend: 'スマートグラスの日常化', desc: 'Ray-Ban MetaやXREAL Air 2 Proが街中でも見られるように。サングラス感覚で着用できるデザインが普及の鍵。' },
          { trend: 'XR向けプロセッサの進化', desc: 'Snapdragon XR2+ Gen 2搭載デバイスが増加。スタンドアロン型でPCレベルの描画が可能に。' },
          { trend: 'コンテンツエコシステムの拡大', desc: 'Meta Questストアのアプリが増加。VRゲームだけでなく教育・医療・フィットネス分野のアプリが急成長。' },
        ].map(t => (
          <div key={t.trend} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-bold text-gray-800 text-sm mb-1">📊 {t.trend}</p>
            <p className="text-xs text-gray-600">{t.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ビジネス用途別おすすめデバイス</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-violet-50">
              <th className="text-left p-3 border border-gray-200">用途</th>
              <th className="text-left p-3 border border-gray-200">おすすめデバイス</th>
              <th className="text-left p-3 border border-gray-200">理由</th>
            </tr>
          </thead>
          <tbody>
            {[
              { use: 'VR会議・チームコラボ', device: 'Meta Quest 3 / Quest Pro', reason: 'Horizon Workroomsに最適。コストパフォーマンス良好' },
              { use: '高品質プレゼン・クライアント対応', device: 'Apple Vision Pro', reason: '最高品質の映像・操作感。費用対効果は高い' },
              { use: '日常的なスマートメモ・通話', device: 'Ray-Ban Meta', reason: 'サングラス型で自然に使える。AI連携も充実' },
              { use: '大画面仮想モニター', device: 'XREAL Air 2 Pro', reason: 'PCと接続して最大330インチ相当の画面を投影' },
            ].map(r => (
              <tr key={r.use} className="border-b border-gray-100">
                <td className="p-3 border border-gray-200 text-gray-700">{r.use}</td>
                <td className="p-3 border border-gray-200 font-medium text-violet-700">{r.device}</td>
                <td className="p-3 border border-gray-200 text-xs text-gray-600">{r.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AffiliateBtns amzn="Meta Quest 3 ビジネス VRゴーグル" rakuten="VRゴーグル ビジネス Meta Quest" />
    </article>
  ),

  'eye-goods-pc': (
    <article className="prose prose-sm max-w-none">
      <p className="lead text-gray-600 text-base leading-relaxed mb-6">
        長時間のPC作業で目が疲れる方向けに、疲れ目対策グッズを厳選。モニターライトからブルーライトカット眼鏡まで、効果的なアイテムを紹介します。
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">PC作業で目が疲れる原因</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
        <li><strong>瞬きの減少：</strong>通常の1/3程度に減少しドライアイになる</li>
        <li><strong>ピント調節の酷使：</strong>同じ距離を見続けることで毛様体筋が疲労</li>
        <li><strong>モニターの反射・グレア：</strong>余計な明暗差で目に負荷がかかる</li>
        <li><strong>室内照明との明暗差：</strong>画面が明るすぎる・暗すぎると目が疲れやすい</li>
      </ul>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">モニターライトの効果</h2>
      <p className="text-gray-700 mb-3">
        モニター上部に設置するモニターライトは、画面に反射しない設計で手元を照らします。デスクライトより省スペースで、PC作業に最適な照明環境を作れます。
      </p>
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <p className="font-bold text-gray-800 mb-2">BenQ ScreenBar（最もおすすめ）</p>
        <p className="text-sm text-gray-600 mb-3">モニタークリップ式・非対称光学設計でグレアなし・自動照度調節・USB給電。PC作業のモニターライトとして世界シェアNo.1。</p>
        <AffiliateBtns amzn="BenQ ScreenBar モニターライト" rakuten="BenQ ScreenBar" />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ブルーライトカット眼鏡</h2>
      <p className="text-gray-700 mb-3">
        PC作業専用の度なしブルーライトカット眼鏡は、夜間の作業での睡眠への影響を軽減します。度ありの場合はJINSやZoffで「PC用度数（弱度数設計）」のオプションも検討を。
      </p>
      <AffiliateBtns amzn="ブルーライトカット 眼鏡 PC作業 度なし" rakuten="ブルーライトカット 眼鏡 PC" />

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">モニターフィルター・アンチグレアフィルム</h2>
      <p className="text-gray-700 mb-3">
        モニターに貼るアンチグレア（非光沢）フィルムは、照明の映り込みを防ぎ目への負担を軽減します。プライバシーフィルターと兼用のものも人気です。
      </p>
      <AffiliateBtns amzn="モニター アンチグレア フィルター ブルーライトカット" rakuten="モニターフィルター アンチグレア" />

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">PC作業の目疲れ対策まとめ</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {[
          { title: 'モニターライト', effect: '手元の照度改善・グレア軽減', cost: '¥8,000〜15,000', recommend: 'BenQ ScreenBar / Plus' },
          { title: 'ブルーライトカット眼鏡', effect: '夜間の睡眠への影響を軽減', cost: '¥1,000〜5,000', recommend: 'JINSのPC GLASSES' },
          { title: 'コンタクト対応目薬', effect: 'ドライアイ・疲れ目をケア', cost: '¥500〜2,000', recommend: 'ソフトサンティア（防腐剤フリー）' },
          { title: 'ホットアイマスク', effect: '仕事後の目の回復を促進', cost: '¥3,000〜10,000', recommend: 'Panasonic EH-SW68' },
        ].map(g => (
          <div key={g.title} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-bold text-gray-800 text-sm mb-1">{g.title}</p>
            <p className="text-xs text-green-700 mb-1">{g.effect}</p>
            <p className="text-xs text-gray-500 mb-1">参考価格：{g.cost}</p>
            <p className="text-xs text-orange-600">おすすめ：{g.recommend}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <p className="font-bold text-gray-800 mb-3">目疲れ対策グッズをまとめて探す</p>
        <AffiliateBtns amzn="PC 目疲れ 対策 グッズ" rakuten="目疲れ PC 対策 グッズ" />
      </div>
    </article>
  ),
};
