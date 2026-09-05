"use client";

import React, { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

export default function AdminPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "config" | "skills" | "projects" | "experiences" | "inquiries" | "socials"
  >("config");

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Form states with authentic resume data
  const [config, setConfig] = useState({
    headline: "AI/ML SYSTEMS & COMPUTER VISION",
    subheadline:
      "B.Tech CSE student & AI developer. Engineering local-first spatial vision (Trinetra), autonomous LangGraph agent pipelines, and high-performance full-stack web applications.",
    cta_text: "EXPLORE PROJECTS",
    cta_link: "#projects",
    stat1_value: "LOCAL-FIRST",
    stat1_label: "Edge AI & Vision Perception",
    stat2_value: "< 28ms",
    stat2_label: "YOLO Inference Latency",
    video_opacity_dark: 1.0,
    video_opacity_light: 0.9,
  });

  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [socialProfiles, setSocialProfiles] = useState<any[]>([]);
  const [selectedSocialTab, setSelectedSocialTab] = useState<string>("instagram");
  const [editingSocial, setEditingSocial] = useState<any>({});

  // Editing modals / state
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [editingExp, setEditingExp] = useState<any | null>(null);

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth");
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
      if (data.authenticated) {
        fetchData();
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        setAuthError(data.error || "Incorrect password");
      }
    } catch (err: any) {
      setAuthError(err.message || "Failed to log in");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAuthenticated(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      const data = await res.json();
      if (data.config) {
        setConfig(data.config);
      }
      setSkills(data.skills || []);
      setProjects(data.projects || []);
      setExperiences(data.experiences || []);
      setInquiries(data.inquiries || []);
      if (data.social_profiles && data.social_profiles.length > 0) {
        setSocialProfiles(data.social_profiles);
        const curr =
          data.social_profiles.find((p: any) => p.id === selectedSocialTab) ||
          data.social_profiles[0];
        setEditingSocial(curr);
      }
    } catch (err) {
      console.error("Failed to load portfolio data", err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3500);
  };

  // ── Save Hero Config ──
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    showNotification("Saving config to Neon DB...");
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_config",
          data: config,
        }),
      });
      if (res.ok) {
        showNotification("✓ Hero config saved to Neon DB!");
      }
    } catch {
      showNotification("Failed to save config");
    }
  };

  // ── Skill Actions ──
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    showNotification("Saving skill to Neon DB...");
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upsert_skill",
          data: editingSkill,
        }),
      });
      if (res.ok) {
        showNotification("✓ Skill updated successfully!");
        setEditingSkill(null);
        fetchData();
      }
    } catch {
      showNotification("Failed to save skill");
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    showNotification("Deleting skill...");
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_skill", id }),
      });
      if (res.ok) {
        showNotification("✓ Skill deleted");
        fetchData();
      }
    } catch {
      showNotification("Failed to delete skill");
    }
  };

  // ── Project Actions ──
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    showNotification("Saving project to Neon DB...");
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upsert_project",
          data: editingProject,
        }),
      });
      if (res.ok) {
        showNotification("✓ Project saved to Neon DB!");
        setEditingProject(null);
        fetchData();
      }
    } catch {
      showNotification("Failed to save project");
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    showNotification("Deleting project...");
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_project", id }),
      });
      if (res.ok) {
        showNotification("✓ Project deleted");
        fetchData();
      }
    } catch {
      showNotification("Failed to delete project");
    }
  };

  // ── Experience Actions ──
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;
    showNotification("Saving milestone to Neon DB...");
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upsert_experience",
          data: editingExp,
        }),
      });
      if (res.ok) {
        showNotification("✓ Experience track saved!");
        setEditingExp(null);
        fetchData();
      }
    } catch {
      showNotification("Failed to save experience");
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this milestone?")) return;
    showNotification("Deleting milestone...");
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_experience", id }),
      });
      if (res.ok) {
        showNotification("✓ Milestone deleted");
        fetchData();
      }
    } catch {
      showNotification("Failed to delete experience");
    }
  };

  // ── Social Profile Actions ──
  const handleSelectSocialPlatform = (platformId: string) => {
    setSelectedSocialTab(platformId);
    const curr = socialProfiles.find((p: any) => p.id === platformId);
    if (curr) {
      setEditingSocial({
        ...curr,
        bio_lines_text: Array.isArray(curr.bio_lines)
          ? curr.bio_lines.join("\n")
          : curr.bio_lines || "",
      });
    }
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    showNotification(
      `Saving ${editingSocial.platform || editingSocial.id || "social"} profile to Neon DB...`
    );
    try {
      const lines =
        typeof editingSocial.bio_lines_text === "string"
          ? editingSocial.bio_lines_text
              .split("\n")
              .map((l: string) => l.trim())
              .filter(Boolean)
          : editingSocial.bio_lines;

      const payload = {
        ...editingSocial,
        bio_lines: lines,
      };

      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upsert_social_profile",
          data: payload,
        }),
      });
      if (res.ok) {
        showNotification("✓ Social profile updated in database");
        fetchData();
      } else {
        showNotification("Failed to save social profile");
      }
    } catch {
      showNotification("Failed to save social profile");
    }
  };

  // ── Common Cyber Card & Input Styling ──
  const cyberCardStyle: React.CSSProperties = {
    backgroundColor: isDark ? "rgba(10, 16, 26, 0.85)" : "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(16px)",
    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.1)"}`,
    boxShadow: isDark
      ? "0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05)"
      : "0 10px 30px rgba(0, 0, 0, 0.06), inset 0 0 0 1px rgba(0, 0, 0, 0.02)",
    borderRadius: "8px",
    position: "relative",
  };

  const cyberInputStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(241, 245, 249, 0.8)",
    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)"}`,
    color: isDark ? "#ffffff" : "#0F172A",
    padding: "10px 14px",
    borderRadius: "4px",
    fontSize: "13px",
    outline: "none",
    transition: "all 0.2s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: isDark ? "#94A3B8" : "#475569",
    marginBottom: "6px",
  };

  // ── Login Screen ──
  if (isAuthenticated === false || isAuthenticated === null) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: isDark ? "#02050A" : "#F8FAFC",
          backgroundImage: `linear-gradient(${isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)"} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          color: isDark ? "#ffffff" : "#0F172A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          position: "relative",
          userSelect: "none",
        }}
      >
        {/* Top Floating Controls */}
        <div
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 10,
          }}
        >
          <ThemeToggle />
          <a
            href="/"
            className="font-pixel"
            style={{
              padding: "8px 14px",
              fontSize: "11px",
              letterSpacing: "0.08em",
              color: isDark ? "#94A3B8" : "#475569",
              textDecoration: "none",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`,
              backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              borderRadius: "4px",
              transition: "all 0.2s ease",
            }}
          >
            ← RETURN TO SITE
          </a>
        </div>

        {/* Cyber Login Card */}
        <div
          style={{
            maxWidth: "460px",
            width: "100%",
            ...cyberCardStyle,
            padding: "40px",
            clipPath:
              "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
          }}
        >
          {/* Top Corner Reticles */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              className="font-pixel"
              style={{
                fontSize: "11px",
                color: "#38BDF8",
                letterSpacing: "0.15em",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "6px",
                  height: "6px",
                  backgroundColor: "#38BDF8",
                  borderRadius: "50%",
                  boxShadow: "0 0 8px #38BDF8",
                }}
              />
              // SECURE ACCESS GATEWAY
            </div>
            <span
              className="font-pixel"
              style={{
                fontSize: "9px",
                color: isDark ? "#64748B" : "#94A3B8",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                padding: "2px 6px",
                borderRadius: "2px",
              }}
            >
              PORT: 3000 // ROOT
            </span>
          </div>

          <h1
            className="font-chakra"
            style={{
              fontSize: "1.9rem",
              fontWeight: 700,
              margin: "0 0 8px 0",
              letterSpacing: "0.04em",
              color: isDark ? "#ffffff" : "#0F172A",
            }}
          >
            JAYDEEP CONTROL HUB
          </h1>

          <p
            style={{
              fontSize: "0.85rem",
              color: isDark ? "#94A3B8" : "#64748B",
              marginBottom: "28px",
              lineHeight: 1.55,
            }}
          >
            Authorized access only. Enter root credentials to manage projects, technical skills,
            career milestones, and telemetry.
          </p>

          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            <div>
              <label style={labelStyle}>Root Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter root password..."
                style={{
                  ...cyberInputStyle,
                  fontFamily: "monospace",
                  letterSpacing: "0.15em",
                  padding: "12px 14px",
                }}
              />
            </div>

            {authError && (
              <div
                className="font-pixel"
                style={{
                  color: "#EF4444",
                  fontSize: "11px",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  padding: "10px 14px",
                  borderRadius: "4px",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>⚠</span> {authError}
              </div>
            )}

            <button
              type="submit"
              className="wasp-btn font-pixel"
              style={{
                backgroundColor: isDark ? "#38BDF8" : "#0284C7",
                color: isDark ? "#02050A" : "#FFFFFF",
                fontWeight: 700,
                fontSize: "12px",
                letterSpacing: "0.12em",
                padding: "14px",
                border: "none",
                cursor: "pointer",
                marginTop: "6px",
                boxShadow: "0 0 20px rgba(56, 189, 248, 0.35)",
              }}
            >
              AUTHENTICATE ROOT SESSION →
            </button>
          </form>

          {/* Quick info footer */}
          <div
            className="font-pixel"
            style={{
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
              fontSize: "10px",
              color: isDark ? "#64748B" : "#94A3B8",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>STATUS: READY</span>
            <span>NEON POSTGRESQL</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Authenticated Dashboard View ──
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: isDark ? "#02050A" : "#F8FAFC",
        backgroundImage: `linear-gradient(${isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)"} 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
        color: isDark ? "#ffffff" : "#0F172A",
        padding: "0 0 60px 0",
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      {/* ── Top HUD SVG Line Bar (Exact Main Page Aesthetic) ── */}
      <div
        style={{
          width: "100%",
          height: "28px",
          overflow: "hidden",
          pointerEvents: "none",
          marginBottom: "-10px",
        }}
      >
        <svg
          style={{ width: "100%", height: "100%" }}
          preserveAspectRatio="none"
          viewBox="0 0 1440 28"
        >
          <path
            d="M 0,14 L 60,14 L 90,26 L 820,26 L 850,14 L 1440,14"
            fill="none"
            stroke={isDark ? "rgba(56, 189, 248, 0.4)" : "rgba(2, 132, 199, 0.3)"}
            strokeWidth={1.5}
          />
        </svg>
      </div>

      {/* ── Top Navigation Bar ── */}
      <header
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "16px clamp(16px, 4vw, 40px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
          backgroundColor: isDark ? "rgba(6, 10, 18, 0.85)" : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          borderRadius: "0 0 12px 12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                backgroundColor: "#10B981",
                borderRadius: "50%",
                boxShadow: "0 0 10px #10B981",
              }}
            />
            <span
              className="font-chakra"
              style={{
                fontSize: "1.35rem",
                fontWeight: 800,
                letterSpacing: "0.06em",
                color: isDark ? "#ffffff" : "#0F172A",
              }}
            >
              JAYDEEP <span style={{ color: "#38BDF8" }}>//</span> CONTROL HUB
            </span>
          </div>

          <span
            className="font-pixel"
            style={{
              fontSize: "10px",
              backgroundColor: isDark ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.1)",
              color: "#10B981",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              padding: "3px 8px",
              borderRadius: "3px",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            ● NEON DB CONNECTED
          </span>

          {loading && (
            <span
              className="font-pixel"
              style={{ fontSize: "11px", color: "#38BDF8", letterSpacing: "0.08em" }}
            >
              [ FETCHING TELEMETRY... ]
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <ThemeToggle />

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-pixel"
            style={{
              fontSize: "11px",
              color: isDark ? "#94A3B8" : "#475569",
              textDecoration: "none",
              padding: "8px 14px",
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
              border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"}`,
              borderRadius: "4px",
              letterSpacing: "0.06em",
              transition: "all 0.2s ease",
            }}
          >
            LIVE PORTFOLIO ↗
          </a>

          <button
            onClick={handleLogout}
            className="font-pixel"
            style={{
              fontSize: "11px",
              color: "#EF4444",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              padding: "8px 14px",
              borderRadius: "4px",
              cursor: "pointer",
              letterSpacing: "0.06em",
              fontWeight: 700,
              transition: "all 0.2s ease",
            }}
          >
            LOGOUT ✕
          </button>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main style={{ maxWidth: "1400px", margin: "32px auto 0", padding: "0 clamp(16px, 4vw, 40px)" }}>
        {/* ── Cyber Tabs Bar ── */}
        <nav
          aria-label="Admin Sections"
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "28px",
            flexWrap: "wrap",
            borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
            paddingBottom: "14px",
          }}
        >
          {[
            { id: "config", label: "⚡ HERO & TELEMETRY", count: null },
            { id: "skills", label: "🛠️ SKILLS MATRIX", count: skills.length },
            { id: "projects", label: "🚀 PROJECTS", count: projects.length },
            { id: "experiences", label: "📈 CAREER TRACK", count: experiences.length },
            { id: "socials", label: "📱 SOCIAL PROFILES", count: socialProfiles.length || 3 },
            { id: "inquiries", label: "📬 INBOX", count: inquiries.length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="wasp-btn font-pixel"
                style={{
                  backgroundColor: isActive
                    ? isDark
                      ? "rgba(56, 189, 248, 0.18)"
                      : "rgba(2, 132, 199, 0.12)"
                    : isDark
                    ? "rgba(255, 255, 255, 0.03)"
                    : "rgba(0, 0, 0, 0.02)",
                  color: isActive
                    ? isDark
                      ? "#38BDF8"
                      : "#0284C7"
                    : isDark
                    ? "#94A3B8"
                    : "#64748B",
                  border: `1px solid ${
                    isActive
                      ? isDark
                        ? "#38BDF8"
                        : "#0284C7"
                      : isDark
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)"
                  }`,
                  padding: "9px 18px",
                  fontSize: "11px",
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                  fontWeight: isActive ? 700 : 500,
                  boxShadow: isActive
                    ? isDark
                      ? "0 0 16px rgba(56, 189, 248, 0.25)"
                      : "0 0 12px rgba(2, 132, 199, 0.15)"
                    : "none",
                }}
              >
                {tab.label} {tab.count !== null && `[${tab.count}]`}
              </button>
            );
          })}
        </nav>

        {/* ── TAB 1: HERO & GENERAL CONFIG ── */}
        {activeTab === "config" && (
          <div
            style={{
              ...cyberCardStyle,
              padding: "32px",
              maxWidth: "880px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <h2
                  className="font-chakra"
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    margin: "0 0 4px 0",
                    color: isDark ? "#ffffff" : "#0F172A",
                  }}
                >
                  HERO SECTION &amp; TELEMETRY CONFIG
                </h2>
                <p style={{ color: isDark ? "#94A3B8" : "#64748B", fontSize: "13px", margin: 0 }}>
                  Customize main hero headline, statistics, badges, and background video opacity.
                </p>
              </div>
              <span
                className="font-pixel"
                style={{
                  fontSize: "10px",
                  color: "#38BDF8",
                  padding: "4px 8px",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  borderRadius: "3px",
                }}
              >
                CONFIG-01
              </span>
            </div>

            <form onSubmit={handleSaveConfig} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={labelStyle}>MAIN HERO HEADLINE</label>
                <input
                  type="text"
                  value={config.headline}
                  onChange={(e) => setConfig({ ...config, headline: e.target.value })}
                  style={cyberInputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>SUBTITLE / PROFESSIONAL BIO SUMMARY</label>
                <textarea
                  rows={3}
                  value={config.subheadline}
                  onChange={(e) => setConfig({ ...config, subheadline: e.target.value })}
                  style={{ ...cyberInputStyle, resize: "vertical", lineHeight: 1.5 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>CALL TO ACTION TEXT</label>
                  <input
                    type="text"
                    value={config.cta_text}
                    onChange={(e) => setConfig({ ...config, cta_text: e.target.value })}
                    style={cyberInputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>CALL TO ACTION LINK TARGET</label>
                  <input
                    type="text"
                    value={config.cta_link}
                    onChange={(e) => setConfig({ ...config, cta_link: e.target.value })}
                    style={cyberInputStyle}
                  />
                </div>
              </div>

              {/* Stats Metrics */}
              <div
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
                  borderRadius: "6px",
                  padding: "20px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <label style={labelStyle}>STAT 1 VALUE (e.g. LOCAL-FIRST)</label>
                  <input
                    type="text"
                    value={config.stat1_value}
                    onChange={(e) => setConfig({ ...config, stat1_value: e.target.value })}
                    style={cyberInputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>STAT 1 LABEL (e.g. Edge AI Perception)</label>
                  <input
                    type="text"
                    value={config.stat1_label}
                    onChange={(e) => setConfig({ ...config, stat1_label: e.target.value })}
                    style={cyberInputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>STAT 2 VALUE (e.g. &lt; 28ms)</label>
                  <input
                    type="text"
                    value={config.stat2_value}
                    onChange={(e) => setConfig({ ...config, stat2_value: e.target.value })}
                    style={cyberInputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>STAT 2 LABEL (e.g. YOLO Inference Latency)</label>
                  <input
                    type="text"
                    value={config.stat2_label}
                    onChange={(e) => setConfig({ ...config, stat2_label: e.target.value })}
                    style={cyberInputStyle}
                  />
                </div>
              </div>

              {/* Background Video Controls */}
              <div
                style={{
                  backgroundColor: isDark ? "rgba(56, 189, 248, 0.04)" : "rgba(2, 132, 199, 0.04)",
                  border: `1px solid ${isDark ? "rgba(56, 189, 248, 0.2)" : "rgba(2, 132, 199, 0.2)"}`,
                  borderRadius: "6px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="font-chakra" style={{ fontSize: "1rem", color: "#38BDF8", fontWeight: 700 }}>
                    🎥 HERO VIDEO OPACITY TELEMETRY
                  </span>
                  <span className="font-pixel" style={{ fontSize: "10px", color: isDark ? "#94A3B8" : "#64748B" }}>
                    REAL-TIME SYNC
                  </span>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <label style={{ fontSize: "11px", color: isDark ? "#E2E8F0" : "#334155", fontWeight: 600 }}>
                      🌙 Dark Mode Video Opacity
                    </label>
                    <span style={{ fontSize: "12px", color: "#38BDF8", fontWeight: 700 }}>
                      {Math.round((Number(config.video_opacity_dark) ?? 1) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="1.0"
                    step="0.05"
                    value={config.video_opacity_dark ?? 1.0}
                    onChange={(e) =>
                      setConfig({ ...config, video_opacity_dark: parseFloat(e.target.value) })
                    }
                    style={{ width: "100%", accentColor: "#38BDF8", cursor: "pointer" }}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <label style={{ fontSize: "11px", color: isDark ? "#E2E8F0" : "#334155", fontWeight: 600 }}>
                      ☀️ Light Mode Video Opacity
                    </label>
                    <span style={{ fontSize: "12px", color: "#38BDF8", fontWeight: 700 }}>
                      {Math.round((Number(config.video_opacity_light) ?? 0.9) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="1.0"
                    step="0.05"
                    value={config.video_opacity_light ?? 0.9}
                    onChange={(e) =>
                      setConfig({ ...config, video_opacity_light: parseFloat(e.target.value) })
                    }
                    style={{ width: "100%", accentColor: "#38BDF8", cursor: "pointer" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="wasp-btn font-pixel"
                style={{
                  backgroundColor: isDark ? "#38BDF8" : "#0284C7",
                  color: isDark ? "#02050A" : "#FFFFFF",
                  padding: "12px 28px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  alignSelf: "flex-start",
                  boxShadow: "0 0 16px rgba(56, 189, 248, 0.35)",
                }}
              >
                COMMIT HERO CONFIG TO NEON DB →
              </button>
            </form>
          </div>
        )}

        {/* ── TAB 2: SKILLS MATRIX ── */}
        {activeTab === "skills" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 className="font-chakra" style={{ fontSize: "1.4rem", margin: "0 0 4px 0", color: isDark ? "#ffffff" : "#0F172A" }}>
                  TECHNICAL ARSENAL MATRIX
                </h2>
                <p style={{ color: isDark ? "#94A3B8" : "#64748B", fontSize: "13px", margin: 0 }}>
                  Manage verified machine learning frameworks, computer vision libraries, and web tech.
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingSkill({
                    id: "",
                    name: "",
                    level: 90,
                    category: "ai",
                    code: "AI-NEW // TECH",
                    tagline: "",
                    tags: "PyTorch, CUDA",
                    sort_order: skills.length + 1,
                  })
                }
                className="wasp-btn font-pixel"
                style={{
                  backgroundColor: isDark ? "#38BDF8" : "#0284C7",
                  color: isDark ? "#000000" : "#FFFFFF",
                  padding: "9px 18px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  boxShadow: "0 0 14px rgba(56, 189, 248, 0.3)",
                }}
              >
                + ADD NEW ARSENAL NODE
              </button>
            </div>

            {/* Skill Modal Form */}
            {editingSkill && (
              <div
                style={{
                  ...cyberCardStyle,
                  border: "1.5px solid #38BDF8",
                  padding: "26px",
                  marginBottom: "28px",
                }}
              >
                <h3 className="font-chakra" style={{ fontSize: "1.2rem", marginBottom: "16px", color: "#38BDF8" }}>
                  {editingSkill.id ? "EDIT ARSENAL NODE" : "REGISTER NEW ARSENAL NODE"}
                </h3>
                <form onSubmit={handleSaveSkill} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Skill Name</label>
                    <input
                      type="text"
                      required
                      value={editingSkill.name}
                      onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Proficiency ({editingSkill.level}%)</label>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={editingSkill.level}
                      onChange={(e) => setEditingSkill({ ...editingSkill, level: Number(e.target.value) })}
                      style={{ width: "100%", accentColor: "#38BDF8", marginTop: "10px" }}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Category</label>
                    <select
                      value={editingSkill.category}
                      onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                      style={cyberInputStyle}
                    >
                      <option value="frontend">Frontend & UI Engineering</option>
                      <option value="ai">AI / Computer Vision & Agents</option>
                      <option value="backend">Backend & Database Systems</option>
                      <option value="devops">DevOps & Edge Deployment</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>HUD Code (e.g. AI-01 // VISION)</label>
                    <input
                      type="text"
                      value={editingSkill.code}
                      onChange={(e) => setEditingSkill({ ...editingSkill, code: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>

                  <div style={{ gridColumn: "span 2" }}>
                    <label style={labelStyle}>Tagline / Technical Scope</label>
                    <input
                      type="text"
                      value={editingSkill.tagline}
                      onChange={(e) => setEditingSkill({ ...editingSkill, tagline: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>

                  <div style={{ gridColumn: "span 2" }}>
                    <label style={labelStyle}>Tags (Comma Separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(editingSkill.tags) ? editingSkill.tags.join(", ") : editingSkill.tags}
                      onChange={(e) => setEditingSkill({ ...editingSkill, tags: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>

                  <div style={{ gridColumn: "span 2", display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button
                      type="submit"
                      className="wasp-btn font-pixel"
                      style={{ backgroundColor: "#38BDF8", color: "#000", padding: "9px 20px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "11px" }}
                    >
                      SAVE SKILL NODE →
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSkill(null)}
                      className="font-pixel"
                      style={{
                        backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                        color: isDark ? "#fff" : "#000",
                        padding: "9px 20px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "11px",
                      }}
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Skills Grid List */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
              {skills.map((s) => (
                <div
                  key={s.id}
                  style={{
                    ...cyberCardStyle,
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "160px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 700, fontSize: "1.1rem", color: isDark ? "#ffffff" : "#0F172A" }}>{s.name}</span>
                      <span className="font-pixel" style={{ color: "#38BDF8", fontWeight: 700 }}>{s.level}%</span>
                    </div>
                    <div className="font-pixel" style={{ fontSize: "10px", color: isDark ? "#94A3B8" : "#64748B", marginBottom: "6px" }}>
                      {s.category?.toUpperCase()} · {s.code}
                    </div>
                    <div style={{ fontSize: "12px", color: isDark ? "#CBD5E1" : "#334155", lineHeight: 1.4 }}>{s.tagline}</div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "14px", paddingTop: "10px", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
                    <button
                      onClick={() => setEditingSkill(s)}
                      className="font-pixel"
                      style={{
                        backgroundColor: "rgba(56, 189, 248, 0.15)",
                        color: "#38BDF8",
                        border: "1px solid #38BDF8",
                        padding: "5px 12px",
                        borderRadius: "3px",
                        fontSize: "11px",
                        cursor: "pointer",
                      }}
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(s.id)}
                      className="font-pixel"
                      style={{
                        backgroundColor: "rgba(239, 68, 68, 0.15)",
                        color: "#EF4444",
                        border: "1px solid #EF4444",
                        padding: "5px 12px",
                        borderRadius: "3px",
                        fontSize: "11px",
                        cursor: "pointer",
                      }}
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: PROJECTS ── */}
        {activeTab === "projects" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 className="font-chakra" style={{ fontSize: "1.4rem", margin: "0 0 4px 0", color: isDark ? "#ffffff" : "#0F172A" }}>
                  FLAGSHIP PROJECTS &amp; AI SYSTEMS
                </h2>
                <p style={{ color: isDark ? "#94A3B8" : "#64748B", fontSize: "13px", margin: 0 }}>
                  Manage deployed systems (Trinetra, LangGraph Planner, etc.), metrics, demo videos, and image galleries.
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingProject({
                    id: "",
                    title: "",
                    codename: "SYS // CORE",
                    category: "vision",
                    tagline: "",
                    description: "",
                    architecture: "Local Edge YOLO inference\nSpatial proximity warning\nZero-latency voice feedback",
                    metrics: [
                      { label: "Inference", value: "< 28ms" },
                      { label: "Accuracy", value: "96.8%" },
                      { label: "Mode", value: "Local Edge" },
                    ],
                    tags: "Python, YOLO, OpenCV, PyTorch, Edge AI",
                    video_url: "",
                    images: "",
                    linkedin_url: "",
                    users_count: "Edge Device Ready",
                    github_url: "https://github.com/jay-123-oss",
                    live_url: "",
                    featured: true,
                  })
                }
                className="wasp-btn font-pixel"
                style={{
                  backgroundColor: isDark ? "#38BDF8" : "#0284C7",
                  color: isDark ? "#000000" : "#FFFFFF",
                  padding: "9px 18px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  boxShadow: "0 0 14px rgba(56, 189, 248, 0.3)",
                }}
              >
                + ADD NEW PROJECT
              </button>
            </div>

            {/* Project Modal Form */}
            {editingProject && (
              <div
                style={{
                  ...cyberCardStyle,
                  border: "1.5px solid #38BDF8",
                  padding: "26px",
                  marginBottom: "28px",
                }}
              >
                <h3 className="font-chakra" style={{ fontSize: "1.2rem", marginBottom: "16px", color: "#38BDF8" }}>
                  {editingProject.id ? "EDIT PROJECT SPECIFICATION" : "REGISTER NEW PROJECT"}
                </h3>
                <form onSubmit={handleSaveProject} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Project Title / Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Codename (e.g. TRINETRA // VISION)</label>
                    <input
                      type="text"
                      value={editingProject.codename}
                      onChange={(e) => setEditingProject({ ...editingProject, codename: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Category</label>
                    <select
                      value={editingProject.category}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      style={cyberInputStyle}
                    >
                      <option value="vision">Computer Vision & Edge AI</option>
                      <option value="llm">Autonomous LLM & Agents</option>
                      <option value="distributed">Distributed ML / Analytics</option>
                      <option value="fullstack">Full-Stack AI Web Apps</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Audience / Impact Metric</label>
                    <input
                      type="text"
                      placeholder="e.g. Edge Hardware Tested / Real-Time"
                      value={editingProject.users_count || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, users_count: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>🎥 Demo Video URL (MP4 direct link)</label>
                    <input
                      type="text"
                      placeholder="https://example.com/demo.mp4"
                      value={editingProject.video_url || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, video_url: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>💼 LinkedIn Post URL</label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/posts/..."
                      value={editingProject.linkedin_url || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, linkedin_url: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>🐙 GitHub Repository URL</label>
                    <input
                      type="text"
                      placeholder="https://github.com/jay-123-oss/..."
                      value={editingProject.github_url || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>🚀 Live Deployment URL</label>
                    <input
                      type="text"
                      placeholder="https://trinetra.example.com"
                      value={editingProject.live_url || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, live_url: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>

                  <div style={{ gridColumn: "span 2" }}>
                    <label style={labelStyle}>🖼️ Project Images (1 URL per line)</label>
                    <textarea
                      rows={3}
                      placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                      value={Array.isArray(editingProject.images) ? editingProject.images.join("\n") : editingProject.images || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, images: e.target.value })}
                      style={{ ...cyberInputStyle, fontFamily: "monospace", fontSize: "11px" }}
                    />
                  </div>

                  <div style={{ gridColumn: "span 2" }}>
                    <label style={labelStyle}>Tagline / One-Liner Summary</label>
                    <input
                      type="text"
                      value={editingProject.tagline}
                      onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>

                  <div style={{ gridColumn: "span 2" }}>
                    <label style={labelStyle}>Full Project Description &amp; Problem Solved</label>
                    <textarea
                      rows={3}
                      value={editingProject.description || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      style={{ ...cyberInputStyle, lineHeight: 1.5 }}
                    />
                  </div>

                  <div style={{ gridColumn: "span 2" }}>
                    <label style={labelStyle}>Technologies (Comma Separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(editingProject.tags) ? editingProject.tags.join(", ") : editingProject.tags || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>

                  <div style={{ gridColumn: "span 2", display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button
                      type="submit"
                      className="wasp-btn font-pixel"
                      style={{ backgroundColor: "#38BDF8", color: "#000", padding: "9px 20px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "11px" }}
                    >
                      COMMIT PROJECT SPEC →
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="font-pixel"
                      style={{
                        backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                        color: isDark ? "#fff" : "#000",
                        padding: "9px 20px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "11px",
                      }}
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Projects Grid List */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
              {projects.map((p) => (
                <div
                  key={p.id}
                  style={{
                    ...cyberCardStyle,
                    padding: "22px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "220px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span className="font-pixel" style={{ fontSize: "11px", color: "#38BDF8" }}>
                        {p.codename} · {p.category?.toUpperCase()}
                      </span>
                      {p.users_count && (
                        <span className="font-pixel" style={{ fontSize: "10px", color: "#10B981", backgroundColor: "rgba(16, 185, 129, 0.15)", padding: "2px 6px", borderRadius: "3px" }}>
                          ⚡ {p.users_count}
                        </span>
                      )}
                    </div>
                    <h3 className="font-chakra" style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 8px 0", color: isDark ? "#ffffff" : "#0F172A" }}>
                      {p.title}
                    </h3>
                    <p style={{ fontSize: "12px", color: isDark ? "#94A3B8" : "#64748B", lineHeight: 1.45, margin: "0 0 14px 0" }}>
                      {p.tagline}
                    </p>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                      {p.video_url && (
                        <span className="font-pixel" style={{ fontSize: "10px", color: "#F59E0B", border: "1px solid rgba(245, 158, 11, 0.4)", padding: "2px 6px", borderRadius: "3px" }}>
                          🎥 Video Demo
                        </span>
                      )}
                      {Array.isArray(p.images) && p.images.length > 0 && (
                        <span className="font-pixel" style={{ fontSize: "10px", color: "#38BDF8", border: "1px solid rgba(56, 189, 248, 0.4)", padding: "2px 6px", borderRadius: "3px" }}>
                          🖼️ {p.images.length} Images
                        </span>
                      )}
                      {p.github_url && (
                        <span className="font-pixel" style={{ fontSize: "10px", color: "#A855F7", border: "1px solid rgba(168, 85, 247, 0.4)", padding: "2px 6px", borderRadius: "3px" }}>
                          🐙 Repo
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", paddingTop: "12px", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
                    <button
                      onClick={() => setEditingProject(p)}
                      className="font-pixel"
                      style={{ backgroundColor: "rgba(56, 189, 248, 0.15)", color: "#38BDF8", border: "1px solid #38BDF8", padding: "5px 12px", borderRadius: "3px", fontSize: "11px", cursor: "pointer" }}
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="font-pixel"
                      style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#EF4444", border: "1px solid #EF4444", padding: "5px 12px", borderRadius: "3px", fontSize: "11px", cursor: "pointer" }}
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: EXPERIENCES / MILESTONES ── */}
        {activeTab === "experiences" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 className="font-chakra" style={{ fontSize: "1.4rem", margin: "0 0 4px 0", color: isDark ? "#ffffff" : "#0F172A" }}>
                  TECHNICAL EXPERIENCE &amp; APPLIED TRACK
                </h2>
                <p style={{ color: isDark ? "#94A3B8" : "#64748B", fontSize: "13px", margin: 0 }}>
                  Manage verified engineering tracks (Internships, Core Systems, Autonomous Agent Pipelines).
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingExp({
                    id: "",
                    role: "AI / ML Systems Engineer",
                    company: "Autonomous AI Lab",
                    location: "India / Remote",
                    period: "2024 — PRESENT",
                    badge: "ACTIVE PRODUCTION",
                    overview: "Engineering local-first perception and agentic execution pipelines.",
                    achievements: "Architected real-time edge vision system\nEngineered autonomous LangGraph travel planner\nImplemented multi-modal RAG index",
                    technologies: "Python, YOLO, LangGraph, Next.js, PyTorch",
                  })
                }
                className="wasp-btn font-pixel"
                style={{
                  backgroundColor: isDark ? "#38BDF8" : "#0284C7",
                  color: isDark ? "#000000" : "#FFFFFF",
                  padding: "9px 18px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  boxShadow: "0 0 14px rgba(56, 189, 248, 0.3)",
                }}
              >
                + ADD NEW TRACK MILESTONE
              </button>
            </div>

            {/* Experience Edit Form */}
            {editingExp && (
              <div
                style={{
                  ...cyberCardStyle,
                  border: "1.5px solid #38BDF8",
                  padding: "26px",
                  marginBottom: "28px",
                }}
              >
                <h3 className="font-chakra" style={{ fontSize: "1.2rem", marginBottom: "16px", color: "#38BDF8" }}>
                  {editingExp.id ? "EDIT ENGINEERING MILESTONE" : "REGISTER NEW MILESTONE"}
                </h3>
                <form onSubmit={handleSaveExperience} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Role Title</label>
                    <input
                      type="text"
                      required
                      value={editingExp.role}
                      onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Company &amp; Location</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        placeholder="Company / Org"
                        value={editingExp.company}
                        onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                        style={{ ...cyberInputStyle, flex: 1 }}
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={editingExp.location}
                        onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                        style={{ ...cyberInputStyle, flex: 1 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Period (e.g. 2024 — PRESENT)</label>
                    <input
                      type="text"
                      value={editingExp.period}
                      onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Badge (e.g. VERIFIED APPLIED TRACK)</label>
                    <input
                      type="text"
                      value={editingExp.badge}
                      onChange={(e) => setEditingExp({ ...editingExp, badge: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>

                  <div style={{ gridColumn: "span 2" }}>
                    <label style={labelStyle}>Role Overview</label>
                    <textarea
                      rows={2}
                      value={editingExp.overview}
                      onChange={(e) => setEditingExp({ ...editingExp, overview: e.target.value })}
                      style={{ ...cyberInputStyle, lineHeight: 1.5 }}
                    />
                  </div>

                  <div style={{ gridColumn: "span 2" }}>
                    <label style={labelStyle}>Key Engineering Deliverables (One per line)</label>
                    <textarea
                      rows={3}
                      value={Array.isArray(editingExp.achievements) ? editingExp.achievements.join("\n") : editingExp.achievements}
                      onChange={(e) => setEditingExp({ ...editingExp, achievements: e.target.value })}
                      style={{ ...cyberInputStyle, lineHeight: 1.5 }}
                    />
                  </div>

                  <div style={{ gridColumn: "span 2" }}>
                    <label style={labelStyle}>Technologies Used (Comma Separated)</label>
                    <input
                      type="text"
                      value={editingExp.technologies || ""}
                      onChange={(e) => setEditingExp({ ...editingExp, technologies: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>

                  <div style={{ gridColumn: "span 2", display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button
                      type="submit"
                      className="wasp-btn font-pixel"
                      style={{ backgroundColor: "#38BDF8", color: "#000", padding: "9px 20px", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "11px" }}
                    >
                      COMMIT MILESTONE →
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingExp(null)}
                      className="font-pixel"
                      style={{
                        backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                        color: isDark ? "#fff" : "#000",
                        padding: "9px 20px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "11px",
                      }}
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Experiences List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  style={{
                    ...cyberCardStyle,
                    padding: "20px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "16px",
                  }}
                >
                  <div style={{ maxWidth: "80%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
                      <h3 className="font-chakra" style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, color: isDark ? "#ffffff" : "#0F172A" }}>
                        {exp.role}
                      </h3>
                      {exp.badge && (
                        <span className="font-pixel" style={{ fontSize: "10px", color: "#38BDF8", backgroundColor: "rgba(56, 189, 248, 0.12)", border: "1px solid rgba(56, 189, 248, 0.3)", padding: "2px 8px", borderRadius: "2px" }}>
                          {exp.badge}
                        </span>
                      )}
                    </div>
                    <div className="font-pixel" style={{ fontSize: "11px", color: isDark ? "#94A3B8" : "#64748B", marginBottom: "6px" }}>
                      {exp.company} · {exp.location} · {exp.period}
                    </div>
                    <div style={{ fontSize: "13px", color: isDark ? "#CBD5E1" : "#334155", lineHeight: 1.5 }}>
                      {exp.overview}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => setEditingExp(exp)}
                      className="font-pixel"
                      style={{ backgroundColor: "rgba(56, 189, 248, 0.15)", color: "#38BDF8", border: "1px solid #38BDF8", padding: "5px 12px", borderRadius: "3px", fontSize: "11px", cursor: "pointer" }}
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="font-pixel"
                      style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#EF4444", border: "1px solid #EF4444", padding: "5px 12px", borderRadius: "3px", fontSize: "11px", cursor: "pointer" }}
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: INBOX (TRANSMISSIONS) ── */}
        {activeTab === "inquiries" && (
          <div
            style={{
              ...cyberCardStyle,
              padding: "32px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 className="font-chakra" style={{ fontSize: "1.4rem", margin: 0, color: isDark ? "#ffffff" : "#0F172A" }}>
                INCOMING TRANSMISSION INBOX
              </h2>
              <span className="font-pixel" style={{ fontSize: "11px", color: "#38BDF8" }}>
                TOTAL: {inquiries.length} MESSAGES
              </span>
            </div>

            {inquiries.length === 0 ? (
              <div
                className="font-pixel"
                style={{
                  color: isDark ? "#94A3B8" : "#64748B",
                  fontSize: "12px",
                  padding: "40px",
                  textAlign: "center",
                  border: `1px dashed ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`,
                  borderRadius: "6px",
                }}
              >
                // NO INQUIRIES RECEIVED YET. DISPATCHES FROM PORTFOLIO CONTACT FORM WILL APPEAR HERE.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    style={{
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
                      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
                      borderRadius: "6px",
                      padding: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <span className="font-chakra" style={{ fontWeight: 700, color: "#38BDF8", fontSize: "15px" }}>
                        {inq.name} <span style={{ fontSize: "13px", color: isDark ? "#94A3B8" : "#64748B" }}>&lt;{inq.email}&gt;</span>
                      </span>
                      <span className="font-pixel" style={{ fontSize: "11px", color: isDark ? "#94A3B8" : "#64748B" }}>
                        {new Date(inq.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ fontSize: "13px", color: isDark ? "#ffffff" : "#0F172A", fontWeight: 700, marginBottom: "6px" }}>
                      SUBJECT: {inq.subject}
                    </div>
                    <div style={{ fontSize: "13px", color: isDark ? "#CBD5E1" : "#334155", lineHeight: 1.55 }}>
                      {inq.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 6: SOCIAL PHONE FRAMES TELEMETRY ── */}
        {activeTab === "socials" && (
          <div
            style={{
              ...cyberCardStyle,
              padding: "32px",
              maxWidth: "960px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <h2 className="font-chakra" style={{ fontSize: "1.4rem", margin: 0, color: isDark ? "#ffffff" : "#0F172A" }}>
                  SMARTPHONE SOCIAL TELEMETRY &amp; PROFILES
                </h2>
                <p style={{ color: isDark ? "#94A3B8" : "#64748B", fontSize: "12px", margin: "4px 0 0 0" }}>
                  Live sync data for the 3 phone displays: metrics, thought bubble, bio lines, and links.
                </p>
              </div>

              {/* Platform switcher pills */}
              <div style={{ display: "flex", gap: "8px" }}>
                {[
                  { id: "instagram", label: "📸 INSTAGRAM", color: "#E1306C" },
                  { id: "github", label: "🐙 GITHUB", color: "#A855F7" },
                  { id: "linkedin", label: "💼 LINKEDIN", color: "#0A66C2" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectSocialPlatform(p.id)}
                    className="wasp-btn font-pixel"
                    style={{
                      backgroundColor:
                        selectedSocialTab === p.id ? `${p.color}33` : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                      border: `1.5px solid ${selectedSocialTab === p.id ? p.color : isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
                      color: selectedSocialTab === p.id ? (isDark ? "#ffffff" : "#000000") : isDark ? "#94A3B8" : "#64748B",
                      padding: "7px 14px",
                      fontSize: "11px",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveSocial} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Identity Group */}
              <div
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
                  padding: "20px",
                  borderRadius: "6px",
                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <label style={labelStyle}>USERNAME</label>
                  <input
                    type="text"
                    value={editingSocial.username || ""}
                    onChange={(e) => setEditingSocial({ ...editingSocial, username: e.target.value })}
                    style={cyberInputStyle}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>DISPLAY NAME</label>
                  <input
                    type="text"
                    value={editingSocial.display_name || ""}
                    onChange={(e) => setEditingSocial({ ...editingSocial, display_name: e.target.value })}
                    style={cyberInputStyle}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>CATEGORY / OCCUPATION</label>
                  <input
                    type="text"
                    value={editingSocial.category || ""}
                    onChange={(e) => setEditingSocial({ ...editingSocial, category: e.target.value })}
                    style={cyberInputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>THOUGHT BUBBLE STATUS</label>
                  <input
                    type="text"
                    value={editingSocial.thought_bubble || ""}
                    onChange={(e) => setEditingSocial({ ...editingSocial, thought_bubble: e.target.value })}
                    style={cyberInputStyle}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
                  <input
                    type="checkbox"
                    id="verified-checkbox"
                    checked={editingSocial.verified ?? true}
                    onChange={(e) => setEditingSocial({ ...editingSocial, verified: e.target.checked })}
                    style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#38BDF8" }}
                  />
                  <label htmlFor="verified-checkbox" style={{ fontSize: "12px", color: isDark ? "#E2E8F0" : "#334155", cursor: "pointer" }}>
                    Show Blue Verified Badge ☑
                  </label>
                </div>
              </div>

              {/* Metrics Group */}
              <div
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
                  padding: "20px",
                  borderRadius: "6px",
                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <label style={labelStyle}>POSTS / REPOS COUNT</label>
                  <input
                    type="text"
                    value={editingSocial.posts_count || "0"}
                    onChange={(e) => setEditingSocial({ ...editingSocial, posts_count: e.target.value })}
                    style={cyberInputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>FOLLOWERS COUNT</label>
                  <input
                    type="text"
                    value={editingSocial.followers_count || "0"}
                    onChange={(e) => setEditingSocial({ ...editingSocial, followers_count: e.target.value })}
                    style={cyberInputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>FOLLOWING COUNT</label>
                  <input
                    type="text"
                    value={editingSocial.following_count || "0"}
                    onChange={(e) => setEditingSocial({ ...editingSocial, following_count: e.target.value })}
                    style={cyberInputStyle}
                  />
                </div>
              </div>

              {/* Bio & Link Group */}
              <div
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
                  padding: "20px",
                  borderRadius: "6px",
                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div>
                  <label style={labelStyle}>BIO LINES (One line per row)</label>
                  <textarea
                    rows={4}
                    value={
                      editingSocial.bio_lines_text !== undefined
                        ? editingSocial.bio_lines_text
                        : Array.isArray(editingSocial.bio_lines)
                        ? editingSocial.bio_lines.join("\n")
                        : editingSocial.bio_lines || ""
                    }
                    onChange={(e) => setEditingSocial({ ...editingSocial, bio_lines_text: e.target.value })}
                    style={{ ...cyberInputStyle, lineHeight: 1.55 }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>EXTERNAL LINK (🔗)</label>
                    <input
                      type="text"
                      value={editingSocial.external_link || ""}
                      onChange={(e) => setEditingSocial({ ...editingSocial, external_link: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>PROFESSIONAL DASHBOARD VIEWS (↗)</label>
                    <input
                      type="text"
                      value={editingSocial.views_30days || ""}
                      onChange={(e) => setEditingSocial({ ...editingSocial, views_30days: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>MUSIC AUDIO TRACK (▷)</label>
                    <input
                      type="text"
                      value={editingSocial.music_track || ""}
                      onChange={(e) => setEditingSocial({ ...editingSocial, music_track: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>THREADS / DEV HANDLE (@)</label>
                    <input
                      type="text"
                      value={editingSocial.threads_handle || ""}
                      onChange={(e) => setEditingSocial({ ...editingSocial, threads_handle: e.target.value })}
                      style={cyberInputStyle}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="wasp-btn font-pixel"
                style={{
                  backgroundColor: isDark ? "#38BDF8" : "#0284C7",
                  color: isDark ? "#02050A" : "#FFFFFF",
                  fontWeight: 700,
                  border: "none",
                  padding: "14px 28px",
                  fontSize: "12px",
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                  boxShadow: "0 0 20px rgba(56, 189, 248, 0.35)",
                  alignSelf: "flex-start",
                }}
              >
                COMMIT {editingSocial.platform?.toUpperCase() || "SOCIAL"} TELEMETRY →
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ── System Toast Alert (HUD Floating Notification) ── */}
      {saveStatus && (
        <aside
          role="status"
          aria-live="polite"
          className="font-pixel"
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            backgroundColor: isDark ? "rgba(10, 20, 35, 0.95)" : "rgba(255, 255, 255, 0.98)",
            border: "1.5px solid #38BDF8",
            color: isDark ? "#38BDF8" : "#0284C7",
            padding: "12px 20px",
            borderRadius: "6px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(56, 189, 248, 0.3)",
            fontSize: "12px",
            letterSpacing: "0.08em",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "fadeIn 0.2s ease-in-out",
          }}
        >
          <span style={{ fontSize: "14px" }}>⚡</span>
          <span>{saveStatus}</span>
        </aside>
      )}
    </div>
  );
}
