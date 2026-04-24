import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Briefcase, ChevronDown, X } from "lucide-react";

export default function DocumentTemplateForm({ template, onSubmit, onBack }) {
  const [values, setValues] = useState({});
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [clientSearch, setClientSearch] = useState("");
  const [caseSearch, setCaseSearch] = useState("");
  const [showClientDrop, setShowClientDrop] = useState(false);
  const [showCaseDrop, setShowCaseDrop] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const init = {};
    template.fields.forEach(f => { init[f.key] = f.default || ""; });
    setValues(init);
    base44.entities.LegalClient.list("-created_date", 500).then(setClients);
    base44.entities.LegalCase.list("-date", 500).then(setCases);
  }, [template]);

  function set(key, value) {
    setValues(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: "" }));
  }

  function validate() {
    const errs = {};
    template.fields.forEach(f => {
      if (f.required && !values[f.key]) errs[f.key] = "Campo obrigatório";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) onSubmit(values);
  }

  function applyClient(c) {
    set("_clientName", c.full_name);
    set("_clientId", c.id);
    // Auto-fill fields that match client data
    if ("autor" in values) set("autor", c.full_name);
    if ("recorrente" in values) set("recorrente", c.full_name);
    if ("agravante" in values) set("agravante", c.full_name);
    if ("embargante" in values) set("embargante", c.full_name);
    if ("notificante" in values) set("notificante", c.full_name);
    if ("parte1" in values) set("parte1", c.full_name);
    if ("paciente" in values) set("paciente", c.full_name);
    if ("cpf_autor" in values) set("cpf_autor", c.cpf_cnpj || "");
    if ("cpf_notificante" in values) set("cpf_notificante", c.cpf_cnpj || "");
    if ("cpf_paciente" in values) set("cpf_paciente", c.cpf_cnpj || "");
    if ("cpf1" in values) set("cpf1", c.cpf_cnpj || "");
    setClientSearch(""); setShowClientDrop(false);
  }

  function applyCase(c) {
    set("_caseName", `${c.type} — ${c.client_name}`);
    set("_caseId", c.id);
    // Auto-fill from case data
    if ("processo" in values) set("processo", c.case_number || "");
    if ("vara" in values) set("vara", c.court || "");
    if ("vara_origem" in values) set("vara_origem", c.court || "");
    if ("autor" in values && !values["autor"]) set("autor", c.client_name || "");
    if ("reu" in values && !values["reu"]) set("reu", c.client_name || "");
    setCaseSearch(""); setShowCaseDrop(false);
  }

  const filteredClients = clients.filter(c => c.full_name?.toLowerCase().includes(clientSearch.toLowerCase()));
  const filteredCases = cases.filter(c =>
    `${c.client_name} ${c.case_number} ${c.type}`.toLowerCase().includes(caseSearch.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Integration row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Client selector */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-muted-foreground" /> Cliente (pré-preencher dados)
          </label>
          <div className="relative">
            <div
              className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setShowClientDrop(!showClientDrop)}
            >
              <span className={values._clientName ? "text-foreground truncate" : "text-muted-foreground text-xs"}>
                {values._clientName || "Selecione um cliente..."}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                {values._clientName && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); set("_clientName", ""); set("_clientId", ""); }}
                    className="text-muted-foreground hover:text-destructive p-0.5">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <ChevronDown className="w-4 h-4 text-muted-foreground opacity-50" />
              </div>
            </div>
            {showClientDrop && (
              <div className="absolute z-50 top-full mt-1 w-full bg-popover border border-border rounded-md shadow-lg">
                <div className="p-2 border-b border-border">
                  <Input placeholder="Buscar cliente..." value={clientSearch}
                    onChange={e => setClientSearch(e.target.value)} autoFocus className="h-8 text-sm"
                    onClick={e => e.stopPropagation()} />
                </div>
                <div className="max-h-44 overflow-y-auto p-1">
                  {filteredClients.slice(0, 15).map(c => (
                    <button key={c.id} type="button"
                      className="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-accent transition-colors flex flex-col gap-0.5"
                      onClick={() => applyClient(c)}>
                      <span className="font-medium">{c.full_name}</span>
                      {c.phone && <span className="text-[11px] text-muted-foreground">{c.phone}</span>}
                    </button>
                  ))}
                  {filteredClients.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">Nenhum cliente encontrado</p>}
                </div>
              </div>
            )}
            {showClientDrop && <div className="fixed inset-0 z-40" onClick={() => setShowClientDrop(false)} />}
          </div>
        </div>

        {/* Case selector */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-muted-foreground" /> Processo (importar dados)
          </label>
          <div className="relative">
            <div
              className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setShowCaseDrop(!showCaseDrop)}
            >
              <span className={values._caseName ? "text-foreground truncate" : "text-muted-foreground text-xs"}>
                {values._caseName || "Importar dados de um processo..."}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                {values._caseName && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); set("_caseName", ""); set("_caseId", ""); }}
                    className="text-muted-foreground hover:text-destructive p-0.5">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <ChevronDown className="w-4 h-4 text-muted-foreground opacity-50" />
              </div>
            </div>
            {showCaseDrop && (
              <div className="absolute z-50 top-full mt-1 w-full bg-popover border border-border rounded-md shadow-lg">
                <div className="p-2 border-b border-border">
                  <Input placeholder="Buscar processo..." value={caseSearch}
                    onChange={e => setCaseSearch(e.target.value)} autoFocus className="h-8 text-sm"
                    onClick={e => e.stopPropagation()} />
                </div>
                <div className="max-h-44 overflow-y-auto p-1">
                  {filteredCases.slice(0, 15).map(c => (
                    <button key={c.id} type="button"
                      className="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-accent transition-colors flex flex-col gap-0.5"
                      onClick={() => applyCase(c)}>
                      <span className="font-medium">{c.client_name} — {c.type}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {c.case_number && `Proc: ${c.case_number} · `}{c.area} · {c.court || "—"}
                      </span>
                    </button>
                  ))}
                  {filteredCases.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">Nenhum processo encontrado</p>}
                </div>
              </div>
            )}
            {showCaseDrop && <div className="fixed inset-0 z-40" onClick={() => setShowCaseDrop(false)} />}
          </div>
        </div>
      </div>

      {/* Dynamic fields */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-semibold text-foreground mb-4">Dados da Peça</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {template.fields.map(field => (
            <div key={field.key} className={`space-y-1.5 ${field.type === "textarea" ? "sm:col-span-2" : ""}`}>
              <label className="text-sm font-medium text-foreground">
                {field.label}{field.required && <span className="text-destructive ml-0.5">*</span>}
              </label>
              {field.type === "textarea" ? (
                <Textarea
                  placeholder={field.placeholder}
                  value={values[field.key] || ""}
                  onChange={e => set(field.key, e.target.value)}
                  className="min-h-[90px] resize-y"
                />
              ) : field.type === "select" ? (
                <Select value={values[field.key] || ""} onValueChange={v => set(field.key, v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={values[field.key] || ""}
                  onChange={e => set(field.key, e.target.value)}
                />
              )}
              {errors[field.key] && <p className="text-xs text-destructive">{errors[field.key]}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onBack}>Cancelar</Button>
        <Button type="submit">Visualizar Peça →</Button>
      </div>
    </form>
  );
}