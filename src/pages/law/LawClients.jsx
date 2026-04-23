import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2, Edit2, Phone, Mail, Briefcase, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import LawClientModal from "@/components/law/LawClientModal";
import { Link } from "react-router-dom";

const sourceColors = {
  "Indicação": "bg-teal-100 text-teal-700",
  "Site": "bg-orange-100 text-orange-700",
  "WhatsApp": "bg-green-100 text-green-700",
  "Presencial": "bg-blue-100 text-blue-700",
  "Redes Sociais": "bg-purple-100 text-purple-700",
};

const areaColors = {
  "Cível": "bg-blue-100 text-blue-700",
  "Criminal": "bg-red-100 text-red-700",
  "Trabalhista": "bg-amber-100 text-amber-700",
  "Família": "bg-pink-100 text-pink-700",
  "Tributário": "bg-violet-100 text-violet-700",
  "Empresarial": "bg-indigo-100 text-indigo-700",
  "Previdenciário": "bg-cyan-100 text-cyan-700",
};

export default function LawClients() {
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const [cl, cs, docs] = await Promise.all([
      base44.entities.LegalClient.list("-created_date", 500),
      base44.entities.LegalCase.list("-date", 500),
      base44.entities.LegalDocument.list("-created_date", 500),
    ]);
    setClients(cl);
    setCases(cs);
    setDocuments(docs);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    await base44.entities.LegalClient.delete(id);
    load();
  };

  const filtered = clients.filter(c =>
    c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.cpf_cnpj?.includes(search)
  );

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
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-1">Base de clientes do escritório</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Novo Cliente
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar por nome, telefone ou CPF/CNPJ..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-full text-center py-12">Nenhum cliente encontrado</p>
        )}
        {filtered.map(c => {
          const clientCases = cases.filter(cs => cs.client_phone === c.phone || cs.client_name === c.full_name).sort((a, b) => b.date?.localeCompare(a.date));
          const clientDocs = documents.filter(d => d.client_id === c.id);
          return (
            <div key={c.id} className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {c.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.full_name}</p>
                    <p className="text-xs text-muted-foreground">{c.type || "Pessoa Física"}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditing(c); setModalOpen(true); }}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(c.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {c.phone}</div>
                {c.email && <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> {c.email}</div>}
                {c.cpf_cnpj && <div className="flex items-center gap-2"><Briefcase className="w-3 h-3" /> {c.cpf_cnpj}</div>}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                {c.area && (
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", areaColors[c.area] || "bg-muted text-muted-foreground")}>
                    {c.area}
                  </span>
                )}
                {c.source && (
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", sourceColors[c.source] || "bg-muted text-muted-foreground")}>
                    {c.source}
                  </span>
                )}
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", c.status === "Ativo" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500")}>
                  {c.status || "Ativo"}
                </span>
              </div>

              {clientCases.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Processos ({clientCases.length})
                  </p>
                  <div className="space-y-1">
                    {clientCases.slice(0, 2).map((cs, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground truncate">{cs.type} · {cs.area}</span>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ml-2",
                          cs.status === "Realizado" ? "bg-emerald-100 text-emerald-700" :
                          cs.status === "Cancelado" ? "bg-red-100 text-red-700" :
                          cs.status === "Agendado" ? "bg-blue-100 text-blue-700" :
                          "bg-amber-100 text-amber-700"
                        )}>{cs.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {clientDocs.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Peças ({clientDocs.length})
                  </p>
                  <div className="space-y-1">
                    {clientDocs.slice(0, 2).map((doc, i) => (
                      <Link
                        key={i}
                        to={`/advocacia/pecas?tab=criadas`}
                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-amber-700 transition-colors group"
                      >
                        <FileText className="w-3 h-3 shrink-0 group-hover:text-amber-700" />
                        <span className="truncate">{doc.tipo}</span>
                      </Link>
                    ))}
                    {clientDocs.length > 2 && (
                      <Link to="/advocacia/pecas?tab=criadas" className="text-[10px] text-amber-700 hover:underline">
                        + {clientDocs.length - 2} mais
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <LawClientModal open={modalOpen} onClose={() => setModalOpen(false)} client={editing} onSaved={load} />
    </div>
  );
}