# POLÍTICAS DE USO DE AGENTES Y SUBAGENTES

**Proyecto:** MVP Sistema Administración de Obra e INFONAVIT
**Versión:** 1.0.0
**Fecha:** 2025-11-17
**Estado:** OBLIGATORIO

---

## 🎯 OBJETIVO

Definir cuándo y cómo usar agentes y subagentes para maximizar eficiencia, calidad y trazabilidad del desarrollo.

---

## 📋 TIPOS DE AGENTES

### Agentes Principales (Por Stack Tecnológico)

#### 1. Database-Agent
**Responsabilidad:**
- Crear/modificar schemas, tablas, funciones, triggers
- Generar seeds (dev/prod)
- Validar DDL y ejecución de scripts
- Mantener inventario de objetos DB

**Cuándo usar:**
- Crear nuevo schema completo
- Modificar estructura de tablas existentes
- Crear funciones/triggers complejos
- Generar migrations

**Subagentes disponibles:**
- Schema-Creator
- Table-Creator
- Function-Creator
- Migration-Generator
- Seed-Generator

#### 2. Backend-Agent
**Responsabilidad:**
- Crear/modificar módulos NestJS
- Implementar entities, services, controllers, DTOs
- Configurar TypeORM, validaciones, guards
- Mantener inventario backend

**Cuándo usar:**
- Crear módulo completo
- Implementar CRUDs complejos
- Configurar autenticación/autorización
- Implementar lógica de negocio compleja

**Subagentes disponibles:**
- Entity-Creator
- Service-Creator
- Controller-Creator
- DTO-Creator
- CRUD-Generator

#### 3. Frontend-Agent
**Responsabilidad:**
- Crear/modificar páginas y componentes React
- Implementar stores Zustand
- Configurar servicios API
- Mantener inventario frontend

**Cuándo usar:**
- Crear página completa con múltiples componentes
- Implementar feature UI complejo
- Crear dashboards
- Configurar routing

**Subagentes disponibles:**
- Page-Creator
- Component-Creator
- Store-Creator
- Form-Generator
- Dashboard-Creator

---

### Agentes Especializados (Por Actividad)

#### 4. Requirements-Analyst
**Responsabilidad:**
- Analizar requerimientos del plan MVP
- Desglosar features en tareas ejecutables
- Mapear dependencias entre módulos
- Generar historias de usuario

**Cuándo usar:**
- Inicio de nuevo módulo/feature
- Análisis de viabilidad técnica
- Planificación de sprints
- Identificación de dependencias

**Genera:**
- TRAZA-REQUERIMIENTOS.md
- Planes de implementación desglosados
- Dependency graphs
- Estimaciones de esfuerzo

#### 5. Code-Reviewer
**Responsabilidad:**
- Revisar código según estándares
- Detectar code smells, anti-patterns
- Validar cumplimiento de directivas
- Sugerir refactorizaciones

**Cuándo usar:**
- Antes de merge a main
- Después de implementación de feature grande
- Revisión periódica semanal
- Pre-despliegue a producción

**Subagentes disponibles:**
- Security-Auditor
- Performance-Auditor
- Standards-Validator
- Documentation-Checker

**Genera:**
- TRAZA-VALIDACIONES.md
- Reportes de calidad
- Lista de issues encontrados
- Recomendaciones de mejora

#### 6. Bug-Fixer
**Responsabilidad:**
- Diagnosticar bugs reportados
- Implementar correcciones
- Crear tests para prevenir regresiones
- Validar fix end-to-end

**Cuándo usar:**
- Bug crítico (P0/P1)
- Bug que afecta múltiples módulos
- Bug complejo que requiere debugging profundo

**Subagentes disponibles:**
- Bug-Analyzer
- Test-Creator
- Fix-Validator

**Genera:**
- TRAZA-BUGS.md
- TRAZA-CORRECCIONES.md
- Tests de regresión
- Post-mortem (si bug crítico)

#### 7. Feature-Developer
**Responsabilidad:**
- Desarrollar features completos (DB + Backend + Frontend)
- Coordinar entre capas
- Validar integración end-to-end
- Documentar feature completo

**Cuándo usar:**
- Feature completo nuevo (ejemplo: módulo de estimaciones)
- Requiere cambios en las 3 capas
- Alta complejidad de integración

**Subagentes disponibles:**
- Database-Agent
- Backend-Agent
- Frontend-Agent
- Integration-Tester

**Genera:**
- TRAZA-FEATURES.md
- Documentación de feature
- Tests E2E
- Guía de uso

#### 8. Policy-Auditor
**Responsabilidad:**
- Auditar cumplimiento de políticas
- Validar inventarios vs realidad
- Detectar duplicaciones
- Verificar documentación obligatoria

**Cuándo usar:**
- Semanalmente (auditoría de rutina)
- Antes de release
- Cuando se detectan inconsistencias
- Post-implementación de feature grande

**Subagentes disponibles:**
- Documentation-Auditor
- Inventory-Auditor
- Standards-Auditor
- Anti-Duplication-Checker

