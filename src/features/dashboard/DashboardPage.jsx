import { useEffect, useState } from "react";
import { BarChart3, Bell, CheckCircle2, ChevronRight, Clock3, FilePlus2, FileText, RefreshCw, Search, Users } from "lucide-react";
import { api } from "../../services/api";
import { PanelTitle, Unavailable } from "../../components/Ui";

export default function DashboardPage({ onNavigate }) {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  async function load() {
    try {
      setError("");
      setSummary(await api("/dashboard/summary"));
    } catch (err) {
      setError(err.message);
    }
  }
  useEffect(() => {
    load();
  }, []);
  const cards = [["Total policies", summary?.totalPolicies, Users, "total"], ["ACTIVE", summary?.active, CheckCircle2, "active"], ["RENEWED", summary?.renewed, RefreshCw, "renewed"], ["OVER_DUE", summary?.overDue ?? summary?.overdue, Clock3, "overdue"]];
  return <section className="stack">
    <div className="welcome"><div><small className="kicker mint">Operations overview</small><h2>Policy health at a glance</h2><p>Monitor lifecycle status, renewal movement, and notification exceptions.</p></div><button className="outline-button" onClick={load}><RefreshCw size={15} /> Refresh</button></div>
    {error && <Unavailable message={`Dashboard counts are unavailable: ${error}`} />}
    <div className="stats">{cards.map(([label, value, Icon, kind]) => <div className="stat" key={label}><span className={`stat-icon ${kind}`}><Icon size={18} /></span><small>{label}</small><strong>{value ?? "—"}</strong><em>Current count</em></div>)}</div>
    <div className="split">
      <article className="panel"><PanelTitle icon={BarChart3} title="Renewal funnel" action="Daily report" onAction={() => onNavigate("reports")} /><div className="funnel"><FunnelStep label="30 days" value={summary?.funnel?.thirtyDay} /><ChevronRight /><FunnelStep label="15 days" value={summary?.funnel?.fifteenDay} /><ChevronRight /><FunnelStep label="7 days" value={summary?.funnel?.sevenDay} /><ChevronRight /><FunnelStep label="Renewed" value={summary?.funnel?.renewed} /></div></article>
      <article className="panel"><PanelTitle icon={Bell} title="Notification outcomes" action="Dead letters" onAction={() => onNavigate("dlq")} /><div className="outcomes"><Outcome label="Sent" value={summary?.notifications?.sent} color="green" /><Outcome label="Failed" value={summary?.notifications?.failed} color="yellow" /><Outcome label="Invalid contact" value={summary?.notifications?.invalidContact} color="red" /><Outcome label="Dead letters" value={summary?.notifications?.deadLetters} color="dark" /></div></article>
    </div>
    <div className="quick-grid"><button onClick={() => onNavigate("create")}><FilePlus2 size={18} /><span><b>Create policy</b><small>Start a new policy lifecycle</small></span><ChevronRight size={16} /></button><button onClick={() => onNavigate("policies")}><Search size={18} /><span><b>Find policy</b><small>View details and reminders</small></span><ChevronRight size={16} /></button><button onClick={() => onNavigate("reports")}><FileText size={18} /><span><b>Open daily reports</b><small>Review funnel report output</small></span><ChevronRight size={16} /></button></div>
  </section>;
}
function FunnelStep({ label, value }) { return <div className="funnel-step"><strong>{value ?? "—"}</strong><small>{label}</small></div>; }
function Outcome({ label, value, color }) { return <div><span className={`legend ${color}`} /><span>{label}</span><b>{value ?? "—"}</b></div>; }
