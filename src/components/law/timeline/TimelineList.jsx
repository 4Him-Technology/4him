import moment from "moment";
import { Bell, BellOff, CheckCircle2, Clock, AlertTriangle, Calendar } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useState } from "react";

const TYPE_COLOR = {
  "Ação":       { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500" },
  "Audiência":  { bg: "bg-purple-100",  text: "text-purple-700",  dot: "bg-purple-500" },
  "Recurso":    { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-500" },
  "Consulta":   { bg: "bg-teal-100",    text: "text-teal-700",    dot: "bg-teal-500" },
  "Reunião":    { bg: "bg-indigo-100",  text: "text-indigo-700",  dot: "bg-indigo-500" },
  "Prazo":      { bg: "bg-red-100",     text: "text-red-700",     dot: "bg-red-500" },
  "Diligência": { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
};

function getStatusIcon(c) {
  const today = moment().format("YYYY-MM-DD");
  if (c.status === "Realizado" || c.status === "Encerrado") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (c.status === "Cancelado") return <BellOff className="w-4 h-4 text-gray-400" />;
  if (c.date < today) return <AlertTriangle className="w-4 h-4 text-red-500" />;
  const daysUntil = moment(c.date).diff(moment(), "days");
  if (daysUntil <= 3) return <Clock className="w-4 h-4 text-amber-500" />;
  return <Calendar className="w-4 h-4 text-blue-500" />;
}

function getDaysLabel(date) {
  const today = moment();
  const d = moment(date);
  const diff = d.diff(today, "days");
  if (diff === 0) return { label: "Hoje", color: "text-amber-600 font-bold" };
  if (diff === 1) return { label: "Amanhã", color: "text-amber-500 font-semibold" };
  if (diff < 0) return { label: `${Math.abs(diff)}d atrás`, color: "text-red-500 font-semibold" };
  if (diff <= 7) return { label: `Em ${diff}d`, color: "text-blue-600 font-medium" };
  return { label: `Em ${diff}d`, color: "text-muted-foreground" };
}

// Group by month
function groupByMonth(cases) {
  const groups = {};
  [...cases].sort((a, b) => a.date?.localeCompare(b.date)).forEach(c => {
    const key = moment(c.date).format("YYYY-MM");
    if (!groups[key]) groups[key] = [];
    groups[key].push(c);
  });
  return groups;
}

export default function TimelineList({ cases, reminders, onRefresh }) {
  const [addingReminder, setAddingReminder] = useState(null);
  const [reminderDays, setReminderDays] = useState("3");

  const reminderCaseIds = new Set(reminders.map(r => r.case_id));

  async function handleAddReminder(c) {
    const days = parseInt(reminderDays) || 3;
    const reminderDate = moment(c.date).subtract(days, "days").format("YYYY-MM-DD");
    await base44.entities.CaseReminder.create({
      case_id: c.id,
      case_ref: c.case_number || `${c.type} — ${c.client_name}`,
      client_name: c.client_name,
      title: `${c.type}: ${c.client_name}`,
      reminder_date: reminderDate,
      reminder_days_before: days,
      type: c.type,
      notes: c.notes || "",
      is_done: false,
      email_sent: false,
    });
    setAddingReminder(null);
    onRefresh();
  }

  const groups = groupByMonth(cases);
  const today = moment().format("YYYY-MM-DD");

  if (cases.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl flex flex-col items-center justify-center py-20 gap-3 text-center">
        <Calendar className="w-10 h-10 text-muted-foreground/40" />
        <p className="font-medium text-foreground">Nenhum processo encontrado</p>
        <p className="text-sm text-muted-foreground">Ajuste os filtros ou cadastre novos processos</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Cronologia de Processos</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{cases.length} registro{cases.length > 1 ? "s" : ""}</p>
      </div>

      <div className="divide-y divide-border max-h-[640px] overflow-y-auto">
        {Object.entries(groups).map(([monthKey, items]) => (
          <div key={monthKey}>
            {/* Month header */}
            <div className="px-5 py-2 bg-muted/30 sticky top-0 z-10">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {moment(monthKey, "YYYY-MM").format("MMMM [de] YYYY")}
              </p>
            </div>

            {/* Items */}
            {items.map((c, idx) => {
              const colors = TYPE_COLOR[c.type] || { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-gray-400" };
              const { label: daysLabel, color: daysColor } = getDaysLabel(c.date);
              const isOverdue = c.date < today && c.status !== "Realizado" && c.status !== "Cancelado" && c.status !== "Encerrado";
              const hasReminder = reminderCaseIds.has(c.id);

              return (
                <div key={c.id} className={`flex gap-4 px-5 py-4 hover:bg-muted/20 transition-colors ${isOverdue ? "bg-red-50/40" : ""}`}>
                  {/* Timeline line */}
                  <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                    <div className={`w-3 h-3 rounded-full border-2 border-background ${colors.dot}`} />
                    {idx < items.length - 1 && <div className="w-px flex-1 min-h-[20px] bg-border" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-2">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusIcon(c)}
                        <span className="text-sm font-semibold text-foreground">{c.client_name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                          {c.type}
                        </span>
                        {isOverdue && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">VENCIDO</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs ${daysColor}`}>{daysLabel}</span>
                        {/* Reminder button */}
                        {!hasReminder ? (
                          addingReminder === c.id ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-muted-foreground">Avisar</span>
                              <select
                                value={reminderDays}
                                onChange={e => setReminderDays(e.target.value)}
                                className="text-xs border border-border rounded px-1.5 py-0.5 bg-background"
                              >
                                <option value="1">1d antes</option>
                                <option value="3">3d antes</option>
                                <option value="7">7d antes</option>
                                <option value="15">15d antes</option>
                                <option value="30">30d antes</option>
                              </select>
                              <button
                                onClick={() => handleAddReminder(c)}
                                className="text-[10px] bg-amber-700 text-white px-2 py-0.5 rounded font-medium hover:bg-amber-800 transition-colors"
                              >
                                OK
                              </button>
                              <button onClick={() => setAddingReminder(null)} className="text-[10px] text-muted-foreground hover:text-foreground">✕</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setAddingReminder(c.id)}
                              title="Criar lembrete"
                              className="p-1 rounded-md text-muted-foreground hover:text-amber-700 hover:bg-amber-50 transition-colors"
                            >
                              <Bell className="w-3.5 h-3.5" />
                            </button>
                          )
                        ) : (
                          <span title="Lembrete ativo" className="p-1 text-amber-600">
                            <Bell className="w-3.5 h-3.5 fill-amber-400" />
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
                      <span className="text-xs text-foreground font-medium">
                        {moment(c.date).format("DD/MM/YYYY")}{c.time && ` às ${c.time}`}
                      </span>
                      {c.case_number && <span className="text-xs text-muted-foreground font-mono">{c.case_number}</span>}
                      {c.area && <span className="text-xs text-muted-foreground">{c.area}</span>}
                      {c.court && <span className="text-xs text-muted-foreground">{c.court}</span>}
                    </div>

                    {c.notes && (
                      <p className="mt-1.5 text-xs text-muted-foreground italic line-clamp-2">{c.notes}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}