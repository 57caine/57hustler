import Link from 'next/link';
import { type EyeColumnMeta } from './eye-columns';

const RAKUTEN = (kw: string) =>
  `https://hb.afl.rakuten.co.jp/ichiba/5567171b.a80702dc.5567171c.a1d1b6fc/?pc=${encodeURIComponent('https://search.rakuten.co.jp/search/mall/' + kw + '/')}`;

// ─── メタデータ ───────────────────────────────────────────────

export const karakonColumns: EyeColumnMeta[] = [
  {
    slug: 'karakon-osusume-ranking-2026',
    title: 'カラコンおすすめランキング2026【度あり・度なし別】安全・ナチュラルな選び方',
    description: '2026年最新カラコンおすすめランキング。度あり・度なし別、ナチュラル系・盛り系それぞれの人気ブランドを徹底比較。厚生労働省承認済みの安全なブランドを紹介。',
    category: 'カラコン',
    section: 'karakon',
    publishedAt: '2026-07-16',
    updatedAt: '2026-07-16',
    readingTime: 9,
    headings: ['カラコン選びの基準', '度ありカラコンランキング', '度なしカラコンランキング', 'ナチュラル系 vs 盛り系の違い', 'ケア用品の選び方'],
    faqs: [
      { q: 'カラコンは眼科処方なしで買えますか？', a: '日本では高度管理医療機器に指定されているため、眼科で処方箋（コンタクトレンズ検査）を受けることが推奨されます。初めてのカラコンは必ず眼科受診のうえ、度数・BCを確認してから購入してください。' },
      { q: 'カラコンの着用時間はどのくらいが安全ですか？', a: '1日8〜10時間が一般的な目安です。装用時間が長くなると角膜への酸素供給が低下し、充血・乾燥・感染リスクが高まります。ワンデータイプは毎日交換できるため衛生的で初心者におすすめです。' },
      { q: '度なしカラコンは視力に影響しますか？', a: '度なしカラコン自体は視力を変えませんが、長時間装用による角膜へのダメージが積み重なると視力低下につながる可能性があります。正しいケアと適切な装用時間を守ることが重要です。' },
    ],
  },
  {
    slug: 'karakon-shoshinsha-guide',
    title: 'カラコン初心者完全ガイド2026【度数・着色直径・DIA・ケア方法をわかりやすく解説】',
    description: 'カラコン初心者向けの完全ガイド。BC・DIA・着色直径の意味、度数の選び方、正しい装着・外し方、ケア用品まで徹底解説。初めてのカラコン選びに。',
    category: 'カラコン',
    section: 'karakon',
    publishedAt: '2026-07-16',
    updatedAt: '2026-07-16',
    readingTime: 10,
    headings: ['カラコンの基本用語', 'BC・DIAの選び方', '着色直径で印象が変わる', '正しい装着・外し方', 'ケア用品の使い方', '初心者におすすめのブランド'],
    faqs: [
      { q: 'カラコンのDIAと着色直径の違いは何ですか？', a: 'DIA（直径）はレンズ全体のサイズ、着色直径はカラー部分の大きさです。着色直径が大きいほど瞳が大きく見えます。ナチュラルに見せたい方は着色直径13.5〜14.0mm、盛り感を出したい方は14.2〜14.5mmが目安です。' },
      { q: 'コンタクトレンズとカラコンは別に処方箋が必要ですか？', a: 'カラコンもコンタクトレンズと同じく高度管理医療機器です。度ありカラコンは通常のコンタクトと同様の処方検査が必要です。度なしカラコンも、初めて使う場合は眼科で目の状態（BC・目の健康状態）を確認することを強く推奨します。' },
      { q: 'カラコンのMPD（着色直径）が大きいと目に悪いですか？', a: '着色直径が大きくても、酸素透過性が十分なレンズで適切な装用時間を守れば直接的なリスクは大きくありません。ただし、安価な並行輸入品には酸素透過性の低いものもあるため、国内正規品・薬機法承認品を選ぶことが重要です。' },
    ],
  },
  {
    slug: 'karakon-anzen-erabikata',
    title: 'カラコンの安全な選び方【厚生労働省承認マーク・薬機法・危険な並行輸入品の見分け方】',
    description: '安全なカラコンの選び方を徹底解説。厚生労働省（薬機法）承認マークの確認方法、危険な並行輸入品の見分け方、正規品の購入場所まで。',
    category: 'カラコン',
    section: 'karakon',
    publishedAt: '2026-07-16',
    updatedAt: '2026-07-16',
    readingTime: 8,
    headings: ['カラコンは高度管理医療機器', '薬機法承認マークの確認方法', '危険な並行輸入品の見分け方', '安全な購入場所', '装用中の注意点'],
    faqs: [
      { q: '薬機法承認を受けていないカラコンはどうやって見分けますか？', a: 'パッケージに「高度管理医療機器」「承認番号」の記載があるか確認してください。また、認証番号（「〇XXXXXXX」形式）が厚生労働省のデータベースで検索できます。海外ECサイトや格安ショップで売られているものには無承認品が多く注意が必要です。' },
      { q: 'カラコンを安全に保存するにはどうすればよいですか？', a: 'ソフトコンタクトケア用品（MPSまたはH2O2系）を使用し、毎回新しい液に交換してください。ケースは週1回以上熱湯消毒し、3ヶ月ごとに交換するのが理想です。水道水での保存は厳禁（アカントアメーバ感染リスク）。' },
      { q: 'カラコンで目が赤くなったらどうすればよいですか？', a: 'すぐにレンズを外し、充血・痛み・視力の変化が続く場合は眼科を受診してください。感染性角膜炎は放置すると失明のリスクもあります。「少し赤いだけ」と判断して装用を続けることは大変危険です。' },
    ],
  },
  {
    slug: 'karakon-natural-osusume',
    title: 'ナチュラル系カラコンおすすめ特集2026【バレない・職場OK・ブラウン系・グレー系】',
    description: 'バレないナチュラルカラコンのおすすめを徹底解説。職場・学校でOKな自然な発色、ブラウン系・グレー系・ハーフ系の特徴と選び方。',
    category: 'カラコン',
    section: 'karakon',
    publishedAt: '2026-07-16',
    updatedAt: '2026-07-16',
    readingTime: 8,
    headings: ['ナチュラル系の定義', '着色直径で選ぶ', 'カラー別の印象', '人気ブランド比較', '季節・シーン別の選び方'],
    faqs: [
      { q: 'ナチュラルカラコンとはどんなものですか？', a: '着色直径が比較的小さく（13.5〜14.0mm前後）、発色が控えめなカラコンです。ブラウン系・ヘーゼル系・グレー系が多く、裸眼風〜少しトーンアップした自然な仕上がりが特徴です。職場・学校でも使いやすい製品が多いです。' },
      { q: 'ナチュラルカラコンで一番バレにくい色は何ですか？', a: '日本人の瞳の色に近いダークブラウン・ライトブラウン系が最もバレにくいです。着色直径13.6〜13.8mm前後を選ぶと裸眼との差が小さく自然です。グラデーションデザインのものはさらに自然な仕上がりになります。' },
      { q: 'グレーのカラコンは日本人に似合いますか？', a: 'グレーはトレンド感があり、日本人でもナチュラルに馴染むカラーです。暗めのチャコールグレーはクール系の印象、明るめのシルバーグレーは外国人風な雰囲気になります。着色直径を小さめに抑えると職場でも使いやすいです。' },
    ],
  },
  {
    slug: 'korea-karakon-ranking-2026',
    title: '韓国で人気のカラコンブランドランキング2026【OLENS・Lensme・LEO Eyes】日本で買える韓国カラコン',
    description: '韓国コスメに続いてブームの韓国カラコン。人気ブランドの特徴・価格・日本での購入方法を徹底比較。OLENS・Lensme・LEO Eyesなど最新ランキング。',
    category: 'カラコン',
    section: 'karakon',
    publishedAt: '2026-07-16',
    updatedAt: '2026-07-16',
    readingTime: 9,
    headings: ['韓国カラコンが人気な理由', '日本向け正規品と並行輸入品の違い', '人気ブランドランキング', '日本での購入方法', '注意点'],
    faqs: [
      { q: '韓国のカラコンは日本で使っても大丈夫ですか？', a: '日本国内で販売する際は薬機法（旧薬事法）による承認が必要です。正規輸入品は日本の承認を取得しているため安全です。海外ECサイトから個人輸入したものは承認を確認できないため注意が必要です。楽天やAmazonで正規販売されているものを選ぶのが安心です。' },
      { q: '韓国カラコンは日本のものと何が違いますか？', a: '韓国カラコンはデザインの種類が多く、発色が鮮やかな傾向があります。また価格帯がリーズナブルなことも特徴です。一方、日本の大手ブランドは酸素透過性や品質管理に定評があります。韓国ブランドも日本向け正規品は薬機法基準をクリアしています。' },
      { q: 'OLENSのカラコンは日本で買えますか？', a: 'OLENS（オーレンズ）は楽天市場や公式オンラインショップで日本向けに販売されています。日本薬機法の承認を取得した製品が販売されているため安心して利用できます。' },
    ],
  },
  {
    slug: 'karakon-do-ari-erabikata',
    title: '度ありカラコンの選び方2026【度数・BC・ブランド比較｜ハードルを下げる完全ガイド】',
    description: '度ありカラコンの正しい選び方を徹底解説。処方箋の取り方、度数・BCの見方、おすすめブランドランキング、安全な購入方法まで初心者にもわかりやすく説明。',
    category: 'カラコン',
    section: 'karakon',
    publishedAt: '2026-07-17',
    updatedAt: '2026-07-17',
    readingTime: 9,
    headings: ['度ありカラコンとは', '眼科で処方箋を取る手順', '度数・BCの見方', 'おすすめブランドランキング', '通販での買い方'],
    faqs: [
      { q: '度ありカラコンは通販で買えますか？', a: '処方箋または装用指示書があれば通販で購入可能です。眼科受診後に発行される書類をアップロードまたはFAXすることで、合法的にオンラインで購入できます。無処方での購入は薬機法違反となるサイトを利用することになりかねないため注意が必要です。' },
      { q: '度ありカラコンの度数はメガネと同じですか？', a: 'コンタクトとメガネは目からの距離が異なるため、同じ度数ではありません。コンタクトの度数はメガネより弱くなることが多く（例：メガネ-4.00 → コンタクト-3.75など）、眼科処方が必要です。' },
      { q: '度ありカラコンの最強度数はどのくらいまでありますか？', a: '多くのブランドで-10.00〜-0.50まで対応しています。強度近視（-6.00以上）の場合は取り扱いブランドが限られるため、対応ブランドを確認してから購入してください。' },
    ],
  },
  {
    slug: 'karakon-long-wear-osusume',
    title: '長時間装用でも疲れにくいカラコンおすすめ2026【仕事・学校・旅行に】',
    description: '長時間装用でも目が疲れにくいカラコンの選び方。高酸素透過性・高含水率・シリコーンハイドロゲル素材のブランドを徹底比較。10時間以上使いたい方必見。',
    category: 'カラコン',
    section: 'karakon',
    publishedAt: '2026-07-17',
    updatedAt: '2026-07-17',
    readingTime: 8,
    headings: ['長時間装用で目が疲れる原因', '疲れにくいレンズの選び方', '素材・スペック比較', 'おすすめブランドTOP5', '装用時間を延ばすコツ'],
    faqs: [
      { q: 'カラコンは何時間まで装用できますか？', a: '一般的なソフトカラコンは1日8〜10時間が推奨上限です。シリコーンハイドロゲル素材のものは酸素透過性が高く、眼科の指示のもとで12時間程度の使用が可能なものもあります。必ず処方に従ってください。' },
      { q: '長時間でも目が乾きにくいカラコンの素材は何ですか？', a: 'シリコーンハイドロゲル素材が最も酸素透過性が高く、長時間装用に向いています。従来のHEMA系と比べて角膜への酸素供給が大幅に改善されています。ただしカラコンでシリコーンハイドロゲル素材の製品は現状まだ少ないため、含水率38〜46%の低含水率レンズも乾きにくいです。' },
      { q: '仕事中（10時間以上）カラコンをつけ続けても大丈夫ですか？', a: '医師の処方なく10時間以上連続で装用することは推奨されません。どうしても必要な場合は眼科で相談し、長時間装用を前提とした処方を受けてください。コンタクト用点眼薬を使いながら定期的に休ませることも重要です。' },
    ],
  },
  {
    slug: 'karakon-ambassador-brands',
    title: '公式アンバサダー起用カラコンブランド特集2026【公式発表済み情報のみ掲載】',
    description: '公式アンバサダー・イメージモデルが起用されているカラコンブランドを特集。すべて公式サイト・プレスリリースで確認した正式発表情報のみ掲載。',
    category: 'カラコン',
    section: 'karakon',
    publishedAt: '2026-07-16',
    updatedAt: '2026-07-16',
    readingTime: 7,
    headings: ['公式アンバサダーとは', 'ブランド別アンバサダー一覧', 'アンバサダー起用ブランドの特徴', '購入ガイド'],
    faqs: [
      { q: 'カラコンのアンバサダーと愛用者の違いは何ですか？', a: '公式アンバサダー（イメージモデル）は、ブランドと正式な契約を結びプロモーション活動を行う方です。「愛用者」は個人が使用しているだけで公式の契約はありません。当記事では公式発表済みのアンバサダーのみを掲載しています。' },
      { q: 'アンバサダーが使っているのと同じカラコンを買えますか？', a: 'アンバサダーが広告で使用しているカラコンは、通常ブランドの公式サイトやオフィシャルショップで購入できます。広告に使用されたカラーやシリーズ名は公式サイトで確認できます。' },
      { q: 'アンバサダー起用ブランドは品質が高いですか？', a: '必ずしもそうとは言えませんが、著名人を起用するブランドはマーケティングに力を入れており、品質管理や商品開発にも注力している傾向があります。薬機法承認の有無は必ず確認してください。' },
    ],
  },
];

