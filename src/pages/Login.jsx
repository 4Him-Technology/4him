import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";

// Hero de telemedicina (mesmas imagens da tela de login pública)
const HERO = [
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584516150909-c43483ee7932?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?q=80&w=1800&auto=format&fit=crop",
];

export default function Login() {
  const navigate = useNavigate();

  // DEMONSTRAÇÃO: entra no sistema sem AWS. Trocar por Cognito depois.
  const enter = (e) => {
    e?.preventDefault?.();
    try { localStorage.setItem("morah_demo_authed", "1"); } catch (_) {}
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-card text-foreground">
      <style>{`@keyframes mkb{0%{opacity:0;transform:scale(1)}3%{opacity:1}30%{opacity:1;transform:scale(1.12)}34%{opacity:0;transform:scale(1.13)}100%{opacity:0;transform:scale(1.13)}}`}</style>

      {/* ----- Formulário ----- */}
      <div className="flex flex-col w-full md:w-[46%] md:max-w-[560px] px-7 md:px-12 py-8">
        {/* Lockup MORAH | Telemedicina */}
        <div className="flex items-center gap-2.5">
          <img src={`${import.meta.env.BASE_URL}images/logo-icon.png`} alt="" className="h-7 w-auto object-contain" />
          <img src={`${import.meta.env.BASE_URL}images/logo-wordmark.png`} alt="Morah" className="h-[15px] w-auto object-contain" />
          <span className="w-px h-4 bg-border" />
          <span className="font-bold text-[15px] text-primary" style={{ fontFamily: "var(--font-display)" }}>Telemedicina</span>
        </div>

        <form onSubmit={enter} className="flex-1 flex flex-col justify-center max-w-[372px] w-full mx-auto">
          <h1 className="text-2xl font-extrabold tracking-tight">Entrar na Morah</h1>
          <p className="text-sm text-muted-foreground mt-1 mb-6">Acesse a Telemedicina com sua conta Morah.</p>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-foreground">E-mail</label>
              <div className="mt-1.5 flex items-center gap-2 border border-border rounded-[10px] px-3 bg-card shadow-sm focus-within:border-primary transition-colors">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <input className="flex-1 min-w-0 py-2.5 bg-transparent outline-none text-sm" placeholder="voce@empresa.com.br" defaultValue="demo@morah.com.br" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-foreground">Senha</label>
              <div className="mt-1.5 flex items-center gap-2 border border-border rounded-[10px] px-3 bg-card shadow-sm focus-within:border-primary transition-colors">
                <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                <input type="password" className="flex-1 min-w-0 py-2.5 bg-transparent outline-none text-sm" placeholder="Sua senha" defaultValue="demonstracao" />
              </div>
            </div>

            <button type="submit" className="w-full py-3 rounded-[10px] bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:brightness-95 transition">
              Entrar no sistema <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-muted-foreground text-center pt-1">
              Acesso de <strong>demonstração</strong> — clique em Entrar para ver o sistema por dentro.
              <br />A autenticação real (Morah / Cognito) será conectada em seguida.
            </p>
          </div>
        </form>

        <p className="text-[11px] text-center" style={{ color: "var(--muted-foreground)" }}>
          Acesso restrito · dados de saúde · © 2026 Morah LTDA
        </p>
      </div>

      {/* ----- Hero animado ----- */}
      <div className="hidden md:block flex-1 relative overflow-hidden" style={{ background: "#1F0B20" }}>
        {HERO.map((url, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${url}')`, opacity: 0, animation: "mkb 27s infinite", animationDelay: `${i * 9}s` }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(165deg, rgba(75,36,77,.62) 0%, rgba(42,15,45,.5) 45%, rgba(26,9,28,.82) 100%)" }}
        />
        <div className="absolute inset-0 z-[2] flex flex-col justify-end p-10 text-white">
          <h2 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 24px rgba(20,6,22,.5)" }}>
            Telemedicina Morah
          </h2>
          <p className="text-white/80 mt-2 max-w-md">Saúde ocupacional conectada — do agendamento à consulta.</p>
        </div>
      </div>
    </div>
  );
}
