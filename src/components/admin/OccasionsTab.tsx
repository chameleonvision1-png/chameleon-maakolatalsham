"use client";

import type { TabProps } from "./AdminDashboard";
import { deleteItem, saveItem } from "./ui";
import { statusLabels } from "@/lib/format";
import type { OccasionStatus } from "@/lib/types";

const statuses: OccasionStatus[] = ["new", "contacted", "confirmed", "done", "cancelled"];

export default function OccasionsTab({ data, reload, notify }: TabProps) {
  if (data.occasions.length === 0)
    return <div className="card p-10 text-center text-ink/50">لا توجد طلبات عزومات مسجلة حاليًا.</div>;
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {data.occasions.map((o) => (
        <div key={o.id} className="card p-5 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <h3 className="font-black text-lg text-brand">{o.type}</h3>
            <span className="text-xs text-ink/50">
              {new Date(o.createdAt).toLocaleString("ar-EG")}
            </span>
          </div>
          <p>
            <b>{o.name}</b> — <span dir="ltr">{o.phone}</span>
          </p>
          <p>
            التاريخ: {o.date} — العدد: {o.quantity || "-"}
          </p>
          <p>الفرع: {data.branches.find((b) => b.id === o.branchId)?.name}</p>
          {o.details && (
            <p className="whitespace-pre-line bg-cream rounded-xl p-3">
              {o.details.split(/(\/api\/uploads\/\S+)/).map((part, i) =>
                part.startsWith("/api/uploads/") ? (
                  <a key={i} href={part} target="_blank" rel="noreferrer" className="text-teal underline">
                    عرض الصورة
                  </a>
                ) : (
                  part
                ),
              )}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={async () => {
                  await saveItem("occasions", { id: o.id, status: s });
                  notify("تم التحديث");
                  reload();
                }}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer ${
                  o.status === s ? "bg-brand text-white border-brand" : "bg-white"
                }`}
              >
                {statusLabels[s]}
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <a
              href={`https://wa.me/2${o.phone}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp text-xs py-1.5"
            >
              واتساب العميل
            </a>
            <button
              onClick={async () => {
                if (confirm("حذف الطلب؟")) {
                  await deleteItem("occasions", o.id);
                  reload();
                }
              }}
              className="text-berry font-bold text-xs cursor-pointer"
            >
              حذف
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
