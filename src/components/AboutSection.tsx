"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

export default function AboutSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      id="about"
      aria-label="About Jaydeep Prajapati"
      style={{
        width: "100%",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(60px, 8vw, 100px) clamp(16px, 4vw, 56px)",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* ── Background Grid ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Top HUD Header Angle Line ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <svg
          style={{ width: "100%", height: "100%" }}
          preserveAspectRatio="none"
          viewBox="0 0 1440 60"
        >
          <path
            d="M 0,20 L 140,20 L 180,48 L 780,48 L 1440,48"
            fill="none"
            stroke="var(--hud-line)"
            strokeWidth={1.2}
          />
        </svg>
      </div>

      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          position: "relative",
          zIndex: 20,
        }}
      >
        {/* ── Section Title HUD ── */}
        <div style={{ marginBottom: "36px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#38BDF8",
                boxShadow: "0 0 8px #38BDF8",
                display: "inline-block",
              }}
            />
            <span
              className="font-pixel"
              style={{
                fontSize: "12px",
                letterSpacing: "0.15em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
              }}
            >
              // 01. PROFILE &amp; BIOGRAPHY // ARCHITECTURE OVERVIEW
            </span>
          </div>

          <h2
            className="font-chakra"
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              margin: 0,
              lineHeight: 1.05,
              color: "var(--text-primary)",
            }}
          >
            ABOUT <span style={{ color: "#38BDF8" }}>JAYDEEP PRAJAPATI</span>
          </h2>
          <p
            className="font-pixel"
            style={{
              fontSize: "12px",
              color: isDark ? "#94A3B8" : "#64748B",
              marginTop: "8px",
              letterSpacing: "0.08em",
            }}
          >
            AI/ML SYSTEMS DEVELOPER &amp; FULL-STACK SOFTWARE ENGINEER
          </p>
        </div>

        {/* ── 2-Column Content Grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "28px",
            alignItems: "stretch",
          }}
        >
          {/* Card 1: Identity & Credentials */}
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              backdropFilter: "blur(16px)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              padding: "clamp(24px, 3vw, 36px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: isDark
                ? "0 10px 30px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)"
                : "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid #38BDF8",
                    boxShadow: "0 0 14px rgba(56, 189, 248, 0.4)",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="/profile_logo.png"
                    alt="Jaydeep Prajapati"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div>
                  <h3
                    className="font-chakra"
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    Jaydeep Prajapati
                  </h3>
                  <div
                    className="font-pixel"
                    style={{
                      fontSize: "10px",
                      color: "#10B981",
                      letterSpacing: "0.08em",
                    }}
                  >
                    ● ACTIVE DEVELOPER // ON-DEVICE AI
                  </div>
                </div>
              </div>

              {/* Quick specs list */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  fontSize: "13px",
                  borderTop: "1px solid var(--border-subtle)",
                  paddingTop: "16px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Specialization:</span>
                  <strong style={{ color: "var(--text-primary)", textAlign: "right" }}>
                    Computer Vision &amp; Autonomous Agents
                  </strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Education:</span>
                  <span style={{ color: "var(--text-primary)", textAlign: "right" }}>
                    B.Tech CSE, Gyan Sagar College of Engineering
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Flagship System:</span>
                  <a
                    href="#projects"
                    style={{
                      color: "#38BDF8",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    Trinetra (Local Vision Engine)
                  </a>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Primary Stack:</span>
                  <span style={{ color: "var(--text-primary)", textAlign: "right" }}>
                    Python, PyTorch, YOLO, LangGraph, Next.js
                  </span>
                </div>
              </div>
            </div>

            {/* Social profiles links */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "24px",
                paddingTop: "16px",
                borderTop: "1px solid var(--border-subtle)",
              }}
            >
              <a
                href="https://github.com/jay-123-oss"
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel"
                style={{
                  fontSize: "11px",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>🐙</span> GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/jaydeep-prajapati-a97988358/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel"
                style={{
                  fontSize: "11px",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                  border: "1px solid var(--border-subtle)",
                  color: "#0A66C2",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>💼</span> LinkedIn
              </a>
              <a
                href="https://www.kaggle.com/jaydeepprajapatik"
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel"
                style={{
                  fontSize: "11px",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                  border: "1px solid var(--border-subtle)",
                  color: "#20BEFF",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>📊</span> Kaggle
              </a>
            </div>
          </div>

          {/* Card 2: Professional Narrative & Internal Links */}
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              backdropFilter: "blur(16px)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              padding: "clamp(24px, 3vw, 36px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: isDark
                ? "0 10px 30px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)"
                : "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <div>
              <h3
                className="font-chakra"
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: "14px",
                }}
              >
                Engineering Philosophy &amp; Applied Work
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                  marginBottom: "14px",
                }}
              >
                I am <strong>Jaydeep Prajapati</strong>, an AI/ML developer and Software Engineer
                dedicated to bridging the gap between theoretical deep learning and efficient,
                local execution. I architect local-first Computer Vision applications such as{" "}
                <strong>Trinetra</strong>, which delivers on-device spatial obstacle perception and
                real-time YOLO inference with zero external cloud latency.
              </p>

              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                  marginBottom: "20px",
                }}
              >
                In addition to vision models, I build autonomous multi-agent pipelines with{" "}
                <strong>LangGraph</strong>, scalable APIs using <strong>FastAPI</strong>, and
                high-performance web applications with <strong>Next.js 16</strong>. Every project
                emphasizes clean code, type safety, and real-world utility.
              </p>
            </div>

            {/* Structured Internal Links Navigation */}
            <div>
              <div
                className="font-pixel"
                style={{
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  letterSpacing: "0.1em",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                }}
              >
                Explore Portfolio Sections:
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <a
                  href="#skills"
                  className="font-pixel"
                  style={{
                    fontSize: "11px",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    backgroundColor: isDark ? "rgba(56, 189, 248, 0.12)" : "rgba(2, 132, 199, 0.08)",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    color: "#38BDF8",
                    textDecoration: "none",
                  }}
                >
                  Technical Skills →
                </a>
                <a
                  href="#projects"
                  className="font-pixel"
                  style={{
                    fontSize: "11px",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    backgroundColor: isDark ? "rgba(168, 85, 247, 0.12)" : "rgba(147, 51, 234, 0.08)",
                    border: "1px solid rgba(168, 85, 247, 0.3)",
                    color: isDark ? "#C084FC" : "#7E22CE",
                    textDecoration: "none",
                  }}
                >
                  Projects &amp; AI Systems →
                </a>
                <a
                  href="#experience"
                  className="font-pixel"
                  style={{
                    fontSize: "11px",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    backgroundColor: isDark ? "rgba(16, 185, 129, 0.12)" : "rgba(5, 150, 105, 0.08)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    color: "#10B981",
                    textDecoration: "none",
                  }}
                >
                  Experience Track →
                </a>
                <a
                  href="/chess"
                  className="font-pixel"
                  style={{
                    fontSize: "11px",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    backgroundColor: isDark ? "rgba(245, 158, 11, 0.12)" : "rgba(217, 119, 6, 0.08)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    color: "#F59E0B",
                    textDecoration: "none",
                  }}
                >
                  Cyber Chess Arena →
                </a>
                <a
                  href="#contact"
                  className="font-pixel"
                  style={{
                    fontSize: "11px",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                    textDecoration: "none",
                  }}
                >
                  Contact Jaydeep →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
