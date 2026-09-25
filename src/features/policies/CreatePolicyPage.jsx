import { useState } from "react";
import { ChevronRight, FilePlus2 } from "lucide-react";
import { api } from "../../services/api";
import { ErrorMessage, PanelTitle } from "../../components/Ui";

const INITIAL_FORM = { holderName: "", email: "", phone: "", policyType: "HEALTH", premiumAmount: "", startDate: "", endDate: "" };

export default function CreatePolicyPage({ onNotify }) {
  const [form, setForm] = useState(INITIAL_FORM); const [error, setError] = useState("");
  const update = event => setForm({ ...form, [event.target.name]: event.target.value });
  async function submit(event) { event.preventDefault(); try { await api("/policies", { method: "POST", body: JSON.stringify({ ...form, premiumAmount: Number(form.premiumAmount) }) }); setForm(INITIAL_FORM); onNotify("success", "Policy created successfully."); } catch (exception) { setError(exception.message); } }
  return <section className="panel form-panel"><PanelTitle title="Create a new policy" icon={FilePlus2} /><p className="subtext">Create a policy using the same validation rules as the backend API.</p>{error && <ErrorMessage message={error} />}<form className="form-grid" onSubmit={submit}>{[["holderName", "Holder name", "text"], ["email", "Email", "email"], ["phone", "Phone", "text"], ["premiumAmount", "Premium amount", "number"], ["startDate", "Start date", "date"], ["endDate", "End date", "date"]].map(([name, label, type]) => <label key={name}>{label}<input name={name} type={type} value={form[name]} onChange={update} required /></label>)}<label>Policy type<select name="policyType" value={form.policyType} onChange={update}><option>HEALTH</option><option>LIFE</option><option>VEHICLE</option><option>TRAVEL</option><option>HOME</option></select></label><button type="submit">Create policy <ChevronRight size={15} /></button></form></section>;
}
