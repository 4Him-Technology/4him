import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// This endpoint receives webhook events from Chatwoot
// Configure in Chatwoot: Settings → Integrations → Webhooks → Add new webhook
// Events to subscribe: conversation_created, conversation_updated, message_created

Deno.serve(async (req) => {
  // Validate it's a POST from Chatwoot
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const body = await req.json();
  const { event, conversation, messages } = body;

  // Use service role since this is called by Chatwoot, not a logged-in user
  const base44 = createClientFromRequest(req);

  try {
    if (event === "message_created" && body.message_type !== "activity") {
      const msg = body;
      const sender = conversation?.meta?.sender;

      // Save/update the message in our local entity so the frontend reacts in real time
      await base44.asServiceRole.entities.WhatsAppMessage.create({
        contact_name: sender?.name || "Desconhecido",
        contact_phone: sender?.phone_number || "",
        message: msg.content || "",
        direction: msg.message_type === 1 ? "outgoing" : "incoming",
        status: "received",
        is_ai_response: false,
        whatsapp_line: String(conversation?.id || ""),
      });
    }

    if (event === "conversation_created" || event === "conversation_updated") {
      // Just trigger a "ping" so the frontend knows to refresh the conversation list
      // We store a minimal marker using the conversation id as the phone
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