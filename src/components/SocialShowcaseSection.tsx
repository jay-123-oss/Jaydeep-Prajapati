"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

interface HighlightItem {
  title: string;
  isAdd?: boolean;
  image?: string;
}

interface SocialProfileData {
  id: string;
  platform: string;
  username: string;
  display_name: string;
  verified: boolean;
  category: string;
  profile_pic: string;
  thought_bubble: string;
  bio?: string;
  bio_lines?: string[];
  external_link: string;
  threads_handle: string;
  music_track: string;
  posts_count: string;
  followers_count: string;
  following_count: string;
  views_30days: string;
  highlights: any[];
  empty_title: string;
  empty_subtitle: string;
}

const DEFAULT_INSTAGRAM: SocialProfileData = {
  id: "instagram",
  platform: "instagram",
  username: "jaydeep.prajapati_18",
  display_name: "Er. Jaydeep Prajapati",
  verified: true,
  category: "Digital creator",
  profile_pic: "/instagram/avatar.png",
  thought_bubble: "Make this space yours...",
  bio_lines: [
    "❤️🚩jay shree Ram 🚩",
    "🤔A man without EGO , is not a man.",
    "⚠️ Currently busy turning my dreams into reality.",
  ],
  external_link: "www.instagram.com/websetu.32?igsh=MTJwdXI3enBqd...",
  threads_handle: "jaydeep.prajapati_18",
  music_track: "Jannat · B Praak",
  posts_count: "0",
  followers_count: "279",
  following_count: "258",
  views_30days: "762 views in the last 30 days.",
  highlights: [
    { title: "New", isAdd: true },
    { id: 1, title: "# college", video: "/instagram/reel_1.mp4" },
    { id: 2, title: "💗", video: "/instagram/reel_2.mp4" },
    { id: 3, title: "😉", video: "/instagram/reel_3.mp4" },
    { id: 4, title: "Real diamond 💎", video: "/instagram/reel_4.mp4" },
    { id: 5, title: "Memories ✨", video: "/instagram/reel_5.mp4" },
    { id: 6, title: "Vibes 🔥", video: "/instagram/reel_6.mp4" },
    { id: 7, title: "Friends 🤝", video: "/instagram/reel_7.mp4" },
    { id: 8, title: "Life 🌟", video: "/instagram/reel_8.mp4" },
  ],
  empty_title: "Capture and Share the World",
  empty_subtitle: "Share your photos and videos. When you share, they will show up on your profile.",
};

const DEFAULT_LINKEDIN: SocialProfileData = {
  id: "linkedin",
  platform: "linkedin",
  username: "jaydeep-prajapati-a97988358",
  display_name: "Jaydeep--- (jay) ---Prajapati",
  verified: true,
  category: "python Devloper | Machine learning |MySQL | MongoDB |Computer vision| web Devloper | Git & Github | Data science | Data analyst | FastApi | Docker | AWS | Gen ai learning.....",
  profile_pic: "/linkedin/avatar.png",
  thought_bubble: "Verify in 2 minutes",
  bio_lines: [
    "python Devloper | Machine learning |MySQL | MongoDB |Computer vision| web Devloper | Git & Github | Data science | Data analyst | FastApi | Docker | AWS | Gen ai learning.....",
  ],
  external_link: "https://www.linkedin.com/in/jaydeep-prajapati-a97988358/",
  threads_handle: "jaydeep-prajapati",
  music_track: "AI Engineering",
  posts_count: "491",
  followers_count: "491",
  following_count: "500+",
  views_30days: "30 profile views",
  highlights: [],
  empty_title: "Showcase your work with projects",
  empty_subtitle: "Add one manually or import it from a connected apps. Members with projects receive more views.",
};

const DEFAULT_GITHUB: SocialProfileData = {
  id: "github",
  platform: "github",
  username: "jay-123-oss",
  display_name: "Er. Jaydeep Prajapati",
  verified: true,
  category: "Python & Web Developer",
  profile_pic: "/linkedin/avatar.png",
  thought_bubble: "Focusing",
  bio_lines: [
    "💻 Python & Web Developer | 🚀 Learning AI & Automation |",
    "✨ Sharing code & building projects",
  ],
  external_link: "/Jaydeep_Prajapati_Resume_Strict1Page.pdf",
  threads_handle: "jay-123-oss",
  music_track: "Open Source",
  posts_count: "25",
  followers_count: "7",
  following_count: "31",
  views_30days: "7 followers · 31 following",
  highlights: [],
  empty_title: "jay-123-oss / README.md",
  empty_subtitle: "JAAYDEEP PRAJAPATI",
};

