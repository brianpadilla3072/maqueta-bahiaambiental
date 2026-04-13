import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { ActionIcon, Avatar, Badge, Tooltip, Modal, Stack, Button, TextInput, Card, ScrollArea, Select } from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  Home, Activity, LogOut, ShieldCheck,
  Sun, Moon, ChevronLeft, ChevronRight, Wifi, WifiOff, MapPin, Building2, Plus,
} from "lucide-react";
import { SidebarNavItem } from "../shared/SidebarNavItem";
import { useAppColors } from "../../hooks/useAppColors";
import { Group, Text } from "@mantine/core";

const ACCENT       = "#3b82f6";
const ACCENT_DARK  = "rgba(59,130,246,0.06)";
const ACCENT_LIGHT = "rgba(59,130,246,0.04)";
const NAV_W        = 256;
const NAV_W_SMALL  = 64;

const navItems = [
  { path: "/supervisor/home",    label: "Apertura de Jornada", icon: Home },
  { path: "/supervisor/jornada", label: "Jornada en Vivo",     icon: Activity },
];

export function SupervisorLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const C        = useAppColors();
  const isDark   = colorScheme === "dark";
  const accentLight = isDark ? ACCENT_DARK : ACCENT_LIGHT;

  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [online] = useState(true);
  
  const [estacionesOpened, { open: openEstaciones, close: closeEstaciones }] = useDisclosure(false);
  const [solicitudOpened, { open: openSolicitud, close: closeSolicitud }] = useDisclosure(false);
  const [mensajeSolicitud, setMensajeSolicitud] = useState("");
  const [estacionSeleccionada, setEstacionSeleccionada] = useState<string | null>(null);
  const [estacionesAsignadas, setEstacionesAsignadas] = useState([
    { id: 1, nombre: "Centro Norte", estado: "activa" },
    { id: 2, nombre: "Zona Industrial Este", estado: "inactiva" },
  ]);

  const estacionesDisponibles = [
    { value: "zona-sur", label: "Zona Sur" },
    { value: "centro-oeste", label: "Centro Oeste" },
    { value: "parque-industrial", label: "Parque Industrial" },
    { value: "zona-franca", label: "Zona Franca" },
    { value: "puerto", label: "Puerto Comercial" },
  ];

  const sidebarW = collapsed ? NAV_W_SMALL : NAV_W;

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleSolicitarEstacion = () => {
    if (!estacionSeleccionada) {
      notifications.show({
        title: "Estación requerida",
        message: "Debe seleccionar una estación para solicitar la asignación.",
        color: "orange",
      });
      return;
    }
    if (!mensajeSolicitud.trim()) {
      notifications.show({
        title: "Mensaje requerido",
        message: "Debe ingresar un mensaje para solicitar la asignación.",
        color: "orange",
      });
      return;
    }
    const estacionNombre = estacionesDisponibles.find(e => e.value === estacionSeleccionada)?.label;
    notifications.show({
      title: "Solicitud enviada",
      message: `Gerencia revisará tu solicitud para acceder a ${estacionNombre}.`,
      color: "blue",
    });
    setMensajeSolicitud("");
    setEstacionSeleccionada(null);
    closeSolicitud();
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
          <div style={{ padding: "0 6px", marginBottom: 6 }}>
            <p style={{ color: C.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0, whiteSpace: "nowrap" }}>
              Navegación
            </p>
          </div>
        )}
        {collapsed && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <Tooltip label={online ? "En línea" : "Sin conexión"} position="right" withArrow>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: online ? "#2dd4bf" : "#fb923c" }} />
            </Tooltip>
          </div>
        )}
        {navItems.map((item) => (
          <Tooltip key={item.path} label={item.label} position="right" withArrow disabled={!collapsed}>
            <div>
              <SidebarNavItem
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.path}
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
              <Avatar color="blue" radius="xl" size="sm">S</Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: C.textPrimary, fontSize: 13, fontWeight: 600, lineHeight: 1.2, margin: 0 }}>Supervisor</p>
                <p style={{ color: C.textMuted, fontSize: 11, margin: 0 }}>Centro Norte</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, padding: "0 4px" }}>
              <Tooltip label="Cambiar estación" withArrow position="top">
                <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => openEstaciones()} style={{ flex: 1 }}>
                  <MapPin size={14} />
                </ActionIcon>
              </Tooltip>
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
            <Tooltip label="Supervisor" position="right" withArrow>
              <Avatar color="blue" radius="xl" size="sm">S</Avatar>
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

        {/* Mobile topbar — oculto en desktop */}
        <div
          className="mobile-topbar"
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            padding:        "0 16px",
            height:         56,
            flexShrink:     0,
            background:     isDark ? "#16161c" : "#ffffff",
            borderBottom:   `1px solid ${C.sidebarBorder}`,
            position:       "sticky",
            top:            0,
            zIndex:         30,
          }}
        >
          {/* Hamburger */}
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

          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={15} color="#60a5fa" />
            </div>
            <span className="text-center" style={{ color: C.textPrimary, fontSize: 15, fontWeight: 700 }}>FaceDeep</span>
          </div>

          {/* Avatar + estado online */}
          
        </div>

        {/* Contenido de la ruta */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          <Group gap="xs" wrap="wrap">
            <Text style={{ fontSize: 12, color: C.textMuted }}>
              {new Date().toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </Text>
          </Group>
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-sidebar  { display: none !important; }
          .mobile-topbar   { display: none !important; }
        }
      `}</style>

      {/* ── Modales ── */}
      <Modal
        opened={estacionesOpened}
        onClose={closeEstaciones}
        title={
          <Group gap="xs">
            <Building2 size={17} color={C.info.color} />
            <Text fw={600} style={{ color: C.textPrimary }}>Estaciones Asignadas</Text>
          </Group>
        }
        centered
        radius="lg"
        size="md"
        styles={{
          content: { background: C.cardBg, border: `1px solid ${C.cardBorder}` },
          header: { background: C.cardBg, borderBottom: `1px solid ${C.divider}` },
        }}
      >
        <Stack gap="md">
          <ScrollArea style={{ maxHeight: 300 }}>
            <Stack gap="xs">
              {estacionesAsignadas.map((estacion) => (
                <Card
                  key={estacion.id}
                  withBorder
                  radius="md"
                  p="sm"
                  style={{
                    borderColor: estacion.estado === "activa" ? "#10b981" : C.cardBorder,
                    background: estacion.estado === "activa" ? "rgba(16,185,129,0.05)" : C.cardBg,
                  }}
                >
                  <Group justify="space-between">
                    <Group gap="xs">
                      <MapPin size={16} color={estacion.estado === "activa" ? "#10b981" : C.textMuted} />
                      <Text style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>
                        {estacion.nombre}
                      </Text>
                    </Group>
                    <Badge
                      color={estacion.estado === "activa" ? "teal" : "gray"}
                      size="sm"
                      variant="light"
                      radius="sm"
                    >
                      {estacion.estado === "activa" ? "Activa" : "Inactiva"}
                    </Badge>
                  </Group>
                </Card>
              ))}
            </Stack>
          </ScrollArea>

          <Button
            leftSection={<Plus size={16} />}
            color="blue"
            onClick={() => {
              closeEstaciones();
              openSolicitud();
            }}
            fullWidth
          >
            Solicitar nueva estación
          </Button>
        </Stack>
      </Modal>

      <Modal
        opened={solicitudOpened}
        onClose={closeSolicitud}
        title={
          <Group gap="xs">
            <Plus size={17} color={C.info.color} />
            <Text fw={600} style={{ color: C.textPrimary }}>Solicitar nueva estación</Text>
          </Group>
        }
        centered
        radius="lg"
        size="md"
        styles={{
          content: { background: C.cardBg, border: `1px solid ${C.cardBorder}` },
          header: { background: C.cardBg, borderBottom: `1px solid ${C.divider}` },
        }}
      >
        <Stack gap="md">
          <Text style={{ fontSize: 13, color: C.textMuted }}>
            Envía un mensaje a Gerencia para solicitar acceso a una nueva estación. La solicitud será revisada y aprobada.
          </Text>
          <Select
            label="Estación"
            placeholder="Selecciona una estación"
            value={estacionSeleccionada}
            onChange={setEstacionSeleccionada}
            data={estacionesDisponibles}
            styles={{
              input: {
                background: C.inputBg,
                borderColor: C.inputBorder,
                color: C.inputColor,
              },
              label: {
                color: C.textSecondary,
                fontSize: 13,
                fontWeight: 600,
              },
            }}
          />
          <TextInput
            label="Mensaje de solicitud"
            placeholder="Ej: Necesito acceso a la estación Zona Sur para supervisar la obra..."
            value={mensajeSolicitud}
            onChange={(e) => setMensajeSolicitud(e.target.value)}
            minLength={10}
            styles={{
              input: {
                background: C.inputBg,
                borderColor: C.inputBorder,
                color: C.inputColor,
              },
              label: {
                color: C.textSecondary,
                fontSize: 13,
                fontWeight: 600,
              },
            }}
          />
          <Group justify="flex-end">
            <Button variant="subtle" color="gray" onClick={closeSolicitud}>
              Cancelar
            </Button>
            <Button leftSection={<Plus size={15} />} color="blue" onClick={handleSolicitarEstacion}>
              Enviar solicitud
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}