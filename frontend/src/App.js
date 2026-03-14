// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Recommendations from "./pages/Recommendations";
import MoodPage from "./pages/MoodPage";
import ClusterPage from "./pages/ClusterPage";
import "./index.css";

export default function App() {
  const [userId, setUserId] = useState(() => {
    // Read user_id from URL FIRST — before Router renders and strips it
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get("user_id");
    if (idFromUrl) {
      sessionStorage.setItem("spotify_user_id", idFromUrl);
      window.history.replaceState({}, "", window.location.pathname);
      return idFromUrl;
    }
    return sessionStorage.getItem("spotify_user_id") || null;
  });

  const logout = () => {
    sessionStorage.removeItem("spotify_user_id");
    setUserId(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={userId ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/dashboard" element={userId ? <Dashboard userId={userId} onLogout={logout} /> : <Navigate to="/" />} />
        <Route path="/recommendations" element={userId ? <Recommendations userId={userId} /> : <Navigate to="/" />} />
        <Route path="/mood" element={userId ? <MoodPage userId={userId} /> : <Navigate to="/" />} />
        <Route path="/clusters" element={userId ? <ClusterPage userId={userId} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}