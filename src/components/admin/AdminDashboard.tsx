"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type AdminData } from "./ui";
import OrdersTab from "./OrdersTab";
import ProductsTab from "./ProductsTab";
import OffersTab from "./OffersTab";
import BranchesTab from "./BranchesTab";
import OccasionsTab from "./OccasionsTab";
import CategoriesTab from "./CategoriesTab";
import SettingsTab from "./SettingsTab";
import Overview from "./Overview";

const tabs = [
  { id: "overview", label: "نظرة عامة", icon: "/01" },
  { id: "orders", label: "الطلبات", icon: "/02" },
  { id: "products", label: "المنتجات", icon: "/03" },
  { id: "categories", label: "الأقسام", icon: "/04" },
  { id: "offers", label: "العروض", icon: "/05" },
  { id: "branches", label: "الفروع", icon: "/06" },
  { id: "occasions", label: "طلبات العزومات", icon: "/07" },
  { id: "settings", label: "الإعدادات", icon: "/08" },
] as const;
type Tab = (typeof tabs)[number]["id"];

export interface TabProps {
  data: AdminData;
  reload: () => void;
  notify: (msg: string) => void;
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const [data, setData] = useState<AdminData | null>(null);
  const [toast, setToast] = useState("");
  const lastCount = useRef<number | null>(null);
  const router = useRouter();

  const reload = useCallback(async () => {
    try {
      const d = await api<AdminData>("/api/admin/data", "GET");
      if (lastCount.current !== null && d.orders.length > lastCount.current) {
        setToast(`وصل ${d.orders.length - lastCount.current} طلب جديد`);
        try {
          const ctx = new AudioContext();
          const o = ctx.createOscillator();
          o.frequency.value = 880;
          o.connect(ctx.destination);
          o.start();
          o.stop(ctx.currentTime + 0.25);
        } catch {}
      }
      lastCount.current = d.orders.length;
      setData(d);
    } catch {
      router.refresh();
    }
  }, [router]);

  useEffect(() => {
    reload();
    const t = setInterval(reload, 20000);
    return () => clearInterval(t);
  }, [reload]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const notify = (m: string) => setToast(m);
  const logout = async () => {
    await api("/api/admin/login", "DELETE");
    router.refresh();
  };

  const newOrders = data?.orders.filter((o) => o.status === "new").length ?? 0;
  const newOcc = data?.occasions.filter((o) => o.status === "new").length ?? 0;

  return (
    <div className="min-h-screen bg-[#FFF8E8] lg:flex">
      <aside className="lg:w-64 lg:min-h-screen bg-[#B90D12] text-white lg:sticky lg:top-0 lg:h-screen flex lg:flex-col">
        <div className="hidden lg:flex items-center gap-3 p-5 border-b border-white/15">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-emblem.png"
            alt="شاورما وبروستد مأكولات الشام"
            className="w-12 h-12 rounded-xl bg-white p-1 border border-[#FFD21A]"
          />
          <div>
            <div className="font-black">مأكولات الشام</div>
            <div className="text-xs text-white/75">لوحة التحكم</div>
          </div>
        </div>
        <nav className="flex lg:flex-col overflow-x-auto no-scrollbar lg:p-3 gap-1 flex-1">
          {tabs.map((t) => {
            const badge = t.id === "orders" ? newOrders : t.id === "occasions" ? newOcc : 0;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`shrink-0 flex items-center gap-2 px-4 py-3 lg:rounded-xl font-bold text-sm transition cursor-pointer ${
                  tab === t.id ? "bg-white text-[#B90D12]" : "hover:bg-white/10"
                }`}
              >
                <span dir="ltr" className="font-en text-xs opacity-70">
                  {t.icon}
                </span>
                {t.label}
                {badge > 0 && (
                  <span className="ms-auto bg-[#FFD21A] text-[#111111] text-xs rounded-full px-2 font-black">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="hidden lg:block p-3 border-t border-white/15 space-y-1">
          <a
            href="/"
            target="_blank"
            className="block px-4 py-2 text-sm text-white/85 hover:text-white"
          >
            فتح الموقع ↗
          </a>
          <button
            onClick={logout}
            className="w-full text-start px-4 py-2 text-sm text-white/75 hover:text-white cursor-pointer"
          >
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-[#111111]">
            {tabs.find((t) => t.id === tab)?.label}
          </h1>
          <div className="flex items-center gap-2">
            <button onClick={reload} className="btn bg-white border border-[#111111]/12 text-xs py-2 px-3.5">
              تحديث البيانات
            </button>
            <button
              onClick={logout}
              className="lg:hidden btn bg-[#111111] text-white text-xs py-2 px-3.5"
            >
              خروج
            </button>
          </div>
        </div>

        {!data ? (
          <div className="card p-12 text-center font-bold text-[#111111]/55">
            جاري تحميل بيانات مأكولات الشام…
          </div>
        ) : (
          <>
            {tab === "overview" && <Overview data={data} goto={(t) => setTab(t as Tab)} />}
            {tab === "orders" && <OrdersTab data={data} reload={reload} notify={notify} />}
            {tab === "products" && <ProductsTab data={data} reload={reload} notify={notify} />}
            {tab === "categories" && <CategoriesTab data={data} reload={reload} notify={notify} />}
            {tab === "offers" && <OffersTab data={data} reload={reload} notify={notify} />}
            {tab === "branches" && <BranchesTab data={data} reload={reload} notify={notify} />}
            {tab === "occasions" && <OccasionsTab data={data} reload={reload} notify={notify} />}
            {tab === "settings" && <SettingsTab data={data} reload={reload} notify={notify} />}
          </>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-5 end-5 z-50 bg-[#111111] text-white font-black text-sm px-5 py-3 rounded-full shadow-xl border border-[#FFD21A]/50">
          {toast}
        </div>
      )}
    </div>
  );
}
