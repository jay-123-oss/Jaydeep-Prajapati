"use client";

import React, { useState, useRef, useEffect } from "react";
import { soundFX } from "@/utils/soundFX";

interface HangingAdminLampProps {
  onUnlock?: () => void;
}

export default function HangingAdminLamp({ onUnlock }: HangingAdminLampProps) {
  // Interaction states
  const [pullDistance, setPullDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSpringing, setIsSpringing] = useState(false);
  const [isLit, setIsLit] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Admin Modal states
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authStatus, setAuthStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const startYRef = useRef<number>(0);
  const currentPullRef = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus password input when modal opens
  useEffect(() => {
    if (showAdminModal) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    } else {
      setPassword("");
      setAuthStatus("idle");
      setErrorMessage("");
    }
  }, [showAdminModal]);

  // Execute the physical pull animation and trigger the admin modal
  const triggerPullAction = () => {
    soundFX.playClick();
    setIsSpringing(true);
    // Pull down quickly then spring back
    setPullDistance(32);

    // Lamp flash effect
    setIsLit(false);
    setTimeout(() => {
      setIsLit(true);
    }, 120);

    setTimeout(() => {
      setPullDistance(0);
      setTimeout(() => {
        setIsSpringing(false);
        setShowAdminModal(true);
        if (onUnlock) onUnlock();
      }, 250);
    }, 140);
  };

  // Double Click Handler
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerPullAction();
  };

  // Drag down handlers (Mouse & Touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    startYRef.current = e.clientY;
    currentPullRef.current = 0;
    setIsDragging(true);
    setIsSpringing(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    currentPullRef.current = 0;
    setIsDragging(true);
    setIsSpringing(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaY = e.clientY - startYRef.current;
      if (deltaY > 0) {
        // Elastic rubber band resistance
        const pulled = Math.min(deltaY * 0.65, 45);
        currentPullRef.current = pulled;
        setPullDistance(pulled);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const deltaY = e.touches[0].clientY - startYRef.current;
      if (deltaY > 0) {
        const pulled = Math.min(deltaY * 0.65, 45);
        currentPullRef.current = pulled;
        setPullDistance(pulled);
      }
    };

    const handleRelease = () => {
      if (!isDragging) return;
      setIsDragging(false);

      if (currentPullRef.current >= 20) {
        // Trigger pull action
        triggerPullAction();
      } else {
        // Rebound smoothly back to 0
        setIsSpringing(true);
        setPullDistance(0);
        setTimeout(() => setIsSpringing(false), 250);
      }
      currentPullRef.current = 0;
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleRelease);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleRelease);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleRelease);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleRelease);
    };
  }, [isDragging]);

  // Handle Admin Authentication
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setAuthStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAuthStatus("success");
        soundFX.playVictoryFanfare();
        // Redirect to admin portal
        setTimeout(() => {
          window.location.href = "/admin";
        }, 600);
      } else {
        setAuthStatus("error");
        setErrorMessage(data.error || "Access Denied: Invalid Master Passkey");
        setIsShaking(true);
        soundFX.playToggleSound();
        setTimeout(() => setIsShaking(false), 500);
      }
    } catch {
      setAuthStatus("error");
      setErrorMessage("Network error: Could not verify authorization");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <>
      {/* ── HANGING LAMP CONTAINER (Elevated higher above the music box) ── */}
      <div
        style={{
          position: "absolute",
          bottom: "100%", // Placed above the music box
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 25,
          userSelect: "none",
          paddingBottom: "68px", // Generous space lifting the lamp higher up
          pointerEvents: "none",
        }}
      >
        {/* Physical Hanging Wire & Shade */}
        <div
          onDoubleClick={handleDoubleClick}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          data-cursor="lamp"
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: isDragging ? "grabbing" : "grab",
            transform: `translateY(${pullDistance}px)`,
            transition: isSpringing ? "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)" : "none",
            touchAction: "none",
            zIndex: 10,
            pointerEvents: "auto",
          }}
          title="Double-click or pull down to open Admin Terminal"
        >
          {/* Ceiling Hanging Cord / Wire (Hangs elegantly from high up) */}
          <div
            style={{
              width: "2px",
              height: `${62 + pullDistance * 0.85}px`,
              background: "linear-gradient(180deg, rgba(148, 163, 184, 0.25) 0%, #334155 45%, #D4AF37 100%)",
              boxShadow: "0 0 4px rgba(0,0,0,0.5)",
              transition: isSpringing ? "height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)" : "none",
            }}
          />

          {/* Realistic Industrial Lamp Shade (SVG matching user's photo) */}
          <div style={{ position: "relative", width: "136px", height: "56px" }}>
            <svg
              viewBox="0 0 160 70"
              width="136"
              height="56"
              style={{
                filter: isLit
                  ? "drop-shadow(0 6px 16px rgba(245, 158, 11, 0.35)) drop-shadow(0 2px 6px rgba(0,0,0,0.75))"
                  : "drop-shadow(0 4px 8px rgba(0,0,0,0.6))",
                transition: "filter 0.3s ease",
              }}
            >
              <defs>
                {/* Metallic Dark Lampshade Gradient */}
                <linearGradient id="shadeBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#181A1E" />
                  <stop offset="25%" stopColor="#2A2E36" />
                  <stop offset="50%" stopColor="#3F4652" />
                  <stop offset="75%" stopColor="#252931" />
                  <stop offset="100%" stopColor="#141619" />
                </linearGradient>

                {/* Brass Gold Ring Gradient */}
                <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#926F15" />
                  <stop offset="35%" stopColor="#F5D061" />
                  <stop offset="60%" stopColor="#FFECA8" />
                  <stop offset="85%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#87650C" />
                </linearGradient>

                {/* Glowing Bulb Radial Gradient */}
                <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="25%" stopColor="#FFF2A3" stopOpacity="1" />
                  <stop offset="55%" stopColor="#FBBF24" stopOpacity="0.85" />
                  <stop offset="80%" stopColor="#F59E0B" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Top Cord Mount Collar */}
              <rect x="76" y="0" width="8" height="6" fill="url(#brassGrad)" rx="1.5" />

              {/* Upper Cone Cap */}
              <path d="M72,16 L88,16 L85,6 L75,6 Z" fill="url(#shadeBodyGrad)" />
              <rect x="71" y="14" width="18" height="3" fill="url(#brassGrad)" rx="1" />

              {/* Main Bell Dome */}
              <path
                d="M71,16 C55,18 20,28 14,48 C12,54 18,56 22,56 L138,56 C142,56 148,54 146,48 C140,28 105,18 89,16 Z"
                fill="url(#shadeBodyGrad)"
              />

              {/* Metallic Specular Highlight Curve */}
              <path
                d="M74,18 C64,22 42,32 36,46 C45,43 70,38 88,38 C102,38 120,42 125,46 C119,32 96,22 86,18 Z"
                fill="#FFFFFF"
                opacity="0.08"
              />

              {/* Bottom Rim Lip (Brass / Golden inner rim) */}
              <ellipse cx="80" cy="56" rx="64" ry="7" fill="url(#brassGrad)" />
              <ellipse cx="80" cy="56" rx="61" ry="5.5" fill="#18181B" />

              {/* Glowing Bulb & Inner Flare */}
              {isLit && (
                <>
                  <ellipse cx="80" cy="54" rx="48" ry="4.5" fill="url(#bulbGlow)" />
                  <circle cx="80" cy="54" r="13" fill="url(#bulbGlow)" />
                  <circle cx="80" cy="54" r="6" fill="#FFFFFF" opacity="0.9" />
                </>
              )}
            </svg>

            {/* Dangling Pull Chain with Gold Bead */}
            <div
              style={{
                position: "absolute",
                right: "30px",
                top: "48px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                padding: "4px",
                zIndex: 6,
              }}
              title="Pull chain to open Admin"
            >
              {/* Beaded chain wire */}
              <div
                style={{
                  width: "1.5px",
                  height: `${24 + pullDistance * 0.45}px`,
                  background: "repeating-linear-gradient(180deg, #D4AF37, #D4AF37 2px, #78580D 2px, #78580D 4px)",
                  boxShadow: "0 0 3px rgba(245, 158, 11, 0.4)",
                  transition: isSpringing ? "height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)" : "none",
                }}
              />
              {/* Golden Bead / Ring Pull Handle */}
              <div
                style={{
                  width: "7.5px",
                  height: "10px",
                  borderRadius: "3px",
                  background: "linear-gradient(135deg, #FFECA8 0%, #D4AF37 50%, #87650C 100%)",
                  boxShadow: isLit
                    ? "0 0 8px rgba(245, 158, 11, 0.8), 0 2px 4px rgba(0,0,0,0.5)"
                    : "0 2px 4px rgba(0,0,0,0.4)",
                  border: "0.5px solid #FEF08A",
                  transform: isDragging ? "scale(1.2)" : "scale(1)",
                  transition: "transform 0.15s ease",
                }}
              />
            </div>
          </div>

          {/* Interactive Tooltip on Hover */}
          <div
            style={{
              position: "absolute",
              top: "-28px",
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              backdropFilter: "blur(6px)",
              color: "#FDE047",
              border: "1px solid rgba(245, 158, 11, 0.5)",
              borderRadius: "20px",
              padding: "3px 12px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              fontFamily: "monospace",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 15px rgba(0,0,0,0.4), 0 0 10px rgba(245, 158, 11, 0.25)",
              pointerEvents: "none",
              opacity: showTooltip || isDragging ? 1 : 0,
              transform: showTooltip || isDragging ? "translateY(0)" : "translateY(4px)",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span>💡</span>
            <span>DOUBLE CLICK OR PULL DOWN FOR ADMIN</span>
          </div>

          {/* ── HALKI HALKI SOFT AMBIENT LIGHT (Emerges strictly from the bottom mouth of the lamp) ── */}
          {isLit && (
            <div
              style={{
                position: "absolute",
                top: "98px", // Placed directly at the bottom opening of the lampshade (Y=98px)
                left: "50%",
                transform: "translateX(-50%)",
                width: "450px", // Generously spans across the 370px music box
                height: "320px", // Shines gently down over the music player
                pointerEvents: "none",
                zIndex: 2, // Sits behind the solid lampshade body (zIndex 10)
                opacity: 0.48, // Sheer, subtle, natural ambient warmth
              }}
            >
              <svg
                viewBox="0 0 450 320"
                width="450"
                height="320"
                style={{ width: "100%", height: "100%", display: "block" }}
              >
                <defs>
                  {/* Soft feathering blur filters */}
                  <filter id="softOuter" x="-30%" y="-20%" width="160%" height="150%">
                    <feGaussianBlur stdDeviation="14" />
                  </filter>
                  <filter id="softInner" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" />
                  </filter>
                  <filter id="softCore" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="3" />
                  </filter>

                  {/* Outer Delicate Ambient Glow (Warm low-intensity gradient) */}
                  <linearGradient id="softOuterGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.22" />
                    <stop offset="25%" stopColor="#FDE047" stopOpacity="0.12" />
                    <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </linearGradient>

                  {/* Mid Delicate Cone (Translucent warmth) */}
                  <linearGradient id="softMidGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.32" />
                    <stop offset="20%" stopColor="#FEF08A" stopOpacity="0.18" />
                    <stop offset="55%" stopColor="#FBBF24" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </linearGradient>

                  {/* Subtle Inner Ray */}
                  <linearGradient id="softCoreRay" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.38" />
                    <stop offset="25%" stopColor="#FEF08A" stopOpacity="0.16" />
                    <stop offset="70%" stopColor="#FDE047" stopOpacity="0.03" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </linearGradient>

                  {/* Soft Lens Flare Ring Halo */}
                  <radialGradient id="softFlareHalo" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                    <stop offset="40%" stopColor="#FEF08A" stopOpacity="0.15" />
                    <stop offset="80%" stopColor="#F59E0B" stopOpacity="0.03" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </radialGradient>

                  {/* Gentle Surface Ambient Pool on Music Box */}
                  <radialGradient id="softSurfacePool" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.14" />
                    <stop offset="45%" stopColor="#FBBF24" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Layer 1: Delicate Ambient Spread (Spans 450px wide) */}
                <polygon
                  points="172,0 278,0 445,310 5,310"
                  fill="url(#softOuterGrad)"
                  filter="url(#softOuter)"
                />

                {/* Layer 2: Soft Volumetric Cone */}
                <polygon
                  points="180,0 270,0 420,310 30,310"
                  fill="url(#softMidGrad)"
                  filter="url(#softInner)"
                />

                {/* Layer 3: Gentle Core Shaft */}
                <polygon
                  points="198,0 252,0 360,300 90,300"
                  fill="url(#softCoreRay)"
                  filter="url(#softCore)"
                />

                {/* Layer 4: Subtle Lens Flare Ring Halo */}
                <ellipse
                  cx="225"
                  cy="44"
                  rx="38"
                  ry="28"
                  fill="url(#softFlareHalo)"
                  stroke="rgba(254, 240, 138, 0.22)"
                  strokeWidth="1"
                />

                {/* Layer 5: Warm Surface Illumination Pool */}
                <ellipse
                  cx="225"
                  cy="225"
                  rx="195"
                  ry="85"
                  fill="url(#softSurfacePool)"
                  filter="url(#softOuter)"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* ── MASTER ADMIN SECURITY TERMINAL MODAL ── */}
      {showAdminModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowAdminModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "rgba(3, 7, 18, 0.82)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            animation: "modalFadeIn 0.25s ease-out forwards",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "450px",
              backgroundColor: "#0B0F19",
              border: "1.5px solid rgba(245, 158, 11, 0.5)",
              borderRadius: "20px",
              padding: "28px 26px",
              boxShadow:
                "0 20px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(245, 158, 11, 0.2), inset 0 0 25px rgba(245, 158, 11, 0.04)",
              color: "#FFFFFF",
              transform: isShaking ? "translateX(6px)" : "none",
              transition: "transform 0.1s ease",
            }}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setShowAdminModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "#94A3B8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 700,
                transition: "all 0.15s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = "#FFFFFF";
                e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.25)";
                e.currentTarget.style.borderColor = "#EF4444";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "#94A3B8";
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
              }}
            >
              ✕
            </button>

            {/* Modal Header with Glowing Lamp Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  backgroundColor: "rgba(245, 158, 11, 0.15)",
                  border: "1.5px solid rgba(245, 158, 11, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)",
                }}
              >
                💡
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    className="font-pixel"
                    style={{
                      fontSize: "14px",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      color: "#FDE047",
                    }}
                  >
                    MASTER CLEARANCE
                  </span>
                  <span
                    style={{
                      fontSize: "9px",
                      fontFamily: "monospace",
                      backgroundColor: "rgba(16, 185, 129, 0.2)",
                      color: "#10B981",
                      border: "1px solid rgba(16, 185, 129, 0.4)",
                      borderRadius: "4px",
                      padding: "1px 6px",
                      fontWeight: 700,
                    }}
                  >
                    SECURE_V3
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#94A3B8",
                    margin: "2px 0 0 0",
                    fontWeight: 500,
                  }}
                >
                  Enter secret key to access Master Administration Portal
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label
                  htmlFor="admin-password-input"
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    letterSpacing: "0.08em",
                    color: "#CBD5E1",
                    marginBottom: "8px",
                    fontWeight: 700,
                  }}
                >
                  SECURITY PASSKEY // ACCESS TOKEN:
                </label>

                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    id="admin-password-input"
                    ref={inputRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Master Password..."
                    style={{
                      width: "100%",
                      padding: "12px 42px 12px 14px",
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: errorMessage
                        ? "1.5px solid #EF4444"
                        : authStatus === "success"
                        ? "1.5px solid #10B981"
                        : "1.5px solid rgba(245, 158, 11, 0.4)",
                      borderRadius: "10px",
                      color: "#FFFFFF",
                      fontSize: "14px",
                      fontFamily: "monospace",
                      outline: "none",
                      boxShadow: "inset 0 2px 6px rgba(0,0,0,0.6)",
                      transition: "all 0.2s ease",
                    }}
                  />

                  {/* Show/Hide Password Eye Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#94A3B8",
                      cursor: "pointer",
                      fontSize: "15px",
                      display: "flex",
                      alignItems: "center",
                      padding: "4px",
                    }}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "👁️" : "🔒"}
                  </button>
                </div>
              </div>

              {/* Convenient Password Hint Button */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  color: "#94A3B8",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px dashed rgba(245, 158, 11, 0.3)",
                }}
              >
                <span>
                  Default Master Key: <code style={{ color: "#FDE047", fontWeight: 700 }}>jay@123</code>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPassword("jay@123");
                    inputRef.current?.focus();
                  }}
                  style={{
                    background: "rgba(245, 158, 11, 0.18)",
                    border: "1px solid rgba(245, 158, 11, 0.5)",
                    color: "#FDE047",
                    borderRadius: "4px",
                    padding: "2px 8px",
                    fontSize: "10px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Quick Fill
                </button>
              </div>

              {/* Status or Error Message Display */}
              {errorMessage && (
                <div
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid #EF4444",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    color: "#FCA5A5",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {authStatus === "success" && (
                <div
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    border: "1px solid #10B981",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    color: "#6EE7B7",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>✓</span>
                  <span>ACCESS GRANTED. REDIRECTING TO MASTER CONTROL...</span>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  style={{
                    flex: 1,
                    padding: "11px 16px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#CBD5E1",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                    fontFamily: "monospace",
                    transition: "all 0.15s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.06)";
                  }}
                >
                  ABORT
                </button>

                <button
                  type="submit"
                  disabled={authStatus === "loading" || authStatus === "success"}
                  style={{
                    flex: 2,
                    padding: "11px 16px",
                    borderRadius: "10px",
                    backgroundColor: "#F59E0B",
                    backgroundImage: "linear-gradient(135deg, #FBBF24 0%, #D97706 100%)",
                    border: "1.5px solid #FEF08A",
                    color: "#000000",
                    fontSize: "12px",
                    fontWeight: 800,
                    cursor: authStatus === "loading" ? "wait" : "pointer",
                    letterSpacing: "0.06em",
                    fontFamily: "monospace",
                    boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)",
                    transition: "all 0.15s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 30px rgba(245, 158, 11, 0.7)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(245, 158, 11, 0.4)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {authStatus === "loading" ? (
                    <span>VERIFYING CLEARANCE...</span>
                  ) : authStatus === "success" ? (
                    <span>AUTHENTICATED ✓</span>
                  ) : (
                    <span>AUTHENTICATE &amp; ENTER →</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
