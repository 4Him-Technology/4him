import { cn } from "@/lib/utils";
import { Phone, MessageCircle, Clock, User } from "lucide-react";
import { format } from "date-fns";

export default function ConversationCard({ conv, onClick, dragging }) {
  const sender = conv.meta?.sender;
  const lastMsg = conv.messages?.[conv.messages.length - 1];
  const initials = sender?.name
    ? sender.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <div
      draggable
      onClick={() => onClick?.(conv)}
      className={cn(
        "bg-card rounded-lg border border-border p-3 cursor-pointer shadow-sm hover:shadow-md transition-all select-none",
        dragging && "opacity-40 scale-95"
      )}
    >
      <div className="flex items-start gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{sender?.name || "Desconhecido"}</p>
          {sender?.phone_number && (
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Phone className="w-2.5 h-2.5" />{sender.phone_number}
            </p>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
          #{conv.id}
        </span>
      </div>

      {lastMsg?.content && (
        <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2 italic">
          "{lastMsg.content}"
        </p>
      )}

      {conv.labels?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {conv.labels.map(l => (
            <span key={l} className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">{l}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <MessageCircle className="w-3 h-3" />
          {conv.messages_count || 0} msgs
        </span>
        {conv.created_at && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {format(new Date(conv.created_at * 1000), "dd/MM HH:mm")}
          </span>
        )}
      </div>
    </div>
  );
}