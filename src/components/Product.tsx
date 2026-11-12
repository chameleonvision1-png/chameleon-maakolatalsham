"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useStore } from "./store";
import {
  CheckIcon,
  MinusIcon,
  NoteIcon,
  PinIcon,
  PlusIcon,
  XIcon,
} from "./icons";

export function isUnavailable(p: Product, branchId?: string | null) {
  return !p.isAvailable || (!!branchId && p.unavailableBranches.includes(branchId));
}

function compactSizeLabel(label: string) {
  return label.replace(/\s*\([^)]*\)/g, "").trim();
}

export function ProductCard({
  product,
  variant = "grid",
}: {
  product: Product;
  variant?: "menu" | "grid";
}) {
  const [open, setOpen] = useState(false);
  const [initialSizeId, setInitialSizeId] = useState<string | undefined>(product.sizes[0]?.id);
  const { branch } = useStore();
  const off = isUnavailable(product, branch?.id);
  const mainSize = product.sizes[0];
  const mainPrice = mainSize?.price ?? 0;

  const openModal = (sizeId?: string) => {
    if (off) return;
    setInitialSizeId(sizeId ?? product.sizes[0]?.id);
    setOpen(true);
  };

  if (variant === "menu") {
    return (
      <>
        <article
          role="button"
          tabIndex={off ? -1 : 0}
          onClick={() => openModal()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openModal();
            }
          }}
          className={`group relative w-full max-w-full min-w-0 overflow-hidden bg-white rounded-[24px] p-3.5 sm:p-4 border border-[#111111]/10 hover:border-[#B90D12] shadow-[0_6px_18px_-10px_rgba(17,17,17,0.08)] hover:shadow-[0_14px_30px_-12px_rgba(185,13,18,0.2)] transition-all duration-200 flex items-center gap-3.5 text-start ${
            off ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-black text-sm sm:text-base text-[#111111] group-hover:text-[#B90D12] transition-colors leading-snug text-right">
                  {product.nameAr}
                </h3>
                {(product.badge || product.isBestSeller) && (
                  <span className="shrink-0 text-[10px] font-black bg-[#FFD21A] text-[#111111] px-2.5 py-0.5 rounded-full">
                    {product.badge || "الأكثر طلبًا"}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-[#111111]/65 mt-1 line-clamp-2 leading-relaxed text-right">
              {product.descriptionAr}
            </p>

            <div className="mt-2.5 flex items-center justify-between gap-1.5 flex-wrap">
              <span className="inline-flex items-center rounded-full bg-[#B90D12] text-white px-3 py-0.5 text-xs font-black whitespace-nowrap shadow-xs">
                {formatPrice(mainPrice)}
              </span>

              {product.sizes.length > 1 && (
                <div className="flex items-center gap-1 flex-wrap">
                  {product.sizes.slice(0, 3).map((s) => (
                    <span
                      key={s.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(s.id);
                      }}
                      className="inline-flex items-center rounded-full bg-[#FFF8E8] hover:bg-[#FFD21A] border border-[#B90D12]/20 px-2.5 py-0.5 text-[10.5px] font-extrabold text-[#111111] whitespace-nowrap transition"
                    >
                      {compactSizeLabel(s.label)} • {s.price} ج
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[20px] overflow-hidden bg-[#FFF8E8] shrink-0 border border-[#111111]/10 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.nameAr}
              className="w-full h-full object-cover transition duration-500 group-hover:scale-108"
            />
            {off ? (
              <div className="absolute inset-0 grid place-items-center bg-[#111111]/60 backdrop-blur-[1px]">
                <span className="bg-white text-[#111111] text-[10px] font-black px-2 py-0.5 rounded-full">
                  غير متاح
                </span>
              </div>
            ) : (
              <span className="absolute bottom-1.5 end-1.5 w-7 h-7 rounded-full bg-[#B90D12] group-hover:bg-[#FFD21A] text-white group-hover:text-[#111111] grid place-items-center shadow-md transition-colors">
                <PlusIcon className="w-4 h-4" />
              </span>
            )}
          </div>
        </article>
        {open && (
          <ProductModal
            product={product}
            initialSizeId={initialSizeId}
            onClose={() => setOpen(false)}
          />
        )}
      </>
    );
  }

  // Lafet Shamia Featured Card Variant (Matches Reference Image Cards: Photo Top -> Red Price Pill Left + Bold Arabic Name Right -> Ingredients)
  return (
    <>
      <article
        role="button"
        tabIndex={off ? -1 : 0}
        onClick={() => openModal()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModal();
          }
        }}
        className={`group relative rounded-[26px] bg-white border border-[#111111]/10 hover:border-[#B90D12] p-3.5 flex flex-col justify-between shadow-[0_10px_26px_-14px_rgba(17,17,17,0.08)] hover:shadow-[0_18px_36px_-14px_rgba(185,13,18,0.22)] transition-all duration-200 text-start h-full ${
          off ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {/* Top Photo Stage */}
        <div className="relative aspect-[4/3] rounded-[20px] bg-[#FFF8E8] overflow-hidden border border-[#111111]/[0.06]">
          {(product.badge || product.isBestSeller) && (
            <span className="absolute top-2.5 right-2.5 z-10 inline-flex items-center rounded-full bg-[#FFD21A] text-[#111111] px-2.5 py-0.5 text-[10px] font-black shadow-xs">
              {product.badge || "الأكثر طلبًا"}
            </span>
          )}

          <span
            aria-label="أضف إلى السلة"
            className="absolute top-2.5 left-2.5 z-10 w-8 h-8 rounded-full bg-white/95 group-hover:bg-[#B90D12] text-[#B90D12] group-hover:text-white grid place-items-center shadow-sm transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
          </span>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.nameAr}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-106"
          />
        </div>

        {/* Bottom Details — Red Price Pill on Left + Bold Arabic Name on Right (Exact Reference Match) */}
        <div className="pt-3.5 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm sm:text-[15px] font-black text-[#111111] group-hover:text-[#B90D12] transition-colors leading-snug text-right">
                {product.nameAr}
              </h3>
              <span className="shrink-0 inline-flex items-center rounded-full bg-[#B90D12] text-white px-3 py-0.5 text-xs font-black shadow-2xs">
                {formatPrice(mainPrice)}
              </span>
            </div>

            <p className="text-xs text-[#111111]/65 mt-1.5 line-clamp-2 leading-relaxed text-right">
              {product.descriptionAr}
            </p>
          </div>

          {product.sizes.length > 1 && (
            <div className="mt-2.5 pt-2 border-t border-[#111111]/[0.06] flex items-center gap-1 flex-wrap">
              {product.sizes.slice(0, 3).map((s) => (
                <span
                  key={s.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(s.id);
                  }}
                  className="inline-flex items-center rounded-full bg-[#FFF8E8] hover:bg-[#FFD21A] px-2 py-0.5 text-[10px] font-extrabold text-[#111111] transition"
                >
                  {compactSizeLabel(s.label)} • {s.price}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
      {open && (
        <ProductModal
          product={product}
          initialSizeId={initialSizeId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

const SHAWARMA_QUICK_NOTES = [
  "ثومية زيادة",
  "بدون مخلل",
  "تحميص زيادة عالصاج",
  "سبايسي",
];

export function ProductModal({
  product,
  initialSizeId,
  onClose,
}: {
  product: Product;
  initialSizeId?: string;
  onClose: () => void;
}) {
  const { addToCart, branch } = useStore();
  const [sizeId, setSizeId] = useState(initialSizeId ?? product.sizes[0]?.id);
  const [addons, setAddons] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [added, setAdded] = useState(false);

  const size = product.sizes.find((s) => s.id === sizeId) ?? product.sizes[0];
  const chosen = product.addons.filter((a) => addons.includes(a.id));
  const addonsTotal = chosen.reduce((s, a) => s + a.price, 0);
  const unit = (size?.price ?? 0) + addonsTotal;

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const toggleQuickNote = (chip: string) => {
    const parts = note
      .split("،")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.includes(chip)) {
      setNote(parts.filter((p) => p !== chip).join("، "));
    } else {
      setNote([...parts, chip].join("، "));
    }
  };

  const add = () => {
    if (added) return;
    addToCart({
      productId: product.id,
      name: product.nameAr,
      image: product.image,
      sizeLabel: size?.label,
      addons: chosen.map((a) => ({ label: a.label, price: a.price })),
      note: note.trim() || undefined,
      unitPrice: unit,
      qty,
    });
    setAdded(true);
    setTimeout(onClose, 480);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-stretch sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      onClick={onClose}
    >
      <div className="hidden sm:block absolute inset-0 bg-[#111111]/70 backdrop-blur-md" />

      <div
        className="relative w-full h-dvh sm:h-auto sm:max-w-2xl bg-white rounded-none sm:rounded-[28px] shadow-2xl overflow-hidden sm:max-h-[88vh] flex flex-col md:flex-row sm:border border-[#B90D12]/25"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Visual Showcase Column */}
        <div className="relative h-60 sm:h-auto md:w-[45%] shrink-0 bg-[#FFF8E8] overflow-hidden flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.nameAr}
            className="w-full h-full object-cover"
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="md:hidden absolute top-3.5 start-3.5 z-20 w-10 h-10 rounded-full bg-white/95 text-[#111111] grid place-items-center shadow-lg cursor-pointer"
          >
            <XIcon className="w-5 h-5" />
          </button>

          {product.badge && (
            <span className="absolute bottom-3 right-3 z-10 rounded-full bg-[#FFD21A] text-[#111111] px-3 py-1 text-xs font-black shadow-md">
              {product.badge}
            </span>
          )}
        </div>

        {/* Customization Column */}
        <div className="flex-1 flex flex-col min-h-0 bg-white">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  id="modal-product-title"
                  className="text-xl sm:text-2xl font-black text-[#111111] leading-snug text-right"
                >
                  {product.nameAr}
                </h2>
                <p className="text-xs sm:text-sm text-[#111111]/70 mt-1.5 leading-relaxed text-right">
                  {product.descriptionAr}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق"
                className="hidden md:grid w-9 h-9 rounded-full bg-[#FFF8E8] hover:bg-[#B90D12] text-[#111111] hover:text-white place-items-center shrink-0 transition cursor-pointer"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            {branch && (
              <div className="rounded-xl bg-[#FFF8E8] border border-[#B90D12]/15 px-3 py-2 flex items-center gap-2 text-xs font-bold text-[#111111]/80">
                <PinIcon className="w-3.5 h-3.5 text-[#B90D12] shrink-0" />
                <span>يُحضّر طازجًا من: {branch.name}</span>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 1 && (
              <div>
                <div className="text-xs font-black text-[#111111] mb-2">اختار الحجم</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.sizes.map((s) => {
                    const active = s.id === size?.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSizeId(s.id)}
                        className={`rounded-2xl border p-3 flex items-center justify-between text-xs sm:text-sm font-black transition cursor-pointer ${
                          active
                            ? "border-[#B90D12] bg-[#B90D12] text-white shadow-sm"
                            : "border-[#111111]/12 bg-[#FFF8E8]/60 hover:border-[#B90D12] text-[#111111]"
                        }`}
                      >
                        <span>{s.label}</span>
                        <span className={active ? "text-[#FFD21A]" : "text-[#B90D12]"}>
                          {formatPrice(s.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Addons */}
            {product.addons.length > 0 && (
              <div>
                <div className="text-xs font-black text-[#111111] mb-2">إضافات اختيارية</div>
                <div className="space-y-1.5">
                  {product.addons.map((a) => {
                    const checked = addons.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() =>
                          setAddons((prev) =>
                            checked ? prev.filter((x) => x !== a.id) : [...prev, a.id]
                          )
                        }
                        className={`w-full rounded-xl border px-3.5 py-2.5 flex items-center justify-between text-xs font-extrabold transition cursor-pointer ${
                          checked
                            ? "border-[#B90D12] bg-[#FFF8E8] text-[#B90D12]"
                            : "border-[#111111]/10 bg-white hover:bg-[#FFF8E8]/50 text-[#111111]"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-4 h-4 rounded-md border grid place-items-center ${
                              checked
                                ? "bg-[#B90D12] border-[#B90D12] text-white"
                                : "border-[#111111]/30"
                            }`}
                          >
                            {checked && <CheckIcon className="w-3 h-3" />}
                          </span>
                          <span>{a.label}</span>
                        </span>
                        <span className="font-black text-[#B90D12]">+{formatPrice(a.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black text-[#111111] mb-2">
                <NoteIcon className="w-3.5 h-3.5 text-[#B90D12]" />
                <span>ملاحظات التحضير (اختياري)</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {SHAWARMA_QUICK_NOTES.map((chip) => {
                  const active = note.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => toggleQuickNote(chip)}
                      className={`px-3 py-1 rounded-full text-[11px] font-extrabold border transition cursor-pointer ${
                        active
                          ? "bg-[#FFD21A] text-[#111111] border-[#FFD21A]"
                          : "bg-[#FFF8E8] text-[#111111]/75 border-[#111111]/10 hover:border-[#B90D12]"
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="مثال: بدون خيار مخلل، عيش محمص زيادة…"
                className="input text-xs"
              />
            </div>
          </div>

          {/* Sticky Bottom Add-to-Cart Bar */}
          <div className="shrink-0 p-4 border-t border-[#111111]/10 bg-[#FFF8E8] flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white border border-[#111111]/12 rounded-full p-1">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full hover:bg-[#FFF8E8] grid place-items-center cursor-pointer"
                aria-label="تقليل الكمية"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-black text-sm tabular-nums">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(50, q + 1))}
                className="w-8 h-8 rounded-full hover:bg-[#FFF8E8] grid place-items-center cursor-pointer"
                aria-label="زيادة الكمية"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={add}
              className={`flex-1 rounded-full py-3 px-5 font-black text-sm flex items-center justify-between transition cursor-pointer shadow-md ${
                added
                  ? "bg-[#19B536] text-white"
                  : "bg-[#B90D12] hover:bg-[#780508] text-white"
              }`}
            >
              <span>{added ? "تمت الإضافة للسلة" : "أضف إلى السلة"}</span>
              <span className="rounded-full bg-[#FFD21A] text-[#111111] px-3 py-0.5 text-xs font-black tabular-nums">
                {formatPrice(unit * qty)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
