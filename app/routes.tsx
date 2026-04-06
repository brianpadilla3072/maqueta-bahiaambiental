import { createBrowserRouter, Navigate } from "react-router";
import { LoginPage } from "./components/LoginPage";
import { SupervisorLayout } from "./components/supervisor/SupervisorLayout";
import { SupervisorHome } from "./components/supervisor/SupervisorHome";
import { SupervisorJornada } from "./components/supervisor/SupervisorJornada";
import { HRLayout } from "./components/hr/HRLayout";
import { HRDashboard } from "./components/hr/HRDashboard";
import { HRJustificaciones } from "./components/hr/HRJustificaciones";
import { HRLegajo } from "./components/hr/HRLegajo";
import { HRLegajoLista } from "./components/hr/HRLegajoLista";
import { HRRevisionMensual } from "./components/hr/HRRevisionMensual";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminMapa } from "./components/admin/AdminMapa";
import { AdminDispositivos } from "./components/admin/AdminDispositivos";
import { AdminEnrolamiento } from "./components/admin/AdminEnrolamiento";
import { AdminEstaciones } from "./components/admin/AdminEstaciones";
import { AdminEstacionesDetalle } from "./components/admin/AdminEstacionesDetalle";
import { AdminAuditoria } from "./components/admin/AdminAuditoria";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/supervisor",
    Component: SupervisorLayout,
    children: [
      { index: true, element: <Navigate to="/supervisor/home" replace /> },
      { path: "home", Component: SupervisorHome },
      { path: "jornada", Component: SupervisorJornada },
    ],
  },
  {
    path: "/rrhh",
    Component: HRLayout,
    children: [
      { index: true, element: <Navigate to="/rrhh/dashboard" replace /> },
      { path: "dashboard", Component: HRDashboard },
      { path: "justificaciones", Component: HRJustificaciones },
      { path: "legajo", Component: HRLegajoLista },
      { path: "legajo/:id", Component: HRLegajo },
      { path: "revision", Component: HRRevisionMensual },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, element: <Navigate to="/admin/mapa" replace /> },
      { path: "mapa", Component: AdminMapa },
      { path: "dispositivos", Component: AdminDispositivos },
      { path: "enrolamiento", Component: AdminEnrolamiento },
      { path: "estaciones", Component: AdminEstaciones },
      { path: "estaciones/:id", Component: AdminEstacionesDetalle },
      { path: "auditoria", Component: AdminAuditoria },
    ],
  },
]);