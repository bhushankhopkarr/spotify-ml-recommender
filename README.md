# 🎵 SoundML — Spotify ML Music Recommender

A full-stack, ML-powered music recommendation system built on **real-time Spotify API data**.  
No offline datasets. No Kaggle. Every recommendation is trained on *your* actual listening history.

---

## ✨ Features

| Feature | Details |
|---|---|
| **OAuth Login** | Secure Spotify OAuth 2.0 authentication |
| **Dynamic Dataset** | 500–1500+ tracks generated live from Spotify API |
| **Content-Based Filtering** | Cosine similarity on 9 audio features |
| **KNN Recommendations** | k-Nearest Neighbors in audio feature space |
| **KMeans Clustering** | Unsupervised song grouping with auto optimal-k |
| **Mood Engine** | Happy / Sad / Workout / Chill / Focus / Party |
| **Cluster Visualization** | PCA-reduced 2D scatter plot of your music universe |
| **Audio Preview** | 30-second Spotify preview playback in-browser |
| **Feature Bars** | Per-track audio feature visualization |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (port 3000)                │
│  Landing → Dashboard → Recommendations → Mood → Clusters    │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP REST
┌──────────────────────────▼──────────────────────────────────┐
│                  FastAPI Backend (port 8000)                 │
│  /login  /callback  /generate-dataset  /train-model         │
│  /recommend  /recommend-by-mood  /cluster-visualization      │
└──────────┬────────────────────────────┬─────────────────────┘
           │                            │
┌──────────▼──────────┐    ┌────────────▼────────────────────┐
│   Spotify Web API   │    │      ML Recommendation Engine    │
│  - Top tracks       │    │  ┌─ Cosine Similarity           │
│  - Top artists      │    │  ├─ KNN (NearestNeighbors)      │
│  - Recently played  │    │  └─ KMeans Clustering           │
│  - Audio features   │    │                                  │
│  - Recommendations  │    │  Feature Pipeline:               │
│  - Related artists  │    │  Normalize → Scale → Train       │
└─────────────────────┘    └──────────────────────────────────┘
```

---

## 📁 Project Structure

```
spotify-ml-recommender/
│
├── backend/
│   ├── main.py             # FastAPI app + all API endpoints
│   ├── spotify_client.py   # Spotipy wrapper (auth, data fetching)
│   ├── data_pipeline.py    # Dynamic dataset generation pipeline
│   ├── recommender.py      # ML engine (Cosine, KNN, KMeans, Mood)
│   ├── ml_models.py        # Standalone ML model classes
│   ├── utils.py            # Logging, caching, rate limiting
│   └── requirements.txt
│
├── frontend/
│   ├── public/index.html
│   └── src/
│       ├── App.js
│       ├── index.css           # Full design system (dark theme)
│       ├── index.js
│       ├── pages/
│       │   ├── Landing.js      # Login page with feature overview
│       │   ├── Dashboard.js    # Profile + top tracks + ML pipeline
│       │   ├── Recommendations.js
│       │   ├── MoodPage.js     # Mood-based recommendation picker
│       │   └── ClusterPage.js  # PCA scatter plot visualization
│       ├── components/
│       │   ├── Nav.js
│       │   ├── TrackCard.js    # Track with preview + feature bars
│       │   ├── ArtistCard.js
│       │   └── AudioFeatureChart.js  # SVG radar chart
│       └── services/
│           └── api.js          # Centralized API service layer
│
├── ml/
│   ├── feature_engineering.py  # Normalization, derived features
│   ├── clustering.py           # KMeans + PCA + optimal-k search
│   └── similarity_model.py     # Cosine similarity + KNN + hybrid ranker
│
├── .env.example
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- A Spotify Developer account

---

### Step 1 — Create a Spotify App

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Click **Create App**
3. Fill in any name/description
4. Set **Redirect URI** to: `http://127.0.0.1:8000/auth/callback`
5. Copy your **Client ID** and **Client Secret**

---

### Step 2 — Backend Setup

```bash
# Clone / enter project
cd spotify-ml-recommender/backend

# Create a virtual environment
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure credentials
cp ../.env.example ../.env
# Edit .env with your Spotify Client ID + Secret

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

The API will be available at `http://127.0.0.1:8000`  
Interactive docs: `http://127.0.0.1:8000/docs`

---

### Step 3 — Frontend Setup

```bash
cd spotify-ml-recommender/frontend

# Install dependencies
npm install

# Start the React dev server
npm start
```

The app will open at `http://127.0.0.1:3000`

---

## 🎯 Usage Flow

