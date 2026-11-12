import type { Metadata } from "next";
import { publicDB } from "@/lib/db";
import MenuClient from "@/components/MenuClient";
import OpenQrButton from "@/components/OpenQrButton";
import { FileTextIcon, PhoneIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "منيو شاورما وبروستد مأكولات الشام — مدينة بدر",
  description:
    "تصفح المنيو الكامل لمطعم شاورما وبروستد مأكولات الشام بمدينة بدر بالأسعار والأحجام: سندوتشات ووجبات الشاورما، البروستد، المشويات، الفتة بالموتزاريلا، الغربي، البيتزا، والفلافل.",
  openGraph: {
    images: ["/og-menu.jpg?v=1"],
  },
};

export default async function MenuPage(props: PageProps<"/menu">) {
  const { cat } = await props.searchParams;
  const data = await publicDB();

  return (
    <div className="w-full overflow-x-clip">
      {/* Top Sham Red Card — Circular Chicken Mascot Icon ONLY (`ايقونة الفرخة بس`) */}
      <section className="px-2.5 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <div className="mx-auto max-w-7xl rounded-[30px] sm:rounded-[38px] bg-gradient-to-b from-[#B90D12] via-[#A20B10] to-[#780508] text-white px-5 py-6 sm:p-8 lg:px-10 relative overflow-hidden shadow-[0_20px_48px_-18px_rgba(185,13,18,0.5)]">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#FFD21A]/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5 text-center lg:text-right">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              {/* Circular Chicken Mascot Icon ONLY */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-emblem.webp"
                alt="شاورما وبروستد مأكولات الشام"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-contain shrink-0 drop-shadow-[0_12px_22px_rgba(0,0,0,0.32)] select-none"
              />

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                  منيو شاورما وبروستد مأكولات الشام
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm font-bold text-[#FFF8E8]/88 max-w-xl leading-relaxed">
                  ٩ أقسام متكاملة بالأسعار والأحجام الرسمية — اختار الأصناف والإضافات وأرسل طلبك مباشرة لفرع إيجل مول بمدينة بدر.
                </p>
              </div>
            </div>

            {/* Symmetrical Compact Action Bar */}
            <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center justify-center gap-2 w-full sm:w-auto shrink-0">
              <OpenQrButton label="باركود QR" />
              <a
                href={data.settings.menuPdfUrl || "/menu/maakolat-alsham-menu.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#B90D12] border border-white/25 font-black text-xs sm:text-sm px-3.5 py-2.5 sm:px-4 sm:py-3 transition whitespace-nowrap"
              >
                <FileTextIcon className="w-4 h-4 shrink-0" />
                <span>منيو PDF</span>
              </a>
              <a
                href="tel:01023182006"
                dir="ltr"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#111111] hover:bg-black text-[#FFD21A] font-en font-black text-xs sm:text-sm px-3 py-2.5 sm:px-4 sm:py-3 transition whitespace-nowrap"
              >
                <PhoneIcon className="w-3.5 h-3.5 shrink-0" />
                <span>01023182006</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <MenuClient
        categories={data.categories}
        products={data.products}
        initialCat={typeof cat === "string" ? cat : undefined}
      />
    </div>
  );
}
