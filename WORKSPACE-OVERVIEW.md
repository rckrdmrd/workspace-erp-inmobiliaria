# WORKSPACE MULTI-PROYECTO ERP - MAPA DE NAVEGACIÓN

**Versión:** 1.0.0
**Fecha:** 2025-11-23
**Última actualización:** 2025-11-23

---

## 🎯 VISIÓN GENERAL

Este workspace contiene **4 proyectos ERP** que comparten componentes comunes y se desarrollan en paralelo:

1. **🔷 ERP Genérico** - Base reutilizable para todos los ERPs
2. **🏗️ ERP Construcción** - Empresas de construcción e INFONAVIT
3. **🪟 ERP Vidrio Templado** - Producción de vidrio templado
4. **🔧 ERP Mecánicas Diesel** - Laboratorios de mecánica diesel

---

## 📁 ESTRUCTURA DEL WORKSPACE

```
workspace-erp-multi/
│
├── shared/                    # 🔗 COMPONENTES COMPARTIDOS
│   ├── reference/             # Proyectos de referencia (Odoo, Gamilit)
│   ├── orchestration/         # Sistema de agentes y directivas
│   ├── analysis/              # Análisis y modelado compartido
│   ├── bugs/                  # Bugs que afectan a múltiples proyectos
│   ├── components/            # Código reutilizable (DB, Backend, Frontend)
│   └── docs/                  # Documentación compartida
│
├── projects/                  # 📦 PROYECTOS INDIVIDUALES
│   ├── erp-generic/           # ERP base
│   ├── erp-construccion/      # ERP construcción
│   ├── erp-vidrio-templado/   # ERP vidrio
│   └── erp-mecanicas-diesel/  # ERP mecánicas
│
└── tools/                     # 🛠️ SCRIPTS Y HERRAMIENTAS
    ├── migration/             # Scripts de migración
    ├── scaffolding/           # Crear nuevos proyectos
    └── validation/            # Validar estructura
```

---

## 🚀 INICIO RÁPIDO

### Para Nuevos Desarrolladores

1. **Leer documentación principal:**
   ```bash
   cat PROPUESTA-REESTRUCTURACION-MULTI-PROYECTO.md
   ```

2. **Entender orchestration:**
   ```bash
   cat shared/orchestration/README.md
   ```

3. **Revisar proyecto específico:**
   ```bash
   # Ejemplo: ERP Construcción
   cat projects/erp-construccion/README.md
   cat projects/erp-construccion/PROJECT-STATUS.md
   ```

4. **Ver guías de desarrollo:**
   ```bash
   ls shared/docs/guides/
   ```

### Para Agentes de IA

1. **Leer directivas obligatorias:**
   ```bash
   cat shared/orchestration/directivas/POLITICAS-USO-AGENTES.md
   cat shared/orchestration/directivas/DIRECTIVA-DOCUMENTACION-OBLIGATORIA.md
   ```

2. **Consultar prompts:**
   ```bash
   ls shared/orchestration/prompts/
   ```

3. **Identificar proyecto activo:**
   - El usuario debe especificar: "Trabajar en erp-construccion"
   - Cargar contexto del proyecto correspondiente

---

## 📚 PROYECTOS ERP

### 🔷 ERP Genérico

**Ubicación:** `projects/erp-generic/`
**Estado:** 📋 En planificación
**Progreso:** 0%

**Descripción:** ERP base con módulos comunes reutilizables (auth, users, catálogos, financiero, inventario, compras, CRM).

**Documentos clave:**
- [README](projects/erp-generic/README.md)
- [Estado del proyecto](projects/erp-generic/PROJECT-STATUS.md)
- Requerimientos: `projects/erp-generic/docs/01-analysis/requirements/`
- Arquitectura: `projects/erp-generic/docs/03-architecture/`

**Comandos útiles:**
```bash
cd projects/erp-generic
cat README.md
cat PROJECT-STATUS.md
```

---

### 🏗️ ERP Construcción

**Ubicación:** `projects/erp-construccion/`
**Estado:** 🚧 En desarrollo
**Progreso:** 35%

**Descripción:** ERP especializado para empresas de construcción con módulos de proyectos, presupuestos, control de obra, INFONAVIT, activos, etc.

