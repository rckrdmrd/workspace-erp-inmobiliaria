# PROPUESTA DE REESTRUCTURACIÓN MULTI-PROYECTO ERP

**Fecha:** 2025-11-23
**Versión:** 1.0.0
**Estado:** 📋 Propuesta - Pendiente de aprobación

---

## 📋 RESUMEN EJECUTIVO

**Objetivo:** Transformar el workspace actual (originalmente diseñado para un solo ERP de construcción) en un workspace multi-proyecto que soporte 4 ERPs diferentes:

1. **ERP Construcción** (Original - Inmobiliaria/INFONAVIT)
2. **ERP Vidrio Templado** (Nuevo - Producción de vidrio)
3. **ERP Genérico** (Nuevo - Base para otros ERPs)
4. **ERP Mecánicas Diesel** (Nuevo - Laboratorios mecánicos)

**Estrategia:** Workspaces anidados con componentes compartidos y desarrollo paralelo.

---

## 🎯 OBJETIVOS DE LA REESTRUCTURACIÓN

### Objetivos Principales

1. ✅ **Compartir componentes comunes** (reference, orchestration, agentes)
2. ✅ **Workspaces independientes** para cada ERP con su carpeta apps/ y docs/
3. ✅ **Sistema de bugs compartido** - los bugs detectados en un proyecto se rastrean para todos
4. ✅ **Desarrollo en paralelo** - poder trabajar en varios ERPs simultáneamente
5. ✅ **Fase de análisis** - modelado y comparación con Odoo antes de desarrollo
6. ✅ **Reutilización de código** - componentes de un ERP pueden usarse en otros

### Objetivos Secundarios

- Orden de desarrollo: ERP Genérico → ERPs específicos
- Trazabilidad de features compartidos
- Validación contra proyecto de referencia (Odoo)
- Gestión centralizada de agentes

---

## 🏗️ ESTRUCTURA PROPUESTA

### Visión General

