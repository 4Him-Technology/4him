import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, X, CheckCircle, RotateCcw, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const ACCOUNT_ID = 1;

const STATUS_ACTIONS = {
  open:     { next: "resolved", label: "Resolver",  icon: CheckCircle,  variant: "outline" },
  resolved: { next: "open",     label: "Reabrir",   icon: RotateCcw,    variant: "outline" },
  pending:  { next: "open",     label: "Abrir",     icon: CheckCircle,  variant: "outline" },
};

export default function ConversationDetail({ conv, onClose, onStatusChange }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!conv) return;
    loadMessages();
  }, [conv?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadMessages() {
    setLoading(true);
    const res = await base44.functions.invoke("chatwoot", {
      action: "getMessages",
      account_id: ACCOUNT_ID,
      conversation_id: conv.id,
    });
    setMessages(res.data?.payload || []);
    setLoading(false);
  }

  async function sendMessage() {
    if (!text.trim()) return;
    setSending(true);
    await base44.functions.invoke("chatwoot", {
      action: "sendMessage",
      account_id: ACCOUNT_ID,
      conversation_id: conv.id,
      message: text,
    });
    setText("");
    await loadMessages();
    setSending(false);
  }

  async function changeStatus() {
    const action = STATUS_ACTIONS[conv.status];
    if (!action) return;
    await base44.functions.invoke("chatwoot", {
      action: "toggleStatus",
      account_id: ACCOUNT_ID,
      conversation_id: conv.id,
      status: action.next,
    });
    onStatusChange?.();
  }

  const sender = conv.meta?.sender;
  const statusAction = STATUS_ACTIONS[conv.status];

  return (
    <div className="flex flex-col h-full border-l border-border bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-white shrink-0">
        <div>
          <p className="font-semibold text-sm">{sender?.name || "Desconhecido"}</p>
          <p className="text-xs text-muted-foreground">{sender?.phone_number} · #{conv.id}</p>
        </div>
        <div className="flex items-center gap-2">
          {statusAction && (
            <Button size="sm" variant="outline" onClick={changeStatus} className="gap-1 text-xs h-7">
              <statusAction.icon className="w-3 h-3" />
              {statusAction.label}
            </Button>
          )}
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Labels */}
      {conv.labels?.length > 0 && (
        <div className="px-4 py-2 border-b border-border flex gap-1 flex-wrap bg-muted/30">
          {conv.labels.map(l => (
            <Badge key={l} variant="secondary" className="text-xs">{l}</Badge>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {messages.map(msg => {
          const isOutgoing = msg.message_type === 1;
          const isActivity = msg.message_type === 2;

          if (isActivity) {
            return (
              <div key={msg.id} className="text-center">
                <span className="text-[10px] text-muted-foreground bg-white px-3 py-1 rounded-full border">
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} className={cn("flex", isOutgoing ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[75%] px-3 py-2 rounded-2xl text-sm",
                isOutgoing
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-white border border-border rounded-tl-sm"
              )}>
                <p className="break-words">{msg.content}</p>
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
      <div className="p-3 border-t border-border bg-white flex gap-2 shrink-0">
        <Input
          placeholder="Responder..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          disabled={sending}
          className="text-sm"
        />
        <Button size="icon" onClick={sendMessage} disabled={sending || !text.trim()}>
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}