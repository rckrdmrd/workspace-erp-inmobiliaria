# PLAN DE DOCUMENTACIÓN - ERP GENÉRICO

**Proyecto:** ERP Genérico (Base Reutilizable)
**Versión:** 1.0.0
**Fecha:** 2025-11-24
**Estado:** 📋 En planificación

---

## 🎯 OBJETIVO

Crear la documentación completa del **ERP Genérico**, que servirá como base reutilizable para los 3 ERPs especializados:
- ERP Construcción
- ERP Vidrio Templado
- ERP Mecánicas Diesel

El ERP Genérico contendrá los **módulos core** comunes a todos los sistemas ERP (autenticación, usuarios, catálogos, financiero básico, inventario básico, compras básico, CRM básico, etc.).

---

## 📚 REFERENCIAS

### Documentación de Referencia
- **ERP Construcción:** `projects/erp-construccion/docs/` - Estructura y formato a seguir
- **Odoo Community Edition:** `shared/reference/ODOO-MODULES-ANALYSIS.md` - Análisis de módulos
- **Proyecto GAMILIT:** `shared/reference/gamilit/` - Patrones arquitectónicos

### Módulos Odoo de Referencia para ERP Genérico
Los siguientes módulos de Odoo serán analizados como referencia:

| Módulo Odoo | Aplicación en ERP Genérico | Prioridad |
|-------------|---------------------------|-----------|
| **base** | Sistema base, modelos fundamentales | P0 |
| **auth_signup** | Autenticación y registro | P0 |
| **web** | Framework web y API | P0 |
| **account** | Módulo financiero básico | P0 |
| **stock** | Inventario básico | P0 |
| **purchase** | Compras básicas | P0 |
| **sale** | Ventas básicas | P0 |
| **crm** | CRM básico | P1 |
| **hr** | Recursos humanos básico | P1 |
| **project** | Proyectos genéricos | P1 |
| **analytic** | Contabilidad analítica | P0 |
| **portal** | Portal de usuarios externos | P1 |
| **mail** | Sistema de mensajería y notificaciones | P0 |

---

## 🔄 METODOLOGÍA: 3 ETAPAS

### ETAPA 1: ANÁLISIS Y RETROALIMENTACIÓN (2-3 semanas)

**Objetivo:** Analizar módulos de Odoo, identificar mejores prácticas, y retroalimentar lo que ya se tiene del ERP Construcción.

**Actividades:**

1. **Análisis de Módulos Core de Odoo**
   - Revisar cada módulo de referencia listado arriba
   - Documentar patrones arquitectónicos identificados
   - Documentar modelos de datos encontrados
   - Identificar relaciones entre módulos
   - Crear documentos de análisis en `shared/analysis/odoo-comparison/`

2. **Identificación de Componentes Reutilizables**
   - Listar componentes que serán compartidos entre todos los ERPs
   - Definir qué va en `shared/components/` vs qué va en cada proyecto
   - Crear mapa de dependencias entre componentes

3. **Retroalimentación al ERP Construcción**
   - Comparar módulos del ERP Construcción con Odoo
   - Identificar gaps y oportunidades de mejora
   - Proponer ajustes arquitectónicos si es necesario
   - Documentar hallazgos en ADRs (Architecture Decision Records)

4. **Definición de Módulos del ERP Genérico**
   - Listar módulos que serán parte del ERP Genérico
   - Definir alcance de cada módulo (qué incluye, qué no)
   - Establecer prioridades (P0, P1, P2)

**Entregables Etapa 1:**
- [ ] Documento de análisis de cada módulo Odoo relevante
- [ ] Mapa de componentes reutilizables
- [ ] ADRs con decisiones arquitectónicas
- [ ] Lista definitiva de módulos del ERP Genérico con alcance
- [ ] Retroalimentación documentada para ERP Construcción

---

### ETAPA 2: MODELADO DE REQUERIMIENTOS Y BASE DE DATOS (3-4 semanas)

**Objetivo:** Diseñar los modelos de dominio, requerimientos funcionales, y esquemas de base de datos para el ERP Genérico.

**Actividades:**

1. **Modelado de Dominio**
   - Crear modelos de dominio por área funcional
   - Documentar entidades, atributos y relaciones
   - Guardar en `shared/analysis/domain-models/`
   - Crear diagramas UML/ER

