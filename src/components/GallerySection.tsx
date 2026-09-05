"use client";

import React, { useState } from "react";
import { soundFX } from "@/utils/soundFX";

interface GalleryItem {
  id: string;
  order: string;
  src: string;
  title: string;
  subtitle: string;
  description: string;
}

const GALLERY_IMAGES: GalleryItem[] = [
  {
    id: "g1",
    order: "#01",
    src: "/gellery/Screenshot 2026-03-27 223109.png",
    title: "MODEL ARCHITECTURE & WORKFLOW",
    subtitle: "PyTorch & TensorRT Pipeline",
    description: "Deep learning model flow diagram and node execution graph.",
  },
  {
    id: "g2",
    order: "#02",
    src: "/gellery/Screenshot 2026-03-31 024118.png",
    title: "AUTONOMOUS AGENT SWARM",
    subtitle: "LangChain & Vector Memory",
    description: "Multi-agent reflection loop and dynamic tool dispatching.",
  },
  {
    id: "g3",
    order: "#03",
    src: "/gellery/Screenshot 2026-04-03 220503.png",
    title: "SPATIAL VISION MESH",
    subtitle: "Zero-Shot YOLOv10 & SAM",
    description: "Real-time edge object tracking and 3D boundary estimation.",
  },
  {
    id: "g4",
    order: "#04",
    src: "/gellery/Screenshot 2026-06-06 211710.png",
    title: "GENERATIVE STUDIO CANVAS",
    subtitle: "Next.js & WebContainer AST",
    description: "In-browser live React code compilation and LLM diff studio.",
  },
  {
    id: "g5",
    order: "#05",
    src: "/gellery/Screenshot 2026-06-22 143534.png",
    title: "VECTOR RETRIEVAL GRAPH",
    subtitle: "Qdrant & BM25 Hybrid Search",
    description: "Enterprise dense-sparse vector indexing & RAG cross-encoder.",
  },
  {
    id: "g6",
    order: "#06",
    src: "/gellery/Screenshot 2026-08-26 185339.png",
    title: "SPEECH SYNTHESIS STREAM",
    subtitle: "WebRTC & Whisper STT",
    description: "Full-duplex low-latency voice AI pipeline with VAD gating.",
  },
  {
    id: "g7",
    order: "#07",
    src: "/gellery/Screenshot 2026-08-26 185420.png",
    title: "TENSOR SHARDING MESH",
    subtitle: "Distributed vLLM & Ray",
    description: "High-throughput model parallelism and load-balanced cluster.",
  },
  {
    id: "g8",
    order: "#08",
    src: "/gellery/Screenshot 2026-08-31 005800.png",
    title: "COLAB DATA SCIENCE PAIRPLOT",
    subtitle: "Seaborn & Exploratory Data Analysis",
    description: "Feature correlation matrix and distribution density plots in Google Colab.",
  },
];

