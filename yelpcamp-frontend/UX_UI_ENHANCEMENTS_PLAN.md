# Plan: Frontend UX/UI Enhancements Document

## Context

The YelpCamp frontend (`yelpcamp-frontend/`, Next.js 16 App Router + React 19 + Tailwind v4) works but has a number of unpolished UX edges, accessibility gaps, mobile issues, and architectural shortcuts. The goal is a single markdown document cataloguing the enhancements we can make to the overall UX/UI of the system, so it can serve as an actionable backlog.

Three Explore agents read the entire frontend (all `app/` pages, all `components/`, and `lib/`/config/state). This plan captures their findings as the structure for the deliverable.

**Decisions:**
- Scope: **Everything** — UX/UI polish, accessibility, mobile/responsive, performance, AND code quality.
- Format: **Prioritized backlog** (P0/P1/P2), each item with impact, affected file(s), and a short suggested fix.

## Deliverable

A new file: **`yelpcamp-frontend/UX_UI_ENHANCEMENTS.md`** (lives with the frontend it documents).

This is the only thing to create. No code changes are part of this task.

## Document structure

1. **Header & how to read it** — purpose, priority legend (P0 = broken/critical, P1 = high-impact, P2 = polish/nice-to-have), note that file paths are relative to `yelpcamp-frontend/`.

2. **P0 — Critical / broken** (things that don't work or block users):
   - Mobile navigation is non-functional — hamburger button renders but opens nothing (`components/Navbar.tsx:92-109`, no `onClick`); mobile users can't reach Home/New/auth links.
   - Hardcoded API base URL ignores `NEXT_PUBLIC_API_URL` (`lib/api.ts:3`) — breaks any non-localhost deployment.
   - Missing `alt` text on campground images (`app/campgrounds/page.tsx`, carousel) — accessibility failure.
   - Inconsistent currency symbol — `₱` in create form (`app/campgrounds/new/page.tsx:130`) vs `$` everywhere else (`edit/page.tsx:199`, detail `[id]/page.tsx:162`, list `page.tsx:123`).

3. **P1 — High impact** (accessibility, core UX, performance):
   - Accessibility: Modal has no focus trap / `role="dialog"` / `aria-modal` / `aria-labelledby` (`components/Modal.tsx`); Toast missing `aria-live`/`role="status"` (`components/Toast.tsx`); StarRating not keyboard-operable, no aria labels (`components/StarRating.tsx`); maps lack `role`/`aria-label` (`components/MapCluster.tsx`, `MapSingle.tsx`); carousel no keyboard/aria-live.
   - Full-page reload on 401 via `window.location.href` (`lib/api.ts:35`) — loses SPA state; should use router + toast.
   - No loading skeletons — generic "Loading..." text everywhere (list, detail, edit); add skeleton components.
   - No pagination/infinite scroll on campgrounds list (`app/campgrounds/page.tsx`) — scales poorly. Backend already supports `page`/`limit`.
   - React Query installed but unused — adopt for caching/dedup/refetch on list + detail fetches.
   - Form dirty-state warning missing on create/edit — abandoning loses data.
   - Image upload has no preview, no client-side size/type validation (`new`/`edit` pages).
   - Toast is single-slot — rapid toasts overwrite; add a queue (`lib/store.ts`, `components/Toast.tsx`).

4. **P2 — Polish / nice-to-have**:
   - Empty-state clarity (distinguish loading vs error vs genuinely empty), breadcrumbs, review timestamps, swipe gestures on carousel, responsive map heights, `prefers-reduced-motion`, focus-visible styles, password strength/confirm on register, search/sort/filter on list, character counters, share buttons, drag-and-drop upload, image reordering, focus restoration after form errors.

5. **Code quality / housekeeping**:
   - Redundant localStorage writes alongside Zustand `persist` (`lib/store.ts`) — rely on persist only.
   - Zustand hydration flash risk for auth state — add hydration guard.
   - Unused dependency `@headlessui/react` — adopt (accessible Dialog/Menu would fix Modal + mobile menu) or remove.
   - Shared API/response TypeScript types in `lib/types.ts` instead of per-page local interfaces.
   - Generic font stack in `globals.css` not wired to the loaded Geist variables.

6. **Quick wins** — a short table at the end of the highest-impact / lowest-effort items (alt text, currency fix, env var, aria-live on Toast, mobile menu) for an easy first pass.

Each item: one-line **impact**, **file(s)**, and a one-line **suggested fix**. Concrete and skimmable.

## Verification

This deliverable is a document, so verification is a review pass:
- Confirm every cited file path exists and line references are accurate (spot-check `lib/api.ts`, `components/Navbar.tsx`, `components/Modal.tsx`, `components/Toast.tsx`, the create/edit pages).
- Confirm the priority buckets read sensibly and no finding is duplicated across buckets.
- Ensure it's skimmable (tables/short bullets) and self-contained (no need to read the agent transcripts).
