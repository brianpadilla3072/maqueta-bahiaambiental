import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { ActionIcon, Avatar, Tooltip } from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import {
  LayoutDashboard, FileText, Users, LogOut, ShieldCheck,
  Sun, Moon, ChevronLeft, ChevronRight, ClipboardCheck,
} from "lucide-react";
import { SidebarNavItem } from "../shared/SidebarNavItem";
import { useAppColors } from "../../hooks/useAppColors";

const ACCENT       = "#3b82f6";
const ACCENT_DARK  = "rgba(59,130,246,0.08)";
const ACCENT_LIGHT = "rgba(59,130,246,0.05)";
const NAV_W        = 256;
const NAV_W_SMALL  = 64;

const navItems = [
  { path: "/rrhh/dashboard",       label: "Dashboard",      icon: LayoutDashboard },
  { path: "/rrhh/justificaciones", label: "Justificaciones", icon: FileText },
  { path: "/rrhh/legajo",          label: "Legajo",         icon: Users },
  { path: "/rrhh/revision",        label: "Gestión de Jornada", icon: ClipboardCheck },
];

export function HRLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const C        = useAppColors();
  const isDark   = colorScheme === "dark";
  const accentLight = isDark ? ACCENT_DARK : ACCENT_LIGHT;

  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  const sidebarW = collapsed ? NAV_W_SMALL : NAV_W;

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  /* ── Sidebar content ─────────────────────────────────────────────── */
  const sidebarContent = (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "visible" }}>

      {/* Logo */}
      <div style={{ padding: collapsed ? "20px 14px 16px" : "20px 18px 16px", borderBottom: `1px solid ${C.sidebarBorder}`, position: "relative", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: collapsed ? 0 : 10, justifyContent: collapsed ? "center" : "flex-start" }}>
          <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 9, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ShieldCheck size={18} color="#60a5fa" />
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
              <p style={{ color: C.textPrimary, fontSize: 15, fontWeight: 700, lineHeight: 1.1, margin: 0 }}>FaceDeep</p>
              <p style={{ color: C.textMuted, fontSize: 10, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", margin: 0 }}>Enterprise</p>
            </div>
          )}
        </div>

        {/* Toggle button */}
        <Tooltip label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"} position="right" withArrow>
          <button
            onClick={() => setCollapsed((v) => !v)}
            style={{ position: "absolute", top: 14, right: -14, width: 28, height: 28, borderRadius: "50%", background: isDark ? "#1c1c28" : "#ffffff", border: `1.5px solid ${C.sidebarBorder}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.13)", zIndex: 20, color: C.textMuted, transition: "color 150ms" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#60a5fa")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.textMuted)}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </Tooltip>
      </div>

      {/* Nav items */}
      <div style={{ padding: "12px 10px", flex: 1, overflowX: "hidden", overflowY: "auto" }}>
        {!collapsed && (
          <p style={{ color: C.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 6px", marginBottom: 6, whiteSpace: "nowrap" }}>
            Gestión
          </p>
        )}
        {navItems.map((item) => (
          <Tooltip key={item.path} label={item.label} position="right" withArrow disabled={!collapsed}>
            <div>
              <SidebarNavItem
                icon={item.icon}
                label={item.label}
                active={location.pathname.startsWith(item.path.split("/").slice(0, 3).join("/"))}
                onClick={() => handleNav(item.path)}
                accentColor={ACCENT}
                accentLight={accentLight}
                collapsed={collapsed}
              />
            </div>
          </Tooltip>
        ))}
      </div>

      {/* Footer user */}
      <div style={{ borderTop: `1px solid ${C.sidebarBorder}`, padding: "12px 10px", flexShrink: 0 }}>
        {!collapsed ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: "0 4px" }}>
              <Avatar color="violet" radius="xl" size="sm">RH</Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: C.textPrimary, fontSize: 13, fontWeight: 600, lineHeight: 1.2, margin: 0 }}>Analista RRHH</p>
                <p style={{ color: C.textMuted, fontSize: 11, margin: 0 }}>Gestión de Personal</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, padding: "0 4px" }}>
              <Tooltip label={isDark ? "Modo claro" : "Modo oscuro"} withArrow position="top">
                <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => toggleColorScheme()} style={{ flex: 1 }}>
                  {isDark ? <Sun size={14} color="#fbbf24" /> : <Moon size={14} color="#64748b" />}
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Cerrar sesión" withArrow position="top">
                <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => navigate("/login")} style={{ flex: 1 }}>
                  <LogOut size={14} />
                </ActionIcon>
              </Tooltip>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <Tooltip label="Analista RRHH" position="right" withArrow>
              <Avatar color="violet" radius="xl" size="sm">RH</Avatar>
            </Tooltip>
            <Tooltip label={isDark ? "Modo claro" : "Modo oscuro"} position="right" withArrow>
              <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => toggleColorScheme()}>
                {isDark ? <Sun size={14} color="#fbbf24" /> : <Moon size={14} color="#64748b" />}
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Cerrar sesión" position="right" withArrow>
              <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => navigate("/login")}>
                <LogOut size={14} />
              </ActionIcon>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );

  /* ── Layout ──────────────────────────────────────────────────────── */
  return (
    <div style={{ display: "flex", height: "100vh", background: C.mainBg }}>

      {/* ── Desktop sidebar ── */}
      <aside
        style={{ width: sidebarW, flexShrink: 0, background: isDark ? "#16161c" : "#ffffff", borderRight: `1px solid ${C.sidebarBorder}`, transition: "width 220ms cubic-bezier(.4,0,.2,1)", overflow: "visible", position: "relative", zIndex: 10 }}
        className="desktop-sidebar"
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 40 }} />
      )}
      <aside
        style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: NAV_W, background: isDark ? "#16161c" : "#ffffff", borderRight: `1px solid ${C.sidebarBorder}`, zIndex: 50, transform: mobileOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 220ms cubic-bezier(.4,0,.2,1)" }}
        className="mobile-sidebar"
      >
        {sidebarContent}
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, overflow: "auto", background: C.mainBg, display: "flex", flexDirection: "column" }}>

        {/* Mobile topbar */}
        <div
          className="mobile-topbar"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            height: 56,
            flexShrink: 0,
            background: isDark ? "#16161c" : "#ffffff",
            borderBottom: `1px solid ${C.sidebarBorder}`,
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <button
            onClick={() => setMobileOpen((v) => !v)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: C.textPrimary, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="4.5"  width="16" height="1.8" rx="0.9" fill="currentColor" />
              <rect x="2" y="9.1"  width="16" height="1.8" rx="0.9" fill="currentColor" />
              <rect x="2" y="13.7" width="16" height="1.8" rx="0.9" fill="currentColor" />
            </svg>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={15} color="#60a5fa" />
            </div>
            <span style={{ color: C.textPrimary, fontSize: 15, fontWeight: 700 }}>FaceDeep</span>
          </div>
          <Avatar color="violet" radius="xl" size="sm">RH</Avatar>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-sidebar { display: none !important; }
          .mobile-topbar  { display: none !important; }
        }
      `}</style>
    </div>
  );
}