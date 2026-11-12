"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useStore } from "./store";
import { formatPrice } from "@/lib/format";
import {
  CartIcon,
  CheckIcon,
  ChevronIcon,
  CloseIcon,
  DownloadAppIcon,
  ExternalLinkIcon,
  PhoneIcon,
  QrCodeIcon,
  ShareIosIcon,
  WhatsAppIcon,
  XIcon,
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

const NAV_LINKS = [
  { href: "/", labelAr: "الرئيسية", labelEn: "HOME" },
  { href: "/offers", labelAr: "العروض", labelEn: "OFFERS" },
  { href: "/occasions", labelAr: "عزومات مأكولات الشام", labelEn: "CATERING" },
  { href: "/branches", labelAr: "فرع مدينة بدر", labelEn: "BADR CITY" },
  { href: "/about", labelAr: "قصتنا", labelEn: "OUR STORY" },
  { href: "/contact", labelAr: "تواصل معنا", labelEn: "CONTACT" },
];

const QUICK_CATEGORIES = [
  { href: "/menu?cat=shawarma_sandwiches", labelAr: "سندوتشات الشاورما", labelEn: "SHAWARMA WRAPS" },
  { href: "/menu?cat=shawarma_meals", labelAr: "وجبات الشاورما والعربي", labelEn: "ARABI & MARIA" },
  { href: "/menu?cat=broasted", labelAr: "الفراخ البروستد", labelEn: "BROASTED CHICKEN" },
  { href: "/menu?cat=grilled", labelAr: "الفراخ المشوية", labelEn: "GRILLED CHICKEN" },
  { href: "/menu?cat=fatteh", labelAr: "قسم الفتة والموتزاريلا", labelEn: "SYRIAN FATTEH" },
  { href: "/menu?cat=western", labelAr: "سندوتشات ووجبات الغربي", labelEn: "CRISPY & WESTERN" },
  { href: "/menu?cat=pizza", labelAr: "قسم البيتزا", labelEn: "FRESH PIZZA" },
  { href: "/menu?cat=falafel_fries", labelAr: "الفلافل والبطاطس السوري", labelEn: "FALAFEL & FRIES" },
  { href: "/menu?cat=sides_drinks", labelAr: "الإضافات والمشروبات", labelEn: "SIDES & DRINKS" },
];

const ORDER_PHONES = [
  "01023182006",
  "01122060877",
  "01554545824",
  "01228722219",
  "01114101253",
];

export default function Header() {
  const pathname = usePathname();
  const { count, subtotal, bump, hydrated } = useStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<"pages" | "cats" | null>("cats");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() =>
    typeof window !== "undefined" ? window.__pwaInstallPrompt ?? null : null
  );
  const [isStandalone, setIsStandalone] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    );
  });
  const [isIOS] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  });

  const savedScrollYRef = useRef(0);
  const lastPathnameRef = useRef(pathname);

  useEffect(() => {
    const onOpenQr = () => setQrOpen(true);
    const onOpenDrawer = () => setDrawerOpen(true);
    window.addEventListener("open-menu-qr", onOpenQr);
    window.addEventListener("open-mobile-drawer", onOpenDrawer);
    return () => {
      window.removeEventListener("open-menu-qr", onOpenQr);
      window.removeEventListener("open-mobile-drawer", onOpenDrawer);
    };
  }, []);

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.__pwaInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };
    const onPromptAvailable = () => {
      if (window.__pwaInstallPrompt) {
        setDeferredPrompt(window.__pwaInstallPrompt);
      }
    };
    const onInstalled = () => {
      window.__pwaInstallPrompt = null;
      setDeferredPrompt(null);
      setIsStandalone(true);
      setShowInstallGuide(false);
    };
    const mql = window.matchMedia("(display-mode: standalone)");
    const onDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("pwa-install-available", onPromptAvailable);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("pwa-app-installed", onInstalled);
    mql.addEventListener("change", onDisplayModeChange);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("pwa-install-available", onPromptAvailable);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("pwa-app-installed", onInstalled);
      mql.removeEventListener("change", onDisplayModeChange);
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
          setDrawerOpen(false);
        }
      } catch {
        setDrawerOpen(false);
        setShowInstallGuide(true);
      }
      return;
    }
    setDrawerOpen(false);
    setShowInstallGuide(true);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (drawerOpen) {
      savedScrollYRef.current = window.scrollY;
      lastPathnameRef.current = pathname;

      html.style.overflow = "hidden";
      html.style.overscrollBehavior = "none";
      body.style.overflow = "hidden";
      body.style.overscrollBehavior = "none";
      body.style.position = "fixed";
      body.style.top = `-${savedScrollYRef.current}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
    } else {
      const wasLocked = body.style.position === "fixed";
      const targetScrollY = savedScrollYRef.current;
      const sameRoute = lastPathnameRef.current === pathname;

      html.style.overflow = "";
      html.style.overscrollBehavior = "";
      body.style.overflow = "";
      body.style.overscrollBehavior = "";
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";

      if (wasLocked && sameRoute) {
        window.scrollTo(0, targetScrollY);
      }
    }

    return () => {
      html.style.overflow = "";
      html.style.overscrollBehavior = "";
      body.style.overflow = "";
      body.style.overscrollBehavior = "";
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
    };
  }, [drawerOpen, pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FFF8E8]/95 backdrop-blur-md border-b border-[#111111]/[0.08]">
        <div
          dir="ltr"
          className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 h-14 lg:h-16 flex items-center justify-between gap-3"
        >
          {/* FAR LEFT (شمال دائماً): Simple Crest on Mobile + Horizontal Logo on Desktop */}
          <Link
            href="/"
            dir="ltr"
            className="flex items-center gap-2 shrink-0 group focus:outline-none"
          >
            {/* Mobile Dedicated Simple Crest Logo (`logo-mobile.webp`) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-mobile.webp"
              alt="شاورما وبروستد مأكولات الشام"
              className="sm:hidden h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
            />
            <div className="sm:hidden flex flex-col text-right leading-none" dir="rtl">
              <span className="text-xs font-black text-[#B90D12]">مأكولات الشام</span>
              <span className="text-[10px] font-bold text-[#111111]/65 mt-0.5">
                شاورما وبروستد • مدينة بدر
              </span>
            </div>

            {/* Desktop Wide Horizontal Logo (`logo-horizontal.webp`) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-horizontal.webp"
              alt="شاورما وبروستد مأكولات الشام"
              className="hidden sm:block h-10 lg:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>

          {/* CENTER DESKTOP NAVIGATION */}
          <nav dir="rtl" className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {NAV_LINKS.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-colors whitespace-nowrap ${
                    active
                      ? "bg-[#B90D12] text-white"
                      : "text-[#111111]/80 hover:text-[#B90D12] hover:bg-[#B90D12]/[0.07]"
                  }`}
                >
                  {item.labelAr}
                </Link>
              );
            })}

            {/* Cohesive Split Menu + QR Pill */}
            <div
              className={`ms-1 inline-flex items-center rounded-full border p-0.5 transition-all ${
                pathname.startsWith("/menu")
                  ? "bg-[#B90D12] text-white border-[#B90D12]"
                  : "bg-white text-[#B90D12] border-[#B90D12]/25 hover:border-[#B90D12]/60"
              }`}
            >
              <Link
                href="/menu"
                className={`ps-3.5 pe-2.5 py-1 rounded-s-full font-extrabold text-xs flex items-center gap-1.5 transition whitespace-nowrap ${
                  pathname.startsWith("/menu")
                    ? "text-white hover:bg-white/10"
                    : "text-[#B90D12] hover:bg-[#FFF8E8]"
                }`}
              >
                <span>منيو مأكولات الشام</span>
              </Link>
              <span
                className={`w-px h-3.5 ${
                  pathname.startsWith("/menu") ? "bg-white/25" : "bg-[#B90D12]/20"
                }`}
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => setQrOpen(true)}
                title="باركود ومشاركة منيو مأكولات الشام (QR)"
                aria-label="باركود ومشاركة منيو مأكولات الشام"
                className={`ps-2.5 pe-3 py-1 rounded-e-full flex items-center gap-1 text-[11px] font-black transition active:scale-95 cursor-pointer ${
                  pathname.startsWith("/menu")
                    ? "text-[#FFD21A] hover:bg-white/15"
                    : "text-[#111111] hover:text-[#B90D12] hover:bg-[#FFF8E8]"
                }`}
              >
                <QrCodeIcon className="w-3.5 h-3.5 text-[#B90D12]" />
                <span className="font-en tracking-wider">QR</span>
              </button>
            </div>
          </nav>

          {/* FAR RIGHT (يمين دائماً): Desktop Cart/Order Pill + Menu Burger Button ALWAYS at Far Right */}
          <div className="flex items-center gap-2 shrink-0" dir="ltr">
            <Link
              href="/cart"
              key={bump}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#B90D12] hover:bg-[#780508] text-white pl-3.5 pr-1.5 py-1.5 text-xs font-extrabold transition-colors shadow-xs"
            >
              <span dir="rtl" className="font-black">
                {hydrated && count > 0 ? `${count} صنف • ${formatPrice(subtotal)}` : "اطلب الآن"}
              </span>
              <span className="w-6 h-6 rounded-full bg-[#FFD21A] text-[#111111] grid place-items-center text-[11px] font-black">
                {hydrated && count > 0 ? count : <CartIcon className="w-3.5 h-3.5" />}
              </span>
            </Link>

            {/* Menu Burger Button (`≡`) — ALWAYS on the Far Right (أقصى اليمين) on Mobile & Desktop */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="فتح القائمة الجانبية"
              aria-expanded={drawerOpen}
              className="w-10 h-10 rounded-full bg-[#B90D12] sm:bg-white border border-[#B90D12]/25 text-white sm:text-[#111111] hover:bg-[#780508] hover:text-white grid place-items-center transition active:scale-95 cursor-pointer shadow-2xs"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
                <line x1="4" y1="8" x2="20" y2="8" strokeLinecap="round" />
                <line x1="4" y1="13" x2="20" y2="13" strokeLinecap="round" />
                <line x1="8" y1="18" x2="20" y2="18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Full Sidebar Drawer — Portal to document.body (Available on Mobile & Desktop) */}
      {drawerOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            dir="ltr"
            role="dialog"
            aria-modal="true"
            aria-label="القائمة الجانبية لمطعم مأكولات الشام"
            className="fixed inset-0 z-[80] overflow-hidden overscroll-none"
          >
            {/* Full-viewport Backdrop */}
            <div
              className="fixed inset-0 bg-[#111111]/60 backdrop-blur-xs touch-none"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Right-aligned Sidebar Panel */}
            <aside
              dir="rtl"
              className="fixed top-0 bottom-0 right-0 z-10 w-[88vw] max-w-[390px] h-[100dvh] max-h-[100dvh] bg-[#FFF8E8] text-[#111111] shadow-2xl border-l border-[#B90D12]/20 flex flex-col overflow-hidden overscroll-contain"
            >
              {/* 1. Pinned Top Drawer Header */}
              <div className="shrink-0 p-4 pb-3 border-b border-[#111111]/10 bg-white space-y-2.5">
                <div className="flex items-center justify-between" dir="ltr">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo-horizontal.webp"
                    alt="شاورما وبروستد مأكولات الشام"
                    className="h-9 w-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    aria-label="إغلاق القائمة"
                    className="w-9 h-9 rounded-full bg-[#111111]/6 hover:bg-[#B90D12] text-[#111111] hover:text-white grid place-items-center transition cursor-pointer"
                  >
                    <CloseIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Status & Eagle Mall Badr City Banner */}
                <div className="rounded-2xl bg-[#B90D12] text-white p-3.5 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-black">مأكولات الشام — مدينة بدر</div>
                      <div className="text-[11px] text-[#FFF8E8]/90 font-semibold mt-0.5">
                        ميدان النسر • إيجل مول • بجوار البنك الأهلي
                      </div>
                    </div>
                    <span className="text-[11px] bg-[#FFD21A] text-[#111111] px-2.5 py-1 rounded-full font-black shrink-0">
                      مفتوح الآن
                    </span>
                  </div>

                  {/* Quick Menu + QR Pill Row */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <Link
                      href="/menu"
                      onClick={() => setDrawerOpen(false)}
                      className="flex-1 rounded-full bg-[#FFF8E8] hover:bg-[#FFD21A] text-[#B90D12] hover:text-[#111111] font-black text-xs py-2 px-3.5 text-center transition"
                    >
                      تصفح المنيو الكامل
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setDrawerOpen(false);
                        setQrOpen(true);
                      }}
                      className="shrink-0 rounded-full bg-[#FFD21A] hover:bg-white text-[#111111] font-black text-xs py-2 px-3.5 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <QrCodeIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>QR المنيو</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Scrollable Middle Content */}
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-2.5">
                {/* Accordion 1: 9 Official Menu Categories */}
                <div className="rounded-2xl border border-[#B90D12]/18 overflow-hidden bg-white">
                  <div className="w-full px-3.5 py-2.5 bg-white flex items-center justify-between gap-2 border-b border-[#111111]/[0.06]">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenAccordion(openAccordion === "cats" ? null : "cats")
                      }
                      className="flex-1 flex items-center justify-between text-sm font-black text-[#111111] cursor-pointer"
                    >
                      <span>أقسام منيو مأكولات الشام (٩ أقسام)</span>
                      <span className="font-en text-sm text-[#B90D12] px-1">
                        {openAccordion === "cats" ? "−" : "+"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDrawerOpen(false);
                        setQrOpen(true);
                      }}
                      aria-label="باركود المنيو QR"
                      title="باركود المنيو (QR)"
                      className="shrink-0 h-7 px-2.5 rounded-lg bg-[#FFD21A] hover:brightness-105 text-[#111111] flex items-center gap-1 font-black text-[11px] transition active:scale-95 cursor-pointer"
                    >
                      <QrCodeIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-en">QR</span>
                    </button>
                  </div>
                  {openAccordion === "cats" && (
                    <div className="divide-y divide-[#111111]/[0.06] bg-white">
                      {QUICK_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          onClick={() => setDrawerOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-xs font-extrabold hover:bg-[#FFF8E8] transition-colors"
                        >
                          <span className="text-right text-[#111111]">{cat.labelAr}</span>
                          <span className="font-en text-[10px] font-bold text-[#B90D12] text-left">
                            {cat.labelEn}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Accordion 2: Site Pages */}
                <div className="rounded-2xl border border-[#111111]/10 overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenAccordion(openAccordion === "pages" ? null : "pages")
                    }
                    className="w-full px-4 py-2.5 bg-white flex items-center justify-between text-sm font-black text-[#111111] cursor-pointer"
                  >
                    <span>صفحات مأكولات الشام</span>
                    <span className="font-en text-sm text-[#B90D12]">
                      {openAccordion === "pages" ? "−" : "+"}
                    </span>
                  </button>
                  {openAccordion === "pages" && (
                    <div className="divide-y divide-[#111111]/[0.06] bg-white border-t border-[#111111]/[0.06]">
                      {NAV_LINKS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setDrawerOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-xs font-extrabold hover:bg-[#FFF8E8] transition-colors"
                        >
                          <span className="text-right text-[#111111]">{item.labelAr}</span>
                          <span className="font-en text-[10px] font-bold text-[#111111]/45 text-left">
                            {item.labelEn}
                          </span>
                        </Link>
                      ))}

                      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-[#FFF8E8]">
                        <Link
                          href="/menu"
                          onClick={() => setDrawerOpen(false)}
                          className="flex-1 px-2 py-1.5 rounded-xl text-xs font-black text-[#B90D12] hover:bg-[#B90D12]/10 flex items-center justify-between transition"
                        >
                          <span>منيو مأكولات الشام الكامل</span>
                          <span className="font-en text-[10px] text-[#B90D12]/80">MENU</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setDrawerOpen(false);
                            setQrOpen(true);
                          }}
                          aria-label="باركود منيو مأكولات الشام QR"
                          className="shrink-0 h-8 px-3 rounded-xl bg-[#B90D12] hover:bg-[#780508] text-white flex items-center justify-center gap-1.5 font-extrabold text-xs transition active:scale-95 cursor-pointer"
                        >
                          <QrCodeIcon className="w-3.5 h-3.5 text-[#FFD21A] shrink-0" />
                          <span className="font-en">QR</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cart + Official PDF Menu + Install Web App */}
                <div className="pt-0.5 space-y-2">
                  <Link
                    href="/cart"
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center justify-between gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm border transition ${
                      pathname === "/cart"
                        ? "bg-[#B90D12] text-white border-[#B90D12]"
                        : "bg-white text-[#B90D12] border-[#B90D12]/25 hover:border-[#B90D12]"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <CartIcon className="w-4 h-4 shrink-0" />
                      <span className="truncate font-black">سلة طلبات مأكولات الشام</span>
                    </span>

                    <span className="flex items-center gap-1.5 shrink-0">
                      {hydrated && count > 0 ? (
                        <span
                          key={bump}
                          className="animate-pop px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#FFD21A] text-[#111111]"
                        >
                          {count} • {formatPrice(subtotal)}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-[#111111]/60">
                          عرض السلة
                        </span>
                      )}
                      <ChevronIcon className="w-4 h-4 shrink-0" />
                    </span>
                  </Link>

                  <a
                    href="/menu/maakolat-alsham-menu.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm text-[#111111] bg-white hover:bg-[#FFD21A] border border-[#111111]/12 transition"
                  >
                    <span className="font-black">منيو مأكولات الشام الرسمي (PDF)</span>
                    <ExternalLinkIcon className="w-4 h-4 text-[#B90D12] shrink-0" />
                  </a>

                  {!isStandalone && (
                    <button
                      type="button"
                      onClick={handleInstallClick}
                      className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm text-[#B90D12] bg-white hover:bg-[#B90D12] hover:text-white border border-[#B90D12]/25 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <DownloadAppIcon className="w-4 h-4 shrink-0" />
                        <span className="truncate font-black">
                          تنزيل تطبيق مأكولات الشام (Web App)
                        </span>
                      </span>
                      <ChevronIcon className="w-4 h-4 shrink-0 opacity-75" />
                    </button>
                  )}
                </div>

                {/* All 5 Official Order Numbers */}
                <div className="rounded-2xl bg-white border border-[#111111]/10 p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-black text-[#111111]/70">
                    <span>أرقام الطلبات والتوصيل بمدينة بدر</span>
                    <span dir="ltr" className="font-en text-[10px] text-[#B90D12]">
                      5 HOTLINES
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5" dir="ltr">
                    {ORDER_PHONES.map((ph) => (
                      <a
                        key={ph}
                        href={`tel:${ph}`}
                        className="inline-flex items-center gap-1 rounded-full bg-[#FFF8E8] hover:bg-[#B90D12] text-[#111111] hover:text-white border border-[#B90D12]/20 px-2.5 py-1 text-[11px] font-en font-extrabold transition"
                      >
                        <PhoneIcon className="w-3 h-3 text-[#B90D12] group-hover:text-white" />
                        <span>{ph}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Pinned Bottom Actions in Drawer */}
              <div className="shrink-0 p-3.5 pt-2.5 border-t border-[#111111]/10 bg-white space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="https://wa.me/201023182006"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#25D366] hover:brightness-105 text-white py-2 px-3 flex items-center justify-center gap-1.5 text-xs font-black transition"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>واتساب الطلبات</span>
                  </a>
                  <a
                    href="tel:01023182006"
                    className="rounded-full border border-[#B90D12]/30 bg-[#FFF8E8] hover:bg-[#B90D12] text-[#111111] hover:text-white py-2 px-3 flex items-center justify-center gap-1.5 text-xs font-black transition"
                  >
                    <PhoneIcon className="w-3.5 h-3.5 text-[#B90D12]" />
                    <span className="font-en">01023182006</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/menu"
                    onClick={() => setDrawerOpen(false)}
                    className="flex-1 rounded-full bg-[#B90D12] hover:bg-[#780508] text-white font-black text-xs py-2.5 px-4 text-center transition"
                  >
                    اطلب الآن من منيو مأكولات الشام
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      setQrOpen(true);
                    }}
                    aria-label="باركود منيو مأكولات الشام"
                    title="باركود منيو مأكولات الشام (QR)"
                    className="w-10 h-10 rounded-full bg-[#FFD21A] text-[#111111] grid place-items-center hover:brightness-105 transition active:scale-95 cursor-pointer shrink-0"
                  >
                    <QrCodeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </aside>
          </div>,
          document.body,
        )}

      {/* PWA Web App Install Guide Modal */}
      {showInstallGuide &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            dir="rtl"
            className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center p-3 sm:p-4 animate-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pwa-install-title"
          >
            <div
              className="absolute inset-0 bg-[#111111]/65 backdrop-blur-xs"
              onClick={() => setShowInstallGuide(false)}
            />
            <div className="relative w-full max-w-md rounded-3xl bg-[#FFF8E8] p-5 sm:p-6 shadow-2xl border-2 border-[#B90D12]/25 animate-modal-content">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/icon-192.png"
                    alt="شاورما وبروستد مأكولات الشام"
                    className="w-12 h-12 rounded-2xl border border-[#B90D12]/25 bg-white p-1 object-contain shrink-0"
                  />
                  <div className="text-right">
                    <h3 id="pwa-install-title" className="text-base sm:text-lg font-black text-[#B90D12]">
                      تنزيل تطبيق مأكولات الشام
                    </h3>
                    <p className="text-xs font-semibold text-[#111111]/70 mt-0.5">
                      ثبّت التطبيق على شاشتك الرئيسية لطلب الشاورما والبروستد أسرع في مدينة بدر
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInstallGuide(false)}
                  aria-label="إغلاق"
                  className="p-2 rounded-full bg-white text-[#111111]/70 hover:text-[#111111] cursor-pointer"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>

              {isIOS ? (
                <div className="space-y-2.5 rounded-2xl bg-white p-4 text-xs sm:text-sm font-bold text-[#111111] border border-[#B90D12]/15 text-right">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#B90D12] text-white text-xs font-black grid place-items-center shrink-0">
                      1
                    </span>
                    <span className="flex items-center gap-1.5 flex-wrap">
                      اضغط على زر المشاركة
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFF8E8] border border-[#B90D12]/20 text-[#B90D12]">
                        <ShareIosIcon className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </span>
                      في المتصفح
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#B90D12] text-white text-xs font-black grid place-items-center shrink-0">
                      2
                    </span>
                    <span>اختر «إضافة إلى الشاشة الرئيسية» (Add to Home Screen)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#B90D12] text-white text-xs font-black grid place-items-center shrink-0">
                      3
                    </span>
                    <span>اضغط «إضافة» (Add) بأعلى الشاشة</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 rounded-2xl bg-white p-4 text-xs sm:text-sm font-bold text-[#111111] border border-[#B90D12]/15 text-right">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#B90D12] text-white text-xs font-black grid place-items-center shrink-0">
                      1
                    </span>
                    <span>افتح قائمة المتصفح (⋮) في أعلى الشاشة</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#B90D12] text-white text-xs font-black grid place-items-center shrink-0">
                      2
                    </span>
                    <span>اختر «تثبيت التطبيق» أو «الإضافة إلى الشاشة الرئيسية»</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#B90D12] text-white text-xs font-black grid place-items-center shrink-0">
                      3
                    </span>
                    <span>أكد التثبيت ليظهر تطبيق مأكولات الشام على موبايلك فورًا</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowInstallGuide(false)}
                className="w-full mt-4 rounded-full bg-[#B90D12] hover:bg-[#780508] text-white font-black text-sm py-3 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <CheckIcon className="w-4 h-4" />
                <span>تمام، فهمت</span>
              </button>
            </div>
          </div>,
          document.body,
        )}

      <MenuQrModal open={qrOpen} onClose={() => setQrOpen(false)} />
    </>
  );
}
