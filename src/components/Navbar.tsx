"use client";

import React, { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    url: "https://github.com/jay-123-oss",
    brandColor: "#A855F7",
    svg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/jaydeep-prajapati-a97988358/",
    brandColor: "#0A66C2",
    svg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/ai.by.jaydeep/?hl=en",
    brandColor: "#E1306C",
    svg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "Kaggle",
    url: "https://www.kaggle.com/jaydeepprajapatik",
    brandColor: "#20BEFF",
    svg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.825 23.859c-.022.01-.053.023-.083.023a.475.475 0 0 1-.303-.112l-7.247-6.843-2.614 2.455v4.062a.497.497 0 0 1-.497.496H5.328a.497.497 0 0 1-.496-.496V.56a.497.497 0 0 1 .496-.496h2.753c.274 0 .497.222.497.496v14.152l8.832-8.529a.575.575 0 0 1 .387-.152c.119 0 .237.038.337.112l2.368 1.834a.488.488 0 0 1 .054.721l-7.467 7.21 8.358 8.01a.488.488 0 0 1-.02.741l-2.643 1.944z" />
      </svg>
    ),
  },
  {
    name: "Cyber Chess Arena",
    url: "/chess",
    brandColor: "#10B981",
    svg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H9v2H7v-2H5v-2h2V9h2v2h2v2zm4.5 1c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </svg>
    ),
  },
];