2. **Definición de Requerimientos Funcionales (RF)**
   - Para cada módulo del ERP Genérico, crear requerimientos funcionales
   - Usar formato de ERP Construcción como plantilla
   - Incluir casos de uso, reglas de negocio, validaciones
   - Estructura: `RF-{MODULO}-{NNN}-titulo.md`

3. **Diseño de Base de Datos**
   - Diseñar schemas de PostgreSQL
   - Definir tablas, campos, tipos de datos
   - Crear enums, constraints, indices
   - Diseñar funciones PL/pgSQL reutilizables
   - Implementar RLS (Row Level Security) desde el diseño
   - Documentar en archivos DDL

4. **Especificaciones Técnicas (ET)**
   - Para cada RF, crear especificación técnica correspondiente
   - Incluir detalles de implementación (API, BD, UI)
   - Estructura: `ET-{MODULO}-{NNN}-titulo.md`

5. **Trazabilidad**
   - Crear matriz de trazabilidad RF ↔ ET ↔ Objetos de BD
   - Documentar en archivos YAML

**Entregables Etapa 2:**
- [ ] Modelos de dominio por área funcional
- [ ] Requerimientos funcionales completos (estimado: 40-50 RF)
- [ ] Especificaciones técnicas completas (estimado: 40-50 ET)
- [ ] Esquemas de base de datos diseñados (DDL completos)
- [ ] Matriz de trazabilidad inicial

---

### ETAPA 3: DOCUMENTACIÓN DETALLADA Y PREPARACIÓN (2-3 semanas)

**Objetivo:** Crear la estructura de documentación completa siguiendo el formato del ERP Construcción, y preparar para desarrollo.

**Actividades:**

1. **Creación de Estructura de Carpetas**
   - Crear estructura similar a ERP Construcción
   - Organizar por fases (si aplica)
   - Crear carpetas de módulos con subcarpetas estándar

2. **Historias de Usuario (US)**
   - Convertir RF/ET en historias de usuario ágiles
   - Formato: Como [rol] quiero [funcionalidad] para [beneficio]
   - Incluir criterios de aceptación
   - Estructura: `US-{MODULO}-{NNN}-titulo.md`

3. **Documentación de Módulos**
   - Para cada módulo crear:
     - `README.md` - Descripción del módulo
     - `_MAP.md` - Índice maestro del módulo
     - Inventarios de implementación (DATABASE.yml, BACKEND.yml, FRONTEND.yml)

4. **Planes de Pruebas**
   - Crear plan de pruebas por módulo
   - Definir casos de prueba (test cases)
   - Establecer criterios de cobertura (>80%)

5. **Documentación Transversal**
   - Crear ESTRUCTURA-COMPLETA.md (similar a construcción)
   - Crear ROADMAP-DETALLADO.md
   - Crear guías de uso de referencias Odoo

**Entregables Etapa 3:**
- [ ] Estructura completa de carpetas creada
- [ ] Historias de usuario completas (estimado: 80-100 US)
- [ ] Documentación de módulos (README.md, _MAP.md)
- [ ] Planes de pruebas por módulo
- [ ] Documentación transversal (ESTRUCTURA-COMPLETA.md, ROADMAP-DETALLADO.md)

---

## 📦 MÓDULOS PROPUESTOS PARA ERP GENÉRICO

Basado en el análisis de Odoo y las necesidades comunes de los 3 ERPs especializados:

### Fase 1: Core Fundamental (Prioridad P0)

| Código | Nombre | Descripción | Referencia Odoo |
|--------|--------|-------------|-----------------|
| **MGN-001** | Fundamentos | Auth, usuarios, roles, multi-tenancy, RBAC | base, auth_signup, web |
| **MGN-002** | Empresas y Organizaciones | Gestión de empresas/organizaciones | base (res.company) |
| **MGN-003** | Catálogos Maestros | Catálogos comunes (países, monedas, UOM, etc.) | base, product |
| **MGN-004** | Financiero Básico | Cuentas, asientos, plan de cuentas | account |
| **MGN-005** | Inventario Básico | Productos, almacenes, movimientos | stock |
| **MGN-006** | Compras Básico | Órdenes de compra, proveedores | purchase |
| **MGN-007** | Ventas Básico | Cotizaciones, órdenes de venta, clientes | sale |
| **MGN-008** | Contabilidad Analítica | Cuentas analíticas, centros de costo | analytic |

