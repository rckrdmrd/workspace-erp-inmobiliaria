# INSTRUCCIONES PARA AGENTE DE ARQUITECTURA - ERP GENÉRICO

**Proyecto:** ERP Genérico
**Versión:** 1.0.0
**Fecha:** 2025-11-24

---

## 🎯 CONTEXTO

Este documento contiene las instrucciones específicas para lanzar el agente de arquitectura que ejecutará las 3 etapas del plan de documentación del ERP Genérico.

**Plan completo:** Ver `PLAN-DOCUMENTACION-ERP-GENERICO.md`

---

## 📋 ETAPA 1: ANÁLISIS Y RETROALIMENTACIÓN

### Objetivo
Analizar módulos core de Odoo, identificar patrones arquitectónicos, y crear documentación de análisis.

### Comando para lanzar el agente

```
Task tool con los siguientes parámetros:

subagent_type: "general-purpose"

prompt:
"Eres el Architecture-Analyst trabajando en el ERP Genérico.

CONTEXTO:
- Proyecto: projects/erp-generic/
- Plan: projects/erp-generic/docs/PLAN-DOCUMENTACION-ERP-GENERICO.md
- Referencias Odoo: shared/reference/ODOO-MODULES-ANALYSIS.md
- Referencia estructura: projects/erp-construccion/docs/

TAREA: Ejecutar ETAPA 1 del plan (Análisis y Retroalimentación)

MÓDULOS ODOO A ANALIZAR (por prioridad):
1. base - Sistema base, modelos fundamentales
2. auth_signup - Autenticación y registro
3. account - Módulo financiero
4. stock - Inventario
5. purchase - Compras
6. sale - Ventas
7. analytic - Contabilidad analítica
8. mail - Mensajería y notificaciones
9. crm - CRM básico
10. hr - Recursos humanos
11. project - Proyectos genéricos
12. portal - Portal de usuarios

PARA CADA MÓDULO CREAR:
1. Documento de análisis en: projects/erp-generic/docs/01-analysis/odoo-analysis/odoo-{modulo}-analysis.md

Estructura del análisis:
- Descripción del módulo
- Modelos de datos principales (tablas, campos, relaciones)
- Patrones arquitectónicos observados
- APIs y endpoints relevantes
- Reglas de negocio identificadas
- Aplicabilidad al ERP Genérico
- Recomendaciones

2. Para análisis en Odoo usar:
- shared/reference/ODOO-MODULES-ANALYSIS.md (ya existe)
- Si es necesario, buscar más info en shared/reference/ sobre Odoo

3. Crear ADRs (Architecture Decision Records) en: projects/erp-generic/docs/01-analysis/adr/

ADRs sugeridos:
- ADR-001-stack-tecnologico.md
- ADR-002-arquitectura-modular.md
- ADR-003-multi-tenancy.md
- ADR-004-seguridad-rbac.md
- ADR-005-base-de-datos.md

4. Crear mapa de componentes compartidos en: projects/erp-generic/docs/01-analysis/component-mapping/shared-components-map.md

Incluir:
- Lista de componentes que irán en shared/components/
- Componentes de base de datos comunes
- Módulos backend comunes
- Componentes frontend comunes
- Dependencias entre componentes

5. Retroalimentación a ERP Construcción:
- Comparar módulos del ERP Construcción con análisis de Odoo
- Identificar mejoras arquitectónicas
- Documentar en: projects/erp-generic/docs/01-analysis/feedback-construccion.md

ENTREGABLES ESPERADOS:
- 12 documentos de análisis de Odoo
- 5 ADRs
- 1 mapa de componentes compartidos
- 1 documento de retroalimentación

CRITERIOS DE COMPLETITUD:
- Todos los módulos listados están analizados
- ADRs cubren decisiones arquitectónicas clave
- Mapa de componentes es completo y detallado
- Retroalimentación a construcción es específica y accionable

FORMATO: Usar markdown, seguir convenciones del workspace.

NOTA: NO implementar código, solo crear documentación de análisis."

model: "sonnet" (usar Sonnet para análisis complejo)
```

### Verificación post-ejecución

Después de que el agente termine, verificar:

```bash
# Verificar documentos de análisis
ls projects/erp-generic/docs/01-analysis/odoo-analysis/
# Debe haber 12 archivos

# Verificar ADRs
ls projects/erp-generic/docs/01-analysis/adr/
# Debe haber al menos 5 archivos

# Verificar mapa de componentes
cat projects/erp-generic/docs/01-analysis/component-mapping/shared-components-map.md

# Verificar retroalimentación
cat projects/erp-generic/docs/01-analysis/feedback-construccion.md
```

