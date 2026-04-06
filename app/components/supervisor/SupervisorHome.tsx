import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Avatar,
  SimpleGrid,
  Alert,
  ThemeIcon,
  Paper,
  Modal,
  TextInput,
  ScrollArea,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Play, Users, MapPin, Clock, AlertCircle, UserPlus, Search, Plus, Camera, CheckCircle2 } from "lucide-react";
import { useAppColors } from "../../hooks/useAppColors";

const ALL_WORKERS = [
  { id: 1,  name: "Carlos Mendez",   legajo: "OP-1042", categoria: "Peón" },
  { id: 2,  name: "Ana Rodríguez",   legajo: "OP-2318", categoria: "Chofer" },
  { id: 3,  name: "Luis García",     legajo: "OP-0987", categoria: "Peón" },
  { id: 4,  name: "María López",     legajo: "OP-1563", categoria: "Oficial" },
  { id: 5,  name: "Roberto Silva",   legajo: "OP-2041", categoria: "Peón" },
  { id: 6,  name: "Sandra Flores",   legajo: "OP-3102", categoria: "Chofer" },
  { id: 7,  name: "Diego Herrera",   legajo: "OP-4201", categoria: "Oficial" },
  { id: 8,  name: "Lucía Martínez",  legajo: "OP-1890", categoria: "Peón" },
  { id: 9,  name: "Fabián Torres",   legajo: "OP-2750", categoria: "Chofer" },
  { id: 10, name: "Valeria Gómez",   legajo: "OP-3381", categoria: "Peón" },
  { id: 11, name: "Martín Acosta",   legajo: "OP-0612", categoria: "Oficial" },
  { id: 12, name: "Cecilia Ramos",   legajo: "OP-4490", categoria: "Peón" },
];

