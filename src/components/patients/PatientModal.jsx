import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/api/client";

export default function PatientModal({ open, onClose, patient, onSaved }) {
  const [form, setForm] = useState({
    full_name: "", phone: "", email: "", cpf: "",
    date_of_birth: "", gender: "", notes: "",
    source: "WhatsApp", status: "Ativo",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (patient) {
      setForm({
        full_name: patient.full_name || "",
        phone: patient.phone || "",
        email: patient.email || "",
        cpf: patient.cpf || "",
        date_of_birth: patient.date_of_birth || "",
        gender: patient.gender || "",
        notes: patient.notes || "",
        source: patient.source || "WhatsApp",
        status: patient.status || "Ativo",
      });
    } else {
      setForm({
        full_name: "", phone: "", email: "", cpf: "",
        date_of_birth: "", gender: "", notes: "",
        source: "WhatsApp", status: "Ativo",
      });
    }
  }, [patient, open]);

  const handleSave = async () => {
    setSaving(true);
    if (patient) {
      await api.entities.Patient.update(patient.id, form);
    } else {
      await api.entities.Patient.create(form);
    }
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{patient ? "Editar Paciente" : "Novo Paciente"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Nome Completo</Label>
              <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Telefone</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">CPF</Label>
              <Input value={form.cpf} onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Data de Nascimento</Label>
              <Input type="date" value={form.date_of_birth} onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Sexo</Label>
              <Select value={form.gender} onValueChange={v => setForm(f => ({ ...f, gender: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>
                  {["Masculino", "Feminino", "Outro"].map(g => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Origem</Label>
              <Select value={form.source} onValueChange={v => setForm(f => ({ ...f, source: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["WhatsApp", "Presencial", "Telefone", "Site", "Indicação"].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Observações</Label>
            <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.full_name || !form.phone}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}