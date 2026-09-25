import { AlertCircle, ChevronRight, ShieldCheck, XCircle } from "lucide-react";

export function PanelTitle({ icon: Icon, title, action, onAction }) {
  return <div className="panel-title"><div>{Icon && <Icon size={18} />}<h2>{title}</h2></div>{action && (typeof action === "string" ? <button className="text-link" onClick={onAction}>{action} <ChevronRight size={14} /></button> : action)}</div>;
}
export function ErrorMessage({ message }) { return <div className="error"><AlertCircle size={16} />{message}</div>; }
export function Unavailable({ message }) { return <div className="unavailable"><XCircle size={18} /><span>{message}</span></div>; }
export function Empty({ title }) { return <div className="empty"><ShieldCheck size={24} /><b>{title}</b><small>No records to display.</small></div>; }
export function Status({ value }) { return <span className={`status ${value?.toLowerCase()}`}>{value}</span>; }
