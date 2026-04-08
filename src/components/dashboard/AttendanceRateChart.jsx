import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

export default function AttendanceRateChart({ rate, realized, noShow, canceled }) {
  const data = [{ value: rate }];
  const color = rate >= 80 ? "#22c55e" : rate >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col">
      <h2 className="text-sm font-semibold text-foreground mb-1">Taxa de Comparecimento</h2>
      <p className="text-xs text-muted-foreground mb-4">Consultas realizadas vs agendadas</p>

      <div className="flex flex-col items-center justify-center flex-1">
        <div className="relative w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="95%" data={data} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" cornerRadius={8} fill={color} background={{ fill: "hsl(var(--muted))" }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold" style={{ color }}>{rate}%</span>
            <span className="text-[10px] text-muted-foreground">presença</span>
          </div>
        </div>

        <div className="flex gap-6 mt-4 text-xs text-center">
          <div><p className="font-bold text-emerald-600 text-lg">{realized}</p><p className="text-muted-foreground">Realizados</p></div>
          <div><p className="font-bold text-amber-600 text-lg">{noShow}</p><p className="text-muted-foreground">Faltas</p></div>
          <div><p className="font-bold text-red-600 text-lg">{canceled}</p><p className="text-muted-foreground">Cancelados</p></div>
        </div>
      </div>
    </div>
  );
}