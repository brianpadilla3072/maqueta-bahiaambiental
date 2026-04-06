import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, Badge, Group, Stack, Avatar, Button, Text, Modal, Textarea, Select } from "@mantine/core";
import { ArrowLeft, MapPin, Check, X, Clock } from "lucide-react";
import { useAppColors } from "../../hooks/useAppColors";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";

interface Estacion {
  id: number;
  nombre: string;
  estado: "activa" | "inactiva";
}

interface Solicitud {
  id: number;
  estacion: string;
  mensaje: string;
  fecha: string;
  estado: "pendiente";
}

const empleadosMock = [
  { 
    id: 1, 
    nombre: "Carlos Mendoza", 
    rol: "Supervisor", 
    avatar: "CM",
    estaciones: [
      { id: 1, nombre: "Centro Norte", estado: "activa" as const },
      { id: 2, nombre: "Zona Industrial Este", estado: "activa" as const },
    ],
    solicitudes: [
      { id: 1, estacion: "Zona Sur", mensaje: "Necesito supervisar la nueva obra en construcción", fecha: "2026-04-02", estado: "pendiente" as const },
    ]
  },
  { 
    id: 2, 
    nombre: "Ana Torres", 
    rol: "Supervisor", 
    avatar: "AT",
    estaciones: [
      { id: 3, nombre: "Centro Oeste", estado: "activa" as const },
    ],
    solicitudes: []
  },
  { 
    id: 3, 
    nombre: "Luis Ramírez", 
    rol: "Supervisor", 
    avatar: "LR",
    estaciones: [
      { id: 4, nombre: "Parque Industrial", estado: "activa" as const },
      { id: 5, nombre: "Zona Franca", estado: "activa" as const },
      { id: 6, nombre: "Puerto Comercial", estado: "inactiva" as const },
    ],
    solicitudes: [
      { id: 2, estacion: "Centro Sur", mensaje: "Expandir cobertura de supervisión al centro sur", fecha: "2026-04-01", estado: "pendiente" as const },
      { id: 3, estacion: "Zona Norte", mensaje: "Necesito acceso temporal por 2 semanas", fecha: "2026-04-03", estado: "pendiente" as const },
    ]
  },
  { 
    id: 4, 
    nombre: "María Gonzalez", 
    rol: "Supervisor", 
    avatar: "MG",
    estaciones: [
      { id: 7, nombre: "Centro Norte", estado: "activa" as const },
    ],
    solicitudes: []
  },
  { 
    id: 5, 
    nombre: "Pedro Silva", 
    rol: "Supervisor", 
    avatar: "PS",
    estaciones: [
      { id: 8, nombre: "Zona Industrial Este", estado: "activa" as const },
      { id: 9, nombre: "Centro Oeste", estado: "activa" as const },
    ],
    solicitudes: [
      { id: 4, estacion: "Parque Industrial", mensaje: "Requiero acceso para auditoría interna", fecha: "2026-04-02", estado: "pendiente" as const },
    ]
  },
];

const todasLasEstaciones = [
  { value: "centro-norte", label: "Centro Norte" },
  { value: "zona-industrial-este", label: "Zona Industrial Este" },
  { value: "centro-oeste", label: "Centro Oeste" },
  { value: "parque-industrial", label: "Parque Industrial" },
  { value: "zona-franca", label: "Zona Franca" },
  { value: "puerto-comercial", label: "Puerto Comercial" },
  { value: "zona-sur", label: "Zona Sur" },
  { value: "centro-sur", label: "Centro Sur" },
  { value: "zona-norte", label: "Zona Norte" },
];

