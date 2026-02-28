# 8byte.ai

![8Byte logo](https://8byte.ai/icons/logo.svg)

**Author · Resume:** [Yashvendra Kumar — SDE2 (PDF)](Yashvendra_Kumar_SDE2.pdf)

**Summary:** Full-stack portfolio dashboard (React, Node, TypeScript) with live market data, sector allocation, and CSV export. Frontend on Firebase, API on Render.

---

The screenshot below shows the Portfolio Dashboard: sector summary with allocation donut chart, sector detail cards (investment, present value, gain/loss), and the holdings-by-sector table with search and CSV export.

---

https://eightbyte-ai.onrender.com/api-docs/#/

   npx firebase login
   npx firebase init
   

   # 1. Build the frontend (output goes to dist/)
npm run build

# 2. Deploy to Firebase Hosting
npx firebase deploy


## Stack Summary

| Layer    | Tech |
|----------|------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Redux Toolkit, React Router |
| Backend  | Node.js, Express, TypeScript |
| API docs | Swagger UI (OpenAPI 3) at `/api-docs` |
| Hosting  | **Frontend:** Firebase Hosting · **Backend:** Render |
| Market   | yahoo-finance2 (CMP, P/E, earnings date) |
| Data     | JSON seed (from Excel structure); in-memory cache for market data |

**Live URLs**

- **Frontend:** [https://byteai-b065b.web.app/](https://byteai-b065b.web.app/)
- **Backend API docs:** [https://eightbyte-ai.onrender.com/api-docs/#/](https://eightbyte-ai.onrender.com/api-docs/#/)

---


# How to Run Frontend and Backend

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)

## Backend

1. Open a terminal and go to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies (first time only):
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if you need to change the port or other settings.

4. Run the backend:
   ```bash
   npm run dev
   ```

   The API runs at **http://localhost:5001**  
   - Swagger docs: http://localhost:5001/api-docs  
   - Health check: http://localhost:5001/health

---

## Frontend

1. Open another terminal and go to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies (first time only):
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   In dev, the frontend uses Vite’s proxy to talk to the backend; adjust `.env` if needed.

4. Run the frontend:
   ```bash
   npm run dev
   ```

   The app runs at **http://localhost:5173**

---

## Run Both Together

1. Start the **backend** first (in one terminal):
   ```bash
   cd backend && npm install && npm run dev
   ```

2. Start the **frontend** (in a second terminal):
   ```bash
   cd frontend && npm install && npm run dev
   ```

3. Open **http://localhost:5173** in your browser. The dashboard will call the backend API (proxied via Vite).

---

## Other Commands

| App      | Command        | Description                    |
|----------|----------------|--------------------------------|
| Backend  | `npm run build`| Build for production           |
| Backend  | `npm start`    | Run built app (`dist/server.js`) |
| Frontend | `npm run build`| Build for production           |
| Frontend | `npm run preview` | Preview production build    |


## Portfolio Dashboard

![Portfolio Dashboard](frontend-02-28-2026_02_07_PM.png)

