import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

export default function AttendanceRateChart({ rate, realized, noShow, canceled }) {
  const data = [{ value: rate }];
  const color = rate >= 80 ? "#22c55e" : rate >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center justify-center">
      <h2 className="text-sm font-semibold text-foreground mb-1 self-start">Taxa de Comparecimento</h2>
      <p className="text-xs text-muted-foreground mb-2 self-start">Consultas realizadas vs agendadas</p>
      <ResponsiveContainer width="100%" height={150}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={data} startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={8} fill={color} background={{ fill: "hsl(var(--muted))" }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <p className="text-3xl font-bold -mt-14" style={{ color }}>{rate}%</p>
      <p className="text-xs text-muted-foreground mt-10">taxa de presença</p>
      <div className="flex gap-4 mt-4 text-xs text-center">
        <div><p className="font-semibold text-emerald-600">{realized}</p><p className="text-muted-foreground">Realizados</p></div>
        <div><p className="font-semibold text-amber-600">{noShow}</p><p className="text-muted-foreground">Faltas</p></div>
        <div><p className="font-semibold text-red-600">{canceled}</p><p className="text-muted-foreground">Cancelados</p></div>
      </div>
    </div>
  );
}