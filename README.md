# WORKSPACE MULTI-PROYECTO ERP

**Versión:** 2.0.0
**Fecha de creación:** 2025-11-17
**Última actualización:** 2025-11-23
**Tipo:** Monorepo multi-proyecto con componentes compartidos

---

## 🎯 DESCRIPCIÓN

Workspace que contiene **4 proyectos ERP** diseñados para diferentes giros de negocio, compartiendo componentes comunes, sistema de agentes, referencias, y gestión centralizada de bugs.

### Proyectos incluidos:

1. **🔷 ERP Genérico** - ERP base con módulos reutilizables
2. **🏗️ ERP Construcción** - Para empresas de construcción e INFONAVIT
3. **🪟 ERP Vidrio Templado** - Para producción de vidrio templado
4. **🔧 ERP Mecánicas Diesel** - Para laboratorios de mecánica diesel

---

## 🚀 INICIO RÁPIDO

### Para Nuevos Usuarios

```bash
# 1. Leer mapa de navegación del workspace
cat WORKSPACE-OVERVIEW.md

# 2. Entender la propuesta y arquitectura
cat PROPUESTA-REESTRUCTURACION-MULTI-PROYECTO.md

# 3. Ver proyectos disponibles
ls projects/

# 4. Revisar proyecto específico
cat projects/erp-construccion/README.md
cat projects/erp-construccion/PROJECT-STATUS.md

# 5. Familiarizarse con sistema de orchestration
cat shared/orchestration/README.md
cat shared/orchestration/directivas/POLITICAS-USO-AGENTES.md
```

### Para Agentes de IA

```bash
# 1. Leer directivas obligatorias
cat shared/orchestration/directivas/POLITICAS-USO-AGENTES.md
cat shared/orchestration/directivas/DIRECTIVA-DOCUMENTACION-OBLIGATORIA.md

# 2. Consultar prompts
ls shared/orchestration/prompts/

# 3. Identificar proyecto activo (especificado por usuario)
# Ejemplo: "Trabajar en erp-construccion"

# 4. Cargar contexto del proyecto
cat projects/{proyecto}/README.md
cat projects/{proyecto}/PROJECT-STATUS.md
cat projects/{proyecto}/orchestration/inventarios/*.yml
```

---

## 📁 ESTRUCTURA DEL WORKSPACE

```
workspace-erp-multi/
│
├── README.md                          # 👈 Este archivo
├── WORKSPACE-OVERVIEW.md              # 📍 Mapa de navegación completo
├── PROPUESTA-REESTRUCTURACION-MULTI-PROYECTO.md  # 📋 Propuesta detallada
│
├── shared/                            # 🔗 COMPONENTES COMPARTIDOS
│   ├── reference/                     # Proyectos de referencia (Odoo, Gamilit)
│   ├── orchestration/                 # Sistema de agentes y directivas
│   ├── analysis/                      # Análisis y modelado compartido
│   ├── bugs/                          # Bugs que afectan a múltiples proyectos
│   ├── components/                    # Código reutilizable (DB, Backend, Frontend)
│   └── docs/                          # Documentación compartida
│
├── projects/                          # 📦 PROYECTOS INDIVIDUALES
│   ├── erp-generic/                   # ERP base (0% - En planificación)
│   ├── erp-construccion/              # ERP construcción (35% - En desarrollo)
│   ├── erp-vidrio-templado/           # ERP vidrio (0% - En planificación)
│   └── erp-mecanicas-diesel/          # ERP mecánicas (0% - En planificación)
│
└── tools/                             # 🛠️ SCRIPTS Y HERRAMIENTAS
    ├── migration/                     # Scripts de migración
    ├── scaffolding/                   # Crear nuevos proyectos
    └── validation/                    # Validar estructura
```

---

## 📚 DOCUMENTACIÓN

### Documentos principales (en este nivel)

| Documento | Descripción |
|-----------|-------------|
| **README.md** | Este archivo - Introducción al workspace |
| **[WORKSPACE-OVERVIEW.md](WORKSPACE-OVERVIEW.md)** | Mapa de navegación completo del workspace |
| **[PROPUESTA-REESTRUCTURACION-MULTI-PROYECTO.md](PROPUESTA-REESTRUCTURACION-MULTI-PROYECTO.md)** | Propuesta detallada de la estructura multi-proyecto |

