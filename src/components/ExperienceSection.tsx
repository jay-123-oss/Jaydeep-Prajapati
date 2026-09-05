"use client";

import React, { useState } from "react";
import { WaspButton } from "@/components/ui/wasp-button";

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  badge: string;
  overview: string;
  achievements: string[];
  technologies: string[];
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: "intern-saiket",
    role: "Front-End Development Intern",
    company: "Saiket Systems",
    location: "Virtual / Remote",
    period: "2026",
    badge: "INDUSTRY INTERNSHIP",
    overview:
      "Completed hands-on software development internship, successfully delivering assigned technical front-end projects, reactive user interfaces, and API-driven interfaces.",
    achievements: [
      "Engineered production-ready front-end web applications with modern component architecture and reactive state management.",
      "Integrated RESTful APIs and asynchronous data flows, optimizing rendering speed and eliminating render bottlenecks.",
      "Conducted thorough cross-browser validation, responsive UI testing, and component debugging.",
      "Collaborated using Git version control, structured branch workflows, and engineering reviews.",
    ],
    technologies: ["React", "JavaScript", "HTML5", "CSS3", "REST APIs", "Git", "Bootstrap"],
  },
  {
    id: "trinetra-lead",
    role: "Lead Systems Developer & Vision Researcher",
    company: "Trinetra: Offline Spatial Perception Engine",
    location: "Varanasi, UP / On-Device",
    period: "AUG 2025 — PRESENT",
    badge: "FLAGSHIP AI SHIPMENT",
    overview:
      "Engineered a local-first, zero-cloud computer vision perception assistant designed for offline environmental spatial understanding and obstacle safety assistance.",
    achievements: [
      "Trained and deployed YOLO-based real-time object detection models with optimized ONNX inference pipelines for sub-28ms edge speed.",
      "Integrated Depth Anything V2 and ARCore Depth capabilities for 3D depth perception and spatial obstacle estimation.",
      "Built real-time frame processing pipelines handling object tracking, motion vector analysis, and collision risk detection.",
      "Architected fully privacy-preserving local runtime requiring zero external cloud dependencies or server latency.",
    ],
    technologies: ["Python", "YOLO", "Depth Anything V2", "ONNX", "ARCore", "OpenCV", "CameraX"],
  },
  {
    id: "ai-agent-planner",
    role: "Autonomous Multi-Agent Architect",
    company: "AI Agent Travel Planning & Reasoning Suite",
    location: "Autonomous Project",
    period: "EARLY 2026",
    badge: "LANGGRAPH AGENTIC RAG",
    overview:
      "Architected an end-to-end multi-agent workflow leveraging LangGraph DAG orchestration and LangChain to automate complex travel planning and constraint satisfaction.",
    achievements: [
      "Constructed cyclical agent state-machines in LangGraph handling user intent parsing, budget constraints, and dynamic rescheduling.",
      "Integrated PostgreSQL database with robust schema definitions to ensure persistent agent memory and context state across sessions.",
      "Developed high-speed asynchronous FastAPI microservice backend exposing structured JSON travel payloads.",
      "Implemented validation guardrails and error-handling checkpoints preventing hallucination and dead-end loops in reasoning graphs.",
    ],
    technologies: ["LangGraph", "LangChain", "FastAPI", "PostgreSQL", "Python", "Pydantic", "REST APIs"],
  },
  {
    id: "ml-predictive-suite",
    role: "Machine Learning & Predictive Engineer",
    company: "Student ML Suite & Analytical Microservices",
    location: "Academic & Open Project",
    period: "LATE 2025",
    badge: "APPLIED ML & PIPELINES",
    overview:
      "Developed predictive analytics systems and data pipelines focused on student performance forecasting, exploratory data analysis, and model serving.",
    achievements: [
      "Engineered automated data preprocessing, outlier detection, and feature transformation pipelines with Pandas and NumPy.",
      "Trained, tuned, and evaluated multiple supervised ML models using Scikit-learn with rigorous cross-validation and confusion matrix auditing.",
      "Exposed serialized model pipelines through lightweight FastAPI endpoints for instant scoring and prediction.",
      "Authored comprehensive technical documentation, model metrics reporting, and reproducible Jupyter analytical workflows.",
    ],
    technologies: ["Python", "Scikit-Learn", "FastAPI", "Pandas", "NumPy", "Jupyter", "Matplotlib"],
  },
  {
    id: "fullstack-production",
    role: "Full-Stack Software Engineering",
    company: "Production Web Applications & Database Systems",
    location: "Web Development Track",
    period: "2024 — 2025",
    badge: "FULL-STACK PRODUCTION",
    overview:
      "Built full-stack database-backed web platforms emphasizing clean modular code, responsive interfaces, and relational database integrity.",
    achievements: [
      "Developed responsive dynamic web portals utilizing modern HTML, CSS, JavaScript, PHP, and MySQL.",
      "Designed relational database schemas with foreign key constraints, indexing, and parameterized queries for SQL injection defense.",
      "Constructed custom REST endpoints and dynamic client-side DOM manipulation without heavy external runtime dependencies.",
      "Achieved 95+ Google Lighthouse scores across Performance, Accessibility, and Best Practices.",
    ],
    technologies: ["JavaScript", "Next.js", "PHP", "MySQL", "HTML5", "CSS3", "Git"],
  },
];

