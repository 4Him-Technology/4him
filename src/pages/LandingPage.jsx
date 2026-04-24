import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Monitor, Briefcase, Users, Zap, Shield, BarChart3, Mail, Phone, MapPin, ChevronDown, ArrowRight, Star, CheckCircle, LayoutDashboard } from "lucide-react";

const LOGO_URL = "https://media.base44.com/images/public/69d05d38b40549791975d990/834173352_w2.png";

const services = [
  {
    icon: Monitor,
    title: "Sistemas de Gestão",
    desc: "Plataformas inteligentes para clínicas médicas, escritórios de advocacia e empresas de qualquer segmento.",
    items: ["Dashboard em tempo real", "Gestão de clientes e processos", "Relatórios analíticos avançados"],
  },
  {
    icon: Zap,
    title: "Automação & IA",
    desc: "Automatize tarefas repetitivas com inteligência artificial e foque no que realmente importa.",
    items: ["Assistente com IA integrada", "Lembretes e alertas automáticos", "Integração com WhatsApp"],
  },
  {
    icon: Shield,
    title: "Segurança & Confiabilidade",
    desc: "Infraestrutura robusta com backup contínuo, criptografia e alta disponibilidade.",
    items: ["Dados sempre protegidos", "Uptime 99,9%", "Suporte dedicado"],
  },
  {
    icon: BarChart3,
    title: "Análise & Relatórios",
    desc: "Transforme dados em decisões estratégicas com dashboards visuais e relatórios completos.",
    items: ["KPIs em tempo real", "Gráficos interativos", "Exportação em PDF"],
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    desc: "CRM completo para controle de leads, pacientes, clientes jurídicos e muito mais.",
    items: ["Histórico completo", "Pipeline de vendas", "Comunicação integrada"],
  },
  {
    icon: Briefcase,
    title: "Soluções Sob Medida",
    desc: "Desenvolvemos sistemas personalizados para as necessidades específicas do seu negócio.",
    items: ["Consultoria estratégica", "Desenvolvimento customizado", "Treinamento da equipe"],
  },
];

const stats = [
  { value: "500+", label: "Clientes Ativos" },
  { value: "98%", label: "Satisfação" },
  { value: "5+", label: "Anos de Mercado" },
  { value: "24/7", label: "Suporte" },
];

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return inView;
}

