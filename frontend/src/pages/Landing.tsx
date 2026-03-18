// src/pages/Landing.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { getLoginUrl } from "../services/api";
import { Button } from "../components/ui/button";

const FEATURES = [
  { icon: "🧠", title: "ML-Powered", desc: "Cosine similarity, KNN, and K-Means clustering trained on your real listening data." },
  { icon: "🎵", title: "Live Spotify Data", desc: "No static datasets — every recommendation is powered by the Spotify API in real time." },
  { icon: "🎭", title: "Mood Engine", desc: "Happy, sad, workout, chill — recommendations matched to your current vibe." },
  { icon: "🔬", title: "Cluster Visualization", desc: "Explore your music universe with interactive PCA-reduced cluster charts." },
];

export default function Landing() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const url = await getLoginUrl();
      window.location.href = url;
    } catch (e) {
      console.error("Login failed:", e);
      setLoading(false);
    }
  };

  return (
    <div className="landing">
      {/* Ambient background */}
      <div className="landing__bg" aria-hidden="true">
        <div className="landing__glow landing__glow--1" />
        <div className="landing__glow landing__glow--2" />
        <div className="landing__glow landing__glow--3" />
      </div>

      <div className="container">
        {/* Hero */}
        <motion.header
          className="landing__hero fade-in"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="landing__badge badge badge-green">
            ✦ ML-Powered Music Discovery
          </div>

          <h1 className="landing__title">
            Your Music,<br />
            <span className="landing__title-accent">Understood.</span>
          </h1>

          <p className="landing__subtitle">
            A machine learning system that learns your taste from real Spotify data —
            no generic playlists, just music that's actually{" "}
            <em>for you</em>.
          </p>

          <Button
            className="landing__cta bg-primary text-primary-foreground hover:opacity-90"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner" /> Connecting...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Connect with Spotify
              </>
            )}
          </Button>

          <p className="landing__privacy">
            🔒 Read-only access · No data stored permanently · Open source
          </p>
        </motion.header>

        {/* Feature cards */}
        <section className="landing__features">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`card landing__feature fade-in fade-in-delay-${i + 1}`}
            >
              <div className="landing__feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Architecture diagram text */}
        <section className="landing__arch card fade-in">
          <h2 style={{ marginBottom: "1.5rem" }}>How it works</h2>
          <div className="landing__arch-flow">
            {[
              { label: "Your Spotify", sub: "OAuth 2.0 login", icon: "🎧" },
              { label: "Data Pipeline", sub: "1000+ tracks fetched", icon: "📡" },
              { label: "ML Engine", sub: "Cosine · KNN · KMeans", icon: "🧠" },
              { label: "Personalized Recs", sub: "Ranked & scored", icon: "✨" },
            ].map((step, i, arr) => (
              <React.Fragment key={step.label}>
                <div className="landing__arch-step">
                  <div className="landing__arch-icon">{step.icon}</div>
                  <div className="landing__arch-label">{step.label}</div>
                  <div className="landing__arch-sub">{step.sub}</div>
                </div>
                {i < arr.length - 1 && (
                  <div className="landing__arch-arrow">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .landing {
          min-height: 100vh;
          padding: 5rem 0 4rem;
          position: relative;
          overflow: hidden;
        }
        .landing__bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .landing__glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.12;
        }
        .landing__glow--1 {
          width: 500px; height: 500px;
          background: var(--green);
          top: -100px; left: -100px;
        }
        .landing__glow--2 {
          width: 400px; height: 400px;
          background: var(--violet);
          bottom: 100px; right: -50px;
        }
        .landing__glow--3 {
          width: 300px; height: 300px;
          background: var(--cyan);
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
        }
        .landing .container { position: relative; z-index: 1; }
        .landing__hero {
          text-align: center;
          padding: 4rem 0 3rem;
          max-width: 700px;
          margin: 0 auto;
        }
        .landing__badge {
          display: inline-block;
          margin-bottom: 1.5rem;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
        }
        .landing__title {
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
        }
        .landing__title-accent {
          background: linear-gradient(135deg, var(--green), var(--cyan));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .landing__subtitle {
          font-size: 1.1rem;
          line-height: 1.7;
          max-width: 560px;
          margin: 0 auto 2rem;
          color: var(--text-2);
        }
        .landing__cta {
          font-size: 1rem;
          padding: 0.9rem 2rem;
          gap: 0.6rem;
        }
        .landing__privacy {
          margin-top: 1rem;
          font-size: 0.8rem;
          color: var(--text-3);
        }
        .landing__features {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        @media (max-width: 900px) {
          .landing__features { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .landing__features { grid-template-columns: 1fr; }
        }
        .landing__feature { text-align: center; }
        .landing__feature-icon {
          font-size: 2rem;
          margin-bottom: 0.75rem;
        }
        .landing__feature h3 { margin-bottom: 0.5rem; font-size: 1rem; }
        .landing__feature p  { font-size: 0.85rem; }
        .landing__arch { text-align: center; }
        .landing__arch-flow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .landing__arch-step { text-align: center; padding: 0.5rem; }
        .landing__arch-icon { font-size: 2rem; margin-bottom: 0.4rem; }
        .landing__arch-label {
          font-weight: 700;
          font-family: var(--font-display);
          font-size: 0.95rem;
        }
        .landing__arch-sub {
          font-size: 0.75rem;
          color: var(--text-3);
          margin-top: 0.2rem;
        }
        .landing__arch-arrow {
          font-size: 1.5rem;
          color: var(--green);
          margin-top: -1rem;
        }
        .btn-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(0,0,0,0.3);
          border-top-color: #000;
          border-radius: 50%;
          display: inline-block;
          animation: spin 0.7s linear infinite;
        }
      `}</style>
    </div>
  );
}
