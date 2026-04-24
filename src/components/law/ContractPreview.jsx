import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Edit2, Printer } from "lucide-react";

function fillTemplate(text, data) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || `{{${key}}}`);
}

export default function ContractPreview({ template, data, onEdit }) {
  const printRef = useRef(null);

  function handlePrint() {
    const content = printRef.current?.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>${template.name}</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.8; margin: 3cm 2.5cm; color: #000; }
            h1 { font-size: 14pt; text-align: center; font-weight: bold; margin-bottom: 24pt; text-transform: uppercase; }
            h2 { font-size: 12pt; font-weight: bold; margin-top: 18pt; margin-bottom: 6pt; }
            p { margin-bottom: 10pt; text-align: justify; }
            .signature-block { margin-top: 48pt; }
            .sig-line { border-top: 1px solid #000; width: 60%; margin: 0 auto 4pt; }
            .sig-label { text-align: center; font-size: 10pt; }
            @media print { body { margin: 2cm; } }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  }

  const filled = fillTemplate(template.body, data);

  const sections = filled.split("\n\n").filter(s => s.trim());

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex items-center justify-between gap-3 bg-card border border-border rounded-xl px-5 py-3">
        <p className="text-sm text-muted-foreground">Revise o contrato antes de exportar</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEdit} className="gap-2">
            <Edit2 className="w-3.5 h-3.5" /> Editar campos
          </Button>
          <Button size="sm" onClick={handlePrint} className="gap-2">
            <Printer className="w-3.5 h-3.5" /> Imprimir / Salvar PDF
          </Button>
        </div>
      </div>

      {/* Document */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div
          ref={printRef}
          className="p-10 md:p-16 text-gray-900"
          style={{ fontFamily: "'Times New Roman', Times, serif", lineHeight: "1.8", fontSize: "12pt" }}
        >
          <h1 style={{ fontSize: "14pt", textAlign: "center", fontWeight: "bold", marginBottom: "24pt", textTransform: "uppercase" }}>
            {template.name}
          </h1>

          {sections.map((section, i) => {
            const isTitle = /^(CLÁUSULA|PREÂMBULO|CONSIDERANDO|DAS |DO |DA |ART\.|§)/i.test(section.trim());
            return isTitle ? (
              <p key={i} style={{ fontWeight: "bold", marginBottom: "8pt", marginTop: "16pt" }}>
                {section.trim()}
              </p>
            ) : (
              <p key={i} style={{ marginBottom: "10pt", textAlign: "justify" }}>
                {section.trim()}
              </p>
            );
          })}

          {/* Signature block */}
          <div style={{ marginTop: "48pt" }}>
            <p style={{ textAlign: "center", marginBottom: "32pt" }}>
              {data.cidade || "_______________"}, {data.data_assinatura || "_____ de _____________ de _____"}.
            </p>
            <div style={{ display: "flex", justifyContent: "space-around", gap: "32pt" }}>
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ borderTop: "1px solid #000", marginBottom: "6pt" }} />
                <p style={{ fontSize: "10pt", margin: 0 }}>{data.contratante || "CONTRATANTE"}</p>
                {data.cpf_cnpj && <p style={{ fontSize: "9pt", color: "#555", margin: 0 }}>CPF/CNPJ: {data.cpf_cnpj}</p>}
              </div>
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ borderTop: "1px solid #000", marginBottom: "6pt" }} />
                <p style={{ fontSize: "10pt", margin: 0 }}>{data.contratado || "CONTRATADO"}</p>
                {data.oab && <p style={{ fontSize: "9pt", color: "#555", margin: 0 }}>OAB: {data.oab}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Use "Imprimir / Salvar PDF" e escolha "Salvar como PDF" na janela de impressão do navegador.
      </p>
    </div>
  );
}