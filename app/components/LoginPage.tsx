import { useState } from "react";
import {
  Box,
  Button,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Anchor,
  Modal,
  Group,
  Divider,
  UnstyledButton,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMantineColorScheme } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router";
import {
  ShieldCheck,
  Mail,
  Scan,
  Users,
  BarChart3,
  ArrowRight,
  Lock,
  User,
  Sun,
  Moon,
} from "lucide-react";
import { useAppColors } from "../hooks/useAppColors";

const USERS = [
  { username: "supervisor", password: "1234", role: "supervisor", label: "Supervisor" },
  { username: "rrhh", password: "1234", role: "rrhh", label: "Recursos Humanos" },
  { username: "admin", password: "1234", role: "admin", label: "Gerencia" },
];

const FEATURES = [
  {
    icon: Scan,
    title: "Reconocimiento Facial",
    desc: "Identificación biométrica en tiempo real con IA de alta precisión",
  },
  {
    icon: Users,
    title: "Gestión de Cuadrillas",
    desc: "Control de asistencia y novedades por estación de trabajo",
  },
  {
    icon: BarChart3,
    title: "Reportes y Analytics",
    desc: "Dashboards ejecutivos con trazabilidad completa de eventos",
  },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const C = useAppColors();
  const isDark = colorScheme === "dark";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [recoverEmail, setRecoverEmail] = useState("");

  const handleLogin = () => {
    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) {
      notifications.show({
        title: "Acceso denegado",
        message: "Credenciales incorrectas. Verifique usuario y contraseña.",
        color: "orange",
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (user.role === "supervisor") navigate("/supervisor/home");
      else if (user.role === "rrhh") navigate("/rrhh/dashboard");
      else navigate("/admin/mapa");
    }, 800);
  };

  const handleRecover = () => {
    notifications.show({
      title: "Correo enviado",
      message: `Enlace de recuperación enviado a ${recoverEmail}`,
      color: "teal",
    });
    close();
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        background: C.mainBg,
      }}
    >
      {/* LEFT BRAND PANEL */}
      <Box
        style={{
          width: "42%",
          background: "linear-gradient(160deg, #0f172a 0%, #1e3a8a 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "48px 40px",
          position: "relative",
          overflow: "hidden",
        }}
        visibleFrom="md"
      >
        <Box style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(59,130,246,0.03)" }} />
        <Box style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(30,64,175,0.08)" }} />

        <Group gap="sm" mb={60} style={{ position: "relative", zIndex: 1 }}>
          <Box style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 12, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldCheck size={22} color="#60a5fa" />
          </Box>
          <Box>
            <Text style={{ color: "#f1f5f9", fontSize: 20, fontWeight: 700, lineHeight: 1 }}>FaceDeep</Text>
            <Text style={{ color: "#475569", fontSize: 10, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase" }}>Enterprise</Text>
          </Box>
        </Group>

        <Box style={{ flex: 1, position: "relative", zIndex: 1 }}>
          <Text style={{ color: "#f8fafc", fontSize: 30, fontWeight: 700, lineHeight: 1.2, marginBottom: 14 }}>
            Control biométrico de asistencia
          </Text>
          <Text style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.65, marginBottom: 48 }}>
            Plataforma integral para gestión de personal, dispositivos FaceDeep y trazabilidad operativa en tiempo real.
          </Text>
          <Stack gap={24}>
            {FEATURES.map((f) => (
              <Group key={f.title} gap="md" align="flex-start">
                <Box style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.12)", borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <f.icon size={17} color="#60a5fa" />
                </Box>
                <Box>
                  <Text style={{ color: "#f1f5f9", fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>{f.title}</Text>
                  <Text style={{ color: "#64748b", fontSize: 12.5, lineHeight: 1.5 }}>{f.desc}</Text>
                </Box>
              </Group>
            ))}
          </Stack>
        </Box>

        <Box style={{ position: "relative", zIndex: 1 }}>
          <Divider color="rgba(255,255,255,0.07)" mb="sm" />
          <Text style={{ color: "#334155", fontSize: 11.5 }}>
            © 2026 FaceDeep Enterprise · v4.2.1 · Todos los derechos reservados
          </Text>
        </Box>
      </Box>

      {/* RIGHT FORM PANEL */}
      <Box style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative" }}>
        {/* Dark mode toggle */}
        <Box style={{ position: "absolute", top: 20, right: 20 }}>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            onClick={() => toggleColorScheme()}
            style={{ background: C.cardBg, border: `1px solid ${C.border}` }}
          >
            {isDark ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#64748b" />}
          </ActionIcon>
        </Box>

        <Box style={{ width: "100%", maxWidth: 420 }}>
          {/* Mobile brand */}
          <Group gap="sm" mb={32} hiddenFrom="md" justify="center">
            <Box style={{ background: "#1e3a8a", borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={22} color="#60a5fa" />
            </Box>
            <Text style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary }}>FaceDeep</Text>
          </Group>

          <Text style={{ color: C.textPrimary, fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Iniciar sesión</Text>
          <Text style={{ color: C.textMuted, fontSize: 13.5, marginBottom: 32 }}>
            Ingrese sus credenciales para acceder al sistema
          </Text>

          <Stack gap="md">
            <TextInput
              label="Usuario"
              placeholder="nombre.usuario"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              size="md"
              leftSection={<User size={15} color={C.textSubtle} />}
              styles={{
                label: { color: C.textLabel, fontSize: 13, fontWeight: 500, marginBottom: 5 },
                input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.inputColor },
              }}
            />
            <PasswordInput
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              size="md"
              leftSection={<Lock size={15} color={C.textSubtle} />}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              styles={{
                label: { color: C.textLabel, fontSize: 13, fontWeight: 500, marginBottom: 5 },
                input: { background: C.inputBg, border: `1px solid ${C.inputBorder}`, color: C.inputColor },
              }}
            />
          </Stack>

          <Group justify="flex-end" mt="xs" mb="xl">
            <Anchor size="sm" onClick={open} style={{ color: "#3b82f6", fontSize: 13 }}>
              ¿Olvidó su contraseña?
            </Anchor>
          </Group>

          <Button
            fullWidth
            size="md"
            loading={loading}
            onClick={handleLogin}
            rightSection={<ArrowRight size={16} />}
            style={{ background: "linear-gradient(135deg, #1d4ed8, #2563eb)", fontWeight: 600, fontSize: 14, height: 46 }}
          >
            Acceder al sistema
          </Button>

          <Divider my="xl" label={<Text size="xs" c="dimmed">Acceso de demostración</Text>} labelPosition="center" />

          <Stack gap={8}>
            {USERS.map((u) => (
              <UnstyledButton
                key={u.role}
                onClick={() => { setUsername(u.username); setPassword("1234"); }}
                style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", background: C.cardBg, cursor: "pointer", transition: "border-color 0.15s" }}
              >
                <Group justify="space-between">
                  <Box>
                    <Text style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary }}>{u.label}</Text>
                    <Text style={{ fontSize: 12, color: C.textMuted }}>
                      usuario: <strong style={{ color: C.textSecondary }}>{u.username}</strong> · clave: 1234
                    </Text>
                  </Box>
                  <ArrowRight size={14} color={C.textSubtle} />
                </Group>
              </UnstyledButton>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Recovery Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={<Text fw={600} style={{ color: C.textPrimary }}>Recuperar contraseña</Text>}
        centered
        radius="lg"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Ingrese su correo electrónico institucional y recibirá un enlace seguro para restablecer su contraseña.
          </Text>
          <TextInput
            label="Correo electrónico"
            placeholder="usuario@empresa.com.ar"
            leftSection={<Mail size={15} />}
            value={recoverEmail}
            onChange={(e) => setRecoverEmail(e.currentTarget.value)}
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="subtle" color="gray" onClick={close}>Cancelar</Button>
            <Button onClick={handleRecover} color="blue">Enviar enlace</Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}