```
workspace-erp-multi/                    # Workspace raíz (renombrado)
│
├── .git/                               # Control de versiones unificado
├── .gitignore                          # Global
│
├── README.md                           # Documento principal multi-proyecto
├── WORKSPACE-OVERVIEW.md               # Mapa de navegación de todos los proyectos
│
├── shared/                             # ⭐ COMPONENTES COMPARTIDOS
│   │
│   ├── reference/                      # 🔗 Referencias compartidas (Odoo, Gamilit, etc.)
│   │   ├── odoo/                       # Proyecto de referencia principal
│   │   ├── gamilit/                    # Proyecto de referencia secundario
│   │   └── README.md                   # Guía de uso de referencias
│   │
│   ├── orchestration/                  # 🤖 Sistema de agentes compartido
│   │   ├── agentes/                    # Agentes (database, backend, frontend, etc.)
│   │   ├── directivas/                 # Políticas y estándares
│   │   ├── prompts/                    # Prompts de agentes
│   │   ├── templates/                  # Templates de documentación
│   │   ├── scripts/                    # Scripts de automatización
│   │   └── README.md                   # Guía de uso de orchestration
│   │
│   ├── analysis/                       # 📊 Análisis y modelado compartido
│   │   ├── domain-models/              # Modelos de dominio base
│   │   │   ├── common/                 # Modelos comunes a todos los ERPs
│   │   │   │   ├── auth.md             # Autenticación/autorización
│   │   │   │   ├── users.md            # Usuarios y roles
│   │   │   │   ├── companies.md        # Empresas/organizaciones
│   │   │   │   ├── catalogs.md         # Catálogos maestros
│   │   │   │   └── reporting.md        # Sistema de reportes
│   │   │   ├── financial/              # Módulos financieros
│   │   │   ├── inventory/              # Módulos de inventario
│   │   │   ├── purchasing/             # Módulos de compras
│   │   │   ├── production/             # Módulos de producción
│   │   │   └── crm/                    # Módulos de CRM
│   │   ├── odoo-comparison/            # 🔍 Análisis vs Odoo
│   │   │   ├── module-mapping.md       # Mapeo de módulos Odoo → ERPs
│   │   │   ├── data-models.md          # Comparación de modelos de datos
│   │   │   ├── best-practices.md       # Mejores prácticas de Odoo
│   │   │   └── lessons-learned.md      # Lecciones aprendidas
│   │   ├── architecture/               # Decisiones arquitectónicas
│   │   │   ├── adr-template.md         # Template de ADR
│   │   │   ├── ADR-001-monorepo.md     # Decisión: monorepo multi-proyecto
│   │   │   ├── ADR-002-shared-components.md
│   │   │   └── ADR-003-development-order.md
│   │   └── README.md
│   │
│   ├── bugs/                           # 🐛 Sistema de bugs compartido
│   │   ├── global/                     # Bugs que afectan a todos los proyectos
│   │   │   ├── BUGS-ACTIVOS.md         # Bugs abiertos globales
│   │   │   ├── BUGS-RESUELTOS.md       # Bugs resueltos globales
│   │   │   └── BUGS-PRIORIZADOS.yml    # Priorización de bugs
│   │   ├── by-component/               # Bugs por componente compartido
│   │   │   ├── auth-bugs.md
│   │   │   ├── database-bugs.md
│   │   │   ├── api-bugs.md
│   │   │   └── ui-bugs.md
│   │   └── README.md                   # Guía de reporte de bugs
│   │
│   ├── components/                     # 💎 Código reutilizable
│   │   ├── database/                   # Schemas y funciones DB compartidas
│   │   │   ├── common-schemas/         # Schemas comunes (auth, users, etc.)
│   │   │   ├── common-functions/       # Funciones PL/pgSQL reutilizables
│   │   │   └── README.md
│   │   ├── backend/                    # Módulos backend compartidos
│   │   │   ├── auth-module/            # Módulo de autenticación
│   │   │   ├── common-entities/        # Entidades comunes
│   │   │   ├── common-services/        # Servicios reutilizables
│   │   │   ├── utils/                  # Utilidades
│   │   │   └── README.md
│   │   ├── frontend/                   # Componentes UI compartidos
│   │   │   ├── ui-kit/                 # Kit de componentes UI
│   │   │   │   ├── buttons/
│   │   │   │   ├── forms/
│   │   │   │   ├── tables/
│   │   │   │   ├── modals/
│   │   │   │   └── layouts/
│   │   │   ├── common-hooks/           # Hooks React reutilizables
│   │   │   ├── common-stores/          # Stores Zustand compartidos
│   │   │   └── README.md
│   │   └── README.md                   # Guía de uso de componentes compartidos
│   │
│   └── docs/                           # 📚 Documentación compartida
│       ├── onboarding/                 # Guías de inicio
│       ├── standards/                  # Estándares de código
│       ├── guides/                     # Guías de desarrollo
│       └── README.md
│
├── projects/                           # 📁 PROYECTOS ERP INDIVIDUALES
│   │
│   ├── erp-generic/                    # 🔷 ERP GENÉRICO (Base)
│   │   ├── README.md                   # Descripción del proyecto
│   │   ├── PROJECT-STATUS.md           # Estado del proyecto
│   │   │
│   │   ├── docs/                       # Documentación específica
│   │   │   ├── 00-overview/
│   │   │   │   ├── PROJECT-SCOPE.md    # Alcance del proyecto
│   │   │   │   ├── MVP-APP.md          # Plan MVP
│   │   │   │   └── ROADMAP.md          # Roadmap
│   │   │   ├── 01-analysis/            # Fase de análisis
│   │   │   │   ├── requirements/       # Requerimientos
│   │   │   │   ├── domain-model/       # Modelado de dominio
│   │   │   │   ├── database-design/    # Diseño de BD
│   │   │   │   └── odoo-comparison/    # Comparación con Odoo
│   │   │   ├── 02-modules/             # Documentación por módulo
│   │   │   │   ├── MOD-001-auth/       # Módulo de autenticación
│   │   │   │   ├── MOD-002-users/      # Módulo de usuarios
│   │   │   │   ├── MOD-003-catalog/    # Módulo de catálogos
│   │   │   │   └── [otros módulos...]
│   │   │   ├── 03-architecture/        # Arquitectura
│   │   │   │   ├── adr/                # ADRs específicos del proyecto
│   │   │   │   ├── database-schema/    # Esquema de BD
│   │   │   │   └── api-design/         # Diseño de API
│   │   │   └── 04-development/         # Guías de desarrollo
│   │   │
│   │   ├── apps/                       # Código de la aplicación
│   │   │   ├── database/               # Scripts de base de datos
│   │   │   ├── backend/                # API backend
│   │   │   ├── frontend/               # Aplicaciones frontend
│   │   │   │   ├── web/                # Web app
│   │   │   │   └── mobile/             # Mobile app
│   │   │   └── README.md
│   │   │
│   │   ├── orchestration/              # Trazas específicas del proyecto
│   │   │   ├── trazas/
│   │   │   │   ├── TRAZA-REQUERIMIENTOS.md
│   │   │   │   ├── TRAZA-TAREAS-DATABASE.md
│   │   │   │   ├── TRAZA-TAREAS-BACKEND.md
│   │   │   │   └── TRAZA-TAREAS-FRONTEND.md
│   │   │   ├── inventarios/
│   │   │   │   ├── DATABASE_INVENTORY.yml
│   │   │   │   ├── BACKEND_INVENTORY.yml
│   │   │   │   └── FRONTEND_INVENTORY.yml
│   │   │   ├── estados/
│   │   │   │   └── ESTADO-PROYECTO.json
│   │   │   └── reportes/
│   │   │       └── DASHBOARD.yml
│   │   │
│   │   └── bugs/                       # Bugs específicos del proyecto
│   │       ├── BUGS-ACTIVOS.md
│   │       └── BUGS-RESUELTOS.md
│   │
│   ├── erp-construccion/               # 🏗️ ERP CONSTRUCCIÓN
│   │   ├── README.md                   # "ERP para empresas de construcción e INFONAVIT"
│   │   ├── PROJECT-STATUS.md
│   │   ├── docs/                       # (estructura similar a generic)
│   │   │   ├── 00-overview/
│   │   │   │   └── MVP-APP.md          # MVP específico de construcción
│   │   │   ├── 01-analysis/
│   │   │   ├── 02-modules/
│   │   │   │   ├── MOD-001-projects/   # Gestión de proyectos
│   │   │   │   ├── MOD-002-budgets/    # Presupuestos
│   │   │   │   ├── MOD-003-construction/ # Control de obra
│   │   │   │   ├── MOD-004-infonavit/  # Cumplimiento INFONAVIT
│   │   │   │   └── [otros módulos...]
│   │   │   ├── 03-architecture/
│   │   │   └── 04-development/
│   │   ├── apps/
│   │   ├── orchestration/
│   │   └── bugs/
│   │
│   ├── erp-vidrio-templado/            # 🪟 ERP VIDRIO TEMPLADO
│   │   ├── README.md                   # "ERP para producción de vidrio templado"
│   │   ├── PROJECT-STATUS.md
│   │   ├── docs/
│   │   │   ├── 00-overview/
│   │   │   ├── 01-analysis/
│   │   │   ├── 02-modules/
│   │   │   │   ├── MOD-001-production/ # Gestión de producción
│   │   │   │   ├── MOD-002-quality/    # Control de calidad
│   │   │   │   ├── MOD-003-inventory/  # Inventario de materia prima
│   │   │   │   ├── MOD-004-orders/     # Órdenes de producción
│   │   │   │   └── [otros módulos...]
│   │   │   ├── 03-architecture/
│   │   │   └── 04-development/
│   │   ├── apps/
│   │   ├── orchestration/
│   │   └── bugs/
│   │
│   └── erp-mecanicas-diesel/           # 🔧 ERP MECÁNICAS DIESEL
│       ├── README.md                   # "ERP para laboratorios de mecánica diesel"
│       ├── PROJECT-STATUS.md
│       ├── docs/
│       │   ├── 00-overview/
│       │   ├── 01-analysis/
│       │   ├── 02-modules/
│       │   │   ├── MOD-001-diagnostics/ # Diagnósticos
│       │   │   ├── MOD-002-repairs/    # Reparaciones
│       │   │   ├── MOD-003-parts/      # Refacciones
│       │   │   ├── MOD-004-maintenance/ # Mantenimiento
│       │   │   └── [otros módulos...]
│       │   ├── 03-architecture/
│       │   └── 04-development/
│       ├── apps/
│       ├── orchestration/
│       └── bugs/
│
└── tools/                              # 🛠️ HERRAMIENTAS Y SCRIPTS
    ├── scaffolding/                    # Scripts para crear nuevos proyectos
    │   ├── create-new-erp-project.sh   # Script para crear nuevo ERP
    │   └── templates/                  # Templates de proyecto
    ├── migration/                      # Scripts de migración
    │   └── migrate-to-multi-project.sh # Migrar estructura actual
    ├── validation/                     # Scripts de validación
    │   ├── validate-structure.sh       # Validar estructura de carpetas
    │   └── check-dependencies.sh       # Verificar dependencias
    └── README.md
```

