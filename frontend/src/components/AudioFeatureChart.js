// src/components/AudioFeatureChart.js
// Renders a radar/spider chart of audio features using pure SVG — no external chart lib needed.
import React from "react";

const FEATURES = [
  { key: "danceability", label: "Dance" },
  { key: "energy",       label: "Energy" },
  { key: "valence",      label: "Valence" },
  { key: "acousticness", label: "Acoustic" },
  { key: "speechiness",  label: "Speech" },
];

const SIZE   = 240;
const CENTER = SIZE / 2;
const RADIUS = 90;
const LEVELS = 4;

function polarToCartesian(angle, r) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: CENTER + r * Math.cos(rad),
    y: CENTER + r * Math.sin(rad),
  };
}

function buildPath(values) {
  const step = 360 / values.length;
  const points = values.map((v, i) => {
    const { x, y } = polarToCartesian(i * step, v * RADIUS);
    return `${x},${y}`;
  });
  return `M${points.join("L")}Z`;
}

export default function AudioFeatureChart({ features }) {
  const values = FEATURES.map((f) => Math.min(1, Math.max(0, features[f.key] ?? 0)));
  const step   = 360 / FEATURES.length;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
      {/* Radar SVG */}
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        style={{ flexShrink: 0 }}
      >
        {/* Grid rings */}
        {Array.from({ length: LEVELS }, (_, i) => {
          const r = (RADIUS / LEVELS) * (i + 1);
          const pts = Array.from({ length: FEATURES.length }, (_, j) => {
            const { x, y } = polarToCartesian(j * step, r);
            return `${x},${y}`;
          }).join("L");
          return (
            <polygon
              key={i}
              points={pts}
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis lines */}
        {FEATURES.map((_, i) => {
          const outer = polarToCartesian(i * step, RADIUS);
          return (
            <line
              key={i}
              x1={CENTER} y1={CENTER}
              x2={outer.x} y2={outer.y}
              stroke="var(--border)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <path
          d={buildPath(values)}
          fill="rgba(29,185,84,0.15)"
          stroke="var(--green)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {values.map((v, i) => {
          const { x, y } = polarToCartesian(i * step, v * RADIUS);
          return (
            <circle
              key={i}
              cx={x} cy={y}
              r={4}
              fill="var(--green)"
              stroke="var(--bg)"
              strokeWidth="2"
            />
          );
        })}

        {/* Labels */}
        {FEATURES.map((f, i) => {
          const { x, y } = polarToCartesian(i * step, RADIUS + 18);
          return (
            <text
              key={i}
              x={x} y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--text-2)"
              fontSize="10"
              fontFamily="Inter, sans-serif"
            >
              {f.label}
            </text>
          );
        })}
      </svg>

      {/* Feature list */}
      <div className="feature-bars" style={{ flex: 1, minWidth: 200 }}>
        <p style={{ fontSize: "0.8rem", color: "var(--text-3)", marginBottom: "0.75rem" }}>
          Avg across your top tracks
        </p>
        {FEATURES.map((f, i) => (
          <div className="feature-bar" key={f.key}>
            <span className="feature-bar__label">{f.label}</span>
            <div className="feature-bar__track">
              <div
                className="feature-bar__fill"
                style={{
                  width: `${(values[i] * 100).toFixed(0)}%`,
                  transitionDelay: `${i * 60}ms`,
                }}
              />
            </div>
            <span className="feature-bar__value">{values[i].toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
