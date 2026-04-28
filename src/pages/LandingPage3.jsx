import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, LayoutDashboard, Menu, X, ChevronUp, MessageCircle,
  MessageSquare, Target, BarChart3, DollarSign, Zap, TrendingUp,
  Mail, MapPin, Globe, Check, Clock, Sparkles, ChevronRight,
  Lock, Calendar,
} from "lucide-react";

const LOGO_ICON_URL = "/images/logo-icon.png";
const WHATSAPP_URL  = "https://wa.me/5511999999999";

/* ─────────────────────────────────────────────────────────────
   Hooks
───────────────────────────────────────────────────────────── */
function useScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setPct(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return pct;
}

function useInView(ref, threshold = 0.15) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setV(true), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return v;
}

function useCounter(target, dur = 1600, active = false) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active || target === 0) { setN(target); return; }
    let t0 = null;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, dur, active]);
  return n;
}

function useTypewriter(words, speed = 60, delSpeed = 32, pause = 2200) {
  const [text, setText] = useState("");
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[wi];
    if (!del && ci === w.length) {
      const t = setTimeout(() => setDel(true), pause);
      return () => clearTimeout(t);
    }
    if (del && ci === 0) { setDel(false); setWi(i => (i + 1) % words.length); return; }
    const nx = del ? ci - 1 : ci + 1;
    const t = setTimeout(() => { setCi(nx); setText(w.slice(0, nx)); }, del ? delSpeed : speed);
    return () => clearTimeout(t);
  }, [ci, del, wi, words, speed, delSpeed, pause]);
  return text;
}

function useTilt(strength = 9) {
  const ref = useRef(null);
  const onMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * strength * 2}deg) rotateX(${-y * strength * 2}deg) translateZ(12px)`;
    el.style.transition = "transform 80ms linear";
  }, [strength]);
  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 450ms cubic-bezier(.34,1.56,.64,1)";
    el.style.transform = "";
  }, []);
  return { ref, onMouseMove, onMouseLeave };
}

function Reveal({ children, delay = 0, className = "", from = "bottom" }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const init = { bottom: "translateY(28px)", left: "translateX(-32px)", right: "translateX(32px)", none: "none" };
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${className}`}
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translate(0,0)" : (init[from] || init.bottom), transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Content
───────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  ["desafio",  "Seu desafio"],
  ["produtos", "Produtos"],
  ["metodo",   "Método"],
  ["contato",  "Contato"],
];

const TYPEWRITER_WORDS = [
  "resolve gargalos operacionais.",
  "automatiza seu atendimento.",
  "transforma dados em decisão.",
  "escala sem ampliar equipe.",
  "gera inteligência estratégica.",
];

const BOTTLENECKS = [
  {
    id: "atendimento", icon: MessageSquare, color: "#c49a3c",
    title: "Atendimento sobrecarregado",
    pain: "Equipe não dá conta do volume. Respostas lentas, clientes perdidos.",
    product: "ELO4H — Atendimento",
    solution: "Um agente treinado no seu negócio responde em todos os canais 24h, com o tom de voz da sua empresa. Handoff para humano quando necessário.",
    metric: "3× mais capacidade sem contratar",
  },
  {
    id: "leads", icon: Target, color: "#e8c060",
    title: "Leads sem qualificação",
    pain: "Muitos contatos chegando, poucos convertendo. Triagem manual ineficiente.",
    product: "ELO4H — Comercial",
    solution: "Qualificação automática + follow-up no tempo ideal. Só chega ao time comercial quem está pronto para fechar.",
    metric: "↑ taxa de conversão automatizada",
  },
  {
    id: "dados", icon: BarChart3, color: "#ffe9a8",
    title: "Decisões sem dados reais",
    pain: "Gestão no escuro. Sem métricas em tempo real por canal ou unidade.",
    product: "ELO4H — Inteligência",
    solution: "Dashboard em tempo real com métricas por canal, unidade e campanha. Recomendações estratégicas do agente antes da decisão.",
    metric: "→ dados antes de toda decisão",
  },
  {
    id: "financeiro", icon: DollarSign, color: "#a78bfa",
    title: "Financeiro manual e lento",
    pain: "Conciliações demoradas, sem previsibilidade. BPO caro e ineficiente.",
    product: "4Hbel — BPO Financeiro",
    solution: "IA aplicada ao BPO financeiro. Automação de conciliações, relatórios automatizados e previsibilidade de fluxo de caixa.",
    metric: "↓ custo operacional financeiro",
  },
  {
    id: "processos", icon: Zap, color: "#34d399",
    title: "Processos 100% manuais",
    pain: "Tarefas repetitivas que consomem o time e geram erros sistemáticos.",
    product: "Consultoria 4Him",
    solution: "Diagnóstico completo dos processos. Identificamos os maiores gargalos e desenhamos automações sob medida para cada operação.",
    metric: "→ redesenho com IA personalizada",
  },
  {
    id: "escala", icon: TrendingUp, color: "#f472b6",
    title: "Crescer sem ampliar equipe",
    pain: "Quer escalar mas não pode contratar. Capacidade limitada segurando o crescimento.",
    product: "ELO4H + 4Hbel",
    solution: "Ecossistema completo: atendimento, comercial, inteligência e BPO financeiro em agentes integrados que escalam com o negócio.",
    metric: "→ escala sem custo proporcional",
  },
];

