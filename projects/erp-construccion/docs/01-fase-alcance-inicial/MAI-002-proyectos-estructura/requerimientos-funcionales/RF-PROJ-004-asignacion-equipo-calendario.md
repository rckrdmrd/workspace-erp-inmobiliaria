# RF-PROJ-004: Asignación de Equipo y Calendario

**Epic:** MAI-002 - Proyectos y Estructura de Obra
**Tipo:** Requerimiento Funcional
**Prioridad:** Alta (P1)
**Estado:** 📋 Pendiente
**Última actualización:** 2025-11-17

---

## 📋 Descripción

El sistema debe permitir asignar personal clave al proyecto (director, residentes, ingenieros, supervisores) y gestionar el calendario general de obra con hitos, fases constructivas y fechas críticas. Esto facilita la organización del equipo de trabajo y el seguimiento de la programación del proyecto.

---

## 🎯 Objetivos

1. **Organización:** Definir equipo responsable del proyecto con roles claros
2. **Trazabilidad:** Registrar quién trabaja en qué proyecto y desde cuándo
3. **Planificación:** Programar hitos clave y fases constructivas
4. **Control:** Monitorear cumplimiento de fechas programadas
5. **Comunicación:** Notificar al equipo de cambios y eventos importantes

---

## 👥 Roles del Equipo de Proyecto

### 1. Director de Obra

**Responsabilidad:** Responsable general del proyecto, toma decisiones estratégicas

```yaml
Rol: director
Perfil requerido:
  - Ingeniero Civil o Arquitecto
  - Mínimo 10 años de experiencia
  - Licencia de constructor (si aplica)
Responsabilidades:
  - Supervisión general del proyecto
  - Aprobación de estimaciones
  - Gestión de contratos con clientes
  - Toma de decisiones estratégicas
  - Representación ante el cliente
Límite de proyectos simultáneos: 5
Acceso en el sistema: Permisos completos en proyectos asignados
```

### 2. Residente de Obra

**Responsabilidad:** Supervisor en sitio, ejecución diaria de la obra

```yaml
Rol: resident
Perfil requerido:
  - Ingeniero Civil, Arquitecto o afín
  - Mínimo 5 años de experiencia
  - Conocimiento de supervisión de obra
Responsabilidades:
  - Supervisión diaria en sitio
  - Control de avances físicos
  - Gestión de cuadrillas
  - Registro de asistencias
  - Supervisión de calidad
  - Gestión de incidencias
  - Requisiciones de materiales
Límite de proyectos simultáneos: 2
Acceso en el sistema: Permisos operativos en proyectos asignados
```

### 3. Ingeniero Especialista

**Responsabilidad:** Soporte técnico especializado (estructural, instalaciones, etc.)

```yaml
Rol: engineer
Especialidades:
  - Ingeniero Estructural
  - Ingeniero en Instalaciones
  - Ingeniero Eléctrico
  - Ingeniero Hidráulico
  - Ingeniero de Costos
Responsabilidades:
  - Revisión de planos ejecutivos
  - Validación de procedimientos constructivos
  - Solución de problemas técnicos
  - Supervisión de instalaciones especializadas
Límite de proyectos simultáneos: 8 (soporte, no tiempo completo)
Acceso en el sistema: Solo lectura y comentarios técnicos
```

### 4. Supervisor de Cuadrilla

**Responsabilidad:** Liderazgo de cuadrilla especializada (albañilería, herrería, etc.)

```yaml
Rol: supervisor_cuadrilla (no es rol del sistema, es empleado HR)
Perfil:
  - Experiencia en oficio (albañilería, plomería, etc.)
  - Capacidad de liderazgo de cuadrilla
Responsabilidades:
  - Coordinar trabajo de cuadrilla
  - Reportar avances al residente
  - Control de calidad de su especialidad
Límite de proyectos simultáneos: 1 (dedicación completa)
Acceso en el sistema: Vía app móvil (registro de avances)
```

### 5. Gerente de Compras

**Responsabilidad:** Gestión de requisiciones y órdenes de compra

```yaml
Rol: purchases
Responsabilidades:
  - Recepción de requisiciones
  - Cotización con proveedores
  - Emisión de órdenes de compra
  - Gestión de almacén
Proyectos: Todos los de la constructora (servicio centralizado)
Acceso en el sistema: Módulo de compras de todos los proyectos
```

---

## 📋 Asignación de Equipo

### 1. Estructura de Asignación

```yaml
# project_team_assignments
id: UUID
project_id: UUID del proyecto
user_id: UUID del usuario (de auth_management.users)
role: director | resident | engineer | purchases | finance | hr
specialty: structural | installations | electrical | costs | null
start_date: 2025-06-01
end_date: null (abierta) | 2026-05-31 (terminada)
is_active: true | false
is_primary: true | false (si es el responsable principal)
workload_percentage: 100 (tiempo completo) | 50 (medio tiempo) | 25 (soporte)

# Metadata
assigned_by: UUID del usuario que hizo la asignación
assigned_at: timestamp
removed_by: UUID (si se desasignó)
removed_at: timestamp
removal_reason: "Fin de proyecto" | "Reasignación" | null
```

