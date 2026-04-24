import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

const COLORS = ["#96682c", "#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#ec4899"];

export default function CasesByAreaChart({ cases }) {
  const areaCount = {};
  cases.forEach(c => {
    if (c.area) areaCount[c.area] = (areaCount[c.area] || 0) + 1;
  });

  const data = Object.entries(areaCount)
    .map(([area, count]) => ({ area, Processos: count }))
    .sort((a, b) => b.Processos - a.Processos);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="font-semibold text-foreground mb-1">Processos por Área Jurídica</h2>
      <p className="text-xs text-muted-foreground mb-4">Distribuição de casos por especialidade</p>
      {data.length === 0 ? (
        <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">Sem dados no período</div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
            <YAxis dataKey="area" type="category" tick={{ fontSize: 11 }} width={90} />
            <Tooltip />
            <Bar dataKey="Processos" radius={[0, 4, 4, 0]}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}