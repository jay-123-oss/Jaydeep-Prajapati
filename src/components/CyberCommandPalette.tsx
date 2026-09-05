"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { soundFX } from "@/utils/soundFX";

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Navigation" | "Actions" | "AI & Tools";
  icon: string;
  action: () => void;
  shortcut?: string;
}

export default function CyberCommandPalette() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // Define commands list
  const commands: CommandItem[] = [
    {
      id: "resume",
      title: "Download Official Resume (PDF)",
      subtitle: "1-Page Strict ATS-optimized Machine Learning CV",
      category: "Actions",
      icon: "📄",
      shortcut: "R",
      action: () => {
        window.open("/Jaydeep_Prajapati_Resume_Strict1Page.pdf", "_blank");
      },
    },
    {
      id: "projects",
      title: "Jump to Flagship AI Systems",
      subtitle: "NeuroVision, OmniAgent, HyperScale, and live demos",
      category: "Navigation",
      icon: "🎯",
      shortcut: "P",
      action: () => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "cyber-id",
      title: "Inspect 3D Holographic Cyber ID Badge",
      subtitle: "Tilt, flip, and view cryptographic developer credential & security chip",
      category: "Actions",
      icon: "💳",
      shortcut: "B",
      action: () => {
        const btn = document.getElementById("cyber-id-badge-btn");
        if (btn) btn.click();
      },
    },
    {
      id: "neural-vision",
      title: "Launch Neural Vision Edge-AI Cyber-Cam",
      subtitle: "Live camera stream, thermal night vision, matrix rain, edge filters & snapshots",
      category: "AI & Tools",
      icon: "👁️",
      shortcut: "V",
      action: () => {
        const btn = document.getElementById("neural-vision-trigger-btn");
        if (btn) btn.click();
      },
    },
    {
      id: "quantizer",
      title: "Interactive Model Quantizer & Latency Lab",
      subtitle: "Real-time slider from FP32 to 1.58-Bit BitNet with live VRAM and token streaming",
      category: "AI & Tools",
      icon: "🎛️",
      shortcut: "Q",
      action: () => {
        document.getElementById("quantizer-playground")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "swarm",
      title: "Autonomous Multi-Agent Swarm Arena",
      subtitle: "Simulate GPU OOM, DDoS, and prompt injection auto-healing with 3 collaborating agents",
      category: "AI & Tools",
      icon: "🤖",
      shortcut: "W",
      action: () => {
        document.getElementById("agent-swarm-arena")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "security",
      title: "Inspect Security Shield & Hardening Status",
      subtitle: "Live audit of CSP, HSTS, rate limiting, anti-XSS, and constant-time auth",
      category: "AI & Tools",
      icon: "🛡️",
      shortcut: "X",
      action: () => {
        window.dispatchEvent(new CustomEvent("open-security-modal"));
      },
    },
    {
      id: "rag",
      title: "Ask Neural RAG Engine",
      subtitle: "Traverse HNSW vector database about Jaydeep's work",
      category: "AI & Tools",
      icon: "🧠",
      shortcut: "A",
      action: () => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          const input = document.querySelector('[data-cursor="rag"] input') as HTMLInputElement;
          if (input) input.focus();
        }, 400);
      },
    },
    {
      id: "chess",
      title: "Play Cyber Chess Arena",
      subtitle: "Challenge Jaydeep's embedded chess AI bot",
      category: "AI & Tools",
      icon: "♟️",
      shortcut: "C",
      action: () => {
        const btn = document.getElementById("chess-trigger-btn");
        if (btn) btn.click();
      },
    },
    {
      id: "skills",
      title: "Inspect Neural Tech Stack",
      subtitle: "Next.js 16, PyTorch, vLLM, TensorRT, LangChain",
      category: "Navigation",
      icon: "⚡",
      shortcut: "S",
      action: () => {
        document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "experience",
      title: "Career Telemetry & Timeline",
      subtitle: "Staff ML Engineer, production impact and milestones",
      category: "Navigation",
      icon: "💼",
      shortcut: "E",
      action: () => {
        document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "social",
      title: "Social Showcase Matrix",
      subtitle: "Live smartphone mockups of Instagram, LinkedIn, GitHub",
      category: "Navigation",
      icon: "🌐",
      shortcut: "M",
      action: () => {
        document.getElementById("social-showcase")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "contact",
      title: "Dispatch Encrypted Message",
      subtitle: "Send direct inquiry to Jaydeep's priority inbox",
      category: "Actions",
      icon: "✉️",
      shortcut: "T",
      action: () => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "lamp",
      title: "Trigger Secret Admin Lamp",
      subtitle: "Toggle hanging ambient light or passcode console",
      category: "AI & Tools",
      icon: "💡",
      action: () => {
        const lamp = document.getElementById("hanging-admin-lamp");
        if (lamp) {
          lamp.scrollIntoView({ behavior: "smooth" });
          lamp.click();
        }
      },
    },
    {
      id: "theme",
      title: `Switch to ${isDark ? "Light" : "Dark"} Mode`,
      subtitle: `Currently active: ${isDark ? "Dark Cyber" : "Light Solar"} Theme`,
      category: "Actions",
      icon: isDark ? "☀️" : "🌙",
      shortcut: "D",
      action: () => {
        toggleTheme();
      },
    },
  ];

  // Filter commands by search query
  const filteredCommands = commands.filter((cmd) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  // Global hotkey listener: Ctrl + K or Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) soundFX.playClick();
          return !prev;
        });
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      soundFX.playClick();
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        setQuery("");
        setSelectedIndex(0);
      }, 50);
    }
  }, [isOpen]);

  // Arrow navigation
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredCommands[selectedIndex];
      if (selected) {
        soundFX.playSuccess();
        selected.action();
        setIsOpen(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(3, 7, 18, 0.75)",
        backdropFilter: "blur(14px)",
        zIndex: 999999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "clamp(60px, 12vh, 120px)",
        animation: "paletteFade 0.15s ease-out",
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "620px",
          margin: "0 16px",
          backgroundColor: isDark ? "rgba(10, 16, 26, 0.94)" : "rgba(255, 255, 255, 0.96)",
          border: isDark ? "1.5px solid #20BEFF" : "1.5px solid #0284C7",
          boxShadow: isDark
            ? "0 0 35px rgba(32, 190, 255, 0.3), 0 25px 50px rgba(0,0,0,0.8)"
            : "0 20px 50px rgba(0,0,0,0.18)",
          clipPath:
            "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 18px",
            borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #E2E8F0",
          }}
        >
          <span style={{ fontSize: "16px", color: isDark ? "#20BEFF" : "#0284C7" }}>⌘</span>
          <input
            ref={inputRef}
            type="text"
            suppressHydrationWarning
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a command or jump to section (e.g. 'resume', 'projects', 'rag')..."
            style={{
              flex: 1,
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              color: isDark ? "#F8FAFC" : "#0F172A",
              fontWeight: 500,
            }}
          />
          <span
            style={{
              fontSize: "9px",
              fontFamily: "monospace",
              color: isDark ? "#94A3B8" : "#64748B",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid #CBD5E1",
              padding: "2px 6px",
              borderRadius: "2px",
            }}
          >
            ESC TO EXIT
          </span>
        </div>

        {/* Results List */}
        <div
          style={{
            maxHeight: "360px",
            overflowY: "auto",
            padding: "8px",
          }}
        >
          {filteredCommands.length === 0 ? (
            <div
              style={{
                padding: "28px",
                textAlign: "center",
                color: isDark ? "#94A3B8" : "#64748B",
                fontSize: "13px",
              }}
            >
              No matching neural commands found for &quot;{query}&quot;.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    soundFX.playSuccess();
                    cmd.action();
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    backgroundColor: isSelected
                      ? isDark
                        ? "rgba(32, 190, 255, 0.16)"
                        : "#E0F2FE"
                      : "transparent",
                    border: isSelected
                      ? isDark
                        ? "1px solid #20BEFF"
                        : "1px solid #0284C7"
                      : "1px solid transparent",
                    transition: "all 0.12s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "16px" }}>{cmd.icon}</span>
                    <div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: isSelected
                            ? isDark
                              ? "#20BEFF"
                              : "#0369A1"
                            : isDark
                            ? "#F1F5F9"
                            : "#0F172A",
                        }}
                      >
                        {cmd.title}
                      </div>
                      <div
                        style={{
                          fontSize: "10.5px",
                          color: isDark ? "#94A3B8" : "#64748B",
                        }}
                      >
                        {cmd.subtitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        fontSize: "9px",
                        fontFamily: "monospace",
                        color: isDark ? "#64748B" : "#94A3B8",
                        textTransform: "uppercase",
                      }}
                    >
                      {cmd.category}
                    </span>
                    {cmd.shortcut && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontFamily: "monospace",
                          color: isDark ? "#38BDF8" : "#0284C7",
                          backgroundColor: isDark ? "rgba(32, 190, 255, 0.1)" : "#F0F9FF",
                          border: isDark ? "1px solid rgba(32, 190, 255, 0.3)" : "1px solid #BAE6FD",
                          padding: "1px 6px",
                          borderRadius: "2px",
                          fontWeight: 700,
                        }}
                      >
                        {cmd.shortcut}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 16px",
            backgroundColor: isDark ? "rgba(0,0,0,0.5)" : "#F8FAFC",
            borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #E2E8F0",
            fontSize: "10px",
            fontFamily: "monospace",
            color: isDark ? "#64748B" : "#94A3B8",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span style={{ color: isDark ? "#20BEFF" : "#0284C7" }}>
            JAYDEEP_HUD // SPOTLIGHT V2
          </span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes paletteFade {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
