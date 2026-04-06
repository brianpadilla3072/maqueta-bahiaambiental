DYNNAMO CRYPT S.A.
Cotizacion Tecnica de Horas

Sistema de Control de Asistencia
con Reconocimiento Facial

Cliente: Bahia Ambiental
Dispositivo: Anviz FaceDeep 3M
Fecha: Marzo 2026

1. Contexto del Proyecto
Bahia Ambiental opera servicios de recoleccion y barrido en la ciudad de Bahia Blanca con mas
de 500 operarios distribuidos en multiples estaciones de barrido. Actualmente el control de
asistencia se realiza mediante tarjeta fisica y planilla en papel, con tres personas de Recursos
Humanos dedicadas a la carga y verificacion manual semana a semana.
El objetivo es implementar un sistema web integral que, combinado con dispositivos de
reconocimiento facial Anviz FaceDeep 3M instalados en cada estacion, automatice el registro de
jornada laboral, la validacion por parte de los supervisores, y la generacion de reportes para
Recursos Humanos.
Arquitectura general
El sistema propuesto actua como servidor central con base de datos propia en la nube. El
sistema DAS (sistema de nomina operado por Gustavo) consulta a este mediante vistas
especificas de base de datos, sin acceso completo. No se exportan archivos: cuando Recursos
Humanos guarda informacion en nuestro sistema, esta queda disponible automaticamente en
las vistas que el DAS consume. El mecanismo de sincronizacion (cron job o consulta en tiempo
real) es responsabilidad del equipo del DAS.
Datos que vienen del DAS (datos vivos)
La siguiente informacion se consulta en tiempo real desde el DAS al momento de cada
enrolamiento, a traves de vistas expuestas por Gustavo:
● Legajo / numero de ID del empleado
● Categoria (peon, chofer, chofer di uno, barrendero, etc.)
● Estado del empleado (activo / baja) - los dados de baja no pueden enrolarse
● Justificaciones precargadas (vacaciones, RT, salida gremial, licencia, enfermedad)
● Turnos asignados
Trabajo previo ya realizado
Se partio de un proyecto de codigo abierto que fue modificado completamente para adaptarlo a
las necesidades del proyecto. El resultado es un servidor ya en produccion que gestiona la
comunicacion directa con los dispositivos FaceDeep 3M, incluyendo:
● Comunicacion con dispositivos via protocolo propietario Anviz (TCP puerto 5010)
● 57 funcionalidades de gestion: empleados, registros biometricos, configuracion de
dispositivos
● Propagacion automatica de altas/bajas de personal a todos los dispositivos
● Registro de marcaciones en tiempo real con notificaciones instantaneas
● Base de datos con 9 tablas de datos de dispositivos
● Desplegado y funcionando en servidor de produccion (AWS EC2)
Tiempo invertido en este desarrollo previo: 8 horas (ya ejecutadas, no incluidas en esta
cotizacion).

El sistema que se cotiza a continuacion se construye sobre esta base, agregando la capa de
gestion de usuarios, logica de jornadas laborales, validacion de supervisores, panel de RRHH,
integracion con el DAS y aplicacion mobile.

2. Tecnologias Utilizadas
Componente Tecnologia
Servidor de aplicacion NestJS (Node.js) - Framework robusto para APIs
Base de datos PostgreSQL - Base de datos relacional
Autenticacion JWT con cookies seguras HTTP-only
Interfaz web React con Mantine (libreria de componentes

profesionales)

App mobile PWA (Progressive Web App) - Se instala desde el

navegador

Validacion de datos Zod - Validacion automatica en cliente y servidor
Infraestructura AWS EC2, Docker, Nginx (ya configurado y

funcionando)

Integracion DAS Vistas de PostgreSQL expuestas al sistema de

nomina

3. Roles del Sistema
Rol Capacidades Restricciones
Empleado / Operario Solo registra su jornada con
reconocimiento facial

Sin acceso al sistema web

Supervisor Abre/cierra jornadas, valida
marcaciones, agrega
observaciones, enrola personal,
gestiona cuadrilla del dia

No puede eliminar registros;
solo aprobar/rechazar +
observaciones

Recursos Humanos Consulta y exporta datos, carga
justificaciones por periodo,
visualiza KPIs, edita registros con
trazabilidad

