"use client";

import React, { useState, useEffect } from "react";
import { soundFX } from "@/utils/soundFX";

export default function MissionControlDock() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [uptimeSeconds, setUptimeSeconds] = useState(18420);
  const [edgePing, setEdgePing] = useState(14);

  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleOpen = () => {
    soundFX.playClick();
    setIsExpanded((prev) => !prev);
  };

  const triggerEvent = (eventName: string) => {
    soundFX.playClick();
    setIsExpanded(false);
    window.dispatchEvent(new CustomEvent(eventName));
  };

  const scrollToSection = (id: string) => {
    soundFX.playClick();
    setIsExpanded(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ── DISCRETE CORNER STATUS CHIP (BOTTOM-LEFT, NON-INTRUSIVE) ── */}
      <button
        type="button"
        onClick={toggleOpen}
        title="Open Laboratory Telemetry & Module Control"
        className="font-pixel"
        style={{
          position: "fixed",
          bottom: "18px",
          left: "18px",
          zIndex: 45,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 12px",
          borderRadius: "4px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-primary)",
          fontSize: "11px",
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          transition: "all 0.2s ease",
        }}
      >
        <span
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            backgroundColor: "#10B981",
            boxShadow: "0 0 8px #10B981",
            display: "inline-block",
          }}
        />
        <span style={{ fontWeight: 700 }}>LAB: ONLINE</span>
        <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>[{edgePing}ms]</span>
      </button>

      {/* ── EXPANDED TELEMETRY DRAWER MODAL ── */}
      {isExpanded && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsExpanded(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99998,
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "840px",
              backgroundColor: "var(--bg-card)",
              border: "1.5px solid var(--border-active)",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            {/* Top Bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid var(--border-subtle)",
                paddingBottom: "14px",
                marginBottom: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#10B981",
                    boxShadow: "0 0 8px #10B981",
                  }}
                />
                <span className="font-chakra" style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                  LABORATORY TELEMETRY &amp; HARDWARE SPECS
                </span>
                <span className="font-pixel" style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                  UPTIME: {formatUptime(uptimeSeconds)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="font-pixel"
                style={{
                  background: "transparent",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-muted)",
                  padding: "4px 10px",
                  fontSize: "11px",
                  cursor: "pointer",
                  borderRadius: "2px",
                }}
              >
                ESC [✕]
              </button>
            </div>

            {/* Spec Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
                marginBottom: "22px",
              }}
            >
              <div style={{ padding: "14px", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.2)", border: "1px solid var(--border-subtle)" }}>
                <div className="font-pixel" style={{ fontSize: "9px", color: "var(--text-muted)", marginBottom: "4px" }}>ACTIVE PROJECT</div>
                <div className="font-chakra" style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>Trinetra Vision AI</div>
                <div className="font-pixel" style={{ fontSize: "9px", color: "#10B981", marginTop: "2px" }}>YOLO + Depth Anything V2</div>
              </div>

              <div style={{ padding: "14px", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.2)", border: "1px solid var(--border-subtle)" }}>
                <div className="font-pixel" style={{ fontSize: "9px", color: "var(--text-muted)", marginBottom: "4px" }}>ACADEMIC STATUS</div>
                <div className="font-chakra" style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>B.Tech CSE (3rd Year)</div>
                <div className="font-pixel" style={{ fontSize: "9px", color: "#38BDF8", marginTop: "2px" }}>Gyan Sagar College of Eng.</div>
              </div>

              <div style={{ padding: "14px", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.2)", border: "1px solid var(--border-subtle)" }}>
                <div className="font-pixel" style={{ fontSize: "9px", color: "var(--text-muted)", marginBottom: "4px" }}>AGENT ARCHITECTURE</div>
                <div className="font-chakra" style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>LangGraph Planner</div>
                <div className="font-pixel" style={{ fontSize: "9px", color: "#A855F7", marginTop: "2px" }}>FastAPI + PostgreSQL State</div>
              </div>

              <div style={{ padding: "14px", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.2)", border: "1px solid var(--border-subtle)" }}>
                <div className="font-pixel" style={{ fontSize: "9px", color: "var(--text-muted)", marginBottom: "4px" }}>VERIFIED CV</div>
                <div className="font-chakra" style={{ fontSize: "13px", fontWeight: 700, color: "#10B981" }}>Strict 1-Page PDF</div>
                <a
                  href="/Jaydeep_Prajapati_Resume_Strict1Page.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-pixel"
                  style={{ fontSize: "9px", color: "#38BDF8", marginTop: "2px", display: "block", textDecoration: "none" }}
                >
                  Download Resume ↗
                </a>
              </div>
            </div>

            {/* Quick Trigger Shortcuts */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <span className="font-pixel" style={{ fontSize: "10px", color: "var(--text-muted)" }}>DIRECT MODULE LAUNCHERS:</span>

              <button
                type="button"
                onClick={() => triggerEvent("open-cyber-id")}
                className="font-pixel"
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid #38BDF8",
                  color: "#38BDF8",
                  fontSize: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                💳 3D SECURITY BADGE
              </button>

              <button
                type="button"
                onClick={() => triggerEvent("open-neural-vision")}
                className="font-pixel"
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(6, 182, 212, 0.12)",
                  border: "1px solid #06B6D4",
                  color: "#06B6D4",
                  fontSize: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                👁️ NEURAL VISION CAM
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("quantizer-playground")}
                className="font-pixel"
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(168, 85, 247, 0.12)",
                  border: "1px solid #A855F7",
                  color: "#C084FC",
                  fontSize: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🎛️ MODEL QUANTIZER
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("agent-swarm-arena")}
                className="font-pixel"
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid #10B981",
                  color: "#10B981",
                  fontSize: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🤖 AGENT SWARM
              </button>

              <button
                type="button"
                onClick={() => triggerEvent("open-security-modal")}
                className="font-pixel"
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(245, 158, 11, 0.12)",
                  border: "1px solid #F59E0B",
                  color: "#FBBF24",
                  fontSize: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🔒 SECURITY SHIELD
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
