"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";
import { useStore } from "./store";
import { formatPrice } from "@/lib/format";
import {
  CartIcon,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  DownloadAppIcon,
  FacebookIcon,
  FileTextIcon,
  InstagramIcon,
  LinkIcon,
  MenuIcon,
  PhoneIcon,
  PinIcon,
  QrCodeIcon,
  ShareIosIcon,
  TikTokIcon,
  UtensilsIcon,
  WhatsAppIcon,
} from "./icons";
import MenuQrModal from "./MenuQrModal";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

declare global {
  interface Window {
    __pwaInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

const TOP_NAV = [
  { href: "/", label: "الرئيسية" },
  { href: "/menu", label: "المنيو" },
  { href: "/offers", label: "العروض" },
  { href: "/occasions", label: "العزومات" },
  { href: "/branches", label: "فرع بدر" },
  { href: "/contact", label: "تواصل معنا" },
];

const SITE_PAGES = [
  { href: "/", label: "الصفحة الرئيسية" },
  { href: "/offers", label: "العروض والتوفير" },
  { href: "/occasions", label: "عزومات مأكولات الشام" },
  { href: "/branches", label: "فرع إيجل مول بدر" },
  { href: "/about", label: "قصة مأكولات الشام" },
  { href: "/contact", label: "تواصل معنا" },
];

const QUICK_CATEGORIES = [
  { href: "/menu?cat=shawarma_sandwiches", label: "سندوتشات الشاورما" },
  { href: "/menu?cat=shawarma_meals", label: "العربي والماريا" },
  { href: "/menu?cat=broasted", label: "الفراخ البروستد" },
  { href: "/menu?cat=grilled", label: "الفراخ المشوية" },
  { href: "/menu?cat=fatteh", label: "الفتة والموتزاريلا" },
  { href: "/menu?cat=western", label: "السندوتشات الغربي" },
  { href: "/menu?cat=pizza", label: "البيتزا والفطائر" },
  { href: "/menu?cat=falafel_fries", label: "الفلافل والبطاطس" },
  { href: "/menu?cat=sides_drinks", label: "الثومية والمشروبات" },
];

const ORDER_PHONES = [
  "01023182006",
  "01122060877",
  "01554545824",
  "01228722219",
  "01114101253",
];

const SOCIAL_ITEMS = [
  {
    label: "فيسبوك",
    href: "https://www.facebook.com/profile.php?id=100064128211128",
    icon: FacebookIcon,
  },
  {
    label: "إنستجرام",
    href: "https://www.instagram.com/Maakolat_AlshamEG",
    icon: InstagramIcon,
  },
  {
    label: "تيك توك",
    href: "https://www.tiktok.com/@maakolat_alsham",
    icon: TikTokIcon,
  },
  {
    label: "Linktree",
    href: "https://linktr.ee/MaakolatAlsham",
    icon: LinkIcon,
  },
];

export default function Header() {
  const { count, subtotal, bump, hydrated, openPicker } = useStore();
  const pathname = usePathname();
  const isMenuPage = pathname?.startsWith("/menu") ?? false;

  const [drawerOpenPath, setDrawerOpenPath] = useState<string | null>(null);
  const drawerOpen = drawerOpenPath !== null && drawerOpenPath === pathname;
  const openDrawer = () => setDrawerOpenPath(pathname || "/");
  const closeDrawer = () => setDrawerOpenPath(null);

  const [qrOpen, setQrOpen] = useState(false);
  const [openSection, setOpenSection] = useState<"cats" | "pages" | "phones" | null>("cats");

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installedNow, setInstalledNow] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const isStandalone =
    installedNow ||
    (hydrated &&
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true));

  const isIosDevice =
    hydrated &&
    typeof window !== "undefined" &&
    (/iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) ||
      (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1));

  useEffect(() => {
    const openQrListener = () => setQrOpen(true);
    window.addEventListener("open-menu-qr", openQrListener);
    return () => window.removeEventListener("open-menu-qr", openQrListener);
  }, []);

  useLockBodyScroll(drawerOpen || showInstallGuide);

  useEffect(() => {
    if (!drawerOpen && !showInstallGuide) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpenPath(null);
        setShowInstallGuide(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, showInstallGuide]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const evt = e as BeforeInstallPromptEvent;
      window.__pwaInstallPrompt = evt;
      setDeferredPrompt(evt);
    };

    const handleInstalled = () => {
      window.__pwaInstallPrompt = null;
      setDeferredPrompt(null);
      setInstalledNow(true);
      setShowInstallGuide(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || window.__pwaInstallPrompt;
    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === "accepted") {
          window.__pwaInstallPrompt = null;
          setDeferredPrompt(null);
        }
        return;
      } catch {
        // Fallback to manual install guide
      }
    }
    closeDrawer();
    setShowInstallGuide(true);
  };

  const toggleSection = (sec: "cats" | "pages" | "phones") => {
    setOpenSection((prev) => (prev === sec ? null : sec));
  };

  return (
    <>
      {/* =========================================================================
          TOP STICKY BAR:
          - Left (شمال): Icon ONLY on all pages; Horizontal Logo ONLY on `/menu`
          - Center (Desktop): Clean Navigation Links
          - Right (يمين): Cart Pill + Menu Burger Button (≡) ALWAYS Right
         ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#FFF8E8]/95 backdrop-blur-md border-b border-[#B90D12]/12">
        <div
          dir="ltr"
          className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 h-[64px] sm:h-[72px] flex items-center justify-between gap-3"
        >
          {/* LEFT (شمال): Horizontal Logo on `/menu`, Simple Crest Icon ONLY everywhere else */}
          <Link
            href="/"
            aria-label="شاورما وبروستد مأكولات الشام — الصفحة الرئيسية"
            className="flex items-center shrink-0 group focus:outline-none"
          >
            {isMenuPage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src="/logo-horizontal.webp"
                alt="شاورما وبروستد مأكولات الشام"
                className="h-10 sm:h-11 md:h-12 w-auto max-w-[215px] sm:max-w-[260px] object-contain select-none transition-transform duration-200 group-hover:scale-[1.02]"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src="/logo-mobile.webp"
                alt="شاورما وبروستد مأكولات الشام"
                className="h-12 sm:h-13 w-auto object-contain select-none transition-transform duration-200 group-hover:scale-105"
              />
            )}
          </Link>

          {/* CENTER (Desktop Only): Symmetrical Minimal Nav */}
          <nav
            dir="rtl"
            aria-label="التنقل الرئيسي"
            className="hidden lg:flex items-center justify-center gap-1 bg-white/85 border border-[#B90D12]/12 rounded-full px-2 py-1 shadow-2xs"
          >
            {TOP_NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black transition ${
                    active
                      ? "bg-[#B90D12] text-white shadow-2xs"
                      : "text-[#111111]/80 hover:text-[#B90D12] hover:bg-[#FFF8E8]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT (يمين): Cart Pill + Menu Burger Button ALWAYS on Far Right */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/cart"
              dir="rtl"
              aria-label="سلة الطلبات"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white hover:bg-[#FFD21A]/25 border border-[#B90D12]/20 px-3.5 py-2 text-xs font-black text-[#111111] transition shadow-2xs"
            >
              <span className="relative">
                <CartIcon className="w-4 h-4 text-[#B90D12]" />
                {hydrated && count > 0 && (
                  <span
                    key={bump}
                    className="animate-pop absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#B90D12] text-white text-[10px] font-black grid place-items-center"
                  >
                    {count}
                  </span>
                )}
              </span>
              {hydrated && count > 0 ? (
                <span className="tabular-nums text-[#B90D12]">{formatPrice(subtotal)}</span>
              ) : (
                <span>السلة</span>
              )}
            </Link>

            <button
              type="button"
              onClick={openDrawer}
              aria-label="فتح القائمة الجانبية"
              aria-expanded={drawerOpen}
              className="w-11 h-11 rounded-full bg-[#B90D12] hover:bg-[#780508] text-white grid place-items-center shadow-[0_8px_20px_-6px_rgba(185,13,18,0.5)] transition active:scale-95 cursor-pointer"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MODERN SYMMETRICAL SIDEBAR DRAWER (`الشريط الجانبي`)
          Opens from Right (`يمين`), Crisp Icons, Collapsible Dropdowns, Strict Theme
         ========================================================================= */}
      {drawerOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[90] flex justify-end overscroll-none"
            role="dialog"
            aria-modal="true"
            aria-label="القائمة الجانبية — شاورما وبروستد مأكولات الشام"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-[#111111]/60 backdrop-blur-xs transition-opacity touch-none"
              onClick={closeDrawer}
            />

            {/* Drawer Panel */}
            <aside
              dir="rtl"
              className="relative z-10 w-full max-w-[380px] h-full bg-[#FFF8E8] text-[#111111] shadow-2xl border-s-2 border-[#B90D12]/20 flex flex-col overflow-hidden"
            >
              {/* 1. Symmetrical Top Brand Bar (Logo Left شمال, Close Right يمين) */}
              <div
                dir="ltr"
                className="shrink-0 bg-gradient-to-l from-[#B90D12] to-[#780508] text-white px-4 py-3.5 flex items-center justify-between gap-3 border-b border-[#FFD21A]/25"
              >
                <Link
                  href="/"
                  onClick={closeDrawer}
                  className="shrink-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo-horizontal.webp"
                    alt="شاورما وبروستد مأكولات الشام"
                    className="h-10 w-auto max-w-[220px] object-contain"
                  />
                </Link>

                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="إغلاق القائمة"
                  className="w-9 h-9 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#B90D12] grid place-items-center transition cursor-pointer shrink-0"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>

              {/* 2. Scrollable Structured Body */}
              <div
                data-modal-scroll
                className="flex-1 overflow-y-auto overscroll-contain touch-pan-y p-4 space-y-3 no-scrollbar"
              >
                {/* Compact Symmetrical Branch Bar */}
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer();
                    openPicker();
                  }}
                  className="w-full rounded-2xl bg-white border border-[#B90D12]/18 px-3.5 py-2.5 flex items-center justify-between gap-2 hover:border-[#B90D12] transition cursor-pointer shadow-2xs"
                >
                  <span className="flex items-center gap-2 text-xs font-black text-[#111111] truncate">
                    <PinIcon className="w-4 h-4 text-[#B90D12] shrink-0" />
                    <span className="truncate">مدينة بدر • إيجل مول</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-[#FFD21A] text-[#111111] px-2.5 py-0.5 text-[11px] font-black">
                    مفتوح الآن
                  </span>
                </button>

                {/* Symmetrical 2x2 Quick Action Bento */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/menu"
                    onClick={closeDrawer}
                    className="rounded-2xl bg-[#B90D12] hover:bg-[#780508] text-white p-3 flex flex-col items-center justify-center gap-1.5 text-center transition shadow-xs"
                  >
                    <UtensilsIcon className="w-5 h-5 text-[#FFD21A]" />
                    <span className="text-xs font-black">المنيو التفاعلي</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      closeDrawer();
                      setQrOpen(true);
                    }}
                    className="rounded-2xl bg-[#FFD21A] hover:bg-[#F2A900] text-[#111111] p-3 flex flex-col items-center justify-center gap-1.5 text-center transition shadow-xs cursor-pointer"
                  >
                    <QrCodeIcon className="w-5 h-5 text-[#B90D12]" />
                    <span className="text-xs font-black">باركود QR</span>
                  </button>

                  <a
                    href="/menu/maakolat-alsham-menu.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl bg-white hover:bg-[#FFF8E8] text-[#111111] border border-[#B90D12]/18 p-3 flex flex-col items-center justify-center gap-1.5 text-center transition"
                  >
                    <FileTextIcon className="w-5 h-5 text-[#B90D12]" />
                    <span className="text-xs font-black">منيو PDF</span>
                  </a>

                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="rounded-2xl bg-white hover:bg-[#FFF8E8] text-[#111111] border border-[#B90D12]/18 p-3 flex flex-col items-center justify-center gap-1.5 text-center transition relative"
                  >
                    <CartIcon className="w-5 h-5 text-[#B90D12]" />
                    <span className="text-xs font-black">
                      {hydrated && count > 0 ? `السلة (${count})` : "سلة الطلبات"}
                    </span>
                  </Link>
                </div>

                {/* DROPDOWN 1: أقسام المنيو (٩ أقسام) */}
                <div className="rounded-2xl bg-white border border-[#B90D12]/16 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection("cats")}
                    aria-expanded={openSection === "cats"}
                    className="w-full px-4 py-3 flex items-center justify-between text-xs sm:text-sm font-black text-[#111111] hover:text-[#B90D12] transition cursor-pointer"
                  >
                    <span>أقسام المنيو (٩ أقسام)</span>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-[#B90D12] transition-transform duration-200 ${
                        openSection === "cats" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openSection === "cats" && (
                    <div className="px-3 pb-3 pt-1 border-t border-[#B90D12]/10 grid grid-cols-2 gap-1.5">
                      {QUICK_CATEGORIES.map((cat, idx) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          onClick={closeDrawer}
                          className={`rounded-xl bg-[#FFF8E8] hover:bg-[#B90D12] text-[#111111] hover:text-white border border-[#B90D12]/14 px-2.5 py-2 text-xs font-extrabold text-center truncate transition ${
                            idx === QUICK_CATEGORIES.length - 1 ? "col-span-2" : ""
                          }`}
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* DROPDOWN 2: صفحات الموقع */}
                <div className="rounded-2xl bg-white border border-[#B90D12]/16 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection("pages")}
                    aria-expanded={openSection === "pages"}
                    className="w-full px-4 py-3 flex items-center justify-between text-xs sm:text-sm font-black text-[#111111] hover:text-[#B90D12] transition cursor-pointer"
                  >
                    <span>تصفح صفحات الموقع</span>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-[#B90D12] transition-transform duration-200 ${
                        openSection === "pages" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openSection === "pages" && (
                    <div className="px-3 pb-3 pt-1 border-t border-[#B90D12]/10 grid grid-cols-2 gap-1.5">
                      {SITE_PAGES.map((pg) => {
                        const active = pathname === pg.href;
                        return (
                          <Link
                            key={pg.href}
                            href={pg.href}
                            onClick={closeDrawer}
                            className={`rounded-xl px-2.5 py-2 text-xs font-extrabold text-center truncate border transition ${
                              active
                                ? "bg-[#B90D12] text-white border-[#B90D12]"
                                : "bg-[#FFF8E8] hover:bg-[#FFD21A] text-[#111111] border-[#B90D12]/14"
                            }`}
                          >
                            {pg.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* DROPDOWN 3: أرقام الطلبات الخمسة */}
                <div className="rounded-2xl bg-white border border-[#B90D12]/16 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection("phones")}
                    aria-expanded={openSection === "phones"}
                    className="w-full px-4 py-3 flex items-center justify-between text-xs sm:text-sm font-black text-[#111111] hover:text-[#B90D12] transition cursor-pointer"
                  >
                    <span>أرقام الطلبات والتوصيل (٥ خطوط)</span>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-[#B90D12] transition-transform duration-200 ${
                        openSection === "phones" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openSection === "phones" && (
                    <div className="px-3 pb-3 pt-1 border-t border-[#B90D12]/10 grid grid-cols-2 gap-1.5" dir="ltr">
                      {ORDER_PHONES.map((ph, idx) => (
                        <a
                          key={ph}
                          href={`tel:${ph}`}
                          className={`rounded-xl py-2 px-2.5 flex items-center justify-center gap-1.5 text-xs font-en font-black border transition ${
                            idx === 0
                              ? "col-span-2 bg-[#B90D12] text-white border-[#B90D12]"
                              : "bg-[#FFF8E8] hover:bg-[#FFD21A] text-[#111111] border-[#B90D12]/18"
                          }`}
                        >
                          <PhoneIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>{ph}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Install PWA Button (Sleek Single Line) */}
                {!isStandalone && (
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="w-full rounded-2xl bg-[#111111] hover:bg-[#B90D12] text-white px-4 py-3 flex items-center justify-center gap-2 text-xs font-black transition cursor-pointer"
                  >
                    <DownloadAppIcon className="w-4 h-4 text-[#FFD21A] shrink-0" />
                    <span>تثبيت تطبيق مأكولات الشام على الهاتف</span>
                  </button>
                )}

                {/* Symmetrical 4-Icon Official Social Bar */}
                <div className="pt-1">
                  <div className="grid grid-cols-4 gap-2">
                    {SOCIAL_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={item.label}
                          title={item.label}
                          className="h-11 rounded-2xl bg-white hover:bg-[#B90D12] text-[#111111] hover:text-white border border-[#B90D12]/16 grid place-items-center transition"
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3. Pinned Symmetrical Bottom Bar (Strict Brand Theme) */}
              <div
                dir="ltr"
                className="shrink-0 p-3.5 bg-white border-t border-[#B90D12]/15 grid grid-cols-2 gap-2"
              >
                <a
                  href="tel:01023182006"
                  className="rounded-full bg-[#111111] hover:bg-black text-[#FFD21A] py-2.5 px-3 flex items-center justify-center gap-1.5 text-xs font-en font-black transition"
                >
                  <PhoneIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>01023182006</span>
                </a>
                <a
                  href="https://wa.me/201023182006"
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="rtl"
                  className="rounded-full bg-[#B90D12] hover:bg-[#780508] text-white py-2.5 px-3 flex items-center justify-center gap-1.5 text-xs font-black transition"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#FFD21A] shrink-0" />
                  <span>اطلب واتساب</span>
                </a>
              </div>
            </aside>
          </div>,
          document.body,
        )}

      {/* Install PWA Guide Modal */}
      {showInstallGuide &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            dir="rtl"
            className="fixed inset-0 z-[96] flex items-center justify-center p-4 overscroll-none"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-[#111111]/65 backdrop-blur-xs touch-none"
              onClick={() => setShowInstallGuide(false)}
            />
            <div className="relative z-10 w-full max-w-sm rounded-3xl bg-[#FFF8E8] border-2 border-[#B90D12]/25 p-5 shadow-2xl text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-emblem.webp"
                alt="مأكولات الشام"
                className="w-16 h-16 mx-auto rounded-full object-contain drop-shadow-md"
              />
              <h3 className="text-lg font-black text-[#111111] mt-3">
                تثبيت تطبيق مأكولات الشام
              </h3>

              {isIosDevice ? (
                <div className="mt-4 space-y-2.5 text-xs font-bold text-[#111111]/80 bg-white rounded-2xl p-4 border border-[#B90D12]/15 text-right">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#B90D12] text-white text-xs font-black grid place-items-center shrink-0">
                      1
                    </span>
                    <span className="inline-flex items-center gap-1 flex-wrap">
                      اضغط على زر المشاركة <ShareIosIcon className="w-4 h-4 text-[#B90D12] inline" /> في متصفح Safari
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#B90D12] text-white text-xs font-black grid place-items-center shrink-0">
                      2
                    </span>
                    <span>اختر «إضافة إلى الشاشة الرئيسية» (Add to Home Screen)</span>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-2.5 text-xs font-bold text-[#111111]/80 bg-white rounded-2xl p-4 border border-[#B90D12]/15 text-right">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#B90D12] text-white text-xs font-black grid place-items-center shrink-0">
                      1
                    </span>
                    <span>افتح قائمة المتصفح العلوية</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#B90D12] text-white text-xs font-black grid place-items-center shrink-0">
                      2
                    </span>
                    <span>اختر «تثبيت التطبيق» أو «الإضافة إلى الشاشة الرئيسية»</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowInstallGuide(false)}
                className="w-full mt-4 rounded-full bg-[#B90D12] hover:bg-[#780508] text-white font-black text-sm py-3 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <CheckIcon className="w-4 h-4" />
                <span>تمام</span>
              </button>
            </div>
          </div>,
          document.body,
        )}

      <MenuQrModal open={qrOpen} onClose={() => setQrOpen(false)} />
    </>
  );
}
