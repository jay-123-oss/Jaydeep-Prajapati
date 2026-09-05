"use client";

import React, { useState, useEffect, useRef } from "react";
import { soundFX } from "@/utils/soundFX";

interface PrecisionTier {
  id: string;
  name: string;
  bits: string;
  vramGb: number;
  tokensPerSec: number;
  latencyMs: number;
  perplexityDelta: string;
  compressionRatio: string;
  description: string;
}

const PRECISION_TIERS: PrecisionTier[] = [
  {
    id: "fp32",
    name: "FP32 Master Precision",
    bits: "32-Bit Float",
    vramGb: 142.4,
    tokensPerSec: 24,
    latencyMs: 82,
    perplexityDelta: "0.00% (Baseline)",
    compressionRatio: "1.0x (Raw)",
    description: "Full IEEE single-precision floating point. Uncompressed weights for high-fidelity master checkpoint storage.",
  },
  {
    id: "fp16",
    name: "FP16 / BF16 Tensor Core",
    bits: "16-Bit Half",
    vramGb: 71.2,
    tokensPerSec: 68,
    latencyMs: 38,
    perplexityDelta: "+0.02%",
    compressionRatio: "2.0x",
    description: "Standard production inference format accelerated natively by NVIDIA Ada/Hopper Tensor Cores with FlashAttention-2.",
  },
  {
    id: "int8",
    name: "INT8 SmoothQuant",
    bits: "8-Bit Integer",
    vramGb: 35.6,
    tokensPerSec: 112,
    latencyMs: 22,
    perplexityDelta: "+0.08%",
    compressionRatio: "4.0x",
    description: "Per-channel outlier smoothing with zero loss in MMLU reasoning benchmarks; optimal for edge deployment.",
  },
  {
    id: "int4",
    name: "4-Bit AWQ / GPTQ",
    bits: "4-Bit Weight",
    vramGb: 17.8,
    tokensPerSec: 168,
    latencyMs: 14,
    perplexityDelta: "+0.24%",
    compressionRatio: "8.0x",
    description: "Activation-aware Weight Quantization protecting salient weight channels; fits 70B parameter LLMs into consumer GPUs.",
  },
  {
    id: "bitnet",
    name: "1.58-Bit BitNet (Ternary)",
    bits: "1.58-Bit {-1, 0, 1}",
    vramGb: 6.8,
    tokensPerSec: 240,
    latencyMs: 7,
    perplexityDelta: "+0.68%",
    compressionRatio: "20.9x",
    description: "Extreme ternary quantization eliminating floating-point matrix multiplications in favor of pure integer additions.",
  },
];

const SAMPLE_TOKENS = [
  "SYSTEM", "INFERENCE", "INITIALIZED:", "Quantized", "weights", "successfully", "mapped", "to",
  "NVIDIA", "TensorRT-LLM", "runtime.", "Memory", "footprint", "reduced", "by", "up",
  "to", "20.9x", "with", "sub-10ms", "first-token", "latency.", "Continuous", "batching",
  "throughput", "exceeds", "240", "tokens/sec", "with", "zero", "hallucination", "drift."
];

