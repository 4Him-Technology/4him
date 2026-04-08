import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#96682c", "#c49a4a", "#e05252", "#3b82f6"];

export default function TypeChart({ data }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="text-sm font-semibold text-foreground mb-1">Tipos de Atendimento</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="45%" outerRadius={75} innerRadius={40} dataKey="value" paddingAngle={3}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}