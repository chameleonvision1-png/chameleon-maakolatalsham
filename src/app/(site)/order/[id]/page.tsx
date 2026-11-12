import Link from "next/link";
import { notFound } from "next/navigation";
import { readDB } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { orderWhatsAppText, waLink } from "@/lib/whatsapp";
import { WhatsAppIcon, CheckIcon, PhoneIcon } from "@/components/icons";

export const metadata = { title: "تم تسجيل طلبك | شاورما وبروستد مأكولات الشام" };

export default async function OrderPage(props: PageProps<"/order/[id]">) {
  const { id } = await props.params;
  const db = await readDB();
  const order = db.orders.find((o) => o.id === id);
  if (!order) notFound();
  const branch = db.branches.find((b) => b.id === order.branchId) ?? db.branches[0];
  const url = waLink(branch.whatsapp, orderWhatsAppText(order, branch));

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="rounded-[32px] bg-white border border-[#B90D12]/25 p-6 sm:p-8 text-center shadow-xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#B90D12] text-white grid place-items-center shadow-md">
          <CheckIcon className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#111111] mt-4">
          تم تسجيل طلبك في مأكولات الشام
        </h1>
        <p className="text-[#111111]/70 mt-1 font-semibold">
          رقم الطلب: <b className="text-[#B90D12] font-en">{order.orderNumber}</b> • {branch.name}
        </p>
        <p className="text-xs sm:text-sm text-[#111111]/70 mt-3 font-medium leading-relaxed">
          إذا لم يُفتح تطبيق واتساب تلقائيًا، اضغط على الزر بالأسفل لإرسال رسالة طلبك مباشرة إلى كاشير{" "}
          <b>شاورما وبروستد مأكولات الشام ({branch.city})</b> لتأكيد التحضير والتوصيل فورًا.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="btn btn-whatsapp w-full mt-5 text-base sm:text-lg"
        >
          <WhatsAppIcon /> إرسال الطلب عبر واتساب الفرع
        </a>

        {/* Direct Call Option */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-[#111111]/70 flex-wrap">
          <span>أو اتصل بالفرع مباشرة:</span>
          <a
            href={`tel:${branch.phone}`}
            dir="ltr"
            className="inline-flex items-center gap-1 text-[#B90D12] font-en font-black hover:underline"
          >
            <PhoneIcon className="w-3.5 h-3.5" />
            <span>{branch.phone}</span>
          </a>
          {branch.phone2 && (
            <a
              href={`tel:${branch.phone2}`}
              dir="ltr"
              className="inline-flex items-center gap-1 text-[#B90D12] font-en font-black hover:underline"
            >
              <span>• {branch.phone2}</span>
            </a>
          )}
        </div>

        <div className="text-start mt-6 border-t border-dashed border-[#B90D12]/20 pt-4 space-y-2 text-sm">
          {order.items.map((it, i) => (
            <div key={i} className="flex justify-between gap-3">
              <span className="font-bold text-[#111111]">
                {it.name}
                {it.sizeLabel ? ` (${it.sizeLabel})` : ""} × {it.qty}
              </span>
              <span className="font-black text-[#B90D12] shrink-0 tabular-nums">
                {formatPrice(it.unitPrice * it.qty)}
              </span>
            </div>
          ))}
          <div className="flex justify-between font-black text-[#B90D12] text-lg pt-2 border-t border-[#B90D12]/15">
            <span>إجمالي الطلب</span>
            <span className="tabular-nums">{formatPrice(order.total)}</span>
          </div>
        </div>
        <p className="text-xs text-[#111111]/60 mt-4 font-semibold">
          مدينة بدر — ميدان النسر — إيجل مول — بجوار البنك الأهلي
        </p>
        <Link href="/" className="btn btn-outline w-full mt-4">
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}
