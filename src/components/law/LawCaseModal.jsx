import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const EMPTY = { client_name: "", client_phone: "", case_number: "", area: "", type: "Consulta", date: "", time: "", court: "", status: "Agendado", notes: "" };

export default function LawCaseModal({ open, onClose, caseData, clients, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(caseData ? { ...EMPTY, ...caseData } : EMPTY);
  }, [caseData, open]);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleClientSelect = (name) => {
    const c = clients.find(cl => cl.full_name === name);
    setForm(prev => ({ ...prev, client_name: name, client_phone: c?.phone || prev.client_phone }));
  };

  const handleSave = async () => {
    setSaving(true);
    if (caseData?.id) {
      await base44.entities.LegalCase.update(caseData.id, form);
    } else {
      await base44.entities.LegalCase.create(form);
    }
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{caseData ? "Editar Processo" : "Novo Processo / Compromisso"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Cliente *</Label>
              <Select value={form.client_name} onValueChange={handleClientSelect}>
                <SelectTrigger><SelectValue placeholder="Selecionar cliente" /></SelectTrigger>
                <SelectContent>
                  {clients.map(c => <SelectItem key={c.id} value={c.full_name}>{c.full_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Nº do Processo</Label>
              <Input value={form.case_number} onChange={e => set("case_number", e.target.value)} placeholder="0000000-00.0000.0.00.0000" />
            </div>
            <div>
              <Label>Tipo *</Label>
              <Select value={form.type} onValueChange={v => set("type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Ação", "Audiência", "Recurso", "Consulta", "Reunião", "Prazo", "Diligência"].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Área Jurídica</Label>
              <Select value={form.area} onValueChange={v => set("area", v)}>
                <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>
                  {["Cível", "Criminal", "Trabalhista", "Família", "Tributário", "Empresarial", "Previdenciário", "Outro"].map(a => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data *</Label>
              <Input type="date" value={form.date} onChange={e => set("date", e.target.value)} />
            </div>
            <div>
              <Label>Horário</Label>
              <Input type="time" value={form.time} onChange={e => set("time", e.target.value)} />
            </div>
            <div className="col-span-2">
              <Label>Vara / Tribunal</Label>
              <Input value={form.court} onChange={e => set("court", e.target.value)} placeholder="Ex: 3ª Vara do Trabalho" />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Agendado", "Realizado", "Pendente", "Cancelado", "Encerrado"].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Observações</Label>
              <Textarea value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Detalhes do processo ou audiência..." rows={3} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.client_name || !form.date}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}