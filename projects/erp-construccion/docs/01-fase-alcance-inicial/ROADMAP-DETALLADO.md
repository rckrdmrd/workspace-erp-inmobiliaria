# Roadmap Detallado - Fase 1: Alcance Inicial

**Proyecto:** Sistema de Administración de Obra e INFONAVIT
**Fecha:** 2025-11-17
**Duración Total Fase 1:** 16 semanas (ajustado para incluir RRHH)
**Presupuesto Fase 1:** $175,000 MXN (ajustado)
**Story Points:** 330 SP (ajustado)

---

## 🔄 Ajuste Importante: RRHH Movido a Fase 1

**Justificación:**
- ✅ RRHH y asistencias es **crítico** para costeo de mano de obra
- ✅ Necesario desde el inicio de obra para tracking de personal
- ✅ App móvil con biométrico complementa app de avances
- ✅ Integración con IMSS/INFONAVIT es requerimiento legal desde día 1

**Impacto:**
- Fase 1: 6 épicas → **7 épicas**
- Duración: 14 semanas → **16 semanas**
- Presupuesto: $150,000 → **$175,000 MXN**
- Story Points: 280 SP → **330 SP**

---

## 📋 Épicas de Fase 1 (Revisado)

| Épica | Nombre | Presupuesto | SP | Semanas | Prioridad |
|-------|--------|-------------|----|---------|-----------|
| **MAI-001** | Fundamentos | $25,000 | 50 | 2 | P0 - Crítico |
| **MAI-002** | Proyectos y Estructura | $25,000 | 45 | 2 | P0 - Crítico |
| **MAI-003** | Presupuestos y Costos | $25,000 | 50 | 3 | P1 - Alto |
| **MAI-004** | Compras e Inventarios | $25,000 | 50 | 2.5 | P1 - Alto |
| **MAI-005** | Control de Obra y Avances | $25,000 | 45 | 2.5 | P0 - Crítico |
| **MAI-006** | RRHH, Asistencias y Nómina | $25,000 | 50 | 2.5 | P0 - Crítico |
| **MAI-007** | Reportes y Analytics | $25,000 | 40 | 1.5 | P1 - Alto |

**Total:** $175,000 MXN | 330 SP | 16 semanas

---

## 🗓️ Calendario de Sprints (2 semanas cada sprint)

### Sprint 0: Migración de Base (Semana 1)
**Duración:** 1 semana
**Objetivo:** Infraestructura base desde GAMILIT

**Equipo:**
- Tech Lead: 1
- Backend: 2
- Frontend: 2
- Database: 1
- DevOps: 1

**Tareas Principales:**
- [x] Configurar repositorio con estructura modular
- [x] Migrar sistema de autenticación JWT
- [x] Migrar guards, middleware, error handlers
- [x] Migrar componentes UI base (Buttons, Inputs, Modales, Forms)
- [x] Setup PostgreSQL con schemas modulares
- [x] Configurar CI/CD (GitHub Actions / GitLab CI)
- [x] Setup de ambientes (dev, staging, prod)

**Entregable:** Infraestructura base funcionando

**Métricas:**
- Coverage esperado: >80%
- Build exitoso: ✅
- Deploy a dev: ✅

---

### Sprint 1: Fundamentos - Parte 1 (Semanas 2-3)
**Épica:** MAI-001
**Duración:** 2 semanas
**Story Points:** 50 SP

**Historias de Usuario:**
1. **US-FUND-001:** Autenticación Básica JWT (8 SP)
2. **US-FUND-002:** Perfiles de Usuario de Construcción (5 SP)
3. **US-FUND-003:** Dashboard por Rol (8 SP)
4. **US-FUND-004:** Infraestructura Técnica Base (12 SP)
5. **US-FUND-005:** Sistema de Sesiones (6 SP)
6. **US-FUND-006:** API RESTful Básica (8 SP)
7. **US-FUND-007:** Navegación y Routing (5 SP)
8. **US-FUND-008:** UI/UX Base (3 SP)

**Actividades Backend:**
- Implementar 7 roles de construcción (director, engineer, resident, purchases, finance, hr, post_sales)
- Implementar multi-tenancy por constructora
- RLS policies por constructora + proyecto
- Sistema de auditoría completo