### 2. Reglas de Asignación

#### Regla 1: Director Único
- Un proyecto debe tener exactamente 1 director activo
- No puede haber proyecto sin director
- Se puede cambiar de director (cierra asignación anterior, abre nueva)

#### Regla 2: Residente Principal
- Un proyecto debe tener al menos 1 residente marcado como `is_primary: true`
- Puede tener residentes adicionales de soporte
- Residente principal es el contacto principal en sitio

#### Regla 3: Ingenieros de Soporte
- Un proyecto puede tener 0 a N ingenieros especialistas
- No son obligatorios
- Un ingeniero puede estar en múltiples proyectos (workload_percentage distribuido)

#### Regla 4: Límite de Carga de Trabajo
- Director: max 500% (5 proyectos al 100%)
- Residente: max 200% (2 proyectos al 100% o 4 al 50%)
- Ingeniero: max 800% (soporte en múltiples proyectos)

### 3. Casos de Uso de Asignación

#### Caso 1: Arranque de Proyecto
```yaml
Proyecto: Villas del Sol
Asignaciones iniciales:
  - Director: Ing. Roberto Martínez (100%, tiempo completo)
  - Residente Principal: Arq. Ana García (100%, tiempo completo)
  - Ingeniero Estructural: Ing. Carlos López (25%, soporte)
  - Ingeniero de Costos: Ing. María Sánchez (15%, soporte)
```

#### Caso 2: Cambio de Residente
```yaml
# Situación
Residente original: Arq. Ana García (asignada desde 2025-06-01)
Motivo de cambio: Reasignación a otro proyecto

# Acciones
1. Cerrar asignación de Ana:
   - end_date: 2025-10-15
   - is_active: false
   - removal_reason: "Reasignación a Proyecto Alameda"

2. Crear nueva asignación:
   - Nuevo residente: Ing. Luis Ramírez
   - start_date: 2025-10-16
   - is_primary: true
   - workload_percentage: 100

# Resultado
Historial preservado, nuevo responsable activo
```

#### Caso 3: Proyecto con Múltiples Residentes
```yaml
Proyecto grande: Torre Skyline (15 niveles)
Residentes:
  - Residente Principal: Ing. Pedro Gómez (is_primary: true, 100%)
  - Residente de Acabados: Arq. Laura Díaz (is_primary: false, 100%)
  - Residente de Instalaciones: Ing. Miguel Torres (is_primary: false, 50%)

# Justificación
Proyecto grande requiere múltiples residentes especializados
```

---

## 📅 Calendario General del Proyecto

### 1. Hitos del Proyecto (Milestones)

**Definición:** Eventos clave que marcan etapas importantes del proyecto

```yaml
# project_milestones
id: UUID
project_id: UUID
milestone_type:
  - project_kickoff (arranque de proyecto)
  - permits_obtained (permisos obtenidos)
  - construction_start (inicio de construcción)
  - foundation_complete (cimentación terminada)
  - structure_complete (estructura terminada)
  - installations_complete (instalaciones terminadas)
  - finishes_start (inicio de acabados)
  - first_delivery (primera entrega)
  - urbanization_complete (urbanización terminada)
  - final_delivery (entrega final)
  - project_closure (cierre administrativo)
name: "Inicio de Construcción"
description: "Arranque oficial de obra en campo"
planned_date: 2025-06-15
actual_date: 2025-06-20 (si ya ocurrió) | null
status: pending | in_progress | completed | delayed
responsible: UUID del usuario responsable
dependencies: [milestone_id_1, milestone_id_2] (hitos previos requeridos)
```

#### Ejemplo de Hitos para Fraccionamiento
```yaml
1. Arranque de Proyecto: 2025-05-01 ✅ (completado)
2. Permisos Obtenidos: 2025-05-28 ✅ (completado)
3. Inicio de Construcción: 2025-06-15 ✅ (completado 20/06)
4. Urbanización Etapa 1: 2025-08-30 🚧 (en progreso)
5. Primeras 20 Casas: 2025-10-15 📋 (pendiente)
6. Entrega Etapa 1 Completa: 2026-01-31 📋
7. Cierre del Proyecto: 2026-05-15 📋
```

### 2. Fases Constructivas

**Definición:** Periodos de tiempo para completar actividades específicas

