# Fase 1: Alcance Inicial - MVP Inmobiliario

**Periodo:** Sprint 0-11 (Semanas 1-17) - Ajustado
**Presupuesto:** $175,000 MXN (ajustado)
**Story Points:** 330 SP (ajustado)
**Épicas:** 7 (incluye RRHH)
**Estado:** 🚧 Planificado
**Última actualización:** 2025-11-17 v2.0

---

## 📋 Resumen

La Fase 1 establece las bases técnicas y funcionales del Sistema de Administración de Obra e INFONAVIT, incluyendo autenticación, gestión de proyectos, presupuestos, control de obra, compras/inventarios y reportes básicos.

**Reutilización de GAMILIT:**
- Infraestructura base: ~90%
- Componentes UI: ~67%
- Patrones arquitectónicos: 100%
- **Ahorro estimado:** 6 semanas vs desarrollo desde cero

---

## 🎯 Épicas (Ajustado - Incluye RRHH)

| Épica | Nombre | Presupuesto | SP | Archivos | Estado | Prioridad |
|-------|--------|-------------|----|----------|--------|-----------|
| **[MAI-001](./MAI-001-fundamentos/)** | Fundamentos | $25,000 | 50 | 15+ | 🚧 Planificado | P0 |
| **[MAI-002](./MAI-002-proyectos-estructura/)** | Proyectos y Estructura de Obra | $25,000 | 45 | 18+ | 🚧 Planificado | P0 |
| **[MAI-003](./MAI-003-presupuestos-costos/)** | Presupuestos y Control de Costos | $25,000 | 50 | 20+ | 🚧 Planificado | P1 |
| **[MAI-004](./MAI-004-compras-inventarios/)** | Compras e Inventarios | $25,000 | 50 | 22+ | 🚧 Planificado | P1 |
| **[MAI-005](./MAI-005-control-obra-avances/)** | Control de Obra y Avances | $25,000 | 45 | 19+ | 🚧 Planificado | P0 |
| **[MAI-006](./MAI-007-rrhh-asistencias/)** | RRHH, Asistencias y Nómina ⭐ | $25,000 | 50 | 20+ | 🚧 Planificado | P0 |
| **[MAI-007](./MAI-006-reportes-analytics/)** | Reportes y Analytics Base | $25,000 | 40 | 12+ | 🚧 Planificado | P1 |

**Totales:**
- Presupuesto: $175,000 MXN (ajustado +$25K para RRHH)
- Story Points: 330 SP (ajustado +50 SP)
- Archivos documentación: ~126 archivos estimados
- Duración: 16 semanas (ajustado +2 semanas)

**⭐ Cambio importante:** RRHH movido de Fase 2 a Fase 1 por ser crítico para costeo de mano de obra y cumplimiento legal (IMSS/INFONAVIT).

---

## 🏗️ Arquitectura Implementada

### Base de Datos
- **Schemas:** auth, auth_management, projects, budgets, purchases, inventory, progress_tracking, reporting
- **Tablas:** ~60 tablas fundamentales
- **Funciones:** ~25 funciones stored procedures
- **ENUMs:** project_status, stage_status, budget_status, estimation_status, payment_status, etc.

### Backend (Node.js + Express + TypeScript)
- **Módulos:** auth, projects, budgets, purchases, inventory, progress, contracts, reporting
- **APIs:** ~90 endpoints RESTful
- **Guards:** JWT, Roles, Permissions, ProjectAccess
- **Estrategias:** JWT (reutilizado de GAMILIT)

### Frontend (React + Vite + TypeScript)
- **Features:** auth, projects, budgets, purchases, inventory, progress, reports
- **Componentes:** ~75 componentes base
- **Stores:** authStore, projectStore, budgetStore, progressStore, reportStore
- **Guards:** AuthGuard, RoleGuard, ProjectGuard

### App Móvil (React Native)
- **Features:** auth, progress-capture, incidents, checklists
- **Modo Offline:** SQLite + sincronización
- **Cámara:** Evidencias fotográficas con geolocalización

---

## 📊 Objetivos a Alcanzar