**Actividades Frontend:**
- Login/Register con selector de constructora
- 7 variantes de dashboard por rol
- Guards de autorización (AuthGuard, RoleGuard, ConstructoraGuard)
- Layouts responsivos

**Actividades Database:**
- Schema `auth`, `auth_management`, `constructoras`, `audit_logging`
- ENUM `construction_role` (7 valores)
- Tabla `constructoras`, `user_constructoras`
- RLS policies multi-tenant

**Testing:**
- Unit tests: AuthService, Guards
- E2E tests: Login, Multi-tenancy, RBAC

**Entregable:** Sistema de autenticación y autorización completo con multi-tenancy

---

### Sprint 2: Proyectos y Estructura (Semanas 4-5)
**Épica:** MAI-002
**Duración:** 2 semanas
**Story Points:** 45 SP

**Historias de Usuario:**
1. **US-PROJ-001:** Catálogo de Proyectos (8 SP)
2. **US-PROJ-002:** Estructura Jerárquica (Etapas → Manzanas → Lotes → Viviendas) (10 SP)
3. **US-PROJ-003:** Prototipos de Vivienda (5 SP)
4. **US-PROJ-004:** Asignación de Equipo de Obra (6 SP)
5. **US-PROJ-005:** Calendario de Obra con Hitos (8 SP)
6. **US-PROJ-006:** Estados de Proyecto (5 SP)
7. **US-PROJ-007:** Dashboard de Proyecto (8 SP)

**Actividades Backend:**
- Módulo `projects`
- CRUD de proyectos, etapas, manzanas, lotes, viviendas
- Asignación de equipo con roles por proyecto
- API de calendario y hitos

**Actividades Frontend:**
- Componentes de gestión de proyectos
- Vista jerárquica (tree view) de estructura
- Formularios de asignación de equipo
- Calendario interactivo

**Actividades Database:**
- Schema `projects`
- Tablas: `projects`, `stages`, `blocks`, `lots`, `housing_units`, `housing_prototypes`
- Tabla: `project_team_assignments`
- RLS por proyecto y constructora

**Testing:**
- Unit tests: ProjectService
- E2E tests: Creación de proyecto completo con estructura

**Entregable:** Gestión de proyectos con estructura jerárquica completa

---

### Sprint 3-4: Presupuestos y Costos (Semanas 6-8)
**Épica:** MAI-003
**Duración:** 3 semanas
**Story Points:** 50 SP

**Historias de Usuario:**
1. **US-BUD-001:** Presupuesto Maestro por Obra (10 SP)
2. **US-BUD-002:** Catálogo de Conceptos de Obra (8 SP)
3. **US-BUD-003:** Precios Unitarios y Matriz de Insumos (12 SP)
4. **US-BUD-004:** Comparación Presupuesto vs Costo Real (10 SP)
5. **US-BUD-005:** Alertas de Desviaciones (5 SP)
6. **US-BUD-006:** Versionado de Presupuestos (10 SP)

**Actividades Backend:**
- Módulo `budgets`
- Catálogo de conceptos con costos
- Matriz de insumos (materiales, mano de obra, herramienta, maquinaria)
- Cálculo de desviaciones en tiempo real
- Versionado de presupuestos (oferta, contratado, modificado)

**Actividades Frontend:**
- Formularios de presupuesto con cálculos automáticos
- Vista de comparación presupuesto vs real
- Alertas visuales de desviaciones
- Importación/exportación Excel

**Actividades Database:**
- Schema `budgets`
- Tablas: `budgets`, `budget_items`, `concept_catalog`, `unit_prices`, `input_matrix`
- Funciones: calcular desviaciones, aplicar escalatorias

**Testing:**
- Unit tests: BudgetService, cálculos de desviaciones
- E2E tests: Creación de presupuesto completo

**Entregable:** Sistema de presupuestos con control de costos funcionando

---

### Sprint 5-6: Compras e Inventarios (Semanas 9-10.5)
**Épica:** MAI-004
**Duración:** 2.5 semanas
**Story Points:** 50 SP

