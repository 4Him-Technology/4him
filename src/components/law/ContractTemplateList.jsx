import { TEMPLATES } from "@/lib/contractTemplates";
import { FileSignature, ArrowRight } from "lucide-react";

const CATEGORY_COLOR = {
  "Prestação de Serviços": "bg-blue-100 text-blue-700",
  "Honorários": "bg-amber-100 text-amber-700",
  "Trabalhista": "bg-emerald-100 text-emerald-700",
  "Locação": "bg-purple-100 text-purple-700",
  "Sigilo": "bg-rose-100 text-rose-700",
  "Consultoria": "bg-indigo-100 text-indigo-700",
};

export default function ContractTemplateList({ onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t)}
          className="text-left bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-amber-300 transition-all group"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-700/10 flex items-center justify-center shrink-0">
              <FileSignature className="w-5 h-5 text-amber-700" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all mt-1" />
          </div>
          <p className="font-semibold text-foreground text-sm mb-1">{t.name}</p>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{t.description}</p>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLOR[t.category] || "bg-muted text-muted-foreground"}`}>
            {t.category}
          </span>
        </button>
      ))}
    </div>
  );
}