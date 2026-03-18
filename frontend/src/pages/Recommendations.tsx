// src/pages/Recommendations.tsx
import { useEffect, useState } from "react";
import { getRecommendations } from "../services/api";
import TrackCard from "../components/TrackCard";
import Nav from "../components/Nav";

export default function Recommendations({ userId }) {
  const [recs, setRecs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [n, setN]             = useState(20);

  const load = () => {
    setLoading(true);
    setError(null);
    getRecommendations(userId, n)
      .then((d) => setRecs(d.recommendations || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [userId, n]);

  return (
    <>
      <Nav userId={userId} active="recommendations" />
      <div className="page">
        <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>

          <header className="fade-in" style={{ marginBottom: "2rem" }}>
            <div className="badge badge-green" style={{ marginBottom: "0.75rem" }}>
              ✦ Personalized For You
            </div>
            <h1>Recommendations</h1>
            <p style={{ marginTop: "0.5rem" }}>
              Ranked using cosine similarity + KNN from your backend-generated listening profile
            </p>
          </header>

          {/* Controls */}
          <div className="card fade-in fade-in-delay-1" style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <span style={{ color: "var(--text-2)", fontSize: "0.875rem" }}>Show:</span>
            {[10, 20, 30, 50].map((count) => (
              <button
                key={count}
                className="btn btn-ghost"
                style={{
                  padding: "0.4rem 0.9rem",
                  fontSize: "0.82rem",
                  background: n === count ? "var(--green-glow)" : undefined,
                  color: n === count ? "var(--green)" : undefined,
                }}
                onClick={() => setN(count)}
              >
                {count}
              </button>
            ))}
            <button className="btn btn-outline" style={{ marginLeft: "auto" }} onClick={load}>
              ⟳ Refresh
            </button>
          </div>

          {/* Results */}
          {error && (
            <div className="card" style={{ borderColor: "var(--rose)", color: "var(--rose)", textAlign: "center", padding: "2rem" }}>
              <p>⚠️ {error}</p>
              <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
                Make sure you've run the ML pipeline on the Dashboard first.
              </p>
            </div>
          )}

          {loading && <div className="spinner" />}

          {!loading && !error && recs.length === 0 && (
            <div className="empty-state">
              <h3>No recommendations yet</h3>
              <p>Run the ML pipeline on your Dashboard to generate recommendations.</p>
            </div>
          )}

          {!loading && recs.length > 0 && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {recs.map((track, i) => (
                <TrackCard
                  key={track.track_id}
                  track={{ ...track, id: track.track_id }}
                  rank={i + 1}
                  userId={userId}
                  showScore
                  showFeatures
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