**Historias de Usuario:**
1. **US-PUR-001:** Requisiciones desde Obra (8 SP)
2. **US-PUR-002:** Órdenes de Compra (10 SP)
3. **US-PUR-003:** Comparativo de Cotizaciones (8 SP)
4. **US-PUR-004:** Almacenes Multi-sitio (10 SP)
5. **US-PUR-005:** Movimientos de Inventario (8 SP)
6. **US-PUR-006:** Kárdex y Alertas (6 SP)

**Actividades Backend:**
- Módulos `purchases`, `inventory`
- Workflow de requisición → cotización → orden de compra
- Gestión de proveedores
- Control de almacenes multi-obra
- Movimientos: entradas, salidas, traspasos

**Actividades Frontend:**
- Formularios de requisición y orden de compra
- Comparador de cotizaciones
- Dashboard de inventario por almacén
- Kárdex visual

**Actividades Database:**
- Schemas `purchases`, `inventory`
- Tablas: `purchase_requisitions`, `purchase_orders`, `suppliers`, `warehouses`, `stock_items`, `stock_movements`
- Triggers: alertas de stock mínimo

**Testing:**
- Unit tests: PurchaseService, InventoryService
- E2E tests: Flujo completo de requisición a recepción

**Entregable:** Gestión de compras e inventarios multi-almacén

---

### Sprint 7-8: Control de Obra y Avances (Semanas 11-13)
**Épica:** MAI-005
**Duración:** 2.5 semanas
**Story Points:** 45 SP

**Historias de Usuario:**
1. **US-PROG-001:** Captura de Avance Físico (10 SP)
2. **US-PROG-002:** Curva S (Plan vs Real) (8 SP)
3. **US-PROG-003:** Evidencias Fotográficas Geolocalizadas (10 SP)
4. **US-PROG-004:** Checklists de Actividades (8 SP)
5. **US-PROG-005:** Registro de Incidencias (6 SP)
6. **US-PROG-006:** App Móvil de Captura (12 SP) ⭐

**Actividades Backend:**
- Módulo `progress`
- Captura de avances por concepto/frente/vivienda
- Cálculo de curva S
- API de uploads de imágenes con geolocalización
- Checklists dinámicos por etapa

**Actividades Frontend Web:**
- Formularios de captura de avance
- Gráfico de curva S interactivo
- Galería de evidencias fotográficas
- Dashboard de checklists

**Actividades App Móvil (React Native):**
- ⭐ **Captura de avances offline**
- ⭐ **Cámara con geolocalización automática**
- ⭐ **Checklists interactivos**
- ⭐ **Registro de incidencias con foto**
- ⭐ **Sincronización automática**

**Actividades Database:**
- Schema `progress_tracking`
- Tablas: `physical_progress`, `progress_evidence`, `checklists`, `checklist_items`, `incidents`
- Funciones: cálculo de curva S

**Testing:**
- Unit tests: ProgressService
- E2E tests: Captura de avance con evidencias
- App tests: Modo offline, sincronización

**Entregable:** Control de obra con app móvil funcionando

---

### Sprint 9-10: RRHH, Asistencias y Nómina (Semanas 13.5-16)
**Épica:** MAI-006 ⭐ NUEVO EN FASE 1
**Duración:** 2.5 semanas
**Story Points:** 50 SP

**Historias de Usuario:**
1. **US-HR-001:** Catálogo de Empleados y Cuadrillas (8 SP)
2. **US-HR-002:** Asistencia con Biométrico desde App (15 SP) ⭐⭐
3. **US-HR-003:** Costeo de Mano de Obra por Obra (10 SP)
4. **US-HR-004:** Integración con Nómina Externa (8 SP)
5. **US-HR-005:** Exportación IMSS/INFONAVIT (12 SP) ⭐⭐
6. **US-HR-006:** Reportes de Asistencia (5 SP)

**Actividades Backend:**
- Módulo `hr`
- CRUD de empleados, cuadrillas, oficios
- API de registro de asistencia
- Cálculo de costeo de mano de obra por obra/partida
- **Integración con IMSS (API de afiliación, avisos de alta/baja)**
- **Integración con INFONAVIT (API de aportaciones patronales)**
- Exportación de archivos SUA (Sistema Único de Autodeterminación)

