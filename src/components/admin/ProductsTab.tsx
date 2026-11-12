"use client";

import { useState } from "react";
import type { TabProps } from "./AdminDashboard";
import { deleteItem, Field, ImageUploader, Modal, saveItem, Toggle } from "./ui";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

const blank = (categoryId: string): Product => ({
  id: "",
  categoryId,
  nameAr: "",
  descriptionAr: "",
  image: "",
  sizes: [{ id: "s0", label: "عادي", price: 0 }],
  addons: [],
  taste: "savory",
  isAvailable: true,
  isBestSeller: false,
  isNew: false,
  forFamily: false,
  unavailableBranches: [],
});

export default function ProductsTab({ data, reload, notify }: TabProps) {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<Product | null>(null);

  const list = data.products.filter((p) => (cat === "all" || p.categoryId === cat) && (!q || p.nameAr.includes(q)));

  const quick = async (p: Product, patch: Partial<Product>) => {
    await saveItem("products", { id: p.id, ...patch });
    notify("تم الحفظ");
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="card p-4 flex flex-wrap gap-2">
        <select className="input w-auto" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="all">كل الأقسام</option>
          {data.categories.map((c) => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
        </select>
        <input className="input flex-1 min-w-48" placeholder="بحث باسم الصنف" value={q} onChange={(e) => setQ(e.target.value)} />
        <button onClick={() => setEdit(blank(cat === "all" ? data.categories[0]?.id : cat))} className="btn btn-primary">+ صنف جديد</button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-cream text-ink/70">
            <tr>
              <th className="p-3 text-start">الصنف</th>
              <th className="p-3 text-start">القسم</th>
              <th className="p-3 text-start">السعر</th>
              <th className="p-3">متاح</th>
              <th className="p-3">الأكثر طلبًا</th>
              <th className="p-3">جديد</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image || "/logo-emblem.png"} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <span className="font-bold">{p.nameAr}</span>
                      {p.model3d && (
                        <span className="ms-2 inline-flex items-center rounded-full bg-teal/15 text-teal px-2 py-0.5 text-[10px] font-black">
                          3D
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-3 text-ink/60">{data.categories.find((c) => c.id === p.categoryId)?.nameAr}</td>
                <td className="p-3 font-bold">{p.sizes.map((s) => formatPrice(s.price)).join(" / ")}</td>
                <td className="p-3 text-center"><Toggle on={p.isAvailable} onChange={(v) => quick(p, { isAvailable: v })} /></td>
                <td className="p-3 text-center"><Toggle on={p.isBestSeller} onChange={(v) => quick(p, { isBestSeller: v })} /></td>
                <td className="p-3 text-center"><Toggle on={p.isNew} onChange={(v) => quick(p, { isNew: v })} /></td>
                <td className="p-3 whitespace-nowrap">
                  <button onClick={() => setEdit(structuredClone(p))} className="text-teal font-bold me-3">تعديل</button>
                  <button
                    onClick={async () => { if (confirm(`حذف "${p.nameAr}"؟`)) { await deleteItem("products", p.id); notify("تم الحذف"); reload(); } }}
                    className="text-berry font-bold"
                  >حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && <ProductEditor initial={edit} data={data} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); notify("تم حفظ الصنف"); reload(); }} />}
    </div>
  );
}

