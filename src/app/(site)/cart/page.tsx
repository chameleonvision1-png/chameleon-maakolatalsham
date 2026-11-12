import type { Metadata } from "next";
import CartClient from "@/components/CartClient";

export const metadata: Metadata = {
  title: "سلة الطلبات",
  description:
    "راجع سلة طلباتك من مطعم شاورما وبروستد مأكولات الشام بمدينة بدر وأرسل الطلب مباشرة عبر واتساب الفرع.",
};

export default function CartPage() {
  return <CartClient />;
}