**Actividades Frontend Web:**
- Gestión de empleados y cuadrillas
- Dashboard de asistencias
- Reportes de costeo de mano de obra
- Exportación de archivos para IMSS/INFONAVIT

**Actividades App Móvil (React Native):**
- ⭐⭐ **Captura de asistencia con biométrico (huella/facial)**
- ⭐⭐ **QR Code para check-in/check-out**
- ⭐⭐ **Geolocalización de asistencia (verificar que esté en obra)**
- ⭐⭐ **Lista de cuadrilla del día**
- ⭐⭐ **Modo offline con sincronización**
- ⭐⭐ **Foto de entrada/salida (opcional)**

**Actividades Database:**
- Schema `hr`
- Tablas: `employees`, `crews`, `trades`, `attendance_records`, `labor_costs`
- Tabla: `imss_integration_log`, `infonavit_integration_log`
- Funciones: calcular costeo por obra

**Integraciones Externas:**
- **IMSS API:**
  - Afiliación de trabajadores
  - Avisos de alta/baja
  - Modificaciones salariales
  - Generación de archivos SUA

- **INFONAVIT API:**
  - Registro patronal
  - Cálculo de aportaciones (5% del salario base)
  - Generación de archivo de pago
  - Consulta de acreditados

**Tecnologías:**
- **Biométrico App:**
  - `react-native-biometrics` (huella dactilar)
  - `react-native-camera` (reconocimiento facial opcional)
  - `@react-native-community/geolocation` (GPS)
- **QR Code:**
  - `react-native-qrcode-scanner`
  - Backend genera QR por obra/día
- **IMSS/INFONAVIT:**
  - SOAP/REST APIs oficiales
  - Generación de archivos .SUA (formato específico IMSS)

**Testing:**
- Unit tests: HRService, cálculos de costeo
- E2E tests: Flujo completo de asistencia
- App tests: Biométrico, GPS, modo offline
- Integration tests: IMSS/INFONAVIT APIs (sandbox)

**Entregable:**
- ✅ Sistema de RRHH con asistencia biométrica
- ✅ App móvil con captura de asistencia
- ✅ Integración con IMSS e INFONAVIT funcionando
- ✅ Exportación de archivos SUA

---

### Sprint 11: Reportes y Analytics (Semanas 16-17)
**Épica:** MAI-007
**Duración:** 1.5 semanas
**Story Points:** 40 SP

**Historias de Usuario:**
1. **US-REP-001:** Dashboard por Obra (10 SP)
2. **US-REP-002:** Reportes de Desviaciones (8 SP)
3. **US-REP-003:** Reportes de Estimaciones/Pagos (8 SP)
4. **US-REP-004:** Exportación PDF/Excel (8 SP)
5. **US-REP-005:** Gráficos Interactivos (10 SP)

**Actividades Backend:**
- Módulo `reporting`
- Agregaciones de datos (avance, costos, desviaciones)
- Generación de PDFs (puppeteer/pdfmake)
- Exportación Excel (exceljs)

**Actividades Frontend:**
- Dashboards con Chart.js/Recharts
- Reportes personalizables
- Filtros dinámicos

**Actividades Database:**
- Schema `reporting`
- Vistas materializadas para performance
- Funciones de agregación

**Testing:**
- Unit tests: ReportService
- E2E tests: Generación de reportes

**Entregable:** Sistema de reportes y analytics completo

---

## 📱 Especificación de App Móvil

### Funcionalidades Principales

#### 1. Autenticación
- Login con credenciales de obra
- Selección de constructora
- Modo offline (credenciales cacheadas)

#### 2. Captura de Asistencia (Módulo RRHH)
**Flujo de Asistencia:**
```
1. Residente abre app
2. Selecciona obra activa
3. Modo "Check-in" o "Check-out"
4. Opciones de registro:
   a) Escanear QR del empleado
   b) Buscar en lista de empleados
   c) Registro biométrico (huella/facial)
5. Sistema valida:
   - Geolocalización (dentro del radio de la obra)
   - Horario (dentro de jornada laboral)
   - Estado del empleado (activo, asignado a obra)
6. Captura foto (opcional)
7. Registra asistencia (online o en cola offline)
8. Confirma con vibración/sonido
```

**Pantallas:**
- Login
- Selector de obra
- Lista de empleados
- Escáner QR
- Confirmación de asistencia
- Historial del día

