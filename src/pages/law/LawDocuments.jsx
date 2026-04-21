import { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  FileText, Upload, X, Loader2, Wand2, Download, Copy, Trash2,
  Image, FileAudio, File, Plus, ChevronLeft
} from "lucide-react";

const TIPOS_PECA = [
  "Petição Inicial",
  "Contestação",
  "Recurso de Apelação",
  "Agravo de Instrumento",
  "Embargos de Declaração",
  "Habeas Corpus",
  "Mandado de Segurança",
  "Contrarrazões",
  "Memorial",
  "Contrato",
  "Parecer Jurídico",
  "Procuração",
  "Notificação Extrajudicial",
  "Acordo Extrajudicial",
  "Outro",
];

function FileIcon({ type }) {
  if (type.startsWith("image/")) return <Image className="w-4 h-4 text-blue-500" />;
  if (type.startsWith("audio/")) return <FileAudio className="w-4 h-4 text-purple-500" />;
  return <File className="w-4 h-4 text-amber-600" />;
}

export default function LawDocuments() {
  const [step, setStep] = useState("form"); // "form" | "result"
  const [tipoPeca, setTipoPeca] = useState("");
  const [clientName, setClientName] = useState("");
  const [contexto, setContexto] = useState("");
  const [instrucoes, setInstrucoes] = useState("");
  const [files, setFiles] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [resultado, setResultado] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  function handleFileSelect(e) {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = "";
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  async function handleGenerate() {
    if (!tipoPeca) { setError("Selecione o tipo de peça jurídica."); return; }
    setError("");
    setGenerating(true);

    try {
      // Upload all files and collect URLs
      const fileUrls = [];
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        fileUrls.push({ name: file.name, url: file_url, type: file.type });
      }

      const prompt = `Você é um advogado especialista em redação jurídica brasileira. 
Redija uma ${tipoPeca} completa e profissional com base nas informações abaixo.

**Tipo de Peça:** ${tipoPeca}
**Cliente:** ${clientName || "Não informado"}
**Contexto / Fatos:** 
${contexto || "Não informado"}

**Instruções adicionais:**
${instrucoes || "Nenhuma"}

${fileUrls.length > 0 ? `**Arquivos enviados para análise:** ${fileUrls.map(f => f.name).join(", ")}` : ""}

Redija a peça completa, formatada profissionalmente, com:
- Cabeçalho (Excelentíssimo Senhor / Vara / Tribunal)
- Qualificação das partes
- Dos Fatos
- Do Direito (com citação de leis e jurisprudências relevantes)
- Dos Pedidos
- Fechamento e assinatura

Use linguagem jurídica formal e precisa. Formate o documento com markdown para melhor leitura.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        file_urls: fileUrls.map(f => f.url),
        model: "claude_sonnet_4_6",
      });

      setResultado(typeof response === "string" ? response : JSON.stringify(response));
      setStep("result");
    } catch (e) {
      setError("Erro ao gerar a peça: " + e.message);
    }
    setGenerating(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(resultado);
  }

  function handleDownload() {
    const blob = new Blob([resultado], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tipoPeca || "peca-juridica"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setStep("form");
    setResultado("");
    setFiles([]);
    setContexto("");
    setInstrucoes("");
    setClientName("");
    setTipoPeca("");
    setError("");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-700/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gerador de Peças Jurídicas</h1>
          <p className="text-sm text-muted-foreground">IA especializada para criação de documentos jurídicos</p>
        </div>
      </div>

      {step === "form" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left - Inputs */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <h2 className="font-semibold text-foreground">Informações da Peça</h2>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tipo de Peça *</label>
                <Select value={tipoPeca} onValueChange={setTipoPeca}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de peça..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_PECA.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nome do Cliente</label>
                <Input
                  placeholder="Ex: Carlos Eduardo Mendonça"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Contexto / Fatos do Caso</label>
                <Textarea
                  placeholder="Descreva os fatos, o contexto do caso, datas relevantes, partes envolvidas, pedidos desejados..."
                  value={contexto}
                  onChange={(e) => setContexto(e.target.value)}
                  className="min-h-[140px] resize-y"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Instruções Adicionais (opcional)</label>
                <Textarea
                  placeholder="Ex: Incluir pedido de tutela de urgência, citar o art. 927 do CC, tom mais agressivo..."
                  value={instrucoes}
                  onChange={(e) => setInstrucoes(e.target.value)}
                  className="min-h-[80px] resize-y"
                />
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full h-12 text-base gap-2"
            >
              {generating ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Gerando peça com IA...</>
              ) : (
                <><Wand2 className="w-5 h-5" /> Gerar Peça Jurídica</>
              )}
            </Button>

            {generating && (
              <p className="text-xs text-center text-muted-foreground">
                A IA está analisando os dados e redigindo o documento. Isso pode levar alguns segundos...
              </p>
            )}
          </div>

          {/* Right - File Upload */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <h2 className="font-semibold text-foreground">Anexar Arquivos</h2>
              <p className="text-xs text-muted-foreground">
                Envie fotos de documentos, áudios, contratos, prints ou qualquer material relacionado ao caso. A IA analisará tudo automaticamente.
              </p>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 hover:border-amber-600/50 hover:bg-amber-50/30 transition-colors cursor-pointer"
              >
                <Upload className="w-7 h-7 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Clique para enviar</span>
                <span className="text-xs text-muted-foreground">Fotos, PDFs, áudios, textos</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,audio/*,.pdf,.txt,.doc,.docx"
                className="hidden"
                onChange={handleFileSelect}
              />

              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                      <FileIcon type={file.type} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-[10px] text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                      <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {files.length === 0 && (
                <div className="text-center py-2">
                  <p className="text-xs text-muted-foreground">Nenhum arquivo anexado</p>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-amber-800">💡 Dicas para melhores resultados</p>
              <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
                <li>Descreva os fatos em ordem cronológica</li>
                <li>Informe nomes completos e datas</li>
                <li>Adicione fotos de documentos relevantes</li>
                <li>Indique o tribunal ou vara destino</li>
                <li>Mencione pedidos específicos que deseja</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {step === "result" && (
        <div className="space-y-4">
          {/* Result toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-card rounded-xl border border-border px-5 py-3">
            <div className="flex items-center gap-3">
              <button onClick={handleReset} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="w-4 h-4" /> Nova Peça
              </button>
              <div className="w-px h-4 bg-border" />
              <Badge className="bg-amber-100 text-amber-800 border-0">{tipoPeca}</Badge>
              {clientName && <span className="text-sm text-muted-foreground">· {clientName}</span>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
                <Copy className="w-3.5 h-3.5" /> Copiar
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1.5">
                <Download className="w-3.5 h-3.5" /> Baixar
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5 text-destructive hover:text-destructive">
                <Trash2 className="w-3.5 h-3.5" /> Descartar
              </Button>
            </div>
          </div>

          {/* Document */}
          <div className="bg-white rounded-xl border border-border shadow-sm">
            <div className="px-8 py-10 max-w-4xl mx-auto">
              <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {resultado}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleReset} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" /> Criar Nova Peça
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}