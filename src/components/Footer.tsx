"use client";

import Link from "next/link";
import type { PublicData } from "@/lib/db";
import { ExternalLinkIcon, PhoneIcon, PinIcon, QrCodeIcon, WhatsAppIcon } from "./icons";

const ALL_ORDER_PHONES = [
  "01023182006",
  "01122060877",
  "01554545824",
  "01228722219",
  "01114101253",
];

export default function Footer({ data }: { data: PublicData }) {
  const { settings, branches } = data;
  const mainBranch = branches[0];
  const phones = settings.orderPhones?.length ? settings.orderPhones : ALL_ORDER_PHONES;

  const openQrModal = () => {
    window.dispatchEvent(new CustomEvent("open-menu-qr"));
  };

  return (
    <footer className="relative mt-14 px-2.5 sm:px-6 lg:px-8 pb-5 select-none overflow-x-clip">
      <div className="mx-auto max-w-7xl">
        {/* =========================================================================
            LAFET SHAMIA INVERSE FRAMED FOOTER:
            Outer Sham Red (`#B90D12`) Frame -> Inner Warm Cream (`#FFF8E8`) Card ->
            3 Columns + Hotlines -> Giant Full-Width Arabic Wordmark "مأكولات الشام"
           ========================================================================= */}
        <div className="rounded-[32px] sm:rounded-[42px] bg-gradient-to-b from-[#B90D12] to-[#780508] p-3 sm:p-5 shadow-[0_24px_60px_-20px_rgba(120,5,8,0.55)]">
          <div className="rounded-[24px] sm:rounded-[34px] bg-[#FFF8E8] text-[#111111] overflow-hidden border border-[#FFD21A]/35">
            {/* Top Brand Strip inside Cream Card (Logo Left شمال, Actions Right يمين) */}
            <div
              dir="ltr"
              className="px-5 sm:px-9 pt-6 pb-5 border-b border-[#B90D12]/12 flex flex-wrap items-center justify-between gap-4"
            >
              <Link href="/" className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-horizontal.webp"
                  alt="شاورما وبروستد مأكولات الشام"
                  className="h-11 sm:h-13 w-auto object-contain"
                />
              </Link>

              <div className="flex flex-wrap items-center gap-2" dir="rtl">
                <a
                  href={`https://wa.me/${mainBranch?.whatsapp ?? "201023182006"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#B90D12] hover:bg-[#780508] text-white px-4 py-2 text-xs font-black inline-flex items-center gap-1.5 transition"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>اطلب عبر واتساب</span>
                </a>
                <button
                  type="button"
                  onClick={openQrModal}
                  className="rounded-full bg-[#FFD21A] hover:bg-[#F2A900] text-[#111111] px-4 py-2 text-xs font-black inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <QrCodeIcon className="w-4 h-4 text-[#B90D12]" />
                  <span>باركود المنيو QR</span>
                </button>
                <a
                  href={settings.menuPdfUrl || "/menu/maakolat-alsham-menu.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white hover:bg-[#F5D8A0] text-[#111111] border border-[#111111]/12 px-3.5 py-2 text-xs font-black inline-flex items-center gap-1.5 transition"
                >
                  <span>منيو PDF</span>
                  <ExternalLinkIcon className="w-3.5 h-3.5 text-[#B90D12]" />
                </a>
              </div>
            </div>

            {/* 3 Editorial Columns (`المنيو` | `اكتشف` | `تابعنا وتواصل معنا`) */}
            <div className="px-5 sm:px-9 py-7 sm:py-9 grid grid-cols-1 sm:grid-cols-3 gap-7 sm:gap-8 text-right">
              {/* Column 1: المنيو */}
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#111111] pb-2 border-b border-[#B90D12]/12">
                  المنيو
                </h3>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm font-bold text-[#111111]/78">
                  <li>
                    <Link href="/menu" className="hover:text-[#B90D12] transition-colors">
                      منيو مأكولات الشام الكامل
                    </Link>
                  </li>
                  <li>
                    <Link href="/menu?cat=shawarma_sandwiches" className="hover:text-[#B90D12] transition-colors">
                      سندوتشات الشاورما السوري
                    </Link>
                  </li>
                  <li>
                    <Link href="/menu?cat=shawarma_meals" className="hover:text-[#B90D12] transition-colors">
                      وجبات الشاورما والعربي والماريا
                    </Link>
                  </li>
                  <li>
                    <Link href="/menu?cat=broasted" className="hover:text-[#B90D12] transition-colors">
                      الفراخ البروستد والمشوية
                    </Link>
                  </li>
                  <li>
                    <Link href="/menu?cat=fatteh" className="hover:text-[#B90D12] transition-colors">
                      فتة الشاورما والموتزاريلا والبيتزا
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: اكتشف */}
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#111111] pb-2 border-b border-[#B90D12]/12">
                  اكتشف
                </h3>
                <ul className="mt-3 space-y-2 text-xs sm:text-sm font-bold text-[#111111]/78">
                  <li>
                    <Link href="/offers" className="hover:text-[#B90D12] transition-colors">
                      عروض ووجبات التوفير
                    </Link>
                  </li>
                  <li>
                    <Link href="/occasions" className="hover:text-[#B90D12] transition-colors">
                      عزومات وطلبات الشركات بمدينة بدر
                    </Link>
                  </li>
                  <li>
                    <Link href="/branches" className="hover:text-[#B90D12] transition-colors">
                      عنوان الفرع وخريطة إيجل مول
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-[#B90D12] transition-colors">
                      قصة مطعم مأكولات الشام
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-[#B90D12] transition-colors">
                      تواصل معنا والروابط الرسمية
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: تابعنا وأرقام الطلبات */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#111111] pb-2 border-b border-[#B90D12]/12">
                    تابعنا وتواصل معنا
                  </h3>
                  <ul className="mt-3 space-y-2 text-xs sm:text-sm font-bold text-[#111111]/78">
                    <li>
                      <a
                        href={settings.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#B90D12] transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>فيسبوك الرسمي (+15 ألف متابع)</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href={settings.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#B90D12] transition-colors"
                      >
                        إنستجرام (@Maakolat_AlshamEG)
                      </a>
                    </li>
                    <li>
                      <a
                        href={settings.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#B90D12] transition-colors"
                      >
                        تيك توك (@maakolat_alsham)
                      </a>
                    </li>
                    {settings.linktree && (
                      <li>
                        <a
                          href={settings.linktree}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#B90D12] transition-colors"
                        >
                          شجرة الروابط الرسمية (Linktree)
                        </a>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Branch Address & All 5 Order Hotlines */}
                <div className="rounded-2xl bg-white border border-[#B90D12]/15 p-3.5 space-y-2">
                  <div className="flex items-start gap-1.5 text-xs font-extrabold text-[#111111]">
                    <PinIcon className="w-4 h-4 text-[#B90D12] shrink-0 mt-0.5" />
                    <span>مدينة بدر — ميدان النسر — إيجل مول بجوار البنك الأهلي</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1" dir="ltr">
                    {phones.map((ph) => (
                      <a
                        key={ph}
                        href={`tel:${ph}`}
                        className="inline-flex items-center gap-1 rounded-full bg-[#FFF8E8] hover:bg-[#B90D12] text-[#111111] hover:text-white border border-[#B90D12]/20 px-2.5 py-1 text-[11px] font-en font-extrabold transition"
                      >
                        <PhoneIcon className="w-3 h-3 text-[#B90D12]" />
                        <span>{ph}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* GIANT FULL-WIDTH ARABIC WORDMARK AT BOTTOM OF CREAM CARD (Matching Lafet Shamia Reference) */}
            <div className="w-full overflow-hidden px-3 pt-1 pb-3 sm:pb-5 border-t border-[#B90D12]/10 text-center">
              <div className="text-[13.5vw] sm:text-[11.2vw] lg:text-[124px] font-black leading-[0.95] tracking-tight text-[#B90D12] whitespace-nowrap">
                مأكولات الشام
              </div>
            </div>
          </div>

          {/* Outer Sham Red Frame Bottom Copyright + Admin + Powered by Chameleon */}
          <div className="px-3 sm:px-6 pt-4 pb-1 flex flex-col lg:flex-row items-center justify-between gap-3 text-xs text-white/85 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-1.5 sm:gap-3">
              <span className="font-bold text-white">
                جميع الحقوق محفوظة — مطعم شاورما وبروستد مأكولات الشام • مدينة بدر
              </span>
              <div className="flex items-center justify-center gap-2 text-[11px] text-[#FFF8E8]/85">
                <span>أرقام الطلبات: 01023182006 • 01122060877</span>
                <span className="opacity-50">•</span>
                <Link
                  href="/admin"
                  className="font-extrabold text-[#FFD21A] hover:underline transition-colors"
                >
                  لوحة تحكم الإدارة
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5" dir="ltr">
              <span className="text-[11px] font-bold text-white/75 whitespace-nowrap">
                © {new Date().getFullYear()} MAAKOLAT AL SHAM
              </span>
              <a
                href="https://chameleon.vision/"
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="group inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-black/25 hover:bg-black/45 text-white border border-white/20 hover:border-[#FFD21A]/60 transition-all duration-200 shadow-xs whitespace-nowrap"
              >
                <span className="text-[11px] font-semibold tracking-wide text-white/85 group-hover:text-white whitespace-nowrap">
                  Powered by
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/chameleon-logo.webp"
                  alt="Chameleon"
                  className="h-4 w-auto object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
                />
                <span className="text-xs font-black tracking-wider text-[#FFD21A] whitespace-nowrap">
                  Chameleon
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
