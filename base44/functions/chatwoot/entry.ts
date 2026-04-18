import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const CHATWOOT_BASE = "https://forhim-chatwoot.cloudfy.live";
const TOKEN = Deno.env.get("CHATWOOT_API_TOKEN");

async function chatwootFetch(path, options = {}) {
  const res = await fetch(`${CHATWOOT_BASE}${path}`, {
    ...options,
    headers: {
      "api_access_token": TOKEN,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  return res.json();
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { action, account_id, conversation_id, contact_id, message, page, query, status, label, data: payload } = body;

  // ───── CONVERSATIONS ─────
  if (action === "getConversations") {
    const params = new URLSearchParams({ page: page || 1 });
    if (status) params.set("status", status);
    if (label) params.set("labels[]", label);
    const data = await chatwootFetch(`/api/v1/accounts/${account_id}/conversations?${params}`);
    return Response.json(data);
  }

  if (action === "getMessages") {
    const data = await chatwootFetch(`/api/v1/accounts/${account_id}/conversations/${conversation_id}/messages`);
    return Response.json(data);
  }

  if (action === "sendMessage") {
    const data = await chatwootFetch(`/api/v1/accounts/${account_id}/conversations/${conversation_id}/messages`, {
      method: "POST",
      body: JSON.stringify({ content: message, message_type: "outgoing", private: false }),
    });
    return Response.json(data);
  }

  if (action === "toggleStatus") {
    const data = await chatwootFetch(`/api/v1/accounts/${account_id}/conversations/${conversation_id}/toggle_status`, {
      method: "POST",
      body: JSON.stringify({ status }),
    });
    return Response.json(data);
  }

  if (action === "updateConversationLabel") {
    const data = await chatwootFetch(`/api/v1/accounts/${account_id}/conversations/${conversation_id}/labels`, {
      method: "POST",
      body: JSON.stringify({ labels: payload }),
    });
    return Response.json(data);
  }

  if (action === "assignConversation") {
    const data = await chatwootFetch(`/api/v1/accounts/${account_id}/conversations/${conversation_id}/assignments`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return Response.json(data);
  }

  // ───── CONTACTS ─────
  if (action === "getContacts") {
    const params = new URLSearchParams({ page: page || 1 });
    if (query) params.set("q", query);
    const data = await chatwootFetch(`/api/v1/accounts/${account_id}/contacts/search?${params}`);
    return Response.json(data);
  }

  if (action === "getContact") {
    const data = await chatwootFetch(`/api/v1/accounts/${account_id}/contacts/${contact_id}`);
    return Response.json(data);
  }

  if (action === "createContact") {
    const data = await chatwootFetch(`/api/v1/accounts/${account_id}/contacts`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return Response.json(data);
  }

  if (action === "updateContact") {
    const data = await chatwootFetch(`/api/v1/accounts/${account_id}/contacts/${contact_id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return Response.json(data);
  }

  if (action === "deleteContact") {
    const data = await chatwootFetch(`/api/v1/accounts/${account_id}/contacts/${contact_id}`, {
      method: "DELETE",
    });
    return Response.json(data);
  }

  if (action === "getContactConversations") {
    const data = await chatwootFetch(`/api/v1/accounts/${account_id}/contacts/${contact_id}/conversations`);
    return Response.json(data);
  }

  // ───── LABELS ─────
  if (action === "getLabels") {
    const data = await chatwootFetch(`/api/v1/accounts/${account_id}/labels`);
    return Response.json(data);
  }

  // ───── TEAMS / AGENTS ─────
  if (action === "getAgents") {
    const data = await chatwootFetch(`/api/v1/accounts/${account_id}/agents`);
    return Response.json(data);
  }

  if (action === "getTeams") {
    const data = await chatwootFetch(`/api/v1/accounts/${account_id}/teams`);
    return Response.json(data);
  }

  // ───── REPORTS / OVERVIEW ─────
  if (action === "getOverview") {
    const data = await chatwootFetch(`/api/v1/accounts/${account_id}/reports/overview`);
    return Response.json(data);
  }

  if (action === "getProfile") {
    const profile = await chatwootFetch(`/api/v1/profile`);
    return Response.json(profile);
  }

  return Response.json({ error: "Action not found" }, { status: 400 });
});