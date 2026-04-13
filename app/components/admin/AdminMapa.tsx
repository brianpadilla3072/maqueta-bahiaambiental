import { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  Text,
  TextInput,
  Select,
  Divider,
  Badge,
  Stack,
  Group,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Wifi, WifiOff, Plus, AlertCircle } from "lucide-react";
import { useAppColors } from "../../hooks/useAppColors";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Leaflet default icon fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Station {
  id: number;
  name: string;
  address: string;
  zona: string;
  lat: number;
  lng: number;
  status: "online" | "offline" | "warning";
  devices: number;
  operarios: number;
}

const INITIAL_STATIONS: Station[] = [
  { id: 1, name: "Centro Bahía",     address: "Estomba 100",           zona: "Centro", lat: -38.718, lng: -62.266, status: "online",  devices: 2, operarios: 18 },
  { id: 2, name: "Puerto Galván",    address: "Ing. White",            zona: "Sur",    lat: -38.784, lng: -62.300, status: "online",  devices: 1, operarios: 12 },
  { id: 3, name: "Univ. Nacional",   address: "Av. Alem 1253",         zona: "Norte",  lat: -38.702, lng: -62.269, status: "warning", devices: 2, operarios: 22 },
  { id: 4, name: "Villa Mitre",      address: "Caseros 1200",          zona: "Este",   lat: -38.715, lng: -62.245, status: "offline", devices: 1, operarios: 0  },
  { id: 5, name: "Bº Patagonia",     address: "Larrechea 3200",        zona: "Norte",  lat: -38.680, lng: -62.230, status: "online",  devices: 2, operarios: 16 },
  { id: 6, name: "Gral. Cerri",      address: "Plaza Moreiro",         zona: "Oeste",  lat: -38.715, lng: -62.400, status: "online",  devices: 1, operarios: 14 },
];

const BAHIA_BLANCA_COORDS: [number, number] = [-38.7183, -62.2663];

