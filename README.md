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

The dashboard and scheduler screens load summary and schedule data from the backend. Scheduler edits require `PUT /schedulers/{name}` with a JSON `cronValue`; latest policy outcomes require `/dashboard/summary` to return `notifications.latestByPolicy`, with one current `{ policyNumber, status, eventTime, inDeadLetterQueue }` record per policy. The backend must update that status when an event enters or leaves the dead-letter queue. These API capabilities are not present in the current backend, so the frontend reports their absence instead of displaying cumulative counts or claiming an unsaved schedule was applied. Reports can be generated and downloaded using the existing daily report generator. The backend does not expose a paginated policy-list endpoint, so the Policies and Renew policies screens support lookup by policy number.

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
    ├── policies/RenewPolicyPage.jsx
    ├── policies/CreatePolicyPage.jsx
    ├── dlq/DeadLettersPage.jsx
    ├── reports/ReportsPage.jsx
    └── schedulers/
        ├── SchedulerEditor.jsx
        └── SchedulersPage.jsx
```
