import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function FinancialSummaryChart({ data }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="text-sm font-semibold text-foreground mb-1">Receita vs Custos (últimos 6 meses)</h2>
      <p className="text-xs text-muted-foreground mb-3">Evolução financeira do consultório</p>
      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="custoGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false}
            tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }}
            formatter={(v, n) => [`R$ ${v.toLocaleString("pt-BR")}`, n === "receita" ? "Receita" : "Custo"]} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="receita" name="receita" stroke="#22c55e" strokeWidth={2.5} fill="url(#recGrad)" dot={{ r: 3, fill: "#22c55e" }} />
          <Area type="monotone" dataKey="custo" name="custo" stroke="#ef4444" strokeWidth={2.5} fill="url(#custoGrad)" dot={{ r: 3, fill: "#ef4444" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}