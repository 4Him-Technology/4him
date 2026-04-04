import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, MessageSquare, Users, Settings, UserCog, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const LOGO_URL = "https://media.base44.com/images/public/69d05d38b40549791975d990/834173352_w2.png";
const STONE_BG = "https://media.base44.com/images/public/69d05d38b40549791975d990/8508442db_generated_image.png";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/agendamentos", label: "Agendamentos", icon: Calendar },
  { path: "/whatsapp", label: "WhatsApp", icon: MessageSquare },
  { path: "/pacientes", label: "Pacientes", icon: Users },
  { path: "/configuracoes", label: "Configurações", icon: Settings },
  { path: "/usuarios", label: "Usuários", icon: UserCog },
];

export default function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 relative overflow-hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{ backgroundColor: '#000000' }}
      >
        {/* Subtle dark overlay for depth */}
        <div className="absolute inset-0 bg-black/30 z-0" />

        {/* Logo area */}
        <div className="relative z-10 flex items-center justify-center px-4 py-5 border-b border-white/10">
          <img
            src={LOGO_URL}
            alt="4Him Technology"
            className="h-14 w-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/15 text-amber-300 border border-amber-400/30"
                    : "text-white/65 hover:text-white hover:bg-white/10"
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="relative z-10 px-4 py-4 border-t border-white/10">
          <p className="text-[10px] text-white/30 text-center">CardioAgenda v1.0</p>
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