---

## 🔄 FLUJO DE TRABAJO MULTI-PROYECTO

### Fase 1: Análisis (NUEVA FASE)

Antes de iniciar cualquier desarrollo en un ERP:

1. **Análisis de Requerimientos**
   - Documentar requerimientos específicos del giro
   - Identificar módulos necesarios
   - Comparar con Odoo para validar diseño

2. **Modelado de Dominio**
   - Crear modelos de dominio en `shared/analysis/domain-models/`
   - Identificar entidades comunes vs específicas
   - Diseñar relaciones entre módulos

3. **Diseño de Base de Datos**
   - Crear diagrama ER
   - Definir schemas y tablas
   - Identificar funciones y triggers necesarios
   - Comparar con schema de Odoo

4. **Validación con Odoo**
   - Revisar módulos similares en Odoo
   - Identificar mejores prácticas
   - Evitar errores de diseño conocidos
   - Documentar en `shared/analysis/odoo-comparison/`

5. **Plan de Desarrollo**
   - Priorizar módulos (MVP first)
   - Identificar dependencias
   - Definir orden de implementación

### Fase 2: Desarrollo

1. **Setup del Proyecto**
   - Crear estructura usando `tools/scaffolding/create-new-erp-project.sh`
   - Copiar componentes compartidos necesarios
   - Configurar orchestration local

