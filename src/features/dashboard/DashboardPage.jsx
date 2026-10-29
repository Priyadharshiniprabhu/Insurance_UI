import { useEffect, useState } from "react";
import { BarChart3, Bell, CheckCircle2, ChevronRight, Clock3, FilePlus2, FileText, RefreshCw, Search, Users } from "lucide-react";
import { api } from "../../services/api";
import { PanelTitle, Unavailable } from "../../components/Ui";

export default function DashboardPage({ onNavigate }) {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  async function load() {
    setIsLoading(true);
    try {
      setError("");
      setSummary(await api("/dashboard/summary", { cache: "no-store" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  const cards = [["Total policies", summary?.totalPolicies, Users, "total"], ["ACTIVE", summary?.active, CheckCircle2, "active"], ["RENEWED", summary?.renewed, RefreshCw, "renewed"], ["OVER_DUE", summary?.overDue ?? summary?.overdue, Clock3, "overdue"]];
  const latestNotificationCounts = getLatestNotificationCounts(summary);
  const notificationCounts = latestNotificationCounts || getSummaryNotificationCounts(summary);
  return <section className="stack">
    <div className="welcome"><div><small className="kicker mint">Operations overview</small><h2>RenewX</h2><p>Monitor lifecycle status, renewal movement, and notification exceptions.</p></div><button className="outline-button" type="button" onClick={load} disabled={isLoading}><RefreshCw className={isLoading ? "refreshing" : ""} size={15} />{isLoading ? "Refreshing..." : "Refresh"}</button></div>
    {error && <Unavailable message={`Dashboard counts are unavailable: ${error}`} />}
    <div className="stats">{cards.map(([label, value, Icon, kind]) => <div className="stat" key={label}><span className={`stat-icon ${kind}`}><Icon size={18} /></span><small>{label}</small><strong>{value ?? "—"}</strong><em>Current count</em></div>)}</div>
    <div className="split">
      <article className="panel"><PanelTitle icon={BarChart3} title="Renewal funnel" action="Daily report" onAction={() => onNavigate("reports")} /><div className="funnel"><FunnelStep label="30 days" value={summary?.funnel?.thirtyDay} /><ChevronRight /><FunnelStep label="15 days" value={summary?.funnel?.fifteenDay} /><ChevronRight /><FunnelStep label="7 days" value={summary?.funnel?.sevenDay} /><ChevronRight /><FunnelStep label="Renewed" value={summary?.funnel?.renewed} /></div></article>
      <article className="panel"><PanelTitle icon={Bell} title="Notification outcomes" action="Dead letters" onAction={() => onNavigate("dlq")} />{notificationCounts ? <><div className="outcomes">{Object.entries(notificationCounts).map(([label, value]) => <Outcome key={label} label={label} value={value} color={label === "sent" ? "green" : label === "failed" || label === "invalidContact" ? "yellow" : "dark"} />)}</div>{!latestNotificationCounts && <p className="subtext">Showing available API totals. Per-policy latest counts are not provided by the backend.</p>}</> : <p className="subtext">Notification counts are unavailable.</p>}</article>
    </div>
    <div className="quick-grid"><button onClick={() => onNavigate("create")}><FilePlus2 size={18} /><span><b>Create policy</b><small>Start a new policy lifecycle</small></span><ChevronRight size={16} /></button><button onClick={() => onNavigate("policies")}><Search size={18} /><span><b>Find policy</b><small>View details and reminders</small></span><ChevronRight size={16} /></button><button onClick={() => onNavigate("reports")}><FileText size={18} /><span><b>Open daily reports</b><small>Review funnel report output</small></span><ChevronRight size={16} /></button></div>
  </section>;
}
function FunnelStep({ label, value }) { return <div className="funnel-step"><strong>{value ?? "—"}</strong><small>{label}</small></div>; }
function Outcome({ label, value, color }) { const labels = { sent: "Sent", failed: "Failed", invalidContact: "Invalid contact", deadLetters: "Dead letters" }; return <div><span className={`legend ${color}`} /><span>{labels[label] || label}</span><b>{value}</b></div>; }

function getSummaryNotificationCounts(summary) {
  const notifications = summary?.notifications;
  if (!notifications) return null;
  return {
    sent: notifications.sent ?? 0,
    failed: notifications.failed ?? 0,
    invalidContact: notifications.invalidContact ?? 0,
    deadLetters: notifications.deadLetters ?? 0
  };
}

function getLatestNotificationCounts(summary) {
  const latestByPolicy = summary?.notifications?.latestByPolicy;
  if (!Array.isArray(latestByPolicy)) return null;

  const latestEvents = new Map();
  latestByPolicy.forEach(event => {
    const policyNumber = event.policyNumber;
    if (!policyNumber) return;
    const previous = latestEvents.get(policyNumber);
    const eventTime = Date.parse(event.eventTime || "");
    const previousTime = Date.parse(previous?.eventTime || "");
    if (!previous || (Number.isFinite(eventTime) && (!Number.isFinite(previousTime) || eventTime >= previousTime))) {
      latestEvents.set(policyNumber, event);
    }
  });

  const counts = { sent: 0, failed: 0, invalidContact: 0, deadLetters: 0 };
  latestEvents.forEach(event => {
    const outcome = String(event.status || event.outcome || "").toUpperCase();
    if (event.inDeadLetterQueue || ["DLQ", "DEAD_LETTER", "DEAD_LETTER_QUEUE"].includes(outcome)) {
      counts.deadLetters += 1;
    } else if (outcome === "SENT") {
      counts.sent += 1;
    } else if (outcome === "INVALID_CONTACT" || String(event.reason || "").toUpperCase() === "INVALID_CONTACT") {
      counts.invalidContact += 1;
    } else if (outcome) {
      counts.failed += 1;
    }
  });
  return counts;
}
