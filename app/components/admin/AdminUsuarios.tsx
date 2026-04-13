import { useState } from "react";
import {
  Card, Text, Group, Badge, Table, Select, Button, Stack,
  ActionIcon, Tooltip, TextInput, Avatar, Switch, Modal,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Search, UserPlus, Edit2, Shield, Users } from "lucide-react";
import { useAppColors } from "../../hooks/useAppColors";

const MOCK_USERS = [
  { id: 1, name: "Admin Principal",    email: "admin@bahiaambiental.gob.ar",    role: "Gerencia",    active: true },
  { id: 2, name: "Juan Pérez",         email: "jperez@bahiaambiental.gob.ar",   role: "Supervisor",  active: true },
  { id: 3, name: "Laura Fernández",    email: "lfernandez@bahiaambiental.gob.ar", role: "RRHH",      active: true },
  { id: 4, name: "Martín Gómez",       email: "mgomez@bahiaambiental.gob.ar",   role: "Supervisor",  active: true },
  { id: 5, name: "Carolina Díaz",      email: "cdiaz@bahiaambiental.gob.ar",    role: "RRHH",        active: false },
  { id: 6, name: "Diego Ramírez",      email: "dramirez@bahiaambiental.gob.ar", role: "Supervisor",  active: true },
  { id: 7, name: "Silvia Morales",     email: "smorales@bahiaambiental.gob.ar", role: "Gerencia",    active: true },
];

const ROLES = ["Gerencia", "Supervisor", "RRHH"];

const roleBadgeColor: Record<string, string> = {
  Gerencia: "blue",
  Supervisor: "violet",
  RRHH: "teal",
};

export function AdminUsuarios() {
  const C = useAppColors();
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<typeof MOCK_USERS[0] | null>(null);
  const [editRole, setEditRole] = useState<string>("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const toggleActive = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );
    const user = users.find((u) => u.id === id);
    notifications.show({
      title: user?.active ? "Usuario desactivado" : "Usuario activado",
      message: `${user?.name} fue ${user?.active ? "desactivado" : "activado"}.`,
      color: user?.active ? "orange" : "teal",
    });
  };

  const openEditRole = (user: typeof MOCK_USERS[0]) => {
    setEditingUser(user);
    setEditRole(user.role);
  };

  const saveRole = () => {
    if (!editingUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? { ...u, role: editRole } : u))
    );
    notifications.show({
      title: "Rol actualizado",
      message: `${editingUser.name} ahora es ${editRole}.`,
      color: "blue",
    });
    setEditingUser(null);
  };

  return (
    <Stack gap="md">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <Text style={{ color: C.textPrimary, fontSize: 22, fontWeight: 700 }}>Usuarios y Roles</Text>
          <Text style={{ color: C.textMuted, fontSize: 13 }}>
            Gestione los usuarios del sistema y sus permisos de acceso.
          </Text>
        </div>
        <Button leftSection={<UserPlus size={15} />} color="blue" size="sm">
          Nuevo usuario
        </Button>
      </div>

      <Card padding="sm" radius="md" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}` }}>
        <Group gap="md">
          <TextInput
            placeholder="Buscar por nombre, email o rol..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            leftSection={<Search size={14} />}
            size="sm"
            style={{ flex: 1, minWidth: 200 }}
          />
          <Group gap={6}>
            <Badge color="blue" variant="light" size="sm">{users.filter((u) => u.role === "Gerencia").length} Gerencia</Badge>
            <Badge color="violet" variant="light" size="sm">{users.filter((u) => u.role === "Supervisor").length} Supervisores</Badge>
            <Badge color="teal" variant="light" size="sm">{users.filter((u) => u.role === "RRHH").length} RRHH</Badge>
          </Group>
        </Group>
      </Card>

      <Card padding={0} radius="md" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, overflow: "hidden" }}>
        <Table striped highlightOnHover style={{ fontSize: 13 }}>
          <Table.Thead>
            <Table.Tr style={{ background: C.cardHeaderBg }}>
              <Table.Th style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Usuario</Table.Th>
              <Table.Th style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</Table.Th>
              <Table.Th style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Rol</Table.Th>
              <Table.Th style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Estado</Table.Th>
              <Table.Th style={{ color: C.textMuted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", width: 80 }}>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.map((user) => (
              <Table.Tr key={user.id} style={{ opacity: user.active ? 1 : 0.5 }}>
                <Table.Td>
                  <Group gap="sm">
                    <Avatar color={roleBadgeColor[user.role]} radius="xl" size="sm">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </Avatar>
                    <Text style={{ color: C.textPrimary, fontWeight: 600, fontSize: 13 }}>{user.name}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text style={{ color: C.textMuted, fontSize: 12 }}>{user.email}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={roleBadgeColor[user.role]} variant="light" size="sm">
                    {user.role}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Switch
                    checked={user.active}
                    onChange={() => toggleActive(user.id)}
                    size="sm"
                    color="teal"
                  />
                </Table.Td>
                <Table.Td>
                  <Tooltip label="Cambiar rol">
                    <ActionIcon variant="subtle" color="blue" size="sm" onClick={() => openEditRole(user)}>
                      <Edit2 size={14} />
                    </ActionIcon>
                  </Tooltip>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center" }}>
            <Text style={{ color: C.textMuted, fontSize: 13 }}>No se encontraron usuarios.</Text>
          </div>
        )}
      </Card>

      {/* Modal editar rol */}
      <Modal
        opened={editingUser !== null}
        onClose={() => setEditingUser(null)}
        title={
          <Group gap="sm">
            <Shield size={18} color="#2563eb" />
            <Text style={{ fontWeight: 700, fontSize: 15, color: C.textPrimary }}>Cambiar rol</Text>
          </Group>
        }
        size="sm"
        centered
      >
        {editingUser && (
          <Stack gap="md">
            <Group gap="md">
              <Avatar color={roleBadgeColor[editingUser.role]} radius="xl" size="lg">
                {editingUser.name.split(" ").map((n) => n[0]).join("")}
              </Avatar>
              <div>
                <Text style={{ fontWeight: 600, color: C.textPrimary }}>{editingUser.name}</Text>
                <Text style={{ fontSize: 12, color: C.textMuted }}>{editingUser.email}</Text>
              </div>
            </Group>
            <Select
              label="Rol"
              data={ROLES}
              value={editRole}
              onChange={(v) => setEditRole(v || "")}
              size="sm"
            />
            <Group justify="flex-end" gap="xs">
              <Button variant="default" size="sm" onClick={() => setEditingUser(null)}>Cancelar</Button>
              <Button color="blue" size="sm" onClick={saveRole}>Guardar</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
