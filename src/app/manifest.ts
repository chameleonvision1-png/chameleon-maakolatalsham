import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "شاورما وبروستد مأكولات الشام | Maakolat Al Sham — مدينة بدر",
    short_name: "مأكولات الشام",
    description:
      "مطعم شاورما وبروستد مأكولات الشام في مدينة بدر — إيجل مول بجوار البنك الأهلي. شاورما عالصاج، فراخ بروستد ومشوية، فتة، بيتزا، وتوصيل سريع 01023182006",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8E8",
    theme_color: "#B90D12",
    dir: "rtl",
    lang: "ar",
    icons: [
      {
        src: "/icon-192.png?v=1",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png?v=1",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-maskable-512.png?v=1",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
