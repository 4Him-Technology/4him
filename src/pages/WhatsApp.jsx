import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, RefreshCw, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConversationList from "@/components/whatsapp/ConversationList";
import MessageView from "@/components/whatsapp/MessageView";

const ACCOUNT_ID = 1;
const POLL_INTERVAL = 15000; // 15 seconds

export default function WhatsApp() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const pollRef = useRef(null);

  useEffect(() => {
    loadConversations();

    // Polling every 15s
    pollRef.current = setInterval(loadConversations, POLL_INTERVAL);

    // Real-time: subscribe to WhatsAppMessage entity changes triggered by webhook
    const unsubscribe = base44.entities.WhatsAppMessage.subscribe((event) => {
      // When webhook fires a new message/conversation event, refresh the list
      loadConversations();
    });

    return () => {
      clearInterval(pollRef.current);
      unsubscribe();
    };
  }, []);

  async function loadConversations(showLoading = false) {
    if (showLoading) setLoading(true);
    const res = await base44.functions.invoke("chatwoot", {
      action: "getConversations",
      account_id: ACCOUNT_ID,
      page: 1,
    });
    const list = res.data?.data?.payload || [];
    setConversations(list);
    setLastUpdated(new Date());
    if (showLoading) setLoading(false);
    else setLoading(false);
  }

  function handleSelect(conv) {
    setSelected(conv);
  }

  // When status changes, refresh list and keep selected conversation updated
  function handleStatusChange() {
    loadConversations();
    setSelected(null);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">WhatsApp / Atendimentos</h1>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Wifi className="w-3 h-3 text-green-500" />
              Atualizado às {lastUpdated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              <span className="ml-1 text-green-600 font-medium">● ao vivo</span>
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => loadConversations(true)} className="gap-2">
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
              onSelect={handleSelect}
            />
          </div>

          {/* Mensagens */}
          <div className="flex-1">
            <MessageView
              conversation={selected}
              accountId={ACCOUNT_ID}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}