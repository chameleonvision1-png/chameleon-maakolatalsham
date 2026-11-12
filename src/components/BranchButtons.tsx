"use client";

import { useStore } from "./store";
import { PinIcon } from "./icons";

export default function PickBranchButton({ className, label = "اختار أقرب فرع" }: { className?: string; label?: string }) {
  const { openPicker } = useStore();
  return (
    <button onClick={openPicker} className={className ?? "btn btn-outline"}>
      <PinIcon /> {label}
    </button>
  );
}

export function OrderFromBranchButton({ branchId, className }: { branchId: string; className?: string }) {
  const { setBranchId } = useStore();
  return (
    <a
      href="/menu"
      onClick={() => setBranchId(branchId)}
      className={className ?? "btn btn-primary text-sm py-2.5"}
    >
      اطلب من الفرع ده
    </a>
  );
}
