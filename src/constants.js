import { Bell, FilePlus2, FileText, LayoutDashboard, Settings2, Users } from "lucide-react";

export const NAVIGATION = [
  ["dashboard", "Dashboard", LayoutDashboard],
  ["policies", "Policies", Users],
  ["create", "New policy", FilePlus2],
  ["dlq", "Dead letters", Bell],
  ["reports", "Daily reports", FileText],
  ["schedulers", "Schedulers", Settings2]
];
