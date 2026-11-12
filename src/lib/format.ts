export const formatPrice = (n: number) => `${n.toLocaleString("ar-EG")} ج.م`;

export const statusLabels: Record<string, string> = {
  new: "جديد",
  preparing: "جاري التحضير",
  delivering: "خرج للتوصيل",
  done: "مكتمل",
  cancelled: "ملغي",
  contacted: "تم التواصل",
  confirmed: "مؤكد",
};

export const paymentMethods = [
  "الدفع عند الاستلام (كاش)",
  "إنستاباي (InstaPay)",
  "محفظة إلكترونية (فودافون كاش / اتصالات كاش)",
];

export const occasionTypes = [
  "عزومة عائلية (فراخ بروستد ومشوية وشاورما بالكيلو)",
  "بوكسات شاورما عربي وماريا للتجمعات",
  "وجبات شركات ومصانع وجامعات بمدينة بدر",
  "حفلة أو مناسبة خاصة",
  "توريد وجبات إفطار أو غداء جماعي",
  "استفسار أو اقتراح للإدارة",
];