#### 3. Captura de Avances (Módulo Control de Obra)
- Selección de concepto/frente
- Captura de porcentaje de avance
- Fotos con geolocalización
- Checklists interactivos
- Registro de incidencias

#### 4. Modo Offline
- Sincronización automática al recuperar conexión
- Base de datos local (SQLite/Realm)
- Cola de pendientes (asistencias, avances, fotos)

### Stack Técnico App Móvil

```yaml
framework: React Native + TypeScript
navigation: React Navigation v6
state: Zustand
database_local: expo-sqlite / Realm
biometric: react-native-biometrics
camera: expo-camera
qr_scanner: react-native-qrcode-scanner
geolocation: @react-native-community/geolocation
maps: react-native-maps
networking: axios + react-query
offline_sync: custom queue system
```

---

## 📊 Métricas por Sprint

| Sprint | SP | Presupuesto | Duración | Team Size | Riesgo |
|--------|----|-----------|---------|-----------:|--------|
| Sprint 0 | - | - | 1 sem | 7 | Bajo |
| Sprint 1 | 50 | $25,000 | 2 sem | 6 | Bajo (90% GAMILIT) |
| Sprint 2 | 45 | $25,000 | 2 sem | 6 | Medio (40% GAMILIT) |
| Sprint 3-4 | 50 | $25,000 | 3 sem | 6 | Alto (10% GAMILIT) |
| Sprint 5-6 | 50 | $25,000 | 2.5 sem | 6 | Alto (15% GAMILIT) |
| Sprint 7-8 | 45 | $25,000 | 2.5 sem | 7 (+ mobile) | Medio (60% GAMILIT) |
| Sprint 9-10 | 50 | $25,000 | 2.5 sem | 7 (+ mobile) | Alto (integraciones) |
| Sprint 11 | 40 | $25,000 | 1.5 sem | 6 | Bajo (70% GAMILIT) |

**Total:** 330 SP | $175,000 MXN | 16 semanas

---

## 👥 Composición del Equipo

### Core Team (Sprints 1-11)
- **Tech Lead:** 1 (full-time)
- **Backend Developers:** 2 (full-time)
- **Frontend Developers:** 2 (full-time)
- **Database Engineer:** 1 (full-time)
- **QA Engineer:** 1 (full-time)

### Equipo Adicional (Sprints 7-10)
- **Mobile Developer:** 1 (iOS/Android con React Native)

### Soporte
- **DevOps:** 0.5 (part-time)
- **UI/UX Designer:** 0.5 (part-time, Sprints 1-3)

**Total personas:** 7.5 FTE promedio

---

## 🎯 Hitos Críticos

| Semana | Hito | Entregable |
|--------|------|------------|
| **Semana 1** | Sprint 0 completado | Infraestructura base |
| **Semana 3** | MAI-001 completado | Auth + Multi-tenancy |
| **Semana 5** | MAI-002 completado | Gestión de proyectos |
| **Semana 8** | MAI-003 completado | Presupuestos y costos |
| **Semana 10.5** | MAI-004 completado | Compras e inventarios |
| **Semana 13** | MAI-005 completado | Control de obra + App móvil v1 |
| **Semana 16** | MAI-006 completado | RRHH + Asistencia biométrica + IMSS/INFONAVIT |
| **Semana 17** | MAI-007 completado | Reportes y analytics |
| **Semana 17** | **Fase 1 completa** | **Deploy a staging** |

---

## 🚨 Riesgos y Mitigaciones

### Riesgos Técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Integración IMSS/INFONAVIT compleja** | Alta | Alto | Iniciar pruebas con APIs sandbox desde Sprint 5 |
| **Biométrico no funciona en todos devices** | Media | Medio | Fallback a QR + foto |
| **Sincronización offline falla** | Media | Alto | Tests exhaustivos de cola de sincronización |
| **Performance con muchas obras** | Media | Alto | Índices optimizados, vistas materializadas |

### Riesgos de Negocio

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Cambios en APIs de IMSS/INFONAVIT** | Media | Alto | Abstracción de integraciones, monitoreo continuo |
| **Resistencia a adopción de app móvil** | Media | Alto | UX simple, capacitación, incentivos |
| **Requerimientos de INFONAVIT cambian** | Alta | Medio | Arquitectura modular, fácil de ajustar |

