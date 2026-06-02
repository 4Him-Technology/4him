import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { api } from "@/api/client";

const MSG_POLL_INTERVAL = 10000; // 10 seconds

export default function MessageView({ conversation, accountId, onStatusChange }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    if (!conversation) return;
    loadMessages(true);

    // Poll messages every 10s for the open conversation
    pollRef.current = setInterval(() => loadMessages(false), MSG_POLL_INTERVAL);

    // Also react to webhook events via WhatsAppMessage subscribe
    const unsubscribe = api.entities.WhatsAppMessage.subscribe((event) => {
      if (event.data?.whatsapp_line === String(conversation.id)) {
        loadMessages(false);
      }
    });

    return () => {
      clearInterval(pollRef.current);
      unsubscribe();
    };
  }, [conversation?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadMessages(showLoading = false) {
    if (showLoading) setLoading(true);
    const res = await api.functions.invoke("chatwoot", {
      action: "getMessages",
      account_id: accountId,
      conversation_id: conversation.id,
    });
    setMessages(res.data?.payload || []);
    if (showLoading) setLoading(false);
  }

  async function sendMessage() {
    if (!text.trim()) return;
    setSending(true);
    await api.functions.invoke("chatwoot", {
      action: "sendMessage",
      account_id: accountId,
      conversation_id: conversation.id,
      message: text,
    });
    setText("");
    await loadMessages();
    setSending(false);
  }

  async function toggleStatus(status) {
    await api.functions.invoke("chatwoot", {
      action: "toggleStatus",
      account_id: accountId,
      conversation_id: conversation.id,
      status,
    });
    onStatusChange?.();
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>Selecione uma conversa</p>
      </div>
    );
  }

  const sender = conversation.meta?.sender;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-white flex items-center justify-between">
        <div>
          <p className="font-semibold">{sender?.name || "Desconhecido"}</p>
          <p className="text-xs text-muted-foreground">{sender?.phone_number}</p>
        </div>
        <div className="flex gap-2">
          {conversation.status === "open" ? (
            <Button size="sm" variant="outline" onClick={() => toggleStatus("resolved")}>
              Resolver
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => toggleStatus("open")}>
              Reabrir
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {messages.map(msg => {
          const isOutgoing = msg.message_type === 1;
          const isActivity = msg.message_type === 2;

          if (isActivity) {
            return (
              <div key={msg.id} className="text-center">
                <span className="text-[11px] text-muted-foreground bg-white px-3 py-1 rounded-full border">
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} className={cn("flex", isOutgoing ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[70%] px-3 py-2 rounded-2xl text-sm",
                isOutgoing
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-white border border-border rounded-tl-sm"
              )}>
                <p>{msg.content}</p>
                <p className={cn("text-[10px] mt-1 text-right", isOutgoing ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {format(new Date(msg.created_at * 1000), "HH:mm")}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-white flex gap-2">
        <Input
          placeholder="Digite uma mensagem..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          disabled={sending}
        />
        <Button size="icon" onClick={sendMessage} disabled={sending || !text.trim()}>
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}