import { Settings2 } from "lucide-react";
import { PanelTitle } from "../../components/Ui";
import SchedulerEditor from "./SchedulerEditor";

export default function SchedulersPage() {
  return <section className="stack"><div className="panel"><PanelTitle title="Scheduler configuration" icon={Settings2} /><p className="subtext">Edit cron schedules and save them to the backend scheduler configuration.</p><SchedulerEditor /></div></section>;
}
