# Portfolio Dashboard – Sprint Plan & Enterprise Execution

## 1. Requirement Summary (Assignment + Excel)

### 1.1 From Assignment (Portfolio Usecase Assignment BE)

| Area | Requirement |
|------|-------------|
| **Data sources** | Yahoo Finance → CMP (current market price); Google Finance → P/E ratio, Latest Earnings. Use structured JSON; acknowledge unofficial/scraping approach. |
| **Portfolio table** | Particulars, Purchase Price, Qty, Investment, Portfolio (%), NSE/BSE, CMP, Present Value, Gain/Loss, P/E Ratio, Latest Earnings |
| **Dynamic updates** | CMP, Present Value, Gain/Loss refresh at regular intervals (e.g. every 15 seconds). |
| **Visual** | Green for gains, red for losses. |
| **Sector grouping** | Group by sector; sector-level: Total Investment, Total Present Value, Gain/Loss. |
| **Tech** | Frontend: React/Next.js; Backend: Node.js; Styling: Tailwind, TypeScript; optional: react-table, recharts. |
| **Non-functional** | Caching/throttling for rate limits; async/await; error handling; no API keys on client; optional WebSockets. |

### 1.2 From Sample Excel (Sample Portfolio BE (2) (1).xlsx)

- **Sectors**: Financial Sector, Tech Sector, Consumer, Power, Pipe Sector, Others.
- **Columns used**: No, Particulars, Purchase Price, Qty, Investment, Portfolio (%), NSE/BSE (symbol), CMP, Present value, Gain/Loss, Gain/Loss (%), P/E (TTM), Latest Earnings (and extra columns for future use).
- **Symbols**: Mix of NSE (e.g. HDFCBANK, BAJFINANCE, AFFLE, DMART, ASTRAL) and BSE codes (e.g. 532174, 544252).
- **Business rules**: Investment = Purchase Price × Qty; Present Value = CMP × Qty; Gain/Loss = Present Value − Investment; Portfolio % = proportional weight.

---

## 2. Sprint Overview

| Sprint | Focus | Outcomes |
|--------|--------|----------|
| **S1** | Data & backend foundation | Portfolio seed from Excel structure; domain model; GET /portfolio, GET /portfolio/sectors; sector filter. |
| **S2** | External APIs & caching | Yahoo Finance (CMP); Google Finance (P/E, Latest Earnings); cache + throttle; enrich holdings in service layer. |
| **S3** | Frontend table & UX | Full columns; 15s refresh; green/red Gain/Loss; sector grouping (headers + summary cards); formatting (INR, %); responsive. |
| **S4** | Quality & performance | Error handling & fallbacks; React memoization; backend response cache; loading/empty states; optional recharts. |

---

## 3. Sprint 1 – Data & Backend Foundation

### 3.1 Scope

- **Business module**: Portfolio domain (Holdings, SectorSummary) aligned with assignment + Excel.
- **Seed data**: JSON derived from Excel (Particulars, Purchase Price, Qty, Investment, Portfolio %, NSE/BSE symbol, sector). CMP/Present Value/Gain/Loss/P/E/Latest Earnings computed or filled by API later.
- **API**:  
  - `GET /api/portfolio?sector=...` → list holdings (optional sector filter).  
  - `GET /api/portfolio/sectors` → sector summaries (Total Investment, Total Present Value, Gain/Loss, count).
- **Validation**: Query validation for `sector`, `refresh` (for cache bust).

### 3.2 Deliverables

- [x] `backend/src/data/portfolio.seed.json` (or .ts) – seed holdings with sector.
- [x] `backend/src/models/portfolio.model.ts` – use seed; compute investment/presentValue/gainLoss when CMP available.
- [x] Routes/controllers/services already present; ensure response shape matches frontend types.
- [x] Swagger updated for sector query param.

---

## 4. Sprint 2 – External APIs & Caching

### 4.1 Scope

- **Yahoo Finance**: Fetch CMP by symbol (NSE/BSE). Use unofficial lib or scrape; document approach.
- **Google Finance**: Fetch P/E and Latest Earnings; same approach.
- **Caching**: In-memory (or Redis) cache with TTL (e.g. 60s for CMP, 300s for P/E/Earnings) to reduce rate limits.
- **Throttling**: Limit concurrent/periodic calls per symbol.
- **Enrichment**: In `portfolio.service`, merge cached/live CMP, P/E, Latest Earnings into holdings; compute Present Value, Gain/Loss.

