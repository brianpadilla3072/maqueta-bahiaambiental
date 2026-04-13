import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Text,
  TextInput,
  Badge,
  Stepper,
  Alert,
  Select,
  ThemeIcon,
  Divider,
  Loader,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  Search, User, Camera, CheckCircle, MinusCircle,
  AlertTriangle, Save, Scan, UserCheck,
  ChevronRight, ChevronLeft,
} from "lucide-react";
import { useAppColors } from "../../hooks/useAppColors";

type DAZStatus = "activo" | "baja" | "pendiente" | null;
interface DAZEmployee {
  legajo: string; name: string; dni: string;
  categoria: string; funcion: string; estacion: string; status: DAZStatus;
}

const MOCK_EMPLOYEES: Record<string, DAZEmployee> = {
  "OP-5501": { legajo: "OP-5501", name: "Tomás Acosta",    dni: "35.442.781", categoria: "Peón",    funcion: "Barrendero", estacion: "Flores",        status: "activo" },
  "OP-5502": { legajo: "OP-5502", name: "Patricia Ruiz",   dni: "29.118.443", categoria: "Chofer",  funcion: "Conductor",  estacion: "Centro Norte",  status: "activo" },
  "OP-5503": { legajo: "OP-5503", name: "Héctor Juárez",   dni: "22.887.001", categoria: "Oficial", funcion: "Encargado",  estacion: "Caballito",     status: "baja"   },
};

