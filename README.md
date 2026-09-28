# Insurance frontend

Standalone React/Vite frontend for the Spring Boot insurance API.

## Run locally

Start the backend on `http://localhost:8080`, then run:

```powershell
cd D:\Projects\insurance-frontend
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:5173`.

The Vite development server proxies `/dashboard`, `/policies`, `/dlq`, `/reports`, and `/schedulers` to the backend, so no CORS configuration is required for these flows.

The dashboard and scheduler screens load summary and schedule data from the backend. Reports can be generated and downloaded using the existing daily report generator. The backend does not expose a paginated policy-list endpoint, so the Policies screen supports lookup by policy number.

## Project structure

```text
src/
├── App.jsx
├── main.jsx
├── constants.js
├── services/
│   └── api.js
├── components/
│   ├── AppLayout.jsx
│   └── Ui.jsx
└── features/
    ├── dashboard/DashboardPage.jsx
    ├── policies/PoliciesPage.jsx
    ├── policies/CreatePolicyPage.jsx
    ├── dlq/DeadLettersPage.jsx
    ├── reports/ReportsPage.jsx
    └── schedulers/SchedulersPage.jsx
```
