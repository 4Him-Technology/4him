import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Calendar, MessageSquare, Users, Settings, UserCog,
  Menu, ChevronLeft, ChevronRight, BarChart2, Kanban, BotMessageSquare,
  ChevronDown, Stethoscope, Globe
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Logos servidos localmente a partir de public/images.
const LOGO_URL = "/images/logo-full-white.png";
const LOGO_MINI = "/images/logo-icon.png";

const clinicNavItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/agendamentos", label: "Agendamentos", icon: Calendar },
  { path: "/whatsapp", label: "WhatsApp", icon: MessageSquare },
  { path: "/leads", label: "Leads / Kanban", icon: Kanban },
  { path: "/pacientes", label: "Pacientes", icon: Users },
  { path: "/configuracoes", label: "Configurações", icon: Settings },
  { path: "/usuarios", label: "Usuários", icon: UserCog },
  { path: "/financeiro", label: "Financeiro", icon: BarChart2 },
  { path: "/assistente", label: "Fale com a Elo4h", icon: BotMessageSquare },
];

// Landing pages disponíveis (abertas pelo botão "LP" no rodapé da sidebar).
const landingPages = [
  { path: "/landing", label: "Landing Page 1" },
  { path: "/landing2", label: "Landing Page 2" },
  { path: "/landing3", label: "Landing Page 3" },
];

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
        "flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200",
        collapsed ? "px-3 py-2.5 justify-center" : "px-3 py-2.5 pl-6"
      )}
      style={{
        color: highlight ? '#96682c' : 'rgba(255,255,255,0.65)',
        backgroundColor: highlight ? 'rgba(150,104,44,0.15)' : 'transparent',
        border: isActive ? '1px solid rgba(150,104,44,0.3)' : '1px solid transparent',
      }}
    >
      <item.icon className="w-4 h-4 shrink-0" />
      {!collapsed && item.label}
    </Link>
  );
}


function NavGroup({ label, icon: Icon, items, location, onLinkClick, collapsed, extraContent }) {
  const isGroupActive = items.some(i => location.pathname === i.path);
  const [open, setOpen] = useState(isGroupActive);

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        title={collapsed ? label : undefined}
        className={cn(
          "w-full flex items-center gap-3 rounded-lg text-sm font-semibold transition-all duration-200 px-3 py-2.5",
          collapsed ? "justify-center" : "justify-between"
        )}
        style={{
          color: isGroupActive ? '#96682c' : 'rgba(255,255,255,0.75)',
          backgroundColor: isGroupActive ? 'rgba(150,104,44,0.1)' : 'transparent',
        }}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 shrink-0" />
          {!collapsed && <span>{label}</span>}
        </div>
        {!collapsed && (
          <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", open ? "rotate-180" : "")} />
        )}
      </button>

      {open && (
        <div className="mt-0.5 space-y-0.5">
          {items.map(item => {
            const isActive = location.pathname === item.path;
            return <NavLink key={item.path} item={item} isActive={isActive} onClick={onLinkClick} collapsed={collapsed} />;
          })}
          {extraContent}
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [lpOpen, setLpOpen] = useState(false);

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
        style={{ backgroundColor: '#000000' }}
      >
        <div className="absolute inset-0 bg-black/30 z-0" />

        {/* Toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 z-20 w-6 h-6 rounded-full flex items-center justify-center shadow-lg border border-white/20 transition-colors hover:opacity-90"
          style={{ backgroundColor: '#96682c' }}
        >
          {collapsed ? <ChevronRight className="w-3 h-3 text-white" /> : <ChevronLeft className="w-3 h-3 text-white" />}
        </button>

        {/* Logo area */}
        <div className="relative z-10 flex items-center justify-center px-4 py-5 border-b border-white/10">
          {collapsed ? (
            <img src={LOGO_MINI} alt="Logo" className="h-10 w-10 object-contain drop-shadow-2xl" />
          ) : (
            <img src={LOGO_URL} alt="4Him Technology" className="h-14 w-auto object-contain drop-shadow-2xl" />
          )}
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <NavGroup
            label="Clínica Médica"
            icon={Stethoscope}
            items={clinicNavItems}
            location={location}
            onLinkClick={() => setMobileOpen(false)}
            collapsed={collapsed}
          />
        </nav>

        {/* Footer */}
        <div className="relative z-10 px-3 py-3 border-t border-white/10 space-y-2">
          {/* Opções de Landing Page — expandem acima do botão "LP" */}
          {lpOpen && (
            <div className="space-y-1">
              {landingPages.map(lp => (
                <Link
                  key={lp.path}
                  to={lp.path}
                  title={lp.label}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg text-xs font-medium transition-all duration-200 px-3 py-2 border border-amber-600/30 hover:border-amber-500/60 hover:bg-amber-600/10 ${collapsed ? "justify-center" : "pl-5"}`}
                  style={{ color: "#c49a3c", backgroundColor: "rgba(150,104,44,0.08)" }}
                >
                  <Globe className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>{lp.label}</span>}
                </Link>
              ))}
            </div>
          )}

          {/* Botão "LP" — abre/fecha as opções de landing page */}
          <button
            onClick={() => setLpOpen(o => !o)}
            title={collapsed ? "Landing Pages (LP)" : undefined}
            className={`w-full flex items-center gap-3 rounded-lg text-xs font-semibold transition-all duration-200 px-3 py-2 border border-amber-600/30 hover:border-amber-500/60 hover:bg-amber-600/10 ${collapsed ? "justify-center" : "justify-between"}`}
            style={{ color: "#c49a3c", backgroundColor: "rgba(150,104,44,0.08)" }}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 shrink-0" />
              {!collapsed && <span>LP</span>}
            </div>
            {!collapsed && (
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", lpOpen ? "rotate-180" : "")} />
            )}
          </button>

          {!collapsed && <p className="text-[10px] text-white/30 text-center">4Him Technology v1.0</p>}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card flex items-center px-4 lg:px-6 gap-4 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted"
          >
            <Menu className="w-5 h-5" />
          </button>
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