✅ Sistema de autenticación completo (JWT + 7 roles)
✅ RBAC (Role-Based Access Control) específico de construcción
✅ Gestión de proyectos con estructura jerárquica (Etapas → Manzanas → Lotes → Viviendas)
✅ Sistema de presupuestos con control de costos
✅ Gestión de compras e inventarios multi-almacén
✅ Control de avances físicos con evidencias
✅ Reportes básicos (avance, costos, desviaciones)
✅ Multi-tenancy para múltiples constructoras
✅ RLS (Row Level Security) implementado
✅ Cobertura de tests: >80%

---

## 🔗 Hitos

- **Semana 1:** Sprint 0 - Migración de componentes GAMILIT completada
- **Semana 4:** Fundamentos + Proyectos implementados
- **Semana 8:** Presupuestos + Compras/Inventarios funcionales
- **Semana 12:** Control de Obra + Reportes completados
- **Semana 14:** Fase 1 completada y desplegada a staging

---

## 📈 Métricas Objetivo

| Métrica | Estimado | Target |
|---------|----------|--------|
| **Presupuesto** | $150,000 | ±5% |
| **Story Points** | 280 | ±10% |
| **Duración** | 14 semanas | ±10% |
| **Cobertura Tests** | 80% | ≥80% |
| **Bugs Críticos** | 0 | 0 |
| **Reducción vs desde cero** | 30% | ≥25% |

---

## 🚀 Navegación

**➡️ Siguiente:** [Fase 2: Gestión Avanzada](../02-fase-gestion-avanzada/)
**⬆️ Inicio:** [Documentación Principal](../README.md)
**🔗 Relacionado:** [Análisis de Reutilización GAMILIT](./ANALISIS-REUTILIZACION-GAMILIT.md)

---

## 📚 Estructura de Documentación

Cada épica contiene:

```
MAI-XXX-nombre-epica/
├── README.md                    # Descripción completa de la épica
├── _MAP.md                      # Índice maestro de la épica
├── requerimientos/              # Requerimientos Funcionales (RF-XXX-NNN)
│   ├── RF-XXX-001-titulo.md
│   └── RF-XXX-002-titulo.md
├── especificaciones/            # Especificaciones Técnicas (ET-XXX-NNN)
│   ├── ET-XXX-001-titulo.md
│   └── ET-XXX-002-titulo.md
├── historias-usuario/           # Historias de Usuario (US-XXX-NNN)
│   ├── US-XXX-001-titulo.md
│   └── US-XXX-002-titulo.md
├── implementacion/              # Trazabilidad e inventarios
│   ├── TRACEABILITY.yml         # Matriz completa de trazabilidad
│   ├── DATABASE.yml             # Objetos de base de datos
│   ├── BACKEND.yml              # Módulos backend
│   └── FRONTEND.yml             # Componentes frontend
└── pruebas/                     # Documentación de testing
    ├── TEST-PLAN.md
    └── TEST-CASES.md
```

---

## 🎯 Desglose por Épica

### [MAI-001: Fundamentos](./MAI-001-fundamentos/)

**Objetivo:** Infraestructura base del sistema (migrada de GAMILIT)

**Entregables:**
- Autenticación JWT
- RBAC con 7 roles (Dirección, Ingeniería, Residente, Compras, Finanzas, RRHH, Postventa)
- Multi-tenancy por constructora
- API RESTful base
- UI/UX base (componentes reutilizados de GAMILIT)
- Dashboard principal por rol

**Reutilización GAMILIT:** 90%

**Documentos clave:**
- 3 RF (RF-AUTH-001 a RF-AUTH-003)
- 3 ET (ET-AUTH-001 a ET-AUTH-003)
- 8 US (US-FUND-001 a US-FUND-008)

---

### [MAI-002: Proyectos y Estructura de Obra](./MAI-002-proyectos-estructura/)

**Objetivo:** Gestión de proyectos con estructura jerárquica

**Entregables:**
- Catálogo de proyectos (fraccionamientos, conjuntos)
- Estructura jerárquica: Etapas → Manzanas → Lotes → Viviendas
- Prototipos de vivienda (tipos A/B/C)
- Asignación de equipo (director, residente, supervisores)
- Calendario general de obra (hitos)

