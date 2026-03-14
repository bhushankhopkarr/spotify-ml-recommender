// src/components/TrackCard.js
import React, { useState, useRef } from "react";
import { getRecommendationsByTrack } from "../services/api";

export default function TrackCard({ track, rank, userId, showScore, showFeatures }) {
  const [playing, setPlaying]   = useState(false);
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!track.preview_url) return;
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      // Stop all other audio first
      document.querySelectorAll("audio").forEach((a) => a.pause());
      audioRef.current?.play();
      setPlaying(true);
    }
  };

  const featureKeys = ["danceability", "energy", "valence", "acousticness"];
  const hasFeatures = featureKeys.some((k) => track[k] !== undefined);

  return (
    <div
      className={`track-card ${expanded ? "track-card--expanded" : ""}`}
      onClick={() => setExpanded(!expanded)}
      style={{ flexDirection: "column", alignItems: "stretch", gap: 0 }}
    >
      {/* Main row */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Rank */}
        {rank && (
          <span style={{
            width: 28,
            textAlign: "right",
            color: "var(--text-3)",
            fontSize: "0.8rem",
            fontWeight: 600,
            flexShrink: 0,
          }}>
            {rank}
          </span>
        )}

        {/* Album art + play */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          {track.album_image ? (
            <img
              src={track.album_image}
              alt={track.album}
              className="track-card__image"
            />
          ) : (
            <div className="track-card__image" style={{
              background: "var(--bg-hover)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}>
              🎵
            </div>
          )}

          {track.preview_url && (
            <button
              onClick={togglePlay}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.5)",
                borderRadius: "var(--radius-sm)",
                border: "none",
                cursor: "pointer",
                opacity: 0,
                transition: "opacity 0.15s",
                color: "#fff",
                fontSize: "1rem",
              }}
              className="play-btn"
            >
              {playing ? "⏸" : "▶"}
            </button>
          )}
          {playing && (
            <div style={{
              position: "absolute",
              inset: 0,
              border: "2px solid var(--green)",
              borderRadius: "var(--radius-sm)",
              pointerEvents: "none",
              animation: "pulse-border 1s ease infinite",
            }} />
          )}
        </div>

        {/* Track info */}
        <div className="track-card__info">
          <div className="track-card__name">{track.name}</div>
          <div className="track-card__artist">{track.artist}</div>
        </div>

        {/* Score + popularity */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.2rem", flexShrink: 0 }}>
          {showScore && track.similarity_score !== undefined && (
            <span className="track-card__score">
              {(track.similarity_score * 100).toFixed(0)}% match
            </span>
          )}
          {track.popularity !== undefined && (
            <span style={{ fontSize: "0.72rem", color: "var(--text-3)" }}>
              Pop. {track.popularity}
            </span>
          )}
          {track.external_url && (
            <a
              href={track.external_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ fontSize: "0.72rem", color: "var(--green)" }}
            >
              Open ↗
            </a>
          )}
        </div>
      </div>

      {/* Expanded feature bars */}
      {expanded && hasFeatures && (
        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
          <div className="feature-bars">
            {featureKeys.map((key) => {
              const val = track[key];
              if (val === undefined) return null;
              return (
                <div className="feature-bar" key={key}>
                  <span className="feature-bar__label">{key}</span>
                  <div className="feature-bar__track">
                    <div
                      className="feature-bar__fill"
                      style={{ width: `${(val * 100).toFixed(0)}%` }}
                    />
                  </div>
                  <span className="feature-bar__value">{val.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hidden audio element */}
      {track.preview_url && (
        <audio
          ref={audioRef}
          src={track.preview_url}
          onEnded={() => setPlaying(false)}
        />
      )}

      <style>{`
        .track-card:hover .play-btn { opacity: 1 !important; }
        @keyframes pulse-border {
          0%,100% { box-shadow: 0 0 0 0 var(--green-glow); }
          50%      { box-shadow: 0 0 0 4px var(--green-glow); }
        }
      `}</style>
    </div>
  );
}
