"use client";

import Link from "next/link";
import { useState } from "react";
import type { PublicData } from "@/lib/db";
import {
  ChevronDownIcon,
  ExternalLinkIcon,
  FacebookIcon,
  FileTextIcon,
  InstagramIcon,
  LinkIcon,
  PhoneIcon,
  PinIcon,
  QrCodeIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "./icons";

const ALL_ORDER_PHONES = [
  "01023182006",
  "01122060877",
  "01554545824",
  "01228722219",
  "01114101253",
];

const MENU_LINKS = [
  { href: "/menu", label: "المنيو الكامل" },
  { href: "/menu?cat=shawarma_sandwiches", label: "سندوتشات الشاورما" },
  { href: "/menu?cat=shawarma_meals", label: "العربي والماريا" },
  { href: "/menu?cat=broasted", label: "الفراخ البروستد" },
  { href: "/menu?cat=grilled", label: "الفراخ المشوية" },
  { href: "/menu?cat=fatteh", label: "الفتة والبيتزا" },
];

const DISCOVER_LINKS = [
  { href: "/", label: "الصفحة الرئيسية" },
  { href: "/offers", label: "عروض التوفير" },
  { href: "/occasions", label: "العزومات والشركات" },
  { href: "/branches", label: "فرع إيجل مول بدر" },
  { href: "/about", label: "قصة مأكولات الشام" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function Footer({ data }: { data: PublicData }) {
  const { settings, branches } = data;
  const mainBranch = branches[0];
  const phones = settings.orderPhones?.length ? settings.orderPhones : ALL_ORDER_PHONES;

  const [mobileOpen, setMobileOpen] = useState<"menu" | "discover" | "phones" | null>(null);
  const [desktopPhonesOpen, setDesktopPhonesOpen] = useState(false);

  const openQrModal = () => {
    window.dispatchEvent(new CustomEvent("open-menu-qr"));
  };

  const toggleMobile = (key: "menu" | "discover" | "phones") => {
    setMobileOpen((prev) => (prev === key ? null : key));
  };

  const socialItems = [
    {
      label: "فيسبوك",
      href: settings.facebook || "https://www.facebook.com/profile.php?id=100064128211128",
      icon: FacebookIcon,
    },
    {
      label: "إنستجرام",
      href: settings.instagram || "https://www.instagram.com/Maakolat_AlshamEG",
      icon: InstagramIcon,
    },
    {
      label: "تيك توك",
      href: settings.tiktok || "https://www.tiktok.com/@maakolat_alsham",
      icon: TikTokIcon,
    },
    {
      label: "Linktree",
      href: settings.linktree || "https://linktr.ee/MaakolatAlsham",
      icon: LinkIcon,
    },
  ];

  return (
    <footer className="relative mt-12 px-2.5 sm:px-6 lg:px-8 pb-6 select-none overflow-x-clip">
      <div className="mx-auto max-w-7xl">
        {/* =========================================================================
            SYMMETRICAL FRAMED FOOTER:
            Outer Sham Red (`#B90D12`) Frame -> Inner Warm Cream (`#FFF8E8`) Card ->
            Compact Dropdowns + Social Icons -> Unclipped Full Brand Wordmark
           ========================================================================= */}
        <div className="rounded-[30px] sm:rounded-[42px] bg-gradient-to-b from-[#B90D12] to-[#780508] p-3 sm:p-5 shadow-[0_24px_60px_-20px_rgba(120,5,8,0.55)]">
          <div className="rounded-[24px] sm:rounded-[34px] bg-[#FFF8E8] text-[#111111] overflow-hidden border border-[#FFD21A]/35">
            {/* 1. Symmetrical Top Brand & Quick Actions Strip */}
            <div className="px-4 sm:px-8 pt-6 pb-5 border-b border-[#B90D12]/12 flex flex-col lg:flex-row items-center justify-between gap-4">
              <Link href="/" className="shrink-0" dir="ltr">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-horizontal.webp"
                  alt="شاورما وبروستد مأكولات الشام"
                  className="h-12 sm:h-14 w-auto object-contain mx-auto"
                />
              </Link>

              {/* 3 Equal-Width Symmetrical Action Pills */}
              <div className="grid grid-cols-3 gap-2 w-full sm:w-auto sm:flex sm:items-center sm:justify-center">
                <a
                  href={`https://wa.me/${mainBranch?.whatsapp || "201023182006"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#B90D12] hover:bg-[#780508] text-white px-3 sm:px-4 py-2.5 text-xs font-black inline-flex items-center justify-center gap-1.5 transition shadow-2xs whitespace-nowrap"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#FFD21A] shrink-0" />
                  <span>واتساب</span>
                </a>

                <button
                  type="button"
                  onClick={openQrModal}
                  className="rounded-full bg-[#FFD21A] hover:bg-[#F2A900] text-[#111111] px-3 sm:px-4 py-2.5 text-xs font-black inline-flex items-center justify-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                >
                  <QrCodeIcon className="w-3.5 h-3.5 text-[#B90D12] shrink-0" />
                  <span>باركود QR</span>
                </button>

                <a
                  href={settings.menuPdfUrl || "/menu/maakolat-alsham-menu.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white hover:bg-[#B90D12] text-[#111111] hover:text-white border border-[#B90D12]/20 px-3 sm:px-4 py-2.5 text-xs font-black inline-flex items-center justify-center gap-1.5 transition whitespace-nowrap"
                >
                  <FileTextIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>منيو PDF</span>
                </a>
              </div>
            </div>

            {/* 2A. MOBILE & TABLET COMPACT DROPDOWNS (`lg:hidden`) */}
            <div className="lg:hidden px-4 py-5 space-y-2.5">
              {/* Dropdown 1: أقسام المنيو */}
              <div className="rounded-2xl bg-white border border-[#B90D12]/14 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleMobile("menu")}
                  aria-expanded={mobileOpen === "menu"}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs sm:text-sm font-black text-[#111111] cursor-pointer"
                >
                  <span>أقسام المنيو</span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-[#B90D12] transition-transform duration-200 ${
                      mobileOpen === "menu" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileOpen === "menu" && (
                  <div className="px-3 pb-3 pt-1 border-t border-[#B90D12]/10 grid grid-cols-2 gap-1.5">
                    {MENU_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-xl bg-[#FFF8E8] hover:bg-[#B90D12] text-[#111111] hover:text-white border border-[#B90D12]/12 px-2.5 py-2 text-xs font-extrabold text-center truncate transition"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropdown 2: صفحات الموقع */}
              <div className="rounded-2xl bg-white border border-[#B90D12]/14 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleMobile("discover")}
                  aria-expanded={mobileOpen === "discover"}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs sm:text-sm font-black text-[#111111] cursor-pointer"
                >
                  <span>اكتشف مأكولات الشام</span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-[#B90D12] transition-transform duration-200 ${
                      mobileOpen === "discover" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileOpen === "discover" && (
                  <div className="px-3 pb-3 pt-1 border-t border-[#B90D12]/10 grid grid-cols-2 gap-1.5">
                    {DISCOVER_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-xl bg-[#FFF8E8] hover:bg-[#B90D12] text-[#111111] hover:text-white border border-[#B90D12]/12 px-2.5 py-2 text-xs font-extrabold text-center truncate transition"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropdown 3: العنوان وأرقام الطلبات الخمسة */}
              <div className="rounded-2xl bg-white border border-[#B90D12]/14 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleMobile("phones")}
                  aria-expanded={mobileOpen === "phones"}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs sm:text-sm font-black text-[#111111] cursor-pointer"
                >
                  <span>العنوان وأرقام الطلبات (٥ خطوط)</span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-[#B90D12] shrink-0 transition-transform duration-200 ${
                      mobileOpen === "phones" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileOpen === "phones" && (
                  <div className="px-3 pb-3 pt-2 border-t border-[#B90D12]/10 space-y-2.5">
                    <a
                      href={mainBranch?.mapUrl || "https://maps.app.goo.gl/yppGXhG2HLR3QvucA"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-[#FFF8E8] border border-[#B90D12]/15 px-3 py-2 flex items-center justify-between gap-2 text-xs font-extrabold text-[#111111]"
                    >
                      <span className="flex items-center gap-1.5">
                        <PinIcon className="w-3.5 h-3.5 text-[#B90D12] shrink-0" />
                        <span>مدينة بدر — ميدان النسر — إيجل مول بجوار البنك الأهلي</span>
                      </span>
                      <ExternalLinkIcon className="w-3.5 h-3.5 text-[#B90D12] shrink-0" />
                    </a>

                    <div className="grid grid-cols-2 gap-1.5" dir="ltr">
                      {phones.map((ph, idx) => (
                        <a
                          key={ph}
                          href={`tel:${ph}`}
                          className={`rounded-xl py-2 px-2.5 flex items-center justify-center gap-1.5 text-xs font-en font-extrabold border transition ${
                            idx === 0
                              ? "col-span-2 bg-[#B90D12] text-white border-[#B90D12]"
                              : "bg-[#FFF8E8] hover:bg-[#FFD21A] text-[#111111] border-[#B90D12]/18"
                          }`}
                        >
                          <PhoneIcon className="w-3 h-3 shrink-0" />
                          <span>{ph}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Centered Symmetrical 4-Icon Official Social Bar */}
              <div className="pt-2 flex items-center justify-center gap-2.5">
                {socialItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      title={item.label}
                      className="w-11 h-11 rounded-full bg-white hover:bg-[#B90D12] text-[#111111] hover:text-white border border-[#B90D12]/18 grid place-items-center transition shadow-2xs"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* 2B. DESKTOP SYMMETRICAL 3-COLUMN LAYOUT (`hidden lg:grid`) */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-8 px-10 py-8 text-center items-start">
              {/* Column 1: المنيو */}
              <div>
                <h3 className="text-base font-black text-[#B90D12] pb-2.5 mb-3 border-b border-[#B90D12]/12">
                  المنيو
                </h3>
                <ul className="space-y-2 text-sm font-bold text-[#111111]/80">
                  {MENU_LINKS.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="hover:text-[#B90D12] transition">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: اكتشف */}
              <div>
                <h3 className="text-base font-black text-[#B90D12] pb-2.5 mb-3 border-b border-[#B90D12]/12">
                  اكتشف
                </h3>
                <ul className="space-y-2 text-sm font-bold text-[#111111]/80">
                  {DISCOVER_LINKS.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="hover:text-[#B90D12] transition">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: الفرع وأرقام الطلبات وتابعنا */}
              <div className="flex flex-col items-center">
                <h3 className="w-full text-base font-black text-[#B90D12] pb-2.5 mb-3 border-b border-[#B90D12]/12">
                  فرع مدينة بدر وتواصل معنا
                </h3>

                <a
                  href={mainBranch?.mapUrl || "https://maps.app.goo.gl/yppGXhG2HLR3QvucA"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-sm font-bold text-[#111111]/85 hover:text-[#B90D12] transition"
                >
                  <PinIcon className="w-4 h-4 text-[#B90D12] shrink-0" />
                  <span>ميدان النسر — إيجل مول بجوار البنك الأهلي</span>
                </a>

                {/* Compact Collapsible Phone Dropdown on Desktop */}
                <div className="mt-3 w-full max-w-xs rounded-2xl bg-white border border-[#B90D12]/16 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setDesktopPhonesOpen((v) => !v)}
                    aria-expanded={desktopPhonesOpen}
                    className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-black text-[#111111] hover:text-[#B90D12] transition cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <PhoneIcon className="w-3.5 h-3.5 text-[#B90D12]" />
                      <span>أرقام الطلبات ({phones.length} خطوط)</span>
                    </span>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-[#B90D12] transition-transform duration-200 ${
                        desktopPhonesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {desktopPhonesOpen && (
                    <div className="px-3 pb-3 pt-1.5 border-t border-[#B90D12]/10 grid grid-cols-2 gap-1.5" dir="ltr">
                      {phones.map((ph, idx) => (
                        <a
                          key={ph}
                          href={`tel:${ph}`}
                          className={`rounded-full py-1.5 px-2.5 text-xs font-en font-extrabold flex items-center justify-center gap-1 border transition ${
                            idx === 0
                              ? "col-span-2 bg-[#B90D12] text-white border-[#B90D12]"
                              : "bg-[#FFF8E8] hover:bg-[#FFD21A] text-[#111111] border-[#B90D12]/18"
                          }`}
                        >
                          <PhoneIcon className="w-3 h-3 shrink-0" />
                          <span>{ph}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Symmetrical 4-Icon Social Bar */}
                <div className="mt-4 flex items-center justify-center gap-2.5">
                  {socialItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        title={item.label}
                        className="w-10 h-10 rounded-full bg-white hover:bg-[#B90D12] text-[#111111] hover:text-white border border-[#B90D12]/18 grid place-items-center transition shadow-2xs"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. CENTERED, 100% UNCLIPPED FULL BRAND WORDMARK ("شاورما وبروستد مأكولات الشام") */}
            <div className="w-full px-4 sm:px-8 pt-4 pb-5 sm:pb-6 border-t border-[#B90D12]/10 flex flex-col items-center justify-center text-center">
              <span className="inline-block rounded-full bg-[#FFD21A] text-[#111111] px-4 py-0.5 text-xs sm:text-sm font-black tracking-wide mb-1.5">
                شاورما وبروستد
              </span>
              <div className="w-full text-[9.6vw] sm:text-[8.2vw] lg:text-[96px] font-black leading-[1.04] tracking-tight text-[#B90D12] text-center whitespace-nowrap">
                مأكولات الشام
              </div>
            </div>
          </div>

          {/* 4. Symmetrical Outer Bottom Bar (Safe Clearance from Floating Corner Buttons on Mobile) */}
          <div className="px-14 sm:px-6 pt-4 pb-1 flex flex-col lg:flex-row items-center justify-between gap-2.5 text-xs text-white/85 text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
              <span className="font-bold text-white">
                © {new Date().getFullYear()} شاورما وبروستد مأكولات الشام • مدينة بدر
              </span>
              <span className="opacity-45 hidden sm:inline">•</span>
              <Link
                href="/admin"
                className="font-extrabold text-[#FFD21A] hover:underline transition-colors"
              >
                لوحة الإدارة
              </Link>
            </div>

            <a
              href="https://chameleon.vision/"
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="group inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-black/25 hover:bg-black/45 text-white border border-white/20 hover:border-[#FFD21A]/60 transition-all duration-200 whitespace-nowrap"
            >
              <span className="text-[11px] font-semibold tracking-wide text-white/85 group-hover:text-white">
                Powered by
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/chameleon-logo.webp"
                alt="Chameleon"
                className="h-4 w-auto object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
              />
              <span className="text-xs font-black tracking-wider text-[#FFD21A]">
                Chameleon
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
