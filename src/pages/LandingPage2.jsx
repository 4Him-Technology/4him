import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, LayoutDashboard, Menu, X, ChevronUp, MessageCircle,
  Bot, CheckCircle2, ChevronDown, Clock, Calendar, BarChart3,
  Target, MessageSquare, Sparkles, Mail, MapPin, Globe, Check,
} from "lucide-react";

const LOGO_ICON_URL = "/images/logo-icon.png";
const WHATSAPP_URL  = "https://wa.me/5511999999999";

/* ── hooks ───────────────────────────────────────────────────── */
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

function useCounter(target, duration = 1600, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active || target === 0) { setVal(target); return; }
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, active]);
  return val;
}

function Reveal({ children, delay = 0, className = "", from = "bottom" }) {
  const ref   = useRef(null);
  const inView = useInView(ref);
  const init = { bottom: "translateY(28px)", left: "translateX(-28px)", right: "translateX(28px)" };
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate(0,0)" : (init[from] || init.bottom),
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── content ─────────────────────────────────────────────────── */
const NAV_LINKS = [
  ["solucao",  "Solução"],
  ["elo4h",    "ELO4H"],
  ["processo", "Processo"],
  ["faq",      "FAQ"],
  ["contato",  "Contato"],
];

const SECTORS = ["Saúde", "Jurídico", "Educação", "Varejo", "Serviços", "Imobiliário", "Franquias", "Indústria"];

const CHAT = [
  { role: "user", text: "Oi! Quero agendar uma consulta para amanhã." },
  { role: "bot",  text: "Olá! Tenho horários disponíveis às 10h, 14h e 16h. Qual prefere?" },
  { role: "user", text: "14h está ótimo!" },
  { role: "bot",  text: "Perfeito! Consulta confirmada para amanhã às 14h. Enviarei um lembrete. 📅" },
  { role: "bot",  text: "Posso ajudar com mais alguma coisa?" },
];

const STATS = [
  { value: 24,  suffix: "h",  label: "Disponibilidade contínua"   },
  { value: 6,   suffix: "+",  label: "Canais integrados"          },
  { value: 100, suffix: "%",  label: "Personalizado por empresa"  },
  { value: 0,   suffix: "",   label: "Templates genéricos usados" },
];

const BENTO = [
  { icon: Clock,        title: "Disponível 24h",        desc: "Atende clientes a qualquer hora, em qualquer canal — com o mesmo tom de voz da sua empresa.", tag: "24h / 7d",  large: true },
  { icon: MessageSquare,title: "Multicanal",             desc: "WhatsApp, Instagram e site num fluxo único. Áudio e imagem inclusos.",                          tags: ["WhatsApp","Instagram","Site"] },
  { icon: Target,       title: "Qualificação de leads",  desc: "Triagem automática. Só chega ao humano quem está pronto para fechar."                            },
  { icon: Calendar,     title: "Agenda inteligente",     desc: "Agendamento integrado em tempo real — zero conflito de horário.",                               stat: "0 conflitos" },
  { icon: Sparkles,     title: "IA que aprende",         desc: "Revisões mensais para afinar respostas e expandir escopo continuamente."                         },
];

const PROCESS = [
  { n:"01", t:"Diagnóstico",  dur:"Semana 1",       desc:"Mergulho na sua operação. Mapeamento de processos, gargalos e oportunidades.",       out:"Mapa de processos + relatório"         },
  { n:"02", t:"Desenho",      dur:"Semanas 2–3",     desc:"Arquitetura sob medida. Personalização por CNPJ, canal e equipe — zero template.",   out:"Especificação técnica + fluxos"        },
  { n:"03", t:"Implantação",  dur:"Semanas 3–5",     desc:"Integrações de canais, treinamento do agente com dados reais e dashboard.",          out:"Agente ativo + dashboard"              },
  { n:"04", t:"Operação",     dur:"A partir da sem. 6", desc:"Treinamento da equipe, suporte no onboarding e melhorias contínuas inclusas.",    out:"Suporte + revisões mensais"            },
];

const FAQS = [
  { q:"Quanto tempo leva a implantação?",              a:"Em média 4 a 6 semanas, do diagnóstico à operação. Projetos mais simples podem entrar em produção em 3 semanas." },
  { q:"Preciso trocar minha ferramenta atual?",        a:"Não necessariamente. O ELO4H integra com a maioria dos CRMs, agendas e sistemas existentes. Nosso diagnóstico mapeia o que pode ser conectado." },
  { q:"O agente funciona em qualquer segmento?",       a:"Sim. Atendemos Saúde, Jurídico, Educação, Varejo e outros. Cada agente é treinado no vocabulário e processos específicos do negócio." },
  { q:"O que acontece quando o cliente quer um humano?",a:"O agente faz handoff transparente, passando todo o histórico para o atendente humano. A transferência pode ser acionada pelo cliente ou automaticamente." },
  { q:"Como é o suporte pós-implantação?",             a:"Revisões mensais para afinar respostas, expandir escopo e ajustar fluxos com base nos dados reais. Evolução contínua, não suporte reativo." },
];

/* ── component ───────────────────────────────────────────────── */
export default function LandingPage2() {
  const navigate = useNavigate();
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [showTop,      setShowTop]      = useState(false);
  const [mouse,        setMouse]        = useState({ x: -9999, y: -9999 });
  const [openFaq,      setOpenFaq]      = useState(null);
  const [chatStep,     setChatStep]     = useState(0);

  const statsRef  = useRef(null);
  const statsView = useInView(statsRef, 0.3);

  const c0 = useCounter(STATS[0].value, 1600, statsView);
  const c1 = useCounter(STATS[1].value, 1400, statsView);
  const c2 = useCounter(STATS[2].value, 1800, statsView);
  const c3 = useCounter(STATS[3].value,  600, statsView);
  const counters = [c0, c1, c2, c3];

  /* chat sequencer */
  useEffect(() => {
    if (chatStep >= CHAT.length) return;
    const delay = chatStep === 0 ? 900 : 1300;
    const t = setTimeout(() => setChatStep(s => s + 1), delay);
    return () => clearTimeout(t);
  }, [chatStep]);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn, { passive: true });
    return () => window.removeEventListener("mousemove", fn);
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
    <div className="min-h-screen relative overflow-hidden font-inter" style={{ backgroundColor: "#050505", color: "#f5f0e8" }}>

      {/* ── keyframes ── */}
      <style>{`
        @keyframes pulse4h     { 0%,100%{ opacity:.5 } 50%{ opacity:1 } }
        @keyframes shimmer4h   { from{ background-position:200% 0 } to{ background-position:-200% 0 } }
        @keyframes fadeIn4h    { from{ opacity:0;transform:translateY(12px) } to{ opacity:1;transform:translateY(0) } }
        @keyframes fadeInFast  { from{ opacity:0 } to{ opacity:1 } }
        @keyframes marquee4h   { from{ transform:translateX(0) } to{ transform:translateX(-50%) } }
        @keyframes floatA      { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-10px) } }
        @keyframes floatB      { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-14px) } }
        @keyframes typingDot   { 0%,80%,100%{ opacity:0 } 40%{ opacity:1 } }
        @keyframes slideMsg    { from{ opacity:0;transform:translateY(8px) } to{ opacity:1;transform:translateY(0) } }
        .lp2-card { transition: transform 280ms cubic-bezier(.34,1.56,.64,1), box-shadow 280ms ease, border-color 280ms ease; }
        .lp2-card:hover { transform: translateY(-5px); box-shadow: 0 24px 56px -12px rgba(196,154,60,.22); border-color: rgba(196,154,60,.38) !important; }
        .lp2-faq-btn:hover { background: rgba(196,154,60,.06) !important; }
        button:focus-visible, a:focus-visible { outline:2px solid #c49a3c; outline-offset:3px; border-radius:6px; }
        @media(prefers-reduced-motion:reduce){ *,*::before,*::after{ animation-duration:.01ms!important; transition-duration:.01ms!important; } }
      `}</style>

      {/* mouse glow */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none" style={{
        background: `radial-gradient(700px circle at ${mouse.x}px ${mouse.y}px, rgba(196,154,60,.06), transparent 55%)`,
        transition: "background 80ms linear",
      }} />

      {/* grid bg */}
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(150,104,44,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(150,104,44,.06) 1px,transparent 1px)",
        backgroundSize: "80px 80px",
        maskImage: "radial-gradient(ellipse at 65% 15%, black 15%, transparent 65%)",
        WebkitMaskImage: "radial-gradient(ellipse at 65% 15%, black 15%, transparent 65%)",
      }} />

      {/* orbs */}
      <div aria-hidden className="absolute z-0 rounded-full pointer-events-none" style={{
        top: "-5%", right: "-8%", width: 800, height: 800,
        background: "radial-gradient(circle, rgba(196,154,60,.11), transparent 60%)",
        filter: "blur(100px)", animation: "pulse4h 10s ease-in-out infinite",
      }} />
      <div aria-hidden className="absolute z-0 rounded-full pointer-events-none" style={{
        bottom: "15%", left: "-12%", width: 600, height: 600,
        background: "radial-gradient(circle, rgba(150,104,44,.09), transparent 60%)",
        filter: "blur(80px)", animation: "pulse4h 13s ease-in-out infinite 3s",
      }} />

      {/* ── mobile menu ── */}
      {menuOpen && (
        <div role="dialog" aria-modal="true" aria-label="Menu de navegação"
          className="fixed inset-0 z-[200] flex flex-col"
          style={{ background: "rgba(5,5,5,.97)", backdropFilter: "blur(24px)", animation: "fadeInFast 200ms ease" }}>
          <div className="flex items-center justify-between" style={{ padding: "20px 24px" }}>
            <div className="flex items-center gap-3">
              <img src={LOGO_ICON_URL} alt="4Him Technology" className="h-9 w-auto" />
              <div>
                <div className="font-bold text-sm" style={{ color: "#f5f0e8" }}>4Him<span style={{ color: "#c49a3c" }}>.</span></div>
                <div className="text-[8px] font-medium uppercase -mt-0.5" style={{ letterSpacing: "0.2em", color: "rgba(245,240,232,.45)" }}>Technology</div>
              </div>
            </div>
            <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu"
              style={{ color: "rgba(245,240,232,.8)", padding: 8, borderRadius: 8 }}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col items-center justify-center flex-1 gap-1">
            {NAV_LINKS.map(([id, label], i) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="font-extrabold py-3 px-8 transition-colors duration-200"
                style={{ fontSize: "clamp(28px,8vw,40px)", color: "rgba(245,240,232,.85)", letterSpacing: "-0.03em", animation: `fadeIn4h 300ms ease ${i * 60}ms both` }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#c49a3c"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(245,240,232,.85)"; }}
              >{label}</button>
            ))}
            <div className="flex flex-col gap-3 w-full items-center mt-6"
              style={{ animation: "fadeIn4h 300ms ease 340ms both", padding: "0 32px", maxWidth: 340 }}>
              <button onClick={() => scrollTo("contato")}
                className="font-bold rounded-full w-full transition-all hover:scale-105"
                style={{ padding: "16px 28px", background: "linear-gradient(135deg,#96682c,#e8c060)", color: "#050505", fontSize: 15, boxShadow: "0 8px 32px rgba(196,154,60,.4)" }}>
                Falar com a 4Him →
              </button>
              <button onClick={() => navigate("/")}
                className="font-semibold rounded-full w-full"
                style={{ padding: "16px 28px", border: "1px solid rgba(196,154,60,.35)", color: "#c49a3c", fontSize: 15, background: "transparent" }}>
                Acessar Portal
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* ── nav ── */}
      <nav className="sticky z-50 flex items-center justify-between" aria-label="Navegação principal"
        style={{
          top: 16, margin: "16px 32px 0", padding: "12px 20px",
          background: "rgba(10,10,10,.65)",
          backdropFilter: "blur(24px) saturate(1.4)", WebkitBackdropFilter: "blur(24px) saturate(1.4)",
          border: "1px solid rgba(196,154,60,.18)", borderRadius: 100,
          boxShadow: "0 16px 48px -16px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.04)",
        }}>
        <div className="flex items-center gap-3">
          <img src={LOGO_ICON_URL} alt="4Him Technology" className="h-9 w-auto" />
          <div className="hidden sm:block">
            <div className="text-sm font-bold" style={{ color: "#f5f0e8", letterSpacing: "-0.01em" }}>4Him<span style={{ color: "#c49a3c" }}>.</span></div>
            <div className="text-[8px] font-medium uppercase -mt-0.5" style={{ letterSpacing: "0.2em", color: "rgba(245,240,232,.45)" }}>Technology</div>
          </div>
        </div>
        <div className="hidden md:flex gap-1 p-1 rounded-full" style={{ background: "rgba(0,0,0,.3)", border: "1px solid rgba(196,154,60,.08)" }}>
          {NAV_LINKS.map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="px-3.5 py-[7px] text-xs font-medium rounded-full transition-all duration-200"
              style={{ color: "rgba(245,240,232,.75)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(196,154,60,.12)"; e.currentTarget.style.color = "#f5f0e8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(245,240,232,.75)"; }}
            >{label}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/")} aria-label="Acessar portal"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full transition-all duration-200 hover:scale-105"
            style={{ border: "1px solid rgba(196,154,60,.35)", color: "#c49a3c", background: "transparent" }}>
            <LayoutDashboard className="w-3.5 h-3.5" aria-hidden /> Portal
          </button>
          <button onClick={() => scrollTo("contato")}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-full transition-all duration-200 hover:scale-105"
            style={{ background: "linear-gradient(135deg,#96682c,#e8c060)", color: "#050505", boxShadow: "0 4px 20px rgba(196,154,60,.4)" }}>
            Falar com a 4Him <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </button>
          <button className="md:hidden flex items-center justify-center" onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu" aria-expanded={menuOpen}
            style={{ color: "#f5f0e8", padding: 8, borderRadius: 8, background: "rgba(196,154,60,.1)", border: "1px solid rgba(196,154,60,.2)" }}>
            <Menu className="w-5 h-5" aria-hidden />
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════
          HERO — split layout
      ══════════════════════════════════════════════════════════ */}
      <section className="relative z-10" style={{ padding: "80px 24px 60px", maxWidth: 1400, margin: "0 auto" }}>
        <div className="grid gap-12 lg:grid-cols-2 items-center" style={{ minHeight: "68vh" }}>

          {/* left: text */}
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2.5 text-xs font-medium rounded-full"
                style={{ padding: "7px 18px", border: "1px solid rgba(196,154,60,.3)", color: "#c49a3c", background: "rgba(196,154,60,.06)", marginBottom: 32 }}>
                <span aria-hidden className="rounded-full" style={{ width: 6, height: 6, background: "#e8c060", boxShadow: "0 0 12px #e8c060" }} />
                Consultoria em Inteligência Artificial · Soluções sob medida
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="font-extrabold"
                style={{ fontSize: "clamp(40px,5vw,76px)", letterSpacing: "-0.045em", lineHeight: 0.95, margin: "0 0 28px", color: "#f5f0e8" }}>
                Seu negócio<br />
                atendendo{" "}
                <span className="font-serif4h italic font-normal"
                  style={{
                    fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
                    background: "linear-gradient(100deg,#96682c 5%,#e8c060 35%,#ffe9a8 50%,#e8c060 65%,#96682c 95%)",
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    animation: "shimmer4h 6s linear infinite",
                  }}>
                  sem parar.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p style={{ fontSize: "clamp(15px,1.4vw,18px)", lineHeight: 1.65, color: "rgba(245,240,232,.65)", maxWidth: 520, margin: "0 0 40px" }}>
                Desenhamos, implantamos e operamos agentes de IA treinados no seu processo.
                Atendimento humanizado, qualificação de leads e inteligência de dados — sem ampliar a equipe.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-col sm:flex-row gap-3" style={{ marginBottom: 48 }}>
                <button onClick={() => scrollTo("contato")}
                  className="font-bold rounded-full transition-all duration-200 hover:scale-105"
                  style={{ padding: "16px 28px", background: "linear-gradient(135deg,#96682c,#e8c060)", color: "#050505", fontSize: 14, boxShadow: "0 8px 32px rgba(196,154,60,.45), inset 0 1px 0 rgba(255,255,255,.25)" }}>
                  Agendar diagnóstico gratuito →
                </button>
                <button onClick={() => scrollTo("elo4h")}
                  className="font-semibold rounded-full transition-all duration-200"
                  style={{ padding: "16px 28px", background: "rgba(255,255,255,.03)", color: "#f5f0e8", border: "1px solid rgba(196,154,60,.25)", fontSize: 14 }}>
                  Conhecer o ELO4H
                </button>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="flex items-center gap-3">
                <div className="flex gap-1" aria-hidden>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: i < 4 ? "linear-gradient(135deg,#c49a3c,#ffe9a8)" : "rgba(196,154,60,.25)" }} />
                  ))}
                </div>
                <span style={{ fontSize: 12, color: "rgba(245,240,232,.45)" }}>
                  Implantado em múltiplos setores — zero template genérico
                </span>
              </div>
            </Reveal>
          </div>

          {/* right: animated chat mockup */}
          <Reveal delay={150} from="left">
            <div className="relative mx-auto lg:mx-0" style={{ maxWidth: 480, animation: "floatB 7s ease-in-out infinite" }}>

              {/* window */}
              <div style={{
                borderRadius: 24, overflow: "hidden",
                background: "rgba(10,10,10,.85)",
                border: "1px solid rgba(196,154,60,.22)",
                boxShadow: "0 40px 80px -20px rgba(0,0,0,.8), 0 0 60px rgba(196,154,60,.08)",
              }}>
                {/* chrome */}
                <div className="flex items-center justify-between"
                  style={{ padding: "14px 18px", background: "rgba(5,5,5,.8)", borderBottom: "1px solid rgba(196,154,60,.1)" }}>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center"
                      style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#96682c,#c49a3c)", boxShadow: "0 4px 12px rgba(196,154,60,.4)" }}>
                      <Bot style={{ width: 18, height: 18, color: "#050505" }} aria-hidden />
                    </div>
                    <div>
                      <div className="font-bold" style={{ fontSize: 13, color: "#f5f0e8" }}>ELO4H</div>
                      <div className="flex items-center gap-1.5" style={{ fontSize: 11, color: "rgba(245,240,232,.5)" }}>
                        <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 8px #4ade80" }} />
                        Online agora
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5" aria-hidden>
                    {["#ff5f57","#ffbd2e","#28c840"].map((c, i) => (
                      <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: .7 }} />
                    ))}
                  </div>
                </div>

                {/* messages */}
                <div style={{ padding: "18px 14px", minHeight: 280, display: "flex", flexDirection: "column", gap: 10 }}>
                  {CHAT.slice(0, chatStep).map((msg, i) => (
                    <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                      style={{ animation: "slideMsg 280ms ease" }}>
                      {msg.role === "bot" && (
                        <div aria-hidden style={{
                          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                          background: "linear-gradient(135deg,#96682c,#c49a3c)",
                          display: "flex", alignItems: "center", justifyContent: "center", alignSelf: "flex-end",
                        }}>
                          <Bot style={{ width: 14, height: 14, color: "#050505" }} />
                        </div>
                      )}
                      <div style={{
                        padding: "9px 13px", maxWidth: "78%", fontSize: 13, lineHeight: 1.5, color: "#f5f0e8",
                        borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        background: msg.role === "user" ? "linear-gradient(135deg,#96682c,#c49a3c)" : "rgba(28,28,28,.9)",
                        border: msg.role === "bot" ? "1px solid rgba(196,154,60,.12)" : "none",
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {/* typing indicator */}
                  {chatStep < CHAT.length && chatStep > 0 && CHAT[chatStep].role === "bot" && (
                    <div className="flex gap-2 items-end" aria-label="Digitando...">
                      <div aria-hidden style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        background: "linear-gradient(135deg,#96682c,#c49a3c)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Bot style={{ width: 14, height: 14, color: "#050505" }} />
                      </div>
                      <div style={{
                        padding: "11px 14px", borderRadius: "18px 18px 18px 4px",
                        background: "rgba(28,28,28,.9)", border: "1px solid rgba(196,154,60,.12)",
                        display: "flex", gap: 4, alignItems: "center",
                      }}>
                        {[0,1,2].map(i => (
                          <span key={i} aria-hidden style={{
                            width: 6, height: 6, borderRadius: "50%", background: "#c49a3c",
                            animation: `typingDot 1.4s ease-in-out ${i * 0.22}s infinite`,
                          }} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* input bar */}
                <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(196,154,60,.08)", display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ flex: 1, padding: "9px 14px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(196,154,60,.12)", borderRadius: 100, fontSize: 12, color: "rgba(245,240,232,.3)" }}>
                    Digite uma mensagem...
                  </div>
                  <div aria-hidden style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#96682c,#c49a3c)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ArrowRight style={{ width: 14, height: 14, color: "#050505" }} />
                  </div>
                </div>
              </div>

              {/* floating badges */}
              <div aria-hidden style={{
                position: "absolute", top: -18, left: -28,
                padding: "10px 14px", borderRadius: 14,
                background: "rgba(5,5,5,.92)", border: "1px solid rgba(196,154,60,.28)",
                backdropFilter: "blur(12px)", boxShadow: "0 8px 24px rgba(0,0,0,.5)",
                animation: "floatA 6s ease-in-out infinite",
              }}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 style={{ width: 15, height: 15, color: "#4ade80" }} />
                  <span style={{ fontSize: 12, color: "#f5f0e8", fontWeight: 600 }}>Consulta confirmada</span>
                </div>
                <div style={{ fontSize: 10, color: "rgba(245,240,232,.4)", marginTop: 2 }}>Amanhã às 14h · Dr. Carlos</div>
              </div>

              <div aria-hidden style={{
                position: "absolute", bottom: 72, right: -36,
                padding: "10px 14px", borderRadius: 14,
                background: "rgba(5,5,5,.92)", border: "1px solid rgba(196,154,60,.28)",
                backdropFilter: "blur(12px)", boxShadow: "0 8px 24px rgba(0,0,0,.5)",
                animation: "floatA 8s ease-in-out infinite 1.5s",
              }}>
                <div style={{ fontSize: 10, color: "rgba(245,240,232,.4)", marginBottom: 4 }}>Hoje · 23:47</div>
                <div className="flex items-center gap-2">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#e8c060", boxShadow: "0 0 8px #e8c060" }} />
                  <span style={{ fontSize: 12, color: "#f5f0e8", fontWeight: 600 }}>4 leads qualificados</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── marquee ── */}
      <div style={{ padding: "12px 0 48px" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(245,240,232,.32)", textAlign: "center", textTransform: "uppercase", marginBottom: 16 }}>
          Para empresas de qualquer setor com atendimento ao cliente
        </div>
        <div className="overflow-hidden" style={{ maskImage: "linear-gradient(90deg,transparent 0%,black 12%,black 88%,transparent 100%)", WebkitMaskImage: "linear-gradient(90deg,transparent 0%,black 12%,black 88%,transparent 100%)" }}>
          <div style={{ display: "flex", width: "max-content", animation: "marquee4h 24s linear infinite" }}>
            {[...SECTORS,...SECTORS,...SECTORS,...SECTORS].map((s, i) => (
              <div key={i} className="flex items-center shrink-0">
                <span style={{ color: "rgba(245,240,232,.48)", fontSize: 13, fontWeight: 500, padding: "0 24px", letterSpacing: "0.04em" }}>{s}</span>
                <span aria-hidden style={{ color: "rgba(196,154,60,.3)" }}>·</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          STATS — animated counters
      ══════════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="relative z-10"
        style={{ padding: "80px 24px", borderTop: "1px solid rgba(196,154,60,.1)", borderBottom: "1px solid rgba(196,154,60,.1)", background: "rgba(196,154,60,.02)" }}>
        <div className="mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10" style={{ maxWidth: 1000 }}>
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-black"
                style={{
                  fontSize: "clamp(52px,6vw,80px)", lineHeight: 1, letterSpacing: "-0.045em",
                  background: "linear-gradient(135deg,#c49a3c,#ffe9a8)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  marginBottom: 10,
                }}>
                {counters[i]}{s.suffix}
              </div>
              <div style={{ fontSize: 12, color: "rgba(245,240,232,.48)", letterSpacing: "0.04em", lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BENTO — features grid
      ══════════════════════════════════════════════════════════ */}
      <section id="solucao" className="relative z-10 mx-auto" style={{ padding: "120px 24px", maxWidth: 1300 }}>
        <div className="text-center" style={{ marginBottom: 64 }}>
          <Reveal>
            <div className="uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c49a3c", marginBottom: 16 }}>──── O que nossos agentes fazem ────</div>
            <h2 className="font-extrabold" style={{ fontSize: "clamp(32px,4.5vw,60px)", letterSpacing: "-0.03em", lineHeight: 1.05, margin: "0 0 20px" }}>
              Tudo que sua operação precisa.{" "}
              <span style={{ fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif', fontStyle: "italic", fontWeight: 400, color: "#c49a3c" }}>Em um agente.</span>
            </h2>
          </Reveal>
        </div>

        {/* row 1: large + small */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginBottom: 16 }}>
          {/* large card (2 cols) */}
          <Reveal delay={0} className="md:col-span-2">
            <div className="lp2-card h-full" style={{
              padding: "clamp(24px,3vw,40px)", borderRadius: 24, position: "relative", overflow: "hidden",
              background: "linear-gradient(145deg,rgba(150,104,44,.18),rgba(10,10,10,.72))",
              border: "1px solid rgba(196,154,60,.25)",
              display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 220,
            }}>
              <div aria-hidden style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(196,154,60,.18),transparent 60%)", filter: "blur(30px)" }} />
              <div>
                <div className="flex items-center gap-3" style={{ marginBottom: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,rgba(150,104,44,.35),rgba(196,154,60,.45))", border: "1px solid rgba(196,154,60,.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#e8c060" }}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold" style={{ fontSize: 20, color: "#f5f0e8", letterSpacing: "-0.01em" }}>Disponível 24 horas</h3>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(245,240,232,.65)", maxWidth: 480 }}>
                  Seu agente nunca dorme. Atende clientes a qualquer hora, preservando 100% do tom de voz da sua empresa — fins de semana e feriados inclusos.
                </p>
              </div>
              <div className="flex items-end justify-between flex-wrap gap-4" style={{ marginTop: 24 }}>
                <div>
                  <div className="font-black" style={{ fontSize: 64, lineHeight: 1, letterSpacing: "-0.045em", background: "linear-gradient(135deg,#c49a3c,#ffe9a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>24h</div>
                  <div style={{ fontSize: 11, color: "rgba(245,240,232,.4)", marginTop: 2 }}>sem pausas</div>
                </div>
                <div style={{ padding: "8px 16px", borderRadius: 100, background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.3)", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#4ade80", fontWeight: 600 }}>
                  <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
                  Ativo agora
                </div>
              </div>
            </div>
          </Reveal>

          {/* small card */}
          <Reveal delay={80}>
            <div className="lp2-card h-full" style={{
              padding: "clamp(20px,2.5vw,32px)", borderRadius: 24,
              background: "rgba(10,10,10,.6)", border: "1px solid rgba(196,154,60,.15)",
              display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 220,
            }}>
              <div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,rgba(150,104,44,.2),rgba(196,154,60,.3))", border: "1px solid rgba(196,154,60,.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#e8c060", marginBottom: 14 }}>
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="font-bold" style={{ fontSize: 17, color: "#f5f0e8", margin: "0 0 8px", letterSpacing: "-0.01em" }}>Multicanal</h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(245,240,232,.6)" }}>
                  WhatsApp, Instagram e site num fluxo único. Áudio e imagem inclusos.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5" style={{ marginTop: 16 }}>
                {["WhatsApp","Instagram","Site"].map(ch => (
                  <span key={ch} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 100, background: "rgba(196,154,60,.1)", border: "1px solid rgba(196,154,60,.2)", color: "#c49a3c", fontWeight: 600 }}>{ch}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* row 2: 3 equal cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginBottom: 16 }}>
          {[
            { icon: Target,    title: "Qualificação de leads",  desc: "Triagem automática. Só chega ao humano quem está pronto para fechar." },
            { icon: Calendar,  title: "Agenda inteligente",     desc: "Agendamento integrado em tempo real. Zero conflito de horário." },
            { icon: Sparkles,  title: "IA que aprende",         desc: "Revisões mensais. O agente evolui com a operação real da empresa." },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={i} delay={i * 70}>
                <div className="lp2-card h-full" style={{
                  padding: "clamp(20px,2.5vw,28px)", borderRadius: 24,
                  background: "rgba(10,10,10,.6)", border: "1px solid rgba(196,154,60,.15)", minHeight: 170,
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,rgba(150,104,44,.2),rgba(196,154,60,.3))", border: "1px solid rgba(196,154,60,.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#e8c060", marginBottom: 14 }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold" style={{ fontSize: 16, color: "#f5f0e8", margin: "0 0 8px", letterSpacing: "-0.01em" }}>{f.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(245,240,232,.6)", margin: 0 }}>{f.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* row 3: full-width dashboard card */}
        <Reveal delay={160}>
          <div className="lp2-card" style={{
            padding: "clamp(24px,3vw,40px)", borderRadius: 24,
            background: "rgba(10,10,10,.6)", border: "1px solid rgba(196,154,60,.15)",
          }}>
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,rgba(150,104,44,.2),rgba(196,154,60,.3))", border: "1px solid rgba(196,154,60,.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#e8c060", marginBottom: 16 }}>
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="font-bold" style={{ fontSize: 20, color: "#f5f0e8", margin: "0 0 10px", letterSpacing: "-0.01em" }}>Dashboard ao vivo</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(245,240,232,.6)", maxWidth: 440 }}>
                  Métricas em tempo real por canal, unidade e campanha. Recomendações estratégicas baseadas na operação — não em dados históricos.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label:"Atendimentos hoje", value:"147", trend:"+12%", up: true  },
                  { label:"Taxa de conversão",  value:"34%",  trend:"+5%",  up: true  },
                  { label:"Tempo médio",        value:"2m18s",trend:"-18%", up: false },
                ].map((m, i) => (
                  <div key={i} style={{ padding: 16, background: "rgba(5,5,5,.75)", borderRadius: 16, border: "1px solid rgba(196,154,60,.1)" }}>
                    <div style={{ fontSize: 10, color: "rgba(245,240,232,.38)", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>{m.label}</div>
                    <div className="font-black" style={{ fontSize: 22, color: "#f5f0e8", letterSpacing: "-0.03em", marginBottom: 4 }}>{m.value}</div>
                    <div style={{ fontSize: 11, color: m.up ? "#c49a3c" : "#4ade80", fontWeight: 600 }}>{m.trend} vs ontem</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ELO4H
      ══════════════════════════════════════════════════════════ */}
      <section id="elo4h" className="relative z-10"
        style={{ padding: "120px 24px", borderTop: "1px solid rgba(196,154,60,.12)", background: "radial-gradient(ellipse at top center, rgba(196,154,60,.07), transparent 60%)" }}>
        <div className="mx-auto grid gap-16 lg:grid-cols-2 items-center" style={{ maxWidth: 1300 }}>

          {/* visual */}
          <Reveal from="right">
            <div style={{
              padding: 40, borderRadius: 28,
              background: "linear-gradient(165deg,rgba(196,154,60,.12),rgba(10,10,10,.72))",
              border: "1px solid rgba(196,154,60,.25)",
              boxShadow: "0 32px 80px -24px rgba(0,0,0,.7)",
            }}>
              <div style={{ marginBottom: 28 }}>
                <div className="uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: "rgba(245,240,232,.4)", marginBottom: 8 }}>Equivalente a ter na sua equipe</div>
                <div className="font-black" style={{
                  fontSize: 72, letterSpacing: "-0.04em", lineHeight: 0.9,
                  background: "linear-gradient(135deg,#f5f0e8 20%,#c49a3c 60%,#96682c 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>ELO4H</div>
              </div>
              {[
                { role:"Recepcionista",        desc:"Atendimento humanizado 24h em todos os canais", icon:"◐" },
                { role:"Analista de dados",    desc:"Métricas em tempo real por canal e unidade",    icon:"◑" },
                { role:"Assistente comercial", desc:"Qualificação de leads e follow-up automático",   icon:"◒" },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-4"
                  style={{ padding: "18px 0", borderBottom: i < 2 ? "1px solid rgba(196,154,60,.1)" : "none" }}>
                  <div aria-hidden style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: "linear-gradient(135deg,#96682c,#c49a3c)", color: "#050505", fontSize: 24,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(196,154,60,.3)",
                  }}>{r.icon}</div>
                  <div>
                    <div className="font-bold" style={{ fontSize: 16, color: "#f5f0e8", marginBottom: 2 }}>{r.role}</div>
                    <div style={{ fontSize: 13, color: "rgba(245,240,232,.55)" }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* text */}
          <Reveal delay={150}>
            <div className="inline-flex items-center gap-2.5 uppercase font-semibold"
              style={{ padding: "6px 14px", border: "1px solid rgba(196,154,60,.35)", background: "rgba(196,154,60,.08)", borderRadius: 100, fontSize: 10, letterSpacing: "0.28em", color: "#e8c060", marginBottom: 24 }}>
              <span aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: "#e8c060" }} />
              Produto-âncora
            </div>
            <h2 className="font-extrabold" style={{ fontSize: "clamp(36px,4vw,60px)", letterSpacing: "-0.04em", lineHeight: 1, margin: "0 0 18px", color: "#f5f0e8" }}>
              Não apenas uma ferramenta.
            </h2>
            <p style={{ fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif', fontStyle: "italic", fontSize: 21, lineHeight: 1.5, color: "#f5f0e8", margin: "0 0 20px", fontWeight: 500 }}>
              Um sistema que organiza, analisa e escala seu negócio.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(245,240,232,.65)", margin: "0 0 32px", maxWidth: 460 }}>
              Desenhado para empresas que querem atender bem sem ampliar proporcionalmente a equipe — e transformar cada conversa em dado útil.
            </p>
            <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 32 }}>
              {["Treinado no seu processo","Multicanal integrado","Relatórios automáticos","Evolução mensal inclusa"].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5"
                  style={{ padding: "11px 13px", background: "rgba(10,10,10,.5)", border: "1px solid rgba(196,154,60,.12)", borderRadius: 12, fontSize: 13, color: "rgba(245,240,232,.85)" }}>
                  <div aria-hidden style={{ width: 16, height: 16, borderRadius: 6, background: "linear-gradient(135deg,#96682c,#c49a3c)", color: "#050505", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Check className="w-2.5 h-2.5" strokeWidth={4} />
                  </div>
                  {f}
                </div>
              ))}
            </div>
            <button onClick={() => scrollTo("contato")}
              className="font-bold rounded-full transition-all duration-200 hover:scale-105 inline-flex items-center gap-2"
              style={{ padding: "14px 24px", background: "linear-gradient(135deg,#96682c,#e8c060)", color: "#050505", fontSize: 14, boxShadow: "0 8px 28px rgba(196,154,60,.4)" }}>
              Quero o ELO4H <ArrowRight className="w-4 h-4" aria-hidden />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PROCESS — vertical alternating timeline
      ══════════════════════════════════════════════════════════ */}
      <section id="processo" className="relative z-10 mx-auto"
        style={{ padding: "120px 24px", maxWidth: 1000, borderTop: "1px solid rgba(196,154,60,.12)" }}>
        <div className="text-center" style={{ marginBottom: 80 }}>
          <Reveal>
            <div className="uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c49a3c", marginBottom: 16 }}>──── Como funciona ────</div>
            <h2 className="font-extrabold" style={{ fontSize: "clamp(32px,4.5vw,56px)", letterSpacing: "-0.03em", lineHeight: 1, margin: 0 }}>
              Do diagnóstico à{" "}
              <span style={{ fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif', fontStyle: "italic", fontWeight: 400, color: "#c49a3c" }}>operação.</span>
            </h2>
          </Reveal>
        </div>

        <div className="relative flex flex-col gap-12">
          {/* center line — desktop only */}
          <div aria-hidden className="hidden md:block absolute"
            style={{ left: "50%", top: 0, bottom: 0, width: 1, transform: "translateX(-50%)", background: "linear-gradient(180deg,transparent,rgba(196,154,60,.35) 8%,rgba(196,154,60,.35) 92%,transparent)" }} />

          {PROCESS.map((step, i) => {
            const isLeft = i % 2 === 0;
            return (
              <Reveal key={i} delay={i * 80} from={isLeft ? "right" : "left"}>
                {/* mobile: simple stacked; desktop: two-column alternating */}
                <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">

                  {/* left slot */}
                  <div className={isLeft ? "md:block" : "md:block md:invisible"}>
                    {isLeft && (
                      <div style={{ padding: "24px 28px", borderRadius: 20, background: "rgba(10,10,10,.6)", border: "1px solid rgba(196,154,60,.15)", backdropFilter: "blur(8px)" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: "rgba(196,154,60,.1)", border: "1px solid rgba(196,154,60,.22)", color: "#c49a3c", display: "inline-block", marginBottom: 14 }}>{step.dur}</div>
                        <h3 className="font-bold" style={{ fontSize: 21, color: "#f5f0e8", margin: "0 0 10px" }}>{step.t}</h3>
                        <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(245,240,232,.6)", margin: "0 0 14px" }}>{step.desc}</p>
                        <div className="flex items-center gap-2" style={{ fontSize: 12, color: "#c49a3c", padding: "8px 12px", borderRadius: 8, background: "rgba(196,154,60,.06)", border: "1px solid rgba(196,154,60,.14)" }}>
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden />
                          {step.out}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* center node */}
                  <div className="flex items-center justify-center">
                    <div className="font-extrabold flex items-center justify-center"
                      style={{ width: 60, height: 60, borderRadius: 16, background: "linear-gradient(135deg,#96682c,#c49a3c)", fontSize: 18, color: "#050505", boxShadow: "0 8px 32px rgba(196,154,60,.4), inset 0 1px 0 rgba(255,255,255,.2)", position: "relative", zIndex: 1 }}>
                      {step.n}
                    </div>
                  </div>

                  {/* right slot */}
                  <div className={!isLeft ? "md:block" : "md:block md:invisible"}>
                    {!isLeft && (
                      <div style={{ padding: "24px 28px", borderRadius: 20, background: "rgba(10,10,10,.6)", border: "1px solid rgba(196,154,60,.15)", backdropFilter: "blur(8px)" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: "rgba(196,154,60,.1)", border: "1px solid rgba(196,154,60,.22)", color: "#c49a3c", display: "inline-block", marginBottom: 14 }}>{step.dur}</div>
                        <h3 className="font-bold" style={{ fontSize: 21, color: "#f5f0e8", margin: "0 0 10px" }}>{step.t}</h3>
                        <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(245,240,232,.6)", margin: "0 0 14px" }}>{step.desc}</p>
                        <div className="flex items-center gap-2" style={{ fontSize: 12, color: "#c49a3c", padding: "8px 12px", borderRadius: 8, background: "rgba(196,154,60,.06)", border: "1px solid rgba(196,154,60,.14)" }}>
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden />
                          {step.out}
                        </div>
                      </div>
                    )}
                    {/* mobile fallback: always show on mobile */}
                    {isLeft && (
                      <div className="md:hidden" style={{ padding: "24px 28px", borderRadius: 20, background: "rgba(10,10,10,.6)", border: "1px solid rgba(196,154,60,.15)" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: "rgba(196,154,60,.1)", border: "1px solid rgba(196,154,60,.22)", color: "#c49a3c", display: "inline-block", marginBottom: 14 }}>{step.dur}</div>
                        <h3 className="font-bold" style={{ fontSize: 21, color: "#f5f0e8", margin: "0 0 10px" }}>{step.t}</h3>
                        <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(245,240,232,.6)", margin: "0 0 14px" }}>{step.desc}</p>
                        <div className="flex items-center gap-2" style={{ fontSize: 12, color: "#c49a3c", padding: "8px 12px", borderRadius: 8, background: "rgba(196,154,60,.06)", border: "1px solid rgba(196,154,60,.14)" }}>
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden />{step.out}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════ */}
      <section id="faq" className="relative z-10 mx-auto"
        style={{ padding: "100px 24px", maxWidth: 800, borderTop: "1px solid rgba(196,154,60,.12)" }}>
        <div className="text-center" style={{ marginBottom: 64 }}>
          <Reveal>
            <div className="uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c49a3c", marginBottom: 16 }}>──── Dúvidas frequentes ────</div>
            <h2 className="font-extrabold" style={{ fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.03em", margin: 0 }}>
              Perguntas{" "}
              <span style={{ fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif', fontStyle: "italic", fontWeight: 400, color: "#c49a3c" }}>frequentes.</span>
            </h2>
          </Reveal>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <Reveal key={i} delay={i * 50}>
              <div style={{
                borderRadius: 16, overflow: "hidden",
                background: openFaq === i ? "rgba(196,154,60,.045)" : "rgba(10,10,10,.55)",
                border: openFaq === i ? "1px solid rgba(196,154,60,.3)" : "1px solid rgba(196,154,60,.1)",
                transition: "all 240ms ease",
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="lp2-faq-btn w-full flex items-center justify-between text-left"
                  style={{ padding: "20px 24px", background: "transparent", color: "#f5f0e8", cursor: "pointer", border: "none", width: "100%" }}>
                  <span className="font-semibold" style={{ fontSize: 15, letterSpacing: "-0.01em", paddingRight: 16 }}>{faq.q}</span>
                  <ChevronDown className="w-5 h-5 shrink-0" aria-hidden
                    style={{ color: "#c49a3c", transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 240ms ease" }} />
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 20px", fontSize: 14, lineHeight: 1.75, color: "rgba(245,240,232,.65)", animation: "fadeIn4h 200ms ease" }}>
                    {faq.a}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════════ */}
      <section id="contato" className="relative z-10" style={{ padding: "60px 24px 80px" }}>
        <Reveal>
          <div className="relative mx-auto overflow-hidden"
            style={{
              maxWidth: 1200, textAlign: "center",
              padding: "clamp(48px,6vw,80px) clamp(24px,5vw,72px)",
              borderRadius: 32,
              background: "linear-gradient(135deg,rgba(150,104,44,.22),rgba(196,154,60,.1))",
              border: "1px solid rgba(196,154,60,.28)",
              boxShadow: "0 32px 80px -32px rgba(0,0,0,.8), 0 0 120px rgba(196,154,60,.1)",
            }}>
            <div aria-hidden style={{ position: "absolute", left: "50%", top: "-50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(196,154,60,.16),transparent 60%)", filter: "blur(80px)" }} />
            <div className="relative">
              <div className="inline-flex items-center gap-2.5 text-xs font-medium rounded-full"
                style={{ padding: "7px 18px", border: "1px solid rgba(196,154,60,.35)", color: "#c49a3c", background: "rgba(196,154,60,.08)", marginBottom: 28 }}>
                <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: "#e8c060", boxShadow: "0 0 12px #e8c060" }} />
                Sem compromisso · Diagnóstico gratuito
              </div>
              <h2 className="font-extrabold"
                style={{ fontSize: "clamp(32px,5vw,64px)", letterSpacing: "-0.04em", lineHeight: 1, margin: "0 0 24px", color: "#f5f0e8" }}>
                Vamos desenhar<br />
                <span style={{
                  fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif', fontStyle: "italic", fontWeight: 400,
                  background: "linear-gradient(100deg,#96682c 5%,#e8c060 35%,#ffe9a8 50%,#e8c060 65%,#96682c 95%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  animation: "shimmer4h 6s linear infinite",
                }}>
                  a sua solução.
                </span>
              </h2>
              <p style={{ fontSize: "clamp(15px,1.5vw,18px)", color: "rgba(245,240,232,.7)", maxWidth: 540, margin: "0 auto 40px", lineHeight: 1.65 }}>
                Converse com a 4Him. Entenderemos seu processo, mapearemos o que pode ser automatizado e desenharemos uma proposta sob medida — sem compromisso.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => window.open("mailto:contato@4himtechnology.com", "_blank")}
                  className="font-bold rounded-full transition-all duration-200 hover:scale-105"
                  style={{ padding: "18px 32px", background: "linear-gradient(135deg,#e8c060,#ffe9a8)", color: "#050505", fontSize: 14, boxShadow: "0 12px 32px rgba(255,233,168,.4), inset 0 1px 0 rgba(255,255,255,.4)" }}>
                  Agendar diagnóstico gratuito →
                </button>
                <button onClick={() => window.open(WHATSAPP_URL, "_blank")}
                  className="font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-2"
                  style={{ padding: "18px 32px", background: "transparent", color: "#f5f0e8", border: "1px solid rgba(245,240,232,.2)", fontSize: 14 }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(245,240,232,.4)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(245,240,232,.2)"; }}>
                  <MessageCircle className="w-4 h-4" aria-hidden /> Falar no WhatsApp
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── footer ── */}
      <footer className="relative z-10" style={{ padding: "64px 24px 32px", borderTop: "1px solid rgba(196,154,60,.12)" }}>
        <div className="mx-auto" style={{ maxWidth: 1300 }}>
          <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]" style={{ marginBottom: 48 }}>
            <div>
              <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
                <img src={LOGO_ICON_URL} alt="" className="h-10 w-auto" />
                <div>
                  <div className="font-bold" style={{ fontSize: 16, color: "#f5f0e8" }}>4Him Technology</div>
                  <div className="uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: "rgba(245,240,232,.4)" }}>Consultoria em IA</div>
                </div>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(245,240,232,.5)", maxWidth: 320, margin: "0 0 20px" }}>
                Transformamos processos operacionais em inteligência estratégica. Soluções de IA sob medida para empresas que atendem gente.
              </p>
              <div className="inline-flex items-center gap-2"
                style={{ padding: "7px 14px", borderRadius: 100, background: "rgba(74,222,128,.07)", border: "1px solid rgba(74,222,128,.2)", fontSize: 12, color: "#4ade80", fontWeight: 600 }}>
                <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
                Aceitando novos projetos
              </div>
            </div>

            {[
              ["Soluções", ["ELO4H","Agentes customizados","Consultoria de IA","Implantação assistida"]],
              ["Método",   ["Diagnóstico","Desenho","Implantação","Operação contínua"]],
              ["Contato",  [
                { icon: Mail,   label: "contato@4himtechnology.com", href: "mailto:contato@4himtechnology.com" },
                { icon: Globe,  label: "www.4himtechnology.com",     href: "https://www.4himtechnology.com"   },
                { icon: MapPin, label: "Brasil",                      href: null },
              ]],
            ].map(([h, items], i) => (
              <div key={i}>
                <div className="uppercase" style={{ fontSize: 10, letterSpacing: "0.3em", color: "#c49a3c", marginBottom: 16 }}>{h}</div>
                {items.map((v, j) => {
                  if (typeof v === "string") {
                    return <div key={j} style={{ fontSize: 13, color: "rgba(245,240,232,.65)", padding: "6px 0" }}>{v}</div>;
                  }
                  const Icon = v.icon;
                  const inner = <><Icon className="w-3.5 h-3.5 shrink-0" style={{ color: "#c49a3c" }} aria-hidden />{v.label}</>;
                  return v.href
                    ? <a key={j} href={v.href} target={v.href.startsWith("http") ? "_blank" : undefined} rel={v.href.startsWith("http") ? "noopener noreferrer" : undefined} className="flex items-center gap-2" style={{ fontSize: 13, color: "rgba(245,240,232,.65)", padding: "6px 0", textDecoration: "none" }}>{inner}</a>
                    : <div key={j} className="flex items-center gap-2" style={{ fontSize: 13, color: "rgba(245,240,232,.65)", padding: "6px 0" }}>{inner}</div>;
                })}
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:justify-between gap-2"
            style={{ paddingTop: 24, borderTop: "1px solid rgba(196,154,60,.1)", fontSize: 11, color: "rgba(245,240,232,.32)" }}>
            <div>© {new Date().getFullYear()} 4Him Technology. Todos os direitos reservados.</div>
            <div>Transformamos processos operacionais em inteligência estratégica.</div>
          </div>
        </div>
      </footer>

      {/* scroll to top */}
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Voltar ao topo"
          className="fixed flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{
            bottom: 24, right: 24, zIndex: 50,
            width: 44, height: 44, borderRadius: 12,
            background: "rgba(10,10,10,.88)", border: "1px solid rgba(196,154,60,.4)",
            color: "#c49a3c", backdropFilter: "blur(12px)",
            boxShadow: "0 8px 24px rgba(0,0,0,.5)", animation: "fadeIn4h 300ms ease",
          }}>
          <ChevronUp className="w-5 h-5" aria-hidden />
        </button>
      )}
    </div>
  );
}
