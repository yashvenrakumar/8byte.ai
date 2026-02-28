# Technical Notes – Portfolio Dashboard

## Challenges and Solutions

### 1. Unofficial APIs (Yahoo / Google Finance)

- **Challenge**: Yahoo and Google do not provide official public APIs; data is obtained via unofficial libraries or scraping, which can break when sites change.
- **Solution**:
  - **Yahoo**: We use the community library `yahoo-finance2` (Node.js) to fetch CMP (`quote.regularMarketPrice`), P/E (`quote.trailingPE`), and latest earnings date (`quote.earningsTimestamp`). Indian symbols are mapped to Yahoo format: NSE ticker → `SYMBOL.NS`, BSE code → `CODE.BO`.
  - **Google Finance**: P/E and Latest Earnings are currently satisfied from Yahoo’s quote data. A separate Google Finance integration (e.g. scraping or unofficial client) can be added later if required; the service layer is structured to accept alternate data sources.

### 2. Rate Limiting and Reliability

- **Challenge**: Public sources may rate-limit or throttle; excessive calls can lead to blocks or failures.
- **Solution**:
  - **Caching**: In-memory TTL caches for CMP (60s) and fundamentals (300s) reduce repeated calls for the same symbol.
  - **Throttling**: Batch fetches use a short delay (150ms) between symbol requests to avoid bursts.
  - **Fallback**: If Yahoo returns no price for a symbol, we fall back to the holding’s purchase price (or Excel `fallbackCmp` from seed) so the dashboard still renders with a sensible value.
- **Verification logic**: Live CMP is accepted only if it is within 1%–20× the holding’s purchase price; otherwise we use Excel fallback or purchase price. This avoids wrong values when Yahoo returns a different metric (e.g. market cap) as price for some symbols.

### 3. Asynchronous Operations and Performance

- **Challenge**: Fetching CMP and fundamentals for many symbols can be slow if done sequentially.
- **Solution**: CMP batch and fundamentals batch run in parallel (`Promise.all`). Within each batch, requests are sequential with a small delay to respect rate limits. The frontend polls the backend every 15s, so most requests are served from cache after the first load.

### 4. Data Model and Excel Alignment

- **Challenge**: Assignment and sample Excel define columns and sector grouping; data must stay consistent across backend and frontend.
- **Solution**:
  - Seed data is derived from the Excel structure and stored in `backend/src/data/portfolio.seed.json` (Particulars, Purchase Price, Qty, Investment, Portfolio %, NSE/BSE symbol, Sector).
  - Backend model computes Investment (if not in seed), Present Value (CMP × Qty), and Gain/Loss (Present Value − Investment). Sector summaries are computed from holdings.
  - Frontend table shows all required columns; sector grouping is done in the UI (grouped rows + sector summary cards).

### 5. Security

- **Challenge**: API keys or sensitive logic must not be exposed to the client.
- **Solution**: All Yahoo/Google (or future) calls are made only on the backend. The frontend only calls our API (`/api/portfolio`, `/api/portfolio/sectors`). No market-data keys or credentials are sent to the browser.

### 6. Data Accuracy Disclaimer and Optional Charting

- **Disclaimer**: Assignment asks to add disclaimers when data may vary in accuracy. The dashboard shows a short disclaimer that CMP, P/E and earnings are from unofficial sources and are not for trading or investment decisions.
- **recharts**: Assignment recommends optional charting. A sector allocation pie chart (by present value) is included in the Sector Summary section using recharts.

### 7. Frontend Performance and UX

- **Challenge**: Large tables and frequent refresh can cause unnecessary re-renders and jank.
- **Solution**:
  - `useInterval` triggers a single refetch every 15s; Redux stores the result so only updated data drives re-renders.
  - Table and sector summary components are wrapped in `React.memo` to avoid re-renders when parent re-renders with same props.
  - Sector grouping and derived data use `useMemo` so we don’t recompute on every render.

### 8. Error Handling

- **Backend**: Market data functions catch errors and return `null`; the portfolio model uses purchase price when CMP is missing. API errors are handled by a central error middleware and return a consistent `{ success, message }` shape.
- **Frontend**: Failed API calls set Redux error state; the dashboard shows an error message and a “Retry” button. Error boundary catches React runtime errors.

---

## Stack Summary

| Layer    | Tech |
|----------|------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Redux Toolkit, React Router |
| Backend  | Node.js, Express, TypeScript |
| Market   | yahoo-finance2 (CMP, P/E, earnings date) |
| Data     | JSON seed (from Excel structure); in-memory cache for market data |

---

## Running and Building

- **Backend**: `cd backend && npm run dev` (API on port 5001; Swagger at `/api-docs`). Seed path: `src/data/portfolio.seed.json` (or `dist/data/` after build).
- **Frontend**: `cd frontend && npm run dev` (app on 5173; Vite proxies `/api` to backend). Set `VITE_API_BASE_URL` if the API is elsewhere.
- **Build**: Backend `npm run build` compiles TS and copies `src/data` to `dist/data`. Frontend `npm run build` produces static assets in `dist/`.
