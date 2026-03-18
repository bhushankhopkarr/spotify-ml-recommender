# SoundML Frontend

A Next.js + TypeScript frontend for an ML-powered music recommender experience.

This app is frontend-only and is designed to consume backend-provided offline data from your ML pipeline.

## Current Repository Scope

This repository currently contains the frontend application only.

The UI expects a separate backend API running on `http://127.0.0.1:8000` by default.

## Features

- Dashboard with profile, top tracks, top artists, and pipeline actions
- Personalized recommendations view
- Mood-based recommendation view
- Cluster visualization page for track distribution
- Audio preview playback and per-track feature bars
- Styled UI system with reusable components
- TS/TSX-only app source files (JS duplicates removed)

## Tech Stack

- Next.js 14 (Pages Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn-style UI foundation (`cva`, `clsx`, `tailwind-merge`)

## Project Structure

```text
spotify-ml-recommender/
├── frontend/
│   ├── pages/               # Route entry files
│   ├── src/
│   │   ├── components/      # UI + domain components
│   │   ├── lib/             # Shared helpers
│   │   ├── pages/           # Screen-level page components
│   │   └── services/        # API client layer
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
├── .env.example
└── README.md
```

## Prerequisites

- Node.js 18.17+
- npm 9+
- Running backend API service compatible with endpoints listed below

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Create production build
- `npm run start`: Start production server

## Environment Variables

Frontend runtime API base URL:

- `NEXT_PUBLIC_API_URL`

Default value (if not set):

- `http://127.0.0.1:8000`

Example for local override in `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

The frontend uses `NEXT_PUBLIC_API_URL` and defaults to `http://127.0.0.1:8000` if not provided.

## Backend API Contract

The frontend calls these endpoints:

- `GET /user-profile?user_id=...`
- `GET /user-top-tracks?user_id=...&time_range=...&limit=...`
- `GET /user-top-artists?user_id=...&time_range=...&limit=...`
- `GET /recently-played?user_id=...&limit=...`
- `POST /generate-dataset?user_id=...`
- `POST /train-model?user_id=...`
- `GET /recommend?user_id=...&n=...`
- `GET /recommend-by-track?user_id=...&track_id=...&n=...`
- `GET /recommend-by-mood?user_id=...&mood=...&n=...`
- `GET /recommend-by-artist?user_id=...&artist_id=...&n=...`
- `GET /cluster-visualization?user_id=...`
- `GET /generate-playlist?user_id=...&playlist_type=...&n=...`

## Usage Flow

1. Start backend API service.
2. Start frontend with `npm run dev`.
3. Open the app and continue to dashboard.
4. Run the ML pipeline from the dashboard.
5. Explore recommendations, mood playlists, and clusters.

## Troubleshooting

- `react-scripts: command not found`
   - This project is no longer CRA-based. Use `npm run dev`, not `npm start` for local development.

- `Failed to fetch` / CORS issues
   - Ensure backend is running on the expected URL.
   - Set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` and restart the dev server.

- Empty recommendation pages
   - Run dataset generation and model training from the dashboard first.

## Notes

- The frontend is configured with TypeScript in non-strict mode to support incremental type hardening.

## Future Improvements

- Upgrade Next.js to latest patched version
- Add shared API response types across all pages/components
- Add automated tests (unit + integration + e2e)
- Add CI pipeline for lint/build checks
