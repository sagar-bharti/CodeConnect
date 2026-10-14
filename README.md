# CodeConnect — Collaborative Coding & Learning Platform

Starter implementation based on the supplied CodeConnect PRD. It includes a React + Vite frontend, Express REST API, MongoDB models, JWT authentication, problem browsing, Help Room posts, comments, likes/bookmarks, progress/leaderboard, Judge0 execution, and optional Gemini assistant endpoint.

## Requirements
- Node.js 20+
- MongoDB running locally or a MongoDB Atlas connection string
- Judge0 API key (optional; code execution returns a helpful error until configured)
- Gemini API key (optional; AI assistant endpoint is disabled until configured)

## Run locally
1. Copy `backend/.env.example` to `backend/.env` and set values.
2. Install packages:
   ```bash
   npm install
   npm run install:all
   ```
3. Start MongoDB.
4. Start both apps:
   ```bash
   npm run dev
   ```
5. Open http://localhost:5173. API runs on http://localhost:5000.

## Notes
- This is a working starter, not a production security audit. Use HTTPS, a strong JWT secret, provider quotas, backups, and deployment-specific CORS settings before public launch.
- Judge0 runs submitted code remotely; never execute user code directly on your Express server.
- The PRD mentions Firebase Authentication in one section and JWT/bcrypt in the architecture/stack. This starter follows the Node/Express + JWT/bcrypt implementation described in the proposed solution and stack.
- Seed sample problems with `npm run seed --prefix backend`.
