import { ShieldCheck } from "lucide-react";
import { NAVIGATION } from "../constants";

export default function AppLayout({ activeView, title, onNavigate, children }) {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon"><ShieldCheck size={22} /></span>
          <span><b>Coverline</b><small>Insurance operations</small></span>
        </div>
        <nav>
          {NAVIGATION.map(([id, label, Icon]) => (
            <button className={activeView === id ? "nav active" : "nav"} key={id} onClick={() => onNavigate(id)}>
              <Icon size={17} />{label}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot"><span className="live-dot" /> Backend proxy · localhost:8080</div>
      </aside>
      <main className="content">
        <header className="topbar">
          <div><small className="kicker">Policy operations</small><h1>{title}</h1></div>
          <span className="date">{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
        </header>
        {children}
      </main>
    </div>
  );
}
