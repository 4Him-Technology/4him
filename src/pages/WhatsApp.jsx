import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MessageSquare, Plus, Phone, Settings } from "lucide-react";
import ContactList from "../components/whatsapp/ContactList";
import ChatView from "../components/whatsapp/ChatView";
import { cn } from "@/lib/utils";

const DEFAULT_LINES = [
  { id: "Principal", label: "Principal", number: "(11) 9xxxx-xxxx" },
  { id: "Exames",    label: "Exames",    number: "(11) 9xxxx-xxxx" },
  { id: "Retorno",   label: "Retorno",   number: "(11) 9xxxx-xxxx" },
];

export default function WhatsApp() {
  const [messages, setMessages] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [activeLine, setActiveLine] = useState("Principal");
  const [loading, setLoading] = useState(true);
  const [lines, setLines] = useState(DEFAULT_LINES);
  const [showAddLine, setShowAddLine] = useState(false);
  const [newLineName, setNewLineName] = useState("");
  const [newLineNumber, setNewLineNumber] = useState("");

  const loadMessages = async () => {
    const msgs = await base44.entities.WhatsAppMessage.list("-created_date", 500);
    setMessages(msgs);
    setLoading(false);
  };

  useEffect(() => { loadMessages(); }, []);

  // Filter messages by active line (if no whatsapp_line set, belongs to "Principal")
  const lineMessages = messages.filter(m => (m.whatsapp_line || "Principal") === activeLine);

  // Build contact list
  const contactsMap = {};
  lineMessages.forEach(msg => {
    const phone = msg.contact_phone;
    if (!contactsMap[phone]) {
      contactsMap[phone] = {
        name: msg.contact_name,
        phone,
        lastMessage: msg.message,
        lastTime: msg.created_date,
      };
    }
  });
  const contacts = Object.values(contactsMap);

  const selectedMessages = lineMessages
    .filter(m => m.contact_phone === selectedPhone)
    .sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

  const selectedContact = contacts.find(c => c.phone === selectedPhone);

  const handleAddLine = () => {
    if (!newLineName.trim()) return;
    setLines(prev => [...prev, { id: newLineName, label: newLineName, number: newLineNumber }]);
    setActiveLine(newLineName);
    setNewLineName("");
    setNewLineNumber("");
    setShowAddLine(false);
    setSelectedPhone(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">WhatsApp</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie conversas com pacientes</p>
        </div>
      </div>

      {/* Phone Lines Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {lines.map(line => (
          <button
            key={line.id}
            onClick={() => { setActiveLine(line.id); setSelectedPhone(null); }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all",
              activeLine === line.id
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/50"
            )}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{line.label}</span>
            {line.number && (
              <span className={cn("text-[10px]", activeLine === line.id ? "opacity-70" : "text-muted-foreground/60")}>
                {line.number}
              </span>
            )}
            <span className={cn(
              "ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
              activeLine === line.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
            )}>
              {messages.filter(m => (m.whatsapp_line || "Principal") === line.id)
                .reduce((acc, m) => { acc.add(m.contact_phone); return acc; }, new Set()).size}
            </span>
          </button>
        ))}

        {/* Add line */}
        {!showAddLine ? (
          <button
            onClick={() => setShowAddLine(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Nova Linha
          </button>
        ) : (
          <div className="flex items-center gap-2 p-2 bg-card border border-border rounded-xl">
            <input
              autoFocus
              type="text"
              placeholder="Nome da linha"
              value={newLineName}
              onChange={e => setNewLineName(e.target.value)}
              className="border border-input rounded-lg px-2 py-1 text-sm w-32 focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <input
              type="text"
              placeholder="Número (opcional)"
              value={newLineNumber}
              onChange={e => setNewLineNumber(e.target.value)}
              className="border border-input rounded-lg px-2 py-1 text-sm w-36 focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button onClick={handleAddLine} className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded-lg">Criar</button>
            <button onClick={() => setShowAddLine(false)} className="text-muted-foreground text-sm px-2 py-1 rounded-lg hover:bg-muted">Cancelar</button>
          </div>
        )}
      </div>

      {/* Chat area */}
      <div className="bg-card rounded-xl border border-border overflow-hidden h-[calc(100vh-280px)] flex">
        <div className="w-80 shrink-0">
          <ContactList
            contacts={contacts}
            selectedPhone={selectedPhone}
            onSelect={setSelectedPhone}
          />
        </div>
        <div className="flex-1 min-w-0">
          {selectedPhone ? (
            <ChatView
              messages={selectedMessages}
              contactName={selectedContact?.name || ""}
              contactPhone={selectedPhone}
              whatsappLine={activeLine}
              onMessageSent={loadMessages}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center space-y-3">
                <MessageSquare className="w-12 h-12 mx-auto opacity-30" />
                <p className="text-sm">Selecione uma conversa</p>
                <p className="text-xs opacity-60">Linha ativa: <strong>{activeLine}</strong></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}