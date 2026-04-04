import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { cn } from "@/lib/utils";
import moment from "moment";
import FinancialRecordModal from "../components/financial/FinancialRecordModal";

const COLORS_REVENUE = "#96682c";
const COLORS_COST = "#e05252";
const PIE_COLORS = ["#96682c", "#c49a4a", "#e0bd7a", "#e05252", "#e07c52", "#a03030", "#6b4820", "#b07830"];

const StatCard = ({ title, value, icon: Icon, color, sub }) => (
  <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", color)}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground font-medium">{title}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  </div>
);

const fmt = (v) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export default function FinancialAnalysis() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const data = await base44.entities.FinancialRecord.list("-date", 500);
    setRecords(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Filter by period
  const now = moment();
  const filtered = records.filter(r => {
    const d = moment(r.date);
    if (period === "month") return d.isSame(now, "month");
    if (period === "quarter") return d.isSameOrAfter(now.clone().subtract(3, "months"));
    if (period === "year") return d.isSame(now, "year");
    return true;
  });

  const revenues = filtered.filter(r => r.type === "Receita");
  const costs = filtered.filter(r => r.type === "Custo");
  const totalRevenue = revenues.reduce((s, r) => s + (r.amount || 0), 0);
  const totalCost = costs.reduce((s, r) => s + (r.amount || 0), 0);
  const profit = totalRevenue - totalCost;
  const margin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : 0;

  // Monthly bar chart (last 6 months)
  const barData = Array.from({ length: 6 }, (_, i) => {
    const m = moment().subtract(5 - i, "months");
    const label = m.format("MMM");
    const monthRecords = records.filter(r => moment(r.date).isSame(m, "month"));
    return {
      name: label,
      Receita: monthRecords.filter(r => r.type === "Receita").reduce((s, r) => s + (r.amount || 0), 0),
      Custo: monthRecords.filter(r => r.type === "Custo").reduce((s, r) => s + (r.amount || 0), 0),
    };
  });

  // Pie chart by category
  const categoryMap = {};
  filtered.forEach(r => {
    if (!categoryMap[r.category]) categoryMap[r.category] = 0;
    categoryMap[r.category] += r.amount || 0;
  });
  const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  const handleDelete = async (id) => {
    await base44.entities.FinancialRecord.delete(id);
    load();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Análise Financeira</h1>
          <p className="text-sm text-muted-foreground mt-1">Acompanhe receitas, custos e lucro do consultório</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Este mês</SelectItem>
              <SelectItem value="quarter">Últimos 3 meses</SelectItem>
              <SelectItem value="year">Este ano</SelectItem>
              <SelectItem value="all">Todos</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => { setEditing(null); setModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-1" /> Lançamento
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Receita Total" value={fmt(totalRevenue)} icon={TrendingUp} color="bg-emerald-500" sub={`${revenues.length} lançamentos`} />
        <StatCard title="Custos Totais" value={fmt(totalCost)} icon={TrendingDown} color="bg-rose-500" sub={`${costs.length} lançamentos`} />
        <StatCard title="Lucro Líquido" value={fmt(profit)} icon={DollarSign} color={profit >= 0 ? "bg-primary" : "bg-rose-600"} sub={profit >= 0 ? "Positivo" : "Negativo"} />
        <StatCard title="Margem de Lucro" value={`${margin}%`} icon={PiggyBank} color="bg-amber-500" sub="Sobre a receita" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Receitas vs Custos — Últimos 6 meses</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => fmt(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="Receita" fill={COLORS_REVENUE} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Custo" fill={COLORS_COST} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Distribuição por Categoria</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Sem dados</div>
          )}
        </div>
      </div>

      {/* Records table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Lançamentos do período</h2>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Nenhum lançamento no período selecionado</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Data</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Descrição</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Categoria</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Tipo</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground">Valor</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 text-muted-foreground">{moment(r.date).format("DD/MM/YYYY")}</td>
                    <td className="px-5 py-3 font-medium">{r.description}</td>
                    <td className="px-5 py-3 text-muted-foreground">{r.category}</td>
                    <td className="px-5 py-3">
                      <span className={cn("text-xs px-2 py-1 rounded-full font-medium",
                        r.type === "Receita" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      )}>
                        {r.type}
                      </span>
                    </td>
                    <td className={cn("px-5 py-3 text-right font-semibold",
                      r.type === "Receita" ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {r.type === "Receita" ? "+" : "-"}{fmt(r.amount)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditing(r); setModalOpen(true); }}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(r.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FinancialRecordModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        record={editing}
        onSaved={load}
      />
    </div>
  );
}