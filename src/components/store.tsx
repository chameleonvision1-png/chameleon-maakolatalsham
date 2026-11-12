"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Branch } from "@/lib/types";

export interface CartLine {
  key: string;
  productId: string;
  name: string;
  image: string;
  sizeLabel?: string;
  addons: { label: string; price: number }[];
  note?: string;
  unitPrice: number;
  qty: number;
}

interface StoreCtx {
  branches: Branch[];
  branch: Branch | null;
  setBranchId: (id: string) => void;
  pickerOpen: boolean;
  openPicker: () => void;
  closePicker: () => void;
  cart: CartLine[];
  addToCart: (line: Omit<CartLine, "key">) => void;
  updateQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
  bump: number;
  hydrated: boolean;
}

const Ctx = createContext<StoreCtx | null>(null);

const BRANCH_STORAGE_KEY = "maakolatalsham_branch";
const CART_STORAGE_KEY = "maakolatalsham_cart";

export function StoreProvider({ branches, children }: { branches: Branch[]; children: React.ReactNode }) {
  const [branchId, setBranchIdState] = useState<string | null>(branches[0]?.id ?? null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const b = localStorage.getItem(BRANCH_STORAGE_KEY);
      const c = localStorage.getItem(CART_STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (b && branches.some((x) => x.id === b)) setBranchIdState(b);
      else if (branches[0]) setBranchIdState(branches[0].id);
      if (c) setCart(JSON.parse(c));
    } catch {}
    setHydrated(true);
  }, [branches]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const setBranchId = useCallback((id: string) => {
    setBranchIdState(id);
    localStorage.setItem(BRANCH_STORAGE_KEY, id);
    setPickerOpen(false);
  }, []);

  const addToCart = useCallback((line: Omit<CartLine, "key">) => {
    const key = [line.productId, line.sizeLabel, line.addons.map((a) => a.label).join("+"), line.note].join("|");
    setCart((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + line.qty } : l));
      return [...prev, { ...line, key }];
    });
    setBump((x) => x + 1);
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    setCart((prev) => (qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l))));
  }, []);
  const removeLine = useCallback((key: string) => setCart((prev) => prev.filter((l) => l.key !== key)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const branch = useMemo(() => branches.find((b) => b.id === branchId) ?? branches[0] ?? null, [branches, branchId]);
  const count = useMemo(() => cart.reduce((n, l) => n + l.qty, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((s, l) => s + l.unitPrice * l.qty, 0), [cart]);

  const value = useMemo<StoreCtx>(
    () => ({
      branches,
      branch,
      setBranchId,
      pickerOpen,
      openPicker: () => setPickerOpen(true),
      closePicker: () => setPickerOpen(false),
      cart,
      addToCart,
      updateQty,
      removeLine,
      clearCart,
      count,
      subtotal,
      bump,
      hydrated,
    }),
    [branches, branch, setBranchId, pickerOpen, cart, addToCart, updateQty, removeLine, clearCart, count, subtotal, bump, hydrated]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