### Documentación por componente

| Ubicación | Descripción |
|-----------|-------------|
| **[shared/orchestration/README.md](shared/orchestration/README.md)** | Sistema de agentes y directivas |
| **[shared/bugs/README.md](shared/bugs/README.md)** | Gestión de bugs compartidos |
| **shared/components/README.md** | Componentes reutilizables |
| **shared/analysis/README.md** | Análisis y modelado |

### Documentación por proyecto

Cada proyecto tiene su propia documentación:

```bash
projects/{proyecto}/
├── README.md                 # Descripción del proyecto
├── PROJECT-STATUS.md         # Estado actual
└── docs/                     # Documentación completa
    ├── 00-overview/          # Visión general, MVP, roadmap
    ├── 01-analysis/          # Análisis de requerimientos
    ├── 02-modules/           # Documentación por módulo
    ├── 03-architecture/      # Arquitectura y ADRs
    └── 04-development/       # Guías de desarrollo
```

---

## 🎯 PROYECTOS

### 🔷 ERP Genérico

**Estado:** 📋 En planificación | **Progreso:** 0%

ERP base con módulos comunes reutilizables.

**Documentación:**
- [README](projects/erp-generic/README.md)
- [Estado del proyecto](projects/erp-generic/PROJECT-STATUS.md)

**Comandos:**
```bash
cd projects/erp-generic
cat README.md
```

---

### 🏗️ ERP Construcción

**Estado:** 🚧 En desarrollo | **Progreso:** 35%

ERP especializado para empresas de construcción e INFONAVIT.

**Documentación:**
- [README](projects/erp-construccion/README.md)
- [Estado del proyecto](projects/erp-construccion/PROJECT-STATUS.md)

**Comandos:**
```bash
cd projects/erp-construccion
cat README.md
cat PROJECT-STATUS.md
```

---

### 🪟 ERP Vidrio Templado

**Estado:** 📋 En planificación | **Progreso:** 0%

ERP especializado para producción de vidrio templado.

**Documentación:**
- [README](projects/erp-vidrio-templado/README.md)
- [Estado del proyecto](projects/erp-vidrio-templado/PROJECT-STATUS.md)

**Comandos:**
```bash
cd projects/erp-vidrio-templado
cat README.md
```

---

### 🔧 ERP Mecánicas Diesel

**Estado:** 📋 En planificación | **Progreso:** 0%

ERP especializado para laboratorios de mecánica diesel.

**Documentación:**
- [README](projects/erp-mecanicas-diesel/README.md)
- [Estado del proyecto](projects/erp-mecanicas-diesel/PROJECT-STATUS.md)

**Comandos:**
```bash
cd projects/erp-mecanicas-diesel
cat README.md
```

---

## 🔗 COMPONENTES COMPARTIDOS

### 📖 Reference - Proyectos de Referencia

**Ubicación:** `shared/reference/`

- **Odoo** - ERP open source de referencia
- **Gamilit** - Proyecto de referencia secundario

**Uso:** Comparar módulos antes de desarrollar, identificar mejores prácticas, evitar errores conocidos.

---

### 🤖 Orchestration - Sistema de Agentes

**Ubicación:** `shared/orchestration/`

Sistema centralizado de agentes de IA y directivas compartidas por todos los proyectos.

**Agentes disponibles:**
- Database-Agent
- Backend-Agent
- Frontend-Agent
- Requirements-Analyst
- Code-Reviewer
- Bug-Fixer
- Feature-Developer
- Policy-Auditor
- Architecture-Analyst

**Documentación:** [shared/orchestration/README.md](shared/orchestration/README.md)

---

### 📊 Analysis - Análisis y Modelado

**Ubicación:** `shared/analysis/`

Análisis compartido, modelos de dominio, comparaciones con Odoo, y decisiones arquitectónicas (ADRs).

**Uso:** Antes de desarrollar cualquier módulo, revisar análisis y comparación con Odoo.

---

### 🐛 Bugs - Sistema de Bugs Compartido

