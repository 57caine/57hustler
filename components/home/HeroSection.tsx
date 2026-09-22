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
            目の悩みに寄り添う
            <br />
            情報とアイテムを。
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-slate-600 md:text-base">
            コンタクト・カラコン・メガネから、目のケアや最新の医療情報まで。
            <br className="hidden md:block" />
            あなたにぴったりの選択が見つかる、目の総合情報サイトです。
          </p>
          <a
            href="/ranking"
            className="inline-block rounded-full bg-sky-600 px-8 py-3.5 font-bold text-white transition-colors hover:bg-sky-700 no-underline"
          >
            人気のコンタクトレンズを見てみる →
          </a>
        </div>

        <div className="w-full max-w-xs md:w-1/2 md:max-w-md">
          <div className="overflow-hidden rounded-2xl shadow-sm">
            <Image
              src="/images/hero/hero-woman.webp"
              alt="青空を見上げる女性。レンズナビは目の悩みに寄り添う情報とアイテムを紹介します"
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
