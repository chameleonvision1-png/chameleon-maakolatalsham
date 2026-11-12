"use client";

import { QrCodeIcon } from "./icons";

export default function OpenQrButton({
  label = "باركود المنيو QR",
  className = "inline-flex items-center justify-center gap-2 rounded-full bg-[#FFD21A] hover:bg-white text-[#111111] font-black text-xs sm:text-sm px-5 py-3 transition shadow-xs cursor-pointer",
  iconClassName = "w-4 h-4 shrink-0 text-[#B90D12]",
}: {
  label?: string;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("open-menu-qr"));
        }
      }}
      className={className}
    >
      <QrCodeIcon className={iconClassName} />
      <span>{label}</span>
    </button>
  );
}
