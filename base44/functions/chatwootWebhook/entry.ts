import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const rawBody = await req.text();

  // Validate Chatwoot webhook secret if configured
  const secret = Deno.env.get("CHATWOOT_WEBHOOK_SECRET");
  if (secret) {
    const signature = req.headers.get("x-chatwoot-signature") || req.headers.get("x-hub-signature-256") || "";
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
    const expected = "sha256=" + Array.from(new Uint8Array(sigBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
    if (signature !== expected) {
      return Response.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const body = JSON.parse(rawBody);
  const { event, conversation } = body;

  const base44 = createClientFromRequest(req);

  try {
    if (event === "message_created" && body.message_type !== "activity") {
      const sender = conversation?.meta?.sender;
      await base44.asServiceRole.entities.WhatsAppMessage.create({
        contact_name: sender?.name || "Desconhecido",
        contact_phone: sender?.phone_number || "",
        message: body.content || "",
        direction: body.message_type === 1 ? "outgoing" : "incoming",
        status: "received",
        is_ai_response: false,
        whatsapp_line: String(conversation?.id || ""),
      });
    }

    if (event === "conversation_created" || event === "conversation_updated") {
      const sender = conversation?.meta?.sender;
      await base44.asServiceRole.entities.WhatsAppMessage.create({
        contact_name: sender?.name || "Desconhecido",
        contact_phone: sender?.phone_number || String(conversation?.id || ""),
        message: `__refresh__${event}`,
        direction: "incoming",
        status: "received",
        is_ai_response: false,
        whatsapp_line: String(conversation?.id || ""),
      });
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});