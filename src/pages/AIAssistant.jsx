import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

const STATIC_MESSAGES = [
  {
    role: "assistant",
    content: "Olá! Sou o assistente virtual da **CardioAgenda**. Estou aqui para tirar suas dúvidas sobre consultas, exames, convênios e muito mais. Como posso te ajudar hoje?",
  },
  {
    role: "user",
    content: "Quais convênios vocês aceitam?",
  },
  {
    role: "assistant",
    content: "Atendemos os principais convênios do mercado, incluindo:\n\n- **Unimed**\n- **Bradesco Saúde**\n- **SulAmérica**\n- **Amil**\n- **Porto Seguro**\n- **Particular**\n\nCaso seu convênio não esteja na lista, entre em contato e verificamos a possibilidade de credenciamento. 😊",
  },
  {
    role: "user",
    content: "Como faço para agendar uma consulta?",
  },
  {
    role: "assistant",
    content: "Você pode agendar sua consulta de três formas:\n\n1. **WhatsApp** – Envie uma mensagem para (11) 9xxxx-xxxx e nossa equipe irá te atender.\n2. **Telefone** – Ligue para (11) 3xxx-xxxx de segunda a sexta, das 8h às 18h.\n3. **Presencialmente** – Compareça à nossa clínica na Rua Exemplo, 123.\n\nQual forma prefere?",
  },
];

const SUGGESTED = [
  "Quais são os horários de atendimento?",
  "Preciso de pedido médico para exames?",
  "Quanto tempo dura uma consulta?",
  "Como cancelo ou remarco minha consulta?",
];

const AUTO_RESPONSES = {
  "Quais são os horários de atendimento?":
    "Atendemos de **segunda a sexta-feira**, das **8h às 18h**, e aos **sábados das 8h às 12h**. Feriados seguem escala especial — consulte-nos via WhatsApp.",
  "Preciso de pedido médico para exames?":
    "Depende do exame! Para a maioria dos exames laboratoriais e de imagem, **sim**, é necessário pedido médico. Porém, alguns check-ups podem ser realizados sem encaminhamento. Nos informe o exame desejado e verificamos para você.",
  "Quanto tempo dura uma consulta?":
    "Uma consulta padrão tem duração média de **30 a 45 minutos**. Consultas de retorno costumam ser mais rápidas, em torno de **20 minutos**.",
  "Como cancelo ou remarco minha consulta?":
    "Para cancelar ou remarcar, entre em contato com pelo menos **24 horas de antecedência** pelo WhatsApp ou telefone. Isso garante que outro paciente possa ser atendido no horário. 🙏",
};

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  const lines = msg.content.split("\n").map((line, i) => {
    const formatted = line
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/^- /, "• ");
    return <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} className="leading-relaxed" />;
  });

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm space-y-1 ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-card border border-border text-foreground rounded-bl-sm"
        }`}
      >
        {lines}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

export default function AIAssistant() {
  const [messages, setMessages] = useState(STATIC_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setLoading(true);

    setTimeout(() => {
      const reply =
        AUTO_RESPONSES[userText] ||
        "Obrigado pela sua mensagem! Nossa equipe irá verificar e responder em breve. Para urgências, entre em contato pelo WhatsApp. 😊";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fale com a Elo4h</h1>
          <p className="text-sm text-muted-foreground">Tire suas dúvidas sobre a clínica em tempo real</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Online
        </span>
      </div>

      {/* Chat box */}
      <div className="bg-muted/30 border border-border rounded-2xl overflow-hidden flex flex-col h-[60vh]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}
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

        {/* Suggested questions */}
        {messages.length < 6 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {SUGGESTED.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs bg-card border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border p-3 flex gap-2 bg-card">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Digite sua dúvida..."
            className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <button
            onClick={() => sendMessage()}
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