import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Settings2 } from "lucide-react";
import { PanelTitle, ErrorMessage } from "../../components/Ui";
import { api } from "../../services/api";

const SCHEDULER_LABELS = {
  DailyReportJobSchedular: "Daily report",
  RenewalDetectionJobSchedular: "Renewal detection",
  PolicyLapseJobSchedular: "Policy lapse"
};

export default function SchedulersPage() {
  const [schedulers, setSchedulers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadSchedulers = useCallback(async () => {
    setIsLoading(true);
    try {
      setError("");
      setSchedulers(await api("/schedulers", { cache: "no-store" }));
    } catch (exception) {
      setError(exception.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedulers();
  }, [loadSchedulers]);

  return <section className="stack"><div className="panel"><PanelTitle title="Scheduler configuration" icon={Settings2} action={<button className="icon-button" type="button" onClick={loadSchedulers} disabled={isLoading} aria-label="Refresh scheduler data" title={isLoading ? "Refreshing..." : "Refresh"}><RefreshCw className={isLoading ? "refreshing" : ""} size={16} /></button>} /><p className="subtext">Current schedules and their next run times from the backend configuration.</p>{error && <ErrorMessage message={`Scheduler data is unavailable: ${error}`} />}{isLoading && schedulers.length === 0 ? <div className="empty"><b>Loading scheduler data...</b></div> : <div className="scheduler-list">{schedulers.map(scheduler => <div key={scheduler.name}><span><b>{SCHEDULER_LABELS[scheduler.name] || scheduler.name}</b><small>{scheduler.name}</small><small>Schedule: {scheduler.cronValue}</small><small>Next run: {scheduler.nextRun ? new Date(scheduler.nextRun).toLocaleString() : "Not scheduled"}</small></span><code>Configured</code></div>)}</div>}</div></section>;
}
