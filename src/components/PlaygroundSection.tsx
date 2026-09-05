"use client";

import React, { useState } from "react";
import { WaspButton } from "@/components/ui/wasp-button";

interface ModelPreset {
  id: string;
  name: string;
  category: string;
  params: string;
  precision: string;
  baseTtft: number;
  baseTps: number;
  baseVram: number;
  costPerMillion: string;
  description: string;
}

const MODEL_PRESETS: ModelPreset[] = [
  {
    id: "llama3-70b-awq",
    name: "Llama-3-70B-Instruct [AWQ-INT4]",
    category: "LLM Agentic Reasoning",
    params: "70 Billion",
    precision: "4-bit AWQ Quantized",
    baseTtft: 28,
    baseTps: 84,
    baseVram: 38.4,
    costPerMillion: "$0.52",
    description: "Distilled reasoning backbone optimized for multi-tool execution and autonomous agent reflection.",
  },
  {
    id: "deepseek-coder",
    name: "DeepSeek-Coder-V2-Lite [FP8]",
    category: "Code & AST Generation",
    params: "16 Billion (MoE)",
    precision: "FP8 Mixed Precision",
    baseTtft: 18,
    baseTps: 142,
    baseVram: 14.8,
    costPerMillion: "$0.18",
    description: "Mixture-of-Experts architecture tuned for live React code synthesis and TypeScript AST streaming.",
  },
  {
    id: "mistral-large",
    name: "Mistral-Large-2407 [vLLM FlashInfer]",
    category: "Complex Enterprise RAG",
    params: "123 Billion",
    precision: "FP16 / FlashAttention-2",
    baseTtft: 45,
    baseTps: 58,
    baseVram: 68.2,
    costPerMillion: "$1.40",
    description: "High-precision enterprise engine with 128k context window and zero-hallucination citation ranking.",
  },
  {
    id: "yolo-v10-trt",
    name: "YOLOv10x Spatial Vision [TensorRT FP16]",
    category: "Real-Time Computer Vision",
    params: "31.6 Million",
    precision: "TensorRT Engine",
    baseTtft: 4,
    baseTps: 180,
    baseVram: 2.1,
    costPerMillion: "$0.02",
    description: "Zero-shot edge object detection pipeline running at 140+ FPS on embedded Jetson / RTX nodes.",
  },
];

interface PipelineStep {
  id: string;
  name: string;
  code: string;
  latency: string;
  status: string;
  tech: string;
  details: string;
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: "ingest",
    name: "1. Token Ingest & Guardrails",
    code: "INPUT_FILTER // V4",
    latency: "< 3ms",
    status: "ACTIVE",
    tech: "Rust / Tokenizer",
    details: "Zero-allocation BPE tokenization, regex safety sanitization, and prompt injection classifier.",
  },
  {
    id: "cache",
    name: "2. Semantic Vector Cache",
    code: "CACHE_HIT // 92%",
    latency: "< 6ms",
    status: "ACTIVE",
    tech: "Redis + Cosine SIM",
    details: "High-dimensional embedding lookup with 0.94 similarity threshold for instantaneous cache returns.",
  },
  {
    id: "rag",
    name: "3. Hybrid RAG & Re-Ranking",
    code: "RETRIEVAL // TOP-K=5",
    latency: "< 14ms",
    status: "ACTIVE",
    tech: "pgvector + ColBERT",
    details: "Dense vector retrieval coupled with reciprocal rank fusion and cross-encoder contextual re-ranking.",
  },
  {
    id: "inference",
    name: "4. Continuous Batch Inference",
    code: "vLLM // FLASH-INFER",
    latency: "< 24ms",
    status: "OPTIMIZED",
    tech: "PagedAttention / CUDA",
    details: "Paged KV-cache memory manager with dynamic request scheduling and speculative decoding.",
  },
  {
    id: "stream",
    name: "5. gRPC / WebRTC Stream",
    code: "OUTPUT // DUPLEX",
    latency: "< 2ms",
    status: "STREAMING",
    tech: "Protobuf / HTTP/2",
    details: "Zero-latency delta streaming delivering tokens and audio frames directly to frontend clients.",
  },
];

