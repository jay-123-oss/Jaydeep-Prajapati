"use client";

import React, { useEffect, useState } from "react";

export default function CustomGlitchCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable =
          target.closest("a, button, input, select, textarea, [role='button'], .wasp-btn, [onClick]") !== null ||
          window.getComputedStyle(target).cursor === "pointer";
        setIsPointer(isClickable);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 99999,
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: "transform 0.04s linear",
      }}
    >
      {/* ── Sub-pixel Glitch Aura ── */}
      <div
        style={{
          position: "absolute",
          top: "-12px",
          left: "-12px",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          border: isPointer ? "1.5px solid #00F0FF" : "1px dashed rgba(255, 0, 127, 0.6)",
          backgroundColor: isPointer ? "rgba(0, 240, 255, 0.12)" : "transparent",
          boxShadow: isPointer
            ? "0 0 15px rgba(0, 240, 255, 0.6), 0 0 5px rgba(255, 0, 127, 0.6)"
            : "none",
          transform: isPointer ? "scale(1.4)" : "scale(1)",
          transition: "transform 0.15s ease, border-color 0.15s ease, background-color 0.15s ease",
        }}
      />
    </div>
  );
}
