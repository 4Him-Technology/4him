import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, ChevronDown, X } from "lucide-react";

export default function ContractForm({ template, onSubmit, onBack }) {
  const [values, setValues] = useState({});
  const [clients, setClients] = useState([]);
  const [clientSearch, setClientSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    base44.entities.LegalClient.list("-created_date", 500).then(setClients);
    // Initialize defaults
    const init = {};
    template.fields.forEach(f => { init[f.key] = f.default || ""; });
    setValues(init);
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

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Client selector */}
      <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 space-y-2">
        <label className="text-sm font-medium text-foreground">Cliente (opcional)</label>
        <div className="relative">
          <div
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => setShowClientDropdown(!showClientDropdown)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className={values._clientName ? "text-foreground truncate" : "text-muted-foreground"}>
                {values._clientName || "Selecione um cliente para pré-preencher dados..."}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {values._clientName && (
                <button type="button"
                  onClick={(e) => { e.stopPropagation(); set("_clientName", ""); set("_clientId", ""); }}
                  className="text-muted-foreground hover:text-destructive transition-colors p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <ChevronDown className="w-4 h-4 text-muted-foreground opacity-50" />
            </div>
          </div>

          {showClientDropdown && (
            <div className="absolute z-50 top-full mt-1 w-full bg-popover border border-border rounded-md shadow-lg">
              <div className="p-2 border-b border-border">
                <Input
                  placeholder="Buscar cliente..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  autoFocus
                  className="h-8 text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="max-h-44 overflow-y-auto p-1">
                {clients
                  .filter(c => c.full_name?.toLowerCase().includes(clientSearch.toLowerCase()))
                  .slice(0, 20)
                  .map(c => (
                    <button
                      key={c.id}
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors flex flex-col gap-0.5"
                      onClick={() => {
                        set("_clientName", c.full_name);
                        set("_clientId", c.id);
                        // Auto-fill known fields
                        if (values.hasOwnProperty("contratante")) set("contratante", c.full_name);
                        if (values.hasOwnProperty("cpf_cnpj")) set("cpf_cnpj", c.cpf_cnpj || "");
                        setClientSearch(""); setShowClientDropdown(false);
                      }}
                    >
                      <span className="font-medium">{c.full_name}</span>
                      {c.phone && <span className="text-[11px] text-muted-foreground">{c.phone}</span>}
                    </button>
                  ))
                }
                {clients.filter(c => c.full_name?.toLowerCase().includes(clientSearch.toLowerCase())).length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-3">Nenhum cliente encontrado</p>
                )}
              </div>
            </div>
          )}
          {showClientDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowClientDropdown(false)} />}
        </div>
      </div>

      {/* Dynamic fields */}
      <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
        <h2 className="font-semibold text-foreground mb-4">Dados do Contrato</h2>
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
                  className="min-h-[80px] resize-y"
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

      <div className="lg:col-span-2 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onBack}>Cancelar</Button>
        <Button type="submit">Visualizar Contrato →</Button>
      </div>
    </form>
  );
}