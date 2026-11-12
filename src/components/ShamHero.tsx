"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useStore } from "./store";
import { CheckIcon, PlusIcon, QrCodeIcon } from "./icons";

interface HeroSlide {
  id: string;
  productId: string;
  productName: string;
  sizeLabel: string;
  price: number;
  headlineTop: string;
  headlineBottom: string;
  subtitle: string;
  calloutTitle: string;
  sticker: string;
  image: string;
  cartImage: string;
  isHandCutout?: boolean;
}

const SLIDES: HeroSlide[] = [
  {
    id: "shawarma",
    productId: "p1",
    productName: "سندوتش شاورما فراخ عيش سوري",
    sizeLabel: "كبير L",
    price: 90,
    headlineTop: "الشاورما والبروستد",
    headlineBottom: "على أصولهم",
    subtitle: "من قلب الشام... لحد عندك في مدينة بدر — مأكولات الشام.",
    calloutTitle: "شاورما صاج دبل",
    sticker: "صُنعت للجوعانين",
    image: "/images/hero/hero-shawarma-hand.webp",
    cartImage: "/images/products/shawarma-chicken-saj.webp",
    isHandCutout: true,
  },
  {
    id: "broasted",
    productId: "p24",
    productName: "فرخة بروستد كاملة",
    sizeLabel: "فرخة كاملة (8 قطع)",
    price: 440,
    headlineTop: "فرخة بروستد ذهبية",
    headlineBottom: "مقرمشة لآخر قطعة",
    subtitle: "تتبيلة مأكولات الشام السرية مع البطاطس والثومية والكولسلو والعيش الطازج.",
    calloutTitle: "فرخة بروستد كاملة",
    sticker: "ألذ طعم وأحلى مذاق",
    image: "/images/products/broasted-whole.webp",
    cartImage: "/images/products/broasted-whole.webp",
  },
  {
    id: "fatteh",
    productId: "p38",
    productName: "فتة شاورما فراخ بالموتزاريلا والمشروم",
    sizeLabel: "وجبة غنية",
    price: 165,
    headlineTop: "فتة شاورما شامية",
    headlineBottom: "غرقانة بالموتزاريلا",
    subtitle: "أرز بسمتي مبهر، عيش محمص، شاورما عالصاج، وثومية كريمية في إيجل مول.",
    calloutTitle: "فتة فراخ موتزاريلا",
    sticker: "إيجل مول • مدينة بدر",
    image: "/images/products/fatteh-mozzarella.webp",
    cartImage: "/images/products/fatteh-mozzarella.webp",
  },
];

