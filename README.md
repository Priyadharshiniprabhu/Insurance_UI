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

The Vite development server proxies `/policies` and `/dlq` to the backend, so no backend changes or CORS configuration are required for the existing policy and DLQ flows.

The dashboard, report, and scheduler screens are ready for the corresponding REST APIs. The current backend does not expose summary, policy-list, report, or scheduler-management endpoints, so those screens show an explicit unavailable state instead of displaying fabricated data.

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
