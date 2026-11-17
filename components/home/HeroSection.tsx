import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-sky-50 to-white px-4 py-12 md:py-20">
      <div className="mx-auto flex max-w-5xl flex-col-reverse items-center gap-10 md:flex-row md:gap-14">
        <div className="w-full text-center md:w-1/2 md:text-left">
          <p className="mb-3 text-sm font-semibold text-sky-600">
            あなたの「見える」を、もっと快適に
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
            コンタクトレンズの価格、
            <br />
            どこがお得か比べよう。
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-slate-600 md:text-base">
            いつものレンズを、1箱の価格・年間コスト・購入先で比較できます。
            <br className="hidden md:block" />
            度数やBCなどの条件は、眼科で確認した製品と照らし合わせて選びましょう。
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <a
              href="/category/1day"
              className="inline-block rounded-full bg-sky-600 px-8 py-3.5 font-bold text-white transition-colors hover:bg-sky-700 no-underline"
            >
              ワンデーの1箱価格・購入先を比較 →
            </a>
            <a
              href="/category/2week"
              className="inline-block rounded-full border border-sky-200 bg-white px-8 py-3.5 font-bold text-sky-700 transition-colors hover:bg-sky-50 no-underline"
            >
              2ウィークの価格も比較 →
            </a>
          </div>
        </div>

        <div className="w-full max-w-xs md:w-1/2 md:max-w-md">
          <div className="overflow-hidden rounded-2xl shadow-sm">
            <Image
              src="/images/hero/hero-woman.webp"
              alt="青空を見上げる女性。コンタクトレンズの価格と購入先を比較するレンズナビ"
              width={900}
              height={900}
              priority
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
