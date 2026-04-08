import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function WhatsAppActivityChart({ data, aiRate }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h2 className="text-sm font-semibold text-foreground mb-1">Atividade WhatsApp</h2>
      <p className="text-xs text-muted-foreground mb-3">
        Mensagens enviadas e recebidas · IA respondeu <span className="font-semibold text-primary">{aiRate}%</span> das mensagens
      </p>
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={data} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="contact" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="recebidas" name="Recebidas" fill="#25d366" radius={[4, 4, 0, 0]} />
          <Bar dataKey="enviadas" name="Enviadas" fill="#128C7E" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}