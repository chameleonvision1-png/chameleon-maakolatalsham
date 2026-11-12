import type { Metadata } from "next";
import Link from "next/link";
import { publicDB } from "@/lib/db";
import OccasionForm from "@/components/OccasionForm";
import OpenQrButton from "@/components/OpenQrButton";
import { ExternalLinkIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";

const contactTitle = "أرقام الطلبات والتواصل الرسمي | شاورما وبروستد مأكولات الشام — مدينة بدر";
const contactDescription =
  "تواصل مع مطعم شاورما وبروستد مأكولات الشام بمدينة بدر (ميدان النسر – إيجل مول – بجوار البنك الأهلي): أرقام الطلبات 01023182006 • 01122060877 • 01554545824 • 01228722219 • 01114101253 وواتساب وصفحاتنا الرسمية.";

export const metadata: Metadata = {
  title: "أرقام الطلبات وتواصل معنا",
  description: contactDescription,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://maakolatalsham.chameleon.vision/contact",
    siteName: "شاورما وبروستد مأكولات الشام | Maakolat Al Sham",
    title: contactTitle,
    description: contactDescription,
    images: [
      {
        url: "/og-contact.jpg?v=1",
        width: 1200,
        height: 630,
        alt: "تواصل مع مطعم شاورما وبروستد مأكولات الشام — مدينة بدر 01023182006",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: contactTitle,
    description: contactDescription,
    images: ["/og-contact.jpg?v=1"],
  },
};

const ORDER_PHONES = [
  { number: "01023182006", badge: "الرقم الأساسي والواتساب" },
  { number: "01122060877", badge: "خط طلبات Linktree والمنيو" },
  { number: "01554545824", badge: "خط طلبات Linktree والمنيو" },
  { number: "01228722219", badge: "خط طلبات إضافي بالمنيو" },
  { number: "01114101253", badge: "خط طلبات إضافي بالمنيو" },
];

const FAQS = [
  {
    q: "أين يقع مطعم شاورما وبروستد مأكولات الشام في مدينة بدر؟",
    a: "يقع الفرع في مدينة بدر — ميدان النسر — إيجل مول — بجوار البنك الأهلي، مع خدمة توصيل سريع لكافة أحياء ومجاورات مدينة بدر.",
  },
  {
    q: "كيف أطلب من الموقع؟",
    a: "أضف السندوتشات أو وجبات الشاورما والبروستد والفتة إلى السلة مع تحديد الحجم والإضافات، ثم أدخل اسمك وعنوانك واضغط تأكيد الطلب ليتم إرسال الفاتورة جاهزة مباشرة إلى واتساب الفرع (01023182006).",
  },
  {
    q: "هل تتوفر طلبات عائلية وعزومات كبيرة؟",
    a: "نعم، نوفر وجبات عائلية حتى 20 قطعة بروستد وصواني شاورما عربي وفتة، ويمكنك طلب تسعيرة عزومة أو مناسبة خاصة من نموذج الطلبات بالأسفل أو عبر صفحة العزومات.",
  },
];

export default async function ContactPage() {
  const { branches, settings } = await publicDB();

  return (
    <div className="pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        {/* Hero with Circular Seal Crest (/logo-seal.webp) */}
        <div className="rounded-[32px] bg-gradient-to-br from-[#B90D12] to-[#780508] text-white p-6 sm:p-10 shadow-[0_18px_40px_-16px_rgba(185,13,18,0.42)] border border-[#FFD21A]/25 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#FFD21A]/15 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 text-right">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-seal.webp"
              alt="شعار شاورما وبروستد مأكولات الشام"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain shrink-0 drop-shadow-lg"
            />
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white text-right">
                أرقام الطلبات والروابط الرسمية لمأكولات الشام
              </h1>
              <p className="text-[#FFF8E8]/85 mt-2 text-xs sm:text-base max-w-2xl font-semibold text-right leading-relaxed">
                اطلب مباشرة عبر الهاتف أو واتساب من فرع مدينة بدر (ميدان النسر – إيجل مول – بجوار البنك الأهلي)، وتابع أحدث عروض شاورما وبروستد مأكولات الشام على منصاتنا الرسمية.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2.5 shrink-0 flex-wrap" dir="ltr">
            <OpenQrButton label="باركود المنيو QR" />
            <a
              href="https://wa.me/201023182006"
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="inline-flex items-center gap-2 rounded-full bg-[#111111] hover:bg-white text-[#FFD21A] hover:text-[#B90D12] border border-[#FFD21A]/40 font-en font-black text-xs sm:text-sm px-6 py-3 shadow-sm transition shrink-0"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp: 01023182006</span>
            </a>
          </div>
        </div>

        {/* All 5 Clickable Order Hotlines Hub */}
        <div className="mt-8 rounded-[32px] bg-white border border-[#B90D12]/20 p-5 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#B90D12]/12">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#111111]">
                أرقام الطلبات والتوصيل السريع — مدينة بدر
              </h2>
              <p className="text-xs sm:text-sm text-[#111111]/70 font-semibold mt-1">
                اضغط على أي رقم للاتصال الفوري بكاشير شاورما وبروستد مأكولات الشام:
              </p>
            </div>
            <a
              href="/menu/maakolat-alsham-menu.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#111111] hover:bg-[#B90D12] text-white font-black text-xs px-4 py-2.5 self-start sm:self-auto transition inline-flex items-center gap-1.5"
            >
              <span>تحميل المنيو الورقي PDF</span>
              <ExternalLinkIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="mt-5 flex overflow-x-auto snap-x snap-mandatory gap-3 no-scrollbar pb-1 sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:overflow-visible">
            {ORDER_PHONES.map((p, idx) => (
              <a
                key={p.number}
                href={`tel:${p.number}`}
                className={`w-[220px] sm:w-auto shrink-0 snap-start rounded-2xl p-4 border transition flex flex-col justify-between gap-2 ${
                  idx === 0
                    ? "bg-[#B90D12] hover:bg-[#780508] text-white border-[#B90D12]"
                    : "bg-[#FFF8E8] hover:bg-[#FFD21A] text-[#111111] border-[#B90D12]/20"
                }`}
              >
                <span
                  className={`text-[11px] font-extrabold ${
                    idx === 0 ? "text-[#FFD21A]" : "text-[#B90D12]"
                  }`}
                >
                  {p.badge}
                </span>
                <div className="flex items-center justify-between gap-2" dir="ltr">
                  <PhoneIcon className="w-4 h-4 shrink-0" />
                  <span className="font-en font-black text-base tracking-wide">
                    {p.number}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Official Social & Map Channels */}
          <div className="mt-6 pt-6 border-t border-[#B90D12]/12 grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <Link
              href="/menu"
              className="rounded-2xl bg-[#B90D12] hover:bg-[#780508] text-white p-4 font-black text-sm flex items-center justify-between shadow-xs transition"
            >
              <span>المنيو التفاعلي الكامل بالأسعار</span>
              <span>←</span>
            </Link>
            <Link
              href="/offers"
              className="rounded-2xl bg-[#FFD21A] hover:bg-[#F2A900] text-[#111111] p-4 font-black text-sm flex items-center justify-between shadow-xs transition"
            >
              <span>عروض ووجبات التوفير العائلية</span>
              <span>←</span>
            </Link>
            <a
              href={settings.linktree || "https://linktr.ee/MaakolatAlsham"}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-[#FFF8E8] hover:bg-[#B90D12] text-[#111111] hover:text-white border border-[#B90D12]/20 p-4 font-black text-sm flex items-center justify-between transition"
            >
              <span>شجرة الروابط الرسمية (Linktree)</span>
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
            <a
              href={settings.facebook || "https://www.facebook.com/profile.php?id=100064128211128"}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-[#FFF8E8] hover:bg-[#B90D12] text-[#111111] hover:text-white border border-[#B90D12]/20 p-4 font-black text-sm flex items-center justify-between transition"
            >
              <span>فيسبوك الرسمي (+15 ألف متابع)</span>
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
            <a
              href={settings.instagram || "https://www.instagram.com/Maakolat_AlshamEG"}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-[#FFF8E8] hover:bg-[#B90D12] text-[#111111] hover:text-white border border-[#B90D12]/20 p-4 font-black text-sm flex items-center justify-between transition"
            >
              <span>إنستجرام الرسمي (@Maakolat_AlshamEG)</span>
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
            <a
              href={settings.tiktok || "https://www.tiktok.com/@maakolat_alsham"}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-[#FFF8E8] hover:bg-[#B90D12] text-[#111111] hover:text-white border border-[#B90D12]/20 p-4 font-black text-sm flex items-center justify-between transition"
            >
              <span>تيك توك الرسمي (@maakolat_alsham)</span>
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
            <a
              href="https://maps.app.goo.gl/yppGXhG2HLR3QvucA"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-[#FFF8E8] hover:bg-[#FFD21A] text-[#111111] border border-[#B90D12]/20 p-4 font-black text-sm flex items-center justify-between transition sm:col-span-2 lg:col-span-3"
            >
              <span className="inline-flex items-center gap-2">
                <PinIcon className="w-4 h-4 text-[#B90D12]" />
                <span>العنوان على خرائط جوجل: مدينة بدر – ميدان النسر – إيجل مول – بجوار البنك الأهلي</span>
              </span>
              <ExternalLinkIcon className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>

        {/* Concise FAQ Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {FAQS.map((f) => (
            <div
              key={f.q}
              className="rounded-[26px] bg-white border border-[#B90D12]/18 p-5 sm:p-6 shadow-xs"
            >
              <h3 className="font-black text-sm sm:text-base text-[#B90D12]">{f.q}</h3>
              <p className="text-xs sm:text-sm text-[#111111]/75 font-semibold leading-relaxed mt-2">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Catering & Inquiry Form */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-8">
        <OccasionForm branches={branches} />
      </div>
    </div>
  );
}