export function AdminEnrolamiento() {
  const C = useAppColors();
  const [activeStep,   setActiveStep]   = useState(0);
  const [legajo,       setLegajo]       = useState("");
  const [dasResult,    setDasResult]    = useState<DAZEmployee | null>(null);
  const [dasLoading,   setDasLoading]   = useState(false);
  const [faceStatus,   setFaceStatus]   = useState<"idle" | "scanning" | "captured">("idle");
  const [profileForm,  setProfileForm]  = useState({ nombre: "", categoria: "", funcion: "", estacion: "" });
  const [saving,       setSaving]       = useState(false);

  const inputStyles = {
    label: { fontSize: 13, fontWeight: 500, color: C.textLabel, marginBottom: 5 },
    input: { background: C.inputBg, borderColor: C.inputBorder, color: C.inputColor },
  };

  const handleDAZQuery = () => {
    if (!legajo.trim()) { notifications.show({ title: "Campo requerido", message: "Ingrese un Legajo o DNI.", color: "orange" }); return; }
    setDasLoading(true);
    setTimeout(() => {
      const found = MOCK_EMPLOYEES[legajo.toUpperCase()];
      setDasLoading(false);
      if (found) {
        setDasResult(found);
        if (found.status === "activo") setProfileForm({ nombre: found.name, categoria: found.categoria, funcion: found.funcion, estacion: found.estacion });
      } else {
        setDasResult(null);
        notifications.show({ title: "No encontrado", message: "El legajo no existe en el sistema DAZ.", color: "orange" });
      }
    }, 1200);
  };

  const simulateFaceCapture = () => {
    setFaceStatus("scanning");
    setTimeout(() => {
      setFaceStatus("captured");
      notifications.show({ title: "Rostro capturado", message: "Datos biométricos registrados.", color: "blue" });
    }, 2000);
  };

  const handleNextStep2 = () => {
    if (faceStatus !== "captured") {
      notifications.show({ title: "Captura incompleta", message: "Debe capturar el rostro del operario.", color: "yellow" });
      return;
    }
    setActiveStep(2);
  };

  const handleSaveProfile = () => {
    if (!profileForm.nombre || !profileForm.categoria) {
      notifications.show({ title: "Campos requeridos", message: "Complete todos los datos.", color: "orange" });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setActiveStep(3);
      notifications.show({ title: "Perfil guardado", message: `${profileForm.nombre} dado de alta. Sincronizando dispositivos...`, color: "blue" });
    }, 1500);
  };

  const handleReset = () => {
    setActiveStep(0); setLegajo(""); setDasResult(null);
    setFaceStatus("idle");
    setProfileForm({ nombre: "", categoria: "", funcion: "", estacion: "" });
  };

  function BiometricCapture({ status, onCapture }: { status: "idle" | "scanning" | "captured"; onCapture: () => void }) {
    const iconColor   = status === "captured" ? C.info.color : status === "scanning" ? C.info.color : C.textSubtle;
    const bgColor     = status === "captured" ? C.info.bg    : status === "scanning" ? C.info.bg    : C.cardHeaderBg;
    const borderColor = status === "captured" ? C.info.border : status === "scanning" ? C.info.border : C.border;
    return (
      <div style={{ border: `1px solid ${borderColor}`, borderRadius: 12, padding: 24, textAlign: "center", background: bgColor }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: iconColor + "18", border: `3px solid ${iconColor}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}>
            {status === "scanning" ? <Loader size="lg" color="blue" />
              : status === "captured" ? <CheckCircle size={42} color={C.info.color} />
              : <Scan size={40} color={C.textSubtle} />}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, margin: 0 }}>Captura Facial</p>
            <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>Rostro del operario</p>
          </div>
          {status === "captured" ? (
            <Badge color="blue" variant="light" size="sm" leftSection={<CheckCircle size={11} />} style={{ fontWeight: 600 }}>
              Rostro capturado
            </Badge>
          ) : (
            <Button size="sm" variant="light" color="blue" loading={status === "scanning"} onClick={onCapture}
              leftSection={status !== "scanning" ? <Camera size={14} /> : undefined}
              style={{ fontWeight: 600 }}
            >
              {status === "scanning" ? "Procesando..." : "Iniciar Captura"}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Box>
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <div>
          <Text style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>Enrolamiento Facial</Text>
          <Text style={{ fontSize: 13, color: C.textMuted }}>Alta de operarios al sistema biométrico · Verificación DAZ → Captura → Perfil</Text>
        </div>

        <Stepper active={activeStep} allowNextStepsSelect={false} color="blue" size="sm">
          {/* STEP 1 */}
          <Stepper.Step key="step-das" label="Verificación DAZ" description="Consulta al padrón" icon={<Search size={16} />}>
            <Card withBorder radius="lg" shadow="sm" p={0} mt="lg" style={{ borderColor: C.cardBorder, background: C.cardBg }}>
              <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.divider}`, background: C.cardHeaderBg, display: "flex", alignItems: "center", gap: 10 }}>
                <ThemeIcon size="md" radius="md" style={{ background: C.info.bg, color: C.info.color, border: `1px solid ${C.info.border}` }}>
                  <Search size={15} />
                </ThemeIcon>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, margin: 0 }}>Consulta al Sistema DAZ</p>
                  <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>Verificación de estado de empleado</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
                  <TextInput
                    label="Legajo o DNI del operario" placeholder="Ej: OP-5501"
                    value={legajo} onChange={(e) => setLegajo(e.currentTarget.value)}
                    style={{ flex: 1 }} onKeyDown={(e) => e.key === "Enter" && handleDAZQuery()}
                    styles={inputStyles}
                  />
                  <Button leftSection={<Search size={15} />} loading={dasLoading} onClick={handleDAZQuery} color="blue" style={{ fontWeight: 600 }}>
                    Consultar DAZ
                  </Button>
                </div>
                <Text style={{ fontSize: 12, color: C.textSubtle }}>Demo: OP-5501 (activo) · OP-5502 (activo) · OP-5503 (baja)</Text>
                {dasResult && (
                  dasResult.status === "baja" ? (
                    <Alert color="orange" variant="light" icon={<MinusCircle size={18} />} title="ALERTA: Empleado en estado BAJA" radius="md"
                      styles={{ root: { border: `1px solid ${C.danger.border}` }, title: { color: C.danger.text }, message: { color: C.danger.text } }}
                    >
                      <strong>{dasResult.name}</strong> ({dasResult.legajo}) figura con baja en el sistema DAZ.
                    </Alert>
                  ) : (
                    <div style={{ border: `1px solid ${C.info.border}`, borderLeft: `4px solid ${C.info.color}`, borderRadius: 10, padding: "16px 20px", background: C.info.bg }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <div style={{ background: C.info.color, borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <User size={22} color="white" />
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              <span style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary }}>{dasResult.name}</span>
                              <Badge color="blue" size="sm" variant="light" style={{ fontWeight: 600 }}>Activo en DAZ</Badge>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "4px 16px" }}>
                              {[
                                { label: "Legajo",    value: dasResult.legajo    },
                                { label: "DNI",       value: dasResult.dni       },
                                { label: "Categoría", value: dasResult.categoria },
                                { label: "Estación",  value: dasResult.estacion  },
                              ].map((f) => (
                                <div key={f.label}>
                                  <p style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>{f.label}</p>
                                  <p style={{ fontSize: 13.5, fontWeight: 600, color: C.textPrimary, margin: 0 }}>{f.value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button onClick={() => setActiveStep(1)} rightSection={<ChevronRight size={16} />}
                          style={{ background: `linear-gradient(135deg, ${C.info.color}, #3b82f6)`, fontWeight: 600 }}
                        >
                          Continuar con Captura
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card>
          </Stepper.Step>

          {/* STEP 2 */}
          <Stepper.Step key="step-capture" label="Captura Física" description="Dispositivo FaceDeep Padre" icon={<Camera size={16} />}>
            <Card withBorder radius="lg" shadow="sm" p={0} mt="lg" style={{ borderColor: C.cardBorder, background: C.cardBg }}>
              <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.divider}`, background: C.cardHeaderBg, display: "flex", alignItems: "center", gap: 10 }}>
                <ThemeIcon size="md" radius="md" style={{ background: C.violet.bg, color: C.violet.color, border: `1px solid ${C.violet.border}` }}>
                  <Camera size={15} />
                </ThemeIcon>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, margin: 0 }}>Captura en Dispositivo FaceDeep Padre</p>
                  <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>El operario debe estar presente frente al dispositivo</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 24 }}>
                <Alert color="blue" variant="light" icon={<AlertTriangle size={14} />} radius="md">
                  Asegúrese de que el operario esté posicionado correctamente frente al dispositivo FaceDeep Padre.
                </Alert>
                <div style={{ display: "flex", justifyContent: "center", maxWidth: 360, margin: "0 auto" }}>
                  <BiometricCapture status={faceStatus} onCapture={simulateFaceCapture} />
                </div>
                <Divider color={C.divider} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button variant="subtle" color="gray" leftSection={<ChevronLeft size={15} />} onClick={() => setActiveStep(0)}>Volver</Button>
                  <Button onClick={handleNextStep2} disabled={faceStatus !== "captured"} rightSection={<ChevronRight size={15} />} color="blue" style={{ fontWeight: 600 }}>
                    Continuar al Perfil
                  </Button>
                </div>
              </div>
            </Card>
          </Stepper.Step>

          {/* STEP 3 */}
          <Stepper.Step key="step-profile" label="Completar Perfil" description="Datos y confirmación" icon={<Save size={16} />}>
            <Card withBorder radius="lg" shadow="sm" p={0} mt="lg" style={{ borderColor: C.cardBorder, background: C.cardBg }}>
              <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.divider}`, background: C.cardHeaderBg, display: "flex", alignItems: "center", gap: 10 }}>
                <ThemeIcon size="md" radius="md" style={{ background: C.info.bg, color: C.info.color, border: `1px solid ${C.info.border}` }}>
                  <UserCheck size={15} />
                </ThemeIcon>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, margin: 0 }}>Completar Perfil del Operario</p>
                  <p style={{ fontSize: 12, color: C.textMuted, margin: 0 }}>Confirme y ajuste los datos antes de guardar</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                  <TextInput label="Nombre completo" value={profileForm.nombre} onChange={(e) => setProfileForm({ ...profileForm, nombre: e.currentTarget.value })} required styles={inputStyles} />
                  <Select label="Categoría" data={["Peón", "Chofer", "Oficial", "Encargado", "Supervisor"]} value={profileForm.categoria} onChange={(v) => setProfileForm({ ...profileForm, categoria: v ?? "" })} required styles={inputStyles} />
                  <Select label="Función" data={["Barrendero", "Conductor", "Recolector", "Encargado", "Administrativo"]} value={profileForm.funcion} onChange={(v) => setProfileForm({ ...profileForm, funcion: v ?? "" })} styles={inputStyles} />
                  <Select label="Estación asignada" data={["Centro Norte", "Villa Urquiza", "Palermo Sur", "La Boca", "Flores", "Caballito"]} value={profileForm.estacion} onChange={(v) => setProfileForm({ ...profileForm, estacion: v ?? "" })} required styles={inputStyles} />
                </div>
                <Alert color="blue" variant="light" icon={<AlertTriangle size={14} />} radius="md">
                  Al guardar, el sistema iniciará la <strong>sincronización masiva</strong> a todos los dispositivos FaceDeep de la estación asignada.
                </Alert>
                <Divider color={C.divider} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button variant="subtle" color="gray" leftSection={<ChevronLeft size={15} />} onClick={() => setActiveStep(1)}>Volver</Button>
                  <Button leftSection={<Save size={15} />} loading={saving} onClick={handleSaveProfile}
                    style={{ background: `linear-gradient(135deg, ${C.info.color}, #3b82f6)`, fontWeight: 600 }}
                  >
                    Guardar Perfil Completo
                  </Button>
                </div>
              </div>
            </Card>
          </Stepper.Step>

          {/* COMPLETED */}
          <Stepper.Completed>
            <Card withBorder radius="lg" mt="lg" p="xl" style={{ border: `1px solid ${C.info.border}`, background: C.info.bg }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, paddingTop: 16, paddingBottom: 16 }}>
                <div style={{ background: C.info.color, borderRadius: "50%", width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 16px ${C.info.color}33` }}>
                  <CheckCircle size={44} color="white" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: C.info.text, marginBottom: 8 }}>Enrolamiento Completado</p>
                  <p style={{ fontSize: 14, color: C.textSecondary, maxWidth: 400, margin: 0 }}>
                    <strong>{profileForm.nombre}</strong> fue dado de alta exitosamente. Sincronización biométrica en progreso.
                  </p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                  {["Datos DAZ verificados", "Rostro capturado", "Perfil guardado"].map((item) => (
                    <Badge key={item} color="blue" size="md" variant="light" radius="sm" leftSection={<CheckCircle size={12} />} style={{ fontWeight: 600 }}>
                      {item}
                    </Badge>
                  ))}
                </div>
                <Button onClick={handleReset} variant="light" color="blue" style={{ fontWeight: 600 }}>
                  Realizar nuevo enrolamiento
                </Button>
              </div>
            </Card>
          </Stepper.Completed>
        </Stepper>
      </div>
    </Box>
  );
}
