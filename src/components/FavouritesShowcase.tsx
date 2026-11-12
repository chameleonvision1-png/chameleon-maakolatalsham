"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./Product";

const TABS = [
  { id: "all", label: "الأكثر طلبًا" },
  { id: "shawarma_sandwiches", label: "سندوتشات الشاورما" },
  { id: "shawarma_meals", label: "وجبات الشاورما والعربي" },
  { id: "broasted", label: "الفراخ البروستد" },
  { id: "grilled", label: "الفراخ المشوية" },
  { id: "fatteh", label: "الفتة والموتزاريلا" },
  { id: "western", label: "الغربي والبرجر" },
  { id: "pizza", label: "البيتزا" },
  { id: "falafel_fries", label: "الفلافل والبطاطس" },
];

export default function FavouritesShowcase({ products }: { products: Product[] }) {
  const [tab, setTab] = useState("all");
  const trackRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (tab === "all") {
      const best = products.filter((p) => p.isBestSeller);
      return best.length >= 6 ? best : products.slice(0, 14);
    }
    return products.filter((p) => p.categoryId === tab);
  }, [products, tab]);

  const scrollTrack = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const step = Math.min(320, el.clientWidth * 0.85);
    el.scrollBy({
      left: dir === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 overflow-x-clip">
      {/* Centered Editorial Heading matching Lafet Shamia Reference */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-[#111111] tracking-tight">
          شاورمتنا وبروستدنا المفضل
        </h2>
        <p className="mt-2 text-xs sm:text-sm font-bold text-[#111111]/68">
          أشهر أصناف منيو مطعم مأكولات الشام بمدينة بدر — اختار الحجم وأضف لطلبك فورًا
        </p>
      </div>

      {/* Category Filter Pills */}
      <div
        ref={tabsRef}
        className="mt-5 -mx-4 px-4 sm:mx-0 sm:px-0 flex items-center sm:justify-center gap-2 overflow-x-auto no-scrollbar py-2"
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={(e) => {
                setTab(t.id);
                const btn = e.currentTarget;
                const box = tabsRef.current;
                if (box && btn) {
                  const boxRect = box.getBoundingClientRect();
                  const btnRect = btn.getBoundingClientRect();
                  const delta =
                    btnRect.left + btnRect.width * 0.5 - (boxRect.left + boxRect.width * 0.5);
                  box.scrollBy({ left: delta, behavior: "smooth" });
                }
                if (trackRef.current) {
                  trackRef.current.scrollTo({ left: 0, behavior: "smooth" });
                }
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-black border transition-all duration-200 cursor-pointer ${
                active
                  ? "bg-[#B90D12] text-white border-[#B90D12] shadow-[0_4px_12px_-2px_rgba(185,13,18,0.34)]"
                  : "bg-white text-[#111111]/80 border-[#111111]/10 hover:border-[#B90D12] hover:text-[#B90D12]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Horizontal Swipeable Snap Carousel */}
      <div
        ref={trackRef}
        className="mt-6 flex overflow-x-auto snap-x snap-mandatory gap-4 pb-3 no-scrollbar"
      >
        {filtered.map((product) => (
          <div
            key={product.id}
            className="w-[78vw] max-w-[285px] sm:w-[275px] lg:w-[295px] shrink-0 snap-center"
          >
            <ProductCard product={product} variant="grid" />
          </div>
        ))}
      </div>

      {/* Circular `<` `>` Controls Matching Reference + Full Menu Link */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        {filtered.length > 1 && (
          <div dir="ltr" className="flex items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => scrollTrack("left")}
              aria-label="السابق"
              className="w-10 h-10 rounded-full bg-[#F5D8A0]/65 hover:bg-[#FFD21A] text-[#B90D12] hover:text-[#111111] grid place-items-center font-black text-base transition cursor-pointer"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scrollTrack("right")}
              aria-label="التالي"
              className="w-10 h-10 rounded-full bg-[#B90D12] hover:bg-[#780508] text-white grid place-items-center font-black text-base transition cursor-pointer shadow-sm"
            >
              ›
            </button>
          </div>
        )}

        <Link
          href="/menu"
          className="rounded-full bg-white hover:bg-[#FFD21A] border border-[#B90D12]/25 text-[#B90D12] hover:text-[#111111] px-5 py-2 text-xs font-black transition"
        >
          تصفح كل الأصناف (٩ أقسام كاملة)
        </Link>
      </div>
    </section>
  );
}