const NAV_ITEMS = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Socials", href: "#social-showcase" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        userSelect: "none",
      }}
    >
      {/* ── Optional Glass Backdrop on Scroll ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "72px",
          backgroundColor: isScrolled
            ? isDark
              ? "rgba(3, 7, 18, 0.92)"
              : "rgba(248, 250, 252, 0.92)"
            : "transparent",
          backdropFilter: isScrolled ? "blur(16px)" : "none",
          transition: "all 0.3s ease",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* ── TOP HUD ANGLED BORDER LINE (Vector Cutout - Retained Exactly) ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "110px",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <svg
          style={{ width: "100%", height: "100%" }}
          preserveAspectRatio="none"
          viewBox="0 0 1440 110"
        >
          {/* Main Angled HUD Shelf Line */}
          <path
            d="M 0,38 L 44,38 L 80,72 L 720,72 L 2400,72"
            fill="none"
            stroke={isDark ? "#ffffff" : "#0F172A"}
            strokeWidth={1.2}
            opacity={isDark ? 0.35 : 0.25}
          />
          {/* Mid Vertical Notch */}
          <path
            d="M 720,72 L 720,96"
            fill="none"
            stroke={isDark ? "#ffffff" : "#0F172A"}
            strokeWidth={1.2}
            opacity={isDark ? 0.35 : 0.25}
          />
        </svg>
      </div>

      {/* ── HEADER CONTENT (Aligned along 72px HUD Line) ── */}
      <header
        style={{
          position: "relative",
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
          padding: "0 clamp(16px, 3.5vw, 44px)",
          maxWidth: "1520px",
          margin: "0 auto",
        }}
      >
        {/* Profile Avatar Logo & Identity (Shifted to the right and resized) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "clamp(0px, 2vw, 48px)",
          }}
        >
          <a
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              textDecoration: "none",
            }}
          >
            {/* Enlarged Glowing Avatar Ring */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                padding: "2.5px",
                background: "linear-gradient(135deg, #0284C7, #38BDF8, #6366F1)",
                boxShadow: "0 0 16px rgba(56, 189, 248, 0.55)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.boxShadow = "0 0 22px rgba(56, 189, 248, 0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 0 16px rgba(56, 189, 248, 0.55)";
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  overflow: "hidden",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/image copy.png"
                  alt="Jaydeep Prajapati"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              </div>
            </div>

            {/* Name & Title (Shifted & Scaled) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: "2px",
              }}
            >
              <span
                className="font-pixel"
                style={{
                  fontSize: "21px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: isDark ? "#ffffff" : "#0F172A",
                  lineHeight: 1.15,
                }}
              >
                JAYDEEP
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontFamily: "var(--font-pixel), monospace",
                  color: "#38BDF8",
                  letterSpacing: "0.12em",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  lineHeight: 1.25,
                }}
              >
                AI Developer &amp; Researcher
              </span>
            </div>
          </a>
        </div>

        {/* Center Navigation Links */}
        <nav
          className="hidden lg:flex"
          style={{
            alignItems: "center",
            gap: "clamp(18px, 2.2vw, 36px)",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              style={{
                color: isDark ? "rgba(255, 255, 255, 0.82)" : "#334155",
                textDecoration: "none",
                position: "relative",
                padding: "6px 2px",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = isDark ? "#20BEFF" : "#0F172A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isDark
                  ? "rgba(255, 255, 255, 0.82)"
                  : "#334155";
              }}
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Right Action Controls: Social Icons + ThemeToggle + Connect */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
          }}
        >
          {/* Social Links Group */}
          <div className="hidden sm:flex" style={{ alignItems: "center", gap: "7px" }}>
            {SOCIAL_LINKS.map((soc) => (
              <a
                key={soc.name}
                href={soc.url}
                target={soc.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                title={soc.name}
                suppressHydrationWarning
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(128, 128, 128, 0.08)",
                  border: `1.2px solid ${soc.brandColor}`,
                  color: soc.brandColor,
                  boxShadow: `0 0 6px ${soc.brandColor}33`,
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.borderColor = soc.brandColor;
                  e.currentTarget.style.backgroundColor = soc.brandColor;
                  e.currentTarget.style.transform = "translateY(-1px) scale(1.08)";
                  e.currentTarget.style.boxShadow = `0 3px 12px ${soc.brandColor}66`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = soc.brandColor;
                  e.currentTarget.style.borderColor = soc.brandColor;
                  e.currentTarget.style.backgroundColor = "rgba(128, 128, 128, 0.08)";
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = `0 0 6px ${soc.brandColor}33`;
                }}
              >
                {soc.svg}
              </a>
            ))}
          </div>

          {/* Command Palette Trigger Button */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => {
              window.dispatchEvent(new CustomEvent("open-command-palette"));
            }}
            title="Open Command Palette (Ctrl + K / ⌘K)"
            className="hidden md:inline-flex font-pixel"
            style={{
              alignItems: "center",
              gap: "6px",
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#F1F5F9",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid #CBD5E1",
              color: isDark ? "#94A3B8" : "#475569",
              padding: "6px 10px",
              fontSize: "11px",
              cursor: "pointer",
              borderRadius: "2px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#20BEFF";
              e.currentTarget.style.color = "#20BEFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isDark ? "rgba(255, 255, 255, 0.15)" : "#CBD5E1";
              e.currentTarget.style.color = isDark ? "#94A3B8" : "#475569";
            }}
          >
            <span>🔍</span>
            <span style={{ fontSize: "10px", opacity: 0.9 }}>⌘K</span>
          </button>

          <ThemeToggle />

          {/* Resume / CV Action Button */}
          <a
            href="/Jaydeep_Prajapati_Resume_Strict1Page.pdf"
            target="_blank"
            rel="noopener noreferrer"
            title="Open / Download Jaydeep's Resume (PDF)"
            className="hidden sm:inline-flex font-pixel"
            style={{
              alignItems: "center",
              gap: "6px",
              backgroundColor: isDark ? "rgba(32, 190, 255, 0.12)" : "#E0F2FE",
              border: isDark ? "1.5px solid #20BEFF" : "1.5px solid #0284C7",
              color: isDark ? "#38BDF8" : "#0369A1",
              fontWeight: 800,
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "7px 14px",
              textDecoration: "none",
              transition: "all 0.2s ease",
              boxShadow: isDark ? "0 0 10px rgba(32, 190, 255, 0.2)" : "none",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? "#20BEFF" : "#0284C7";
              e.currentTarget.style.color = isDark ? "#000000" : "#FFFFFF";
              e.currentTarget.style.boxShadow = "0 0 16px rgba(32, 190, 255, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? "rgba(32, 190, 255, 0.12)" : "#E0F2FE";
              e.currentTarget.style.color = isDark ? "#38BDF8" : "#0369A1";
              e.currentTarget.style.boxShadow = isDark ? "0 0 10px rgba(32, 190, 255, 0.2)" : "none";
            }}
          >
            <span>📄</span>
            <span>RESUME</span>
            <span style={{ fontSize: "10px" }}>↗</span>
          </a>

          {/* Connect Action Button */}
          <a
            href="#contact"
            id="nav-connect-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isDark ? "#ffffff" : "#0F172A",
              color: isDark ? "#000000" : "#ffffff",
              fontWeight: 700,
              fontSize: "clamp(10px, 1.8vw, 11.5px)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "6px clamp(8px, 1.5vw, 16px)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              border: isDark ? "1px solid #ffffff" : "1px solid #0F172A",
              textDecoration: "none",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? "#000000" : "#ffffff";
              e.currentTarget.style.color = isDark ? "#20BEFF" : "#000000";
              e.currentTarget.style.borderColor = "#20BEFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDark ? "#ffffff" : "#0F172A";
              e.currentTarget.style.color = isDark ? "#000000" : "#ffffff";
              e.currentTarget.style.borderColor = isDark ? "#ffffff" : "#0F172A";
            }}
          >
            CONNECT
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden"
            aria-label="Toggle Navigation Menu"
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              backgroundColor: "rgba(32, 190, 255, 0.1)",
              border: "1px solid #20BEFF",
              color: "#20BEFF",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {/* ── Mobile Menu Dropdown Drawer ── */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: isDark ? "rgba(3, 7, 18, 0.98)" : "rgba(248, 250, 252, 0.98)",
            borderBottom: "1.5px solid #20BEFF",
            padding: "16px 28px 22px 28px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
          }}
          className="flex lg:hidden"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: isDark ? "#ffffff" : "#0F172A",
                textDecoration: "none",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "6px 0",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              {item.name}
            </a>
          ))}

          {/* Mobile Resume Link */}
          <a
            href="/Jaydeep_Prajapati_Resume_Strict1Page.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="font-pixel"
            style={{
              fontSize: "13px",
              fontWeight: 800,
              color: "#20BEFF",
              backgroundColor: "rgba(32, 190, 255, 0.12)",
              border: "1px solid #20BEFF",
              padding: "8px 12px",
              textAlign: "center",
              textDecoration: "none",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            📄 VIEW RESUME / CV ↗
          </a>

          {/* Mobile Social Links Row */}
          <div style={{ display: "flex", gap: "10px", marginTop: "6px", paddingTop: "8px" }}>
            {SOCIAL_LINKS.map((soc) => (
              <a
                key={soc.name}
                href={soc.url}
                target={soc.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                title={soc.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  border: `1px solid ${soc.brandColor}`,
                  color: soc.brandColor,
                  textDecoration: "none",
                }}
              >
                {soc.svg}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