**Documentos clave:**
- [README](projects/erp-construccion/README.md)
- [Estado del proyecto](projects/erp-construccion/PROJECT-STATUS.md)
- [MVP Plan](projects/erp-construccion/docs/00-overview/MVP-APP.md) (si fue migrado)
- Módulos: `projects/erp-construccion/docs/01-fase-alcance-inicial/`

**Comandos útiles:**
```bash
cd projects/erp-construccion
cat README.md
cat PROJECT-STATUS.md
ls docs/01-fase-alcance-inicial/  # Ver módulos disponibles
```

---

### 🪟 ERP Vidrio Templado

**Ubicación:** `projects/erp-vidrio-templado/`
**Estado:** 📋 En planificación
**Progreso:** 0%

**Descripción:** ERP para producción de vidrio templado con módulos de producción, calidad, inventario, órdenes, trazabilidad.

**Documentos clave:**
- [README](projects/erp-vidrio-templado/README.md)
- [Estado del proyecto](projects/erp-vidrio-templado/PROJECT-STATUS.md)
- Análisis: `projects/erp-vidrio-templado/docs/01-analysis/`

**Comandos útiles:**
```bash
cd projects/erp-vidrio-templado
cat README.md
cat PROJECT-STATUS.md
```

---

### 🔧 ERP Mecánicas Diesel

**Ubicación:** `projects/erp-mecanicas-diesel/`
**Estado:** 📋 En planificación
**Progreso:** 0%

**Descripción:** ERP para laboratorios de mecánica diesel con módulos de diagnósticos, reparaciones, refacciones, mantenimiento.

**Documentos clave:**
- [README](projects/erp-mecanicas-diesel/README.md)
- [Estado del proyecto](projects/erp-mecanicas-diesel/PROJECT-STATUS.md)
- Análisis: `projects/erp-mecanicas-diesel/docs/01-analysis/`

**Comandos útiles:**
```bash
cd projects/erp-mecanicas-diesel
cat README.md
cat PROJECT-STATUS.md
```

---

## 🔗 COMPONENTES COMPARTIDOS

### 📖 Reference - Proyectos de Referencia

**Ubicación:** `shared/reference/`

Proyectos de referencia para consulta y comparación:

- **Odoo** (`shared/reference/odoo/`) - ERP open source de referencia principal
- **Gamilit** (`shared/reference/gamilit/`) - Proyecto de referencia secundario

**Uso:**
- Comparar módulos antes de desarrollar
- Identificar mejores prácticas
- Evitar errores conocidos
- Documentar hallazgos en `shared/analysis/odoo-comparison/`

**Comandos útiles:**
```bash
# Ver módulos de Odoo disponibles
ls shared/reference/odoo/addons/

# Buscar módulo específico
find shared/reference/odoo -name "*stock*" -type d
```

---

### 🤖 Orchestration - Sistema de Agentes

**Ubicación:** `shared/orchestration/`

Sistema centralizado de agentes de IA y directivas:

**Componentes:**
- `agentes/` - Carpetas de trabajo de agentes (Database, Backend, Frontend, etc.)
- `directivas/` - Políticas y estándares obligatorios
- `prompts/` - Prompts de agentes
- `templates/` - Templates de documentación
- `scripts/` - Scripts de automatización

**Documentos clave:**
- [README](shared/orchestration/README.md)
- [Políticas de uso de agentes](shared/orchestration/directivas/POLITICAS-USO-AGENTES.md)
- [Directiva de documentación](shared/orchestration/directivas/DIRECTIVA-DOCUMENTACION-OBLIGATORIA.md)

**Comandos útiles:**
```bash
# Ver agentes disponibles
ls shared/orchestration/agentes/

# Leer políticas
cat shared/orchestration/directivas/POLITICAS-USO-AGENTES.md

# Ver prompts
ls shared/orchestration/prompts/
```

---

### 📊 Analysis - Análisis y Modelado

**Ubicación:** `shared/analysis/`

Análisis compartido, modelos de dominio, y comparaciones con Odoo:

