import type { Metadata } from "next";
import Link from "next/link";
import OpenQrButton from "@/components/OpenQrButton";
import { PhoneIcon } from "@/components/icons";

const aboutTitle = "عن شاورما وبروستد مأكولات الشام — مدينة بدر | ألذ طعم وأحلى مذاق";
const aboutDescription =
  "تعرف على قصة مطعم شاورما وبروستد مأكولات الشام في مدينة بدر (ميدان النسر – إيجل مول – بجوار البنك الأهلي): أصل الشاورما السوري عالصاج، البروستد الذهبي المقرمش، المشويات، والفتة الشامية.";

export const metadata: Metadata = {
  title: "قصتنا | عن شاورما وبروستد مأكولات الشام",
  description: aboutDescription,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://maakolatalsham.chameleon.vision/about",
    siteName: "شاورما وبروستد مأكولات الشام | Maakolat Al Sham",
    title: aboutTitle,
    description: aboutDescription,
    images: [
      {
        url: "/og-about.jpg?v=1",
        width: 1200,
        height: 630,
        alt: "عن مطعم شاورما وبروستد مأكولات الشام — مدينة بدر",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: aboutTitle,
    description: aboutDescription,
    images: ["/og-about.jpg?v=1"],
  },
};

const pillars = [
  {
    code: "/01",
    en: "AUTHENTIC SYRIAN SAJ SHAWARMA",
    title: "خبز صاج حار وشاورما متبلة على أصولها",
    text: "في شاورما وبروستد مأكولات الشام بنحضر سيخ الشاورما الفراخ واللحم يوميًا بتتبيلة شامية متوازنة، وبيتلف في عيش صاج طازة بيتحمص عالصاج قدامك مع الثومية الكريمي والمخلل المقرمش عشان يوصلك بألذ طعم وأحلى مذاق.",
    img: "/images/hero/bento-saj-dome.webp",
  },
  {
    code: "/02",
    en: "LOADED ARABIC PLATTERS & FATTAH",
    title: "وجبات شاورما عربي، ماريا، وفتة شامية غنية",
    text: "سواء بتحب وجبة الشاورما العربي العادي أو الدبل أو السوبر دبل مع البطاطس الذهبية والثومية، أو بتعشق الفتة الشامية بالرز البسمتي والعيش المحمص والموتزاريلا والمشروم — كل وجبة عندنا مليانة بالخيرات ومشبعة بجد.",
    img: "/images/hero/bento-arabi-platter.webp",
  },
  {
    code: "/03",
    en: "GOLDEN CRISPY BROASTED & CHARCOAL GRILL",
    title: "فراخ بروستد ذهبية مقرمشة وفراخ مشوية عالفحم",
    text: "مش بس شاورما؛ مطعم مأكولات الشام في مدينة بدر بيقدم وجبات البروستد المقرمش (عادي وسبايسي) من 4 قطع لحد 20 قطعة للعيلة، مع الفراخ المشوية بالتتبيلة الشامية، الكريسبي، الزنجر، والبيتزا والمعجنات الطازجة.",
    img: "/images/hero/hero-broasted-platter.webp",
  },
];

export default function AboutPage() {
  return (
    <div className="pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        {/* Hero Card Featuring the Circular Seal Crest (/logo-seal.webp) */}
        <div className="rounded-[32px] bg-gradient-to-br from-[#B90D12] to-[#780508] text-white p-6 sm:p-12 flex flex-col md:flex-row items-center gap-8 shadow-[0_20px_44px_-16px_rgba(185,13,18,0.45)] border border-[#FFD21A]/25 relative overflow-hidden">
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#FFD21A]/15 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#FFF8E8]/10 p-2 ring-2 ring-[#FFD21A]/60 shrink-0 shadow-2xl grid place-items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-seal.webp"
              alt="شعار شاورما وبروستد مأكولات الشام"
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>

          <div className="relative z-10 flex-1 w-full text-right">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFD21A] text-[#111111] px-4 py-1 text-xs font-black mb-3">
              <span>ألذ طعم وأحلى مذاق • +15,000 متابع في مدينة بدر</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-white leading-tight text-right">
              شاورما وبروستد مأكولات الشام — نكهات أصيلة بلا فذلكة
            </h1>
            <p className="text-[#FFF8E8]/90 mt-3 text-sm sm:text-lg max-w-3xl leading-relaxed font-semibold text-right">
              من قلب مدينة بدر في ميدان النسر (إيجل مول – بجوار البنك الأهلي)، بنقدم لأهلنا كل يوم أصل الشاورما السوري عالصاج، الفراخ البروستد المقرمشة، الفراخ المشوية، الفتة، والبيتزا بمكونات طازجة وسخونة واصلة لحد باب بيتك.
            </p>
            <div className="mt-6 flex items-center gap-3 flex-wrap">
              <Link
                href="/menu"
                className="rounded-full bg-[#FFD21A] hover:bg-white text-[#111111] font-black text-xs sm:text-sm px-6 py-3 transition shadow-sm"
              >
                تصفح منيو مأكولات الشام
              </Link>
              <a
                href="tel:01023182006"
                dir="ltr"
                className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white hover:text-[#111111] text-white border border-white/25 font-en font-black text-xs sm:text-sm px-5 py-3 transition"
              >
                <PhoneIcon className="w-4 h-4" />
                <span>01023182006</span>
              </a>
              <OpenQrButton label="باركود المنيو QR" />
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            { num: "+15K", label: "متابع يثق في مأكولات الشام" },
            { num: "9 أقسام", label: "شاورما، بروستد، مشويات، فتة، وبيتزا" },
            { num: "+60 صنف", label: "تشكيلة كاملة لكل الأذواق والعائلات" },
            { num: "إيجل مول", label: "ميدان النسر – بجوار البنك الأهلي – بدر" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[26px] bg-white border border-[#B90D12]/18 p-5 text-center shadow-xs"
            >
              <div className="text-2xl sm:text-3xl font-black text-[#B90D12]">{item.num}</div>
              <div className="text-xs sm:text-sm font-extrabold text-[#111111]/75 mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Editorial Story Pillars */}
        <div className="mt-8 space-y-6">
          {pillars.map((b, i) => (
            <div
              key={b.code}
              className={`rounded-[32px] bg-white border border-[#B90D12]/18 p-6 sm:p-10 grid md:grid-cols-2 gap-8 items-center shadow-xs ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="rounded-[26px] bg-[#FFF8E8] border border-[#B90D12]/12 aspect-[16/10] overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.img}
                  alt={b.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#B90D12] mb-2">
                  <span dir="ltr" className="font-en tracking-widest">
                    {b.code} • {b.en}
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-[#111111] text-right leading-snug">
                  {b.title}
                </h2>
                <p className="text-[#111111]/75 leading-8 mt-3 text-sm sm:text-base font-semibold text-right">
                  {b.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-10 rounded-[32px] bg-[#FFD21A] p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-5 border border-[#F2A900]">
          <div className="text-right">
            <h3 className="text-xl sm:text-2xl font-black text-[#111111]">
              جعان؟ شاورما وبروستد مأكولات الشام جاهز لطلبك الآن
            </h3>
            <p className="text-xs sm:text-sm font-bold text-[#111111]/80 mt-1">
              اختار من المنيو التفاعلي واطلب توصيل سريع لأي مكان في مدينة بدر.
            </p>
          </div>
          <Link
            href="/menu"
            className="rounded-full bg-[#B90D12] hover:bg-[#780508] text-white font-black text-sm sm:text-base px-8 py-3.5 shrink-0 transition shadow-md"
          >
            اطلب الآن من المنيو
          </Link>
        </div>
      </div>
    </div>
  );
}