const ELO4H_TABS = [
  {
    id: "atendimento", label: "Atendimento",
    title: "Atendimento 24h que não perde oportunidade",
    desc: "Um agente treinado no seu negócio responde clientes a qualquer hora, em qualquer canal — com o mesmo tom de voz da sua empresa.",
    features: ["Disponível 24/7","WhatsApp · Instagram · Site","Leitura de áudio e imagem","Respostas humanizadas","Handoff para humano","Histórico completo"],
  },
  {
    id: "comercial", label: "Comercial",
    title: "Qualificação e conversão automatizadas",
    desc: "Triagem automática de leads, follow-up no tempo certo e agendamento integrado — sem aumentar a equipe.",
    features: ["Qualificação automática","Follow-up no tempo ideal","Agenda inteligente","Zero conflito de horário","Conversão monitorada","Integração com CRM"],
  },
  {
    id: "inteligencia", label: "Inteligência",
    title: "Dados que viram decisão",
    desc: "Dashboard em tempo real com métricas por unidade, canal e campanha. Recomendações estratégicas baseadas na operação real.",
    features: ["Métricas em tempo real","Análise por unidade/canal","Recomendações do agente","Relatórios exportáveis","Identificação de gargalos","Base para o gestor"],
  },
];

const PROCESS = [
  { n:"01", t:"Diagnóstico",  d:"Mergulho na sua operação. Mapeamos processos, gargalos e oportunidades que a IA pode resolver.",       dur:"Semana 1"       },
  { n:"02", t:"Desenho",      d:"Arquitetura da solução sob medida. Personalização por CNPJ, canal e equipe — zero template.",           dur:"Semanas 2–3"     },
  { n:"03", t:"Implantação",  d:"Integrações de canais, treinamento do agente com dados reais e configuração do dashboard.",             dur:"Semanas 3–5"     },
  { n:"04", t:"Operação",     d:"Treinamento da equipe, suporte no onboarding e melhorias contínuas mensais inclusas no contrato.",      dur:"A partir da sem. 6" },
];

const STATS = [
  { v:24,   s:"h",  l:"Disponibilidade"       },
  { v:6,    s:"+",  l:"Canais integrados"      },
  { v:100,  s:"%",  l:"Personalizado"          },
  { v:0,    s:"",   l:"Templates genéricos"    },
];

