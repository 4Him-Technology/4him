import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";
import { RefreshCw, Loader2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConversationCard from "@/components/chatwoot/ConversationCard";
import ConversationDetail from "@/components/chatwoot/ConversationDetail";
import LeadsStats from "@/components/chatwoot/LeadsStats";

const ACCOUNT_ID = 1;

const COLUMNS = [
  { id: "open",     label: "Abertos",    color: "bg-green-500",  light: "bg-green-50 border-green-200",   text: "text-green-700" },
  { id: "pending",  label: "Pendentes",  color: "bg-amber-500",  light: "bg-amber-50 border-amber-200",   text: "text-amber-700" },
  { id: "resolved", label: "Resolvidos", color: "bg-slate-400",  light: "bg-slate-50 border-slate-200",   text: "text-slate-600" },
];

export default function Leads() {
  const [conversations, setConversations] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [search, setSearch] = useState("");
  const [labelFilter, setLabelFilter] = useState("");
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    load();
    loadLabels();
  }, []);

  async function load() {
    setLoading(true);
    // Load all statuses in parallel
    const [openRes, pendingRes, resolvedRes] = await Promise.all([
      base44.functions.invoke("chatwoot", { action: "getConversations", account_id: ACCOUNT_ID, page: 1, status: "open" }),
      base44.functions.invoke("chatwoot", { action: "getConversations", account_id: ACCOUNT_ID, page: 1, status: "pending" }),
      base44.functions.invoke("chatwoot", { action: "getConversations", account_id: ACCOUNT_ID, page: 1, status: "resolved" }),
    ]);

    const open     = openRes.data?.data?.payload || [];
    const pending  = pendingRes.data?.data?.payload || [];
    const resolved = resolvedRes.data?.data?.payload || [];
    const all = [...open, ...pending, ...resolved];
    setConversations(all);
    setMeta(openRes.data?.data?.meta || null);
    setLoading(false);
  }

  async function loadLabels() {
    const res = await base44.functions.invoke("chatwoot", { action: "getLabels", account_id: ACCOUNT_ID });
    setLabels(res.data?.payload || []);
  }

  async function handleDrop(colId) {
    if (!dragging || dragging.status === colId) return;
    await base44.functions.invoke("chatwoot", {
      action: "toggleStatus",
      account_id: ACCOUNT_ID,
      conversation_id: dragging.id,
      status: colId,
    });
    setConversations(prev => prev.map(c => c.id === dragging.id ? { ...c, status: colId } : c));
    setDragging(null);
    setDragOver(null);
    if (selected?.id === dragging.id) {
      setSelected(prev => ({ ...prev, status: colId }));
    }
  }

  const filtered = conversations.filter(c => {
    const name = c.meta?.sender?.name?.toLowerCase() || "";
    const phone = c.meta?.sender?.phone_number || "";
    const matchSearch = !search || name.includes(search.toLowerCase()) || phone.includes(search);
    const matchLabel = !labelFilter || (c.labels || []).includes(labelFilter);
    return matchSearch && matchLabel;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Leads · Chatwoot</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Arraste conversas entre colunas para alterar o status</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Buscar contato ou telefone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-input rounded-lg px-3 py-2 text-sm bg-card w-56 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {labels.length > 0 && (
            <select
              value={labelFilter}
              onChange={e => setLabelFilter(e.target.value)}
              className="border border-input rounded-lg px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Todas as etiquetas</option>
              {labels.map(l => (
                <option key={l.id} value={l.title}>{l.title}</option>
              ))}
            </select>
          )}
          <Button variant="outline" size="sm" onClick={load} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4">
        <LeadsStats meta={meta} />
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Kanban */}
          <div className={cn("flex gap-4 overflow-x-auto flex-1 pb-2", selected && "hidden md:flex")}>
            {COLUMNS.map(col => {
              const cards = filtered.filter(c => c.status === col.id);
              return (
                <div
                  key={col.id}
                  className={cn(
                    "flex flex-col rounded-xl border min-w-[280px] w-[280px] shrink-0 transition-colors",
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
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", col.light, col.text)}>
                      {cards.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {cards.length === 0 && (
                      <div className="flex items-center justify-center h-20 text-muted-foreground/40 text-xs">
                        Sem conversas
                      </div>
                    )}
                    {cards.map(conv => (
                      <div
                        key={conv.id}
                        draggable
                        onDragStart={() => setDragging(conv)}
                        onDragEnd={() => { setDragging(null); setDragOver(null); }}
                      >
                        <ConversationCard
                          conv={conv}
                          onClick={setSelected}
                          dragging={dragging?.id === conv.id}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail Panel */}
          {selected && (
            <div className="w-full md:w-[380px] shrink-0 rounded-xl overflow-hidden border border-border shadow-sm flex flex-col">
              <ConversationDetail
                conv={selected}
                onClose={() => setSelected(null)}
                onStatusChange={() => {
                  load();
                  setSelected(null);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}