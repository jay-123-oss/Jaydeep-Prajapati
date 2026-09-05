"use client";

import React, { useState } from "react";
import { WaspButton } from "@/components/ui/wasp-button";
import JaydeepRAGWidget from "@/components/JaydeepRAGWidget";

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "ML / AI Collaboration",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
    } catch (err) {
      console.error("Failed to transmit inquiry", err);
    }
    setIsSubmitted(true);
  };

  return (
    <section
      id="contact"
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(60px, 8vw, 110px) clamp(16px, 4vw, 56px) clamp(70px, 9vw, 130px)",
        userSelect: "none",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* ── Cyber Background Matrix Grid ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
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
            d="M 0,30 L 260,30 L 300,55 L 1100,55 L 1440,55"
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
        {/* ── Section Header ── */}
        <div style={{ marginBottom: "50px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "14px",
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
            <span
              className="font-pixel"
              style={{
                fontSize: "12px",
                letterSpacing: "0.15em",
                color: "#20BEFF",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              // 05. NEURAL RAG ENGINE &amp; TRANSMISSION
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "24px",
            }}
          >
            <div>
              <h2
                className="font-chakra"
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 4rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 0.95,
                  textTransform: "uppercase",
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                <span style={{ display: "block" }}>NEURAL RAG &amp;</span>
                <span style={{ display: "block", color: "var(--text-secondary)" }}>
                  TRANSMISSION
                </span>
              </h2>
            </div>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                maxWidth: "440px",
                margin: 0,
              }}
            >
              Query the live neural RAG engine on the left to verify Jaydeep&apos;s models,
              architecture, and track record in real-time, or dispatch an inquiry directly.
            </p>
          </div>
        </div>

        {/* ── Two Column: Left: Neural RAG Engine, Right: Dispatch Console ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "24px",
            alignItems: "stretch",
          }}
        >
          {/* Left: Interactive Neural RAG Search Engine */}
          <JaydeepRAGWidget />

          {/* Right: Dispatch Message Form & Direct Transmission Channels */}
          <div
            style={{
              position: "relative",
              backgroundColor: "var(--bg-card)",
              backdropFilter: "blur(16px)",
              border: "1px solid var(--border-subtle)",
              padding: "clamp(18px, 3vw, 32px)",
              clipPath:
                "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
              boxShadow: "0 15px 40px -10px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {isSubmitted ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  height: "100%",
                  padding: "40px 20px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid #10B981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#10B981",
                    fontSize: "20px",
                    marginBottom: "16px",
                  }}
                >
                  ✓
                </div>
                <h3
                  className="font-chakra"
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    margin: "0 0 8px 0",
                    color: "var(--text-primary)",
                  }}
                >
                  TRANSMISSION DISPATCHED
                </h3>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    maxWidth: "340px",
                    marginBottom: "24px",
                  }}
                >
                  Your message has been encrypted and routed directly to my
                  inbox. Expected response latency: &lt; 12 hours.
                </p>
                <WaspButton
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormState({
                      name: "",
                      email: "",
                      subject: "ML / AI Collaboration",
                      message: "",
                    });
                  }}
                  variant="outline"
                  paddingX={22}
                  paddingY={9}
                  fontSize={11}
                  cutTopLeft={8}
                  cutBottomRight={8}
                >
                  SEND ANOTHER TRANSMISSION
                </WaspButton>
              </div>
            ) : (
              <form
                onSubmit={handleFormSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div
                  className="font-pixel"
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    letterSpacing: "0.1em",
                    marginBottom: "4px",
                  }}
                >
                  // DIRECT INQUIRY DISPATCH
                </div>

                {/* Name & Email Inputs */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
                    gap: "12px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "var(--text-secondary)",
                        marginBottom: "6px",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Your Name
                    </label>
                    <input
                      required
                      type="text"
                      suppressHydrationWarning
                      placeholder="Jane Doe"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      style={{
                        width: "100%",
                        backgroundColor: "rgba(128, 128, 128, 0.06)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "4px",
                        padding: "10px 14px",
                        color: "var(--text-primary)",
                        fontSize: "13px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "var(--text-secondary)",
                        marginBottom: "6px",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      suppressHydrationWarning
                      placeholder="jane@company.com"
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      style={{
                        width: "100%",
                        backgroundColor: "rgba(128, 128, 128, 0.06)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "4px",
                        padding: "10px 14px",
                        color: "var(--text-primary)",
                        fontSize: "13px",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "var(--text-secondary)",
                      marginBottom: "6px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    suppressHydrationWarning
                    value={formState.subject}
                    onChange={(e) =>
                      setFormState({ ...formState, subject: e.target.value })
                    }
                    style={{
                      width: "100%",
                      backgroundColor: "rgba(128, 128, 128, 0.06)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "4px",
                      padding: "10px 14px",
                      color: "var(--text-primary)",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "var(--text-secondary)",
                      marginBottom: "6px",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Project Details / Inquiry
                  </label>
                  <textarea
                    required
                    suppressHydrationWarning
                    rows={4}
                    placeholder="Tell me about your model requirements, throughput targets, or project scope..."
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    style={{
                      width: "100%",
                      backgroundColor: "rgba(128, 128, 128, 0.06)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "4px",
                      padding: "10px 14px",
                      color: "var(--text-primary)",
                      fontSize: "13px",
                      outline: "none",
                      resize: "none",
                    }}
                  />
                </div>

                <div style={{ marginTop: "8px" }}>
                  <WaspButton
                    type="submit"
                    variant="light"
                    paddingX={28}
                    paddingY={12}
                    fontSize={12}
                    cutTopLeft={10}
                    cutBottomRight={10}
                  >
                    TRANSMIT INQUIRY →
                  </WaspButton>
                </div>
              </form>
            )}

            {/* Encrypted Social Links Bar */}
            <div
              style={{
                marginTop: "24px",
                paddingTop: "18px",
                borderTop: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              {[
                { name: "GITHUB", url: "https://github.com" },
                { name: "HUGGING FACE", url: "https://huggingface.co" },
                { name: "LINKEDIN", url: "https://linkedin.com" },
                { name: "X (TWITTER)", url: "https://x.com" },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    letterSpacing: "0.05em",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--text-primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-muted)")
                  }
                >
                  {link.name} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
