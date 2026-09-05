"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  if (!mounted) {
    return (
      <button
        type="button"
        suppressHydrationWarning
        aria-label="Toggle theme"
        className="font-pixel"
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          clipPath:
            "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
          cursor: "pointer",
          fontSize: "11px",
          letterSpacing: "0.08em",
          outline: "none",
          userSelect: "none",
        }}
      >
        <span style={{ color: "#FBBF24", display: "inline-flex", fontSize: "13px" }}>☀</span>
        <span>LIGHT</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      suppressHydrationWarning
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="font-pixel"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 14px",
        backgroundColor: isDark
          ? "rgba(255, 255, 255, 0.06)"
          : "rgba(0, 0, 0, 0.05)",
        color: isDark ? "#ffffff" : "#0F172A",
        border: isDark
          ? "1px solid rgba(255, 255, 255, 0.18)"
          : "1px solid rgba(0, 0, 0, 0.15)",
        clipPath:
          "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
        cursor: "pointer",
        fontSize: "11px",
        letterSpacing: "0.08em",
        transition: "all 0.25s ease",
        outline: "none",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.borderColor = isDark
          ? "rgba(255, 255, 255, 0.45)"
          : "rgba(0, 0, 0, 0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = isDark
          ? "rgba(255, 255, 255, 0.18)"
          : "rgba(0, 0, 0, 0.15)";
      }}
    >
      {/* Icon */}
      {isDark ? (
        <span
          style={{
            color: "#FBBF24",
            display: "inline-flex",
            alignItems: "center",
            fontSize: "13px",
            filter: "drop-shadow(0 0 4px rgba(251, 191, 36, 0.6))",
          }}
        >
          ☀
        </span>
      ) : (
        <span
          style={{
            color: "#6366F1",
            display: "inline-flex",
            alignItems: "center",
            fontSize: "13px",
          }}
        >
          ☾
        </span>
      )}

      <span style={{ textTransform: "uppercase" }}>
        {isDark ? "LIGHT" : "DARK"}
      </span>
    </button>
  );
}
