"use client";

import React, { useState, useRef, useEffect } from "react";

interface WaspButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  variant?: "dark" | "light" | "outline";
  cutTopLeft?: number;
  cutBottomRight?: number;
  cutTopRight?: number;
  cutBottomLeft?: number;
  paddingX?: number;
  paddingY?: number;
  fontSize?: number;
  letterSpacing?: number;
  borderWidth?: number;
  className?: string;
}

export function WaspButton({
  children,
  variant = "dark",
  cutTopLeft = 14,
  cutBottomRight = 14,
  cutTopRight = 0,
  cutBottomLeft = 0,
  paddingX = 39,
  paddingY = 16,
  fontSize = 13,
  letterSpacing = 0.14,
  borderWidth = 1.4,
  className = "",
  style,
  ...props
}: WaspButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLAnchorElement>(null);
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: 160, h: 48 });

  const isLight = variant === "light";

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setDims({ w: rect.width, h: rect.height });
      }
    }
  }, [children, paddingX, paddingY, fontSize, letterSpacing]);

  const { w, h } = dims;

  // Exact 45-degree pixel path (dx == dy)
  const pathData = `
    M ${cutTopLeft},0 
    L ${w - cutTopRight},0 
    L ${w},${cutTopRight} 
    L ${w},${h - cutBottomRight} 
    L ${w - cutBottomRight},${h} 
    L ${cutBottomLeft},${h} 
    L 0,${h - cutBottomLeft} 
    L 0,${cutTopLeft} 
    Z
  `;

  return (
    <a
      suppressHydrationWarning
      ref={containerRef}
      {...props}
      onMouseEnter={(e) => {
        setIsHovered(true);
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        props.onMouseLeave?.(e);
      }}
      className={`font-chakra select-none ${className}`}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `${paddingY}px ${paddingX}px`,
        textDecoration: "none",
        cursor: "pointer",
        transition: "transform 0.15s ease, filter 0.2s ease",
        transform: isHovered ? "translateY(-1px)" : "translateY(0)",
        filter: isHovered ? "brightness(1.15)" : "none",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        ...style,
      }}
    >
      {/* ── True 45° Pixel SVG Vector Shape ── */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <path
          d={pathData}
          fill={
            isLight
              ? isHovered
                ? "#E5E7EB"
                : "#ffffff"
              : isHovered
              ? "#131822"
              : "rgba(11, 14, 20, 0.95)"
          }
          stroke={
            isLight
              ? "#ffffff"
              : isHovered
              ? "rgba(255, 255, 255, 0.55)"
              : "rgba(255, 255, 255, 0.3)"
          }
          strokeWidth={borderWidth}
          strokeLinejoin="miter"
        />
      </svg>

      {/* ── Button Label ── */}
      <span
        style={{
          position: "relative",
          zIndex: 2,
          color: isLight ? "#000000" : "#ffffff",
          fontWeight: 700,
          fontSize: `${fontSize}px`,
          letterSpacing: `${letterSpacing}em`,
          textTransform: "uppercase",
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        {children}
      </span>
    </a>
  );
}
