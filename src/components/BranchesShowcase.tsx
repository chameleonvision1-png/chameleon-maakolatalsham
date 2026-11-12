"use client";

import type { Branch } from "@/lib/types";
import { ClockIcon, ExternalLinkIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./icons";
import { OrderFromBranchButton } from "./BranchButtons";

const BADR_NEIGHBORHOODS = [
  "ميدان النسر وإيجل مول والمركز التجاري",
  "الحي الأول والثاني والثالث",
  "الحي الرابع والخامس (الياسمين)",
  "الحي السادس والسابع (الأندلس)",
  "كمبوند دار مصر وسكن مصر",
  "الحي المتميز وزهرة العاصمة",
];

const DEFAULT_PHONES = [
  "01023182006",
  "01122060877",
  "01554545824",
  "01228722219",
  "01114101253",
];

export default function BranchesShowcase({ branches }: { branches: Branch[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {branches.map((b) => {
        const allPhones = Array.from(
          new Set(
            [b.phone, b.phone2, ...(b.extraPhones ?? []), ...DEFAULT_PHONES].filter(
              (x): x is string => Boolean(x)
            )
          )
        );

        return (
          <div
            key={b.id}
            className="lg:col-span-7 rounded-[32px] bg-white p-6 sm:p-8 flex flex-col border border-[#B90D12]/20 shadow-[0_14px_34px_-16px_rgba(185,13,18,0.14)]"
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="text-xs font-extrabold tracking-widest uppercase text-[#B90D12] mb-1.5">
                  <span dir="ltr" className="font-en">
                    EAGLE MALL • BADR CITY
                  </span>
                </div>
                <h3 className="font-black text-xl sm:text-2xl text-[#111111] leading-snug text-right">
                  {b.name}
                </h3>
              </div>
              <span className="shrink-0 text-xs font-black bg-[#FFD21A] text-[#111111] px-3.5 py-1.5 rounded-full">
                {b.city} • مفتوح الآن
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#111111]/80 mt-3.5 flex items-start gap-2 font-bold leading-relaxed text-right">
              <PinIcon className="w-4 h-4 shrink-0 text-[#B90D12] mt-0.5" />
              <span>{b.address}</span>
            </p>
            <p className="text-xs sm:text-sm text-[#111111]/70 mt-2 flex items-center gap-2 font-semibold text-right">
              <ClockIcon className="w-4 h-4 shrink-0 text-[#B90D12]" />
              <span>{b.hours}</span>
            </p>

            {/* All 5 Clickable Order Hotlines */}
            <div className="mt-4 pt-4 border-t border-[#B90D12]/12">
              <div className="text-xs font-black text-[#111111]/75 mb-2.5">
                أرقام الطلبات والتوصيل السريع:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" dir="ltr">
                {allPhones.map((ph, idx) => (
                  <a
                    key={ph}
                    href={`tel:${ph}`}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-en font-extrabold border transition ${
                      idx === 0
                        ? "bg-[#B90D12] hover:bg-[#780508] text-white border-[#B90D12]"
                        : "bg-[#FFF8E8] hover:bg-[#FFD21A] text-[#111111] border-[#B90D12]/20"
                    }`}
                  >
                    <PhoneIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{ph}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
              {b.services.map((s) => (
                <span
                  key={s}
                  className="text-[11px] font-extrabold bg-[#FFF8E8] px-2.5 py-1.5 rounded-full text-[#111111]/85 border border-[#B90D12]/15 text-center truncate"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Google Maps Dual Links + Order CTA */}
            <div className="mt-auto pt-5 flex flex-wrap items-center gap-2.5">
              <OrderFromBranchButton
                branchId={b.id}
                className="btn btn-primary text-xs sm:text-sm py-3 px-5 flex-1"
              />
              <a
                href={`https://wa.me/${b.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 shrink-0 rounded-full bg-[#25D366] text-white grid place-items-center hover:brightness-105 transition-all shadow-sm"
                aria-label="واتساب الطلبات"
                title="طلب عبر واتساب"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
              <a
                href={b.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#FFD21A] hover:bg-[#F2A900] text-[#111111] px-4 py-2.5 text-xs font-black inline-flex items-center gap-1.5 transition"
                title="الموقع على خرائط جوجل"
              >
                <PinIcon className="w-4 h-4 text-[#B90D12]" />
                <span>خريطة إيجل مول</span>
                <ExternalLinkIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        );
      })}

      {/* Badr City Neighborhood Delivery Bento Card */}
      <div className="lg:col-span-5 rounded-[32px] bg-gradient-to-b from-[#B90D12] to-[#780508] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-lg">
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[#FFD21A]/20 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-extrabold text-[#FFD21A]">
              نطاق التوصيل السريع
            </span>
            <span dir="ltr" className="font-en text-xs text-white/70 tracking-widest">
              DELIVERY ZONES
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white text-right">
            من إيجل مول لحد باب بيتك في مدينة بدر
          </h3>
          <p className="text-xs sm:text-sm text-[#FFF8E8]/85 mt-1.5 leading-relaxed text-right">
            سندوتشات الشاورما عالصاج، الفراخ البروستد والمشوية، والفتة الشامية بتوصلك سخنة وطازة لكل أحياء ومجاورات مدينة بدر.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-2">
            {BADR_NEIGHBORHOODS.map((zone, idx) => (
              <div
                key={zone}
                className="rounded-2xl bg-black/20 border border-white/15 px-3.5 py-2.5 flex items-center justify-between gap-2"
              >
                <span className="text-xs font-extrabold text-white text-right">{zone}</span>
                <span dir="ltr" className="font-en text-[11px] text-[#FFD21A] shrink-0">
                  /0{idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-5 pt-4 border-t border-white/15 flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-white/90">
            واتساب الطلبات السريع:
          </span>
          <a
            href="https://wa.me/201023182006"
            target="_blank"
            rel="noreferrer"
            dir="ltr"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD21A] text-[#111111] px-4 py-1.5 text-xs font-en font-black hover:bg-white transition"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>01023182006</span>
          </a>
        </div>
      </div>
    </div>
  );
}
