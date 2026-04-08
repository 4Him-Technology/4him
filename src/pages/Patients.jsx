import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2, Edit2, Phone, Mail, Calendar, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import moment from "moment";
import PatientModal from "../components/patients/PatientModal";

const sourceColors = {
  "WhatsApp": "bg-green-100 text-green-700",
  "Presencial": "bg-blue-100 text-blue-700",
  "Telefone": "bg-purple-100 text-purple-700",
  "Site": "bg-orange-100 text-orange-700",
  "Indicação": "bg-teal-100 text-teal-700",
};

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const [pts, apts] = await Promise.all([
      base44.entities.Patient.list("-created_date", 500),
      base44.entities.Appointment.list("-date", 500),
    ]);
    setPatients(pts);
    setAppointments(apts);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await base44.entities.Patient.delete(id);
    load();
  };

  const filtered = patients.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search) ||
    p.cpf?.includes(search)
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
          <h1 className="text-2xl font-bold text-foreground">Pacientes</h1>
          <p className="text-sm text-muted-foreground mt-1">Base de pacientes do consultório</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Novo Paciente
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar por nome, telefone ou CPF..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-full text-center py-12">Nenhum paciente encontrado</p>
        )}
        {filtered.map(p => {
          const patientApts = appointments
            .filter(a => a.patient_phone === p.phone || a.patient_name === p.full_name)
            .sort((a, b) => b.date.localeCompare(a.date));
          const lastApt = patientApts[0];
          return (
          <div key={p.id} className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {p.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{p.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.gender} {p.date_of_birth && `· ${moment().diff(moment(p.date_of_birth), 'years')} anos`}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditing(p); setModalOpen(true); }}>
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(p.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3" /> {p.phone}
              </div>
              {p.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3" /> {p.email}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-3">
              {p.source && (
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", sourceColors[p.source] || "bg-muted text-muted-foreground")}>
                  {p.source}
                </span>
              )}
              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", p.status === "Ativo" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500")}>
                {p.status || "Ativo"}
              </span>
            </div>
            {/* Histórico de atendimentos */}
            {patientApts.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Histórico ({patientApts.length} atend.)</p>
                <div className="space-y-1.5">
                  {patientApts.slice(0, 3).map((a, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span>{moment(a.date).format("DD/MM/YY")} · {a.time} · {a.type}</span>
                      </div>
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                        a.status === "Realizado" ? "bg-emerald-100 text-emerald-700" :
                        a.status === "Cancelado" ? "bg-red-100 text-red-700" :
                        a.status === "Confirmado" ? "bg-blue-100 text-blue-700" :
                        "bg-amber-100 text-amber-700"
                      )}>{a.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          );
        })}
      </div>

      <PatientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        patient={editing}
        onSaved={load}
      />
    </div>
  );
}