**Ubicación:** `shared/bugs/`

Gestión de bugs que afectan a componentes compartidos vs bugs específicos de proyectos.

**Workflow:**
- Bug en componente compartido → `shared/bugs/global/`
- Bug específico de proyecto → `projects/{proyecto}/bugs/`

**Documentación:** [shared/bugs/README.md](shared/bugs/README.md)

---

### 💎 Components - Código Reutilizable

**Ubicación:** `shared/components/`

Código que se comparte entre proyectos:
- **Database** - Schemas y funciones PL/pgSQL
- **Backend** - Módulos, entities, services
- **Frontend** - UI kit, hooks, stores

**Uso:** Los proyectos importan componentes de aquí. Al crear algo reutilizable, moverlo aquí.

---

## 🛠️ HERRAMIENTAS

### Scripts disponibles

```bash
# Validar estructura del workspace
bash tools/validation/validate-structure.sh

# Migrar a estructura multi-proyecto (si no se ha hecho)
bash tools/migration/migrate-to-multi-project.sh

# Crear nuevo proyecto ERP (próximamente)
# bash tools/scaffolding/create-new-erp-project.sh nombre-erp
```

---

## 🎯 ORDEN DE DESARROLLO

### Fase 1: ERP Genérico (3-4 meses)

Desarrollar módulos base reutilizables:
- ✅ Autenticación
- ✅ Usuarios y roles
- ✅ Catálogos maestros
- ✅ Financiero básico
- ✅ Inventario básico
- ✅ Compras básico
- ✅ CRM básico

**Resultado:** Componentes en `shared/components/` listos para reutilizar

### Fase 2: ERPs Específicos (en paralelo)

1. **ERP Construcción** - Reutiliza 60-70% del código genérico
2. **ERP Vidrio** - Reutiliza 60-70% del código genérico
3. **ERP Mecánicas** - Reutiliza 50-60% del código genérico

---

## 📋 FLUJOS DE TRABAJO

### Desarrollar en un proyecto

```bash
# 1. Identificar proyecto
cd projects/erp-construccion/

# 2. Revisar estado
cat PROJECT-STATUS.md
cat orchestration/trazas/TRAZA-REQUERIMIENTOS.md

# 3. Usar agente apropiado (especificar en prompt)
# "Por favor, usa Database-Agent para crear schema de proyectos"

# 4. El agente:
#    - Lee directivas de shared/orchestration/directivas/
#    - Consulta inventarios locales
#    - Ejecuta tarea
#    - Actualiza trazas y documentación
```

### Reportar bug

```bash
# ¿Afecta componente compartido?

# Bug LOCAL → projects/{proyecto}/bugs/BUGS-ACTIVOS.md
# Bug GLOBAL → shared/bugs/global/BUGS-ACTIVOS.md
```

### Reutilizar componente

```bash
# 1. Buscar en shared/components/
ls shared/components/backend/

# 2. Importar en proyecto
# (copiar o referenciar según convenga)

# 3. Documentar uso en inventarios
```

---

## 🚦 ESTADO DEL WORKSPACE

### Dashboard

| Proyecto | Estado | Progreso | Última actualización |
|----------|--------|----------|---------------------|
| ERP Genérico | 📋 Planificación | 0% | 2025-11-23 |
| ERP Construcción | 🚧 Desarrollo | 35% | 2025-11-23 |
| ERP Vidrio | 📋 Planificación | 0% | 2025-11-23 |
| ERP Mecánicas | 📋 Planificación | 0% | 2025-11-23 |

### Próximos pasos

1. ✅ **Ejecutar migración** (si aún no se ha hecho)
   ```bash
   bash tools/migration/migrate-to-multi-project.sh
   ```

2. ✅ **Iniciar Fase de Análisis - ERP Genérico**
   - Documentar requerimientos
   - Modelado de dominio
   - Comparación con Odoo
   - Diseño de base de datos

3. ✅ **Desarrollo de módulos base**
   - Autenticación
   - Usuarios
   - Catálogos

---

## ✅ VENTAJAS DE ESTA ESTRUCTURA

