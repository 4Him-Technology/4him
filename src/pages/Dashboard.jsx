import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Calendar, Users, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import AppointmentChart from "../components/dashboard/AppointmentChart";
import StatusPieChart from "../components/dashboard/StatusPieChart";
import RecentAppointments from "../components/dashboard/RecentAppointments";
import InsuranceChart from "../components/dashboard/InsuranceChart";
import TypeChart from "../components/dashboard/TypeChart";
import moment from "moment";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [apts, pts] = await Promise.all([
        base44.entities.Appointment.list("-date", 200),
        base44.entities.Patient.list("-created_date", 200),
      ]);
      setAppointments(apts);
      setPatients(pts);
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

  const upcoming = appointments
    .filter(a => a.date >= today && (a.status === "Agendado" || a.status === "Confirmado"))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 6);

  // Chart data - last 4 weeks
  const weekData = [];
  for (let i = 3; i >= 0; i--) {
    const weekStart = moment().subtract(i, 'weeks').startOf('week');
    const weekEnd = moment().subtract(i, 'weeks').endOf('week');
    const weekApts = appointments.filter(a => {
      const d = moment(a.date);
      return d.isBetween(weekStart, weekEnd, null, '[]');
    });
    weekData.push({
      name: `Sem ${4 - i}`,
      agendados: weekApts.length,
      realizados: weekApts.filter(a => a.status === "Realizado").length,
      cancelados: weekApts.filter(a => a.status === "Cancelado").length,
    });
  }

  // Pie data
  const statusCounts = {};
  monthAppointments.forEach(a => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Insurance chart
  const insuranceCounts = {};
  appointments.forEach(a => {
    const ins = a.insurance || "Particular";
    insuranceCounts[ins] = (insuranceCounts[ins] || 0) + 1;
  });
  const insuranceData = Object.entries(insuranceCounts)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  // Type chart
  const typeCounts = {};
  appointments.forEach(a => {
    typeCounts[a.type] = (typeCounts[a.type] || 0) + 1;
  });
  const typeData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral do consultório</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Hoje" value={todayAppointments.length} icon={Clock} subtitle="consultas hoje" />
        <StatCard title="Este Mês" value={monthAppointments.length} icon={Calendar} subtitle="total do mês" />
        <StatCard title="Confirmados" value={confirmed} icon={CheckCircle} subtitle="no mês" trendUp />
        <StatCard title="Cancelados" value={canceled} icon={XCircle} subtitle="no mês" />
        <StatCard title="Faltas" value={noShow} icon={AlertTriangle} subtitle="não compareceu" />
        <StatCard title="Pacientes" value={patients.length} icon={Users} subtitle="cadastrados" trendUp />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AppointmentChart data={weekData} />
        <StatusPieChart data={pieData.length > 0 ? pieData : [{ name: "Sem dados", value: 1 }]} />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InsuranceChart data={insuranceData} />
        <TypeChart data={typeData.length > 0 ? typeData : [{ name: "Sem dados", value: 1 }]} />
      </div>
      <RecentAppointments appointments={upcoming} />
    </div>
  );
}