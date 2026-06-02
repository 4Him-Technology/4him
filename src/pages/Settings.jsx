import { useState, useEffect } from "react";
import { api } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Save } from "lucide-react";
import { toast } from "sonner";

const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({
    clinic_name: "",
    doctor_name: "",
    ai_prompt: "",
    working_days: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
    start_time: "08:00",
    end_time: "18:00",
    slot_duration: 30,
    whatsapp_number: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const list = await api.entities.ClinicSettings.list("-created_date", 1);
      if (list.length > 0) {
        setSettings(list[0]);
        setForm({
          clinic_name: list[0].clinic_name || "",
          doctor_name: list[0].doctor_name || "",
          ai_prompt: list[0].ai_prompt || "",
          working_days: list[0].working_days || ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
          start_time: list[0].start_time || "08:00",
          end_time: list[0].end_time || "18:00",
          slot_duration: list[0].slot_duration || 30,
          whatsapp_number: list[0].whatsapp_number || "",
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (settings) {
      await api.entities.ClinicSettings.update(settings.id, form);
    } else {
      const created = await api.entities.ClinicSettings.create(form);
      setSettings(created);
    }
    setSaving(false);
    toast.success("Configurações salvas!");
  };

  const toggleDay = (day) => {
    setForm(f => ({
      ...f,
      working_days: f.working_days.includes(day)
        ? f.working_days.filter(d => d !== day)
        : [...f.working_days, day]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure o consultório, horários e IA</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="hours">Horários</TabsTrigger>
          <TabsTrigger value="ai">IA & WhatsApp</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <div>
              <Label>Nome do Consultório</Label>
              <Input value={form.clinic_name} onChange={e => setForm(f => ({ ...f, clinic_name: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label>Nome do Médico</Label>
              <Input value={form.doctor_name} onChange={e => setForm(f => ({ ...f, doctor_name: e.target.value }))} className="mt-1" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hours">
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <div>
              <Label className="mb-3 block">Dias de Atendimento</Label>
              <div className="flex flex-wrap gap-3">
                {DAYS.map(day => (
                  <label key={day} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={form.working_days.includes(day)}
                      onCheckedChange={() => toggleDay(day)}
                    />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Início</Label>
                <Input type="time" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>Fim</Label>
                <Input type="time" value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>Duração (min)</Label>
                <Input type="number" value={form.slot_duration} onChange={e => setForm(f => ({ ...f, slot_duration: Number(e.target.value) }))} className="mt-1" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai">
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <div>
              <Label>Número do WhatsApp</Label>
              <Input
                placeholder="+55 11 99999-9999"
                value={form.whatsapp_number}
                onChange={e => setForm(f => ({ ...f, whatsapp_number: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Prompt da IA</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Instruções para a IA ao responder pacientes no WhatsApp
              </p>
              <Textarea
                rows={8}
                placeholder="Exemplo: Você é a assistente virtual do consultório do Dr. Silva, cardiologista. Responda de forma educada e profissional..."
                value={form.ai_prompt}
                onChange={e => setForm(f => ({ ...f, ai_prompt: e.target.value }))}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" />
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
}