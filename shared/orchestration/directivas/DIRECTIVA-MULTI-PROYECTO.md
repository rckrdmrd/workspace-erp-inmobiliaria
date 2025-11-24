# DIRECTIVA: TRABAJO EN WORKSPACE MULTI-PROYECTO

**Versión:** 1.0.0
**Fecha:** 2025-11-23
**Estado:** ✅ Activa
**Prioridad:** 🔴 Obligatoria
**Aplica a:** Todos los agentes

---

## 📋 PROPÓSITO

Establecer directivas y mejores prácticas para trabajo en workspace multi-proyecto que contiene 4 ERPs diferentes compartiendo componentes comunes.

---

## 🎯 CONTEXTO DEL WORKSPACE

### Proyectos activos

| Proyecto | Ubicación | Estado | Progreso |
|----------|-----------|--------|----------|
| **ERP Genérico** | `projects/erp-generic/` | 📋 Planificación | 0% |
| **ERP Construcción** | `projects/erp-construccion/` | 🚧 Desarrollo | 35% |
| **ERP Vidrio** | `projects/erp-vidrio-templado/` | 📋 Planificación | 0% |
| **ERP Mecánicas** | `projects/erp-mecanicas-diesel/` | 📋 Planificación | 0% |

### Estructura compartida

```
shared/
├── reference/         # Proyectos de referencia (Odoo, Gamilit)
├── orchestration/     # Sistema de agentes (TÚ ESTÁS AQUÍ)
├── analysis/          # Análisis y modelado compartido
├── bugs/              # Bugs que afectan componentes compartidos
├── components/        # Código reutilizable
└── docs/              # Documentación compartida
```

---

## 📐 REGLAS OBLIGATORIAS

### REGLA 1: Identificación de proyecto activo

**🔴 OBLIGATORIO:** El agente SIEMPRE debe identificar en qué proyecto está trabajando.

**Cómo identificar:**
1. El usuario DEBE especificar el proyecto: "Trabajar en erp-construccion"
2. Si no está claro → PREGUNTAR al usuario

**Mal:**
```
❌ "Voy a crear la tabla de usuarios"
   (¿En qué proyecto? ¿En shared/components? ¿En erp-construccion?)
```

**Bien:**
```
✅ "Voy a crear la tabla de usuarios en el proyecto erp-construccion"
✅ "Voy a crear tabla de usuarios en shared/components/database/ (reutilizable)"
```

---

### REGLA 2: Contexto de proyecto

**🔴 OBLIGATORIO:** Al iniciar trabajo en un proyecto, cargar su contexto.

**Pasos:**
```bash
# 1. Leer README del proyecto
cat projects/{proyecto}/README.md

# 2. Leer estado actual
cat projects/{proyecto}/PROJECT-STATUS.md

# 3. Consultar inventarios locales
cat projects/{proyecto}/orchestration/inventarios/*.yml

# 4. Revisar trazas recientes
tail -100 projects/{proyecto}/orchestration/trazas/TRAZA-*.md
```

**Ejemplo:**
```
Proyecto activo: erp-construccion
Ubicación: projects/erp-construccion/
Estado: 🚧 En desarrollo (35%)
Último módulo: MAI-001-fundamentos

[Ahora puedo trabajar con contexto completo]
```

---

### REGLA 3: Usar inventarios correctos

**🔴 OBLIGATORIO:** Consultar inventarios del proyecto correcto.

**Inventarios locales (por proyecto):**
```
projects/{proyecto}/orchestration/inventarios/
├── DATABASE_INVENTORY.yml      # Objetos de DB del proyecto
├── BACKEND_INVENTORY.yml       # Módulos backend del proyecto
└── FRONTEND_INVENTORY.yml      # Componentes frontend del proyecto
```

**Inventarios compartidos:**
```
shared/orchestration/inventarios/
└── SHARED_COMPONENTS_INVENTORY.yml  # Componentes en shared/components/
```

**Mal:**
```
❌ Leo DATABASE_INVENTORY.yml pero no sé de qué proyecto
❌ Consulto inventario de erp-generic cuando estoy en erp-construccion
```

**Bien:**
```
✅ Consulto projects/erp-construccion/orchestration/inventarios/DATABASE_INVENTORY.yml
✅ Consulto shared/orchestration/inventarios/SHARED_COMPONENTS_INVENTORY.yml (para componentes compartidos)
```

---

### REGLA 4: Actualizar trazas correctas

**🔴 OBLIGATORIO:** Actualizar trazas del proyecto correcto.

