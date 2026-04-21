import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Users, Briefcase, DollarSign, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import moment from "moment";

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}

export default function LawDashboard() {
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [financial, setFinancial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [c, cs, f] = await Promise.all([
        base44.entities.LegalClient.list("-created_date", 500),
        base44.entities.LegalCase.list("-date", 500),
        base44.entities.LegalFinancial.list("-date", 500),
      ]);
      setClients(c);
      setCases(cs);
      setFinancial(f);
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

  const activeClients = clients.filter(c => c.status === "Ativo").length;
  const upcomingCases = cases.filter(c => c.date >= today && c.status !== "Cancelado" && c.status !== "Encerrado");
  const monthRevenue = financial.filter(f => f.type === "Receita" && f.date?.startsWith(thisMonth)).reduce((s, f) => s + (f.amount || 0), 0);
  const monthCost = financial.filter(f => f.type === "Custo" && f.date?.startsWith(thisMonth)).reduce((s, f) => s + (f.amount || 0), 0);
  const monthProfit = monthRevenue - monthCost;

  const areaCount = {};
  cases.forEach(c => { if (c.area) areaCount[c.area] = (areaCount[c.area] || 0) + 1; });
  const topArea = Object.entries(areaCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Jurídico</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral do escritório de advocacia</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Clientes Ativos" value={activeClients} subtitle={`${clients.length} total`} icon={Users} color="bg-blue-100 text-blue-600" />
        <StatCard title="Agendamentos Futuros" value={upcomingCases.length} subtitle="processos e audiências" icon={Calendar} color="bg-amber-100 text-amber-600" />
        <StatCard title="Receita do Mês" value={`R$ ${monthRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`} subtitle="honorários e serviços" icon={DollarSign} color="bg-emerald-100 text-emerald-600" />
        <StatCard title="Lucro do Mês" value={`R$ ${monthProfit.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`} subtitle={`Área principal: ${topArea}`} icon={TrendingUp} color={monthProfit >= 0 ? "bg-primary/10 text-primary" : "bg-red-100 text-red-600"} />
      </div>

      {/* Upcoming cases */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <h2 className="font-semibold text-foreground">Próximos Compromissos</h2>
        </div>
        <div className="divide-y divide-border">
          {upcomingCases.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum compromisso agendado</p>
          )}
          {upcomingCases.slice(0, 8).map(c => (
            <div key={c.id} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{c.client_name}</p>
                <p className="text-xs text-muted-foreground">{c.type} · {c.area} {c.court && `· ${c.court}`}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{moment(c.date).format("DD/MM/YYYY")}</p>
                {c.time && <p className="text-xs text-muted-foreground">{c.time}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent clients */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Clientes Recentes</h2>
        </div>
        <div className="divide-y divide-border">
          {clients.slice(0, 5).map(c => (
            <div key={c.id} className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {c.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{c.full_name}</p>
                  <p className="text-xs text-muted-foreground">{c.area || "—"} · {c.phone}</p>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.status === "Ativo" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                {c.status || "Ativo"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}