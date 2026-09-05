"use client";

import React, { useState } from "react";
import { soundFX } from "@/utils/soundFX";

interface SkillPoint {
  label: string;
  value: number; // 0..100
  category: "ai" | "frontend" | "infra";
  tags: string[];
}

const RADAR_SKILLS: SkillPoint[] = [
  { label: "PyTorch & DL", value: 94, category: "ai", tags: ["TorchDynamo", "CUDA", "FlashAttn"] },
  { label: "vLLM & Inference", value: 92, category: "ai", tags: ["PagedAttention", "AWQ", "Triton"] },
  { label: "LangChain & Agents", value: 90, category: "ai", tags: ["Agent Swarms", "Tool Calling"] },
  { label: "Next.js 16 / React 19", value: 95, category: "frontend", tags: ["Server Actions", "Turbopack"] },
  { label: "TypeScript (Strict)", value: 92, category: "frontend", tags: ["Generics", "AST", "Guards"] },
  { label: "Tailwind & Design", value: 96, category: "frontend", tags: ["Tokens", "CSS Vars", "UI/UX"] },
  { label: "pgvector & RAG", value: 90, category: "ai", tags: ["Qdrant", "Embeddings", "HNSW"] },
  { label: "Docker & K8s", value: 89, category: "infra", tags: ["Containers", "Helm", "Edge Deploy"] },
];

