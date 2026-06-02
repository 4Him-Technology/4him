// Agentes de IA — versão LOCAL.
//
// Mantém as conversas no localStorage e devolve uma resposta-stub do assistente, já que a IA
// de verdade depende de um provedor externo (ex.: Claude API). Quando você for plugar um
// provedor real, troque a geração da resposta em `addMessage` por uma chamada à sua API.

import { createCollection } from './localDb.js';

const conversations = createCollection('agent_conversations', []);

// convId -> Set(callback) para emular o real-time (subscribeToConversation).
const listeners = new Map();

const LOCAL_REPLY =
  '🤖 _(Modo local)_ A assistente de IA está **desconectada**. ' +
  'Para respostas reais, conecte um provedor de IA (ex.: Claude API) na função ' +
  '`addMessage` em `src/api/localAgents.js`.';

function notify(convId, conv) {
  const set = listeners.get(convId);
  if (!set) return;
  const payload = { messages: conv?.messages || [], conversation: conv };
  set.forEach((cb) => {
    try {
      cb(payload);
    } catch (err) {
      console.error('[localAgents] erro em subscriber:', err);
    }
  });
}

export const localAgents = {
  async listConversations({ agent_name } = {}) {
    const all = await conversations.list('-updated_date', 500);
    return agent_name ? all.filter((c) => c.agent_name === agent_name) : all;
  },

  async createConversation({ agent_name, metadata } = {}) {
    return conversations.create({ agent_name, metadata: metadata || {}, messages: [] });
  },

  async getConversation(id) {
    return conversations.get(id);
  },

  async deleteConversation(id) {
    listeners.delete(id);
    return conversations.delete(id);
  },

  // Retorna função para cancelar a inscrição. Empurra o estado atual imediatamente.
  subscribeToConversation(convId, callback) {
    if (!listeners.has(convId)) listeners.set(convId, new Set());
    listeners.get(convId).add(callback);
    conversations.get(convId).then((conv) => {
      if (conv) callback({ messages: conv.messages || [], conversation: conv });
    });
    return () => {
      const set = listeners.get(convId);
      if (set) set.delete(callback);
    };
  },

  async addMessage(conv, message) {
    const id = typeof conv === 'string' ? conv : conv?.id;
    const current = await conversations.get(id);
    if (!current) return null;

    const stamp = new Date().toISOString();
    const userMessage = {
      role: message?.role || 'user',
      content: message?.content || '',
      created_date: stamp,
    };
    const assistantMessage = {
      role: 'assistant',
      content: LOCAL_REPLY,
      created_date: new Date().toISOString(),
    };

    const messages = [...(current.messages || []), userMessage, assistantMessage];
    const updated = await conversations.update(id, { messages });
    notify(id, updated);
    return updated;
  },
};

export default localAgents;