export function AdminMapa() {
  const C = useAppColors();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", zona: "", devices: 1, faceDeep: "", supervisor: "" });

  const statusConfig = {
    online:  { color: "blue"   as const, label: "Operativa",    Icon: Wifi,        dot: C.info.dot, bg: C.info.bg, border: C.info.border },
    offline: { color: "orange" as const, label: "Sin conexión", Icon: WifiOff,     dot: C.danger.dot,  bg: C.danger.bg,  border: C.danger.border  },
    warning: { color: "yellow" as const, label: "Alerta",       Icon: AlertCircle, dot: C.warning.dot, bg: C.warning.bg, border: C.warning.border },
  };

  const handleSelectStation = (s: Station) => {
    setSelectedStation(s);
    setForm({ name: s.name, address: s.address, zona: s.zona, devices: s.devices, faceDeep: "FD-" + String(s.id).padStart(3, "0"), supervisor: "" });
    setEditMode(true);
    open();
  };

  const handleNewStation = () => {
    setSelectedStation(null);
    setForm({ name: "", address: "", zona: "", devices: 1, faceDeep: "", supervisor: "" });
    setEditMode(false);
    open();
  };

  const handleSave = () => {
    if (!form.name || !form.address) {
      notifications.show({ title: "Campos requeridos", message: "Complete nombre y dirección.", color: "orange" });
      return;
    }
    if (editMode && selectedStation) {
      setStations((prev) => prev.map((s) => s.id === selectedStation.id ? { ...s, ...form } : s));
      notifications.show({ title: "Estación actualizada", message: `${form.name} modificada.`, color: "blue" });
    } else {
      const newStation: Station = {
        id: Date.now(), name: form.name, address: form.address, zona: form.zona,
        lat: BAHIA_BLANCA_COORDS[0] + (Math.random() - 0.5) * 0.05, 
        lng: BAHIA_BLANCA_COORDS[1] + (Math.random() - 0.5) * 0.05,
        status: "online", devices: form.devices, operarios: 0,
      };
      setStations((prev) => [...prev, newStation]);
      notifications.show({ title: "Estación creada", message: `${form.name} incorporada al sistema.`, color: "blue" });
    }
    close();
  };

  const inputStyles = {
    label: { fontSize: 13, fontWeight: 500, color: C.textLabel, marginBottom: 5 },
    input: { background: C.inputBg, borderColor: C.inputBorder, color: C.inputColor },
  };

  const tileLayerUrl = isDark 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const tileLayerAttribution = isDark
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <Box style={{ position: "relative", width: "100%", height: "100%", flex: 1 }}>
      {/* Botón flotante — por encima de los paneles Leaflet (tiles ~200, markers ~600, controls ~1000) */}
      <Box
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 1100,
          pointerEvents: "auto",
        }}
      >
        <Button
          leftSection={<Plus size={14} />}
          onClick={handleNewStation}
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            background: "#2563eb",
            border: "none",
            fontWeight: 600,
            fontSize: 12,
          }}
          radius="md"
          size="xs"
          px="sm"
        >
          Añadir Estación
        </Button>
      </Box>

      {/* Mapa Leaflet */}
      <MapContainer
        center={BAHIA_BLANCA_COORDS}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution={tileLayerAttribution}
          url={tileLayerUrl}
        />
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.lat, station.lng]}
            eventHandlers={{
              click: () => handleSelectStation(station),
            }}
          >
            <Popup>
              <Stack gap={4} style={{ minWidth: 150 }}>
                <Text fw={700} size="sm">{station.name}</Text>
                <Text size="xs" c="dimmed">{station.address}</Text>
                <Group gap={6} mt={4}>
                  <Badge color={statusConfig[station.status].color} size="xs" variant="light">
                    {statusConfig[station.status].label}
                  </Badge>
                  <Text size="xs" c="dimmed">{station.devices} disp.</Text>
                </Group>
              </Stack>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Drawer para edición/creación */}
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="md"
        title={
          <Text fw={700} size="lg" c={C.textPrimary}>
            {editMode ? "Editar Estación" : "Nueva Estación"}
          </Text>
        }
        styles={{
          header: { background: C.cardBg, borderBottom: `1px solid ${C.sidebarBorder}` },
          content: { background: C.cardBg },
          close: { color: C.textMuted },
        }}
      >
        <Stack gap="xl" p="md">
          <TextInput
            label="Nombre de la Estación"
            placeholder="Ej: Sede Central"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            styles={inputStyles}
            required
          />

          <TextInput
            label="Dirección"
            placeholder="Av. Corrientes 1234"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            styles={inputStyles}
            required
          />

          <Select
            label="Zona Operativa"
            placeholder="Seleccione una zona"
            data={["Norte", "Sur", "Este", "Oeste", "Centro"]}
            value={form.zona}
            onChange={(v) => setForm({ ...form, zona: v || "" })}
            styles={inputStyles}
          />

          <Select
            label="Cantidad de Dispositivos"
            placeholder="Seleccione cantidad"
            data={["1", "2", "3", "4", "5"]}
            value={form.devices.toString()}
            onChange={(v) => setForm({ ...form, devices: parseInt(v || "1") })}
            styles={inputStyles}
          />

          <Select
            label="Face Deep"
            placeholder="Seleccione un dispositivo"
            data={[
              { value: "FD-001", label: "FD-001 — ZKTeco FaceDepot 7B" },
              { value: "FD-002", label: "FD-002 — ZKTeco SpeedFace V5L" },
              { value: "FD-003", label: "FD-003 — ZKTeco ProFace X" },
              { value: "FD-004", label: "FD-004 — ZKTeco FaceDepot 7B" },
              { value: "FD-005", label: "FD-005 — ZKTeco SpeedFace V5L" },
            ]}
            value={form.faceDeep}
            onChange={(v) => setForm({ ...form, faceDeep: v || "" })}
            styles={inputStyles}
            searchable
          />

          <Select
            label="Supervisor Encargado"
            placeholder="Seleccione un supervisor"
            data={[
              { value: "sup-1", label: "Juan Pérez — Supervisor" },
              { value: "sup-2", label: "Martín Gómez — Supervisor" },
              { value: "sup-3", label: "Laura Fernández — Supervisora" },
              { value: "sup-4", label: "Diego Ramírez — Supervisor" },
            ]}
            value={form.supervisor}
            onChange={(v) => setForm({ ...form, supervisor: v || "" })}
            styles={inputStyles}
            searchable
          />

          <Divider my="sm" color={C.sidebarBorder} />

          <Button
            fullWidth
            size="md"
            onClick={handleSave}
            style={{ background: "#2563eb" }}
          >
            {editMode ? "Guardar Cambios" : "Crear Estación"}
          </Button>
        </Stack>
      </Drawer>

      <style>{`
        .leaflet-container {
          background: ${C.mainBg} !important;
        }
        .leaflet-popup-content-wrapper {
          background: ${C.cardBg};
          color: ${C.textPrimary};
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .leaflet-popup-tip {
          background: ${C.cardBg};
        }
        /* Ajuste de color para los créditos en modo oscuro */
        .leaflet-control-attribution {
          background: ${isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)"} !important;
          color: ${isDark ? "#ccc" : "#333"} !important;
        }
        .leaflet-control-attribution a {
          color: ${isDark ? "#60a5fa" : "#2563eb"} !important;
        }
      `}</style>
    </Box>
  );
}
