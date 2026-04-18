import { MessageCircle, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeadsStats({ meta }) {
  if (!meta) return null;

  const stats = [
    { label: "Total",         value: meta.all_count ?? 0,        icon: MessageCircle, color: "text-blue-600",   bg: "bg-blue-50 border-blue-200" },
    { label: "Não atribuído", value: meta.unassigned_count ?? 0, icon: AlertCircle,   color: "text-amber-600",  bg: "bg-amber-50 border-amber-200" },
    { label: "Atribuído",     value: meta.assigned_count ?? 0,   icon: Clock,         color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200" },
    { label: "Meus",          value: meta.mine_count ?? 0,       icon: CheckCircle,   color: "text-green-600",  bg: "bg-green-50 border-green-200" },
  ];

  return (
    <div className="flex gap-3 flex-wrap">
      {stats.map(s => (
        <div key={s.label} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold", s.bg)}>
          <s.icon className={cn("w-3.5 h-3.5", s.color)} />
          <span className={s.color}>{s.label}: {s.value}</span>
        </div>
      ))}
    </div>
  );
}