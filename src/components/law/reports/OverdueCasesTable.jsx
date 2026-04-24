import moment from "moment";
import { AlertTriangle } from "lucide-react";

const STATUS_STYLE = {
  "Agendado": "bg-blue-100 text-blue-700",
  "Pendente": "bg-amber-100 text-amber-700",
};

export default function OverdueCasesTable({ cases }) {
  const today = moment().format("YYYY-MM-DD");

  const overdue = cases.filter(c =>
    c.date < today &&
    c.status !== "Realizado" &&
    c.status !== "Cancelado" &&
    c.status !== "Encerrado"
  ).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <AlertTriangle className={`w-4 h-4 ${overdue.length > 0 ? "text-red-500" : "text-muted-foreground"}`} />
        <h2 className="font-semibold text-foreground">Prazos Vencidos</h2>
        {overdue.length > 0 && (
          <span className="ml-auto bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {overdue.length} pendente{overdue.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {overdue.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          ✅ Nenhum prazo vencido em aberto
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-xs text-muted-foreground uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium">Cliente</th>
                <th className="text-left px-4 py-3 font-medium">Tipo</th>
                <th className="text-left px-4 py-3 font-medium">Área</th>
                <th className="text-left px-4 py-3 font-medium">Vara / Tribunal</th>
                <th className="text-left px-4 py-3 font-medium">Data</th>
                <th className="text-left px-4 py-3 font-medium">Atraso</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {overdue.map(c => {
                const daysLate = moment().diff(moment(c.date), "days");
                return (
                  <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground">{c.client_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.type}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.area || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.court || "—"}</td>
                    <td className="px-4 py-3 text-foreground">{moment(c.date).format("DD/MM/YYYY")}</td>
                    <td className="px-4 py-3">
                      <span className="text-red-600 font-semibold">{daysLate}d</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[c.status] || "bg-muted text-muted-foreground"}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}