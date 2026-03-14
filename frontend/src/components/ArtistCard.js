// src/components/ArtistCard.js
import React from "react";

export default function ArtistCard({ artist }) {
  return (
    <a
      href={artist.external_url}
      target="_blank"
      rel="noreferrer"
      className="card"
      style={{ textDecoration: "none", textAlign: "center" }}
    >
      {artist.image ? (
        <img
          src={artist.image}
          alt={artist.name}
          style={{
            width: 64, height: 64,
            borderRadius: "50%",
            objectFit: "cover",
            margin: "0 auto 0.75rem",
            display: "block",
            border: "2px solid var(--border)",
          }}
        />
      ) : (
        <div style={{
          width: 64, height: 64,
          borderRadius: "50%",
          background: "var(--bg-hover)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 0.75rem",
          fontSize: "1.5rem",
        }}>
          🎤
        </div>
      )}

      <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.25rem" }}>
        {artist.name}
      </div>

      {artist.genres?.length > 0 && (
        <div style={{ fontSize: "0.72rem", color: "var(--text-3)", marginBottom: "0.5rem" }}>
          {artist.genres.slice(0, 2).join(" · ")}
        </div>
      )}

      <div style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>
        Pop. {artist.popularity}
      </div>
    </a>
  );
}
