import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Calendar, Users, CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp, MessageSquare, DollarSign, Activity } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import AppointmentChart from "../components/dashboard/AppointmentChart";
import StatusPieChart from "../components/dashboard/StatusPieChart";
import RecentAppointments from "../components/dashboard/RecentAppointments";
import InsuranceChart from "../components/dashboard/InsuranceChart";
import TypeChart from "../components/dashboard/TypeChart";
import PatientSourceChart from "../components/dashboard/PatientSourceChart";
import HourlyChart from "../components/dashboard/HourlyChart";
import WeekdayChart from "../components/dashboard/WeekdayChart";
import NewPatientsChart from "../components/dashboard/NewPatientsChart";
import FinancialSummaryChart from "../components/dashboard/FinancialSummaryChart";
import WhatsAppActivityChart from "../components/dashboard/WhatsAppActivityChart";
import AttendanceRateChart from "../components/dashboard/AttendanceRateChart";
import GenderChart from "../components/dashboard/GenderChart";
import AgeGroupChart from "../components/dashboard/AgeGroupChart";
import moment from "moment";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [financials, setFinancials] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [apts, pts, fins, msgs] = await Promise.all([
        base44.entities.Appointment.list("-date", 500),
        base44.entities.Patient.list("-created_date", 500),
        base44.entities.FinancialRecord.list("-date", 500),
        base44.entities.WhatsAppMessage.list("-created_date", 500),
      ]);
      setAppointments(apts);
      setPatients(pts);
      setFinancials(fins);
      setMessages(msgs);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const today = moment().format("YYYY-MM-DD");
  const thisMonth = moment().format("YYYY-MM");

  const monthAppointments = appointments.filter(a => a.date?.startsWith(thisMonth));
  const todayAppointments = appointments.filter(a => a.date === today);
  const confirmed = monthAppointments.filter(a => a.status === "Confirmado" || a.status === "Realizado").length;
  const canceled = monthAppointments.filter(a => a.status === "Cancelado").length;
  const noShow = monthAppointments.filter(a => a.status === "Não Compareceu").length;
  const realized = appointments.filter(a => a.status === "Realizado").length;

  const upcoming = appointments
    .filter(a => a.date >= today && (a.status === "Agendado" || a.status === "Confirmado"))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 6);

  // Attendance rate
  const totalDone = appointments.filter(a => ["Realizado","Cancelado","Não Compareceu"].includes(a.status)).length;
  const attendanceRate = totalDone > 0 ? Math.round((realized / totalDone) * 100) : 0;

  // Week chart
  const weekData = [];
  for (let i = 3; i >= 0; i--) {
    const weekStart = moment().subtract(i, 'weeks').startOf('week');
    const weekEnd = moment().subtract(i, 'weeks').endOf('week');
    const weekApts = appointments.filter(a => moment(a.date).isBetween(weekStart, weekEnd, null, '[]'));
    weekData.push({
      name: `Sem ${4 - i}`,
      agendados: weekApts.length,
      realizados: weekApts.filter(a => a.status === "Realizado").length,
      cancelados: weekApts.filter(a => a.status === "Cancelado").length,
    });
  }

  // Status pie
  const statusCounts = {};
  monthAppointments.forEach(a => { statusCounts[a.status] = (statusCounts[a.status] || 0) + 1; });
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Insurance
  const insuranceCounts = {};
  appointments.forEach(a => {
    const ins = a.insurance || "Particular";
    insuranceCounts[ins] = (insuranceCounts[ins] || 0) + 1;
  });
  const insuranceData = Object.entries(insuranceCounts)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total).slice(0, 6);

  // Type
  const typeCounts = {};
  appointments.forEach(a => { typeCounts[a.type] = (typeCounts[a.type] || 0) + 1; });
  const typeData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));

  // Hourly
  const hourlyCounts = {};
  appointments.forEach(a => {
    if (!a.time) return;
    const h = a.time.slice(0, 2) + "h";
    hourlyCounts[h] = (hourlyCounts[h] || 0) + 1;
  });
  const hourlyData = Object.entries(hourlyCounts)
    .map(([hour, total]) => ({ hour, total }))
    .sort((a, b) => a.hour.localeCompare(b.hour));

  // Weekday
  const weekdayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];
  appointments.forEach(a => { if (a.date) weekdayCounts[moment(a.date).day()]++; });
  const weekdayData = weekdayCounts.map((total, i) => ({ day: weekdayNames[i], total }));

  // Patient source
  const sourceCounts = {};
  patients.forEach(p => {
    const s = p.source || "Outros";
    sourceCounts[s] = (sourceCounts[s] || 0) + 1;
  });
  const sourceData = Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));

  // Gender
  const genderCounts = {};
  patients.forEach(p => { const g = p.gender || "Outro"; genderCounts[g] = (genderCounts[g] || 0) + 1; });
  const genderData = Object.entries(genderCounts).map(([name, value]) => ({ name, value }));

  // Age groups
  const ageGroups = { "0-17": 0, "18-30": 0, "31-45": 0, "46-60": 0, "61-75": 0, "75+": 0 };
  patients.forEach(p => {
    if (!p.date_of_birth) return;
    const age = moment().diff(moment(p.date_of_birth), 'years');
    if (age <= 17) ageGroups["0-17"]++;
    else if (age <= 30) ageGroups["18-30"]++;
    else if (age <= 45) ageGroups["31-45"]++;
    else if (age <= 60) ageGroups["46-60"]++;
    else if (age <= 75) ageGroups["61-75"]++;
    else ageGroups["75+"]++;
  });
  const ageGroupData = Object.entries(ageGroups).map(([group, total]) => ({ group, total }));

  // New patients by month (last 6)
  const newPatientsByMonth = [];
  for (let i = 5; i >= 0; i--) {
    const m = moment().subtract(i, 'months');
    const label = m.format("MMM/YY");
    const mStr = m.format("YYYY-MM");
    const total = patients.filter(p => p.created_date?.startsWith(mStr)).length;
    newPatientsByMonth.push({ month: label, total });
  }

  // Financial summary (last 6 months)
  const financialByMonth = [];
  for (let i = 5; i >= 0; i--) {
    const m = moment().subtract(i, 'months');
    const label = m.format("MMM/YY");
    const mStr = m.format("YYYY-MM");
    const monthFins = financials.filter(f => f.date?.startsWith(mStr));
    const receita = monthFins.filter(f => f.type === "Receita").reduce((s, f) => s + (f.amount || 0), 0);
    const custo = monthFins.filter(f => f.type === "Custo").reduce((s, f) => s + (f.amount || 0), 0);
    financialByMonth.push({ month: label, receita, custo });
  }

  // WhatsApp
  const waByContact = {};
  messages.forEach(m => {
    if (!waByContact[m.contact_name]) waByContact[m.contact_name] = { contact: m.contact_name.split(" ")[0], recebidas: 0, enviadas: 0 };
    if (m.direction === "incoming") waByContact[m.contact_name].recebidas++;
    else waByContact[m.contact_name].enviadas++;
  });
  const waData = Object.values(waByContact).sort((a, b) => (b.recebidas + b.enviadas) - (a.recebidas + a.enviadas)).slice(0, 8);
  const aiMessages = messages.filter(m => m.is_ai_response).length;
  const outgoing = messages.filter(m => m.direction === "outgoing").length;
  const aiRate = outgoing > 0 ? Math.round((aiMessages / outgoing) * 100) : 0;

  // Financial KPIs
  const monthFins = financials.filter(f => f.date?.startsWith(thisMonth));
  const monthRevenue = monthFins.filter(f => f.type === "Receita").reduce((s, f) => s + (f.amount || 0), 0);
  const monthCost = monthFins.filter(f => f.type === "Custo").reduce((s, f) => s + (f.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral do consultório</p>
      </div>

      {/* KPIs principais */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Hoje" value={todayAppointments.length} icon={Clock} subtitle="consultas hoje" />
        <StatCard title="Este Mês" value={monthAppointments.length} icon={Calendar} subtitle="total do mês" />
        <StatCard title="Confirmados" value={confirmed} icon={CheckCircle} subtitle="no mês" trendUp />
        <StatCard title="Cancelados" value={canceled} icon={XCircle} subtitle="no mês" />
        <StatCard title="Faltas" value={noShow} icon={AlertTriangle} subtitle="não compareceu" />
        <StatCard title="Pacientes" value={patients.length} icon={Users} subtitle="cadastrados" trendUp />
      </div>

      {/* KPIs financeiros */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Receita do Mês" value={`R$ ${monthRevenue.toLocaleString("pt-BR")}`} icon={DollarSign} subtitle="faturamento" trendUp />
        <StatCard title="Custo do Mês" value={`R$ ${monthCost.toLocaleString("pt-BR")}`} icon={TrendingUp} subtitle="despesas" />
        <StatCard title="Lucro do Mês" value={`R$ ${(monthRevenue - monthCost).toLocaleString("pt-BR")}`} icon={Activity} subtitle="resultado" trendUp={monthRevenue > monthCost} />
      </div>

      {/* Seção: Agenda */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" /> Agenda & Atendimentos
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <AppointmentChart data={weekData} />
          </div>
          <AttendanceRateChart rate={attendanceRate} realized={realized} noShow={noShow} canceled={canceled} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <StatusPieChart data={pieData.length > 0 ? pieData : [{ name: "Sem dados", value: 1 }]} />
          <WeekdayChart data={weekdayData} />
          <HourlyChart data={hourlyData.length > 0 ? hourlyData : [{ hour: "--", total: 0 }]} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <InsuranceChart data={insuranceData} />
          <TypeChart data={typeData.length > 0 ? typeData : [{ name: "Sem dados", value: 1 }]} />
        </div>
      </div>

      {/* Seção: Pacientes */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" /> Pacientes
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <NewPatientsChart data={newPatientsByMonth} />
          <GenderChart data={genderData.length > 0 ? genderData : [{ name: "Sem dados", value: 1 }]} />
          <AgeGroupChart data={ageGroupData} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <PatientSourceChart data={sourceData.length > 0 ? sourceData : [{ name: "Sem dados", value: 1 }]} />
          <RecentAppointments appointments={upcoming} />
        </div>
      </div>

      {/* Seção: Financeiro */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-500" /> Financeiro
        </h2>
        <FinancialSummaryChart data={financialByMonth} />
      </div>

      {/* Seção: WhatsApp */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-green-500" /> WhatsApp
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <WhatsAppActivityChart data={waData} aiRate={aiRate} />
          </div>
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 justify-center">
            <div>
              <p className="text-xs text-muted-foreground">Total de Conversas</p>
              <p className="text-3xl font-bold text-foreground mt-1">{Object.keys(waByContact).length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Mensagens Totais</p>
              <p className="text-3xl font-bold text-foreground mt-1">{messages.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Respostas pela IA</p>
              <p className="text-3xl font-bold text-primary mt-1">{aiRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}