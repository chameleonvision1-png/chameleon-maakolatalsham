import type { Metadata } from "next";
import { publicDB } from "@/lib/db";
import OccasionForm from "@/components/OccasionForm";
import { CheckIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "عزومات وطلبات الشركات | شاورما وبروستد مأكولات الشام",
  description:
    "تجهيز العزومات العائلية وطلبات الشركات والمصانع والجامعات في مدينة بدر من مطعم شاورما وبروستد مأكولات الشام — إيجل مول ميدان النسر.",
  openGraph: {
    images: ["/og-occasions.jpg?v=1"],
  },
};

const CATERING_PACKAGES = [
  {
    title: "ولائم الفراخ البروستد والمشوية",
    desc: "فرخات كاملة (بروستد مقرمش أو مشوي عالفحم وأورينتال) مع صواني أرز بسمتي، ثومية، كولسلو، وعيش سوري ساخن.",
  },
  {
    title: "بوكسات الشاورما بالكيلو والعربي الدبل",
    desc: "نصف كيلو وكيلو شاورما فراخ ولحمة وميكس مع صواني شاورما عربي متقطعة وماريا بالموتزاريلا للتجمعات.",
  },
  {
    title: "توريد وجبات الشركات والمصانع والجامعات",
    desc: "وجبات فردية مغلفة بعناية وبأسعار خاصة للكميات داخل مدينة بدر والمنطقة الصناعية والجامعات.",
  },
];

export default async function OccasionsPage() {
  const data = await publicDB();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-[32px] bg-[#B90D12] text-white p-6 sm:p-10 shadow-lg">
            <span className="inline-block rounded-full bg-[#FFD21A] text-[#111111] px-3.5 py-1 text-xs font-black mb-3">
              ولائم وعزومات مأكولات الشام
            </span>
            <h1 className="text-2xl sm:text-4xl font-black leading-tight">
              عزومتك في مدينة بدر تشرفك قدام ضيوفك
            </h1>
            <p className="mt-3 text-xs sm:text-base text-[#FFF8E8]/90 font-semibold leading-relaxed">
              من فرع إيجل مول بميدان النسر، يجهز فريق مطعم شاورما وبروستد مأكولات الشام طلبات العزومات العائلية، وجبات الشركات، والتجمعات الكبيرة ساخنة وطازجة في الموعد المحدد.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2.5" dir="ltr">
              <a
                href="https://wa.me/201023182006"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#25D366] text-white px-4 py-2 text-xs font-black inline-flex items-center gap-1.5"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp 01023182006</span>
              </a>
              <a
                href="tel:01122060877"
                className="rounded-full bg-[#FFD21A] text-[#111111] px-4 py-2 text-xs font-en font-black inline-flex items-center gap-1.5"
              >
                <PhoneIcon className="w-3.5 h-3.5" />
                <span>01122060877</span>
              </a>
            </div>
          </div>

          <div className="space-y-3.5">
            {CATERING_PACKAGES.map((pkg) => (
              <div
                key={pkg.title}
                className="rounded-[24px] bg-white border border-[#B90D12]/16 p-5 flex items-start gap-3.5 shadow-2xs"
              >
                <span className="w-8 h-8 rounded-full bg-[#FFD21A] text-[#111111] grid place-items-center shrink-0 mt-0.5">
                  <CheckIcon className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-[#111111]">{pkg.title}</h3>
                  <p className="text-xs sm:text-sm text-[#111111]/70 font-semibold mt-1 leading-relaxed">
                    {pkg.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <OccasionForm branches={data.branches} />
        </div>
      </div>
    </div>
  );
}
