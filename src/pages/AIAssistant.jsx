import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import ConversationSidebar from "@/components/assistant/ConversationSidebar";
import ChatArea from "@/components/assistant/ChatArea";

export default function AIAssistant() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  // Load conversation list on mount
  useEffect(() => {
    loadConversationList();
  }, []);

  async function loadConversationList() {
    setLoadingList(true);
    try {
      const list = await base44.agents.listConversations({ agent_name: "elo4h" });
      setConversations(list || []);
    } catch (e) {
      setConversations([]);
    }
    setLoadingList(false);
  }

  async function handleNewConversation() {
    setStarting(true);
    setMessages([]);
    setActiveConversation(null);
    try {
      const conv = await base44.agents.createConversation({
        agent_name: "elo4h",
        metadata: { name: "Nova conversa" },
      });
      setActiveConversation(conv);
      setMessages(conv.messages || []);
      setConversations((prev) => [conv, ...prev]);

      base44.agents.subscribeToConversation(conv.id, (data) => {
        setMessages(data.messages || []);
      });
    } catch (e) {
      console.error(e);
    }
    setStarting(false);
  }

  async function handleSelectConversation(conv) {
    setStarting(true);
    setMessages([]);
    setActiveConversation(conv);
    try {
      const fullConv = await base44.agents.getConversation(conv.id);
      setMessages(fullConv.messages || []);

      base44.agents.subscribeToConversation(conv.id, (data) => {
        setMessages(data.messages || []);
      });
    } catch (e) {
      setMessages([]);
    }
    setStarting(false);
  }

  async function handleDeleteConversation(convId) {
    try {
      await base44.agents.deleteConversation(convId);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (activeConversation?.id === convId) {
        setActiveConversation(null);
        setMessages([]);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    // If no active conversation, create one first
    let conv = activeConversation;
    if (!conv) {
      setStarting(true);
      try {
        conv = await base44.agents.createConversation({
          agent_name: "elo4h",
          metadata: { name: text.slice(0, 40) },
        });
        setActiveConversation(conv);
        setConversations((prev) => [conv, ...prev]);
        base44.agents.subscribeToConversation(conv.id, (data) => {
          setMessages(data.messages || []);
        });
      } catch (e) {
        setStarting(false);
        return;
      }
      setStarting(false);
    }

    setInput("");
    setLoading(true);
    try {
      await base44.agents.addMessage(conv, { role: "user", content: text });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        activeId={activeConversation?.id}
        onSelect={handleSelectConversation}
        onNew={handleNewConversation}
        onDelete={handleDeleteConversation}
        loading={loadingList}
      />

      {/* Chat */}
      <ChatArea
        messages={messages}
        input={input}
        setInput={setInput}
        onSend={sendMessage}
        loading={loading}
        starting={starting}
      />
    </div>
  );
}