**Trazas locales (por proyecto):**
```
projects/{proyecto}/orchestration/trazas/
├── TRAZA-REQUERIMIENTOS.md
├── TRAZA-TAREAS-DATABASE.md
├── TRAZA-TAREAS-BACKEND.md
└── TRAZA-TAREAS-FRONTEND.md
```

**Mal:**
```
❌ Actualizo TRAZA-TAREAS-DATABASE.md pero no especifico de qué proyecto
❌ Actualizo traza en proyecto equivocado
```

**Bien:**
```
✅ Actualizo projects/erp-construccion/orchestration/trazas/TRAZA-TAREAS-DATABASE.md
✅ Al final del trabajo, marco tarea como completada en la traza correcta
```

---

### REGLA 5: Componentes compartidos vs específicos

**🔴 OBLIGATORIO:** Decidir correctamente dónde va el código.

**Pregunta clave:** ¿Este código se reutilizará en otros proyectos?

#### Código REUTILIZABLE → `shared/components/`

Ejemplos:
- ✅ Módulo de autenticación (todos los ERPs lo usan)
- ✅ Tabla de usuarios (común a todos)
- ✅ Componentes UI básicos (botones, forms, etc.)
- ✅ Funciones de validación comunes

**Ubicación:**
```
shared/components/
├── database/common-schemas/auth/          # Schema de autenticación
├── backend/auth-module/                   # Módulo backend de auth
└── frontend/ui-kit/buttons/               # Botones reutilizables
```

#### Código ESPECÍFICO → `projects/{proyecto}/apps/`

Ejemplos:
- ✅ Tabla de proyectos de construcción (solo erp-construccion)
- ✅ Módulo de INFONAVIT (solo erp-construccion)
- ✅ Módulo de hornos (solo erp-vidrio-templado)
- ✅ Módulo de diagnósticos diesel (solo erp-mecanicas-diesel)

**Ubicación:**
```
projects/erp-construccion/apps/
├── database/ddl/schemas/project_management/   # Schemas específicos
├── backend/src/modules/infonavit/             # Módulo específico
└── frontend/web/src/apps/admin/pages/Projects/ # Páginas específicas
```

**Proceso de decisión:**
```
1. ¿Este código se usará en 2+ proyectos?
   SÍ → shared/components/
   NO → projects/{proyecto}/apps/

2. ¿Este código es un concepto universal?
   SÍ (auth, users, companies) → shared/components/
   NO (INFONAVIT, hornos) → projects/{proyecto}/apps/

3. En caso de duda → empezar en proyecto específico
   Luego, si se reutiliza → mover a shared/components/
```

---

### REGLA 6: Gestión de bugs

**🔴 OBLIGATORIO:** Reportar bugs en la ubicación correcta.

#### Bug en componente COMPARTIDO → `shared/bugs/global/`

**Ejemplos:**
- Error en módulo de autenticación (shared/components/backend/auth-module/)
- Bug en botón UI compartido (shared/components/frontend/ui-kit/buttons/)
- Error en función de validación común (shared/components/backend/utils/)

**Formato:**
```markdown
## BUG-GLOBAL-001: JWT expira antes de tiempo

**Componente:** shared/components/backend/auth-module/
**Afecta a:**
  - erp-generic ✅
  - erp-construccion ✅
  - erp-vidrio-templado ❌ (no usa aún)
  - erp-mecanicas-diesel ❌ (no usa aún)
**Prioridad:** 🔴 Alta
**Detectado en:** erp-construccion

[...]
```

#### Bug en código ESPECÍFICO → `projects/{proyecto}/bugs/`

**Ejemplos:**
- Error en cálculo de presupuesto de construcción
- Bug en workflow de INFONAVIT
- Error en gestión de hornos de vidrio

**Ubicación:**
```
projects/erp-construccion/bugs/BUGS-ACTIVOS.md
```

---

### REGLA 7: Fase de análisis con Odoo

**🔴 OBLIGATORIO:** Antes de desarrollar cualquier módulo, revisar implementación en Odoo.

**Proceso:**
1. **Identificar módulo equivalente en Odoo**
   ```bash
   ls shared/reference/odoo/addons/ | grep -i "inventory"
   # → stock/ (módulo de inventario de Odoo)
   ```

2. **Analizar estructura de Odoo**
   ```bash
   cd shared/reference/odoo/addons/stock/
   ls models/     # Ver modelos de datos
   ls views/      # Ver vistas
   ls security/   # Ver permisos
   ```