```yaml
# construction_phases
id: UUID
project_id: UUID
phase_type:
  - preliminary_work (trabajos preliminares)
  - foundation (cimentación)
  - structure (estructura)
  - walls (muros)
  - roof (techos)
  - installations (instalaciones)
  - finishes (acabados)
  - urbanization (urbanización)
  - cleanup (limpieza y entrega)
name: "Fase de Cimentación Etapa 1"
start_date: 2025-06-15
end_date: 2025-07-30
status: planned | active | completed | paused
progress_percentage: 65.5 (calculado de avances físicos)
assigned_team: [user_id_1, user_id_2]
budget_assigned: 2500000.00 MXN
```

### 3. Fechas Críticas (Deadlines)

**Definición:** Fechas límite que no se pueden retrasar sin consecuencias

```yaml
# critical_dates
id: UUID
project_id: UUID
date: 2025-12-15
description: "Entrega comprometida con INFONAVIT"
category: client_commitment | permit_expiration | contract_deadline | financing
alert_days_before: 30 (notificar 30 días antes)
is_hard_deadline: true (no movible) | false (puede negociarse)
consequences_if_missed: "Multa de $500,000 MXN + intereses"
responsible: UUID del director
status: upcoming | at_risk | missed | met
```

---

## 📊 Dashboard del Equipo y Calendario

### Vista del Equipo
```
┌─────────────────────────────────────────┐
│ Equipo del Proyecto: Villas del Sol    │
├─────────────────────────────────────────┤
│ 👔 Director                             │
│    Ing. Roberto Martínez                │
│    Desde: 01/05/2025                    │
│    Proyectos adicionales: 3             │
│                                         │
│ 👷 Residente Principal                  │
│    Arq. Ana García                      │
│    Desde: 01/06/2025                    │
│    Carga: 100% (tiempo completo)        │
│                                         │
│ 🔧 Ingenieros de Soporte                │
│    Ing. Carlos López (Estructural) 25%  │
│    Ing. María Sánchez (Costos) 15%      │
│                                         │
│ 📦 Almacenista                          │
│    Sr. Juan Pérez                       │
└─────────────────────────────────────────┘
```

### Vista del Calendario
```
Línea de Tiempo (2025-2026)

May Jun Jul Ago Sep Oct Nov Dic Ene Feb Mar Abr May
 |───|───|───|───|───|───|───|───|───|───|───|───|
 ✓   ✓   🚧  📋  📋  📋  📋  📋  📋  📋  📋  📋  📋
Inicio  Cim Muro Inst Acab Urb Ent1     Ent2    Cierre

Hitos Críticos:
✓ Permisos: 28/05
✓ Inicio construcción: 15/06
🚧 Primera entrega: 15/10 (EN PROGRESO)
📋 Entrega Etapa 1: 31/01/2026
📋 Cierre: 15/05/2026
```

---

## 💼 Casos de Uso

### CU-PROJ-011: Asignar Equipo al Proyecto

**Actor:** Director de Constructora

**Precondiciones:**
- Proyecto en estado "Adjudicado"
- Usuarios registrados en el sistema

**Flujo Principal:**

1. Usuario accede a proyecto "Villas del Sol"
2. Entra a pestaña "Equipo"
3. Hace clic en "Asignar Director"
4. Busca y selecciona: Ing. Roberto Martínez
5. Define:
   - Fecha inicio: 2025-05-01
   - Workload: 100%
   - Es principal: Sí
6. Guarda asignación
7. Sistema valida:
   - ✅ Roberto no excede límite de carga (tiene 3/5 proyectos)
   - ✅ Proyecto no tiene otro director activo
8. Crea asignación exitosamente
9. Envía notificación a Roberto: "Has sido asignado como Director de 'Villas del Sol'"

**Resultado:** Roberto es ahora director del proyecto, tiene acceso completo

### CU-PROJ-012: Registrar Hito Completado

**Actor:** Residente de Obra

**Precondiciones:**
- Hito "Cimentación Completa" programado para 30/07/2025
- Fecha actual: 28/07/2025

**Flujo Principal:**

1. Residente verifica que cimentación de 80 viviendas está terminada
2. Accede a "Calendario" > "Hitos"
3. Selecciona hito "Cimentación Completa"
4. Hace clic en "Marcar como Completado"
5. Ingresa:
   - Fecha real: 28/07/2025 (2 días antes de lo programado)
   - Comentarios: "Terminado 2 días antes gracias a buen clima"
   - Evidencia: Foto general (5 MB JPG)
6. Confirma
7. Sistema:
   - Cambia estado a "completed"
   - Registra actual_date: 28/07/2025
   - Calcula desviación: -2 días (adelanto)
   - Marca como 🟢 verde (dentro de tiempo)
8. Notifica al equipo del proyecto

**Resultado:** Hito marcado como completado, equipo notificado

### CU-PROJ-013: Alertar de Fecha Crítica Próxima

**Actor:** Sistema (automatizado)

