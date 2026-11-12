"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";
import { useStore } from "./store";
import {
  ChevronDownIcon,
  ClockIcon,
  ExternalLinkIcon,
  PhoneIcon,
  PinIcon,
  UtensilsIcon,
  WhatsAppIcon,
  XIcon,
} from "./icons";

const FALLBACK_PHONES = [
  "01023182006",
  "01122060877",
  "01554545824",
  "01228722219",
  "01114101253",
];

export default function BranchPicker() {
  const { branches, setBranchId, pickerOpen, closePicker } = useStore();
  const [phonesOpen, setPhonesOpen] = useState(false);

  useLockBodyScroll(pickerOpen);

  useEffect(() => {
    if (!pickerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePicker();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pickerOpen, closePicker]);

  if (!pickerOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[92] flex items-end sm:items-center justify-center sm:p-4 overscroll-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="branch-picker-title"
    >
      {/* Touch-isolated Backdrop */}
      <div
        className="absolute inset-0 bg-[#111111]/68 backdrop-blur-xs touch-none"
        onClick={closePicker}
      />

      {/* Modal Sheet */}
      <div
        dir="rtl"
        className="relative z-10 w-full sm:max-w-md bg-[#FFF8E8] rounded-t-[28px] sm:rounded-[28px] shadow-2xl border-2 border-[#B90D12]/25 overflow-hidden flex flex-col max-h-[88dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Symmetrical 3-Column Header (Logo Left شمال | Centered Title | Close Right يمين) */}
        <div className="shrink-0 bg-gradient-to-l from-[#B90D12] to-[#780508] text-white px-4 pt-3.5 pb-3.5 border-b border-[#FFD21A]/25">
          <div className="w-11 h-1 rounded-full bg-white/30 mx-auto mb-2.5 sm:hidden" />

          <div dir="ltr" className="grid grid-cols-[40px_1fr_40px] items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-emblem.webp"
              alt="مأكولات الشام"
              className="w-10 h-10 rounded-full object-contain drop-shadow-md select-none"
            />

            <div dir="rtl" className="text-center min-w-0">
              <h2
                id="branch-picker-title"
                className="text-sm sm:text-base font-black text-white leading-tight truncate"
              >
                شاورما وبروستد مأكولات الشام
              </h2>
              <p className="text-[11px] text-[#FFD21A] font-bold mt-0.5 truncate">
                مدينة بدر • ميدان النسر • إيجل مول
              </p>
            </div>

            <button
              type="button"
              onClick={closePicker}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#B90D12] grid place-items-center transition cursor-pointer"
              aria-label="إغلاق"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Scroll-Isolated Symmetrical Body (`data-modal-scroll`) */}
        <div
          data-modal-scroll
          className="flex-1 overflow-y-auto overscroll-contain touch-pan-y bg-[#FFF8E8] p-4 space-y-3"
        >
          {branches.map((b) => {
            const phones = Array.from(
              new Set(
                [b.phone, b.phone2, ...(b.extraPhones ?? []), ...FALLBACK_PHONES].filter(
                  (x): x is string => Boolean(x)
                )
              )
            );
            const primaryPhone = phones[0] || "01023182006";
            const extraPhones = phones.slice(1);

            return (
              <div
                key={b.id}
                onClick={() => setBranchId(b.id)}
                className="w-full rounded-2xl border border-[#B90D12]/20 bg-white p-4 shadow-xs space-y-3"
              >
                {/* Branch Title + Status Pill */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#B90D12]/10">
                  <span className="font-black text-sm sm:text-base text-[#111111] truncate">
                    {b.name}
                  </span>
                  <span className="shrink-0 text-[11px] font-black bg-[#FFD21A] text-[#111111] px-3 py-0.5 rounded-full">
                    مفتوح الآن
                  </span>
                </div>

                {/* Address & Hours Box */}
                <div className="rounded-2xl bg-[#FFF8E8] border border-[#B90D12]/12 p-3 space-y-1.5">
                  <div className="text-xs text-[#111111]/85 flex items-start gap-2 font-bold leading-relaxed">
                    <PinIcon className="w-4 h-4 text-[#B90D12] shrink-0 mt-0.5" />
                    <span>{b.address}</span>
                  </div>
                  <div className="text-xs text-[#111111]/68 flex items-center gap-2 font-semibold">
                    <ClockIcon className="w-4 h-4 text-[#B90D12] shrink-0" />
                    <span>{b.hours}</span>
                  </div>
                </div>

                {/* Primary Contact Row — Strict 2 Equal Columns */}
                <div
                  className="grid grid-cols-2 gap-2"
                  dir="ltr"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={`tel:${primaryPhone}`}
                    className="h-11 rounded-2xl bg-[#B90D12] hover:bg-[#780508] text-white px-3 flex items-center justify-center gap-1.5 text-xs font-en font-black transition shadow-2xs"
                  >
                    <PhoneIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{primaryPhone}</span>
                  </a>

                  <a
                    href={`https://wa.me/${b.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    dir="rtl"
                    className="h-11 rounded-2xl bg-[#111111] hover:bg-black text-[#FFD21A] px-3 flex items-center justify-center gap-1.5 text-xs font-black transition shadow-2xs"
                  >
                    <WhatsAppIcon className="w-4 h-4 shrink-0" />
                    <span>طلب واتساب</span>
                  </a>
                </div>

                {/* Secondary Action Row — Strict 2 Equal Columns (Extra Phones Dropdown + Map Link) */}
                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPhonesOpen((v) => !v)}
                      aria-expanded={phonesOpen}
                      className="h-10 rounded-2xl bg-[#FFF8E8] hover:bg-[#FFD21A]/35 border border-[#B90D12]/18 px-3 flex items-center justify-between gap-1.5 text-xs font-black text-[#111111] transition cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <PhoneIcon className="w-3.5 h-3.5 text-[#B90D12] shrink-0" />
                        <span className="truncate">باقي الأرقام ({extraPhones.length})</span>
                      </span>
                      <ChevronDownIcon
                        className={`w-3.5 h-3.5 text-[#B90D12] shrink-0 transition-transform duration-200 ${
                          phonesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <a
                      href={b.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="h-10 rounded-2xl bg-[#FFD21A] hover:bg-[#F2A900] text-[#111111] px-3 flex items-center justify-center gap-1.5 text-xs font-black transition"
                    >
                      <PinIcon className="w-3.5 h-3.5 text-[#B90D12] shrink-0" />
                      <span className="truncate">خريطة إيجل مول</span>
                      <ExternalLinkIcon className="w-3 h-3 shrink-0" />
                    </a>
                  </div>

                  {/* Expanded Extra Phones — Symmetrical 2x2 Grid */}
                  {phonesOpen && extraPhones.length > 0 && (
                    <div
                      className="rounded-2xl bg-[#FFF8E8] border border-[#B90D12]/15 p-2.5 grid grid-cols-2 gap-2"
                      dir="ltr"
                    >
                      {extraPhones.map((ph) => (
                        <a
                          key={ph}
                          href={`tel:${ph}`}
                          className="h-9 rounded-xl bg-white hover:bg-[#FFD21A] text-[#111111] border border-[#B90D12]/18 px-2.5 flex items-center justify-center gap-1.5 text-xs font-en font-extrabold transition"
                        >
                          <PhoneIcon className="w-3 h-3 text-[#B90D12] shrink-0" />
                          <span>{ph}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Branch Services — Symmetrical 2x2 Grid (Zero Random Wrapping) */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {b.services.map((s) => (
                    <div
                      key={s}
                      className="rounded-xl bg-[#FFF8E8] border border-[#B90D12]/14 py-2 px-2.5 text-center text-[11px] font-extrabold text-[#111111]/85 truncate"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Pinned Symmetrical Footer CTA */}
        <div className="shrink-0 p-3.5 bg-white border-t border-[#B90D12]/15">
          <Link
            href="/menu"
            onClick={closePicker}
            className="w-full h-11 rounded-full bg-[#B90D12] hover:bg-[#780508] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm"
          >
            <UtensilsIcon className="w-4 h-4 text-[#FFD21A]" />
            <span>تصفح منيو مأكولات الشام واطلب الآن</span>
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
