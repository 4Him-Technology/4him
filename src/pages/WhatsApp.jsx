import { useEffect } from "react";
import { ExternalLink, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WhatsApp() {
  useEffect(() => {
    // Injeta o script do Chatwoot
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: "right",
      locale: "pt_BR",
      type: "standard",
    };

    const script = document.createElement("script");
    script.src = "https://forhim-chatwoot.cloudfy.live/packs/js/sdk.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.chatwootSDK?.run({
        websiteToken: "Fa4YdSQm1fvayt2dk6F9DHva",
        baseUrl: "https://forhim-chatwoot.cloudfy.live",
      });
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup ao sair da página
      document.body.removeChild(script);
      const bubble = document.getElementById("chatwoot-widget");
      if (bubble) bubble.remove();
      // Remove elementos do Chatwoot do DOM
      document.querySelectorAll('[class*="chatwoot"]').forEach(el => el.remove());
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] gap-6 text-center p-8">
      <div className="bg-green-100 rounded-full p-6">
        <MessageCircle className="w-16 h-16 text-green-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Chatwoot Integrado</h2>
        <p className="text-gray-500 max-w-md">
          O widget do Chatwoot está ativo nesta página. Clique no ícone de chat no canto inferior direito para abrir as conversas.
        </p>
      </div>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => window.open("https://forhim-chatwoot.cloudfy.live", "_blank")}
      >
        <ExternalLink className="w-4 h-4" />
        Abrir Chatwoot em nova aba
      </Button>
    </div>
  );
}