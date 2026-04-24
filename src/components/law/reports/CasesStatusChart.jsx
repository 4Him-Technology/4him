import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const STATUS_COLORS = {
  "Agendado": "#3b82f6",
  "Realizado": "#10b981",
  "Pendente": "#f59e0b",
  "Cancelado": "#ef4444",
  "Encerrado": "#6b7280",
};

export default function CasesStatusChart({ cases }) {
  const statusCount = {};
  cases.forEach(c => {
    if (c.status) statusCount[c.status] = (statusCount[c.status] || 0) + 1;
  });

  const data = Object.entries(statusCount).map(([status, value]) => ({ name: status, value }));
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="font-semibold text-foreground mb-1">Status dos Processos</h2>
      <p className="text-xs text-muted-foreground mb-4">Proporção por status no período</p>
      {data.length === 0 ? (
        <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">Sem dados no período</div>
      ) : (
        <div className="flex items-center gap-4">
          <ResponsiveContainer width="55%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLORS[entry.name] || "#96682c"} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v} (${((v / total) * 100).toFixed(0)}%)`, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-2">
            {data.map((d, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLORS[d.name] || "#96682c" }} />
                  <span className="text-xs text-foreground">{d.name}</span>
                </div>
                <span className="text-xs font-semibold text-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}