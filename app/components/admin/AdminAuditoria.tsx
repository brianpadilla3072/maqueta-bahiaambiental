import { useState, Fragment } from "react";
import {
  Box, Button, Card, Text, TextInput,
  Badge, Table, Tabs, Select, NumberInput, ThemeIcon,
  Divider, ActionIcon, Tooltip, Alert,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { Shield, Filter, Settings, Clock, User, AlertTriangle, CheckCircle, Eye, Save, ChevronUp } from "lucide-react";
import { useAppColors } from "../../hooks/useAppColors";

const AUDIT_LOGS = [
  { id: 1, usuario: "admin",        accion: "Alta de operario",           fecha: "02/04/2026 09:14:32", detalle: { campo: "Alta de perfil",       valor: "Tomás Acosta — OP-5501",           antes: null,           despues: "activo"          } },
  { id: 2, usuario: "rrhh_ana",     accion: "Carga de justificación",     fecha: "02/04/2026 08:47:11", detalle: { campo: "Justificación",         valor: "Luis García — Enfermedad 2 días",  antes: "Ausente",      despues: "Justificado"     } },
  { id: 3, usuario: "admin",        accion: "Modificación de estación",   fecha: "01/04/2026 16:22:05", detalle: { campo: "Estación",              valor: "Palermo Sur",                      antes: "activo",       despues: "en mantenimiento" } },
  { id: 4, usuario: "sup_castillo", accion: "Registro de observación",    fecha: "02/04/2026 07:35:18", detalle: { campo: "Observación",           valor: "Luis García — Tardanza 31 min",    antes: null,           despues: "Registrado"      } },
  { id: 5, usuario: "admin",        accion: "Sincronización forzada",     fecha: "01/04/2026 14:10:00", detalle: { campo: "Dispositivo",           valor: "FD-004 — Palermo Sur",             antes: "offline",      despues: "syncing"         } },
  { id: 6, usuario: "rrhh_ana",     accion: "Consulta de legajo",         fecha: "01/04/2026 11:05:43", detalle: { campo: "Legajo consultado",     valor: "OP-0987 — Luis García",            antes: null,           despues: "Visualizado"     } },
  { id: 7, usuario: "admin",        accion: "Reinicio de dispositivo",    fecha: "31/03/2026 15:30:22", detalle: { campo: "Dispositivo",           valor: "FD-006 — La Boca",                 antes: "offline",      despues: "online"          } },
];

const ACTION_COLOR: Record<string, { mantine: string; dot: string }> = {
  "Alta de operario":         { mantine: "blue",   dot: "#2563eb" },
  "Carga de justificación":   { mantine: "violet", dot: "#7c3aed" },
  "Modificación de estación": { mantine: "yellow", dot: "#d97706" },
  "Registro de observación":  { mantine: "yellow", dot: "#d97706" },
  "Sincronización forzada":   { mantine: "blue",   dot: "#2563eb" },
  "Consulta de legajo":       { mantine: "gray",   dot: "#64748b" },
  "Reinicio de dispositivo":  { mantine: "orange", dot: "#ea580c" },
};

export function AdminAuditoria() {
  const C = useAppColors();
  const [filterUser,   setFilterUser]   = useState("");
  const [filterAction, setFilterAction] = useState<string | null>(null);
  const [filterDate,   setFilterDate]   = useState<[Date | null, Date | null]>([null, null]);
  const [expandedLog,  setExpandedLog]  = useState<number | null>(null);
  const [tardanzaMin,  setTardanzaMin]  = useState(15);
  const [syncInterval, setSyncInterval] = useState(30);
  const [maxBio,       setMaxBio]       = useState(3000);
  const [savingConfig, setSavingConfig] = useState(false);

  const filteredLogs = AUDIT_LOGS.filter((log) => {
    if (filterUser   && !log.usuario.toLowerCase().includes(filterUser.toLowerCase())) return false;
    if (filterAction && log.accion !== filterAction) return false;
    return true;
  });

  const handleSaveConfig = () => {
    setSavingConfig(true);
    setTimeout(() => {
      setSavingConfig(false);
      notifications.show({ title: "Configuración guardada", message: "Parámetros globales actualizados.", color: "blue" });
    }, 1000);
  };

  const TH = { fontSize: 11, fontWeight: 700 as const, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.05em" };
  const inputStyles = {
    label: { fontSize: 13, fontWeight: 500, color: C.textLabel, marginBottom: 5 },
    input: { background: C.inputBg, borderColor: C.inputBorder, color: C.inputColor },
  };

  return (
    <Box>
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <div>
          <Text style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>Auditoría y Configuración Global</Text>
          <Text style={{ fontSize: 13, color: C.textMuted }}>Trazabilidad completa de acciones del sistema y parámetros operativos</Text>
        </div>

        <Tabs defaultValue="auditoria">
          <Tabs.List style={{ borderBottom: `1px solid ${C.border}` }}>
            <Tabs.Tab key="tab-auditoria"      value="auditoria"      leftSection={<Shield size={14} />}   style={{ fontSize: 13 }}>
              Auditoría · {filteredLogs.length} registros
            </Tabs.Tab>
            <Tabs.Tab key="tab-configuracion"  value="configuracion"  leftSection={<Settings size={14} />} style={{ fontSize: 13 }}>
              Configuración Global
            </Tabs.Tab>
          </Tabs.List>

          {/* AUDITORIA */}
          <Tabs.Panel key="panel-auditoria" value="auditoria" pt="lg">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Filters */}
              <Card withBorder radius="lg" p="md" style={{ borderColor: C.cardBorder, background: C.cardHeaderBg }}>
                <div style={{ display: "flex", alignItems: "flex-end", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <Filter size={14} color={C.textMuted} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary }}>Filtros:</span>
                  </div>
                  <TextInput
                    placeholder="Buscar usuario..." value={filterUser} onChange={(e) => setFilterUser(e.currentTarget.value)}
                    size="xs" leftSection={<User size={12} />} style={{ flex: 1, minWidth: 150 }} styles={inputStyles}
                  />
                  <Select
                    placeholder="Tipo de acción" data={[...new Set(AUDIT_LOGS.map((l) => l.accion))]}
                    value={filterAction} onChange={setFilterAction} clearable size="xs" style={{ minWidth: 200 }} styles={inputStyles}
                  />
                  <DatePickerInput
                    type="range" placeholder="Rango de fechas" value={filterDate} onChange={setFilterDate}
                    size="xs" clearable style={{ minWidth: 200 }} styles={inputStyles}
                  />
                  <Button size="xs" variant="subtle" color="gray" onClick={() => { setFilterUser(""); setFilterAction(null); setFilterDate([null, null]); }}>
                    Limpiar
                  </Button>
                </div>
              </Card>

              {/* Log Table */}
              <Card withBorder radius="lg" shadow="sm" p={0} style={{ borderColor: C.cardBorder, background: C.cardBg }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.divider}`, background: C.cardHeaderBg, display: "flex", alignItems: "center", gap: 10 }}>
                  <Shield size={16} color={C.info.color} />
                  <Text style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>Log de eventos del sistema</Text>
                </div>
                <Table.ScrollContainer minWidth={740}>
                  <Table verticalSpacing="sm" horizontalSpacing="md">
                    <Table.Thead>
                      <Table.Tr style={{ background: C.cardHeaderBg }}>
                        {["Usuario", "Acción", "Fecha / Hora", "Detalle", "Ver"].map((h) => (
                          <Table.Th key={h} style={TH}>{h}</Table.Th>
                        ))}
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {filteredLogs.map((log) => {
                        const ac = ACTION_COLOR[log.accion] ?? { mantine: "gray", dot: "#64748b" };
                        return (
                          <Fragment key={log.id}>
                            <Table.Tr style={{ borderBottom: expandedLog === log.id ? "none" : `1px solid ${C.divider}` }}>
                              {/* Usuario */}
                              <Table.Td>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: ac.dot, flexShrink: 0 }} />
                                  <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, fontFamily: "monospace" }}>{log.usuario}</span>
                                </div>
                              </Table.Td>
                              {/* Acción */}
                              <Table.Td>
                                <Badge color={ac.mantine as any} variant="light" size="sm" radius="sm" style={{ fontWeight: 600, fontSize: 11 }}>
                                  {log.accion}
                                </Badge>
                              </Table.Td>
                              {/* Fecha */}
                              <Table.Td>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <Clock size={12} color={C.textSubtle} />
                                  <span style={{ fontSize: 12, color: C.textMuted, fontVariantNumeric: "tabular-nums" }}>{log.fecha}</span>
                                </div>
                              </Table.Td>
                              {/* Detalle */}
                              <Table.Td>
                                <Text style={{ fontSize: 12, color: C.textMuted, maxWidth: 200 }}>{log.detalle.valor}</Text>
                              </Table.Td>
                              {/* Ver */}
                              <Table.Td>
                                <Tooltip label={expandedLog === log.id ? "Ocultar detalle" : "Ver detalle"} withArrow>
                                  <ActionIcon variant="light" color={expandedLog === log.id ? "gray" : "blue"} size="sm" radius="md"
                                    onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                                  >
                                    {expandedLog === log.id ? <ChevronUp size={13} /> : <Eye size={13} />}
                                  </ActionIcon>
                                </Tooltip>
                              </Table.Td>
                            </Table.Tr>
                            {expandedLog === log.id && (
                              <Table.Tr>
                                <Table.Td colSpan={5} style={{ padding: "0 16px 12px" }}>
                                  <div style={{ background: C.cardHeaderBg, border: `1px solid ${ac.dot}28`, borderLeft: `3px solid ${ac.dot}`, borderRadius: 8, padding: "12px 16px" }}>
                                    <p style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                                      Detalle del Cambio
                                    </p>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                                      <div>
                                        <p style={{ fontSize: 11, color: C.textSubtle, fontWeight: 600, marginBottom: 2 }}>Campo</p>
                                        <p style={{ fontSize: 13, color: C.textPrimary, fontWeight: 600, margin: 0 }}>{log.detalle.campo}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: 11, color: C.textSubtle, fontWeight: 600, marginBottom: 2 }}>Valor Anterior</p>
                                        <p style={{ fontSize: 13, color: log.detalle.antes ? C.danger.color : C.textSubtle, fontWeight: 500, margin: 0 }}>
                                          {log.detalle.antes ?? "— (nuevo registro)"}
                                        </p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: 11, color: C.textSubtle, fontWeight: 600, marginBottom: 2 }}>Valor Nuevo</p>
                                        <p style={{ fontSize: 13, color: C.info.color, fontWeight: 600, margin: 0 }}>{log.detalle.despues}</p>
                                      </div>
                                    </div>
                                  </div>
                                </Table.Td>
                              </Table.Tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              </Card>
            </div>
          </Tabs.Panel>

          {/* CONFIGURACIÓN */}
          <Tabs.Panel key="panel-configuracion" value="configuracion" pt="lg">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Alert color="yellow" variant="light" icon={<AlertTriangle size={14} />} radius="md" style={{ border: `1px solid ${C.warning.border}` }}>
                Los cambios afectan a <strong>todos los supervisores, operarios y dispositivos</strong> del sistema.
              </Alert>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                {/* Asistencia */}
                <Card withBorder radius="lg" shadow="sm" p={0} style={{ borderColor: C.cardBorder, background: C.cardBg }}>
                  <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.divider}`, background: C.cardHeaderBg, display: "flex", alignItems: "center", gap: 10 }}>
                    <ThemeIcon size="md" radius="md" style={{ background: C.warning.bg, color: C.warning.color, border: `1px solid ${C.warning.border}` }}>
                      <Clock size={15} />
                    </ThemeIcon>
                    <Text style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>Parámetros de Asistencia</Text>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 24 }}>
                    <NumberInput
                      label="Umbral de tardanza (minutos)"
                      description="Retraso mínimo para clasificar como tardanza sistemática"
                      min={1} max={60} value={tardanzaMin} onChange={(v) => setTardanzaMin(Number(v))}
                      styles={inputStyles}
                    />
                    <div style={{ background: C.warning.bg, border: `1px solid ${C.warning.border}`, borderRadius: 8, padding: "10px 14px" }}>
                      <Text style={{ fontSize: 12, color: C.warning.text }}>
                        Tardanzas de más de <strong>{tardanzaMin} minutos</strong> disparan observación obligatoria.
                      </Text>
                    </div>
                  </div>
                </Card>

                {/* Dispositivos */}
                <Card withBorder radius="lg" shadow="sm" p={0} style={{ borderColor: C.cardBorder, background: C.cardBg }}>
                  <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.divider}`, background: C.cardHeaderBg, display: "flex", alignItems: "center", gap: 10 }}>
                    <ThemeIcon size="md" radius="md" style={{ background: C.info.bg, color: C.info.color, border: `1px solid ${C.info.border}` }}>
                      <Settings size={15} />
                    </ThemeIcon>
                    <Text style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>Parámetros de Dispositivos</Text>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 24 }}>
                    <NumberInput label="Intervalo de sincronización (min)" description="Frecuencia de sincronización automática entre dispositivos" min={5} max={120} value={syncInterval} onChange={(v) => setSyncInterval(Number(v))} styles={inputStyles} />
                    <NumberInput label="Capacidad máxima de registros biométricos" description="Máximo de perfiles por dispositivo FaceDeep" min={100} max={10000} step={100} value={maxBio} onChange={(v) => setMaxBio(Number(v))} styles={inputStyles} />
                  </div>
                </Card>
              </div>

              {/* Active config summary */}
              <Card withBorder radius="lg" p="lg" style={{ borderColor: C.cardBorder, background: C.cardBg }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <ThemeIcon size="md" radius="md" style={{ background: C.info.bg, color: C.info.color, border: `1px solid ${C.info.border}` }}>
                    <CheckCircle size={15} />
                  </ThemeIcon>
                  <Text style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>Configuración Activa</Text>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  {[
                    { label: "Umbral Tardanza",    value: `${tardanzaMin} minutos`,             color: C.warning.color },
                    { label: "Sincronización Auto.", value: `Cada ${syncInterval} min`,          color: C.info.color    },
                    { label: "Cap. Biométrica",     value: `${maxBio.toLocaleString()} registros`, color: C.violet.color },
                  ].map((item) => (
                    <div key={item.label} style={{ background: C.cardHeaderBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px" }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: C.textSubtle, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{item.label}</p>
                      <p style={{ fontSize: 15, fontWeight: 700, color: item.color, margin: 0 }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button leftSection={<Save size={15} />} loading={savingConfig} onClick={handleSaveConfig} color="blue" size="md" style={{ fontWeight: 600 }}>
                  Guardar Configuración Global
                </Button>
              </div>
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    </Box>
  );
}
