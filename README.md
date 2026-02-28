# Portfolio Dashboard

Full-stack **Portfolio Dashboard** (Octa Byte AI case study): React + TypeScript + Vite + Tailwind on the frontend, Node + Express + TypeScript (MVC) on the backend. Data aligned with the assignment and sample Excel (sectors, columns, formulas).

## Project structure

- **`frontend/`** – React 19 + Vite + TypeScript + Tailwind CSS + Redux Toolkit + React Router + Error Boundaries. Full portfolio table, 15s refresh, sector grouping, formatted currency/percent.
- **`backend/`** – Node + Express + TypeScript, MVC. Portfolio seed from Excel structure; Yahoo Finance (yahoo-finance2) for CMP, P/E, Latest Earnings; in-memory TTL cache; sector filter.

## Quick start

### Backend

```bash
cd backend
cp .env.example .env   # edit if needed
npm run dev
```

API runs at `http://localhost:5001`. **Swagger UI:** `http://localhost:5001/api-docs`. Health: `GET /health`. Portfolio: `GET /api/portfolio`, `GET /api/portfolio/sectors` (optional query: `?sector=Technology`).

### Frontend

```bash
cd frontend
cp .env.example .env   # uses /api proxy to backend in dev
npm run dev
```

App runs at `http://localhost:5173`. Vite proxies `/api` to the backend. Dashboard refreshes CMP and values every 15 seconds.

## Requirements (from assignment)

- **Portfolio table**: Particulars, Purchase Price, Qty, Investment, Portfolio %, NSE/BSE, CMP (Yahoo Finance), Present Value, Gain/Loss, P/E, Latest Earnings ✓
- **Dynamic updates**: CMP / Present Value / Gain-Loss refresh every 15s ✓
- **Visuals**: Green/red for Gain/Loss; sector grouping with sector-level totals ✓

## Docs

- **`SPRINT.md`** – Sprint plan (data, APIs, frontend, quality) and execution order.
- **`TECHNICAL.md`** – Challenges (unofficial APIs, rate limits, errors) and solutions.
