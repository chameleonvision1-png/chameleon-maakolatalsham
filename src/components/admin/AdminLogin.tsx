"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password: pw }),
    });
    setLoading(false);
    if (!res.ok) {
      setErr((await res.json()).error);
      return;
    }
    router.refresh();
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-[#FFF8E8]">
      <form
        onSubmit={submit}
        className="rounded-[32px] bg-white border border-[#B90D12]/25 shadow-2xl w-full max-w-sm p-8 space-y-4"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-emblem.png"
          alt="شاورما وبروستد مأكولات الشام"
          className="w-24 h-24 mx-auto rounded-2xl bg-[#FFF8E8] p-2 ring-2 ring-[#B90D12]/30 object-contain"
        />
        <h1 className="text-2xl font-black text-[#B90D12] text-center">
          لوحة تحكم مأكولات الشام
        </h1>
        <label className="block">
          <span className="label">اسم المستخدم</span>
          <input
            autoFocus
            autoComplete="username"
            dir="ltr"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="label">كلمة المرور</span>
          <input
            type="password"
            autoComplete="current-password"
            dir="ltr"
            className="input"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
        </label>
        {err && <p className="text-sm text-[#B90D12] font-bold">{err}</p>}
        <button disabled={loading} className="btn btn-primary w-full cursor-pointer">
          {loading ? "…" : "دخول"}
        </button>
        <Link
          href="/"
          className="block text-center text-sm text-[#111111]/60 hover:text-[#B90D12] font-bold"
        >
          ← رجوع للموقع
        </Link>
      </form>
    </div>
  );
}
