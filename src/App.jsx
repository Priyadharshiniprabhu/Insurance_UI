import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { NAVIGATION } from "./constants";
import AppLayout from "./components/AppLayout";
import DashboardPage from "./features/dashboard/DashboardPage";
import PoliciesPage from "./features/policies/PoliciesPage";
import CreatePolicyPage from "./features/policies/CreatePolicyPage";
import DeadLettersPage from "./features/dlq/DeadLettersPage";
import ReportsPage from "./features/reports/ReportsPage";
import SchedulersPage from "./features/schedulers/SchedulersPage";

export default function App() {
  const [view, setView] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const notify = (type, message) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4500);
  };
  const title = NAVIGATION.find(([id]) => id === view)?.[1] || "Dashboard";

  return (
    <AppLayout activeView={view} title={title} onNavigate={setView}>
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
          {toast.message}
        </div>
      )}
      {view === "dashboard" && <DashboardPage onNavigate={setView} />}
      {view === "policies" && <PoliciesPage onNavigate={setView} />}
      {view === "create" && <CreatePolicyPage onNotify={notify} />}
      {view === "dlq" && <DeadLettersPage onNotify={notify} />}
      {view === "reports" && <ReportsPage onNotify={notify} />}
      {view === "schedulers" && <SchedulersPage />}
    </AppLayout>
  );
}