export default function PlaygroundSection() {
  const [selectedModel, setSelectedModel] = useState<ModelPreset>(
    MODEL_PRESETS[0]
  );
  const [concurrency, setConcurrency] = useState<number>(16);
  const [contextLength, setContextLength] = useState<number>(4096);
  const [selectedStep, setSelectedStep] = useState<PipelineStep>(
    PIPELINE_STEPS[3]
  );

  // Dynamic calculated telemetry
  const calculatedTps = Math.round(
    selectedModel.baseTps * (1 + Math.log2(concurrency) * 0.18)
  );
  const calculatedTtft = Math.round(
    selectedModel.baseTtft + (contextLength / 1024) * 2.5
  );
  const calculatedVram = (
    selectedModel.baseVram +
    (concurrency * contextLength * 0.000004)
  ).toFixed(1);

  return (
    <section
      id="playground"
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        position: "relative",
        overflow: "hidden",
        padding: "110px 56px 130px 56px",
        userSelect: "none",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* ── Background Cyber Grid ── */}
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

      {/* ── Ambient Radial Glow ── */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "10%",
          width: "650px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)",
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
            d="M 0,20 L 180,20 L 220,48 L 920,48 L 1440,48"
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
                backgroundColor: "#06B6D4",
                boxShadow: "0 0 8px #06B6D4",
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
              // 03.5 SYSTEM TOPOLOGY &amp; INFERENCE PLAYGROUND
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
                <span style={{ display: "block" }}>LIVE INFERENCE &amp;</span>
                <span style={{ display: "block", color: "var(--text-secondary)" }}>
                  SYSTEM BENCHMARKS
                </span>
              </h2>
            </div>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                maxWidth: "420px",
                margin: 0,
              }}
            >
              Simulate real-time model throughput, TTFT latency, and VRAM
              footprints across continuous batching and quantization schemes.
            </p>
          </div>
        </div>

        {/* ── Model Selector Grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          {MODEL_PRESETS.map((m) => {
            const isSelected = m.id === selectedModel.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedModel(m)}
                style={{
                  position: "relative",
                  backgroundColor: isSelected
                    ? "rgba(6, 182, 212, 0.14)"
                    : "var(--bg-card)",
                  backdropFilter: "blur(12px)",
                  border: isSelected
                    ? "1px solid #06B6D4"
                    : "1px solid var(--border-subtle)",
                  padding: "18px 20px",
                  clipPath:
                    "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: isSelected
                    ? "0 8px 25px -6px rgba(6, 182, 212, 0.3)"
                    : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    className="font-pixel"
                    style={{
                      fontSize: "10px",
                      color: isSelected ? "#06B6D4" : "var(--text-muted)",
                    }}
                  >
                    {m.category}
                  </span>
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      color: isSelected ? "#06B6D4" : "var(--text-muted)",
                      backgroundColor: "rgba(6, 182, 212, 0.1)",
                      padding: "2px 6px",
                      borderRadius: "2px",
                    }}
                  >
                    {m.precision}
                  </span>
                </div>

                <div
                  className="font-chakra card-heading"
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                  }}
                >
                  {m.name}
                </div>

                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.4,
                  }}
                >
                  {m.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Interactive Controls & Telemetry Dashboard ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
            gap: "28px",
            marginBottom: "48px",
          }}
        >
          {/* Controls: Sliders & Config */}
          <div
            style={{
              position: "relative",
              backgroundColor: "var(--bg-card)",
              backdropFilter: "blur(14px)",
              border: "1px solid var(--border-subtle)",
              padding: "28px",
              clipPath:
                "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
            }}
          >
            <div
              className="font-pixel"
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                letterSpacing: "0.1em",
                marginBottom: "20px",
              }}
            >
              // WORKLOAD PARAMETERS
            </div>

            {/* Slider 1: Concurrency */}
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                <span style={{ color: "var(--text-secondary)" }}>
                  Concurrent Client Streams
                </span>
                <span className="font-chakra" style={{ color: "#06B6D4", fontSize: "14px" }}>
                  {concurrency} Streams
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={128}
                value={concurrency}
                onChange={(e) => setConcurrency(Number(e.target.value))}
                style={{
                  width: "100%",
                  accentColor: "#06B6D4",
                  cursor: "pointer",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  marginTop: "4px",
                }}
              >
                <span>1 (Single)</span>
                <span>32 (Medium)</span>
                <span>64 (Heavy)</span>
                <span>128 (Peak)</span>
              </div>
            </div>

            {/* Slider 2: Context Window */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                <span style={{ color: "var(--text-secondary)" }}>
                  Context Length / Request
                </span>
                <span className="font-chakra" style={{ color: "#06B6D4", fontSize: "14px" }}>
                  {contextLength.toLocaleString()} Tokens
                </span>
              </div>
              <input
                type="range"
                min={512}
                max={32768}
                step={512}
                value={contextLength}
                onChange={(e) => setContextLength(Number(e.target.value))}
                style={{
                  width: "100%",
                  accentColor: "#06B6D4",
                  cursor: "pointer",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  marginTop: "4px",
                }}
              >
                <span>512 (Chat)</span>
                <span>8K (RAG Doc)</span>
                <span>16K (Long Doc)</span>
                <span>32K (Repo Context)</span>
              </div>
            </div>
          </div>

          {/* Real-Time Telemetry Stats Card */}
          <div
            style={{
              position: "relative",
              backgroundColor: "var(--bg-card)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              padding: "28px",
              clipPath:
                "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {/* Metric 1 */}
            <div
              style={{
                backgroundColor: "rgba(128, 128, 128, 0.05)",
                padding: "16px",
                borderRadius: "4px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "4px",
                }}
              >
                Total Generation Speed
              </div>
              <div
                className="font-chakra"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                {calculatedTps}{" "}
                <span style={{ fontSize: "13px", color: "#06B6D4" }}>tok/s</span>
              </div>
              <div style={{ fontSize: "10px", color: "#10B981", marginTop: "2px" }}>
                ▲ Continuous Batching Active
              </div>
            </div>

            {/* Metric 2 */}
            <div
              style={{
                backgroundColor: "rgba(128, 128, 128, 0.05)",
                padding: "16px",
                borderRadius: "4px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "4px",
                }}
              >
                Time to First Token (TTFT)
              </div>
              <div
                className="font-chakra"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                {calculatedTtft}{" "}
                <span style={{ fontSize: "13px", color: "#06B6D4" }}>ms</span>
              </div>
              <div style={{ fontSize: "10px", color: "#38BDF8", marginTop: "2px" }}>
                ⚡ FlashInfer Kernel
              </div>
            </div>

            {/* Metric 3 */}
            <div
              style={{
                backgroundColor: "rgba(128, 128, 128, 0.05)",
                padding: "16px",
                borderRadius: "4px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "4px",
                }}
              >
                GPU VRAM Footprint
              </div>
              <div
                className="font-chakra"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                {calculatedVram}{" "}
                <span style={{ fontSize: "13px", color: "#06B6D4" }}>GB</span>
              </div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>
                Paged KV-Cache enabled
              </div>
            </div>

            {/* Metric 4 */}
            <div
              style={{
                backgroundColor: "rgba(128, 128, 128, 0.05)",
                padding: "16px",
                borderRadius: "4px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "4px",
                }}
              >
                Estimated Inference Cost
              </div>
              <div
                className="font-chakra"
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                {selectedModel.costPerMillion}{" "}
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>/ 1M tok</span>
              </div>
              <div style={{ fontSize: "10px", color: "#10B981", marginTop: "2px" }}>
                64% Savings vs Cloud API
              </div>
            </div>
          </div>
        </div>

        {/* ── End-to-End System Pipeline Visualizer ── */}
        <div
          style={{
            position: "relative",
            backgroundColor: "var(--bg-card)",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--border-subtle)",
            padding: "32px",
            clipPath:
              "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
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
            <div
              className="font-pixel"
              style={{
                fontSize: "11px",
                color: "#06B6D4",
                letterSpacing: "0.1em",
              }}
            >
              // PRODUCTION PIPELINE TOPOLOGY (CLICK A NODE TO INSPECT)
            </div>

            <span
              style={{
                fontSize: "11px",
                color: "#10B981",
                fontWeight: 600,
              }}
            >
              ● ZERO PACKET LOSS · HEALTHY CLUSTER
            </span>
          </div>

          {/* Interactive Flow Nodes */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            {PIPELINE_STEPS.map((step) => {
              const isSelected = step.id === selectedStep.id;
              return (
                <div
                  key={step.id}
                  onClick={() => setSelectedStep(step)}
                  style={{
                    backgroundColor: isSelected
                      ? "rgba(6, 182, 212, 0.15)"
                      : "rgba(128, 128, 128, 0.05)",
                    border: isSelected
                      ? "1px solid #06B6D4"
                      : "1px solid var(--border-subtle)",
                    borderRadius: "4px",
                    padding: "14px 16px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "9px",
                        fontFamily: "monospace",
                        color: isSelected ? "#06B6D4" : "var(--text-muted)",
                      }}
                    >
                      {step.code}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: isSelected ? "#06B6D4" : "var(--text-primary)",
                      }}
                    >
                      {step.latency}
                    </span>
                  </div>

                  <div
                    className="font-chakra"
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: "4px",
                    }}
                  >
                    {step.name}
                  </div>

                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {step.tech}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Node Detail Inspector Box */}
          <div
            style={{
              backgroundColor: "rgba(128, 128, 128, 0.06)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "4px",
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <span
                className="font-pixel"
                style={{
                  fontSize: "10px",
                  color: "#06B6D4",
                  textTransform: "uppercase",
                }}
              >
                NODE INSPECTOR // {selectedStep.id.toUpperCase()}
              </span>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  margin: "4px 0 0 0",
                }}
              >
                {selectedStep.details}
              </p>
            </div>

            <WaspButton
              href="#contact"
              variant="outline"
              paddingX={20}
              paddingY={8}
              fontSize={11}
              cutTopLeft={8}
              cutBottomRight={8}
            >
              DEPLOY SIMILAR ARCHITECTURE →
            </WaspButton>
          </div>
        </div>
      </div>
    </section>
  );
}
