# _MAP: Fase 1 - Alcance Inicial

**Fase:** 1
**Nombre:** Alcance Inicial - MVP Inmobiliario
**Periodo:** Sprint 0-11 (Semanas 1-17) - Ajustado
**Presupuesto:** $175,000 MXN (ajustado)
**Story Points:** 330 SP (ajustado)
**Épicas:** 7 (incluye RRHH en Fase 1)
**Estado:** 🚧 Planificado
**Última actualización:** 2025-11-17 v2.0

---

## 📋 Propósito

Establecer las bases técnicas y funcionales del Sistema de Administración de Obra e INFONAVIT con 6 épicas fundamentales que proporcionan:
- Autenticación y autorización específica de construcción
- Gestión de proyectos con estructura jerárquica
- Control de presupuestos y costos
- Gestión de compras e inventarios
- Tracking de avances de obra
- Reportes y analytics básicos

**Ventaja competitiva:** Reutilización de ~60% de componentes del proyecto GAMILIT, reduciendo tiempo de desarrollo ~30%.

---

## 📁 Contenido

### Épicas (7) - Ajustado

| Épica | Nombre | Presupuesto | SP | Estado | Archivos | Prioridad |
|-------|--------|-------------|----|--------|----------|-----------|
| **[MAI-001](./MAI-001-fundamentos/)** | Fundamentos | $25,000 | 50 | 🚧 | 15+ | P0 |
| **[MAI-002](./MAI-002-proyectos-estructura/)** | Proyectos y Estructura de Obra | $25,000 | 45 | 🚧 | 18+ | P0 |
| **[MAI-003](./MAI-003-presupuestos-costos/)** | Presupuestos y Control de Costos | $25,000 | 50 | 🚧 | 20+ | P1 |
| **[MAI-004](./MAI-004-compras-inventarios/)** | Compras e Inventarios | $25,000 | 50 | 🚧 | 22+ | P1 |
| **[MAI-005](./MAI-005-control-obra-avances/)** | Control de Obra y Avances | $25,000 | 45 | 🚧 | 19+ | P0 |
| **[MAI-006](./MAI-007-rrhh-asistencias/)** | RRHH, Asistencias y Nómina ⭐ | $25,000 | 50 | 🚧 | 20+ | P0 |
| **[MAI-007](./MAI-006-reportes-analytics/)** | Reportes y Analytics Base | $25,000 | 40 | 🚧 | 12+ | P1 |

**Total:** 7 épicas, 330 SP, ~126 archivos estimados

**⭐ Ajuste:** RRHH movido de Fase 2 a Fase 1 por criticidad (costeo de mano de obra + IMSS/INFONAVIT)

### Archivos de Fase

| Archivo | Descripción |
|---------|-------------|
| [README.md](./README.md) | Descripción completa de la fase |
| [ANALISIS-REUTILIZACION-GAMILIT.md](./ANALISIS-REUTILIZACION-GAMILIT.md) | Análisis detallado de reutilización |
| [_MAP.md](./MAP.md) | Este archivo - Índice maestro |

---

## 🎯 Desglose por Épica

### [MAI-001: Fundamentos](./MAI-001-fundamentos/)

**Objetivo:** Infraestructura base del sistema (migrada de GAMILIT)

**Entregables:**
- Autenticación JWT
- RBAC con 7 roles específicos de construcción:
  - `director` - Director general
  - `engineer` - Ingeniería/Planeación
  - `resident` - Residente de obra/Supervisor
  - `purchases` - Compras/Almacén
  - `finance` - Administración/Finanzas
  - `hr` - RRHH/Nómina
  - `post_sales` - Postventa
- Multi-tenancy por constructora
- API RESTful base
- UI/UX base (componentes de GAMILIT)
- Dashboard principal por rol

**Documentos clave:**
- 3 RF (RF-AUTH-001 a RF-AUTH-003)
- 3 ET (ET-AUTH-001 a ET-AUTH-003)
- 8 US (US-FUND-001 a US-FUND-008)
- [TRACEABILITY.yml](./MAI-001-fundamentos/implementacion/TRACEABILITY.yml)

**Módulos afectados:**
- BD: `auth`, `auth_management`, `audit_logging`
- Backend: `auth` module
- Frontend: `auth`, `dashboard` features

**Reutilización GAMILIT:** 90%

---

### [MAI-002: Proyectos y Estructura de Obra](./MAI-002-proyectos-estructura/)

**Objetivo:** Gestión de proyectos con estructura jerárquica

