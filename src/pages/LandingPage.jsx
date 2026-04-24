import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, LayoutDashboard, Check,
  Clock, Calendar, BarChart3, Target, MessageSquare, Sparkles,
  Mail, MapPin, Globe, Menu, X, ChevronUp, MessageCircle,
} from "lucide-react";

const LOGO_URL = "https://media.base44.com/images/public/69d05d38b40549791975d990/834173352_w2.png";
const WHATSAPP_URL = "https://wa.me/5511999999999"; // substituir pelo número real

/* ═══════════════════════════════════════════════════════════════
   Hooks & helpers
   ═══════════════════════════════════════════════════════════════ */

function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return inView;
}

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Content
   ═══════════════════════════════════════════════════════════════ */

const stats = [
  { value: "24h", label: "Disponibilidade do agente" },
  { value: "6+",  label: "Canais integrados" },
  { value: "100%", label: "Personalizado por empresa" },
  { value: "0",   label: "Templates genéricos" },
];

const pillars = [
  {
    label: "Atendimento",
    title: "Atendimento 24h que não perde oportunidade",
    desc: "Um agente treinado no seu negócio responde clientes a qualquer hora, em qualquer canal — com o mesmo tom de voz da sua empresa.",
    features: [
      "Disponível 24/7",
      "WhatsApp · Instagram · Site",
      "Leitura de áudio e imagem",
      "Respostas humanizadas",
      "Handoff para humano quando preciso",
      "Histórico completo preservado",
    ],
  },
  {
    label: "Comercial",
    title: "Qualificação e conversão automatizadas",
    desc: "Triagem automática de leads, follow-up no tempo certo e agendamento integrado — tudo sem precisar aumentar a equipe.",
    features: [
      "Qualificação automática",
      "Follow-up no tempo ideal",
      "Agenda inteligente",
      "Zero conflito de horário",
      "Conversão monitorada",
      "Integração com o seu CRM",
    ],
  },
  {
    label: "Inteligência",
    title: "Dados que viram decisão",
    desc: "Dashboard em tempo real com métricas por unidade, canal e campanha. Recomendações estratégicas baseadas na operação real.",
    features: [
      "Métricas em tempo real",
      "Análise por unidade / canal",
      "Recomendações do agente",
      "Relatórios exportáveis",
      "Identificação de gargalos",
      "Base para decisões do gestor",
    ],
  },
];

const values = [
  { icon: "◆", title: "Personalização real", desc: "Nada de template. Cada agente é treinado no seu processo, tom de voz e regras de negócio." },
  { icon: "◉", title: "Consultoria, não ferramenta", desc: "Entregamos diagnóstico, arquitetura e operação. Você sai com um sistema, não com um login." },
  { icon: "✦", title: "IA que evolui", desc: "O agente aprende com a operação. Revisões mensais para afinar respostas e expandir escopo." },
  { icon: "↻", title: "Implantação assistida", desc: "Treinamento da equipe, integração de canais e acompanhamento durante o onboarding." },
];

const features = [
  { icon: Clock,         title: "Atendimento 24h",      desc: "Humanizado e disponível a qualquer hora, sem perder oportunidade." },
  { icon: Calendar,      title: "Agenda inteligente",   desc: "Agendamento automatizado com integração direta. Zero conflito." },
  { icon: BarChart3,     title: "Dashboard & métricas", desc: "Visualização em tempo real de atendimentos, conversões e desempenho." },
  { icon: Target,        title: "Qualificação de leads",desc: "Triagem automática para maximizar a taxa de conversão." },
  { icon: MessageSquare, title: "Multicanal",           desc: "WhatsApp, Instagram e site em um só lugar. Áudio e imagem inclusos." },
  { icon: Sparkles,      title: "Inteligência interna", desc: "Análises e recomendações baseadas na operação real do seu negócio." },
];

