import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, LinkIcon, UserPlus, Search, Check } from "lucide-react";

export default function LinkProcessModal({ processo, clients, onClose, onLinked }) {
  const [mode, setMode] = useState("existente"); // existente | novo
  const [selectedClientId, setSelectedClientId] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  // New client fields
  const [newClientName, setNewClientName] = useState(processo?.partes?.autor || "");
  const [newClientPhone, setNewClientPhone] = useState("");

  const filteredClients = clients.filter(c =>
    c.full_name?.toLowerCase().includes(searchClient.toLowerCase())
  );

  async function handleLink() {
    setSaving(true);

    let clientId = selectedClientId;
    let clientName = clients.find(c => c.id === selectedClientId)?.full_name || "";

    if (mode === "novo") {
      // Create new client
      const newClient = await base44.entities.LegalClient.create({
        full_name: newClientName,
        phone: newClientPhone || "—",
        status: "Ativo",
      });
      clientId = newClient.id;
      clientName = newClient.full_name;
    }

    // Create the LegalCase linked to the client
    await base44.entities.LegalCase.create({
      client_id: clientId,
      client_name: clientName,
      case_number: processo.numero || "",
      area: processo.area || "Outro",
      type: "Ação",
      court: [processo.tribunal, processo.vara].filter(Boolean).join(" — "),
      status: processo.status === "Ativo" ? "Pendente" : "Encerrado",
      notes: [
        processo.classe && `Classe: ${processo.classe}`,
        processo.assunto && `Assunto: ${processo.assunto}`,
        processo.partes?.autor && `Autor: ${processo.partes.autor}`,
        processo.partes?.reu && `Réu: ${processo.partes.reu}`,
        processo.ultima_movimentacao && `Última movimentação: ${processo.ultima_movimentacao}`,
        processo.valor_causa && `Valor da causa: ${processo.valor_causa}`,
        processo.url_externo && `Fonte: ${processo.url_externo}`,
      ].filter(Boolean).join("\n"),
      date: new Date().toISOString().split("T")[0],
    });

    setSaving(false);
    setDone(true);
    setTimeout(() => {
      onLinked();
    }, 1500);
  }

  const canSave = mode === "existente" ? !!selectedClientId : !!newClientName.trim();

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-amber-700" />
            Vincular Processo ao Sistema
          </DialogTitle>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center py-8 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check className="w-7 h-7 text-emerald-600" />
            </div>
            <p className="font-semibold text-foreground">Processo vinculado com sucesso!</p>
            <p className="text-sm text-muted-foreground">O processo foi salvo em Processos & Agenda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Process summary */}
            <div className="bg-amber-50/60 border border-amber-200/60 rounded-lg p-3 space-y-1">
              <p className="text-xs font-semibold text-amber-800">Processo selecionado</p>
              <p className="text-sm font-mono font-medium text-foreground">{processo.numero || "Sem número"}</p>
              <p className="text-xs text-amber-700">{processo.classe || processo.assunto} · {processo.tribunal}</p>
            </div>

            {/* Mode toggle */}
            <div className="flex rounded-lg border border-border overflow-hidden text-sm">
              <button
                onClick={() => setMode("existente")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 transition-colors ${mode === "existente" ? "bg-amber-700 text-white" : "bg-card text-muted-foreground hover:bg-muted"}`}
              >
                <Search className="w-3.5 h-3.5" /> Cliente existente
              </button>
              <button
                onClick={() => setMode("novo")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 transition-colors ${mode === "novo" ? "bg-amber-700 text-white" : "bg-card text-muted-foreground hover:bg-muted"}`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Novo cliente
              </button>
            </div>

            {mode === "existente" ? (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cliente..."
                    value={searchClient}
                    onChange={e => setSearchClient(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1 border border-border rounded-lg p-1">
                  {filteredClients.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">Nenhum cliente encontrado</p>
                  )}
                  {filteredClients.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedClientId(c.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedClientId === c.id
                          ? "bg-amber-700 text-white"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <p className="font-medium">{c.full_name}</p>
                      <p className={`text-xs ${selectedClientId === c.id ? "text-amber-200" : "text-muted-foreground"}`}>{c.phone}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Nome completo *</label>
                  <Input
                    value={newClientName}
                    onChange={e => setNewClientName(e.target.value)}
                    placeholder="Nome do cliente"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Telefone</label>
                  <Input
                    value={newClientPhone}
                    onChange={e => setNewClientPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Button variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
              <Button
                onClick={handleLink}
                disabled={!canSave || saving}
                className="flex-1 gap-2 bg-amber-700 hover:bg-amber-800 text-white"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
                {saving ? "Salvando..." : "Vincular"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}