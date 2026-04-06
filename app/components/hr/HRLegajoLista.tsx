import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Box, Card, Text, TextInput, Group, Avatar, Badge, Table, Stack, Select,
} from "@mantine/core";
import { Search, ChevronRight, Building2, Filter } from "lucide-react";
import { useAppColors } from "../../hooks/useAppColors";

const OPERARIOS = [
  { id: 1, name: "Luis García", legajo: "OP-0987", dni: "28.341.992", categoria: "Peón", funcion: "Barrendero", estacion: "Centro Norte", estado: "Activo", asistencia: 87, foto: "LG" },
  { id: 2, name: "María López", legajo: "OP-1023", dni: "31.442.118", categoria: "Oficial", funcion: "Conductora", estacion: "Centro Sur", estado: "Activo", asistencia: 94, foto: "ML" },
  { id: 3, name: "Carlos Ruiz", legajo: "OP-0754", dni: "26.987.443", categoria: "Peón", funcion: "Recolector", estacion: "Centro Norte", estado: "Activo", asistencia: 91, foto: "CR" },
  { id: 4, name: "Ana Fernández", legajo: "OP-1100", dni: "33.112.667", categoria: "Oficial", funcion: "Operadora", estacion: "Zona Oeste", estado: "Licencia", asistencia: 78, foto: "AF" },
  { id: 5, name: "Jorge Mendoza", legajo: "OP-0812", dni: "27.554.321", categoria: "Peón", funcion: "Barrendero", estacion: "Centro Sur", estado: "Activo", asistencia: 96, foto: "JM" },
  { id: 6, name: "Patricia Sosa", legajo: "OP-0945", dni: "30.223.998", categoria: "Oficial", funcion: "Conductora", estacion: "Zona Norte", estado: "Activo", asistencia: 89, foto: "PS" },
  { id: 7, name: "Roberto Díaz", legajo: "OP-0633", dni: "25.876.112", categoria: "Peón", funcion: "Recolector", estacion: "Zona Oeste", estado: "Suspendido", asistencia: 62, foto: "RD" },
  { id: 8, name: "Silvia Martínez", legajo: "OP-1201", dni: "34.667.445", categoria: "Peón", funcion: "Barrendera", estacion: "Centro Norte", estado: "Activo", asistencia: 93, foto: "SM" },
  { id: 9, name: "Diego Herrera", legajo: "OP-0889", dni: "29.778.332", categoria: "Oficial", funcion: "Operador", estacion: "Zona Norte", estado: "Activo", asistencia: 85, foto: "DH" },
  { id: 10, name: "Laura Vega", legajo: "OP-1055", dni: "32.445.776", categoria: "Peón", funcion: "Recolectora", estacion: "Centro Sur", estado: "Activo", asistencia: 90, foto: "LV" },
];

const ESTACIONES = ["Todas", "Centro Norte", "Centro Sur", "Zona Oeste", "Zona Norte"];
const ESTADOS = ["Todos", "Activo", "Licencia", "Suspendido"];

