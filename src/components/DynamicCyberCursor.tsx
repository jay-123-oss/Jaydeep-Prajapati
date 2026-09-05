"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

export type CursorContext =
  | "default"
  | "button"
  | "project"
  | "skill"
  | "experience"
  | "social"
  | "contact"
  | "rag"
  | "music"
  | "lamp"
  | "chess"
  | "text";

interface CursorConfig {
  label: string;
  color: string;
  size: number;
  shape: "circle" | "crosshair" | "bracket" | "pulse" | "square";
}

const CONTEXT_CONFIGS: Record<CursorContext, CursorConfig> = {
  default: {
    label: "",
    color: "#20BEFF",
    size: 28,
    shape: "circle",
  },
  button: {
    label: "⚡ CLICK // EXEC",
    color: "#38BDF8",
    size: 44,
    shape: "circle",
  },
  project: {
    label: "🎯 INSPECT // PROJECT",
    color: "#20BEFF",
    size: 54,
    shape: "crosshair",
  },
  skill: {
    label: "⚡ TECH // CORE STACK",
    color: "#06B6D4",
    size: 48,
    shape: "bracket",
  },
  experience: {
    label: "💼 CAREER // TIMELINE",
    color: "#8B5CF6",
    size: 46,
    shape: "circle",
  },
  social: {
    label: "🌐 SOCIAL // LIVE FEED",
    color: "#F97316",
    size: 46,
    shape: "square",
  },
  contact: {
    label: "✉️ TRANSMIT // MESSAGE",
    color: "#10B981",
    size: 48,
    shape: "bracket",
  },
  rag: {
    label: "🧠 NEURAL RAG // AI",
    color: "#A855F7",
    size: 50,
    shape: "bracket",
  },
  music: {
    label: "🎵 AUDIO VIBE // STEREO",
    color: "#10B981",
    size: 52,
    shape: "pulse",
  },
  lamp: {
    label: "💡 DOUBLE-CLICK & PULL",
    color: "#F59E0B",
    size: 58,
    shape: "pulse",
  },
  chess: {
    label: "♟️ TACTICAL CHESS",
    color: "#EC4899",
    size: 50,
    shape: "crosshair",
  },
  text: {
    label: "⌨️ INPUT // I-BEAM",
    color: "#38BDF8",
    size: 26,
    shape: "bracket",
  },
};

