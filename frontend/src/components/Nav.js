// src/components/Nav.js
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LINKS = [
  { path: "/dashboard",       label: "Dashboard",    key: "dashboard" },
  { path: "/recommendations", label: "For You",      key: "recommendations" },
  { path: "/mood",            label: "Mood",         key: "mood" },
  { path: "/clusters",        label: "Clusters",     key: "clusters" },
];

export default function Nav({ userId, onLogout, active }) {
  const navigate = useNavigate();

  return (
    <nav className="nav">
      <div className="container nav__inner">
        <div className="nav__logo" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
          <span className="nav__logo-dot" />
          SoundML
        </div>

        <ul className="nav__links">
          {LINKS.map((link) => (
            <li key={link.key}>
              <button
                className={`nav__link ${active === link.key ? "active" : ""}`}
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {onLogout && (
          <button className="btn btn-ghost" style={{ fontSize: "0.82rem", padding: "0.4rem 0.9rem" }} onClick={onLogout}>
            Sign out
          </button>
        )}
      </div>
    </nav>
  );
}
