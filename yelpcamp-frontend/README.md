# YelpCamp Frontend

Next.js frontend for YelpCamp application.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_MAPTILER_API_KEY=your_maptiler_api_key
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:3001`

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand (auth + toast)
- **Forms:** React Hook Form
- **HTTP Client:** Axios
- **Maps:** MapTiler SDK
- **UI Components:** Custom components with Tailwind

## Features

- ✅ JWT Authentication (login, register, logout)
- ✅ Persistent auth state (localStorage + Zustand)
- ✅ Protected routes (client-side)
- ✅ Campground CRUD operations
- ✅ Multi-image upload with preview
- ✅ Interactive cluster maps (index page)
- ✅ Single location maps (detail page)
- ✅ Image carousel with navigation
- ✅ Star rating system for reviews
- ✅ Toast notifications (success/error)
- ✅ Responsive design (mobile-first)

## Project Structure

```
app/
├── layout.tsx              # Root layout with Navbar/Footer/Toast
├── page.tsx                # Home landing page
├── login/page.tsx          # Login form
├── register/page.tsx       # Register form
└── campgrounds/
    ├── page.tsx            # Campgrounds list with cluster map
    ├── new/page.tsx        # Create campground form
    └── [id]/
        ├── page.tsx        # Campground detail with reviews
        └── edit/page.tsx   # Edit campground form

components/
├── Navbar.tsx              # Auth-aware navigation
├── Footer.tsx              # Site footer
├── Toast.tsx               # Notification system
├── MapCluster.tsx          # Cluster map component
├── MapSingle.tsx           # Single location map
├── ImageCarousel.tsx       # Image slider with controls
└── StarRating.tsx          # Interactive star rating

lib/
├── api.ts                  # Axios instance + API methods
└── store.ts                # Zustand stores (auth + toast)
```

## API Integration

All API calls use axios with automatic:
- JWT token attachment (Authorization header)
- 401 error handling (auto-logout)
- Base URL configuration
- multipart/form-data for file uploads

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3000` |
| `NEXT_PUBLIC_MAPTILER_API_KEY` | MapTiler API key | Get from cloud.maptiler.com |

## Development Notes

- **Port:** Frontend runs on `3001` (backend on `3000`)
- **CORS:** Backend must have CORS enabled for `http://localhost:3001`
- **Auth:** JWT tokens stored in localStorage
- **Maps:** Requires valid MapTiler API key (free tier available)

## Building for Production

```bash
npm run build
npm start
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
