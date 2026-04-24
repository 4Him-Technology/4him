import { useState } from "react";
import { DOCUMENT_TEMPLATES, DOCUMENT_CATEGORIES } from "@/lib/documentTemplates";
import { Gavel, Shield, ArrowUpCircle, AlertTriangle, FileQuestion, Unlock, Bell, Handshake, ArrowRight } from "lucide-react";

const CATEGORY_COLOR = {
  "Petição":      "bg-blue-100 text-blue-700",
  "Contestação":  "bg-emerald-100 text-emerald-700",
  "Recurso":      "bg-amber-100 text-amber-700",
  "Constitucional": "bg-purple-100 text-purple-700",
  "Extrajudicial": "bg-rose-100 text-rose-700",
};

const ICON_MAP = {
  "gavel":           Gavel,
  "shield":          Shield,
  "arrow-up-circle": ArrowUpCircle,
  "alert-triangle":  AlertTriangle,
  "file-question":   FileQuestion,
  "lock-open":       Unlock,
  "bell":            Bell,
  "handshake":       Handshake,
};

export default function DocumentTemplateList({ onSelect }) {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filtered = activeCategory === "Todos"
    ? DOCUMENT_TEMPLATES
    : DOCUMENT_TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <div className="space-y-5">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {DOCUMENT_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              activeCategory === cat
                ? "bg-amber-700 text-white border-amber-700"
                : "bg-card border-border text-muted-foreground hover:border-amber-400 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => {
          const IconComp = ICON_MAP[t.icon] || Gavel;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              className="text-left bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-amber-300 transition-all group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-700/10 flex items-center justify-center shrink-0">
                  <IconComp className="w-5 h-5 text-amber-700" />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all mt-1" />
              </div>
              <p className="font-semibold text-foreground text-sm mb-1">{t.name}</p>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{t.description}</p>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLOR[t.category] || "bg-muted text-muted-foreground"}`}>
                {t.category}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}