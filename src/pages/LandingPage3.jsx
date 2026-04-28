import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, LayoutDashboard, Menu, X, ChevronUp, MessageCircle,
} from "lucide-react";

const LOGO_ICON_URL = "/images/logo-icon.png";
const WHATSAPP_URL = "https://wa.me/5511999999999";

const NAV_LINKS = [
  ["sobre",   "Sobre"],
  ["servicos","Serviços"],
  ["contato", "Contato"],
];

export default function LandingPage3() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 });

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden font-inter"
      style={{ backgroundColor: "#050505", color: "#f5f0e8" }}
    >
      <style>{`
        @keyframes pulseGlow4h  { 0%,100% { opacity: 0.5 } 50% { opacity: 1 } }
        @keyframes shimmer4h   { from { background-position: 200% 0 } to { background-position: -200% 0 } }
        @keyframes fadeIn4h    { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes fadeInFast  { from { opacity: 0 } to { opacity: 1 } }
        .font-serif4h { font-family: "Cormorant Garamond", "Playfair Display", Georgia, serif; }
        button, a[role="button"] { cursor: pointer; }
        button:focus-visible, a:focus-visible {
          outline: 2px solid #c49a3c;
          outline-offset: 3px;
          border-radius: 6px;
        }
      `}</style>

      {/* Mouse glow */}
      <div
        aria-hidden
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(700px circle at ${mouse.x}px ${mouse.y}px, rgba(196,154,60,0.07), transparent 55%)`,
          transition: "background 80ms linear",
        }}
      />

      {/* Grid background */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(150,104,44,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(150,104,44,0.07) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(circle at 50% 30%, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 30%, black 20%, transparent 75%)",
        }}
      />

      {/* Ambient orb */}
      <div
        aria-hidden
        className="absolute z-0 rounded-full pointer-events-none"
        style={{
          top: "10%", right: "-10%", width: 700, height: 700,
          background: "radial-gradient(circle, rgba(196,154,60,0.18), transparent 60%)",
          filter: "blur(80px)", animation: "pulseGlow4h 8s ease-in-out infinite",
        }}
      />

      {/* Mobile menu */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          className="fixed inset-0 z-[200] flex flex-col"
          style={{
            background: "rgba(5,5,5,0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            animation: "fadeInFast 200ms ease",
          }}
        >
          <div className="flex items-center justify-between" style={{ padding: "20px 24px" }}>
            <div className="flex items-center gap-3">
              <img src={LOGO_ICON_URL} alt="4Him Technology" className="h-9 w-auto" />
              <div>
                <div className="font-bold text-sm" style={{ color: "#f5f0e8" }}>
                  4Him<span style={{ color: "#c49a3c" }}>.</span>
                </div>
                <div className="text-[8px] font-medium uppercase -mt-0.5" style={{ letterSpacing: "0.2em", color: "rgba(245,240,232,0.45)" }}>
                  Technology
                </div>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Fechar menu"
              className="flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ color: "rgba(245,240,232,0.8)", padding: 8, borderRadius: 8 }}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col items-center justify-center flex-1 gap-1">
            {NAV_LINKS.map(([id, label], i) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="font-extrabold py-3 px-8 transition-colors duration-200"
                style={{
                  fontSize: "clamp(28px,8vw,40px)",
                  color: "rgba(245,240,232,0.85)",
                  letterSpacing: "-0.03em",
                  animation: `fadeIn4h 300ms ease ${i * 60}ms both`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#c49a3c"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(245,240,232,0.85)"; }}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* NAV */}
      <nav
        className="sticky z-50 flex items-center justify-between"
        aria-label="Navegação principal"
        style={{
          top: 16, margin: "16px 32px 0", padding: "12px 20px",
          background: "rgba(10,10,10,0.65)",
          backdropFilter: "blur(24px) saturate(1.4)",
          WebkitBackdropFilter: "blur(24px) saturate(1.4)",
          border: "1px solid rgba(196,154,60,0.18)",
          borderRadius: 100,
          boxShadow: "0 16px 48px -16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div className="flex items-center gap-3">
          <img src={LOGO_ICON_URL} alt="4Him Technology" className="h-9 w-auto" />
          <div className="hidden sm:block">
            <div className="text-sm font-bold" style={{ color: "#f5f0e8", letterSpacing: "-0.01em" }}>
              4Him<span style={{ color: "#c49a3c" }}>.</span>
            </div>
            <div className="text-[8px] font-medium uppercase -mt-0.5" style={{ letterSpacing: "0.2em", color: "rgba(245,240,232,0.45)" }}>
              Technology
            </div>
          </div>
        </div>

        <div
          className="hidden md:flex gap-1 p-1 rounded-full"
          style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(196,154,60,0.08)" }}
        >
          {NAV_LINKS.map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="px-3.5 py-[7px] text-xs font-medium rounded-full transition-all duration-200"
              style={{ color: "rgba(245,240,232,0.75)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(196,154,60,0.12)"; e.currentTarget.style.color = "#f5f0e8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(245,240,232,0.75)"; }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            aria-label="Acessar portal"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full transition-all duration-200 hover:scale-105"
            style={{ border: "1px solid rgba(196,154,60,0.35)", color: "#c49a3c", background: "transparent" }}
          >
            <LayoutDashboard className="w-3.5 h-3.5" aria-hidden /> Portal
          </button>
          <button
            onClick={() => scrollTo("contato")}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-full transition-all duration-200 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #96682c, #e8c060)",
              color: "#050505",
              boxShadow: "0 4px 20px rgba(196,154,60,0.4)",
            }}
          >
            Falar com a 4Him <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </button>
          <button
            className="md:hidden flex items-center justify-center"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            style={{ color: "#f5f0e8", padding: 8, borderRadius: 8, background: "rgba(196,154,60,0.1)", border: "1px solid rgba(196,154,60,0.2)" }}
          >
            <Menu className="w-5 h-5" aria-hidden />
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section
        className="relative z-10 text-center"
        style={{ padding: "160px 24px 120px", maxWidth: 1200, margin: "0 auto" }}
      >
        <div
          className="inline-flex items-center gap-2.5 text-xs font-medium rounded-full"
          style={{
            padding: "7px 18px",
            border: "1px solid rgba(196,154,60,0.3)",
            color: "#c49a3c",
            background: "rgba(196,154,60,0.06)",
            marginBottom: 40,
          }}
        >
          <span aria-hidden className="rounded-full" style={{ width: 6, height: 6, background: "#e8c060", boxShadow: "0 0 12px #e8c060" }} />
          Terceira Landing Page · Em construção
        </div>

        <h1
          className="font-extrabold"
          style={{
            fontSize: "clamp(40px, 7vw, 96px)",
            letterSpacing: "-0.045em",
            lineHeight: 0.94,
            margin: "0 0 32px",
            color: "#f5f0e8",
          }}
        >
          Sua mensagem principal<br />
          <span
            className="font-serif4h italic font-normal"
            style={{
              background: "linear-gradient(100deg, #96682c 5%, #e8c060 35%, #ffe9a8 50%, #e8c060 65%, #96682c 95%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer4h 6s linear infinite",
            }}
          >
            vai aqui.
          </span>
        </h1>

        <p
          className="mx-auto"
          style={{
            fontSize: "clamp(16px,2vw,20px)", lineHeight: 1.6,
            color: "rgba(245,240,232,0.65)",
            maxWidth: 680, margin: "0 auto 48px",
          }}
        >
          Esta é a sua terceira landing page. Edite este conteúdo para criar
          uma nova versão de apresentação da 4Him Technology.
        </p>

        <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
          <button
            onClick={() => scrollTo("contato")}
            className="font-bold rounded-full transition-all duration-200 hover:scale-105"
            style={{
              padding: "16px 28px",
              background: "linear-gradient(135deg, #96682c, #e8c060)",
              color: "#050505", fontSize: 14,
              boxShadow: "0 8px 32px rgba(196,154,60,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          >
            Agendar conversa →
          </button>
          <button
            onClick={() => navigate("/landing")}
            className="font-semibold rounded-full transition-all duration-200"
            style={{
              padding: "16px 28px",
              background: "rgba(255,255,255,0.03)",
              color: "#f5f0e8",
              border: "1px solid rgba(196,154,60,0.25)",
              fontSize: 14,
            }}
          >
            Ver Landing Page 1
          </button>
        </div>
      </section>

      {/* ─── SOBRE ─── */}
      <section
        id="sobre"
        className="relative z-10"
        style={{
          padding: "80px 24px",
          borderTop: "1px solid rgba(196,154,60,0.12)",
          borderBottom: "1px solid rgba(196,154,60,0.12)",
          background: "rgba(196,154,60,0.025)",
        }}
      >
        <div className="mx-auto text-center" style={{ maxWidth: 800 }}>
          <div className="uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c49a3c", marginBottom: 16 }}>
            ──── Sobre ────
          </div>
          <h2 className="font-extrabold" style={{ fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.03em", margin: "0 0 20px" }}>
            Edite esta seção com o conteúdo desejado.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(245,240,232,0.6)" }}>
            Adicione aqui o texto, proposta de valor ou diferenciais que você quer comunicar nesta versão da landing page.
          </p>
        </div>
      </section>

      {/* ─── SERVIÇOS ─── */}
      <section
        id="servicos"
        className="relative z-10 mx-auto"
        style={{ padding: "100px 24px", maxWidth: 1200 }}
      >
        <div className="text-center" style={{ marginBottom: 56 }}>
          <div className="uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c49a3c", marginBottom: 16 }}>
            ──── Serviços ────
          </div>
          <h2 className="font-extrabold" style={{ fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.03em", margin: 0 }}>
            Seus serviços ou diferenciais.
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {["Serviço 1", "Serviço 2", "Serviço 3"].map((s, i) => (
            <div
              key={i}
              style={{
                padding: 28, borderRadius: 20,
                background: "rgba(10,10,10,0.5)",
                border: "1px solid rgba(196,154,60,0.15)",
              }}
            >
              <div
                className="font-black"
                style={{
                  fontSize: 36, lineHeight: 1, letterSpacing: "-0.03em",
                  background: "linear-gradient(135deg, #c49a3c, #ffe9a8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: 16,
                }}
              >
                0{i + 1}
              </div>
              <h3 className="font-bold" style={{ fontSize: 18, color: "#f5f0e8", margin: "0 0 10px" }}>{s}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(245,240,232,0.6)", margin: 0 }}>
                Descrição do serviço ou diferencial. Edite conforme necessário.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA / CONTATO ─── */}
      <section id="contato" className="relative z-10" style={{ padding: "60px 24px" }}>
        <div
          className="relative mx-auto grid gap-12 md:grid-cols-[2fr_1fr] items-center overflow-hidden"
          style={{
            maxWidth: 1200,
            padding: "clamp(32px,5vw,64px)",
            borderRadius: 32,
            background: "linear-gradient(135deg, rgba(150,104,44,0.25), rgba(196,154,60,0.12))",
            border: "1px solid rgba(196,154,60,0.3)",
            boxShadow: "0 32px 80px -32px rgba(0,0,0,0.8), 0 0 120px rgba(196,154,60,0.15)",
          }}
        >
          <div
            aria-hidden
            className="absolute rounded-full"
            style={{
              right: -100, top: -100, width: 400, height: 400,
              background: "radial-gradient(circle, rgba(196,154,60,0.3), transparent 60%)",
              filter: "blur(60px)",
            }}
          />
          <div className="relative">
            <h2
              className="font-extrabold"
              style={{ fontSize: "clamp(32px,4.5vw,52px)", letterSpacing: "-0.03em", lineHeight: 1, margin: "0 0 20px", color: "#f5f0e8" }}
            >
              Vamos conversar?
            </h2>
            <p style={{ fontSize: 17, color: "rgba(245,240,232,0.75)", margin: 0, maxWidth: 540 }}>
              Entre em contato com a 4Him Technology. Estamos prontos para entender o seu negócio e desenhar uma solução sob medida.
            </p>
          </div>
          <div className="relative flex flex-col gap-3">
            <button
              onClick={() => window.open("mailto:contato@4himtechnology.com", "_blank")}
              className="font-bold rounded-full transition-all duration-200 hover:scale-105 w-full"
              style={{
                padding: "18px 28px",
                background: "linear-gradient(135deg, #e8c060, #ffe9a8)",
                color: "#050505", fontSize: 14,
                boxShadow: "0 12px 32px rgba(255,233,168,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              Agendar conversa →
            </button>
            <button
              onClick={() => window.open(WHATSAPP_URL, "_blank")}
              className="font-semibold rounded-full transition-all duration-200 hover:border-white w-full flex items-center justify-center gap-2"
              style={{
                padding: "18px 28px",
                background: "transparent",
                color: "#f5f0e8",
                border: "1px solid rgba(245,240,232,0.25)",
                fontSize: 14,
              }}
            >
              <MessageCircle className="w-4 h-4" aria-hidden /> Falar no WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="relative z-10"
        style={{ padding: "40px 24px 24px", borderTop: "1px solid rgba(196,154,60,0.12)" }}
      >
        <div
          className="mx-auto flex flex-col md:flex-row md:justify-between gap-2"
          style={{ maxWidth: 1200, fontSize: 11, color: "rgba(245,240,232,0.35)" }}
        >
          <div>© {new Date().getFullYear()} 4Him Technology. Todos os direitos reservados.</div>
          <div>4Him Technology · Consultoria em IA</div>
        </div>
      </footer>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Voltar ao topo"
          className="fixed flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{
            bottom: 24, right: 24, zIndex: 50,
            width: 44, height: 44, borderRadius: 12,
            background: "rgba(10,10,10,0.85)",
            border: "1px solid rgba(196,154,60,0.4)",
            color: "#c49a3c",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          <ChevronUp className="w-5 h-5" aria-hidden />
        </button>
      )}
    </div>
  );
}