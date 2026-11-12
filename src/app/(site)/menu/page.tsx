import type { Metadata } from "next";
import { publicDB } from "@/lib/db";
import MenuClient from "@/components/MenuClient";
import OpenQrButton from "@/components/OpenQrButton";
import { ExternalLinkIcon, PhoneIcon } from "@/components/icons";

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
      {/* Dedicated Wide Horizontal Logo Banner for `/menu` (Explicitly Requested by User) */}
      <section className="px-2.5 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <div className="mx-auto max-w-7xl rounded-[30px] sm:rounded-[38px] bg-gradient-to-l from-[#B90D12] via-[#A20B10] to-[#780508] text-white p-5 sm:p-8 lg:p-10 relative overflow-hidden shadow-[0_20px_48px_-18px_rgba(185,13,18,0.5)]">
          <div
            className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#FFD21A]/18 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Wide Horizontal Brand Banner Logo (`logo-horizontal.webp`) */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-right">
              <div className="rounded-3xl bg-[#FFF8E8] p-2.5 sm:p-3.5 border-2 border-[#FFD21A] shadow-lg shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-horizontal.webp"
                  alt="منيو شاورما وبروستد مأكولات الشام"
                  className="h-14 sm:h-20 lg:h-22 w-auto object-contain"
                />
              </div>

              <div>
                <h1 className="text-2xl sm:text-4xl font-black text-[#FFF8E8] leading-tight">
                  منيو شاورما وبروستد مأكولات الشام
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm font-bold text-[#FFF8E8]/88 max-w-xl leading-relaxed">
                  ٩ أقسام متكاملة بالأسعار والأحجام الرسمية — اختار الأصناف والإضافات وأرسل طلبك مباشرة إلى فرع إيجل مول بمدينة بدر.
                </p>
              </div>
            </div>

            {/* Quick QR + PDF + Direct Call Actions */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
              <OpenQrButton label="باركود المنيو QR" />
              <a
                href={data.settings.menuPdfUrl || "/menu/maakolat-alsham-menu.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#B90D12] border border-white/25 font-black text-xs sm:text-sm px-4 py-3 transition"
              >
                <span>تحميل المنيو PDF</span>
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
              <a
                href="tel:01023182006"
                dir="ltr"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#111111] hover:bg-black text-[#FFD21A] font-en font-black text-xs sm:text-sm px-4 py-3 transition"
              >
                <PhoneIcon className="w-3.5 h-3.5" />
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
