"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { soundFX } from "@/utils/soundFX";

interface SectionMarker {
  id: string;
  label: string;
  tag: string;
}

const SECTIONS: SectionMarker[] = [
  { id: "hero-section", label: "HERO", tag: "01 // SYSTEM" },
  { id: "skills", label: "SKILLS", tag: "02 // TECH" },
  { id: "projects", label: "PROJECTS", tag: "03 // ARCH" },
  { id: "experience", label: "CAREER", tag: "04 // EXP" },
  { id: "social-showcase", label: "SOCIAL", tag: "05 // MATRIX" },
  { id: "contact", label: "CONTACT", tag: "06 // RAG" },
];

export default function HudScrollIndicator() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeSection, setActiveSection] = useState("hero-section");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - winHeight;
      const scrolled = window.scrollY;

      const pct = Math.min(100, Math.max(0, (scrolled / (docHeight || 1)) * 100));
      setScrollProgress(pct);

      // Check which section is in view
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= winHeight * 0.4) {
            setActiveSection(SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    soundFX.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="hidden lg:flex"
      style={{
        position: "fixed",
        right: "16px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 9000,
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "10px",
        pointerEvents: "auto",
        userSelect: "none",
      }}
    >
      {/* Mini Progress Percentage */}
      <div
        style={{
          fontSize: "9px",
          fontFamily: "monospace",
          fontWeight: 800,
          color: isDark ? "#20BEFF" : "#0284C7",
          backgroundColor: isDark ? "rgba(3, 7, 18, 0.85)" : "rgba(255, 255, 255, 0.9)",
          border: isDark ? "1px solid rgba(32, 190, 255, 0.4)" : "1px solid #CBD5E1",
          padding: "2px 5px",
          borderRadius: "2px",
          marginBottom: "4px",
          letterSpacing: "0.06em",
        }}
      >
        {Math.round(scrollProgress)}%
      </div>

      {/* Markers Column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          alignItems: "center",
          padding: "8px 4px",
          backgroundColor: isDark ? "rgba(3, 7, 18, 0.6)" : "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(8px)",
          border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #E2E8F0",
          borderRadius: "20px",
        }}
      >
        {SECTIONS.map((s) => {
          const isActive = activeSection === s.id;
          const isHovered = hoveredSection === s.id;

          return (
            <div
              key={s.id}
              style={{ position: "relative", display: "flex", alignItems: "center" }}
              onMouseEnter={() => setHoveredSection(s.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <div
                  style={{
                    position: "absolute",
                    right: "26px",
                    backgroundColor: isDark ? "rgba(3, 7, 18, 0.95)" : "#FFFFFF",
                    border: isDark ? "1px solid #20BEFF" : "1px solid #0284C7",
                    padding: "3px 8px",
                    borderRadius: "3px",
                    boxShadow: isDark ? "0 0 12px rgba(32, 190, 255, 0.4)" : "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "9px",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: isDark ? "#20BEFF" : "#0284C7",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    animation: "tagFadeIn 0.15s ease-out",
                  }}
                >
                  {s.tag} // {s.label}
                </div>
              )}

              {/* Marker Dot */}
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => scrollToSection(s.id)}
                style={{
                  width: isActive ? "8px" : "6px",
                  height: isActive ? "22px" : "6px",
                  borderRadius: isActive ? "4px" : "50%",
                  backgroundColor: isActive
                    ? isDark
                      ? "#20BEFF"
                      : "#0284C7"
                    : isDark
                    ? "rgba(255, 255, 255, 0.25)"
                    : "#CBD5E1",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: isActive
                    ? isDark
                      ? "0 0 10px #20BEFF"
                      : "0 0 8px rgba(2, 132, 199, 0.5)"
                    : "none",
                  transition: "all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
                  padding: 0,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
