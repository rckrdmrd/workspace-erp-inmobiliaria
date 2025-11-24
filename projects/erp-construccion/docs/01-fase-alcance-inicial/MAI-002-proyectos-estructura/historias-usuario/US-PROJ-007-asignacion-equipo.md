# US-PROJ-007: Asignación de Equipo al Proyecto

**Épica:** MAI-002 - Proyectos y Estructura de Obra
**Sprint:** Sprint 6
**Story Points:** 4 SP
**Prioridad:** P1 (Alta)
**Estimación:** 2 días

---

## Historia de Usuario

**Como** Director de Proyectos
**Quiero** asignar miembros del equipo al proyecto con sus roles y porcentaje de dedicación
**Para** organizar las responsabilidades y controlar la carga de trabajo de cada persona

---

## Criterios de Aceptación

### ✅ AC1: Dashboard de Equipo

**Dado** que accedo a tab "Equipo" del proyecto
**Entonces** veo:

```
┌────────────────────────────────────────────────┐
│ Equipo del Proyecto  (7 miembros)  [+ Agregar]│
├────────────────────────────────────────────────┤
│                                                │
│ 👑 Director (1)                                │
│   • Juan Pérez ⭐ Principal                     │
│     100% dedicación                            │
│     Desde: 01/09/2025                          │
│                                                │
│ 🏗️ Residentes (2)                              │
│   • María López ⭐ Principal                    │
│     100% dedicación                            │
│   • Carlos Ruiz (Suplente)                     │
│     50% dedicación                             │
│                                                │
│ 🔧 Ingenieros (3)                               │
│   • Ana Torres - Estructural                   │
│     25% dedicación                             │
│   • Luis Gómez - Instalaciones                 │
│     25% dedicación                             │
│   • Pedro Sánchez - Costos                     │
│     50% dedicación                             │
│                                                │
│ 📦 Gerente de Compras (1)                      │
│   • Sofia Ramírez                              │
│     25% dedicación (atiende 8 proyectos)       │
│                                                │
└────────────────────────────────────────────────┘
```

### ✅ AC2: Agregar Miembro al Equipo

**Formulario:**
- Usuario: [Buscar usuario ▼]
- Rol: Director / Residente / Ingeniero / Supervisor / Gerente Compras
- Especialidad (si es Ingeniero): Estructural / Instalaciones / Eléctrico / Costos
- Es principal: ☑ (solo 1 por rol Director/Residente)
- Dedicación: [100] % (rango: 1-100)
- Fecha inicio: [15/11/2025]
- Fecha fin: [__/__/____] (opcional, dejar vacío si es indefinida)
- Responsabilidades: [Textarea con lista]

**Validaciones:**
1. **Workload límites:**
   - Director: max 500% (5 proyectos a 100%)
   - Residente: max 200% (2 proyectos a 100%)
   - Ingeniero: max 800% (8 proyectos)
   - Supervisor: max 100% (1 proyecto)

2. **Solo un principal:**
   - Si intento marcar Director como principal y ya existe otro principal
   - Error: "Ya existe un Director principal (Juan Pérez)"

3. **Validar workload disponible:**
   - Si usuario tiene 450% ya asignado (Director)
   - Intento asignar 100% más
   - Error: "Usuario ya tiene 450% de carga. Límite: 500%. Solo puede asignar 50% adicional"

### ✅ AC3: Visualización de Carga de Trabajo

**Dado** que selecciono un usuario
**Entonces** veo resumen:

```
Usuario: Juan Pérez (Director)

Carga total: 450% / 500% ───────────▓▓▓▓▓▓▓▓▓░─ 90%
                                    ⚠️ Cerca del límite

Proyectos asignados:
  • Fraccionamiento Los Pinos - 100% (Principal)
  • Conjunto Jardines - 100%
  • Torre Central - 100%
  • Residencial Vista - 100%
  • Plaza Comercial - 50%

Disponible para asignar: 50%
```

**Indicadores:**
- 🟢 Verde: 0-70% de límite
- 🟡 Amarillo: 70-90%
- 🔴 Rojo: 90-100%

### ✅ AC4: Editar/Desactivar Asignación

**Editar:**
- Cambiar porcentaje de dedicación
- Actualizar especialidad
- Modificar responsabilidades
- NO se puede cambiar de rol (eliminar y crear nueva)

**Desactivar:**
- Botón "Terminar Asignación"
- Pedir fecha de fin
- Marca `isActive = false`
- Usuario sale del dashboard de equipo activo

### ✅ AC5: Permisos

**Solo Director y Admin pueden:**
- Agregar miembros
- Editar asignaciones
- Desactivar asignaciones

**Todos pueden:**
- Ver equipo del proyecto

---

## Escenarios de Prueba

**Escenario 1:** Asignar Director principal
**Given** proyecto sin Director
**When** asigno Juan Pérez como Director principal al 100%
**Then** asignación se crea exitosamente
**And** aparece en dashboard con badge "Principal"

**Escenario 2:** Validación de límite de workload
**Given** Juan Pérez (Director) tiene 480% asignado
**When** intento asignar 50% adicional
**Then** sistema permite (total: 530% está dentro de límite)
**When** intento asignar 100%
**Then** sistema bloquea: "Excede límite de 500%"

**Escenario 3:** Cambio de residente principal
**Given** María es Residente principal
**When** marco a Carlos como principal
**Then** sistema desmarca a María automáticamente
**And** Carlos queda como nuevo principal

---

## Definición de Done

- [ ] Dashboard de equipo funcional
- [ ] Formulario de asignación con validaciones
- [ ] Cálculo de workload en tiempo real
- [ ] Validación de límites por rol
- [ ] Solo un principal por Director/Residente
- [ ] Indicadores visuales de carga
- [ ] Desactivación de asignaciones
- [ ] Tests de validación de workload
- [ ] Permisos por rol implementados

---

## Notas Técnicas

**Endpoints:**
```
POST   /api/projects/:projectId/team
GET    /api/projects/:projectId/team
GET    /api/projects/:projectId/team/dashboard
PUT    /api/team-assignments/:id
PUT    /api/team-assignments/:id/deactivate
GET    /api/users/:userId/workload
```

**Función SQL:**
```sql
SELECT get_user_total_workload('userId', 'constructoraId');
-- Retorna: INTEGER (% total)
```

---

**Estado:** ✅ Ready for Development