**Componentes:**
- `domain-models/` - Modelos de dominio por área (common, financial, inventory, etc.)
- `odoo-comparison/` - Análisis de módulos de Odoo
- `architecture/` - ADRs (Architecture Decision Records)

**Uso:**
- **Antes de desarrollar** un módulo → revisar análisis correspondiente
- Documentar decisiones arquitectónicas en ADRs
- Comparar diseño con implementación de Odoo

**Comandos útiles:**
```bash
# Ver modelos de dominio
ls shared/analysis/domain-models/

# Ver comparaciones con Odoo
ls shared/analysis/odoo-comparison/

# Ver ADRs
ls shared/analysis/architecture/
```

---

### 🐛 Bugs - Sistema de Bugs Compartido

**Ubicación:** `shared/bugs/`

Gestión de bugs que afectan a componentes compartidos:

**Estructura:**
- `global/` - Bugs que afectan a múltiples proyectos
  - `BUGS-ACTIVOS.md` - Bugs abiertos
  - `BUGS-RESUELTOS.md` - Bugs cerrados
- `by-component/` - Bugs organizados por componente

**Workflow:**
1. Bug detectado en proyecto X
2. ¿Afecta componente compartido?
   - **SÍ** → Reportar en `shared/bugs/global/`
   - **NO** → Reportar en `projects/{proyecto}/bugs/`
3. Si es global, identificar proyectos afectados
4. Priorizar y corregir
5. Validar en todos los proyectos

**Comandos útiles:**
```bash
# Ver bugs globales activos
cat shared/bugs/global/BUGS-ACTIVOS.md

# Ver bugs resueltos
cat shared/bugs/global/BUGS-RESUELTOS.md
```

---

### 💎 Components - Código Reutilizable

**Ubicación:** `shared/components/`

Código que se comparte entre proyectos:

**Estructura:**
- `database/` - Schemas y funciones PL/pgSQL comunes
  - `common-schemas/` - Schemas de auth, users, companies, etc.
  - `common-functions/` - Funciones reutilizables
- `backend/` - Módulos backend compartidos
  - `auth-module/` - Autenticación y autorización
  - `common-entities/` - Entidades comunes
  - `common-services/` - Servicios reutilizables
  - `utils/` - Utilidades
- `frontend/` - Componentes UI compartidos
  - `ui-kit/` - Componentes de interfaz (buttons, forms, tables, etc.)
  - `common-hooks/` - Hooks React
  - `common-stores/` - Stores Zustand

**Uso:**
- Los proyectos **importan** componentes de aquí
- Al crear algo reutilizable → **moverlo aquí**
- Al modificar componente → **validar impacto** en todos los proyectos que lo usan

**Comandos útiles:**
```bash
# Ver componentes de base de datos
ls shared/components/database/common-schemas/

# Ver módulos backend
ls shared/components/backend/

# Ver componentes UI
ls shared/components/frontend/ui-kit/
```

---

### 📚 Docs - Documentación Compartida

**Ubicación:** `shared/docs/`

Documentación compartida para todos los proyectos:

**Estructura:**
- `onboarding/` - Guías de inicio para nuevos desarrolladores
- `standards/` - Estándares de código y desarrollo
- `guides/` - Guías de desarrollo

**Comandos útiles:**
```bash
# Ver guías disponibles
ls shared/docs/guides/

# Ver estándares
ls shared/docs/standards/
```

---

## 🛠️ HERRAMIENTAS Y SCRIPTS

### Tools - Scripts de Utilidad

**Ubicación:** `tools/`

Scripts para automatizar tareas comunes:

**Componentes:**
- `migration/` - Scripts de migración
  - `migrate-to-multi-project.sh` - Migrar a estructura multi-proyecto
- `scaffolding/` - Crear nuevos proyectos
  - `create-new-erp-project.sh` - Crear nuevo ERP (próximamente)
- `validation/` - Validar estructura
  - `validate-structure.sh` - Validar estructura de carpetas

**Uso:**
```bash
# Validar estructura del workspace
bash tools/validation/validate-structure.sh

# Migrar a estructura multi-proyecto (si aún no se ha hecho)
bash tools/migration/migrate-to-multi-project.sh
```

---

## 📋 FLUJOS DE TRABAJO

