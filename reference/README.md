# 📚 REFERENCE - Código de Referencia

**Propósito:** Esta carpeta contiene proyectos y código de referencia para análisis, comparación y mejora del desarrollo actual.

---

## 🎯 USO

### Para Architecture-Analyst
- Analizar implementaciones de referencia de Odoo y OCA
- Comparar patrones arquitectónicos
- Documentar mejores prácticas observadas
- Proponer mejoras basadas en referencias

### Para Agentes de Desarrollo
- Consultar implementaciones de funcionalidades similares
- Comparar enfoques de diseño en módulos Odoo
- Reutilizar patrones probados
- Entender mejores prácticas de desarrollo Python/Odoo

### Para Claude Code Cloud
- Acceso a código de referencia desde cualquier instancia
- Comparaciones automáticas con código actual
- Análisis de implementaciones

---

## 📂 ESTRUCTURA

```
reference/
├── README.md                     # Este archivo
├── odoo/                         # Código Odoo de referencia
│   └── README.md
├── gamilit/                      # Proyecto GAMILIT (arquitectura educativa)
│   ├── README.md
│   ├── _MAP.md                   # Mapa completo del proyecto
│   ├── backend/                  # Backend Node.js + TypeScript
│   ├── frontend/                 # Frontend React + TypeScript
│   ├── database/                 # PostgreSQL schemas y DDL
│   └── devops/                   # Scripts DevOps y validación
├── odoo-modules/                 # Módulos Odoo de referencia (futuro)
│   ├── oca-account/              # Módulos contables de OCA
│   │   ├── __manifest__.py
│   │   ├── models/
│   │   └── README.md
│   └── custom-modules/           # Módulos personalizados de ejemplo
├── python-patterns/              # Patrones Python de referencia (futuro)
│   ├── design-patterns/
│   └── best-practices/
└── integrations/                 # Integraciones de referencia (futuro)
    ├── api-examples/
    └── external-services/
```

---

## ⚠️ IMPORTANTE - Qué Versionar

### ✅ SÍ versionar (INCLUIR):
- Código fuente Python (.py)
- Archivos de manifiesto (__manifest__.py, __init__.py)
- Archivos de configuración (requirements.txt, setup.py)
- Documentación (.md files, .rst files)
- Esquemas de base de datos (.sql files, .xml files)
- Archivos de vista (.xml)
- Archivos de datos (.csv, .xml para datos)
- README y documentación

### ❌ NO versionar (IGNORADO automáticamente):
- __pycache__/
- *.pyc
- *.pyo
- .eggs/
- venv/
- env/
- .venv/
- node_modules/ (si hay frontend)
- dist/
- build/
- .next/ (si hay Next.js)
- coverage/
- *.log
- *.tmp
- *.cache
- .DS_Store

**Razón:** Solo versionamos código fuente. Las dependencias Python se pueden regenerar con `pip install -r requirements.txt`.

---

## 📋 DIRECTRICES

### Al Agregar Proyectos de Referencia

1. **Limpiar antes de agregar:**
   ```bash
   # Eliminar cache Python y virtual environments
   cd reference/nuevo-proyecto
   find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null
   find . -name "*.pyc" -delete
   find . -name "*.pyo" -delete
   rm -rf venv env .venv
   ```

2. **Verificar que está limpio:**
   ```bash
   # No debe mostrar carpetas de cache o virtual environments
   du -sh reference/nuevo-proyecto/*
   ```

3. **Agregar README del proyecto:**
   ```markdown
   # Proyecto: {nombre}

   **Fuente:** {URL o descripción}
   **Propósito:** ¿Por qué se incluye como referencia?
   **Aspectos relevantes:** ¿Qué podemos aprender?

   ## Instalación (para probar localmente)
   ```bash
   cd reference/{nombre}
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

   ## Aspectos destacables
   - Feature 1: Descripción
   - Pattern 2: Descripción
   ```

4. **Commit con mensaje descriptivo:**
   ```bash
   git add reference/nuevo-proyecto
   git commit -m "ref: agregar proyecto {nombre} como referencia para {propósito}"
   ```

---

## 🔍 VALIDACIÓN

### Verificar que reference/ está en el repo:
```bash
# Debe devolver vacío (no ignorado)
git check-ignore reference/

# Debe mostrar archivos de reference/
git ls-files reference/
```

### Verificar que __pycache__ está ignorado dentro de reference/:
```bash
# Debe devolver: reference/proyecto/__pycache__/
git check-ignore reference/proyecto/__pycache__/
```

### Verificar que venv está ignorado dentro de reference/:
```bash
# Debe devolver: reference/proyecto/venv/
git check-ignore reference/proyecto/venv/
```

### Ejecutar validación automática:
```bash
bash orchestration/scripts/validate-gitignore.sh
```

Debe mostrar:
```
✅ reference/ NO está ignorado (correcto)
✅ reference/**/__pycache__/ está ignorado (correcto)
✅ reference/**/venv/ está ignorado (correcto)
```

---

## 📊 TAMAÑO RECOMENDADO

**Máximo recomendado:** ~100MB por proyecto (solo código fuente)

Si un proyecto excede este tamaño:
- Considerar incluir solo las partes relevantes
- Crear subcarpeta con implementaciones específicas
- Documentar ubicación del proyecto completo (URL)

---

## 🎓 EJEMPLOS DE USO

### Ejemplo 1: Analizar Módulo Contable de OCA

```markdown
**Tarea:** Implementar gestión de ejercicios fiscales