export default function SkillRadarChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "ai" | "frontend">("all");

  const size = 420;
  const center = size / 2;
  const radius = 150;
  const total = RADAR_SKILLS.length;

  // Calculate coordinates for 8 polygon points
  const points = RADAR_SKILLS.map((skill, index) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const valRatio = skill.value / 100;
    const x = center + radius * valRatio * Math.cos(angle);
    const y = center + radius * valRatio * Math.sin(angle);
    const outerX = center + (radius + 32) * Math.cos(angle);
    const outerY = center + (radius + 32) * Math.sin(angle);
    return { x, y, outerX, outerY, angle, skill, index };
  });

  const polygonPathString = points
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div
      style={{
        marginTop: "64px",
        padding: "32px 0 0 0",
        backgroundColor: "transparent",
        border: "none",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>

      {/* Top Header & Filter Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "24px",
          marginBottom: "36px",
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "20px",
        }}
      >
        <div>
          <div
            className="font-pixel"
            style={{
              fontSize: "11px",
              color: "#38BDF8",
              letterSpacing: "0.14em",
              marginBottom: "6px",
              textTransform: "uppercase",
            }}
          >
            // HOLOGRAPHIC RADAR ANALYSIS
          </div>
          <h3
            className="font-chakra"
            style={{
              fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
              fontWeight: 800,
              color: "var(--text-primary)",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
            }}
          >
            Skill Matrix &amp; Vector Radar
          </h3>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {(["all", "ai", "frontend"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              suppressHydrationWarning
              onClick={() => {
                soundFX.playClick();
                setFilter(cat);
              }}
              onMouseEnter={() => soundFX.playHover()}
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-pixel), monospace",
                padding: "8px 16px",
                borderRadius: "4px",
                border: filter === cat ? "1.5px solid #38BDF8" : "1px solid var(--border-subtle)",
                backgroundColor: filter === cat ? "rgba(56, 189, 248, 0.18)" : "transparent",
                color: filter === cat ? "#ffffff" : "var(--text-muted)",
                boxShadow: filter === cat ? "0 0 14px rgba(56, 189, 248, 0.35)" : "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textTransform: "uppercase",
              }}
            >
              {cat === "all" ? "All Vector Radar" : cat === "ai" ? "AI & ML" : "Web & Frontend"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Radar Display Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "48px",
          alignItems: "center",
        }}
      >
        {/* Left: Interactive Rotating Radar Scanner & SVG Vector Polygon */}
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px 0",
          }}
        >
          {/* Animated Rotating Radar Sweep Beam */}
          <div
            style={{
              position: "absolute",
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
              borderRadius: "50%",
              background: "conic-gradient(from 0deg, rgba(56, 189, 248, 0.25) 0deg, transparent 60deg, transparent 360deg)",
              animation: "radarSweep 8s linear infinite",
              pointerEvents: "none",
            }}
          />

          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <defs>
              <linearGradient id="polyGradMatrix" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.55" />
                <stop offset="50%" stopColor="#818CF8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#C084FC" stopOpacity="0.3" />
              </linearGradient>

              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Concentric Polygonal Radar Grid Lines */}
            {gridLevels.map((lvl, idx) => {
              const gridPoints = points
                .map((p) => {
                  const gx = center + radius * lvl * Math.cos(p.angle);
                  const gy = center + radius * lvl * Math.sin(p.angle);
                  return `${gx.toFixed(1)},${gy.toFixed(1)}`;
                })
                .join(" ");
              return (
                <g key={idx}>
                  <polygon
                    points={gridPoints}
                    fill="none"
                    stroke={lvl === 1.0 ? "var(--border-active)" : "var(--border-subtle)"}
                    strokeWidth={lvl === 1.0 ? 1.5 : 1}
                    strokeDasharray={lvl === 1.0 ? "none" : "4,4"}
                    opacity={lvl === 1.0 ? 0.6 : 0.35}
                  />
                  {/* Concentric Percentage Indicator */}
                  <text
                    x={center + 6}
                    y={center - radius * lvl + 4}
                    fill="var(--text-muted)"
                    fontSize="9"
                    fontFamily="monospace"
                    opacity={0.5}
                  >
                    {lvl * 100}%
                  </text>
                </g>
              );
            })}

            {/* Radial Axis Spokes */}
            {points.map((p, idx) => (
              <line
                key={idx}
                x1={center}
                y1={center}
                x2={center + radius * Math.cos(p.angle)}
                y2={center + radius * Math.sin(p.angle)}
                stroke="var(--border-subtle)"
                strokeWidth={1}
                opacity={0.35}
              />
            ))}

            {/* Polygonal Skill Vector Mesh */}
            <polygon
              points={polygonPathString}
              fill="url(#polyGradMatrix)"
              stroke="#38BDF8"
              strokeWidth={2.5}
              style={{
                filter: "drop-shadow(0 0 16px rgba(56, 189, 248, 0.6))",
                transition: "all 0.3s ease",
              }}
            />

            {/* Interactive Nodes & Crosshairs */}
            {points.map((p) => {
              const isSelected = hoveredIdx === p.index;
              const isMatch = filter === "all" || p.skill.category === filter;
              return (
                <g
                  key={p.index}
                  onMouseEnter={() => {
                    soundFX.playHover();
                    setHoveredIdx(p.index);
                  }}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{ cursor: "pointer", opacity: isMatch ? 1 : 0.2 }}
                >
                  {/* Outer Pulsing Aura when Hovered */}
                  {isSelected && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={16}
                      fill="rgba(56, 189, 248, 0.2)"
                      stroke="#38BDF8"
                      strokeWidth={1.5}
                      style={{ animation: "pulseGlow 1.5s infinite ease-in-out" }}
                    />
                  )}

                  {/* Core Node Circle */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? 7 : 4.5}
                    fill={isSelected ? "#ffffff" : "#38BDF8"}
                    stroke="#0284C7"
                    strokeWidth={2}
                    style={{ transition: "all 0.2s ease" }}
                  />

                  {/* Node Label Text */}
                  <text
                    x={p.outerX}
                    y={p.outerY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isSelected ? "#38BDF8" : "var(--text-primary)"}
                    fontSize={isSelected ? "12" : "11"}
                    fontWeight={isSelected ? "800" : "600"}
                    fontFamily="var(--font-chakra), sans-serif"
                    style={{ transition: "all 0.2s ease" }}
                  >
                    {p.skill.label}
                  </text>
                </g>
              );
            })}

            {/* Center Origin Hub */}
            <circle cx={center} cy={center} r={4} fill="#38BDF8" />
            <circle cx={center} cy={center} r={10} fill="none" stroke="#38BDF8" strokeWidth={1} opacity={0.5} />
          </svg>
        </div>

        {/* Right: Holographic Telemetry Inspector & Live Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {hoveredIdx !== null ? (
            <div
              style={{
                padding: "28px",
                backgroundColor: "rgba(56, 189, 248, 0.06)",
                border: "1px solid #38BDF8",
                borderRadius: "12px",
                boxShadow: "0 0 25px rgba(56, 189, 248, 0.25)",
                transition: "all 0.2s ease",
              }}
            >
              <div
                className="font-pixel"
                style={{
                  fontSize: "11px",
                  color: "#38BDF8",
                  letterSpacing: "0.12em",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                }}
              >
                // INSPECTING VECTOR NODE #{hoveredIdx + 1}
              </div>

              <h4
                className="font-chakra"
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  margin: "0 0 10px 0",
                  color: "var(--text-primary)",
                  textTransform: "uppercase",
                }}
              >
                {RADAR_SKILLS[hoveredIdx].label}
              </h4>

              {/* Progress Bar & Numeric Indicator */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "8px",
                    backgroundColor: "rgba(128, 128, 128, 0.15)",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${RADAR_SKILLS[hoveredIdx].value}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #0284C7, #38BDF8, #818CF8)",
                      boxShadow: "0 0 12px #38BDF8",
                      borderRadius: "4px",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
                <span
                  className="font-pixel"
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#38BDF8",
                  }}
                >
                  {RADAR_SKILLS[hoveredIdx].value}%
                </span>
              </div>

              {/* Technology Tags */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {RADAR_SKILLS[hoveredIdx].tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "11px",
                      fontFamily: "monospace",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      backgroundColor: "rgba(56, 189, 248, 0.12)",
                      color: "var(--text-primary)",
                      border: "1px solid rgba(56, 189, 248, 0.3)",
                      fontWeight: 600,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: "28px",
                backgroundColor: "rgba(128, 128, 128, 0.04)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "12px",
              }}
            >
              <div
                className="font-pixel"
                style={{
                  fontSize: "11px",
                  color: "#38BDF8",
                  letterSpacing: "0.12em",
                  marginBottom: "8px",
                }}
              >
                // INTERACTIVE RADAR GUIDANCE
              </div>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.95rem",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                Radar points represent high-dimensional skill proficiency across Deep Learning backbones, inference optimization, and modern reactive web architectures. Hover over any node on the vector mesh to inspect telemetry.
              </p>
            </div>
          )}

          {/* Quick Metrics Indicators */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div
              style={{
                padding: "18px 20px",
                backgroundColor: "rgba(128, 128, 128, 0.04)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "10px",
              }}
            >
              <div className="font-pixel" style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.06em" }}>
                MEAN PROFICIENCY
              </div>
              <div className="font-chakra" style={{ fontSize: "1.7rem", fontWeight: 800, color: "#38BDF8", marginTop: "2px" }}>
                92.2%
              </div>
            </div>
            <div
              style={{
                padding: "18px 20px",
                backgroundColor: "rgba(128, 128, 128, 0.04)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "10px",
              }}
            >
              <div className="font-pixel" style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.06em" }}>
                VECTOR NODES PLOTTED
              </div>
              <div className="font-chakra" style={{ fontSize: "1.7rem", fontWeight: 800, color: "#818CF8", marginTop: "2px" }}>
                08 NODES
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
