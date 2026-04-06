import { useState, useMemo, useCallback } from "react";
import {
  Card, Text, Group, Badge, Table, Select, Button, Stack,
  ActionIcon, Tooltip, Progress, Collapse, TextInput, Checkbox,
  NumberInput, NativeSelect,
} from "@mantine/core";
import {
  Calendar, Download, ChevronDown, ChevronUp, Search,
  Clock, AlertTriangle, CheckCircle, Eye, FileText, Filter,
  Pencil, Check, X,
} from "lucide-react";
import { useAppColors } from "../../hooks/useAppColors";

/* ── Mock data ─────────────────────────────────────────────── */

const OPERARIOS = [
  { id: 1, name: "Luis García", legajo: "OP-0987", categoria: "Peón", estacion: "Centro Norte" },
  { id: 2, name: "María López", legajo: "OP-1023", categoria: "Oficial", estacion: "Centro Sur" },
  { id: 3, name: "Carlos Ruiz", legajo: "OP-0754", categoria: "Peón", estacion: "Centro Norte" },
  { id: 4, name: "Ana Fernández", legajo: "OP-1100", categoria: "Oficial", estacion: "Zona Oeste" },
  { id: 5, name: "Jorge Mendoza", legajo: "OP-0812", categoria: "Peón", estacion: "Centro Sur" },
  { id: 6, name: "Patricia Sosa", legajo: "OP-0945", categoria: "Oficial", estacion: "Zona Norte" },
  { id: 7, name: "Roberto Díaz", legajo: "OP-0633", categoria: "Peón", estacion: "Zona Oeste" },
  { id: 8, name: "Silvia Martínez", legajo: "OP-1201", categoria: "Peón", estacion: "Centro Norte" },
];

type DayRecord = {
  fecha: string;
  ingreso: string | null;
  egreso: string | null;
  horasTrabajadas: number;
  estado: "presente" | "ausente_just" | "ausente_injust" | "feriado" | "descanso";
  justificacion?: string;
  observacionIngreso?: string;
  observacionEgreso?: string;
  revisado: boolean;
};

function generateMonthData(year: number, month: number): DayRecord[] {
  const days: DayRecord[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  const justificaciones = ["Vacaciones", "Enfermedad", "RT", "Licencia gremial"];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const dow = date.getDay();
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

    if (dow === 0) {
      days.push({ fecha: dateStr, ingreso: null, egreso: null, horasTrabajadas: 0, estado: "descanso", revisado: true });
      continue;
    }

    const rand = Math.random();
    if (rand < 0.7) {
      const hIn = 5 + Math.floor(Math.random() * 2);
      const mIn = Math.floor(Math.random() * 40);
      const worked = 7 + Math.random() * 2;
      const hOut = hIn + Math.floor(worked);
      const mOut = Math.floor((worked % 1) * 60);
      const hasObs = Math.random() < 0.2;
      days.push({
        fecha: dateStr,
        ingreso: `${String(hIn).padStart(2, "0")}:${String(mIn).padStart(2, "0")}`,
        egreso: `${String(hOut).padStart(2, "0")}:${String(mOut).padStart(2, "0")}`,
        horasTrabajadas: Math.round(worked * 100) / 100,
        estado: "presente",
        observacionIngreso: hasObs ? "Ingreso fuera de horario por causa justificada" : undefined,
        revisado: Math.random() > 0.3,
      });
    } else if (rand < 0.85) {
      const just = justificaciones[Math.floor(Math.random() * justificaciones.length)];
      days.push({ fecha: dateStr, ingreso: null, egreso: null, horasTrabajadas: 0, estado: "ausente_just", justificacion: just, revisado: true });
    } else {
      days.push({ fecha: dateStr, ingreso: null, egreso: null, horasTrabajadas: 0, estado: "ausente_injust", revisado: Math.random() > 0.5 });
    }
  }
  return days;
}

