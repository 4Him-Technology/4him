import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";
import moment from "moment";
import { Calendar, Clock, Tag, Phone, ChevronRight, User, AlertCircle } from "lucide-react";

const COLUMNS = [
  { id: "Agendado",       label: "Agendado",         color: "bg-amber-500",   light: "bg-amber-50 border-amber-200",   text: "text-amber-700" },
  { id: "Confirmado",     label: "Confirmado",        color: "bg-blue-500",    light: "bg-blue-50 border-blue-200",     text: "text-blue-700" },
  { id: "Realizado",      label: "Realizado",         color: "bg-emerald-500", light: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
  { id: "Cancelado",      label: "Cancelado",         color: "bg-red-500",     light: "bg-red-50 border-red-200",       text: "text-red-700" },
  { id: "Não Compareceu", label: "Não Compareceu",    color: "bg-slate-400",   light: "bg-slate-50 border-slate-200",   text: "text-slate-600" },
];

const TYPE_COLORS = {
  "Consulta":    "bg-indigo-100 text-indigo-700",
  "Retorno":     "bg-teal-100 text-teal-700",
  "Exame":       "bg-orange-100 text-orange-700",
  "Urgência":    "bg-red-100 text-red-700",
};

export default function Leads() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [filter, setFilter] = useState("");

  const load = async () => {
    const apts = await base44.entities.Appointment.list("-date", 500);
    setAppointments(apts);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDragStart = (apt) => setDragging(apt);
  const handleDragEnd = () => { setDragging(null); setDragOver(null); };

  const handleDrop = async (colId) => {
    if (!dragging || dragging.status === colId) return;
    await base44.entities.Appointment.update(dragging.id, { status: colId });
    setAppointments(prev => prev.map(a => a.id === dragging.id ? { ...a, status: colId } : a));
    setDragging(null);
    setDragOver(null);
  };

  const filtered = filter
    ? appointments.filter(a =>
        a.patient_name?.toLowerCase().includes(filter.toLowerCase()) ||
        a.insurance?.toLowerCase().includes(filter.toLowerCase()) ||
        a.type?.toLowerCase().includes(filter.toLowerCase())
      )
    : appointments;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">Arraste os atendimentos entre as etapas do funil</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Filtrar por paciente, convênio ou tipo..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="border border-input rounded-lg px-3 py-2 text-sm bg-card w-72 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {COLUMNS.map(col => {
          const count = filtered.filter(a => a.status === col.id).length;
          return (
            <div key={col.id} className={cn("flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border", col.light, col.text)}>
              <span className={cn("w-2 h-2 rounded-full", col.color)} />
              {col.label}: {count}
            </div>
          );
        })}
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto flex-1 pb-4">
        {COLUMNS.map(col => {
          const cards = filtered.filter(a => a.status === col.id).sort((a, b) => a.date?.localeCompare(b.date));
          return (
            <div
              key={col.id}
              className={cn(
                "flex flex-col rounded-xl border min-w-[260px] w-[260px] shrink-0 transition-colors",
                dragOver === col.id ? "ring-2 ring-primary bg-primary/5" : "bg-muted/40"
              )}
              onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => handleDrop(col.id)}
            >
              {/* Column header */}
              <div className={cn("flex items-center justify-between px-4 py-3 rounded-t-xl border-b", col.light)}>
                <div className="flex items-center gap-2">
                  <span className={cn("w-2.5 h-2.5 rounded-full", col.color)} />
                  <span className={cn("text-sm font-bold", col.text)}>{col.label}</span>
                </div>
                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", col.light, col.text)}>{cards.length}</span>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {cards.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-24 text-muted-foreground/50">
                    <AlertCircle className="w-6 h-6 mb-1" />
                    <p className="text-xs">Sem atendimentos</p>
                  </div>
                )}
                {cards.map(apt => (
                  <div
                    key={apt.id}
                    draggable
                    onDragStart={() => handleDragStart(apt)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "bg-card rounded-lg border border-border p-3 cursor-grab shadow-sm hover:shadow-md transition-all select-none",
                      dragging?.id === apt.id && "opacity-40 scale-95"
                    )}
                  >
                    {/* Patient */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">
                            {apt.patient_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground leading-tight">{apt.patient_name}</p>
                          {apt.patient_phone && (
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5" /> {apt.patient_phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {moment(apt.date).format("DD/MM/YY")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {apt.time}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {apt.type && (
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", TYPE_COLORS[apt.type] || "bg-muted text-muted-foreground")}>
                          {apt.type}
                        </span>
                      )}
                      {apt.insurance && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {apt.insurance}
                        </span>
                      )}
                    </div>

                    {/* Notes */}
                    {apt.notes && (
                      <p className="text-[10px] text-muted-foreground mt-2 line-clamp-2 italic">"{apt.notes}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}