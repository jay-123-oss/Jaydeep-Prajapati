"use client";

import React, { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { soundFX } from "@/utils/soundFX";

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [copied, setCopied] = useState(false);
  const [liveFps, setLiveFps] = useState(120);
  const [terminalIndex, setTerminalIndex] = useState(0);

  const TERMINAL_LOGS = [
    "jetson_nano --tensorrt_fp16: ACTIVE [120 FPS]",
    "yolov8_stream: 0 DROPPED FRAMES · IOU 0.89",
    "edge_pipeline: CUDA KERNELS COMPLIANT",
    "zero_trust_mesh: TLS 1.3 QUANTUM ENCRYPTED",
    "inference_latency: 11.8ms MEAN · 99.9th 14.2ms",
  ];

  // Rotate terminal logs
  useEffect(() => {
    const logInterval = setInterval(() => {
      setTerminalIndex((prev) => (prev + 1) % TERMINAL_LOGS.length);
      setLiveFps(118 + Math.floor(Math.random() * 6));
    }, 2600);
    return () => clearInterval(logInterval);
  }, []);

  const scrollToTop = () => {
    soundFX.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copyEmail = () => {
    soundFX.playClick();
    navigator.clipboard.writeText("jaydeep.connect@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <footer
      style={{
        width: "100%",
        minHeight: "8cm",
        height: "auto",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderTop: isDark
          ? "1.5px solid rgba(32, 190, 255, 0.45)"
          : "1.5px solid rgba(2, 132, 199, 0.35)",
        backgroundColor: isDark ? "#02040A" : "#F8FAFC",
        color: "var(--text-primary)",
        userSelect: "none",
        zIndex: 30,
        boxShadow: isDark
          ? "0 -10px 50px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(32, 190, 255, 0.2)"
          : "0 -10px 35px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(2, 132, 199, 0.2)",
      }}
    >
      {/* ── TOP NEON ENERGY BEAM (Animated running glow) ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          zIndex: 15,
          backgroundImage: isDark
            ? "linear-gradient(90deg, transparent 0%, #20BEFF 25%, #A855F7 50%, #10B981 75%, transparent 100%)"
            : "linear-gradient(90deg, transparent 0%, #0284C7 25%, #7C3AED 50%, #059669 75%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "cyberBeam 4s linear infinite",
        }}
      />

      <style jsx>{`
        @keyframes cyberBeam {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
        @keyframes soundBarPulse {
          0%,
          100% {
            transform: scaleY(0.25);
          }
          50% {
            transform: scaleY(1);
          }
        }
        @keyframes beaconPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
      `}</style>

      {/* ── BACKGROUND VIDEO (math.mp4) - 100% CRYSTAL CLEAR & VIVID IN BOTH MODES ── */}
      <video
        src="/math.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
          opacity: 1, // 100% crisp visibility
          filter: isDark
            ? "contrast(1.08) brightness(0.92)"
            : "invert(1) contrast(1.18) brightness(0.96)",
          pointerEvents: "none",
        }}
      />

      {/* ── ULTRA-LIGHT VIGNETTE (Does not wash out or blur video formulas) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background: isDark
            ? "radial-gradient(ellipse at center, rgba(3,7,18,0.2) 0%, rgba(2,4,10,0.7) 100%)"
            : "radial-gradient(ellipse at center, rgba(255,255,255,0.02) 0%, rgba(226,232,240,0.22) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── MAIN CONTENT CONTAINER (Fits comfortably inside 8cm) ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "1480px",
          margin: "0 auto",
          padding: "16px clamp(12px, 3vw, 28px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          gap: "14px",
        }}
      >
        {/* ── TOP TIER: 3 Creative Cyber Glass Cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))",
            gap: "18px",
            alignItems: "stretch",
          }}
        >
          {/* ── CARD 1: Identity & Real-Time AI Hardware Telemetry ── */}
          <div
            style={{
              backgroundColor: isDark ? "rgba(5, 8, 22, 0.72)" : "rgba(255, 255, 255, 0.58)",
              backdropFilter: isDark ? "blur(10px)" : "blur(5px)",
              WebkitBackdropFilter: isDark ? "blur(10px)" : "blur(5px)",
              borderRadius: "14px",
              padding: "16px 20px",
              border: isDark
                ? "1px solid rgba(32, 190, 255, 0.35)"
                : "1px solid rgba(2, 132, 199, 0.28)",
              boxShadow: isDark
                ? "0 8px 30px rgba(0,0,0,0.6), inset 0 0 25px rgba(32, 190, 255, 0.06)"
                : "0 8px 25px rgba(0,0,0,0.08), inset 0 0 20px rgba(2, 132, 199, 0.05)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <div>
              {/* Header Title + Pulse Beacon */}
              <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                <span
                  style={{
                    width: "9px",
                    height: "9px",
                    borderRadius: "50%",
                    backgroundColor: "#10B981",
                    animation: "beaconPulse 2s infinite",
                    display: "inline-block",
                  }}
                />
                <span
                  className="font-pixel"
                  style={{
                    fontSize: "15.5px",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    color: isDark ? "#FFFFFF" : "#0F172A",
                  }}
                >
                  ER. JAYDEEP PRAJAPATI
                </span>
                <span
                  style={{
                    fontSize: "9.5px",
                    backgroundColor: isDark ? "rgba(32, 190, 255, 0.2)" : "#E0F2FE",
                    color: isDark ? "#20BEFF" : "#0284C7",
                    border: isDark ? "1px solid rgba(32, 190, 255, 0.4)" : "1px solid #BAE6FD",
                    borderRadius: "4px",
                    padding: "2px 7px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                  }}
                >
                  AI ARCHITECT
                </span>
              </div>

              {/* Subtitle */}
              <div
                style={{
                  fontSize: "11.5px",
                  color: isDark ? "#94A3B8" : "#475569",
                  fontWeight: 500,
                  marginTop: "4px",
                }}
              >
                Autonomous Systems · TensorRT Optimization · Edge Intelligence
              </div>
            </div>

            {/* Live Terminal HUD Box */}
            <div
              style={{
                backgroundColor: isDark ? "rgba(2, 4, 12, 0.85)" : "rgba(241, 245, 249, 0.85)",
                border: isDark ? "1px solid rgba(32, 190, 255, 0.22)" : "1px solid #CBD5E1",
                borderRadius: "8px",
                padding: "6px 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontFamily: "monospace",
                fontSize: "11px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden" }}>
                <span style={{ color: "#10B981", fontWeight: 800 }}>$</span>
                <span
                  style={{
                    color: isDark ? "#38BDF8" : "#0369A1",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {TERMINAL_LOGS[terminalIndex]}
                </span>
                <span style={{ color: "#20BEFF", animation: "beaconPulse 1s infinite" }}>_</span>
              </div>
              <span
                style={{
                  fontSize: "9.5px",
                  color: "#10B981",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  padding: "1px 5px",
                  borderRadius: "3px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {liveFps} FPS
              </span>
            </div>
          </div>

          {/* ── CARD 2: Interactive System Index & 1-Click Connect ── */}
          <div
            style={{
              backgroundColor: isDark ? "rgba(5, 8, 22, 0.72)" : "rgba(255, 255, 255, 0.58)",
              backdropFilter: isDark ? "blur(10px)" : "blur(5px)",
              WebkitBackdropFilter: isDark ? "blur(10px)" : "blur(5px)",
              borderRadius: "14px",
              padding: "16px 20px",
              border: isDark
                ? "1px solid rgba(32, 190, 255, 0.35)"
                : "1px solid rgba(2, 132, 199, 0.28)",
              boxShadow: isDark
                ? "0 8px 30px rgba(0,0,0,0.6), inset 0 0 25px rgba(32, 190, 255, 0.06)"
                : "0 8px 25px rgba(0,0,0,0.08), inset 0 0 20px rgba(2, 132, 199, 0.05)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                className="font-pixel"
                style={{
                  fontSize: "11px",
                  color: isDark ? "#20BEFF" : "#0284C7",
                  letterSpacing: "0.12em",
                  fontWeight: 700,
                }}
              >
                // SYSTEM DIRECTORY
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: "#10B981",
                  fontFamily: "monospace",
                  fontWeight: 600,
                }}
              >
                ● 3 CHANNELS ONLINE
              </span>
            </div>

            {/* Quick Links with sound on hover */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {[
                { label: "Skills Matrix", href: "#skills" },
                { label: "Flagship Projects", href: "#projects" },
                { label: "Live Socials", href: "#social-showcase" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onMouseEnter={() => soundFX.playHover()}
                  style={{
                    fontSize: "12px",
                    color: isDark ? "#E2E8F0" : "#1E293B",
                    textDecoration: "none",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.15s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = isDark ? "#20BEFF" : "#0284C7";
                    e.currentTarget.style.transform = "translateY(-1.5px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = isDark ? "#E2E8F0" : "#1E293B";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span style={{ color: isDark ? "#20BEFF" : "#0284C7", fontSize: "14px" }}>›</span>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>

            {/* 1-Click Copy Email Button */}
            <button
              type="button"
              suppressHydrationWarning
              onClick={copyEmail}
              onMouseEnter={() => soundFX.playHover()}
              style={{
                width: "100%",
                padding: "6px 12px",
                borderRadius: "8px",
                border: copied
                  ? "1px solid #10B981"
                  : isDark
                  ? "1px solid rgba(32, 190, 255, 0.3)"
                  : "1px solid #CBD5E1",
                backgroundColor: copied
                  ? "rgba(16, 185, 129, 0.15)"
                  : isDark
                  ? "rgba(32, 190, 255, 0.08)"
                  : "rgba(2, 132, 199, 0.06)",
                color: copied ? "#10B981" : isDark ? "#38BDF8" : "#0284C7",
                fontSize: "11px",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: "0.04em",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <span>{copied ? "COPIED TO CLIPBOARD! ✓" : "✉ jaydeep.connect@gmail.com"}</span>
              <span style={{ fontSize: "10px", opacity: 0.8 }}>
                {copied ? "SUCCESS" : "CLICK TO COPY"}
              </span>
            </button>
          </div>

          {/* ── CARD 3: Social Matrix, Frequency Equalizer & Controls ── */}
          <div
            style={{
              backgroundColor: isDark ? "rgba(5, 8, 22, 0.72)" : "rgba(255, 255, 255, 0.58)",
              backdropFilter: isDark ? "blur(10px)" : "blur(5px)",
              WebkitBackdropFilter: isDark ? "blur(10px)" : "blur(5px)",
              borderRadius: "14px",
              padding: "16px 20px",
              border: isDark
                ? "1px solid rgba(32, 190, 255, 0.35)"
                : "1px solid rgba(2, 132, 199, 0.28)",
              boxShadow: isDark
                ? "0 8px 30px rgba(0,0,0,0.6), inset 0 0 25px rgba(32, 190, 255, 0.06)"
                : "0 8px 25px rgba(0,0,0,0.08), inset 0 0 20px rgba(2, 132, 199, 0.05)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            {/* Top row: Section Title + Equalizer Visualizer */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                className="font-pixel"
                style={{
                  fontSize: "11px",
                  color: isDark ? "#20BEFF" : "#0284C7",
                  letterSpacing: "0.12em",
                  fontWeight: 700,
                }}
              >
                // SIGNAL RADAR
              </span>

              {/* 8-Bar Dynamic Frequency Equalizer */}
              <div style={{ display: "flex", alignItems: "center", gap: "2.5px", height: "14px" }}>
                {[0.6, 1.0, 0.4, 0.8, 0.3, 0.9, 0.5, 0.7].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      width: "3px",
                      height: "100%",
                      backgroundColor: isDark ? "#20BEFF" : "#0284C7",
                      borderRadius: "1.5px",
                      transformOrigin: "bottom",
                      animation: `soundBarPulse 0.9s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.12}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Social Icons with glowing hover & sound */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {[
                {
                  name: "GitHub",
                  url: "https://github.com/jay-123-oss",
                  svg: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  ),
                },
                {
                  name: "LinkedIn",
                  url: "https://www.linkedin.com/in/jaydeep-prajapati-a97988358/",
                  svg: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  ),
                },
                {
                  name: "Instagram",
                  url: "https://www.instagram.com/jaydeep.prajapati_18/",
                  svg: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  ),
                },
                {
                  name: "Kaggle",
                  url: "https://www.kaggle.com/jaydeepprajapatik",
                  svg: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.825 23.859c-.022.01-.053.023-.083.023a.475.475 0 0 1-.303-.112l-7.247-6.843-2.614 2.455v4.062a.497.497 0 0 1-.497.496H5.328a.497.497 0 0 1-.496-.496V.56a.497.497 0 0 1 .496-.496h2.753c.274 0 .497.222.497.496v14.152l8.832-8.529a.575.575 0 0 1 .387-.152c.119 0 .237.038.337.112l2.368 1.834a.488.488 0 0 1 .054.721l-7.467 7.21 8.358 8.01a.488.488 0 0 1-.02.741l-2.643 1.944z" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  onMouseEnter={() => soundFX.playHover()}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.06)",
                    border: isDark
                      ? "1px solid rgba(255, 255, 255, 0.18)"
                      : "1px solid rgba(0, 0, 0, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isDark ? "#FFFFFF" : "#0F172A",
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px) scale(1.08)";
                    e.currentTarget.style.borderColor = isDark ? "#20BEFF" : "#0284C7";
                    e.currentTarget.style.backgroundColor = isDark
                      ? "rgba(32, 190, 255, 0.25)"
                      : "#E0F2FE";
                    e.currentTarget.style.boxShadow = isDark
                      ? "0 4px 15px rgba(32, 190, 255, 0.4)"
                      : "0 4px 15px rgba(2, 132, 199, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.borderColor = isDark
                      ? "rgba(255, 255, 255, 0.18)"
                      : "rgba(0, 0, 0, 0.12)";
                    e.currentTarget.style.backgroundColor = isDark
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.06)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {s.svg}
                </a>
              ))}
            </div>

            {/* Controls: Theme Switch & Futuristic Top Ascend */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <ThemeToggle />

              <button
                type="button"
                suppressHydrationWarning
                onClick={scrollToTop}
                onMouseEnter={() => soundFX.playHover()}
                className="font-pixel"
                style={{
                  backgroundColor: isDark
                    ? "rgba(32, 190, 255, 0.18)"
                    : "rgba(2, 132, 199, 0.14)",
                  border: isDark
                    ? "1.5px solid rgba(32, 190, 255, 0.55)"
                    : "1.5px solid rgba(2, 132, 199, 0.45)",
                  color: isDark ? "#20BEFF" : "#0284C7",
                  padding: "7px 16px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: isDark
                    ? "0 0 15px rgba(32, 190, 255, 0.25)"
                    : "0 0 12px rgba(2, 132, 199, 0.15)",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = isDark
                    ? "rgba(32, 190, 255, 0.35)"
                    : "rgba(2, 132, 199, 0.25)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = isDark
                    ? "0 0 25px rgba(32, 190, 255, 0.6)"
                    : "0 0 20px rgba(2, 132, 199, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = isDark
                    ? "rgba(32, 190, 255, 0.18)"
                    : "rgba(2, 132, 199, 0.14)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = isDark
                    ? "0 0 15px rgba(32, 190, 255, 0.25)"
                    : "0 0 12px rgba(2, 132, 199, 0.15)";
                }}
              >
                <span>▲</span>
                <span>ASCEND_TOP</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── BOTTOM TIER: High-Tech Telemetry Legal Bar ── */}
        <div
          style={{
            backgroundColor: isDark ? "rgba(5, 8, 22, 0.7)" : "rgba(255, 255, 255, 0.55)",
            backdropFilter: isDark ? "blur(8px)" : "blur(4px)",
            WebkitBackdropFilter: isDark ? "blur(8px)" : "blur(4px)",
            borderRadius: "10px",
            padding: "8px 20px",
            border: isDark
              ? "1px solid rgba(255, 255, 255, 0.14)"
              : "1px solid rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
            fontSize: "11px",
            color: isDark ? "#94A3B8" : "#475569",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: 600, color: isDark ? "#E2E8F0" : "#1E293B" }}>
              © {new Date().getFullYear()} Er. Jaydeep Prajapati
            </span>
            <span>·</span>
            <span>All rights reserved</span>
            <span>·</span>
            <span style={{ color: "#10B981" }}>GLOBAL NODE: ASIA-SOUTH-1</span>
          </div>

          <div
            style={{
              fontFamily: "monospace",
              letterSpacing: "0.06em",
              color: isDark ? "#38BDF8" : "#0284C7",
              fontWeight: 700,
            }}
          >
            PORTFOLIO // V3.0_PRODUCTION · NEXT.JS 16 &amp; TURBOPACK
          </div>
        </div>
      </div>
    </footer>
  );
}