function AnimatedSection({ children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    setFormData({ name: "", email: "", phone: "", message: "" });
  }

  return (
    <div className="min-h-screen font-inter" style={{ backgroundColor: "#080808", color: "#f5f0e8" }}>

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ backgroundColor: "rgba(8,8,8,0.92)", borderColor: "rgba(150,104,44,0.2)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <img src={LOGO_URL} alt="4Him Technology" className="h-9 w-auto" />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {[["sobre", "Sobre"], ["servicos", "Serviços"], ["contato", "Contato"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="text-sm font-medium transition-colors hover:text-amber-400" style={{ color: "rgba(245,240,232,0.7)" }}>
                {label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border transition-all hover:scale-105"
              style={{ borderColor: "rgba(150,104,44,0.4)", color: "#c49a3c", backgroundColor: "transparent" }}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Voltar ao Portal
            </button>
            <button
              onClick={() => scrollTo("contato")}
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-full transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #96682c, #c49a3c)", color: "#080808" }}
            >
              Fale Conosco <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2" style={{ color: "#c49a3c" }}>
            <div className="space-y-1.5">
              <span className="block w-5 h-px bg-current" />
              <span className="block w-5 h-px bg-current" />
              <span className="block w-5 h-px bg-current" />
            </div>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden px-6 py-4 space-y-3 border-t" style={{ borderColor: "rgba(150,104,44,0.2)" }}>
            {[["sobre", "Sobre"], ["servicos", "Serviços"], ["contato", "Contato"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="block w-full text-left text-sm font-medium py-2" style={{ color: "rgba(245,240,232,0.8)" }}>
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #96682c, transparent)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl" style={{ background: "radial-gradient(circle, #c49a3c, transparent)" }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: "linear-gradient(rgba(150,104,44,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(150,104,44,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full mb-8 border" style={{ backgroundColor: "rgba(150,104,44,0.1)", borderColor: "rgba(150,104,44,0.3)", color: "#c49a3c" }}>
            <Star className="w-3.5 h-3.5" /> Tecnologia que transforma negócios
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6" style={{ letterSpacing: "-0.03em" }}>
            <span style={{ color: "#f5f0e8" }}>Sistemas de Gestão</span>
            <br />
            <span style={{ background: "linear-gradient(135deg, #96682c, #e8c060, #96682c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              de Alta Performance
            </span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "rgba(245,240,232,0.6)" }}>
            Desenvolvemos soluções tecnológicas completas para clínicas médicas, escritórios de advocacia e empresas que buscam excelência operacional.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollTo("servicos")}
              className="px-8 py-4 rounded-full text-sm font-bold transition-all hover:scale-105 hover:shadow-2xl"
              style={{ background: "linear-gradient(135deg, #96682c, #c49a3c)", color: "#080808", boxShadow: "0 0 30px rgba(150,104,44,0.4)" }}
            >
              Conheça Nossas Soluções
            </button>
            <button
              onClick={() => scrollTo("contato")}
              className="px-8 py-4 rounded-full text-sm font-bold border transition-all hover:scale-105"
              style={{ borderColor: "rgba(150,104,44,0.4)", color: "#c49a3c", backgroundColor: "transparent" }}
            >
              Fale com um Especialista
            </button>
          </div>

          {/* Scroll indicator */}
          <button onClick={() => scrollTo("sobre")} className="mt-16 mx-auto flex flex-col items-center gap-2 opacity-40 hover:opacity-70 transition-opacity">
            <span className="text-xs">Scroll</span>
            <ChevronDown className="w-4 h-4 animate-bounce" style={{ color: "#c49a3c" }} />
          </button>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-16 border-y" style={{ borderColor: "rgba(150,104,44,0.15)", backgroundColor: "rgba(150,104,44,0.04)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <AnimatedSection key={i} className="text-center">
                <p className="text-4xl md:text-5xl font-black" style={{ background: "linear-gradient(135deg, #c49a3c, #e8c060)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {s.value}
                </p>
                <p className="text-sm mt-1" style={{ color: "rgba(245,240,232,0.5)" }}>{s.label}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOBRE ─── */}
      <section id="sobre" className="py-28 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-6" style={{ backgroundColor: "rgba(150,104,44,0.12)", color: "#c49a3c" }}>
              Sobre a 4Him Technology
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6" style={{ color: "#f5f0e8" }}>
              Tecnologia a serviço do seu{" "}
              <span style={{ color: "#c49a3c" }}>crescimento</span>
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: "rgba(245,240,232,0.6)" }}>
              A <strong style={{ color: "#c49a3c" }}>4Him Technology</strong> nasceu com um propósito claro: democratizar o acesso a tecnologia de ponta para negócios de todos os tamanhos. Somos especialistas em criar sistemas que simplificam a operação e ampliam resultados.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(245,240,232,0.6)" }}>
              Nossas soluções são desenvolvidas com foco na experiência do usuário, escalabilidade e segurança — para que você possa focar no que realmente importa: o seu negócio.
            </p>
            <div className="space-y-3">
              {["Equipe especializada em tecnologia e negócios", "Desenvolvimento ágil e entregas rápidas", "Suporte contínuo e treinamento inclusos"].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "#c49a3c" }} />
                  <span className="text-sm" style={{ color: "rgba(245,240,232,0.75)" }}>{item}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="relative">
              {/* Decorative card */}
              <div className="rounded-2xl p-8 border relative overflow-hidden" style={{ backgroundColor: "rgba(150,104,44,0.06)", borderColor: "rgba(150,104,44,0.2)" }}>
                <div className="absolute top-0 right-0 w-48 h-48 opacity-10 rounded-full blur-2xl" style={{ background: "radial-gradient(circle, #c49a3c, transparent)" }} />
                <div className="space-y-6 relative z-10">
                  <div className="flex items-start gap-4 p-4 rounded-xl border" style={{ backgroundColor: "rgba(8,8,8,0.6)", borderColor: "rgba(150,104,44,0.15)" }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #96682c, #c49a3c)" }}>
                      <Monitor className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#f5f0e8" }}>Plataforma Unificada</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(245,240,232,0.5)" }}>Todos os módulos em um só lugar</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl border" style={{ backgroundColor: "rgba(8,8,8,0.6)", borderColor: "rgba(150,104,44,0.15)" }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #96682c, #c49a3c)" }}>
                      <Zap className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#f5f0e8" }}>IA Integrada</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(245,240,232,0.5)" }}>Automação inteligente do seu fluxo</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl border" style={{ backgroundColor: "rgba(8,8,8,0.6)", borderColor: "rgba(150,104,44,0.15)" }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #96682c, #c49a3c)" }}>
                      <Shield className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#f5f0e8" }}>Segurança Total</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(245,240,232,0.5)" }}>Seus dados sempre protegidos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── SERVIÇOS ─── */}
      <section id="servicos" className="py-28 border-t" style={{ borderColor: "rgba(150,104,44,0.1)", backgroundColor: "rgba(150,104,44,0.02)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5" style={{ backgroundColor: "rgba(150,104,44,0.12)", color: "#c49a3c" }}>
              Nossas Soluções
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4" style={{ color: "#f5f0e8" }}>
              O que a <span style={{ color: "#c49a3c" }}>4Him</span> oferece
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(245,240,232,0.55)" }}>
              Soluções completas para transformar a gestão do seu negócio
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <AnimatedSection key={i}>
                  <div
                    className="h-full p-6 rounded-2xl border transition-all duration-300 cursor-default group hover:-translate-y-1 hover:shadow-2xl"
                    style={{
                      backgroundColor: "rgba(8,8,8,0.8)",
                      borderColor: "rgba(150,104,44,0.18)",
                      boxShadow: "0 0 0 rgba(150,104,44,0)"
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 40px rgba(150,104,44,0.12)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 0 rgba(150,104,44,0)"}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110" style={{ background: "linear-gradient(135deg, #96682c22, #c49a3c33)", border: "1px solid rgba(150,104,44,0.3)" }}>
                      <Icon className="w-5 h-5" style={{ color: "#c49a3c" }} />
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: "#f5f0e8" }}>{s.title}</h3>
                    <p className="text-sm mb-4 leading-relaxed" style={{ color: "rgba(245,240,232,0.55)" }}>{s.desc}</p>
                    <ul className="space-y-2">
                      {s.items.map((item, j) => (
                        <li key={j} className="flex items-center gap-2 text-xs" style={{ color: "rgba(245,240,232,0.65)" }}>
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#c49a3c" }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA STRIP ─── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(150,104,44,0.15), rgba(196,154,60,0.08))", borderTop: "1px solid rgba(150,104,44,0.2)", borderBottom: "1px solid rgba(150,104,44,0.2)" }} />
        <AnimatedSection className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: "#f5f0e8" }}>
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-base mb-8" style={{ color: "rgba(245,240,232,0.6)" }}>
            Agende uma demonstração gratuita e descubra como a 4Him Technology pode elevar sua operação a outro nível.
          </p>
          <button
            onClick={() => document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" })}
            className="px-10 py-4 rounded-full text-sm font-bold transition-all hover:scale-105 hover:shadow-2xl"
            style={{ background: "linear-gradient(135deg, #96682c, #c49a3c)", color: "#080808", boxShadow: "0 0 30px rgba(150,104,44,0.5)" }}
          >
            Solicitar Demonstração Gratuita
          </button>
        </AnimatedSection>
      </section>

      {/* ─── CONTATO ─── */}
      <section id="contato" className="py-28 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-6" style={{ backgroundColor: "rgba(150,104,44,0.12)", color: "#c49a3c" }}>
              Entre em Contato
            </div>
            <h2 className="text-4xl font-black leading-tight mb-5" style={{ color: "#f5f0e8" }}>
              Vamos conversar sobre o seu <span style={{ color: "#c49a3c" }}>projeto</span>
            </h2>
            <p className="text-base mb-8 leading-relaxed" style={{ color: "rgba(245,240,232,0.6)" }}>
              Nossa equipe está pronta para entender as necessidades do seu negócio e apresentar a melhor solução tecnológica.
            </p>
            <div className="space-y-5">
              {[
                { Icon: Mail, label: "E-mail", value: "contato@4himtechnology.com.br" },
                { Icon: Phone, label: "WhatsApp", value: "+55 (XX) XXXXX-XXXX" },
                { Icon: MapPin, label: "Localização", value: "Brasil — Atendimento Nacional" },
              ].map(({ Icon, label, value }, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(150,104,44,0.15)", border: "1px solid rgba(150,104,44,0.25)" }}>
                    <Icon className="w-4 h-4" style={{ color: "#c49a3c" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "rgba(245,240,232,0.4)" }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color: "#f5f0e8" }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection>
            {sent ? (
              <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "rgba(150,104,44,0.06)", borderColor: "rgba(150,104,44,0.2)" }}>
                <CheckCircle className="w-14 h-14 mx-auto mb-4" style={{ color: "#c49a3c" }} />
                <h3 className="text-xl font-bold mb-2" style={{ color: "#f5f0e8" }}>Mensagem Enviada!</h3>
                <p className="text-sm" style={{ color: "rgba(245,240,232,0.6)" }}>Retornaremos em breve. Obrigado pelo contato!</p>
                <button onClick={() => setSent(false)} className="mt-6 text-xs font-semibold underline" style={{ color: "#c49a3c" }}>Enviar outra mensagem</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl border p-8 space-y-4" style={{ backgroundColor: "rgba(8,8,8,0.8)", borderColor: "rgba(150,104,44,0.18)" }}>
                {[
                  { key: "name", label: "Nome completo", type: "text", placeholder: "Seu nome" },
                  { key: "email", label: "E-mail", type: "email", placeholder: "seu@email.com" },
                  { key: "phone", label: "Telefone / WhatsApp", type: "tel", placeholder: "(XX) XXXXX-XXXX" },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(245,240,232,0.55)" }}>{label}</label>
                    <input
                      type={type}
                      required
                      placeholder={placeholder}
                      value={formData[key]}
                      onChange={e => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        backgroundColor: "rgba(245,240,232,0.04)",
                        border: "1px solid rgba(150,104,44,0.2)",
                        color: "#f5f0e8",
                      }}
                      onFocus={e => e.target.style.borderColor = "rgba(196,154,60,0.6)"}
                      onBlur={e => e.target.style.borderColor = "rgba(150,104,44,0.2)"}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(245,240,232,0.55)" }}>Mensagem</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Conte-nos sobre seu negócio e o que você precisa..."
                    value={formData.message}
                    onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
                    style={{
                      backgroundColor: "rgba(245,240,232,0.04)",
                      border: "1px solid rgba(150,104,44,0.2)",
                      color: "#f5f0e8",
                    }}
                    onFocus={e => e.target.style.borderColor = "rgba(196,154,60,0.6)"}
                    onBlur={e => e.target.style.borderColor = "rgba(150,104,44,0.2)"}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] hover:shadow-xl"
                  style={{ background: "linear-gradient(135deg, #96682c, #c49a3c)", color: "#080808", boxShadow: "0 0 20px rgba(150,104,44,0.3)" }}
                >
                  Enviar Mensagem
                </button>
              </form>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-8 border-t" style={{ borderColor: "rgba(150,104,44,0.15)" }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={LOGO_URL} alt="4Him Technology" className="h-8 w-auto opacity-70" />
          <p className="text-xs" style={{ color: "rgba(245,240,232,0.3)" }}>
            © {new Date().getFullYear()} 4Him Technology. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            {[["sobre", "Sobre"], ["servicos", "Serviços"], ["contato", "Contato"]].map(([id, label]) => (
              <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })} className="text-xs hover:opacity-80 transition-opacity" style={{ color: "rgba(245,240,232,0.4)" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}