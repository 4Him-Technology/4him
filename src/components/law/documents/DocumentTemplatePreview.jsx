import { Button } from "@/components/ui/button";
import { Printer, Pencil, Copy, Check } from "lucide-react";
import { useState } from "react";

function fillTemplate(body, data) {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || `[${key}]`);
}

export default function DocumentTemplatePreview({ template, data, onEdit }) {
  const [copied, setCopied] = useState(false);
  const filled = fillTemplate(template.body, data);

  function handlePrint() {
    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html><html><head>
      <meta charset="utf-8">
      <title>${template.name}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.8;
               margin: 3cm 3cm 2cm 4cm; color: #000; text-align: justify; }
        pre { white-space: pre-wrap; font-family: inherit; font-size: inherit; }
        h1 { font-size: 13pt; text-align: center; margin-bottom: 24pt; }
        @media print { @page { size: A4; margin: 3cm 3cm 2cm 4cm; } }
      </style>
      </head><body>
      <h1>${template.name.toUpperCase()}</h1>
      <pre>${filled}</pre>
      </body></html>
    `);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 400);
  }

  function handleCopy() {
    navigator.clipboard.writeText(filled);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const lines = filled.split("\n");

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-muted-foreground">
          Revise o documento abaixo antes de exportar.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
            <Pencil className="w-3.5 h-3.5" /> Editar dados
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copiado!" : "Copiar texto"}
          </Button>
          <Button size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="w-3.5 h-3.5" /> Imprimir / PDF
          </Button>
        </div>
      </div>

      {/* Document preview */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="bg-muted/40 border-b border-border px-6 py-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{template.name}</p>
        </div>
        <div className="px-10 py-8 max-w-3xl mx-auto">
          <div
            className="font-serif text-sm leading-relaxed text-gray-900 text-justify space-y-0"
            style={{ fontFamily: "'Times New Roman', serif", lineHeight: "1.9" }}
          >
            {lines.map((line, i) => {
              if (!line.trim()) return <div key={i} className="h-3" />;
              const isHeader = /^[IVX]+\s*[–—-]/.test(line.trim()) || /^[A-ZÁÉÍÓÚÃÕÂÊÔÇ\s]{8,}$/.test(line.trim());
              return (
                <p key={i} className={`${isHeader ? "font-bold mt-5 mb-1" : ""}`}>
                  {line}
                </p>
              );
            })}
          </div>

          {/* Signature block */}
          <div className="mt-12 grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="border-t border-gray-400 pt-2">
                <p className="text-xs font-serif text-gray-700">{data.autor || data.recorrente || data.agravante || data.embargante || data.notificante || data.parte1 || "Parte 1"}</p>
                <p className="text-[10px] text-gray-500">Assinatura</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-400 pt-2">
                <p className="text-xs font-serif text-gray-700">{data.advogado || "Advogado(a)"}</p>
                <p className="text-[10px] text-gray-500">{data.oab || "OAB"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}