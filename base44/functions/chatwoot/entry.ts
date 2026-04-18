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
  const { action, account_id, conversation_id, message, page } = body;

  if (action === "getAccounts") {
    const data = await chatwootFetch("/auth/sign_in", {
      method: "POST",
      body: JSON.stringify({ email: "", password: "" }),
    });
    // Get accounts via profile
    const profile = await chatwootFetch("/api/v1/profile");
    const accounts = profile.account_id ? [{ id: profile.account_id }] : [];
    return Response.json({ accounts, profile });
  }

  if (action === "getConversations") {
    const p = page || 1;
    const data = await chatwootFetch(`/api/v1/accounts/${account_id}/conversations?page=${p}`);
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
      body: JSON.stringify({ status: body.status }),
    });
    return Response.json(data);
  }

  return Response.json({ error: "Action not found" }, { status: 400 });
});