**Genera:**
- TRAZA-VALIDACIONES.md
- Reportes de cumplimiento
- Lista de discrepancias
- Plan de corrección

---

## 🔄 DECISIÓN: ¿Agente o Subagente?

### Usar Agente Principal

**Características de la tarea:**
- ✅ Complejidad: Alta (>5 pasos)
- ✅ Alcance: Múltiples módulos (>2)
- ✅ Archivos: Muchos (>10)
- ✅ Requiere análisis previo
- ✅ Coordinación entre capas (DB-Backend-Frontend)
- ✅ Genera documentación extensa

**Ejemplos:**
- Crear módulo completo de Proyectos y Obras
- Implementar sistema de autenticación
- Migrar base de datos de versión antigua
- Implementar reportes ejecutivos complejos

**Proceso:**
```
1. Análisis (01-ANALISIS.md)
2. Plan (02-PLAN.md)
3. Ejecución por ciclos (03-EJECUCION.md)
4. Validación (04-VALIDACION.md)
5. Documentación (05-DOCUMENTACION.md)
6. Actualizar inventarios y trazas
```

---

### Usar Subagente

**Características de la tarea:**
- ✅ Complejidad: Baja-Media (1-3 pasos)
- ✅ Alcance: Un módulo (1 archivo o grupo pequeño)
- ✅ Archivos: Pocos (1-3)
- ✅ Patrón repetitivo (CRUD, formularios)
- ✅ Sin dependencias complejas
- ✅ Bien especificado por agente principal

**Ejemplos:**
- Crear una tabla simple
- Crear entity + DTO básico
- Crear formulario estándar
- Agregar endpoint CRUD simple

**Proceso:**
```
1. Recibir contexto del agente principal
2. Validar anti-duplicación
3. Ejecutar tarea
4. Validar localmente
5. Actualizar inventario
6. Reportar al agente principal
```

---

## ⚙️ LÍMITES Y CONCURRENCIA

### Límites de Agentes Simultáneos

```yaml
concurrencia:
  agentes_principales_max: 3
    # Razón: Evitar conflictos, mantener contexto claro

  subagentes_por_agente_max: 5
    # Razón: Un agente puede coordinar hasta 5 subagentes

  subagentes_totales_max: 15
    # Razón: Límite de Claude Code

  agentes_especializados_max: 2
    # Razón: Requirements-Analyst y Code-Reviewer pueden correr juntos
```

### Reglas de Concurrencia

**✅ Permitido:**
- Database-Agent + Backend-Agent en paralelo (si no hay dependencias)
- Requirements-Analyst + Code-Reviewer en paralelo
- Múltiples subagentes del mismo agente en paralelo

**❌ No Permitido:**
- Database-Agent y Backend-Agent trabajando en mismo módulo
- Dos agentes modificando el mismo archivo
- Feature-Developer + Database-Agent en mismo schema

---

## 🚨 GESTIÓN DE ERRORES

### Error en Subagente

**Procedimiento:**
1. Subagente intenta autocorrección (máx 2 intentos)
2. Si persiste:
   - Marca tarea como fallida
   - Reporta error al agente principal
   - Agente principal decide: reintentar, escalar o cambiar approach
3. Documentar en TRAZA-BUGS.md si es bug del sistema

**Ejemplo:**
```markdown
## [BUG-001] Subagente Table-Creator falla al crear índice

**Agente:** Database-Agent
**Subagente:** Table-Creator (DB-005-SUB-002)
**Error:** Sintaxis SQL incorrecta en CREATE INDEX
**Intentos:** 2/2
**Acción tomada:** Agente principal corrigió manualmente
**Lección:** Validar sintaxis de índices parciales con WHERE
**Estado:** ✅ Resuelto
```

---

### Error en Agente Principal

**Procedimiento:**
1. Agente marca tarea como bloqueada (❌)
2. Crea entrada en TRAZA-BUGS.md
3. Notifica a supervisor (usuario)
4. Supervisor decide:
   - Proporcionar más contexto
   - Dividir tarea en subtareas más pequeñas
   - Asignar a agente especializado (Bug-Fixer)

**Ejemplo:**
```markdown
## [DB-042] Error al crear schema complex_reporting

**Estado:** ❌ Bloqueado
**Agente:** Database-Agent
**Error:** Dependencias circulares entre funciones
**Bloqueador:** Requiere reestructuración de dependencies
**Documentado en:** orchestration/agentes/database/DB-042/
**Notificado:** 2025-11-17 10:30
**Esperando:** Decisión de arquitectura
```

---

### Rollback

**Cuándo hacer rollback:**
- Error crítico que rompe compilación/ejecución
- Datos corruptos en base de datos
- Múltiples tests fallando después de cambio
- Vulnerabilidad de seguridad introducida

