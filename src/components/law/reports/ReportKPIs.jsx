import moment from "moment";
import { Users, Briefcase, DollarSign, AlertTriangle, TrendingUp, Clock } from "lucide-react";

function KPICard({ title, value, subtitle, icon: Icon, color, trend }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      {trend !== undefined && (
        <p className={`text-xs font-medium mt-2 ${trend >= 0 ? "text-emerald-600" : "text-red-500"}`}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend).toFixed(0)}% vs. período anterior
        </p>
      )}
    </div>
  );
}

export default function ReportKPIs({ clients, cases, financial, allCases }) {
  const today = moment().format("YYYY-MM-DD");

  const totalRevenue = financial.filter(f => f.type === "Receita").reduce((s, f) => s + (f.amount || 0), 0);
  const totalCost = financial.filter(f => f.type === "Custo").reduce((s, f) => s + (f.amount || 0), 0);
  const profit = totalRevenue - totalCost;
  const activeClients = clients.filter(c => c.status === "Ativo").length;
  const overdueCases = allCases.filter(c =>
    c.date < today && c.status !== "Realizado" && c.status !== "Cancelado" && c.status !== "Encerrado"
  ).length;
  const pendingCases = cases.filter(c => c.status === "Pendente" || c.status === "Agendado").length;

  const fmt = (n) => `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <KPICard title="Receita" value={fmt(totalRevenue)} subtitle="no período" icon={DollarSign} color="bg-emerald-100 text-emerald-600" />
      <KPICard title="Custos" value={fmt(totalCost)} subtitle="no período" icon={TrendingUp} color="bg-red-100 text-red-500" />
      <KPICard title="Lucro" value={fmt(profit)} subtitle="receita - custos" icon={TrendingUp} color={profit >= 0 ? "bg-primary/10 text-primary" : "bg-red-100 text-red-600"} />
      <KPICard title="Clientes Ativos" value={activeClients} subtitle={`${clients.length} total`} icon={Users} color="bg-blue-100 text-blue-600" />
      <KPICard title="Compromissos" value={pendingCases} subtitle="agendados/pendentes" icon={Briefcase} color="bg-amber-100 text-amber-600" />
      <KPICard title="Prazos Vencidos" value={overdueCases} subtitle="atenção necessária" icon={AlertTriangle} color={overdueCases > 0 ? "bg-red-100 text-red-600" : "bg-muted text-muted-foreground"} />
    </div>
  );
}