### Flujo 1: Iniciar Nuevo Proyecto ERP

```
1. Crear estructura usando script de scaffolding
   bash tools/scaffolding/create-new-erp-project.sh nombre-erp

2. Fase de Análisis
   - Documentar requerimientos en docs/01-analysis/requirements/
   - Crear modelos de dominio
   - Comparar con Odoo (shared/analysis/odoo-comparison/)
   - Diseñar base de datos

3. Setup del proyecto
   - Configurar apps/database/
   - Configurar apps/backend/
   - Configurar apps/frontend/

4. Desarrollo
   - Usar agentes de shared/orchestration/
   - Reutilizar componentes de shared/components/
   - Documentar en orchestration/ local del proyecto
```

### Flujo 2: Desarrollar en Proyecto Existente

```
1. Identificar proyecto
   cd projects/erp-construccion/

2. Leer contexto
   cat README.md
   cat PROJECT-STATUS.md
   cat orchestration/trazas/TRAZA-REQUERIMIENTOS.md

3. Usar agente apropiado
   - Para DB: Database-Agent
   - Para Backend: Backend-Agent
   - Para Frontend: Frontend-Agent
   - Para feature completo: Feature-Developer

4. Seguir directivas
   - Leer shared/orchestration/directivas/
   - Consultar inventarios locales
   - Actualizar trazas

5. Al terminar
   - Actualizar inventarios
   - Documentar en trazas
   - ¿Componente reutilizable? → Mover a shared/components/
```

### Flujo 3: Reportar y Corregir Bug

```
1. Bug detectado
   ¿Afecta componente compartido?

2. Si es bug LOCAL:
   - Reportar en projects/{proyecto}/bugs/BUGS-ACTIVOS.md
   - Usar Bug-Fixer agent
   - Corregir en proyecto local

3. Si es bug GLOBAL:
   - Reportar en shared/bugs/global/BUGS-ACTIVOS.md
   - Identificar proyectos afectados
   - Priorizar
   - Corregir en shared/components/
   - Actualizar todos los proyectos afectados
   - Validar en todos
   - Cerrar bug
```

### Flujo 4: Reutilizar Componente

```
1. Identificar necesidad
   "Necesito módulo de autenticación"

2. Buscar en shared/components/
   ls shared/components/backend/auth-module/

3. ¿Existe?
   SÍ → Importar en proyecto
   NO → Desarrollar en proyecto, luego mover a shared si es reutilizable

4. Documentar uso
   - Actualizar inventarios
   - Documentar dependencias
```

---

## 🎯 ORDEN DE DESARROLLO RECOMENDADO

### Fase 1: ERP Genérico (3-4 meses)

Desarrollar módulos base que se reutilizarán en todos los ERPs:
- Autenticación
- Usuarios y roles
- Catálogos
- Financiero básico
- Inventario básico
- Compras básico
- CRM básico

**Resultado:** `shared/components/` lleno de módulos reutilizables

### Fase 2: ERPs Específicos (en paralelo, 3-5 meses cada uno)

1. **ERP Construcción** (reutiliza 60-70% de código genérico)
   - Módulos específicos de construcción
   - INFONAVIT, proyectos, presupuestos, etc.

2. **ERP Vidrio** (reutiliza 60-70% de código genérico)
   - Módulos específicos de producción
   - Órdenes, calidad, hornos, etc.

3. **ERP Mecánicas** (reutiliza 50-60% de código genérico)
   - Módulos específicos de servicios
   - Diagnósticos, reparaciones, refacciones, etc.

---

## 📖 GUÍAS DE NAVEGACIÓN

### Para Desarrolladores Frontend

```bash
# Ver componentes UI compartidos
ls shared/components/frontend/ui-kit/

# Ver proyecto específico
cd projects/erp-construccion/apps/frontend/web/

# Ver documentación de frontend
cat shared/docs/guides/frontend-development.md  # (crear si no existe)
```

### Para Desarrolladores Backend

```bash
# Ver módulos compartidos
ls shared/components/backend/

# Ver proyecto específico
cd projects/erp-construccion/apps/backend/

# Ver documentación de backend
cat shared/docs/guides/backend-development.md  # (crear si no existe)
```

