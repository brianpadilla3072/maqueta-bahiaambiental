import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Badge,
  Avatar,
  Modal,
  Textarea,
  Chip,
  ThemeIcon,
  Divider,
  ScrollArea,
  Paper,
  SimpleGrid,
  Collapse,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  Activity,
  Plus,
  Clock,
  CheckCircle2,
  MinusCircle,
  Cpu,
  ChevronRight,
  ChevronDown,
  LogIn,
  LogOut,
  StickyNote,
  MapPin,
} from "lucide-react";
import { useAppColors } from "../../hooks/useAppColors";

/* ── Tipos ────────────────────────────────────────────────────────── */
interface Worker {
  id:          number;
  name:        string;
  legajo:      string;
  categoria:   string;
  ingreso?:    string; // HH:MM
  egreso?:     string; // HH:MM
  observacionIngreso?: string;
  observacionEgreso?: string;
  scanning?:   boolean;
}

type WorkerStatus = "presente" | "en_jornada" | "ausente";

function getStatus(w: Worker): WorkerStatus {
  if (w.ingreso && w.egreso) return "presente";
  if (w.ingreso)             return "en_jornada";
  return "ausente";
}

function nowTime() {
  return new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

/* ── Mock inicial ─────────────────────────────────────────────────── */
const INITIAL_WORKERS: Worker[] = [
  { id: 1, name: "Carlos Mendez",  legajo: "OP-1042", categoria: "Peón",    ingreso: "06:58", egreso: "15:02" },
  { id: 2, name: "Ana Rodríguez",  legajo: "OP-2318", categoria: "Chofer",  ingreso: "07:02", observacionIngreso: "Permiso gremial — autorizado por capataz" },
  { id: 3, name: "Luis García",    legajo: "OP-0987", categoria: "Peón",    ingreso: "07:15" },
  { id: 4, name: "María López",    legajo: "OP-1563", categoria: "Oficial", ingreso: "06:55", egreso: "15:00", observacionEgreso: "Salida anticipada autorizada por RRHH" },
  { id: 5, name: "Roberto Silva",  legajo: "OP-2041", categoria: "Peón" },
  { id: 6, name: "Sandra Flores",  legajo: "OP-3102", categoria: "Chofer",  ingreso: "07:05" },
  { id: 7, name: "Diego Herrera",  legajo: "OP-1788", categoria: "Oficial", ingreso: "06:50", egreso: "14:58" },
  { id: 8, name: "Patricia Ruiz",  legajo: "OP-2256", categoria: "Peón",    ingreso: "07:20", observacionIngreso: "Cambio de turno acordado con supervisión" },
];

const MOTIVOS_RAPIDOS = [
  "Cuadrilla completa terminó a las 12:00",
  "Cambio de turno acordado",
  "Permiso gremial",
  "Salida anticipada autorizada",
  "Problema de transporte público",
  "Tráfico en zona",
];

/* ── Reloj ────────────────────────────────────────────────────────── */
function useElapsedTime() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(iv);
  }, []);
  const h = Math.floor(elapsed / 3600).toString().padStart(2, "0");
  const m = Math.floor((elapsed % 3600) / 60).toString().padStart(2, "0");
  const s = (elapsed % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

/* ── Config visual por estado ─────────────────────────────────────── */
function useStatusConfig(C: ReturnType<typeof import("../../hooks/useAppColors").useAppColors>) {
  return {
    presente: {
      color:   "teal" as const,
      label:   "Presente",
      icon:    CheckCircle2,
      border:  C.success.border,
      bg:      C.success.bg,
      dot:     C.success.dot,
    },
    en_jornada: {
      color:   "blue" as const,
      label:   "En jornada",
      icon:    LogIn,
      border:  C.info.border,
      bg:      C.info.bg,
      dot:     "#3b82f6",
    },
    ausente: {
      color:   "orange" as const,
      label:   "Ausente",
      icon:    MinusCircle,
      border:  C.danger.border,
      bg:      C.danger.bg,
      dot:     C.danger.dot,
    },
  } as const;
}

/* ── WorkerRow: fila colapsable por operario ──────────────────────── */
type StatusConfig = ReturnType<typeof useStatusConfig>;

function WorkerRow({
  worker,
  cfg,
  C,
}: {
  worker: Worker;
  cfg: StatusConfig[keyof StatusConfig];
  C: ReturnType<typeof useAppColors>;
}) {
  const [open, setOpen] = useState(false);
  const Icon = cfg.icon;
  const status = getStatus(worker);

  return (
    <Box>
      {/* Cabecera clicable */}
      <Box
        onClick={() => setOpen((v) => !v)}
        style={{
          padding:      "11px 10px",
          borderRadius:  8,
          borderLeft:   `3px solid ${cfg.dot}`,
          background:   status !== "presente" ? cfg.bg : "transparent",
          margin:       "2px 0",
          cursor:       "pointer",
          userSelect:   "none",
        }}
      >
        <Group justify="space-between" wrap="nowrap" gap="sm">
          <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
            <Avatar
              radius="xl"
              size="md"
              style={{ background: cfg.dot + "22", color: cfg.dot, fontWeight: 700, flexShrink: 0 }}
            >
              {worker.name.split(" ").map((n) => n[0]).join("")}
            </Avatar>
            <Box style={{ minWidth: 0 }}>
              <Group gap={6} mb={2} wrap="wrap">
                <Text style={{ fontSize: 13.5, fontWeight: 600, color: C.textPrimary }}>
                  {worker.name}
                </Text>
                <Badge
                  color={cfg.color}
                  size="xs"
                  variant="light"
                  leftSection={<Icon size={10} />}
                  radius="sm"
                  style={{ fontWeight: 600 }}
                >
                  {cfg.label}
                </Badge>
                {(worker.observacionIngreso || worker.observacionEgreso) && (
                  <Badge color="grape" size="xs" variant="light" leftSection={<StickyNote size={10} />} radius="sm">
                    Obs.
                  </Badge>
                )}
              </Group>
              <Text style={{ fontSize: 12, color: C.textMuted }}>
                {worker.legajo} · {worker.categoria}
              </Text>
            </Box>
          </Group>
          {/* Chevron */}
          <ChevronDown
            size={15}
            color={C.textMuted}
            style={{ flexShrink: 0, transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </Group>
      </Box>

      {/* Panel desplegable */}
      <Collapse in={open}>
        <Box
          style={{
            margin:       "0 4px 4px 20px",
            padding:      "10px 14px",
            borderRadius:  8,
            borderLeft:   `2px solid ${C.divider}`,
            background:   C.cardBg,
          }}
        >
          <Stack gap={8}>
            {/* Ingreso */}
            {worker.ingreso ? (
              <Group gap={8}>
                <Box
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 28, height: 28, borderRadius: 8,
                    background: "rgba(59,130,246,0.12)", flexShrink: 0,
                  }}
                >
                  <LogIn size={14} color="#3b82f6" />
                </Box>
                <Box>
                  <Text style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Ingreso
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: 700, color: "#3b82f6", fontVariantNumeric: "tabular-nums" }}>
                    {worker.ingreso}
                  </Text>
                </Box>
              </Group>
            ) : (
              <Group gap={8}>
                <Box
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 28, height: 28, borderRadius: 8,
                    background: C.danger.bg, flexShrink: 0,
                  }}
                >
                  <LogIn size={14} color={C.danger.dot} />
                </Box>
                <Box>
                  <Text style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Ingreso
                  </Text>
                  <Text style={{ fontSize: 13, color: C.danger.dot }}>Sin registro</Text>
                </Box>
              </Group>
            )}

            {/* Egreso */}
            {worker.egreso ? (
              <Group gap={8}>
                <Box
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 28, height: 28, borderRadius: 8,
                    background: C.success.bg, flexShrink: 0,
                  }}
                >
                  <LogOut size={14} color={C.success.dot} />
                </Box>
                <Box>
                  <Text style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Egreso
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: 700, color: C.success.dot, fontVariantNumeric: "tabular-nums" }}>
                    {worker.egreso}
                  </Text>
                </Box>
              </Group>
            ) : (
              <Group gap={8}>
                <Box
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 28, height: 28, borderRadius: 8,
                    background: C.info.bg, flexShrink: 0,
                  }}
                >
                  <LogOut size={14} color="#3b82f6" />
                </Box>
                <Box>
                  <Text style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Egreso
                  </Text>
                  <Text style={{ fontSize: 13, color: C.textMuted, fontStyle: "italic" }}>Pendiente</Text>
                </Box>
              </Group>
            )}

            {/* Observación de Ingreso */}
            {worker.observacionIngreso && (
              <Group gap={8} align="flex-start">
                <Box
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 28, height: 28, borderRadius: 8,
                    background: "rgba(168,85,247,0.12)", flexShrink: 0, marginTop: 2,
                  }}
                >
                  <StickyNote size={14} color="#a855f7" />
                </Box>
                <Box style={{ minWidth: 0 }}>
                  <Text style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Observación Ingreso
                  </Text>
                  <Text style={{ fontSize: 13, color: C.textSecondary, fontStyle: "italic", marginTop: 1 }}>
                    {worker.observacionIngreso}
                  </Text>
                </Box>
              </Group>
            )}

            {/* Observación de Egreso */}
            {worker.observacionEgreso && (
              <Group gap={8} align="flex-start">
                <Box
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 28, height: 28, borderRadius: 8,
                    background: "rgba(168,85,247,0.12)", flexShrink: 0, marginTop: 2,
                  }}
                >
                  <StickyNote size={14} color="#a855f7" />
                </Box>
                <Box style={{ minWidth: 0 }}>
                  <Text style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Observación Egreso
                  </Text>
                  <Text style={{ fontSize: 13, color: C.textSecondary, fontStyle: "italic", marginTop: 1 }}>
                    {worker.observacionEgreso}
                  </Text>
                </Box>
              </Group>
            )}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}