export default function SocialShowcaseSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Tab filter: "all" | "instagram" | "linkedin" | "github"
  const [activeTab, setActiveTab] = useState<"all" | "instagram" | "linkedin" | "github">("all");

  // Real-time dynamic clock
  const [currentTime, setCurrentTime] = useState<string>("11:20");

  // Profiles from database
  const [profiles, setProfiles] = useState<Record<string, SocialProfileData>>({
    instagram: DEFAULT_INSTAGRAM,
    linkedin: DEFAULT_LINKEDIN,
    github: DEFAULT_GITHUB,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setActiveTab("instagram");
    }
  }, []);

  // Active sub-tab inside Instagram feed (grid, reels, repost, tagged)
  const [activeFeedTab, setActiveFeedTab] = useState<"grid" | "reels" | "repost" | "tagged">("grid");

  // Fetch live profiles from Neon DB
  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const data = await res.json();
          if (data.social_profiles && Array.isArray(data.social_profiles)) {
            const map: Record<string, SocialProfileData> = {
              instagram: DEFAULT_INSTAGRAM,
              linkedin: DEFAULT_LINKEDIN,
              github: DEFAULT_GITHUB,
            };
            data.social_profiles.forEach((p: any) => {
              let parsedBio: string[] = [];
              if (Array.isArray(p.bio_lines) && p.bio_lines.length > 0) {
                parsedBio = p.bio_lines;
              } else if (typeof p.bio_lines === "string") {
                try {
                  parsedBio = JSON.parse(p.bio_lines);
                } catch {
                  parsedBio = [p.bio_lines];
                }
              } else if (typeof p.bio === "string") {
                parsedBio = p.bio.split("\n").map((l: string) => l.trim()).filter(Boolean);
              }

              let parsedHighlights: any[] = [];
              if (Array.isArray(p.highlights) && p.highlights.length > 0) {
                parsedHighlights = p.highlights;
              } else if (typeof p.highlights === "string") {
                try {
                  parsedHighlights = JSON.parse(p.highlights);
                } catch {
                  parsedHighlights = [];
                }
              }

              map[p.id] = {
                ...p,
                bio_lines: parsedBio.length > 0 ? parsedBio : map[p.id]?.bio_lines,
                highlights: parsedHighlights.length > 0 ? parsedHighlights : map[p.id]?.highlights,
              };
            });
            setProfiles(map);
          }
        }
      } catch (err) {
        console.error("Failed to load social profiles", err);
      }
    };
    fetchSocials();
  }, []);

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      hours = hours % 12 || 12;
      const formatted = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
      setCurrentTime(formatted);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3 Mobile Phones in order:
  // 1. Instagram (Left)
  // 2. LinkedIn (MIDDLE - exact match with new screenshot)
  // 3. GitHub (Right - exact match with new screenshot)
  const phoneConfigs = [
    {
      id: "instagram",
      title: "Instagram",
      tag: "SYS_FEED // INSTA_01",
      handle: profiles.instagram?.username ? `@${profiles.instagram.username}` : "@jaydeep.prajapati_18",
      url: profiles.instagram?.external_link
        ? profiles.instagram.external_link.startsWith("http")
          ? profiles.instagram.external_link
          : `https://${profiles.instagram.external_link}`
        : "https://www.instagram.com/jaydeep.prajapati_18",
      accentColor: "#E1306C",
      gradientBorder: "linear-gradient(135deg, #F58529, #DD2A7B, #8134AF, #515BD4)",
      glowColor: "rgba(225, 48, 108, 0.35)",
      data: profiles.instagram || DEFAULT_INSTAGRAM,
    },
    {
      id: "linkedin",
      title: "LinkedIn",
      tag: "NET_PRO // LINK_02",
      handle: profiles.linkedin?.username ? `@${profiles.linkedin.username}` : "@jaydeep-prajapati",
      url: profiles.linkedin?.external_link
        ? profiles.linkedin.external_link.startsWith("http")
          ? profiles.linkedin.external_link
          : `https://${profiles.linkedin.external_link}`
        : "https://linkedin.com/in/jaydeep-prajapati",
      accentColor: "#0A66C2",
      gradientBorder: "linear-gradient(135deg, #0284C7, #0A66C2, #38BDF8)",
      glowColor: "rgba(10, 102, 194, 0.35)",
      data: profiles.linkedin || DEFAULT_LINKEDIN,
    },
    {
      id: "github",
      title: "GitHub",
      tag: "DEV_CORE // GIT_03",
      handle: profiles.github?.username ? `@${profiles.github.username}` : "@jay-123-oss",
      url: profiles.github?.external_link
        ? profiles.github.external_link.startsWith("http")
          ? profiles.github.external_link
          : `https://${profiles.github.external_link}`
        : "https://github.com/jay-123-oss",
      accentColor: "#58A6FF",
      gradientBorder: "linear-gradient(135deg, #1F6FEB, #58A6FF, #A371F7)",
      glowColor: "rgba(88, 166, 255, 0.35)",
      data: profiles.github || DEFAULT_GITHUB,
    },
  ];

  if (!mounted) {
    return (
      <section
        id="social-showcase"
        style={{
          width: "100%",
          minHeight: "400px",
          backgroundColor: "var(--bg-primary)",
        }}
      />
    );
  }

  return (
    <section
      id="social-showcase"
      style={{
        width: "100%",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        position: "relative",
        overflow: "hidden",
        padding: "24px 16px 36px 16px",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Background Cyber Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: "1480px",
          width: "100%",
          margin: "0 auto",
          position: "relative",
          zIndex: 20,
        }}
      >
        {/* ── Section Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "14px",
            marginBottom: "16px",
          }}
        >
          <div>
            {/* Status Tag */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#0A66C2",
                  boxShadow: "0 0 10px #0A66C2",
                  display: "inline-block",
                }}
              />
              <span
                className="font-pixel"
                style={{
                  fontSize: "11px",
                  color: isDark ? "#20BEFF" : "#0284C7",
                  letterSpacing: "0.14em",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                // 03. SOCIAL TELEMETRY MATRIX
              </span>
            </div>

            <h2
              className="font-chakra"
              style={{
                fontSize: "clamp(1.7rem, 3.2vw, 2.5rem)",
                fontWeight: 800,
                color: isDark ? "#ffffff" : "#0F172A",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              LIVE APPS &amp; DIGITAL PRESENCE
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                color: isDark ? "#94A3B8" : "#475569",
                marginTop: "6px",
                maxWidth: "680px",
                lineHeight: 1.5,
              }}
            >
              Interactive real-time smartphone frames showcasing live social channels. Scroll inside each phone to inspect complete live profiles, bio, badges, and readmes.
            </p>
          </div>

          {/* Platform Filter Buttons */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {[
              { id: "all", label: "ALL PLATFORMS", desktopOnly: true },
              { id: "instagram", label: "📸 INSTAGRAM" },
              { id: "linkedin", label: "💼 LINKEDIN" },
              { id: "github", label: "🐙 GITHUB" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  type="button"
                  suppressHydrationWarning
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={tab.desktopOnly ? "hidden md:inline-block" : "inline-block"}
                  style={{
                    backgroundColor: isActive
                      ? isDark
                        ? "rgba(32, 190, 255, 0.18)"
                        : "#E0F2FE"
                      : isDark
                      ? "rgba(255, 255, 255, 0.04)"
                      : "#F1F5F9",
                    border: isActive
                      ? isDark
                        ? "1.5px solid #20BEFF"
                        : "1.5px solid #0284C7"
                      : isDark
                      ? "1px solid rgba(255,255,255,0.12)"
                      : "1px solid #CBD5E1",
                    color: isActive
                      ? isDark
                        ? "#20BEFF"
                        : "#0369A1"
                      : isDark
                      ? "#94A3B8"
                      : "#475569",
                    padding: "6px 14px",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    cursor: "pointer",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    boxShadow: isActive ? "0 0 14px rgba(32, 190, 255, 0.3)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 3 Mobile Phone Frames Grid (iPhone 17 Pro Max Proportions) ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "28px",
            justifyContent: "center",
            alignItems: "start",
          }}
        >
          {phoneConfigs
            .filter((p) => activeTab === "all" || activeTab === p.id)
            .map((platform) => {
              return (
                <div
                  key={platform.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {/* Platform Title & Link Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      maxWidth: "360px",
                      padding: "0 6px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: platform.accentColor,
                          boxShadow: `0 0 10px ${platform.accentColor}`,
                        }}
                      />
                      <span
                        className="font-pixel"
                        style={{
                          fontSize: "12px",
                          fontWeight: 800,
                          color: isDark ? "#ffffff" : "#0F172A",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {platform.title}
                      </span>
                    </div>

                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "11px",
                        fontFamily: "monospace",
                        color: platform.accentColor,
                        fontWeight: 700,
                        textDecoration: "none",
                        letterSpacing: "0.06em",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        border: `1px solid ${platform.accentColor}55`,
                        padding: "2px 8px",
                        backgroundColor: `${platform.accentColor}11`,
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = platform.accentColor;
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `${platform.accentColor}11`;
                        e.currentTarget.style.color = platform.accentColor;
                      }}
                    >
                      OPEN APP ↗
                    </a>
                  </div>

                  {/* ════════════════════════════════════════════════════════════════
                      IPHONE 17 PRO MAX TITANIUM FLAGSHIP DEVICE FRAME
                      Height: 765px (Authentic 19.5:9 6.9-inch screen ratio)
                     ════════════════════════════════════════════════════════════════ */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      maxWidth: "360px",
                      height: "727px",
                      borderRadius: "46px",
                      padding: "3px",
                      background: platform.gradientBorder,
                      boxShadow: `0 0 30px ${platform.glowColor}, 0 20px 50px rgba(0,0,0,0.45)`,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                  >
                    {/* Left: Action Button */}
                    <div
                      style={{
                        position: "absolute",
                        left: "-4px",
                        top: "115px",
                        width: "3px",
                        height: "26px",
                        backgroundColor: platform.accentColor,
                        borderTopLeftRadius: "2px",
                        borderBottomLeftRadius: "2px",
                        boxShadow: `0 0 6px ${platform.accentColor}`,
                      }}
                    />
                    {/* Left: Volume Up */}
                    <div
                      style={{
                        position: "absolute",
                        left: "-4px",
                        top: "155px",
                        width: "3px",
                        height: "48px",
                        backgroundColor: platform.accentColor,
                        borderTopLeftRadius: "2px",
                        borderBottomLeftRadius: "2px",
                      }}
                    />
                    {/* Left: Volume Down */}
                    <div
                      style={{
                        position: "absolute",
                        left: "-4px",
                        top: "215px",
                        width: "3px",
                        height: "48px",
                        backgroundColor: platform.accentColor,
                        borderTopLeftRadius: "2px",
                        borderBottomLeftRadius: "2px",
                      }}
                    />

                    {/* Right: Side / Siri Button */}
                    <div
                      style={{
                        position: "absolute",
                        right: "-4px",
                        top: "150px",
                        width: "3px",
                        height: "68px",
                        backgroundColor: platform.accentColor,
                        borderTopRightRadius: "2px",
                        borderBottomRightRadius: "2px",
                      }}
                    />
                    {/* Right: Camera Control Button (iPhone 16 / 17 Pro Max feature) */}
                    <div
                      style={{
                        position: "absolute",
                        right: "-3.5px",
                        top: "260px",
                        width: "2.5px",
                        height: "40px",
                        backgroundColor: platform.accentColor,
                        borderRadius: "1.5px",
                        opacity: 0.85,
                      }}
                    />

                    {/* Inner Titanium Bezel */}
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        borderRadius: "43px",
                        padding: "2.5px",
                        backgroundColor: isDark ? "#0A0F1D" : "#1A202C",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                      }}
                    >
                      {/* ── PHONE SCREEN VIEWPORT ── */}
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                          borderRadius: "40px",
                          backgroundColor:
                            platform.id === "linkedin"
                              ? "#FFFFFF"
                              : platform.id === "github"
                              ? "#0D1117"
                              : "#FFFFFF",
                          color:
                            platform.id === "linkedin"
                              ? "#18181B"
                              : platform.id === "github"
                              ? "#E6EDF3"
                              : "#000000",
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                          boxShadow: "inset 0 0 12px rgba(0,0,0,0.2)",
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                        }}
                      >
                        {/* Dynamic Island Pill (iPhone 17 Pro Max) */}
                        <div
                          style={{
                            position: "absolute",
                            top: "8px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "96px",
                            height: "26px",
                            backgroundColor: "#000000",
                            borderRadius: "20px",
                            zIndex: 100,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 10px",
                            pointerEvents: "none",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.6)",
                          }}
                        >
                          <div
                            style={{
                              width: "9px",
                              height: "9px",
                              borderRadius: "50%",
                              backgroundColor: "#111827",
                              border: "1.5px solid rgba(255,255,255,0.25)",
                            }}
                          />
                          <div
                            style={{
                              width: "6.5px",
                              height: "6.5px",
                              borderRadius: "50%",
                              backgroundColor: "#064E3B",
                              opacity: 0.7,
                            }}
                          />
                        </div>

                        {/* Bottom Home Bar (iPhone 17 Pro Max) */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "6px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "120px",
                            height: "4px",
                            backgroundColor:
                              platform.id === "github"
                                ? "rgba(255,255,255,0.5)"
                                : "rgba(0,0,0,0.35)",
                            borderRadius: "2px",
                            zIndex: 90,
                            pointerEvents: "none",
                          }}
                        />

                        {/* SWITCH BY PLATFORM */}
                        {platform.id === "linkedin" ? (
                          <LinkedInMobileScreen
                            profile={platform.data}
                            currentTime={currentTime}
                          />
                        ) : platform.id === "github" ? (
                          <GitHubMobileScreen
                            profile={platform.data}
                            currentTime={currentTime}
                          />
                        ) : (
                          <InstagramMobileScreen
                            profile={platform.data}
                            currentTime={currentTime}
                            activeFeedTab={activeFeedTab}
                            setActiveFeedTab={setActiveFeedTab}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. LINKEDIN MOBILE SCREEN (UPDATED ACCORDING TO NEW SCREENSHOT)
// ═══════════════════════════════════════════════════════════════════════════════
function LinkedInMobileScreen({
  profile,
  currentTime,
}: {
  profile: SocialProfileData;
  currentTime: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        color: "#18181B",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── 1. ANDROID STATUS BAR (11:20 • ⏰ • VoLTE • 5G+ • 51%) ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 14px 4px 14px",
          fontSize: "11px",
          fontWeight: 600,
          color: "#1F2937",
          backgroundColor: "#FFFFFF",
          zIndex: 50,
          flexShrink: 0,
        }}
      >
        {/* Left: 11:20 + location paper plane icon */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span style={{ fontSize: "11.5px", fontWeight: 700 }}>11:20</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
        </div>

        {/* Center: Camera punch-hole */}
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "#000000",
            border: "1px solid rgba(0,0,0,0.1)",
          }}
        />

        {/* Right: Alarm, Network/VoLTE, 5G+, 51% */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <svg width="10.5" height="10.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2 2" />
            <path d="M5 3 2 6" />
            <path d="m22 6-3-3" />
          </svg>
          <div
            style={{
              border: "1px solid #6B7280",
              borderRadius: "2px",
              padding: "0 1.5px",
              fontSize: "6.5px",
              fontWeight: 800,
              height: "9.5px",
              lineHeight: "9.5px",
            }}
          >
            Vo
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5px" }}>
            <span style={{ fontSize: "7.5px", fontWeight: 800 }}>5G+</span>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
              <rect x="2" y="17" width="3.5" height="5" rx="1" />
              <rect x="8" y="12" width="3.5" height="10" rx="1" />
              <rect x="14" y="7" width="3.5" height="15" rx="1" />
              <rect x="20" y="2" width="3.5" height="20" rx="1" />
            </svg>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <span style={{ fontSize: "10px", fontWeight: 700 }}>51%</span>
            <svg width="13" height="10" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="1" y="1" width="19" height="12" rx="2.5" />
              <rect x="3" y="3" width="9" height="8" rx="1" fill="currentColor" />
              <path d="M22 5v4" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── 2. LINKEDIN TOP SEARCH / APP HEADER (← 🔍 I'm looking for... ⚙) ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "6px 12px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
          flexShrink: 0,
        }}
      >
        {/* Back arrow ← */}
        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            color: "#18181B",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        {/* Search Pill Input */}
        <div
          style={{
            flex: 1,
            height: "34px",
            backgroundColor: "#EEF3F8",
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: "8px",
            border: "1px solid #D0D7DE",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: 500 }}>
            I'm looking for...
          </span>
        </div>

        {/* Settings Gear ⚙ */}
        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            color: "#18181B",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </svg>
        </button>
      </div>

      {/* ── 3. SCROLLABLE PROFILE CONTAINER ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* ── COVER BANNER (Exact 3D black box + logo from Image 3) ── */}
        <div
          style={{
            height: "115px",
            width: "100%",
            position: "relative",
            backgroundColor: "#16191D",
            overflow: "hidden",
          }}
        >
          {/* Left: Architectural Logo + LOGO text */}
          <div
            style={{
              position: "absolute",
              left: "20px",
              top: "22px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <svg width="28" height="26" viewBox="0 0 32 32" fill="none" stroke="#FFFFFF" strokeWidth="1.8">
              <path d="M6 26V14l4-3v15" />
              <path d="M10 26V8l6-4v22" />
              <path d="M16 26V12l6-3v17" />
              <path d="M22 26V16l4-2v12" />
              <line x1="4" y1="26" x2="28" y2="26" strokeWidth="2" />
            </svg>
            <span
              style={{
                fontSize: "6px",
                color: "#9CA3AF",
                letterSpacing: "0.2em",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              LOGO
            </span>
          </div>

          {/* 3D Perspective Box Graphic */}
          <div
            style={{
              position: "absolute",
              right: "0px",
              top: "10px",
              width: "235px",
              height: "100px",
              backgroundColor: "#20252C",
              boxShadow: "-8px 8px 16px rgba(0,0,0,0.55)",
              borderTopLeftRadius: "6px",
              borderBottomLeftRadius: "6px",
              padding: "10px 14px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                fontSize: "10.5px",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "0.22em",
                textAlign: "right",
              }}
            >
              J A Y D E E P
            </div>
            <div
              style={{
                fontSize: "10.5px",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "0.18em",
                textAlign: "right",
                marginTop: "1px",
              }}
            >
              P R A J A P A T I
            </div>
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.7)",
                borderRadius: "3px",
                padding: "1px 6px",
                fontSize: "7px",
                color: "#E5E7EB",
                letterSpacing: "0.18em",
                marginTop: "4px",
                fontWeight: 700,
              }}
            >
              DEVELOPER
            </div>
            <div
              style={{
                fontSize: "6.5px",
                color: "rgba(255,255,255,0.6)",
                fontFamily: "monospace",
                letterSpacing: "0.08em",
                marginTop: "6px",
                textAlign: "right",
              }}
            >
              JAYDEEP_PRAJAPATI_RESUME.PDF
            </div>
          </div>

          {/* Edit pencil icon at top right of banner */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "12px",
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              cursor: "pointer",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth="2.5">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
          </div>
        </div>

        {/* ── PROFILE BODY SECTION ── */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: "0 14px 14px 14px",
            position: "relative",
          }}
        >
          {/* Avatar Row + Right-side LinkedIn Logo & Edit Pencil */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginTop: "-46px",
              marginBottom: "8px",
            }}
          >
            {/* Circular Avatar with authentic #OPENTOWORK emerald green arc banner */}
            <div
              style={{
                position: "relative",
                width: "92px",
                height: "92px",
                flexShrink: 0,
              }}
            >
              {/* Inner Photo */}
              <div
                style={{
                  position: "absolute",
                  inset: "3px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2.5px solid #FFFFFF",
                  backgroundColor: "#E5E7EB",
                  zIndex: 2,
                }}
              >
                <img
                  src={profile.profile_pic || "/linkedin/avatar.png"}
                  onError={(e) => {
                    e.currentTarget.src = "/profile_logo.png";
                  }}
                  alt={profile.display_name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              {/* #OPENTOWORK SVG Green Arc Ribbon */}
              <svg
                viewBox="0 0 100 100"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 4,
                  pointerEvents: "none",
                }}
              >
                <defs>
                  <path
                    id="openToWorkPath2"
                    d="M 11,48 A 39,39 0 0,0 89,48"
                    fill="none"
                  />
                </defs>
                <path
                  d="M 9,48 A 41,41 0 0,0 91,48"
                  fill="none"
                  stroke="#057642"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <text
                  fill="#FFFFFF"
                  fontSize="6.8"
                  fontWeight="900"
                  letterSpacing="0.4px"
                  fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                >
                  <textPath href="#openToWorkPath2" startOffset="50%" textAnchor="middle">
                    #OPENTOWORK
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Right Top Icons: Gold/Brown LinkedIn box + Pencil edit icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                paddingBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "4px",
                  backgroundColor: "#C37D16",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "14px",
                  lineHeight: 1,
                  fontFamily: "sans-serif",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                in
              </div>
              <div style={{ cursor: "pointer", color: "#374151" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
              </div>
            </div>
          </div>

          {/* ── Name and Pronouns ── */}
          <div style={{ marginTop: "2px" }}>
            <h1
              style={{
                fontSize: "19px",
                fontWeight: 800,
                color: "#18181B",
                margin: 0,
                lineHeight: 1.25,
                letterSpacing: "-0.2px",
                display: "inline",
              }}
            >
              {profile.display_name || "Jaydeep--- (jay) ---Prajapati"}
            </h1>
            <span
              style={{
                fontSize: "12.5px",
                color: "#71717A",
                marginLeft: "6px",
                fontWeight: 400,
              }}
            >
              He/Him
            </span>
          </div>

          {/* ── Verification Badge: (🛡️ Verify in 2 minutes) ── */}
          <div style={{ marginTop: "6px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                border: "1.2px dashed #0A66C2",
                borderRadius: "16px",
                padding: "2px 10px",
                color: "#0A66C2",
                fontSize: "11.5px",
                fontWeight: 700,
                cursor: "pointer",
                backgroundColor: "rgba(10, 102, 194, 0.03)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A66C2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <span>Verify in 2 minutes</span>
            </div>
          </div>

          {/* ── Headline / Bio ── */}
          <div
            style={{
              fontSize: "12.5px",
              fontWeight: 600,
              color: "#1F2937",
              lineHeight: 1.35,
              marginTop: "7px",
            }}
          >
            {profile.category ||
              "python Devloper | Machine learning |MySQL | MongoDB |Computer vision| web Devloper | Git & Github | Data science | Data analyst | FastApi | Docker | AWS | Gen ai learning....."}
          </div>

          {/* ── Current Org & College ── */}
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#374151",
              marginTop: "5px",
            }}
          >
            web-setu • s. p. jain gurukul khurai
          </div>

          {/* ── Location ── */}
          <div style={{ fontSize: "11.5px", color: "#6B7280", marginTop: "2px" }}>
            Sagar, Madhya Pradesh, India
          </div>

          {/* ── Connections ── */}
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#0A66C2",
              marginTop: "4px",
              cursor: "pointer",
            }}
          >
            {profile.followers_count ? `${profile.followers_count} connections` : "491 connections"}
          </div>

          {/* ── Action Buttons Row 1: Open to | Add section | ··· ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            <button
              type="button"
              suppressHydrationWarning
              style={{
                flex: 1,
                height: "34px",
                backgroundColor: "#0A66C2",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "18px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Open to
            </button>

            <button
              type="button"
              suppressHydrationWarning
              style={{
                flex: 1,
                height: "34px",
                backgroundColor: "#FFFFFF",
                color: "#0A66C2",
                border: "1.5px solid #0A66C2",
                borderRadius: "18px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Add section
            </button>

            <button
              type="button"
              suppressHydrationWarning
              style={{
                width: "34px",
                height: "34px",
                backgroundColor: "#FFFFFF",
                color: "#374151",
                border: "1px solid #9CA3AF",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>
          </div>

          {/* ── Action Button Row 2: Add custom button ── */}
          <button
            type="button"
            suppressHydrationWarning
            style={{
              width: "100%",
              height: "34px",
              backgroundColor: "#FFFFFF",
              color: "#0A66C2",
              border: "1.5px solid #0A66C2",
              borderRadius: "18px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              marginTop: "7px",
            }}
          >
            Add custom button
          </button>

          {/* ── Swipeable Cards ── */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              marginTop: "12px",
              paddingBottom: "2px",
              scrollbarWidth: "none",
            }}
          >
            <div
              style={{
                flex: "0 0 240px",
                backgroundColor: "#EDF3F8",
                borderRadius: "8px",
                padding: "10px 12px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#18181B" }}>
                  Open to work • <span style={{ fontWeight: 500, color: "#4B5563" }}>Everyone on LinkedIn</span>
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.2">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
              </div>
              <div style={{ fontSize: "11px", color: "#374151", fontWeight: 500 }}>
                India | On-site • Hybrid • Remote
              </div>
              <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#0A66C2", cursor: "pointer", marginTop: "2px" }}>
                Show details
              </div>
            </div>

            <div
              style={{
                flex: "0 0 200px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                padding: "10px 12px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#18181B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Showcase your servi...
              </div>
              <div style={{ fontSize: "11px", color: "#4B5563", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                profile so your busin...
              </div>
              <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#0A66C2", cursor: "pointer", marginTop: "2px" }}>
                Add services
              </div>
            </div>
          </div>

          {/* ── Gray Section Divider Bar ── */}
          <div
            style={{
              height: "8px",
              backgroundColor: "#EBEAE5",
              margin: "14px -14px 12px -14px",
            }}
          />

          {/* ── Section: Suggested for you ── */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#111827" }}>
                Suggested for you
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#6B7280" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>Private to you</span>
              </div>
            </div>

            <div
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                padding: "12px",
                marginTop: "8px",
                position: "relative",
              }}
            >
              <div style={{ position: "absolute", top: "10px", right: "10px", cursor: "pointer", color: "#6B7280" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "6px",
                    backgroundColor: "#EDF3F8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.8">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <div style={{ paddingRight: "16px" }}>
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#111827", lineHeight: 1.25 }}>
                    Showcase your work with projects
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "11px", color: "#4B5563", lineHeight: 1.4, marginTop: "8px" }}>
                Add one manually or import it from a connected apps. Members with projects receive more views.
              </div>

              <button
                type="button"
                suppressHydrationWarning
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "#1F2937",
                  border: "1.5px solid #1F2937",
                  borderRadius: "18px",
                  padding: "5px 14px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Add project
              </button>
            </div>
          </div>

          {/* ── Gray Section Divider Bar ── */}
          <div
            style={{
              height: "8px",
              backgroundColor: "#EBEAE5",
              margin: "14px -14px 12px -14px",
            }}
          />

          {/* ── Section: Analytics ── */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#111827" }}>
                Analytics
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#6B7280" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>Private to you</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#374151">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#111827" }}>
                  30 profile views
                </div>
                <div style={{ fontSize: "11px", color: "#6B7280" }}>
                  Discover who's viewed your profile.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. ANDROID GESTURE NAVIGATION BAR ── */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "6px 0 4px 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "96px",
            height: "3.5px",
            borderRadius: "2px",
            backgroundColor: "#9CA3AF",
          }}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. GITHUB MOBILE SCREEN (100% PIXEL-PERFECT FROM USER SCREENSHOTS 1 TO 5)
// ═══════════════════════════════════════════════════════════════════════════════
function GitHubMobileScreen({
  profile,
  currentTime,
}: {
  profile: SocialProfileData;
  currentTime: string;
}) {
  const [activeGitTab, setActiveGitTab] = useState<"overview" | "repositories" | "projects">("overview");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const PINNED_REPOS = [
    {
      name: "python-project",
      desc: "ehis is my first python project repo.",
      lang: "Python",
      langColor: "#3572A5",
      stars: 3,
      forks: 0,
      isPublic: true,
      url: "https://github.com/jay-123-oss/python-project",
    },
    {
      name: "Python-and-data-Analysis-",
      desc: "Welcome to my Data Analysis repository, where I explore real-world datasets using Python and libraries like Pandas, NumPy, and Matplotlib. This repo contains step-by-step examples of data cleaning,...",
      lang: "Jupyter Notebook",
      langColor: "#DA5B0B",
      stars: 3,
      forks: 0,
      isPublic: true,
      url: "https://github.com/jay-123-oss/Python-and-data-Analysis-",
    },
    {
      name: "jay-123-oss",
      desc: "",
      lang: "",
      langColor: "",
      stars: 3,
      forks: 0,
      isPublic: true,
      url: "https://github.com/jay-123-oss/jay-123-oss",
    },
    {
      name: "music-player",
      desc: "",
      lang: "JavaScript",
      langColor: "#F1E05A",
      stars: 3,
      forks: 0,
      isPublic: true,
      url: "https://github.com/jay-123-oss/music-player",
    },
    {
      name: "Chatbot",
      desc: "",
      lang: "Python",
      langColor: "#3572A5",
      stars: 3,
      forks: 2,
      isPublic: true,
      url: "https://github.com/jay-123-oss/Chatbot",
    },
    {
      name: "machine-learning-",
      desc: "“Supervised ML classification project with feature engineering, model training, hyperparameter tuning, and detailed performance evaluation.”",
      lang: "Python",
      langColor: "#3572A5",
      stars: 2,
      forks: 0,
      isPublic: true,
      url: "https://github.com/jay-123-oss/machine-learning-",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0D1117",
        color: "#E6EDF3",
        position: "relative",
        overflow: "hidden",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
      }}
    >
      {/* ── 1. GITHUB TOP APP BAR (☰  GitHub  jay-123-oss  🔍  Inbox  Avatar) ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "7px 10px 5px 10px",
          backgroundColor: "#0D1117",
          borderBottom: "1px solid #21262D",
          flexShrink: 0,
        }}
      >
        {/* Left: Hamburger menu + GitHub Logo + Username */}
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "6px",
              border: "1px solid #30363D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="#E6EDF3">
              <path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h12.5a.75.75 0 010 1.5H1.75A.75.75 0 011 2.75zm0 5A.75.75 0 011.75 7h12.5a.75.75 0 010 1.5H1.75A.75.75 0 011 7.75zM1.75 12a.75.75 0 000 1.5h12.5a.75.75 0 000-1.5H1.75z" />
            </svg>
          </div>

          <svg width="24" height="24" viewBox="0 0 16 16" fill="#FFFFFF">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
          </svg>

          <span style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>
            jay-123-oss
          </span>
        </div>

        {/* Right: Search, Notifications Inbox with blue dot, User Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "6px",
              border: "1px solid #30363D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="#8B949E">
              <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z" />
            </svg>
          </div>

          <div
            style={{
              position: "relative",
              width: "26px",
              height: "26px",
              borderRadius: "6px",
              border: "1px solid #30363D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="#8B949E">
              <path d="M2.8 2.06A1.75 1.75 0 0 1 4.41 1h7.18c.7 0 1.33.41 1.61 1.06l1.7 3.97H10.5a.75.75 0 0 0-.6.3L8.65 8.1a.25.25 0 0 1-.2 0L7.1 6.33a.75.75 0 0 0-.6-.3H1.1l1.7-3.97Zm-1.7 5.44h4.38l1.35 1.8a1.75 1.75 0 0 0 1.39.7h.06a1.75 1.75 0 0 0 1.39-.7l1.35-1.8h4.38v5.75A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25V7.5Z" />
            </svg>
            <span
              style={{
                position: "absolute",
                top: "-2px",
                right: "-2px",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#1F6FEB",
                border: "1px solid #0D1117",
              }}
            />
          </div>

          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "1px solid #30363D",
            }}
          >
            <img
              src={profile.profile_pic || "/linkedin/avatar.png"}
              alt="Avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      {/* ── 2. TABS BAR (Overview | Repositories 25 | Projects | More ▾) ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "0 12px",
          borderBottom: "1px solid #21262D",
          backgroundColor: "#0D1117",
          fontSize: "12.5px",
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        <div
          onClick={() => setActiveGitTab("overview")}
          style={{
            padding: "8px 0",
            color: activeGitTab === "overview" ? "#FFFFFF" : "#8B949E",
            borderBottom: activeGitTab === "overview" ? "2px solid #F78166" : "2px solid transparent",
            cursor: "pointer",
          }}
        >
          Overview
        </div>

        <div
          onClick={() => setActiveGitTab("repositories")}
          style={{
            padding: "8px 0",
            color: activeGitTab === "repositories" ? "#FFFFFF" : "#8B949E",
            borderBottom: activeGitTab === "repositories" ? "2px solid #F78166" : "2px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
          }}
        >
          <span>Repositories</span>
          <span
            style={{
              backgroundColor: "#21262D",
              color: "#E6EDF3",
              borderRadius: "10px",
              padding: "0 5px",
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            25
          </span>
        </div>

        <div
          onClick={() => setActiveGitTab("projects")}
          style={{
            padding: "8px 0",
            color: activeGitTab === "projects" ? "#FFFFFF" : "#8B949E",
            borderBottom: activeGitTab === "projects" ? "2px solid #F78166" : "2px solid transparent",
            cursor: "pointer",
          }}
        >
          Projects
        </div>

        <div style={{ padding: "8px 0", color: "#8B949E", display: "flex", alignItems: "center", gap: "3px", cursor: "pointer" }}>
          <span>More</span>
          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
            <path d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z" />
          </svg>
        </div>
      </div>

      {/* ── 3. SCROLLABLE GITHUB PROFILE BODY ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "14px 12px 24px 12px",
          scrollbarWidth: "thin",
          scrollbarColor: "#30363D transparent",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Profile Avatar + Name Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "66px",
              height: "66px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "1.5px solid #30363D",
              flexShrink: 0,
            }}
          >
            <img
              src={profile.profile_pic || "/linkedin/avatar.png"}
              alt="Er. Jaydeep Prajapati"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div>
            <h1
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "#FFFFFF",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Er. Jaydeep Prajapati
            </h1>
            <div
              style={{
                fontSize: "13px",
                color: "#8B949E",
                marginTop: "2px",
              }}
            >
              jay-123-oss · he/him
            </div>
          </div>
        </div>

        {/* Status Box: 🎯 Focusing */}
        <div
          style={{
            border: "1px solid #9E6A03",
            backgroundColor: "#161B22",
            borderRadius: "6px",
            padding: "5px 10px",
            marginTop: "12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span style={{ fontSize: "13px" }}>🎯</span>
          <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#E6EDF3" }}>
            Focusing
          </span>
        </div>

        {/* Bio */}
        <div
          style={{
            fontSize: "12.5px",
            color: "#E6EDF3",
            lineHeight: 1.4,
            marginTop: "10px",
          }}
        >
          <div>💻 Python &amp; Web Developer | 🚀 Learning AI &amp; Automation |</div>
          <div>✨ Sharing code &amp; building projects</div>
        </div>

        {/* Edit profile button */}
        <button
          type="button"
          suppressHydrationWarning
          style={{
            width: "100%",
            height: "30px",
            backgroundColor: "#21262D",
            color: "#C9D1D9",
            border: "1px solid #30363D",
            borderRadius: "6px",
            fontSize: "12.5px",
            fontWeight: 600,
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Edit profile
        </button>

        {/* Contact Links */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            marginTop: "12px",
            fontSize: "12px",
            color: "#E6EDF3",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="#8B949E">
              <path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 9.397a.75.75 0 0 1-.76 0L1.5 5.809v6.442Zm13-7.881V3.75a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.62L8 7.897l6.5-3.527Z" />
            </svg>
            <span style={{ color: "#E6EDF3" }}>jaydeepprajapati30941@gmail.com</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="#8B949E">
              <path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z" />
            </svg>
            <a
              href="/Jaydeep_Prajapati_Resume_Strict1Page.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#E6EDF3", textDecoration: "none" }}
            >
              Jaydeep_Prajapati_Resume.pdf
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div
              style={{
                width: "13px",
                height: "13px",
                borderRadius: "2px",
                backgroundColor: "#8B949E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0D1117",
                fontSize: "8.5px",
                fontWeight: 900,
              }}
            >
              in
            </div>
            <span>in/jaydeep-prajapati-a97988358</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="#8B949E">
              <path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.234 4.002 4.002 0 0 0-7.832 0 .75.75 0 0 1-1.482-.234A5.508 5.508 0 0 1 2 5.5Zm3.5-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM9 5.5a3.5 3.5 0 0 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.234 4.002 4.002 0 0 0-7.832 0 .75.75 0 0 1-1.482-.234A5.508 5.508 0 0 1 9 5.5Z" />
            </svg>
            <span style={{ color: "#8B949E" }}>
              <strong style={{ color: "#FFFFFF" }}>7</strong> followers ·{" "}
              <strong style={{ color: "#FFFFFF" }}>31</strong> following
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", backgroundColor: "#21262D", margin: "12px 0" }} />

        {/* Achievements Section (YOLO + Cowboy badges) */}
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF", marginBottom: "8px" }}>
            Achievements
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #F472B6, #C084FC, #818CF8)",
                padding: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  backgroundColor: "#1E1B4B",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#F472B6",
                  fontWeight: 900,
                  fontSize: "9px",
                  lineHeight: 1,
                }}
              >
                <span>Y O</span>
                <span>L O</span>
              </div>
            </div>

            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FDE047, #F97316)",
                padding: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  backgroundColor: "#451A03",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
              >
                🤠
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. README.MD CARD SECTION (FROM USER SCREENSHOTS 1, 2, 4) ── */}
        <div
          style={{
            border: "1px solid #30363D",
            borderRadius: "6px",
            backgroundColor: "#0D1117",
            marginTop: "14px",
            overflow: "hidden",
          }}
        >
          {/* Card Header: jay-123-oss / README.md */}
          <div
            style={{
              padding: "7px 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #21262D",
            }}
          >
            <div style={{ fontSize: "11.5px", color: "#8B949E", fontFamily: "monospace" }}>
              jay-123-oss <span style={{ color: "#484F58" }}>/</span> README<span style={{ color: "#484F58" }}>.md</span>
            </div>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8B949E" strokeWidth="2">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
          </div>

          <div style={{ padding: "10px" }}>
            {/* Banner: JAAYDEEP PRAJAPATI */}
            <div
              style={{
                width: "100%",
                borderRadius: "6px",
                padding: "14px 10px",
                background: "linear-gradient(135deg, #0B3B60 0%, #008080 30%, #4A0E4E 75%, #880E4F 100%)",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "15px",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  margin: 0,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                JAAYDEEP PRAJAPATI
              </h2>
              <div
                style={{
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 600,
                  marginTop: "3px",
                  letterSpacing: "0.04em",
                }}
              >
                AI Engineer | ML Architect | Deep Learning
              </div>
            </div>

            {/* Social Badges Row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "5px",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <div style={{ display: "inline-flex", borderRadius: "3px", overflow: "hidden", fontSize: "9px", fontWeight: 700 }}>
                <span style={{ backgroundColor: "#21262D", color: "#C9D1D9", padding: "2px 5px" }}>Portfolio</span>
                <span style={{ backgroundColor: "#00BCD4", color: "#000000", padding: "2px 5px" }}>jaaydeep.dev</span>
              </div>
              <div style={{ display: "inline-flex", borderRadius: "3px", overflow: "hidden", fontSize: "9px", fontWeight: 700 }}>
                <span style={{ backgroundColor: "#21262D", color: "#C9D1D9", padding: "2px 5px" }}>LinkedIn</span>
                <span style={{ backgroundColor: "#0A66C2", color: "#FFFFFF", padding: "2px 5px" }}>Connect</span>
              </div>
              <div style={{ display: "inline-flex", borderRadius: "3px", overflow: "hidden", fontSize: "9px", fontWeight: 700 }}>
                <span style={{ backgroundColor: "#21262D", color: "#C9D1D9", padding: "2px 5px" }}>Twitter</span>
                <span style={{ backgroundColor: "#1DA1F2", color: "#FFFFFF", padding: "2px 5px" }}>Follow</span>
              </div>
              <div style={{ display: "inline-flex", borderRadius: "3px", overflow: "hidden", fontSize: "9px", fontWeight: 700 }}>
                <span style={{ backgroundColor: "#21262D", color: "#C9D1D9", padding: "2px 5px" }}>✉ Email</span>
                <span style={{ backgroundColor: "#EA4335", color: "#FFFFFF", padding: "2px 5px" }}>Contact</span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", backgroundColor: "#21262D", margin: "12px 0" }} />

            {/* 🧠 The Architect */}
            <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#FFFFFF", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <span>🧠</span>
              <span>The Architect</span>
            </div>

            <div
              style={{
                border: "1px solid #30363D",
                borderRadius: "6px",
                backgroundColor: "#161B22",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  copyText(
                    "architect",
                    `Name: Jaaydeep Prajapati\nRole: AI Engineer & Deep Learning Architect\nFocus: Computer Vision · Production ML · Cloud AI\nCurrent: Building AI at Web Setu | B.Tech CSE\nPhilosophy: "Build for scale from day one."`
                  )
                }
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  background: "#21262D",
                  border: "1px solid #30363D",
                  borderRadius: "4px",
                  padding: "3px 5px",
                  cursor: "pointer",
                  color: copiedKey === "architect" ? "#3FB950" : "#8B949E",
                  fontSize: "9px",
                }}
              >
                {copiedKey === "architect" ? "✓" : "📋"}
              </button>

              <div
                style={{
                  padding: "8px 10px",
                  fontFamily: '"SFMono-Regular", Consolas, Menlo, monospace',
                  fontSize: "9.5px",
                  lineHeight: "1.5",
                  color: "#E6EDF3",
                  overflowX: "auto",
                  whiteSpace: "pre",
                  scrollbarWidth: "none",
                }}
              >
{`|  Name       : Jaaydeep Prajapati
|  Role       : AI Engineer & Deep Learning Architect
|  Focus      : Computer Vision · Production ML · Cloud AI
|  Current    : Building AI at Web Setu | B.Tech CSE
|  Philosophy : "Build for scale from day one."`}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", backgroundColor: "#21262D", margin: "14px 0" }} />

            {/* ── IMAGE 1: SIGNATURE BUILD: TRINETRA ── */}
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <span>🔐</span>
              <span>Signature Build: TRINETRA</span>
            </div>

            <div
              style={{
                border: "1px solid #30363D",
                borderRadius: "6px",
                backgroundColor: "#0D1117",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  copyText(
                    "trinetra",
                    `TRINETRA – Neural Security Intelligence\nInput: Multi-stream, Preprocessing, Edge Opt.\nCore: YOLO v8, Custom CNN, Kalman Tracking\nOutput: Alerts, Logs, API\nAccuracy: 94% | Latency: <50ms | Streams: 8+\nHardware: Jetson Nano -> RTX 4090\nLive: 12+ Facilities | Production since Q3 2024`
                  )
                }
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  background: "#21262D",
                  border: "1px solid #30363D",
                  borderRadius: "4px",
                  padding: "3px 5px",
                  cursor: "pointer",
                  color: copiedKey === "trinetra" ? "#3FB950" : "#8B949E",
                  fontSize: "9px",
                  zIndex: 2,
                }}
              >
                {copiedKey === "trinetra" ? "✓" : "📋"}
              </button>

              <div
                style={{
                  padding: "10px",
                  fontFamily: '"SFMono-Regular", Consolas, monospace',
                  fontSize: "9px",
                  lineHeight: "1.4",
                  color: "#E6EDF3",
                  overflowX: "auto",
                  whiteSpace: "pre",
                  scrollbarWidth: "none",
                }}
              >
{`┌────────────────────────────────────────────────────────┐
│          TRINETRA – Neural Security Intelligence       │
├────────────────────────────────────────────────────────┤
│  📷 Input           🧠 Core              📊 Output     │
│  ├── Multi-stream   ├── YOLO v8          ├── Alerts    │
│  ├── Preprocessing  ├── Custom CNN       ├── Logs      │
│  └── Edge Opt.      └── Kalman Tracking  └── API       │
│                                                        │
│  Accuracy: 94%     Latency: <50ms    Streams: 8+       │
│  Hardware: Jetson Nano -> RTX 4090                     │
│  Live: 12+ Facilities  |  Production since Q3 2024     │
└────────────────────────────────────────────────────────┘`}
              </div>

              {/* Scrollbar Track */}
              <div style={{ height: "6px", backgroundColor: "#161B22", display: "flex", alignItems: "center", padding: "0 4px" }}>
                <div style={{ width: "35%", height: "3px", borderRadius: "2px", backgroundColor: "#8B949E" }} />
              </div>
            </div>

            {/* Stack Tags */}
            <div style={{ marginTop: "8px", fontSize: "11px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px" }}>
              <strong style={{ color: "#FFFFFF" }}>Stack:</strong>
              {["Python", "PyTorch", "YOLO v8", "FastAPI", "OpenCV", "Docker", "AWS"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: "#21262D",
                    color: "#C9D1D9",
                    padding: "1px 5px",
                    borderRadius: "3px",
                    fontSize: "9.5px",
                    fontWeight: 600,
                    border: "1px solid #30363D",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Deep Dive & Repository Links */}
            <div style={{ display: "flex", gap: "12px", marginTop: "8px", fontSize: "11px" }}>
              <a
                href="#projects"
                style={{ color: "#58A6FF", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "3px" }}
              >
                <span>📖</span> Deep Dive
              </a>
              <a
                href="https://github.com/jay-123-oss"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#58A6FF", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "3px" }}
              >
                <span>🔗</span> Repository
              </a>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", backgroundColor: "#21262D", margin: "14px 0" }} />

            {/* ── IMAGE 4: TECH ARSENAL / PRINCIPLES TABLE ── */}
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <span>⚡</span>
              <span>Tech Arsenal</span>
            </div>

            <div
              style={{
                border: "1px solid #30363D",
                borderRadius: "6px",
                backgroundColor: "#0D1117",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  copyText(
                    "principles",
                    `| Principle        | Definition\n| Problem-First    | Analyze deeply before any code\n| Depth > Breadth  | Master fundamentals, not trends\n| Production Mind  | Every line scales from day one\n| Continuous Evol. | Field changes, so do I\n| Code = Comm.     | Write for humans first`
                  )
                }
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  background: "#21262D",
                  border: "1px solid #30363D",
                  borderRadius: "4px",
                  padding: "3px 5px",
                  cursor: "pointer",
                  color: copiedKey === "principles" ? "#3FB950" : "#8B949E",
                  fontSize: "9px",
                  zIndex: 2,
                }}
              >
                {copiedKey === "principles" ? "✓" : "📋"}
              </button>

              <div
                style={{
                  padding: "10px",
                  fontFamily: '"SFMono-Regular", Consolas, monospace',
                  fontSize: "9px",
                  lineHeight: "1.45",
                  color: "#E6EDF3",
                  overflowX: "auto",
                  whiteSpace: "pre",
                  scrollbarWidth: "none",
                }}
              >
{`┌──────────────────┬─────────────────────────────────────────┐
│ Principle        │ Definition                              │
├──────────────────┼─────────────────────────────────────────┤
│ Problem-First    │ Analyze deeply before any code          │
│ Depth > Breadth  │ Master fundamentals, not trends         │
│ Production Mind  │ Every line scales from day one          │
│ Continuous Evol. │ Field changes, so do I                  │
│ Code = Comm.     │ Write for humans first                  │
└──────────────────┴─────────────────────────────────────────┘`}
              </div>

              {/* Scrollbar Track */}
              <div style={{ height: "6px", backgroundColor: "#161B22", display: "flex", alignItems: "center", padding: "0 4px" }}>
                <div style={{ width: "30%", height: "3px", borderRadius: "2px", backgroundColor: "#8B949E" }} />
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", backgroundColor: "#21262D", margin: "14px 0" }} />

            {/* ── IMAGE 2: IMPACT (STREAKS WIDGET) ── */}
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <span>📊</span>
              <span>Impact</span>
            </div>

            <div
              style={{
                border: "1px solid #30363D",
                borderRadius: "8px",
                backgroundColor: "#0D1117",
                padding: "12px 6px",
                display: "grid",
                gridTemplateColumns: "1fr 1.1fr 1fr",
                alignItems: "center",
                textAlign: "center",
                gap: "4px",
              }}
            >
              {/* Total Contributions */}
              <div style={{ borderRight: "1px solid #21262D", padding: "0 4px" }}>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#FFFFFF" }}>3</div>
                <div style={{ fontSize: "9px", color: "#8B949E", marginTop: "2px" }}>Total Contributions</div>
                <div style={{ fontSize: "7.5px", color: "#58A6FF", marginTop: "2px" }}>Oct 17, 2021 - Present</div>
              </div>

              {/* Current Streak (Circular flame indicator) */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 4px" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    border: "2.5px solid #00E5FF",
                    borderTopColor: "#FF007A",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <span style={{ position: "absolute", top: "-10px", fontSize: "11px" }}>🔥</span>
                  <span style={{ fontSize: "15px", fontWeight: 800, color: "#FFFFFF" }}>0</span>
                </div>
                <div style={{ fontSize: "9px", fontWeight: 700, color: "#F0883E", marginTop: "4px" }}>Current Streak</div>
                <div style={{ fontSize: "7.5px", color: "#8B949E" }}>Sep 3</div>
              </div>

              {/* Longest Streak */}
              <div style={{ borderLeft: "1px solid #21262D", padding: "0 4px" }}>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#FFFFFF" }}>1</div>
                <div style={{ fontSize: "9px", color: "#8B949E", marginTop: "2px" }}>Longest Streak</div>
                <div style={{ fontSize: "7.5px", color: "#58A6FF", marginTop: "2px" }}>Oct 17, 2021</div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", backgroundColor: "#21262D", margin: "14px 0" }} />

            {/* ── IMAGE 2: FEATURED WORK TABLE ── */}
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <span>🚀</span>
              <span>Featured Work</span>
            </div>

            <div
              style={{
                border: "1px solid #30363D",
                borderRadius: "6px",
                overflow: "hidden",
                fontSize: "9.5px",
              }}
            >
              {/* Table Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.3fr 0.9fr",
                  backgroundColor: "#161B22",
                  borderBottom: "1px solid #30363D",
                  padding: "6px 8px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                }}
              >
                <div>Project</div>
                <div>What It Does</div>
                <div>Stack</div>
              </div>

              {/* Row 1 */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.3fr 0.9fr",
                  borderBottom: "1px solid #21262D",
                  padding: "8px",
                  backgroundColor: "#0D1117",
                  gap: "6px",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: 700, color: "#FFFFFF", lineHeight: 1.3 }}>
                  Neural Enhancement Engine
                </div>
                <div style={{ color: "#8B949E", lineHeight: 1.3 }}>
                  Super-resolution GANs — 40% clarity boost, real-time
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                  {["PyTorch", "OpenCV", "FastAPI"].map((s) => (
                    <span key={s} style={{ backgroundColor: "#21262D", color: "#C9D1D9", padding: "1px 4px", borderRadius: "2px", fontSize: "8px" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Row 2 */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.3fr 0.9fr",
                  borderBottom: "1px solid #21262D",
                  padding: "8px",
                  backgroundColor: "#0D1117",
                  gap: "6px",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: 700, color: "#FFFFFF", lineHeight: 1.3 }}>
                  Anomaly Detection NN
                </div>
                <div style={{ color: "#8B949E", lineHeight: 1.3 }}>
                  LSTM time-series — 99.2% precision for IoT monitoring
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                  {["TensorFlow", "Python", "Docker"].map((s) => (
                    <span key={s} style={{ backgroundColor: "#21262D", color: "#C9D1D9", padding: "1px 4px", borderRadius: "2px", fontSize: "8px" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Row 3 */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.3fr 0.9fr",
                  padding: "8px",
                  backgroundColor: "#0D1117",
                  gap: "6px",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: 700, color: "#FFFFFF", lineHeight: 1.3 }}>
                  Real-Time Tracking
                </div>
                <div style={{ color: "#8B949E", lineHeight: 1.3 }}>
                  Kalman + Deep SORT tracking on Jetson Edge
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                  {["PyTorch", "OpenCV"].map((s) => (
                    <span key={s} style={{ backgroundColor: "#21262D", color: "#C9D1D9", padding: "1px 4px", borderRadius: "2px", fontSize: "8px" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", backgroundColor: "#21262D", margin: "14px 0" }} />

            {/* ── IMAGE 4: LET'S BUILD ── */}
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <span>📬</span>
              <span>Let's Build</span>
            </div>

            <div
              style={{
                border: "1px solid #30363D",
                borderRadius: "6px",
                backgroundColor: "#161B22",
                padding: "10px 12px",
                position: "relative",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  copyText(
                    "contact",
                    `jaaydeep.prajapati@gmail.com\nlinkedin.com/in/jaaydeep-prajapati\ntwitter.com/jaaydeep_codes\njaaydeep.dev\nblog.jaaydeep.dev`
                  )
                }
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "#21262D",
                  border: "1px solid #30363D",
                  borderRadius: "4px",
                  padding: "3px 5px",
                  cursor: "pointer",
                  color: copiedKey === "contact" ? "#3FB950" : "#8B949E",
                  fontSize: "9px",
                }}
              >
                {copiedKey === "contact" ? "✓" : "📋"}
              </button>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "10px", fontFamily: '"SFMono-Regular", Consolas, monospace' }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>✉</span>
                  <span style={{ color: "#E6EDF3" }}>jaaydeep.prajapati@gmail.com</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>💼</span>
                  <span style={{ color: "#E6EDF3" }}>linkedin.com/in/jaaydeep-prajapati</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>🐦</span>
                  <span style={{ color: "#E6EDF3" }}>twitter.com/jaaydeep_codes</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>🌐</span>
                  <span style={{ color: "#E6EDF3" }}>jaaydeep.dev</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>📖</span>
                  <span style={{ color: "#E6EDF3" }}>blog.jaaydeep.dev</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", backgroundColor: "#21262D", margin: "14px 0" }} />

            {/* ── IMAGE 4: EXPERIENCE & PROJECTS BADGES ── */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center" }}>
              <div style={{ display: "inline-flex", borderRadius: "3px", overflow: "hidden", fontSize: "9.5px", fontWeight: 700 }}>
                <span style={{ backgroundColor: "#21262D", color: "#C9D1D9", padding: "3px 6px" }}>Experience</span>
                <span style={{ backgroundColor: "#00E5FF", color: "#000000", padding: "3px 6px" }}>3+ Years</span>
              </div>
              <div style={{ display: "inline-flex", borderRadius: "3px", overflow: "hidden", fontSize: "9.5px", fontWeight: 700 }}>
                <span style={{ backgroundColor: "#21262D", color: "#C9D1D9", padding: "3px 6px" }}>Projects Shipped</span>
                <span style={{ backgroundColor: "#E91E63", color: "#FFFFFF", padding: "3px 6px" }}>15+</span>
              </div>
              <div style={{ display: "inline-flex", borderRadius: "3px", overflow: "hidden", fontSize: "9.5px", fontWeight: 700 }}>
                <span style={{ backgroundColor: "#21262D", color: "#C9D1D9", padding: "3px 6px" }}>Open Source Contributions</span>
                <span style={{ backgroundColor: "#9C27B0", color: "#FFFFFF", padding: "3px 6px" }}>50+</span>
              </div>
              <div style={{ display: "inline-flex", borderRadius: "3px", overflow: "hidden", fontSize: "9.5px", fontWeight: 700 }}>
                <span style={{ backgroundColor: "#21262D", color: "#C9D1D9", padding: "3px 6px" }}>Technical Articles</span>
                <span style={{ backgroundColor: "#FFB300", color: "#000000", padding: "3px 6px" }}>20+</span>
              </div>
            </div>

            {/* ── IMAGE 4: GRADIENT WAVE BANNER & LAST UPDATED ── */}
            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <svg viewBox="0 0 500 80" preserveAspectRatio="none" style={{ width: "100%", height: "46px", display: "block" }}>
                <defs>
                  <linearGradient id="gitWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#D946EF" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,45 C150,90 350,0 500,45 L500,80 L0,80 Z"
                  fill="url(#gitWaveGrad)"
                />
              </svg>

              <div style={{ backgroundColor: "#0D1117", paddingTop: "6px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#FFFFFF" }}>
                  Jaaydeep Prajapati — Architecting Intelligence
                </div>
                <div style={{ fontSize: "9px", fontStyle: "italic", color: "#8B949E", marginTop: "2px" }}>
                  Last Updated: Q2 2025
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── IMAGE 3: POPULAR REPOSITORIES SECTION ── */}
        <div style={{ marginTop: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#FFFFFF" }}>
              Popular repositories
            </div>
            <a href="https://github.com/jay-123-oss" target="_blank" rel="noreferrer" style={{ fontSize: "10.5px", color: "#58A6FF", textDecoration: "none" }}>
              Customize your pins
            </a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {PINNED_REPOS.map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  border: "1px solid #30363D",
                  borderRadius: "6px",
                  backgroundColor: "#161B22",
                  padding: "10px",
                  textDecoration: "none",
                  display: "block",
                  transition: "border-color 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#58A6FF" }}>
                    {repo.name}
                  </span>
                  <span
                    style={{
                      border: "1px solid #30363D",
                      borderRadius: "10px",
                      padding: "1px 6px",
                      fontSize: "9px",
                      color: "#8B949E",
                      fontWeight: 600,
                    }}
                  >
                    Public
                  </span>
                </div>

                {repo.desc && (
                  <div style={{ fontSize: "10.5px", color: "#8B949E", marginTop: "4px", lineHeight: 1.35 }}>
                    {repo.desc}
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px", fontSize: "10px", color: "#8B949E" }}>
                  {repo.lang && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: repo.langColor }} />
                      <span>{repo.lang}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                    <span>⭐</span>
                    <span>{repo.stars}</span>
                  </div>
                  {repo.forks > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                      <span>🍴</span>
                      <span>{repo.forks}</span>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── IMAGE 5: 125 CONTRIBUTIONS IN THE LAST YEAR ── */}
        <div style={{ marginTop: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>
              125 contributions in the last year
            </div>
            <div style={{ fontSize: "10px", color: "#8B949E", cursor: "pointer" }}>
              Contribution settings ▾
            </div>
          </div>

          <div
            style={{
              border: "1px solid #30363D",
              borderRadius: "6px",
              backgroundColor: "#161B22",
              padding: "10px 8px",
            }}
          >
            {/* Months Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                fontSize: "8.5px",
                color: "#8B949E",
                marginBottom: "4px",
                paddingLeft: "18px",
              }}
            >
              {["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>

            {/* Heatmap Matrix */}
            <div style={{ display: "flex", gap: "3px" }}>
              {/* Day labels */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: "7.5px", color: "#8B949E", paddingRight: "4px" }}>
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              {/* Contribution Grid Columns */}
              <div
                style={{
                  display: "flex",
                  gap: "2.5px",
                  overflowX: "auto",
                  paddingBottom: "4px",
                  scrollbarWidth: "none",
                }}
              >
                {Array.from({ length: 32 }).map((_, colIdx) => (
                  <div key={colIdx} style={{ display: "flex", flexDirection: "column", gap: "2.5px" }}>
                    {Array.from({ length: 7 }).map((_, rowIdx) => {
                      const isHigh =
                        (colIdx === 2 && rowIdx === 1) ||
                        (colIdx === 10 && rowIdx === 1) ||
                        (colIdx === 16 && rowIdx === 1) ||
                        (colIdx === 19 && rowIdx === 1) ||
                        (colIdx === 7 && rowIdx === 4) ||
                        (colIdx === 12 && rowIdx === 4) ||
                        (colIdx === 18 && rowIdx === 4) ||
                        (colIdx === 19 && rowIdx === 6) ||
                        (colIdx === 24 && rowIdx === 6);
                      const isMid =
                        (colIdx === 15 && rowIdx === 4) ||
                        (colIdx === 21 && rowIdx === 6) ||
                        (colIdx === 25 && rowIdx === 4);
                      const bg = isHigh ? "#39D353" : isMid ? "#0E4429" : "#1B222D";
                      return (
                        <div
                          key={rowIdx}
                          style={{
                            width: "7.5px",
                            height: "7.5px",
                            borderRadius: "1.5px",
                            backgroundColor: bg,
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll Indicator + Legend */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "6px",
                fontSize: "8.5px",
                color: "#8B949E",
              }}
            >
              <span>Learn how we count contributions</span>
              <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                <span>Less</span>
                <span style={{ width: "7px", height: "7px", borderRadius: "1px", backgroundColor: "#1B222D" }} />
                <span style={{ width: "7px", height: "7px", borderRadius: "1px", backgroundColor: "#0E4429" }} />
                <span style={{ width: "7px", height: "7px", borderRadius: "1px", backgroundColor: "#006D32" }} />
                <span style={{ width: "7px", height: "7px", borderRadius: "1px", backgroundColor: "#26A641" }} />
                <span style={{ width: "7px", height: "7px", borderRadius: "1px", backgroundColor: "#39D353" }} />
                <span>More</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── IMAGE 5: CONTRIBUTION ACTIVITY ── */}
        <div style={{ marginTop: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#FFFFFF" }}>
              Contribution activity
            </div>
            <div
              style={{
                backgroundColor: "#21262D",
                border: "1px solid #30363D",
                borderRadius: "6px",
                padding: "2px 8px",
                fontSize: "10px",
                fontWeight: 600,
                color: "#C9D1D9",
                cursor: "pointer",
              }}
            >
              Year: <strong style={{ color: "#FFFFFF" }}>2026</strong> ▾
            </div>
          </div>

          <div style={{ fontSize: "11px", fontWeight: 700, color: "#8B949E", marginBottom: "8px" }}>
            September <span style={{ fontWeight: 400 }}>2026</span>
          </div>

          {/* Timeline Entry 1: Commits */}
          <div style={{ display: "flex", gap: "10px", position: "relative", paddingBottom: "14px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  backgroundColor: "#21262D",
                  border: "1px solid #30363D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                }}
              >
                🔄
              </div>
              <div style={{ width: "2px", flex: 1, backgroundColor: "#21262D", marginTop: "2px" }} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#FFFFFF" }}>
                Created 9 commits in 2 repositories
              </div>

              <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "#58A6FF", fontWeight: 600 }}>
                    jay-123-oss/new-ai
                  </span>
                  <div style={{ width: "40px", height: "4px", borderRadius: "2px", backgroundColor: "#39D353" }} />
                </div>
                <div style={{ fontSize: "9.5px", color: "#8B949E" }}>6 commits</div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
                  <span style={{ fontSize: "11px", color: "#58A6FF", fontWeight: 600 }}>
                    jay-123-oss/Disposible
                  </span>
                  <div style={{ width: "22px", height: "4px", borderRadius: "2px", backgroundColor: "#39D353" }} />
                </div>
                <div style={{ fontSize: "9.5px", color: "#8B949E" }}>3 commits</div>
              </div>
            </div>
          </div>

          {/* Timeline Entry 2: Created Repositories */}
          <div style={{ display: "flex", gap: "10px", position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  backgroundColor: "#21262D",
                  border: "1px solid #30363D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                }}
              >
                📓
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#FFFFFF" }}>
                Created 2 repositories
              </div>

              <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <span>📓</span>
                    <span style={{ fontSize: "11px", color: "#58A6FF", fontWeight: 600 }}>
                      jay-123-oss/Disposible
                    </span>
                  </div>
                  <span style={{ fontSize: "9.5px", color: "#8B949E" }}>Sep 3</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingLeft: "16px", fontSize: "9px", color: "#8B949E" }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#3572A5" }} />
                  <span>Python</span>
                  <span>• Built by Jaydeep</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <span>🔒</span>
                    <span style={{ fontSize: "11px", color: "#58A6FF", fontWeight: 600 }}>
                      jay-123-oss/new-ai
                    </span>
                  </div>
                  <span style={{ fontSize: "9.5px", color: "#8B949E" }}>Sep 1</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingLeft: "16px", fontSize: "9px", color: "#8B949E" }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#DEA584" }} />
                  <span>Rust</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. INSTAGRAM MOBILE SCREEN (AUTHENTIC INSTAGRAM EXPERIENCE WITH REAL REELS)
// ═══════════════════════════════════════════════════════════════════════════════
function InstagramMobileScreen({
  profile,
  currentTime,
  activeFeedTab,
  setActiveFeedTab,
}: {
  profile: SocialProfileData;
  currentTime: string;
  activeFeedTab: "grid" | "reels" | "repost" | "tagged";
  setActiveFeedTab: (v: "grid" | "reels" | "repost" | "tagged") => void;
}) {
  const [activeReel, setActiveReel] = useState<{
    id: number;
    src: string;
    views: string;
    likes: string;
    comments: string;
    title: string;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // Active Story Highlight modal state
  const [activeHighlight, setActiveHighlight] = useState<{
    id: number;
    title: string;
    video: string;
  } | null>(null);
  const [isHighlightMuted, setIsHighlightMuted] = useState<boolean>(true);

  const UPLOADED_REELS = [
    { id: 1, src: "/instagram/reel_1.mp4", views: "1.8K", likes: "248", comments: "19", title: "Edge AI Setup" },
    { id: 2, src: "/instagram/reel_2.mp4", views: "3.5K", likes: "412", comments: "31", title: "YOLO v8 Stream" },
    { id: 3, src: "/instagram/reel_3.mp4", views: "920", likes: "128", comments: "12", title: "Neural Code" },
    { id: 4, src: "/instagram/reel_4.mp4", views: "4.8K", likes: "594", comments: "44", title: "Jetson Nano Testing" },
    { id: 5, src: "/instagram/reel_5.mp4", views: "2.1K", likes: "310", comments: "26", title: "Computer Vision" },
    { id: 6, src: "/instagram/reel_6.mp4", views: "6.2K", likes: "820", comments: "62", title: "Deep Learning Model" },
    { id: 7, src: "/instagram/reel_7.mp4", views: "1.1K", likes: "172", comments: "15", title: "Automated Ops" },
    { id: 8, src: "/instagram/reel_8.mp4", views: "8.4K", likes: "1.1K", comments: "89", title: "Production Scale" },
  ];

  // 8 Authentic Video Highlights from public/instagram folder matching user's real profile
  const HIGHLIGHTS_DATA = [
    { id: 1, title: "# college", video: "/instagram/reel_1.mp4" },
    { id: 2, title: "💗", video: "/instagram/reel_2.mp4" },
    { id: 3, title: "😉", video: "/instagram/reel_3.mp4" },
    { id: 4, title: "Real diamond 💎", video: "/instagram/reel_4.mp4" },
    { id: 5, title: "Memories ✨", video: "/instagram/reel_5.mp4" },
    { id: 6, title: "Vibes 🔥", video: "/instagram/reel_6.mp4" },
    { id: 7, title: "Friends 🤝", video: "/instagram/reel_7.mp4" },
    { id: 8, title: "Life 🌟", video: "/instagram/reel_8.mp4" },
  ];

  const bioLines: string[] =
    Array.isArray(profile.bio_lines) && profile.bio_lines.length > 0
      ? profile.bio_lines.filter(Boolean)
      : typeof profile.bio === "string" && profile.bio.trim().length > 0
      ? profile.bio.split("\n").map((l: string) => l.trim()).filter(Boolean)
      : DEFAULT_INSTAGRAM.bio_lines || [];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        color: "#000000",
        position: "relative",
      }}
    >
      {/* ── Status Bar ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 14px 4px 16px",
          fontSize: "11.5px",
          fontWeight: 600,
          color: "#111827",
          backgroundColor: "#FFFFFF",
          flexShrink: 0,
        }}
      >
        <span suppressHydrationWarning style={{ fontSize: "12px", fontWeight: 700 }}>
          {currentTime}
        </span>
        <div
          style={{
            width: "9px",
            height: "9px",
            borderRadius: "50%",
            backgroundColor: "#000000",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{ border: "1px solid #6B7280", borderRadius: "2px", padding: "0 2px", fontSize: "6.5px", fontWeight: 800 }}>
            Vo
          </div>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2 2" />
          </svg>
          <div style={{ display: "flex", alignItems: "center", gap: "1px" }}>
            <span style={{ fontSize: "7.5px", fontWeight: 800 }}>5G+</span>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
              <rect x="2" y="17" width="3.5" height="5" rx="1" />
              <rect x="8" y="12" width="3.5" height="10" rx="1" />
              <rect x="14" y="7" width="3.5" height="15" rx="1" />
              <rect x="20" y="2" width="3.5" height="20" rx="1" />
            </svg>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1px" }}>
            <span style={{ fontSize: "9.5px", fontWeight: 700 }}>76%</span>
            <svg width="13" height="10" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="1" y="1" width="19" height="12" rx="2.5" />
              <rect x="3" y="3" width="11" height="8" rx="1" fill="currentColor" />
              <path d="M22 5v4" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── App Top Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "5px 14px",
          borderBottom: "1px solid #E5E7EB",
          backgroundColor: "#FFFFFF",
          flexShrink: 0,
        }}
      >
        <button type="button" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
            <line x1="12" y1="4" x2="12" y2="20" />
            <line x1="4" y1="12" x2="20" y2="12" />
          </svg>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
          <span style={{ fontSize: "15px", fontWeight: 700 }}>
            {profile.username || "jaydeep.prajapati_18"}
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="6 9 12 15 18 9" />
          </svg>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#EF4444" }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ position: "relative" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
            </svg>
            <span style={{ position: "absolute", top: "-4px", right: "-5px", backgroundColor: "#EF4444", color: "#fff", fontSize: "8.5px", fontWeight: 800, width: "13px", height: "13px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #fff" }}>
              9
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "3.5px" }}>
            <span style={{ width: "18px", height: "2px", backgroundColor: "currentColor", borderRadius: "2px" }} />
            <span style={{ width: "18px", height: "2px", backgroundColor: "currentColor", borderRadius: "2px" }} />
            <span style={{ width: "18px", height: "2px", backgroundColor: "currentColor", borderRadius: "2px" }} />
          </div>
        </div>
      </div>

      {/* ── Scrollable Profile Body ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "2px 12px 14px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* ── Profile Header: Avatar (Left) + Name & Stats (Right) ── */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginTop: "4px", flexShrink: 0 }}>
          {/* Left Column: Avatar + Thought Bubble + Add Badge */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            {/* Thought Bubble */}
            <div
              style={{
                position: "absolute",
                top: "-22px",
                left: "-2px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "14px",
                padding: "2.5px 7px",
                fontSize: "8px",
                fontWeight: 600,
                color: "#18181B",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                zIndex: 10,
              }}
            >
              Make this space yours...
              <div
                style={{
                  position: "absolute",
                  bottom: "-4px",
                  left: "14px",
                  width: "5px",
                  height: "5px",
                  backgroundColor: "#FFFFFF",
                  borderRight: "1px solid #E5E7EB",
                  borderBottom: "1px solid #E5E7EB",
                  transform: "rotate(45deg)",
                }}
              />
            </div>

            {/* Avatar Circle */}
            <div
              style={{
                width: "66px",
                height: "66px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "1.5px solid #E5E7EB",
                backgroundColor: "#F3F4F6",
              }}
            >
              <img
                src={profile.profile_pic || "/instagram/avatar.png"}
                alt={profile.display_name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Add Story (+) Badge */}
            <div
              style={{
                position: "absolute",
                bottom: "0px",
                right: "0px",
                width: "19px",
                height: "19px",
                borderRadius: "50%",
                backgroundColor: "#000000",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #ffffff",
                fontSize: "12px",
                fontWeight: 800,
              }}
            >
              +
            </div>
          </div>

          {/* Right Column: Name + Verified + 3 Stats Columns */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px", paddingTop: "1px" }}>
            {/* Name with Verified Circle Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#000000", letterSpacing: "-0.2px" }}>
                {profile.display_name || "Er. Jaydeep Prajapati"}
              </span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" strokeDasharray="3 2" />
                <polyline points="9 12 11.5 14.5 15.5 9.5" />
              </svg>
            </div>

            {/* 3 Stats Columns: 0 posts | 279 followers | 258 following */}
            <div style={{ display: "flex", justifyContent: "space-between", textAlign: "left", paddingRight: "6px" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#000000", lineHeight: 1.1 }}>0</div>
                <div style={{ fontSize: "10.5px", color: "#18181B", marginTop: "1px" }}>posts</div>
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#000000", lineHeight: 1.1 }}>
                  {profile.followers_count || "279"}
                </div>
                <div style={{ fontSize: "10.5px", color: "#18181B", marginTop: "1px" }}>followers</div>
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#000000", lineHeight: 1.1 }}>
                  {profile.following_count || "258"}
                </div>
                <div style={{ fontSize: "10.5px", color: "#18181B", marginTop: "1px" }}>following</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bio Section ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5px", fontSize: "11.5px", lineHeight: "1.3", color: "#000000", marginTop: "2px", flexShrink: 0 }}>
          <div style={{ color: "#71717A", fontSize: "11px" }}>
            {profile.category || "Digital creator"}
          </div>
          {bioLines.map((line, idx) => (
            <div key={idx} style={{ marginTop: "0.5px" }}>
              {line}
            </div>
          ))}
          <div style={{ color: "#71717A", fontSize: "11px", cursor: "pointer", marginTop: "0.5px" }}>
            ... more
          </div>
        </div>

        {/* ── Link ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10.5px", fontWeight: 600, color: "#000000", marginTop: "1px", flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {profile.external_link || "www.instagram.com/websetu.32?igsh=MTJwdXI3enBqdnpxNA%3D%3D ..."}
          </span>
        </div>

        {/* ── Pills Row (Threads + Music + Add) ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            overflowX: "auto",
            padding: "2px 0",
            scrollbarWidth: "none",
            marginTop: "2px",
            flexShrink: 0,
          }}
        >
          {/* Pill 1: Threads */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "14px",
              padding: "3.5px 9px",
              fontSize: "10.5px",
              fontWeight: 600,
              color: "#18181B",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="4" />
              <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
            </svg>
            <span>{profile.threads_handle || "jaydeep.prajapati_18"}</span>
          </div>

          {/* Pill 2: Music Track */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "14px",
              padding: "3.5px 9px",
              fontSize: "10.5px",
              fontWeight: 600,
              color: "#18181B",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>{profile.music_track || "Jannat B Praak"}</span>
          </div>

          {/* Pill 3: + Add */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "14px",
              padding: "3.5px 9px",
              fontSize: "10.5px",
              fontWeight: 600,
              color: "#71717A",
              whiteSpace: "nowrap",
              flexShrink: 0,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "12px", fontWeight: 700, lineHeight: 1 }}>+</span>
            <span>Add</span>
          </div>
        </div>

        {/* ── Professional Dashboard Card ── */}
        <div
          style={{
            backgroundColor: "#F4F4F5",
            borderRadius: "9px",
            padding: "6px 10px",
            display: "flex",
            flexDirection: "column",
            gap: "1.5px",
            marginTop: "2px",
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#18181B" }}>
            Professional dashboard
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "#71717A" }}>
            <span style={{ color: "#10B981", fontWeight: 800 }}>↗</span>
            <span>{profile.views_30days || "762 views in the last 30 days."}</span>
          </div>
        </div>

        {/* ── Action Buttons Row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 32px", gap: "5px", marginTop: "2px", flexShrink: 0 }}>
          <button
            type="button"
            style={{
              backgroundColor: "#EFEFEF",
              border: "none",
              borderRadius: "7px",
              padding: "5px 0",
              fontSize: "11.5px",
              fontWeight: 600,
              color: "#000000",
              cursor: "pointer",
            }}
          >
            Edit profile
          </button>
          <button
            type="button"
            style={{
              backgroundColor: "#EFEFEF",
              border: "none",
              borderRadius: "7px",
              padding: "5px 0",
              fontSize: "11.5px",
              fontWeight: 600,
              color: "#000000",
              cursor: "pointer",
            }}
          >
            Share profile
          </button>
          <button
            type="button"
            style={{
              backgroundColor: "#EFEFEF",
              border: "none",
              borderRadius: "7px",
              padding: "5px 0",
              fontSize: "11.5px",
              fontWeight: 600,
              color: "#000000",
              cursor: "pointer",
            }}
          >
            Contact
          </button>
          <button
            type="button"
            style={{
              backgroundColor: "#EFEFEF",
              border: "none",
              borderRadius: "7px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#000000",
              cursor: "pointer",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* ── Highlights Strip (100% Fully Visible, Zero Cutoff, With Live Videos) ── */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            overflowX: "auto",
            padding: "6px 2px 4px 2px",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            marginTop: "3px",
            flexShrink: 0,
            minHeight: "88px",
            width: "100%",
          }}
        >
          {/* New Highlight Circle */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              flexShrink: 0,
              width: "56px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "50%",
                border: "1px solid #18181B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FFFFFF",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "24px", fontWeight: 200, color: "#18181B", lineHeight: 1 }}>+</span>
            </div>
            <span style={{ fontSize: "10.5px", fontWeight: 500, color: "#18181B", lineHeight: "1.2" }}>New</span>
          </div>

          {/* 8 Live Video Highlights (Clicking opens and plays the video full screen!) */}
          {HIGHLIGHTS_DATA.map((hl) => (
            <div
              key={hl.id}
              onClick={() => setActiveHighlight(hl)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                flexShrink: 0,
                width: "58px",
                cursor: "pointer",
              }}
            >
              {/* Outer Authentic Silver Border Ring (#DBDBDB) */}
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "50%",
                  padding: "2px",
                  border: "1.5px solid #DBDBDB",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  transition: "transform 0.15s ease",
                }}
              >
                {/* Inner Video Thumbnail Container */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    overflow: "hidden",
                    backgroundColor: "#000000",
                    position: "relative",
                  }}
                >
                  <video
                    src={hl.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                      display: "block",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
              <span
                style={{
                  fontSize: "10.5px",
                  fontWeight: 500,
                  color: "#000000",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "58px",
                  textAlign: "center",
                  lineHeight: "1.2",
                }}
              >
                {hl.title}
              </span>
            </div>
          ))}
        </div>

        {/* ── Feed Tabs (4 Icons: Grid, Reels, Repost, Tagged) ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderTop: "1px solid #E5E7EB", marginTop: "2px", flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setActiveFeedTab("grid")}
            style={{
              background: "none",
              border: "none",
              borderBottom: activeFeedTab === "grid" ? "2px solid #000" : "2px solid transparent",
              padding: "7px 0",
              cursor: "pointer",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={activeFeedTab === "grid" ? "#000" : "#71717A"}>
              <rect x="3" y="3" width="4.5" height="4.5" /><rect x="9.75" y="3" width="4.5" height="4.5" /><rect x="16.5" y="3" width="4.5" height="4.5" />
              <rect x="3" y="9.75" width="4.5" height="4.5" /><rect x="9.75" y="9.75" width="4.5" height="4.5" /><rect x="16.5" y="9.75" width="4.5" height="4.5" />
              <rect x="3" y="16.5" width="4.5" height="4.5" /><rect x="9.75" y="16.5" width="4.5" height="4.5" /><rect x="16.5" y="16.5" width="4.5" height="4.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setActiveFeedTab("reels")}
            style={{
              background: "none",
              border: "none",
              borderBottom: activeFeedTab === "reels" ? "2px solid #000" : "2px solid transparent",
              padding: "7px 0",
              cursor: "pointer",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={activeFeedTab === "reels" ? "#000" : "#71717A"} strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="4" />
              <polygon points="10 8 16 12 10 16 10 8" fill={activeFeedTab === "reels" ? "#000" : "#71717A"} />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setActiveFeedTab("repost")}
            style={{
              background: "none",
              border: "none",
              borderBottom: activeFeedTab === "repost" ? "2px solid #000" : "2px solid transparent",
              padding: "7px 0",
              color: "#71717A",
              cursor: "pointer",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m17 2 4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setActiveFeedTab("tagged")}
            style={{
              background: "none",
              border: "none",
              borderBottom: activeFeedTab === "tagged" ? "2px solid #000" : "2px solid transparent",
              padding: "7px 0",
              color: "#71717A",
              cursor: "pointer",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="12" cy="10" r="3" />
            </svg>
          </button>
        </div>

        {/* ── ZERO POSTS: EXACT AUTHENTIC INSTAGRAM EMPTY STATE (Matching User's Screenshot) ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 16px 28px 16px",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          {/* Creator Drawing Illustration (Exact match to Image 2) */}
          <svg width="150" height="120" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Orange palette spot */}
            <path d="M72 65 C66 61 63 71 71 77 C78 81 84 74 78 66 Z" fill="#F97316" />
            
            {/* Paper sheet tilted */}
            <path d="M62 130 L84 156 L148 142 L126 116 Z" fill="#F3F4F6" stroke="#18181B" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M62 130 L76 94 L138 83 L126 116 Z" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" strokeLinejoin="round" />
            <line x1="82" y1="106" x2="118" y2="100" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
            <line x1="80" y1="114" x2="112" y2="108" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
            
            {/* Back leg in purple trousers */}
            <path d="M125 58 C132 40 145 32 152 35 C158 38 152 50 142 62 L132 75 Z" fill="#D946EF" stroke="#18181B" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M152 35 L160 30 C165 32 166 38 160 42 L150 44 Z" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
            <path d="M158 31 L164 34" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />

            {/* Front leg in purple trousers */}
            <path d="M112 55 C120 32 134 22 142 25 C149 28 144 42 132 55 L118 68 Z" fill="#E879F9" stroke="#18181B" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M142 25 L150 20 C155 22 156 28 150 32 L140 34 Z" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
            <path d="M148 21 L154 24" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />

            {/* Torso in white */}
            <path d="M96 68 C105 60 120 62 130 72 C125 90 115 104 102 104 C92 104 88 92 96 68 Z" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" strokeLinejoin="round" />

            {/* Right arm with orange sleeve */}
            <path d="M88 78 C80 82 82 98 94 98 C98 98 100 92 98 86 Z" fill="#FB923C" stroke="#18181B" strokeWidth="2.5" />
            <path d="M92 98 L94 112 C95 116 99 116 102 112 L105 98 Z" fill="#FFEDD5" stroke="#18181B" strokeWidth="2.2" />

            {/* Head & face leaning */}
            <path d="M94 56 C90 46 98 38 108 42 C116 45 116 58 108 64 C100 68 96 64 94 56 Z" fill="#FFEDD5" stroke="#18181B" strokeWidth="2.5" />
            <ellipse cx="102" cy="52" rx="1.5" ry="2" fill="#18181B" />
            <ellipse cx="110" cy="54" rx="1.5" ry="2" fill="#18181B" />
            <path d="M104 60 Q107 63 110 61" stroke="#18181B" strokeWidth="1.8" fill="none" strokeLinecap="round" />

            {/* Orange hair & ponytail */}
            <path d="M96 48 C92 38 98 30 108 30 C116 30 122 36 120 44 C116 42 110 42 104 46 Z" fill="#F97316" stroke="#18181B" strokeWidth="2.5" />
            <path d="M90 32 C82 30 80 40 88 44 C95 48 94 36 90 32 Z" fill="#EA580C" stroke="#18181B" strokeWidth="2.5" />

            {/* Headphones */}
            <path d="M96 38 C94 30 108 26 116 32" stroke="#9CA3AF" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <rect x="110" y="44" width="6" height="12" rx="3" fill="#E5E7EB" stroke="#18181B" strokeWidth="2" />
            <rect x="92" y="42" width="5" height="10" rx="2.5" fill="#E5E7EB" stroke="#18181B" strokeWidth="2" />

            {/* Left arm stretching forward with magenta stylus */}
            <path d="M106 82 C115 84 130 92 134 102 C138 112 130 118 120 118 C112 118 106 110 104 102 Z" fill="#FB923C" stroke="#18181B" strokeWidth="2.5" />
            <circle cx="114" cy="116" r="6" fill="#FFEDD5" stroke="#18181B" strokeWidth="2" />
            <path d="M108 120 L98 138 L104 140 L114 122 Z" fill="#E11D48" stroke="#18181B" strokeWidth="2" />
            <path d="M98 138 L95 144 L101 142 Z" fill="#F43F5E" stroke="#18181B" strokeWidth="1.5" />
          </svg>

          {/* Heading */}
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#000000", marginTop: "12px" }}>
            Create your first post
          </div>

          {/* Subtitle */}
          <div style={{ fontSize: "12px", color: "#71717A", marginTop: "3px" }}>
            Make this space your own.
          </div>
        </div>
      </div>

      {/* ── FULLSCREEN IN-PHONE REEL MODAL OVERLAY ── */}
      {activeReel && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#000000",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top Bar of Reel modal */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              right: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 10,
              color: "#FFFFFF",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveReel(null)}
              style={{
                background: "rgba(0,0,0,0.4)",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              ←
            </button>
            <span style={{ fontSize: "13px", fontWeight: 700 }}>Reels</span>
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              style={{
                background: "rgba(0,0,0,0.4)",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
          </div>

          {/* Reel Video Player */}
          <video
            src={activeReel.src}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onClick={(e) => {
              if (isPlaying) {
                e.currentTarget.pause();
                setIsPlaying(false);
              } else {
                e.currentTarget.play();
                setIsPlaying(true);
              }
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: "pointer",
            }}
          />

          {/* Right Floating Actions */}
          <div
            style={{
              position: "absolute",
              right: "8px",
              bottom: "40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              color: "#FFFFFF",
              zIndex: 10,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: "18px" }}>❤️</span>
              <span style={{ fontSize: "9px", fontWeight: 700 }}>{activeReel.likes}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: "18px" }}>💬</span>
              <span style={{ fontSize: "9px", fontWeight: 700 }}>{activeReel.comments}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: "18px" }}>↗️</span>
              <span style={{ fontSize: "9px", fontWeight: 700 }}>Share</span>
            </div>
          </div>

          {/* Bottom Caption Overlay */}
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              right: "60px",
              color: "#FFFFFF",
              zIndex: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", overflow: "hidden", border: "1px solid #fff" }}>
                <img src="/instagram/avatar.png" alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700 }}>{profile.username || "jaydeep.prajapati_18"}</span>
            </div>
            <div style={{ fontSize: "10px", marginTop: "4px", textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>
              {activeReel.title} #ai #developer #tech
            </div>
          </div>
        </div>
      )}

      {/* ── FULLSCREEN IN-PHONE STORY HIGHLIGHT VIEWER OVERLAY ── */}
      {activeHighlight && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#000000",
            zIndex: 110,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Top Segmented Story Progress Bars */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "8px",
              right: "8px",
              display: "flex",
              gap: "4px",
              zIndex: 20,
            }}
          >
            {HIGHLIGHTS_DATA.map((h, i) => {
              const currentIdx = HIGHLIGHTS_DATA.findIndex((x) => x.id === activeHighlight.id);
              return (
                <div
                  key={h.id}
                  style={{
                    flex: 1,
                    height: "2.5px",
                    backgroundColor:
                      i <= currentIdx ? "#FFFFFF" : "rgba(255, 255, 255, 0.35)",
                    borderRadius: "2px",
                    transition: "background-color 0.2s ease",
                  }}
                />
              );
            })}
          </div>

          {/* Story Author & Header Row */}
          <div
            style={{
              position: "absolute",
              top: "22px",
              left: "10px",
              right: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 20,
              color: "#FFFFFF",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "1.5px solid #FFFFFF",
                  flexShrink: 0,
                }}
              >
                <img
                  src={profile.profile_pic || "/instagram/avatar.png"}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.15" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#FFFFFF" }}>
                    {profile.username || "jaydeep.prajapati_18"}
                  </span>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)" }}>
                    18w
                  </span>
                </div>
                <span style={{ fontSize: "10px", color: "#F59E0B", fontWeight: 600 }}>
                  {activeHighlight.title}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setIsHighlightMuted(!isHighlightMuted)}
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "none",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {isHighlightMuted ? "🔇" : "🔊"}
              </button>
              <button
                type="button"
                onClick={() => setActiveHighlight(null)}
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "none",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Left / Right tap zones for highlight navigation */}
          <div
            style={{
              position: "absolute",
              top: "60px",
              bottom: "70px",
              left: 0,
              width: "35%",
              zIndex: 15,
              cursor: "pointer",
            }}
            onClick={() => {
              const currentIdx = HIGHLIGHTS_DATA.findIndex((x) => x.id === activeHighlight.id);
              if (currentIdx > 0) {
                setActiveHighlight(HIGHLIGHTS_DATA[currentIdx - 1]);
              }
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "60px",
              bottom: "70px",
              right: 0,
              width: "35%",
              zIndex: 15,
              cursor: "pointer",
            }}
            onClick={() => {
              const currentIdx = HIGHLIGHTS_DATA.findIndex((x) => x.id === activeHighlight.id);
              if (currentIdx < HIGHLIGHTS_DATA.length - 1) {
                setActiveHighlight(HIGHLIGHTS_DATA[currentIdx + 1]);
              } else {
                setActiveHighlight(null);
              }
            }}
          />

          {/* Video Player for the Highlight */}
          <video
            key={activeHighlight.video}
            src={activeHighlight.video}
            autoPlay
            loop
            muted={isHighlightMuted}
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Bottom Story Interaction Bar */}
          <div
            style={{
              position: "absolute",
              bottom: "14px",
              left: "10px",
              right: "10px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              zIndex: 20,
            }}
          >
            <div
              style={{
                flex: 1,
                height: "36px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.45)",
                backgroundColor: "rgba(0,0,0,0.35)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                color: "rgba(255,255,255,0.75)",
                fontSize: "11.5px",
              }}
            >
              Send message...
            </div>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ❤️
            </div>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ✈️
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Nav ── */}
      <div style={{ borderTop: "1px solid #E5E7EB", padding: "5px 14px 3px 14px", display: "flex", flexDirection: "column", gap: "4px", backgroundColor: "#FFFFFF", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="2" width="20" height="20" rx="5" /><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" /></svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="18" height="18" rx="5" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <div style={{ width: "22px", height: "22px", borderRadius: "50%", overflow: "hidden", border: "1.5px solid #000" }}>
            <img src="/instagram/avatar.png" alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "1px" }}>
          <div style={{ width: "90px", height: "3px", borderRadius: "3px", backgroundColor: "#9CA3AF" }} />
        </div>
      </div>
    </div>
  );
}
