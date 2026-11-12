"use client";

import { useEffect } from "react";

let lockCount = 0;
let prevHtmlOverflow = "";
let prevHtmlOverscroll = "";
let prevBodyOverflow = "";
let prevBodyOverscroll = "";
let prevBodyPaddingRight = "";
let cleanupListeners: (() => void) | null = null;

function attachScrollGuard() {
  let startX = 0;
  let startY = 0;

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  };

  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    const target = e.target as Element | null;
    const curX = e.touches[0].clientX;
    const curY = e.touches[0].clientY;
    const dx = curX - startX;
    const dy = curY - startY;

    // Allow horizontal interaction inside inputs or explicit horizontal strips
    if (Math.abs(dx) > Math.abs(dy) && target?.closest?.("input, textarea, [data-modal-x-scroll]")) {
      return;
    }

    const scrollEl = target?.closest?.("[data-modal-scroll]") as HTMLElement | null;
    if (!scrollEl) {
      if (e.cancelable) e.preventDefault();
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = scrollEl;
    const canScrollY = scrollHeight > clientHeight + 1;
    if (!canScrollY) {
      if (e.cancelable) e.preventDefault();
      return;
    }

    const pullingDownAtTop = scrollTop <= 0 && dy > 0;
    const pushingUpAtBottom = scrollTop + clientHeight >= scrollHeight - 1 && dy < 0;
    if (pullingDownAtTop || pushingUpAtBottom) {
      if (e.cancelable) e.preventDefault();
    }
  };

  const onWheel = (e: WheelEvent) => {
    const target = e.target as Element | null;
    const scrollEl = target?.closest?.("[data-modal-scroll]") as HTMLElement | null;
    if (!scrollEl) {
      if (e.cancelable) e.preventDefault();
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = scrollEl;
    const canScrollY = scrollHeight > clientHeight + 1;
    if (!canScrollY) {
      if (e.cancelable) e.preventDefault();
      return;
    }

    const wheelingUpAtTop = scrollTop <= 0 && e.deltaY < 0;
    const wheelingDownAtBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;
    if (wheelingUpAtTop || wheelingDownAtBottom) {
      if (e.cancelable) e.preventDefault();
    }
  };

  document.addEventListener("touchstart", onTouchStart, { passive: true });
  document.addEventListener("touchmove", onTouchMove, { passive: false });
  document.addEventListener("wheel", onWheel, { passive: false });

  return () => {
    document.removeEventListener("touchstart", onTouchStart);
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("wheel", onWheel);
  };
}

/**
 * Locks background page scroll completely across iOS Safari, Android Chrome,
 * and desktop browsers while allowing smooth scrolling inside `[data-modal-scroll]`.
 */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked || typeof document === "undefined") return;

    if (lockCount === 0) {
      const html = document.documentElement;
      const body = document.body;
      const scrollbarWidth = window.innerWidth - html.clientWidth;

      prevHtmlOverflow = html.style.overflow;
      prevHtmlOverscroll = html.style.overscrollBehavior;
      prevBodyOverflow = body.style.overflow;
      prevBodyOverscroll = body.style.overscrollBehavior;
      prevBodyPaddingRight = body.style.paddingRight;

      html.style.overflow = "hidden";
      html.style.overscrollBehavior = "none";
      body.style.overflow = "hidden";
      body.style.overscrollBehavior = "none";
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }

      cleanupListeners = attachScrollGuard();
    }

    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0 && typeof document !== "undefined") {
        const html = document.documentElement;
        const body = document.body;

        html.style.overflow = prevHtmlOverflow;
        html.style.overscrollBehavior = prevHtmlOverscroll;
        body.style.overflow = prevBodyOverflow;
        body.style.overscrollBehavior = prevBodyOverscroll;
        body.style.paddingRight = prevBodyPaddingRight;

        if (cleanupListeners) {
          cleanupListeners();
          cleanupListeners = null;
        }
      }
    };
  }, [locked]);
}
