"use client";

import { useState } from "react";
import type { Branch } from "@/lib/types";
import { occasionTypes } from "@/lib/format";
import { useStore } from "./store";
import { CheckIcon, WhatsAppIcon } from "./icons";

export default function OccasionForm({ branches }: { branches: Branch[] }) {
  const { branch } = useStore();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  const [wa, setWa] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setState("loading");
    const res = await fetch("/api/occasions", {
      method: "POST",
      body: new FormData(e.currentTarget),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setState("idle");
      return;
    }
    setWa(data.whatsappUrl);
    setState("done");
  };

  if (state === "done")
    return (
      <div className="rounded-[28px] bg-white border-2 border-[#B90D12]/30 p-6 text-center lg:sticky lg:top-24 shadow-lg">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#B90D12] text-white grid place-items-center">
          <CheckIcon className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-[#B90D12] mt-3">
          تم تسجيل طلب العزومة في مطعم مأكولات الشام
        </h2>
        <p className="text-[#111111]/70 mt-1 text-sm font-semibold">
          سنتواصل معك فورًا لتأكيد الأصناف والكميات وموعد التسليم. ولتسريع التنفيذ، أرسل التفاصيل مباشرة عبر واتساب مطعم مأكولات الشام:
        </p>
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="btn btn-whatsapp w-full mt-4"
        >
          <WhatsAppIcon /> إرسال التفاصيل عبر واتساب
        </a>
      </div>
    );

  return (
    <form
      onSubmit={submit}
      className="rounded-[28px] bg-white border border-[#B90D12]/22 p-6 space-y-4 lg:sticky lg:top-24 shadow-[0_16px_38px_-16px_rgba(185,13,18,0.16)]"
    >
      <div>
        <span className="inline-block rounded-full bg-[#FFD21A] text-[#111111] px-3 py-1 text-xs font-black mb-2">
          عزومات وطلبات الشركات • مأكولات الشام
        </span>
        <h2 className="text-xl font-black text-[#111111]">
          احجز عزومتك أو طلبات الشركات والمناسبات بمدينة بدر
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="o-name">
            الاسم *
          </label>
          <input id="o-name" name="name" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="o-phone">
            الموبايل *
          </label>
          <input
            id="o-phone"
            name="phone"
            required
            dir="ltr"
            inputMode="tel"
            className="input text-right"
            placeholder="01xxxxxxxxx"
          />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="o-type">
          نوع الطلب أو المناسبة *
        </label>
        <select id="o-type" name="type" className="input" required>
          {occasionTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="o-q">
            عدد الأفراد أو الوجبات التقريبي
          </label>
          <input
            id="o-q"
            name="quantity"
            className="input"
            placeholder="مثال: 15 فرد / 5 فرخات بروستد ومشوي + 2 كيلو شاورما"
          />
        </div>
        <div>
          <label className="label" htmlFor="o-d">
            التاريخ المطلوب *
          </label>
          <input id="o-d" name="date" type="date" required className="input" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="o-b">
          الفرع
        </label>
        <select id="o-b" name="branchId" className="input" defaultValue={branch?.id}>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} — {b.city}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="o-det">
          تفاصيل الأصناف المطلوبة أو عنوان التوصيل
        </label>
        <textarea
          id="o-det"
          name="details"
          rows={3}
          className="input"
          placeholder="اكتب الأصناف المطلوبة (فراخ بروستد، فراخ مشوية، شاورما بالكيلو، وجبات عربي، فتة) وموعد التسليم…"
        />
      </div>
      {error && (
        <p className="text-sm font-bold text-[#B90D12] bg-[#B90D12]/10 rounded-xl p-3">
          {error}
        </p>
      )}
      <button
        disabled={state === "loading"}
        className="btn btn-primary w-full cursor-pointer"
      >
        {state === "loading" ? "جاري الإرسال…" : "إرسال الطلب وتأكيده عبر واتساب"}
      </button>
    </form>
  );
}