2. **Desarrollo Iterativo**
   - Usar agentes de `shared/orchestration/`
   - Seguir directivas compartidas
   - Reutilizar componentes de `shared/components/`
   - Documentar en trazas locales del proyecto

3. **Integración de Componentes Compartidos**
   - Cuando se crea un componente reutilizable → moverlo a `shared/components/`
   - Actualizar otros proyectos que puedan beneficiarse
   - Documentar en changelog del componente

### Fase 3: Testing y Validación

1. **Testing Local**
   - Tests unitarios por proyecto
   - Tests de integración
   - Validación de políticas

2. **Testing de Componentes Compartidos**
   - Ejecutar tests en todos los proyectos que usen el componente
   - Validar que no se rompa retrocompatibilidad

### Fase 4: Gestión de Bugs

#### Bugs Locales (específicos de un proyecto)
```
projects/erp-construccion/bugs/BUGS-ACTIVOS.md
```

#### Bugs Globales (afectan componentes compartidos)
```
shared/bugs/global/BUGS-ACTIVOS.md
```

**Flujo:**
1. Bug detectado en `erp-construccion`
2. ¿Afecta componente compartido?
   - **SÍ** → Reportar en `shared/bugs/global/`
   - **NO** → Reportar en `projects/erp-construccion/bugs/`
