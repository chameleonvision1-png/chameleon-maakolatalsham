import type { Metadata } from "next";
import { publicDB } from "@/lib/db";
import BranchesShowcase from "@/components/BranchesShowcase";
import OpenQrButton from "@/components/OpenQrButton";
import { ExternalLinkIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";

const branchesTitle = "عنوان وأرقام فروع مأكولات الشام — مدينة بدر | شاورما وبروستد مأكولات الشام";
const branchesDescription =
  "عنوان مطعم شاورما وبروستد مأكولات الشام في مدينة بدر: ميدان النسر – إيجل مول – بجوار البنك الأهلي. أرقام الطلبات والتوصيل السريع لكل أحياء مدينة بدر (01023182006 • 01122060877 • 01554545824).";

export const metadata: Metadata = {
  title: "عنواننا ونطاق التوصيل في مدينة بدر",
  description: branchesDescription,
  alternates: {
    canonical: "/branches",
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://maakolatalsham.chameleon.vision/branches",
    siteName: "شاورما وبروستد مأكولات الشام | Maakolat Al Sham",
    title: branchesTitle,
    description: branchesDescription,
    images: [
      {
        url: "/og-branches.jpg?v=1",
        width: 1200,
        height: 630,
        alt: "فرع مأكولات الشام — مدينة بدر إيجل مول بجوار البنك الأهلي",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: branchesTitle,
    description: branchesDescription,
    images: ["/og-branches.jpg?v=1"],
  },
};

export default async function BranchesPage() {
  const { branches } = await publicDB();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-14">
      {/* Sham Red Hero Banner */}
      <div className="rounded-[32px] bg-gradient-to-br from-[#B90D12] to-[#780508] text-white p-6 sm:p-10 shadow-[0_18px_40px_-16px_rgba(185,13,18,0.42)] border border-[#FFD21A]/25 flex flex-col md:flex-row md:items-end justify-between gap-6 relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#FFD21A]/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative z-10 text-right">
          <span className="inline-block rounded-full bg-[#FFD21A] text-[#111111] px-3.5 py-1 text-xs font-black mb-3">
            ميدان النسر • إيجل مول • بجوار البنك الأهلي
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white text-right">
            فرع مأكولات الشام بمدينة بدر ونطاق التوصيل
          </h1>
          <p className="text-[#FFF8E8]/85 mt-2 text-xs sm:text-base max-w-2xl font-semibold text-right leading-relaxed">
            نرحب بكم في مطعم شاورما وبروستد مأكولات الشام بمدينة بدر — استلم طلبك ساخنًا من إيجل مول أو اطلب التوصيل السريع لكل أحياء ومجاورات مدينة بدر.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 shrink-0 flex-wrap" dir="ltr">
          <OpenQrButton label="باركود المنيو QR" />
          <a
            href="tel:01023182006"
            className="inline-flex items-center gap-2 rounded-full bg-[#FFD21A] hover:bg-white text-[#111111] font-en font-black text-xs sm:text-sm px-5 py-3 transition"
          >
            <PhoneIcon className="w-4 h-4 text-[#B90D12]" />
            <span>01023182006</span>
          </a>
          <a
            href="tel:01122060877"
            className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white hover:text-[#111111] text-white border border-white/25 font-en font-black text-xs sm:text-sm px-5 py-3 transition"
          >
            <PhoneIcon className="w-4 h-4" />
            <span>01122060877</span>
          </a>
        </div>
      </div>

      {/* Interactive Branch & Delivery Zones Showcase */}
      <div className="mt-8">
        <BranchesShowcase branches={branches} />
      </div>

      {/* Embedded Map & Dual Official Google Maps Links */}
      <div className="mt-8 grid lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 rounded-[32px] bg-white border border-[#B90D12]/20 p-4 sm:p-6 shadow-xs flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-black text-lg sm:text-xl text-[#111111]">
                موقع مطعم مأكولات الشام على الخريطة
              </h2>
              <p className="text-xs sm:text-sm text-[#111111]/70 font-semibold mt-0.5">
                مدينة بدر — ميدان النسر — إيجل مول — بجوار البنك الأهلي (30.1412974, 31.7120895)
              </p>
            </div>
            <PinIcon className="w-6 h-6 text-[#B90D12] shrink-0" />
          </div>

          <div className="rounded-[24px] overflow-hidden border border-[#B90D12]/15 bg-[#FFF8E8] aspect-[16/10]">
            <iframe
              title="موقع مطعم شاورما وبروستد مأكولات الشام — مدينة بدر إيجل مول"
              src="https://maps.google.com/maps?q=30.1412974,31.7120895&hl=ar&z=16&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <a
              href="https://maps.app.goo.gl/yppGXhG2HLR3QvucA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#B90D12] hover:bg-[#780508] text-white px-4 py-2.5 text-xs font-black transition"
            >
              <PinIcon className="w-3.5 h-3.5" />
              <span>فتح الموقع عبر رابط Facebook الرسمي</span>
              <ExternalLinkIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://maps.app.goo.gl/n3hLmXqPW8pTVGiG6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF8E8] hover:bg-[#FFD21A] text-[#111111] border border-[#B90D12]/25 px-4 py-2.5 text-xs font-black transition"
            >
              <PinIcon className="w-3.5 h-3.5 text-[#B90D12]" />
              <span>فتح الموقع عبر رابط Linktree الرسمي</span>
              <ExternalLinkIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Direct WhatsApp + Second Branch Info */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="rounded-[32px] bg-[#111111] text-white p-6 sm:p-8 flex-1 flex flex-col justify-between border border-[#FFD21A]/20">
            <div>
              <span className="inline-block rounded-full bg-[#FFD21A] text-[#111111] px-3 py-1 text-[11px] font-black mb-3">
                طلب سريع عبر واتساب
              </span>
              <h2 className="font-black text-xl sm:text-2xl text-white">
                اطلب من الموقع وتابع طلبك مباشرة مع كاشير مأكولات الشام
              </h2>
              <p className="text-xs sm:text-sm text-white/80 mt-2.5 leading-relaxed font-semibold">
                اختار وجباتك وسندوتشاتك من المنيو التفاعلي بالأحجام والإضافات اللي تحبها، وهتوصلك فاتورة طلبك جاهزة ومفصلة على واتساب الفرع فورًا.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-[#FFD21A]">
                الرقم المؤكد للطلبات والواتساب
              </span>
              <a
                href="https://wa.me/201023182006"
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="inline-flex items-center gap-2 rounded-full bg-[#B90D12] hover:bg-[#FFD21A] text-white hover:text-[#111111] font-en font-black text-xs sm:text-sm px-5 py-2.5 shadow-sm transition"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp: 01023182006</span>
              </a>
            </div>
          </div>

          <div className="rounded-[28px] bg-white border border-[#B90D12]/20 p-6">
            <h3 className="font-black text-base sm:text-lg text-[#B90D12]">
              تنويه بخصوص فروع شاورما وبروستد مأكولات الشام
            </h3>
            <p className="text-xs sm:text-sm text-[#111111]/75 mt-2 leading-relaxed font-semibold">
              يمتلك مطعم شاورما وبروستد مأكولات الشام فرعين لخدمة عملائه، وتختص هذه المنصة الرسمية بمنيو وطلبات وتوصيل{" "}
              <b className="text-[#111111]">فرع مدينة بدر (ميدان النسر – إيجل مول – بجوار البنك الأهلي)</b>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
