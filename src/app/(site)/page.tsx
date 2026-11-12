import type { Metadata } from "next";
import Link from "next/link";
import { publicDB } from "@/lib/db";
import ShamHero from "@/components/ShamHero";
import FavouritesShowcase from "@/components/FavouritesShowcase";
import ReviewsBannerCarousel from "@/components/ReviewsBannerCarousel";
import OfferCard from "@/components/OfferCard";
import BranchesShowcase from "@/components/BranchesShowcase";

export const metadata: Metadata = {
  title: "شاورما وبروستد مأكولات الشام — مدينة بدر | ألذ طعم وأحلى مذاق",
  description:
    "الموقع والمنيو الرسمي لمطعم شاورما وبروستد مأكولات الشام بمدينة بدر — ميدان النسر، إيجل مول، بجوار البنك الأهلي. اطلب الشاورما السوري عالصاج، الفراخ البروستد والمشوية، الفتة، والبيتزا أونلاين.",
  openGraph: {
    images: ["/og-image.jpg?v=1"],
  },
};

export default async function HomePage() {
  const data = await publicDB();
  const activeOffers = data.offers.filter((o) => o.isActive).slice(0, 4);

  return (
    <div className="w-full overflow-x-clip">
      {/* 1. ROUNDED SHAM RED HERO CARD (`لفّة شامية` 90/10 Reference Layout) */}
      <ShamHero />

      {/* 2. EDITORIAL MANIFESTO STRIP ON WARM CREAM (`#FFF8E8`) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-11 sm:py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#111111] leading-tight tracking-tight">
            نكهات أصيلة. مكونات طازجة. بلا فذلكة.
          </h2>
          <p className="mt-3.5 text-sm sm:text-base font-bold text-[#111111]/72 leading-relaxed">
            في <strong className="text-[#B90D12]">شاورما وبروستد مأكولات الشام</strong> بمدينة بدر، بنقدملك الطعم الشامي الأصيل من أول قضمة: عيش سوري مخبوز طازة عالصاج الحار، شاورما متبلة بخلطتنا الخاصة، ثومية كريمية غنية، وفراخ بروستد ومشوية تفتح النفس.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/about"
              className="rounded-full bg-[#F5D8A0] hover:bg-[#FFD21A] text-[#111111] px-6 py-2.5 text-xs sm:text-sm font-black transition"
            >
              اعرف المزيد عن مأكولات الشام
            </Link>
            <Link
              href="/menu"
              className="rounded-full bg-white hover:bg-[#B90D12] text-[#B90D12] hover:text-white border border-[#B90D12]/25 px-6 py-2.5 text-xs sm:text-sm font-black transition"
            >
              افتح المنيو الكامل
            </Link>
          </div>
        </div>
      </section>

      {/* 3. SPLIT 2-COLUMN EDITORIAL BENTO (`grid-cols-2` on Mobile & Desktop — Exact Reference Match) */}
      <section className="mx-auto max-w-7xl px-2.5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-5">
          {/* Right Card (RTL First): Dark Saj Dome Card (`خبز صاج حار`) */}
          <Link
            href="/menu?cat=shawarma_sandwiches"
            className="group relative rounded-[24px] sm:rounded-[34px] overflow-hidden min-h-[190px] sm:min-h-[340px] lg:min-h-[390px] bg-[#111111] flex flex-col justify-between p-3.5 sm:p-7 shadow-[0_18px_40px_-18px_rgba(17,17,17,0.45)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero/bento-saj-dome.webp"
              alt="خبز صاج حار في مطعم مأكولات الشام"
              className="absolute inset-0 w-full h-full object-cover object-center transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/75 via-transparent to-[#111111]/65" />

            <div className="relative z-10 text-right">
              <h3 className="text-lg sm:text-3xl lg:text-4xl font-black text-[#FFF8E8] drop-shadow-sm">
                خبز صاج حار
              </h3>
              <p className="hidden sm:block mt-1 text-xs sm:text-sm font-bold text-[#FFF8E8]/85">
                عيش سوري خفيف ومقرمش عالصاج لكل ساندوتش شاورما
              </p>
            </div>

            <div className="relative z-10 self-start">
              <span className="inline-flex items-center rounded-full bg-[#FFF8E8]/90 group-hover:bg-[#FFD21A] text-[#111111] px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-black transition">
                سندوتشات الشاورما ←
              </span>
            </div>
          </Link>

          {/* Left Card (RTL Second): Vibrant Golden-Yellow Card (`الملغومة بالخيرات`) */}
          <div className="rounded-[24px] sm:rounded-[34px] bg-[#FFD21A] text-[#111111] p-3.5 sm:p-7 flex flex-col items-center justify-between text-center min-h-[190px] sm:min-h-[340px] lg:min-h-[390px] shadow-[0_18px_40px_-18px_rgba(242,169,0,0.42)] overflow-hidden">
            <div>
              <h3 className="text-lg sm:text-3xl lg:text-4xl font-black text-[#111111] leading-tight">
                الملغومة بالخيرات
              </h3>
              <p className="mt-1 text-[10px] sm:text-sm font-extrabold text-[#111111]/75">
                وجبات شاورما عربي وماريا بالموتزاريلا مع البطاطس والثومية
              </p>
            </div>

            <Link
              href="/menu?cat=shawarma_meals"
              className="my-1.5 sm:my-3 w-full max-w-[390px] flex items-center justify-center group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero/bento-arabi-platter.webp"
                alt="وجبة شاورما عربي مأكولات الشام"
                className="w-full h-22 sm:h-44 lg:h-52 object-contain transition duration-500 group-hover:scale-105"
              />
            </Link>

            <Link
              href="/menu?cat=shawarma_meals"
              className="rounded-full bg-[#B90D12] hover:bg-[#780508] text-white px-4 sm:px-7 py-1.5 sm:py-2.5 text-[11px] sm:text-sm font-black shadow-md transition whitespace-nowrap"
            >
              شوف الوجبات العربي
            </Link>
          </div>
        </div>
      </section>

      {/* 4. WIDE SAJ SHAWARMA & BROASTED BANNER (Matches Wide Tray Photo Strip in Reference) */}
      <section className="mx-auto max-w-7xl px-2.5 sm:px-6 lg:px-8 pt-3 sm:pt-5">
        <div className="relative rounded-[26px] sm:rounded-[36px] overflow-hidden min-h-[175px] sm:min-h-[260px] lg:min-h-[300px] flex items-end p-5 sm:p-8 shadow-[0_18px_44px_-20px_rgba(17,17,17,0.35)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero/wide-saj-banner.webp"
            alt="شاورما وبروستد مأكولات الشام الطازجة"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/85 via-[#111111]/35 to-transparent" />

          <div className="relative z-10 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="text-right">
              <span className="inline-block rounded-full bg-[#FFD21A] text-[#111111] px-3 py-0.5 text-[11px] font-black mb-1.5">
                ألذ طعم وأحلى مذاق • مدينة بدر
              </span>
              <h3 className="text-xl sm:text-3xl font-black text-white">
                شاورما سوري، بروستد مقرمش، ومشويات عالفحم في مكان واحد
              </h3>
            </div>
            <Link
              href="/menu?cat=broasted"
              className="self-start sm:self-auto shrink-0 rounded-full bg-[#B90D12] hover:bg-[#FFD21A] text-white hover:text-[#111111] px-5 py-2.5 text-xs sm:text-sm font-black transition shadow-md"
            >
              اطلب البروستد والمشوي
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS CAROUSEL (`شاورمتنا وبروستدنا المفضل`) */}
      <FavouritesShowcase products={data.products} />

      {/* 6. CUSTOMER TESTIMONIALS (`كلام الناس فينا`) */}
      <ReviewsBannerCarousel reviews={data.reviews} />

      {/* 7. FAMILY & COMBO OFFERS PREVIEW */}
      {activeOffers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div className="text-right">
              <h2 className="text-2xl sm:text-4xl font-black text-[#111111]">
                عروض وولائم مأكولات الشام
              </h2>
              <p className="text-xs sm:text-sm font-bold text-[#111111]/65 mt-1">
                بوكسات التوفير للعيلة واللمة في مدينة بدر
              </p>
            </div>
            <Link
              href="/offers"
              className="self-start sm:self-auto rounded-full bg-white hover:bg-[#B90D12] text-[#B90D12] hover:text-white border border-[#B90D12]/25 px-5 py-2 text-xs font-black transition"
            >
              كل العروض ←
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeOffers.map((o) => (
              <OfferCard key={o.id} offer={o} />
            ))}
          </div>
        </section>
      )}

      {/* 8. EAGLE MALL BADR CITY BRANCH & DELIVERY ZONES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="text-2xl sm:text-4xl font-black text-[#111111]">
            فرع مأكولات الشام — مدينة بدر
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm font-bold text-[#111111]/65">
            ميدان النسر • إيجل مول • بجوار البنك الأهلي — شرفنا في الفرع أو اطلب توصيل لباب البيت
          </p>
        </div>
        <BranchesShowcase branches={data.branches} />
      </section>
    </div>
  );
}
