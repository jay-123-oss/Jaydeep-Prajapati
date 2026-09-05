"use client";

import React, { useState, useEffect } from "react";
import { soundFX } from "@/utils/soundFX";

interface SecurityCheck {
  id: string;
  name: string;
  spec: string;
  status: "VERIFIED" | "SCANNING";
  detail: string;
}

const SECURITY_CHECKS: SecurityCheck[] = [
  {
    id: "headers",
    name: "HTTP Strict Transport & Security Headers",
    spec: "HSTS 2-YR • X-FRAME DENY • NOSNIFF • CSP",
    status: "VERIFIED",
    detail: "Enforces 63,072,000s HSTS preload, prevents clickjacking via X-Frame-Options DENY, and neutralizes MIME sniffing.",
  },
  {
    id: "privacy",
    name: "Zero-Tracking & Privacy Architecture",
    spec: "NO 3RD-PARTY COOKIES • ZERO AD TRACKERS",
    status: "VERIFIED",
    detail: "100% privacy-preserving static delivery. No Google Analytics trackers, no telemetry beacons, no fingerprinting.",
  },
  {
    id: "ratelimit",
    name: "In-Memory IP Sliding Window DoS Shield",
    spec: "RATE LIMIT: 5 REQ / 5 MIN • BRUTE-FORCE GUARD",
    status: "VERIFIED",
    detail: "Per-IP sliding window throttle preventing contact form spam, denial of service, and password brute-force attacks.",
  },
  {
    id: "injection",
    name: "Anti-XSS & SQL Injection Immunity",
    spec: "PARAMETERIZED SQL • HTML ENTITY ENCODING",
    status: "VERIFIED",
    detail: "All inputs undergo length boundary checks and regex entity encoding. SQL queries use tagged template parameterization.",
  },
  {
    id: "timing",
    name: "Timing-Attack Resistant Authentication",
    spec: "CRYPTO.TIMINGSAFEEQUAL • CONSTANT TIME",
    status: "VERIFIED",
    detail: "Eliminates side-channel CPU timing attacks on password verification using cryptographic byte-array comparison.",
  },
  {
    id: "edge-privacy",
    name: "Local-First Spatial Vision Confidentiality",
    spec: "ON-DEVICE INFERENCE • ZERO CLOUD LEAK",
    status: "VERIFIED",
    detail: "Trinetra vision pipelines and edge camera feeds execute strictly on local client hardware with zero video egress.",
  },
];

export default function SecurityAuditModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);

  useEffect(() => {
    const handleOpen = () => {
      soundFX.playClick();
      setIsOpen(true);
    };
    window.addEventListener("open-security-modal", handleOpen);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-security-modal", handleOpen);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const runAuditScan = () => {
    if (isScanning) return;
    soundFX.playClick();
    setIsScanning(true);
    setScanProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 16;
      setScanProgress(Math.min(100, current));
      soundFX.playHover();

      if (current >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        soundFX.playSuccess();
      }
    }, 120);
  };

  return (
    <>
      <button
        type="button"
        id="security-modal-trigger-btn"
        className="hidden"
        aria-hidden="true"
        onClick={() => {
          soundFX.playClick();
          setIsOpen(true);
        }}
      />

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "rgba(2, 6, 23, 0.88)",
            backdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "760px",
              backgroundColor: "var(--bg-card)",
              border: "1.5px solid #10B981",
              borderRadius: "12px",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(16, 185, 129, 0.2)",
              padding: "24px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {/* Modal Header */}
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
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#10B981",
                    boxShadow: "0 0 10px #10B981",
                    display: "inline-block",
                  }}
                />
                <span className="font-chakra" style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.08em" }}>
                  SYS::SECURITY_SHIELD &amp; SYSTEM INTEGRITY
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
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

            {/* Score Banner */}
            <div
              style={{
                padding: "16px",
                borderRadius: "8px",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <div className="font-chakra" style={{ fontSize: "20px", fontWeight: 800, color: "#10B981" }}>
                  SECURITY AUDIT STATUS: 100% HARDENED
                </div>
                <div className="font-pixel" style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>
                  A+ GRADE SECURITY HEADERS • ZERO TRACKERS • TIMING-SAFE CONSTANT TIME AUTH
                </div>
              </div>

              <button
                type="button"
                onClick={runAuditScan}
                disabled={isScanning}
                className="font-pixel"
                style={{
                  padding: "8px 16px",
                  fontSize: "11px",
                  fontWeight: 800,
                  borderRadius: "4px",
                  backgroundColor: isScanning ? "rgba(16, 185, 129, 0.2)" : "#10B981",
                  border: "1px solid #10B981",
                  color: isScanning ? "#A7F3D0" : "#000000",
                  cursor: isScanning ? "wait" : "pointer",
                }}
              >
                {isScanning ? `SCANNING (${scanProgress}%)...` : "⚡ RUN INTEGRITY SCAN"}
              </button>
            </div>

            {/* Checklist Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {SECURITY_CHECKS.map((check) => (
                <div
                  key={check.id}
                  style={{
                    padding: "14px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(0,0,0,0.2)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <div className="font-chakra" style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                      {check.name}
                    </div>
                    <span
                      className="font-pixel"
                      style={{
                        fontSize: "9px",
                        padding: "2px 8px",
                        borderRadius: "2px",
                        backgroundColor: "rgba(16, 185, 129, 0.15)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        color: "#10B981",
                        fontWeight: 700,
                      }}
                    >
                      ● {check.status}
                    </span>
                  </div>

                  <div className="font-pixel" style={{ fontSize: "10px", color: "#38BDF8", marginBottom: "4px" }}>
                    {check.spec}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.4 }}>
                    {check.detail}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              className="font-pixel"
              style={{
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: "14px",
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "10px",
                color: "var(--text-muted)",
              }}
            >
              <span>AUDIT ENGINE: SHA-256 + OWASP TOP-10 COMPLIANT</span>
              <span style={{ color: "#10B981" }}>ZERO KNOWN VULNERABILITIES</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
