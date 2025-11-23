# TRAZA DE REQUERIMIENTOS - MVP Sistema Administración de Obra

**Proyecto:** MVP Sistema Administración de Obra e INFONAVIT
**Versión:** 1.0.0
**Fecha creación:** 2025-11-17

---

## PROPÓSITO

Este documento traza todos los requerimientos del plan MVP, su análisis, desglose en tareas y estado de implementación.

---

## ESTRUCTURA DE ENTRADAS

```markdown
## [REQ-XXX] Nombre del Requerimiento

**Tipo:** Requerimiento del Plan | Epic | Feature
**Prioridad:** P0 | P1 | P2 | P3
**Módulo:** {nombre-modulo}
**Estado:** ✅ Completado | 🔄 En Progreso | ⏳ Pendiente | ❌ Bloqueado
**Fecha inicio:** YYYY-MM-DD
**Fecha fin:** YYYY-MM-DD (si completado)
**Duración estimada:** X horas/días
**Duración real:** X horas/días (si completado)
**Agente responsable:** {agente}
**Relacionado con:** [REQ-XXX], [DB-XXX], [BE-XXX], [FE-XXX]

### Descripción
Descripción detallada del requerimiento.

### Criterios de Aceptación
- [ ] Criterio 1
- [ ] Criterio 2

### Desglose en Tareas
**Database:**
- [x] DB-001: Crear schema
- [ ] DB-002: Crear tablas

**Backend:**
- [ ] BE-001: Crear entities
- [ ] BE-002: Crear services

**Frontend:**
- [ ] FE-001: Crear páginas
- [ ] FE-002: Crear componentes

### Dependencias
- Depende de: [REQ-XXX]
- Bloquea: [REQ-YYY]

### Bloqueadores
- Ninguno | Lista de bloqueadores

### Documentación
- Plan: orchestration/agentes/requirements-analyst/REQ-XXX/
- ADR: docs/adr/ADR-XXX.md (si aplica)

### Notas
Cualquier nota adicional.
```

---

## REQUERIMIENTOS DEL MVP

### Módulos Core (Fase 1 - 6 semanas)

---

## [REQ-001] Módulo de Preconstrucción y Licitaciones

**Tipo:** Epic
**Prioridad:** P0
**Módulo:** preconstruction-bidding
**Estado:** ⏳ Pendiente
**Fecha inicio:** TBD
**Agente responsable:** TBD

### Descripción
Sistema de gestión de pipeline de oportunidades para licitaciones y programas de INFONAVIT.

### Criterios de Aceptación
- [ ] Pipeline de oportunidades funcional
- [ ] Gestión de documentación de licitaciones
- [ ] Evaluación de viabilidad técnica y financiera
- [ ] Reportes de oportunidades activas

### Desglose en Tareas
**Database:**
- [ ] DB-001: Crear schema preconstruction_management
- [ ] DB-002: Tabla opportunities (licitaciones/oportunidades)
- [ ] DB-003: Tabla opportunity_documents
- [ ] DB-004: Tabla feasibility_studies
- [ ] DB-005: Seeds de desarrollo

**Backend:**
- [ ] BE-001: Module PreconstructionModule
- [ ] BE-002: Entity Opportunity
- [ ] BE-003: Service OpportunityService
- [ ] BE-004: Controller OpportunityController
- [ ] BE-005: DTOs (Create, Update, List)

**Frontend:**
- [ ] FE-001: OpportunitiesPage
- [ ] FE-002: OpportunityDetailPage
- [ ] FE-003: opportunityStore
- [ ] FE-004: OpportunityCard component
- [ ] FE-005: OpportunityForm component

### Dependencias
- Depende de: [REQ-000] Sistema de autenticación (base)
- Bloquea: [REQ-002] Proyectos y Obras

---

## [REQ-002] Módulo de Proyectos, Obras y Estructura de Fraccionamientos

**Tipo:** Epic
**Prioridad:** P0
**Módulo:** projects-developments
**Estado:** ⏳ Pendiente
**Fecha inicio:** TBD
**Agente responsable:** TBD