const objectives = [
  { n: "01", t: "Aumentar conversão de leads",      d: "Follow-up automatizado e qualificação inteligente elevam a taxa de fechamento sem esforço adicional." },
  { n: "02", t: "Reduzir custos operacionais",      d: "Diminuição real da carga operacional com manutenção ou aumento da qualidade do atendimento." },
  { n: "03", t: "Eliminar falhas humanas",          d: "Atendimento consistente, sem esquecimentos, com registro completo de cada interação." },
  { n: "04", t: "Organizar a agenda",               d: "Agendamento escalável, sem conflitos, integrado aos canais de comunicação." },
  { n: "05", t: "Gerar inteligência em tempo real", d: "Métricas e recomendações que chegam ao gestor antes da decisão — não depois do problema." },
  { n: "06", t: "Centralizar os canais",            d: "WhatsApp, Instagram, site e outros unificados num só fluxo — uma só conversa por cliente." },
];

const processSteps = [
  { t: "Diagnóstico", d: "Mergulho na sua operação. Mapeamento de processos, gargalos e oportunidades." },
  { t: "Desenho",     d: "Arquitetura da solução sob medida. Personalização por CNPJ, canal e equipe." },
  { t: "Implantação", d: "Integrações de canais, treinamento do agente e configuração do dashboard." },
  { t: "Operação",    d: "Treinamento da equipe, suporte no onboarding e melhorias contínuas inclusas." },
];

const sectors = ["Serviços", "Saúde", "Educação", "Jurídico", "Varejo", "Indústria", "Imobiliário", "Franquias"];

const NAV_LINKS = [
  ["metodo",   "Método"],
  ["elo4h",    "ELO4H"],
  ["servicos", "Serviços"],
  ["sobre",    "Sobre"],
  ["contato",  "Contato"],
];

