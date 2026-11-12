"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { generateQrMatrix } from "@/lib/qrcode";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";
import {
  CheckIcon,
  CopyIcon,
  DownloadAppIcon,
  FacebookIcon,
  PrintIcon,
  ShareNodesIcon,
  TelegramIcon,
  WhatsAppIcon,
  XIcon,
  XSocialIcon,
} from "./icons";

const MENU_URL = "https://maakolatalsham.chameleon.vision/menu";
const SHARE_TITLE = "منيو مطعم شاورما وبروستد مأكولات الشام — مدينة بدر | Maakolat Al Sham";
const SHARE_TEXT =
  "تصفح منيو شاورما وبروستد مأكولات الشام الرسمي واطلب أونلاين في مدينة بدر (إيجل مول ميدان النسر - 01023182006):";

export default function MenuQrModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const matrix = useMemo(() => generateQrMatrix(MENU_URL, "Q"), []);
  const size = matrix.length;

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const isCenterLogoZone = useCallback(
    (r: number, c: number) => {
      const center = (size - 1) / 2;
      const radius = 3.6;
      return Math.abs(r - center) <= radius && Math.abs(c - center) <= radius;
    },
    [size],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MENU_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      const input = document.createElement("input");
      input.value = MENU_URL;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: SHARE_TITLE,
          text: SHARE_TEXT,
          url: MENU_URL,
        });
        return;
      } catch {
        // cancelled
      }
    }
    handleCopy();
  };

  const handleDownloadQrImage = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      const W = 1080;
      const H = 1380;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, "#B90D12");
      bgGrad.addColorStop(0.55, "#780508");
      bgGrad.addColorStop(1, "#111111");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      const radGrad = ctx.createRadialGradient(W * 0.8, H * 0.12, 10, W * 0.8, H * 0.12, 360);
      radGrad.addColorStop(0, "rgba(255, 210, 26, 0.30)");
      radGrad.addColorStop(1, "rgba(255, 210, 26, 0)");
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, W, H);

      const cardX = 80;
      const cardY = 80;
      const cardW = W - 160;
      const cardH = H - 160;
      ctx.fillStyle = "#FFF8E8";
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 48);
      ctx.fill();

      const loadImg = (src: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });

      try {
        const emblemLogo = await loadImg("/logo-emblem.png");
        const lw = 144;
        ctx.drawImage(emblemLogo, (W - lw) / 2, cardY + 34, lw, lw);
      } catch {
        // ignore
      }

      ctx.fillStyle = "#B90D12";
      ctx.font = "900 42px Cairo, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("شاورما وبروستد مأكولات الشام — مدينة بدر", W / 2, cardY + 228);

      ctx.fillStyle = "#111111";
      ctx.font = "700 25px Cairo, sans-serif";
      ctx.fillText("امسح رمز الـ QR بالكاميرا لتصفح المنيو والطلب مباشرة", W / 2, cardY + 274);

      const qrBoxSize = 610;
      const qrBoxX = (W - qrBoxSize) / 2;
      const qrBoxY = cardY + 312;

      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#B90D12";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 36);
      ctx.fill();
      ctx.stroke();

      const quietZone = 44;
      const cell = (qrBoxSize - quietZone * 2) / size;

      ctx.fillStyle = "#B90D12";
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (!matrix[r][c] || isCenterLogoZone(r, c)) continue;
          const x = qrBoxX + quietZone + c * cell;
          const y = qrBoxY + quietZone + r * cell;
          ctx.beginPath();
          ctx.roundRect(x + 0.4, y + 0.4, cell - 0.8, cell - 0.8, cell * 0.25);
          ctx.fill();
        }
      }

      try {
        const roundLogo = await loadImg("/logo-emblem.png");
        const badgeSize = 124;
        const bx = W / 2 - badgeSize / 2;
        const by = qrBoxY + qrBoxSize / 2 - badgeSize / 2;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(bx - 8, by - 8, badgeSize + 16, badgeSize + 16, 999);
        ctx.fill();
        ctx.strokeStyle = "#FFD21A";
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.drawImage(roundLogo, bx, by, badgeSize, badgeSize);
      } catch {
        // ignore
      }

      ctx.fillStyle = "#111111";
      ctx.font = "800 24px Cairo, sans-serif";
      ctx.fillText(
        "شاورما سوري • بروستد ومشوي • فتة وموتزاريلا • بيتزا • إيجل مول مدينة بدر",
        W / 2,
        qrBoxY + qrBoxSize + 65,
      );

      const pillW = 680;
      const pillH = 66;
      const pillX = (W - pillW) / 2;
      const pillY = qrBoxY + qrBoxSize + 100;
      ctx.fillStyle = "#B90D12";
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 999);
      ctx.fill();

      ctx.fillStyle = "#FFD21A";
      ctx.font = "800 26px Cairo, sans-serif";
      ctx.fillText("maakolatalsham.chameleon.vision/menu", W / 2, pillY + 42);

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "maakolat-alsham-menu-qr.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    const svgEl = document.getElementById("maakolatalsham-menu-qr-svg");
    const svgMarkup = svgEl ? svgEl.outerHTML : "";

    const printHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>طباعة باركود منيو مأكولات الشام — مدينة بدر</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; font-family: 'Cairo', system-ui, sans-serif; background: #ffffff; color: #111111; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .poster { width: 176mm; background: linear-gradient(155deg, #B90D12 0%, #780508 65%, #111111 100%); border-radius: 26px; padding: 14mm 12mm; text-align: center; color: #fff; }
    .inner { background: #FFF8E8; color: #111111; border-radius: 22px; padding: 10mm 8mm; border: 3px solid #FFD21A; }
    .logo { height: 22mm; width: auto; object-fit: contain; margin: 0 auto 4mm; display: block; }
    h1 { margin: 0; font-size: 23pt; font-weight: 900; color: #B90D12; }
    .sub { margin: 2mm 0 6mm; font-size: 11.5pt; font-weight: 700; color: #111111; }
    .qr-wrap { width: 98mm; height: 98mm; margin: 0 auto 6mm; padding: 5mm; background: #fff; border: 3px solid #B90D12; border-radius: 20px; display: flex; align-items: center; justify-content: center; }
    .qr-wrap svg { width: 100%; height: 100%; }
    .branches { font-size: 10.5pt; font-weight: 800; color: #111111; margin-bottom: 4mm; }
    .url { display: inline-block; background: #B90D12; color: #FFD21A; font-weight: 900; font-size: 11pt; padding: 2.5mm 7mm; border-radius: 999px; direction: ltr; }
  </style>
</head>
<body>
  <div class="poster">
    <div class="inner">
      <img src="${window.location.origin}/logo-horizontal.webp" class="logo" alt="شاورما وبروستد مأكولات الشام" />
      <h1>منيو شاورما وبروستد مأكولات الشام</h1>
      <p class="sub">امسح رمز الـ QR بكاميرا الموبايل لتصفح المنيو والطلب مباشرة</p>
      <div class="qr-wrap">${svgMarkup}</div>
      <div class="branches">مدينة بدر • ميدان النسر • إيجل مول بجوار البنك الأهلي • 01023182006</div>
      <div class="url">maakolatalsham.chameleon.vision/menu</div>
    </div>
  </div>
  <script>window.onload = () => { setTimeout(() => { window.print(); }, 350); };</script>
</body>
</html>`;

    const win = window.open("", "_blank", "width=860,height=980");
    if (!win) return;
    win.document.open();
    win.document.write(printHtml);
    win.document.close();
  };

  if (!open || typeof document === "undefined") return null;

  const encodedUrl = encodeURIComponent(MENU_URL);
  const encodedMsg = encodeURIComponent(`${SHARE_TEXT}\n${MENU_URL}`);
  const encodedTextOnly = encodeURIComponent(SHARE_TEXT);

  const socialLinks = [
    {
      name: "واتساب",
      href: `https://wa.me/?text=${encodedMsg}`,
      cls: "bg-[#B90D12] text-white hover:bg-[#780508]",
      icon: <WhatsAppIcon className="w-4 h-4" />,
    },
    {
      name: "فيسبوك",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      cls: "bg-[#111111] text-[#FFD21A] hover:bg-black",
      icon: <FacebookIcon className="w-4 h-4" />,
    },
    {
      name: "تيليجرام",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTextOnly}`,
      cls: "bg-white text-[#111111] border border-[#B90D12]/20 hover:bg-[#FFD21A]",
      icon: <TelegramIcon className="w-4 h-4 text-[#B90D12]" />,
    },
    {
      name: "منصة X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTextOnly}`,
      cls: "bg-white text-[#111111] border border-[#B90D12]/20 hover:bg-[#FFD21A]",
      icon: <XSocialIcon className="w-3.5 h-3.5 text-[#111111]" />,
    },
  ];

  const centerOffset = (size - 7.2) / 2;

  return createPortal(
    <div
      dir="rtl"
      className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center p-2.5 sm:p-4 animate-modal-backdrop overscroll-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-qr-modal-title"
    >
      <div
        className="absolute inset-0 bg-[#111111]/70 backdrop-blur-xs touch-none"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#FFF8E8] shadow-2xl border-2 border-[#B90D12]/30 overflow-hidden animate-modal-content max-h-[90dvh] flex flex-col">
        {/* Symmetrical 3-Column Header */}
        <div
          dir="ltr"
          className="bg-gradient-to-l from-[#B90D12] via-[#A20B10] to-[#780508] text-white px-4 py-3.5 grid grid-cols-[40px_1fr_40px] items-center gap-2.5 shrink-0 border-b border-[#FFD21A]/25"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-emblem.webp"
            alt="مأكولات الشام"
            className="w-10 h-10 rounded-full object-contain drop-shadow-sm select-none"
          />
          <div dir="rtl" className="min-w-0 text-center">
            <h3 id="menu-qr-modal-title" className="text-sm sm:text-base font-black truncate">
              باركود منيو مأكولات الشام
            </h3>
            <p className="text-[11px] text-[#FFD21A] font-bold truncate">
              امسح الرمز بالكاميرا أو شارك المنيو مباشرة
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#B90D12] grid place-items-center cursor-pointer transition"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Scroll-Isolated Body (`data-modal-scroll`) */}
        <div
          data-modal-scroll
          className="p-4 sm:p-5 overflow-y-auto overscroll-contain touch-pan-y space-y-4"
        >
          <div className="mx-auto w-full max-w-[260px] rounded-3xl bg-white p-4 shadow-md border-2 border-[#B90D12]/20 text-center">
            <svg
              id="maakolatalsham-menu-qr-svg"
              viewBox={`-2 -2 ${size + 4} ${size + 4}`}
              className="w-full h-auto aspect-square block mx-auto"
              role="img"
              aria-label="رمز استجابة سريعة لمنيو مطعم مأكولات الشام"
            >
              <rect x={-2} y={-2} width={size + 4} height={size + 4} rx={2.2} fill="#FFFFFF" />
              {matrix.map((row, r) =>
                row.map((dark, c) => {
                  if (!dark || isCenterLogoZone(r, c)) return null;
                  return (
                    <rect
                      key={`${r}-${c}`}
                      x={c + 0.06}
                      y={r + 0.06}
                      width={0.88}
                      height={0.88}
                      rx={0.24}
                      fill="#B90D12"
                    />
                  );
                }),
              )}

              <rect
                x={centerOffset}
                y={centerOffset}
                width={7.2}
                height={7.2}
                rx={3.6}
                fill="#FFFFFF"
                stroke="#FFD21A"
                strokeWidth={0.45}
              />
              <image
                href="/logo-emblem.png"
                x={centerOffset + 0.55}
                y={centerOffset + 0.55}
                width={6.1}
                height={6.1}
                preserveAspectRatio="xMidYMid contain"
              />
            </svg>

            <div className="mt-2.5 pt-2 border-t border-[#B90D12]/12 flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-[#B90D12]">
              <span>شاورما وبروستد مأكولات الشام • إيجل مول</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-white p-2 border border-[#B90D12]/20">
            <span
              dir="ltr"
              className="flex-1 text-left px-2.5 text-xs font-bold text-[#111111]/80 truncate select-all"
            >
              {MENU_URL}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                copied
                  ? "bg-[#111111] text-[#FFD21A]"
                  : "bg-[#B90D12] hover:bg-[#780508] text-white"
              }`}
            >
              {copied ? (
                <>
                  <CheckIcon className="w-3.5 h-3.5" />
                  <span>تم النسخ</span>
                </>
              ) : (
                <>
                  <CopyIcon className="w-3.5 h-3.5" />
                  <span>نسخ الرابط</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleNativeShare}
              className="rounded-2xl bg-[#FFD21A] hover:bg-[#F2A900] text-[#111111] py-2.5 px-2 flex flex-col items-center justify-center gap-1 text-xs font-black transition cursor-pointer shadow-2xs"
            >
              <ShareNodesIcon className="w-4 h-4" />
              <span>مشاركة سريعة</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadQrImage}
              disabled={downloading}
              className="rounded-2xl bg-white hover:bg-[#B90D12] text-[#B90D12] hover:text-white border border-[#B90D12]/25 py-2.5 px-2 flex flex-col items-center justify-center gap-1 text-xs font-black transition cursor-pointer disabled:opacity-60"
            >
              <DownloadAppIcon className="w-4 h-4" />
              <span>{downloading ? "جاري الحفظ…" : "تحميل صورة QR"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="rounded-2xl bg-white hover:bg-[#B90D12] text-[#B90D12] hover:text-white border border-[#B90D12]/25 py-2.5 px-2 flex flex-col items-center justify-center gap-1 text-xs font-black transition cursor-pointer"
            >
              <PrintIcon className="w-4 h-4" />
              <span>طباعة الكود</span>
            </button>
          </div>

          <div>
            <p className="text-[11px] font-extrabold text-[#111111]/60 mb-2 text-center">
              أو شارك منيو مأكولات الشام مباشرة عبر المنصات الاجتماعية
            </p>
            <div className="grid grid-cols-4 gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-2xl py-2.5 px-2 flex flex-col items-center justify-center gap-1 text-[11px] font-black transition ${s.cls}`}
                >
                  {s.icon}
                  <span>{s.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