3. Si es global, revisar impacto en otros proyectos
4. Priorizar corrección
5. Al corregir, actualizar todos los proyectos afectados

---

## 🎯 ORDEN DE DESARROLLO RECOMENDADO

### Fase 1: ERP Genérico (Base) - 3-4 meses

**Objetivo:** Crear módulos base reutilizables

**Módulos a desarrollar:**
1. ✅ Autenticación y autorización (RBAC)
2. ✅ Gestión de usuarios y roles
3. ✅ Gestión de empresas/organizaciones
4. ✅ Catálogos maestros
5. ✅ Sistema de reportes base
6. ✅ Dashboard base
7. ✅ Módulo financiero básico
8. ✅ Módulo de inventario básico
9. ✅ Módulo de compras básico
10. ✅ CRM básico

**Resultado:** Componentes compartidos listos en `shared/components/`

### Fase 2: ERP Construcción - 4-5 meses

**Objetivo:** Especializar ERP genérico para construcción

**Módulos específicos:**
1. ✅ Gestión de proyectos de construcción
2. ✅ Presupuestos y costos
3. ✅ Control de obra y avances
4. ✅ INFONAVIT y cumplimiento normativo
5. ✅ Gestión de activos y maquinaria
6. ✅ Estimaciones y facturación

**Base:** Reutiliza 60-70% del código del ERP Genérico

### Fase 3: ERP Vidrio Templado (Paralelo con Construcción) - 3-4 meses

**Objetivo:** Especializar ERP genérico para producción

**Módulos específicos:**
1. ✅ Órdenes de producción
2. ✅ Control de calidad (testing de vidrio)
3. ✅ Inventario de materia prima
4. ✅ Gestión de hornos/maquinaria
5. ✅ Trazabilidad de lotes

**Base:** Reutiliza 60-70% del código del ERP Genérico

### Fase 4: ERP Mecánicas Diesel - 3-4 meses

**Objetivo:** ERP para servicios mecánicos

**Módulos específicos:**
1. ✅ Diagnósticos y pruebas
2. ✅ Órdenes de reparación
3. ✅ Inventario de refacciones
4. ✅ Gestión de vehículos en servicio
5. ✅ Cotizaciones y facturación

**Base:** Reutiliza 50-60% del código del ERP Genérico

---

## 🤖 GESTIÓN DE AGENTES

### Agentes Compartidos (en `shared/orchestration/agentes/`)

Todos los proyectos usan los mismos agentes:

- **Database-Agent** - Desarrollo de schemas/funciones/triggers
- **Backend-Agent** - Desarrollo de APIs y servicios
- **Frontend-Agent** - Desarrollo de interfaces
- **Requirements-Analyst** - Análisis de requerimientos
- **Code-Reviewer** - Revisión de código
- **Bug-Fixer** - Corrección de bugs
- **Feature-Developer** - Desarrollo de features completos
- **Policy-Auditor** - Auditoría de cumplimiento
- **Architecture-Analyst** (NUEVO) - Análisis y modelado pre-desarrollo

### Contexto de Agentes

Los agentes necesitan saber en qué proyecto trabajan:

**Prompt base:**
```
Proyecto activo: erp-construccion
Workspace: projects/erp-construccion/
Componentes compartidos: shared/components/
Referencias: shared/reference/odoo/
```

**Directivas a seguir:**
- Directivas globales: `shared/orchestration/directivas/`
- Inventarios locales: `projects/{proyecto}/orchestration/inventarios/`
- Trazas locales: `projects/{proyecto}/orchestration/trazas/`

---

## 📊 SISTEMA DE BUGS COMPARTIDO

### Estructura de Bugs