**Totales Fase 1:**
- Módulos: 8
- RF estimados: ~40
- ET estimados: ~40
- US estimados: ~80
- Duración: 8-10 semanas de documentación

### Fase 2: Módulos Complementarios (Prioridad P1)

| Código | Nombre | Descripción | Referencia Odoo |
|--------|--------|-------------|-----------------|
| **MGN-009** | CRM Básico | Leads, oportunidades, pipeline | crm |
| **MGN-010** | Recursos Humanos Básico | Empleados, departamentos, contratos | hr |
| **MGN-011** | Proyectos Genéricos | Proyectos, tareas, seguimiento | project |
| **MGN-012** | Reportes y Analytics | Dashboards, reportes, exportación | reporting (varios) |
| **MGN-013** | Portal de Usuarios | Portal para clientes/proveedores | portal |
| **MGN-014** | Mensajería y Notificaciones | Sistema de mensajes, notificaciones | mail |

**Totales Fase 2:**
- Módulos: 6
- RF estimados: ~30
- ET estimados: ~30
- US estimados: ~60
- Duración: 6-8 semanas de documentación

---

## 🏗️ ESTRUCTURA DE DOCUMENTACIÓN (Similar a ERP Construcción)

```
projects/erp-generic/
├── README.md                              # Descripción del proyecto
├── PROJECT-STATUS.md                      # Estado del proyecto
│
├── docs/
│   ├── 00-overview/                       # Documentación General
│   │   └── MVP-GENERICO.md                # Definición del ERP Genérico
│   │
│   ├── 01-analysis/                       # ETAPA 1: Análisis
│   │   ├── README.md
│   │   ├── odoo-analysis/                 # Análisis de módulos Odoo
│   │   │   ├── odoo-base-analysis.md
│   │   │   ├── odoo-account-analysis.md
│   │   │   ├── odoo-stock-analysis.md
│   │   │   └── ...
│   │   ├── component-mapping/             # Mapeo de componentes
│   │   │   └── shared-components-map.md
│   │   └── adr/                           # Architecture Decision Records
│   │       ├── ADR-001-stack-tecnologico.md
│   │       ├── ADR-002-arquitectura-modular.md
│   │       └── ...
│   │
│   ├── 02-requirements/                   # ETAPA 2: Requerimientos
│   │   ├── README.md
│   │   ├── domain-models/                 # Modelos de dominio
│   │   │   ├── auth-domain.md
│   │   │   ├── financial-domain.md
│   │   │   ├── inventory-domain.md
│   │   │   └── ...
│   │   └── database-design/               # Diseño de BD
│   │       ├── schemas/
│   │       │   ├── auth-schema.sql
│   │       │   ├── financial-schema.sql
│   │       │   └── ...
│   │       └── migrations/
│   │
│   ├── 03-architecture/                   # ETAPA 3: Arquitectura
│   │   ├── README.md
│   │   ├── system-architecture.md         # Arquitectura general
│   │   ├── api-design.md                  # Diseño de APIs
│   │   ├── security-architecture.md       # Arquitectura de seguridad
│   │   └── deployment-architecture.md     # Arquitectura de despliegue
│   │
│   ├── 01-fase-core/                      # Fase 1: Módulos Core
│   │   ├── README.md
│   │   ├── _MAP.md
│   │   │
│   │   ├── MGN-001-fundamentos/
│   │   │   ├── README.md
│   │   │   ├── _MAP.md
│   │   │   ├── requerimientos/
│   │   │   │   ├── RF-AUTH-001-autenticacion-jwt.md
│   │   │   │   ├── RF-AUTH-002-gestion-usuarios.md
│   │   │   │   └── ...
│   │   │   ├── especificaciones/
│   │   │   │   ├── ET-AUTH-001-jwt-implementation.md
│   │   │   │   ├── ET-AUTH-002-user-management-api.md
│   │   │   │   └── ...
│   │   │   ├── historias-usuario/
│   │   │   │   ├── US-FUND-001-login.md
│   │   │   │   ├── US-FUND-002-register.md
│   │   │   │   └── ...
│   │   │   ├── implementacion/
│   │   │   │   ├── TRACEABILITY.yml
│   │   │   │   ├── DATABASE.yml
│   │   │   │   ├── BACKEND.yml
│   │   │   │   └── FRONTEND.yml
│   │   │   └── pruebas/
│   │   │       ├── TEST-PLAN.md
│   │   │       └── TEST-CASES.md
│   │   │
│   │   ├── MGN-002-empresas-organizaciones/
│   │   ├── MGN-003-catalogos-maestros/
│   │   ├── MGN-004-financiero-basico/
│   │   ├── MGN-005-inventario-basico/
│   │   ├── MGN-006-compras-basico/
│   │   ├── MGN-007-ventas-basico/
│   │   └── MGN-008-contabilidad-analitica/
│   │
│   ├── 02-fase-complementaria/            # Fase 2: Módulos Complementarios
│   │   ├── README.md
│   │   ├── _MAP.md
│   │   │
│   │   ├── MGN-009-crm-basico/
│   │   ├── MGN-010-rrhh-basico/
│   │   ├── MGN-011-proyectos-genericos/
│   │   ├── MGN-012-reportes-analytics/
│   │   ├── MGN-013-portal-usuarios/
│   │   └── MGN-014-mensajeria-notificaciones/
│   │
│   ├── ESTRUCTURA-COMPLETA.md             # Estructura completa del proyecto
│   ├── ROADMAP-DETALLADO.md               # Roadmap detallado
│   └── GUIA-USO-REFERENCIAS-ODOO.md       # Guía de uso de referencias Odoo
│
├── apps/                                  # Código (a desarrollar después)
│   ├── database/
│   ├── backend/
│   ├── frontend/
│   └── mobile/
│
├── orchestration/                         # Orchestration local del proyecto
│   ├── agentes/
│   ├── prompts/
│   └── trazas/
│
└── bugs/                                  # Bugs del proyecto
    ├── BUGS-ACTIVOS.md
    └── BUGS-RESUELTOS.md
```

