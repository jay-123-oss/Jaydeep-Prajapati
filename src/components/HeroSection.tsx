"use client";

import React, { useEffect, useRef, useState } from "react";
import { WaspButton } from "@/components/ui/wasp-button";
import { useTheme } from "@/context/ThemeContext";
import HeroNeuralCanvas from "@/components/HeroNeuralCanvas";
import { soundFX } from "@/utils/soundFX";

export default function HeroSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [videoSrcError, setVideoSrcError] = useState(false);

  // Dynamic portfolio config
  const [config, setConfig] = useState({
    headline: "AI/ML SYSTEMS & COMPUTER VISION",
    subheadline:
      "B.Tech CSE student & AI developer. Engineering local-first spatial vision (Trinetra), autonomous LangGraph agent pipelines, and high-performance full-stack web applications.",
    cta_text: "EXPLORE PROJECTS",
    cta_link: "#projects",
    stat1_value: "OFFLINE",
    stat1_label: "LOCAL VISION PERCEPTION",
    stat2_value: "< 28ms",
    stat2_label: "ON-DEVICE YOLO INFERENCE",
    video_opacity_dark: 1.0,
    video_opacity_light: 0.9,
  });

  const [showTuner, setShowTuner] = useState(false);
  const [tunerOpacity, setTunerOpacity] = useState<number>(1.0);

  // Fetch dynamic config on mount
  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => {
        if (data.config) {
          setConfig(data.config);
          setTunerOpacity(
            isDark
              ? parseFloat(data.config.video_opacity_dark ?? 1.0)
              : parseFloat(data.config.video_opacity_light ?? 0.9)
          );
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setTunerOpacity(
      isDark
        ? parseFloat(String(config.video_opacity_dark ?? 1.0))
        : parseFloat(String(config.video_opacity_light ?? 1.0))
    );
  }, [isDark, config]);

  useEffect(() => {
    setVideoSrcError(false);
    if (desktopVideoRef.current) {
      desktopVideoRef.current.load();
      desktopVideoRef.current.play().catch(() => {});
    }
    if (mobileVideoRef.current) {
      mobileVideoRef.current.load();
      mobileVideoRef.current.play().catch(() => {});
    }
  }, [theme]);

  // Video sources
  const desktopSrc =
    !isDark && !videoSrcError ? "/light.mp4" : "/desktop.mp4";
  const mobileSrc =
    !isDark && !videoSrcError ? "/light.mp4" : "/bcck.mp4";

  const currentOpacity = tunerOpacity;

  return (
    <section
      id="hero-section"
      style={{
        width: "100%",
        height: "100vh",
        minHeight: "640px",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* ── FULL-SCREEN BACKGROUND VIDEO LAYER ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {/* Desktop Video (>= 768px) */}
        <video
          key={`desktop-${theme}-${desktopSrc}`}
          ref={desktopVideoRef}
          className="hidden md:block"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: currentOpacity,
            filter: "none",
            transition: "opacity 0.2s ease",
          }}
          src={desktopSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => {
            if (!isDark) setVideoSrcError(true);
          }}
        />

        {/* Mobile Video (< 768px) */}
        <video
          key={`mobile-${theme}-${mobileSrc}`}
          ref={mobileVideoRef}
          className="block md:hidden"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: currentOpacity,
            filter: "none",
            transition: "opacity 0.2s ease",
          }}
          src={mobileSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => {
            if (!isDark) setVideoSrcError(true);
          }}
        />

        {/* Dynamic Dark / Light Contrast Film Overlays */}
        {isDark ? (
          <>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.1) 100%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 40%, rgba(0,0,0,0.4) 100%)",
                pointerEvents: "none",
              }}
            />
          </>
        ) : (
          <>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, rgba(248, 250, 252, 0.45) 0%, rgba(248, 250, 252, 0.15) 35%, transparent 65%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(248, 250, 252, 0.25) 0%, transparent 20%, transparent 85%, rgba(248, 250, 252, 0.15) 100%)",
                pointerEvents: "none",
              }}
            />
          </>
        )}

        {/* Interactive Neural Constellation Particle Canvas */}
        <HeroNeuralCanvas />
      </div>

      {/* ── MAIN HERO BODY (Left-aligned Layout) ── */}
      <main
        style={{
          position: "relative",
          zIndex: 20,
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: "clamp(85px, 12vh, 120px) clamp(16px, 4vw, 56px) clamp(24px, 4vh, 40px)",
          maxWidth: "1480px",
          width: "100%",
          margin: "0 auto",
          minHeight: 0,
        }}
      >
        <div style={{ maxWidth: "620px", width: "100%" }}>
          {/* Main Headline */}
          <h1
            className="font-chakra"
            style={{
              fontWeight: 700,
              color: "var(--text-primary)",
              fontSize: "clamp(2.6rem, 5.2vw, 4.2rem)",
              letterSpacing: "-0.02em",
              lineHeight: 0.94,
              textTransform: "uppercase",
              margin: "0 0 18px 0",
              textShadow: isDark
                ? "0 4px 24px rgba(0,0,0,0.8)"
                : "0 2px 10px rgba(255,255,255,0.8)",
            }}
          >
            {config.headline || "MACHINE LEARNING & AI SYSTEMS"}
          </h1>

          {/* Descriptive Subtitle */}
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
              lineHeight: 1.5,
              fontWeight: 400,
              margin: "0 0 32px 0",
              maxWidth: "520px",
              textShadow: isDark
                ? "0 2px 10px rgba(0,0,0,0.9)"
                : "0 1px 4px rgba(255,255,255,0.6)",
            }}
          >
            {config.subheadline ||
              "Architecting high-throughput neural models, autonomous LLM pipelines, and ultra-low-latency distributed inference engines."}
          </p>

          {/* Primary Action Buttons: EXPLORE MODELS + RESUME */}
          <div style={{ marginBottom: "16px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <WaspButton href={config.cta_link || "#skills"} variant={isDark ? "dark" : "light"}>
              {config.cta_text || "EXPLORE MODELS"}
            </WaspButton>

            <a
              href="/Jaydeep_Prajapati_Resume_Strict1Page.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-pixel"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                backgroundColor: isDark ? "rgba(32, 190, 255, 0.12)" : "#E0F2FE",
                border: isDark ? "1.5px solid #20BEFF" : "1.5px solid #0284C7",
                color: isDark ? "#38BDF8" : "#0369A1",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textDecoration: "none",
                textTransform: "uppercase",
                boxShadow: isDark ? "0 0 16px rgba(32, 190, 255, 0.25)" : "0 2px 10px rgba(2, 132, 199, 0.15)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? "#20BEFF" : "#0284C7";
                e.currentTarget.style.color = isDark ? "#000000" : "#FFFFFF";
                e.currentTarget.style.boxShadow = "0 0 24px rgba(32, 190, 255, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? "rgba(32, 190, 255, 0.12)" : "#E0F2FE";
                e.currentTarget.style.color = isDark ? "#38BDF8" : "#0369A1";
                e.currentTarget.style.boxShadow = isDark ? "0 0 16px rgba(32, 190, 255, 0.25)" : "0 2px 10px rgba(2, 132, 199, 0.15)";
              }}
            >
              <span>📄 VIEW RESUME / CV</span>
              <span>↗</span>
            </a>

            {/* 3D Cyber ID Badge Trigger */}
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                window.dispatchEvent(new CustomEvent("open-cyber-id"));
              }}
              className="font-pixel"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                backgroundColor: isDark ? "rgba(168, 85, 247, 0.12)" : "#F3E8FF",
                border: isDark ? "1.5px solid #A855F7" : "1.5px solid #9333EA",
                color: isDark ? "#C084FC" : "#7E22CE",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.1em",
                cursor: "pointer",
                textTransform: "uppercase",
                boxShadow: isDark ? "0 0 16px rgba(168, 85, 247, 0.25)" : "0 2px 10px rgba(147, 51, 234, 0.15)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? "#A855F7" : "#9333EA";
                e.currentTarget.style.color = isDark ? "#000000" : "#FFFFFF";
                e.currentTarget.style.boxShadow = "0 0 24px rgba(168, 85, 247, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? "rgba(168, 85, 247, 0.12)" : "#F3E8FF";
                e.currentTarget.style.color = isDark ? "#C084FC" : "#7E22CE";
                e.currentTarget.style.boxShadow = isDark ? "0 0 16px rgba(168, 85, 247, 0.25)" : "0 2px 10px rgba(147, 51, 234, 0.15)";
              }}
            >
              <span>💳</span>
              <span>SECURITY BADGE</span>
            </button>

            {/* Neural Vision Cam Trigger */}
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                window.dispatchEvent(new CustomEvent("open-neural-vision"));
              }}
              className="font-pixel"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                backgroundColor: isDark ? "rgba(16, 185, 129, 0.12)" : "#ECFDF5",
                border: isDark ? "1.5px solid #10B981" : "1.5px solid #059669",
                color: isDark ? "#34D399" : "#047857",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.1em",
                cursor: "pointer",
                textTransform: "uppercase",
                boxShadow: isDark ? "0 0 16px rgba(16, 185, 129, 0.25)" : "0 2px 10px rgba(5, 150, 105, 0.15)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? "#10B981" : "#059669";
                e.currentTarget.style.color = isDark ? "#000000" : "#FFFFFF";
                e.currentTarget.style.boxShadow = "0 0 24px rgba(16, 185, 129, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? "rgba(16, 185, 129, 0.12)" : "#ECFDF5";
                e.currentTarget.style.color = isDark ? "#34D399" : "#047857";
                e.currentTarget.style.boxShadow = isDark ? "0 0 16px rgba(16, 185, 129, 0.25)" : "0 2px 10px rgba(5, 150, 105, 0.15)";
              }}
            >
              <span>👁️</span>
              <span>NEURAL CAM</span>
            </button>
          </div>
        </div>
      </main>

      {/* ── BOTTOM HUD STATS & QUICK OPACITY TUNER ── */}
      <footer
        style={{
          position: "relative",
          zIndex: 20,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "18px",
          padding: "0 clamp(16px, 4vw, 56px) clamp(20px, 3vh, 40px)",
          maxWidth: "1480px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* Telemetry Stats Group */}
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px, 3.5vw, 48px)", flexWrap: "wrap" }}>
          {/* Stat 1 */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              style={{
                color: isDark ? "rgba(255,255,255,0.85)" : "#0F172A",
                flexShrink: 0,
              }}
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <div>
              <div
                className="font-chakra"
                style={{
                  fontWeight: 700,
                  fontSize: "clamp(1.4rem, 2.2vw, 1.85rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                  color: "var(--text-primary)",
                }}
              >
                {config.stat1_value || "25M+"}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginTop: "4px",
                }}
              >
                {config.stat1_label || "DAILY INFERENCES"}
              </div>
            </div>
          </div>

          {/* Thin Vertical Separator */}
          <div
            style={{
              width: "1px",
              height: "36px",
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.15)"
                : "rgba(0, 0, 0, 0.15)",
            }}
          />

          {/* Stat 2 */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              style={{
                color: isDark ? "rgba(255,255,255,0.85)" : "#0F172A",
                flexShrink: 0,
              }}
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <div>
              <div
                className="font-chakra"
                style={{
                  fontWeight: 700,
                  fontSize: "clamp(1.4rem, 2.2vw, 1.85rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                  color: "var(--text-primary)",
                }}
              >
                {config.stat2_value || "< 38ms"}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginTop: "4px",
                }}
              >
                {config.stat2_label || "P99 INFERENCE LATENCY"}
              </div>
            </div>
          </div>
        </div>

        {/* ── Interactive HUD Opacity Tuner Widget ── */}
        <div style={{ position: "relative" }}>
          {showTuner && (
            <div
              style={{
                position: "absolute",
                bottom: "48px",
                right: "0",
                width: "260px",
                backgroundColor: isDark
                  ? "rgba(10, 16, 26, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(16px)",
                border: isDark
                  ? "1px solid rgba(56, 189, 248, 0.4)"
                  : "1px solid rgba(15, 23, 42, 0.2)",
                padding: "16px",
                borderRadius: "6px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                zIndex: 40,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <span
                  className="font-pixel"
                  style={{
                    fontSize: "10px",
                    color: isDark ? "#38BDF8" : "#0284C7",
                    letterSpacing: "0.08em",
                  }}
                >
                  // VIDEO OPACITY
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: isDark ? "#ffffff" : "#0F172A",
                  }}
                >
                  {Math.round(currentOpacity * 100)}%
                </span>
              </div>

              <input
                type="range"
                min="0.05"
                max="1.0"
                step="0.05"
                value={currentOpacity}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setTunerOpacity(val);
                  if (isDark) {
                    setConfig((prev) => ({ ...prev, video_opacity_dark: val }));
                  } else {
                    setConfig((prev) => ({ ...prev, video_opacity_light: val }));
                  }
                }}
                style={{
                  width: "100%",
                  accentColor: isDark ? "#38BDF8" : "#0284C7",
                  cursor: "pointer",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "9px",
                  color: isDark ? "#94A3B8" : "#64748B",
                  marginTop: "4px",
                }}
              >
                <span>5% (Subtle)</span>
                <span>100% (Vivid)</span>
              </div>

              <div style={{ marginTop: "12px", display: "flex", gap: "6px" }}>
                <a
                  href="/admin"
                  target="_blank"
                  className="font-pixel"
                  style={{
                    flex: 1,
                    textAlign: "center",
                    backgroundColor: isDark
                      ? "rgba(56, 189, 248, 0.15)"
                      : "rgba(2, 132, 199, 0.1)",
                    color: isDark ? "#38BDF8" : "#0284C7",
                    border: isDark
                      ? "1px solid #38BDF8"
                      : "1px solid #0284C7",
                    padding: "5px 8px",
                    borderRadius: "3px",
                    fontSize: "9px",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  ADMIN PANEL ↗
                </a>
              </div>
            </div>
          )}

          {/* Trigger Button */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => setShowTuner(!showTuner)}
            title="Adjust Background Video Opacity"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: isDark
                ? "rgba(10, 16, 26, 0.8)"
                : "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              border: isDark
                ? "1px solid rgba(255, 255, 255, 0.15)"
                : "1px solid rgba(0, 0, 0, 0.15)",
              color: isDark ? "#ffffff" : "#0F172A",
              padding: "7px 14px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: "12px" }}>🎥</span>
            <span>OPACITY: {Math.round(currentOpacity * 100)}%</span>
            <span style={{ fontSize: "9px", opacity: 0.6 }}>
              {showTuner ? "▲" : "▼"}
            </span>
          </button>
        </div>
      </footer>
    </section>
  );
}
