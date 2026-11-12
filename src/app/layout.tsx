import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cairo, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const siteUrl = "https://maakolatalsham.chameleon.vision";
const siteTitle = "مطعم شاورما وبروستد مأكولات الشام — مدينة بدر | Maakolat Al Sham";
const siteDescription =
  "مطعم شاورما وبروستد مأكولات الشام في مدينة بدر (ميدان النسر – إيجل مول – بجوار البنك الأهلي) — أصل الشاورما السوري عالصاج، الفراخ البروستد الذهبية، الفراخ المشوية، الفتة، والبيتزا مع توصيل سريع لكل أحياء مدينة بدر عبر 01023182006.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "مأكولات الشام",
  title: {
    default: siteTitle,
    template: "%s | شاورما وبروستد مأكولات الشام",
  },
  description: siteDescription,
  keywords: [
    "مأكولات الشام",
    "مطعم مأكولات الشام مدينة بدر",
    "شاورما وبروستد مأكولات الشام",
    "Maakolat Al Sham",
    "شاورما مدينة بدر",
    "بروستد مدينة بدر",
    "إيجل مول مدينة بدر",
    "منيو مأكولات الشام",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=1", sizes: "64x64", type: "image/png" },
      { url: "/icon-192.png?v=1", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png?v=1", sizes: "512x512", type: "image/png" },
    ],
    shortcut: ["/icon-192.png?v=1"],
    apple: [{ url: "/apple-icon?v=1", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: siteUrl,
    siteName: "شاورما وبروستد مأكولات الشام | Maakolat Al Sham",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og-image.jpg?v=1",
        width: 1200,
        height: 630,
        alt: "مطعم شاورما وبروستد مأكولات الشام — مدينة بدر",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-image.jpg?v=1"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "مأكولات الشام",
  },
};

export const viewport: Viewport = {
  themeColor: "#B90D12",
};

const pwaInitScript = `
(function() {
  if (typeof window === "undefined") return;
  window.addEventListener("error", function(e) {
    if (e && e.filename && e.filename.indexOf("chrome-extension://") === 0) {
      e.stopImmediatePropagation();
    }
  }, true);
  window.addEventListener("unhandledrejection", function(e) {
    var stack = e && e.reason && e.reason.stack ? String(e.reason.stack) : "";
    if (stack.indexOf("chrome-extension://") !== -1) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  }, true);
  window.addEventListener("beforeinstallprompt", function(e) {
    e.preventDefault();
    window.__pwaInstallPrompt = e;
    window.dispatchEvent(new Event("pwa-install-available"));
  });
  window.addEventListener("appinstalled", function() {
    window.__pwaInstallPrompt = null;
    window.dispatchEvent(new Event("pwa-app-installed"));
  });
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).then(function(reg) { reg.update(); }).catch(function() {});
    });
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable}`}>
      <head>
        <Script id="pwa-init" strategy="beforeInteractive">
          {pwaInitScript}
        </Script>
      </head>
      <body className="min-h-dvh flex flex-col bg-[#FFF8E8] text-[#111111] antialiased selection:bg-[#B90D12] selection:text-white">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
