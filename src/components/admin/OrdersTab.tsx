"use client";

import { useState } from "react";
import type { TabProps } from "./AdminDashboard";
import { saveItem } from "./ui";
import { formatPrice, statusLabels } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

const statuses: OrderStatus[] = ["new", "preparing", "delivering", "done", "cancelled"];
const colors: Record<OrderStatus, string> = {
  new: "bg-honey text-ink",
  preparing: "bg-brand-50 text-brand",
  delivering: "bg-teal-50 text-teal",
  done: "bg-leaf/15 text-[#0f7a25]",
  cancelled: "bg-gray-200 text-gray-600",
};

export default function OrdersTab({ data, reload, notify }: TabProps) {
  const [branch, setBranch] = useState("all");
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const list = data.orders.filter(
    (o) =>
      (branch === "all" || o.branchId === branch) &&
      (status === "all" || o.status === status) &&
      (!q || o.orderNumber.includes(q) || o.customerPhone.includes(q) || o.customerName.includes(q)),
  );

  const setSt = async (id: string, s: OrderStatus) => {
    await saveItem("orders", { id, status: s });
    notify("تم تحديث حالة الطلب");
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="card p-4 flex flex-wrap gap-2">
        <select className="input w-auto" value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option value="all">كل الفروع</option>
          {data.branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <select className="input w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">كل الحالات</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
        <input
          className="input flex-1 min-w-48"
          placeholder="بحث برقم الطلب أو الموبايل أو الاسم"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {list.length === 0 && (
        <div className="card p-10 text-center text-ink/50">لا توجد طلبات مطابقة حاليًا.</div>
      )}

      {list.map((o) => {
        const b = data.branches.find((x) => x.id === o.branchId);
        const isOpen = open === o.id;
        return (
          <div key={o.id} className="card overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : o.id)}
              className="w-full p-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-start cursor-pointer"
            >
              <span className="font-black text-brand">{o.orderNumber}</span>
              <span className="font-bold">{o.customerName}</span>
              <span className="text-sm text-ink/60" dir="ltr">
                {o.customerPhone}
              </span>
              <span className="text-sm text-ink/60">{b?.name}</span>
              <span className="text-sm font-bold">
                {o.orderType === "delivery" ? "توصيل دليفري" : "استلام من الفرع"}
              </span>
              <span className="ms-auto font-black">{formatPrice(o.total)}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors[o.status]}`}>
                {statusLabels[o.status]}
              </span>
              <span className="w-full text-xs text-ink/50">
                {new Date(o.createdAt).toLocaleString("ar-EG")}
              </span>
            </button>
            {isOpen && (
              <div className="border-t p-4 grid md:grid-cols-2 gap-4 bg-cream/40">
                <div className="space-y-1 text-sm">
                  {o.items.map((it, i) => (
                    <div key={i} className="flex justify-between gap-2">
                      <span>
                        {it.name}
                        {it.sizeLabel ? ` (${it.sizeLabel})` : ""} × {it.qty}
                        {it.addons.length > 0 && (
                          <span className="text-ink/60"> — {it.addons.join("، ")}</span>
                        )}
                        {it.note && (
                          <span className="block text-xs text-ink/60">ملاحظة: {it.note}</span>
                        )}
                      </span>
                      <b>{formatPrice(it.unitPrice * it.qty)}</b>
                    </div>
                  ))}
                  <div className="border-t pt-1 flex justify-between font-black text-brand">
                    <span>الإجمالي</span>
                    <span>{formatPrice(o.total)}</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {o.address && <p>العنوان: {o.address}</p>}
                  <p>طريقة الدفع: {o.paymentMethod}</p>
                  {o.notes && <p>ملاحظات: {o.notes}</p>}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {statuses.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSt(o.id, s)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer ${
                          o.status === s ? colors[s] + " border-transparent" : "bg-white"
                        }`}
                      >
                        {statusLabels[s]}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <a href={`tel:${o.customerPhone}`} className="btn btn-outline text-xs py-1.5">
                      اتصال بالعميل
                    </a>
                    <a
                      href={`https://wa.me/2${o.customerPhone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-whatsapp text-xs py-1.5"
                    >
                      واتساب العميل
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
