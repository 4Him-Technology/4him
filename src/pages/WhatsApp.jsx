import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MessageSquare } from "lucide-react";
import ContactList from "../components/whatsapp/ContactList";
import ChatView from "../components/whatsapp/ChatView";

export default function WhatsApp() {
  const [messages, setMessages] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    const msgs = await base44.entities.WhatsAppMessage.list("-created_date", 500);
    setMessages(msgs);
    setLoading(false);
  };

  useEffect(() => { loadMessages(); }, []);

  // Build contact list from messages
  const contactsMap = {};
  messages.forEach(msg => {
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

  const selectedMessages = messages
    .filter(m => m.contact_phone === selectedPhone)
    .sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

  const selectedContact = contacts.find(c => c.phone === selectedPhone);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">WhatsApp</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie conversas com pacientes</p>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden h-[calc(100vh-220px)] flex">
        {/* Contact list */}
        <div className="w-80 shrink-0">
          <ContactList
            contacts={contacts}
            selectedPhone={selectedPhone}
            onSelect={setSelectedPhone}
          />
        </div>

        {/* Chat area */}
        <div className="flex-1 min-w-0">
          {selectedPhone ? (
            <ChatView
              messages={selectedMessages}
              contactName={selectedContact?.name || ""}
              contactPhone={selectedPhone}
              onMessageSent={loadMessages}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center space-y-3">
                <MessageSquare className="w-12 h-12 mx-auto opacity-30" />
                <p className="text-sm">Selecione uma conversa</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}