**Reutilización GAMILIT:** 40% (concepto similar a Cursos → Módulos)

**Documentos clave:**
- 4 RF (RF-PROJ-001 a RF-PROJ-004)
- 4 ET (ET-PROJ-001 a ET-PROJ-004)
- 9 US (US-PROJ-001 a US-PROJ-009)

---

### [MAI-003: Presupuestos y Control de Costos](./MAI-003-presupuestos-costos/)

**Objetivo:** Sistema de presupuestos y control de costos

**Entregables:**
- Presupuesto maestro por obra y prototipo
- Catálogo de conceptos de obra
- Precios unitarios (materiales, mano de obra, maquinaria)
- Matriz de insumos
- Comparación presupuesto vs costo real
- Alertas de desviaciones

**Reutilización GAMILIT:** 10% (nueva funcionalidad)

**Documentos clave:**
- 5 RF (RF-BUD-001 a RF-BUD-005)
- 5 ET (ET-BUD-001 a ET-BUD-005)
- 10 US (US-BUD-001 a US-BUD-010)

---

### [MAI-004: Compras e Inventarios](./MAI-004-compras-inventarios/)

**Objetivo:** Gestión de compras y control de inventarios

**Entregables:**
- Requisiciones desde obra
- Órdenes de compra ligadas a presupuesto
- Comparativo de cotizaciones
- Almacenes multi-sitio
- Entradas/salidas/traspasos
- Kárdex por material y obra
- Alertas de mínimos y sobreconsumo

**Reutilización GAMILIT:** 15% (nueva funcionalidad)

**Documentos clave:**
- 6 RF (RF-PUR-001 a RF-PUR-006)
- 6 ET (ET-PUR-001 a ET-PUR-006)
- 11 US (US-PUR-001 a US-PUR-011)

---

### [MAI-005: Control de Obra y Avances](./MAI-005-control-obra-avances/)

**Objetivo:** Tracking de avances físicos y control de obra

**Entregables:**
- Captura de avance físico por concepto
- Curva S (programado vs ejecutado)
- Evidencias fotográficas geolocalizadas
- Checklists de actividades por etapa
- Registro de incidencias
- Reportes de avance

**Reutilización GAMILIT:** 60% (similar a Progress Tracking)

**Documentos clave:**
- 4 RF (RF-PROG-001 a RF-PROG-004)
- 4 ET (ET-PROG-001 a ET-PROG-004)
- 9 US (US-PROG-001 a US-PROG-009)

---

### [MAI-006: Reportes y Analytics Base](./MAI-006-reportes-analytics/)

**Objetivo:** Dashboards y reportes básicos

**Entregables:**
- Dashboard por obra (avance físico/financiero)
- Desviaciones costo/tiempo
- Reportes de estimaciones y pagos
- Exportación PDF/Excel
- Gráficos interactivos

**Reutilización GAMILIT:** 70% (dashboards y gráficos)

**Documentos clave:**
- 3 RF (RF-REP-001 a RF-REP-003)
- 3 ET (ET-REP-001 a ET-REP-003)
- 6 US (US-REP-001 a US-REP-006)

---

## 💡 Lessons Learned (a documentar post-implementación)

1. **Reutilización efectiva:** La migración de componentes GAMILIT debe hacerse en Sprint 0 dedicado
2. **Adaptación de roles:** RBAC requiere análisis detallado de permisos por módulo
3. **Testing riguroso:** Cobertura >80% evita bugs en producción
4. **Modularización:** Arquitectura modular facilita desarrollo paralelo
5. **Documentación temprana:** Especificar antes de implementar reduce refactoring

---

## 🎯 Siguiente Paso

Continuar con [Fase 2: Gestión Avanzada](../02-fase-gestion-avanzada/) - Contratos, Estimaciones, RRHH, CRM, INFONAVIT.

---

**Generado:** 2025-11-17
**Sistema:** Adaptado de SIMCO (GAMILIT)
**Método:** Estructura basada en docs/01-fase-alcance-inicial de GAMILIT
**Versión:** 1.0.0