export default function GallerySection() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const handleCardClick = (item: GalleryItem) => {
    soundFX.playClick();
    setSelectedItem(item);
  };

  return (
    <section
      id="gallery"
      style={{
        width: "100%",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        position: "relative",
        overflow: "hidden",
        padding: "60px 48px 40px 48px",
        userSelect: "none",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* ── Background Cyber Matrix Grid ── */}
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

      {/* ── Top HUD Header Line ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "40px",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <svg
          style={{ width: "100%", height: "100%" }}
          preserveAspectRatio="none"
          viewBox="0 0 1440 40"
        >
          <path
            d="M 0,15 L 240,15 L 280,35 L 940,35 L 1440,35"
            fill="none"
            stroke="var(--hud-line)"
            strokeWidth="1.2"
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
        {/* ── Compact Bento Outer Container (Fits single screen viewport) ── */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            backdropFilter: "blur(16px)",
            border: "1.5px solid #20BEFF",
            borderRadius: "0px",
            padding: "24px 28px",
            display: "grid",
            gridTemplateColumns: "0.9fr 2.4fr",
            gap: "28px",
            alignItems: "center",
          }}
          className="gallery-responsive-container"
        >
          {/* ── LEFT COLUMN: Compact Creative Text Info ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <div>
              {/* Category Tag */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "10px",
                  padding: "3px 10px",
                  backgroundColor: "rgba(32, 190, 255, 0.1)",
                  border: "1px solid #20BEFF",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "#20BEFF",
                    display: "inline-block",
                  }}
                />
                <span
                  className="font-pixel"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.12em",
                    color: "#20BEFF",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  // 04. RESEARCH & LAB SNAPSHOTS
                </span>
              </div>

              {/* Compact Headline */}
              <h2
                style={{
                  fontSize: "clamp(1.6rem, 2.2vw, 2.2rem)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                  margin: "0 0 14px 0",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                <span style={{ display: "block" }}>LAB SNAPSHOTS</span>
                <span
                  style={{
                    display: "block",
                    fontWeight: 700,
                    color: "#20BEFF",
                  }}
                >
                  &amp; EXPERIMENTAL AI
                </span>
              </h2>

              {/* Compact Creative Copy */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  fontSize: "0.82rem",
                  lineHeight: 1.5,
                  color: "var(--text-secondary)",
                  fontWeight: 400,
                  marginBottom: "18px",
                }}
              >
                <p style={{ margin: 0 }}>
                  A live window into active ML experiments, deep neural network training runs,
                  Seaborn data distributions, and interactive Colab notebooks by <strong style={{ color: "var(--text-primary)" }}>Jaydeep Prajapati</strong>.
                </p>
              </div>

              {/* Compact Stat Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                {[
                  { label: "Snapshots", val: "8 Visual Runs" },
                  { label: "Data Science", val: "Seaborn & Colab" },
                  { label: "AI Models", val: "PyTorch & TensorRT" },
                  { label: "View Mode", val: "Click Image Full-Res" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "rgba(32, 190, 255, 0.05)",
                      border: "1px solid rgba(32, 190, 255, 0.3)",
                      padding: "6px 10px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "9px",
                        color: "#20BEFF",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {stat.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-primary)",
                        fontWeight: 600,
                      }}
                    >
                      {stat.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Compact Bento Grid (Single Screen Viewport Fit) ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
            }}
          >
            {/* ── TOP GRID ROW (Height: 215px) ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1.3fr 1.1fr",
                gap: "10px",
                height: "215px",
              }}
              className="gallery-grid-row"
            >
              {/* Card 1 */}
              <CleanGalleryCard item={GALLERY_IMAGES[0]} onClick={() => handleCardClick(GALLERY_IMAGES[0])} />

              {/* Middle Column Stack */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    flex: "1",
                  }}
                >
                  <CleanGalleryCard item={GALLERY_IMAGES[1]} onClick={() => handleCardClick(GALLERY_IMAGES[1])} />
                  <CleanGalleryCard item={GALLERY_IMAGES[2]} onClick={() => handleCardClick(GALLERY_IMAGES[2])} />
                </div>
                <div style={{ flex: "1.1" }}>
                  <CleanGalleryCard item={GALLERY_IMAGES[3]} onClick={() => handleCardClick(GALLERY_IMAGES[3])} />
                </div>
              </div>

              {/* Card 5 */}
              <CleanGalleryCard item={GALLERY_IMAGES[4]} onClick={() => handleCardClick(GALLERY_IMAGES[4])} />
            </div>

            {/* ── BOTTOM GRID ROW (Height: 215px) ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.3fr 0.95fr 1.25fr",
                gap: "10px",
                height: "215px",
              }}
              className="gallery-grid-row"
            >
              {/* Card 6 */}
              <CleanGalleryCard item={GALLERY_IMAGES[5]} onClick={() => handleCardClick(GALLERY_IMAGES[5])} />

              {/* Card 7 */}
              <CleanGalleryCard item={GALLERY_IMAGES[6]} onClick={() => handleCardClick(GALLERY_IMAGES[6])} />

              {/* Card 8 */}
              <CleanGalleryCard item={GALLERY_IMAGES[7]} onClick={() => handleCardClick(GALLERY_IMAGES[7])} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Fullscreen Lightbox Modal ── */}
      {selectedItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.92)",
            backdropFilter: "blur(12px)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "92vw",
              maxHeight: "92vh",
              backgroundColor: "#000000",
              borderRadius: "0px",
              border: "2px solid #20BEFF",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 18px",
                backgroundColor: "#080E1A",
                borderBottom: "1px solid #20BEFF",
              }}
            >
              <div style={{ color: "#20BEFF", fontWeight: 700, fontSize: "0.85rem" }}>
                {selectedItem.title}
              </div>

              <button
                onClick={() => {
                  soundFX.playClick();
                  setSelectedItem(null);
                }}
                style={{
                  backgroundColor: "transparent",
                  color: "#20BEFF",
                  border: "1px solid #20BEFF",
                  borderRadius: "0px",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Image */}
            <div
              style={{
                padding: "12px",
                backgroundColor: "#000000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={selectedItem.src}
                alt={selectedItem.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                  borderRadius: "0px",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Responsive CSS ── */}
      <style jsx global>{`
        @media (max-width: 1024px) {
          .gallery-responsive-container {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            padding: 16px !important;
          }

          .gallery-grid-row {
            height: auto !important;
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

{/* ── Pure Clean Gallery Card (Sharp 0px, No Hover FX) ── */}
function CleanGalleryCard({
  item,
  onClick,
}: {
  item: GalleryItem;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        border: "1.5px solid #20BEFF",
        borderRadius: "0px",
        backgroundColor: "#000000",
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={item.src}
        alt={item.title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          borderRadius: "0px",
          display: "block",
          transform: "none",
          filter: "none",
          transition: "none",
        }}
      />
    </div>
  );
}
