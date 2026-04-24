import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { GitBranch, Loader2, Search, LayoutList, BarChart2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import moment from "moment";
import TimelineGantt from "@/components/law/timeline/TimelineGantt";
import TimelineList from "@/components/law/timeline/TimelineList";
import ReminderPanel from "@/components/law/timeline/ReminderPanel";

const VIEWS = [
  { id: "list", label: "Lista Cronológica", icon: LayoutList },
  { id: "gantt", label: "Gráfico Gantt", icon: BarChart2 },
];

export default function LawTimeline() {
  const [cases, setCases] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [selectedClient, setSelectedClient] = useState("all");

  const load = async () => {
    const [cs, rm] = await Promise.all([
      base44.entities.LegalCase.list("-date", 500),
      base44.entities.CaseReminder.list("-reminder_date", 500),
    ]);
    setCases(cs);
    setReminders(rm);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" /> Carregando linha do tempo...
      </div>
    );
  }

  // Unique clients from cases
  const clients = [...new Set(cases.map(c => c.client_name).filter(Boolean))].sort();

  const filteredCases = cases.filter(c => {
    const matchSearch = !search ||
      c.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.case_number?.toLowerCase().includes(search.toLowerCase()) ||
      c.type?.toLowerCase().includes(search.toLowerCase());
    const matchClient = selectedClient === "all" || c.client_name === selectedClient;
    return matchSearch && matchClient;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-700/10 flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Linha do Tempo</h1>
            <p className="text-sm text-muted-foreground">Visualize marcos, audiências e prazos dos processos</p>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {VIEWS.map(v => {
            const Icon = v.icon;
            return (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                  view === v.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{v.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente, processo, tipo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedClient("all")}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              selectedClient === "all"
                ? "bg-amber-700 text-white border-amber-700"
                : "bg-card border-border text-muted-foreground hover:border-amber-400"
            }`}
          >
            Todos
          </button>
          {clients.slice(0, 8).map(cl => (
            <button
              key={cl}
              onClick={() => setSelectedClient(cl === selectedClient ? "all" : cl)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                selectedClient === cl
                  ? "bg-amber-700 text-white border-amber-700"
                  : "bg-card border-border text-muted-foreground hover:border-amber-400"
              }`}
            >
              {cl.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          {view === "list" ? (
            <TimelineList cases={filteredCases} reminders={reminders} onRefresh={load} />
          ) : (
            <TimelineGantt cases={filteredCases} />
          )}
        </div>
        <div className="xl:col-span-1">
          <ReminderPanel cases={cases} reminders={reminders} onRefresh={load} />
        </div>
      </div>
    </div>
  );
}