"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./Product";
import { useStore } from "./store";
import {
  GridIcon,
  ListIcon,
  PinIcon,
  SearchIcon,
  XIcon,
} from "./icons";

const filters = [
  { id: "all", label: "كل الأقسام" },
  { id: "best", label: "الأكثر طلبًا" },
  { id: "shawarma", label: "الشاورما والعربي" },
  { id: "chicken", label: "البروستد والمشوي" },
  { id: "family", label: "وجبات العيلة" },
];

const categoryDescriptions: Record<string, string> = {
  shawarma_sandwiches:
    "سندوتشات شاورما فراخ ولحمة عيش سوري عالصاج، فرنساوي، وكيزر بأحجام M و L و XL مع الثومية والمخلل",
  shawarma_meals:
    "وجبات شاورما عربي عادي ودبل، وجبة مأكولات الشام (ماريا بالموتزاريلا)، وشاورما بالوزن نصف كيلو وكيلو",
  broasted:
    "فراخ بروستد ذهبية مقرمشة بالتتبيلة الشامية الأصيلة (ربع، نصف، وفرخة كاملة) مع البطاطس والثومية والكولسلو",
  grilled:
    "فراخ مشوية على الفحم والأورينتال بتتبيلة مأكولات الشام الخاصة مع الأرز البسمتي والسلطات والعيش السوري",
  fatteh:
    "فتة شاورما فراخ ولحمة وميكس وفتة كرسبي وشيش بالموتزاريلا السايحة والمشروم مع الأرز البسمتي المبهر",
  western:
    "سندوتشات ووجبات كرسبي، زنجر حار، شيش طاووق، بانيه، وبرجر وتشيز برجر طازج",
  pizza:
    "بيتزا طازجة مخبوزة بأحجام وسط وكبير (شاورما فراخ ولحمة، مارجريتا، سوبريم، كرسبي، ومشكل جبن)",
  falafel_fries:
    "سندوتشات فلافل سوري بالحمص وسندوتشات بطاطس سوري عالصاج بالثومية والجبنة الموتزاريلا",
  sides_drinks:
    "ثومية سورية، كولسلو، فتوش، تبولة/سلطة خضراء، بطاطس، أرز بسمتي، صوص شيدر، ومشروبات باردة",
};

