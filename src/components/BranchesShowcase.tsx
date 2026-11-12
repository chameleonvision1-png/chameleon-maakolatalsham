"use client";

import { useState } from "react";
import type { Branch } from "@/lib/types";
import {
  ChevronDownIcon,
  ClockIcon,
  ExternalLinkIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
} from "./icons";
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
  const [phonesOpen, setPhonesOpen] = useState(false);
  const [zonesOpen, setZonesOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
      {branches.map((b) => {
        const allPhones = Array.from(
          new Set(
            [b.phone, b.phone2, ...(b.extraPhones ?? []), ...DEFAULT_PHONES].filter(
              (x): x is string => Boolean(x)
            )
          )
        );
        const primaryPhone = allPhones[0] || "01023182006";

        return (
          <div
            key={b.id}
            className="lg:col-span-7 rounded-[28px] sm:rounded-[32px] bg-white p-5 sm:p-7 flex flex-col border border-[#B90D12]/18 shadow-[0_14px_34px_-16px_rgba(185,13,18,0.12)] min-w-0"
          >
            {/* Symmetrical Top Row */}
            <div className="flex items-center justify-between gap-2.5 flex-wrap">
              <h3 className="font-black text-lg sm:text-2xl text-[#111111] leading-snug text-right">
                {b.name}
              </h3>
              <span className="shrink-0 text-xs font-black bg-[#FFD21A] text-[#111111] px-3 py-1 rounded-full">
                {b.city} • مفتوح الآن
              </span>
            </div>

            <div className="mt-3 space-y-1.5 text-xs sm:text-sm">
              <p className="text-[#111111]/80 flex items-start gap-2 font-bold leading-relaxed text-right">
                <PinIcon className="w-4 h-4 shrink-0 text-[#B90D12] mt-0.5" />
                <span>{b.address}</span>
              </p>
              <p className="text-[#111111]/68 flex items-center gap-2 font-semibold text-right">
                <ClockIcon className="w-4 h-4 shrink-0 text-[#B90D12]" />
                <span>{b.hours}</span>
              </p>
            </div>

            {/* Collapsible Dropdown (`دروب منيو`) for All 5 Order Phone Numbers */}
            <div className="mt-4 rounded-2xl bg-[#FFF8E8] border border-[#B90D12]/16 overflow-hidden">
              <div className="p-2.5 sm:p-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setPhonesOpen((v) => !v)}
                  aria-expanded={phonesOpen}
                  className="flex-1 flex items-center justify-between gap-1.5 text-xs sm:text-sm font-black text-[#111111] hover:text-[#B90D12] transition cursor-pointer text-right min-w-0"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <PhoneIcon className="w-3.5 h-3.5 text-[#B90D12] shrink-0" />
                    <span className="whitespace-nowrap">كل الأرقام (٥)</span>
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-[#B90D12] shrink-0 transition-transform duration-200 ${
                      phonesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <a
                  href={`tel:${primaryPhone}`}
                  dir="ltr"
                  className="shrink-0 rounded-full bg-[#B90D12] hover:bg-[#780508] text-white px-3 py-1.5 text-xs font-en font-black inline-flex items-center gap-1 transition"
                >
                  <PhoneIcon className="w-3 h-3 shrink-0" />
                  <span>{primaryPhone}</span>
                </a>
              </div>

              {phonesOpen && (
                <div
                  className="px-3 pb-3 pt-2 border-t border-[#B90D12]/12 grid grid-cols-2 sm:grid-cols-3 gap-2"
                  dir="ltr"
                >
                  {allPhones.map((ph, idx) => (
                    <a
                      key={ph}
                      href={`tel:${ph}`}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-en font-extrabold border transition ${
                        idx === 0
                          ? "bg-[#B90D12] text-white border-[#B90D12]"
                          : "bg-white hover:bg-[#FFD21A] text-[#111111] border-[#B90D12]/20"
                      }`}
                    >
                      <PhoneIcon className="w-3 h-3 shrink-0" />
                      <span>{ph}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Horizontal Swipeable Services Carousel Strip */}
            <div className="mt-3.5 flex overflow-x-auto no-scrollbar items-center gap-2 pb-0.5">
              {b.services.map((s) => (
                <span
                  key={s}
                  className="shrink-0 whitespace-nowrap text-[11px] font-extrabold bg-[#FFF8E8] px-3 py-1.5 rounded-full text-[#111111]/85 border border-[#B90D12]/15"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Symmetrical Strict-Theme Action Area */}
            <div className="mt-auto pt-4 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
              <OrderFromBranchButton
                branchId={b.id}
                className="btn btn-primary text-xs sm:text-sm py-2.5 px-5 w-full sm:w-auto sm:flex-1 whitespace-nowrap"
              />
              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                <a
                  href={`https://wa.me/${b.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#111111] hover:bg-[#B90D12] text-[#FFD21A] hover:text-white px-4 py-2.5 text-xs font-black inline-flex items-center justify-center gap-1.5 transition whitespace-nowrap"
                  title="طلب عبر واتساب"
                >
                  <WhatsAppIcon className="w-4 h-4 shrink-0" />
                  <span>واتساب</span>
                </a>
                <a
                  href={b.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#FFD21A] hover:bg-[#F2A900] text-[#111111] px-4 py-2.5 text-xs font-black inline-flex items-center justify-center gap-1.5 transition whitespace-nowrap"
                  title="الموقع على خرائط جوجل"
                >
                  <PinIcon className="w-3.5 h-3.5 text-[#B90D12] shrink-0" />
                  <span>خريطة المول</span>
                  <ExternalLinkIcon className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>
          </div>
        );
      })}

      {/* Badr City Delivery Zones Card — Horizontal Swipeable Strip + Collapsible Dropdown (`دروب منيو`) */}
      <div className="lg:col-span-5 rounded-[28px] sm:rounded-[32px] bg-gradient-to-b from-[#B90D12] to-[#780508] text-white p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden shadow-lg min-w-0">
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-[#FFD21A]/18 blur-2xl"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="rounded-full bg-[#FFD21A] text-[#111111] px-3 py-0.5 text-[11px] font-black">
              نطاق التوصيل السريع
            </span>
            <span className="text-xs font-bold text-[#FFF8E8]/80">
              {BADR_NEIGHBORHOODS.length} مناطق مخدومة
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl font-black text-white text-right leading-snug">
            من إيجل مول لحد باب بيتك في مدينة بدر
          </h3>
          <p className="text-xs sm:text-sm text-[#FFF8E8]/85 mt-1.5 leading-relaxed text-right">
            سندوتشات الشاورما عالصاج، الفراخ البروستد والمشوية، والفتة بتوصلك سخنة وطازة لكل أحياء ومجاورات مدينة بدر.
          </p>

          {/* Horizontal Swipeable Carousel Preview (Always Compact!) */}
          {!zonesOpen && (
            <div className="mt-3.5 flex overflow-x-auto no-scrollbar items-center gap-2 pb-1">
              {BADR_NEIGHBORHOODS.map((zone) => (
                <span
                  key={zone}
                  className="shrink-0 whitespace-nowrap rounded-full bg-black/25 border border-white/18 px-3.5 py-1.5 text-xs font-extrabold text-[#FFF8E8]"
                >
                  {zone}
                </span>
              ))}
            </div>
          )}

          {/* Collapsible Dropdown (`دروب منيو`) for Full Delivery Zones List */}
          <div className="mt-3 rounded-2xl bg-black/22 border border-white/18 overflow-hidden">
            <button
              type="button"
              onClick={() => setZonesOpen((v) => !v)}
              aria-expanded={zonesOpen}
              className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-black text-[#FFD21A] hover:text-white transition cursor-pointer"
            >
              <span>
                {zonesOpen ? "إخفاء قائمة أحياء التوصيل" : "عرض كل أحياء ومناطق التوصيل"}
              </span>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform duration-200 ${
                  zonesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {zonesOpen && (
              <div className="px-3 pb-3 pt-1.5 border-t border-white/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5">
                {BADR_NEIGHBORHOODS.map((zone) => (
                  <div
                    key={zone}
                    className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white flex items-center gap-2"
                  >
                    <PinIcon className="w-3.5 h-3.5 text-[#FFD21A] shrink-0" />
                    <span>{zone}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Clean Symmetrical Bottom Strip */}
        <div className="relative z-10 mt-4 pt-3.5 border-t border-white/15 flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-white/90">
            واتساب الطلبات السريع:
          </span>
          <a
            href="https://wa.me/201023182006"
            target="_blank"
            rel="noreferrer"
            dir="ltr"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD21A] hover:bg-white text-[#111111] px-4 py-1.5 text-xs font-en font-black transition shrink-0"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-[#B90D12]" />
            <span>01023182006</span>
          </a>
        </div>
      </div>
    </div>
  );
}