---

## 📋 ETAPA 2: MODELADO DE REQUERIMIENTOS Y BASE DE DATOS

### Objetivo
Crear modelos de dominio, requerimientos funcionales, especificaciones técnicas, y diseño de base de datos.

### Comando para lanzar el agente

```
Task tool con los siguientes parámetros:

subagent_type: "general-purpose"

prompt:
"Eres el Architecture-Analyst trabajando en el ERP Genérico.

CONTEXTO:
- Proyecto: projects/erp-generic/
- Plan: projects/erp-generic/docs/PLAN-DOCUMENTACION-ERP-GENERICO.md
- Análisis completado: projects/erp-generic/docs/01-analysis/
- Referencia: projects/erp-construccion/docs/01-fase-alcance-inicial/

TAREA: Ejecutar ETAPA 2 del plan (Modelado de Requerimientos y BD)

MÓDULOS DEL ERP GENÉRICO (según plan):

FASE 1 - CORE (P0):
- MGN-001: Fundamentos (Auth, usuarios, roles, multi-tenancy)
- MGN-002: Empresas y Organizaciones
- MGN-003: Catálogos Maestros
- MGN-004: Financiero Básico
- MGN-005: Inventario Básico
- MGN-006: Compras Básico
- MGN-007: Ventas Básico
- MGN-008: Contabilidad Analítica

FASE 2 - COMPLEMENTARIA (P1):
- MGN-009: CRM Básico
- MGN-010: RRHH Básico
- MGN-011: Proyectos Genéricos
- MGN-012: Reportes y Analytics
- MGN-013: Portal de Usuarios
- MGN-014: Mensajería y Notificaciones

PARA CADA MÓDULO CREAR:

1. MODELOS DE DOMINIO en: projects/erp-generic/docs/02-requirements/domain-models/

Ejemplo para MGN-001:
- {modulo}-domain.md (ej: auth-domain.md)
- Incluir: Entidades, atributos, relaciones, diagramas
- Formato: Similar a análisis de Odoo pero específico para nuestro ERP

2. REQUERIMIENTOS FUNCIONALES en: projects/erp-generic/docs/01-fase-core/MGN-XXX-{nombre}/requerimientos/

Formato: RF-{SIGLA}-{NNN}-titulo.md
Ejemplo: RF-AUTH-001-autenticacion-jwt.md

Estructura de cada RF (usar como plantilla los RF de erp-construccion):
- ID y título
- Descripción
- Justificación
- Actores involucrados
- Flujo principal
- Flujos alternativos
- Reglas de negocio
- Criterios de aceptación

Estimación: ~5 RF por módulo = 70 RF totales

3. ESPECIFICACIONES TÉCNICAS en: projects/erp-generic/docs/01-fase-core/MGN-XXX-{nombre}/especificaciones/

Formato: ET-{SIGLA}-{NNN}-titulo.md
Ejemplo: ET-AUTH-001-jwt-implementation.md

Estructura de cada ET (usar como plantilla los ET de erp-construccion):
- ID y título
- Requerimiento relacionado (RF-XXX-NNN)
- Stack tecnológico
- Diseño de API (endpoints, request/response)
- Diseño de BD (tablas, campos)
- Diseño de UI (wireframes, componentes)
- Validaciones
- Manejo de errores
- Testing

Estimación: ~5 ET por módulo = 70 ET totales

4. DISEÑO DE BASE DE DATOS en: projects/erp-generic/docs/02-requirements/database-design/schemas/

Crear DDL completos:
- {modulo}-schema.sql (ej: auth-schema.sql)
- Incluir: CREATE SCHEMA, CREATE TABLE, CREATE TYPE (enums), CREATE INDEX
- Implementar RLS (Row Level Security) desde diseño
- Documentar relaciones (FK)
- Comentarios en código SQL

Schemas esperados:
- auth.sql
- core.sql (empresas, catálogos)
- financial.sql
- inventory.sql
- purchase.sql
- sales.sql
- analytics.sql
- crm.sql
- hr.sql
- projects.sql
- reporting.sql
- notifications.sql

5. MATRIZ DE TRAZABILIDAD en cada módulo: projects/erp-generic/docs/01-fase-core/MGN-XXX-{nombre}/implementacion/TRACEABILITY.yml

ENTREGABLES ESPERADOS:
- 10-14 modelos de dominio
- 70 requerimientos funcionales
- 70 especificaciones técnicas
- 12 esquemas de base de datos (DDL)
- 14 matrices de trazabilidad

CRITERIOS DE COMPLETITUD:
- Todos los módulos tienen modelos de dominio
- Cada módulo tiene al menos 5 RF y 5 ET
- Diseño de BD está completo y coherente
- Matrices de trazabilidad vinculan RF ↔ ET ↔ BD

FORMATO: Seguir exactamente formato de erp-construccion

NOTA: NO implementar código, solo crear documentación."

model: "sonnet"
```

