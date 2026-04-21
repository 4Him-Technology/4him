import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  FileText, Wand2, Loader2, Copy, Download, Trash2,
  Check, ChevronLeft, Send, Sparkles, MousePointer2, RotateCcw, Save
} from "lucide-react";

export default function DocumentEditor({
  resultado,
  setResultado,
  tipoPeca,
  clientName,
  onBack,
  onDelete,
  onSave,
  backLabel = "Voltar",
}) {
  const [prompt, setPrompt] = useState("");
  const [applying, setApplying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [selectionTooltip, setSelectionTooltip] = useState(null); // {x, y}
  const [history, setHistory] = useState([resultado]);
  const textareaRef = useRef(null);
  const tooltipRef = useRef(null);

  // Track text selection in textarea
  function handleTextareaSelect() {
    const ta = textareaRef.current;
    if (!ta) return;
    const sel = ta.value.substring(ta.selectionStart, ta.selectionEnd).trim();
    if (sel.length > 5) {
      setSelectedText(sel);
      // Get caret position
      const rect = ta.getBoundingClientRect();
      setSelectionTooltip({ x: rect.left + rect.width / 2, y: rect.top - 12 });
    } else {
      setSelectedText("");
      setSelectionTooltip(null);
    }
  }

  // Close tooltip on click outside
  useEffect(() => {
    function onMouseDown(e) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target) && e.target !== textareaRef.current) {
        setSelectionTooltip(null);
        setSelectedText("");
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  function useSelectedText() {
    if (!selectedText) return;
    setPrompt(`Sobre o trecho selecionado: "${selectedText.slice(0, 120)}${selectedText.length > 120 ? "..." : ""}" — `);
    setSelectionTooltip(null);
    document.querySelector("#prompt-input")?.focus();
  }

  async function handleApplyPrompt() {
    if (!prompt.trim() || applying) return;
    setApplying(true);

    const contextNote = selectedText
      ? `\n\nO usuário selecionou o seguinte trecho específico do documento para ser alterado:\n"""\n${selectedText}\n"""\n\nAplique a instrução prioritariamente neste trecho, mas mantenha o restante do documento coerente.`
      : "";

    const aiPrompt = `Você é um advogado especialista em redação jurídica brasileira.
Abaixo está uma peça jurídica do tipo "${tipoPeca}"${clientName ? ` para o cliente "${clientName}"` : ""}.

DOCUMENTO ATUAL:
"""
${resultado}
"""
${contextNote}

INSTRUÇÃO DO USUÁRIO:
${prompt}

Retorne APENAS o documento completo atualizado, sem explicações, sem comentários, sem markdown extra. Apenas o texto da peça jurídica revisada.`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: aiPrompt,
      model: "claude_sonnet_4_6",
    });

    const novoTexto = typeof response === "string" ? response : JSON.stringify(response);
    setHistory((h) => [...h, resultado]);
    setResultado(novoTexto);
    setPrompt("");
    setSelectedText("");
    setSelectionTooltip(null);
    setApplying(false);
  }

  function handleUndo() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setResultado(prev);
    setHistory((h) => h.slice(0, -1));
  }

  function handleCopy() {
    navigator.clipboard.writeText(resultado);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  async function handleSave() {
    if (onSave) {
      await onSave(resultado);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[600px]">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-3 bg-card rounded-xl border border-border px-5 py-3 mb-3 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> {backLabel}
          </button>
          <div className="w-px h-4 bg-border" />
          <Badge className="bg-amber-100 text-amber-800 border-0 text-xs">{tipoPeca}</Badge>
          {clientName && <span className="text-sm text-muted-foreground truncate max-w-[160px]">· {clientName}</span>}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            disabled={history.length === 0}
            title="Desfazer última alteração"
            className="gap-1.5 text-muted-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desfazer</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5 text-muted-foreground">
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copiado!" : "Copiar"}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload} className="gap-1.5 text-muted-foreground">
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Baixar</span>
          </Button>
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={onDelete} className="gap-1.5 text-destructive hover:text-destructive">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
          {onSave && (
            <Button size="sm" onClick={handleSave} className="gap-1.5 bg-amber-700 hover:bg-amber-800 text-white">
              {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              {saved ? "Salvo!" : "Salvar"}
            </Button>
          )}
        </div>
      </div>

      {/* Main split layout */}
      <div className="flex flex-1 gap-3 min-h-0">
        {/* Left: Document editor */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-border shadow-sm min-h-0 relative">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/60 shrink-0">
            <FileText className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-xs text-muted-foreground font-medium">Documento</span>
            <span className="ml-auto text-[10px] text-muted-foreground/60 flex items-center gap-1">
              <MousePointer2 className="w-3 h-3" /> Selecione um trecho para editar com IA
            </span>
          </div>
          <Textarea
            ref={textareaRef}
            value={resultado}
            onChange={(e) => setResultado(e.target.value)}
            onSelect={handleTextareaSelect}
            onMouseUp={handleTextareaSelect}
            onKeyUp={handleTextareaSelect}
            className="flex-1 font-mono text-sm border-0 shadow-none focus-visible:ring-0 resize-none p-6 leading-relaxed rounded-b-xl"
          />
          {/* Selection tooltip */}
          {selectionTooltip && selectedText && (
            <div
              ref={tooltipRef}
              className="fixed z-50 transform -translate-x-1/2"
              style={{ left: selectionTooltip.x, top: selectionTooltip.y }}
            >
              <button
                onClick={useSelectedText}
                className="flex items-center gap-1.5 bg-amber-700 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg hover:bg-amber-800 transition-colors whitespace-nowrap"
              >
                <Sparkles className="w-3 h-3" /> Editar com IA
              </button>
            </div>
          )}
        </div>

        {/* Right: AI Prompt panel */}
        <div className="w-80 shrink-0 flex flex-col bg-card rounded-xl border border-border shadow-sm min-h-0">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/60 shrink-0">
            <Wand2 className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-xs font-medium text-foreground">Assistente IA</span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {/* Instructions */}
            <div className="bg-amber-50/60 border border-amber-200/60 rounded-lg p-3 space-y-1.5">
              <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Como usar
              </p>
              <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
                <li>Digite uma instrução e clique em Aplicar</li>
                <li>Selecione um trecho e clique "Editar com IA"</li>
                <li>Use Desfazer para reverter alterações</li>
              </ul>
            </div>

            {/* Quick prompts */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Sugestões rápidas</p>
              {[
                "Torne o texto mais formal e técnico",
                "Adicione pedido de tutela de urgência",
                "Inclua citação ao art. 5º da CF/88",
                "Reforce os argumentos jurídicos",
                "Corrija erros gramaticais e ortográficos",
                "Adapte para o TRT da 2ª Região",
              ].map((sugestao) => (
                <button
                  key={sugestao}
                  onClick={() => setPrompt(sugestao)}
                  className="w-full text-left text-xs px-3 py-2 rounded-lg bg-muted/50 hover:bg-amber-50 hover:text-amber-800 transition-colors border border-transparent hover:border-amber-200/60"
                >
                  {sugestao}
                </button>
              ))}
            </div>

            {selectedText && (
              <div className="bg-blue-50 border border-blue-200/60 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-blue-700 mb-1 flex items-center gap-1">
                  <MousePointer2 className="w-3 h-3" /> Trecho selecionado
                </p>
                <p className="text-xs text-blue-800 line-clamp-3 italic">"{selectedText}"</p>
              </div>
            )}
          </div>

          {/* Prompt input */}
          <div className="p-3 border-t border-border/60 space-y-2 shrink-0">
            <Textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleApplyPrompt(); }}
              placeholder={selectedText ? `Instrução para o trecho selecionado...` : "O que deseja alterar ou melhorar?"}
              className="min-h-[80px] resize-none text-sm"
            />
            <Button
              onClick={handleApplyPrompt}
              disabled={!prompt.trim() || applying}
              className="w-full gap-2 bg-amber-700 hover:bg-amber-800 text-white"
            >
              {applying ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Aplicando...</>
              ) : (
                <><Send className="w-4 h-4" /> Aplicar</>
              )}
            </Button>
            <p className="text-[10px] text-center text-muted-foreground">Ctrl+Enter para enviar</p>
          </div>
        </div>
      </div>
    </div>
  );
}