function ProductEditor({ initial, data, onClose, onSaved }: { initial: Product; data: TabProps["data"]; onClose: () => void; onSaved: () => void }) {
  const [p, setP] = useState<Product>(initial);
  const [err, setErr] = useState("");
  const set = (patch: Partial<Product>) => setP((x) => ({ ...x, ...patch }));

  const save = async () => {
    if (!p.nameAr.trim()) return setErr("اكتب اسم الصنف");
    if (p.sizes.length === 0 || p.sizes.some((s) => !s.label.trim())) return setErr("لازم حجم واحد على الأقل باسم وسعر");
    try {
      await saveItem("products", p);
      onSaved();
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <Modal title={p.id ? "تعديل صنف" : "صنف جديد"} onClose={onClose}>
      <div className="space-y-4">
        <ImageUploader value={p.image} onChange={(image) => set({ image })} />
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="اسم الصنف"><input className="input" value={p.nameAr} onChange={(e) => set({ nameAr: e.target.value })} /></Field>
          <Field label="القسم">
            <select className="input" value={p.categoryId} onChange={(e) => set({ categoryId: e.target.value })}>
              {data.categories.map((c) => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
            </select>
          </Field>
        </div>
        <Field label="الوصف (سطرين بالكتير)"><textarea rows={2} className="input" value={p.descriptionAr} onChange={(e) => set({ descriptionAr: e.target.value })} /></Field>
        <Field label="مجسم 3D (.glb على Cloudflare R2 - اختياري)">
          <div className="flex gap-2">
            <input
              dir="ltr"
              className="input text-xs font-mono flex-1"
              placeholder="https://pub-8ff731ae613844f6918e4af1c34bdc42.r2.dev/product.glb"
              value={p.model3d ?? ""}
              onChange={(e) => set({ model3d: e.target.value.trim() || undefined })}
            />
            <label className="btn bg-cream text-xs shrink-0 cursor-pointer">
              رفع .glb
              <input
                type="file"
                accept=".glb,model/gltf-binary"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append("file", file);
                  fd.append("stamp", "false");
                  const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
                  const j = await r.json();
                  if (r.ok && j.url) set({ model3d: j.url });
                  else setErr(j.error || "فشل رفع ملف 3D");
                }}
              />
            </label>
          </div>
        </Field>

        <div>
          <div className="label">الأحجام والأسعار</div>
          {p.sizes.map((s, i) => (
            <div key={s.id} className="flex gap-2 mb-2">
              <input className="input" placeholder="الحجم" value={s.label} onChange={(e) => set({ sizes: p.sizes.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
              <input className="input w-32" type="number" min={0} placeholder="السعر" value={s.price} onChange={(e) => set({ sizes: p.sizes.map((x, j) => (j === i ? { ...x, price: Number(e.target.value) } : x)) })} />
              <button type="button" onClick={() => set({ sizes: p.sizes.filter((_, j) => j !== i) })} className="px-3 text-berry font-black">×</button>
            </div>
          ))}
          <button type="button" onClick={() => set({ sizes: [...p.sizes, { id: `s${Date.now()}`, label: "", price: 0 }] })} className="text-sm font-bold text-teal">+ حجم</button>
        </div>

        <div>
          <div className="label">الإضافات</div>
          {p.addons.map((a, i) => (
            <div key={a.id} className="flex gap-2 mb-2">
              <input className="input" placeholder="الإضافة" value={a.label} onChange={(e) => set({ addons: p.addons.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
              <input className="input w-32" type="number" min={0} placeholder="السعر" value={a.price} onChange={(e) => set({ addons: p.addons.map((x, j) => (j === i ? { ...x, price: Number(e.target.value) } : x)) })} />
              <button type="button" onClick={() => set({ addons: p.addons.filter((_, j) => j !== i) })} className="px-3 text-berry font-black">×</button>
            </div>
          ))}
          <button type="button" onClick={() => set({ addons: [...p.addons, { id: `a${Date.now()}`, label: "", price: 0 }] })} className="text-sm font-bold text-teal">+ إضافة</button>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="الطعم">
            <select className="input" value={p.taste} onChange={(e) => set({ taste: e.target.value as Product["taste"] })}>
              <option value="savory">حادق</option>
              <option value="sweet">حلو</option>
            </select>
          </Field>
        </div>
        <div className="flex flex-wrap gap-5">
          <Toggle on={p.isAvailable} onChange={(v) => set({ isAvailable: v })} label="متاح" />
          <Toggle on={p.isBestSeller} onChange={(v) => set({ isBestSeller: v })} label="الأكثر طلبًا" />
          <Toggle on={p.isNew} onChange={(v) => set({ isNew: v })} label="جديد" />
          <Toggle on={p.forFamily} onChange={(v) => set({ forFamily: v })} label="للبيت والعيلة" />
        </div>

        <div>
          <div className="label">غير متاح في الفروع دي</div>
          <div className="flex flex-wrap gap-2">
            {data.branches.map((b) => {
              const off = p.unavailableBranches.includes(b.id);
              return (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => set({ unavailableBranches: off ? p.unavailableBranches.filter((x) => x !== b.id) : [...p.unavailableBranches, b.id] })}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border ${off ? "bg-berry text-white border-berry" : "bg-white"}`}
                >
                  {b.name}
                </button>
              );
            })}
          </div>
        </div>

        {err && <p className="text-sm text-berry font-bold">{err}</p>}
        <div className="flex gap-2 justify-end pt-2">
          <button onClick={onClose} className="btn bg-cream">إلغاء</button>
          <button onClick={save} className="btn btn-primary">حفظ</button>
        </div>
      </div>
    </Modal>
  );
}
