// src/pages/Dashboard.js
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import {
  getUserProfile,
  getUserTopTracks,
  getUserTopArtists,
  generateDataset,
  trainModel,
} from "../services/api";
import TrackCard from "../components/TrackCard";
import ArtistCard from "../components/ArtistCard";
import AudioFeatureChart from "../components/AudioFeatureChart";
import Nav from "../components/Nav";

const TIME_RANGES = [
  { value: "short_term",  label: "4 Weeks" },
  { value: "medium_term", label: "6 Months" },
  { value: "long_term",   label: "All Time" },
];

export default function Dashboard({ userId, onLogout }) {
  const router = useRouter();

  const [profile, setProfile]   = useState(null);
  const [tracks, setTracks]     = useState([]);
  const [artists, setArtists]   = useState([]);
  const [timeRange, setTimeRange] = useState("medium_term");

  const [datasetStats, setDatasetStats] = useState(null);
  const [modelMetrics, setModelMetrics] = useState(null);

  const [status, setStatus] = useState({ step: "idle", message: "" });
  const [loading, setLoading] = useState(false);

  // ── Fetch user data ──────────────────────────────────────────
  useEffect(() => {
    getUserProfile(userId).then(setProfile).catch(console.error);
  }, [userId]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getUserTopTracks(userId, timeRange, 50),
      getUserTopArtists(userId, timeRange, 20),
    ])
      .then(([t, a]) => { setTracks(t); setArtists(a); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId, timeRange]);

  // ── ML Pipeline ──────────────────────────────────────────────
  const runPipeline = useCallback(async () => {
    setLoading(true);
    try {
      // Step 1: Generate dataset
      setStatus({ step: "dataset", message: "Collecting Spotify data & generating dataset..." });
      const ds = await generateDataset(userId);
      setDatasetStats(ds.stats);

      // Step 2: Train models
      setStatus({ step: "training", message: "Training ML models (Cosine, KNN, KMeans)..." });
      const tm = await trainModel(userId);
      setModelMetrics(tm.metrics);

      setStatus({ step: "done", message: "Ready! Head to Recommendations." });
    } catch (err) {
      setStatus({ step: "error", message: err.message || "Pipeline failed." });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ── Compute average features for radar chart ─────────────────
  const avgFeatures = tracks.length
    ? ["danceability", "energy", "valence", "acousticness", "speechiness"].reduce(
        (acc, key) => {
          const values = tracks.map((t) => t[key] ?? 0).filter(Boolean);
          acc[key] = values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0;
          return acc;
        },
        {}
      )
    : null;

  return (
    <>
      <Nav userId={userId} onLogout={onLogout} active="dashboard" />

      <div className="page">
        <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>

          {/* ── Profile Header ── */}
          {profile && (
            <header className="dash-header fade-in">
              <div className="dash-header__avatar-wrap">
                {profile.image ? (
                  <img src={profile.image} alt={profile.display_name} className="dash-header__avatar" />
                ) : (
                  <div className="dash-header__avatar dash-header__avatar--placeholder">
                    {profile.display_name?.[0] || "?"}
                  </div>
                )}
              </div>
              <div className="dash-header__info">
                <p className="dash-header__greeting">Welcome back</p>
                <h1 className="dash-header__name">{profile.display_name}</h1>
                <div className="stat-row" style={{ marginTop: "0.75rem" }}>
                  <div className="stat-pill">Followers <span>{profile.followers?.toLocaleString()}</span></div>
                  <div className="stat-pill">Country <span>{profile.country}</span></div>
                  {datasetStats && (
                    <>
                      <div className="stat-pill">Dataset <span>{datasetStats.total_tracks} tracks</span></div>
                      <div className="stat-pill">Artists <span>{datasetStats.unique_artists}</span></div>
                    </>
                  )}
                </div>
              </div>
            </header>
          )}

          {/* ── ML Pipeline Panel ── */}
          <section className="card pipeline-card fade-in fade-in-delay-1">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h3>🧠 ML Pipeline</h3>
                <p style={{ marginTop: "0.25rem", fontSize: "0.875rem" }}>
                  Generate your training dataset and train all recommendation models
                </p>
              </div>
              <button
                className="btn btn-primary"
                onClick={runPipeline}
                disabled={loading}
              >
                {loading ? "Running..." : status.step === "done" ? "⟳ Retrain" : "▶ Run Pipeline"}
              </button>
            </div>

            {/* Status indicator */}
            {status.step !== "idle" && (
              <div className={`pipeline-status pipeline-status--${status.step}`}>
                {status.step === "dataset"  && "📡 "}
                {status.step === "training" && "🧠 "}
                {status.step === "done"     && "✅ "}
                {status.step === "error"    && "❌ "}
                {status.message}
              </div>
            )}

            {/* Dataset stats */}
            {datasetStats && (
              <div className="pipeline-stats">
                <Stat label="Tracks" value={datasetStats.total_tracks} />
                <Stat label="Artists" value={datasetStats.unique_artists} />
                <Stat label="Avg Popularity" value={`${datasetStats.avg_popularity}%`} />
                <Stat label="Avg Energy" value={datasetStats.avg_energy?.toFixed(2)} />
                <Stat label="Avg Valence" value={datasetStats.avg_valence?.toFixed(2)} />
              </div>
            )}

            {/* Model metrics */}
            {modelMetrics && (
              <div className="pipeline-stats" style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                <Stat label="Clusters" value={modelMetrics.n_clusters} color="var(--violet)" />
                <Stat label="KMeans Inertia" value={modelMetrics.kmeans_inertia} color="var(--cyan)" />
                {modelMetrics.models?.map((m) => (
                  <Stat key={m} label="Model" value={m} color="var(--amber)" />
                ))}
              </div>
            )}

            {status.step === "done" && (
              <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
                <button className="btn btn-outline" onClick={() => router.push("/recommendations")}>
                  View Recommendations →
                </button>
                <button className="btn btn-ghost" onClick={() => router.push("/mood")}>
                  Mood Engine →
                </button>
                <button className="btn btn-ghost" onClick={() => router.push("/clusters")}>
                  Cluster View →
                </button>
              </div>
            )}
          </section>

          {/* ── Time Range Selector ── */}
          <div className="fade-in fade-in-delay-2" style={{ margin: "2rem 0 1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: "var(--text-2)", fontSize: "0.875rem" }}>Showing:</span>
              {TIME_RANGES.map((r) => (
                <button
                  key={r.value}
                  className={`btn btn-ghost ${timeRange === r.value ? "active-range" : ""}`}
                  style={{
                    padding: "0.4rem 0.9rem",
                    fontSize: "0.82rem",
                    background: timeRange === r.value ? "var(--green-glow)" : undefined,
                    color: timeRange === r.value ? "var(--green)" : undefined,
                  }}
                  onClick={() => setTimeRange(r.value)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Top Tracks ── */}
          <section className="fade-in fade-in-delay-2">
            <div className="section-header">
              <h2 className="section-title">Your Top Tracks</h2>
              <span className="badge badge-green">{tracks.length} tracks</span>
            </div>

            {loading ? (
              <div className="spinner" />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {tracks.slice(0, 20).map((track, i) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    rank={i + 1}
                    userId={userId}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── Top Artists ── */}
          <section style={{ marginTop: "3rem" }} className="fade-in fade-in-delay-3">
            <div className="section-header">
              <h2 className="section-title">Your Top Artists</h2>
              <span className="badge badge-violet">{artists.length} artists</span>
            </div>

            <div className="grid-4">
              {artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} userId={userId} />
              ))}
            </div>
          </section>

          {/* ── Listening Profile ── */}
          {avgFeatures && (
            <section style={{ marginTop: "3rem" }} className="fade-in fade-in-delay-4">
              <div className="section-header">
                <h2 className="section-title">Your Sound Profile</h2>
              </div>
              <div className="card">
                <AudioFeatureChart features={avgFeatures} />
              </div>
            </section>
          )}
        </div>
      </div>

      <style>{`
        .dash-header {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: var(--bg-card);
          border-radius: var(--radius);
          border: 1px solid var(--border);
        }
        .dash-header__avatar {
          width: 72px; height: 72px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--green);
        }
        .dash-header__avatar-wrap { flex-shrink: 0; }
        .dash-header__avatar--placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-hover);
          font-size: 2rem;
          font-weight: 700;
        }
        .dash-header__greeting {
          font-size: 0.8rem;
          color: var(--text-3);
          margin-bottom: 0.1rem;
        }
        .dash-header__name {
          font-size: 1.8rem;
          font-weight: 800;
          line-height: 1;
        }
        .pipeline-card { margin-bottom: 0; }
        .pipeline-status {
          margin-top: 1rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
        }
        .pipeline-status--dataset  { background: rgba(34,211,238,0.1); color: var(--cyan); }
        .pipeline-status--training { background: var(--violet-dim); color: #a78bfa; }
        .pipeline-status--done     { background: var(--green-glow); color: var(--green); }
        .pipeline-status--error    { background: rgba(244,63,94,0.1); color: var(--rose); }
        .pipeline-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1rem;
        }
        .pipeline-stat {
          background: var(--bg-hover);
          border-radius: var(--radius-sm);
          padding: 0.5rem 0.9rem;
          font-size: 0.8rem;
        }
        .pipeline-stat__value {
          font-weight: 700;
          font-size: 1rem;
          font-family: var(--font-display);
        }
        .pipeline-stat__label { color: var(--text-2); margin-top: 0.1rem; }
      `}</style>
    </>
  );
}

function Stat({ label, value, color }: { label: any; value: any; color?: string }) {
  return (
    <div className="pipeline-stat">
      <div className="pipeline-stat__value" style={{ color: color || "var(--text-1)" }}>
        {value}
      </div>
      <div className="pipeline-stat__label">{label}</div>
    </div>
  );
}