Toda edicion queda auditada

Administrador Alta/baja de usuarios,
configuracion global, gestion de
estaciones y dispositivos

Control total del sistema

4. Desglose de Modulos y Horas
A continuacion se detalla cada modulo del sistema con su descripcion funcional, tareas
principales y horas estimadas.
4.1 Configuracion Inicial del Proyecto
Preparacion de la estructura base del proyecto: servidor, interfaz web, base de datos y
herramientas de desarrollo.
Total del modulo: 10 horas
Tarea Area Horas

Estructura del proyecto (servidor
+ interfaz web)

Servidor 1.5

Configuracion del framework del
servidor

Servidor 2

Configuracion de base de datos
y datos iniciales

Servidor 1.5

Configuracion de la interfaz web
y diseno base

Interfaz 2

Sistema de navegacion y
comunicacion con servidor

Interfaz 1.5

Almacenamiento local y
validacion de datos

Interfaz 1.5

4.2 Autenticacion y Gestion de Usuarios
Sistema de acceso seguro con usuario y contrasena, gestion de roles y permisos por tipo de
usuario.
Total del modulo: 16 horas
Tarea Area Horas
Modelo de usuario en base de
datos

Servidor 0.5

Inicio de sesion seguro con
tokens y cookies

Servidor 3

Sistema de permisos por rol
(Admin, Supervisor, RRHH)

Servidor 1.5

Alta, baja y modificacion de
usuarios

Servidor 2.5
Cambio de contrasena Servidor 1.5
Pantalla de inicio de sesion Interfaz 1.5
Proteccion de pantallas segun
rol

Interfaz 1.5

Menu y navegacion adaptada a
cada rol

Interfaz 2

Pantalla de administracion de
usuarios

Interfaz 2

4.3 Estaciones de Barrido
Gestion de las estaciones (cajas de barrido) donde se instalan los dispositivos FaceDeep. Incluye
mapa interactivo con ubicacion y estado de cada estacion.
Total del modulo: 12 horas
Tarea Area Horas
Modelo de estacion en base de
datos

Servidor 0.5

Alta, baja y modificacion de
estaciones

Servidor 2.5

Vinculacion de dispositivo
FaceDeep a estacion

Servidor 1

Listado de estaciones con estado
del dispositivo

Interfaz 2

Formulario de alta/edicion con
selector en mapa

Interfaz 2.5

Mapa interactivo con todas las
estaciones (colores por estado)

Interfaz 3.5

4.4 Gestion de Empleados / Operarios
Administracion del personal: los datos de legajo, DNI, categoria laboral, estado y turno se
consultan en tiempo real desde el DAS al momento del enrolamiento. Los empleados dados de
baja en el DAS no pueden enrolarse. El enrolamiento facial se realiza mediante el dispositivo
FaceDeep.
Total del modulo: 22 horas

Diagrama: Flujo de alta y enrolamiento de operario

Diagrama: Flujo de rmarcado

Diagrama: Flujo de observación

Tarea Area Horas

Modelo de empleado (legajo,
DNI, categoria, puesto)

Servidor 1.5

Alta, baja, modificacion y
busqueda de empleados

Servidor 2.5

Consulta en tiempo real al DAS
al enrolar (datos vivos)

Servidor 3

Validacion de estado activo/baja
antes de permitir enrolamiento

Servidor 1

Sincronizacion con dispositivos
al crear/eliminar empleado

Servidor 3

Enrolamiento facial (captura de
rostro y distribucion a
dispositivos)

Servidor 2

Listado con filtros y busqueda Interfaz 2.5
Ficha de empleado (datos,
marcaciones, observaciones)

Interfaz 2.5

Formulario de alta/edicion con
validaciones

Interfaz 2

Flujo visual de enrolamiento
facial

Interfaz 2

4.5 Dispositivos FaceDeep - Panel de Control
Visualizacion y gestion de todos los dispositivos FaceDeep conectados. Mapa en tiempo real con
estado de cada estacion (encendida/apagada). Acciones remotas.
Total del modulo: 15 horas
Tarea Area Horas
Servicio de comunicacion con el
SDK de dispositivos

Servidor 2.5

