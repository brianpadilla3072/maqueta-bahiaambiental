import {
  Box,
  Button,
  Card,
  Text,
  Badge,
  Table,
  ThemeIcon,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Cpu, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useAppColors } from "../../hooks/useAppColors";

interface Device {
  id: number;
  nombre: string;
  estacion: string;
  ip: string;
  status: "online" | "offline" | "syncing";
  last_sync: string;
}

const INITIAL_DEVICES: Device[] = [
  { id: 1, nombre: "FD-001 (Padre)", estacion: "Centro Norte",  ip: "192.168.1.10", status: "online",  last_sync: "Hace 2 min" },
  { id: 2, nombre: "FD-002",         estacion: "Centro Norte",  ip: "192.168.1.11", status: "online",  last_sync: "Hace 5 min" },
  { id: 3, nombre: "FD-003",         estacion: "Villa Urquiza", ip: "192.168.2.10", status: "online",  last_sync: "Hace 12 min" },
  { id: 4, nombre: "FD-004",         estacion: "Palermo Sur",   ip: "192.168.3.10", status: "syncing", last_sync: "Sincronizando..." },
  { id: 5, nombre: "FD-005",         estacion: "Palermo Sur",   ip: "192.168.3.11", status: "online",  last_sync: "Hace 8 min" },
  { id: 6, nombre: "FD-006",         estacion: "La Boca",       ip: "192.168.4.10", status: "offline", last_sync: "Hace 4 hs" },
  { id: 7, nombre: "FD-007",         estacion: "Flores",        ip: "192.168.5.10", status: "online",  last_sync: "Hace 3 min" },
];

export function AdminDispositivos() {
  const C = useAppColors();
  const devices = INITIAL_DEVICES;

  const STATUS_CONFIG = {
    online:  { color: "blue"   as const, label: "En Línea",       dot: C.info.dot, bg: C.info.bg, border: C.info.border },
    offline: { color: "orange" as const, label: "Sin Conexión",   dot: C.danger.dot,  bg: C.danger.bg,  border: C.danger.border  },
    syncing: { color: "blue"   as const, label: "Sincronizando",  dot: C.info.dot,    bg: C.info.bg,    border: C.info.border    },
  };

  const onlineCount  = devices.filter((d) => d.status === "online").length;
  const offlineCount = devices.filter((d) => d.status === "offline").length;

  const TH = { fontSize: 11, fontWeight: 700 as const, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.05em" };

  const stats = [
    { label: "En Línea",      count: onlineCount,  Icon: Wifi,     ...STATUS_CONFIG.online  },
    { label: "Sin Conexión",  count: offlineCount, Icon: WifiOff,   ...STATUS_CONFIG.offline },
  ];

  return (
    <Box>
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <Text style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>Panel de Dispositivos FaceDeep</Text>
            <Text style={{ fontSize: 13, color: C.textMuted }}>Control técnico de hardware biométrico · {devices.length} dispositivos registrados</Text>
          </div>
          <Button
            leftSection={<RefreshCw size={15} />}
            variant="light" color="gray"
            onClick={() => notifications.show({ title: "Estado actualizado", message: "Información de dispositivos refrescada.", color: "blue" })}
            style={{ fontWeight: 600 }}
          >
            Actualizar Estado
          </Button>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {stats.map((stat) => (
            <Card key={stat.label} radius="lg" p="md" style={{ border: `1px solid ${stat.border}`, background: stat.bg }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <ThemeIcon radius="md" size="lg" style={{ background: stat.dot + "18", color: stat.dot, border: `1px solid ${stat.dot}28` }}>
                  <stat.Icon size={18} />
                </ThemeIcon>
                <div>
                  <p style={{ fontSize: 11, color: C.textMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>{stat.label}</p>
                  <p style={{ fontSize: 22, fontWeight: 700, color: stat.dot, lineHeight: 1, margin: 0 }}>{stat.count}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Table card */}
        <Card withBorder radius="lg" shadow="sm" p={0} style={{ borderColor: C.cardBorder, background: C.cardBg }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.divider}`, background: C.cardHeaderBg, display: "flex", alignItems: "center", gap: 10 }}>
            <Cpu size={16} color={C.info.color} />
            <Text style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>Inventario de dispositivos</Text>
          </div>
          <Table.ScrollContainer minWidth={580}>
            <Table verticalSpacing="md" horizontalSpacing="md">
              <Table.Thead>
                <Table.Tr style={{ background: C.cardHeaderBg }}>
                  {["Dispositivo", "Estación", "Estado", "Última vez"].map((h) => (
                    <Table.Th key={h} style={TH}>{h}</Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {devices.map((device) => {
                  const cfg = STATUS_CONFIG[device.status];
                  return (
                    <Table.Tr key={device.id} style={{ borderBottom: `1px solid ${C.divider}` }}>
                      {/* Device name */}
                      <Table.Td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.dot, boxShadow: `0 0 0 3px ${cfg.dot}25`, flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, margin: 0 }}>{device.nombre}</p>
                            <p style={{ fontSize: 11, color: C.textMuted, fontFamily: "monospace", margin: 0 }}>{device.ip}</p>
                          </div>
                        </div>
                      </Table.Td>
                      {/* Estación */}
                      <Table.Td><Text style={{ fontSize: 13, color: C.textSecondary }}>{device.estacion}</Text></Table.Td>
                      {/* Estado */}
                      <Table.Td>
                        <Badge color={cfg.color} variant="light" size="sm" radius="sm" style={{ fontWeight: 600 }}>{cfg.label}</Badge>
                      </Table.Td>
                      {/* Última vez */}
                      <Table.Td><Text style={{ fontSize: 12, color: C.textMuted }}>{device.last_sync}</Text></Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>
      </div>
    </Box>
  );
}
