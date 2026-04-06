import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, TextInput, Badge, Group, Stack, Avatar, ActionIcon, Text } from "@mantine/core";
import { Search, ChevronRight, MapPin } from "lucide-react";
import { useAppColors } from "../../hooks/useAppColors";

interface Empleado {
  id: number;
  nombre: string;
  rol: string;
  estacionesActivas: number;
  solicitudesPendientes: number;
  avatar: string;
}

const empleadosMock: Empleado[] = [
  { id: 1, nombre: "Carlos Mendoza", rol: "Supervisor", estacionesActivas: 2, solicitudesPendientes: 1, avatar: "CM" },
  { id: 2, nombre: "Ana Torres", rol: "Supervisor", estacionesActivas: 1, solicitudesPendientes: 0, avatar: "AT" },
  { id: 3, nombre: "Luis Ramírez", rol: "Supervisor", estacionesActivas: 3, solicitudesPendientes: 2, avatar: "LR" },
  { id: 4, nombre: "María Gonzalez", rol: "Supervisor", estacionesActivas: 1, solicitudesPendientes: 0, avatar: "MG" },
  { id: 5, nombre: "Pedro Silva", rol: "Supervisor", estacionesActivas: 2, solicitudesPendientes: 1, avatar: "PS" },
];

export function AdminEstaciones() {
  const C = useAppColors();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmpleados = empleadosMock.filter((emp) =>
    emp.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Stack gap="lg">
        {/* Header */}
        <div>
          <Group gap="xs" mb="xs">
            <MapPin size={22} color="#2563eb" />
            <h1 style={{ fontSize: 24, fontWeight: 700, color: C.textPrimary, margin: 0 }}>
              Gestión de Estaciones
            </h1>
          </Group>
          <p style={{ color: C.textMuted, fontSize: 14, margin: 0 }}>
            Administra las estaciones asignadas y solicitudes de acceso de cada supervisor.
          </p>
        </div>

        {/* Search */}
        <TextInput
          placeholder="Buscar supervisor..."
          leftSection={<Search size={16} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          styles={{
            input: {
              background: C.inputBg,
              borderColor: C.inputBorder,
              color: C.inputColor,
            },
          }}
          style={{ maxWidth: 400 }}
        />

        {/* Lista de empleados */}
        <Stack gap="sm">
          {filteredEmpleados.map((empleado) => (
            <Card
              key={empleado.id}
              withBorder
              radius="md"
              p="md"
              style={{
                borderColor: C.cardBorder,
                background: C.cardBg,
                cursor: "pointer",
                transition: "all 150ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.cardBorder;
                e.currentTarget.style.transform = "translateY(0)";
              }}
              onClick={() => navigate(`/admin/estaciones/${empleado.id}`)}
            >
              <Group justify="space-between" wrap="nowrap">
                <Group gap="md">
                  <Avatar color="blue" radius="xl" size="lg">
                    {empleado.avatar}
                  </Avatar>
                  <div>
                    <Text fw={600} style={{ fontSize: 15, color: C.textPrimary }}>
                      {empleado.nombre}
                    </Text>
                    <Text style={{ fontSize: 13, color: C.textMuted }}>
                      {empleado.rol}
                    </Text>
                  </div>
                </Group>

                <Group gap="md">
                  <Group gap="sm">
                    <div style={{ textAlign: "right" }}>
                      <Text style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>
                        Estaciones activas
                      </Text>
                      <Badge color="blue" size="lg" variant="light" radius="sm">
                        {empleado.estacionesActivas}
                      </Badge>
                    </div>
                    
                    {empleado.solicitudesPendientes > 0 && (
                      <div style={{ textAlign: "right" }}>
                        <Text style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>
                          Solicitudes
                        </Text>
                        <Badge color="orange" size="lg" variant="light" radius="sm">
                          {empleado.solicitudesPendientes}
                        </Badge>
                      </div>
                    )}
                  </Group>

                  <ActionIcon variant="subtle" color="gray" size="lg">
                    <ChevronRight size={18} />
                  </ActionIcon>
                </Group>
              </Group>
            </Card>
          ))}
        </Stack>

        {filteredEmpleados.length === 0 && (
          <Card withBorder p="xl" style={{ borderColor: C.cardBorder, background: C.cardBg }}>
            <Text ta="center" style={{ color: C.textMuted }}>
              No se encontraron supervisores que coincidan con la búsqueda.
            </Text>
          </Card>
        )}
      </Stack>
    </div>
  );
}