---

## 🤖 WORKFLOW CON AGENTE DE ARQUITECTURA

### Preparación antes de lanzar el agente

1. **Configurar contexto del agente:**
   - Cargar prompt de Architecture-Analyst
   - Proveer este plan de documentación
   - Proveer análisis de Odoo
   - Proveer estructura de ERP Construcción como referencia

2. **Definir tareas del agente por etapa:**

**ETAPA 1 - Tareas del Agente:**
```
1. Analizar módulos de Odoo listados en la tabla de referencias
2. Para cada módulo crear documento de análisis:
   - Modelos de datos identificados
   - Patrones arquitectónicos observados
   - APIs y endpoints relevantes
   - Reglas de negocio encontradas
3. Crear ADRs para decisiones arquitectónicas clave
4. Generar mapa de componentes reutilizables
5. Revisar ERP Construcción y proponer retroalimentación
```

**ETAPA 2 - Tareas del Agente:**
```
1. Crear modelos de dominio para cada área funcional
2. Diseñar esquemas de base de datos (DDL completos)
3. Crear requerimientos funcionales (RF-XXX-NNN)
4. Crear especificaciones técnicas (ET-XXX-NNN)
5. Generar matriz de trazabilidad
```

**ETAPA 3 - Tareas del Agente:**
```
1. Crear estructura de carpetas completa
2. Generar historias de usuario (US-XXX-NNN)
3. Crear documentación de módulos (README, _MAP)
4. Crear planes de pruebas
5. Generar documentación transversal
```

### Comando para lanzar el agente

```bash
# Una vez que este plan esté aprobado por el usuario:

# ETAPA 1:
Task tool → subagent_type: "general-purpose"
Prompt: "Ejecutar ETAPA 1 del plan de documentación del ERP Genérico ubicado en projects/erp-generic/docs/PLAN-DOCUMENTACION-ERP-GENERICO.md. Analizar módulos de Odoo listados, crear documentos de análisis, ADRs, y mapa de componentes. Usar como referencia shared/reference/ODOO-MODULES-ANALYSIS.md y la estructura de projects/erp-construccion/docs/"

# ETAPA 2:
Task tool → subagent_type: "general-purpose"
Prompt: "Ejecutar ETAPA 2 del plan de documentación del ERP Genérico. Crear modelos de dominio, diseñar esquemas de BD, crear RF y ET para todos los módulos listados en MGN-001 a MGN-014. Seguir formato de projects/erp-construccion/docs/01-fase-alcance-inicial/"

# ETAPA 3:
Task tool → subagent_type: "general-purpose"
Prompt: "Ejecutar ETAPA 3 del plan de documentación del ERP Genérico. Crear estructura completa, historias de usuario, documentación de módulos, planes de pruebas, y documentación transversal. Seguir exactamente la estructura de projects/erp-construccion/docs/"
```

