// src/pages/Landing.tsx
import React from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";

const FEATURES = [
  { icon: "🧠", title: "ML-Powered", desc: "Cosine similarity, KNN, and K-Means clustering trained on your backend dataset." },
  { icon: "📦", title: "Offline Dataset", desc: "Built for backend-provided data from your ML pipeline with no third-party auth dependency." },
  { icon: "🎭", title: "Mood Engine", desc: "Happy, sad, workout, chill — recommendations matched to your current vibe." },
  { icon: "🔬", title: "Cluster Visualization", desc: "Explore your music universe with interactive PCA-reduced cluster charts." },
];

export default function Landing() {
  const router = useRouter();

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
            A machine learning system that serves recommendations from your backend ML pipeline,
            using offline data instead of third-party auth flows or real-time streaming APIs.
            No generic playlists, just music that's actually{" "}
            <em>for you</em>.
          </p>

          <Button
            className="landing__cta bg-primary text-primary-foreground hover:opacity-90"
            onClick={() => router.push("/dashboard")}
          >
            Open Dashboard
          </Button>

          <p className="landing__privacy">
            🔒 Backend-driven flow · Offline-ready data contract · Open source
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
              { label: "Backend Dataset", sub: "Offline ML source", icon: "🗂️" },
              { label: "Data Pipeline", sub: "Feature extraction + prep", icon: "📡" },
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
      `}</style>
    </div>
  );
}
