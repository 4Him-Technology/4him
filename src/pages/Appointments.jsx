import { useState, useEffect } from "react";
import { api } from "@/api/client";
import { Button } from "@/components/ui/button";
import {
  Plus, ChevronLeft, ChevronRight, ArrowLeft, Stethoscope,
  FileText, Video, CalendarDays, X, Phone, Mail, User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import moment from "moment";
import "moment/dist/locale/pt-br";
import AppointmentModal from "../components/appointments/AppointmentModal";

moment.locale("pt-br");

// Médicos da clínica (dados fictícios — uma clínica pode ter vários).
const DOCTORS = [
  { id: "dr_lemos", name: "Dr. Ricardo Lemos", specialty: "Clínico Geral" },
  { id: "dra_prado", name: "Dra. Helena Prado", specialty: "Medicina do Trabalho" },
  { id: "dr_vieira", name: "Dr. Marcos Vieira", specialty: "Cardiologia" },
];

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 07:00 → 19:00
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const GRID_COLS = "52px repeat(7, minmax(0, 1fr))"; // minmax(0,..) impede a coluna de esticar

const statusBar = {
  "Agendado": "#3B7BE0",
  "Confirmado": "#2EA86A",
  "Realizado": "#2F7D4E",
  "Cancelado": "#E23D3D",
  "Não Compareceu": "#F5B12E",
};

function hashStr(s = "") {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
function doctorIdFor(apt) {
  return apt.doctor_id || DOCTORS[hashStr(apt.id) % DOCTORS.length].id;
}
function initials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [weekStart, setWeekStart] = useState(moment().startOf("week"));
  const [modalOpen, setModalOpen] = useState(false);
  const [ficha, setFicha] = useState(null); // paciente exibido no popup

  const load = async () => {
    const [apts, pts] = await Promise.all([
      api.entities.Appointment.list("-date", 300),
      api.entities.Patient.list("-created_date", 500),
    ]);
    setAppointments(apts);
    setPatients(pts);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  /* ---------------- Passo 1: escolher o médico ---------------- */
  if (!doctor) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div>
          <h2 className="text-xl font-bold text-foreground">Selecione o médico</h2>
          <p className="text-sm text-muted-foreground mt-1">Escolha o profissional para ver a agenda da semana.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOCTORS.map(doc => {
            const count = appointments.filter(a => doctorIdFor(a) === doc.id).length;
            return (
              <button
                key={doc.id}
                onClick={() => setDoctor(doc)}
                className="text-left bg-card border border-border rounded-xl p-5 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    {initials(doc.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Stethoscope className="w-3 h-3" /> {doc.specialty}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">{count} agendamento(s) no total</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------------- Passo 2: agenda semanal (estilo Teams) ---------------- */
  const days = Array.from({ length: 7 }, (_, i) => weekStart.clone().add(i, "days"));
  const today = moment().startOf("day");

  const slots = {};
  appointments
    .filter(a => doctorIdFor(a) === doctor.id)
    .forEach(a => {
      const d = moment(a.date, "YYYY-MM-DD").startOf("day");
      const dayDiff = d.diff(weekStart.clone().startOf("day"), "days");
      if (dayDiff < 0 || dayDiff > 6) return;
      const hour = parseInt(String(a.time).split(":")[0], 10);
      const key = `${dayDiff}_${hour}`;
      (slots[key] = slots[key] || []).push(a);
    });

  const openFicha = (apt) => {
    const p = patients.find(x => x.id === apt.patient_id) || { full_name: apt.patient_name, phone: apt.patient_phone };
    setFicha(p);
  };
  const openMeeting = (apt) => {
    window.alert(`Abrir reunião de ${apt.patient_name} — ${moment(apt.date).format("DD/MM")} ${apt.time}.\n(integração da videochamada em breve)`);
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setDoctor(null)} title="Trocar médico">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
            {initials(doctor.name)}
          </span>
          <div>
            <p className="font-semibold text-foreground leading-tight">{doctor.name}</p>
            <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setWeekStart(moment().startOf("week"))}>Hoje</Button>
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setWeekStart(weekStart.clone().subtract(1, "week"))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setWeekStart(weekStart.clone().add(1, "week"))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium text-foreground min-w-[150px] text-center">
            {days[0].format("DD MMM")} – {days[6].format("DD MMM YYYY")}
          </span>
          <Button size="sm" className="gap-2 ml-1" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Novo
          </Button>
        </div>
      </div>

      {/* Grade semanal */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[880px]">
            {/* Cabeçalho dos dias */}
            <div className="grid sticky top-0 z-10 bg-card border-b border-border" style={{ gridTemplateColumns: GRID_COLS }}>
              <div className="border-r border-border" />
              {days.map((d, i) => {
                const isToday = d.isSame(today, "day");
                return (
                  <div key={i} className={cn("px-1 py-2 text-center border-r border-border last:border-r-0", isToday && "bg-primary/5")}>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{WEEKDAYS[d.day()]}</p>
                    <p className={cn("text-lg font-bold leading-tight", isToday ? "text-primary" : "text-foreground")}>{d.format("DD")}</p>
                  </div>
                );
              })}
            </div>

            {/* Linhas de horário */}
            {HOURS.map(hour => (
              <div key={hour} className="grid border-b border-border last:border-b-0" style={{ gridTemplateColumns: GRID_COLS }}>
                <div className="border-r border-border px-1 py-1 text-right">
                  <span className="text-[11px] text-muted-foreground">{String(hour).padStart(2, "0")}:00</span>
                </div>
                {days.map((d, di) => {
                  const isToday = d.isSame(today, "day");
                  const cellAppts = slots[`${di}_${hour}`] || [];
                  return (
                    <div key={di} className={cn("border-r border-border last:border-r-0 p-1 min-h-[64px] min-w-0 overflow-hidden space-y-1", isToday && "bg-primary/5")}>
                      {cellAppts.map(apt => (
                        <div
                          key={apt.id}
                          className="w-full rounded-md bg-secondary/60 border-l-[3px] px-1.5 py-1 overflow-hidden"
                          style={{ borderLeftColor: statusBar[apt.status] || "#8A2F82" }}
                        >
                          <p className="text-[11px] font-semibold text-foreground leading-tight truncate">{apt.time} · {apt.patient_name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{apt.type}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            <button
                              onClick={() => openFicha(apt)}
                              title="Ficha do paciente"
                              className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-background border border-border hover:border-primary/50 text-foreground min-w-0"
                            >
                              <FileText className="w-3 h-3 shrink-0" /> <span className="truncate">Ficha</span>
                            </button>
                            <button
                              onClick={() => openMeeting(apt)}
                              title="Abrir reunião"
                              className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary text-primary-foreground hover:opacity-90 min-w-0"
                            >
                              <Video className="w-3 h-3 shrink-0" /> <span className="truncate">Reunião</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Agenda de {doctor.name}</span>
        {Object.entries(statusBar).map(([s, c]) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} /> {s}
          </span>
        ))}
      </div>

      {/* Popup: ficha do paciente */}
      {ficha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFicha(null)} />
          <div className="relative bg-card border border-border rounded-xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-bold text-foreground">Ficha do paciente</h3>
              <button onClick={() => setFicha(null)} className="p-1 rounded-md hover:bg-muted text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                  {initials(ficha.full_name)}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">{ficha.full_name}</p>
                  {ficha.status && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{ficha.status}</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                {ficha.phone && <Field icon={Phone} label="Telefone" value={ficha.phone} />}
                {ficha.email && <Field icon={Mail} label="E-mail" value={ficha.email} />}
                {ficha.cpf && <Field icon={UserIcon} label="CPF" value={ficha.cpf} />}
                {ficha.date_of_birth && <Field icon={CalendarDays} label="Nascimento" value={moment(ficha.date_of_birth).format("DD/MM/YYYY")} />}
                {ficha.gender && <Field icon={UserIcon} label="Gênero" value={ficha.gender} />}
                {ficha.source && <Field icon={UserIcon} label="Origem" value={ficha.source} />}
              </div>
              {ficha.notes && (
                <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Observações: </span>{ficha.notes}
                </div>
              )}
            </div>
            <div className="px-5 py-4 border-t border-border flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setFicha(null)}>Fechar</Button>
            </div>
          </div>
        </div>
      )}

      <AppointmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        appointment={null}
        patients={patients}
        onSaved={load}
      />
    </div>
  );
}

function Field({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Icon className="w-3 h-3" /> {label}</p>
      <p className="text-foreground font-medium truncate">{value}</p>
    </div>
  );
}
