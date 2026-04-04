import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AppointmentChart({ data }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Agendamentos por Semana</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Bar dataKey="agendados" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} name="Agendados" />
            <Bar dataKey="realizados" fill="hsl(var(--chart-2))" radius={[6, 6, 0, 0]} name="Realizados" />
            <Bar dataKey="cancelados" fill="hsl(var(--chart-4))" radius={[6, 6, 0, 0]} name="Cancelados" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}