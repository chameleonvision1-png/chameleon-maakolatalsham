"use client";

import { useEffect } from "react";
import { useStore } from "./store";
import { CheckIcon, ClockIcon, PhoneIcon, PinIcon, WhatsAppIcon, XIcon } from "./icons";

export default function BranchPicker() {
  const { branches, branch, setBranchId, pickerOpen, closePicker } = useStore();

  useEffect(() => {
    if (!pickerOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePicker();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [pickerOpen, closePicker]);

  if (!pickerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="branch-picker-title"
      onClick={closePicker}
    >
      <div className="absolute inset-0 bg-[#111111]/65 backdrop-blur-sm" />

      <div
        className="relative w-full sm:max-w-xl bg-[#FFF8E8] rounded-t-3xl sm:rounded-3xl shadow-2xl border-2 border-[#B90D12]/25 overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 bg-[#B90D12] text-white px-5 sm:px-6 pt-4 sm:pt-5 pb-4">
          <div className="w-12 h-1.5 rounded-full bg-white/30 mx-auto mb-3 sm:hidden" />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FFD21A] text-[#111111] grid place-items-center shrink-0">
                <PinIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 id="branch-picker-title" className="text-xl font-black text-white leading-tight">
                  شاورما وبروستد مأكولات الشام
                </h2>
                <p className="text-xs sm:text-sm text-[#FFF8E8]/85 mt-0.5">
                  ميدان النسر — إيجل مول بجوار البنك الأهلي — مدينة بدر
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closePicker}
              className="w-9 h-9 rounded-full bg-white text-[#B90D12] grid place-items-center transition shrink-0 cursor-pointer"
              aria-label="إغلاق"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Branches List */}
        <div className="flex-1 overflow-y-auto bg-[#FFF8E8] p-4 sm:p-5 space-y-4">
          {branches.map((b) => {
            const active = branch?.id === b.id;
            const phones = Array.from(
              new Set([b.phone, b.phone2, ...(b.extraPhones ?? [])].filter((x): x is string => Boolean(x)))
            );
            return (
              <div
                key={b.id}
                role="button"
                tabIndex={0}
                onClick={() => setBranchId(b.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setBranchId(b.id);
                  }
                }}
                className={`w-full text-start rounded-2xl border-2 p-4 sm:p-5 transition-all flex items-start justify-between gap-3 group cursor-pointer ${
                  active
                    ? "border-[#B90D12] bg-white shadow-md"
                    : "border-[#B90D12]/20 bg-white/90 hover:border-[#B90D12] hover:bg-white"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-base sm:text-lg text-[#B90D12]">
                      {b.name}
                    </span>
                    <span className="text-[11px] font-black bg-[#FFD21A] text-[#111111] px-2.5 py-0.5 rounded-full">
                      مفتوح الآن
                    </span>
                  </div>

                  <div className="mt-2 text-xs sm:text-sm text-[#111111]/75 flex items-start gap-1.5 font-semibold">
                    <PinIcon className="w-4 h-4 text-[#B90D12] shrink-0 mt-0.5" />
                    <span>{b.address}</span>
                  </div>

                  <div className="mt-1.5 text-xs text-[#111111]/65 flex items-center gap-1.5 font-semibold">
                    <ClockIcon className="w-3.5 h-3.5 text-[#B90D12] shrink-0" />
                    <span>{b.hours}</span>
                  </div>

                  {/* Direct Call & WhatsApp Numbers */}
                  <div
                    className="mt-3.5 flex flex-wrap items-center gap-1.5"
                    dir="ltr"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {phones.map((ph, idx) => (
                      <a
                        key={ph}
                        href={`tel:${ph}`}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-en font-black transition ${
                          idx === 0
                            ? "bg-[#B90D12] text-white hover:bg-[#780508]"
                            : "bg-[#FFF8E8] border border-[#B90D12]/25 text-[#111111] hover:bg-[#FFD21A]"
                        }`}
                      >
                        <PhoneIcon className="w-3 h-3" />
                        <span>{ph}</span>
                      </a>
                    ))}
                    <a
                      href={`https://wa.me/${b.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] text-white px-3.5 py-1.5 text-xs font-en font-black hover:brightness-105 transition"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {b.services.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF8E8] text-[#B90D12] border border-[#B90D12]/15"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <span
                  className={`w-7 h-7 rounded-full grid place-items-center shrink-0 transition ${
                    active ? "bg-[#B90D12] text-white" : "bg-[#FFF8E8] text-transparent border border-[#B90D12]/20"
                  }`}
                >
                  <CheckIcon className="w-4 h-4" />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
