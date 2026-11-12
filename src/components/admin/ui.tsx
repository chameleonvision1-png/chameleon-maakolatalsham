"use client";

import { useRef, useState } from "react";

export type AdminData = import("@/lib/types").DB;

export async function api<T = unknown>(url: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body instanceof FormData ? undefined : { "Content-Type": "application/json" },
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "حصل خطأ");
  return data as T;
}

export const saveItem = (coll: string, item: unknown) => api(`/api/admin/collection/${coll}`, "PUT", item);
export const deleteItem = (coll: string, id: string) => api(`/api/admin/collection/${coll}?id=${encodeURIComponent(id)}`, "DELETE");

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" onClick={() => onChange(!on)} className="inline-flex items-center gap-2 text-sm font-bold cursor-pointer" aria-pressed={on}>
      <span className={`relative w-11 h-6 rounded-full transition ${on ? "bg-[#B90D12]" : "bg-gray-300"}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? "start-[22px]" : "start-0.5"}`} />
      </span>
      {label}
    </button>
  );
}

export function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [stamp, setStamp] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const upload = async (f: File) => {
    setBusy(true);
    setErr("");
    const fd = new FormData();
    fd.append("file", f);
    fd.append("stamp", String(stamp));
    try {
      const { url } = await api<{ url: string }>("/api/admin/upload", "POST", fd);
      onChange(url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex gap-3 items-start">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={value || "/logo-emblem.png"} alt="" className="w-24 h-24 rounded-xl object-cover bg-cream border" />
      <div className="space-y-2 flex-1">
        <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        <button type="button" onClick={() => ref.current?.click()} className="btn btn-outline text-sm py-2" disabled={busy}>
          {busy ? "جاري الرفع…" : "رفع صورة"}
        </button>
        <Toggle on={stamp} onChange={setStamp} label="دمج شعار مأكولات الشام تلقائيًا" />
        <input className="input text-xs" dir="ltr" value={value} onChange={(e) => onChange(e.target.value)} placeholder="/images/..." />
        {err && <p className="text-xs text-berry">{err}</p>}
      </div>
    </div>
  );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/50" />
      <div className="relative bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-5 py-4 flex justify-between items-center z-10">
          <h3 className="font-black text-lg text-[#B90D12]">{title}</h3>
          <button onClick={onClose} className="text-2xl leading-none px-2 cursor-pointer" aria-label="إغلاق">×</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}
