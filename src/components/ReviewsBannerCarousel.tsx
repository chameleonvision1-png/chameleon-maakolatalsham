"use client";

import { useState } from "react";
import type { Review } from "@/lib/types";
import { StarIcon } from "./icons";

export default function ReviewsBannerCarousel({ reviews }: { reviews: Review[] }) {
  const [idx, setIdx] = useState(0);

  if (!reviews || reviews.length === 0) return null;

  const total = reviews.length;
  const active = reviews[idx % total];

  const handlePrev = () => {
    setIdx((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setIdx((prev) => (prev + 1) % total);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Centered Heading Matching Reference (`كلام الناس فينا`) */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-4xl font-black text-[#111111]">
          كلام الناس فينا
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm font-bold text-[#111111]/65">
          أكثر من ١٥ ألف متابع من أهل مدينة بدر يختارون مأكولات الشام
        </p>
      </div>

      {/* Rounded Food Photo Backdrop Card + Floating Cream Quote Card + Overlapping Yellow `<` `>` Circles */}
      <div className="relative max-w-4xl mx-auto pb-6">
        <div className="relative rounded-[30px] sm:rounded-[38px] overflow-hidden min-h-[290px] sm:min-h-[360px] flex items-center justify-center p-5 sm:p-10 shadow-[0_22px_50px_-20px_rgba(17,17,17,0.45)]">
          {/* Backdrop Photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero/reviews-backdrop.webp"
            alt="آراء عملاء مأكولات الشام"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-[#111111]/45 to-[#111111]/55" />

          {/* Floating Warm Cream Quote Card */}
          <figure className="relative z-10 w-full max-w-2xl rounded-[24px] sm:rounded-[30px] bg-[#FFF8E8]/96 backdrop-blur-xs text-[#111111] border border-[#FFD21A]/50 p-5 sm:p-8 text-center shadow-2xl">
            <div className="flex items-center justify-center gap-1 text-[#F2A900] mb-3">
              {Array.from({ length: active.rating }).map((_, i) => (
                <StarIcon key={i} className="w-4 h-4" />
              ))}
            </div>

            <blockquote className="text-sm sm:text-lg font-extrabold text-[#111111] leading-7 sm:leading-8">
              &ldquo;{active.text}&rdquo;
            </blockquote>

            <figcaption className="mt-3.5 text-xs sm:text-sm font-black text-[#B90D12]">
              {active.name}
            </figcaption>
          </figure>
        </div>

        {/* Two Overlapping Golden-Yellow Circular `<` `>` Buttons at Bottom Edge (1:1 Reference Match) */}
        {total > 1 && (
          <div
            dir="ltr"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5"
          >
            <button
              type="button"
              onClick={handlePrev}
              aria-label="الرأي السابق"
              className="w-11 h-11 rounded-full bg-[#FFD21A] hover:bg-[#F2A900] text-[#111111] font-black text-lg grid place-items-center shadow-lg ring-4 ring-[#FFF8E8] transition active:scale-95 cursor-pointer"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="الرأي التالي"
              className="w-11 h-11 rounded-full bg-[#FFD21A] hover:bg-[#F2A900] text-[#111111] font-black text-lg grid place-items-center shadow-lg ring-4 ring-[#FFF8E8] transition active:scale-95 cursor-pointer"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