### 4.2 Deliverables

- [ ] `backend/src/services/marketData.service.ts` – Yahoo + Google fetch functions.
- [ ] `backend/src/services/cache.service.ts` – TTL cache for CMP, P/E, Earnings.
- [ ] `portfolio.service` calls marketData + cache and merges into holdings.
- [ ] Env vars for API base URLs / feature flags (no keys in client).
- [ ] README note on unofficial APIs and rate limits.

---

## 5. Sprint 3 – Frontend Table & UX

### 5.1 Scope

- **Table**: All columns – Particulars, Purchase Price, Qty, Investment, Portfolio (%), NSE/BSE, CMP, Present Value, Gain/Loss, P/E Ratio, Latest Earnings.
- **Dynamic updates**: `useInterval` 15s to refetch portfolio (or only CMP-related fields if API supports).
- **Visual**: Green/red for Gain/Loss (and sector-level Gain/Loss).
- **Sector grouping**: Group rows by sector; optional sector header rows; sector summary cards (Total Investment, Total Present Value, Gain/Loss).
- **Formatting**: INR for money, % for portfolio and gain/loss %; handle nulls (P/E, Latest Earnings).

### 5.2 Deliverables

- [ ] Dashboard: table with full columns; sort/filter optional.
- [ ] Sector grouping: by sector with summary blocks.
- [ ] 15s auto-refresh using existing `useInterval` + fetch.
- [ ] `format.ts`: formatCurrency (INR), formatPercent; use in table and sector cards.
- [ ] Responsive layout (horizontal scroll for table on small screens).

---

## 6. Sprint 4 – Quality & Performance

### 6.1 Scope

- **Error handling**: API failures (Yahoo/Google) → fallback to last CMP or purchase price; user-visible error state on frontend.
- **Memoization**: `React.memo` for table row; `useMemo` for derived data (e.g. by sector).
- **Caching**: Backend caches external API responses; optional `refresh` query to bypass.
- **UX**: Loading skeletons, empty state, error message component.
- **Optional**: Recharts for sector allocation pie or bar.

### 6.2 Deliverables

- [ ] Backend: try/catch in marketData service; fallback CMP in model/service.
- [ ] Frontend: error banner; retry; loading state for table.
- [ ] Memoized components and selectors.
- [ ] README/Technical doc: challenges (unofficial APIs, rate limits) and solutions.

---

## 7. Architecture (Enterprise-Oriented)

```
frontend/
  src/
    components/     # Reusable UI (Table, SectorCard, ErrorBanner)
    pages/          # DashboardPage
    store/          # Redux slices, hooks
    services/api/   # API client, portfolio.api
    hooks/          # useInterval, usePortfolioRefresh
    utils/          # format (currency, percent)
    types/          # Holding, SectorSummary, ApiResponse

backend/
  src/
    config/         # env, swagger
    routes/         # portfolio.routes
    controllers/    # portfolio.controller
    services/       # portfolio.service, marketData.service, cache.service
    models/         # portfolio.model (domain + seed)
    data/           # portfolio.seed.json
    middleware/     # errorHandler, standardResponse, asyncHandler
    validation/     # query validation
```

- **Single responsibility**: Controllers → HTTP; services → business + external APIs; models → data shape and seed.
- **Structured responses**: `{ success, data, message?, errors? }` from backend; typed on frontend.
- **Security**: No API keys in frontend; env for backend URLs/keys.
- **Performance**: Cache external APIs; throttle; memoize UI.

---

## 8. Definition of Done (per sprint)

- Code compiles and passes existing lint.
- API contract matches OpenAPI/Swagger and frontend types.
- Assignment requirements for that sprint are met (table columns, 15s refresh, sector grouping, visuals, error handling as planned).
- README/SPRINT updated with current state and how to run.

---

## 9. Execution Order

1. **Sprint 1** (this pass): Seed data + backend model + sector filter.
2. **Sprint 2**: Yahoo/Google integration + cache in backend.
3. **Sprint 3**: Frontend full table + 15s refresh + sector grouping + formatting.
4. **Sprint 4**: Error handling, memoization, caching polish, optional charts.
