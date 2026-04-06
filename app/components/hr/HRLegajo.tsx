import { useNavigate } from "react-router";
import {
  Box,
  Avatar,
  Badge,
  Card,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Timeline,
  Progress,
  Table,
  RingProgress,
  Button,
} from "@mantine/core";
import { LineChart } from "@mantine/charts";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  MinusCircle,
  FileText,
  Activity,
  MessageSquare,
  TrendingUp,
  ArrowLeft,
  Building2,
  IdCard,
  User,
} from "lucide-react";
import { useAppColors } from "../../hooks/useAppColors";

const EMPLOYEE = {
  id: 1, name: "Luis García", legajo: "OP-0987", dni: "28.341.992",
  categoria: "Peón", funcion: "Barrendero", estacion: "Centro Norte",
  estado: "Activo", ingreso: "14/03/2019", foto: "LG",
};

const MARCACIONES = [
  { id: 1, fecha: "02/04/2026", entrada: "07:31", salida: "15:00", estado: "tardanza", horas: 7.48 },
  { id: 2, fecha: "01/04/2026", entrada: "07:02", salida: "15:03", estado: "normal", horas: 8.02 },
  { id: 3, fecha: "31/03/2026", entrada: "07:00", salida: "15:01", estado: "normal", horas: 8.01 },
  { id: 4, fecha: "28/03/2026", entrada: "07:45", salida: "15:00", estado: "tardanza", horas: 7.25 },
  { id: 5, fecha: "27/03/2026", entrada: "07:05", salida: "15:00", estado: "normal", horas: 7.92 },
];

const AUSENCIAS = [
  { id: 1, fecha: "10/03/2026", tipo: "Enfermedad", dias: 2, estado: "justificada" },
  { id: 2, fecha: "14/02/2026", tipo: "Licencia", dias: 1, estado: "justificada" },
  { id: 3, fecha: "15/01/2026", tipo: "Sin justificar", dias: 1, estado: "pendiente" },
];

const OBSERVACIONES = [
  { id: 1, fecha: "02/04/2026", supervisor: "Sup. M. Castillo", texto: "Tardanza de 31 minutos — Tráfico en zona. Llegó por sus medios.", tipo: "tardanza" },
  { id: 2, fecha: "28/03/2026", supervisor: "Sup. M. Castillo", texto: "Tardanza de 45 minutos — Problema de transporte público.", tipo: "tardanza" },
  { id: 3, fecha: "15/01/2026", supervisor: "Sup. R. Díaz", texto: "Ausencia sin aviso. No se pudo contactar al empleado.", tipo: "ausente" },
];

const TREND_DATA = [
  { mes: "Oct", asistencia: 95 }, { mes: "Nov", asistencia: 92 }, { mes: "Dic", asistencia: 88 },
  { mes: "Ene", asistencia: 91 }, { mes: "Feb", asistencia: 94 }, { mes: "Mar", asistencia: 87 },
];

