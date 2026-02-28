# Portfolio Dashboard API

Node + Express + TypeScript backend with MVC layout.

## API documentation (Swagger)

With the server running, open **http://localhost:5001/api-docs** for interactive Swagger UI. The spec includes request/response examples for all endpoints.

## Structure

- `src/server.ts` – Entry point, starts HTTP server
- `src/app.ts` – Express app, middleware, route mounting
- `src/config/` – Environment and app config
- `src/routes/` – API route definitions
- `src/controllers/` – Request handlers
- `src/services/` – Business logic
- `src/models/` – Data / domain models
- `src/validation/` – Request validation
- `src/middleware/` – standardResponse, notFound, errorHandler
- `src/data/` – `portfolio.seed.json` (holdings from Excel structure)
- `src/services/marketData.service.ts` – Yahoo Finance (CMP, P/E, earnings) via yahoo-finance2
- `src/services/cache.service.ts` – In-memory TTL cache for market data (rate-limit friendly)

## Scripts

- `npm run dev` – Run with tsx watch
- `npm run build` – Compile to `dist/`
- `npm start` – Run compiled `dist/server.js`

## Env

Copy `.env.example` to `.env` and set `PORT`, `CLIENT_ORIGIN`, etc. No API keys required for Yahoo (unofficial API). If market calls fail, CMP falls back to purchase price.


http://localhost:5001/api-docs


