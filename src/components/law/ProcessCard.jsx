import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2, Calendar, ExternalLink, LinkIcon, Scale,
  User, ChevronDown, ChevronUp, DollarSign
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const statusColors = {
  "Ativo": "bg-emerald-100 text-emerald-700",
  "Encerrado": "bg-gray-100 text-gray-600",
  "Suspenso": "bg-amber-100 text-amber-700",
  "Arquivado": "bg-red-100 text-red-600",
};

const areaColors = {
  "Cível": "bg-blue-100 text-blue-700",
  "Criminal": "bg-red-100 text-red-700",
  "Trabalhista": "bg-orange-100 text-orange-700",
  "Família": "bg-pink-100 text-pink-700",
  "Tributário": "bg-purple-100 text-purple-700",
  "Empresarial": "bg-indigo-100 text-indigo-700",
  "Previdenciário": "bg-teal-100 text-teal-700",
  "Outro": "bg-gray-100 text-gray-600",
};

export default function ProcessCard({ processo, onLink }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card rounded-xl border border-border hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-amber-700/10 flex items-center justify-center shrink-0 mt-0.5">
              <Scale className="w-4 h-4 text-amber-700" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="font-semibold text-foreground text-sm font-mono">{processo.numero || "Nº não disponível"}</p>
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", statusColors[processo.status] || "bg-gray-100 text-gray-600")}>
                  {processo.status || "—"}
                </span>
              </div>
              <p className="text-sm text-foreground font-medium">{processo.classe || processo.assunto}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{processo.assunto}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {processo.area && (
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", areaColors[processo.area] || "bg-gray-100 text-gray-600")}>
                    {processo.area}
                  </span>
                )}
                {processo.tribunal && (
                  <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Building2 className="w-2.5 h-2.5" /> {processo.tribunal}
                  </span>
                )}
                {processo.fonte && (
                  <span className="text-[10px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                    via {processo.fonte}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {processo.numero && (
              <a
                href={`https://www.jusbrasil.com.br/consulta-processual/busca?q=${encodeURIComponent(processo.numero)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                title="Abrir no JusBrasil"
              >
                <ExternalLink className="w-3.5 h-3.5" /> JusBrasil
              </a>
            )}
            <Button
              size="sm"
              onClick={onLink}
              className="gap-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs"
            >
              <LinkIcon className="w-3.5 h-3.5" /> Vincular
            </Button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quick info row */}
        <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-border/50">
          {processo.partes?.autor && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              <span className="font-medium text-foreground">Autor:</span> {processo.partes.autor}
            </div>
          )}
          {processo.partes?.reu && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              <span className="font-medium text-foreground">Réu:</span> {processo.partes.reu}
            </div>
          )}
          {processo.data_ultima_movimentacao && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span className="font-medium text-foreground">Última mov.:</span> {processo.data_ultima_movimentacao}
            </div>
          )}
          {processo.valor_causa && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <DollarSign className="w-3 h-3" />
              <span className="font-medium text-foreground">Valor:</span> {processo.valor_causa}
            </div>
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-4 space-y-3 border-t border-border/50 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {processo.vara && (
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Vara</p>
                <p className="text-sm text-foreground">{processo.vara}</p>
              </div>
            )}
            {processo.data_distribuicao && (
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Distribuído em</p>
                <p className="text-sm text-foreground">{processo.data_distribuicao}</p>
              </div>
            )}
          </div>
          {processo.ultima_movimentacao && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Última Movimentação</p>
              <p className="text-sm text-foreground bg-muted/40 rounded-lg px-3 py-2">{processo.ultima_movimentacao}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}