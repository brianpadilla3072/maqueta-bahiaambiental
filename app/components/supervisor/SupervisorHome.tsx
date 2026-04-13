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
  Badge,
  Textarea,
  Select,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Play, Users, MapPin, Clock, AlertCircle, AlertTriangle, UserPlus, Search, Plus, Camera, CheckCircle2, Edit3 } from "lucide-react";
import { useAppColors } from "../../hooks/useAppColors";

const ALL_WORKERS = [
  { id: 1,  name: "Carlos Mendez",   legajo: "OP-1042", categoria: "Peón",    licencia: null as string | null },
  { id: 2,  name: "Ana Rodríguez",   legajo: "OP-2318", categoria: "Chofer",  licencia: null as string | null },
  { id: 3,  name: "Luis García",     legajo: "OP-0987", categoria: "Peón",    licencia: "Enfermedad" },
  { id: 4,  name: "María López",     legajo: "OP-1563", categoria: "Oficial", licencia: null as string | null },
  { id: 5,  name: "Roberto Silva",   legajo: "OP-2041", categoria: "Peón",    licencia: null as string | null },
  { id: 6,  name: "Sandra Flores",   legajo: "OP-3102", categoria: "Chofer",  licencia: "Vacaciones" },
  { id: 7,  name: "Diego Herrera",   legajo: "OP-4201", categoria: "Oficial", licencia: null as string | null },
  { id: 8,  name: "Lucía Martínez",  legajo: "OP-1890", categoria: "Peón",    licencia: null as string | null },
  { id: 9,  name: "Fabián Torres",   legajo: "OP-2750", categoria: "Chofer",  licencia: null as string | null },
  { id: 10, name: "Valeria Gómez",   legajo: "OP-3381", categoria: "Peón",    licencia: "RT" },
  { id: 11, name: "Martín Acosta",   legajo: "OP-0612", categoria: "Oficial", licencia: null as string | null },
  { id: 12, name: "Cecilia Ramos",   legajo: "OP-4490", categoria: "Peón",    licencia: null as string | null },
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
  const [confirmCapture, setConfirmCapture] = useState<typeof ALL_WORKERS[0] | null>(null);
  const [licenciaObs, setLicenciaObs] = useState("");
  // Face fail modal
  const [faceFailWorker, setFaceFailWorker] = useState<typeof ALL_WORKERS[0] | null>(null);
  const [manualObs, setManualObs] = useState("Falla de reconocimiento facial");
  const [manualReason, setManualReason] = useState<string | null>("Falla de cara");
  // Track observations per worker
  const [observations, setObservations] = useState<Record<number, string>>({});

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
    const worker = workers.find((w) => w.id === id);
    if (worker) setConfirmCapture(worker);
  };

  const confirmBiometricCapture = () => {
    if (!confirmCapture) return;
    const worker = confirmCapture;
    const id = worker.id;
    const obs = worker.licencia ? licenciaObs : "";

    setConfirmCapture(null);
    setLicenciaObs("");
    setCapturing(id);

    // Simulate: ~30% chance face detection fails
    const faceFails = Math.random() < 0.3;

    setTimeout(() => {
      setCapturing(null);
      if (faceFails) {
        // Face detection failed - open manual registration modal
        setFaceFailWorker(worker);
        setManualObs("Falla de reconocimiento facial");
        setManualReason("Falla de cara");
      } else {
        // Success
        setRegistered((prev) => new Set([...prev, id]));
        if (obs) setObservations((prev) => ({ ...prev, [id]: obs }));
        notifications.show({
          title: "Registro biométrico OK",
          message: `${worker.name} verificado correctamente.${obs ? ` Obs: ${obs}` : ""}`,
          color: "teal",
        });
      }
    }, 1400);
  };

  const handleManualRegister = () => {
    if (!faceFailWorker || !manualReason) return;
    const id = faceFailWorker.id;
    const fullObs = `${manualReason}: ${manualObs}`;
    setRegistered((prev) => new Set([...prev, id]));
    setObservations((prev) => ({ ...prev, [id]: fullObs }));
    notifications.show({
      title: "Registro manual completado",
      message: `${faceFailWorker.name} registrado con observación: ${manualReason}`,
      color: "yellow",
    });
    setFaceFailWorker(null);
    setManualObs("");
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
                const hasObs = observations[worker.id];
                const isManual = hasObs?.startsWith("Falla de cara");
                return (
                  <Box
                    key={worker.id}
                    style={{
                      border:       `1px solid ${isRegistered ? (isManual ? (C.dark ? "rgba(217,119,6,0.45)" : "#fde68a") : (C.dark ? "rgba(20,184,166,0.45)" : "#99f6e4")) : C.border}`,
                      borderRadius: 10,
                      padding:      "12px 14px",
                      background:   isRegistered ? (isManual ? (C.dark ? "rgba(217,119,6,0.08)" : "#fffbeb") : (C.dark ? "rgba(20,184,166,0.08)" : "#f0fdf9")) : C.cardHeaderBg,
                      transition:   "border-color 0.2s, background 0.2s",
                    }}
                  >
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                        <Avatar
                          color={isRegistered ? (isManual ? "yellow" : "teal") : "blue"}
                          radius="xl"
                          size="md"
                          style={{
                            background: isRegistered
                              ? (isManual ? (C.dark ? "#78350f" : "#fef3c7") : (C.dark ? "#134e4a" : "#ccfbf1"))
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
                          <Group gap={4} align="center">
                            <Text style={{ fontSize: 12, color: C.textMuted }}>
                              {worker.legajo} · {worker.categoria}
                            </Text>
                            {worker.licencia && (
                              <Badge size="xs" color="yellow" variant="light">{worker.licencia}</Badge>
                            )}
                            {hasObs && (
                              <Tooltip label={hasObs} multiline w={220}>
                                <Badge size="xs" color={isManual ? "orange" : "blue"} variant="light" leftSection={<Edit3 size={8} />}>
                                  {isManual ? "Manual" : "Obs."}
                                </Badge>
                              </Tooltip>
                            )}
                          </Group>
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
                          color={isRegistered ? (isManual ? "yellow" : "teal") : jornadaActiva ? "blue" : "gray"}
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
                            ? (isManual ? <AlertTriangle size={17} /> : <CheckCircle2 size={17} />)
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

      {/* ── Modal confirmación biométrica ──────────────────────────── */}
      <Modal
        opened={confirmCapture !== null}
        onClose={() => setConfirmCapture(null)}
        title={
          <Group gap="sm">
            <Camera size={18} color="#3b82f6" />
            <Text style={{ fontWeight: 700, fontSize: 15, color: C.textPrimary }}>Confirmar registro</Text>
          </Group>
        }
        size="sm"
        centered
        radius="lg"
        styles={{
          content: { background: C.cardBg, border: `1px solid ${C.cardBorder}` },
          header:  { background: C.cardBg, borderBottom: `1px solid ${C.divider}` },
        }}
      >
        {confirmCapture && (
          <Stack gap="md" p="xs">
            <Group gap="md">
              <Avatar color="blue" radius="xl" size="lg" style={{ background: C.dark ? "#1e3a5f" : "#dbeafe" }}>
                {confirmCapture.name.split(" ").map((n) => n[0]).join("")}
              </Avatar>
              <Box>
                <Text style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary }}>{confirmCapture.name}</Text>
                <Text style={{ fontSize: 12, color: C.textMuted }}>{confirmCapture.legajo} · {confirmCapture.categoria}</Text>
                {confirmCapture.licencia && (
                  <Badge size="sm" color="yellow" variant="light" mt={4}>{confirmCapture.licencia}</Badge>
                )}
              </Box>
            </Group>
            {confirmCapture.licencia ? (
              <Alert color="yellow" variant="light" radius="md" icon={<AlertTriangle size={14} />} style={{ fontSize: 13 }}>
                Este operario tiene licencia por <strong>{confirmCapture.licencia}</strong>. Se registrará con observación.
              </Alert>
            ) : (
              <Alert color="blue" variant="light" radius="md" style={{ fontSize: 13 }}>
                El operario será verificado mediante reconocimiento facial. Asegúrese de que esté frente al dispositivo.
              </Alert>
            )}
            {confirmCapture.licencia && (
              <Textarea
                label="Observación"
                placeholder="Detalle el motivo del registro con licencia activa..."
                value={licenciaObs}
                onChange={(e) => setLicenciaObs(e.currentTarget.value)}
                minRows={2}
                size="sm"
                required
              />
            )}
            <Group justify="flex-end" gap="xs">
              <Button variant="default" size="sm" onClick={() => { setConfirmCapture(null); setLicenciaObs(""); }}>Cancelar</Button>
              <Button
                color={confirmCapture.licencia ? "yellow" : "blue"}
                size="sm"
                leftSection={<Camera size={14} />}
                onClick={confirmBiometricCapture}
                disabled={!!confirmCapture.licencia && !licenciaObs.trim()}
              >
                {confirmCapture.licencia ? "Registrar con observación" : "Iniciar captura"}
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* ── Modal falla de reconocimiento facial ──────────────────── */}
      <Modal
        opened={faceFailWorker !== null}
        onClose={() => setFaceFailWorker(null)}
        title={
          <Group gap="sm">
            <AlertTriangle size={18} color="#d97706" />
            <Text style={{ fontWeight: 700, fontSize: 15, color: C.textPrimary }}>Falla de reconocimiento</Text>
          </Group>
        }
        size="md"
        centered
        radius="lg"
        styles={{
          content: { background: C.cardBg, border: `1px solid ${C.cardBorder}` },
          header:  { background: C.cardBg, borderBottom: `1px solid ${C.divider}` },
        }}
      >
        {faceFailWorker && (
          <Stack gap="md" p="xs">
            <Group gap="md">
              <Avatar color="orange" radius="xl" size="lg" style={{ background: C.dark ? "#78350f" : "#fef3c7" }}>
                {faceFailWorker.name.split(" ").map((n) => n[0]).join("")}
              </Avatar>
              <Box>
                <Text style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary }}>{faceFailWorker.name}</Text>
                <Text style={{ fontSize: 12, color: C.textMuted }}>{faceFailWorker.legajo} · {faceFailWorker.categoria}</Text>
              </Box>
            </Group>
            <Alert color="orange" variant="light" radius="md" icon={<AlertTriangle size={14} />} style={{ fontSize: 13 }}>
              No se pudo verificar el rostro del operario. Puede registrarlo manualmente con una observación obligatoria.
            </Alert>
            <Select
              label="Motivo"
              data={["Falla de cara", "Dispositivo sin respuesta", "Rostro no reconocido", "Error de red"]}
              value={manualReason}
              onChange={setManualReason}
              size="sm"
              required
            />
            <Textarea
              label="Observación adicional"
              placeholder="Detalle la situación..."
              value={manualObs}
              onChange={(e) => setManualObs(e.currentTarget.value)}
              minRows={2}
              size="sm"
            />
            <Group justify="flex-end" gap="xs">
              <Button variant="default" size="sm" onClick={() => setFaceFailWorker(null)}>Cancelar</Button>
              <Button color="yellow" size="sm" leftSection={<Edit3 size={14} />} onClick={handleManualRegister} disabled={!manualReason}>
                Registrar manualmente
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}