```yaml
# shared/bugs/global/BUGS-ACTIVOS.md

## BUG-GLOBAL-001: Error en validación de JWT
**Componente:** shared/components/backend/auth-module/
**Afecta a:**
  - erp-generic ✅
  - erp-construccion ✅
  - erp-vidrio-templado ❌ (no usa aún)
  - erp-mecanicas-diesel ❌ (no usa aún)
**Prioridad:** 🔴 Alta
**Estado:** 🔧 En corrección
**Detectado en:** erp-construccion
**Fecha:** 2025-11-23
**Asignado a:** Backend-Agent

### Descripción
JWT expira antes de tiempo configurado...

### Impacto
- erp-generic: Usuarios se desloguean cada 30 min
- erp-construccion: Usuarios se desloguean cada 30 min

### Plan de corrección
1. Corregir en shared/components/backend/auth-module/
2. Actualizar en erp-generic
3. Actualizar en erp-construccion
4. Validar en todos los proyectos
```

### Workflow de Bugs Globales

```
1. Bug detectado en proyecto X
   ↓
2. ¿Usa componente compartido?
   ↓ SÍ
3. Reportar en shared/bugs/global/
   ↓
4. Identificar proyectos afectados
   ↓
5. Priorizar según impacto
   ↓
6. Corregir en shared/components/
   ↓
7. Actualizar todos los proyectos afectados
   ↓
8. Validar en todos los proyectos
   ↓
9. Cerrar bug global
   ↓
10. Documentar lección aprendida
```

---

## 🔍 COMPARACIÓN CON ODOO (NUEVA FASE)

### Objetivo

Antes de desarrollar cualquier módulo:
1. Revisar cómo Odoo lo implementa
2. Identificar mejores prácticas
3. Evitar errores conocidos
4. Adaptar a nuestras necesidades

### Proceso de Comparación

**Paso 1: Análisis del módulo en Odoo**
```bash
# Ejemplo: Módulo de Inventario
cd shared/reference/odoo/addons/stock/

# Revisar:
- models/        # Modelos de datos
- views/         # Vistas
- security/      # Permisos
- reports/       # Reportes
```

**Paso 2: Documentar hallazgos**
```markdown
# shared/analysis/odoo-comparison/inventory-module.md

## Análisis del módulo stock de Odoo

### Modelos principales
- stock.location
- stock.move
- stock.picking
- stock.quant

### Relaciones
- location → quant (1:N)
- picking → move (1:N)

### Mejores prácticas identificadas
1. Uso de stock.move para trazabilidad
2. Separación de ubicaciones físicas vs lógicas
3. Sistema de reservas antes de movimientos

### Aplicable a nuestro ERP
✅ Adoptar modelo de stock.move
✅ Implementar sistema de ubicaciones
❌ No usar stock.picking (demasiado complejo para MVP)
```

**Paso 3: Adaptar a diseño propio**
```markdown
# projects/erp-generic/docs/01-analysis/database-design/inventory-schema.md

## Schema de Inventario (basado en análisis de Odoo)

### Tablas principales
- inventory_locations (inspirado en stock.location)
- inventory_movements (inspirado en stock.move)
- inventory_quantities (inspirado en stock.quant)

### Diferencias vs Odoo
- Simplificado para MVP
- Sin double-entry inventory
- Sin gestión de lotes (fase 2)
```

---

## 📁 MIGRACIÓN DE ESTRUCTURA ACTUAL

### Estado Actual

```
workspace-erp-inmobiliaria/          # Proyecto actual (construcción)
├── apps/                             # Apps de construcción
├── docs/                             # Docs de construcción
├── orchestration/                    # Sistema de agentes
└── reference/                        # Referencias (Odoo, Gamilit)
```

### Plan de Migración

#### Opción 1: Migración Completa (Recomendada)

**Paso 1:** Crear estructura nueva
```bash
# Renombrar workspace
mv workspace-erp-inmobiliaria workspace-erp-multi

cd workspace-erp-multi

# Crear carpetas compartidas
mkdir -p shared/{reference,orchestration,analysis,bugs,components,docs}
mkdir -p projects/{erp-generic,erp-construccion,erp-vidrio-templado,erp-mecanicas-diesel}
mkdir -p tools/{scaffolding,migration,validation}
```

