"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { soundFX } from "@/utils/soundFX";

type VisionMode = "CYBER_HUD" | "THERMAL_NV" | "MATRIX_STREAM" | "EDGE_SOBEL";

interface DetectionTarget {
  id: string;
  label: string;
  confidence: number;
  box: { x: number; y: number; w: number; h: number };
  color: string;
  telemetry: string;
}

export default function NeuralVisionSandbox() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isOpen, setIsOpen] = useState(false);
  const [visionMode, setVisionMode] = useState<VisionMode>("CYBER_HUD");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [fps, setFps] = useState(60);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(98.4);
  const [statusMessage, setStatusMessage] = useState("ON-DEVICE NEURAL RUNTIME STANDBY");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Targets for detection simulation
  const targetsRef = useRef<DetectionTarget[]>([
    {
      id: "tgt-1",
      label: "PRIMARY_DEVELOPER",
      confidence: 0.994,
      box: { x: 0.32, y: 0.18, w: 0.36, h: 0.58 },
      color: "#06B6D4",
      telemetry: "HR: 72 BPM | FOCUS: HIGH | NEURAL STATE: ACTIVE",
    },
    {
      id: "tgt-2",
      label: "KEYBOARD_HARDWARE",
      confidence: 0.968,
      box: { x: 0.28, y: 0.78, w: 0.44, h: 0.18 },
      color: "#10B981",
      telemetry: "INPUT: 110 WPM | LOW LATENCY USB-C",
    },
  ]);

  // Global event listener to open from anywhere
  useEffect(() => {
    const handleOpen = () => {
      soundFX.playClick();
      setIsOpen(true);
    };
    window.addEventListener("open-neural-vision", handleOpen);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        stopCamera();
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-neural-vision", handleOpen);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Start webcam
  const startCamera = async () => {
    try {
      setStatusMessage("ACQUIRING WEBCAM FEED...");
      soundFX.playClick();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setStatusMessage("WEBCAM STREAM LOCKED • ON-DEVICE RUNTIME 140 FPS");
      soundFX.playSuccess();
    } catch {
      setIsCameraActive(false);
      setStatusMessage("WEBCAM OFF / DENIED • SYNTHETIC TEST PATTERN ACTIVE");
      soundFX.playNotification();
    }
  };

  // Stop webcam
  const stopCamera = () => {
    soundFX.playClick();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setStatusMessage("STANDBY • SYNTHETIC EDGE NEURAL RUNTIME ACTIVE");
  };

  // Canvas Render Loop
  useEffect(() => {
    if (!isOpen) return;

    let lastTime = performance.now();
    let frameCount = 0;
    let scanlineY = 0;

    const render = (time: number) => {
      frameCount++;
      if (time - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = time;
        setConfidenceScore(97 + Math.random() * 2.8);
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // Draw camera video or synthetic sci-fi grid
      if (isCameraActive && videoRef.current && videoRef.current.readyState >= 2) {
        ctx.save();
        ctx.drawImage(videoRef.current, 0, 0, w, h);

        // Apply filters directly on canvas
        if (visionMode === "THERMAL_NV") {
          const imgData = ctx.getImageData(0, 0, w, h);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            if (gray < 60) {
              data[i] = 10;
              data[i + 1] = 20;
              data[i + 2] = gray * 4;
            } else if (gray < 140) {
              data[i] = (gray - 60) * 3;
              data[i + 1] = 30;
              data[i + 2] = 220 - (gray - 60) * 2;
            } else if (gray < 200) {
              data[i] = 255;
              data[i + 1] = (gray - 140) * 4;
              data[i + 2] = 0;
            } else {
              data[i] = 255;
              data[i + 1] = 255;
              data[i + 2] = (gray - 200) * 4;
            }
          }
          ctx.putImageData(imgData, 0, 0);
        } else if (visionMode === "MATRIX_STREAM") {
          const imgData = ctx.getImageData(0, 0, w, h);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            data[i] = 0;
            data[i + 1] = Math.min(255, lum * 1.4);
            data[i + 2] = lum * 0.2;
          }
          ctx.putImageData(imgData, 0, 0);
        } else if (visionMode === "EDGE_SOBEL") {
          const imgData = ctx.getImageData(0, 0, w, h);
          const data = imgData.data;
          for (let i = 0; i < data.length - 8; i += 4) {
            const diff = Math.abs(data[i] - data[i + 4]);
            const val = diff > 25 ? 255 : 10;
            data[i] = val === 255 ? 6 : 4;
            data[i + 1] = val;
            data[i + 2] = val === 255 ? 212 : 20;
          }
          ctx.putImageData(imgData, 0, 0);
        }
        ctx.restore();
      } else {
        // Synthetic cyber canvas simulation
        ctx.fillStyle = isDark ? "#020617" : "#0F172A";
        ctx.fillRect(0, 0, w, h);

        // Perspective grid lines
        ctx.strokeStyle = "rgba(6, 182, 212, 0.16)";
        ctx.lineWidth = 1;
        const horizon = h * 0.58;
        for (let x = 0; x <= w; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, horizon);
          ctx.lineTo(x + (x - w / 2) * 1.5, h);
          ctx.stroke();
        }
        for (let y = horizon; y <= h; y += 26) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        // Animated target avatar wireframe
        const pulse = Math.sin(time * 0.003) * 8;
        ctx.strokeStyle = visionMode === "THERMAL_NV" ? "#F97316" : "#06B6D4";
        ctx.lineWidth = 2;
        ctx.strokeRect(w * 0.35 + pulse, h * 0.2, w * 0.3 - pulse * 2, h * 0.45);

        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.35, 60 + pulse * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // DRAW CYBER HUD OVERLAYS
      ctx.save();

      // Scanline animation
      scanlineY = (scanlineY + 3) % h;
      ctx.fillStyle = "rgba(6, 182, 212, 0.08)";
      ctx.fillRect(0, scanlineY, w, 4);

      // Corner reticles
      const bracketSize = 28;
      ctx.strokeStyle = visionMode === "THERMAL_NV" ? "#F97316" : "#06B6D4";
      ctx.lineWidth = 2;

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(24, 24 + bracketSize);
      ctx.lineTo(24, 24);
      ctx.lineTo(24 + bracketSize, 24);
      ctx.stroke();
      // Top-Right
      ctx.beginPath();
      ctx.moveTo(w - 24 - bracketSize, 24);
      ctx.lineTo(w - 24, 24);
      ctx.lineTo(w - 24, 24 + bracketSize);
      ctx.stroke();
      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(24, h - 24 - bracketSize);
      ctx.lineTo(24, h - 24);
      ctx.lineTo(24 + bracketSize, h - 24);
      ctx.stroke();
      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(w - 24 - bracketSize, h - 24);
      ctx.lineTo(w - 24, h - 24);
      ctx.lineTo(w - 24, h - 24 - bracketSize);
      ctx.stroke();

      // Detection Bounding Boxes
      targetsRef.current.forEach((tgt) => {
        const bx = tgt.box.x * w;
        const by = tgt.box.y * h;
        const bw = tgt.box.w * w;
        const bh = tgt.box.h * h;

        ctx.strokeStyle = tgt.color;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(bx, by, bw, bh);
        ctx.setLineDash([]);

        // Label tag
        ctx.fillStyle = "rgba(2, 6, 23, 0.9)";
        ctx.fillRect(bx, by - 22, 210, 20);
        ctx.strokeStyle = tgt.color;
        ctx.strokeRect(bx, by - 22, 210, 20);

        ctx.fillStyle = tgt.color;
        ctx.font = "bold 11px monospace";
        ctx.fillText(`[${tgt.label}] ${(tgt.confidence * 100).toFixed(1)}%`, bx + 6, by - 8);

        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.font = "10px monospace";
        ctx.fillText(tgt.telemetry, bx + 4, by + bh + 14);
      });

      // Central aim crosshair
      const cx = w / 2;
      const cy = h / 2;
      ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 24, cy);
      ctx.lineTo(cx + 24, cy);
      ctx.moveTo(cx, cy - 24);
      ctx.lineTo(cx, cy + 24);
      ctx.stroke();

      // Watermark HUD
      ctx.fillStyle = "rgba(6, 182, 212, 0.95)";
      ctx.font = "bold 12px monospace";
      ctx.fillText(`JAYDEEP_EDGE_VISION // ${visionMode}`, 40, 48);
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "11px monospace";
      ctx.fillText(`LATENCY: ${(1000 / Math.max(1, fps)).toFixed(1)}ms | ON-DEVICE ACCELERATED`, 40, 66);

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isOpen, isCameraActive, visionMode, fps, isDark]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Take Snapshot
  const captureSnapshot = () => {
    if (!canvasRef.current) return;
    soundFX.playSuccess();
    setIsCapturing(true);
    const dataUrl = canvasRef.current.toDataURL("image/png");
    setCapturedSnapshot(dataUrl);
    setTimeout(() => setIsCapturing(false), 250);
  };

  return (
    <>
      {/* Invisible button so any element or shortcut can trigger it */}
      <button
        type="button"
        id="neural-vision-trigger-btn"
        className="hidden"
        aria-hidden="true"
        onClick={() => {
          soundFX.playClick();
          setIsOpen(true);
        }}
      />

      {/* FULLSCREEN HUD MODAL */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => {
            stopCamera();
            setIsOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: isDark ? "rgba(2, 6, 23, 0.92)" : "rgba(15, 23, 42, 0.82)",
            backdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "1080px",
              backgroundColor: isDark ? "rgba(10, 15, 28, 0.98)" : "rgba(255, 255, 255, 0.98)",
              border: isDark ? "1.5px solid rgba(6, 182, 212, 0.4)" : "1.5px solid rgba(2, 132, 199, 0.4)",
              borderRadius: "14px",
              boxShadow: isDark
                ? "0 25px 60px rgba(0,0,0,0.85), 0 0 30px rgba(6, 182, 212, 0.25)"
                : "0 20px 50px rgba(0,0,0,0.18)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              maxHeight: "92vh",
            }}
          >
            {/* TOP BAR */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                borderBottom: "1px solid var(--border-subtle)",
                backgroundColor: isDark ? "rgba(6, 11, 22, 0.8)" : "rgba(241, 245, 249, 0.8)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    width: "9px",
                    height: "9px",
                    borderRadius: "50%",
                    backgroundColor: "#06B6D4",
                    boxShadow: "0 0 10px #06B6D4",
                    display: "inline-block",
                  }}
                />
                <span
                  className="font-chakra"
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "var(--text-primary)",
                    textTransform: "uppercase",
                  }}
                >
                  NEURAL VISION EDGE-AI RUNTIME
                </span>
                <span
                  className="font-pixel"
                  style={{
                    fontSize: "10px",
                    padding: "2px 8px",
                    borderRadius: "3px",
                    backgroundColor: "rgba(6, 182, 212, 0.12)",
                    color: isDark ? "#38BDF8" : "#0284C7",
                    border: "1px solid rgba(6, 182, 212, 0.3)",
                  }}
                >
                  {fps} FPS // TENSOR-RT
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setIsOpen(false);
                }}
                className="font-pixel"
                style={{
                  background: "transparent",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-muted)",
                  padding: "5px 12px",
                  fontSize: "11px",
                  cursor: "pointer",
                  borderRadius: "3px",
                }}
              >
                ESC [✕]
              </button>
            </div>

            {/* STATUS BANNER */}
            <div
              className="font-pixel"
              style={{
                padding: "8px 20px",
                backgroundColor: isDark ? "rgba(6, 182, 212, 0.05)" : "rgba(2, 132, 199, 0.04)",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "11px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: isDark ? "#38BDF8" : "#0284C7" }}>
                <span style={{ animation: "pulse 1.5s infinite" }}>●</span>
                <span>{statusMessage}</span>
              </div>
              <div style={{ color: "var(--text-muted)", display: "flex", gap: "16px" }}>
                <span>CONFIDENCE: <strong style={{ color: isDark ? "#FFFFFF" : "#0F172A" }}>{confidenceScore.toFixed(1)}%</strong></span>
                <span>LATENCY: <strong style={{ color: "#10B981" }}>~6.8ms</strong></span>
              </div>
            </div>

            {/* VIEWPORT CANVAS */}
            <div
              style={{
                position: "relative",
                flex: 1,
                minHeight: "360px",
                backgroundColor: "#000000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <video ref={videoRef} className="hidden" playsInline muted autoPlay />
              <canvas
                ref={canvasRef}
                width={1280}
                height={720}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  filter: isCapturing ? "brightness(1.8)" : "none",
                  transition: "filter 0.15s ease",
                }}
              />

              {/* CONTROLS OVERLAY */}
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "16px",
                  right: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                  padding: "12px 18px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(3, 7, 18, 0.85)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                }}
              >
                {/* Filter Selector */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {(["CYBER_HUD", "THERMAL_NV", "MATRIX_STREAM", "EDGE_SOBEL"] as VisionMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        soundFX.playClick();
                        setVisionMode(mode);
                      }}
                      className="font-pixel"
                      style={{
                        padding: "6px 12px",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        borderRadius: "4px",
                        cursor: "pointer",
                        border: visionMode === mode ? "1.5px solid #06B6D4" : "1px solid rgba(255,255,255,0.15)",
                        backgroundColor: visionMode === mode ? "#06B6D4" : "rgba(255,255,255,0.05)",
                        color: visionMode === mode ? "#000000" : "#E2E8F0",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {mode.replace("_", " ")}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  {!isCameraActive ? (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="font-pixel"
                      style={{
                        padding: "6px 14px",
                        fontSize: "11px",
                        fontWeight: 700,
                        borderRadius: "4px",
                        cursor: "pointer",
                        border: "1px solid #10B981",
                        backgroundColor: "rgba(16, 185, 129, 0.2)",
                        color: "#10B981",
                      }}
                    >
                      📷 ACTIVATE WEBCAM
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="font-pixel"
                      style={{
                        padding: "6px 14px",
                        fontSize: "11px",
                        fontWeight: 700,
                        borderRadius: "4px",
                        cursor: "pointer",
                        border: "1px solid #EF4444",
                        backgroundColor: "rgba(239, 68, 68, 0.2)",
                        color: "#EF4444",
                      }}
                    >
                      ✕ DISCONNECT
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={captureSnapshot}
                    className="font-pixel"
                    style={{
                      padding: "6px 16px",
                      fontSize: "11px",
                      fontWeight: 800,
                      borderRadius: "4px",
                      cursor: "pointer",
                      border: "1.5px solid #06B6D4",
                      backgroundColor: "#06B6D4",
                      color: "#000000",
                      boxShadow: "0 0 16px rgba(6, 182, 212, 0.4)",
                    }}
                  >
                    ⚡ SNAPSHOT
                  </button>
                </div>
              </div>
            </div>

            {/* SNAPSHOT DRAWER */}
            {capturedSnapshot && (
              <div
                style={{
                  padding: "12px 20px",
                  borderTop: "1px solid var(--border-subtle)",
                  backgroundColor: isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(241, 245, 249, 0.9)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img
                    src={capturedSnapshot}
                    alt="Frame snapshot"
                    style={{ width: "64px", height: "36px", objectFit: "cover", borderRadius: "4px", border: "1px solid #06B6D4" }}
                  />
                  <div className="font-pixel" style={{ fontSize: "10px" }}>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>SNAPSHOT BUFFER EXPORT READY</div>
                    <div style={{ color: "var(--text-muted)" }}>1280x720 • NEURAL HUD EMBEDDED</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <a
                    href={capturedSnapshot}
                    download={`jaydeep-neural-snapshot-${Date.now()}.png`}
                    className="font-pixel"
                    style={{
                      padding: "6px 12px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: 700,
                      backgroundColor: "rgba(6, 182, 212, 0.15)",
                      border: "1px solid #06B6D4",
                      color: isDark ? "#38BDF8" : "#0284C7",
                      textDecoration: "none",
                    }}
                  >
                    DOWNLOAD PNG ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => setCapturedSnapshot(null)}
                    className="font-pixel"
                    style={{
                      padding: "6px 10px",
                      background: "transparent",
                      border: "none",
                      color: "var(--text-muted)",
                      fontSize: "10px",
                      cursor: "pointer",
                    }}
                  >
                    DISMISS
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
