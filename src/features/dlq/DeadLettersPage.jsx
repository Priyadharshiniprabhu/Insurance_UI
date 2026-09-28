import { useEffect, useMemo, useState } from "react";
import { Bell, RefreshCw } from "lucide-react";
import { api } from "../../services/api";
import { Empty, ErrorMessage, PanelTitle } from "../../components/Ui";

export default function DeadLettersPage({ onNotify }) {
  const [items, setItems] = useState([]); const [error, setError] = useState(""); const [filter, setFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  async function load() {
    setIsLoading(true);
    try {
      setError("");
      setItems(await api("/dlq", { cache: "no-store" }));
    } catch (exception) {
      setError(exception.message);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  const filtered = useMemo(() => filter === "ALL" ? items : items.filter(item => item.tier === filter), [items, filter]);
  async function requeue(id) { try { await api(`/dlq/${id}/requeue`, { method: "PUT" }); onNotify("success", "Dead-letter event requeued."); load(); } catch (exception) { onNotify("error", exception.message); } }
  return <section className="panel"><PanelTitle title="Dead-letter queue" icon={Bell} action={<><select value={filter} onChange={event => setFilter(event.target.value)}><option>ALL</option><option>THIRTY_DAY</option><option>FIFTEEN_DAY</option><option>SEVEN_DAY</option><option>OVERDUE</option></select><button className="icon-button" type="button" onClick={load} disabled={isLoading} aria-label="Refresh dead-letter queue" title={isLoading ? "Refreshing..." : "Refresh"}><RefreshCw className={isLoading ? "refreshing" : ""} size={16} /></button></>} />{error && <ErrorMessage message={error} />}{filtered.length === 0 ? isLoading ? <div className="empty"><b>Loading queue...</b></div> : <Empty title="Queue is clear" /> : <div className="table"><div className="tr th"><span>Policy</span><span>Tier</span><span>Channel</span><span>Retry</span><span>Error</span><span>Moved at</span><span /></div>{filtered.map(item => <div className="tr" key={item.id}><b>{item.policyNumber}</b><span>{item.tier}</span><span>{item.channel}</span><span>{item.retryCount}</span><span className="pill red">{item.lastError}</span><span>{item.movedAt?.replace("T", " ")}</span><button className="link" onClick={() => requeue(item.id)}>Requeue</button></div>)}</div>}</section>;
}