---

## 📊 MÉTRICAS Y ESTIMACIONES

### Esfuerzo Estimado

| Etapa | Duración | Archivos a Crear | Story Points |
|-------|----------|------------------|--------------|
| **Etapa 1: Análisis** | 2-3 semanas | ~20 archivos | 40 SP |
| **Etapa 2: Requerimientos** | 3-4 semanas | ~100 archivos | 80 SP |
| **Etapa 3: Documentación** | 2-3 semanas | ~150 archivos | 60 SP |
| **Total** | **7-10 semanas** | **~270 archivos** | **180 SP** |

### Desglose de Archivos

| Tipo | Cantidad Estimada | Por Módulo (14 módulos) |
|------|-------------------|-------------------------|
| **Análisis Odoo** | 12 archivos | - |
| **ADRs** | 8 archivos | - |
| **Modelos de dominio** | 10 archivos | - |
| **RF (Requerimientos)** | 70 archivos | ~5 por módulo |
| **ET (Especificaciones)** | 70 archivos | ~5 por módulo |
| **US (Historias)** | 140 archivos | ~10 por módulo |
| **README/MAP** | 28 archivos | 2 por módulo |
| **Otros** | 32 archivos | - |
| **Total** | **~370 archivos** | - |

---

## ✅ CRITERIOS DE COMPLETITUD

### Etapa 1 completada cuando:
- [ ] Todos los módulos Odoo listados han sido analizados
- [ ] Se han creado al menos 5 ADRs
- [ ] Existe mapa de componentes compartidos
- [ ] Se ha revisado ERP Construcción y documentado retroalimentación
- [ ] Lista definitiva de módulos MGN-001 a MGN-014 está aprobada

### Etapa 2 completada cuando:
- [ ] Existen modelos de dominio para todas las áreas
- [ ] Todos los módulos tienen RF completos (~5 por módulo)
- [ ] Todos los módulos tienen ET completos (~5 por módulo)
- [ ] Esquemas de BD están diseñados (DDL completos)
- [ ] Matriz de trazabilidad existe y está actualizada

### Etapa 3 completada cuando:
- [ ] Estructura de carpetas completa existe
- [ ] Todos los módulos tienen US completos (~10 por módulo)
- [ ] Todos los módulos tienen README.md y _MAP.md
- [ ] Planes de pruebas existen para todos los módulos
- [ ] ESTRUCTURA-COMPLETA.md y ROADMAP-DETALLADO.md existen

---

## 🎯 SIGUIENTE PASO INMEDIATO

**ACCIÓN REQUERIDA:**

1. **Revisar este plan** con el equipo/stakeholders
2. **Aprobar alcance** de módulos MGN-001 a MGN-014
3. **Validar metodología** de 3 etapas
4. **Lanzar agente de arquitectura** para ETAPA 1

**Comando sugerido para iniciar:**

```
Lanzar agente de arquitectura para ejecutar ETAPA 1 del plan de documentación del ERP Genérico.
Revisar módulos de Odoo, crear análisis, ADRs, y mapa de componentes.
```

---

## 📚 REFERENCIAS ADICIONALES

- [Análisis de Módulos Odoo](../../../shared/reference/ODOO-MODULES-ANALYSIS.md)
- [ERP Construcción - Estructura](../../erp-construccion/docs/ESTRUCTURA-COMPLETA.md)
- [Workspace Overview](../../../WORKSPACE-OVERVIEW.md)
- [Política de Uso de Agentes](../../../shared/orchestration/directivas/POLITICAS-USO-AGENTES.md)

---

**Creado:** 2025-11-24
**Versión:** 1.0.0
**Autor:** Claude Code + Architecture Planning
**Estado:** ✅ Plan completo listo para revisión
