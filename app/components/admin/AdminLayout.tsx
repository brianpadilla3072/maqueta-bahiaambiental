import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { ActionIcon, Avatar, Badge, Divider, Tooltip } from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import {
  Map, Cpu, UserPlus, Shield, LogOut, ShieldCheck,
  Sun, Moon, ChevronLeft, ChevronRight, Menu, X, Building2,
} from "lucide-react";
import { SidebarNavItem } from "../shared/SidebarNavItem";
import { useAppColors } from "../../hooks/useAppColors";

const ACCENT        = "#2563eb";
const ACCENT_DARK   = "rgba(37,99,235,0.12)";
const ACCENT_LIGHT  = "rgba(37,99,235,0.06)";
const NAV_W         = 256;
const NAV_W_SMALL   = 64;

const navItems = [
  { path: "/admin/mapa",         label: "Mapa de Estaciones",   icon: Map },
  { path: "/admin/dispositivos", label: "Dispositivos FaceDeep", icon: Cpu },
  { path: "/admin/enrolamiento", label: "Enrolamiento Facial",   icon: UserPlus },
  { path: "/admin/estaciones",   label: "Gestión de Estaciones", icon: Building2 },
  { path: "/admin/auditoria",    label: "Auditoría y Config.",   icon: Shield },
];

export function AdminLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const C         = useAppColors();
  const isDark    = colorScheme === "dark";
  const accentLight = isDark ? ACCENT_DARK : ACCENT_LIGHT;

  // desktop: collapsed to icon-only
  const [collapsed, setCollapsed] = useState(false);
  // mobile: drawer open
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const sidebarW = collapsed ? NAV_W_SMALL : NAV_W;

  /* ── Sidebar content ────────────────────────────────────────────── */
  const renderSidebarContent = (isMobile = false) => {
    const isCollapsed = isMobile ? false : collapsed;

    return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "visible",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: isCollapsed ? "20px 14px 16px" : "20px 18px 16px",
          borderBottom: `1px solid ${C.sidebarBorder}`,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: isCollapsed ? 0 : 10,
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
          <div
            style={{
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.28)",
              borderRadius: 9,
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={18} color="#3b82f6" />
          </div>
          {!isCollapsed && (
            <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
              <p style={{ color: C.textPrimary, fontSize: 15, fontWeight: 700, lineHeight: 1.1, margin: 0 }}>
                FaceDeep
              </p>
              <p style={{ color: C.textMuted, fontSize: 10, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", margin: 0 }}>
                Enterprise
              </p>
            </div>
          )}
        </div>

        {/* Toggle button — desktop only */}
        {!isMobile && (
          <Tooltip label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"} position="right" withArrow>
            <button
              onClick={() => setCollapsed((v) => !v)}
              style={{
                position: "absolute",
                top: 14,
                right: -14,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: isDark ? "#1c1c28" : "#ffffff",
                border: `1.5px solid ${C.sidebarBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.13)",
                zIndex: 20,
                color: C.textMuted,
                transition: "color 150ms",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#3b82f6")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.textMuted)}
            >
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </Tooltip>
        )}
      </div>

      {/* Nav items */}
      <div style={{ padding: "12px 10px", flex: 1, overflowX: "hidden", overflowY: "auto" }}>
        {!isCollapsed && (
          <p
            style={{
              color: C.textMuted,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "0 6px",
              marginBottom: 6,
              whiteSpace: "nowrap",
            }}
          >
            Control del Sistema
          </p>
        )}
        {navItems.map((item) => (
          <Tooltip
            key={item.path}
            label={item.label}
            position="right"
            withArrow
            disabled={!isCollapsed}
          >
            <div>
              <SidebarNavItem
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.path}
                onClick={() => handleNav(item.path)}
                accentColor={ACCENT}
                accentLight={accentLight}
                collapsed={isCollapsed}
              />
            </div>
          </Tooltip>
        ))}
      </div>

      {/* Footer user */}
      <div style={{ borderTop: `1px solid ${C.sidebarBorder}`, padding: "12px 10px", flexShrink: 0 }}>
        {!isCollapsed ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: "0 4px" }}>
              <Avatar color="blue" radius="xl" size="sm">AD</Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: C.textPrimary, fontSize: 13, fontWeight: 600, lineHeight: 1.2, margin: 0 }}>Admin Sistema</p>
                <p style={{ color: C.textMuted, fontSize: 11, margin: 0 }}>Acceso Total</p>
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
            <Tooltip label="Admin Sistema" position="right" withArrow>
              <Avatar color="blue" radius="xl" size="sm">AD</Avatar>
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
  };

  /* ── Layout ─────────────────────────────────────────────────────── */
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: C.mainBg }}>

      {/* BODY: sidebar + content side by side */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>

        {/* ── Desktop sidebar ── */}
        <aside
          style={{
            width: sidebarW,
            flexShrink: 0,
            background: isDark ? "#16161c" : "#ffffff",
            borderRight: `1px solid ${C.sidebarBorder}`,
            transition: "width 220ms cubic-bezier(.4,0,.2,1)",
            overflow: "visible",
            position: "relative",
            zIndex: 10,
          }}
          className="desktop-sidebar"
        >
          {renderSidebarContent(false)}
        </aside>

        {/* ── Mobile drawer overlay ── */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "absolute",
              top: 56,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 20,
            }}
          />
        )}
        <aside
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: NAV_W,
            background: isDark ? "#16161c" : "#ffffff",
            borderRight: `1px solid ${C.sidebarBorder}`,
            zIndex: 50,
            transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 220ms cubic-bezier(.4,0,.2,1)",
          }}
          className="mobile-sidebar"
        >
          {renderSidebarContent(true)}
        </aside>

        {/* ── Main content ── */}
        <main
          style={{
            flex: 1,
            overflow: "auto",
            background: C.mainBg,
            display: "flex",
            flexDirection: "column",
            transition: "padding 220ms cubic-bezier(.4,0,.2,1)",
            position: "relative",
            zIndex: 0,
          }}
        >
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
              <div style={{ background: "rgba(59,130,246,0.18)", border: "1px solid rgba(59,130,246,0.35)", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShieldCheck size={15} color="#60a5fa" />
              </div>
              <span style={{ color: C.textPrimary, fontSize: 15, fontWeight: 700 }}>FaceDeep</span>
            </div>
            <Avatar color="blue" radius="xl" size="sm">AD</Avatar>
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: location.pathname === "/admin/mapa" ? 0 : 24, position: "relative", display: "flex", flexDirection: "column" }}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Responsive helpers */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .hide-on-mobile  { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-sidebar  { display: none !important; }
          .mobile-menu-btn { display: none !important; }
          .mobile-topbar   { display: none !important; }
        }
      `}</style>
    </div>
  );
}