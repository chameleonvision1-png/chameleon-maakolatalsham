"use client";

import { useState } from "react";
import type { TabProps } from "./AdminDashboard";
import { deleteItem, Field, Modal, saveItem, Toggle } from "./ui";
import type { Branch } from "@/lib/types";

const blank: Branch = {
  id: "",
  name: "",
  city: "مدينة بدر",
  address: "",
  phone: "",
  whatsapp: "",
  hours: "",
  mapUrl: "",
  services: ["توصيل للمنازل", "استلام من الفرع"],
  deliveryFee: 0,
  minOrder: 0,
  deliveryAreas: [],
  isActive: true,
};

export default function BranchesTab({ data, reload, notify }: TabProps) {
  const [edit, setEdit] = useState<Branch | null>(null);
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setEdit({ ...blank })} className="btn btn-primary">
          + فرع جديد
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {data.branches.map((b) => (
          <div key={b.id} className="card p-5 space-y-1.5">
            <div className="flex justify-between">
              <div>
                <span className="text-xs font-bold bg-teal-50 text-teal px-2.5 py-0.5 rounded-full">
                  {b.city}
                </span>
                <h3 className="font-black text-lg text-brand mt-1">{b.name}</h3>
              </div>
              <Toggle
                on={b.isActive}
                onChange={async (v) => {
                  await saveItem("branches", { id: b.id, isActive: v });
                  reload();
                }}
                label={b.isActive ? "ظاهر" : "مخفي"}
              />
            </div>
            <p className="text-sm">{b.address}</p>
            <p className="text-sm">
              هاتف: <span dir="ltr">{b.phone}</span> — واتساب:{" "}
              <span dir="ltr">+{b.whatsapp}</span>
            </p>
            <p className="text-sm">مواعيد العمل: {b.hours}</p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEdit(structuredClone(b))}
                className="text-teal font-bold text-sm cursor-pointer"
              >
                تعديل
              </button>
              <button
                onClick={async () => {
                  if (confirm(`حذف ${b.name}؟`)) {
                    await deleteItem("branches", b.id);
                    notify("تم الحذف");
                    reload();
                  }
                }}
                className="text-berry font-bold text-sm cursor-pointer"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
      {edit && (
        <BranchEditor
          initial={edit}
          onClose={() => setEdit(null)}
          onSaved={() => {
            setEdit(null);
            notify("تم حفظ الفرع");
            reload();
          }}
        />
      )}
    </div>
  );
}

function BranchEditor({
  initial,
  onClose,
  onSaved,
}: {
  initial: Branch;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [b, setB] = useState(initial);
  const [err, setErr] = useState("");
  const set = (p: Partial<Branch>) => setB((x) => ({ ...x, ...p }));
  const save = async () => {
    if (!b.name.trim()) return setErr("اكتب اسم الفرع");
    const wa = b.whatsapp.replace(/\D/g, "").replace(/^0/, "20");
    if (!/^20\d{10}$/.test(wa))
      return setErr("رقم الواتساب لازم يكون رقم مصري صحيح (مثال: 01023182006)");
    await saveItem("branches", { ...b, whatsapp: wa });
    onSaved();
  };
  return (
    <Modal title={b.id ? "تعديل فرع" : "فرع جديد"} onClose={onClose}>
      <div className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="اسم الفرع">
            <input
              className="input"
              value={b.name}
              onChange={(e) => set({ name: e.target.value })}
            />
          </Field>
          <Field label="المدينة">
            <input
              className="input"
              list="cities"
              value={b.city}
              onChange={(e) => set({ city: e.target.value as Branch["city"] })}
            />
            <datalist id="cities">
              <option value="مدينة بدر" />
              <option value="الشروق" />
              <option value="حدائق العاصمة" />
            </datalist>
          </Field>
        </div>
        <Field label="العنوان">
          <input
            className="input"
            value={b.address}
            onChange={(e) => set({ address: e.target.value })}
          />
        </Field>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="رقم التليفون ١">
            <input
              className="input"
              dir="ltr"
              value={b.phone}
              onChange={(e) => set({ phone: e.target.value })}
            />
          </Field>
          <Field label="رقم التليفون ٢ (اختياري)">
            <input
              className="input"
              dir="ltr"
              value={b.phone2 ?? ""}
              onChange={(e) => set({ phone2: e.target.value || undefined })}
            />
          </Field>
          <Field label="رقم واتساب الطلبات">
            <input
              className="input"
              dir="ltr"
              value={b.whatsapp}
              onChange={(e) => set({ whatsapp: e.target.value })}
              placeholder="01023182006"
            />
          </Field>
        </div>
        <Field label="مواعيد العمل">
          <input
            className="input"
            value={b.hours}
            onChange={(e) => set({ hours: e.target.value })}
          />
        </Field>
        <Field label="رابط Google Maps">
          <input
            className="input"
            dir="ltr"
            value={b.mapUrl}
            onChange={(e) => set({ mapUrl: e.target.value })}
          />
        </Field>
        <Field label="الخدمات (افصل بفاصلة)">
          <input
            className="input"
            value={b.services.join("، ")}
            onChange={(e) =>
              set({
                services: e.target.value
                  .split(/[،,]/)
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </Field>
        <Field label="مناطق التوصيل (افصل بفاصلة)">
          <input
            className="input"
            value={b.deliveryAreas.join("، ")}
            onChange={(e) =>
              set({
                deliveryAreas: e.target.value
                  .split(/[،,]/)
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </Field>
        {err && <p className="text-sm text-berry font-bold">{err}</p>}
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn bg-cream">
            إلغاء
          </button>
          <button onClick={save} className="btn btn-primary">
            حفظ
          </button>
        </div>
      </div>
    </Modal>
  );
}
