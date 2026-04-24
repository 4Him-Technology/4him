import moment from "moment";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

function buildMonthlyData(financial, period) {
  const months = [];
  const numMonths = period <= 30 ? 1 : period <= 90 ? 3 : period <= 180 ? 6 : 12;
  for (let i = numMonths - 1; i >= 0; i--) {
    months.push(moment().subtract(i, "months").format("YYYY-MM"));
  }
  return months.map(month => {
    const revenue = financial.filter(f => f.type === "Receita" && f.date?.startsWith(month)).reduce((s, f) => s + (f.amount || 0), 0);
    const cost = financial.filter(f => f.type === "Custo" && f.date?.startsWith(month)).reduce((s, f) => s + (f.amount || 0), 0);
    return {
      month: moment(month, "YYYY-MM").format("MMM/YY"),
      Receita: revenue,
      Custo: cost,
      Lucro: revenue - cost,
    };
  });
}

const fmt = (v) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

export default function RevenueOverTimeChart({ financial, period }) {
  const data = buildMonthlyData(financial, period);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="font-semibold text-foreground mb-1">Faturamento ao Longo do Tempo</h2>
      <p className="text-xs text-muted-foreground mb-4">Receitas, custos e lucro por mês</p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} width={52} />
          <Tooltip formatter={(v, n) => [fmt(v), n]} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Area type="monotone" dataKey="Receita" stroke="#10b981" fill="url(#revGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="Custo" stroke="#ef4444" fill="url(#costGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="Lucro" stroke="#96682c" fill="transparent" strokeWidth={2} strokeDasharray="4 2" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}