import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/api/client";
import moment from "moment";

export default function ChatView({ messages, contactName, contactPhone, whatsappLine, onMessageSent }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    await api.entities.WhatsAppMessage.create({
      contact_name: contactName,
      contact_phone: contactPhone,
      message: text,
      direction: "outgoing",
      status: "sent",
      is_ai_response: false,
      whatsapp_line: whatsappLine || "Principal",
    });
    setText("");
    setSending(false);
    onMessageSent();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-14 border-b border-border bg-card px-4 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">
            {contactName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{contactName}</p>
          <p className="text-[10px] text-muted-foreground">{contactPhone}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-12">Nenhuma mensagem ainda</p>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={cn("flex", msg.direction === "outgoing" ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[75%] rounded-2xl px-4 py-2.5 relative",
              msg.direction === "outgoing"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-card border border-border rounded-bl-md"
            )}>
              {msg.is_ai_response && (
                <div className="flex items-center gap-1 mb-1">
                  <Bot className="w-3 h-3 opacity-60" />
                  <span className="text-[10px] opacity-60">IA</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{msg.message}</p>
              <p className={cn(
                "text-[10px] mt-1",
                msg.direction === "outgoing" ? "text-primary-foreground/60" : "text-muted-foreground"
              )}>
                {moment(msg.created_date).format("HH:mm")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-card flex gap-2">
        <Input
          placeholder="Digite uma mensagem..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={sending || !text.trim()} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}