export default function ExperienceSection() {
  const [selectedExpId, setSelectedExpId] = useState<string>(EXPERIENCES[0].id);

  const selectedExp =
    EXPERIENCES.find((exp) => exp.id === selectedExpId) || EXPERIENCES[0];

  return (
    <section
      id="experience"
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-primary)",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(60px, 8vw, 110px) clamp(16px, 4vw, 56px) clamp(70px, 9vw, 130px)",
        userSelect: "none",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* ── Background Grid ── */}
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
            d="M 0,25 L 200,25 L 240,50 L 1000,50 L 1440,50"
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
                backgroundColor: "#8B5CF6",
                boxShadow: "0 0 8px #8B5CF6",
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
              // 04. TECHNICAL EXPERIENCE &amp; APPLIED ENGINEERING TRACK
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
                <span style={{ display: "block" }}>ENGINEERING TRACK &amp;</span>
                <span style={{ display: "block", color: "var(--text-secondary)" }}>
                  PRODUCTION BUILDS
                </span>
              </h2>
            </div>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                maxWidth: "440px",
                margin: 0,
              }}
            >
              Verified industry front-end internship, flagship on-device computer vision systems (Trinetra), autonomous LangGraph agents, and end-to-end API deployments.
            </p>
          </div>
        </div>

        {/* ── Interactive Two-Column Experience Console ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* Left Column: Timeline Navigation List */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {EXPERIENCES.map((exp) => {
              const isSelected = exp.id === selectedExpId;
              return (
                <div
                  key={exp.id}
                  onClick={() => setSelectedExpId(exp.id)}
                  style={{
                    position: "relative",
                    backgroundColor: isSelected
                      ? "rgba(139, 92, 246, 0.12)"
                      : "var(--bg-card)",
                    backdropFilter: "blur(12px)",
                    border: isSelected
                      ? "1px solid rgba(139, 92, 246, 0.6)"
                      : "1px solid var(--border-subtle)",
                    padding: "clamp(16px, 2.5vw, 22px) clamp(16px, 3vw, 26px)",
                    clipPath:
                      "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
                    cursor: "pointer",
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: isSelected
                      ? "0 10px 30px -8px rgba(139, 92, 246, 0.25)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "var(--border-active)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "var(--border-subtle)";
                    }
                  }}
                >
                  {/* Left indicator glow line if selected */}
                  {isSelected && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: "3px",
                        backgroundColor: "#8B5CF6",
                        boxShadow: "0 0 12px #8B5CF6",
                      }}
                    />
                  )}

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
                        fontSize: "11px",
                        color: isSelected ? "#8B5CF6" : "var(--text-muted)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {exp.period}
                    </span>

                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        color: isSelected ? "#8B5CF6" : "var(--text-muted)",
                        backgroundColor: "rgba(139, 92, 246, 0.12)",
                        padding: "2px 6px",
                        borderRadius: "2px",
                        border: isSelected
                          ? "1px solid rgba(139, 92, 246, 0.3)"
                          : "1px solid var(--border-subtle)",
                      }}
                    >
                      {exp.badge}
                    </span>
                  </div>

                  <h3
                    className="font-chakra card-heading"
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      margin: "0 0 4px 0",
                    }}
                  >
                    {exp.role}
                  </h3>

                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {exp.company} · {exp.location}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Telemetry Dossier */}
          <div
            style={{
              position: "relative",
              backgroundColor: "var(--bg-card)",
              backdropFilter: "blur(16px)",
              border: "1px solid var(--border-subtle)",
              padding: "clamp(20px, 3.5vw, 36px)",
              clipPath:
                "polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px)",
              boxShadow: "0 15px 40px -10px rgba(0,0,0,0.5)",
            }}
          >
            {/* Top Corner HUD Brackets */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "18px",
                width: "12px",
                height: "12px",
                borderTop: "1.5px solid rgba(139, 92, 246, 0.6)",
                borderLeft: "1.5px solid rgba(139, 92, 246, 0.6)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                width: "12px",
                height: "12px",
                borderTop: "1.5px solid rgba(139, 92, 246, 0.6)",
                borderRight: "1.5px solid rgba(139, 92, 246, 0.6)",
                pointerEvents: "none",
              }}
            />

            {/* Header Area */}
            <div style={{ marginBottom: "24px" }}>
              <div
                className="font-pixel"
                style={{
                  fontSize: "11px",
                  color: "#8B5CF6",
                  letterSpacing: "0.12em",
                  marginBottom: "8px",
                }}
              >
                // SYSTEM DOSSIER: {selectedExp.id.toUpperCase()}
              </div>

              <h3
                className="font-chakra card-heading"
                style={{
                  fontSize: "1.7rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  lineHeight: 1.1,
                  margin: "0 0 6px 0",
                }}
              >
                {selectedExp.role}
              </h3>

              <div
                style={{
                  fontSize: "0.95rem",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                  {selectedExp.company}
                </span>
                <span>·</span>
                <span>{selectedExp.location}</span>
                <span>·</span>
                <span style={{ color: "#8B5CF6" }}>{selectedExp.period}</span>
              </div>
            </div>

            {/* Role Overview */}
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                marginBottom: "28px",
                padding: "14px 16px",
                backgroundColor: "rgba(128, 128, 128, 0.05)",
                borderLeft: "2px solid #8B5CF6",
              }}
            >
              {selectedExp.overview}
            </p>

            {/* Impact & Key Achievements */}
            <div style={{ marginBottom: "28px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "14px",
                }}
              >
                Key Engineering Breakthroughs
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {selectedExp.achievements.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      fontSize: "0.9rem",
                      lineHeight: 1.5,
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span
                      style={{
                        color: "#8B5CF6",
                        fontSize: "12px",
                        marginTop: "2px",
                      }}
                    >
                      ◆
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies Used */}
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "12px",
                }}
              >
                Core Toolchain &amp; Technologies
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {selectedExp.technologies.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      backgroundColor: "rgba(128, 128, 128, 0.08)",
                      padding: "4px 10px",
                      borderRadius: "2px",
                      border: "1px solid var(--border-subtle)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
