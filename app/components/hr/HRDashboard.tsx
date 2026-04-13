import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Card,
  Group,
  Stack,
  Text,
  Badge,
  Avatar,
  SimpleGrid,
  Table,
  ActionIcon,
  Tabs,
  ThemeIcon,
  RingProgress,
  Tooltip,
  Divider,
  Paper,
} from "@mantine/core";
import { BarChart } from "@mantine/charts";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Clock,
  CheckCircle,
  Users,
  Eye,
  Bell,
  Calendar,
} from "lucide-react";
import { useAppColors } from "../../hooks/useAppColors";

const CHART_DATA = [
  { dia: "Sem 1", asistencia: 96, tardanzas: 4 },
  { dia: "Sem 2", asistencia: 94, tardanzas: 5 },
  { dia: "Sem 3", asistencia: 92, tardanzas: 6 },
  { dia: "Sem 4", asistencia: 95, tardanzas: 3 },
];

const RECORDS_WITH_OBS = [
  { id: 1, name: "Luis García", legajo: "OP-0987", fecha: "02/04/2026", estado: "tardanza", observacion: "Tardanza 31 min — Tráfico en zona", pendiente: true },
  { id: 2, name: "Roberto Silva", legajo: "OP-2041", fecha: "02/04/2026", estado: "ausente", observacion: "Ausencia no justificada", pendiente: true },
  { id: 3, name: "Diana Torres", legajo: "OP-3456", fecha: "01/04/2026", estado: "tardanza", observacion: "Salida anticipada — Permiso médico", pendiente: true },
  { id: 4, name: "Marcos Vega", legajo: "OP-1129", fecha: "01/04/2026", estado: "ausente", observacion: "Sin novedad registrada", pendiente: false },
];

const NORMAL_RECORDS = [
  { id: 5, name: "Carlos Mendez", legajo: "OP-1042", fecha: "02/04/2026", entrada: "06:58", salida: "15:03" },
  { id: 6, name: "Ana Rodríguez", legajo: "OP-2318", fecha: "02/04/2026", entrada: "07:02", salida: "15:00" },
  { id: 7, name: "María López", legajo: "OP-1563", fecha: "02/04/2026", entrada: "06:55", salida: "15:05" },
  { id: 8, name: "Sandra Flores", legajo: "OP-3102", fecha: "02/04/2026", entrada: "07:05", salida: "15:02" },
  { id: 9, name: "Pedro Alonso", legajo: "OP-4401", fecha: "02/04/2026", entrada: "07:00", salida: "14:58" },
];

const TH_STYLE = (C: ReturnType<typeof useAppColors>) => ({
  fontSize: 11, fontWeight: 700 as const, color: C.textMuted,
  textTransform: "uppercase" as const, letterSpacing: "0.05em",
});

