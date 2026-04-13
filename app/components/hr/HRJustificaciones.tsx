import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Select,
  Alert,
  SimpleGrid,
  Badge,
  ThemeIcon,
  Divider,
  Table,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { CheckCircle, FileText, Calendar, User, AlertCircle, Clock, Save } from "lucide-react";
import dayjs from "dayjs";
import { useAppColors } from "../../hooks/useAppColors";

const EMPLOYEES = [
  { value: "1", label: "Carlos Mendez — OP-1042" },
  { value: "2", label: "Ana Rodríguez — OP-2318" },
  { value: "3", label: "Luis García — OP-0987" },
  { value: "4", label: "María López — OP-1563" },
  { value: "5", label: "Roberto Silva — OP-2041" },
  { value: "6", label: "Sandra Flores — OP-3102" },
  { value: "7", label: "Diana Torres — OP-3456" },
];

const JUSTIFICATION_TYPES = [
  { value: "vacaciones", label: "Vacaciones" },
  { value: "enfermedad", label: "Enfermedad / Certificado médico" },
  { value: "licencia", label: "Licencia ordinaria" },
  { value: "accidente_rt", label: "Accidente de Trabajo / RT" },
  { value: "gremial", label: "Salida gremial" },
  { value: "duelo", label: "Licencia por duelo" },
  { value: "maternidad", label: "Maternidad / Paternidad" },
];

const RECENT_JUSTIFICATIONS = [
  { id: 1, employee: "Luis García", legajo: "OP-0987", tipo: "Enfermedad", desde: "01/04/2026", hasta: "03/04/2026", dias: 3, estado: "aprobado" },
  { id: 2, employee: "Roberto Silva", legajo: "OP-2041", tipo: "Vacaciones", desde: "28/03/2026", hasta: "31/03/2026", dias: 4, estado: "aprobado" },
  { id: 3, employee: "Diana Torres", legajo: "OP-3456", tipo: "Licencia", desde: "02/04/2026", hasta: "02/04/2026", dias: 1, estado: "pendiente" },
];

