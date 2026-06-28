# YelpCamp Frontend — UX/UI Enhancements Backlog

This document catalogs concrete improvements we can make to the overall UX and UI of the YelpCamp frontend (`yelpcamp-frontend/`, Next.js 16 App Router + React 19 + Tailwind v4). It's based on a full read of every page, component, and supporting module.

## How to read this

- **P0 — Critical / broken:** something is non-functional or actively harms users; fix first.
- **P1 — High impact:** accessibility, core UX, and performance gaps that most users feel.
- **P2 — Polish:** nice-to-have refinements that raise the overall quality bar.
- **Code quality:** housekeeping that improves maintainability and prevents subtle UX bugs.

All file paths are relative to `yelpcamp-frontend/`. Each item lists **Impact**, **File(s)**, and a **Fix**.

---

## P0 — Critical / broken

### P0.1 — Mobile navigation is non-functional
- **Impact:** The hamburger button renders on mobile but has no `onClick` and no menu behind it, so mobile users cannot reach Home, Campgrounds, New, Login/Register, or Logout. The desktop nav is `hidden md:flex`, so on phones there is effectively no navigation at all.
- **File(s):** `components/Navbar.tsx:92-109` (button), `:36-89` (desktop-only links).
- **Fix:** Add a `useState` open/close toggle and render a collapsible mobile menu (or use `@headlessui/react`'s `Disclosure`/`Menu`, already installed). Include all nav + auth links and the ThemeToggle.

### P0.2 — API base URL is hardcoded to localhost
- **Impact:** Ignores `NEXT_PUBLIC_API_URL`; any non-localhost deployment (staging/prod/Docker) points the browser at `http://localhost:3000` and every request fails.
- **File(s):** `lib/api.ts:3`.
- **Fix:** `const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';`

### P0.3 — Campground images missing `alt` text
- **Impact:** Screen readers announce nothing (or a filename) for primary imagery; fails basic accessibility and hurts SEO.
- **File(s):** `app/campgrounds/page.tsx` (list cards), `components/ImageCarousel.tsx` (uses filename as alt).
- **Fix:** Use descriptive alt text such as `alt={`${campground.title} — ${campground.location}`}` and `alt={`${title}, image ${index + 1} of ${images.length}`}` in the carousel.

### P0.4 — Inconsistent currency symbol
- **Impact:** The create form prefixes price with `₱` (peso) while the edit form, detail page, and list all show `$`. Users see a different currency depending on the screen.
- **File(s):** `app/campgrounds/new/page.tsx:130` (`₱`) vs `app/campgrounds/[id]/edit/page.tsx:199`, `app/campgrounds/[id]/page.tsx:162`, `app/campgrounds/page.tsx:123` (`$`).
- **Fix:** Pick one symbol and centralize it (e.g. a `formatPrice()` helper or a `CURRENCY` constant) so every surface agrees.

---

## P1 — High impact

### P1.1 — Accessibility gaps across interactive components
- **Impact:** Keyboard-only and screen-reader users cannot fully operate core UI.
- **Details & Files:**
  - **Modal** (`components/Modal.tsx`): no focus trap, no `role="dialog"`, `aria-modal="true"`, or `aria-labelledby`. Focus can escape to the page behind it. *(Esc-to-close and body-scroll lock already work.)*
  - **Toast** (`components/Toast.tsx`): no `aria-live="polite"` / `role="status"`, so notifications are silent to screen readers.
  - **StarRating** (`components/StarRating.tsx`): stars are non-semantic; no per-star `aria-label`, no keyboard (arrow-key) operation, no `radiogroup` role.
  - **Maps** (`components/MapCluster.tsx`, `MapSingle.tsx`): containers have no `role="region"`/`aria-label` and no text alternative.
  - **ImageCarousel** (`components/ImageCarousel.tsx`): no ←/→ keyboard support and no `aria-live` announcing the current slide.
- **Fix:** Add the missing ARIA roles/labels; implement a focus trap in Modal (or adopt `@headlessui/react` `Dialog`); make StarRating a keyboard-operable radiogroup; add `aria-live` regions to Toast and the carousel.

### P1.2 — Full-page reload on 401
- **Impact:** On an expired/invalid token the response interceptor does `window.location.href = '/login'`, forcing a hard reload that throws away all SPA state and feels jarring. If already on `/login`, it can loop.
- **File(s):** `lib/api.ts:35`.
- **Fix:** Clear auth state and route with Next's client router + a toast ("Session expired, please log in"). Skip the redirect when already on `/login`.

### P1.3 — No loading skeletons
- **Impact:** Every async screen shows bare "Loading..." text. Combined with images that have no reserved space, the result is layout shift and a low-quality feel.
- **File(s):** `app/campgrounds/page.tsx`, `app/campgrounds/[id]/page.tsx`, `app/campgrounds/[id]/edit/page.tsx`.
- **Fix:** Add skeleton placeholders for cards, carousel, map, and the review area; reserve image dimensions (aspect-ratio) to prevent reflow.

### P1.4 — No pagination on campgrounds list
- **Impact:** The list fetches and renders every campground at once; it degrades badly as data grows. The backend already supports `page`/`limit` query params.
- **File(s):** `app/campgrounds/page.tsx`, `lib/api.ts` (`campgroundAPI.getAll`).
- **Fix:** Pass `page`/`limit`, add pagination or infinite scroll, and surface total count.

### P1.5 — React Query installed but unused
- **Impact:** All fetching is hand-rolled `useEffect` + axios + `useState`: no caching, request dedup, background refetch, or stale-while-revalidate. Navigating back to the list refetches everything.
- **File(s):** `lib/api.ts`, list & detail pages; `@tanstack/react-query` in `package.json` is never imported.
- **Fix:** Add a `QueryClientProvider` (a client providers wrapper in `app/`) and convert list/detail reads to `useQuery` and mutations (create/update/delete/review) to `useMutation` with cache invalidation.

### P1.6 — No unsaved-changes warning on forms
- **Impact:** Users can navigate away or close the tab mid-edit and silently lose everything typed.
- **File(s):** `app/campgrounds/new/page.tsx`, `app/campgrounds/[id]/edit/page.tsx`.
- **Fix:** Track dirty state (React Hook Form's `formState.isDirty`) and prompt before navigation / `beforeunload`.

### P1.7 — Image upload has no preview or client validation
- **Impact:** Users can't see what they selected before submitting, and oversized/wrong-type files only fail server-side (slow, confusing). No upload progress on large files.
- **File(s):** `app/campgrounds/new/page.tsx`, `app/campgrounds/[id]/edit/page.tsx`.
- **Fix:** Render thumbnail previews of selected files, validate type/size client-side with clear messaging, and show upload progress.

### P1.8 — Toast is single-slot
- **Impact:** A single shared toast state means a second notification overwrites the first, and overlapping auto-hide timers can race.
- **File(s):** `lib/store.ts:60-83` (`useToastStore`), `components/Toast.tsx`.
- **Fix:** Convert to a queue/array of toasts each with its own id and timer; render a stack and dismiss individually.

---

## P2 — Polish / nice-to-have

- **Empty-state clarity** (`app/campgrounds/page.tsx`): distinguish *loading* vs *error* vs *genuinely empty* instead of one ambiguous message.
- **Breadcrumbs**: add Home › Campgrounds › [Name] so users keep context.
- **Review timestamps** (`app/campgrounds/[id]/page.tsx`): show when each review was written (backend stores `timestamps`).
- **Carousel swipe** (`components/ImageCarousel.tsx`): support touch swipe on mobile.
- **Responsive map heights** (`MapCluster.tsx` 500px, `MapSingle.tsx` 300px): shrink on small viewports.
- **`prefers-reduced-motion`** (`app/globals.css`): gate fade/slide animations for users who opt out.
- **Visible focus styles** (`app/globals.css`): define consistent `:focus-visible` rings instead of relying on browser defaults.
- **Register UX** (`app/register/page.tsx`): add a confirm-password field and a password-strength hint.
- **Search / sort / filter** (`app/campgrounds/page.tsx`): let users sort by price/newest and search by name/location.
- **Character counters**: on review body and campground description fields.
- **Share buttons**: on the campground detail page.
- **Drag-and-drop upload**: friendlier than the bare file input on the new/edit forms.
- **Image reordering** (`app/campgrounds/[id]/edit/page.tsx`): let authors choose the cover image / order.
- **Focus restoration**: move focus to the first invalid field after a failed form submit (login/register/new/edit).
- **Delete confirmation UX** (`app/campgrounds/[id]/page.tsx`): replace the blocking `confirm()` with the existing accessible `Modal`.

---

## Code quality / housekeeping

- **Redundant localStorage writes** (`lib/store.ts`): the auth store calls `localStorage.setItem` directly *and* uses Zustand's `persist` middleware, duplicating state with drift risk. Rely on `persist` alone.
- **Hydration flash for auth** (`lib/store.ts`, consumers): store initializes `null` then rehydrates, briefly flashing logged-out UI for authenticated users. Add a hydration guard (`persist`'s `onRehydrateStorage`/`hasHydrated`) before rendering auth-dependent UI.
- **Unused dependency `@headlessui/react`** (`package.json`): currently imported nowhere. Either adopt it (its accessible `Dialog`/`Menu` would directly solve P0.1 and P1.1) or remove it.
- **Shared API types**: pages declare local `Campground`/`Review`/`User` interfaces. Extract a single `lib/types.ts` and reuse, keeping them in sync with the backend.
- **Font stack not wired up** (`app/globals.css`): `body` uses a generic `Arial, Helvetica, sans-serif` stack while the layout loads Geist via `--font-geist-sans`/`--font-geist-mono`. Point the CSS at the loaded font variables.

---

## Quick wins (high impact, low effort)

| Item | Priority | File(s) | Why it's quick |
|------|----------|---------|----------------|
| Fix currency symbol (`₱` → `$`) | P0.4 | `app/campgrounds/new/page.tsx:130` | One-character/constant change |
| Env-var for API base URL | P0.2 | `lib/api.ts:3` | One-line change |
| Add image `alt` text | P0.3 | list + `ImageCarousel.tsx` | Few attribute additions |
| `aria-live` on Toast | P1.1 | `components/Toast.tsx` | Single attribute, big a11y win |
| Wire mobile menu toggle | P0.1 | `components/Navbar.tsx` | Local state + existing links |
| Skip 401 redirect when on `/login` | P1.2 | `lib/api.ts:35` | Guard condition |