1. **Open** `http://127.0.0.1:3000`
2. **Click** "Connect with Spotify" → authorize the app
3. **Dashboard** loads your top tracks, artists, listening trends
4. **Click "▶ Run Pipeline"** to:
   - Fetch 500–1500 tracks from Spotify
   - Fetch audio features for all tracks
   - Train Cosine Similarity, KNN, and KMeans models
5. **Navigate** to:
   - **For You** → personalized recommendations ranked by ML
   - **Mood** → pick Happy / Workout / Chill etc.
   - **Clusters** → explore your music universe in 2D

---

## 🧠 ML Pipeline Detail

### Dataset Generation

```
User Top Tracks (3 time ranges × 50)    →  150 tracks
Recently Played                         →  50 tracks
Saved Tracks                            →  100 tracks
Related Artists × Top Tracks            →  ~300 tracks
Spotify Recommendations (4 mood seeds)  →  ~200 tracks
                                           ──────────
Total (before dedup)                    →  ~800–1500 tracks
```

### Audio Feature Engineering

| Feature | Raw Range | Normalized |
|---|---|---|
| danceability | 0–1 | as-is |
| energy | 0–1 | as-is |
| valence | 0–1 | as-is |
| tempo | 50–250 BPM | (x−50)/200 |
| loudness | −60–0 dB | (x+60)/60 |
| acousticness | 0–1 | as-is |
| instrumentalness | 0–1 | as-is |
| liveness | 0–1 | as-is |
| speechiness | 0–1 | as-is |
| popularity | 0–100 | x/100 |

### Recommendation Models

**1. Content-Based (Cosine Similarity)**
- Builds a user profile = mean feature vector of top tracks
- Scores every track in dataset by cosine similarity to profile
- Returns top-N highest scoring tracks

**2. KNN (k-Nearest Neighbors)**
- `sklearn.neighbors.NearestNeighbors` with cosine metric
- Finds k most similar tracks to a seed track
- Used for "Similar to this track" recommendations

**3. KMeans Clustering**
- Auto-selects optimal k via silhouette score (k=3–15)
- Identifies the cluster(s) of the user's favorite songs
- Recommends other tracks from those clusters

**Mood Matching**
- Predefined target vectors per mood (valence, energy, danceability, etc.)
- Cosine similarity between target vector and all tracks
- Returns best matching tracks for the mood

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/login` | Returns Spotify OAuth URL |
| GET | `/callback?code=` | Handles OAuth callback |
| GET | `/user-profile?user_id=` | User profile info |
| GET | `/user-top-tracks?user_id=&time_range=` | Top tracks |
| GET | `/user-top-artists?user_id=` | Top artists |
| GET | `/recently-played?user_id=` | Recent tracks |
| POST | `/generate-dataset?user_id=` | Build training dataset |
| POST | `/train-model?user_id=` | Train all ML models |
| GET | `/recommend?user_id=&n=` | Personalized recs |
| GET | `/recommend-by-track?user_id=&track_id=` | Similar tracks |
| GET | `/recommend-by-mood?user_id=&mood=` | Mood-based recs |
| GET | `/recommend-by-artist?user_id=&artist_id=` | Artist-style recs |
| GET | `/cluster-visualization?user_id=` | PCA cluster data |
| GET | `/generate-playlist?user_id=&playlist_type=` | Auto playlist |

---

## 🔒 Permissions Used

| Scope | Reason |
|---|---|
| `user-top-read` | Fetch top tracks and artists |
| `user-read-recently-played` | Build recent listening dataset |
| `user-library-read` | Access saved/liked tracks |
| `playlist-read-private` | Access user playlists |
| `user-read-private` | Profile info (country, plan) |
| `user-read-email` | Display email on profile |

No write permissions are requested. The app never modifies your Spotify library.

---

## 🛠 Tech Stack

**Backend:** Python · FastAPI · Spotipy · scikit-learn · Pandas · NumPy · PyArrow  
**Frontend:** React 18 · React Router v6 · Vanilla CSS (custom design system)  
**ML:** Cosine Similarity · KNearestNeighbors · KMeans · PCA · MinMaxScaler  
**Data:** 100% Spotify Web API — no offline datasets

---

## 🧩 Extending the System

**Add collaborative filtering:**
- Collect multiple users' top track lists
- Build a user-item matrix
- Apply SVD or ALS for matrix factorization

**Add a neural recommendation model:**
- Use track embeddings (e.g., from audio features)
- Train a two-tower model for user-item matching

**Add real-time retraining:**
- Trigger retraining when user listens to recommended tracks
- Use implicit feedback (play duration, skips) as training signal

**Production deployment:**
- Replace in-memory session store with Redis
- Replace file-based model storage with S3/GCS
- Add PostgreSQL for persistent user data
- Deploy backend on Railway/Render, frontend on Vercel