const MenuChapters = memo(function MenuChapters({
  visibleCats,
  filtered,
  view,
  setSectionRef,
}: {
  visibleCats: Category[];
  filtered: Product[];
  view: "menu" | "grid";
  setSectionRef: (id: string, el: HTMLElement | null) => void;
}) {
  return (
    <div className="space-y-8 min-w-0 w-full max-w-full">
      {visibleCats.map((c, idx) => {
        const items = filtered.filter((p) => p.categoryId === c.id);
        const desc =
          categoryDescriptions[c.id] ||
          "يُحضّر طازجًا فور الطلب في مطعم شاورما وبروستد مأكولات الشام — إيجل مول مدينة بدر";
        return (
          <section
            key={c.id}
            id={`cat-${c.id}`}
            ref={(el) => setSectionRef(c.id, el)}
            className="scroll-mt-36 w-full max-w-full min-w-0 overflow-hidden bg-white rounded-[32px] p-4 sm:p-6 border border-[#B90D12]/16 shadow-[0_10px_28px_-14px_rgba(185,13,18,0.1)]"
          >
            {/* Menu Chapter Header */}
            <div className="flex items-center gap-3.5 sm:gap-4 mb-5 pb-4 border-b border-[#B90D12]/12 min-w-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FFF8E8] border border-[#B90D12]/15 overflow-hidden shrink-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.nameAr}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2.5 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      dir="ltr"
                      className="font-en text-xs font-extrabold text-[#B90D12] bg-[#FFF8E8] border border-[#B90D12]/20 px-2.5 py-0.5 rounded-full"
                    >
                      /{String(idx + 1).padStart(2, "0")}
                    </span>
                    <h2 className="inline-flex items-center rounded-xl bg-[#B90D12] text-white px-3.5 py-1 text-base sm:text-xl font-black shadow-xs text-right">
                      {c.nameAr}
                    </h2>
                    <span className="text-xs font-extrabold bg-[#FFD21A] text-[#111111] px-2.5 py-0.5 rounded-full">
                      {items.length} صنف
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#111111]/68 mt-1.5 text-right">{desc}</p>
              </div>
            </div>

            {view === "menu" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 min-w-0 w-full">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} variant="menu" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-w-0 w-full">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} variant="grid" />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
});

export default function MenuClient({
  categories,
  products,
  initialCat,
}: {
  categories: Category[];
  products: Product[];
  initialCat?: string;
}) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState<"menu" | "grid">("menu");
  const [activeCat, setActiveCat] = useState(initialCat ?? categories[0]?.id);
  const activeCatRef = useRef(activeCat);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const stickyBarRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const isJumpingRef = useRef(false);
  const jumpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pillRafRef = useRef<number>(0);
  const animatingCatRef = useRef<string | null>(null);
  const isStripTouchingRef = useRef(false);
  const stripTouchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { branch, openPicker, hydrated } = useStore();

  useEffect(() => {
    activeCatRef.current = activeCat;
  }, [activeCat]);

  const setSectionRef = useCallback((id: string, el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter((p) => {
      if (
        term &&
        !(
          p.nameAr.toLowerCase().includes(term) ||
          (p.nameEn && p.nameEn.toLowerCase().includes(term)) ||
          p.descriptionAr.toLowerCase().includes(term)
        )
      ) {
        return false;
      }
      switch (filter) {
        case "best":
          return p.isBestSeller;
        case "shawarma":
          return (
            p.categoryId === "shawarma_sandwiches" ||
            p.categoryId === "shawarma_meals" ||
            p.categoryId === "fatteh"
          );
        case "chicken":
          return p.categoryId === "broasted" || p.categoryId === "grilled";
        case "family":
          return Boolean(
            p.forFamily ||
              p.categoryId === "broasted" ||
              p.categoryId === "grilled" ||
              p.categoryId === "pizza"
          );
        default:
          return true;
      }
    });
  }, [q, filter, products]);

  const visibleCats = useMemo(
    () => categories.filter((c) => filtered.some((p) => p.categoryId === c.id)),
    [categories, filtered],
  );

  const catCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of filtered) {
      map[p.categoryId] = (map[p.categoryId] || 0) + 1;
    }
    return map;
  }, [filtered]);

  const centerActivePill = useCallback((catId: string, immediate = false) => {
    const box = pillsRef.current;
    const pill = box?.querySelector<HTMLElement>(`[data-cat="${catId}"]`);
    if (!box || !pill) return;

    if (!immediate && pillRafRef.current && animatingCatRef.current === catId) {
      return;
    }

    if (pillRafRef.current) {
      cancelAnimationFrame(pillRafRef.current);
      pillRafRef.current = 0;
    }

    const boxRect = box.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    const delta =
      pillRect.left + pillRect.width * 0.5 - (boxRect.left + boxRect.width * 0.5);

    if (Math.abs(delta) < 2) {
      animatingCatRef.current = null;
      return;
    }

    const startScrollLeft = box.scrollLeft;
    if (immediate) {
      box.scrollLeft = startScrollLeft + delta;
      animatingCatRef.current = null;
      return;
    }

    animatingCatRef.current = catId;
    const startTime = performance.now();
    const duration = Math.min(360, Math.max(240, Math.abs(delta) * 1.1));

    const step = (now: number) => {
      if (isStripTouchingRef.current) {
        pillRafRef.current = 0;
        animatingCatRef.current = null;
        return;
      }
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      box.scrollLeft = startScrollLeft + delta * eased;

      if (t < 1) {
        pillRafRef.current = requestAnimationFrame(step);
      } else {
        pillRafRef.current = 0;
        animatingCatRef.current = null;
      }
    };
    pillRafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    if (!activeCat) return;
    if (!isStripTouchingRef.current) {
      centerActivePill(activeCat, false);
    }
  }, [activeCat, visibleCats, centerActivePill]);

  useEffect(() => {
    if (initialCat) {
      setTimeout(() => {
        const el = sectionRefs.current[initialCat];
        if (!el) return;
        const stickyBottom = stickyBarRef.current?.getBoundingClientRect().bottom ?? 120;
        const top = window.scrollY + el.getBoundingClientRect().top - stickyBottom - 14;
        window.scrollTo({
          top: Math.max(0, top),
          behavior: "smooth",
        });
      }, 40);
    }
  }, [initialCat]);

  useEffect(() => {
    if (visibleCats.length === 0) return;
    let ticking = false;

    const unlockJumpOnManualInput = () => {
      if (isJumpingRef.current) {
        isJumpingRef.current = false;
        if (jumpTimerRef.current) {
          clearTimeout(jumpTimerRef.current);
          jumpTimerRef.current = null;
        }
      }
    };

    const onScroll = () => {
      if (isJumpingRef.current || ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const stickyBottom =
          stickyBarRef.current?.getBoundingClientRect().bottom ?? 120;
        const triggerLine = stickyBottom + 24;
        const hysteresis = 20;
        const prevId = activeCatRef.current;
        let candidateId = visibleCats[0].id;

        const doc = document.documentElement;
        if (window.innerHeight + window.scrollY >= doc.scrollHeight - 24) {
          candidateId = visibleCats[visibleCats.length - 1].id;
        } else {
          for (const c of visibleCats) {
            const el = sectionRefs.current[c.id];
            if (!el) continue;
            if (el.getBoundingClientRect().top <= triggerLine) {
              candidateId = c.id;
            } else {
              break;
            }
          }

          if (candidateId !== prevId) {
            const prevIdx = visibleCats.findIndex((c) => c.id === prevId);
            const candIdx = visibleCats.findIndex((c) => c.id === candidateId);

            if (prevIdx !== -1 && candIdx === prevIdx + 1) {
              const nextEl = sectionRefs.current[candidateId];
              if (
                nextEl &&
                nextEl.getBoundingClientRect().top > triggerLine - hysteresis
              ) {
                candidateId = prevId;
              }
            } else if (prevIdx !== -1 && candIdx === prevIdx - 1) {
              const prevEl = sectionRefs.current[prevId];
              if (
                prevEl &&
                prevEl.getBoundingClientRect().top < triggerLine + hysteresis
              ) {
                candidateId = prevId;
              }
            }
          }
        }

        if (candidateId !== prevId) {
          activeCatRef.current = candidateId;
          setActiveCat(candidateId);
        }
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", unlockJumpOnManualInput, { passive: true });
    window.addEventListener("touchmove", unlockJumpOnManualInput, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", unlockJumpOnManualInput);
      window.removeEventListener("touchmove", unlockJumpOnManualInput);
      if (jumpTimerRef.current) clearTimeout(jumpTimerRef.current);
      if (stripTouchTimerRef.current) clearTimeout(stripTouchTimerRef.current);
      if (pillRafRef.current) cancelAnimationFrame(pillRafRef.current);
    };
  }, [visibleCats]);

  const jump = (id: string) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    isStripTouchingRef.current = false;
    isJumpingRef.current = true;
    activeCatRef.current = id;
    setActiveCat(id);
    centerActivePill(id, false);
    if (jumpTimerRef.current) clearTimeout(jumpTimerRef.current);

    const stickyBottom = stickyBarRef.current?.getBoundingClientRect().bottom ?? 120;
    const top = window.scrollY + el.getBoundingClientRect().top - stickyBottom - 14;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: "smooth",
    });

    jumpTimerRef.current = setTimeout(() => {
      isJumpingRef.current = false;
    }, 650);
  };

  return (
    <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-5 w-full min-w-0">
      {/* Clean Symmetrical Search + View Switcher + Filter Strip */}
      <div className="bg-white rounded-[26px] p-3.5 sm:p-4 border border-[#B90D12]/16 shadow-[0_10px_28px_-14px_rgba(185,13,18,0.1)] space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <SearchIcon className="w-4 h-4 text-[#B90D12] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث في المنيو (شاورما صاج، عربي دبل، فرخة بروستد، فتة…)"
              className="w-full rounded-full border border-[#111111]/14 bg-[#FFF8E8]/65 focus:bg-white focus:border-[#B90D12] focus:outline-none pr-10 pl-9 py-2.5 text-xs sm:text-sm font-bold text-[#111111]"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="مسح البحث"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111111]/45 hover:text-[#B90D12] cursor-pointer"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Symmetrical Segmented View Switcher + Branch */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            <div className="grid grid-cols-2 flex-1 sm:flex-initial rounded-full bg-[#FFF8E8] border border-[#B90D12]/15 p-1">
              <button
                type="button"
                onClick={() => setView("menu")}
                className={`rounded-full px-3.5 py-1.5 text-xs font-black inline-flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  view === "menu"
                    ? "bg-[#B90D12] text-white shadow-xs"
                    : "text-[#111111]/75 hover:text-[#B90D12]"
                }`}
              >
                <ListIcon className="w-3.5 h-3.5 shrink-0" />
                <span>قائمة</span>
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`rounded-full px-3.5 py-1.5 text-xs font-black inline-flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  view === "grid"
                    ? "bg-[#B90D12] text-white shadow-xs"
                    : "text-[#111111]/75 hover:text-[#B90D12]"
                }`}
              >
                <GridIcon className="w-3.5 h-3.5 shrink-0" />
                <span>بطاقات</span>
              </button>
            </div>

            {hydrated && branch && (
              <button
                type="button"
                onClick={openPicker}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#FFF8E8] hover:bg-[#FFD21A] border border-[#B90D12]/20 px-3 py-2 text-[11px] font-black text-[#B90D12] hover:text-[#111111] transition cursor-pointer"
              >
                <PinIcon className="w-3.5 h-3.5 shrink-0" />
                <span>إيجل مول</span>
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Swipeable Filter Chips (Zero Cartoon Icons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {filters.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-black border transition cursor-pointer ${
                  active
                    ? "bg-[#B90D12] text-white border-[#B90D12]"
                    : "bg-[#FFF8E8] text-[#111111]/80 border-[#111111]/10 hover:border-[#B90D12]"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky Category Jump Strip */}
      <div
        ref={stickyBarRef}
        className="sticky top-14 lg:top-16 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-2.5 mt-3 bg-[#FFF8E8]/95 backdrop-blur-md border-b border-[#B90D12]/12"
      >
        <div
          ref={pillsRef}
          onTouchStart={() => {
            isStripTouchingRef.current = true;
            if (stripTouchTimerRef.current) clearTimeout(stripTouchTimerRef.current);
          }}
          onTouchEnd={() => {
            if (stripTouchTimerRef.current) clearTimeout(stripTouchTimerRef.current);
            stripTouchTimerRef.current = setTimeout(() => {
              isStripTouchingRef.current = false;
            }, 400);
          }}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5"
        >
          {visibleCats.map((c) => {
            const active = activeCat === c.id;
            return (
              <button
                key={c.id}
                type="button"
                data-cat={c.id}
                onClick={() => jump(c.id)}
                className={`shrink-0 rounded-full px-3.5 py-2 text-xs sm:text-sm font-black inline-flex items-center gap-2 border transition cursor-pointer ${
                  active
                    ? "bg-[#B90D12] text-white border-[#B90D12] shadow-sm"
                    : "bg-white text-[#111111]/85 border-[#111111]/10 hover:border-[#B90D12] hover:text-[#B90D12]"
                }`}
              >
                <span>{c.nameAr}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                    active ? "bg-[#FFD21A] text-[#111111]" : "bg-[#FFF8E8] text-[#B90D12]"
                  }`}
                >
                  {catCounts[c.id] || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Sections */}
      <div className="mt-6">
        {visibleCats.length === 0 ? (
          <div className="rounded-[28px] bg-white border border-[#B90D12]/15 p-12 text-center">
            <h3 className="text-lg font-black text-[#111111]">لا توجد أصناف مطابقة لبحثك</h3>
            <p className="text-xs sm:text-sm text-[#111111]/65 mt-1 font-semibold">
              جرّب كلمة بحث أخرى أو اعرض كل أقسام منيو مأكولات الشام
            </p>
            <button
              type="button"
              onClick={() => {
                setQ("");
                setFilter("all");
              }}
              className="btn btn-primary mt-4 text-xs"
            >
              عرض كل المنيو
            </button>
          </div>
        ) : (
          <MenuChapters
            visibleCats={visibleCats}
            filtered={filtered}
            view={view}
            setSectionRef={setSectionRef}
          />
        )}
      </div>
    </div>
  );
}
