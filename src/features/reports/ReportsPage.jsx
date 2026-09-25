import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { api } from "../../services/api";
import { ErrorMessage, Unavailable } from "../../components/Ui";

export default function ReportsPage({ onNotify }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); const [error, setError] = useState("");
  async function run() { try { await api(`/reports/daily?date=${date}`, { method: "POST" }); onNotify("success", "Report generation requested."); } catch (exception) { setError(exception.message); } }
  return <section className="stack"><div className="panel report-banner"><div><small className="kicker">Daily reporting</small><h2>Funnel report viewer</h2><p>Choose a date to request or download the daily report.</p></div><div className="report-actions"><input type="date" value={date} onChange={event => setDate(event.target.value)} /><button onClick={run}>Run report <BarChart3 size={15} /></button></div></div>{error && <ErrorMessage message={`${error}. The current backend does not expose report REST endpoints; reports are currently written as CSV files by the scheduler.`} />}<Unavailable message="Report viewing, CSV download, funnel charts, and manual generation require report REST endpoints. The existing backend writes CSV files to its local reports directory only." /></section>;
}
