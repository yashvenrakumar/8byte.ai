# Portfolio Dashboard

Full-stack **Portfolio Dashboard** (Octa Byte AI case study): React + TypeScript + Vite + Tailwind on the frontend, Node + Express + TypeScript (MVC) on the backend.

## Project structure

- **`frontend/`** – React 19 + Vite + TypeScript + Tailwind CSS + Redux Toolkit + React Router + Error Boundaries
- **`backend/`** – Node + Express + TypeScript, MVC (server, routes, controllers, services, models, validation, standardized API response)

## Quick start

### Backend

```bash
cd backend
cp .env.example .env   # edit if needed
npm run dev
```

API runs at `http://localhost:5001`. **Swagger UI:** `http://localhost:5001/api-docs`. Health: `GET /health`. Portfolio: `GET /api/portfolio`, `GET /api/portfolio/sectors`.

### Frontend

```bash
cd frontend
cp .env.example .env   # uses /api proxy to backend in dev
npm run dev
```

App runs at `http://localhost:5173`. Vite proxies `/api` to the backend.

## Requirements (from assignment)

- **Portfolio table**: Particulars, Purchase Price, Qty, Investment, Portfolio %, NSE/BSE, CMP (Yahoo Finance), Present Value, Gain/Loss, P/E (Google Finance), Latest Earnings (Google Finance)
- **Dynamic updates**: CMP / Present Value / Gain-Loss refresh (e.g. every 15s)
- **Visuals**: Green/red for Gain/Loss; sector grouping with sector-level totals

Current setup provides the project skeleton and mock portfolio data; Yahoo/Google Finance integration and 15s refresh can be added next.
