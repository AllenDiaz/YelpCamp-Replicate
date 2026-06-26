# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

YelpCamp is a campgrounds-and-reviews app split into two independently-deployed services:

- `yelpcamp-backend/` — Express 4 **JSON API** (no server-rendered UI). Mongoose/MongoDB, JWT auth, Cloudinary image hosting, MapTiler geocoding.
- `yelpcamp-frontend/` — Next.js 16 (App Router, React 19, TypeScript, Tailwind v4) talking to the API over HTTP.

The repo was migrated from a monolithic EJS app to this API + SPA split (see `MIGRATION_SUMMARY.md`). The backend's `views/` and `public/javascripts/` directories are **legacy EJS/browser artifacts that are no longer wired into `app.js`** — do not edit them expecting changes to appear; the live UI is entirely in `yelpcamp-frontend/`.

## Commands

Backend (`cd yelpcamp-backend`):
- `npm run dev` — start with nodemon (hot reload)
- `npm start` — start with node
- `node seeds/index.js` — wipe and reseed ~30 sample campgrounds. **Connects to a hardcoded `mongodb://127.0.0.1:27017/yelp-camp`** (not the Docker/`DB_URL` connection), so a local Mongo must be reachable on that address.
- No test runner is configured (`npm test` exits 1).

Frontend (`cd yelpcamp-frontend`):
- `npm run dev` — Next dev server on **port 3001**
- `npm run build` / `npm start`
- `npm run lint` — ESLint (flat config, `eslint-config-next`)

Full stack via Docker (from repo root):
- `docker-compose up` — Mongo + backend + frontend (production build)
- `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up` — dev mode with volume mounts + hot reload (see `DEV_MODE.md`)

## Architecture & conventions

**Ports / wiring:** Frontend is `:3001`, backend is `:3000`. The frontend's API base URL is **hardcoded** to `http://localhost:3000` in `yelpcamp-frontend/lib/api.ts` (the `NEXT_PUBLIC_API_URL` env var referenced in docs is not actually read there). The backend likewise **hardcodes `app.listen(3000)`**, ignoring `process.env.PORT`.

**Auth is JWT, not sessions.** Despite `express-session`/`passport` being in `package.json`, they are not used. Flow:
- `utils/jwt.js` signs/verifies tokens (secret from `JWT_SECRET`, falling back to `SECRET`).
- `middleware.js` `isLoggedIn` reads `Authorization: Bearer <token>`, looks up the user, and sets `req.user`.
- Frontend stores the token in `localStorage` and attaches it via an axios request interceptor (`lib/api.ts`). A response interceptor auto-redirects to `/login` on 401. Client auth state lives in a Zustand store (`lib/store.ts`, also holds toast + theme state).

**Backend request layering:** `routes/*` (Swagger JSDoc + middleware chain) → `controllers/*` (logic) → `models/*` (Mongoose). Every async controller is wrapped in `utils/catchAsync.js`; route protection composes `isLoggedIn` → `isAuthor`/`isReviewAuthor` → `validateCampground`/`validateReview`. Errors flow through `http-errors` to the single JSON error handler at the bottom of `app.js`.

**Request body shapes are non-obvious:**
- Campground create/update use **`multipart/form-data`** (multer, field name `image`) with nested keys like `campground[title]`. `app.set("query parser", "extended")` + extended urlencoded parsing reconstruct `req.body.campground.*`.
- Reviews use **JSON** with a wrapped `{ review: { rating, body } }`.
- Joi validation (`schemas.js`) enforces these wrapper shapes and strips HTML via a custom `escapeHTML` Joi extension.

**Nested routes:** reviews are mounted at `/api/campgrounds/:id/reviews` with `express.Router({ mergeParams: true })` so the campground `id` is available.

**Security middleware:** `utils/mongoSanitizeV5.js` is a custom NoSQL-injection sanitizer used in place of `express-mongo-sanitize` (which is incompatible with the read-only `req.query` in newer Express). Helmet runs with CSP disabled (API-only).

**Models of note:** `models/campground.js` stores GeoJSON `geometry` (used for the MapTiler cluster map), exposes image `thumbnail` and `properties.popUpMarkup` virtuals, and has a `findOneAndDelete` post-hook that cascade-deletes its reviews. `models/user.js` hashes passwords with bcrypt in a `pre("save")` hook and deletes `password` in `toJSON()`.

**External services** (all keyed by env vars): Cloudinary (`cloudinary/index.js`, multer storage for uploads) and MapTiler (forward geocoding in the campground controller; map rendering on the frontend via `@maptiler/sdk`).

**API docs:** Swagger UI is served at `/api-docs`, generated from JSDoc comments in `routes/*` via `swagger.js`. Keep these comments in sync when changing endpoints.

## Environment

Backend `.env` keys: `DB_URL` (note: the app reads `DB_URL`, though some docs say `DATABASE_URL`), `JWT_SECRET`/`JWT_EXPIRE`, `SECRET`, `FRONTEND_URL` (CORS origin, default `http://localhost:3001`), `CLOUDINARY_CLOUD_NAME`/`CLOUDINARY_KEY`/`CLOUDINARY_SECRET`, `MAPTILER_API_KEY`. Setting `NODE_ENV=development` disables TLS cert validation (for Cloudinary). See `QUICK_START.md` for a full setup walkthrough.
