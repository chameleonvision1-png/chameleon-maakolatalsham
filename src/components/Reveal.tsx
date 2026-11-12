"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "scale";
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "up",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -28px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const variantClass = variant === "scale" ? "reveal-scale" : "reveal-up";

  return (
    <div
      ref={ref}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal-base ${variantClass} ${visible ? "reveal-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function SectionPetalsMark() {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="5 2 250 200"
      fill="none"
      aria-hidden="true"
      className="w-5 h-4 sm:w-7 sm:h-5.5 md:w-8 md:h-6.5 -ms-1 sm:-ms-1.5 -translate-y-1 sm:-translate-y-1.5 shrink-0 overflow-visible drop-shadow-[0_2px_4px_rgba(0,38,140,0.16)]"
    >
      <defs>
        {/* 1:1 Traced Orange Droplet 3D Gradient */}
        <linearGradient id={`${uid}-orange`} x1="12" y1="130" x2="120" y2="195" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffc400" />
          <stop offset="55%" stopColor="#fd9002" />
          <stop offset="100%" stopColor="#d95800" />
        </linearGradient>

        {/* 1:1 Traced Red Droplet 3D Gradient */}
        <linearGradient id={`${uid}-red`} x1="38" y1="46" x2="128" y2="132" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff4747" />
          <stop offset="55%" stopColor="#f5181e" />
          <stop offset="100%" stopColor="#b50007" />
        </linearGradient>

        {/* 1:1 Traced Green Droplet 3D Gradient */}
        <linearGradient id={`${uid}-green`} x1="120" y1="6" x2="165" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3ce855" />
          <stop offset="55%" stopColor="#13b138" />
          <stop offset="100%" stopColor="#06751e" />
        </linearGradient>

        {/* 1:1 Traced Blue Droplet 3D Gradient */}
        <linearGradient id={`${uid}-blue`} x1="245" y1="64" x2="160" y2="145" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2ca6ff" />
          <stop offset="55%" stopColor="#0065fb" />
          <stop offset="100%" stopColor="#0032ad" />
        </linearGradient>
      </defs>

      {/* 1. Orange Droplet (Bottom-Left S-Curved Drop) */}
      <g
        className="alban-petal-anim"
        style={
          {
            transformOrigin: "130px 147px",
            "--petal-sway": "-3.2deg",
            animationDelay: "0s",
          } as CSSProperties
        }
      >
        <path
          d="M 130 147 C 106 130, 76 123, 46 126 C 18 130, 5 154, 8 176 C 11 196, 36 204, 60 193 C 82 183, 100 160, 130 147 Z"
          fill={`url(#${uid}-orange)`}
          stroke="#c95200"
          strokeWidth="2.5"
        />
        <path
          d="M 15 165 C 18 143, 38 131, 68 131 C 86 131, 104 136, 118 143 C 100 139, 78 136, 56 138 C 33 141, 19 151, 15 165 Z"
          fill="#ffe885"
          fillOpacity="0.88"
        />
      </g>

      {/* 2. Red Droplet (Upper-Left Drop) */}
      <g
        className="alban-petal-anim"
        style={
          {
            transformOrigin: "134px 136px",
            "--petal-sway": "-2.2deg",
            animationDelay: "0.3s",
          } as CSSProperties
        }
      >
        <path
          d="M 134 136 C 122 102, 104 62, 76 47 C 50 38, 29 54, 33 77 C 37 100, 68 109, 98 118 C 112 122, 124 129, 134 136 Z"
          fill={`url(#${uid}-red)`}
          stroke="#a80005"
          strokeWidth="2.5"
        />
        <path
          d="M 45 54 C 59 45, 79 50, 96 67 C 109 80, 118 98, 125 116 C 114 98, 101 81, 86 68 C 71 56, 55 52, 45 54 Z"
          fill="#ff9e9e"
          fillOpacity="0.85"
        />
      </g>

      {/* 3. Green Droplet (Top-Center Tallest Drop) */}
      <g
        className="alban-petal-anim"
        style={
          {
            transformOrigin: "146px 132px",
            "--petal-sway": "2.2deg",
            animationDelay: "0.6s",
          } as CSSProperties
        }
      >
        <path
          d="M 146 132 C 134 98, 113 58, 113 36 C 113 14, 128 3, 145 4 C 163 5, 175 20, 173 45 C 171 72, 159 102, 146 132 Z"
          fill={`url(#${uid}-green)`}
          stroke="#056b1b"
          strokeWidth="2.5"
        />
        <path
          d="M 134 10 C 150 5, 165 16, 167 39 C 169 57, 162 82, 153 108 C 159 82, 162 56, 159 38 C 156 20, 145 12, 134 10 Z"
          fill="#9ef7ab"
          fillOpacity="0.88"
        />
      </g>

      {/* 4. Blue Droplet (Right Drop) */}
      <g
        className="alban-petal-anim"
        style={
          {
            transformOrigin: "155px 147px",
            "--petal-sway": "3.2deg",
            animationDelay: "0.9s",
          } as CSSProperties
        }
      >
        <path
          d="M 155 147 C 169 116, 188 76, 212 64 C 235 55, 255 70, 252 94 C 249 118, 224 136, 192 143 C 178 146, 165 147, 155 147 Z"
          fill={`url(#${uid}-blue)`}
          stroke="#002b99"
          strokeWidth="2.5"
        />
        <path
          d="M 213 69 C 232 62, 247 73, 246 92 C 245 109, 227 124, 202 133 C 222 122, 236 108, 238 91 C 239 77, 227 68, 213 69 Z"
          fill="#8fd0ff"
          fillOpacity="0.88"
        />
      </g>
    </svg>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  actionLabel?: string;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  actionLabel,
}: SectionHeaderProps) {
  return (
    <Reveal className="mb-4 sm:mb-6">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <h2 className="section-title whitespace-nowrap inline-flex items-start min-w-0">
          <span>{title}</span>
          <SectionPetalsMark />
        </h2>
        {href && actionLabel && (
          <Link
            href={href}
            className="group shrink-0 inline-flex items-center gap-1 sm:gap-2 rounded-full bg-white border border-brand/15 hover:border-brand hover:bg-brand text-brand hover:text-white ps-2.5 sm:ps-4 pe-1 sm:pe-1.5 py-1 sm:py-1.5 text-[11px] sm:text-sm font-extrabold shadow-xs hover:shadow-md active:scale-95 transition-all duration-300"
          >
            <span>{actionLabel}</span>
            <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-brand-50 group-hover:bg-white/20 text-brand group-hover:text-white grid place-items-center transition-transform duration-300 group-hover:-translate-x-0.5">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3 h-3 sm:w-3.5 sm:h-3.5"
              >
                <path d="M12 15L7 10L12 5" />
                <path d="M7.5 10H15" />
              </svg>
            </span>
          </Link>
        )}
      </div>
      {subtitle && (
        <p className="text-ink/60 text-xs sm:text-base mt-1 sm:mt-1.5 leading-relaxed">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
