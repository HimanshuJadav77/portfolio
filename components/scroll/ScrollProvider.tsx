"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";
import Lenis from "lenis";

interface ScrollContextProps {
  scrollY: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  scrollDirection: MotionValue<number>;
}

const ScrollContext = createContext<ScrollContextProps | null>(null);

export function useScrollContext() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScrollContext must be used within ScrollProvider");
  return ctx;
}

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const scrollY = useMotionValue<number>(0);
  const scrollProgress = useMotionValue<number>(0);
  const scrollDirection = useMotionValue<number>(0);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;

    if (isTouch) {
      // Mobile / Tablet: 100% native momentum scrolling, zero JS touch interference & zero idle CPU
      let lastScrollY = window.scrollY;
      const onNativeScroll = () => {
        const y = window.scrollY;
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        scrollY.set(y);
        scrollProgress.set(Math.min(1, Math.max(0, y / maxScroll)));
        scrollDirection.set(y >= lastScrollY ? 1 : -1);
        lastScrollY = y;
      };

      window.addEventListener("scroll", onNativeScroll, { passive: true });
      onNativeScroll();

      return () => {
        window.removeEventListener("scroll", onNativeScroll);
      };
    }

    // Desktop: Smooth Lenis wheel scrolling
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1.0,
      touchMultiplier: 0,
      syncTouch: false,
      infinite: false,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", (e: any) => {
      scrollY.set(e.scroll);
      scrollProgress.set(e.progress);
      scrollDirection.set(e.direction);
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const handlePref = (e: MediaQueryListEvent) => {
      if (e.matches) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };
    media.addEventListener("change", handlePref);

    return () => {
      cancelAnimationFrame(rafId);
      media.removeEventListener("change", handlePref);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [scrollY, scrollProgress, scrollDirection]);

  return (
    <ScrollContext.Provider value={{ scrollY, scrollProgress, scrollDirection }}>
      {children}
    </ScrollContext.Provider>
  );
}