**Entregables:**
- Catálogo de proyectos (fraccionamientos, conjuntos, edificios)
- Estructura jerárquica: Proyecto → Etapas → Manzanas → Lotes → Viviendas
- Prototipos de vivienda (tipos A/B/C, departamentos)
- Asignación de equipo (director, residente, supervisores)
- Calendario general de obra con hitos clave
- Estados de proyecto (licitación, adjudicado, ejecución, entregado, cerrado)

**Documentos clave:**
- 4 RF (RF-PROJ-001 a RF-PROJ-004)
- 4 ET (ET-PROJ-001 a ET-PROJ-004)
- 9 US (US-PROJ-001 a US-PROJ-009)
- [TRACEABILITY.yml](./MAI-002-proyectos-estructura/implementacion/TRACEABILITY.yml)

**Módulos afectados:**
- BD: `projects` schema
- Backend: `projects` module
- Frontend: `projects` feature

**Reutilización GAMILIT:** 40% (concepto similar a Cursos → Módulos)

---

### [MAI-003: Presupuestos y Control de Costos](./MAI-003-presupuestos-costos/)

**Objetivo:** Sistema de presupuestos con control de costos

**Entregables:**
- Presupuesto maestro por obra y por prototipo
- Catálogo de conceptos de obra (civil, instalaciones, urbanización)
- Precios unitarios con matriz de insumos
- Comparación presupuesto vs costo real
- Alertas de desviaciones por partida
- Versionado de presupuestos (oferta, contratado, modificado)

**Documentos clave:**
- 5 RF (RF-BUD-001 a RF-BUD-005)
- 5 ET (ET-BUD-001 a ET-BUD-005)
- 10 US (US-BUD-001 a US-BUD-010)
- [TRACEABILITY.yml](./MAI-003-presupuestos-costos/implementacion/TRACEABILITY.yml)

**Módulos afectados:**
- BD: `budgets` schema
- Backend: `budgets` module
- Frontend: `budgets` feature

**Reutilización GAMILIT:** 10% (funcionalidad nueva)

---

### [MAI-004: Compras e Inventarios](./MAI-004-compras-inventarios/)

**Objetivo:** Gestión de compras y control de inventarios multi-almacén

**Entregables:**
- Requisiciones desde obra
- Órdenes de compra ligadas a presupuesto
- Comparativo de cotizaciones de proveedores
- Almacenes por obra + almacén general
- Movimientos: entradas, salidas, traspasos, devoluciones
- Kárdex por material, obra y frente
- Alertas de stock mínimo y sobreconsumo

**Documentos clave:**
- 6 RF (RF-PUR-001 a RF-PUR-006)
- 6 ET (ET-PUR-001 a ET-PUR-006)
- 11 US (US-PUR-001 a US-PUR-011)
- [TRACEABILITY.yml](./MAI-004-compras-inventarios/implementacion/TRACEABILITY.yml)

**Módulos afectados:**
- BD: `purchases`, `inventory` schemas
- Backend: `purchases`, `inventory` modules
- Frontend: `purchases`, `inventory` features

**Reutilización GAMILIT:** 15% (funcionalidad nueva)

---

### [MAI-005: Control de Obra y Avances](./MAI-005-control-obra-avances/)

**Objetivo:** Tracking de avances físicos y control de obra

**Entregables:**
- Captura de avance físico por concepto/frente/vivienda
- Curva S (plan vs real)
- Evidencias fotográficas con geolocalización
- Checklists de actividades por etapa constructiva
- Registro de incidencias y no conformidades
- Reportes de avance semanal/mensual

**Documentos clave:**
- 4 RF (RF-PROG-001 a RF-PROG-004)
- 4 ET (ET-PROG-001 a ET-PROG-004)
- 9 US (US-PROG-001 a US-PROG-009)
- [TRACEABILITY.yml](./MAI-005-control-obra-avances/implementacion/TRACEABILITY.yml)

**Módulos afectados:**
- BD: `progress_tracking` schema
- Backend: `progress` module
- Frontend: `progress` feature
- App: `progress-capture` (React Native)

**Reutilización GAMILIT:** 60% (similar a Progress Tracking educativo)

---

### [MAI-006: Reportes y Analytics Base](./MAI-006-reportes-analytics/)

**Objetivo:** Dashboards y reportes básicos de obra

**Entregables:**
- Dashboard por obra (avance físico/financiero, desviaciones)
- Reportes de estimaciones vs pagos
- Costos por m²/vivienda
- Gráficos interactivos (Chart.js/Recharts)
- Exportación PDF/Excel