### Descripción
Gestión de proyectos habitacionales, desarrollos (fraccionamientos), fases y viviendas individuales.

### Criterios de Aceptación
- [ ] Estructura jerárquica: Proyecto → Desarrollo → Fase → Vivienda
- [ ] Gestión de ubicaciones y geometría (polígonos)
- [ ] Estados de avance por nivel
- [ ] Reportes de inventario de viviendas

### Desglose en Tareas
**Database:**
- [ ] DB-010: Crear schema project_management
- [ ] DB-011: Tabla projects
- [ ] DB-012: Tabla developments (fraccionamientos)
- [ ] DB-013: Tabla development_phases
- [ ] DB-014: Tabla housing_units (viviendas)
- [ ] DB-015: Funciones de agregación de estados
- [ ] DB-016: Seeds de desarrollo

**Backend:**
- [ ] BE-010: Module ProjectsModule
- [ ] BE-011: Entities (Project, Development, Phase, HousingUnit)
- [ ] BE-012: Services (CRUD + lógica de jerarquía)
- [ ] BE-013: Controllers (ProjectController, DevelopmentController)
- [ ] BE-014: DTOs completos

**Frontend:**
- [ ] FE-010: ProjectsPage (listado)
- [ ] FE-011: ProjectDetailPage (detalle + desarrollos)
- [ ] FE-012: DevelopmentDetailPage (fases + viviendas)
- [ ] FE-013: projectStore
- [ ] FE-014: Componentes (ProjectCard, DevelopmentTree, PhaseList)

### Dependencias
- Depende de: [REQ-001] Preconstrucción
- Bloquea: [REQ-003] Presupuestos, [REQ-005] Contratos

---

## [REQ-003] Módulo de Presupuestos, Costos y Control de Desviaciones

**Tipo:** Epic
**Prioridad:** P0
**Módulo:** budgets-cost-control
**Estado:** ⏳ Pendiente

### Descripción
Sistema de gestión de presupuestos por proyecto, control de costos reales vs estimados, análisis de desviaciones.

### Criterios de Aceptación
- [ ] Presupuesto maestro por proyecto
- [ ] Capítulos, partidas y conceptos (WBS)
- [ ] Costos reales vs presupuestados
- [ ] Alertas de desviaciones >10%
- [ ] Reportes de curva S (costos acumulados)

### Desglose en Tareas
TBD - Pendiente de análisis detallado

### Dependencias
- Depende de: [REQ-002] Proyectos

---

## [REQ-004] Módulo de Compras, Inventarios y Almacenes de Obra

**Tipo:** Epic
**Prioridad:** P0
**Módulo:** procurement-inventory
**Estado:** ⏳ Pendiente

---

## [REQ-005] Módulo de Contratos, Subcontratos y Estimaciones

**Tipo:** Epic
**Prioridad:** P0
**Módulo:** contracts-estimates
**Estado:** ⏳ Pendiente

---

## [REQ-006] Módulo de Control de Avances (Evidencia Fotográfica + Curva S)

**Tipo:** Epic
**Prioridad:** P0
**Módulo:** progress-tracking
**Estado:** ⏳ Pendiente

---

## [REQ-007] Módulo de CRM Derechohabientes e INFONAVIT Básico

**Tipo:** Epic
**Prioridad:** P0
**Módulo:** crm-beneficiaries
**Estado:** ⏳ Pendiente

---

## [REQ-008] Reportes Ejecutivos y BI

**Tipo:** Epic
**Prioridad:** P1
**Módulo:** reports-bi
**Estado:** ⏳ Pendiente

---

## MÉTRICAS

```yaml
total_requerimientos: 8
completados: 0
en_progreso: 0
pendientes: 8
bloqueados: 0

completitud: 0%

prioridad:
  P0: 7
  P1: 1
  P2: 0
  P3: 0
```

---

**Última actualización:** 2025-11-17
**Próxima revisión:** Diaria durante desarrollo activo
