import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/api/client";

const CATEGORIES_REVENUE = ["Consulta", "Exame", "Procedimento", "Outros"];
const CATEGORIES_COST = ["Aluguel", "Salário", "Equipamento", "Marketing", "Outros"];

export default function FinancialRecordModal({ open, onClose, record, onSaved }) {
  const [form, setForm] = useState({ description: "", type: "Receita", category: "Consulta", amount: "", date: "", notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (record) {
      setForm({ ...record, amount: String(record.amount) });
    } else {
      setForm({ description: "", type: "Receita", category: "Consulta", amount: "", date: new Date().toISOString().split("T")[0], notes: "" });
    }
  }, [record, open]);

  const categories = form.type === "Receita" ? CATEGORIES_REVENUE : CATEGORIES_COST;

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, amount: parseFloat(form.amount) };
    if (record?.id) {
      await api.entities.FinancialRecord.update(record.id, data);
    } else {
      await api.entities.FinancialRecord.create(data);
    }
    setSaving(false);
    onSaved();
    onClose();
  };

  const canSave = form.description && form.amount && form.date;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{record ? "Editar Lançamento" : "Novo Lançamento"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v, category: v === "Receita" ? "Consulta" : "Aluguel" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Receita">Receita</SelectItem>
                  <SelectItem value="Custo">Custo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Categoria</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Descrição</Label>
            <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Ex: Consulta Dr. Silva" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Valor (R$)</Label>
              <Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0,00" />
            </div>
            <div className="space-y-1">
              <Label>Data</Label>
              <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Observações</Label>
            <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Opcional" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !canSave}>{saving ? "Salvando..." : "Salvar"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}