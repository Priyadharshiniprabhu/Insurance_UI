import { Bell, FilePlus2, FileText, LayoutDashboard, RefreshCw, Settings2, Users } from "lucide-react";

export const NAVIGATION = [
  ["dashboard", "Dashboard", LayoutDashboard],
  ["policies", "Policies", Users],
  ["renew", "Renew policies", RefreshCw],
  ["create", "New policy", FilePlus2],
  ["dlq", "Dead letters", Bell],
  ["reports", "Daily reports", FileText],
  ["schedulers", "Schedulers", Settings2]
];
