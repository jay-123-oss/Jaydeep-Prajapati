"use client";

import React, { useEffect, useState } from "react";
import { soundFX } from "@/utils/soundFX";

export default function AudioToggle() {
  const [isMuted, setIsMuted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMuted(soundFX.getMuted());
  }, []);

  const handleToggle = () => {
    const nextMuted = soundFX.toggleMute();
    setIsMuted(nextMuted);
  };

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={handleToggle}
      onMouseEnter={() => soundFX.playHover()}
      title={isMuted ? "Enable Sci-Fi Sound FX" : "Mute Sound FX"}
      suppressHydrationWarning
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        backgroundColor: "rgba(128, 128, 128, 0.08)",
        border: isMuted ? "1.5px solid var(--border-subtle)" : "1.5px solid #10B981",
        color: isMuted ? "var(--text-muted)" : "#10B981",
        boxShadow: isMuted ? "none" : "0 0 10px rgba(16, 185, 129, 0.35)",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      {isMuted ? (
        // Muted Speaker Icon
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        // Active Sound Speaker Icon with Wave
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
}
