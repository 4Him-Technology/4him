import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function InsuranceChart({ data }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="text-sm font-semibold text-foreground mb-4">Atendimentos por Convênio</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={80} />
          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
          <Bar dataKey="total" name="Atendimentos" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}