3. **Documentar hallazgos**
   ```markdown
   # shared/analysis/odoo-comparison/inventory-module.md

   ## Análisis del módulo stock de Odoo

   ### Modelos principales
   - stock.location
   - stock.move
   - stock.picking
   - stock.quant

   ### Mejores prácticas identificadas
   1. Usar stock.move para trazabilidad
   2. Separar ubicaciones físicas vs lógicas

   ### Aplicable a nuestro ERP
   ✅ Adoptar modelo de stock.move
   ❌ No usar stock.picking (muy complejo para MVP)
   ```

4. **Diseñar basado en análisis**
   ```markdown
   # projects/{proyecto}/docs/01-analysis/database-design/inventory-schema.md

   ## Schema de Inventario (basado en Odoo)

   Inspirado en stock.location y stock.move de Odoo.
   Simplificado para MVP.
   ```

---

## 🎯 FLUJOS DE TRABAJO

### Flujo 1: Iniciar trabajo en un proyecto

```
1. Usuario especifica proyecto
   "Por favor, trabaja en erp-construccion"

2. Agente carga contexto
   - Lee README del proyecto
   - Lee PROJECT-STATUS
   - Consulta inventarios locales
   - Revisa trazas recientes

3. Agente confirma contexto
   "✅ Proyecto activo: erp-construccion
    Estado: 🚧 En desarrollo (35%)
    Último módulo: MAI-001-fundamentos
    Listo para trabajar."

4. Agente ejecuta tarea en el proyecto correcto
```

### Flujo 2: Desarrollar componente reutilizable

```
1. Identificar que el componente es reutilizable
   "El módulo de autenticación se usará en todos los ERPs"

2. Desarrollar en shared/components/
   shared/components/backend/auth-module/

3. Actualizar inventario compartido
   shared/orchestration/inventarios/SHARED_COMPONENTS_INVENTORY.yml

4. Documentar en análisis
   shared/analysis/domain-models/common/auth.md

5. Registrar en trazas del proyecto actual
   projects/{proyecto}/orchestration/trazas/TRAZA-TAREAS-BACKEND.md
   → "Creado módulo de auth en shared/components/ (reutilizable)"
```

### Flujo 3: Reportar bug global

```
1. Detectar bug en componente compartido
   "Error en shared/components/backend/auth-module/"

2. Reportar en shared/bugs/global/BUGS-ACTIVOS.md
   ## BUG-GLOBAL-001: ...

3. Identificar proyectos afectados
   - erp-construccion ✅ (usa el módulo)
   - erp-generic ✅ (usa el módulo)
   - otros ❌ (no usan aún)

4. Priorizar según impacto
   🔴 Alta (afecta a 2 proyectos activos)

5. Corregir en shared/components/

6. Validar en todos los proyectos afectados

7. Cerrar bug y mover a BUGS-RESUELTOS.md
```

### Flujo 4: Comparar con Odoo antes de desarrollar

```
1. Identificar módulo a desarrollar
   "Voy a desarrollar módulo de inventario"

2. Buscar equivalente en Odoo
   ls shared/reference/odoo/addons/ | grep -i "stock"
   → addons/stock/

3. Analizar estructura de Odoo
   cd shared/reference/odoo/addons/stock/
   cat models/stock_move.py
   cat models/stock_location.py

4. Documentar hallazgos
   shared/analysis/odoo-comparison/inventory-module.md

5. Diseñar basado en análisis
   projects/{proyecto}/docs/01-analysis/database-design/inventory-schema.md

6. Desarrollar con mejores prácticas identificadas
```

---

## ✅ CHECKLIST PARA AGENTES

Antes de iniciar cualquier tarea:

- [ ] ¿Sé en qué proyecto estoy trabajando?
- [ ] ¿He leído el README del proyecto?
- [ ] ¿He consultado los inventarios correctos?
- [ ] ¿Sé si el código va en shared/ o en projects/{proyecto}/?
- [ ] ¿He revisado si Odoo tiene un módulo similar?
- [ ] ¿He documentado mi análisis previo?

Durante la tarea:

- [ ] ¿Estoy actualizando las trazas correctas?
- [ ] ¿Estoy actualizando los inventarios correctos?
- [ ] ¿Estoy siguiendo las directivas compartidas?
- [ ] ¿He documentado decisiones importantes?

Al terminar:

- [ ] ¿He actualizado las trazas del proyecto?
- [ ] ¿He actualizado los inventarios?
- [ ] ¿He documentado lo que hice?
- [ ] ¿El código está en la ubicación correcta?
- [ ] Si es componente reutilizable, ¿está en shared/components/?
- [ ] Si detecté bug global, ¿lo reporté en shared/bugs/global/?

---

## 🚫 ERRORES COMUNES A EVITAR

### Error 1: No identificar proyecto activo
```
❌ "Voy a crear la tabla de proyectos"
   (¿En qué proyecto? ¿erp-construccion? ¿erp-vidrio?)

✅ "Voy a crear la tabla de proyectos en erp-construccion"
```

### Error 2: Consultar inventarios incorrectos
```
❌ Leo DATABASE_INVENTORY.yml sin saber de qué proyecto es

✅ Leo projects/erp-construccion/orchestration/inventarios/DATABASE_INVENTORY.yml
```

### Error 3: Código en ubicación incorrecta
```
❌ Crear módulo de autenticación en projects/erp-construccion/apps/backend/
   (Es reutilizable, debería estar en shared/components/)

✅ Crear módulo de autenticación en shared/components/backend/auth-module/
```

### Error 4: No revisar Odoo antes de desarrollar
```
❌ Diseñar schema de inventario sin revisar stock de Odoo

✅ Analizar odoo/addons/stock/, documentar hallazgos, diseñar basado en mejores prácticas
```

### Error 5: Reportar bug en ubicación incorrecta
```
❌ Bug en shared/components/backend/auth-module/ reportado en projects/erp-construccion/bugs/

✅ Bug en componente compartido reportado en shared/bugs/global/
```

---

## 📊 EJEMPLO COMPLETO

### Escenario: Desarrollar módulo de autenticación

**Usuario:** "Por favor, desarrolla el módulo de autenticación para el ERP Construcción"

**Agente (pensamiento interno):**
```
1. ¿En qué proyecto?
   → erp-construccion especificado por usuario

2. ¿Es reutilizable?
   → SÍ, todos los ERPs necesitan autenticación
   → Debe ir en shared/components/

3. ¿Odoo tiene módulo similar?
   → SÍ, verificar odoo/addons/auth_*

4. Plan:
   a. Analizar módulo de auth de Odoo
   b. Documentar hallazgos
   c. Diseñar módulo propio
   d. Desarrollar en shared/components/backend/auth-module/
   e. Actualizar inventarios (compartido y local)
   f. Documentar en trazas de erp-construccion
```

**Agente (acción):**
```
✅ Proyecto activo: erp-construccion
✅ Ubicación del código: shared/components/backend/auth-module/ (reutilizable)

1. Analizando módulo de auth de Odoo...
   [Lee shared/reference/odoo/addons/auth_*/]

2. Documentando hallazgos...
   [Crea shared/analysis/odoo-comparison/auth-module.md]

3. Diseñando módulo...
   [Crea shared/analysis/domain-models/common/auth.md]

4. Desarrollando...
   [Crea shared/components/backend/auth-module/]

5. Actualizando inventarios...
   - shared/orchestration/inventarios/SHARED_COMPONENTS_INVENTORY.yml ✅
   - projects/erp-construccion/orchestration/inventarios/BACKEND_INVENTORY.yml ✅

6. Documentando en trazas...
   [Actualiza projects/erp-construccion/orchestration/trazas/TRAZA-TAREAS-BACKEND.md]

✅ Módulo de autenticación completado en shared/components/
   Disponible para todos los proyectos.
```

---

## 📚 REFERENCIAS

### Documentos relacionados

- [WORKSPACE-OVERVIEW.md](../../WORKSPACE-OVERVIEW.md) - Mapa de navegación
- [PROPUESTA-REESTRUCTURACION-MULTI-PROYECTO.md](../../PROPUESTA-REESTRUCTURACION-MULTI-PROYECTO.md) - Propuesta completa
- [POLITICAS-USO-AGENTES.md](POLITICAS-USO-AGENTES.md) - Políticas generales
- [DIRECTIVA-DOCUMENTACION-OBLIGATORIA.md](DIRECTIVA-DOCUMENTACION-OBLIGATORIA.md) - Documentación obligatoria

### Ubicaciones clave

- Proyectos: `projects/`
- Componentes compartidos: `shared/components/`
- Referencias: `shared/reference/`
- Bugs globales: `shared/bugs/global/`
- Análisis compartido: `shared/analysis/`

---

**Versión:** 1.0.0
**Fecha:** 2025-11-23
**Próxima revisión:** 2025-12-23
**Mantenido por:** Tech Lead / Architecture Team
