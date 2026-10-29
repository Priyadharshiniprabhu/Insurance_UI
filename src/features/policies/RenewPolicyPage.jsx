import { useState } from "react";
import { Clock3, RefreshCw, Search } from "lucide-react";
import { api } from "../../services/api";
import { Empty, ErrorMessage, PanelTitle, Status } from "../../components/Ui";

export default function RenewPolicyPage({ onNotify }) {
  const [number, setNumber] = useState("");
  const [policy, setPolicy] = useState(null);
  const [renewDate, setRenewDate] = useState("");
  const [error, setError] = useState("");
  const [isRenewing, setIsRenewing] = useState(false);

  async function search(event) {
    event.preventDefault();
    try {
      setError("");
      setPolicy(await api(`/policies/${encodeURIComponent(number.trim())}`));
    } catch (exception) {
      setPolicy(null);
      setError(exception.message);
    }
  }

  async function renew(event) {
    event.preventDefault();
    setIsRenewing(true);
    try {
      await api(`/policies/${encodeURIComponent(policy.policyNumber)}/renew`, {
        method: "PUT",
        body: JSON.stringify({ endDate: renewDate })
      });
      setPolicy(await api(`/policies/${encodeURIComponent(policy.policyNumber)}`));
      setRenewDate("");
      onNotify("success", "Policy renewed successfully.");
    } catch (exception) {
      setError(exception.message);
    } finally {
      setIsRenewing(false);
    }
  }

  return <section className="stack">
    <article className="panel">
      <PanelTitle title="Renew a policy" icon={RefreshCw} />
      <p className="subtext">Enter a policy number to view its renewal details and continue.</p>
      <form className="searchbar" onSubmit={search}>
        <Search size={18} />
        <input value={number} onChange={event => setNumber(event.target.value)} placeholder="Enter policy number to renew" required />
        <button type="submit">Renew policy</button>
      </form>
    </article>
    {error && <ErrorMessage message={error} />}
    {policy && <div className="split">
      <article className="panel">
        <div className="panel-head"><div><small className="muted">Policy number</small><h2>{policy.policyNumber}</h2></div><Status value={policy.status} /></div>
        <div className="details">{[["Holder", policy.holderName], ["Email", policy.email], ["Phone", policy.phone], ["Type", policy.policyType], ["Premium", `₹${Number(policy.premiumAmount).toLocaleString("en-IN")}`], ["End date", policy.endDate]].map(([label, value]) => <div key={label}><small>{label}</small><b>{value || "—"}</b></div>)}</div>
        {["EXPIRED", "RENEWAL_DUE"].includes(policy.status) && <form className="renew" onSubmit={renew}>
          <b>Renew policy</b>
          <input type="date" value={renewDate} onChange={event => setRenewDate(event.target.value)} required />
          <button type="submit" disabled={isRenewing}>{isRenewing ? "Renewing..." : "Renew policy"} <RefreshCw size={15} /></button>
        </form>}
      </article>
      <article className="panel">
        <PanelTitle title="Reminder timeline" icon={Clock3} />
        <div className="timeline">{policy.reminderHistory?.length ? policy.reminderHistory.map(item => <div className="timeline-row" key={`${item.eventId}-${item.eventTime}`}>
          <span className={`timeline-outcome ${getOutcomeClass(item.outcome)}`} />
          <div><b>{item.tier}</b><small className={`timeline-outcome-text ${getOutcomeClass(item.outcome)}`}>{item.channel} · {item.outcome}</small></div>
          <time>{item.eventTime?.replace("T", " ")}</time>
        </div>) : <Empty title="No reminders yet" />}</div>
      </article>
    </div>}
  </section>;
}

function getOutcomeClass(outcome) {
  const normalizedOutcome = String(outcome || "").toUpperCase();
  if (normalizedOutcome === "SENT") return "success";
  if (normalizedOutcome === "FAILED" || normalizedOutcome.endsWith("_TIMEOUT") || normalizedOutcome.endsWith("_ERROR") || normalizedOutcome === "INVALID_CONTACT") return "failure";
  return "unknown";
}
