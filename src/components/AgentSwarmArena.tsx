"use client";

import React, { useState } from "react";
import { soundFX } from "@/utils/soundFX";

interface AgentNode {
  id: string;
  name: string;
  role: string;
  status: "IDLE" | "ANALYZING" | "EXECUTING" | "RESOLVED";
  avatar: string;
  badge: string;
}

interface Incident {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  description: string;
  resolutionSteps: {
    agentId: string;
    action: string;
    timeMs: number;
  }[];
}

const INCIDENTS: Incident[] = [
  {
    id: "gpu-oom",
    title: "GPU VRAM OOM LEAK ON NODE-4",
    severity: "CRITICAL",
    description: "Multi-tenant LLM inference node exceeded 99.4% VRAM capacity during batch un-quantized attention pass.",
    resolutionSteps: [
      {
        agentId: "sentinel",
        action: "Detected memory pressure spike (79.8GB/80GB) on H100 GPU cluster. Triggered priority circuit breaker.",
        timeMs: 40,
      },
      {
        agentId: "architect",
        action: "Rerouted inference queue to AWS Bedrock standby cluster and partitioned KV cache into 4-bit AWQ blocks.",
        timeMs: 120,
      },
      {
        agentId: "executor",
        action: "Executed warm model eviction on Node-4. Reloaded GGUF INT4 quantized weights. Freed 48.2GB VRAM.",
        timeMs: 220,
      },
      {
        agentId: "sentinel",
        action: "Health check passed. Latency normalized to 18ms. Incident mitigated with zero dropped queries.",
        timeMs: 310,
      },
    ],
  },
  {
    id: "ddos-surge",
    title: "12.8M REQ/SEC DISTRIBUTED BOTNET SURGE",
    severity: "HIGH",
    description: "Anomalous SYN/API flood targeting public embeddings endpoint from 4,200 spoofed ASN origins.",
    resolutionSteps: [
      {
        agentId: "sentinel",
        action: "Anomaly classifier flagged 94.2% entropy shift in inbound header signatures. Identified synthetic bot fingerprint.",
        timeMs: 35,
      },
      {
        agentId: "architect",
        action: "Synthesized dynamic eBPF packet filter rule and deployed adaptive PoW cryptographic puzzle challenge.",
        timeMs: 95,
      },
      {
        agentId: "executor",
        action: "Injected rate-limit iptables drop-rules across 16 global edge proxies. Dropped 99.8% botnet egress.",
        timeMs: 190,
      },
      {
        agentId: "sentinel",
        action: "Legitimate user p99 latency restored to 24ms. Zero origin server degradation.",
        timeMs: 270,
      },
    ],
  },
  {
    id: "hallucination-jailbreak",
    title: "ADVERSARIAL PROMPT INJECTION ATTACK",
    severity: "CRITICAL",
    description: "Multi-step obfuscated jailbreak payload attempting recursive system instruction bypass & RAG poison.",
    resolutionSteps: [
      {
        agentId: "sentinel",
        action: "Neural safety guardrail flagged high semantic divergence and recursive prompt escape tokens.",
        timeMs: 28,
      },
      {
        agentId: "architect",
        action: "Isolated vector embedding cluster. Ran Graph-RAG cosine hallucination check against verified ground truth corpus.",
        timeMs: 85,
      },
      {
        agentId: "executor",
        action: "Neutralized toxic vector payload. Sanitized context window and returned safe refusal response with zero leak.",
        timeMs: 165,
      },
      {
        agentId: "sentinel",
        action: "Adversarial signature hashed and added to global threat intelligence cache.",
        timeMs: 230,
      },
    ],
  },
];

