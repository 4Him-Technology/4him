import { useState } from "react";
import { Plus, MessageSquare, Trash2, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";

function groupConversations(conversations) {
  const groups = { Hoje: [], Ontem: [], "Mais antigas": [] };
  conversations.forEach((conv) => {
    const date = new Date(conv.created_at);
    if (isToday(date)) groups["Hoje"].push(conv);
    else if (isYesterday(date)) groups["Ontem"].push(conv);
    else groups["Mais antigas"].push(conv);
  });
  return groups;
}

export default function ConversationSidebar({ conversations, activeId, onSelect, onNew, onDelete, loading }) {
  const groups = groupConversations(conversations);

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground w-64 shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Bot className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">Elo4h</span>
        </div>
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-accent-foreground text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova conversa
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading && (
          <div className="text-xs text-sidebar-foreground/50 text-center py-4">Carregando...</div>
        )}
        {!loading && conversations.length === 0 && (
          <div className="text-xs text-sidebar-foreground/50 text-center py-8">
            Nenhuma conversa ainda
          </div>
        )}
        {Object.entries(groups).map(([label, convs]) => {
          if (convs.length === 0) return null;
          return (
            <div key={label} className="mb-3">
              <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/40 px-2 py-1">{label}</p>
              {convs.map((conv) => {
                const isActive = conv.id === activeId;
                const title = conv.metadata?.name || `Conversa ${conv.id.slice(0, 6)}`;
                return (
                  <div
                    key={conv.id}
                    className={cn(
                      "group flex items-center justify-between gap-1 px-2 py-2 rounded-lg cursor-pointer transition-colors text-sm",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80"
                    )}
                    onClick={() => onSelect(conv)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      <span className="truncate text-sm">{title}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 hover:text-destructive transition-all shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}