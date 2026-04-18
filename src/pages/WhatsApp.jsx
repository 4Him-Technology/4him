import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConversationList from "@/components/whatsapp/ConversationList";
import MessageView from "@/components/whatsapp/MessageView";

const ACCOUNT_ID = 1;

export default function WhatsApp() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    setLoading(true);
    const res = await base44.functions.invoke("chatwoot", {
      action: "getConversations",
      account_id: ACCOUNT_ID,
      page: 1,
    });
    const list = res.data?.data?.payload || [];
    setConversations(list);
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">WhatsApp / Atendimentos</h1>
        <Button variant="outline" size="sm" onClick={loadConversations} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </Button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex flex-1 rounded-xl border border-border overflow-hidden shadow-sm">
          {/* Lista de conversas */}
          <div className="w-80 shrink-0">
            <ConversationList
              conversations={conversations}
              selectedId={selected?.id}
              onSelect={setSelected}
            />
          </div>

          {/* Mensagens */}
          <div className="flex-1">
            <MessageView
              conversation={selected}
              accountId={ACCOUNT_ID}
              onStatusChange={loadConversations}
            />
          </div>
        </div>
      )}
    </div>
  );
}