### Verificación post-ejecución

```bash
# Verificar modelos de dominio
ls projects/erp-generic/docs/02-requirements/domain-models/
# Debe haber ~10-14 archivos

# Verificar RF de un módulo ejemplo
ls projects/erp-generic/docs/01-fase-core/MGN-001-fundamentos/requerimientos/
# Debe haber ~5 archivos RF-XXX-NNN.md

# Verificar ET
ls projects/erp-generic/docs/01-fase-core/MGN-001-fundamentos/especificaciones/
# Debe haber ~5 archivos ET-XXX-NNN.md

# Verificar schemas de BD
ls projects/erp-generic/docs/02-requirements/database-design/schemas/
# Debe haber ~12 archivos .sql

# Verificar trazabilidad
cat projects/erp-generic/docs/01-fase-core/MGN-001-fundamentos/implementacion/TRACEABILITY.yml
```

---

## 📋 ETAPA 3: DOCUMENTACIÓN DETALLADA Y PREPARACIÓN

### Objetivo
Completar la estructura de documentación con historias de usuario, planes de pruebas, y documentación transversal.

### Comando para lanzar el agente

```
Task tool con los siguientes parámetros:

subagent_type: "general-purpose"

prompt:
"Eres el Architecture-Analyst trabajando en el ERP Genérico.

CONTEXTO:
- Proyecto: projects/erp-generic/
- Plan: projects/erp-generic/docs/PLAN-DOCUMENTACION-ERP-GENERICO.md
- Etapa 1 y 2 completadas
- Referencia: projects/erp-construccion/docs/

TAREA: Ejecutar ETAPA 3 del plan (Documentación Detallada)

ACTIVIDADES:

1. CREAR HISTORIAS DE USUARIO para cada módulo en: projects/erp-generic/docs/01-fase-core/MGN-XXX-{nombre}/historias-usuario/

Formato: US-{SIGLA}-{NNN}-titulo.md
Ejemplo: US-FUND-001-login-usuario.md

Estructura (usar como plantilla US de erp-construccion):
- ID y título
- Como [rol] quiero [funcionalidad] para [beneficio]
- Criterios de aceptación (Given/When/Then)
- Requerimientos relacionados
- Story Points
- Prioridad

Estimación: ~10 US por módulo = 140 US totales

2. CREAR DOCUMENTACIÓN DE MÓDULOS:

Para cada módulo crear:
- README.md en: projects/erp-generic/docs/01-fase-core/MGN-XXX-{nombre}/README.md
  (Descripción completa del módulo, objetivos, alcance)

- _MAP.md en: projects/erp-generic/docs/01-fase-core/MGN-XXX-{nombre}/_MAP.md
  (Índice maestro con links a todos los documentos del módulo)

- Inventarios en: projects/erp-generic/docs/01-fase-core/MGN-XXX-{nombre}/implementacion/
  * DATABASE.yml - Lista de objetos de BD
  * BACKEND.yml - Lista de módulos/servicios backend
  * FRONTEND.yml - Lista de componentes frontend

3. CREAR PLANES DE PRUEBAS para cada módulo en: projects/erp-generic/docs/01-fase-core/MGN-XXX-{nombre}/pruebas/

- TEST-PLAN.md (estrategia de testing, alcance, criterios)
- TEST-CASES.md (casos de prueba específicos)

4. CREAR DOCUMENTACIÓN TRANSVERSAL:

- projects/erp-generic/docs/ESTRUCTURA-COMPLETA.md
  Similar a: projects/erp-construccion/docs/ESTRUCTURA-COMPLETA.md
  Incluir: Resumen ejecutivo, distribución por fase, estructura de directorios, métricas

- projects/erp-generic/docs/ROADMAP-DETALLADO.md
  Roadmap de desarrollo del ERP Genérico (sprints, hitos, dependencias)

- projects/erp-generic/docs/GUIA-USO-REFERENCIAS-ODOO.md
  Guía de cómo usar los análisis de Odoo durante el desarrollo

- projects/erp-generic/docs/01-fase-core/README.md
  Descripción de la Fase 1 (Core)

- projects/erp-generic/docs/01-fase-core/_MAP.md
  Índice maestro de todos los módulos de Fase 1

- projects/erp-generic/docs/02-fase-complementaria/README.md
  Descripción de la Fase 2 (Complementaria)

- projects/erp-generic/docs/02-fase-complementaria/_MAP.md
  Índice maestro de todos los módulos de Fase 2

ENTREGABLES ESPERADOS:
- 140 historias de usuario
- 28 archivos README.md y _MAP.md (2 por módulo)
- 42 inventarios YAML (3 por módulo)
- 28 planes de pruebas (2 por módulo)
- 7 documentos transversales

CRITERIOS DE COMPLETITUD:
- Todos los módulos tienen US completas
- Todos los módulos tienen README.md y _MAP.md
- Inventarios están estructurados y completos
- Planes de pruebas cubren funcionalidad crítica
- Documentación transversal es exhaustiva

FORMATO: Seguir exactamente formato de erp-construccion.

NOTA: Esta es la etapa final de documentación antes del desarrollo."

model: "sonnet"
```

