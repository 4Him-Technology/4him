import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Trash2, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import moment from "moment";
import LawCaseModal from "@/components/law/LawCaseModal";

const statusColors = {
  "Agendado": "bg-blue-100 text-blue-700",
  "Realizado": "bg-emerald-100 text-emerald-700",
  "Pendente": "bg-amber-100 text-amber-700",
  "Cancelado": "bg-red-100 text-red-700",
  "Encerrado": "bg-gray-100 text-gray-600",
};

export default function LawCases() {
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterArea, setFilterArea] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const [cs, cl] = await Promise.all([
      base44.entities.LegalCase.list("-date", 300),
      base44.entities.LegalClient.list("-created_date", 500),
    ]);
    setCases(cs);
    setClients(cl);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    await base44.entities.LegalCase.delete(id);
    load();
  };

  const filtered = cases.filter(c => {
    const matchSearch = c.client_name?.toLowerCase().includes(search.toLowerCase()) || c.case_number?.includes(search);
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const matchArea = filterArea === "all" || c.area === filterArea;
    return matchSearch && matchStatus && matchArea;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Processos & Agenda</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie processos, audiências e compromissos</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Novo Processo
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar cliente ou nº do processo..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            {["Agendado", "Realizado", "Pendente", "Cancelado", "Encerrado"].map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterArea} onValueChange={setFilterArea}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Área" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Áreas</SelectItem>
            {["Cível", "Criminal", "Trabalhista", "Família", "Tributário", "Empresarial", "Previdenciário", "Outro"].map(a => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nº Processo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Área</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Data</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vara/Tribunal</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-sm text-muted-foreground">Nenhum processo encontrado</td></tr>
              )}
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{c.client_name}</p>
                    <p className="text-xs text-muted-foreground">{c.client_phone}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{c.case_number || "—"}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{c.type}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{c.area || "—"}</td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {c.date ? moment(c.date).format("DD/MM/YYYY") : "—"}
                    {c.time && <span className="block text-xs text-muted-foreground">{c.time}</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{c.court || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-full", statusColors[c.status])}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(c); setModalOpen(true); }}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(c.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <LawCaseModal open={modalOpen} onClose={() => setModalOpen(false)} caseData={editing} clients={clients} onSaved={load} />
    </div>
  );
}