/* ═══════════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll when mobile menu is open
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
      {/* ─── Global styles ─── */}
      <style>{`
        @keyframes pulseGlow4h  { 0%,100% { opacity: 0.5 } 50% { opacity: 1 } }
        @keyframes floatH4h    { 0%,100% { transform: translateY(0) rotate(-2deg) } 50% { transform: translateY(-18px) rotate(2deg) } }
        @keyframes shimmer4h   { from { background-position: 200% 0 } to { background-position: -200% 0 } }
        @keyframes spin4h      { from { transform: rotate(0) } to { transform: rotate(360deg) } }
        @keyframes fadeIn4h    { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes fadeInFast  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes marquee4h   { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .font-serif4h { font-family: "Cormorant Garamond", "Playfair Display", Georgia, serif; }
        button, a[role="button"] { cursor: pointer; }
        button:focus-visible, a:focus-visible {
          outline: 2px solid #c49a3c;
          outline-offset: 3px;
          border-radius: 6px;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* ─── Animated grid background ─── */}
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

      {/* ─── Ambient orbs ─── */}
      <div
        aria-hidden
        className="absolute z-0 rounded-full pointer-events-none"
        style={{
          top: "5%", left: "-10%", width: 700, height: 700,
          background: "radial-gradient(circle, rgba(196,154,60,0.18), transparent 60%)",
          filter: "blur(80px)", animation: "pulseGlow4h 8s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="absolute z-0 rounded-full pointer-events-none"
        style={{
          top: "50%", right: "-15%", width: 600, height: 600,
          background: "radial-gradient(circle, rgba(150,104,44,0.15), transparent 60%)",
          filter: "blur(80px)", animation: "pulseGlow4h 10s ease-in-out infinite 2s",
        }}
      />

      {/* ─── Mobile menu overlay ─── */}
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
          {/* Menu header */}
          <div className="flex items-center justify-between" style={{ padding: "20px 24px" }}>
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="4Him Technology" className="h-9 w-auto" />
              <div>
                <div className="font-bold text-sm" style={{ color: "#f5f0e8", letterSpacing: "-0.01em" }}>
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

          {/* Menu links */}
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
            <div
              className="flex flex-col gap-3 w-full items-center mt-6"
              style={{ animation: "fadeIn4h 300ms ease 320ms both", padding: "0 32px", maxWidth: 340 }}
            >
              <button
                onClick={() => scrollTo("contato")}
                className="font-bold rounded-full w-full transition-all hover:scale-105"
                style={{
                  padding: "16px 28px",
                  background: "linear-gradient(135deg, #96682c, #e8c060)",
                  color: "#050505",
                  fontSize: 15,
                  boxShadow: "0 8px 32px rgba(196,154,60,0.4)",
                }}
              >
                Falar com a 4Him →
              </button>
              <button
                onClick={() => navigate("/")}
                className="font-semibold rounded-full w-full transition-all"
                style={{
                  padding: "16px 28px",
                  border: "1px solid rgba(196,154,60,0.35)",
                  color: "#c49a3c",
                  fontSize: 15,
                  background: "transparent",
                }}
              >
                Acessar Portal
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* ─── NAV ─── */}
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
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt="4Him Technology" className="h-9 w-auto" />
          <div className="hidden sm:block">
            <div className="text-sm font-bold" style={{ color: "#f5f0e8", letterSpacing: "-0.01em" }}>
              4Him<span style={{ color: "#c49a3c" }}>.</span>
            </div>
            <div
              className="text-[8px] font-medium uppercase -mt-0.5"
              style={{ letterSpacing: "0.2em", color: "rgba(245,240,232,0.45)" }}
            >
              Technology
            </div>
          </div>
        </div>

        {/* Desktop nav links */}
        <div
          className="hidden md:flex gap-1 p-1 rounded-full"
          style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(196,154,60,0.08)",
          }}
        >
          {NAV_LINKS.map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="px-3.5 py-[7px] text-xs font-medium rounded-full transition-all duration-200"
              style={{ color: "rgba(245,240,232,0.75)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(196,154,60,0.12)";
                e.currentTarget.style.color = "#f5f0e8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(245,240,232,0.75)";
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            aria-label="Acessar portal"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full transition-all duration-200 hover:scale-105"
            style={{
              border: "1px solid rgba(196,154,60,0.35)",
              color: "#c49a3c",
              background: "transparent",
            }}
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

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu de navegação"
            aria-expanded={menuOpen}
            style={{
              color: "#f5f0e8",
              padding: 8,
              borderRadius: 8,
              background: "rgba(196,154,60,0.1)",
              border: "1px solid rgba(196,154,60,0.2)",
            }}
          >
            <Menu className="w-5 h-5" aria-hidden />
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section
        className="relative z-10 text-center"
        style={{ padding: "120px 24px 100px", maxWidth: 1560, margin: "0 auto" }}
      >
        <Reveal>
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
            <span
              aria-hidden
              className="rounded-full"
              style={{ width: 6, height: 6, background: "#e8c060", boxShadow: "0 0 12px #e8c060" }}
            />
            Consultoria em Inteligência Artificial · Soluções sob medida
          </div>
        </Reveal>

        <Reveal delay={150}>
          <h1
            className="font-extrabold"
            style={{
              fontSize: "clamp(40px, 7vw, 116px)",
              letterSpacing: "-0.045em",
              lineHeight: 0.94,
              margin: "0 0 32px",
              color: "#f5f0e8",
            }}
          >
            Transformamos processos<br />
            operacionais em<br />
            <span
              className="font-serif4h italic font-normal"
              style={{
                background:
                  "linear-gradient(100deg, #96682c 5%, #e8c060 35%, #ffe9a8 50%, #e8c060 65%, #96682c 95%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer4h 6s linear infinite",
              }}
            >
              inteligência estratégica.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={300}>
          <p
            className="mx-auto"
            style={{
              fontSize: "clamp(16px,2vw,20px)", lineHeight: 1.6,
              color: "rgba(245,240,232,0.65)",
              maxWidth: 720, margin: "0 auto 48px",
            }}
          >
            Somos uma consultoria de IA que desenha, implanta e opera agentes
            inteligentes para empresas de qualquer setor. Cada solução é construída
            sob medida para o seu processo — sem templates, sem gambiarras.
          </p>
        </Reveal>

        <Reveal delay={450}>
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center" style={{ marginBottom: 80 }}>
            <button
              onClick={() => scrollTo("contato")}
              className="font-bold rounded-full transition-all duration-200 hover:scale-105 hover:shadow-2xl"
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
              onClick={() => scrollTo("metodo")}
              className="font-semibold rounded-full transition-all duration-200 hover:border-[rgba(196,154,60,0.5)]"
              style={{
                padding: "16px 28px",
                background: "rgba(255,255,255,0.03)",
                color: "#f5f0e8",
                border: "1px solid rgba(196,154,60,0.25)",
                fontSize: 14,
                backdropFilter: "blur(8px)",
              }}
            >
              Conhecer o método
            </button>
          </div>
        </Reveal>

        {/* Floating H monogram */}
        <Reveal delay={600}>
          <div className="relative mx-auto w-fit" style={{ padding: 40 }}>
            <div
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{ border: "1px solid rgba(196,154,60,0.2)", animation: "spin4h 30s linear infinite" }}
            />
            <div
              aria-hidden
              className="absolute rounded-full"
              style={{
                inset: 20,
                border: "1px dashed rgba(196,154,60,0.15)",
                animation: "spin4h 20s linear infinite reverse",
              }}
            />
            <div
              className="flex items-center justify-center"
              style={{
                width: 320, height: 320,
                animation: "floatH4h 6s ease-in-out infinite",
                filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.9)) drop-shadow(0 0 60px rgba(196,154,60,0.35))",
              }}
            >
              <img src={LOGO_URL} alt="" className="w-full h-full object-contain" />
            </div>

            {[
              { text: "Atendimento 24h",         x: -160, y: 20,  delay: 0 },
              { text: "Multicanal",              x: 220,  y: -40, delay: 1 },
              { text: "Agenda integrada",        x: 220,  y: 200, delay: 2 },
              { text: "Dashboard em tempo real", x: -220, y: 220, delay: 1.5 },
            ].map((b, i) => (
              <div
                key={i}
                aria-hidden
                className="absolute hidden md:flex items-center gap-2 font-semibold rounded-full whitespace-nowrap"
                style={{
                  left: `calc(50% + ${b.x}px)`,
                  top: `calc(50% + ${b.y}px)`,
                  background: "rgba(10,10,10,0.85)",
                  border: "1px solid rgba(196,154,60,0.3)",
                  padding: "8px 14px",
                  fontSize: 11,
                  color: "#f5f0e8",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  animation: `floatH4h 4s ease-in-out infinite ${b.delay}s`,
                }}
              >
                <span style={{ color: "#c49a3c" }} aria-hidden>●</span> {b.text}
              </div>
            ))}
          </div>
        </Reveal>

        {/* ─ Stats strip ─ */}
        <Reveal delay={750}>
          <div
            className="mx-auto grid grid-cols-2 sm:grid-cols-4 gap-px"
            style={{
              maxWidth: 720,
              marginTop: 64,
              marginBottom: 56,
              border: "1px solid rgba(196,154,60,0.15)",
              borderRadius: 20,
              overflow: "hidden",
              background: "rgba(196,154,60,0.12)",
            }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                className="text-center"
                style={{
                  padding: "24px 16px",
                  background: "rgba(5,5,5,0.85)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  className="font-black"
                  style={{
                    fontSize: "clamp(28px,4vw,40px)",
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                    background: "linear-gradient(135deg, #c49a3c, #ffe9a8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(245,240,232,0.5)",
                    marginTop: 8,
                    letterSpacing: "0.04em",
                    lineHeight: 1.4,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ─ Sectors marquee strip ─ */}
        <Reveal delay={900}>
          <div style={{ marginTop: 16 }}>
            <div
              className="uppercase font-medium"
              style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(245,240,232,0.4)", marginBottom: 20 }}
            >
              Para empresas de qualquer setor que tenham atendimento ao cliente
            </div>
            <div
              className="overflow-hidden"
              style={{
                maskImage: "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "max-content",
                  animation: "marquee4h 22s linear infinite",
                }}
              >
                {/* Doubled for seamless loop */}
                {[...sectors, ...sectors, ...sectors, ...sectors].map((c, i) => (
                  <div key={i} className="flex items-center gap-0 shrink-0">
                    <span
                      className="font-medium text-sm"
                      style={{ color: "rgba(245,240,232,0.55)", letterSpacing: "0.04em", padding: "0 20px" }}
                    >
                      {c}
                    </span>
                    <span style={{ color: "rgba(196,154,60,0.35)" }} aria-hidden>·</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─── VALUES BAND ─── */}
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
        <div className="mx-auto grid gap-12 md:grid-cols-2 lg:grid-cols-4" style={{ maxWidth: 1200 }}>
          {values.map((v, i) => (
            <Reveal key={i} delay={i * 100}>
              <div>
                <div
                  className="font-serif4h"
                  style={{ fontSize: 28, color: "#c49a3c", marginBottom: 16 }}
                  aria-hidden
                >
                  {v.icon}
                </div>
                <h3 className="font-bold" style={{ fontSize: 18, color: "#f5f0e8", margin: "0 0 10px", letterSpacing: "-0.01em" }}>
                  {v.title}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(245,240,232,0.6)", margin: 0 }}>
                  {v.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── PILLARS TABS ─── */}
      <section
        id="servicos"
        className="relative z-10 mx-auto"
        style={{ padding: "120px 24px", maxWidth: 1560 }}
      >
        <div className="text-center" style={{ marginBottom: 64 }}>
          <Reveal>
            <div
              className="uppercase"
              style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c49a3c", marginBottom: 16 }}
            >
              ──── O que nossos agentes fazem ────
            </div>
            <h2 className="font-extrabold" style={{ fontSize: "clamp(36px,5vw,64px)", letterSpacing: "-0.03em", lineHeight: 1, margin: "0 0 20px" }}>
              Três pilares.{" "}
              <span className="font-serif4h italic font-normal" style={{ color: "#c49a3c" }}>Uma</span>{" "}
              operação inteira.
            </h2>
            <p className="mx-auto" style={{ fontSize: 17, color: "rgba(245,240,232,0.6)", maxWidth: 620 }}>
              Atendimento, conversão comercial e inteligência de dados conectados no
              mesmo agente — desenhados especificamente para a sua empresa.
            </p>
          </Reveal>
        </div>

        {/* Tab selector */}
        <div
          role="tablist"
          aria-label="Pilares do sistema"
          className="flex justify-center gap-1 mx-auto rounded-full"
          style={{
            padding: 6,
            background: "rgba(10,10,10,0.6)",
            border: "1px solid rgba(196,154,60,0.15)",
            maxWidth: 540,
            marginBottom: 48,
          }}
        >
          {pillars.map((s, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={tab === i}
              aria-controls={`pillar-panel-${i}`}
              onClick={() => setTab(i)}
              className="flex-1 rounded-full transition-all duration-300"
              style={{
                padding: "12px 16px",
                background: tab === i ? "linear-gradient(135deg, #96682c, #c49a3c)" : "transparent",
                color: tab === i ? "#050505" : "rgba(245,240,232,0.7)",
                fontSize: 12,
                fontWeight: tab === i ? 700 : 500,
                boxShadow: tab === i ? "0 4px 16px rgba(196,154,60,0.35)" : "none",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          id={`pillar-panel-${tab}`}
          key={tab}
          role="tabpanel"
          className="grid gap-14 md:grid-cols-2"
          style={{
            border: "1px solid rgba(196,154,60,0.18)",
            background: "linear-gradient(180deg, rgba(196,154,60,0.04), rgba(10,10,10,0.6))",
            borderRadius: 28,
            padding: "clamp(28px, 4vw, 56px)",
            animation: "fadeIn4h 400ms ease",
            boxShadow: "0 32px 64px -32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div>
            <h3 className="font-bold" style={{ fontSize: "clamp(24px,3.5vw,42px)", letterSpacing: "-0.025em", lineHeight: 1.05, margin: "0 0 20px", color: "#f5f0e8" }}>
              {pillars[tab].title}
            </h3>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: "rgba(245,240,232,0.6)", margin: "0 0 32px" }}>
              {pillars[tab].desc}
            </p>
            <button
              onClick={() => scrollTo("contato")}
              className="font-semibold rounded-full transition-all duration-200 hover:scale-105"
              style={{
                padding: "12px 22px",
                background: "transparent",
                color: "#c49a3c",
                border: "1px solid rgba(196,154,60,0.4)",
                fontSize: 12,
              }}
            >
              Conversar sobre o seu caso →
            </button>
          </div>
          <div>
            <div
              className="uppercase"
              style={{ fontSize: 11, letterSpacing: "0.28em", color: "rgba(245,240,232,0.4)", marginBottom: 20 }}
            >
              O que está incluso
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pillars[tab].features.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 transition-all duration-200"
                  style={{
                    padding: "14px 16px",
                    background: "rgba(10,10,10,0.5)",
                    border: "1px solid rgba(196,154,60,0.12)",
                    borderRadius: 12,
                    fontSize: 13,
                    color: "rgba(245,240,232,0.85)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(196,154,60,0.4)";
                    e.currentTarget.style.background = "rgba(196,154,60,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(196,154,60,0.12)";
                    e.currentTarget.style.background = "rgba(10,10,10,0.5)";
                  }}
                >
                  <div
                    className="flex items-center justify-center shrink-0"
                    aria-hidden
                    style={{
                      width: 16, height: 16, borderRadius: 6,
                      background: "linear-gradient(135deg, #96682c, #c49a3c)",
                      color: "#050505", fontSize: 10, fontWeight: 900,
                    }}
                  >
                    <Check className="w-2.5 h-2.5" strokeWidth={4} />
                  </div>
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── ELO4H ─── */}
      <section
        id="elo4h"
        className="relative z-10"
        style={{
          padding: "120px 24px",
          borderTop: "1px solid rgba(196,154,60,0.12)",
          background: "radial-gradient(ellipse at top, rgba(196,154,60,0.08), transparent 60%)",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 1560 }}>
          <div className="grid gap-20 md:grid-cols-2 items-center" style={{ marginBottom: 80 }}>
            <Reveal>
              <div
                className="inline-flex items-center gap-2.5 uppercase font-semibold"
                style={{
                  padding: "6px 14px",
                  border: "1px solid rgba(196,154,60,0.35)",
                  background: "rgba(196,154,60,0.08)",
                  borderRadius: 100,
                  fontSize: 10, letterSpacing: "0.28em",
                  color: "#e8c060",
                  marginBottom: 24,
                }}
              >
                <span aria-hidden className="rounded-full" style={{ width: 5, height: 5, background: "#e8c060" }} />
                Produto-âncora
              </div>
              <h2
                className="font-black"
                style={{
                  fontSize: "clamp(56px,9vw,88px)",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.9,
                  margin: "0 0 24px",
                  background: "linear-gradient(135deg, #f5f0e8 20%, #c49a3c 60%, #96682c 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ELO4H
              </h2>
              <p
                className="font-serif4h italic font-medium"
                style={{ fontSize: 22, lineHeight: 1.5, color: "#f5f0e8", margin: "0 0 24px" }}
              >
                Não apenas uma ferramenta — um sistema inteligente
                que organiza, analisa e escala seu negócio.
              </p>
              <p
                style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(245,240,232,0.65)", margin: 0, maxWidth: 480 }}
              >
                Nosso agente de atendimento e inteligência comercial. Desenhado
                para empresas que querem atender bem sem proporcionalmente crescer
                a equipe — e transformar cada conversa em dado útil.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div
                className="relative overflow-hidden"
                style={{
                  padding: 40,
                  borderRadius: 24,
                  background: "linear-gradient(165deg, rgba(196,154,60,0.14), rgba(10,10,10,0.7) 60%)",
                  border: "1px solid rgba(196,154,60,0.3)",
                  boxShadow: "0 32px 80px -24px rgba(0,0,0,0.8)",
                }}
              >
                <div
                  className="uppercase"
                  style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(245,240,232,0.5)", marginBottom: 20 }}
                >
                  Equivalente a ter
                </div>
                {[
                  { role: "Recepcionista",        desc: "Atendimento humanizado 24h, em todos os canais",  icon: "◐" },
                  { role: "Analista de dados",    desc: "Métricas em tempo real, por canal e unidade",     icon: "◑" },
                  { role: "Assistente comercial", desc: "Qualificação de leads e follow-up automático",    icon: "◒" },
                ].map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4"
                    style={{ padding: "16px 0", borderBottom: i < 2 ? "1px solid rgba(196,154,60,0.15)" : "none" }}
                  >
                    <div
                      className="flex items-center justify-center shrink-0"
                      aria-hidden
                      style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: "linear-gradient(135deg, #96682c, #c49a3c)",
                        color: "#050505", fontSize: 22,
                        boxShadow: "0 4px 12px rgba(196,154,60,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
                      }}
                    >
                      {r.icon}
                    </div>
                    <div>
                      <div className="font-bold" style={{ fontSize: 16, color: "#f5f0e8", marginBottom: 2 }}>{r.role}</div>
                      <div style={{ fontSize: 13, color: "rgba(245,240,232,0.6)" }}>{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Features grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={i} delay={i * 80}>
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      padding: 28,
                      borderRadius: 20,
                      background: "rgba(10,10,10,0.5)",
                      border: "1px solid rgba(196,154,60,0.15)",
                      backdropFilter: "blur(8px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor = "rgba(196,154,60,0.4)";
                      e.currentTarget.style.boxShadow = "0 24px 48px -12px rgba(196,154,60,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "rgba(196,154,60,0.15)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      className="flex items-center justify-center"
                      aria-hidden
                      style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: "linear-gradient(135deg, rgba(150,104,44,0.2), rgba(196,154,60,0.3))",
                        border: "1px solid rgba(196,154,60,0.3)",
                        color: "#e8c060",
                        marginBottom: 20,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold" style={{ fontSize: 17, margin: "0 0 8px", color: "#f5f0e8", letterSpacing: "-0.01em" }}>
                      {f.title}
                    </h3>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(245,240,232,0.6)", margin: 0 }}>
                      {f.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── OBJECTIVES ─── */}
      <section className="relative z-10 mx-auto" style={{ padding: "120px 24px", maxWidth: 1560 }}>
        <div className="text-center" style={{ marginBottom: 64 }}>
          <Reveal>
            <div className="uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c49a3c", marginBottom: 16 }}>
              ──── O que buscamos na sua operação ────
            </div>
            <h2 className="font-extrabold" style={{ fontSize: "clamp(32px,4.5vw,56px)", letterSpacing: "-0.03em", lineHeight: 1, margin: 0 }}>
              Objetivos da{" "}
              <span className="font-serif4h italic font-normal" style={{ color: "#c49a3c" }}>implantação.</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {objectives.map((o, i) => (
            <Reveal key={i} delay={i * 80}>
              <div
                className="h-full"
                style={{
                  padding: 28,
                  borderRadius: 20,
                  background: "rgba(10,10,10,0.5)",
                  border: "1px solid rgba(196,154,60,0.12)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  aria-hidden
                  className="font-black"
                  style={{
                    fontSize: 40, lineHeight: 1, letterSpacing: "-0.03em",
                    background: "linear-gradient(135deg, #c49a3c, #ffe9a8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    marginBottom: 16,
                  }}
                >
                  {o.n}
                </div>
                <h3 className="font-bold" style={{ fontSize: 18, color: "#f5f0e8", margin: "0 0 10px", letterSpacing: "-0.01em" }}>
                  {o.t}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(245,240,232,0.6)", margin: 0 }}>{o.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── METHOD ─── */}
      <section
        id="metodo"
        className="relative z-10 mx-auto"
        style={{ padding: "120px 24px", maxWidth: 1560, borderTop: "1px solid rgba(196,154,60,0.12)" }}
      >
        <div className="text-center" style={{ marginBottom: 80 }}>
          <div className="uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c49a3c", marginBottom: 16 }}>
            ──── Método ────
          </div>
          <h2 className="font-extrabold" style={{ fontSize: "clamp(32px,4.5vw,56px)", letterSpacing: "-0.03em", lineHeight: 1, margin: 0 }}>
            Do diagnóstico<br />
            à operação{" "}
            <span className="font-serif4h italic font-normal" style={{ color: "#c49a3c" }}>assistida.</span>
          </h2>
        </div>

        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            aria-hidden
            className="hidden lg:block absolute"
            style={{
              top: 30, left: "12.5%", right: "12.5%", height: 1,
              background: "linear-gradient(90deg, transparent, rgba(196,154,60,0.4), rgba(196,154,60,0.4), transparent)",
              zIndex: 0,
            }}
          />
          {processSteps.map((p, i) => (
            <Reveal key={i} delay={i * 150}>
              <div className="relative z-10">
                <div
                  className="flex items-center justify-center font-extrabold mx-auto"
                  aria-hidden
                  style={{
                    width: 60, height: 60, borderRadius: 16,
                    background: "linear-gradient(135deg, #96682c, #c49a3c)",
                    fontSize: 22, color: "#050505",
                    marginBottom: 24,
                    boxShadow: "0 8px 28px rgba(196,154,60,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div
                  className="text-center"
                  style={{
                    padding: 24, borderRadius: 20,
                    background: "rgba(10,10,10,0.6)",
                    border: "1px solid rgba(196,154,60,0.15)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <h3 className="font-bold" style={{ fontSize: 22, margin: "0 0 12px", color: "#f5f0e8" }}>{p.t}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(245,240,232,0.6)", margin: 0 }}>{p.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
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
              style={{
                fontSize: "clamp(32px,4.5vw,52px)", letterSpacing: "-0.03em",
                lineHeight: 1, margin: "0 0 20px", color: "#f5f0e8",
              }}
            >
              Vamos desenhar a sua solução.
            </h2>
            <p style={{ fontSize: 17, color: "rgba(245,240,232,0.75)", margin: 0, maxWidth: 540 }}>
              Converse com a 4Him. Entenderemos seu processo, mapearemos o que pode
              ser automatizado e desenharemos uma proposta sob medida — sem compromisso.
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
        style={{
          padding: "64px 24px 32px",
          borderTop: "1px solid rgba(196,154,60,0.12)",
          marginTop: 40,
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 1560 }}>
          <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]" style={{ marginBottom: 48 }}>
            <div>
              <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
                <img src={LOGO_URL} alt="" className="h-10 w-auto" />
                <div>
                  <div className="font-bold" style={{ fontSize: 16, color: "#f5f0e8" }}>4Him Technology</div>
                  <div
                    className="uppercase"
                    style={{ fontSize: 9, letterSpacing: "0.22em", color: "rgba(245,240,232,0.4)" }}
                  >
                    Consultoria em IA
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(245,240,232,0.5)", maxWidth: 360 }}>
                Transformamos processos operacionais em inteligência estratégica.
                Soluções de IA desenhadas sob medida — para empresas que atendem gente.
              </p>
            </div>

            {[
              ["Soluções", ["ELO4H", "Agentes customizados", "Consultoria de IA"]],
              ["Método",   ["Diagnóstico", "Desenho", "Implantação", "Operação"]],
              ["Contato",  [
                { icon: Mail,   label: "contato@4himtechnology.com", href: "mailto:contato@4himtechnology.com" },
                { icon: Globe,  label: "www.4himtechnology.com",      href: "https://www.4himtechnology.com" },
                { icon: MapPin, label: "Brasil",                       href: null },
              ]],
            ].map(([h, items], i) => (
              <div key={i}>
                <div
                  className="uppercase"
                  style={{ fontSize: 10, letterSpacing: "0.3em", color: "#c49a3c", marginBottom: 16 }}
                >
                  {h}
                </div>
                {items.map((v, j) => {
                  if (typeof v === "string") {
                    return (
                      <div key={j} style={{ fontSize: 13, color: "rgba(245,240,232,0.7)", padding: "6px 0" }}>
                        {v}
                      </div>
                    );
                  }
                  const Icon = v.icon;
                  const content = (
                    <>
                      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: "#c49a3c" }} aria-hidden />
                      {v.label}
                    </>
                  );
                  return v.href ? (
                    <a
                      key={j}
                      href={v.href}
                      target={v.href.startsWith("http") ? "_blank" : undefined}
                      rel={v.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-2 transition-colors duration-150 hover:opacity-100"
                      style={{ fontSize: 13, color: "rgba(245,240,232,0.7)", padding: "6px 0", textDecoration: "none" }}
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      key={j}
                      className="flex items-center gap-2"
                      style={{ fontSize: 13, color: "rgba(245,240,232,0.7)", padding: "6px 0" }}
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div
            className="flex flex-col md:flex-row md:justify-between gap-2"
            style={{
              paddingTop: 24,
              borderTop: "1px solid rgba(196,154,60,0.1)",
              fontSize: 11,
              color: "rgba(245,240,232,0.35)",
            }}
          >
            <div>© {new Date().getFullYear()} 4Him Technology. Todos os direitos reservados.</div>
            <div>Transformamos processos operacionais em inteligência estratégica.</div>
          </div>
        </div>
      </footer>

      {/* ─── Scroll to top ─── */}
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
            animation: "fadeIn4h 300ms ease",
          }}
        >
          <ChevronUp className="w-5 h-5" aria-hidden />
        </button>
      )}
    </div>
  );
}