**Paso 2:** Mover contenido existente
```bash
# Mover reference y orchestration a shared/
mv reference/ shared/
mv orchestration/ shared/

# Crear proyecto erp-construccion con contenido actual
mv docs/ projects/erp-construccion/
mv apps/ projects/erp-construccion/
```

**Paso 3:** Crear estructura de análisis compartido
```bash
mkdir -p shared/analysis/{domain-models/{common,financial,inventory,purchasing,production,crm},odoo-comparison,architecture}
```

**Paso 4:** Crear proyectos vacíos
```bash
# Para cada nuevo proyecto
for project in erp-generic erp-vidrio-templado erp-mecanicas-diesel; do
  mkdir -p projects/$project/{docs/{00-overview,01-analysis,02-modules,03-architecture,04-development},apps,orchestration/{trazas,inventarios,estados,reportes},bugs}

  # Crear README
  touch projects/$project/README.md
  touch projects/$project/PROJECT-STATUS.md
done
```

#### Opción 2: Migración Gradual

Mantener workspace actual y crear nuevos proyectos de forma incremental.

---

## 🎯 ROADMAP DE IMPLEMENTACIÓN

### Sprint 1: Reestructuración (1 semana)

**Objetivos:**
- ✅ Crear nueva estructura de carpetas
- ✅ Migrar contenido existente
- ✅ Actualizar documentación
- ✅ Validar estructura

**Tareas:**
1. Ejecutar migración
2. Crear README.md de cada nivel
3. Actualizar orchestration para multi-proyecto
4. Crear templates de proyecto
5. Validar que todo funciona

### Sprint 2: Fase de Análisis - ERP Genérico (2 semanas)

**Objetivos:**
- ✅ Análisis de requerimientos
- ✅ Modelado de dominio
- ✅ Comparación con Odoo
- ✅ Diseño de base de datos

**Tareas:**
1. Analizar módulos de Odoo relevantes
2. Documentar modelos de dominio comunes
3. Diseñar schema base de datos
4. Crear plan de desarrollo MVP

### Sprint 3-10: Desarrollo ERP Genérico (8 semanas)

Desarrollo iterativo de módulos base.

### Sprint 11-12: Fase de Análisis - ERP Construcción (2 semanas)

Análisis específico de construcción, reutilizando base genérica.

### Sprint 13+: Desarrollo paralelo

- ERP Construcción (desarrollo continuo)
- ERP Vidrio (inicio análisis)
- ERP Mecánicas (planificación)

---

## ✅ VENTAJAS DE ESTA ESTRUCTURA

### Ventajas Técnicas

1. ✅ **Reutilización de código**: Componentes compartidos reducen duplicación 60-70%
2. ✅ **Desarrollo paralelo**: Equipos pueden trabajar en proyectos diferentes sin conflictos
3. ✅ **Bugs compartidos**: Un bug corregido beneficia a todos los proyectos
4. ✅ **Agentes centralizados**: Mismas políticas y estándares para todos
5. ✅ **Referencias centralizadas**: Odoo y Gamilit accesibles desde todos los proyectos
6. ✅ **Fase de análisis**: Validación con Odoo antes de desarrollo reduce errores

### Ventajas de Gestión

1. ✅ **Orden de desarrollo claro**: Genérico → Específicos
2. ✅ **Trazabilidad**: Historial completo de decisiones y desarrollo
3. ✅ **Escalabilidad**: Fácil agregar nuevos ERPs
4. ✅ **Mantenimiento**: Componentes compartidos tienen un solo punto de actualización
5. ✅ **Documentación centralizada**: Estándares y guías en un solo lugar

---

## 📋 CHECKLIST DE VALIDACIÓN

### Estructura de Carpetas