---

## 📋 Definición de "Done" por Sprint

### Criterios Generales
- [ ] Código revisado (code review por al menos 1 peer)
- [ ] Tests unitarios >80% coverage
- [ ] Tests E2E para flujos críticos
- [ ] Documentación técnica actualizada
- [ ] Deploy exitoso a staging
- [ ] QA pass (sin bugs críticos)
- [ ] Aprobación de Product Owner

### Criterios Específicos por Tipo

**Backend:**
- [ ] API documentada en Swagger/OpenAPI
- [ ] Endpoints con validación de entrada
- [ ] Manejo de errores estandarizado
- [ ] Logs estructurados

**Frontend/App:**
- [ ] UI responsive (móvil/tablet/desktop)
- [ ] Accesibilidad básica (WCAG 2.1 AA)
- [ ] Loading states y error handling
- [ ] UX validada con usuario

**Database:**
- [ ] Migraciones testeadas (up/down)
- [ ] RLS policies validadas
- [ ] Índices optimizados
- [ ] Backups configurados

---

## 🔄 Proceso de Desarrollo

### Workflow de Sprint (2 semanas)

**Semana 1:**
- Lunes: Sprint Planning (4h)
  - Refinamiento de US
  - Estimación de tareas
  - Asignación de trabajo
- Martes-Viernes: Desarrollo
  - Daily standups (15 min)
  - Pair programming (opcional)
  - Code reviews continuos

**Semana 2:**
- Lunes-Miércoles: Desarrollo + Testing
- Jueves:
  - Code freeze 12:00 PM
  - QA intensivo
  - Bug fixes críticos
- Viernes:
  - Deploy a staging
  - Sprint Review (2h)
  - Sprint Retrospective (1h)
  - Sprint Planning siguiente (2h)

### Herramientas

- **Project Management:** Jira / Linear / GitHub Projects
- **Code Repository:** GitHub / GitLab
- **CI/CD:** GitHub Actions / GitLab CI
- **Communication:** Slack / Discord
- **Documentation:** Notion / Confluence
- **Design:** Figma

---

## 📈 Tracking de Progreso

### Métricas Clave

**Velocidad:**
- SP completados por sprint
- Target: 40-50 SP por sprint (2 semanas)

**Calidad:**
- Code coverage: >80%
- Bugs críticos: 0
- Deuda técnica: <10% del tiempo

**Deployment:**
- Frequency: 1x por sprint mínimo
- Lead time: <2 días (feature → staging)
- MTTR: <4 horas

---

## 🎓 Capacitación del Equipo

### Sprint 0-1
- **GAMILIT Codebase Tour** (4h)
  - Arquitectura de GAMILIT
  - Componentes reutilizables
  - Patrones y convenciones
- **Stack Técnico** (4h)
  - Node.js + Express + TypeScript
  - React + Vite
  - PostgreSQL + RLS

### Sprint 7
- **React Native Fundamentals** (8h)
  - Para mobile developer
  - Expo vs CLI
  - Offline-first patterns

### Sprint 9
- **Integraciones IMSS/INFONAVIT** (4h)
  - APIs y autenticación
  - Formato de archivos SUA
  - Troubleshooting común

---

## 🚀 Próximos Pasos Inmediatos

### Esta Semana
1. [ ] Aprobar roadmap ajustado (7 épicas, 16 semanas)
2. [ ] Confirmar presupuesto $175,000 MXN
3. [ ] Asignar equipo a sprints
4. [ ] Crear épica MAI-006 completa (RF, ET, US)

### Semana 1 (Sprint 0)
1. [ ] Setup de repositorio
2. [ ] Migración de componentes GAMILIT
3. [ ] Configurar ambientes
4. [ ] Kickoff con equipo completo

### Semana 2 (Sprint 1)
1. [ ] Iniciar desarrollo MAI-001
2. [ ] Daily standups
3. [ ] Code reviews

---

**Generado:** 2025-11-17
**Versión:** 2.0.0 (Ajustado para incluir RRHH en Fase 1)
**Próxima revisión:** Post Sprint 0
