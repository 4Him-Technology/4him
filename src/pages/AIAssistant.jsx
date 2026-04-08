import { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ReactMarkdown from "react-markdown";

export default function AIAssistant() {
  const MOCK_MESSAGES = [
    { role: "user", content: "Oi Elo4h! Quais convênios a clínica aceita?" },
    { role: "assistant", content: "Olá! 😊 A clínica aceita os seguintes convênios:\n\n- **Unimed**\n- **Bradesco Saúde**\n- **SulAmérica**\n- **Amil**\n- **Hapvida**\n- **Particular**\n\nSe o paciente tiver algum convênio diferente, recomendo verificar com a gerência antes de confirmar o agendamento." },
    { role: "user", content: "Como faço para remarcar uma consulta?" },
    { role: "assistant", content: "Para remarcar uma consulta, siga estes passos:\n\n1. Acesse a aba **Agendamentos** no menu lateral\n2. Localize o paciente pelo nome ou telefone\n3. Clique em **Editar** na consulta desejada\n4. Altere a data e horário disponível\n5. Salve as alterações\n\nO paciente deverá ser notificado pelo WhatsApp sobre a remarcação. Posso te ajudar com mais alguma coisa?" },
  ];

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const conv = await base44.agents.createConversation({
        agent_name: "elo4h",
        metadata: { name: "Conversa com Elo4h" },
      });
      setConversation(conv);
      setMessages(conv.messages || []);
      setStarting(false);

      base44.agents.subscribeToConversation(conv.id, (data) => {
        setMessages(data.messages || []);
      });
    };
    init();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading || !conversation) return;
    setInput("");
    setLoading(true);
    await base44.agents.addMessage(conversation, { role: "user", content: text });
    setLoading(false);
  };

  if (starting) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Iniciando Elo4h...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fale com a Elo4h</h1>
          <p className="text-sm text-muted-foreground">Assistente de IA para colaboradores</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Online
        </span>
      </div>

      {/* Chat box */}
      <div className="bg-muted/30 border border-border rounded-2xl overflow-hidden flex flex-col h-[65vh]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-muted-foreground">
              <Bot className="w-12 h-12 opacity-30" />
              <p className="text-sm">Olá! Sou a <strong>Elo4h</strong>, sua assistente virtual.<br />Como posso te ajudar hoje?</p>
            </div>
          )}
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div key={i} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm ${
                    isUser
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border text-foreground rounded-bl-sm"
                  }`}
                >
                  {isUser ? (
                    <p>{msg.content}</p>
                  ) : (
                    <ReactMarkdown className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-3 flex gap-2 bg-card">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Digite sua dúvida para a Elo4h..."
            className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}