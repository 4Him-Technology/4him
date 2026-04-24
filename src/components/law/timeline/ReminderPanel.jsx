import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Bell, Plus, Trash2, CheckCircle2, Circle, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import moment from "moment";

const TYPE_COLORS = {
  "Audiência":  "bg-purple-100 text-purple-700",
  "Prazo":      "bg-red-100 text-red-700",
  "Reunião":    "bg-indigo-100 text-indigo-700",
  "Diligência": "bg-emerald-100 text-emerald-700",
  "Recurso":    "bg-amber-100 text-amber-700",
  "Outro":      "bg-muted text-muted-foreground",
};

export default function ReminderPanel({ cases, reminders, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", reminder_date: "", type: "Audiência", notes: "",
    case_id: "", reminder_days_before: 3,
  });
  const [saving, setSaving] = useState(false);

  function setField(key, val) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  // When a case is selected, prefill title and date
  function handleCaseSelect(caseId) {
    const c = cases.find(x => x.id === caseId);
    if (!c) { setField("case_id", ""); return; }
    const days = form.reminder_days_before || 3;
    const reminderDate = moment(c.date).subtract(days, "days").format("YYYY-MM-DD");
    setForm(prev => ({
      ...prev,
      case_id: caseId,
      title: `${c.type}: ${c.client_name}`,
      type: c.type === "Ação" ? "Outro" : c.type,
      reminder_date: reminderDate,
    }));
  }

  async function handleSave() {
    if (!form.title || !form.reminder_date || !form.type) return;
    setSaving(true);
    const c = cases.find(x => x.id === form.case_id);
    await base44.entities.CaseReminder.create({
      ...form,
      client_name: c?.client_name || "",
      case_ref: c ? (c.case_number || `${c.type} — ${c.client_name}`) : "",
      is_done: false,
      email_sent: false,
    });
    setForm({ title: "", reminder_date: "", type: "Audiência", notes: "", case_id: "", reminder_days_before: 3 });
    setShowForm(false);
    setSaving(false);
    onRefresh();
  }

  async function toggleDone(r) {
    await base44.entities.CaseReminder.update(r.id, { is_done: !r.is_done });
    onRefresh();
  }

  async function handleDelete(id) {
    await base44.entities.CaseReminder.delete(id);
    onRefresh();
  }

  const today = moment().format("YYYY-MM-DD");
  const upcoming = reminders.filter(r => !r.is_done && r.reminder_date >= today).sort((a, b) => a.reminder_date.localeCompare(b.reminder_date));
  const overdue  = reminders.filter(r => !r.is_done && r.reminder_date < today).sort((a, b) => a.reminder_date.localeCompare(b.reminder_date));
  const done     = reminders.filter(r => r.is_done).sort((a, b) => b.reminder_date.localeCompare(a.reminder_date)).slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-600" />
            <h2 className="font-semibold text-foreground">Lembretes</h2>
            {overdue.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {overdue.length}
              </span>
            )}
          </div>
          <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-3.5 h-3.5" /> Novo
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="px-5 py-4 border-b border-border bg-muted/20 space-y-3">
            <p className="text-xs font-semibold text-foreground">Novo Lembrete</p>

            {/* Case selector */}
            <Select value={form.case_id} onValueChange={handleCaseSelect}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Vincular a um processo (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {cases.slice(0, 100).map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.client_name} — {c.type} ({moment(c.date).format("DD/MM/YY")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Título do lembrete *"
              value={form.title}
              onChange={e => setField("title", e.target.value)}
              className="h-8 text-sm"
            />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block">Data do lembrete *</label>
                <Input type="date" value={form.reminder_date} onChange={e => setField("reminder_date", e.target.value)} className="h-8 text-sm" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground mb-1 block">Tipo</label>
                <Select value={form.type} onValueChange={v => setField("type", v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Audiência", "Prazo", "Reunião", "Diligência", "Recurso", "Outro"].map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Textarea
              placeholder="Observações (opcional)"
              value={form.notes}
              onChange={e => setField("notes", e.target.value)}
              className="min-h-[60px] text-sm resize-none"
            />

            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button size="sm" className="h-7 text-xs gap-1" onClick={handleSave} disabled={saving || !form.title || !form.reminder_date}>
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        )}

        {/* Overdue */}
        {overdue.length > 0 && (
          <div>
            <div className="px-5 py-2 bg-red-50/60">
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-wide">Vencidos</p>
            </div>
            <ReminderList items={overdue} onToggle={toggleDone} onDelete={handleDelete} overdue />
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div>
            <div className="px-5 py-2 bg-muted/20 border-t border-border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Próximos</p>
            </div>
            <ReminderList items={upcoming} onToggle={toggleDone} onDelete={handleDelete} />
          </div>
        )}

        {/* Done */}
        {done.length > 0 && (
          <div>
            <div className="px-5 py-2 bg-muted/10 border-t border-border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Concluídos</p>
            </div>
            <ReminderList items={done} onToggle={toggleDone} onDelete={handleDelete} faded />
          </div>
        )}

        {reminders.length === 0 && !showForm && (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">Nenhum lembrete criado</p>
            <p className="text-xs text-muted-foreground mt-1">Clique em "+ Novo" ou use os cliques na lista</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReminderList({ items, onToggle, onDelete, overdue, faded }) {
  const TYPE_COLORS = {
    "Audiência":  "bg-purple-100 text-purple-700",
    "Prazo":      "bg-red-100 text-red-700",
    "Reunião":    "bg-indigo-100 text-indigo-700",
    "Diligência": "bg-emerald-100 text-emerald-700",
    "Recurso":    "bg-amber-100 text-amber-700",
    "Outro":      "bg-muted text-muted-foreground",
  };

  return (
    <div className="divide-y divide-border">
      {items.map(r => (
        <div key={r.id} className={`flex items-start gap-3 px-5 py-3 group hover:bg-muted/20 transition-colors ${faded ? "opacity-50" : ""}`}>
          <button onClick={() => onToggle(r)} className="mt-0.5 shrink-0">
            {r.is_done
              ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              : <Circle className={`w-4 h-4 ${overdue ? "text-red-400" : "text-muted-foreground"}`} />
            }
          </button>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-medium leading-snug ${r.is_done ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {r.title}
            </p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className={`text-[10px] font-semibold ${overdue ? "text-red-500" : "text-muted-foreground"}`}>
                {moment(r.reminder_date).format("DD/MM/YY")}
              </span>
              {r.type && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${TYPE_COLORS[r.type] || "bg-muted text-muted-foreground"}`}>
                  {r.type}
                </span>
              )}
              {r.client_name && <span className="text-[10px] text-muted-foreground truncate">{r.client_name}</span>}
            </div>
            {r.notes && <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 italic">{r.notes}</p>}
          </div>
          <button
            onClick={() => onDelete(r.id)}
            className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}