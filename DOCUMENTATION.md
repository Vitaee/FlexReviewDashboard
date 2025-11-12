# The Flex Reviews Dashboard

## 1. Tech Stack & Project Setup
- **Tooling:** Vite + React 19 + TypeScript, Tailwind CSS v4 for styling, Zustand for state, and a lightweight API client that talks directly to the backend.
- **Local commands**
  ```bash
  npm install
  npm run dev      # start the dashboard with the mocked API route
  npm run build    # type-check and create the production bundle
  npm run preview  # preview the production build (middleware still works)
  ```
- **Folder highlights**
- `src/types/review.ts` - strict shared types for backend payloads and normalized data.
- `src/utils/reviewMetrics.ts` - transforms backend reviews, aggregates property stats, exposes category metadata.
- `src/store/reviews.ts` - Zustand store for fetching, filters, approvals, and available filter metadata.
- `src/components/*` - dashboard, insights, and public preview UI.

## 2. API & Data Flow
- **Backend reviews endpoint:** `useReviewStore.fetchReviews()` calls `/api/reviews/hostaway` through the shared `apiClient`. The backend already returns normalized review objects (see sample payload in the assessment), so the frontend focuses on light transformations (category arrays, rating conversions, insight tags).
- **Normalization & aggregation:**
  - `normalizeBackendReview` in `src/utils/reviewMetrics.ts` converts backend reviews into the UI-ready structure (rating on 5-pt scale, formatted dates, insight tags, category arrays).
  - The same helper file exposes `summarizeListings`, `deriveTotals`, and filter metadata builders so both the dashboard and the store rely on a single source of truth for analytics.
- **Frontend consumption:**
  - `useReviewStore` stores the normalized reviews, active filters, “approved for web” toggles, and derived filter metadata (channels/types/categories). Requests set `lastGeneratedAt` so the header can communicate freshness.
  - Approval toggles call `PATCH /api/reviews/approve` (and bulk operations are ready via `/api/reviews/approve/bulk`), keeping the backend source of truth in sync.
  - `useReviewStore.fetchApprovedReviews()` hits `GET /api/reviews/approved` to hydrate the public preview so only server-approved testimonials are displayed.
  - `useDashboardData()` derives filtered/sorted review lists, per-property performance, channel mix, category health, tag/issue leaderboards, and rolled-up totals without needing additional backend calls.

### 2.1 API client configuration
- `src/api/client.ts` wraps fetch calls so the app can target any environment by configuring `VITE_API_BASE_URL` (see `.env.example`). Leave it blank for same-origin calls in development, or supply a full base URL (e.g., `https://api.theflex.global`).
- Each call returns `{ data, error }`, allowing UI layers to surface backend issues without blowing up the component tree.
- An optional `healthCheck` helper exists for future observability integrations.

## 3. Manager Dashboard UX
- **Filter & sorting controls:** managers can slice reviews by channel, review type, category focus, time range (30/60/90 days), minimum rating, search term, and optionally show only approved reviews. Sorting covers recency and rating extremes.
- **Property performance block:** highlights each property's average rating, review volume, last review date, top operational metrics (cleanliness, communication, value), and channel mix stacked bars to quickly spot sourcing trends.
- **Review workspace:** cards show channel, rating, guest + stay length, highlighted tags/issues, and category scores. Each card includes an "Approve for web" toggle that drives the public preview.
- **Insights side panel:** visualizes the filtered channel split, computed category health, recurring issue leaderboard (e.g., noise, construction), and guest highlight tags so managers can quickly scan what guests keep mentioning.
- **Color modes:** a global light/dark toggle lives in the navbar (`useTheme` + `ThemeToggle`) and syncs with localStorage + system preferences. All surfaces rely on Tailwind `dark:` variants to keep styling DRY.

## 4. Public Website Preview
- `PublicWebsitePreview` mirrors the The Flex property detail layout (hero block + review column).
- Only reviews approved in the dashboard surface here. They're grouped per property, display curated rating averages, location, and formatted guest quotes, giving managers confidence before publishing to the live property page.

## 5. Google Reviews Exploration
- Google Places/Reviews APIs require a server-held API key and an active billing project; direct client-side calls would expose credentials and are rate-limited.
- **Implementation path (not shipped):**
  1. Create a lightweight Node/Express proxy (e.g., `/api/reviews/google`) that injects the Places key from server env vars.
  2. Call `places/details` with `fields=reviews,rating,user_ratings_total`.
  3. Run the response through the existing normalizer to align with `NormalizedReview`.
- Because the assessment environment forbids storing external secrets, the Google integration remains documented but stubbed out. The UI and store already support a `'google'` channel, so once the proxy endpoint returns data the dashboard will visualize it without extra UI work.

## 6. Future Enhancements
- Persist approvals per listing via local storage or a backend (currently resets on refresh).
- Add export/share actions (CSV, email digests) and anomaly alerts using the computed leaderboards.
- Introduce charting (e.g., rating over time) using the normalized response history if a real API is available.
