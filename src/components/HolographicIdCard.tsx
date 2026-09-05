"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { soundFX } from "@/utils/soundFX";

export default function HolographicIdCard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isOpen, setIsOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const cardRef = useRef<HTMLDivElement>(null);

  // Listen for global custom event to trigger badge from anywhere
  useEffect(() => {
    const handleOpen = () => {
      soundFX.playClick();
      setIsOpen(true);
    };
    window.addEventListener("open-cyber-id", handleOpen);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-cyber-id", handleOpen);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -16;
    const rotateY = ((x - centerX) / centerX) * 16;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: isDark ? 0.7 : 0.4,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleCardClick = () => {
    soundFX.playClick();
    setIsFlipped(!isFlipped);
  };

  return (
    <>
      {/* Invisible anchor button for programmatic triggers */}
      <button
        type="button"
        id="cyber-id-badge-btn"
        className="hidden"
        aria-hidden="true"
        onClick={() => {
          soundFX.playSuccess();
          setIsOpen(true);
        }}
      />

      {/* 3D Hologram Modal Overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: isDark ? "rgba(2, 6, 15, 0.88)" : "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(14px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {/* Card Wrapper (Stops propagation so click flips card) */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              perspective: "1200px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              maxWidth: "100%",
            }}
          >
            {/* Top Modal Controls */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "380px",
                padding: "0 8px",
              }}
            >
              <div
                className="font-pixel"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.14em",
                  color: isDark ? "#38BDF8" : "#0284C7",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
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
                AUTHENTICATED HARDWARE CREDENTIAL
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="font-pixel"
                style={{
                  background: "transparent",
                  border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.2)",
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

            {/* 3D TILT CONTAINER */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleCardClick}
              style={{
                width: "360px",
                maxWidth: "calc(100vw - 32px)",
                height: "540px",
                position: "relative",
                transformStyle: "preserve-3d",
                transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y + (isFlipped ? 180 : 0)}deg)`,
                transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {/* ── CARD FRONT ── */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  borderRadius: "16px",
                  border: isDark ? "1.5px solid rgba(56, 189, 248, 0.4)" : "1.5px solid rgba(2, 132, 199, 0.4)",
                  backgroundColor: isDark ? "rgba(10, 16, 28, 0.95)" : "rgba(255, 255, 255, 0.96)",
                  boxShadow: isDark
                    ? "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.25)"
                    : "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 25px rgba(2, 132, 199, 0.2)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  padding: "26px",
                  justifyContent: "space-between",
                }}
              >
                {/* Rainbow Foil Holographic Glare */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.8) 0%, rgba(56, 189, 248, 0.3) 25%, rgba(168, 85, 247, 0.2) 45%, rgba(236, 72, 153, 0.15) 60%, transparent 80%)`,
                    opacity: glare.opacity,
                    mixBlendMode: isDark ? "screen" : "multiply",
                    transition: "opacity 0.15s ease",
                  }}
                />

                {/* Top Header */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
                    <div>
                      <div
                        className="font-chakra"
                        style={{
                          fontSize: "20px",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                          color: isDark ? "#FFFFFF" : "#0F172A",
                          textTransform: "uppercase",
                          lineHeight: 1,
                        }}
                      >
                        JAYDEEP PRAJAPATI
                      </div>
                      <div
                        className="font-pixel"
                        style={{
                          fontSize: "10px",
                          color: isDark ? "#38BDF8" : "#0284C7",
                          letterSpacing: "0.14em",
                          marginTop: "4px",
                          fontWeight: 700,
                        }}
                      >
                        B.TECH CSE SCHOLAR // AI &amp; WEB DEVELOPER
                      </div>
                    </div>

                    {/* NFC Smart Chip Graphic */}
                    <div
                      style={{
                        width: "42px",
                        height: "32px",
                        borderRadius: "5px",
                        background: "linear-gradient(135deg, #FCD34D 0%, #D97706 50%, #B45309 100%)",
                        border: "1px solid rgba(0,0,0,0.3)",
                        boxShadow: "inset 0 1px 2px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ position: "absolute", width: "100%", height: "1px", backgroundColor: "rgba(0,0,0,0.25)" }} />
                      <div style={{ position: "absolute", height: "100%", width: "1px", backgroundColor: "rgba(0,0,0,0.25)" }} />
                      <div style={{ width: "18px", height: "14px", border: "1px solid rgba(0,0,0,0.3)", borderRadius: "2px" }} />
                    </div>
                  </div>

                  {/* Profile & Telemetry Row */}
                  <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                    <div
                      style={{
                        width: "88px",
                        height: "88px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: isDark ? "2px solid #38BDF8" : "2px solid #0284C7",
                        boxShadow: isDark ? "0 0 15px rgba(56, 189, 248, 0.4)" : "0 4px 12px rgba(0,0,0,0.1)",
                        backgroundColor: "#020617",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src="/profile_logo.png"
                        alt="Jaydeep Prajapati Portrait"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>

                    <div className="font-pixel" style={{ fontSize: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div>
                        <span style={{ color: "var(--text-muted)" }}>COLLEGE: </span>
                        <strong style={{ color: isDark ? "#FFFFFF" : "#0F172A" }}>GYAN SAGAR ENG.</strong>
                      </div>
                      <div>
                        <span style={{ color: "var(--text-muted)" }}>DEGREE: </span>
                        <strong style={{ color: "#10B981" }}>B.TECH CSE (3RD YR)</strong>
                      </div>
                      <div>
                        <span style={{ color: "var(--text-muted)" }}>PRIMARY: </span>
                        <strong style={{ color: isDark ? "#38BDF8" : "#0284C7" }}>PYTHON · ML · REACT</strong>
                      </div>
                      <div>
                        <span style={{ color: "var(--text-muted)" }}>STATUS: </span>
                        <strong style={{ color: "#10B981" }}>OPEN FOR ROLES</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Holographic Stamp */}
                <div
                  style={{
                    border: isDark ? "1px dashed rgba(56, 189, 248, 0.4)" : "1px dashed rgba(2, 132, 199, 0.3)",
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: isDark ? "rgba(56, 189, 248, 0.05)" : "rgba(2, 132, 199, 0.04)",
                  }}
                >
                  <div className="font-pixel" style={{ fontSize: "9px", color: "var(--text-muted)", marginBottom: "4px" }}>
                    FLAGSHIP COMPUTER VISION &amp; AGENT STACK
                  </div>
                  <div
                    className="font-chakra"
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: isDark ? "#FFFFFF" : "#0F172A",
                    }}
                  >
                    Trinetra (YOLO + Depth V2) · LangGraph · FastAPI
                  </div>
                  <div className="font-pixel" style={{ fontSize: "9px", color: isDark ? "#38BDF8" : "#0284C7", marginTop: "4px" }}>
                    CERTIFIED: KAGGLE AI AGENTS · VARANASI, UP
                  </div>
                </div>

                {/* Bottom Barcode & Instructions */}
                <div>
                  {/* Cyber Barcode lines */}
                  <div
                    style={{
                      height: "36px",
                      width: "100%",
                      display: "flex",
                      alignItems: "stretch",
                      gap: "2.5px",
                      overflow: "hidden",
                      opacity: isDark ? 0.75 : 0.6,
                      marginBottom: "8px",
                    }}
                  >
                    {[3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9, 5].map(
                      (w, i) => (
                        <div
                          key={i}
                          style={{
                            width: `${w * 1.4}px`,
                            backgroundColor: isDark ? "#FFFFFF" : "#0F172A",
                            flexShrink: 0,
                          }}
                        />
                      )
                    )}
                  </div>

                  <div
                    className="font-pixel"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "9px",
                      color: "var(--text-muted)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    <span>ID: JP-2026-GSCE</span>
                    <span style={{ color: isDark ? "#38BDF8" : "#0284C7" }}>[CLICK ANYWHERE TO FLIP ↻]</span>
                  </div>
                </div>
              </div>

              {/* ── CARD BACK ── */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  borderRadius: "16px",
                  border: isDark ? "1.5px solid rgba(168, 85, 247, 0.4)" : "1.5px solid rgba(126, 34, 206, 0.4)",
                  backgroundColor: isDark ? "rgba(12, 10, 24, 0.96)" : "rgba(255, 255, 255, 0.96)",
                  boxShadow: isDark
                    ? "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(168, 85, 247, 0.25)"
                    : "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 25px rgba(126, 34, 206, 0.2)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  padding: "26px",
                  justifyContent: "space-between",
                }}
              >
                {/* Magnetic Stripe */}
                <div
                  style={{
                    margin: "-26px -26px 16px -26px",
                    height: "44px",
                    backgroundColor: isDark ? "#050508" : "#1E293B",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 24px",
                  }}
                >
                  <div
                    className="font-pixel"
                    style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em" }}
                  >
                    OFFICIAL APPLICANT PROFILE // VERIFIED CONTACT
                  </div>
                </div>

                {/* Back Content */}
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div
                    className="font-chakra"
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: isDark ? "#C084FC" : "#7E22CE",
                      textTransform: "uppercase",
                    }}
                  >
                    DIRECT HIRING &amp; CONTACT CHANNELS
                  </div>

                  <div className="font-pixel" style={{ fontSize: "10px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                    Computer Science Engineering student at Gyan Sagar College of Engineering with practical experience building computer vision pipelines (YOLO, Depth Anything V2), LangGraph multi-agent systems, and full-stack web applications.
                  </div>

                  {/* Contact Links */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                    <a
                      href="mailto:jaydeepprajapati30941@gmail.com"
                      onClick={(e) => e.stopPropagation()}
                      className="font-pixel"
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--text-primary)",
                        fontSize: "11px",
                        textDecoration: "none",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>✉️ EMAIL: jaydeepprajapati30941@gmail.com</span>
                      <span style={{ color: isDark ? "#38BDF8" : "#0284C7" }}>WRITE ↗</span>
                    </a>

                    <a
                      href="tel:+919131819391"
                      onClick={(e) => e.stopPropagation()}
                      className="font-pixel"
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--text-primary)",
                        fontSize: "11px",
                        textDecoration: "none",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>📱 PHONE: +91 9131819391</span>
                      <span style={{ color: isDark ? "#38BDF8" : "#0284C7" }}>CALL ↗</span>
                    </a>

                    <a
                      href="https://github.com/jay-123-oss"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-pixel"
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--text-primary)",
                        fontSize: "11px",
                        textDecoration: "none",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>💻 GITHUB: jay-123-oss</span>
                      <span style={{ color: isDark ? "#38BDF8" : "#0284C7" }}>REPOS ↗</span>
                    </a>

                    <a
                      href="/Jaydeep_Prajapati_Resume_Strict1Page.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-pixel"
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        backgroundColor: isDark ? "rgba(56, 189, 248, 0.1)" : "rgba(2, 132, 199, 0.1)",
                        border: isDark ? "1px solid #38BDF8" : "1px solid #0284C7",
                        color: isDark ? "#38BDF8" : "#0284C7",
                        fontSize: "11px",
                        fontWeight: 700,
                        textDecoration: "none",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>📄 STRICT 1-PAGE ATS RESUME</span>
                      <span>PDF ↗</span>
                    </a>
                  </div>
                </div>

                {/* Footer Signature */}
                <div
                  className="font-pixel"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid var(--border-subtle)",
                    paddingTop: "12px",
                    fontSize: "9px",
                    color: "var(--text-muted)",
                  }}
                >
                  <span>CANDIDATE: <strong style={{ color: isDark ? "#FFFFFF" : "#0F172A" }}>JAYDEEP PRAJAPATI</strong></span>
                  <span style={{ color: isDark ? "#C084FC" : "#7E22CE" }}>[CLICK TO FLIP BACK]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
