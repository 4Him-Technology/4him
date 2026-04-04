import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";

export default function AppointmentModal({ open, onClose, appointment, patients, onSaved }) {
  const [form, setForm] = useState({
    patient_name: "",
    patient_phone: "",
    patient_id: "",
    date: "",
    time: "",
    type: "Consulta",
    status: "Agendado",
    insurance: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (appointment) {
      setForm({
        patient_name: appointment.patient_name || "",
        patient_phone: appointment.patient_phone || "",
        patient_id: appointment.patient_id || "",
        date: appointment.date || "",
        time: appointment.time || "",
        type: appointment.type || "Consulta",
        status: appointment.status || "Agendado",
        insurance: appointment.insurance || "",
        notes: appointment.notes || "",
      });
    } else {
      setForm({
        patient_name: "", patient_phone: "", patient_id: "",
        date: "", time: "", type: "Consulta", status: "Agendado",
        insurance: "", notes: "",
      });
    }
  }, [appointment, open]);

  const handlePatientSelect = (patientId) => {
    const p = patients.find(pt => pt.id === patientId);
    if (p) {
      setForm(f => ({ ...f, patient_id: p.id, patient_name: p.full_name, patient_phone: p.phone }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    if (appointment) {
      await base44.entities.Appointment.update(appointment.id, form);
    } else {
      await base44.entities.Appointment.create(form);
    }
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{appointment ? "Editar Agendamento" : "Novo Agendamento"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs">Paciente Cadastrado (opcional)</Label>
            <Select onValueChange={handlePatientSelect} value={form.patient_id}>
              <SelectTrigger><SelectValue placeholder="Selecionar paciente..." /></SelectTrigger>
              <SelectContent>
                {patients.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.full_name} - {p.phone}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Nome do Paciente</Label>
              <Input value={form.patient_name} onChange={e => setForm(f => ({ ...f, patient_name: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Telefone</Label>
              <Input value={form.patient_phone} onChange={e => setForm(f => ({ ...f, patient_phone: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Data</Label>
              <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Horário</Label>
              <Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Tipo</Label>
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Consulta", "Retorno", "Exame", "Urgência"].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Agendado", "Confirmado", "Realizado", "Cancelado", "Não Compareceu"].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Convênio</Label>
            <Input value={form.insurance} onChange={e => setForm(f => ({ ...f, insurance: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs">Observações</Label>
            <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.patient_name || !form.date || !form.time}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}