- [ ] `shared/reference/` contiene proyectos de referencia
- [ ] `shared/orchestration/` contiene agentes y directivas
- [ ] `shared/analysis/` contiene modelos de dominio y comparaciones Odoo
- [ ] `shared/bugs/global/` existe para bugs compartidos
- [ ] `shared/components/` existe para código reutilizable
- [ ] `projects/erp-generic/` tiene estructura completa
- [ ] `projects/erp-construccion/` tiene contenido migrado
- [ ] `projects/erp-vidrio-templado/` tiene estructura base
- [ ] `projects/erp-mecanicas-diesel/` tiene estructura base
- [ ] `tools/scaffolding/` tiene scripts de creación de proyectos

### Documentación

- [ ] `WORKSPACE-OVERVIEW.md` existe en raíz
- [ ] Cada proyecto tiene `README.md` y `PROJECT-STATUS.md`
- [ ] `shared/analysis/README.md` explica proceso de análisis
- [ ] `shared/bugs/README.md` explica gestión de bugs
- [ ] `shared/components/README.md` explica uso de componentes

### Orchestration

- [ ] Agentes en `shared/orchestration/agentes/` funcionan para todos los proyectos
- [ ] Directivas actualizadas para multi-proyecto
- [ ] Templates actualizados para multi-proyecto
- [ ] Trazas locales por proyecto funcionan correctamente

---

## 🚀 PRÓXIMOS PASOS

### Acción Inmediata (HOY)

1. ✅ Revisar y aprobar esta propuesta
2. ✅ Decidir estrategia de migración (completa vs gradual)
3. ✅ Ejecutar migración
4. ✅ Validar estructura

### Corto Plazo (ESTA SEMANA)

1. ✅ Iniciar Fase de Análisis para ERP Genérico
2. ✅ Documentar comparación con Odoo
3. ✅ Crear modelos de dominio base
4. ✅ Diseñar schema de base de datos

### Mediano Plazo (PRÓXIMAS 2 SEMANAS)

1. ✅ Completar análisis de ERP Genérico
2. ✅ Iniciar desarrollo de módulos base
3. ✅ Crear componentes compartidos iniciales

---

## ❓ PREGUNTAS FRECUENTES

### ¿Por qué desarrollar primero el ERP Genérico?

**Respuesta:** Para crear componentes base reutilizables que aceleren el desarrollo de los ERPs específicos. Reduce tiempo de desarrollo total en 40-50%.

### ¿Cómo se manejan las diferencias entre proyectos?

**Respuesta:** Cada proyecto tiene su carpeta `apps/` y `docs/` independiente. Los componentes compartidos están en `shared/components/` y se importan según necesidad.

### ¿Qué pasa si un componente compartido cambia?

**Respuesta:** Se valida el impacto en todos los proyectos que lo usan, se actualizan, y se ejecutan tests de regresión.

### ¿Cómo saben los agentes en qué proyecto trabajar?

**Respuesta:** Se les proporciona contexto explícito: `Proyecto activo: erp-construccion`. Usan inventarios y trazas del proyecto específico.

### ¿Es necesaria la fase de análisis con Odoo?

**Respuesta:** SÍ. Odoo es el ERP open source más maduro. Revisar su implementación antes de desarrollar evita errores conocidos y acelera diseño.

---

## 📖 REFERENCIAS

### Documentos Relacionados

- [Sistema de Orchestration](shared/orchestration/README.md)
- [Guía de Componentes Compartidos](shared/components/README.md)
- [Gestión de Bugs](shared/bugs/README.md)
- [Proceso de Análisis](shared/analysis/README.md)

### Proyectos de Referencia

- Odoo: `shared/reference/odoo/`
- Gamilit: `shared/reference/gamilit/`

---

**Versión:** 1.0.0
**Fecha:** 2025-11-23
**Autor:** Claude (basado en requerimientos del usuario)
**Estado:** 📋 Propuesta - Pendiente de aprobación
