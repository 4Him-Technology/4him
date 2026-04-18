import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const statusColors = {
  open: "bg-green-100 text-green-700",
  resolved: "bg-gray-100 text-gray-600",
  pending: "bg-yellow-100 text-yellow-700",
};

const statusLabels = {
  open: "Aberto",
  resolved: "Resolvido",
  pending: "Pendente",
};

export default function ConversationList({ conversations, selectedId, onSelect }) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter(c =>
    c.meta?.sender?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full border-r border-border bg-white">
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conversa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <MessageCircle className="w-8 h-8 opacity-30" />
            <p className="text-sm">Nenhuma conversa</p>
          </div>
        )}
        {filtered.map(conv => {
          const sender = conv.meta?.sender;
          const lastMsg = conv.messages?.[0];
          const isSelected = conv.id === selectedId;

          return (
            <button
              key={conv.id}
              onClick={() => onSelect(conv)}
              className={cn(
                "w-full text-left px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors",
                isSelected && "bg-accent"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm truncate">{sender?.name || "Desconhecido"}</span>
                <Badge className={cn("text-[10px] px-1.5 py-0", statusColors[conv.status])}>
                  {statusLabels[conv.status] || conv.status}
                </Badge>
              </div>
              {sender?.phone_number && (
                <p className="text-xs text-muted-foreground mb-1">{sender.phone_number}</p>
              )}
              {lastMsg?.content && (
                <p className="text-xs text-muted-foreground truncate">{lastMsg.content}</p>
              )}
              {conv.created_at && (
                <p className="text-[10px] text-muted-foreground mt-1">
                  {format(new Date(conv.created_at * 1000), "dd/MM HH:mm")}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}