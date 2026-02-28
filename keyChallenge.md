# Key Challenges in 8byte.ai Portfolio Dashboard
 
---

## 1. Unofficial / Unreliable External APIs (Yahoo Finance)

**Challenge:** Yahoo and Google do not provide official public APIs. Data is obtained via community libraries (e.g. `yahoo-finance2`) or scraping; responses can break when sites change, return wrong field types (e.g. market cap as price), or differ for NSE vs BSE symbols.

 
---

## 2. Rate Limiting, Throttling, and Caching

**Challenge:** Public sources may rate-limit or throttle; excessive calls can lead to blocks or failures. Many symbols mean many sequential or parallel calls.

 
---

## 3. Async Operations and Backend Performance

**Challenge:** Fetching CMP and fundamentals for many symbols can be slow if done naively. First load can be heavy; subsequent loads should benefit from cache.

 
---

## 4. Data Model and Excel / Business Rules Alignment

**Challenge:** Assignment and sample Excel define columns and sector grouping. Data must stay consistent across backend seed, API response, and frontend table (Particulars, Purchase Price, Qty, Investment, Portfolio %, NSE/BSE, CMP, Present Value, Gain/Loss, P/E, Latest Earnings, Sector).

 

---

## 5. Security: No API Keys or Sensitive Logic on Client

**Challenge:** Yahoo/Google (or any market-data) calls and keys must stay server-side. Frontend must only call our API (`/api/portfolio`, `/api/portfolio/sectors`).

 

## 6. Frontend Performance and UX (Re-renders, Polling, Large Tables)

**Challenge:** Large tables and 15s refresh can cause unnecessary re-renders and jank. Sector grouping, sort, and filter are computed from the same dataset.

 
---

## 7. Error Handling and Resilience (Backend + Frontend)

**Challenge:** External API failures, missing CMP, or network errors must not crash the app. User should see a clear error and retry option.

 
---

## 8. Data Accuracy Disclaimer and Optional Charting

**Challenge:** Assignment requires a disclaimer when data may vary in accuracy. Optional charting (e.g. sector allocation) should integrate with the same data and refresh cycle.
 
---

## 9. Deployment and Environment (Firebase + Render)

**Challenge:** Frontend on Firebase Hosting, backend on Render. Different origins, possible cold starts, and env-specific API base URL.
 

## 10. Architecture and Maintainability (Layered Backend, Typed API)

**Challenge:** Codebase must stay maintainable: clear separation of routes, controllers, services, models, validation, and middleware; typed API contract shared with frontend.

 
 