export default function AgentSwarmArena() {
  const [selectedIncident, setSelectedIncident] = useState<Incident>(INCIDENTS[0]);
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<{ agent: string; text: string; time: number }[]>([]);
  const [metrics, setMetrics] = useState({
    resolutionTime: "248ms",
    costSaved: "$1,420",
    healthScore: "100%",
  });

  const [agents, setAgents] = useState<AgentNode[]>([
    {
      id: "sentinel",
      name: "SENTINEL-01",
      role: "Security & Anomaly Watchdog",
      status: "IDLE",
      avatar: "🛡️",
      badge: "ACTIVE SENTRY",
    },
    {
      id: "architect",
      name: "ARCHITECT-02",
      role: "Topology & Sub-Graph Router",
      status: "IDLE",
      avatar: "🧠",
      badge: "CONSENSUS NODE",
    },
    {
      id: "executor",
      name: "EXECUTOR-03",
      role: "Hot-Patch & GPU Runtime Worker",
      status: "IDLE",
      avatar: "⚡",
      badge: "AUTO-HEALER",
    },
  ]);

  // Run autonomous swarm simulation
  const runSimulation = (incident: Incident) => {
    if (isRunningSimulation) return;
    soundFX.playClick();
    setIsRunningSimulation(true);
    setSelectedIncident(incident);
    setSimulationLogs([]);

    soundFX.playNotification();

    const steps = incident.resolutionSteps;
    let delayAccum = 300;

    steps.forEach((step, idx) => {
      setTimeout(() => {
        soundFX.playClick();

        setAgents((prev) =>
          prev.map((a) => {
            if (a.id === step.agentId) {
              return { ...a, status: "EXECUTING" };
            }
            return { ...a, status: "ANALYZING" };
          })
        );

        const agentObj = agents.find((a) => a.id === step.agentId);
        setSimulationLogs((prev) => [
          ...prev,
          {
            agent: agentObj?.name || step.agentId.toUpperCase(),
            text: step.action,
            time: step.timeMs,
          },
        ]);

        if (idx === steps.length - 1) {
          setTimeout(() => {
            setIsRunningSimulation(false);
            soundFX.playSuccess();
            setAgents((prev) => prev.map((a) => ({ ...a, status: "RESOLVED" })));
            setMetrics({
              resolutionTime: `${step.timeMs + 28}ms`,
              costSaved: `$${(Math.random() * 800 + 1200).toFixed(0)}`,
              healthScore: "100% NOMINAL",
            });
          }, 500);
        }
      }, delayAccum);

      delayAccum += 600;
    });
  };

  return (
    <section
      id="agent-swarm-arena"
      style={{
        width: "100%",
        minHeight: "85vh",
        backgroundColor: "var(--bg-secondary)",
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
          <path d="M 0,20 L 160,20 L 200,48 L 860,48 L 1440,48" fill="none" stroke="var(--hud-line)" strokeWidth={1.2} />
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
                backgroundColor: "#10B981",
                boxShadow: "0 0 8px #10B981",
                display: "inline-block",
              }}
            />
            <span className="font-pixel" style={{ fontSize: "12px", letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              // 04.5 AUTONOMOUS MULTI-AGENT COLLABORATION
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
                MULTI-AGENT INCIDENT{" "}
                <span style={{ color: "#10B981" }}>AUTO-HEALING ARENA</span>
              </h2>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "440px", margin: 0 }}>
              Trigger live simulated production anomalies. Watch 3 distributed neural agents communicate via RAFT consensus and heal clusters in sub-300ms.
            </p>
          </div>
        </div>

        {/* 3 AGENT NODES TOPOLOGY */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          {agents.map((agent) => (
            <div
              key={agent.id}
              style={{
                padding: "20px",
                borderRadius: "8px",
                backgroundColor: "var(--bg-card)",
                border: agent.status === "EXECUTING" ? "1.5px solid #10B981" : "1px solid var(--border-subtle)",
                boxShadow: agent.status === "EXECUTING" ? "0 0 20px rgba(16, 185, 129, 0.25)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "24px" }}>{agent.avatar}</span>
                <span
                  className="font-pixel"
                  style={{
                    fontSize: "9px",
                    padding: "3px 8px",
                    borderRadius: "3px",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-muted)",
                  }}
                >
                  {agent.badge}
                </span>
              </div>

              <div className="font-chakra" style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                {agent.name}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>
                {agent.role}
              </div>

              <div
                className="font-pixel"
                style={{
                  borderTop: "1px solid var(--border-subtle)",
                  paddingTop: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                }}
              >
                <span style={{ color: "var(--text-muted)" }}>STATUS:</span>
                <strong
                  style={{
                    color:
                      agent.status === "EXECUTING"
                        ? "#F59E0B"
                        : agent.status === "RESOLVED"
                        ? "#10B981"
                        : "var(--text-muted)",
                  }}
                >
                  ● {agent.status}
                </strong>
              </div>
            </div>
          ))}
        </div>

        {/* INCIDENT CONSOLE & TELEMETRY */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Left: Incident Presets */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div className="font-pixel" style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
              SELECT INCIDENT ANOMALY PRESET:
            </div>

            {INCIDENTS.map((inc) => {
              const isSelected = selectedIncident.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => {
                    if (!isRunningSimulation) {
                      soundFX.playClick();
                      setSelectedIncident(inc);
                    }
                  }}
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    backgroundColor: isSelected ? "var(--bg-card-hover)" : "var(--bg-card)",
                    border: isSelected ? "1.5px solid #10B981" : "1px solid var(--border-subtle)",
                    cursor: isRunningSimulation ? "not-allowed" : "pointer",
                    opacity: isRunningSimulation && !isSelected ? 0.6 : 1,
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span className="font-chakra" style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                      {inc.title}
                    </span>
                    <span
                      className="font-pixel"
                      style={{
                        fontSize: "9px",
                        padding: "2px 6px",
                        borderRadius: "2px",
                        backgroundColor: inc.severity === "CRITICAL" ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)",
                        color: inc.severity === "CRITICAL" ? "#EF4444" : "#F59E0B",
                        border: inc.severity === "CRITICAL" ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(245, 158, 11, 0.3)",
                      }}
                    >
                      {inc.severity}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.4 }}>
                    {inc.description}
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => runSimulation(selectedIncident)}
              disabled={isRunningSimulation}
              className="font-pixel"
              style={{
                padding: "12px 24px",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.1em",
                borderRadius: "4px",
                cursor: isRunningSimulation ? "wait" : "pointer",
                border: "1.5px solid #10B981",
                backgroundColor: isRunningSimulation ? "rgba(16, 185, 129, 0.2)" : "#10B981",
                color: isRunningSimulation ? "#A7F3D0" : "#000000",
                boxShadow: "0 0 20px rgba(16, 185, 129, 0.35)",
                marginTop: "6px",
                transition: "all 0.2s ease",
              }}
            >
              {isRunningSimulation ? "⚡ AGENTS AUTO-HEALING CLUSTER..." : "⚡ SIMULATE ANOMALY & AUTO-HEAL"}
            </button>
          </div>

          {/* Right: Live Consensus Stream */}
          <div
            style={{
              padding: "20px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid var(--border-subtle)",
                  paddingBottom: "12px",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div className="font-pixel" style={{ fontSize: "11px", color: "var(--text-primary)", fontWeight: 700 }}>
                  SWARM CONSENSUS LOG
                </div>
                <div className="font-pixel" style={{ fontSize: "10px", color: "var(--text-muted)", display: "flex", gap: "12px" }}>
                  <span>TIME: <strong style={{ color: "#10B981" }}>{metrics.resolutionTime}</strong></span>
                  <span>SAVED: <strong style={{ color: "#38BDF8" }}>{metrics.costSaved}</strong></span>
                </div>
              </div>

              {/* Log Stream Window */}
              <div
                className="font-pixel"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  minHeight: "180px",
                  maxHeight: "260px",
                  overflowY: "auto",
                }}
              >
                {simulationLogs.length === 0 ? (
                  <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "11px", margin: "auto 0" }}>
                    AWAITING ANOMALY TRIGGER • AGENT CLUSTER STANDBY
                  </div>
                ) : (
                  simulationLogs.map((log, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "4px",
                        backgroundColor: "rgba(0,0,0,0.25)",
                        border: "1px solid var(--border-subtle)",
                        fontSize: "11px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ color: "#10B981", fontWeight: 700 }}>
                          [{log.time}ms] {log.agent}
                        </span>
                        <span style={{ color: "#38BDF8", fontSize: "9px" }}>EXECUTED</span>
                      </div>
                      <div style={{ color: "var(--text-primary)", lineHeight: 1.5 }}>
                        {log.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div
              className="font-pixel"
              style={{
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: "12px",
                marginTop: "16px",
                fontSize: "10px",
                color: "var(--text-muted)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>PROTOCOL: RAFT + BYZANTINE TOLERANCE</span>
              <span style={{ color: "#10B981" }}>HEALTH: {metrics.healthScore}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