### Verificación post-ejecución

```bash
# Verificar historias de usuario
ls projects/erp-generic/docs/01-fase-core/MGN-001-fundamentos/historias-usuario/
# Debe haber ~10 archivos US-XXX-NNN.md

# Verificar documentación de módulo
cat projects/erp-generic/docs/01-fase-core/MGN-001-fundamentos/README.md
cat projects/erp-generic/docs/01-fase-core/MGN-001-fundamentos/_MAP.md

# Verificar inventarios
ls projects/erp-generic/docs/01-fase-core/MGN-001-fundamentos/implementacion/
# Debe haber: DATABASE.yml, BACKEND.yml, FRONTEND.yml

# Verificar planes de pruebas
ls projects/erp-generic/docs/01-fase-core/MGN-001-fundamentos/pruebas/
# Debe haber: TEST-PLAN.md, TEST-CASES.md

# Verificar documentación transversal
cat projects/erp-generic/docs/ESTRUCTURA-COMPLETA.md
cat projects/erp-generic/docs/ROADMAP-DETALLADO.md
cat projects/erp-generic/docs/GUIA-USO-REFERENCIAS-ODOO.md
```

---

## ✅ CHECKLIST GENERAL

### Antes de iniciar cada etapa:
- [ ] Revisar el plan completo
- [ ] Verificar que referencias están disponibles
- [ ] Confirmar estructura de carpetas base existe

### Durante la ejecución:
- [ ] Monitorear progreso del agente
- [ ] Revisar calidad de documentos generados
- [ ] Validar que sigue formato de referencia

### Al completar cada etapa:
- [ ] Ejecutar verificación post-ejecución
- [ ] Revisar y validar entregables
- [ ] Aprobar antes de pasar a siguiente etapa

### Al completar todas las etapas:
- [ ] Documentación completa y coherente
- [ ] Estructura sigue formato de erp-construccion
- [ ] Referencias a Odoo están integradas
- [ ] Listo para iniciar desarrollo

---

## 🎯 RESULTADO ESPERADO FINAL

Al completar las 3 etapas, el proyecto `erp-generic` debe tener:

```
projects/erp-generic/docs/
├── 01-analysis/                    # Análisis de Odoo, ADRs, componentes
├── 02-requirements/                # Modelos de dominio, diseño de BD
├── 03-architecture/                # Arquitectura del sistema
├── 01-fase-core/                   # 8 módulos core completamente documentados
├── 02-fase-complementaria/         # 6 módulos complementarios documentados
├── ESTRUCTURA-COMPLETA.md          # Documentación transversal
├── ROADMAP-DETALLADO.md
└── GUIA-USO-REFERENCIAS-ODOO.md

Total estimado: ~370 archivos de documentación
```

Con esta documentación completa, se podrá:
1. Iniciar desarrollo del ERP Genérico
2. Reutilizar componentes en los 3 ERPs especializados
3. Mantener coherencia arquitectónica
4. Facilitar onboarding de nuevos desarrolladores

---

**Creado:** 2025-11-24
**Versión:** 1.0.0
**Autor:** Claude Code
**Estado:** ✅ Listo para usar
