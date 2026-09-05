"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { WaspButton } from "@/components/ui/wasp-button";
import { soundFX } from "@/utils/soundFX";

export default function CyberChessPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("cyber_chess_popup_dismissed");
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        soundFX.playToggleSound();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    soundFX.playClick();
    sessionStorage.setItem("cyber_chess_popup_dismissed", "true");
    setIsOpen(false);
  };

  const handlePlay = () => {
    soundFX.playClick();
    sessionStorage.setItem("cyber_chess_popup_dismissed", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      data-cursor="chess"
      className="cyber-chess-popup"
      style={{
        position: "fixed",
        bottom: "clamp(16px, 3vw, 32px)",
        right: "clamp(12px, 3vw, 32px)",
        zIndex: 9990,
        maxWidth: "420px",
        width: "calc(100vw - clamp(24px, 6vw, 64px))",
        backgroundColor: "var(--bg-card, #070D19)",
        backdropFilter: "blur(18px)",
        border: "1.5px solid #20BEFF",
        borderRadius: "0px", // Sharp 0px borders
        padding: "clamp(16px, 3vw, 24px)",
        boxShadow: "0 0 30px rgba(32, 190, 255, 0.25), 0 20px 45px rgba(0,0,0,0.6)",
        color: "var(--text-primary, #ffffff)",
        fontFamily: "Inter, sans-serif",
        userSelect: "none",
      }}
    >
      {/* Sci-Fi Corner Brackets */}
      <div
        style={{
          position: "absolute",
          top: "4px",
          left: "4px",
          width: "8px",
          height: "8px",
          borderTop: "1.5px solid #20BEFF",
          borderLeft: "1.5px solid #20BEFF",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "4px",
          right: "4px",
          width: "8px",
          height: "8px",
          borderTop: "1.5px solid #20BEFF",
          borderRight: "1.5px solid #20BEFF",
          pointerEvents: "none",
        }}
      />

      {/* ── Top Sci-Fi Tag ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#10B981",
              boxShadow: "0 0 8px #10B981",
              display: "inline-block",
            }}
          />
          <span
            className="font-pixel"
            style={{
              fontSize: "11px",
              color: "#20BEFF",
              letterSpacing: "0.12em",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            // 05. AI CHESS ARENA
          </span>
        </div>

        <button
          onClick={handleDismiss}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "var(--text-muted, #9CA3AF)",
            fontSize: "16px",
            cursor: "pointer",
            padding: "2px 6px",
            lineHeight: 1,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#20BEFF")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted, #9CA3AF)")}
        >
          ✕
        </button>
      </div>

      {/* ── Title & Message ── */}
      <h3
        className="font-chakra"
        style={{
          fontSize: "1.35rem",
          fontWeight: 800,
          color: "var(--text-primary, #ffffff)",
          letterSpacing: "-0.01em",
          margin: "0 0 10px 0",
          lineHeight: 1.15,
          textTransform: "uppercase",
        }}
      >
        CHALLENGE JAYDEEP'S AI BOT ♟️
      </h3>

      <p
        style={{
          fontSize: "0.85rem",
          lineHeight: 1.6,
          color: "var(--text-secondary, #9CA3AF)",
          margin: "0 0 20px 0",
        }}
      >
        Test your strategy against <strong style={{ color: "#20BEFF" }}>4 AI Bot Difficulty Levels</strong> (Novice, Intermediate, Advanced &amp; Grandmaster AI) with real-time move analysis and sound FX!
      </p>

      {/* ── Action Buttons ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <WaspButton
          href="/chess"
          onClick={handlePlay}
          variant="light"
          paddingX={18}
          paddingY={8}
          fontSize={11}
          cutTopLeft={8}
          cutBottomRight={8}
        >
          PLAY CHESS ♟️
        </WaspButton>

        <WaspButton
          onClick={handleDismiss}
          variant="dark"
          paddingX={16}
          paddingY={8}
          fontSize={11}
          cutTopLeft={8}
          cutBottomRight={8}
        >
          DISMISS
        </WaspButton>
      </div>
    </div>
  );
}