export default function DynamicCyberCursor() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Cursor positions
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [smoothPos, setSmoothPos] = useState({ x: -100, y: -100 });
  const [context, setContext] = useState<CursorContext>("default");
  const [isClicking, setIsClicking] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Time-based dynamics ("Alag time ke according")
  // 1. Real-time of day
  const [timeString, setTimeString] = useState("");
  const [timeMode, setTimeMode] = useState<"solar" | "dusk" | "night">("solar");
  // 2. Dwell duration (how long hovering on the current box)
  const [dwellState, setDwellState] = useState<"hover" | "analyzing" | "locked">("hover");
  const [dwellSeconds, setDwellSeconds] = useState(0);

  // Click shockwave ripples
  const [clickRipples, setClickRipples] = useState<
    { id: number; x: number; y: number; color: string }[]
  >([]);

  const animFrameRef = useRef<number | null>(null);
  const targetPosRef = useRef({ x: -100, y: -100 });
  const currentPosRef = useRef({ x: -100, y: -100 });
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentContextRef = useRef<CursorContext>("default");
  const dwellStartTimeRef = useRef<number>(Date.now());

  // Keep ref in sync
  useEffect(() => {
    currentContextRef.current = context;
  }, [context]);

  // Real-time clock update (for time telemetry display)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hrs = now.getHours();
      const mins = now.getMinutes().toString().padStart(2, "0");
      const secs = now.getSeconds().toString().padStart(2, "0");
      setTimeString(`${hrs.toString().padStart(2, "0")}:${mins}:${secs}`);

      if (hrs >= 6 && hrs < 18) {
        setTimeMode("solar");
      } else if (hrs >= 18 && hrs < 22) {
        setTimeMode("dusk");
      } else {
        setTimeMode("night");
      }
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dwell timer (analyzing / locked states based on hover time)
  useEffect(() => {
    if (context === "default") {
      setDwellState("hover");
      setDwellSeconds(0);
      return;
    }

    dwellStartTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsedMs = Date.now() - dwellStartTimeRef.current;
      const secs = (elapsedMs / 1000).toFixed(1);
      setDwellSeconds(parseFloat(secs));

      if (elapsedMs > 2500) {
        setDwellState("locked");
      } else if (elapsedMs > 1200) {
        setDwellState("analyzing");
      } else {
        setDwellState("hover");
      }
    }, 150);

    return () => clearInterval(interval);
  }, [context]);

  useEffect(() => {
    // Disable on touch screens (mobile/tablet) to preserve native mobile feel
    if (typeof window === "undefined") return;
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    setIsVisible(true);

    const resetIdleTimer = () => {
      setIsIdle(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true);
      }, 2000); // 2s without movement -> idle sweep mode
    };

    const handlePointerMove = (e: PointerEvent) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY };
      setMousePos({ x: e.clientX, y: e.clientY });
      resetIdleTimer();

      // Inspect hovered element hierarchy ("Boxes ke according")
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Secret Lamp
      if (
        target.closest('[data-cursor="lamp"]') ||
        target.closest("#hanging-admin-lamp") ||
        target.closest(".admin-lamp-trigger")
      ) {
        if (currentContextRef.current !== "lamp") setContext("lamp");
        return;
      }

      // 2. Music Player
      if (
        target.closest('[data-cursor="music"]') ||
        target.closest(".music-player-widget") ||
        target.closest("audio")
      ) {
        if (currentContextRef.current !== "music") setContext("music");
        return;
      }

      // 3. Cyber Chess Arena
      if (
        target.closest('[data-cursor="chess"]') ||
        target.closest(".cyber-chess-popup") ||
        target.closest("#chess-modal")
      ) {
        if (currentContextRef.current !== "chess") setContext("chess");
        return;
      }

      // 4. RAG Neural Knowledge Engine & Terminal
      if (
        target.closest('[data-cursor="rag"]') ||
        target.closest(".rag-container") ||
        target.closest("#jaydeep-rag")
      ) {
        if (currentContextRef.current !== "rag") setContext("rag");
        return;
      }

      // 5. Text inputs / textareas
      if (
        target.tagName === "TEXTAREA" ||
        (target.tagName === "INPUT" &&
          (target as HTMLInputElement).type !== "button" &&
          (target as HTMLInputElement).type !== "submit")
      ) {
        if (currentContextRef.current !== "text") setContext("text");
        return;
      }

      // 6. Interactive Clickable Buttons & Links
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest('[role="button"]') ||
        target.classList.contains("wasp-btn")
      ) {
        if (currentContextRef.current !== "button") setContext("button");
        return;
      }

      // 7. Projects Showcase, Videos, Images & Gallery
      if (
        target.closest('[data-cursor="project"]') ||
        target.closest("#projects") ||
        target.tagName === "VIDEO" ||
        target.tagName === "IMG"
      ) {
        if (currentContextRef.current !== "project") setContext("project");
        return;
      }

      // 8. Skills Section & Radar Box
      if (
        target.closest('[data-cursor="skill"]') ||
        target.closest("#skills")
      ) {
        if (currentContextRef.current !== "skill") setContext("skill");
        return;
      }

      // 9. Experience Timeline Box
      if (
        target.closest('[data-cursor="experience"]') ||
        target.closest("#experience")
      ) {
        if (currentContextRef.current !== "experience") setContext("experience");
        return;
      }

      // 10. Social Showcase Phone Mockups
      if (
        target.closest('[data-cursor="social"]') ||
        target.closest("#social-showcase")
      ) {
        if (currentContextRef.current !== "social") setContext("social");
        return;
      }

      // 11. Contact Form Box
      if (
        target.closest('[data-cursor="contact"]') ||
        target.closest("#contact")
      ) {
        if (currentContextRef.current !== "contact") setContext("contact");
        return;
      }

      // Default Canvas
      if (currentContextRef.current !== "default") setContext("default");
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const rippleColor = CONTEXT_CONFIGS[currentContextRef.current].color;
      setClickRipples((prev) => [
        ...prev.slice(-4),
        { id: Date.now(), x: e.clientX, y: e.clientY, color: rippleColor },
      ]);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth Lerp Physics Loop
    const renderLoop = () => {
      const lerpFactor = 0.2;
      currentPosRef.current.x +=
        (targetPosRef.current.x - currentPosRef.current.x) * lerpFactor;
      currentPosRef.current.y +=
        (targetPosRef.current.y - currentPosRef.current.y) * lerpFactor;

      setSmoothPos({
        x: currentPosRef.current.x,
        y: currentPosRef.current.y,
      });

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Clean up old ripples
  useEffect(() => {
    if (clickRipples.length === 0) return;
    const timer = setTimeout(() => {
      setClickRipples((prev) => prev.filter((r) => Date.now() - r.id < 600));
    }, 600);
    return () => clearTimeout(timer);
  }, [clickRipples]);

  if (!isVisible) return null;

  const currentConfig = CONTEXT_CONFIGS[context];
  const size = isClicking ? currentConfig.size * 0.8 : currentConfig.size;
  const baseColor = currentConfig.color;
  const activeColor = isDark
    ? baseColor
    : baseColor === "#38BDF8"
    ? "#0284C7"
    : baseColor;

  // Build the dynamic HUD label based on time & box dwell
  let dynamicLabel = currentConfig.label;
  if (context !== "default") {
    if (dwellState === "locked") {
      dynamicLabel = `${currentConfig.label} // 🔒 LOCKED [${dwellSeconds}s]`;
    } else if (dwellState === "analyzing") {
      dynamicLabel = `${currentConfig.label} // ⚡ ANALYZING [${dwellSeconds}s]`;
    }
  } else if (isIdle) {
    dynamicLabel = `⏱️ STANDBY // RADAR SWEEP [${timeString}]`;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 999999,
        overflow: "hidden",
      }}
    >
      {/* ── Click Blast Shockwave Ripples ── */}
      {clickRipples.map((ripple) => (
        <div
          key={ripple.id}
          style={{
            position: "absolute",
            left: ripple.x,
            top: ripple.y,
            transform: "translate(-50%, -50%)",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: `2px solid ${ripple.color}`,
            boxShadow: `0 0 20px ${ripple.color}`,
            animation: "cursorRipple 0.55s cubic-bezier(0.1, 0.8, 0.3, 1) forwards",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── Outer Follower Reticle Ring (Lerp Physics) ── */}
      <div
        style={{
          position: "absolute",
          left: smoothPos.x,
          top: smoothPos.y,
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.75 : 1})`,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius:
            currentConfig.shape === "bracket"
              ? "6px"
              : currentConfig.shape === "square"
              ? "4px"
              : "50%",
          border: `1.5px solid ${activeColor}`,
          boxShadow: `0 0 ${isClicking ? "24px" : "12px"} ${activeColor}88`,
          backgroundColor: isClicking
            ? `${activeColor}22`
            : dwellState === "locked"
            ? `${activeColor}18`
            : "transparent",
          transition:
            "width 0.2s ease, height 0.2s ease, border-color 0.2s ease, transform 0.15s ease, background-color 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        {/* Shape Accents based on Context */}
        {currentConfig.shape === "crosshair" && (
          <>
            <div
              style={{
                position: "absolute",
                top: "-6px",
                width: "1.5px",
                height: "6px",
                backgroundColor: activeColor,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-6px",
                width: "1.5px",
                height: "6px",
                backgroundColor: activeColor,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "-6px",
                height: "1.5px",
                width: "6px",
                backgroundColor: activeColor,
              }}
            />
            <div
              style={{
                position: "absolute",
                right: "-6px",
                height: "1.5px",
                width: "6px",
                backgroundColor: activeColor,
              }}
            />
          </>
        )}

        {currentConfig.shape === "pulse" && (
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: `1px dashed ${activeColor}`,
              animation: "spin 4s linear infinite",
            }}
          />
        )}

        {currentConfig.shape === "bracket" && (
          <>
            <div
              style={{
                position: "absolute",
                top: "-2px",
                left: "-2px",
                width: "6px",
                height: "6px",
                borderTop: `2px solid ${activeColor}`,
                borderLeft: `2px solid ${activeColor}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-2px",
                right: "-2px",
                width: "6px",
                height: "6px",
                borderBottom: `2px solid ${activeColor}`,
                borderRight: `2px solid ${activeColor}`,
              }}
            />
          </>
        )}

        {/* Idle Rotation Radar Sweep Indicator */}
        {isIdle && (
          <div
            style={{
              position: "absolute",
              inset: "-8px",
              borderRadius: "50%",
              borderTop: `2px solid ${activeColor}`,
              borderRight: "2px solid transparent",
              boxShadow: `0 0 10px ${activeColor}`,
              animation: "spin 1.2s linear infinite",
            }}
          />
        )}
      </div>

      {/* ── Inner Laser Pinpoint Dot (Instantaneous 0ms latency) ── */}
      <div
        style={{
          position: "absolute",
          left: mousePos.x,
          top: mousePos.y,
          transform: "translate(-50%, -50%)",
          width: isClicking ? "8px" : "4px",
          height: isClicking ? "8px" : "4px",
          borderRadius: "50%",
          backgroundColor: isClicking ? "#FFFFFF" : activeColor,
          boxShadow: `0 0 10px ${activeColor}`,
          transition: "width 0.1s ease, height 0.1s ease",
          pointerEvents: "none",
        }}
      />

      {/* ── Contextual HUD Tag Badge (Floating text below cursor) ── */}
      {(dynamicLabel || timeString) && (
        <div
          style={{
            position: "absolute",
            left: smoothPos.x + 20,
            top: smoothPos.y + 16,
            backgroundColor: isDark
              ? "rgba(3, 7, 18, 0.94)"
              : "rgba(255, 255, 255, 0.94)",
            border: `1px solid ${activeColor}`,
            padding: "3px 8px",
            borderRadius: "3px",
            boxShadow: `0 4px 18px rgba(0,0,0,0.55), 0 0 10px ${activeColor}44`,
            fontSize: "9px",
            fontFamily: "monospace",
            fontWeight: 800,
            color: activeColor,
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            animation: "tagFadeIn 0.15s ease-out",
          }}
        >
          {dynamicLabel ? (
            <span>{dynamicLabel}</span>
          ) : (
            <span>
              {timeMode === "solar"
                ? "☀️ DAYLIGHT"
                : timeMode === "dusk"
                ? "🌆 DUSK NEON"
                : "🌙 NIGHT PROTOCOL"}{" "}
              // {timeString}
            </span>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes cursorRipple {
          0% {
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.2);
            opacity: 0;
          }
        }
        @keyframes tagFadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