**Documentos clave:**
- 3 RF (RF-REP-001 a RF-REP-003)
- 3 ET (ET-REP-001 a ET-REP-003)
- 6 US (US-REP-001 a US-REP-006)
- [TRACEABILITY.yml](./MAI-006-reportes-analytics/implementacion/TRACEABILITY.yml)

**Módulos afectados:**
- BD: `reporting`, `admin_dashboard` schemas
- Backend: `analytics`, `reports` modules
- Frontend: `dashboards`, `reports` features

**Reutilización GAMILIT:** 70% (dashboards y gráficos ya implementados)

---

## 📊 Resumen Técnico

### Base de Datos
- **Schemas creados:** 8 (auth, auth_management, projects, budgets, purchases, inventory, progress_tracking, reporting)
- **Tablas:** ~60 tablas
- **Funciones:** ~25 stored procedures
- **ENUMs:** project_status, stage_status, budget_status, purchase_order_status, stock_movement_type, progress_status, etc.
- **RLS:** Implementado en todas las tablas sensibles (por proyecto/constructora)

### Backend (Node.js + Express + TypeScript)
- **Módulos:** 8 (auth, projects, budgets, purchases, inventory, progress, contracts, reporting)
- **Endpoints:** ~90 APIs RESTful
- **Guards:** JwtAuthGuard, RolesGuard, ProjectAccessGuard
- **OAuth Providers:** Opcional (Google, Microsoft para SSO corporativo)

### Frontend (React + Vite + TypeScript)
- **Features:** auth, projects, budgets, purchases, inventory, progress, reports
- **Componentes:** ~75 componentes base
- **Stores (Zustand):** authStore, projectStore, budgetStore, purchaseStore, inventoryStore, progressStore, reportStore
- **Routing:** React Router con guards (AuthGuard, RoleGuard, ProjectGuard)

### App Móvil (React Native)
- **Features:** auth, progress-capture, incidents, checklists, offline-mode
- **Offline Storage:** expo-sqlite + sincronización
- **Cámara:** Expo Camera para evidencias fotográficas
- **Geolocalización:** react-native-maps

---

## 📈 Métricas de la Fase

| Métrica | Planificado | Target | Varianza Aceptable |
|---------|-------------|--------|-------------------|
| **Presupuesto** | $150,000 | $150,000 | ±5% |
| **Story Points** | 280 | 280 | ±10% |
| **Duración** | 14 semanas | 14 semanas | ±10% |
| **Cobertura Tests** | 80% | ≥80% | N/A |
| **Bugs Críticos** | 0 | 0 | N/A |
| **Reutilización GAMILIT** | ~60% | ≥50% | N/A |

---

## 🚀 Hitos Planeados

- 🎯 **Semana 1:** Sprint 0 - Migración de componentes GAMILIT completada
- 🎯 **Semana 2:** MVP Backend de Fundamentos completado
- 🎯 **Semana 3:** MVP Frontend de Fundamentos completado
- 🎯 **Semana 4:** MAI-001 + MAI-002 completados
- 🎯 **Semana 8:** MAI-003 + MAI-004 completados
- 🎯 **Semana 12:** MAI-005 + MAI-006 completados
- 🎯 **Semana 14:** Fase 1 completada y desplegada a staging

---

## 🔗 Referencias

- **Descripción completa:** [README.md](./README.md)
- **Análisis de reutilización:** [ANALISIS-REUTILIZACION-GAMILIT.md](./ANALISIS-REUTILIZACION-GAMILIT.md)
- **Fase anterior:** N/A (primera fase)
- **Fase siguiente:** [Fase 2: Gestión Avanzada](../02-fase-gestion-avanzada/)
- **Proyecto de referencia:** [GAMILIT - docs/01-fase-alcance-inicial](../../workspace-gamilit/gamilit/projects/gamilit/docs/01-fase-alcance-inicial/)

---

## 💡 Principios de Desarrollo

1. **Reutilización inteligente:** Migrar componentes de GAMILIT en Sprint 0 dedicado
2. **Testing desde día 1:** Cobertura >80% para deployment tranquilo
3. **RLS desde el inicio:** Evitar refactoring complejo de seguridad
4. **Modularización:** Desarrollo paralelo de épicas por equipos
5. **Documentación temprana:** Especificar antes de implementar
6. **Code reviews:** Cross-review entre teams GAMILIT e Inmobiliario

---

## 🎯 Siguiente Paso

Iniciar Sprint 0 con migración de infraestructura base de GAMILIT.

---

**Generado:** 2025-11-17
**Sistema:** Adaptado de SIMCO (GAMILIT)
**Método:** Migración estructurada desde proyecto de referencia
**Versión:** 1.0.0