export function HRJustificaciones() {
  const C = useAppColors();
  const [employee, setEmployee] = useState<string | null>(null);
  const [justType, setJustType] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const inputStyles = {
    label: { fontSize: 13, fontWeight: 500, color: C.textLabel, marginBottom: 5 },
    input: { background: C.inputBg, borderColor: C.inputBorder, color: C.inputColor },
  };

  const handleSave = () => {
    if (!employee || !justType || !dateRange[0] || !dateRange[1]) {
      notifications.show({ title: "Campos incompletos", message: "Complete todos los campos antes de continuar.", color: "orange" });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      notifications.show({ title: "Justificación registrada", message: "Sincronizado con el sistema DAZ.", color: "teal", icon: <CheckCircle size={16} /> });
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const handleClear = () => {
    setEmployee(null);
    setJustType(null);
    setDateRange([null, null]);
    setSaved(false);
  };

  const diasSeleccionados = dateRange[0] && dateRange[1]
    ? dayjs(dateRange[1]).diff(dayjs(dateRange[0]), "day") + 1
    : 0;

  const TH = { fontSize: 11, fontWeight: 700 as const, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.05em" };

  return (
    <Box>
      <Stack gap="xl">
        <Box>
          <Text style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>Carga de Justificaciones</Text>
          <Text style={{ fontSize: 13, color: C.textMuted }}>
            Asigne justificaciones de ausencia. Los datos se sincronizan automáticamente con el sistema DAZ.
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
          {/* FORM */}
          <Card withBorder radius="lg" shadow="sm" p={0} style={{ borderColor: C.cardBorder, background: C.cardBg }}>
            <Box style={{ padding: "16px 20px", borderBottom: `1px solid ${C.divider}`, background: C.cardHeaderBg }}>
              <Group gap="sm">
                <ThemeIcon size="md" radius="md" style={{ background: C.violet.bg, color: C.violet.color, border: `1px solid ${C.violet.border}` }}>
                  <FileText size={15} />
                </ThemeIcon>
                <Box>
                  <Text style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>Nueva Justificación</Text>
                  <Text style={{ fontSize: 12, color: C.textMuted }}>Formulario de carga</Text>
                </Box>
              </Group>
            </Box>

            <Stack gap="md" p="lg">
              <Select
                label="Empleado"
                placeholder="Buscar por nombre o legajo..."
                data={EMPLOYEES}
                value={employee}
                onChange={setEmployee}
                searchable
                leftSection={<User size={15} color={C.textSubtle} />}
                styles={inputStyles}
              />
              <DatePickerInput
                type="range"
                label="Período de ausencia"
                placeholder="Seleccionar rango de fechas"
                value={dateRange}
                onChange={setDateRange}
                leftSection={<Calendar size={15} color={C.textSubtle} />}
                locale="es"
                styles={inputStyles}
              />

              {diasSeleccionados > 0 && (
                <Box style={{ background: C.info.bg, border: `1px solid ${C.info.border}`, borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                  <Clock size={15} color={C.info.color} />
                  <Text style={{ fontSize: 13, color: C.info.text }}>
                    <strong>{diasSeleccionados} día(s)</strong> seleccionados en el período
                  </Text>
                </Box>
              )}

              <Select
                label="Tipo de justificación"
                placeholder="Seleccione el motivo..."
                data={JUSTIFICATION_TYPES}
                value={justType}
                onChange={setJustType}
                styles={inputStyles}
              />

              {saved && (
                <Alert color="teal" variant="light" icon={<CheckCircle size={15} />} title="Guardado correctamente" radius="md">
                  La justificación fue registrada y está disponible en el sistema DAZ.
                </Alert>
              )}

              <Divider color={C.divider} />
              <Group justify="flex-end">
                <Button variant="subtle" color="gray" onClick={handleClear} size="sm">Limpiar campos</Button>
                <Button leftSection={<Save size={15} />} loading={saving} onClick={handleSave} color="violet" size="sm" style={{ fontWeight: 600 }}>
                  Guardar Justificación
                </Button>
              </Group>
            </Stack>
          </Card>

          {/* RECENT */}
          <Card withBorder radius="lg" shadow="sm" p={0} style={{ borderColor: C.cardBorder, background: C.cardBg }}>
            <Box style={{ padding: "16px 20px", borderBottom: `1px solid ${C.divider}`, background: C.cardHeaderBg }}>
              <Group gap="sm">
                <ThemeIcon size="md" radius="md" style={{ background: C.info.bg, color: C.info.color, border: `1px solid ${C.info.border}` }}>
                  <AlertCircle size={15} />
                </ThemeIcon>
                <Box>
                  <Text style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>Justificaciones Recientes</Text>
                  <Text style={{ fontSize: 12, color: C.textMuted }}>Últimas {RECENT_JUSTIFICATIONS.length} cargas registradas</Text>
                </Box>
              </Group>
            </Box>

            <Table.ScrollContainer minWidth={380}>
              <Table verticalSpacing="sm" horizontalSpacing="md">
                <Table.Thead>
                  <Table.Tr style={{ background: C.cardHeaderBg }}>
                    {["Empleado", "Tipo", "Días", "Estado"].map((h) => (
                      <Table.Th key={h} style={TH}>{h}</Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {RECENT_JUSTIFICATIONS.map((j) => (
                    <Table.Tr key={j.id} style={{ borderBottom: `1px solid ${C.divider}` }}>
                      <Table.Td>
                        <Text style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, lineHeight: 1.3 }}>{j.employee}</Text>
                        <Text style={{ fontSize: 11, color: C.textMuted }}>{j.legajo}</Text>
                        <Text style={{ fontSize: 11, color: C.textMuted }}>{j.desde} → {j.hasta}</Text>
                      </Table.Td>
                      <Table.Td><Text style={{ fontSize: 13, color: C.textSecondary }}>{j.tipo}</Text></Table.Td>
                      <Table.Td>
                        <Badge variant="light" color="blue" size="sm" radius="sm" style={{ fontWeight: 600 }}>{j.dias}d</Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={j.estado === "aprobado" ? "teal" : "yellow"} variant="light" size="sm" radius="sm" style={{ fontWeight: 600 }}>
                          {j.estado}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Card>
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