### Para Desarrolladores Database

```bash
# Ver schemas compartidos
ls shared/components/database/common-schemas/

# Ver proyecto específico
cd projects/erp-construccion/apps/database/

# Ver documentación de database
cat shared/docs/guides/database-development.md  # (crear si no existe)
```

---

## 🔍 BÚSQUEDA Y NAVEGACIÓN

### Buscar en el workspace

```bash
# Buscar archivo por nombre
find . -name "*auth*" -type f

# Buscar en código
grep -r "authentication" --include="*.ts" --include="*.sql"

# Buscar en documentación
grep -r "INFONAVIT" --include="*.md"
```

### Consultas comunes

```bash
# ¿Qué proyectos hay?
ls projects/

# ¿Qué componentes compartidos hay?
ls shared/components/

# ¿Qué bugs globales hay?
cat shared/bugs/global/BUGS-ACTIVOS.md

# ¿Cuál es el estado de un proyecto?
cat projects/erp-construccion/PROJECT-STATUS.md

# ¿Qué agentes hay?
ls shared/orchestration/agentes/
```

---

## 📊 DASHBOARD DE ESTADO

### Estado General del Workspace

| Proyecto | Estado | Progreso | Módulos | Bugs |
|----------|--------|----------|---------|------|
| **ERP Genérico** | 📋 Planificación | 0% | 0/10 | 0 |
| **ERP Construcción** | 🚧 Desarrollo | 35% | 4/18 | TBD |
| **ERP Vidrio** | 📋 Planificación | 0% | 0/8 | 0 |
| **ERP Mecánicas** | 📋 Planificación | 0% | 0/7 | 0 |

### Componentes Compartidos

| Componente | Estado | Proyectos que lo usan |
|------------|--------|----------------------|
| Auth Module | ⏳ Pendiente | Ninguno aún |
| UI Kit | ⏳ Pendiente | Ninguno aún |
| Common Schemas | ⏳ Pendiente | Ninguno aún |

---

## 🆘 AYUDA Y TROUBLESHOOTING

### Problemas comunes

**1. No sé en qué proyecto trabajar**
```bash
# Ver todos los proyectos
ls projects/

# Ver estado de cada uno
cat projects/*/PROJECT-STATUS.md
```

**2. No encuentro un componente**
```bash
# Buscar en shared/components/
find shared/components -name "*nombre*"

# Ver README de components
cat shared/components/README.md
```

**3. No sé qué agente usar**
```bash
# Ver guía de agentes
cat shared/orchestration/directivas/POLITICAS-USO-AGENTES.md

# Ver agentes disponibles
ls shared/orchestration/agentes/
```

**4. Estructura parece rota**
```bash
# Validar estructura
bash tools/validation/validate-structure.sh
```

---

## 📞 CONTACTO Y RECURSOS

### Documentación clave

- **Propuesta completa:** [PROPUESTA-REESTRUCTURACION-MULTI-PROYECTO.md](PROPUESTA-REESTRUCTURACION-MULTI-PROYECTO.md)
- **Sistema de orchestration:** [shared/orchestration/README.md](shared/orchestration/README.md)
- **Gestión de bugs:** [shared/bugs/README.md](shared/bugs/README.md)

### Scripts útiles

- **Validar estructura:** `bash tools/validation/validate-structure.sh`
- **Migrar workspace:** `bash tools/migration/migrate-to-multi-project.sh`

---

## ✅ CHECKLIST DE INICIO

Para nuevos usuarios del workspace:

- [ ] Leer este documento (WORKSPACE-OVERVIEW.md)
- [ ] Leer propuesta completa (PROPUESTA-REESTRUCTURACION-MULTI-PROYECTO.md)
- [ ] Revisar shared/orchestration/README.md
- [ ] Identificar proyecto en el que trabajarás
- [ ] Leer README y PROJECT-STATUS del proyecto
- [ ] Familiarizarse con componentes compartidos
- [ ] Entender flujo de bugs (local vs global)

---

**Versión:** 1.0.0
**Última actualización:** 2025-11-23
**Mantenido por:** Tech Lead / AI Agents
**Próxima revisión:** Mensual
