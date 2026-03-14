// src/pages/ClusterPage.js
import React, { useEffect, useState, useRef } from "react";
import { getClusterVisualization } from "../services/api";
import Nav from "../components/Nav";

const CLUSTER_COLORS = [
  "#1db954", "#22d3ee", "#f59e0b", "#f472b6",
  "#7c3aed", "#ef4444", "#34d399", "#60a5fa",
  "#a78bfa", "#fb923c",
];

export default function ClusterPage({ userId }) {
  const [points, setPoints]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [hovered, setHovered] = useState(null);
  const [filter, setFilter]   = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    getClusterVisualization(userId)
      .then((d) => setPoints(d.clusters || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [userId]);

  // Compute bounds for coordinate normalization
  const bounds = React.useMemo(() => {
    if (!points.length) return null;
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  }, [points]);

  const toSvgCoords = (x, y, w = 800, h = 500, pad = 40) => {
    if (!bounds) return { sx: 0, sy: 0 };
    const sx = pad + ((x - bounds.minX) / (bounds.maxX - bounds.minX)) * (w - 2 * pad);
    const sy = pad + ((y - bounds.minY) / (bounds.maxY - bounds.minY)) * (h - 2 * pad);
    return { sx, sy };
  };

  const clusters = [...new Set(points.map((p) => p.cluster))].sort();

  return (
    <>
      <Nav userId={userId} active="clusters" />
      <div className="page">
        <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>

          <header className="fade-in" style={{ marginBottom: "2rem" }}>
            <div className="badge badge-violet" style={{ marginBottom: "0.75rem" }}>
              ✦ PCA Cluster Visualization
            </div>
            <h1>Your Music Universe</h1>
            <p style={{ marginTop: "0.5rem" }}>
              Songs plotted in 2D space using PCA. Each color = a K-Means cluster.
              Similar-sounding songs cluster together.
            </p>
          </header>

          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <p>Running PCA dimensionality reduction...</p>
            </div>
          )}

          {error && (
            <div className="card" style={{ borderColor: "var(--rose)", textAlign: "center" }}>
              <p style={{ color: "var(--rose)" }}>⚠️ {error}</p>
              <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
                Run the ML pipeline on Dashboard first.
              </p>
            </div>
          )}

          {!loading && points.length > 0 && (
            <>
              {/* Cluster legend */}
              <div className="fade-in" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                <button
                  className="btn btn-ghost"
                  style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem" }}
                  onClick={() => setFilter(null)}
                >
                  All
                </button>
                {clusters.map((c) => (
                  <button
                    key={c}
                    className="btn btn-ghost"
                    style={{
                      padding: "0.3rem 0.75rem",
                      fontSize: "0.8rem",
                      borderColor: filter === c ? CLUSTER_COLORS[c % CLUSTER_COLORS.length] : undefined,
                      color: filter === c ? CLUSTER_COLORS[c % CLUSTER_COLORS.length] : undefined,
                    }}
                    onClick={() => setFilter(filter === c ? null : c)}
                  >
                    <span style={{
                      display: "inline-block",
                      width: 8, height: 8,
                      borderRadius: "50%",
                      background: CLUSTER_COLORS[c % CLUSTER_COLORS.length],
                      marginRight: 4,
                    }} />
                    Cluster {c}
                  </button>
                ))}
              </div>

              {/* SVG scatter plot */}
              <div className="cluster-canvas card fade-in fade-in-delay-1">
                <svg
                  ref={svgRef}
                  viewBox="0 0 800 500"
                  style={{ width: "100%", height: "100%" }}
                >
                  {points
                    .filter((p) => filter === null || p.cluster === filter)
                    .map((p, i) => {
                      const { sx, sy } = toSvgCoords(p.x, p.y);
                      const color = CLUSTER_COLORS[p.cluster % CLUSTER_COLORS.length];
                      const isHovered = hovered?.track_id === p.track_id;
                      return (
                        <g key={p.track_id || i}>
                          <circle
                            cx={sx} cy={sy}
                            r={isHovered ? 7 : 4}
                            fill={color}
                            fillOpacity={isHovered ? 1 : 0.7}
                            stroke={isHovered ? "#fff" : "transparent"}
                            strokeWidth={isHovered ? 1.5 : 0}
                            style={{ cursor: "pointer", transition: "r 0.15s, fill-opacity 0.15s" }}
                            onMouseEnter={() => setHovered(p)}
                            onMouseLeave={() => setHovered(null)}
                          />
                        </g>
                      );
                    })}
                </svg>

                {/* Tooltip */}
                {hovered && (
                  <div style={{
                    position: "absolute",
                    top: 16, right: 16,
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.75rem 1rem",
                    maxWidth: 220,
                    fontSize: "0.82rem",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    pointerEvents: "none",
                  }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{hovered.name}</div>
                    <div style={{ color: "var(--text-2)" }}>{hovered.artist}</div>
                    <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
                      <span style={{ color: "var(--text-3)" }}>Energy: <span style={{ color: "var(--green)" }}>{hovered.energy}</span></span>
                      <span style={{ color: "var(--text-3)" }}>Valence: <span style={{ color: "var(--cyan)" }}>{hovered.valence}</span></span>
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <span style={{ color: "var(--text-3)" }}>Cluster: </span>
                      <span style={{ color: CLUSTER_COLORS[hovered.cluster % CLUSTER_COLORS.length], fontWeight: 600 }}>
                        {hovered.cluster}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="stat-row fade-in fade-in-delay-2" style={{ marginTop: "1.25rem" }}>
                <div className="stat-pill">Total tracks <span>{points.length}</span></div>
                <div className="stat-pill">Clusters <span>{clusters.length}</span></div>
                {filter !== null && (
                  <div className="stat-pill">
                    In cluster {filter} <span>{points.filter((p) => p.cluster === filter).length}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