export function HRDashboard() {
  const navigate = useNavigate();
  const C = useAppColors();
  const [activeTab, setActiveTab] = useState<string | null>("prioritarios");

  const kpiData = [
    { label: "Asistencia Promedio", value: "94.2%", sub: "+2.1% vs. mes anterior", trending: "up-good", icon: CheckCircle, ...C.success, ring: 94, ringColor: "teal" },
    { label: "Tardanzas Sistemáticas", value: "12", sub: "−3 vs. mes anterior", trending: "down-good", icon: Clock, ...C.warning, ring: 22, ringColor: "yellow" },
    { label: "Ausencias S/Justificar", value: "7", sub: "+2 vs. mes anterior", trending: "up-bad", icon: AlertCircle, ...C.danger, ring: 14, ringColor: "orange" },
    { label: "Empleados Activos", value: "148", sub: "3 nuevos incorporados", trending: "neutral", icon: Users, ...C.info, ring: 75, ringColor: "blue" },
  ];

  return (
    <Box>
      <Stack gap="xl">
        <Group justify="space-between" wrap="wrap">
          <Box>
            <Text style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>Dashboard RRHH</Text>
            <Text style={{ fontSize: 13, color: C.textMuted }}>
              {new Date().toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </Text>
          </Box>
          <Paper withBorder p="xs" radius="md" style={{ borderColor: C.border, background: C.cardBg }}>
            <Group gap="sm">
              <Calendar size={15} color={C.violet.color} />
              <Text style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary }}>{new Date().toLocaleDateString("es-AR", { month: "long", year: "numeric" }).replace(/^\w/, (c: string) => c.toUpperCase())}</Text>
            </Group>
          </Paper>
        </Group>

        {/* KPI Cards */}
        <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md">
          {kpiData.map((kpi) => (
            <Card key={kpi.label} radius="lg" p="md" style={{ border: `1px solid ${kpi.border}`, background: kpi.bg }}>
              <Group justify="space-between" align="flex-start" mb="sm">
                <ThemeIcon size="lg" radius="md" style={{ background: kpi.color + "18", color: kpi.color, border: `1px solid ${kpi.color}28` }}>
                  <kpi.icon size={18} />
                </ThemeIcon>
                <RingProgress size={52} thickness={5} sections={[{ value: kpi.ring, color: kpi.ringColor }]} />
              </Group>
              <Text style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{kpi.label}</Text>
              <Text style={{ fontSize: 26, fontWeight: 700, color: kpi.color, lineHeight: 1, marginBottom: 6 }}>{kpi.value}</Text>
              <Group gap={4}>
                {kpi.trending === "up-good" && <TrendingUp size={12} color={C.success.color} />}
                {kpi.trending === "up-bad" && <TrendingUp size={12} color={C.danger.color} />}
                {kpi.trending === "down-good" && <TrendingDown size={12} color={C.success.color} />}
                <Text style={{ fontSize: 11.5, color: C.textMuted }}>{kpi.sub}</Text>
              </Group>
            </Card>
          ))}
        </SimpleGrid>

        {/* Chart */}
        <Card withBorder radius="lg" shadow="sm" p="lg" style={{ borderColor: C.cardBorder, background: C.cardBg }}>
          <Group justify="space-between" mb="lg">
            <Box>
              <Text style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>Asistencia mensual</Text>
              <Text style={{ fontSize: 12, color: C.textMuted }}>Mes actual · porcentaje semanal</Text>
            </Box>
            <Badge color="violet" variant="light" size="sm">Abril 2026</Badge>
          </Group>
          <BarChart
            h={200}
            data={CHART_DATA}
            dataKey="dia"
            series={[
              { name: "asistencia", color: "violet.5", label: "Asistencia %" },
              { name: "tardanzas", color: "yellow.5", label: "Tardanzas" },
            ]}
            tickLine="y"
            gridAxis="y"
          />
        </Card>

        {/* Records Table */}
        <Card withBorder radius="lg" shadow="sm" p={0} style={{ borderColor: C.cardBorder, background: C.cardBg }}>
          <Box style={{ padding: "16px 20px", borderBottom: `1px solid ${C.divider}`, background: C.cardHeaderBg }}>
            <Group justify="space-between">
              <Group gap="sm">
                <ThemeIcon size="md" radius="md" style={{ background: C.danger.bg, color: C.danger.color, border: `1px solid ${C.danger.border}` }}>
                  <Bell size={15} />
                </ThemeIcon>
                <Box>
                  <Text style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>Registros del Día</Text>
                  <Text style={{ fontSize: 12, color: C.textMuted }}>Alertas y novedades operativas</Text>
                </Box>
              </Group>
              <Badge color="orange" variant="light" size="sm" style={{ fontWeight: 600 }}>
                {RECORDS_WITH_OBS.filter((r) => r.pendiente).length} pendientes
              </Badge>
            </Group>
          </Box>

          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List px="md" style={{ borderBottom: `1px solid ${C.divider}` }}>
              <Tabs.Tab value="prioritarios" leftSection={<AlertCircle size={13} />} style={{ fontSize: 13 }}>
                Prioritarios ({RECORDS_WITH_OBS.filter((r) => r.pendiente).length})
              </Tabs.Tab>
              <Tabs.Tab value="normales" leftSection={<CheckCircle size={13} />} style={{ fontSize: 13 }}>
                Normales ({NORMAL_RECORDS.length})
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="prioritarios">
              <Table.ScrollContainer minWidth={640}>
                <Table verticalSpacing="sm" horizontalSpacing="md">
                  <Table.Thead>
                    <Table.Tr style={{ background: C.cardHeaderBg }}>
                      {["Empleado", "Fecha", "Estado", "Observación", "Ver"].map((h) => (
                        <Table.Th key={h} style={TH_STYLE(C)}>{h}</Table.Th>
                      ))}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {RECORDS_WITH_OBS.map((rec) => (
                      <Table.Tr key={rec.id} style={{ borderBottom: `1px solid ${C.divider}` }}>
                        <Table.Td>
                          <Group gap="sm">
                            <Avatar size="sm" color="violet" radius="xl">
                              {rec.name.split(" ").map((n) => n[0]).join("")}
                            </Avatar>
                            <Box>
                              <Text style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{rec.name}</Text>
                              <Text style={{ fontSize: 11, color: C.textMuted }}>{rec.legajo}</Text>
                            </Box>
                          </Group>
                        </Table.Td>
                        <Table.Td><Text style={{ fontSize: 13, color: C.textSecondary }}>{rec.fecha}</Text></Table.Td>
                        <Table.Td>
                          <Group gap={6}>
                            <Badge color={rec.estado === "tardanza" ? "yellow" : "orange"} variant="light" size="sm" radius="sm" style={{ fontWeight: 600 }}>
                              {rec.estado}
                            </Badge>
                            {rec.pendiente && <Badge color="orange" variant="dot" size="sm">pendiente</Badge>}
                          </Group>
                        </Table.Td>
                        <Table.Td><Text style={{ fontSize: 12, color: C.textMuted, maxWidth: 220 }}>{rec.observacion}</Text></Table.Td>
                        <Table.Td>
                          <Tooltip label="Ver legajo completo" withArrow>
                            <ActionIcon variant="light" color="violet" size="sm" radius="md" onClick={() => navigate(`/rrhh/legajo/${rec.id}`)}>
                              <Eye size={13} />
                            </ActionIcon>
                          </Tooltip>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Tabs.Panel>

            <Tabs.Panel value="normales">
              <Table.ScrollContainer minWidth={560}>
                <Table verticalSpacing="sm" horizontalSpacing="md">
                  <Table.Thead>
                    <Table.Tr style={{ background: C.cardHeaderBg }}>
                      {["Empleado", "Fecha", "Entrada", "Salida"].map((h) => (
                        <Table.Th key={h} style={TH_STYLE(C)}>{h}</Table.Th>
                      ))}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {NORMAL_RECORDS.map((rec) => (
                      <Table.Tr key={rec.id} style={{ borderBottom: `1px solid ${C.divider}` }}>
                        <Table.Td>
                          <Group gap="sm">
                            <Avatar size="sm" color="teal" radius="xl">
                              {rec.name.split(" ").map((n) => n[0]).join("")}
                            </Avatar>
                            <Box>
                              <Text style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{rec.name}</Text>
                              <Text style={{ fontSize: 11, color: C.textMuted }}>{rec.legajo}</Text>
                            </Box>
                          </Group>
                        </Table.Td>
                        <Table.Td><Text style={{ fontSize: 13, color: C.textSecondary }}>{rec.fecha}</Text></Table.Td>
                        <Table.Td>
                          <Badge color="teal" variant="light" size="sm" radius="sm" style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{rec.entrada}</Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge color="blue" variant="light" size="sm" radius="sm" style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{rec.salida}</Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Stack>
    </Box>
  );
}