**Agente:** Architecture-Analyst

**Proceso:**
1. Revisar `reference/odoo-modules/oca-account/account_fiscal_year/`
2. Analizar modelos de datos y vistas
3. Comparar con implementación actual
4. Documentar mejoras en `docs/adr/ADR-XXX.md`
```

### Ejemplo 2: Implementar Feature Similar

```markdown
**Tarea:** Implementar templates de asientos contables

**Agente:** Backend-Agent

**Proceso:**
1. Consultar `reference/odoo-modules/oca-account/account_move_template/`
2. Revisar modelos de datos y lógica de negocio
3. Adaptar patrones al proyecto actual
4. Implementar con mejores prácticas observadas
```

### Ejemplo 3: Comparar Arquitectura

```markdown
**Tarea:** Refactorizar estructura de módulos Odoo

**Agente:** Architecture-Analyst

**Proceso:**
1. Analizar `reference/odoo-modules/best-practices/`
2. Comparar con estructura actual
3. Proponer mejoras arquitectónicas
4. Crear plan de refactorización
```

---

## 🎯 CASOS DE USO ESPECÍFICOS

### Proyecto GAMILIT (Referencia Arquitectónica)

**Relevancia:** Sistema educativo gamificado con arquitectura moderna y prácticas recomendadas

**Aspectos destacables:**
- Monorepo TypeScript con backend (Node.js/Express) y frontend (React/Vite)
- Arquitectura de base de datos multi-schema (9 schemas, 44 tablas)
- Sistema de constantes SSOT (Single Source of Truth)
- Feature-Sliced Design en frontend
- Path aliases consistentes
- Scripts de validación y sincronización automática

**Aplicable para:**
- Patrones de arquitectura de software
- Estructura de monorepo
- Sincronización Backend ↔ Frontend
- Organización de base de datos PostgreSQL
- Testing y validación automática

**Ver:** `reference/gamilit/README.md` y `reference/gamilit/_MAP.md`

---

### Proyectos Odoo de Referencia

```markdown
Tipos de proyectos a incluir:
- Módulos OCA (Odoo Community Association)
- Módulos core de Odoo con implementaciones ejemplares
- Módulos personalizados con patrones útiles
- Integraciones con servicios externos
- Implementaciones de reportes complejos
```

### Patrones Python

```markdown
Tipos de patrones a incluir:
- Design patterns (Singleton, Factory, etc.)
- Patrones de testing
- Patrones de API design
- Patrones de manejo de datos
```

---

## 📚 REFERENCIAS

- [DIRECTIVA-GESTION-BACKUPS-GITIGNORE.md](../orchestration/directivas/DIRECTIVA-GESTION-BACKUPS-GITIGNORE.md) - Sección 1.5
- [PROMPT-ARCHITECTURE-ANALYST.md](../orchestration/prompts/PROMPT-ARCHITECTURE-ANALYST.md)
- `.gitignore` - Sección REFERENCE

---

## ✅ CHECKLIST ANTES DE COMMIT

Antes de agregar un nuevo proyecto de referencia:

- [ ] Eliminar __pycache__/, *.pyc, *.pyo
- [ ] Eliminar venv/, env/, .venv/
- [ ] Eliminar node_modules/ (si aplica)
- [ ] Verificar que solo hay código fuente
- [ ] Agregar README del proyecto explicando propósito
- [ ] Verificar tamaño total (< 100MB recomendado)
- [ ] Documentar aspectos relevantes del proyecto
- [ ] Commit con mensaje descriptivo

---

## 🔗 RECURSOS ÚTILES

### Repositorios OCA

- [OCA Account Financial Tools](https://github.com/OCA/account-financial-tools)
- [OCA Account Invoicing](https://github.com/OCA/account-invoicing)
- [OCA Server Tools](https://github.com/OCA/server-tools)
- [OCA Web Tools](https://github.com/OCA/web)

### Documentación Odoo

- [Odoo Developer Documentation](https://www.odoo.com/documentation/master/developer.html)
- [Odoo ORM Guide](https://www.odoo.com/documentation/master/developer/reference/backend/orm.html)

---

**Última actualización:** 2025-11-23
**Mantenido por:** Architecture-Analyst, Workspace-Manager
**Directiva:** DIRECTIVA-GESTION-BACKUPS-GITIGNORE.md sección 1.5