export function AdminEstacionesDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const C = useAppColors();

  const empleado = empleadosMock.find((e) => e.id === Number(id));
  const [estaciones, setEstaciones] = useState<Estacion[]>(empleado?.estaciones || []);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>(empleado?.solicitudes || []);

  const [asignarOpened, { open: openAsignar, close: closeAsignar }] = useDisclosure(false);
  const [estacionSeleccionada, setEstacionSeleccionada] = useState<string | null>(null);
  const [notaAsignacion, setNotaAsignacion] = useState("");

  if (!empleado) {
    return (
      <div>
        <Text style={{ color: C.textMuted }}>Empleado no encontrado</Text>
      </div>
    );
  }

  const handleAprobarSolicitud = (solicitudId: number) => {
    const solicitud = solicitudes.find((s) => s.id === solicitudId);
    if (!solicitud) return;

    // Agregar la estación a la lista de estaciones activas
    const nuevaEstacion: Estacion = {
      id: Date.now(),
      nombre: solicitud.estacion,
      estado: "activa",
    };
    setEstaciones([...estaciones, nuevaEstacion]);

    // Remover la solicitud
    setSolicitudes(solicitudes.filter((s) => s.id !== solicitudId));

    notifications.show({
      title: "Solicitud aprobada",
      message: `Se ha asignado la estación ${solicitud.estacion} a ${empleado.nombre}.`,
      color: "blue",
    });
  };

  const handleRechazarSolicitud = (solicitudId: number) => {
    const solicitud = solicitudes.find((s) => s.id === solicitudId);
    setSolicitudes(solicitudes.filter((s) => s.id !== solicitudId));

    notifications.show({
      title: "Solicitud rechazada",
      message: `Se ha rechazado la solicitud de ${solicitud?.estacion}.`,
      color: "orange",
    });
  };

  const handleAsignarEstacion = () => {
    if (!estacionSeleccionada) {
      notifications.show({
        title: "Estación requerida",
        message: "Debe seleccionar una estación para asignar.",
        color: "orange",
      });
      return;
    }

    const estacionLabel = todasLasEstaciones.find((e) => e.value === estacionSeleccionada)?.label;
    const nuevaEstacion: Estacion = {
      id: Date.now(),
      nombre: estacionLabel || "",
      estado: "activa",
    };
    setEstaciones([...estaciones, nuevaEstacion]);

    notifications.show({
      title: "Estación asignada",
      message: `Se ha asignado la estación ${estacionLabel} a ${empleado.nombre}.`,
      color: "blue",
    });

    setEstacionSeleccionada(null);
    setNotaAsignacion("");
    closeAsignar();
  };

  const handleToggleEstado = (estacionId: number) => {
    setEstaciones(
      estaciones.map((e) =>
        e.id === estacionId
          ? { ...e, estado: e.estado === "activa" ? "inactiva" : "activa" }
          : e
      )
    );
  };

  return (
    <div>
      <Stack gap="lg">
        {/* Header */}
        <div>
          <Button
            variant="subtle"
            color="gray"
            leftSection={<ArrowLeft size={16} />}
            onClick={() => navigate("/admin/estaciones")}
            mb="md"
            size="sm"
          >
            Volver a la lista
          </Button>

          <Group gap="md" mb="xs">
            <Avatar color="blue" radius="xl" size="xl">
              {empleado.avatar}
            </Avatar>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: C.textPrimary, margin: 0 }}>
                {empleado.nombre}
              </h1>
              <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>
                {empleado.rol}
              </p>
            </div>
          </Group>
        </div>

        {/* Solicitudes pendientes */}
        {solicitudes.length > 0 && (
          <div>
            <Group gap="xs" mb="sm">
              <Clock size={18} color="#fb923c" />
              <h2 style={{ fontSize: 18, fontWeight: 600, color: C.textPrimary, margin: 0 }}>
                Solicitudes Pendientes
              </h2>
              <Badge color="orange" size="sm" variant="light" radius="sm">
                {solicitudes.length}
              </Badge>
            </Group>

            <Stack gap="sm">
              {solicitudes.map((solicitud) => (
                <Card
                  key={solicitud.id}
                  withBorder
                  radius="md"
                  p="md"
                  style={{ borderColor: C.cardBorder, background: C.cardBg }}
                >
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Group gap="xs">
                        <MapPin size={16} color="#fb923c" />
                        <Text fw={600} style={{ fontSize: 15, color: C.textPrimary }}>
                          {solicitud.estacion}
                        </Text>
                      </Group>
                      <Text style={{ fontSize: 12, color: C.textMuted }}>
                        {new Date(solicitud.fecha).toLocaleDateString("es-AR")}
                      </Text>
                    </Group>

                    <Text style={{ fontSize: 14, color: C.textSecondary }}>
                      {solicitud.mensaje}
                    </Text>

                    <Group gap="sm" justify="flex-end">
                      <Button
                        variant="light"
                        color="red"
                        size="sm"
                        leftSection={<X size={14} />}
                        onClick={() => handleRechazarSolicitud(solicitud.id)}
                      >
                        Rechazar
                      </Button>
                      <Button
                        color="blue"
                        size="sm"
                        leftSection={<Check size={14} />}
                        onClick={() => handleAprobarSolicitud(solicitud.id)}
                      >
                        Aprobar
                      </Button>
                    </Group>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </div>
        )}

        {/* Estaciones asignadas */}
        <div>
          <Group justify="space-between" mb="sm">
            <Group gap="xs">
              <MapPin size={18} color="#2563eb" />
              <h2 style={{ fontSize: 18, fontWeight: 600, color: C.textPrimary, margin: 0 }}>
                Estaciones Asignadas
              </h2>
              <Badge color="blue" size="sm" variant="light" radius="sm">
                {estaciones.length}
              </Badge>
            </Group>
            <Button color="blue" size="sm" onClick={openAsignar}>
              Asignar nueva estación
            </Button>
          </Group>

          <Stack gap="sm">
            {estaciones.map((estacion) => (
              <Card
                key={estacion.id}
                withBorder
                radius="md"
                p="md"
                style={{
                  borderColor: estacion.estado === "activa" ? "#2563eb" : C.cardBorder,
                  background: estacion.estado === "activa" ? "rgba(16,185,129,0.05)" : C.cardBg,
                }}
              >
                <Group justify="space-between">
                  <Group gap="xs">
                    <MapPin size={16} color={estacion.estado === "activa" ? "#2563eb" : C.textMuted} />
                    <Text fw={600} style={{ fontSize: 15, color: C.textPrimary }}>
                      {estacion.nombre}
                    </Text>
                  </Group>
                  <Group gap="sm">
                    <Badge
                      color={estacion.estado === "activa" ? "blue" : "gray"}
                      size="sm"
                      variant="light"
                      radius="sm"
                    >
                      {estacion.estado === "activa" ? "Activa" : "Inactiva"}
                    </Badge>
                    <Button
                      variant="subtle"
                      color={estacion.estado === "activa" ? "orange" : "blue"}
                      size="xs"
                      onClick={() => handleToggleEstado(estacion.id)}
                    >
                      {estacion.estado === "activa" ? "Desactivar" : "Activar"}
                    </Button>
                  </Group>
                </Group>
              </Card>
            ))}
          </Stack>

          {estaciones.length === 0 && (
            <Card withBorder p="xl" style={{ borderColor: C.cardBorder, background: C.cardBg }}>
              <Text ta="center" style={{ color: C.textMuted }}>
                No hay estaciones asignadas a este supervisor.
              </Text>
            </Card>
          )}
        </div>
      </Stack>

      {/* Modal asignar estación */}
      <Modal
        opened={asignarOpened}
        onClose={closeAsignar}
        title={
          <Group gap="xs">
            <MapPin size={17} color="#2563eb" />
            <Text fw={600} style={{ color: C.textPrimary }}>
              Asignar nueva estación
            </Text>
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
            Selecciona una estación para asignar a {empleado.nombre}.
          </Text>

          <Select
            label="Estación"
            placeholder="Selecciona una estación"
            value={estacionSeleccionada}
            onChange={setEstacionSeleccionada}
            data={todasLasEstaciones}
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

          <Textarea
            label="Nota (opcional)"
            placeholder="Agrega una nota sobre esta asignación..."
            value={notaAsignacion}
            onChange={(e) => setNotaAsignacion(e.target.value)}
            minRows={3}
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
            <Button variant="subtle" color="gray" onClick={closeAsignar}>
              Cancelar
            </Button>
            <Button color="blue" onClick={handleAsignarEstacion}>
              Asignar estación
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
