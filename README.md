# 🏕️ YelpCamp

A full-stack campgrounds-and-reviews application. Discover, create, and review camping locations, with image uploads and interactive maps.

YelpCamp is split into two independently-deployable services:

| Service | Stack | Port |
|---------|-------|------|
| **`yelpcamp-backend/`** | Express 4 JSON API · MongoDB/Mongoose · JWT auth · Cloudinary · MapTiler | `3000` |
| **`yelpcamp-frontend/`** | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Zustand | `3001` |

> The project was migrated from a monolithic EJS app to this API + SPA architecture. See [`MIGRATION_SUMMARY.md`](./MIGRATION_SUMMARY.md) for details.

## Features

- 🔐 User registration & login (JWT-based authentication)
- 🏕️ Create, edit, and delete campgrounds (author-only permissions)
- 🖼️ Multiple image uploads per campground (Cloudinary)
- ⭐ Star-rated reviews on campgrounds
- 🗺️ Interactive cluster map and per-campground location map (MapTiler)
- 🌗 Light / dark / system theme support
- 📖 Auto-generated API docs (Swagger UI at `/api-docs`)

## Architecture

```
Browser ──▶ Next.js frontend (:3001) ──HTTP/JSON──▶ Express API (:3000) ──▶ MongoDB
                                                          │
                                                          ├──▶ Cloudinary (image storage)
                                                          └──▶ MapTiler (geocoding)
```

- The frontend is a SPA that calls the backend over HTTP. Auth tokens are stored in `localStorage` and attached to requests via an axios interceptor (`yelpcamp-frontend/lib/api.ts`).
- The backend is **API-only** (returns JSON). Requests are layered as `routes/ → controllers/ → models/`, with Joi validation and JWT/author-permission middleware.
- Campground create/update use `multipart/form-data`; reviews use JSON.

## Prerequisites

- Node.js 18+
- A MongoDB instance (local, Docker, or hosted)
- Free API keys for [Cloudinary](https://cloudinary.com) (image uploads) and [MapTiler](https://cloud.maptiler.com) (maps)

## Getting started

You can run everything with Docker, or run each service manually. A condensed setup also lives in [`QUICK_START.md`](./QUICK_START.md).

### Option A — Docker (recommended)

From the repo root, create a `.env` (see [`.env.example`](./.env.example)) with your Cloudinary, MapTiler, and JWT secrets, then:

```bash
# Production build (Mongo + backend + frontend)
docker-compose up

# Development mode with hot reload + volume mounts
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Then open **http://localhost:3001**. See [`DEV_MODE.md`](./DEV_MODE.md) and [`DOCKER_README.md`](./DOCKER_README.md) for more.

### Option B — Run services manually

**1. Backend** (`yelpcamp-backend/.env`):

```env
DB_URL=mongodb://127.0.0.1:27017/yelp-camp
JWT_SECRET=change-me
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3001
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
MAPTILER_API_KEY=your_maptiler_key
```

```bash
cd yelpcamp-backend
npm install
npm run dev        # nodemon, serves on http://localhost:3000
```

**2. Frontend:**

```bash
cd yelpcamp-frontend
npm install
npm run dev        # Next.js dev server on http://localhost:3001
```

Open **http://localhost:3001**.

### Seed sample data (optional)

```bash
cd yelpcamp-backend
node seeds/index.js
```

> ⚠️ The seed script connects to a hardcoded `mongodb://127.0.0.1:27017/yelp-camp` and **wipes** the campgrounds collection before inserting ~30 samples. Make sure a local MongoDB is reachable at that address.

## Available scripts

**Backend** (`yelpcamp-backend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start` | Start with node |
| `node seeds/index.js` | Reseed the database with sample campgrounds |

**Frontend** (`yelpcamp-frontend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 3001 |
| `npm run build` | Production build |
| `npm start` | Serve the production build on port 3001 |
| `npm run lint` | Run ESLint |

## API reference

Once the backend is running, interactive Swagger docs are available at:

```
http://localhost:3000/api-docs
```

Main endpoints:

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/users/register` | — | Register and receive a JWT |
| `POST` | `/api/users/login` | — | Log in and receive a JWT |
| `GET`  | `/api/users/me` | ✅ | Current user |
| `GET`  | `/api/campgrounds` | — | List campgrounds |
| `POST` | `/api/campgrounds` | ✅ | Create a campground (`multipart/form-data`) |
| `GET`  | `/api/campgrounds/:id` | — | Campground details (with reviews) |
| `PUT`  | `/api/campgrounds/:id` | ✅ author | Update a campground |
| `DELETE` | `/api/campgrounds/:id` | ✅ author | Delete a campground |
| `POST` | `/api/campgrounds/:id/reviews` | ✅ | Add a review (JSON) |
| `DELETE` | `/api/campgrounds/:id/reviews/:reviewId` | ✅ author | Delete a review |

See [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) for full request/response details.

## Environment variables

| Variable | Service | Purpose |
|----------|---------|---------|
| `DB_URL` | backend | MongoDB connection string |
| `JWT_SECRET` / `JWT_EXPIRE` | backend | Token signing secret and expiry (default `7d`) |
| `FRONTEND_URL` | backend | Allowed CORS origin (default `http://localhost:3001`) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_KEY` / `CLOUDINARY_SECRET` | backend | Image uploads |
| `MAPTILER_API_KEY` | backend & frontend | Geocoding and map rendering |

## Additional documentation

- [`QUICK_START.md`](./QUICK_START.md) — 5-minute setup guide
- [`MIGRATION_SUMMARY.md`](./MIGRATION_SUMMARY.md) — architecture & migration details
- [`DEV_MODE.md`](./DEV_MODE.md) / [`DOCKER_README.md`](./DOCKER_README.md) — Docker workflows
- [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) — API reference
- [`COLOR_SCHEME.md`](./COLOR_SCHEME.md), [`COLOR_QUICK_REFERENCE.md`](./COLOR_QUICK_REFERENCE.md), [`DARK_MODE.md`](./DARK_MODE.md), [`GLASSMORPHISM_GUIDE.md`](./GLASSMORPHISM_GUIDE.md) — UI/design guides
