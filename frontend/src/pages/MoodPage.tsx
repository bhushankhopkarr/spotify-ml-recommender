// src/pages/MoodPage.js
import { useState } from "react";
import { getRecommendationsByMood } from "../services/api";
import TrackCard from "../components/TrackCard";
import Nav from "../components/Nav";

const MOODS = [
  { id: "happy",   emoji: "😊", label: "Happy",   color: "#f59e0b", desc: "High valence · Energetic" },
  { id: "sad",     emoji: "😔", label: "Sad",     color: "#818cf8", desc: "Low valence · Acoustic" },
  { id: "workout", emoji: "💪", label: "Workout", color: "#ef4444", desc: "Max energy · Fast tempo" },
  { id: "chill",   emoji: "😌", label: "Chill",   color: "#22d3ee", desc: "Low energy · Mellow" },
  { id: "focus",   emoji: "🎯", label: "Focus",   color: "#34d399", desc: "Instrumental · Calm" },
  { id: "party",   emoji: "🎉", label: "Party",   color: "#f472b6", desc: "Dance · Upbeat" },
];

export default function MoodPage({ userId }) {
  const [activeMood, setActiveMood] = useState(null);
  const [recs, setRecs]             = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  const selectMood = async (mood) => {
    if (loading) return;
    setActiveMood(mood.id);
    setLoading(true);
    setError(null);
    try {
      const data = await getRecommendationsByMood(userId, mood.id, 20);
      setRecs(data.recommendations || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const activeMoodObj = MOODS.find((m) => m.id === activeMood);

  return (
    <>
      <Nav userId={userId} active="mood" />
      <div className="page">
        <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>

          <header className="fade-in" style={{ marginBottom: "2rem" }}>
            <div className="badge badge-amber" style={{ marginBottom: "0.75rem" }}>
              ✦ Mood Engine
            </div>
            <h1>How are you feeling?</h1>
            <p style={{ marginTop: "0.5rem" }}>
              Select a mood — our ML model matches tracks using valence, energy, and tempo vectors.
            </p>
          </header>

          {/* Mood selector */}
          <div className="mood-grid fade-in fade-in-delay-1" style={{ marginBottom: "2.5rem" }}>
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                className={`mood-pill ${activeMood === mood.id ? "active" : ""}`}
                onClick={() => selectMood(mood)}
                style={activeMood === mood.id ? {
                  borderColor: mood.color,
                  boxShadow: `0 0 20px ${mood.color}33`,
                  background: `${mood.color}18`,
                } : {}}
              >
                <div className="mood-pill__emoji">{mood.emoji}</div>
                <div className="mood-pill__name">{mood.label}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-3)", marginTop: "0.2rem" }}>
                  {mood.desc}
                </div>
              </button>
            ))}
          </div>

          {/* Results */}
          {activeMoodObj && !loading && !error && recs.length > 0 && (
            <section className="fade-in">
              <div className="section-header">
                <h2 className="section-title">
                  {activeMoodObj.emoji} {activeMoodObj.label} Tracks
                </h2>
                <span className="badge" style={{
                  background: `${activeMoodObj.color}22`,
                  color: activeMoodObj.color,
                }}>
                  {recs.length} tracks
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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
            </section>
          )}

          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <p>Finding the perfect {activeMoodObj?.label?.toLowerCase()} tracks...</p>
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

          {!activeMood && (
            <div className="empty-state">
              <h3>Pick a mood above</h3>
              <p>We'll match tracks to your vibe using audio feature vectors.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
