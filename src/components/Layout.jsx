import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Calendar, MessageSquare, Users, Settings, UserCog,
  Menu, ChevronLeft, ChevronRight, BarChart2, Kanban, BotMessageSquare, LogOut,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Logos Morah servidos localmente a partir de public/images.
// BASE_URL garante o caminho certo tanto em dev (/) quanto no GitHub Pages (./Telemedicina).
const LOGO_MARK_WHITE = `${import.meta.env.BASE_URL}images/logo-mark-white.png`;
const LOGO_WORDMARK_WHITE = `${import.meta.env.BASE_URL}images/logo-wordmark-white.png`;

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard, title: "Dashboard", subtitle: "Visão geral da operação" },
  { path: "/agendamentos", label: "Agendamentos", icon: Calendar, title: "Agendamentos", subtitle: "Consultas e exames" },
  { path: "/whatsapp", label: "WhatsApp", icon: MessageSquare, title: "WhatsApp", subtitle: "Atendimento por mensagem" },
  { path: "/leads", label: "Leads / Kanban", icon: Kanban, title: "Leads", subtitle: "Funil de atendimento" },
  { path: "/pacientes", label: "Pacientes", icon: Users, title: "Pacientes", subtitle: "Cadastro de pacientes" },
  { path: "/configuracoes", label: "Configurações", icon: Settings, title: "Configurações", subtitle: "Ajustes do sistema" },
  { path: "/usuarios", label: "Usuários", icon: UserCog, title: "Usuários", subtitle: "Acessos e permissões" },
  { path: "/financeiro", label: "Financeiro", icon: BarChart2, title: "Financeiro", subtitle: "Receitas e custos" },
  { path: "/assistente", label: "Assistente IA", icon: BotMessageSquare, title: "Assistente IA", subtitle: "Apoio inteligente ao atendimento" },
];

// Paleta Morah (sidebar plum)
const SIDEBAR_BG = "linear-gradient(190deg, #4B244D 0%, #2A0F2D 60%, #1F0B20 100%)";
const ACTIVE_BG = "rgba(255,255,255,0.12)";
const HOVER_BG = "rgba(255,255,255,0.07)";
const ACTIVE_ICON = "#D49FD2"; // berry-300

function NavLink({ item, isActive, onClick, collapsed }) {
  const [hovered, setHovered] = useState(false);
  const highlight = isActive || hovered;
  return (
    <Link
      to={item.path}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg text-sm transition-all duration-200",
        collapsed ? "px-3 py-2.5 justify-center" : "px-3 py-2.5",
        isActive ? "font-bold" : "font-medium"
      )}
      style={{
        color: isActive ? "#ffffff" : (hovered ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.64)"),
        backgroundColor: highlight ? (isActive ? ACTIVE_BG : HOVER_BG) : "transparent",
      }}
    >
      <item.icon className="w-4 h-4 shrink-0" style={{ color: isActive ? ACTIVE_ICON : "currentColor" }} />
      {!collapsed && item.label}
    </Link>
  );
}

export default function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const current = navItems.find(i => i.path === location.pathname) || navItems[0];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 relative",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{ background: SIDEBAR_BG }}
      >
        {/* Toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 z-20 w-6 h-6 rounded-full flex items-center justify-center shadow-lg border border-white/20 transition-colors hover:opacity-90"
          style={{ backgroundColor: "#8A2F82" }}
        >
          {collapsed ? <ChevronRight className="w-3 h-3 text-white" /> : <ChevronLeft className="w-3 h-3 text-white" />}
        </button>

        {/* Logo (amora + MORAH na horizontal) + Telemedicina */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-5 gap-2 border-b border-white/10">
          {collapsed ? (
            <img src={LOGO_MARK_WHITE} alt="Morah" className="h-9 w-9 object-contain" />
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                <img src={LOGO_MARK_WHITE} alt="" className="h-9 w-auto object-contain" />
                <img src={LOGO_WORDMARK_WHITE} alt="Morah" className="h-[18px] w-auto object-contain" />
              </div>
              <span
                className="text-xs font-bold tracking-wide"
                style={{ color: "#E8C8E7", fontFamily: "var(--font-display)" }}
              >
                Telemedicina
              </span>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
              onClick={() => setMobileOpen(false)}
              collapsed={collapsed}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="relative z-10 px-3 py-3 border-t border-white/10 space-y-2">
          <button
            onClick={() => { try { localStorage.removeItem("morah_demo_authed"); } catch (_) {} window.location.href = "/login"; }}
            title="Sair"
            className={cn("w-full flex items-center gap-2 rounded-lg text-sm font-medium px-3 py-2 transition-colors", collapsed ? "justify-center" : "")}
            style={{ color: "rgba(255,255,255,0.64)", backgroundColor: "transparent" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && "Sair"}
          </button>
          {!collapsed && (
            <p className="text-[10px] text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
              Morah Telemedicina v1.0
            </p>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar — nome da tela */}
        <header className="h-16 border-b border-border bg-card flex items-center px-4 lg:px-6 gap-4 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-base font-bold leading-tight text-foreground truncate">{current.title}</h1>
            {current.subtitle && <p className="text-xs text-muted-foreground truncate">{current.subtitle}</p>}
          </div>
          <div className="flex-1" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