export function HRLegajo() {
  const navigate = useNavigate();
  const C = useAppColors();

  const TH = {
    fontSize: 11, fontWeight: 700 as const, color: C.textMuted,
    textTransform: "uppercase" as const, letterSpacing: "0.05em",
  };

  return (
    <Box>
      <Stack gap="xl">
        <Group gap="sm">
          <Button variant="subtle" color="gray" leftSection={<ArrowLeft size={15} />} onClick={() => navigate("/rrhh/legajo")} size="sm" style={{ color: C.textMuted }}>
            Volver al Legajo
          </Button>
        </Group>

        {/* Profile Header */}
        <Card withBorder radius="lg" shadow="sm" p="xl" style={{ borderColor: C.cardBorder, background: C.cardBg }}>
          <Group justify="space-between" wrap="wrap" gap="xl">
            <Group gap="xl">
              <Avatar size={80} radius="xl" style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed)", fontSize: 26, fontWeight: 700, color: "white", flexShrink: 0 }}>
                {EMPLOYEE.foto}
              </Avatar>
              <Box>
                <Group gap="sm" mb={6}>
                  <Text style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary }}>{EMPLOYEE.name}</Text>
                  <Badge color="teal" variant="light" size="sm" radius="sm" style={{ fontWeight: 600 }}>{EMPLOYEE.estado}</Badge>
                </Group>
                <Group gap="md" mb={8} wrap="wrap">
                  {[
                    { Icon: IdCard, label: `Legajo: ${EMPLOYEE.legajo}` },
                    { Icon: User, label: `DNI: ${EMPLOYEE.dni}` },
                    { Icon: Building2, label: EMPLOYEE.estacion },
                  ].map(({ Icon, label }) => (
                    <Group key={label} gap={5}>
                      <Icon size={13} color={C.textSubtle} />
                      <Text style={{ fontSize: 13, color: C.textMuted }}>{label}</Text>
                    </Group>
                  ))}
                </Group>
                <Group gap={6}>
                  {[EMPLOYEE.categoria, EMPLOYEE.funcion].map((b) => (
                    <Badge key={b} variant="light" color="gray" size="sm" radius="sm">{b}</Badge>
                  ))}
                  <Badge variant="light" color="blue" size="sm" radius="sm">Desde {EMPLOYEE.ingreso}</Badge>
                </Group>
              </Box>
            </Group>

            <SimpleGrid cols={3} spacing="md">
              {[
                { label: "Asistencia", value: "87%", sub: "marzo 2026", color: C.warning.color },
                { label: "Tardanzas", value: "4", sub: "este mes", color: C.danger.color },
                { label: "Observaciones", value: "3", sub: "activas", color: C.violet.color },
              ].map((stat) => (
                <Box key={stat.label} style={{ textAlign: "center", padding: "12px 16px", background: C.cardHeaderBg, borderRadius: 10, border: `1px solid ${C.border}` }}>
                  <Text style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</Text>
                  <Text style={{ fontSize: 20, fontWeight: 800, color: stat.color }}>{stat.value}</Text>
                  <Text style={{ fontSize: 11, color: C.textSubtle }}>{stat.sub}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Group>
        </Card>

        {/* Summary cards */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <Card withBorder radius="lg" p="md" style={{ borderColor: C.cardBorder, background: C.cardBg }}>
            <Group gap="md">
              <RingProgress size={68} thickness={7} sections={[{ value: 87, color: "yellow" }]}
                label={<Text ta="center" style={{ fontSize: 12, fontWeight: 700, color: C.textPrimary }}>87%</Text>}
              />
              <Box>
                <Text style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>Asistencia Marzo</Text>
                <Text style={{ fontSize: 12, color: C.textMuted }}>19 de 22 días hábiles</Text>
                <Progress value={87} color="yellow" size="xs" mt={6} radius="xl" />
              </Box>
            </Group>
          </Card>
          <Card withBorder radius="lg" p="md" style={{ borderColor: C.cardBorder, background: C.cardBg }}>
            <Group gap="md">
              <ThemeIcon size="xl" radius="md" style={{ background: C.danger.bg, color: C.danger.color, border: `1px solid ${C.danger.border}` }}>
                <Clock size={22} />
              </ThemeIcon>
              <Box>
                <Text style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>Tardanzas</Text>
                <Text style={{ fontSize: 12, color: C.textMuted }}>4 este mes</Text>
                <Text style={{ fontSize: 15, fontWeight: 700, color: C.danger.color, marginTop: 2 }}>+148 min acumulados</Text>
              </Box>
            </Group>
          </Card>
          <Card withBorder radius="lg" p="md" style={{ borderColor: C.cardBorder, background: C.cardBg }}>
            <Group gap="md">
              <ThemeIcon size="xl" radius="md" style={{ background: C.info.bg, color: C.info.color, border: `1px solid ${C.info.border}` }}>
                <TrendingUp size={22} />
              </ThemeIcon>
              <Box>
                <Text style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>Horas Trabajadas</Text>
                <Text style={{ fontSize: 12, color: C.textMuted }}>Marzo 2026</Text>
                <Text style={{ fontSize: 15, fontWeight: 700, color: C.info.color, marginTop: 2 }}>151.4 hs</Text>
              </Box>
            </Group>
          </Card>
        </SimpleGrid>

        {/* Chart */}
        <Card withBorder radius="lg" shadow="sm" p="lg" style={{ borderColor: C.cardBorder, background: C.cardBg }}>
          <Group justify="space-between" mb="md">
            <Box>
              <Text style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>Tendencia de asistencia</Text>
              <Text style={{ fontSize: 12, color: C.textMuted }}>Últimos 6 meses</Text>
            </Box>
            <Badge color="violet" variant="light" size="sm">Oct 2025 – Mar 2026</Badge>
          </Group>
          <LineChart h={160} data={TREND_DATA} dataKey="mes"
            series={[{ name: "asistencia", color: "violet.5", label: "Asistencia %" }]}
            curveType="monotone" gridAxis="y" tickLine="y"
          />
        </Card>

        {/* Tabs */}
        <Card withBorder radius="lg" shadow="sm" p={0} style={{ borderColor: C.cardBorder, background: C.cardBg }}>
          <Tabs defaultValue="marcaciones">
            <Tabs.List px="md" pt="sm" style={{ borderBottom: `1px solid ${C.divider}` }}>
              <Tabs.Tab value="marcaciones" leftSection={<Clock size={13} />} style={{ fontSize: 13 }}>Marcaciones</Tabs.Tab>
              <Tabs.Tab value="ausencias" leftSection={<MinusCircle size={13} />} style={{ fontSize: 13 }}>Ausencias</Tabs.Tab>
              <Tabs.Tab value="observaciones" leftSection={<MessageSquare size={13} />} style={{ fontSize: 13 }}>Observaciones ({OBSERVACIONES.length})</Tabs.Tab>
              <Tabs.Tab value="timeline" leftSection={<Activity size={13} />} style={{ fontSize: 13 }}>Línea de Tiempo</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="marcaciones" p="md">
              <Table.ScrollContainer minWidth={500}>
                <Table verticalSpacing="sm" horizontalSpacing="md">
                  <Table.Thead>
                    <Table.Tr style={{ background: C.cardHeaderBg }}>
                      {["Fecha", "Entrada", "Salida", "Horas", "Estado"].map((h) => <Table.Th key={h} style={TH}>{h}</Table.Th>)}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {MARCACIONES.map((m) => (
                      <Table.Tr key={m.id} style={{ borderBottom: `1px solid ${C.divider}` }}>
                        <Table.Td><Text style={{ fontSize: 13, color: C.textSecondary }}>{m.fecha}</Text></Table.Td>
                        <Table.Td>
                          <Badge color={m.estado === "normal" ? "teal" : "yellow"} variant="light" size="sm" radius="sm" style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{m.entrada}</Badge>
                        </Table.Td>
                        <Table.Td>
                          <Badge color="blue" variant="light" size="sm" radius="sm" style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{m.salida}</Badge>
                        </Table.Td>
                        <Table.Td><Text style={{ fontSize: 13, color: C.textSecondary, fontWeight: 500 }}>{m.horas}h</Text></Table.Td>
                        <Table.Td>
                          <Badge color={m.estado === "normal" ? "teal" : "yellow"} variant="light" size="sm" radius="sm" style={{ fontWeight: 600 }}>{m.estado}</Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Tabs.Panel>

            <Tabs.Panel value="ausencias" p="md">
              <Table.ScrollContainer minWidth={400}>
                <Table verticalSpacing="sm" horizontalSpacing="md">
                  <Table.Thead>
                    <Table.Tr style={{ background: C.cardHeaderBg }}>
                      {["Fecha", "Motivo", "Días", "Estado"].map((h) => <Table.Th key={h} style={TH}>{h}</Table.Th>)}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {AUSENCIAS.map((a) => (
                      <Table.Tr key={a.id} style={{ borderBottom: `1px solid ${C.divider}` }}>
                        <Table.Td><Text style={{ fontSize: 13, color: C.textSecondary }}>{a.fecha}</Text></Table.Td>
                        <Table.Td><Text style={{ fontSize: 13, color: C.textSecondary }}>{a.tipo}</Text></Table.Td>
                        <Table.Td><Badge variant="light" color="blue" size="sm" radius="sm" style={{ fontWeight: 600 }}>{a.dias}d</Badge></Table.Td>
                        <Table.Td>
                          <Badge color={a.estado === "justificada" ? "teal" : "yellow"} variant="light" size="sm" radius="sm" style={{ fontWeight: 600 }}>{a.estado}</Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Tabs.Panel>

            <Tabs.Panel value="observaciones" p="md">
              <Stack gap="sm">
                {OBSERVACIONES.map((obs) => {
                  const isAus = obs.tipo === "ausente";
                  const borderColor = isAus ? C.danger.color : C.warning.color;
                  const bg = isAus ? C.danger.bg : C.warning.bg;
                  const border = isAus ? C.danger.border : C.warning.border;
                  return (
                    <Box key={obs.id} style={{ border: `1px solid ${border}`, borderLeft: `3px solid ${borderColor}`, borderRadius: 10, padding: "14px 16px", background: bg }}>
                      <Group justify="space-between" mb={8}>
                        <Badge
                          color={isAus ? "orange" : "yellow"}
                          variant="light" size="sm" radius="sm"
                          leftSection={isAus ? <MinusCircle size={11} /> : <AlertTriangle size={11} />}
                          style={{ fontWeight: 600 }}
                        >
                          {obs.tipo}
                        </Badge>
                        <Group gap="xs">
                          <Text style={{ fontSize: 11.5, color: C.textMuted }}>{obs.fecha}</Text>
                          <Text style={{ fontSize: 11.5, color: C.textSubtle }}>·</Text>
                          <Text style={{ fontSize: 11.5, color: C.textMuted, fontWeight: 500 }}>{obs.supervisor}</Text>
                        </Group>
                      </Group>
                      <Text style={{ fontSize: 13.5, color: C.textSecondary, lineHeight: 1.5 }}>{obs.texto}</Text>
                    </Box>
                  );
                })}
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="timeline" p="md">
              <Timeline active={2} bulletSize={28} lineWidth={2} color="violet">
                <Timeline.Item bullet={<AlertTriangle size={13} />} title="Tardanza registrada" color="yellow">
                  <Text style={{ fontSize: 12, color: C.textMuted }}>02/04/2026 · 07:31 hs</Text>
                  <Text style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>Tardanza de 31 minutos. Observación registrada por Sup. M. Castillo.</Text>
                </Timeline.Item>
                <Timeline.Item bullet={<CheckCircle size={13} />} title="Asistencia normal" color="teal">
                  <Text style={{ fontSize: 12, color: C.textMuted }}>01/04/2026 · 07:02 hs</Text>
                  <Text style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>Entrada y salida en horario. Sin novedades.</Text>
                </Timeline.Item>
                <Timeline.Item bullet={<FileText size={13} />} title="Justificación cargada" color="blue">
                  <Text style={{ fontSize: 12, color: C.textMuted }}>10/03/2026</Text>
                  <Text style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>Enfermedad — 2 días. Cargada por analista RRHH.</Text>
                </Timeline.Item>
                <Timeline.Item bullet={<MinusCircle size={13} />} title="Ausencia sin justificar" color="orange">
                  <Text style={{ fontSize: 12, color: C.textMuted }}>15/01/2026</Text>
                  <Text style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>Ausencia no notificada. Pendiente de resolución.</Text>
                </Timeline.Item>
              </Timeline>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Stack>
    </Box>
  );
}