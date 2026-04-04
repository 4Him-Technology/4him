import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import moment from "moment";

export default function ContactList({ contacts, selectedPhone, onSelect }) {
  const [search, setSearch] = useState("");

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="flex flex-col h-full border-r border-border">
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conversa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">Nenhuma conversa</p>
        )}
        {filtered.map(contact => (
          <button
            key={contact.phone}
            onClick={() => onSelect(contact.phone)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/50",
              selectedPhone === contact.phone && "bg-accent"
            )}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">
                {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-foreground truncate">{contact.name}</p>
              <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
            </div>
            {contact.lastTime && (
              <span className="text-[10px] text-muted-foreground shrink-0">
                {moment(contact.lastTime).format("HH:mm")}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}