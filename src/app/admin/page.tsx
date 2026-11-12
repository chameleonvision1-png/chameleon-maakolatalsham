import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "لوحة التحكم", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const ok = await isAdmin();
  return ok ? <AdminDashboard /> : <AdminLogin />;
}
