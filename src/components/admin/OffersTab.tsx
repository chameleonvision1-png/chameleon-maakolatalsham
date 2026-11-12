"use client";

import { useState } from "react";
import type { TabProps } from "./AdminDashboard";
import { deleteItem, Field, ImageUploader, Modal, saveItem, Toggle } from "./ui";
import { formatPrice } from "@/lib/format";
import type { Offer } from "@/lib/types";

const toLocal = (iso: string) => {
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export default function OffersTab({ data, reload, notify }: TabProps) {
  const [edit, setEdit] = useState<Offer | null>(null);
  const [now] = useState(() => Date.now());

  const state = (o: Offer) =>
    !o.isActive ? ["موقوف", "bg-gray-200"] : new Date(o.endsAt).getTime() < now ? ["منتهي", "bg-berry/15 text-berry"] : new Date(o.startsAt).getTime() > now ? ["مجدول", "bg-brand-50 text-brand"] : ["شغال", "bg-leaf/15 text-[#0f7a25]"];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setEdit({ id: "", title: "", description: "", image: "", oldPrice: 0, price: 0, startsAt: new Date().toISOString(), endsAt: new Date(Date.now() + 7 * 86400000).toISOString(), branchIds: [], terms: "", isActive: true })}
          className="btn btn-primary"
        >+ عرض جديد</button>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.offers.map((o) => {
          const [label, cls] = state(o);
          return (
            <div key={o.id} className="card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={o.image || "/logo-emblem.png"} alt="" className="w-full aspect-[16/9] object-cover" />
              <div className="p-4 space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-black">{o.title}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
                </div>
                <p className="text-sm text-ink/60">{o.description}</p>
                <p className="font-black text-brand">{formatPrice(o.price)} <span className="text-ink/40 line-through text-sm">{formatPrice(o.oldPrice)}</span></p>
                <p className="text-xs text-ink/50">ينتهي: {new Date(o.endsAt).toLocaleString("ar-EG")}</p>
                <div className="flex gap-3 pt-2 items-center">
                  <Toggle on={o.isActive} onChange={async (v) => { await saveItem("offers", { id: o.id, isActive: v }); reload(); }} />
                  <button onClick={() => setEdit(structuredClone(o))} className="text-teal font-bold text-sm">تعديل</button>
                  <button onClick={async () => { if (confirm("حذف العرض؟")) { await deleteItem("offers", o.id); notify("تم الحذف"); reload(); } }} className="text-berry font-bold text-sm">حذف</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {edit && (
        <OfferEditor initial={edit} data={data} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); notify("تم حفظ العرض"); reload(); }} />
      )}
    </div>
  );
}

function OfferEditor({ initial, data, onClose, onSaved }: { initial: Offer; data: TabProps["data"]; onClose: () => void; onSaved: () => void }) {
  const [o, setO] = useState(initial);
  const set = (p: Partial<Offer>) => setO((x) => ({ ...x, ...p }));
  return (
    <Modal title={o.id ? "تعديل عرض" : "عرض جديد"} onClose={onClose}>
      <div className="space-y-4">
        <ImageUploader value={o.image} onChange={(image) => set({ image })} />
        <Field label="عنوان العرض"><input className="input" value={o.title} onChange={(e) => set({ title: e.target.value })} /></Field>
        <Field label="الوصف"><textarea rows={2} className="input" value={o.description} onChange={(e) => set({ description: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="السعر قبل"><input type="number" className="input" value={o.oldPrice} onChange={(e) => set({ oldPrice: Number(e.target.value) })} /></Field>
          <Field label="السعر بعد العرض"><input type="number" className="input" value={o.price} onChange={(e) => set({ price: Number(e.target.value) })} /></Field>
          <Field label="يبدأ"><input type="datetime-local" className="input" value={toLocal(o.startsAt)} onChange={(e) => set({ startsAt: new Date(e.target.value).toISOString() })} /></Field>
          <Field label="ينتهي (يختفي تلقائيًا)"><input type="datetime-local" className="input" value={toLocal(o.endsAt)} onChange={(e) => set({ endsAt: new Date(e.target.value).toISOString() })} /></Field>
        </div>
        <Field label="الشروط"><input className="input" value={o.terms} onChange={(e) => set({ terms: e.target.value })} /></Field>
        <div>
          <div className="label">الفروع (لو مفيش اختيار = كل الفروع)</div>
          <div className="flex flex-wrap gap-2">
            {data.branches.map((b) => {
              const on = o.branchIds.includes(b.id);
              return (
                <button type="button" key={b.id} onClick={() => set({ branchIds: on ? o.branchIds.filter((x) => x !== b.id) : [...o.branchIds, b.id] })} className={`text-xs font-bold px-3 py-1.5 rounded-full border ${on ? "bg-teal text-white border-teal" : "bg-white"}`}>
                  {b.name}
                </button>
              );
            })}
          </div>
        </div>
        <Toggle on={o.isActive} onChange={(v) => set({ isActive: v })} label="العرض مفعّل" />
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn bg-cream">إلغاء</button>
          <button onClick={async () => { if (!o.title.trim()) return; await saveItem("offers", o); onSaved(); }} className="btn btn-primary">حفظ</button>
        </div>
      </div>
    </Modal>
  );
}
