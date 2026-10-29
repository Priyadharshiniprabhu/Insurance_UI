import { useCallback, useEffect, useState } from "react";
import { Pencil, RefreshCw } from "lucide-react";
import { api } from "../../services/api";
import { ErrorMessage } from "../../components/Ui";

const SCHEDULER_LABELS = {
  DailyReportJobSchedular: "Daily report",
  RenewalDetectionJobSchedular: "Renewal detection",
  PolicyLapseJobSchedular: "Policy lapse"
};

export default function SchedulerEditor() {
  const [schedulers, setSchedulers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savingName, setSavingName] = useState("");
  const [editingName, setEditingName] = useState("");
  const [originalCron, setOriginalCron] = useState("");

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

  function updateCron(name, cronValue) {
    setSchedulers(current => current.map(scheduler => scheduler.name === name ? { ...scheduler, cronValue } : scheduler));
  }

  function editScheduler(scheduler) {
    setOriginalCron(scheduler.cronValue || "");
    setEditingName(scheduler.name);
  }

  function cancelEdit() {
    updateCron(editingName, originalCron);
    setEditingName("");
    setOriginalCron("");
  }

  async function saveScheduler(scheduler) {
    setSavingName(scheduler.name);
    try {
      setError("");
      await api(`/schedulers/${encodeURIComponent(scheduler.name)}`, {
        method: "PUT",
        body: JSON.stringify({ cronValue: scheduler.cronValue })
      });
      await loadSchedulers();
      setEditingName("");
      setOriginalCron("");
    } catch (exception) {
      setError(`Unable to save ${SCHEDULER_LABELS[scheduler.name] || scheduler.name}: ${exception.message}`);
    } finally {
      setSavingName("");
    }
  }

  return <>
    {error && <ErrorMessage message={error} />}
    {isLoading && schedulers.length === 0 ? <div className="empty"><b>Loading scheduler data...</b></div> : schedulers.length === 0 ? <div className="empty"><b>No scheduler data available.</b></div> : <div className="scheduler-list">{schedulers.map(scheduler => <div className="scheduler-row" key={scheduler.name}>
      <span className="scheduler-info"><b>{SCHEDULER_LABELS[scheduler.name] || scheduler.name}</b><small>{scheduler.name}</small><small>Next run: {scheduler.nextRun ? new Date(scheduler.nextRun).toLocaleString() : "Not scheduled"}</small></span>
      <label className="scheduler-cron">Cron schedule<input aria-label={`${scheduler.name} cron schedule`} value={scheduler.cronValue || ""} readOnly={editingName !== scheduler.name} onChange={event => updateCron(scheduler.name, event.target.value)} /></label>
      <div className="scheduler-actions">{editingName === scheduler.name ? <>
        <button type="button" onClick={() => saveScheduler(scheduler)} disabled={isLoading || Boolean(savingName) || !scheduler.cronValue?.trim()}>{savingName === scheduler.name ? "Saving..." : "Save"}</button>
        <button className="outline-button" type="button" onClick={cancelEdit} disabled={Boolean(savingName)}>Cancel</button>
      </> : <button className="scheduler-edit-button" type="button" onClick={() => editScheduler(scheduler)} disabled={isLoading || Boolean(editingName) || Boolean(savingName)}><Pencil size={13} />Edit</button>}</div>
    </div>)}</div>}
    <button className="icon-button scheduler-refresh" type="button" onClick={loadSchedulers} disabled={isLoading || Boolean(editingName) || Boolean(savingName)} aria-label="Refresh scheduler data" title={isLoading ? "Refreshing..." : "Refresh"}><RefreshCw className={isLoading ? "refreshing" : ""} size={16} /> Refresh</button>
  </>;
}
