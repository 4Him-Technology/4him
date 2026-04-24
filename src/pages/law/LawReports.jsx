import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { BarChart2, Loader2 } from "lucide-react";
import moment from "moment";
import ReportKPIs from "@/components/law/reports/ReportKPIs";
import CasesStatusChart from "@/components/law/reports/CasesStatusChart";
import RevenueByClientChart from "@/components/law/reports/RevenueByClientChart";
import OverdueCasesTable from "@/components/law/reports/OverdueCasesTable";
import CasesByAreaChart from "@/components/law/reports/CasesByAreaChart";
import RevenueOverTimeChart from "@/components/law/reports/RevenueOverTimeChart";

const PERIOD_OPTIONS = [
  { label: "Últimos 30 dias", value: 30 },
  { label: "Últimos 3 meses", value: 90 },
  { label: "Últimos 6 meses", value: 180 },
  { label: "Último ano", value: 365 },
];

export default function LawReports() {
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [financial, setFinancial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(90);

  useEffect(() => {
    async function load() {
      const [cl, cs, fi] = await Promise.all([
        base44.entities.LegalClient.list("-created_date", 500),
        base44.entities.LegalCase.list("-date", 500),
        base44.entities.LegalFinancial.list("-date", 500),
      ]);
      setClients(cl);
      setCases(cs);
      setFinancial(fi);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" /> Carregando relatórios...
      </div>
    );
  }

  const cutoff = moment().subtract(period, "days").format("YYYY-MM-DD");
  const filteredCases = cases.filter(c => c.date >= cutoff);
  const filteredFinancial = financial.filter(f => f.date >= cutoff);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-700/10 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatórios & Análises</h1>
            <p className="text-sm text-muted-foreground">Visão analítica do escritório</p>
          </div>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {PERIOD_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                period === opt.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <ReportKPIs
        clients={clients}
        cases={filteredCases}
        financial={filteredFinancial}
        allCases={cases}
      />

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueOverTimeChart financial={filteredFinancial} period={period} />
        <CasesByAreaChart cases={filteredCases} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CasesStatusChart cases={filteredCases} />
        <RevenueByClientChart financial={filteredFinancial} />
      </div>

      {/* Overdue */}
      <OverdueCasesTable cases={cases} />
    </div>
  );
}