const MESES = [
  { value: "1", label: "Enero" }, { value: "2", label: "Febrero" }, { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" }, { value: "5", label: "Mayo" }, { value: "6", label: "Junio" },
  { value: "7", label: "Julio" }, { value: "8", label: "Agosto" }, { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" }, { value: "11", label: "Noviembre" }, { value: "12", label: "Diciembre" },
];

const ESTACIONES = ["Todas", "Centro Norte", "Centro Sur", "Zona Oeste", "Zona Norte"];
const DOW_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/* ── Component ─────────────────────────────────────────────── */

export function HRRevisionMensual() {
  const C = useAppColors();
  const [mes, setMes] = useState<string>("3");
  const [anio] = useState(2026);
  const [estacion, setEstacion] = useState<string | null>("Todas");
  const [search, setSearch] = useState("");
  const [expandedOp, setExpandedOp] = useState<number | null>(null);
  const [selectedForExport, setSelectedForExport] = useState<Set<number>>(new Set());
  const [dataByOp, setDataByOp] = useState<Record<number, DayRecord[]>>(() => {
    const map: Record<number, DayRecord[]> = {};
    OPERARIOS.forEach((op) => {
      map[op.id] = generateMonthData(2026, 3);
    });
    return map;
  });
  const [editingCell, setEditingCell] = useState<{ opId: number; fecha: string; field: "horas" | "estado" } | null>(null);
  const [editValue, setEditValue] = useState<string | number>("");
  // Track selected records per operator for batch approval
  const [selectedRecords, setSelectedRecords] = useState<Record<number, Set<string>>>({});

  const mesNum = parseInt(mes);
  const mesLabel = MESES.find((m) => m.value === mes)?.label ?? "";

  // Regenerate data when month changes
  const regenerateData = useCallback((month: number, year: number) => {
    const map: Record<number, DayRecord[]> = {};
    OPERARIOS.forEach((op) => {
      map[op.id] = generateMonthData(year, month);
    });
    setDataByOp(map);
  }, []);

  const filtered = useMemo(() => {
    return OPERARIOS.filter((op) => {
      if (estacion && estacion !== "Todas" && op.estacion !== estacion) return false;
      if (search && !op.name.toLowerCase().includes(search.toLowerCase()) && !op.legajo.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [estacion, search]);

  const updateRecord = (opId: number, fecha: string, updates: Partial<DayRecord>) => {
    setDataByOp((prev) => {
      const next = { ...prev };
      next[opId] = (next[opId] ?? []).map((r) =>
        r.fecha === fecha ? { ...r, ...updates } : r
      );
      return next;
    });
  };

  const startEdit = (opId: number, fecha: string, field: "horas" | "estado", currentValue: string | number) => {
    setEditingCell({ opId, fecha, field });
    setEditValue(currentValue);
  };

  const commitEdit = () => {
    if (!editingCell) return;
    const { opId, fecha, field } = editingCell;
    if (field === "horas") {
      const val = typeof editValue === "string" ? parseFloat(editValue) : editValue;
      if (!isNaN(val) && val >= 0) {
        updateRecord(opId, fecha, { horasTrabajadas: Math.round(val * 100) / 100 });
      }
    } else if (field === "estado") {
      const val = editValue as DayRecord["estado"];
      updateRecord(opId, fecha, { estado: val });
    }
    setEditingCell(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const toggleRevisado = (opId: number, fecha: string, current: boolean) => {
    updateRecord(opId, fecha, { revisado: !current });
  };

  const toggleRecordSelection = (opId: number, fecha: string) => {
    setSelectedRecords((prev) => {
      const next = { ...prev };
      if (!next[opId]) next[opId] = new Set();
      if (next[opId].has(fecha)) {
        next[opId].delete(fecha);
        if (next[opId].size === 0) delete next[opId];
      } else {
        next[opId].add(fecha);
      }
      return next;
    });
  };

  const selectAllRecords = (opId: number) => {
    const records = dataByOp[opId] ?? [];
    const pendingRecords = records.filter((r) => !r.revisado && r.estado !== "descanso" && r.estado !== "feriado");
    
    setSelectedRecords((prev) => {
      const next = { ...prev };
      if (!next[opId]) next[opId] = new Set();
      
      // If all pending are selected, deselect all; otherwise select all pending
      const allSelected = pendingRecords.every((r) => next[opId].has(r.fecha));
      if (allSelected) {
        delete next[opId];
      } else {
        next[opId] = new Set(pendingRecords.map((r) => r.fecha));
      }
      return next;
    });
  };

  const approveSelected = (opId: number) => {
    const selected = selectedRecords[opId];
    if (!selected || selected.size === 0) return;

    setDataByOp((prev) => {
      const next = { ...prev };
      next[opId] = (next[opId] ?? []).map((r) =>
        selected.has(r.fecha) ? { ...r, revisado: true } : r
      );
      return next;
    });

    // Clear selection after approval
    setSelectedRecords((prev) => {
      const next = { ...prev };
      delete next[opId];
      return next;
    });
  };

  const approveAllPending = (opId: number) => {
    setDataByOp((prev) => {
      const next = { ...prev };
      next[opId] = (next[opId] ?? []).map((r) =>
        !r.revisado && r.estado !== "descanso" && r.estado !== "feriado" ? { ...r, revisado: true } : r
      );
      return next;
    });
  };

  const getSummary = (records: DayRecord[]) => {
    const presentes = records.filter((r) => r.estado === "presente").length;
    const ausJust = records.filter((r) => r.estado === "ausente_just").length;
    const ausInjust = records.filter((r) => r.estado === "ausente_injust").length;
    const totalHoras = records.reduce((s, r) => s + r.horasTrabajadas, 0);
    const pendientes = records.filter((r) => !r.revisado && r.estado !== "descanso" && r.estado !== "feriado").length;
    const diasLaborables = records.filter((r) => r.estado !== "descanso" && r.estado !== "feriado").length;
    return { presentes, ausJust, ausInjust, totalHoras: Math.round(totalHoras * 100) / 100, pendientes, diasLaborables };
  };

  const toggleExport = (id: number) => {
    setSelectedForExport((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedForExport.size === filtered.length) {
      setSelectedForExport(new Set());
    } else {
      setSelectedForExport(new Set(filtered.map((o) => o.id)));
    }
  };

  const handleExportDAS = () => {
    // In production: this writes to the PostgreSQL views that DAS consumes
    alert(`Datos de ${selectedForExport.size} operario(s) del mes ${mesLabel} ${anio} guardados.\n\nLos datos quedan disponibles automáticamente en las vistas que el DAS consume.`);
  };

  const estadoBadge = (estado: DayRecord["estado"], justificacion?: string) => {
    switch (estado) {
      case "presente": return <Badge size="xs" color="green" variant="light">Presente</Badge>;
      case "ausente_just": return <Badge size="xs" color="yellow" variant="light">{justificacion ?? "Justificada"}</Badge>;
      case "ausente_injust": return <Badge size="xs" color="orange" variant="light">Aus. Injustificada</Badge>;
      case "feriado": return <Badge size="xs" color="blue" variant="light">Feriado</Badge>;
      case "descanso": return <Badge size="xs" color="gray" variant="light">Descanso</Badge>;
    }
  };

  return (
    <Stack gap="md">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <Text style={{ color: C.textPrimary, fontSize: 22, fontWeight: 700 }}>Revisión Mensual</Text>
          <Text style={{ color: C.textMuted, fontSize: 13 }}>
            Revisá las horas y asistencia por operario. Al guardar, los datos quedan disponibles para el DAS.
          </Text>
        </div>
        <Group gap="xs">
          <Button
            leftSection={<Download size={15} />}
            color="blue"
            variant="filled"
            size="sm"
            disabled={selectedForExport.size === 0}
            onClick={handleExportDAS}
          >
            Guardar para DAS ({selectedForExport.size})
          </Button>
        </Group>
      </div>

      {/* Filters */}
      <Card padding="sm" radius="md" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <Select
            label="Mes"
            data={MESES}
            value={mes}
            onChange={(v) => { if (v) { setMes(v); regenerateData(parseInt(v), anio); } }}
            leftSection={<Calendar size={14} />}
            size="sm"
            style={{ minWidth: 140 }}
          />
          <Select
            label="Estación"
            data={ESTACIONES}
            value={estacion}
            onChange={setEstacion}
            leftSection={<Filter size={14} />}
            size="sm"
            style={{ minWidth: 160 }}
          />
          <TextInput
            label="Buscar"
            placeholder="Nombre o legajo..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            leftSection={<Search size={14} />}
            size="sm"
            style={{ minWidth: 200, flex: 1 }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 2 }}>
            <Checkbox
              label="Seleccionar todos"
              checked={selectedForExport.size === filtered.length && filtered.length > 0}
              indeterminate={selectedForExport.size > 0 && selectedForExport.size < filtered.length}
              onChange={selectAll}
              size="sm"
            />
          </div>
        </div>
      </Card>

      {/* Summary cards */}
      {(() => {
        const allRecords = filtered.flatMap((op) => dataByOp[op.id] ?? []);
        const totalHoras = allRecords.reduce((s, r) => s + r.horasTrabajadas, 0);
        const pendientes = allRecords.filter((r) => !r.revisado && r.estado !== "descanso").length;
        const presentes = allRecords.filter((r) => r.estado === "presente").length;
        const laborables = allRecords.filter((r) => r.estado !== "descanso" && r.estado !== "feriado").length;
        const pct = laborables > 0 ? Math.round((presentes / laborables) * 100) : 0;

        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            <Card padding="sm" radius="md" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
              <Text style={{ color: C.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Horas</Text>
              <Text style={{ color: C.info.color, fontSize: 24, fontWeight: 700 }}>{Math.round(totalHoras).toLocaleString()}</Text>
              <Text style={{ color: C.textMuted, fontSize: 11 }}>{filtered.length} operarios · {mesLabel} {anio}</Text>
            </Card>
            <Card padding="sm" radius="md" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
              <Text style={{ color: C.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Asistencia</Text>
              <Text style={{ color: C.success.color, fontSize: 24, fontWeight: 700 }}>{pct}%</Text>
              <Progress value={pct} color="green" size="xs" mt={4} />
            </Card>
            <Card padding="sm" radius="md" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
              <Text style={{ color: C.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Pendientes revisión</Text>
              <Text style={{ color: pendientes > 0 ? C.warning.color : C.success.color, fontSize: 24, fontWeight: 700 }}>{pendientes}</Text>
              <Text style={{ color: C.textMuted, fontSize: 11 }}>registros sin revisar</Text>
            </Card>
            <Card padding="sm" radius="md" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
              <Text style={{ color: C.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Listos para DAS</Text>
              <Text style={{ color: C.info.color, fontSize: 24, fontWeight: 700 }}>{selectedForExport.size}</Text>
              <Text style={{ color: C.textMuted, fontSize: 11 }}>operarios seleccionados</Text>
            </Card>
          </div>
        );
      })()}

      {/* Operarios list */}
      {filtered.map((op) => {
        const records = dataByOp[op.id] ?? [];
        const summary = getSummary(records);
        const isExpanded = expandedOp === op.id;
        const isSelected = selectedForExport.has(op.id);
        const selectedCount = selectedRecords[op.id]?.size ?? 0;

        return (
          <Card key={op.id} padding={0} radius="md" style={{ background: C.cardBg, border: `1px solid ${isSelected ? C.info.border : C.cardBorder}`, overflow: "hidden" }}>
            {/* Row header */}
            <div
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", flexWrap: "wrap" }}
              onClick={() => setExpandedOp(isExpanded ? null : op.id)}
            >
              <Checkbox
                checked={isSelected}
                onChange={(e) => { e.stopPropagation(); toggleExport(op.id); }}
                onClick={(e) => e.stopPropagation()}
                size="sm"
              />
              <div style={{ flex: 1, minWidth: 160 }}>
                <Text style={{ color: C.textPrimary, fontSize: 14, fontWeight: 600 }}>{op.name}</Text>
                <Text style={{ color: C.textMuted, fontSize: 12 }}>{op.legajo} · {op.categoria} · {op.estacion}</Text>
              </div>

              <Group gap="lg" style={{ flexWrap: "wrap" }}>
                <div style={{ textAlign: "center", minWidth: 60 }}>
                  <Text style={{ color: C.info.color, fontSize: 16, fontWeight: 700 }}>{summary.totalHoras}h</Text>
                  <Text style={{ color: C.textMuted, fontSize: 10 }}>Horas</Text>
                </div>
                <div style={{ textAlign: "center", minWidth: 50 }}>
                  <Text style={{ color: C.success.color, fontSize: 16, fontWeight: 700 }}>{summary.presentes}</Text>
                  <Text style={{ color: C.textMuted, fontSize: 10 }}>Presentes</Text>
                </div>
                <div style={{ textAlign: "center", minWidth: 50 }}>
                  <Text style={{ color: C.warning.color, fontSize: 16, fontWeight: 700 }}>{summary.ausJust}</Text>
                  <Text style={{ color: C.textMuted, fontSize: 10 }}>Just.</Text>
                </div>
                <div style={{ textAlign: "center", minWidth: 50 }}>
                  <Text style={{ color: C.danger.color, fontSize: 16, fontWeight: 700 }}>{summary.ausInjust}</Text>
                  <Text style={{ color: C.textMuted, fontSize: 10 }}>Injust.</Text>
                </div>
                {summary.pendientes > 0 && (
                  <Tooltip label={`${summary.pendientes} registros pendientes de revisión`}>
                    <Badge color="yellow" variant="light" size="sm" leftSection={<AlertTriangle size={10} />}>
                      {summary.pendientes} pend.
                    </Badge>
                  </Tooltip>
                )}
              </Group>

              <ActionIcon variant="subtle" color="gray" size="sm">
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </ActionIcon>
            </div>

            {/* Expanded detail */}
            <Collapse in={isExpanded}>
              <div style={{ borderTop: `1px solid ${C.divider}`, overflowX: "auto" }}>
                <Table striped highlightOnHover style={{ fontSize: 12 }}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ color: C.textMuted, width: 40 }}>
                        {summary.pendientes > 0 && (
                          <Checkbox
                            size="xs"
                            checked={
                              selectedRecords[op.id]?.size === summary.pendientes &&
                              summary.pendientes > 0
                            }
                            indeterminate={
                              selectedRecords[op.id] &&
                              selectedRecords[op.id].size > 0 &&
                              selectedRecords[op.id].size < summary.pendientes
                            }
                            onChange={(e) => { e.stopPropagation(); selectAllRecords(op.id); }}
                          />
                        )}
                      </Table.Th>
                      <Table.Th style={{ color: C.textMuted, minWidth: 90 }}>Fecha</Table.Th>
                      <Table.Th style={{ color: C.textMuted }}>Día</Table.Th>
                      <Table.Th style={{ color: C.textMuted }}>Ingreso</Table.Th>
                      <Table.Th style={{ color: C.textMuted }}>Egreso</Table.Th>
                      <Table.Th style={{ color: C.textMuted, minWidth: 90 }}>Horas</Table.Th>
                      <Table.Th style={{ color: C.textMuted, minWidth: 130 }}>Estado</Table.Th>
                      <Table.Th style={{ color: C.textMuted }}>Obs.</Table.Th>
                      <Table.Th style={{ color: C.textMuted, minWidth: 80 }}>Revisado</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {records.map((rec) => {
                      const d = new Date(rec.fecha + "T12:00:00");
                      const dowName = DOW_NAMES[d.getDay()];
                      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                      const isEditingHoras = editingCell?.opId === op.id && editingCell?.fecha === rec.fecha && editingCell?.field === "horas";
                      const isEditingEstado = editingCell?.opId === op.id && editingCell?.fecha === rec.fecha && editingCell?.field === "estado";
                      const isNonEditable = rec.estado === "descanso" || rec.estado === "feriado";
                      const isPending = !rec.revisado && !isNonEditable;
                      const isRecordSelected = selectedRecords[op.id]?.has(rec.fecha) ?? false;

                      return (
                        <Table.Tr
                          key={rec.fecha}
                          style={{ 
                            opacity: rec.estado === "descanso" ? 0.5 : 1, 
                            background: !rec.revisado && rec.estado !== "descanso" ? C.warning.bg : undefined 
                          }}
                        >
                          <Table.Td>
                            {isPending && (
                              <Checkbox
                                size="xs"
                                checked={isRecordSelected}
                                onChange={(e) => { e.stopPropagation(); toggleRecordSelection(op.id, rec.fecha); }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            )}
                          </Table.Td>
                          <Table.Td style={{ color: C.textPrimary }}>{rec.fecha.slice(5)}</Table.Td>
                          <Table.Td style={{ color: isWeekend ? C.textMuted : C.textSecondary }}>{dowName}</Table.Td>
                          <Table.Td>
                            <span style={{ color: rec.observacionIngreso ? C.warning.color : C.textPrimary }}>
                              {rec.ingreso ?? "—"}
                            </span>
                          </Table.Td>
                          <Table.Td>
                            <span style={{ color: rec.observacionEgreso ? C.warning.color : C.textPrimary }}>
                              {rec.egreso ?? "—"}
                            </span>
                          </Table.Td>

                          {/* Editable Horas */}
                          <Table.Td>
                            {isEditingHoras ? (
                              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <NumberInput
                                  value={editValue as number}
                                  onChange={(v) => setEditValue(v as number)}
                                  size="xs"
                                  min={0}
                                  max={24}
                                  step={0.25}
                                  decimalScale={2}
                                  style={{ width: 60 }}
                                  onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") cancelEdit(); }}
                                  autoFocus
                                />
                                <ActionIcon size="xs" color="green" variant="subtle" onClick={commitEdit}><Check size={11} /></ActionIcon>
                                <ActionIcon size="xs" color="gray" variant="subtle" onClick={cancelEdit}><X size={11} /></ActionIcon>
                              </div>
                            ) : (
                              <div
                                style={{ display: "flex", alignItems: "center", gap: 4, cursor: isNonEditable ? "default" : "pointer" }}
                                onClick={() => !isNonEditable && startEdit(op.id, rec.fecha, "horas", rec.horasTrabajadas)}
                              >
                                <span style={{ color: C.textPrimary, fontWeight: 600 }}>
                                  {rec.horasTrabajadas > 0 ? `${rec.horasTrabajadas}h` : "—"}
                                </span>
                                {!isNonEditable && <Pencil size={10} color={C.textMuted} />}
                              </div>
                            )}
                          </Table.Td>

                          {/* Editable Estado */}
                          <Table.Td>
                            {isEditingEstado ? (
                              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <NativeSelect
                                  value={editValue as string}
                                  onChange={(e) => setEditValue(e.currentTarget.value)}
                                  size="xs"
                                  data={[
                                    { value: "presente", label: "Presente" },
                                    { value: "ausente_just", label: "Aus. Justif." },
                                    { value: "ausente_injust", label: "Aus. Injustif." },
                                  ]}
                                  style={{ width: 110 }}
                                />
                                <ActionIcon size="xs" color="green" variant="subtle" onClick={commitEdit}><Check size={11} /></ActionIcon>
                                <ActionIcon size="xs" color="gray" variant="subtle" onClick={cancelEdit}><X size={11} /></ActionIcon>
                              </div>
                            ) : (
                              <div
                                style={{ display: "flex", alignItems: "center", gap: 4, cursor: isNonEditable ? "default" : "pointer" }}
                                onClick={() => !isNonEditable && startEdit(op.id, rec.fecha, "estado", rec.estado)}
                              >
                                {estadoBadge(rec.estado, rec.justificacion)}
                                {!isNonEditable && <Pencil size={10} color={C.textMuted} />}
                              </div>
                            )}
                          </Table.Td>

                          <Table.Td>
                            {(rec.observacionIngreso || rec.observacionEgreso) && (
                              <Tooltip label={rec.observacionIngreso || rec.observacionEgreso} multiline w={250}>
                                <ActionIcon variant="subtle" color="yellow" size="xs">
                                  <Eye size={12} />
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </Table.Td>

                          {/* Clickable Revisado */}
                          <Table.Td>
                            {!isNonEditable && (
                              <Tooltip label={rec.revisado ? "Marcar como pendiente" : "Aprobar registro"}>
                                <ActionIcon
                                  variant="subtle"
                                  color={rec.revisado ? "green" : "yellow"}
                                  size="sm"
                                  onClick={() => toggleRevisado(op.id, rec.fecha, rec.revisado)}
                                >
                                  {rec.revisado
                                    ? <CheckCircle size={16} color={C.success.color} />
                                    : <Clock size={16} color={C.warning.color} />
                                  }
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </div>

              {/* Footer with summary */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderTop: `1px solid ${C.divider}`, flexWrap: "wrap", gap: 8 }}>
                <Group gap="md">
                  <Text style={{ color: C.textMuted, fontSize: 12 }}>
                    <strong style={{ color: C.textPrimary }}>{summary.totalHoras}h</strong> trabajadas ·{" "}
                    <strong style={{ color: C.success.color }}>{summary.presentes}</strong>/{summary.diasLaborables} días
                  </Text>
                </Group>
                <Group gap="xs">
                  {selectedCount > 0 ? (
                    <Button
                      size="xs"
                      variant="filled"
                      color="green"
                      leftSection={<CheckCircle size={12} />}
                      onClick={(e) => { e.stopPropagation(); approveSelected(op.id); }}
                    >
                      Aprobar seleccionados ({selectedCount})
                    </Button>
                  ) : (
                    summary.pendientes > 0 && (
                      <Button
                        size="xs"
                        variant="light"
                        color="green"
                        leftSection={<CheckCircle size={12} />}
                        onClick={(e) => { e.stopPropagation(); approveAllPending(op.id); }}
                      >
                        Aprobar todos ({summary.pendientes})
                      </Button>
                    )
                  )}
                  <Button
                    size="xs"
                    variant="light"
                    color="blue"
                    leftSection={<FileText size={12} />}
                    onClick={(e) => { e.stopPropagation(); }}
                  >
                    Ver legajo
                  </Button>
                  {!isSelected && (
                    <Button
                      size="xs"
                      variant="filled"
                      color="blue"
                      leftSection={<CheckCircle size={12} />}
                      onClick={(e) => { e.stopPropagation(); toggleExport(op.id); }}
                    >
                      Marcar para DAS
                    </Button>
                  )}
                </Group>
              </div>
            </Collapse>
          </Card>
        );
      })}

      {filtered.length === 0 && (
        <Card padding="xl" radius="md" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, textAlign: "center" }}>
          <Text style={{ color: C.textMuted }}>No se encontraron operarios con los filtros seleccionados.</Text>
        </Card>
      )}
    </Stack>
  );
}