**Precondiciones:**
- Fecha crítica: "Entrega INFONAVIT" el 15/12/2025
- Configurado: Alertar 30 días antes
- Fecha actual: 15/11/2025

**Flujo Automático:**

1. Cron job ejecuta diariamente a las 8:00 AM
2. Detecta fecha crítica en 30 días
3. Genera alerta automática:
   ```
   ⚠️ Fecha Crítica Próxima
   Proyecto: Villas del Sol
   Evento: Entrega comprometida con INFONAVIT
   Fecha límite: 15/12/2025 (30 días)
   Consecuencias si se incumple: Multa $500,000 + intereses
   Avance actual: 75% (requiere acelerar 10%)
   ```
4. Envía notificación a:
   - Director: Ing. Roberto Martínez
   - Residente: Arq. Ana García
   - Cliente (opcional): INFONAVIT
5. Crea alerta en dashboard visible

**Resultado:** Equipo alertado con anticipación, pueden tomar acciones

---

## 🧪 Casos de Prueba

### TC-PROJ-012: Asignar Director ✅

**Entrada:**
```json
{
  "projectId": "uuid-villas-del-sol",
  "userId": "uuid-roberto",
  "role": "director",
  "startDate": "2025-05-01",
  "workload": 100,
  "isPrimary": true
}
```

**Salida Esperada:**
```json
{
  "assignmentId": "uuid-generated",
  "message": "Director asignado exitosamente",
  "notification_sent": true
}
```

### TC-PROJ-013: Validar Límite de Carga ❌

**Entrada:**
```json
{
  "userId": "uuid-director-saturado",  // Ya tiene 500% workload
  "projectId": "nuevo-proyecto",
  "workload": 100
}
```

**Salida Esperada:**
```json
{
  "error": "El usuario excede su límite de carga (500% actual + 100% nuevo = 600%). Máximo permitido: 500%",
  "code": "WORKLOAD_EXCEEDED"
}
```

### TC-PROJ-014: Crear Hito con Dependencias ✅

**Entrada:**
```json
{
  "milestoneType": "construction_start",
  "plannedDate": "2025-06-15",
  "dependencies": ["milestone-permits-id"]  // Requiere permisos primero
}
```

**Validación:**
- Si "milestone-permits" no está completado → Error
- Si está completado → Crear hito ✅

---

## 🔐 Seguridad y Permisos

### Permisos por Rol

| Acción | Director | Engineer | Resident | Purchases |
|--------|----------|----------|----------|-----------|
| Asignar equipo | ✅ | ❌ | ❌ | ❌ |
| Desasignar equipo | ✅ | ❌ | ❌ | ❌ |
| Ver equipo | ✅ | ✅ | ✅ | ✅ |
| Crear hitos | ✅ | ✅ | ❌ | ❌ |
| Marcar hito como completado | ✅ | ✅ | ✅ | ❌ |
| Crear fechas críticas | ✅ | ✅ | ❌ | ❌ |

---

## 📊 Reportes Requeridos

### 1. Resumen del Equipo
```
Director: Ing. Roberto Martínez (3 proyectos activos)
Residente: Arq. Ana García (1 proyecto, dedicación completa)
Ingenieros: 2 de soporte
Personal total: 5 personas
```

### 2. Calendario de Hitos
```
Completados: 3/10 (30%)
En progreso: 2/10 (20%)
Pendientes: 5/10 (50%)
Desviación promedio: -1.5 días (adelantados)
```

### 3. Alertas Activas
```
🔴 Críticas: 1 (Entrega INFONAVIT en 30 días)
🟡 Advertencias: 3 (Hitos con 5% de retraso)
🟢 Ok: 6
```

---

## 📋 Validaciones

1. **Director único:** Solo 1 director activo por proyecto
2. **Residente obligatorio:** Proyecto en ejecución requiere al menos 1 residente
3. **Carga de trabajo:** Validar que usuario no exceda límite de su rol
4. **Fechas lógicas:** start_date < end_date en asignaciones
5. **Dependencias de hitos:** Hitos dependientes no pueden completarse antes que sus requisitos

---

## 🔗 Dependencias

- **RF-AUTH-002:** Sistema de usuarios y roles (MAI-001)
- **RF-HR-001:** Empleados (cuadrillas de construcción) - MAI-007
- **RF-PROG-001:** Avances de obra (cálculo de progreso) - MAI-005

---

## 📈 Métricas de Éxito

- ✅ 100% de proyectos con director y residente asignados
- ✅ 90% de hitos completados dentro de ±5 días de lo programado
- ✅ 0 fechas críticas incumplidas sin notificación previa
- ✅ Tiempo de asignación de equipo: < 5 minutos

---

**Fecha de creación:** 2025-11-17
**Versión:** 1.0
**Autor:** Equipo de Producto
**Revisado por:** Arquitecto de Software