1. **Reutilización de código:** 60-70% de código compartido reduce tiempo de desarrollo
2. **Desarrollo paralelo:** Equipos pueden trabajar en proyectos diferentes sin conflictos
3. **Bugs compartidos:** Un bug corregido beneficia a todos los proyectos
4. **Agentes centralizados:** Mismas políticas y estándares para todos
5. **Referencias centralizadas:** Odoo y Gamilit accesibles desde todos los proyectos
6. **Fase de análisis:** Validación con Odoo antes de desarrollo reduce errores
7. **Escalabilidad:** Fácil agregar nuevos ERPs
8. **Mantenimiento:** Componentes compartidos tienen un solo punto de actualización

---

## 📖 REFERENCIAS

### Documentación interna

- [Mapa de navegación](WORKSPACE-OVERVIEW.md)
- [Propuesta completa](PROPUESTA-REESTRUCTURACION-MULTI-PROYECTO.md)
- [Sistema de orchestration](shared/orchestration/README.md)
- [Gestión de bugs](shared/bugs/README.md)

### Proyectos de referencia

- Odoo: `shared/reference/odoo/`
- Gamilit: `shared/reference/gamilit/`

---

## 🆘 AYUDA

### Comandos útiles

```bash
# Ver todos los proyectos
ls projects/

# Ver estado de todos los proyectos
cat projects/*/PROJECT-STATUS.md

# Ver bugs globales
cat shared/bugs/global/BUGS-ACTIVOS.md

# Ver componentes compartidos
ls shared/components/

# Validar estructura
bash tools/validation/validate-structure.sh

# Ver agentes disponibles
ls shared/orchestration/agentes/
```

### Problemas comunes

**No sé en qué proyecto trabajar**
```bash
ls projects/
cat projects/*/PROJECT-STATUS.md
```

**No encuentro un componente**
```bash
find shared/components -name "*auth*"
```

**Estructura parece rota**
```bash
bash tools/validation/validate-structure.sh
```

---

## ✅ CHECKLIST DE INICIO

Para nuevos usuarios:

- [ ] Leer este README
- [ ] Leer [WORKSPACE-OVERVIEW.md](WORKSPACE-OVERVIEW.md)
- [ ] Leer [PROPUESTA-REESTRUCTURACION-MULTI-PROYECTO.md](PROPUESTA-REESTRUCTURACION-MULTI-PROYECTO.md)
- [ ] Revisar [shared/orchestration/README.md](shared/orchestration/README.md)
- [ ] Identificar proyecto en el que trabajarás
- [ ] Leer README y PROJECT-STATUS del proyecto
- [ ] Familiarizarse con componentes compartidos
- [ ] Entender flujo de bugs (local vs global)

---

## 📞 CONTACTO

**Mantenido por:** Tech Lead / AI Agents
**Versión del workspace:** 2.0.0
**Última actualización:** 2025-11-23
**Próxima revisión:** Mensual

---

## 📜 CHANGELOG

### [2.0.0] - 2025-11-23

#### Agregado
- Estructura multi-proyecto con 4 ERPs
- Sistema de componentes compartidos en `shared/`
- Sistema de bugs compartido en `shared/bugs/`
- Análisis y modelado compartido en `shared/analysis/`
- Scripts de migración y validación en `tools/`
- Documentación completa (WORKSPACE-OVERVIEW.md, PROPUESTA-REESTRUCTURACION-MULTI-PROYECTO.md)

#### Cambiado
- Migración de contenido a `projects/erp-construccion/`
- `reference/` y `orchestration/` movidos a `shared/`
- Estructura reorganizada para soportar múltiples proyectos

#### Mejorado
- Sistema de orchestration ahora centralizado
- Mejor separación de concerns entre proyectos
- Reutilización de código mediante componentes compartidos

### [1.0.0] - 2025-11-17

#### Inicial
- Proyecto original ERP Construcción
- Sistema de orchestration
- Proyectos de referencia (Odoo, Gamilit)

---

**¡Bienvenido al Workspace Multi-Proyecto ERP!** 🚀

Para comenzar, lee [WORKSPACE-OVERVIEW.md](WORKSPACE-OVERVIEW.md) para entender la navegación completa del workspace.
