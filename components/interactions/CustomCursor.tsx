"use client";

import { useEffect, useRef, useState } from "react";

const TRAIL_LENGTH = 12;

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Only enable on desktop devices with fine pointer (mouse), disable on touch/mobile
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    setEnabled(true);

    let mouseX = -100;
    let mouseY = -100;
    let rafId: number;

    const points: Array<{ x: number; y: number }> = Array.from(
      { length: TRAIL_LENGTH },
      () => ({ x: -100, y: -100 })
    );

    let isAnimating = false;
    let idleCounter = 0;

    const animate = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX - 8}px, ${mouseY - 8}px, 0) rotate(45deg)`;
      }

      // Shift trail points smoothly
      points.pop();
      points.unshift({ x: mouseX, y: mouseY });

      let maxDiffSq = 0;
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const el = trailRefs.current[i];
        if (el) {
          const pt = points[i];
          el.style.transform = `translate3d(${pt.x - 3}px, ${pt.y - 3}px, 0)`;
          const dx = pt.x - mouseX;
          const dy = pt.y - mouseY;
          const dsq = dx * dx + dy * dy;
          if (dsq > maxDiffSq) maxDiffSq = dsq;
        }
      }

      // If trail has caught up to mouse position (< 0.25px diff)
      if (maxDiffSq < 0.25) {
        idleCounter++;
        if (idleCounter > 3) {
          isAnimating = false;
          return; // Sleep RAF loop until next movement
        }
      } else {
        idleCounter = 0;
      }

      rafId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      idleCounter = 0;
      if (!isAnimating) {
        isAnimating = true;
        rafId = requestAnimationFrame(animate);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none z-[9999] overflow-hidden"
      aria-hidden="true"
    >
      {/* Trail Particles — rendered once, animated purely via GPU transform */}
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${Math.max(2, (i / TRAIL_LENGTH) * 6)}px`,
            height: `${Math.max(2, (i / TRAIL_LENGTH) * 6)}px`,
            background: `radial-gradient(circle, rgba(255, 94, 54, ${(i / TRAIL_LENGTH) * 0.4}) 0%, transparent 70%)`,
            borderRadius: "50%",
            pointerEvents: "none",
            willChange: "transform",
          }}
        />
      ))}

      {/* Main Cursor — Spaceship */}
      <div
        ref={cursorRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "16px",
          height: "16px",
          background: `
            conic-gradient(
              from 90deg at 50% 50%,
              #FF5E36 0deg,
              #C026D3 90deg,
              #FF5E36 180deg,
              #C026D3 270deg
            )
          `,
          borderRadius: "50%",
          boxShadow: `
            0 0 8px rgba(255, 94, 54, 0.5),
            0 0 16px rgba(192, 38, 211, 0.3),
            inset 0 0 4px rgba(255, 255, 255, 0.4)
          `,
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        {/* Center core */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "6px",
            height: "6px",
            background: "radial-gradient(circle, #ffffff 0%, #FF5E36 100%)",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </div>
  );
}