export default function ShamHero() {
  const [idx, setIdx] = useState(0);
  const [addedId, setAddedId] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const { addToCart } = useStore();

  const slide = SLIDES[idx];

  const handleQuickAdd = () => {
    addToCart({
      productId: slide.productId,
      name: slide.productName,
      image: slide.cartImage,
      sizeLabel: slide.sizeLabel,
      addons: [],
      unitPrice: slide.price,
      qty: 1,
    });
    setAddedId(slide.id);
    setTimeout(() => setAddedId(null), 1300);
  };

  const openQr = () => {
    window.dispatchEvent(new CustomEvent("open-menu-qr"));
  };

  return (
    <section className="px-2.5 sm:px-6 lg:px-8 pt-2.5 sm:pt-4 overflow-x-clip">
      <div className="mx-auto max-w-7xl">
        <div
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(dx) > 44) {
              setIdx((prev) =>
                dx > 0 ? (prev + 1) % SLIDES.length : (prev - 1 + SLIDES.length) % SLIDES.length
              );
            }
          }}
          className="relative rounded-[30px] sm:rounded-[40px] bg-[#B90D12] text-[#FFF8E8] overflow-hidden shadow-[0_24px_56px_-22px_rgba(185,13,18,0.58)] h-[505px] sm:h-[560px] lg:h-[565px] xl:h-[595px]"
        >
          {/* Subtle Warm Studio Glow */}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_62%,rgba(229,57,53,0.34),transparent_62%)]"
            aria-hidden="true"
          />

          {/* =====================================================================
              DESKTOP LAYOUT (`lg:grid`) — Strictly Locked Height (`h-full`)
             ===================================================================== */}
          <div className="hidden lg:grid lg:grid-cols-12 items-center h-full px-10 xl:px-14 relative z-10 overflow-hidden">
            {/* Right Column (RTL Cols 1-5): Fixed-position Headline + Subtitle + CTAs */}
            <div className="col-span-5 text-right z-20 flex flex-col justify-center h-full py-10">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-black/20 border border-[#FFD21A]/35 px-3.5 py-1 text-xs font-extrabold text-[#FFD21A]">
                  <span>شاورما وبروستد مأكولات الشام • مدينة بدر</span>
                </div>

                <h1 className="mt-4 text-[36px] xl:text-[44px] font-black leading-[1.12] tracking-tight text-[#FFF8E8]">
                  <span className="block whitespace-nowrap">{slide.headlineTop}</span>
                  <span className="block text-[#FFD21A] mt-1 whitespace-nowrap">{slide.headlineBottom}</span>
                </h1>

                <p className="mt-4 text-base xl:text-lg font-bold text-[#FFF8E8]/90 leading-relaxed max-w-md h-[56px] line-clamp-2">
                  {slide.subtitle}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    href="/menu"
                    className="rounded-full bg-[#FFF8E8] hover:bg-[#FFD21A] text-[#B90D12] hover:text-[#111111] px-7 py-3.5 text-sm font-black transition shadow-md"
                  >
                    اطلب الآن من المنيو
                  </Link>
                  <button
                    type="button"
                    onClick={openQr}
                    className="rounded-full bg-black/20 hover:bg-black/35 border border-[#FFF8E8]/25 text-[#FFF8E8] px-5 py-3.5 text-xs font-black inline-flex items-center gap-2 transition cursor-pointer"
                  >
                    <QrCodeIcon className="w-4 h-4 text-[#FFD21A]" />
                    <span>باركود المنيو QR</span>
                  </button>
                </div>

                {/* Slide Switcher Dots */}
                <div className="mt-6 flex items-center gap-2">
                  {SLIDES.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setIdx(i)}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        i === idx
                          ? "w-9 bg-[#FFD21A]"
                          : "w-2.5 bg-[#FFF8E8]/35 hover:bg-[#FFF8E8]/65"
                      }`}
                      aria-label={s.calloutTitle}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Center Column (Cols 6-9): Fixed-Height Visual Stage */}
            <div className="col-span-4 h-full flex items-end justify-center relative z-10 overflow-hidden">
              {slide.isHandCutout ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={slide.image}
                  alt={slide.productName}
                  className="h-[510px] xl:h-[545px] w-auto object-contain object-bottom block select-none translate-y-1 drop-shadow-[0_18px_28px_rgba(60,0,4,0.38)]"
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="w-[320px] h-[320px] xl:w-[350px] xl:h-[350px] rounded-[36px] bg-[#780508]/60 border-2 border-[#FFD21A]/35 p-4 shadow-2xl overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.image}
                      alt={slide.productName}
                      className="w-full h-full object-cover rounded-[26px]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Left Column (RTL Cols 10-12): Callout + Quick-Add + Sticker */}
            <div className="col-span-3 flex flex-col items-end justify-between h-full py-12 z-20">
              <div className="mt-8 flex items-center gap-3.5" dir="ltr">
                <button
                  type="button"
                  onClick={handleQuickAdd}
                  aria-label={`أضف ${slide.calloutTitle} للسلة`}
                  title="أضف سريعاً إلى السلة"
                  className={`w-12 h-12 rounded-full grid place-items-center shadow-lg transition active:scale-95 cursor-pointer shrink-0 ${
                    addedId === slide.id
                      ? "bg-[#FFD21A] text-[#111111]"
                      : "bg-[#FFF8E8] hover:bg-[#FFD21A] text-[#B90D12] hover:text-[#111111]"
                  }`}
                >
                  {addedId === slide.id ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <PlusIcon className="w-5 h-5" />
                  )}
                </button>

                <div className="text-right" dir="rtl">
                  <div className="text-lg xl:text-xl font-black text-[#FFF8E8] whitespace-nowrap">
                    {slide.calloutTitle}
                  </div>
                  <div className="mt-1 inline-flex items-center rounded-full bg-[#FFD21A] text-[#111111] px-3.5 py-0.5 text-sm font-black shadow-xs">
                    {slide.price} ج.م
                  </div>
                </div>

                <svg
                  viewBox="0 0 84 54"
                  fill="none"
                  className="w-16 h-11 text-[#FFF8E8] shrink-0 mt-3"
                  aria-hidden="true"
                >
                  <path
                    d="M8 38 C 26 48, 44 42, 46 24 C 48 11, 34 12, 35 24 C 36 36, 58 34, 75 16"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M66 15 L76 15 L74 25"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="mb-4 self-start ms-4">
                <span className="inline-block rounded-full bg-[#FFD21A] text-[#111111] px-5 py-2 text-sm font-black shadow-md -rotate-6 select-none whitespace-nowrap">
                  {slide.sticker}
                </span>
              </div>
            </div>
          </div>

          {/* =====================================================================
              MOBILE & TABLET LAYOUT (`lg:hidden`) — Strictly Locked Height (`h-full`)
             ===================================================================== */}
          <div className="lg:hidden relative z-10 px-5 pt-5 h-full flex flex-col items-center justify-between text-center overflow-hidden">
            {/* Fixed Top Copy & CTA Area */}
            <div className="w-full flex flex-col items-center shrink-0">
              <span className="inline-flex items-center rounded-full bg-black/20 border border-[#FFD21A]/35 px-3 py-1 text-[11px] font-extrabold text-[#FFD21A]">
                شاورما وبروستد مأكولات الشام • إيجل مول مدينة بدر
              </span>

              <h1 className="mt-2.5 text-[31px] sm:text-[44px] font-black leading-[1.08] tracking-tight text-[#FFF8E8] w-full">
                <span className="block truncate">{slide.headlineTop}</span>
                <span className="block text-[#FFD21A] mt-0.5 truncate">{slide.headlineBottom}</span>
              </h1>

              <p className="mt-1.5 text-xs sm:text-sm font-bold text-[#FFF8E8]/90 max-w-xs sm:max-w-md leading-relaxed h-[38px] sm:h-[42px] line-clamp-2 flex items-center justify-center">
                {slide.subtitle}
              </p>

              <div className="mt-3 flex items-center justify-center gap-2">
                <Link
                  href="/menu"
                  className="rounded-full bg-[#FFF8E8] text-[#B90D12] px-5 py-2 text-xs font-black shadow-sm"
                >
                  اطلب الآن من المنيو
                </Link>
                <button
                  type="button"
                  onClick={openQr}
                  className="rounded-full bg-black/20 border border-[#FFF8E8]/25 text-[#FFF8E8] px-3.5 py-2 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCodeIcon className="w-3.5 h-3.5 text-[#FFD21A]" />
                  <span className="font-en">QR</span>
                </button>
              </div>
            </div>

            {/* Fixed-Height Bottom Visual Stage (`h-[260px] sm:h-[295px]`) */}
            <div className="relative w-full h-[260px] sm:h-[295px] shrink-0 flex items-end justify-center overflow-hidden">
              {/* Right Floating Callout + Yellow Price Pill */}
              <div className="absolute right-0 top-9 sm:top-12 z-20 text-right max-w-[115px] sm:max-w-none">
                <div className="text-xs sm:text-sm font-black text-[#FFF8E8] leading-tight">
                  {slide.calloutTitle}
                </div>
                <span className="mt-1 inline-flex items-center rounded-full bg-[#FFD21A] text-[#111111] px-2.5 py-0.5 text-[11px] sm:text-xs font-black shadow-xs">
                  {slide.price} ج.م
                </span>
              </div>

              {/* Left Curved Cream Arrow + Circular `+` Button */}
              <div className="absolute left-1 top-5 sm:top-8 z-20 flex flex-col items-center gap-2.5">
                <svg
                  viewBox="0 0 64 46"
                  fill="none"
                  className="w-11 h-8 text-[#FFF8E8]"
                  aria-hidden="true"
                >
                  <path
                    d="M10 8 C 8 28, 28 32, 50 22"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M43 18 L52 21 L47 29"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <button
                  type="button"
                  onClick={handleQuickAdd}
                  aria-label={`أضف ${slide.calloutTitle} للسلة`}
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full grid place-items-center shadow-lg transition active:scale-95 cursor-pointer ${
                    addedId === slide.id
                      ? "bg-[#FFD21A] text-[#111111]"
                      : "bg-[#FFF8E8] text-[#B90D12]"
                  }`}
                >
                  {addedId === slide.id ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : (
                    <PlusIcon className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Center Hero Cutout / Platter */}
              {slide.isHandCutout ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={slide.image}
                  alt={slide.productName}
                  className="h-[248px] sm:h-[285px] w-auto object-contain object-bottom block select-none translate-y-1 drop-shadow-[0_14px_22px_rgba(60,0,4,0.38)]"
                />
              ) : (
                <div className="h-full flex items-center justify-center pb-3">
                  <div className="w-[192px] h-[192px] sm:w-[228px] sm:h-[228px] rounded-[28px] bg-[#780508]/65 border-2 border-[#FFD21A]/35 p-2.5 shadow-xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.image}
                      alt={slide.productName}
                      className="w-full h-full object-cover rounded-[20px]"
                    />
                  </div>
                </div>
              )}

              {/* Mobile Slide Dots at Bottom Left */}
              <div className="absolute bottom-3 left-1 z-20 flex items-center gap-1.5">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setIdx(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      i === idx ? "w-6 bg-[#FFD21A]" : "w-2 bg-[#FFF8E8]/40"
                    }`}
                    aria-label={s.calloutTitle}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