export default function ModelQuantizerPlayground() {
  const [selectedTierIndex, setSelectedTierIndex] = useState(3); // Default 4-Bit AWQ
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [tokenCounter, setTokenCounter] = useState(0);

  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentTier = PRECISION_TIERS[selectedTierIndex];

  // Token streaming simulator
  const runTokenStream = () => {
    if (isStreaming) return;
    soundFX.playClick();
    setIsStreaming(true);
    setStreamedText("");
    setTokenCounter(0);

    let idx = 0;
    const intervalMs = Math.max(16, Math.round(1000 / currentTier.tokensPerSec));

    streamIntervalRef.current = setInterval(() => {
      if (idx < SAMPLE_TOKENS.length) {
        const nextWord = SAMPLE_TOKENS[idx];
        setStreamedText((prev) => (prev ? prev + " " + nextWord : nextWord));
        setTokenCounter((prev) => prev + 1);
        soundFX.playHover();
        idx++;
      } else {
        if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
        setIsStreaming(false);
        soundFX.playSuccess();
      }
    }, intervalMs);
  };

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, []);

  return (
    <section
      id="quantizer-playground"
      style={{
        width: "100%",
        minHeight: "85vh",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(60px, 8vw, 100px) clamp(16px, 4vw, 56px)",
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
          backgroundSize: "44px 44px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Top HUD Angle Line */}
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
        <svg style={{ width: "100%", height: "100%" }} preserveAspectRatio="none" viewBox="0 0 1440 60">
          <path d="M 0,20 L 140,20 L 180,48 L 780,48 L 1440,48" fill="none" stroke="var(--hud-line)" strokeWidth={1.2} />
        </svg>
      </div>

      <div style={{ maxWidth: "1440px", margin: "0 auto", position: "relative", zIndex: 20 }}>
        {/* Section Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#A855F7",
                boxShadow: "0 0 8px #A855F7",
                display: "inline-block",
              }}
            />
            <span className="font-pixel" style={{ fontSize: "12px", letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              // 03.5 MODEL QUANTIZATION &amp; LATENCY BENCHMARK
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <h2
                className="font-chakra"
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  textTransform: "uppercase",
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                INTERACTIVE QUANTIZER &amp;{" "}
                <span style={{ color: "#A855F7" }}>BITNET LAB</span>
              </h2>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "440px", margin: 0 }}>
              Adjust precision from uncompressed FP32 down to 1.58-Bit BitNet. Observe real-time VRAM collapse and live token generation velocity.
            </p>
          </div>
        </div>

        {/* PRECISION TIER SELECTOR */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
            marginBottom: "32px",
          }}
        >
          {PRECISION_TIERS.map((tier, idx) => {
            const isSelected = idx === selectedTierIndex;
            return (
              <div
                key={tier.id}
                onClick={() => {
                  soundFX.playClick();
                  setSelectedTierIndex(idx);
                }}
                style={{
                  padding: "18px",
                  borderRadius: "8px",
                  backgroundColor: isSelected ? "var(--bg-card-hover)" : "var(--bg-card)",
                  border: isSelected ? "1.5px solid #A855F7" : "1px solid var(--border-subtle)",
                  boxShadow: isSelected ? "0 0 20px rgba(168, 85, 247, 0.25)" : "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "3px",
                      backgroundColor: "#A855F7",
                    }}
                  />
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span className="font-pixel" style={{ fontSize: "11px", color: isSelected ? "#C084FC" : "var(--text-muted)" }}>
                    {tier.bits}
                  </span>
                  <span
                    className="font-pixel"
                    style={{
                      fontSize: "9px",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      backgroundColor: isSelected ? "rgba(168, 85, 247, 0.2)" : "rgba(255, 255, 255, 0.05)",
                      color: isSelected ? "#E9D5FF" : "var(--text-muted)",
                    }}
                  >
                    {tier.compressionRatio}
                  </span>
                </div>

                <div className="font-chakra" style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
                  {tier.name}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.4 }}>
                  {tier.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* TELEMETRY GAUGES GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "36px",
          }}
        >
          {/* Gauge 1: VRAM */}
          <div style={{ padding: "20px", borderRadius: "8px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
            <div className="font-pixel" style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px" }}>
              REQUIRED VRAM ALLOCATION
            </div>
            <div className="font-chakra" style={{ fontSize: "2.2rem", fontWeight: 700, color: "#38BDF8", lineHeight: 1 }}>
              {currentTier.vramGb} <span style={{ fontSize: "1.1rem" }}>GB</span>
            </div>
            <div className="font-pixel" style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "8px" }}>
              70B PARAMETER FOOTPRINT
            </div>
          </div>

          {/* Gauge 2: Throughput */}
          <div style={{ padding: "20px", borderRadius: "8px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
            <div className="font-pixel" style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px" }}>
              INFERENCE VELOCITY
            </div>
            <div className="font-chakra" style={{ fontSize: "2.2rem", fontWeight: 700, color: "#10B981", lineHeight: 1 }}>
              {currentTier.tokensPerSec} <span style={{ fontSize: "1.1rem" }}>TOK/S</span>
            </div>
            <div className="font-pixel" style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "8px" }}>
              CONTINUOUS BATCH STREAM
            </div>
          </div>

          {/* Gauge 3: Latency */}
          <div style={{ padding: "20px", borderRadius: "8px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
            <div className="font-pixel" style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px" }}>
              P99 TTFT LATENCY
            </div>
            <div className="font-chakra" style={{ fontSize: "2.2rem", fontWeight: 700, color: "#F59E0B", lineHeight: 1 }}>
              {currentTier.latencyMs} <span style={{ fontSize: "1.1rem" }}>MS</span>
            </div>
            <div className="font-pixel" style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "8px" }}>
              FIRST-TOKEN DELAY
            </div>
          </div>

          {/* Gauge 4: Perplexity */}
          <div style={{ padding: "20px", borderRadius: "8px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}>
            <div className="font-pixel" style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px" }}>
              PERPLEXITY SHIFT (MMLU)
            </div>
            <div className="font-chakra" style={{ fontSize: "2.2rem", fontWeight: 700, color: "#C084FC", lineHeight: 1 }}>
              {currentTier.perplexityDelta}
            </div>
            <div className="font-pixel" style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "8px" }}>
              REASONING ACCURACY RETENTION
            </div>
          </div>
        </div>

        {/* LIVE TOKEN STREAMING CONSOLE */}
        <div
          style={{
            padding: "24px",
            borderRadius: "10px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: isStreaming ? "#10B981" : "var(--text-muted)",
                  boxShadow: isStreaming ? "0 0 10px #10B981" : "none",
                }}
              />
              <span className="font-pixel" style={{ fontSize: "12px", color: "var(--text-primary)", fontWeight: 700 }}>
                HARDWARE TOKEN STREAM GENERATOR // {currentTier.name.toUpperCase()}
              </span>
            </div>

            <button
              type="button"
              onClick={runTokenStream}
              disabled={isStreaming}
              className="font-pixel"
              style={{
                padding: "8px 20px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.1em",
                borderRadius: "4px",
                cursor: isStreaming ? "wait" : "pointer",
                border: "1.5px solid #A855F7",
                backgroundColor: isStreaming ? "rgba(168, 85, 247, 0.2)" : "#A855F7",
                color: isStreaming ? "#E9D5FF" : "#FFFFFF",
                boxShadow: "0 0 16px rgba(168, 85, 247, 0.35)",
                transition: "all 0.2s ease",
              }}
            >
              {isStreaming ? `STREAMING (${tokenCounter} TOKENS)...` : "⚡ RUN LIVE TOKEN STREAM"}
            </button>
          </div>

          <div
            className="font-pixel"
            style={{
              padding: "18px",
              borderRadius: "6px",
              backgroundColor: "rgba(0, 0, 0, 0.25)",
              border: "1px solid var(--border-subtle)",
              minHeight: "80px",
              fontSize: "12px",
              lineHeight: 1.8,
              color: streamedText ? "var(--text-primary)" : "var(--text-muted)",
              whiteSpace: "pre-wrap",
            }}
          >
            {streamedText || "Click 'RUN LIVE TOKEN STREAM' to benchmark token generation velocity and latency on the selected quantization scheme."}
            {isStreaming && <span style={{ animation: "pulse 0.8s infinite", color: "#A855F7" }}> ▋</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
