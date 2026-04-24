import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

const COLORS = ["#96682c", "#b5874a", "#d4a66a", "#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

const fmt = (v) => `R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

export default function RevenueByClientChart({ financial }) {
  const revenues = financial.filter(f => f.type === "Receita" && f.client_name);
  const byClient = {};
  revenues.forEach(f => {
    byClient[f.client_name] = (byClient[f.client_name] || 0) + (f.amount || 0);
  });

  const data = Object.entries(byClient)
    .map(([name, value]) => ({ name: name.split(" ").slice(0, 2).join(" "), Receita: value }))
    .sort((a, b) => b.Receita - a.Receita)
    .slice(0, 8);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="font-semibold text-foreground mb-1">Faturamento por Cliente</h2>
      <p className="text-xs text-muted-foreground mb-4">Top clientes por receita gerada no período</p>
      {data.length === 0 ? (
        <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">Sem dados no período</div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
            <YAxis tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} width={52} />
            <Tooltip formatter={v => [fmt(v), "Receita"]} />
            <Bar dataKey="Receita" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}