**Procedimiento:**
1. Identificar punto de rollback (último commit estable)
2. Guardar snapshot del estado actual (para análisis)
3. Ejecutar rollback:
   ```bash
   # Database
   psql $DATABASE_URL < backups/pre-{TAREA-ID}.sql

   # Backend/Frontend
   git revert {commit-hash}
   ```
4. Documentar rollback en TRAZA-CORRECCIONES.md
5. Analizar causa raíz
6. Replantear approach

**Ejemplo:**
```markdown
## [ROLLBACK-001] Revertir cambios de DB-045

**Fecha:** 2025-11-17 11:00
**Tarea original:** DB-045 - Agregar columnas a projects
**Razón:** Migration rompió foreign keys en developments
**Afectados:**
  - apps/database/ddl/schemas/project_management/tables/01-projects.sql
  - apps/database/migrations/20251117-add-columns-projects.sql
**Rollback a:** Commit abc123def (pre DB-045)
**Plan de corrección:**
  1. Revisar dependencies
  2. Crear migration más segura con IF EXISTS
  3. Validar en ambiente dev antes de aplicar
**Estado:** ✅ Rollback exitoso, corrección planificada
```

---

## 📊 MÉTRICAS DE USO DE AGENTES

### KPIs a Monitorear

```yaml
metricas:
  agentes:
    tareas_completadas: 0
    tareas_en_progreso: 0
    tareas_bloqueadas: 0
    tasa_exito: 0%
    tiempo_promedio_tarea: "0h"

  subagentes:
    lanzados_total: 0
    exitosos: 0
    fallidos: 0
    tasa_exito: 0%

  errores:
    errores_autocorregidos: 0
    errores_escalados: 0
    rollbacks_realizados: 0

  eficiencia:
    velocity: 0.0  # tareas/día
    bloqueadores_promedio: 0
    tiempo_analisis_promedio: "0h"
    tiempo_ejecucion_promedio: "0h"
```

### Reportes Automáticos

**Diario:**
- Tareas completadas hoy
- Agentes activos
- Bloqueadores identificados

**Semanal:**
- Velocity de desarrollo
- Tasa de éxito de agentes/subagentes
- Calidad de código (Code-Reviewer)
- Cumplimiento de políticas (Policy-Auditor)

**Por Sprint:**
- Completitud de requerimientos
- Deuda técnica acumulada
- Cobertura de tests
- Documentación

---

## ✅ CHECKLIST DE USO DE AGENTES

### Antes de Lanzar Agente

- [ ] Verificar que no hay agente trabajando en mismo módulo
- [ ] Consultar límites de concurrencia
- [ ] Verificar que tarea requiere agente (no es muy simple)
- [ ] Preparar contexto completo para el agente
- [ ] Validar que inventarios están actualizados

### Durante Ejecución

- [ ] Monitorear progreso del agente
- [ ] Validar que sigue directivas
- [ ] Revisar documentación generada
- [ ] Validar que actualiza inventarios

### Después de Completar

- [ ] Revisar calidad del resultado
- [ ] Validar que inventarios están actualizados
- [ ] Verificar que trazas están completas
- [ ] Ejecutar validaciones (compilación, tests)
- [ ] Marcar tarea como completada

---

## 🎯 MEJORES PRÁCTICAS

### DO ✅

1. **Siempre consultar inventarios antes de crear**
   - Evita duplicaciones
   - Mantiene coherencia

2. **Usar agente correcto para la tarea**
   - Requirements-Analyst para planificación
   - Code-Reviewer antes de merge
   - Feature-Developer para features completos

3. **Documentar en traza correspondiente**
   - Requerimiento → TRAZA-REQUERIMIENTOS.md
   - Bug → TRAZA-BUGS.md
   - Feature → TRAZA-FEATURES.md

4. **Validar antes de marcar completo**
   - Compilación exitosa
   - Tests pasan
   - Documentación completa

5. **Actualizar métricas periódicamente**
   - Dashboard de estado
   - Velocity de desarrollo
   - Calidad de código

### DON'T ❌

1. **NO lanzar agente sin contexto completo**
   - Genera errores
   - Aumenta re-trabajo

2. **NO exceder límites de concurrencia**
   - Causa conflictos
   - Dificulta trazabilidad

3. **NO omitir validación de resultados**
   - Puede introducir bugs
   - Rompe integración

4. **NO olvidar actualizar inventarios**
   - Pierde trazabilidad
   - Causa duplicaciones

5. **NO trabajar sin backup**
   - Siempre tener punto de rollback
   - Especialmente en cambios DB

---

## 📚 REFERENCIAS

- [PROMPT-AGENTES-PRINCIPALES.md](../prompts/PROMPT-AGENTES-PRINCIPALES.md)
- [PROMPT-SUBAGENTES.md](../prompts/PROMPT-SUBAGENTES.md)
- [DIRECTIVA-DOCUMENTACION-OBLIGATORIA.md](./DIRECTIVA-DOCUMENTACION-OBLIGATORIA.md)

---

**Versión:** 1.0.0
**Revisión:** Mensual
**Próxima revisión:** 2025-12-17