// ─── 記事コンテンツ ───────────────────────────────────────────

function AffiliateBtnR({ rakuten, label }: { rakuten: string; label?: string }) {
  return (
    <a href={RAKUTEN(rakuten)} target="_blank" rel="noopener noreferrer nofollow sponsored"
      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
      🛒 {label ?? '楽天で価格を確認する'} →
    </a>
  );
}

export const karakonColumnContent: Record<string, React.ReactElement> = {

  // ─── 1. ランキング2026 ────────────────────────────────────
  'karakon-osusume-ranking-2026': (
    <article className="prose-sm max-w-none text-gray-700 leading-relaxed" id="article-body">
      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">カラコン選びの4つの基準</h2>
      <p className="mb-4">カラコンを選ぶうえで重要な指標は<strong>①BC（ベースカーブ）②DIA（レンズ直径）③着色直径④酸素透過性</strong>の4つです。これらが合っていないと、目のトラブルにつながります。</p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-pink-50"><th className="p-3 border border-gray-200 text-left">指標</th><th className="p-3 border border-gray-200 text-left">目安</th><th className="p-3 border border-gray-200 text-left">チェックポイント</th></tr></thead>
          <tbody>
            {[
              { k: 'BC（ベースカーブ）', v: '8.5〜9.0mm', c: '眼科処方のBCと一致させる' },
              { k: 'DIA（レンズ直径）', v: '14.0〜14.5mm', c: 'ナチュラル14.0、盛り14.5mm' },
              { k: '着色直径', v: '13.5〜14.5mm', c: '大きいほど瞳が大きく見える' },
              { k: '酸素透過性（Dk/t）', v: '20以上が目安', c: '低いと角膜への酸素供給が減る' },
            ].map(r => (
              <tr key={r.k} className="border-b border-gray-100">
                <td className="p-3 border border-gray-200 font-medium text-pink-700">{r.k}</td>
                <td className="p-3 border border-gray-200">{r.v}</td>
                <td className="p-3 border border-gray-200 text-gray-600 text-xs">{r.c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">度ありカラコン おすすめランキング2026</h2>
      <p className="mb-4">視力矯正が必要な方は度ありカラコンを選びます。通常のコンタクトレンズと同様に眼科処方が必要です。</p>
      <div className="space-y-4 mb-6">
        {[
          {
            rank: 1, name: 'エバーカラーワンデー', type: '1day', bc: '8.7mm', dia: '14.2mm', cc: '14.0mm', price: '30枚入り¥1,980〜',
            point: '日本製・酸素透過性が高く長時間でも快適。ナチュラル系カラーが充実。薬機法承認済み。',
            rakuten: 'エバーカラーワンデー カラコン',
          },
          {
            rank: 2, name: 'ReVIA（レヴィア）', type: '1day/1month', bc: '8.6mm', dia: '14.2mm', cc: '13.8mm', price: '10枚入り¥1,500〜',
            point: '国産ブランド。ナチュラルな発色とデザイン性のバランスが良い。ワンデー・マンスリー両方展開。',
            rakuten: 'ReVIA レヴィア カラコン',
          },
          {
            rank: 3, name: 'FLANMY（フランミー）', type: '1day', bc: '8.6mm', dia: '14.2mm', cc: '13.8mm', price: '10枚入り¥1,380〜',
            point: 'ガーリーなデザインが特徴。くすみカラー・テラコッタ系など流行の色展開が豊富。',
            rakuten: 'フランミー FLANMY カラコン',
          },
        ].map(p => (
          <div key={p.rank} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-full bg-pink-600 text-white font-bold text-sm flex items-center justify-center shrink-0">{p.rank}</span>
              <div>
                <p className="font-bold text-gray-800">{p.name}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {[p.type, `BC${p.bc}`, `DIA${p.dia}`, `着色直径${p.cc}`].map(t => (
                    <span key={t} className="text-xs bg-pink-50 text-pink-700 px-2 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-700 mb-2">{p.point}</p>
            <p className="text-xs text-red-600 font-bold mb-2">{p.price}</p>
            <AffiliateBtnR rakuten={p.rakuten} label={`${p.name}を楽天で見る`} />
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">度なしカラコン おすすめランキング2026</h2>
      <p className="mb-4">視力に問題がない方・ファッション目的の方は度なしカラコンを選べます。ただし初めての場合も眼科で目の状態を確認することをおすすめします。</p>
      <div className="space-y-4 mb-6">
        {[
          {
            rank: 1, name: 'OLENS（オーレンズ）', origin: '韓国正規品', cc: '13.4〜14.5mm', price: '1箱¥1,200〜',
            point: '豊富なカラー展開と韓国発のトレンドデザイン。日本向け薬機法承認済み正規品あり。',
            rakuten: 'OLENS オーレンズ カラコン',
          },
          {
            rank: 2, name: 'Chu\'s Me（チューズミー）', origin: '国内ブランド', cc: '13.6〜14.2mm', price: '10枚入り¥1,200〜',
            point: '透明感のあるシアーカラーが特徴。裸眼よりほんの少し明るい印象を与えるナチュラル系。',
            rakuten: 'チューズミー カラコン 度なし',
          },
          {
            rank: 3, name: 'ピエナージュ（Pienage）', origin: '国内ブランド', cc: '13.5〜14.0mm', price: '10枚入り¥1,000〜',
            point: '発色の良さとナチュラルさの両立。ブラウン系から個性的なカラーまで幅広いラインナップ。',
            rakuten: 'ピエナージュ カラコン',
          },
        ].map(p => (
          <div key={p.rank} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-full bg-pink-400 text-white font-bold text-sm flex items-center justify-center shrink-0">{p.rank}</span>
              <div>
                <p className="font-bold text-gray-800">{p.name}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {[p.origin, `着色直径${p.cc}`].map(t => (
                    <span key={t} className="text-xs bg-pink-50 text-pink-700 px-2 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-700 mb-2">{p.point}</p>
            <p className="text-xs text-red-600 font-bold mb-2">{p.price}</p>
            <AffiliateBtnR rakuten={p.rakuten} label={`${p.name}を楽天で見る`} />
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ナチュラル系 vs 盛り系：何が違う？</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-pink-50"><th className="p-3 border border-gray-200 text-left">項目</th><th className="p-3 border border-gray-200 text-left">ナチュラル系</th><th className="p-3 border border-gray-200 text-left">盛り系</th></tr></thead>
          <tbody>
            {[
              { item: '着色直径', nat: '13.5〜14.0mm', mor: '14.2〜14.5mm' },
              { item: 'カラー', nat: 'ブラウン・ヘーゼル・グレー', mor: '明るいカラー・発色鮮やか' },
              { item: 'シーン', nat: '職場・学校・普段使い', mor: 'デート・イベント・撮影' },
              { item: '自然さ', nat: 'ほぼバレない', mor: 'カラコン感あり' },
            ].map(r => (
              <tr key={r.item} className="border-b border-gray-100">
                <td className="p-3 border border-gray-200 font-medium">{r.item}</td>
                <td className="p-3 border border-gray-200 text-pink-700">{r.nat}</td>
                <td className="p-3 border border-gray-200 text-purple-700">{r.mor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ケア用品の選び方</h2>
      <p className="mb-3">カラコンを2weekやマンスリータイプで使う場合、ケア用品の選択も重要です。</p>
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        {[
          { type: 'MPS（多目的溶液）', merit: '洗浄・保存・消毒が1本でOK', demerit: '手間が少なく初心者向け', ex: 'ソフトサンティア、ReNu' },
          { type: 'H2O2（過酸化水素）系', merit: '洗浄力が高く清潔', demerit: '中和ケースが必要・6時間以上かかる', ex: 'AOセプト、クリアケア' },
        ].map(c => (
          <div key={c.type} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-bold text-gray-800 text-sm mb-2">{c.type}</p>
            <p className="text-xs text-green-700 mb-1">メリット：{c.merit}</p>
            <p className="text-xs text-gray-500 mb-1">特徴：{c.demerit}</p>
            <p className="text-xs text-gray-400">例：{c.ex}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <AffiliateBtnR rakuten="カラコン ケア用品 MPS" label="カラコンケア用品を楽天で見る" />
      </div>
    </article>
  ),

  // ─── 2. 初心者ガイド ──────────────────────────────────────
  'karakon-shoshinsha-guide': (
    <article className="prose-sm max-w-none text-gray-700 leading-relaxed" id="article-body">
      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">カラコンの基本用語を押さえよう</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-pink-50"><th className="p-3 border border-gray-200 text-left">用語</th><th className="p-3 border border-gray-200 text-left">意味</th><th className="p-3 border border-gray-200 text-left">目安</th></tr></thead>
          <tbody>
            {[
              { term: 'BC（ベースカーブ）', meaning: 'レンズの曲率。角膜の丸みと合わせる', guide: '8.5〜9.0mm（眼科で測定）' },
              { term: 'DIA（ダイアメーター）', meaning: 'レンズ全体の直径', guide: '14.0〜14.5mmが一般的' },
              { term: '着色直径', meaning: 'カラー部分の大きさ', guide: 'ナチュラル13.5mm / 盛り14.5mm' },
              { term: 'PWR / 度数', meaning: '視力補正の強さ。マイナスが近視', guide: '眼科処方箋の値を使用' },
              { term: '含水率', meaning: 'レンズに含まれる水分量', guide: '低含水率はドライアイになりにくい' },
              { term: '酸素透過性（Dk/t）', meaning: '角膜への酸素供給量', guide: '20以上が安心の目安' },
            ].map(r => (
              <tr key={r.term} className="border-b border-gray-100">
                <td className="p-3 border border-gray-200 font-bold text-pink-700 text-xs">{r.term}</td>
                <td className="p-3 border border-gray-200 text-xs">{r.meaning}</td>
                <td className="p-3 border border-gray-200 text-gray-600 text-xs">{r.guide}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">BCとDIAの選び方</h2>
      <p className="mb-3">BCは眼科で測定した値を必ず使用してください。自己判断で選ぶとレンズがズレやすくなったり、角膜を傷つけたりします。</p>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <p className="font-bold text-amber-800 mb-2">⚠️ 初めてのカラコンは必ず眼科へ</p>
        <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
          <li>BC・DIAの値を正確に測定してもらう</li>
          <li>目の健康状態（アレルギー・ドライアイ等）を確認</li>
          <li>度ありの場合は処方箋の発行</li>
          <li>装着・外し方の指導を受ける</li>
        </ul>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">着色直径で印象がこんなに変わる</h2>
      <p className="mb-3">同じブランドでも着色直径が異なると、仕上がりの雰囲気が大きく変わります。</p>
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {[
          { size: '13.2〜13.5mm', look: '裸眼風', desc: '瞳に近い自然なサイズ。バレない度なしによく使われる' },
          { size: '13.6〜14.0mm', look: 'ナチュラル盛り', desc: '適度な拡大効果。職場・学校でも使いやすい汎用サイズ' },
          { size: '14.2〜14.5mm', look: '盛り系', desc: '存在感がありデート・撮影向け。黒目を大きく見せたい方に' },
        ].map(s => (
          <div key={s.size} className="bg-white border border-pink-200 rounded-xl p-4 text-center">
            <p className="font-bold text-pink-700 text-sm mb-1">{s.size}</p>
            <p className="text-xs text-gray-800 font-medium mb-2">{s.look}</p>
            <p className="text-xs text-gray-500">{s.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">正しい装着・外し方</h2>
      <div className="space-y-3 mb-6">
        {[
          { step: '装着前', icon: '💧', text: '石鹸で手を洗い、十分にすすぐ。タオルで水分を拭き取る。ケアをしている場合は保存液をすすぐ。' },
          { step: '装着', icon: '👁', text: '人差し指の先にレンズを載せ、もう一方の手で上まぶたを持ち上げ、下まぶたを引き下げてそっとのせる。' },
          { step: '確認', icon: '✅', text: '鏡でレンズの位置を確認。ゴロゴロ感がある場合は一度外して再装着。' },
          { step: '外すとき', icon: '🤲', text: '人差し指と親指で黒目からずらしてつまむ、またはスライドして白目部分でつまむ。爪を立てない。' },
        ].map(s => (
          <div key={s.step} className="flex gap-3 bg-white border border-gray-200 rounded-xl p-4">
            <span className="text-2xl shrink-0">{s.icon}</span>
            <div>
              <p className="font-bold text-gray-800 text-sm mb-1">{s.step}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{s.text}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ケア用品の使い方（2week・マンスリー向け）</h2>
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <ol className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2"><span className="text-pink-600 font-bold shrink-0">①</span>手を洗ってから、レンズを人差し指に載せる</li>
          <li className="flex gap-2"><span className="text-pink-600 font-bold shrink-0">②</span>MPSをレンズの両面に数滴垂らして10〜15秒こすり洗い</li>
          <li className="flex gap-2"><span className="text-pink-600 font-bold shrink-0">③</span>新しいMPSですすぐ（水道水は厳禁）</li>
          <li className="flex gap-2"><span className="text-pink-600 font-bold shrink-0">④</span>新鮮なMPSを満たしたケースに入れて保存</li>
          <li className="flex gap-2"><span className="text-pink-600 font-bold shrink-0">⑤</span>ケースは毎日中身を捨てて乾燥させ、3ヶ月ごとに交換</li>
        </ol>
      </div>
      <AffiliateBtnR rakuten="カラコン 初心者 ワンデー" label="初心者向けカラコンを楽天で見る" />
    </article>
  ),

  // ─── 3. 安全な選び方 ──────────────────────────────────────
  'karakon-anzen-erabikata': (
    <article className="prose-sm max-w-none text-gray-700 leading-relaxed" id="article-body">
      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">カラコンは高度管理医療機器</h2>
      <p className="mb-4">日本では、カラーコンタクトレンズは<strong>薬機法（旧薬事法）による「高度管理医療機器」</strong>に指定されています。これは視力矯正用コンタクトレンズと同じカテゴリで、無許可での販売は違法です。</p>
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <p className="font-bold text-red-800 mb-2">⚠️ 注意：これらは危険なカラコン</p>
        <ul className="text-sm text-red-700 space-y-1 list-disc pl-4">
          <li>雑貨店・100円ショップで販売されているカラコン（薬機法上違法）</li>
          <li>海外ECサイトからの個人輸入品（安全基準不明）</li>
          <li>承認番号の記載がない製品</li>
          <li>使用期限・BC・度数の記載がない製品</li>
        </ul>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">薬機法承認マークの確認方法</h2>
      <p className="mb-3">正規品には必ず以下の情報がパッケージに記載されています。</p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-green-50"><th className="p-3 border border-gray-200 text-left">確認項目</th><th className="p-3 border border-gray-200 text-left">正規品の表示</th></tr></thead>
          <tbody>
            {[
              { check: '高度管理医療機器の表示', ok: '「高度管理医療機器」の文字が必ず記載' },
              { check: '承認番号・認証番号', ok: '「承認番号：〇〇〇〇〇〇〇〇〇」形式で記載' },
              { check: '製造販売業者名', ok: '日本国内の製造販売業者（もしくは輸入業者）が記載' },
              { check: '使用期限', ok: '「使用期限：YYYY/MM」の形式で記載' },
              { check: 'BC・DIA・度数', ok: '全てパッケージに明記' },
            ].map(r => (
              <tr key={r.check} className="border-b border-gray-100">
                <td className="p-3 border border-gray-200 font-medium text-sm">{r.check}</td>
                <td className="p-3 border border-gray-200 text-green-700 text-xs">{r.ok}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">危険な並行輸入品の見分け方</h2>
      <div className="space-y-3 mb-6">
        {[
          { signal: '価格が不自然に安い', detail: '正規品の半額以下の場合は要注意。製造コストを考えると無承認品の可能性が高い。' },
          { signal: '日本語表記がない', detail: 'パッケージが全て英語・韓国語・中国語のみで日本語なし。' },
          { signal: '製造販売業者が不明', detail: '海外ECサイトのみで販売、製造元・輸入元の情報が確認できない。' },
          { signal: '承認番号の記載なし', detail: 'パッケージに承認番号・認証番号が記載されていない。' },
        ].map(w => (
          <div key={w.signal} className="flex gap-3 bg-white border border-red-200 rounded-xl p-4">
            <span className="text-red-500 font-bold shrink-0">🚨</span>
            <div>
              <p className="font-bold text-gray-800 text-sm mb-1">{w.signal}</p>
              <p className="text-xs text-gray-600">{w.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">安全な購入場所</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {[
          { place: '眼科・眼科処方のうえオンライン購入', safe: '最も安全。処方指示に従って選べる', color: 'bg-green-50 border-green-200' },
          { place: '楽天・Amazon（正規販売店）', safe: '出品者の評価・正規品明記を確認する', color: 'bg-yellow-50 border-yellow-200' },
          { place: 'ブランド公式サイト', safe: '正規品が保証される。ブランドへの問い合わせも可', color: 'bg-green-50 border-green-200' },
          { place: '薬局・ドラッグストア', safe: '店頭販売は薬機法管理下で安全', color: 'bg-green-50 border-green-200' },
        ].map(p => (
          <div key={p.place} className={`border rounded-xl p-4 ${p.color}`}>
            <p className="font-bold text-gray-800 text-sm mb-1">{p.place}</p>
            <p className="text-xs text-gray-600">{p.safe}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">装用中の注意点</h2>
      <ul className="space-y-2 mb-4">
        {[
          '1日の装用時間は8〜10時間以内を守る',
          '就寝中の装用は禁止（特別な承認がある場合を除く）',
          '水泳・シャワー中は外す（アカントアメーバ感染予防）',
          '充血・痛み・異物感がある場合は直ちに外す',
          '有効期限を過ぎたカラコンは使わない',
          '他人のカラコンを共有しない',
        ].map(item => (
          <li key={item} className="flex gap-2 text-sm">
            <span className="text-pink-500 shrink-0">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <AffiliateBtnR rakuten="カラコン 薬機法 承認 日本製" label="安全な正規品カラコンを楽天で見る" />
    </article>
  ),

  // ─── 4. ナチュラル系 ──────────────────────────────────────
  'karakon-natural-osusume': (
    <article className="prose-sm max-w-none text-gray-700 leading-relaxed" id="article-body">
      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">ナチュラル系カラコンの定義と選び方</h2>
      <p className="mb-4">ナチュラル系カラコンとは、<strong>着色直径が13.5〜14.0mm前後で発色が控えめ</strong>なコンタクトレンズです。日本人の瞳に馴染みやすい色調で、職場や学校でも「付けているとわからない」自然な仕上がりが特徴です。</p>
      <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-6">
        <p className="font-bold text-pink-800 mb-2">ナチュラル系の3つのポイント</p>
        <ul className="text-sm text-pink-700 space-y-1 list-disc pl-4">
          <li>着色直径：13.4〜14.0mmを選ぶ（14.2mm以上は盛り系に）</li>
          <li>カラー：ブラウン・ダークブラウン・グレー系が自然</li>
          <li>デザイン：グラデーション（周囲が濃く中心が薄い）がより自然に見える</li>
        </ul>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">カラー別の印象と選び方</h2>
      <div className="space-y-4 mb-6">
        {[
          {
            color: 'ダークブラウン', emoji: '🤎',
            desc: '最もバレにくいナチュラル系の定番。日本人の瞳の色（こげ茶）に近く、使い方を選ばない。',
            scene: '職場・学校・普段使い・初めてのカラコンに最適', rakuten: 'ナチュラル カラコン ダークブラウン',
          },
          {
            color: 'ライトブラウン・ヘーゼル', emoji: '🍂',
            desc: '少し明るめのブラウン。裸眼より瞳が明るく見え、透明感が増す。外国人風の抜け感が出る。',
            scene: 'デートカジュアル・休日使い・ナチュラル盛り', rakuten: 'カラコン ヘーゼル ナチュラル',
          },
          {
            color: 'グレー', emoji: '🩶',
            desc: '知的でクールな印象。チャコール〜シルバーまで幅広いトーン。暗めグレーはより自然に見える。',
            scene: 'モードスタイル・クール系ファッションに', rakuten: 'カラコン グレー ナチュラル',
          },
          {
            color: 'オリーブ・カーキ', emoji: '🌿',
            desc: 'くすみ感のあるトレンドカラー。ブラウン系と合わせやすく、深みのある個性的な瞳に。',
            scene: 'トレンド・韓国系メイク・秋冬スタイルに', rakuten: 'カラコン オリーブ カーキ',
          },
        ].map(c => (
          <div key={c.color} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{c.emoji}</span>
              <p className="font-bold text-gray-800">{c.color}</p>
            </div>
            <p className="text-sm text-gray-700 mb-1">{c.desc}</p>
            <p className="text-xs text-gray-400 mb-3">おすすめシーン：{c.scene}</p>
            <AffiliateBtnR rakuten={c.rakuten} label={`${c.color}カラコンを楽天で見る`} />
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">シーン・季節別の選び方</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-pink-50"><th className="p-3 border border-gray-200 text-left">シーン</th><th className="p-3 border border-gray-200 text-left">おすすめカラー</th><th className="p-3 border border-gray-200 text-left">着色直径</th></tr></thead>
          <tbody>
            {[
              { scene: '職場・学校（厳格ルール）', color: 'ダークブラウン', dia: '13.4〜13.8mm' },
              { scene: '普段使い', color: 'ブラウン・ヘーゼル', dia: '13.8〜14.0mm' },
              { scene: 'デート・カジュアル', color: 'ライトブラウン・グレー', dia: '14.0〜14.2mm' },
              { scene: '春夏', color: 'ヘーゼル・クリアブラウン', dia: '13.8mm前後' },
              { scene: '秋冬', color: 'ダークブラウン・オリーブ・グレー', dia: '14.0〜14.2mm' },
            ].map(r => (
              <tr key={r.scene} className="border-b border-gray-100">
                <td className="p-3 border border-gray-200 font-medium text-sm">{r.scene}</td>
                <td className="p-3 border border-gray-200 text-pink-700 text-sm">{r.color}</td>
                <td className="p-3 border border-gray-200 text-gray-600 text-xs">{r.dia}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">おすすめナチュラル系ブランド</h2>
      <div className="space-y-3 mb-4">
        {[
          { name: 'エバーカラーワンデーナチュラル', point: '日本製・薬機法承認。透明感のある発色と高酸素透過性の両立。', rakuten: 'エバーカラーワンデー ナチュラル' },
          { name: 'ReVIA（レヴィア）ナチュラルシリーズ', point: '着色直径13.6〜13.8mmのナチュラルラインが充実。マンスリータイプで経済的。', rakuten: 'ReVIA カラコン ナチュラル' },
          { name: 'Chu\'s Me（チューズミー）', point: 'シアー発色で重くならない軽い仕上がり。グラデーションデザインが自然に馴染む。', rakuten: 'チューズミー カラコン ナチュラル' },
        ].map(b => (
          <div key={b.name} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-bold text-gray-800 text-sm mb-1">{b.name}</p>
            <p className="text-xs text-gray-600 mb-2">{b.point}</p>
            <AffiliateBtnR rakuten={b.rakuten} label={`${b.name}を楽天で見る`} />
          </div>
        ))}
      </div>
    </article>
  ),

  // ─── 5. 韓国ブランドランキング ────────────────────────────
  'korea-karakon-ranking-2026': (
    <article className="prose-sm max-w-none text-gray-700 leading-relaxed" id="article-body">
      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">韓国カラコンが人気な理由</h2>
      <p className="mb-4">K-POP・韓国コスメブームに乗って、韓国発のカラコンブランドが日本でも急速に広まっています。韓国カラコンの特徴は<strong>①デザインの豊富さ②トレンドの早さ③比較的リーズナブルな価格帯</strong>です。</p>
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {[
          { title: 'デザイン数', desc: 'K-POPアイドルも着用するトレンドデザインが豊富', emoji: '✨' },
          { title: 'トレンド対応', desc: '流行のカラーやデザインへの対応が早い', emoji: '🔥' },
          { title: '価格帯', desc: '日本ブランドより比較的リーズナブルなものが多い', emoji: '💰' },
        ].map(f => (
          <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <span className="text-2xl">{f.emoji}</span>
            <p className="font-bold text-gray-800 text-sm mt-2 mb-1">{f.title}</p>
            <p className="text-xs text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">日本向け正規品と並行輸入品の違い</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="font-bold text-amber-800 mb-2">重要：日本での販売ルール</p>
        <p className="text-sm text-amber-700">韓国ブランドでも<strong>日本国内で販売するには薬機法の承認が必要</strong>です。楽天・Amazon・公式サイトで販売されている日本向け正規品は承認取得済みです。海外ECサイトからの個人輸入は自己責任となります。</p>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">日本で人気の韓国カラコンブランドランキング2026</h2>
      <div className="space-y-4 mb-6">
        {[
          {
            rank: 1,
            name: 'OLENS（オーレンズ）',
            origin: '韓国',
            features: ['豊富なカラー・デザイン展開', '日本向け正規品あり（薬機法承認済み）', 'K-POPアイドルにも人気のブランド'],
            price: '10枚入り¥1,200〜',
            rakuten: 'OLENS オーレンズ カラコン 日本',
          },
          {
            rank: 2,
            name: 'Lensme（レンズミー）',
            origin: '韓国',
            features: ['ナチュラル系に強いブランド', 'うるっとした自然な瞳に仕上がる', '1dayタイプで衛生的'],
            price: '10枚入り¥1,500〜',
            rakuten: 'レンズミー Lensme カラコン',
          },
          {
            rank: 3,
            name: 'VIVI RING（ビビリング）',
            origin: '韓国',
            features: ['ナチュラルハーフ系が人気', '着色直径14.0〜14.2mmで使いやすい', '豊富なブラウン・グレー系'],
            price: '10枚入り¥1,200〜',
            rakuten: 'カラコン 韓国 ナチュラル ハーフ',
          },
        ].map(b => (
          <div key={b.rank} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-full bg-rose-500 text-white font-bold text-sm flex items-center justify-center shrink-0">{b.rank}</span>
              <div>
                <p className="font-bold text-gray-800">{b.name}</p>
                <span className="text-xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded">{b.origin}発</span>
              </div>
            </div>
            <ul className="text-xs text-gray-700 space-y-1 mb-3">
              {b.features.map(f => <li key={f} className="flex gap-1"><span className="text-rose-400">•</span>{f}</li>)}
            </ul>
            <p className="text-xs text-red-600 font-bold mb-2">{b.price}</p>
            <AffiliateBtnR rakuten={b.rakuten} label={`${b.name}を楽天で見る`} />
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">韓国カラコンを日本で安全に購入する方法</h2>
      <div className="space-y-2 mb-4">
        {[
          { step: '①', text: '楽天市場・Amazon Japan の正規販売店から購入する' },
          { step: '②', text: 'パッケージに日本語表記・承認番号があることを確認する' },
          { step: '③', text: '初めて使う場合は眼科で目の状態（BC）を測定してから購入する' },
          { step: '④', text: '使用後に違和感があれば直ちに外し、眼科を受診する' },
        ].map(s => (
          <div key={s.step} className="flex gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            <span className="font-bold text-rose-600 shrink-0">{s.step}</span>
            <span className="text-gray-700">{s.text}</span>
          </div>
        ))}
      </div>
      <AffiliateBtnR rakuten="韓国 カラコン 日本正規品" label="韓国カラコンを楽天で見る" />
    </article>
  ),

  // ─── 7. 度ありカラコンの選び方 ───────────────────────────────
  'karakon-do-ari-erabikata': (
    <article className="prose-sm max-w-none text-gray-700 leading-relaxed" id="article-body">
      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">度ありカラコンとは</h2>
      <p className="mb-4">度ありカラコン（度付きカラーコンタクトレンズ）は、視力矯正機能とカラーリング機能を兼ね備えたコンタクトレンズです。近視・乱視の方でもメガネを外してカラコンを楽しめるのが最大のメリットです。</p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-pink-50"><th className="p-3 border border-gray-200 text-left">項目</th><th className="p-3 border border-gray-200 text-left">度なしカラコン</th><th className="p-3 border border-gray-200 text-left">度ありカラコン</th></tr></thead>
          <tbody>
            {[
              { item: '視力矯正', wo: 'なし', w: 'あり（近視・乱視対応）' },
              { item: '処方箋', wo: '不要（推奨）', w: '必要' },
              { item: '価格', wo: '比較的安い', w: '度なしより高め' },
              { item: 'デザイン種類', wo: '多い', w: '度なしより少ない' },
              { item: '対象者', wo: '視力が良い方', w: '近視・乱視の方' },
            ].map(r => (
              <tr key={r.item} className="border-b border-gray-100">
                <td className="p-3 border border-gray-200 font-medium text-sm">{r.item}</td>
                <td className="p-3 border border-gray-200 text-gray-500 text-xs">{r.wo}</td>
                <td className="p-3 border border-gray-200 text-pink-700 text-xs font-medium">{r.w}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">眼科で処方箋を取る手順</h2>
      <p className="mb-3">度ありカラコンは必ず眼科での処方が必要です。以下の流れで処方箋・装用指示書を取得してください。</p>
      <div className="space-y-3 mb-6">
        {[
          { step: '①', title: '眼科を受診', desc: '「カラコンを使いたい」と伝える。視力・BC・DIAを測定してもらう。' },
          { step: '②', title: '試着・フィッティング', desc: 'カラコンを実際に装着して目に合うか確認。異物感・フィット感をチェック。' },
          { step: '③', title: '処方箋・装用指示書を受け取る', desc: '有効期限（多くは1〜3年）を確認。通販サイトにアップロードして使用可能。' },
          { step: '④', title: 'オンラインで購入', desc: '処方通りのBC・度数・ブランドで注文。処方と異なるものは購入しない。' },
        ].map(s => (
          <div key={s.step} className="flex gap-3 bg-white border border-gray-200 rounded-xl p-4">
            <span className="font-bold text-pink-600 shrink-0 text-lg">{s.step}</span>
            <div>
              <p className="font-bold text-gray-800 text-sm mb-1">{s.title}</p>
              <p className="text-xs text-gray-600">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">度数・BCの見方</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-pink-50"><th className="p-3 border border-gray-200 text-left">記号</th><th className="p-3 border border-gray-200 text-left">意味</th><th className="p-3 border border-gray-200 text-left">目安・注意点</th></tr></thead>
          <tbody>
            {[
              { sym: 'PWR / D（度数）', mean: '近視補正の強さ。マイナスが近視', note: 'コンタクトとメガネで度数は異なる。眼科処方に従う' },
              { sym: 'BC（ベースカーブ）', mean: 'レンズの曲率。角膜の丸みに合わせる', note: '8.5〜9.0mmが一般的。BCが合わないとズレやすい' },
              { sym: 'DIA（直径）', mean: 'レンズ全体のサイズ', note: '度ありは14.0〜14.5mmが多い' },
              { sym: 'CYL（乱視度数）', mean: '乱視の強さ（負の値）', note: '乱視カラコンは取り扱いブランドが限られる' },
              { sym: 'AXIS（乱視軸）', mean: '乱視の方向（0〜180度）', note: '乱視カラコン専用パラメータ' },
            ].map(r => (
              <tr key={r.sym} className="border-b border-gray-100">
                <td className="p-3 border border-gray-200 font-bold text-pink-700 text-xs">{r.sym}</td>
                <td className="p-3 border border-gray-200 text-xs">{r.mean}</td>
                <td className="p-3 border border-gray-200 text-gray-500 text-xs">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">度ありカラコン おすすめブランドランキング2026</h2>
      <div className="space-y-4 mb-6">
        {[
          {
            rank: 1, name: 'エバーカラーワンデー（度あり）', bc: '8.7mm', dia: '14.2mm', pwr: '-0.50〜-10.00',
            point: '日本製・薬機法承認。高酸素透過性で長時間でも快適。ナチュラル系カラーが充実。度数展開が広い。',
            price: '30枚入り¥2,200〜', rakuten: 'エバーカラーワンデー 度あり カラコン',
          },
          {
            rank: 2, name: 'ReVIA（レヴィア）ワンデー（度あり）', bc: '8.6mm', dia: '14.2mm', pwr: '-0.50〜-8.00',
            point: '国産ブランド。ナチュラルからトレンドカラーまで幅広い。ワンデータイプで衛生的。',
            price: '10枚入り¥1,600〜', rakuten: 'ReVIA レヴィア 度あり カラコン',
          },
          {
            rank: 3, name: 'FLANMY（フランミー）ワンデー（度あり）', bc: '8.6mm', dia: '14.2mm', pwr: '-0.50〜-6.00',
            point: 'ガーリーでトレンド感のあるデザイン。度あり対応で視力矯正しながらおしゃれを楽しめる。',
            price: '10枚入り¥1,480〜', rakuten: 'フランミー 度あり カラコン',
          },
          {
            rank: 4, name: 'TOPARDS（トパーズ）（度あり）', bc: '8.7mm', dia: '14.2mm', pwr: '-0.50〜-8.00',
            point: '指原莉乃プロデュース。発色が良くデザイン性が高い。ワンデータイプで使い捨て衛生的。',
            price: '10枚入り¥1,500〜', rakuten: 'TOPARDS トパーズ 度あり',
          },
        ].map(p => (
          <div key={p.rank} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-full bg-pink-600 text-white font-bold text-sm flex items-center justify-center shrink-0">{p.rank}</span>
              <div>
                <p className="font-bold text-gray-800">{p.name}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {[`BC${p.bc}`, `DIA${p.dia}`, `度数${p.pwr}`].map(t => (
                    <span key={t} className="text-xs bg-pink-50 text-pink-700 px-2 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-700 mb-2">{p.point}</p>
            <p className="text-xs text-red-600 font-bold mb-2">{p.price}</p>
            <AffiliateBtnR rakuten={p.rakuten} label={`${p.name}を楽天で見る`} />
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">通販での買い方</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <p className="font-bold text-blue-800 mb-2">度ありカラコン通販の流れ</p>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal pl-4">
          <li>眼科で処方箋または装用指示書を取得する</li>
          <li>楽天・公式サイトなどで処方通りのBC・度数を選ぶ</li>
          <li>処方箋を指定の方法でアップロード・FAX送付</li>
          <li>承認後に発送される（通常1〜3営業日）</li>
          <li>届いたらパッケージの度数・BCを再確認してから使用</li>
        </ol>
      </div>
      <AffiliateBtnR rakuten="度あり カラコン ワンデー 楽天" label="度ありカラコンを楽天で探す" />
    </article>
  ),

  // ─── 8. 長時間装用カラコン ────────────────────────────────────
  'karakon-long-wear-osusume': (
    <article className="prose-sm max-w-none text-gray-700 leading-relaxed" id="article-body">
      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">長時間装用で目が疲れる3つの原因</h2>
      <p className="mb-4">カラコンを長時間つけ続けると目が乾いたり、充血したりする原因は主に3つあります。</p>
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {[
          { cause: '酸素不足', icon: '😮‍💨', desc: 'レンズが角膜への酸素供給を妨げる。酸素透過性が低いレンズほど影響が大きい。' },
          { cause: '水分蒸発', icon: '💧', desc: '高含水率レンズは目の水分を吸収してしまう。装用時間が長いほど乾燥が進む。' },
          { cause: 'レンズの汚れ', icon: '🔬', desc: '涙のタンパク質・脂質がレンズに付着。視界が曇り目への刺激にもなる。' },
        ].map(c => (
          <div key={c.cause} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <span className="text-2xl">{c.icon}</span>
            <p className="font-bold text-gray-800 text-sm mt-2 mb-1">{c.cause}</p>
            <p className="text-xs text-gray-500">{c.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">疲れにくいカラコンの選び方</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-pink-50"><th className="p-3 border border-gray-200 text-left">チェックポイント</th><th className="p-3 border border-gray-200 text-left">長時間向きの選択</th><th className="p-3 border border-gray-200 text-left">理由</th></tr></thead>
          <tbody>
            {[
              { check: '酸素透過性（Dk/t）', good: '20以上を選ぶ', why: '角膜への酸素供給が多いほど疲れにくい' },
              { check: '含水率', good: '低含水率（38〜46%）を選ぶ', why: '高含水率は目の水分を吸収しやすくドライアイになりがち' },
              { check: '素材', good: 'シリコーンハイドロゲル系が理想', why: '酸素透過性が従来素材の5〜10倍高い' },
              { check: '使い捨て期間', good: 'ワンデータイプを選ぶ', why: '毎日新しいレンズを使用するため汚れが蓄積しない' },
              { check: '含水補助成分', good: 'MPCポリマー・ヒアルロン酸配合', why: '涙に近い成分が含まれ、乾燥を防ぐ効果が期待できる' },
            ].map(r => (
              <tr key={r.check} className="border-b border-gray-100">
                <td className="p-3 border border-gray-200 font-medium text-sm">{r.check}</td>
                <td className="p-3 border border-gray-200 text-pink-700 text-xs font-medium">{r.good}</td>
                <td className="p-3 border border-gray-200 text-gray-500 text-xs">{r.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">長時間装用向け おすすめカラコン TOP5（2026）</h2>
      <div className="space-y-4 mb-6">
        {[
          {
            rank: 1, name: 'エバーカラーワンデーモイスト', dkt: '約29', water: '40%低含水', type: '1day',
            point: '独自の保湿成分「MPCポリマー」配合で長時間うるおいが続く。高酸素透過性で角膜への負担が少ない。',
            rakuten: 'エバーカラーワンデー モイスト 長時間',
          },
          {
            rank: 2, name: 'ReVIA ワンデー（低含水）', dkt: '約21', water: '38%低含水', type: '1day',
            point: '低含水率設計で目の水分を奪いにくい。ヒアルロン酸・ポリビニルアルコール配合で乾きに強い。',
            rakuten: 'ReVIA カラコン ワンデー 乾きにくい',
          },
          {
            rank: 3, name: 'Chu\'s me（チューズミー）ワンデー', dkt: '約20', water: '38%低含水', type: '1day',
            point: 'シリカハイドロゲル素材でうるおいと酸素供給を両立。発色は自然なシアーカラーでナチュラル派に人気。',
            rakuten: 'チューズミー カラコン 長時間',
          },
          {
            rank: 4, name: 'エンジェルカラーワンデー モイスト', dkt: '約22', water: '40%', type: '1day',
            point: 'MPCポリマー・ポビドン配合。長時間装用向けに設計されたモイストシリーズ。度あり対応。',
            rakuten: 'エンジェルカラー ワンデー モイスト',
          },
          {
            rank: 5, name: 'FLANMY（フランミー）ワンデー', dkt: '約21', water: '40%低含水', type: '1day',
            point: 'UVカット機能搭載。屋外でも快適な長時間装用が可能。人気のトレンドカラーが豊富。',
            rakuten: 'フランミー ワンデー UVカット 長時間',
          },
        ].map(p => (
          <div key={p.rank} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-full bg-pink-500 text-white font-bold text-sm flex items-center justify-center shrink-0">{p.rank}</span>
              <div>
                <p className="font-bold text-gray-800">{p.name}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {[p.type, `Dk/t ${p.dkt}`, p.water].map(t => (
                    <span key={t} className="text-xs bg-pink-50 text-pink-700 px-2 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-700 mb-3">{p.point}</p>
            <AffiliateBtnR rakuten={p.rakuten} label={`${p.name}を楽天で見る`} />
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">装用時間を延ばすための5つのコツ</h2>
      <div className="space-y-2 mb-6">
        {[
          { tip: 'コンタクト用点眼薬を持ち歩く', desc: 'ヒアルロン酸・コンドロイチン配合の点眼薬を使うと乾燥感を緩和できる。人工涙液タイプが安心。' },
          { tip: 'パソコン作業中は意識的にまばたきをする', desc: '集中すると瞬きが減少し目が乾燥しやすい。20分に1回、20秒間20フィート先を見る「20-20-20ルール」が有効。' },
          { tip: 'エアコンや扇風機の風を直接当てない', desc: '乾燥した空気が目に直接当たると水分蒸発が早まる。席の配置や加湿器で対策する。' },
          { tip: '装用前に目薬をさしておく', desc: '装用前に目を潤しておくことで、最初から乾燥しにくい状態を作れる。' },
          { tip: '就寝4時間前には必ず外す', desc: '睡眠中の装用は眼科医が強く禁忌とする。就寝2〜4時間前には外して目を休ませる。' },
        ].map(t => (
          <div key={t.tip} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-bold text-gray-800 text-sm mb-1">{t.tip}</p>
            <p className="text-xs text-gray-600">{t.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <p className="font-bold text-amber-800 mb-1">⚠️ 長時間装用の限界</p>
        <p className="text-sm text-amber-700">カラコンの推奨装用時間を超えての使用は、角膜酸素不足・感染リスク・角膜新生血管などの深刻なトラブルにつながります。どうしても長時間使用が必要な場合は眼科に相談してください。</p>
      </div>
      <AffiliateBtnR rakuten="カラコン 長時間 乾きにくい ワンデー" label="長時間対応カラコンを楽天で見る" />
    </article>
  ),

  // ─── 6. アンバサダー記事（Web検索で事実確認済み）───────────
  'karakon-ambassador-brands': (
    <article className="prose-sm max-w-none text-gray-700 leading-relaxed" id="article-body">
      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">公式アンバサダー・公式モデルとは？</h2>
      <p className="mb-4">カラコンブランドの「公式アンバサダー」「公式イメージモデル」「プロデューサー」とは、ブランドと正式な契約を結んで活動する方のことです。この記事では<strong>ブランド公式サイト・PR TIMES公式プレスリリース・公式SNSで正式発表されている情報のみ</strong>を掲載しています。「愛用者」「使っていると言われている」という情報は一切掲載しません。</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="font-bold text-amber-800 mb-1">📌 掲載基準</p>
        <p className="text-sm text-amber-700">本記事はすべてPR TIMES・公式サイト・公式SNSの公式発表に基づきます。アンバサダーは随時変更される可能性があるため、最新情報は各ブランドの公式サイトをご確認ください。</p>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">公式発表済み：ブランド別アンバサダー一覧（2026年版）</h2>
      <p className="mb-4">以下は、PR TIMES・公式サイト・公式SNSで正式発表が確認できたブランドのみを掲載しています。</p>

      <div className="space-y-4 mb-8">
        {[
          {
            brand: 'ReVIA（レヴィア）',
            model: 'KIM CHAEWON（キム・チェウォン）/ LE SSERAFIM',
            source: 'PR TIMES 株式会社Lcode（2026年1月14日）',
            note: '2026年1月よりReVIA 10周年を機に新ミューズとして正式発表。新色・リニューアルパッケージも同日発売。',
            rakuten: 'ReVIA レヴィア カラコン',
            tag: '2026年最新',
          },
          {
            brand: 'EverColor（エバーカラー）',
            model: '新木優子',
            source: 'PR TIMES 株式会社アイセイ（2022年3月28日）',
            note: '2022年よりブランドミューズとして就任。2024年7月には新木優子初プロデュース色「ローズミューズ・ティアーミューズ」を発売。',
            rakuten: 'エバーカラー 新木優子 カラコン',
            tag: '継続中',
          },
          {
            brand: 'eRouge（エルージュ）',
            model: '紺野彩夏',
            source: 'PR TIMES 株式会社アイセイ（2026年7月1日）',
            note: '2026年7月に新ミューズ就任を正式発表。新色2色を同日発売。',
            rakuten: 'エルージュ カラコン',
            tag: '2026年最新',
          },
          {
            brand: 'FLANMY（フランミー）',
            model: '佐々木希',
            source: 'PR TIMES 株式会社T-Garden（継続発表）',
            note: 'ブランド発売当初よりイメージモデルとして継続起用。2024・2025・2026年も新色リリースのたびにPR TIMESにて公式発表。',
            rakuten: 'FLANMY フランミー 佐々木希 カラコン',
            tag: '継続中',
          },
          {
            brand: 'candy magic（キャンディーマジック）',
            model: '鈴木愛理',
            source: 'PR TIMES 株式会社Lcode（2020年10月19日）',
            note: '2020年10月に「新イメージモデルに鈴木愛理さん起用」を正式発表。現在も継続中。',
            rakuten: 'キャンディーマジック 鈴木愛理 カラコン',
            tag: '継続中',
          },
          {
            brand: 'FruFru（フルフル）',
            model: 'FRUITS ZIPPER（全7名）',
            source: 'PR TIMES 株式会社Lcode（2025年4月22日）',
            note: 'メンバー7名がそれぞれ1色をプロデュース（計7色）。candy magic公式通販で販売。',
            rakuten: 'フルフル FRUITS ZIPPER カラコン',
            tag: '2025年〜',
          },
          {
            brand: 'TOPARDS（トパーズ）',
            model: '指原莉乃',
            source: '公式サイト topards.jp・PR TIMES PIA株式会社',
            note: '指原莉乃がプロデューサー兼イメージモデル。2019年5月10日ブランド開始。2025・2026年も新色継続展開中。',
            rakuten: 'TOPARDS トパーズ カラコン',
            tag: '継続中',
          },
          {
            brand: 'Chu\'s me（チューズミー）',
            model: 'ゆうこす（菅本裕子）',
            source: '公式サイト chusme.jp',
            note: 'プロデューサー兼イメージモデル。公式サイトに「ゆうこすプロデュースカラコン」と明記。2026年も新色継続発売中。',
            rakuten: 'チューズミー ゆうこす カラコン',
            tag: '継続中',
          },
          {
            brand: 'loveil（ラヴェール）',
            model: '倖田來未',
            source: '公式サイト loveil.jp・PR TIMES 株式会社T-Garden',
            note: '「倖田來未デザインプロデュースカラコン」として2012年ブランド開始。2022年10周年・2025年も新色継続。',
            rakuten: 'ラヴェール 倖田來未 カラコン',
            tag: '継続中',
          },
          {
            brand: 'エンジェルカラー バンビシリーズ',
            model: '益若つばさ',
            source: '公式サイト angelcolor.jp',
            note: 'プロデューサー兼イメージモデル。Angel Colorブランド全体をプロデュース。',
            rakuten: 'エンジェルカラー バンビ カラコン',
            tag: '継続中',
          },
          {
            brand: 'LuMia（ルミア）',
            model: '森絵梨佳',
            source: '公式サイト lumia-cl.jp',
            note: '公式サイトタイトルに「森絵梨佳イメージモデル」と明記。フリュー株式会社のブランド。',
            rakuten: 'ルミア LuMia カラコン',
            tag: '継続中',
          },
          {
            brand: 'U.P.D.（アプデ）',
            model: '藤田ニコル（にこるん）',
            source: 'PR TIMES フリュー株式会社・WWDJAPAN',
            note: 'フリュー株式会社とのコラボでプロデュースブランドとして発足。2024年6月新色発売のリリース確認。',
            rakuten: 'カラコン 藤田ニコル',
            tag: '継続中',
          },
        ].map(b => (
          <div key={b.brand} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="font-bold text-gray-800">{b.brand}</p>
              <span className="text-xs bg-pink-50 text-pink-700 px-2 py-0.5 rounded shrink-0">{b.tag}</span>
            </div>
            <p className="text-sm font-medium text-pink-700 mb-1">🌟 {b.model}</p>
            <p className="text-xs text-gray-500 mb-1">出典：{b.source}</p>
            <p className="text-xs text-gray-600 mb-3">{b.note}</p>
            <AffiliateBtnR rakuten={b.rakuten} label={`${b.brand}を楽天で見る`} />
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">アンバサダー起用ブランドを選ぶメリット</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {[
          { feature: '信頼性・ブランド力', desc: '著名人が名前を出すため、品質基準・薬機法への適合に配慮している可能性が高い' },
          { feature: 'コラボ限定色', desc: 'アンバサダーとのコラボ新色が定期的にリリースされる' },
          { feature: '公式サポート体制', desc: '正規流通ルートが整備されており、返品・問い合わせ対応も安心' },
          { feature: 'トレンド対応', desc: 'アンバサダーのスタイルに合わせたカラー展開が充実' },
        ].map(f => (
          <div key={f.feature} className="bg-white border border-pink-100 rounded-xl p-4">
            <p className="font-bold text-pink-700 text-sm mb-1">{f.feature}</p>
            <p className="text-xs text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
        <p className="text-xs text-gray-500">※ アンバサダーの起用状況はブランドにより随時変更される場合があります。最新情報は各ブランドの公式サイトをご確認ください。本記事の情報はPR TIMES・公式サイト・公式SNSに基づき2026年7月時点のものです。</p>
      </div>
      <AffiliateBtnR rakuten="カラコン 公式 おすすめ 日本製" label="カラコンを楽天でまとめて見る" />
    </article>
  ),
};
