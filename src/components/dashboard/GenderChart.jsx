import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = { "Masculino": "#3b82f6", "Feminino": "#ec4899", "Outro": "#8b5cf6" };

export default function GenderChart({ data }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="text-sm font-semibold text-foreground mb-1">Pacientes por Sexo</h2>
      <p className="text-xs text-muted-foreground mb-3">Distribuição de gênero na base</p>
      <ResponsiveContainer width="100%" height={210}>
        <PieChart>
          <Pie data={data} cx="50%" cy="45%" outerRadius={75} innerRadius={38} dataKey="value" paddingAngle={4}>
            {data.map((d, i) => <Cell key={i} fill={COLORS[d.name] || "#6b7280"} />)}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}