export function HRLegajoLista() {
  const navigate = useNavigate();
  const C = useAppColors();
  const [search, setSearch] = useState("");
  const [estacion, setEstacion] = useState<string | null>("Todas");
  const [estado, setEstado] = useState<string | null>("Todos");

  const filtered = OPERARIOS.filter((op) => {
    const matchSearch = !search || op.name.toLowerCase().includes(search.toLowerCase()) || op.legajo.toLowerCase().includes(search.toLowerCase()) || op.dni.includes(search);
    const matchEstacion = !estacion || estacion === "Todas" || op.estacion === estacion;
    const matchEstado = !estado || estado === "Todos" || op.estado === estado;
    return matchSearch && matchEstacion && matchEstado;
  });

  const estadoColor = (e: string) => e === "Activo" ? "teal" : e === "Licencia" ? "blue" : "orange";
  const asistColor = (v: number) => v >= 90 ? "teal" : v >= 80 ? "yellow" : "orange";

  const TH = {
    fontSize: 11, fontWeight: 700 as const, color: C.textMuted,
    textTransform: "uppercase" as const, letterSpacing: "0.05em",
  };

  return (
    <Box>
      <Stack gap="lg">
        {/* Header */}
        <Box>
          <Text style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary }}>Legajo de Operarios</Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>
            {OPERARIOS.length} operarios registrados · Seleccioná uno para ver su ficha completa
          </Text>
        </Box>

        {/* Filters */}
        <Card withBorder radius="lg" p="md" style={{ borderColor: C.cardBorder, background: C.cardBg }}>
          <Group gap="md" wrap="wrap">
            <TextInput
              placeholder="Buscar por nombre, legajo o DNI..."
              leftSection={<Search size={14} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              style={{ flex: 1, minWidth: 220 }}
              styles={{ input: { background: C.inputBg, borderColor: C.inputBorder, color: C.inputColor } }}
            />
            <Select
              data={ESTACIONES}
              value={estacion}
              onChange={setEstacion}
              leftSection={<Building2 size={14} />}
              placeholder="Estación"
              style={{ width: 180 }}
              styles={{ input: { background: C.inputBg, borderColor: C.inputBorder, color: C.inputColor } }}
            />
            <Select
              data={ESTADOS}
              value={estado}
              onChange={setEstado}
              leftSection={<Filter size={14} />}
              placeholder="Estado"
              style={{ width: 160 }}
              styles={{ input: { background: C.inputBg, borderColor: C.inputBorder, color: C.inputColor } }}
            />
          </Group>
        </Card>

        {/* Results count */}
        <Text style={{ fontSize: 12, color: C.textMuted }}>
          Mostrando {filtered.length} de {OPERARIOS.length} operarios
        </Text>

        {/* Table */}
        <Card withBorder radius="lg" shadow="sm" p={0} style={{ borderColor: C.cardBorder, background: C.cardBg }}>
          <Table.ScrollContainer minWidth={700}>
            <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
              <Table.Thead>
                <Table.Tr style={{ background: C.cardHeaderBg }}>
                  <Table.Th style={TH}>Operario</Table.Th>
                  <Table.Th style={TH}>Legajo</Table.Th>
                  <Table.Th style={TH}>Estación</Table.Th>
                  <Table.Th style={TH}>Categoría</Table.Th>
                  <Table.Th style={TH}>Estado</Table.Th>
                  <Table.Th style={TH}>Asistencia</Table.Th>
                  <Table.Th style={{ ...TH, width: 40 }}></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filtered.map((op) => (
                  <Table.Tr
                    key={op.id}
                    onClick={() => navigate(`/rrhh/legajo/${op.id}`)}
                    style={{ cursor: "pointer", borderBottom: `1px solid ${C.divider}` }}
                  >
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar size={34} radius="xl" style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)", fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0 }}>
                          {op.foto}
                        </Avatar>
                        <Box>
                          <Text style={{ fontSize: 13.5, fontWeight: 600, color: C.textPrimary }}>{op.name}</Text>
                          <Text style={{ fontSize: 11.5, color: C.textMuted }}>{op.funcion} · DNI {op.dni}</Text>
                        </Box>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="violet" size="sm" radius="sm" style={{ fontWeight: 600 }}>{op.legajo}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text style={{ fontSize: 13, color: C.textSecondary }}>{op.estacion}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="gray" size="sm" radius="sm">{op.categoria}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={estadoColor(op.estado)} size="sm" radius="sm" style={{ fontWeight: 600 }}>{op.estado}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={asistColor(op.asistencia)} size="sm" radius="sm" style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{op.asistencia}%</Badge>
                    </Table.Td>
                    <Table.Td>
                      <ChevronRight size={14} color={C.textSubtle} />
                    </Table.Td>
                  </Table.Tr>
                ))}
                {filtered.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={7}>
                      <Text ta="center" py="xl" style={{ fontSize: 13, color: C.textMuted }}>
                        No se encontraron operarios con los filtros aplicados
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>
      </Stack>
    </Box>
  );
}
