# Portfolio Dashboard Frontend

React 19 + TypeScript + Vite + Tailwind CSS.

## Structure

- `src/components/` – Reusable UI (e.g. ErrorBoundary)
- `src/pages/` – Route-level pages (Dashboard, NotFound)
- `src/layouts/` – MainLayout with header + outlet
- `src/routes/` – React Router config
- `src/store/` – Redux Toolkit (slices, hooks)
- `src/services/api/` – API client and portfolio endpoints
- `src/types/` – TypeScript types
- `src/utils/` – Helpers (e.g. format)
- `src/hooks/` – Custom hooks (e.g. useInterval for refresh)

## Scripts

- `npm run dev` – Dev server (port 5173, proxy /api → backend)
- `npm run build` – Production build
- `npm run preview` – Preview production build

## Env

`VITE_API_BASE_URL` – API base (default `/api` with Vite proxy).
