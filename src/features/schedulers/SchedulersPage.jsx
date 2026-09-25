import { Settings2 } from "lucide-react";
import { PanelTitle, Unavailable } from "../../components/Ui";

export default function SchedulersPage() {
  return <section className="stack"><div className="panel"><PanelTitle title="Scheduler configuration" icon={Settings2} /><p className="subtext">The existing backend stores scheduler configuration in the database but does not expose a REST API for this screen.</p><div className="scheduler-list">{[["DailyReportJobSchedular", "Daily report"], ["RenewalDetectionJobSchedular", "Renewal detection"], ["PolicyLapseJobSchedular", "Policy lapse"]].map(([name, label]) => <div key={name}><span><b>{label}</b><small>{name}</small></span><code>Backend API required</code></div>)}</div></div><Unavailable message="Last-run, next-run, edit, and manual-run controls require scheduler REST endpoints." /></section>;
}
