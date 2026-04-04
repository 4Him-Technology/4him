import { cn } from "@/lib/utils";
import moment from "moment";

const statusColors = {
  "Agendado": "bg-blue-100 text-blue-700",
  "Confirmado": "bg-emerald-100 text-emerald-700",
  "Realizado": "bg-teal-100 text-teal-700",
  "Cancelado": "bg-red-100 text-red-700",
  "Não Compareceu": "bg-amber-100 text-amber-700",
};

export default function RecentAppointments({ appointments }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Próximos Agendamentos</h3>
      <div className="space-y-3">
        {appointments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhum agendamento encontrado</p>
        )}
        {appointments.map((apt) => (
          <div key={apt.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">
                {apt.patient_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{apt.patient_name}</p>
              <p className="text-xs text-muted-foreground">
                {moment(apt.date).format('DD/MM')} às {apt.time} · {apt.type}
              </p>
            </div>
            <span className={cn("text-[10px] font-semibold px-2 py-1 rounded-full", statusColors[apt.status] || "bg-muted text-muted-foreground")}>
              {apt.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}