import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { ErrorMessage } from "../../components/Ui";

export default function ReportsPage({ onNotify }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  async function run() {
    setError("");
    setIsGenerating(true);
    try {
      const response = await fetch(`/reports/daily?date=${encodeURIComponent(date)}`, {
        method: "POST"
      });

      if (!response.ok) {
        const body = await response.text();
        let message = body;
        try {
          const errorData = JSON.parse(body);
          message = errorData.message || errorData.error || body;
        } catch {
          // Keep the backend response text for non-JSON errors.
        }
        throw new Error(message || `${response.status} ${response.statusText}`);
      }

      const report = await response.blob();
      const url = URL.createObjectURL(report);
      const link = document.createElement("a");
      link.href = url;
      link.download = `daily-report-${date}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      onNotify("success", "Daily report generated and downloaded.");
    } catch (exception) {
      setError(exception.message);
    } finally {
      setIsGenerating(false);
    }
  }

  return <section className="stack"><div className="panel report-banner"><div><small className="kicker">Daily reporting</small><h2>Funnel report viewer</h2><p>Generate and download the scheduled-format CSV report for the selected date.</p></div><div className="report-actions"><input type="date" value={date} onChange={event => setDate(event.target.value)} aria-label="Report date" /><button onClick={run} disabled={isGenerating || !date}>{isGenerating ? "Generating..." : "Run report"} <BarChart3 size={15} /></button></div></div>{error && <ErrorMessage message={`Unable to generate report: ${error}`} />}</section>;
}