const SECTORS = ["Saúde","Jurídico","Educação","Varejo","Serviços","Imobiliário","Franquias","Indústria"];

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
export default function LandingPage3() {
  const navigate = useNavigate();
  const scrollPct   = useScrollProgress();
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [showTop,   setShowTop]   = useState(false);
  const [mouse,     setMouse]     = useState({ x: -9999, y: -9999 });
  const [selected,  setSelected]  = useState(null);   // bottleneck id
  const [eloTab,    setEloTab]    = useState(0);       // ELO4H sub-tab

  const typed = useTypewriter(TYPEWRITER_WORDS);

  const statsRef  = useRef(null);
  const statsView = useInView(statsRef, 0.3);
  const s0 = useCounter(STATS[0].v, 1400, statsView);
  const s1 = useCounter(STATS[1].v, 1200, statsView);
  const s2 = useCounter(STATS[2].v, 1800, statsView);
  const s3 = useCounter(STATS[3].v,  600, statsView);
  const counters = [s0, s1, s2, s3];

  const eloTilt  = useTilt(7);
  const hbelTilt = useTilt(7);

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

  const activeBG = selected
    ? BOTTLENECKS.find(b => b.id === selected)
    : null;

  return (
    <div className="min-h-screen relative overflow-hidden font-inter" style={{ backgroundColor: "#050505", color: "#f5f0e8" }}>

      {/* ── keyframes ── */}
      <style>{`
        @keyframes pulse4h   { 0%,100%{ opacity:.5 } 50%{ opacity:1 } }
        @keyframes shimmer4h { from{ background-position:200% 0 } to{ background-position:-200% 0 } }
        @keyframes fadeIn4h  { from{ opacity:0;transform:translateY(10px) } to{ opacity:1;transform:translateY(0) } }
        @keyframes fadeInFast{ from{ opacity:0 } to{ opacity:1 } }
        @keyframes marquee4h { from{ transform:translateX(0) } to{ transform:translateX(-50%) } }
        @keyframes float1    { 0%,100%{ transform:translate(0,0) } 33%{ transform:translate(60px,-40px) } 66%{ transform:translate(-40px,30px) } }
        @keyframes float2    { 0%,100%{ transform:translate(0,0) } 25%{ transform:translate(-80px,50px) } 75%{ transform:translate(50px,-60px) } }
        @keyframes float3    { 0%,100%{ transform:translate(0,0) } 50%{ transform:translate(70px,70px) } }
        @keyframes blink     { 0%,100%{ opacity:1 } 50%{ opacity:0 } }
        @keyframes slidePanel{ from{ opacity:0;transform:translateY(16px) } to{ opacity:1;transform:translateY(0) } }
        @keyframes progressGrow{ from{ width:0 } }
        @keyframes scaleIn   { from{ opacity:0;transform:scale(.96) } to{ opacity:1;transform:scale(1) } }
        @keyframes scanline  { 0%{ top:-4px } 100%{ top:104% } }
        .lp3-btn-primary { transition: transform 200ms ease, box-shadow 200ms ease; }
        .lp3-btn-primary:hover { transform: scale(1.04); box-shadow: 0 12px 40px rgba(196,154,60,.5); }
        .lp3-btn-ghost { transition: border-color 200ms ease, background 200ms ease; }
        .lp3-btn-ghost:hover { background: rgba(196,154,60,.08); border-color: rgba(196,154,60,.5) !important; }
        .lp3-bcard { transition: border-color 200ms ease, background 200ms ease, transform 200ms ease; cursor: pointer; }
        .lp3-bcard:hover { transform: translateY(-3px); }
        .lp3-tab { transition: all 250ms ease; }
        button:focus-visible, a:focus-visible { outline:2px solid #c49a3c; outline-offset:3px; border-radius:6px; }
        @media(prefers-reduced-motion:reduce){ *,*::before,*::after{ animation-duration:.01ms!important; transition-duration:.01ms!important; } }
      `}</style>

      {/* ── scroll progress bar ── */}
      <div aria-hidden style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 1000, background: "rgba(255,255,255,.04)" }}>
        <div style={{ height: "100%", width: `${scrollPct}%`, background: "linear-gradient(90deg,#96682c,#e8c060,#ffe9a8)", transition: "width 80ms linear", borderRadius: 2 }} />
      </div>

      {/* ── mouse glow ── */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none" style={{
        background: `radial-gradient(650px circle at ${mouse.x}px ${mouse.y}px, rgba(196,154,60,.055), transparent 50%)`,
        transition: "background 100ms linear",
      }} />

      {/* ── animated orbs (drift) ── */}
      <div aria-hidden style={{ position: "absolute", top: "-5%", left: "-5%", width: 900, height: 900, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle, rgba(196,154,60,.1), transparent 60%)", filter: "blur(100px)", animation: "float1 28s ease-in-out infinite" }} />
      <div aria-hidden style={{ position: "absolute", top: "40%", right: "-10%", width: 700, height: 700, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle, rgba(150,104,44,.09), transparent 60%)", filter: "blur(80px)", animation: "float2 35s ease-in-out infinite" }} />
      <div aria-hidden style={{ position: "absolute", bottom: "5%", left: "20%", width: 500, height: 500, borderRadius: "50%", pointerEvents: "none", zIndex: 0, background: "radial-gradient(circle, rgba(196,154,60,.07), transparent 60%)", filter: "blur(70px)", animation: "float3 22s ease-in-out infinite" }} />

      {/* ── dot grid ── */}
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(rgba(150,104,44,.18) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        maskImage: "radial-gradient(ellipse at 50% 0%, black 0%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, black 0%, transparent 70%)",
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
            <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu" style={{ color: "rgba(245,240,232,.8)", padding: 8, borderRadius: 8 }}>
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
              style={{ animation: "fadeIn4h 300ms ease 300ms both", padding: "0 32px", maxWidth: 340 }}>
              <button onClick={() => scrollTo("contato")} className="lp3-btn-primary font-bold rounded-full w-full"
                style={{ padding: "16px 28px", background: "linear-gradient(135deg,#96682c,#e8c060)", color: "#050505", fontSize: 15, boxShadow: "0 8px 32px rgba(196,154,60,.4)" }}>
                Falar com a 4Him →
              </button>
              <button onClick={() => navigate("/")} className="lp3-btn-ghost font-semibold rounded-full w-full"
                style={{ padding: "16px 28px", border: "1px solid rgba(196,154,60,.35)", color: "#c49a3c", fontSize: 15, background: "transparent" }}>
                Acessar Portal
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          NAV
      ════════════════════════════════════════════════════════ */}
      <nav className="sticky z-50 flex items-center justify-between" aria-label="Navegação principal"
        style={{ top: 16, margin: "16px 32px 0", padding: "12px 20px", background: "rgba(10,10,10,.7)", backdropFilter: "blur(24px) saturate(1.4)", WebkitBackdropFilter: "blur(24px) saturate(1.4)", border: "1px solid rgba(196,154,60,.18)", borderRadius: 100, boxShadow: "0 16px 48px -16px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.04)" }}>
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
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full lp3-btn-ghost"
            style={{ border: "1px solid rgba(196,154,60,.35)", color: "#c49a3c", background: "transparent" }}>
            <LayoutDashboard className="w-3.5 h-3.5" aria-hidden /> Portal
          </button>
          <button onClick={() => scrollTo("contato")}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-full lp3-btn-primary"
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

      {/* ════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════ */}
      <section className="relative z-10 text-center"
        style={{ padding: "120px 24px 100px", maxWidth: 1400, margin: "0 auto" }}>

        <Reveal>
          <div className="inline-flex items-center gap-2.5 text-xs font-medium rounded-full"
            style={{ padding: "7px 18px", border: "1px solid rgba(196,154,60,.3)", color: "#c49a3c", background: "rgba(196,154,60,.06)", marginBottom: 40 }}>
            <span aria-hidden className="rounded-full" style={{ width: 6, height: 6, background: "#e8c060", boxShadow: "0 0 12px #e8c060" }} />
            Consultoria Estratégica em IA · Ecossistema de produtos sob medida
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="font-extrabold" style={{ fontSize: "clamp(40px,6.5vw,104px)", letterSpacing: "-0.045em", lineHeight: 0.93, margin: "0 0 28px", color: "#f5f0e8" }}>
            IA estratégica que
          </h1>
        </Reveal>

        {/* typewriter line */}
        <Reveal delay={200}>
          <div style={{ fontSize: "clamp(36px,5.5vw,88px)", fontWeight: 900, letterSpacing: "-0.045em", lineHeight: 1, margin: "0 0 40px", minHeight: "clamp(48px,7vw,100px)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{
              fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
              fontStyle: "italic", fontWeight: 400,
              background: "linear-gradient(100deg,#96682c 5%,#e8c060 35%,#ffe9a8 50%,#e8c060 65%,#96682c 95%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              animation: "shimmer4h 6s linear infinite",
            }}>
              {typed}
            </span>
            <span aria-hidden style={{ width: 3, height: "0.9em", background: "#e8c060", borderRadius: 2, animation: "blink 1s ease-in-out infinite", display: "inline-block", verticalAlign: "middle" }} />
          </div>
        </Reveal>

        <Reveal delay={300}>
          <p style={{ fontSize: "clamp(15px,1.5vw,20px)", lineHeight: 1.65, color: "rgba(245,240,232,.62)", maxWidth: 680, margin: "0 auto 52px" }}>
            Somos uma consultoria que desenha, implanta e opera agentes inteligentes para empresas de qualquer setor.
            Cada solução é construída sob medida — do diagnóstico à operação contínua.
          </p>
        </Reveal>

        <Reveal delay={400}>
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center" style={{ marginBottom: 72 }}>
            <button onClick={() => scrollTo("desafio")} className="lp3-btn-primary font-bold rounded-full"
              style={{ padding: "17px 32px", background: "linear-gradient(135deg,#96682c,#e8c060)", color: "#050505", fontSize: 14, boxShadow: "0 10px 36px rgba(196,154,60,.5), inset 0 1px 0 rgba(255,255,255,.25)" }}>
              Qual é o seu gargalo? →
            </button>
            <button onClick={() => scrollTo("produtos")} className="lp3-btn-ghost font-semibold rounded-full"
              style={{ padding: "17px 32px", background: "rgba(255,255,255,.025)", color: "#f5f0e8", border: "1px solid rgba(196,154,60,.25)", fontSize: 14 }}>
              Ver o ecossistema
            </button>
          </div>
        </Reveal>

        {/* floating feature pills */}
        <Reveal delay={500}>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {[
              { icon: Clock,        label: "Atendimento 24h"      },
              { icon: Target,       label: "Qualificação de leads" },
              { icon: BarChart3,    label: "Dashboard ao vivo"    },
              { icon: Calendar,     label: "Agenda integrada"     },
              { icon: Sparkles,     label: "IA personalizada"     },
              { icon: DollarSign,   label: "BPO Financeiro"       },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-2 rounded-full font-medium"
                style={{
                  padding: "8px 16px", fontSize: 12, color: "rgba(245,240,232,.8)",
                  background: "rgba(10,10,10,.7)", border: "1px solid rgba(196,154,60,.15)",
                  backdropFilter: "blur(8px)", boxShadow: "0 4px 16px rgba(0,0,0,.3)",
                  animation: `fadeIn4h 400ms ease ${i * 80 + 600}ms both`,
                }}>
                <Icon className="w-3.5 h-3.5" style={{ color: "#c49a3c" }} aria-hidden />
                {label}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* marquee */}
      <div style={{ padding: "0 0 64px" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(245,240,232,.3)", textAlign: "center", textTransform: "uppercase", marginBottom: 16 }}>
          Para empresas de qualquer setor
        </div>
        <div className="overflow-hidden" style={{ maskImage: "linear-gradient(90deg,transparent 0%,black 12%,black 88%,transparent 100%)", WebkitMaskImage: "linear-gradient(90deg,transparent 0%,black 12%,black 88%,transparent 100%)" }}>
          <div style={{ display: "flex", width: "max-content", animation: "marquee4h 22s linear infinite" }}>
            {[...SECTORS,...SECTORS,...SECTORS,...SECTORS].map((s, i) => (
              <div key={i} className="flex items-center shrink-0">
                <span style={{ color: "rgba(245,240,232,.46)", fontSize: 13, fontWeight: 500, padding: "0 22px", letterSpacing: "0.04em" }}>{s}</span>
                <span aria-hidden style={{ color: "rgba(196,154,60,.28)" }}>·</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          BOTTLENECK SELECTOR
      ════════════════════════════════════════════════════════ */}
      <section id="desafio" className="relative z-10"
        style={{ padding: "100px 24px", borderTop: "1px solid rgba(196,154,60,.1)" }}>
        <div className="mx-auto" style={{ maxWidth: 1200 }}>

          <div className="text-center" style={{ marginBottom: 56 }}>
            <Reveal>
              <div className="uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c49a3c", marginBottom: 16 }}>──── Qual é o seu maior desafio? ────</div>
              <h2 className="font-extrabold" style={{ fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-0.03em", lineHeight: 1, margin: "0 0 16px" }}>
                Identifique o seu{" "}
                <span style={{ fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif', fontStyle: "italic", fontWeight: 400, color: "#c49a3c" }}>gargalo.</span>
              </h2>
              <p style={{ fontSize: 16, color: "rgba(245,240,232,.55)", maxWidth: 520, margin: "0 auto" }}>
                Selecione o desafio mais crítico da sua operação e veja como a 4Him resolve.
              </p>
            </Reveal>
          </div>

          {/* grid of problem cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" style={{ marginBottom: 24 }}>
            {BOTTLENECKS.map((b, i) => {
              const Icon = b.icon;
              const isActive = selected === b.id;
              return (
                <Reveal key={b.id} delay={i * 60}>
                  <button
                    onClick={() => setSelected(isActive ? null : b.id)}
                    aria-pressed={isActive}
                    className="lp3-bcard w-full text-left h-full"
                    style={{
                      padding: "22px 24px", borderRadius: 18,
                      background: isActive ? "rgba(196,154,60,.08)" : "rgba(10,10,10,.55)",
                      border: isActive ? `1px solid ${b.color}` : "1px solid rgba(196,154,60,.12)",
                      boxShadow: isActive ? `0 0 32px ${b.color}22, 0 8px 24px rgba(0,0,0,.4)` : "none",
                    }}>
                    <div className="flex items-start gap-3">
                      <div style={{
                        width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                        background: isActive ? `${b.color}22` : "rgba(196,154,60,.08)",
                        border: `1px solid ${isActive ? b.color : "rgba(196,154,60,.2)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: isActive ? b.color : "#c49a3c",
                        transition: "all 220ms ease",
                      }}>
                        <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} aria-hidden />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="font-bold" style={{ fontSize: 15, color: isActive ? "#f5f0e8" : "rgba(245,240,232,.85)", marginBottom: 6, letterSpacing: "-0.01em" }}>
                          {b.title}
                        </div>
                        <div style={{ fontSize: 12, lineHeight: 1.55, color: "rgba(245,240,232,.5)" }}>{b.pain}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" aria-hidden
                        style={{ color: isActive ? b.color : "rgba(196,154,60,.3)", transform: isActive ? "rotate(90deg)" : "", transition: "transform 220ms ease" }} />
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>

          {/* solution reveal panel */}
          {selected && activeBG && (
            <div style={{ animation: "slidePanel 320ms cubic-bezier(.34,1.4,.64,1)" }}>
              <div style={{
                padding: "clamp(24px,4vw,40px)",
                borderRadius: 24,
                background: `linear-gradient(135deg, ${activeBG.color}14, rgba(10,10,10,.7))`,
                border: `1px solid ${activeBG.color}55`,
                boxShadow: `0 0 60px ${activeBG.color}18, 0 24px 48px rgba(0,0,0,.5)`,
              }}>
                <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                  <div>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "5px 12px", borderRadius: 100, marginBottom: 18,
                      background: `${activeBG.color}18`, border: `1px solid ${activeBG.color}44`,
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: activeBG.color,
                    }}>
                      {activeBG.product}
                    </div>
                    <h3 className="font-bold" style={{ fontSize: "clamp(20px,3vw,32px)", color: "#f5f0e8", margin: "0 0 14px", letterSpacing: "-0.02em" }}>
                      Como resolvemos esse desafio
                    </h3>
                    <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(245,240,232,.7)", margin: "0 0 20px", maxWidth: 600 }}>
                      {activeBG.solution}
                    </p>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "8px 16px", borderRadius: 100,
                      background: `${activeBG.color}10`, border: `1px solid ${activeBG.color}30`,
                      fontSize: 13, color: activeBG.color, fontWeight: 700,
                    }}>
                      <Check className="w-3.5 h-3.5" strokeWidth={3} aria-hidden />
                      {activeBG.metric}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button onClick={() => scrollTo("contato")} className="lp3-btn-primary font-bold rounded-full whitespace-nowrap"
                      style={{ padding: "16px 28px", background: "linear-gradient(135deg,#96682c,#e8c060)", color: "#050505", fontSize: 14, boxShadow: "0 8px 28px rgba(196,154,60,.45)" }}>
                      Quero essa solução →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          PRODUCTS ECOSYSTEM
      ════════════════════════════════════════════════════════ */}
      <section id="produtos" className="relative z-10"
        style={{ padding: "120px 24px", borderTop: "1px solid rgba(196,154,60,.12)" }}>
        <div className="mx-auto" style={{ maxWidth: 1300 }}>

          <div className="text-center" style={{ marginBottom: 72 }}>
            <Reveal>
              <div className="uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c49a3c", marginBottom: 16 }}>──── Ecossistema de produtos ────</div>
              <h2 className="font-extrabold" style={{ fontSize: "clamp(32px,4.5vw,60px)", letterSpacing: "-0.03em", lineHeight: 1.05, margin: "0 0 16px" }}>
                Cada produto resolve um{" "}
                <span style={{ fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif', fontStyle: "italic", fontWeight: 400, color: "#c49a3c" }}>gargalo específico.</span>
              </h2>
              <p style={{ fontSize: 16, color: "rgba(245,240,232,.55)", maxWidth: 560, margin: "0 auto" }}>
                Começamos pelo mais crítico e expandimos. Cada empresa tem seu próprio caminho.
              </p>
            </Reveal>
          </div>

          {/* product grid: ELO4H large + 4Hbel + coming soon */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* ─ ELO4H ─ */}
            <Reveal className="lg:col-span-2">
              <div ref={eloTilt.ref} onMouseMove={eloTilt.onMouseMove} onMouseLeave={eloTilt.onMouseLeave}
                style={{
                  borderRadius: 28, overflow: "hidden", height: "100%",
                  background: "linear-gradient(155deg,rgba(150,104,44,.18),rgba(10,10,10,.75))",
                  border: "1px solid rgba(196,154,60,.3)",
                  boxShadow: "0 24px 64px -16px rgba(0,0,0,.7)",
                  transformStyle: "preserve-3d",
                }}>

                {/* header */}
                <div style={{ padding: "32px 36px 0", position: "relative" }}>
                  <div aria-hidden style={{ position: "absolute", top: 0, right: 0, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(196,154,60,.15),transparent 65%)", filter: "blur(40px)" }} />
                  <div className="flex items-start justify-between" style={{ marginBottom: 20, position: "relative" }}>
                    <div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, background: "rgba(196,154,60,.12)", border: "1px solid rgba(196,154,60,.3)", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#e8c060", marginBottom: 14 }}>
                        <span aria-hidden style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
                        Produto principal · Ativo
                      </div>
                      <div className="font-black" style={{ fontSize: 64, letterSpacing: "-0.04em", lineHeight: 0.88, background: "linear-gradient(135deg,#f5f0e8 20%,#c49a3c 60%,#96682c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                        ELO4H
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(245,240,232,.65)", maxWidth: 500, marginBottom: 28, position: "relative" }}>
                    Nosso agente de atendimento e inteligência comercial. Carro-chefe da 4Him — normalmente a primeira implementação.
                  </p>

                  {/* sub-tabs */}
                  <div role="tablist" aria-label="Módulos ELO4H" className="flex gap-1" style={{ marginBottom: 0, padding: "6px", background: "rgba(0,0,0,.35)", borderRadius: 14, border: "1px solid rgba(196,154,60,.12)", width: "fit-content" }}>
                    {ELO4H_TABS.map((tab, i) => (
                      <button key={tab.id} role="tab" aria-selected={eloTab === i}
                        aria-controls={`elo-panel-${i}`}
                        onClick={() => setEloTab(i)}
                        className="lp3-tab rounded-[10px] font-semibold"
                        style={{ padding: "9px 18px", fontSize: 12, background: eloTab === i ? "linear-gradient(135deg,#96682c,#c49a3c)" : "transparent", color: eloTab === i ? "#050505" : "rgba(245,240,232,.65)", boxShadow: eloTab === i ? "0 2px 12px rgba(196,154,60,.3)" : "none" }}>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* tab content */}
                <div id={`elo-panel-${eloTab}`} role="tabpanel" key={eloTab}
                  style={{ padding: "28px 36px 36px", animation: "scaleIn 250ms ease" }}>
                  <h3 className="font-bold" style={{ fontSize: "clamp(18px,2vw,26px)", color: "#f5f0e8", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
                    {ELO4H_TABS[eloTab].title}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(245,240,232,.6)", margin: "0 0 24px", maxWidth: 500 }}>
                    {ELO4H_TABS[eloTab].desc}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ELO4H_TABS[eloTab].features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2"
                        style={{ padding: "10px 12px", background: "rgba(10,10,10,.55)", border: "1px solid rgba(196,154,60,.1)", borderRadius: 10, fontSize: 12, color: "rgba(245,240,232,.82)" }}>
                        <div aria-hidden style={{ width: 14, height: 14, borderRadius: 4, background: "linear-gradient(135deg,#96682c,#c49a3c)", color: "#050505", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Check className="w-2 h-2" strokeWidth={4} />
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* right column */}
            <div className="flex flex-col gap-5">

              {/* ─ 4Hbel ─ */}
              <Reveal delay={100} className="flex-1">
                <div ref={hbelTilt.ref} onMouseMove={hbelTilt.onMouseMove} onMouseLeave={hbelTilt.onMouseLeave}
                  style={{
                    borderRadius: 24, padding: "28px 28px 32px", height: "100%",
                    background: "linear-gradient(155deg,rgba(167,139,250,.12),rgba(10,10,10,.75))",
                    border: "1px solid rgba(167,139,250,.3)",
                    boxShadow: "0 24px 48px -16px rgba(0,0,0,.6)",
                    transformStyle: "preserve-3d",
                  }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, background: "rgba(167,139,250,.12)", border: "1px solid rgba(167,139,250,.35)", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#a78bfa", marginBottom: 16 }}>
                    BPO Financeiro · Novo
                  </div>
                  <div className="font-black" style={{ fontSize: 44, letterSpacing: "-0.04em", lineHeight: 0.9, background: "linear-gradient(135deg,#e0d7ff,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 14 }}>
                    4Hbel
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(245,240,232,.6)", marginBottom: 20 }}>
                    IA aplicada ao BPO financeiro. Automação de conciliações, relatórios automáticos e previsibilidade de fluxo de caixa.
                  </p>
                  <div className="flex flex-col gap-2">
                    {["Conciliação automática","Relatórios em tempo real","Previsibilidade de fluxo","Redução de custo operacional"].map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5" style={{ fontSize: 12, color: "rgba(245,240,232,.75)" }}>
                        <div aria-hidden style={{ width: 14, height: 14, borderRadius: 4, background: "linear-gradient(135deg,#7c3aed,#a78bfa)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Check className="w-2 h-2" strokeWidth={4} />
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* ─ Em breve ─ */}
              <Reveal delay={160}>
                <div style={{ padding: "22px 24px", borderRadius: 20, background: "rgba(10,10,10,.4)", border: "1px dashed rgba(196,154,60,.18)", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(196,154,60,.06)", border: "1px solid rgba(196,154,60,.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Lock className="w-4 h-4" style={{ color: "rgba(196,154,60,.4)" }} aria-hidden />
                  </div>
                  <div>
                    <div className="font-semibold" style={{ fontSize: 14, color: "rgba(245,240,232,.5)", marginBottom: 2 }}>Mais produtos em breve</div>
                    <div style={{ fontSize: 11, color: "rgba(245,240,232,.3)" }}>Novas soluções verticais chegando</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          STATS
      ════════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="relative z-10"
        style={{ padding: "80px 24px", borderTop: "1px solid rgba(196,154,60,.1)", background: "rgba(196,154,60,.02)" }}>
        <div className="mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10" style={{ maxWidth: 1000 }}>
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-black" style={{ fontSize: "clamp(52px,6vw,80px)", lineHeight: 1, letterSpacing: "-0.05em", background: "linear-gradient(135deg,#c49a3c,#ffe9a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 10 }}>
                {counters[i]}{s.s}
              </div>
              <div style={{ fontSize: 12, color: "rgba(245,240,232,.45)", letterSpacing: "0.04em" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          METHOD
      ════════════════════════════════════════════════════════ */}
      <section id="metodo" className="relative z-10 mx-auto"
        style={{ padding: "120px 24px", maxWidth: 1100, borderTop: "1px solid rgba(196,154,60,.12)" }}>
        <div className="text-center" style={{ marginBottom: 72 }}>
          <Reveal>
            <div className="uppercase" style={{ fontSize: 11, letterSpacing: "0.3em", color: "#c49a3c", marginBottom: 16 }}>──── Método ────</div>
            <h2 className="font-extrabold" style={{ fontSize: "clamp(32px,4.5vw,56px)", letterSpacing: "-0.03em", lineHeight: 1, margin: 0 }}>
              Do diagnóstico à{" "}
              <span style={{ fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif', fontStyle: "italic", fontWeight: 400, color: "#c49a3c" }}>operação contínua.</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 relative">
          {/* connecting line desktop */}
          <div aria-hidden className="hidden lg:block absolute"
            style={{ top: 38, left: "12.5%", right: "12.5%", height: 1, background: "linear-gradient(90deg,transparent,rgba(196,154,60,.4) 20%,rgba(196,154,60,.4) 80%,transparent)", zIndex: 0 }} />

          {PROCESS.map((p, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="relative z-10">
                {/* step badge */}
                <div className="font-extrabold flex items-center justify-center mx-auto"
                  style={{ width: 76, height: 76, borderRadius: 20, background: "linear-gradient(135deg,#96682c,#c49a3c)", fontSize: 22, color: "#050505", marginBottom: 20, boxShadow: "0 8px 28px rgba(196,154,60,.4), inset 0 1px 0 rgba(255,255,255,.25)" }}>
                  {p.n}
                </div>
                {/* card */}
                <div style={{ padding: "20px 22px", borderRadius: 18, background: "rgba(10,10,10,.6)", border: "1px solid rgba(196,154,60,.14)", backdropFilter: "blur(8px)", textAlign: "center" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c49a3c", marginBottom: 10, padding: "3px 10px", borderRadius: 6, background: "rgba(196,154,60,.08)", border: "1px solid rgba(196,154,60,.15)", display: "inline-block" }}>
                    {p.dur}
                  </div>
                  <h3 className="font-bold" style={{ fontSize: 20, color: "#f5f0e8", margin: "0 0 10px" }}>{p.t}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(245,240,232,.58)", margin: 0 }}>{p.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════════ */}
      <section id="contato" className="relative z-10" style={{ padding: "60px 24px 80px" }}>
        <Reveal>
          <div className="relative mx-auto overflow-hidden"
            style={{
              maxWidth: 1200, borderRadius: 36,
              background: "linear-gradient(135deg,rgba(150,104,44,.24),rgba(10,10,10,.8))",
              border: "1px solid rgba(196,154,60,.3)",
              boxShadow: "0 40px 80px -32px rgba(0,0,0,.9), 0 0 120px rgba(196,154,60,.1)",
            }}>

            {/* scanline effect */}
            <div aria-hidden style={{ position: "absolute", left: 0, right: 0, height: 4, background: "linear-gradient(90deg,transparent,rgba(196,154,60,.08),transparent)", animation: "scanline 5s ease-in-out infinite", top: 0, zIndex: 0 }} />

            <div aria-hidden style={{ position: "absolute", left: "50%", top: "-60%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(196,154,60,.14),transparent 60%)", filter: "blur(80px)", zIndex: 0 }} />

            <div className="relative z-10 text-center" style={{ padding: "clamp(48px,6vw,88px) clamp(24px,5vw,80px)" }}>
              <div className="inline-flex items-center gap-2.5 text-xs font-medium rounded-full"
                style={{ padding: "7px 18px", border: "1px solid rgba(196,154,60,.35)", color: "#c49a3c", background: "rgba(196,154,60,.08)", marginBottom: 28 }}>
                <span aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: "#e8c060", boxShadow: "0 0 12px #e8c060" }} />
                Sem compromisso · Diagnóstico gratuito
              </div>

              <h2 className="font-extrabold"
                style={{ fontSize: "clamp(32px,5vw,68px)", letterSpacing: "-0.045em", lineHeight: 0.95, margin: "0 0 24px", color: "#f5f0e8" }}>
                Vamos resolver os{" "}<br />
                <span style={{
                  fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif', fontStyle: "italic", fontWeight: 400,
                  background: "linear-gradient(100deg,#96682c 5%,#e8c060 35%,#ffe9a8 50%,#e8c060 65%,#96682c 95%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  animation: "shimmer4h 6s linear infinite",
                }}>
                  seus gargalos.
                </span>
              </h2>

              <p style={{ fontSize: "clamp(15px,1.5vw,19px)", color: "rgba(245,240,232,.65)", maxWidth: 560, margin: "0 auto 44px", lineHeight: 1.65 }}>
                Converse com a 4Him. Entendemos seu processo, mapeamos oportunidades e desenhamos uma solução sob medida — do atendimento ao BPO financeiro.
              </p>

              <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
                <button onClick={() => window.open("mailto:contato@4himtechnology.com", "_blank")}
                  className="lp3-btn-primary font-bold rounded-full"
                  style={{ padding: "18px 36px", background: "linear-gradient(135deg,#e8c060,#ffe9a8)", color: "#050505", fontSize: 15, boxShadow: "0 14px 40px rgba(255,233,168,.4), inset 0 1px 0 rgba(255,255,255,.4)" }}>
                  Agendar diagnóstico gratuito →
                </button>
                <button onClick={() => window.open(WHATSAPP_URL, "_blank")}
                  className="lp3-btn-ghost font-semibold rounded-full flex items-center justify-center gap-2"
                  style={{ padding: "18px 36px", background: "transparent", color: "#f5f0e8", border: "1px solid rgba(245,240,232,.2)", fontSize: 15 }}>
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
                Consultoria estratégica em IA. Desenhamos, implantamos e operamos soluções sob medida — do diagnóstico à operação contínua.
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { name: "ELO4H", desc: "Atendimento · Comercial · Inteligência", color: "#c49a3c" },
                  { name: "4Hbel", desc: "BPO Financeiro",                          color: "#a78bfa" },
                ].map(p => (
                  <div key={p.name} className="flex items-center gap-2.5"
                    style={{ padding: "7px 12px", borderRadius: 10, background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color, boxShadow: `0 0 8px ${p.color}`, flexShrink: 0 }} aria-hidden />
                    <span className="font-bold" style={{ fontSize: 12, color: p.color }}>{p.name}</span>
                    <span style={{ fontSize: 11, color: "rgba(245,240,232,.4)" }}>—</span>
                    <span style={{ fontSize: 11, color: "rgba(245,240,232,.45)" }}>{p.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {[
              ["Soluções", ["ELO4H","4Hbel","Agentes customizados","Consultoria estratégica"]],
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
                  if (typeof v === "string") return <div key={j} style={{ fontSize: 13, color: "rgba(245,240,232,.65)", padding: "6px 0" }}>{v}</div>;
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
            style={{ paddingTop: 24, borderTop: "1px solid rgba(196,154,60,.1)", fontSize: 11, color: "rgba(245,240,232,.3)" }}>
            <div>© {new Date().getFullYear()} 4Him Technology. Todos os direitos reservados.</div>
            <div>Consultoria estratégica em IA — do diagnóstico à operação.</div>
          </div>
        </div>
      </footer>

      {/* scroll to top */}
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Voltar ao topo"
          className="fixed flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ bottom: 24, right: 24, zIndex: 50, width: 44, height: 44, borderRadius: 12, background: "rgba(10,10,10,.88)", border: "1px solid rgba(196,154,60,.4)", color: "#c49a3c", backdropFilter: "blur(12px)", boxShadow: "0 8px 24px rgba(0,0,0,.5)", animation: "fadeIn4h 300ms ease" }}>
          <ChevronUp className="w-5 h-5" aria-hidden />
        </button>
      )}
    </div>
  );
}
