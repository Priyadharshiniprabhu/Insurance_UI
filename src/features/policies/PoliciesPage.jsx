import { useState } from "react";
import { ChevronRight, Clock3, Search } from "lucide-react";
import { api } from "../../services/api";
import { Empty, ErrorMessage, PanelTitle, Status } from "../../components/Ui";

export default function PoliciesPage({ onNavigate }) {
  const [number, setNumber] = useState(""); const [policy, setPolicy] = useState(null); const [error, setError] = useState("");
  async function search(event) { event.preventDefault(); try { setError(""); setPolicy(await api(`/policies/${encodeURIComponent(number.trim())}`)); } catch (exception) { setPolicy(null); setError(exception.message); } }
  return <section className="stack"><form className="searchbar" onSubmit={search}><Search size={18} /><input value={number} onChange={event => setNumber(event.target.value)} placeholder="Search policy number, e.g. POL123456" required /><button>Search</button></form>{error && <ErrorMessage message={error} />}{policy && <PolicyDetails policy={policy} />}<button className="text-link" onClick={() => onNavigate("create")}>Need a new policy? Create one <ChevronRight size={14} /></button></section>;
}

function PolicyDetails({ policy }) {
  const [renewDate, setRenewDate] = useState(""); const [message, setMessage] = useState("");
  async function renew(event) { event.preventDefault(); try { await api(`/policies/${policy.policyNumber}/renew`, { method: "PUT", body: JSON.stringify({ endDate: renewDate }) }); setMessage("Policy renewed successfully."); } catch (exception) { setMessage(exception.message); } }
  return <div className="split"><article className="panel"><div className="panel-head"><div><small className="muted">Policy number</small><h2>{policy.policyNumber}</h2></div><Status value={policy.status} /></div><div className="details">{[["Holder", policy.holderName], ["Email", policy.email], ["Phone", policy.phone], ["Type", policy.policyType], ["Premium", `₹${Number(policy.premiumAmount).toLocaleString("en-IN")}`], ["End date", policy.endDate]].map(([label, value]) => <div key={label}><small>{label}</small><b>{value || "—"}</b></div>)}</div>{["EXPIRED", "RENEWAL_DUE"].includes(policy.status) && <form className="renew" onSubmit={renew}><b>Renew policy</b><input type="date" value={renewDate} onChange={event => setRenewDate(event.target.value)} required /><button>Renew</button></form>}{message && <div className="info">{message}</div>}</article><article className="panel"><PanelTitle title="Reminder timeline" icon={Clock3} /><div className="timeline">{policy.reminderHistory?.length ? policy.reminderHistory.map(item => { const outcomeClass = getOutcomeClass(item.outcome); return <div className="timeline-row" key={item.eventId}><span className={`timeline-outcome ${outcomeClass}`} /><div><b>{item.tier}</b><small className={`timeline-outcome-text ${outcomeClass}`}>{item.channel} · {item.outcome}</small></div><time>{item.eventTime?.replace("T", " ")}</time></div>; }) : <Empty title="No reminders yet" />}</div></article></div>;
}

function getOutcomeClass(outcome) {
  const normalizedOutcome = String(outcome || "").toUpperCase();
  if (normalizedOutcome === "SENT") return "success";
  if (normalizedOutcome === "FAILED" || normalizedOutcome.endsWith("_TIMEOUT") || normalizedOutcome.endsWith("_ERROR") || normalizedOutcome === "INVALID_CONTACT") return "failure";
  return "unknown";
}