Receptor de marcaciones en
tiempo real

Servidor 2

Monitoreo de estado
online/offline automatico

Servidor 1.5

Mapa en tiempo real con todas
las estaciones y estado

Interfaz 4.5

Listado de dispositivos con
acciones rapidas

Interfaz 2.5

Pantalla de detalle (capacidad,
firmware, configuracion)

Interfaz 2

4.6 Jornadas Laborales y Marcaciones
Modulo central del sistema. Gestion completa del ciclo de jornada: apertura por supervisor con
lista sugerida de cuadrilla basada en historial, marcaciones de entrada/salida con
reconocimiento facial, sistema de colores para estado de cada marcacion, observaciones
obligatorias ante irregularidades, incorporacion de empleados inesperados, y notificaciones
automaticas de ausencias justificadas precargadas por RRHH.
Total del modulo: 47 horas

Sistema de colores del panel
Color Significado
Verde Entrada y salida correctas, sin irregularidades
Amarillo Alguna observacion (tardanza, salida anticipada,

cambio de turno, etc.)
Rojo Ausencia no justificada
Si entro bien pero salio con observacion: amarillo. Si tiene justificacion precargada por RRHH: no
aparece en rojo, aparece con el tipo de ausencia.
Observaciones
El campo de observaciones es texto libre (no tabulado) dado que los casos son altamente
variables. Solo los supervisores pueden escribir observaciones; RRHH puede leerlas y
exportarlas. Las observaciones son obligatorias ante cualquier irregularidad (tardanza mayor a
15 min, salida anticipada, ausencia sin justificacion, incorporacion inesperada).
Casos de uso documentados:
● Jornada terminada antes de horario por finalizacion de ruta ("Cuadrilla completa termino a
las 12:00")
● Horas extra en otra unidad de negocio ("Empleado fue a hacer horas extra en Barrido
Centro")
● Cambio de turno entre operarios ("Cambio de turno: reemplazo a [nombre] en turno noche
del [fecha]")
● Ingreso fuera de horario habilitado por el supervisor ("Ingreso fuera de horario por causa X")
● Ausencias justificadas o situaciones especiales

Tarea Area Horas
Modelo de jornada (apertura,
cierre, estacion, supervisor)

Servidor 1

Modelo de marcacion
(entrada/salida, estado, color)

Servidor 1.5

Modelo de observaciones (texto
libre, historial)

Servidor 0.5

Apertura de jornada con lista
sugerida por historial de
estacion

Servidor 2.5

Cierre de jornada con
validaciones

Servidor 1

Recepcion y procesamiento de
marcaciones del dispositivo

Servidor 3.5

Logica de colores
(verde/amarillo/rojo) segun
estado

Servidor 1.5

Observacion obligatoria por
tardanza mayor a 15 minutos

Servidor 1.5

Registro de salida con
motivo/observacion

Servidor 1.5

Deteccion de doble turno con
observacion

Servidor 1.5

Incorporacion de empleado
inesperado (reemplazo) con
observacion

Servidor 1

Registro de horas extra de otra
unidad de negocio con
observacion

Servidor 1

Notificacion al supervisor por
ausencia justificada precargada

Servidor 2

Aprobacion/rechazo de
marcaciones (individual y
masiva)

Servidor 2.5

Sistema de observaciones de
texto libre

Servidor 1.5
Deteccion de salida anticipada Servidor 1.5
Resumen automatico de jornada
(asistentes, ausentes, horas)

Servidor 2

Interfaz de lista sugerida de
cuadrilla (agregar/quitar
empleados)

Interfaz 2.5

Panel de jornada para el
supervisor con sistema de
colores

Interfaz 4.5

Actualizacion en vivo de
marcaciones

Interfaz 3

Alertas visuales de
irregularidades

Interfaz 2

Boton de incorporacion
inesperada + observacion

Interfaz 1.5

Pantalla de observaciones con
atajos frecuentes

Interfaz 2.5

Historial de jornadas pasadas
con filtros

Interfaz 3.5

4.7 Panel de Recursos Humanos
Panel de consulta y gestion para RRHH. Incluye dashboard con KPIs generados desde
observaciones (tardanzas sistematicas, patrones de ausencia), carga de justificaciones por
periodo y por persona, vista de legajo, y edicion de registros con trazabilidad. Al guardar, los
datos quedan disponibles automaticamente en las vistas que consume el DAS.
El panel prioriza los registros con observaciones pendientes de revision, destacandolos
visualmente. Los registros sin observacion (flujo normal) se muestran en segundo plano. Desde
el legajo de cada empleado, RRHH puede acceder de manera directa a todas sus observaciones
historicas.
Total del modulo: 30.5 horas
Tarea Area Horas
Consulta avanzada de registros
(filtros multiples)

Servidor 3

Vista de legajo con resumen
mensual

Servidor 2.5

Edicion de registros con
trazabilidad completa

Servidor 3

Carga de justificaciones por
periodo y por persona
(enfermedad, licencia,
vacaciones, RT, salida gremial)

Servidor 3

Registro manual de ausencias Servidor 1.5
Generacion de KPIs desde
observaciones (tardanzas
sistematicas, patrones)

Servidor 2

Dashboard con graficos y KPIs
(asistencia, tardanzas, horas,
patrones)

Interfaz 4

Tabla de registros con destacado
de observaciones pendientes de
revision

Interfaz 4

Ficha de legajo para RRHH
(resumen + registros + ausencias
+ justificaciones +
observaciones)

Interfaz 3.5

Pantalla de carga de
justificaciones por periodo

Interfaz 3

Indicadores de KPI en fichas de
empleado

Interfaz 1

4.8 Configuracion Global
Panel de administracion para configurar parametros globales del sistema: umbral de tardanza
para observacion obligatoria, horarios, y parametros generales. La configuracion se simplifica
dado que no hay tolerancia fija ni anti-duplicado: siempre se registra la hora real.
Total del modulo: 9 horas
Tarea Area Horas
Modelo de configuracion y
valores por defecto

Servidor 1

Lectura y actualizacion de
parametros

Servidor 1.5
Validacion de parametros Servidor 1.5
Propagacion de configuracion a
dispositivos

Servidor 1

Panel de configuracion con
pestanas tematicas

Interfaz 2

Vista previa y confirmacion de
cambios

Interfaz 2

4.9 Auditoria y Trazabilidad
Registro automatico de todas las acciones del sistema: quien hizo que y cuando. Permite auditar
cambios en registros, usuarios y configuracion.

Total del modulo: 8 horas
Tarea Area Horas
Modelo de registro de auditoria Servidor 0.5
Captura automatica de cambios
en el sistema

Servidor 2.5
Consulta de auditoria con filtros Servidor 2
Visor de auditoria con detalle de
cambios

Interfaz 2

Linea de tiempo en fichas de
empleado/registro

Interfaz 1

4.10 Testing y Control de Calidad
Pruebas automatizadas para garantizar el correcto funcionamiento de la logica de marcaciones,
autenticacion, integracion con DAS, y flujos completos del sistema.
Total del modulo: 16 horas
Tarea Area Horas
Pruebas de logica de marcacion
(colores, observaciones
obligatorias, cuadrilla)

Pruebas 3

Pruebas de autenticacion y
permisos

Pruebas 2

Pruebas de gestion de
empleados y estaciones

Pruebas 2

Prueba de flujo completo de
jornada

Pruebas 2.5

Prueba de flujo completo de
enrolamiento con consulta DAS

Pruebas 2.5

Prueba de integracion con
dispositivo fisico FaceDeep

Pruebas 3

Prueba de vistas expuestas al
DAS

Pruebas 1

4.11 App Mobile para Supervisores (PWA)
Version mobile de la aplicacion optimizada para supervisores en campo. Se instala desde el
navegador sin necesidad de tienda de aplicaciones. Funciona sin conexion a internet. Incluye
sistema de colores y flujo de incorporacion inesperada.
Total del modulo: 24 horas
Tarea Area Horas
Configuracion de app instalable
(iconos, pantalla de inicio)

Interfaz 3

Navegacion mobile con pestanas
inferiores

Interfaz 2.5

Panel de jornada tactil con
sistema de colores (deslizar para
aprobar/rechazar)

Interfaz 4.5

Flujo de incorporacion
inesperada en mobile

Interfaz 1

Pantalla de observaciones
optimizada para celular

Interfaz 2.5

Funcionamiento sin conexion
(cola de acciones, sincronizacion
al reconectar)

Interfaz 6

Notificaciones push
(marcaciones pendientes,
tardanzas, jornada abierta)

Interfaz 4.5

4.12 Integracion DAS
Exposicion de vistas de base de datos para que el sistema DAS (nomina) pueda consultar la
informacion generada por nuestro sistema. Cuando RRHH guarda datos (justificaciones, registros
editados), estos quedan disponibles automaticamente en las vistas. El mecanismo de consulta
(cron job o tiempo real) es responsabilidad del equipo del DAS.
Total del modulo: 6.5 horas
Tarea Area Horas
Diseno de vistas/tablas
expuestas para consulta del DAS

Servidor 2

Control de acceso a las vistas
(permisos limitados, sin acceso
completo a la BD)

Servidor 2

Escritura automatica en tabla
expuesta al guardar desde panel
RRHH

Servidor 1.5

Documentacion tecnica de las
vistas para equipo DAS

Servidor 1

5. Resumen de Horas por Modulo
Modulo Servidor Interfaz Total
1. Configuracion inicial 5 5 10
2. Autenticacion y
usuarios

9 7 16
3. Estaciones de barrido 4 8 12
4. Empleados /
operarios

13 9 22

5. Dispositivos
FaceDeep

6 9 15

6. Jornadas y
marcaciones

27 20 47

7. Panel de Recursos
Humanos

15 15.5 30.5
8. Configuracion global 5 4 9
9. Auditoria 5 3 8
10. Testing y calidad - - 16
11. App mobile
supervisor (PWA)

- 24 24
12. Integracion DAS 6.5 - 6.5
Servidor Interfaz Horas
Subtotal desarrollo 95.5 104.5 216
Contingencia (15%) 32.5
TOTAL 248.5

6. Trabajo Previo Realizado (No incluido en esta cotizacion)
Tiempo invertido: 8 horas de desarrollo (ya ejecutadas)
Se partio de un proyecto de codigo abierto que fue modificado completamente para adaptarlo a
las necesidades de Bahia Ambiental. El servidor resultante ya se encuentra desplegado y
funcionando en produccion, y provee:
● Comunicacion directa con dispositivos FaceDeep 3M (protocolo propietario Anviz)
● 57 funcionalidades de gestion de dispositivos, personal y registros biometricos
● Alta/baja automatica de personal en todos los dispositivos simultaneamente
● Registro de marcaciones en tiempo real con notificaciones
● Base de datos dedicada para datos de dispositivos
● Servidor en produccion en AWS con Docker y Nginx
Este servidor es la base sobre la cual se construye el sistema cotizado.

7. Informacion Pendiente de Solicitar
A Bahia Ambiental / Gustavo
● Listado completo de categorias existentes
● Listado de todos los turnos con horarios
● Definir estructura exacta de las vistas del DAS que van a compartir
● Confirmar columnas de las tablas que necesitamos
● Confirmar esquema de integracion: tiempo real vs cron job (responsabilidad del DAS)
A definir internamente
● Detalle del panel de RRHH para carga de justificaciones por periodo

8. Notas y Exclusiones
Incluido
● Desarrollo completo de servidor y interfaz web para cada modulo
● App mobile instalable (PWA) para supervisores con soporte offline
● Integracion con el servidor de dispositivos FaceDeep ya existente
● Vistas de base de datos expuestas para consulta del DAS
● Sistema de colores (verde/amarillo/rojo) para estado de marcaciones
● Gestion de cuadrillas rotativas con lista sugerida por historial
● Carga de justificaciones por periodo desde panel de RRHH
● KPIs generados desde observaciones
● Sistema de auditoria con trazabilidad completa
● Testing y control de calidad
● Contingencia del 15% para imprevistos tecnicos
No incluido
● Diseno UI/UX personalizado (se utiliza libreria de componentes profesional)
● Aplicacion mobile nativa (iOS/Android) - se ofrece PWA como alternativa
● Mecanismo de sincronizacion del DAS (cron job o tiempo real) - responsabilidad del equipo
DAS

Dynnamo Crypt S.A. - Bahia Blanca, Argentina - Marzo 2026