/* ── Componente ───────────────────────────────────────────────────── */
export function SupervisorJornada() {
  const C            = useAppColors();
  const elapsed      = useElapsedTime();
  const statusConfig = useStatusConfig(C);
  const [deviceStatus] = useState<"disponible" | "bloqueo">("disponible");

  const [workers,       setWorkers]       = useState<Worker[]>(INITIAL_WORKERS);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [observacionText, setObservacionText] = useState("");
  const [selectedMotivos, setSelectedMotivos] = useState<string[]>([]);
  const [obsOpened, { open: openObs, close: closeObs }] = useDisclosure(false);
  const [fabOpened, { open: openFab, close: closeFab }] = useDisclosure(false);
  const [newWorkerName, setNewWorkerName] = useState("");

  /* Contadores */
  const presenteCount  = workers.filter((w) => getStatus(w) === "presente").length;
  const enJornadaCount = workers.filter((w) => getStatus(w) === "en_jornada").length;
  const ausenteCount   = workers.filter((w) => getStatus(w) === "ausente").length;

  /* Filtrar solo operarios con al menos ingreso */
  const workersConRegistro = workers.filter((w) => w.ingreso);

  /* ── Registro biométrico (ingreso / egreso) ─── */
  const handleScan = (id: number) => {
    const worker = workers.find((w) => w.id === id);
    if (!worker || worker.scanning) return;

    // marcar "escaneando"
    setWorkers((prev) => prev.map((w) => w.id === id ? { ...w, scanning: true } : w));

    setTimeout(() => {
      const time = nowTime();
      setWorkers((prev) =>
        prev.map((w) => {
          if (w.id !== id) return w;
          const updated = { ...w, scanning: false };
          if (!w.ingreso) {
            notifications.show({ title: "Ingreso registrado", message: `${w.name} — ${time}`, color: "blue" });
            return { ...updated, ingreso: time };
          } else if (!w.egreso) {
            notifications.show({ title: "Egreso registrado", message: `${w.name} marcado como Presente — ${time}`, color: "teal" });
            return { ...updated, egreso: time };
          }
          return updated;
        })
      );
    }, 1100);
  };

  /* ── Observación ─────────────────────────────── */
  const handleOpenObservacion = (worker: Worker) => {
    setSelectedWorker(worker);
    setObservacionText(worker.observacionIngreso ?? worker.observacionEgreso ?? "");
    setSelectedMotivos([]);
    openObs();
  };

  const handleSaveObservacion = () => {
    if (!observacionText.trim() && selectedMotivos.length === 0) {
      notifications.show({ title: "Observación requerida", message: "Debe ingresar un motivo.", color: "orange" });
      return;
    }
    const text = [...selectedMotivos, observacionText].filter(Boolean).join(" | ");
    setWorkers((prev) => prev.map((w) => w.id === selectedWorker?.id ? { ...w, observacionIngreso: text } : w));
    notifications.show({ title: "Observación guardada", message: "Se registró correctamente.", color: "teal" });
    closeObs();
  };

  /* ── Incorporación ───────────────────────────── */
  const handleIncorporacion = () => {
    if (!newWorkerName.trim()) return;
    const newWorker: Worker = {
      id:        Date.now(),
      name:      newWorkerName,
      legajo:    `OP-${Math.floor(Math.random() * 9000 + 1000)}`,
      categoria: "Reemplazo",
      ingreso:   nowTime(),
    };
    setWorkers((prev) => [...prev, newWorker]);
    notifications.show({ title: "Incorporación registrada", message: `${newWorkerName} incorporado con ingreso a las ${newWorker.ingreso}.`, color: "teal" });
    setNewWorkerName("");
    closeFab();
  };

  /* ── Render ──────────────────────────────────── */
  return (
    <Box style={{ position: "relative", minHeight: "80vh" }}>

      {/* Encabezado */}
      <Box mb="lg">
        <Group justify="space-between" wrap="wrap" gap="md">
          <Box>
            <Text style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>
              Registro Biométrico
            </Text>
            <Group gap="xs">
              <MapPin size={14} color={C.textMuted} />
              <Text style={{ fontSize: 13, color: C.textMuted }}>Estación Centro Norte · Turno Mañana</Text>
            </Group>
          </Box>
        </Group>
      </Box>

      {/* Tarjetas resumen */}
      <SimpleGrid cols={2} spacing="sm" mb="lg">
        {[
          { label: "Presentes",   count: presenteCount,  ...statusConfig.presente },
          { label: "En jornada",  count: enJornadaCount, ...statusConfig.en_jornada },
        ].map((stat) => (
          <Card key={stat.label} radius="lg" p="md" style={{ border: `1px solid ${stat.border}`, background: stat.bg }}>
            <Group gap="sm">
              <ThemeIcon radius="md" size="lg" style={{ background: stat.dot + "22", color: stat.dot, border: `1px solid ${stat.dot}33` }}>
                <stat.icon size={17} />
              </ThemeIcon>
              <Box>
                <Text style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</Text>
                <Text style={{ fontSize: 22, fontWeight: 700, color: stat.dot, lineHeight: 1 }}>{stat.count}</Text>
              </Box>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      {/* Lista de operarios */}
      <Card withBorder radius="lg" shadow="sm" p={0} style={{ borderColor: C.cardBorder, background: C.cardBg }}>
        <Box style={{ padding: "14px 20px", borderBottom: `1px solid ${C.divider}`, background: C.cardHeaderBg }}>
          <Group gap="sm">
            <Activity size={16} color={C.info.color} />
            <Text style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>Registros del día · {workersConRegistro.length} operarios</Text>
          </Group>
        </Box>

        <ScrollArea style={{ maxHeight: 520 }}>
          <Stack gap={0} p="sm">
            {workersConRegistro.map((worker, i) => {
              const status = getStatus(worker);
              const cfg    = statusConfig[status];

              return (
                <Box key={worker.id}>
                  {i > 0 && <Divider color={C.divider} />}
                  <WorkerRow worker={worker} cfg={cfg} C={C} />
                </Box>
              );
            })}
          </Stack>
        </ScrollArea>
      </Card>

      {/* Bottom action bar - floating */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 100 }}>
        {/* Removed button */}
      </div>

      {/* Modal Incorporación Inesperada */}
      <Modal
        opened={fabOpened}
        onClose={closeFab}
        title={
          <Group gap="xs">
            <Plus size={17} color={C.info.color} />
            <Text fw={600} style={{ color: C.textPrimary }}>Incorporación Inesperada</Text>
          </Group>
        }
        centered
        radius="lg"
        styles={{
          content: { background: C.cardBg, border: `1px solid ${C.cardBorder}` },
          header:  { background: C.cardBg, borderBottom: `1px solid ${C.divider}` },
        }}
      >
        <Stack gap="md">
          <Text style={{ fontSize: 13, color: C.textMuted }}>
            Registre un operario de reemplazo fuera de la cuadrilla original. Se marcará el ingreso en el momento actual.
          </Text>
          <input
            placeholder="Nombre del operario o número de legajo"
            value={newWorkerName}
            onChange={(e) => setNewWorkerName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleIncorporacion()}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 8,
              border: `1px solid ${C.inputBorder}`, fontSize: 14,
              color: C.inputColor, background: C.inputBg, outline: "none",
            }}
          />
          <Group justify="flex-end">
            <Button variant="subtle" color="gray" onClick={closeFab}>Cancelar</Button>
            <Button leftSection={<Plus size={15} />} onClick={handleIncorporacion} color="blue">
              Incorporar a la jornada
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}