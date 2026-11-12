import type { Metadata } from "next";
import Link from "next/link";
import { publicDB } from "@/lib/db";
import OfferCard from "@/components/OfferCard";

export const metadata: Metadata = {
  title: "عروض ووجبات التوفير | مطعم شاورما وبروستد مأكولات الشام",
  description:
    "أقوى عروض وولائم التوفير من مطعم شاورما وبروستد مأكولات الشام بمدينة بدر: فرخة بروستد عائلية، كومبو شاورما عربي، وجبة ماريا موتزاريلا، وبوكس نصف كيلو شاورما.",
  openGraph: {
    images: ["/og-offers.jpg?v=1"],
  },
};

export default async function OffersPage() {
  const data = await publicDB();
  const offers = data.offers.filter((o) => o.isActive);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Header Banner */}
      <div className="rounded-[32px] bg-gradient-to-l from-[#B90D12] to-[#780508] text-white p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-lg">
        <div className="text-right">
          <span className="inline-block rounded-full bg-[#FFD21A] text-[#111111] px-3.5 py-1 text-xs font-black mb-2.5">
            عروض التوفير • مأكولات الشام
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            عروض وولائم مأكولات الشام بمدينة بدر
          </h1>
          <p className="mt-2 text-xs sm:text-base text-[#FFF8E8]/88 font-semibold max-w-2xl leading-relaxed">
            اختار العرض المناسب ليك ولعيلتك من وجبات الشاورما العربي، الماريا، والفراخ البروستد والمشوية — تُحضّر طازجة فور الطلب.
          </p>
        </div>

        <Link
          href="/menu"
          className="rounded-full bg-[#FFD21A] hover:bg-white text-[#111111] font-black text-xs sm:text-sm px-6 py-3 transition shrink-0"
        >
          تصفح المنيو الكامل ←
        </Link>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {offers.map((o) => (
          <OfferCard key={o.id} offer={o} />
        ))}
      </div>

      {/* Catering Callout */}
      <div className="rounded-[28px] bg-white border border-[#B90D12]/20 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-[#111111]">
            عندك عزومة كبيرة أو طلب شركة أو مصنع في مدينة بدر؟
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-[#111111]/70 mt-1">
            نجهز طلبات الولائم والفراخ المشوية والبروستد والشاورما بالكيلو في الموعد المحدد بالضبط.
          </p>
        </div>
        <Link href="/occasions" className="btn btn-primary text-xs sm:text-sm shrink-0">
          احجز طلب عزومة أو شركة
        </Link>
      </div>
    </div>
  );
}
