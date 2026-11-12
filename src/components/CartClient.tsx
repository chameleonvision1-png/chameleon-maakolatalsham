"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "./store";
import { formatPrice, paymentMethods } from "@/lib/format";
import { MinusIcon, PhoneIcon, PinIcon, PlusIcon, TrashIcon, WhatsAppIcon } from "./icons";

export default function CartClient() {
  const { cart, updateQty, removeLine, subtotal, branch, openPicker, clearCart, hydrated } = useStore();
  const router = useRouter();
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    payment: paymentMethods[0],
    notes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!hydrated) {
    return (
      <div className="py-32 text-center text-[#111111]/55 font-bold">
        جاري تحميل سلة الطلبات…
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-20 px-4 text-center max-w-md mx-auto">
        <div className="w-24 h-24 rounded-full bg-white p-2 border border-[#B90D12]/20 mx-auto grid place-items-center shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-emblem.webp"
            alt="شاورما وبروستد مأكولات الشام"
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#111111] mt-5">
          سلة طلباتك فارغة حاليًا
        </h2>
        <p className="text-[#111111]/68 mt-1.5 font-semibold leading-relaxed text-sm">
          اختار من منيو شاورما وبروستد مأكولات الشام (سندوتشات الشاورما عالصاج، العربي والماريا، الفراخ البروستد والمشوية، الفتة، والبيتزا) واطلب أونلاين في مدينة بدر.
        </p>
        <Link href="/menu" className="btn btn-primary mt-6">
          تصفح منيو مأكولات الشام
        </Link>
      </div>
    );
  }

  const total = subtotal;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const activeBranch = branch;
    if (!activeBranch) {
      openPicker();
      setError("يرجى اختيار فرع مأكولات الشام أولاً");
      return;
    }
    setLoading(true);
    const win = window.open("", "_blank");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId: activeBranch.id,
          customerName: form.name,
          customerPhone: form.phone,
          orderType,
          address: form.address,
          paymentMethod: form.payment,
          notes: form.notes,
          items: cart.map((l) => ({
            productId: l.productId,
            sizeLabel: l.sizeLabel,
            addons: l.addons.map((a) => a.label),
            note: l.note,
            qty: l.qty,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "حدث خطأ أثناء تسجيل الطلب، حاول مرة أخرى");
      if (win) win.location.href = data.whatsappUrl;
      sessionStorage.setItem(`wa_${data.order.id}`, data.whatsappUrl);
      clearCart();
      router.push(`/order/${data.order.id}`);
    } catch (err) {
      win?.close();
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl w-full max-w-full overflow-x-clip px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-5 sm:gap-6 items-start">
      <div className="space-y-3.5 sm:space-y-4 min-w-0 w-full">
        {/* Symmetrical Top Header */}
        <div className="rounded-[24px] bg-white border border-[#B90D12]/16 p-4 sm:p-5 shadow-2xs min-w-0 w-full">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <h1 className="text-[15px] sm:text-2xl font-black text-[#111111] whitespace-nowrap">
              سلة طلبات مأكولات الشام
            </h1>
            <Link
              href="/menu"
              className="shrink-0 rounded-full bg-[#B90D12] hover:bg-[#780508] text-white px-3.5 py-1.5 text-xs font-black inline-flex items-center gap-1 transition shadow-2xs"
            >
              <PlusIcon className="w-3.5 h-3.5 text-[#FFD21A]" />
              <span>أضف أصناف</span>
            </Link>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[#111111]/65 mt-1.5 leading-relaxed">
            راجع الأصناف والأحجام المختارة قبل إرسال الطلب إلى فرع إيجل مول — مدينة بدر
          </p>
        </div>

        {cart.map((l) => (
          <div
            key={l.key}
            className="rounded-[24px] bg-white border border-[#B90D12]/16 p-3.5 sm:p-4 flex gap-3 sm:gap-3.5 shadow-xs min-w-0 w-full"
          >
            <div className="w-20 h-20 rounded-2xl bg-[#FFF8E8] border border-[#B90D12]/12 overflow-hidden shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.image} alt={l.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <h3 className="font-black text-sm sm:text-base text-[#111111] text-right leading-snug break-words">
                    {l.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeLine(l.key)}
                    className="w-7 h-7 rounded-full bg-[#FFF8E8] hover:bg-[#B90D12] text-[#111111]/60 hover:text-white grid place-items-center shrink-0 transition cursor-pointer"
                    aria-label="حذف"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs text-[#111111]/65 mt-0.5 font-semibold text-right break-words">
                  {l.sizeLabel && <span>{l.sizeLabel}</span>}
                  {l.addons.length > 0 && (
                    <span> • إضافات: {l.addons.map((a) => a.label).join("، ")}</span>
                  )}
                  {l.note && <div className="text-[#B90D12] mt-0.5">ملاحظة: {l.note}</div>}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 mt-2.5">
                <div className="flex items-center gap-1 bg-[#FFF8E8] border border-[#B90D12]/15 rounded-full p-0.5">
                  <button
                    type="button"
                    onClick={() => updateQty(l.key, l.qty - 1)}
                    className="w-7 h-7 rounded-full bg-white grid place-items-center cursor-pointer"
                    aria-label="تقليل"
                  >
                    <MinusIcon className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-black text-sm tabular-nums">{l.qty}</span>
                  <button
                    type="button"
                    onClick={() => updateQty(l.key, l.qty + 1)}
                    className="w-7 h-7 rounded-full bg-white grid place-items-center cursor-pointer"
                    aria-label="زيادة"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#FFF8E8] border border-[#B90D12]/18 px-3 py-0.5 text-xs sm:text-sm font-black text-[#B90D12] tabular-nums whitespace-nowrap">
                  {formatPrice(l.unitPrice * l.qty)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Quick Restaurant Upsells — Symmetrical 2x2 Grid */}
        <div className="rounded-[24px] p-4 sm:p-5 bg-white border border-[#B90D12]/18 min-w-0 w-full">
          <p className="font-black text-xs sm:text-sm text-[#B90D12] text-center sm:text-right">
            تحب تزوّد ثومية سورية، بطاطس، أو مشروب مع الطلب؟
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            <Link
              href="/menu?cat=sides_drinks"
              className="rounded-xl text-center text-xs font-extrabold bg-[#FFF8E8] hover:bg-[#B90D12] text-[#111111] hover:text-white border border-[#B90D12]/18 px-2.5 py-2 truncate transition"
            >
              الثومية والمشروبات
            </Link>
            <Link
              href="/menu?cat=shawarma_sandwiches"
              className="rounded-xl text-center text-xs font-extrabold bg-[#FFF8E8] hover:bg-[#B90D12] text-[#111111] hover:text-white border border-[#B90D12]/18 px-2.5 py-2 truncate transition"
            >
              سندوتشات الشاورما
            </Link>
            <Link
              href="/menu?cat=broasted"
              className="rounded-xl text-center text-xs font-extrabold bg-[#FFF8E8] hover:bg-[#B90D12] text-[#111111] hover:text-white border border-[#B90D12]/18 px-2.5 py-2 truncate transition"
            >
              الفراخ البروستد
            </Link>
            <Link
              href="/menu?cat=fatteh"
              className="rounded-xl text-center text-xs font-extrabold bg-[#FFF8E8] hover:bg-[#B90D12] text-[#111111] hover:text-white border border-[#B90D12]/18 px-2.5 py-2 truncate transition"
            >
              الفتة والموتزاريلا
            </Link>
          </div>
        </div>
      </div>

      {/* Checkout Form Card */}
      <form
        onSubmit={submit}
        className="min-w-0 w-full rounded-[28px] bg-white border-2 border-[#B90D12]/22 p-4 sm:p-6 space-y-4 lg:sticky lg:top-20 shadow-[0_18px_42px_-18px_rgba(185,13,18,0.18)]"
      >
        <div className="flex items-center justify-between gap-2 border-b border-[#111111]/10 pb-3 min-w-0">
          <h2 className="text-lg sm:text-xl font-black text-[#111111]">تأكيد بيانات الطلب</h2>
          <span className="shrink-0 rounded-full bg-[#FFD21A] text-[#111111] px-3 py-0.5 text-xs font-black">
            مأكولات الشام
          </span>
        </div>

        {/* Active Branch Selector */}
        {branch && (
          <div className="rounded-2xl bg-[#FFF8E8] border border-[#B90D12]/20 p-3 flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#B90D12] min-w-0">
                <PinIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{branch.name}</span>
              </div>
              <div className="text-[11px] font-semibold text-[#111111]/65 mt-0.5 truncate">
                {branch.address}
              </div>
            </div>
            <button
              type="button"
              onClick={openPicker}
              className="shrink-0 rounded-full bg-white border border-[#B90D12]/25 px-3 py-1 text-[11px] font-black text-[#B90D12] hover:bg-[#B90D12] hover:text-white transition cursor-pointer"
            >
              تفاصيل الفرع
            </button>
          </div>
        )}

        {/* Order Type Toggle */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[#FFF8E8] border border-[#B90D12]/15">
          <button
            type="button"
            onClick={() => setOrderType("delivery")}
            className={`py-2.5 px-2 rounded-xl text-xs font-black transition cursor-pointer truncate ${
              orderType === "delivery"
                ? "bg-[#B90D12] text-white shadow-xs"
                : "text-[#111111]/75 hover:text-[#B90D12]"
            }`}
          >
            توصيل دليفري
          </button>
          <button
            type="button"
            onClick={() => setOrderType("pickup")}
            className={`py-2.5 px-2 rounded-xl text-xs font-black transition cursor-pointer truncate ${
              orderType === "pickup"
                ? "bg-[#B90D12] text-white shadow-xs"
                : "text-[#111111]/75 hover:text-[#B90D12]"
            }`}
          >
            استلام من إيجل مول
          </button>
        </div>

        <div>
          <label className="label text-xs font-extrabold text-[#111111] mb-1 block" htmlFor="c-name">
            الاسم الكريم *
          </label>
          <input
            id="c-name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="اكتب اسمك الثلاثي أو الثنائي"
            className="input text-sm"
          />
        </div>

        <div>
          <label className="label text-xs font-extrabold text-[#111111] mb-1 block" htmlFor="c-phone">
            رقم الموبايل للتأكيد *
          </label>
          <input
            id="c-phone"
            required
            dir="ltr"
            inputMode="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="01xxxxxxxxx"
            className="input text-right text-sm"
          />
        </div>

        {orderType === "delivery" && (
          <div>
            <label className="label text-xs font-extrabold text-[#111111] mb-1 block" htmlFor="c-addr">
              العنوان التفصيلي في مدينة بدر *
            </label>
            <textarea
              id="c-addr"
              required
              rows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="الحي / المجاورة / الكمبوند / رقم العمارة والشقة وعلامة مميزة…"
              className="input text-sm"
            />
          </div>
        )}

        <div>
          <label className="label text-xs font-extrabold text-[#111111] mb-1 block" htmlFor="c-pay">
            طريقة الدفع
          </label>
          <select
            id="c-pay"
            value={form.payment}
            onChange={(e) => setForm({ ...form, payment: e.target.value })}
            className="input text-sm min-w-0 max-w-full"
          >
            {paymentMethods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label text-xs font-extrabold text-[#111111] mb-1 block" htmlFor="c-notes">
            ملاحظات إضافية للطلب (اختياري)
          </label>
          <input
            id="c-notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="مثال: رن الجرس، عيش إضافي، ثومية زيادة…"
            className="input text-sm"
          />
        </div>

        {/* Totals */}
        <div className="rounded-2xl bg-[#FFF8E8] border border-[#B90D12]/15 p-3.5 space-y-1.5 text-sm">
          <div className="flex justify-between gap-2 font-bold text-[#111111]/75">
            <span>إجمالي الأصناف</span>
            <span className="tabular-nums whitespace-nowrap">{formatPrice(subtotal)}</span>
          </div>
          {orderType === "delivery" && (
            <div className="flex justify-between gap-2 text-xs font-semibold text-[#111111]/60">
              <span>خدمة التوصيل بمدينة بدر</span>
              <span>تُحدد حسب الحي</span>
            </div>
          )}
          <div className="pt-2 border-t border-[#B90D12]/15 flex justify-between gap-2 text-base font-black text-[#B90D12]">
            <span>الإجمالي</span>
            <span className="tabular-nums whitespace-nowrap">{formatPrice(total)}</span>
          </div>
        </div>

        {error && (
          <p className="text-xs font-bold text-[#B90D12] bg-[#B90D12]/10 rounded-xl p-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#B90D12] hover:bg-[#780508] text-white font-black py-3.5 px-5 flex items-center justify-center gap-2 text-sm shadow-md transition cursor-pointer disabled:opacity-60"
        >
          <WhatsAppIcon className="w-5 h-5 text-[#FFD21A] shrink-0" />
          <span>{loading ? "جاري تسجيل الطلب…" : "تأكيد وإرسال الطلب عبر واتساب"}</span>
        </button>

        <div className="pt-1 space-y-2">
          <p className="text-center text-[11px] font-bold text-[#111111]/60">
            أو اطلب مباشرة عبر الهاتف:
          </p>
          <div className="grid grid-cols-2 gap-2" dir="ltr">
            <a
              href="tel:01023182006"
              className="h-9 rounded-full bg-[#FFF8E8] hover:bg-[#FFD21A] border border-[#B90D12]/18 font-en text-xs text-[#111111] font-black inline-flex items-center justify-center gap-1.5 transition"
            >
              <PhoneIcon className="w-3 h-3 text-[#B90D12] shrink-0" />
              <span>01023182006</span>
            </a>
            <a
              href="tel:01122060877"
              className="h-9 rounded-full bg-[#FFF8E8] hover:bg-[#FFD21A] border border-[#B90D12]/18 font-en text-xs text-[#111111] font-black inline-flex items-center justify-center gap-1.5 transition"
            >
              <PhoneIcon className="w-3 h-3 text-[#B90D12] shrink-0" />
              <span>01122060877</span>
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