export function SupervisorHome() {
  const C        = useAppColors();

  const [opening,    setOpening]    = useState(false);
  const [workers,    setWorkers]    = useState(ALL_WORKERS.slice(0, 6));
  const [modalOpen,  setModalOpen]  = useState(false);
  const [search,     setSearch]     = useState("");
  const [registered, setRegistered] = useState<Set<number>>(new Set());
  const [capturing,  setCapturing]  = useState<number | null>(null);
  const [jornadaActiva, setJornadaActiva] = useState(false);

  /* ── Acciones ──────────────────────────────────────────────────── */
  const handleOpenJornada = () => {
    if (workers.length === 0) {
      notifications.show({ title: "Cuadrilla vacía", message: "Agregue al menos un operario.", color: "orange" });
      return;
    }
    setOpening(true);
    setTimeout(() => {
      notifications.show({ title: "Jornada abierta", message: `Sistema habilitado con ${workers.length} operarios. Ya puede tomar el registro biométrico.`, color: "teal" });
      setOpening(false);
      setJornadaActiva(true);
    }, 1200);
  };

  const handleAddWorker = (id: number) => {
    const worker = ALL_WORKERS.find((w) => w.id === id);
    if (!worker) return;
    setWorkers((prev) => [...prev, worker]);
    notifications.show({ title: "Operario agregado", message: `${worker.name} fue incorporado a la cuadrilla.`, color: "teal" });
  };

  const handleCapture = (id: number) => {
    if (capturing !== null || !jornadaActiva) return;
    setCapturing(id);
    setTimeout(() => {
      setRegistered((prev) => new Set([...prev, id]));
      setCapturing(null);
      const worker = workers.find((w) => w.id === id);
      notifications.show({
        title: "Registro biométrico OK",
        message: `${worker?.name} verificado correctamente.`,
        color: "teal",
      });
    }, 1400);
  };

  /* trabajadores que aún NO están en la cuadrilla y coinciden con búsqueda */
  const inIds = new Set(workers.map((w) => w.id));
  const results = ALL_WORKERS.filter(
    (w) =>
      !inIds.has(w.id) &&
      (w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.legajo.toLowerCase().includes(search.toLowerCase()))
  );

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <Box>
      {/* Encabezado */}
      <Box mb="xl">
        <Group justify="space-between" wrap="wrap">
          <Box>
            <Text style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>
              Apertura de Jornada
            </Text>
            <Group gap="xs">
              <MapPin size={14} color={C.textMuted} />
              <Text style={{ fontSize: 13, color: C.textMuted }}>Estación Centro Norte · Turno Mañana</Text>
            </Group>
          </Box>

          {/* Botón Iniciar Conteo */}
          <Paper
            component="button"
            withBorder
            p="xs"
            radius="md"
            onClick={handleOpenJornada}
            style={{
              borderColor: workers.length > 0 && !jornadaActiva ? "#3b82f6" : jornadaActiva ? (C.dark ? "rgba(20,184,166,0.5)" : "#5eead4") : C.border,
              background:  workers.length > 0 && !jornadaActiva ? "rgba(59,130,246,0.10)" : jornadaActiva ? (C.dark ? "rgba(20,184,166,0.12)" : "#f0fdf9") : C.cardBg,
              cursor:      jornadaActiva ? "default" : workers.length > 0 ? "pointer" : "not-allowed",
              opacity:     workers.length === 0 ? 0.5 : 1,
              transition:  "all 0.15s ease",
              outline:     "none",
            }}
          >
            <Group gap="sm">
              {opening
                ? <Clock size={15} color="#3b82f6" style={{ animation: "spin 1s linear infinite" }} />
                : jornadaActiva
                  ? <CheckCircle2 size={15} color={C.dark ? "#2dd4bf" : "#0d9488"} />
                  : <Play size={15} color="#3b82f6" fill="#3b82f6" />}
              <Text style={{ fontSize: 14, fontWeight: 600, color: jornadaActiva ? (C.dark ? "#2dd4bf" : "#0d9488") : "#3b82f6" }}>
                {opening ? "Iniciando…" : jornadaActiva ? "En curso" : "Iniciar registro"}
              </Text>
            </Group>
          </Paper>
        </Group>
      </Box>

      <Stack gap="lg">
        <Alert
          icon={<AlertCircle size={16} />}
          color="blue"
          variant="light"
          radius="md"
          styles={{
            root:    { border: `1px solid ${C.info.border}`, background: C.info.bg },
            title:   { color: C.info.text, fontWeight: 600 },
            message: { color: C.info.text },
          }}
          title="Cuadrilla sugerida por el sistema"
        >
          La nómina fue generada automáticamente. Puede agregar operarios antes de habilitar el sistema biométrico.
        </Alert>

        {/* Card cuadrilla */}
        <Card withBorder radius="lg" shadow="sm" p={0} style={{ borderColor: C.cardBorder, background: C.cardBg }}>
          <Box style={{ padding: "16px 20px", borderBottom: `1px solid ${C.divider}`, background: C.cardHeaderBg }}>
            <Group justify="space-between">
              <Group gap="sm">
                <ThemeIcon color="blue" variant="light" size="lg" radius="md">
                  <Users size={18} />
                </ThemeIcon>
                <Box>
                  <Text style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>Cuadrilla del Día</Text>
                  <Text style={{ fontSize: 12, color: C.textMuted }}>{workers.length} operarios en cuadrilla</Text>
                </Box>
              </Group>
              <Button
                size="xs"
                variant="light"
                color="blue"
                leftSection={<UserPlus size={13} />}
                onClick={() => { setSearch(""); setModalOpen(true); }}
                style={{ fontSize: 12, fontWeight: 600 }}
              >
                Agregar operario
              </Button>
            </Group>
          </Box>

          <Box p="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              {workers.map((worker) => {
                const isRegistered = registered.has(worker.id);
                const isCapturing  = capturing === worker.id;
                return (
                  <Box
                    key={worker.id}
                    style={{
                      border:       `1px solid ${isRegistered ? (C.dark ? "rgba(20,184,166,0.45)" : "#99f6e4") : C.border}`,
                      borderRadius: 10,
                      padding:      "12px 14px",
                      background:   isRegistered ? (C.dark ? "rgba(20,184,166,0.08)" : "#f0fdf9") : C.cardHeaderBg,
                      transition:   "border-color 0.2s, background 0.2s",
                    }}
                  >
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                        <Avatar
                          color={isRegistered ? "teal" : "blue"}
                          radius="xl"
                          size="md"
                          style={{
                            background: isRegistered
                              ? (C.dark ? "#134e4a" : "#ccfbf1")
                              : (C.dark ? "#1e3a5f" : "#dbeafe"),
                            flexShrink: 0,
                          }}
                        >
                          {worker.name.split(" ").map((n) => n[0]).join("")}
                        </Avatar>
                        <Box style={{ minWidth: 0 }}>
                          <Text style={{ fontSize: 13.5, fontWeight: 600, color: C.textPrimary, lineHeight: 1.3 }}>
                            {worker.name}
                          </Text>
                          <Text style={{ fontSize: 12, color: C.textMuted }}>
                            {worker.legajo} · {worker.categoria}
                          </Text>
                        </Box>
                      </Group>

                      <Tooltip
                        label={
                          isRegistered
                            ? "Registro completado"
                            : !jornadaActiva
                            ? "Inicie el conteo primero"
                            : "Tomar registro biométrico"
                        }
                        position="left"
                        withArrow
                      >
                        <ActionIcon
                          variant={isRegistered ? "light" : jornadaActiva ? "filled" : "light"}
                          color={isRegistered ? "teal" : jornadaActiva ? "blue" : "gray"}
                          size="lg"
                          radius="xl"
                          onClick={() => jornadaActiva && !isRegistered && handleCapture(worker.id)}
                          loading={isCapturing}
                          disabled={!jornadaActiva || isRegistered}
                          style={{
                            flexShrink: 0,
                            cursor: !jornadaActiva || isRegistered ? "not-allowed" : "pointer",
                            opacity: !jornadaActiva ? 0.4 : 1,
                          }}
                        >
                          {isRegistered
                            ? <CheckCircle2 size={17} />
                            : <Camera size={17} />}
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>
        </Card>
      </Stack>

      {/* ── Modal búsqueda ─────────────────────────────────────────── */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          <Group gap="sm">
            <UserPlus size={18} color="#3b82f6" />
            <Text style={{ fontWeight: 700, fontSize: 15, color: C.textPrimary }}>Agregar operario</Text>
          </Group>
        }
        size="md"
        centered
        radius="lg"
        styles={{
          content: { background: C.cardBg,    border: `1px solid ${C.cardBorder}` },
          header:  { background: C.cardBg,    borderBottom: `1px solid ${C.divider}` },
          body:    { padding: "16px" },
        }}
      >
        <TextInput
          placeholder="Buscar por nombre o legajo…"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          leftSection={<Search size={15} />}
          radius="md"
          mb="sm"
          styles={{
            input: { background: C.mainBg, borderColor: C.border, color: C.textPrimary },
          }}
        />

        <ScrollArea h={340} scrollbarSize={6}>
          {results.length === 0 ? (
            <Box style={{ padding: "32px 0", textAlign: "center" }}>
              <Text style={{ fontSize: 13, color: C.textMuted }}>
                {search ? "Sin resultados para esa búsqueda" : "Todos los operarios ya están en la cuadrilla"}
              </Text>
            </Box>
          ) : (
            <Stack gap="xs">
              {results.map((worker) => (
                <Box
                  key={worker.id}
                  style={{
                    border:       `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding:      "10px 14px",
                    background:   C.cardHeaderBg,
                  }}
                >
                  <Group justify="space-between" wrap="nowrap">
                    <Group gap="sm" wrap="nowrap">
                      <Avatar
                        color="blue"
                        radius="xl"
                        size="sm"
                        style={{ background: C.dark ? "#1e3a5f" : "#dbeafe", flexShrink: 0 }}
                      >
                        {worker.name.split(" ").map((n) => n[0]).join("")}
                      </Avatar>
                      <Box>
                        <Text style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, lineHeight: 1.3 }}>
                          {worker.name}
                        </Text>
                        <Text style={{ fontSize: 11, color: C.textMuted }}>
                          {worker.legajo} · {worker.categoria}
                        </Text>
                      </Box>
                    </Group>
                    <Button
                      size="xs"
                      variant="light"
                      color="blue"
                      leftSection={<Plus size={12} />}
                      onClick={() => { handleAddWorker(worker.id); setModalOpen(false); }}
                      style={{ flexShrink: 0, fontWeight: 600 }}
                    >
                      Agregar
                    </Button>
                  </Group>
                </Box>
              ))}
            </Stack>
          )}
        </ScrollArea>
      </Modal>
    </Box>
  );
}