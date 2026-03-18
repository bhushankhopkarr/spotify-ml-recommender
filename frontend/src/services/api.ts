// src/services/api.js
// Centralized API service for all backend communication

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── AUTH ───────────────────────────────────────────────

export const getLoginUrl = () =>
  request("/login").then((d) => d.auth_url);

// ─── USER DATA ───────────────────────────────────────────

export const getUserProfile = (userId) =>
  request(`/user-profile?user_id=${userId}`);

export const getUserTopTracks = (userId, timeRange = "medium_term", limit = 50) =>
  request(`/user-top-tracks?user_id=${userId}&time_range=${timeRange}&limit=${limit}`);

export const getUserTopArtists = (userId, timeRange = "medium_term", limit = 20) =>
  request(`/user-top-artists?user_id=${userId}&time_range=${timeRange}&limit=${limit}`);

export const getRecentlyPlayed = (userId, limit = 50) =>
  request(`/recently-played?user_id=${userId}&limit=${limit}`);

// ─── ML PIPELINE ─────────────────────────────────────────

export const generateDataset = (userId) =>
  request(`/generate-dataset?user_id=${userId}`, { method: "POST" });

export const trainModel = (userId) =>
  request(`/train-model?user_id=${userId}`, { method: "POST" });

// ─── RECOMMENDATIONS ─────────────────────────────────────

export const getRecommendations = (userId, n = 20) =>
  request(`/recommend?user_id=${userId}&n=${n}`);

export const getRecommendationsByTrack = (userId, trackId, n = 10) =>
  request(`/recommend-by-track?user_id=${userId}&track_id=${trackId}&n=${n}`);

export const getRecommendationsByMood = (userId, mood, n = 20) =>
  request(`/recommend-by-mood?user_id=${userId}&mood=${mood}&n=${n}`);

export const getRecommendationsByArtist = (userId, artistId, n = 10) =>
  request(`/recommend-by-artist?user_id=${userId}&artist_id=${artistId}&n=${n}`);

export const getClusterVisualization = (userId) =>
  request(`/cluster-visualization?user_id=${userId}`);

export const generatePlaylist = (userId, playlistType, n = 20) =>
  request(`/generate-playlist?user_id=${userId}&playlist_type=${playlistType}&n=${n}`);
