#!/bin/bash

# =============================================================================
# SCRIPT DE MIGRACIÓN A ESTRUCTURA MULTI-PROYECTO
# =============================================================================
# Versión: 1.0.0
# Fecha: 2025-11-23
# Descripción: Migra workspace actual a estructura multi-proyecto
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKUP_DIR="${WORKSPACE_ROOT}_backup_$(date +%Y%m%d_%H%M%S)"

# =============================================================================
# FUNCIONES
# =============================================================================

log_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

log_success() {
    echo -e "${GREEN}✓ ${NC}$1"
}

log_warning() {
    echo -e "${YELLOW}⚠ ${NC}$1"
}

log_error() {
    echo -e "${RED}✗ ${NC}$1"
}

print_header() {
    echo ""
    echo "============================================================================="
    echo "$1"
    echo "============================================================================="
    echo ""
}

# =============================================================================
# VALIDACIONES PRE-MIGRACIÓN
# =============================================================================

validate_workspace() {
    print_header "VALIDANDO WORKSPACE ACTUAL"

    log_info "Directorio actual: $WORKSPACE_ROOT"

    # Validar que estamos en el workspace correcto
    if [ ! -d "$WORKSPACE_ROOT/orchestration" ]; then
        log_error "No se encontró carpeta 'orchestration'. ¿Estás en el workspace correcto?"
        exit 1
    fi

    if [ ! -d "$WORKSPACE_ROOT/reference" ]; then
        log_error "No se encontró carpeta 'reference'. ¿Estás en el workspace correcto?"
        exit 1
    fi

    log_success "Workspace válido"
}

create_backup() {
    print_header "CREANDO BACKUP"

    log_info "Creando backup en: $BACKUP_DIR"

    # Crear directorio de backup
    mkdir -p "$BACKUP_DIR"

    # Copiar contenido (excepto .git para no duplicar)
    rsync -av --exclude='.git' "$WORKSPACE_ROOT/" "$BACKUP_DIR/"

    log_success "Backup creado exitosamente"
    log_warning "Si algo sale mal, puedes restaurar desde: $BACKUP_DIR"
}

# =============================================================================
# MIGRACIÓN
# =============================================================================

create_shared_structure() {
    print_header "CREANDO ESTRUCTURA SHARED/"

    cd "$WORKSPACE_ROOT"

    # Crear estructura shared
    log_info "Creando carpetas shared/..."
    mkdir -p shared/{reference,orchestration,analysis,bugs,components,docs}

    # Crear subcarpetas de analysis
    mkdir -p shared/analysis/{domain-models/{common,financial,inventory,purchasing,production,crm},odoo-comparison,architecture}

    # Crear subcarpetas de bugs
    mkdir -p shared/bugs/{global,by-component}

    # Crear subcarpetas de components
    mkdir -p shared/components/{database/{common-schemas,common-functions},backend/{auth-module,common-entities,common-services,utils},frontend/{ui-kit,common-hooks,common-stores}}

    # Crear subcarpetas de docs
    mkdir -p shared/docs/{onboarding,standards,guides}

    log_success "Estructura shared/ creada"
}

move_shared_content() {
    print_header "MOVIENDO CONTENIDO A SHARED/"

    cd "$WORKSPACE_ROOT"

    # Mover reference
    if [ -d "reference" ]; then
        log_info "Moviendo reference/ → shared/reference/"
        mv reference/* shared/reference/ 2>/dev/null || true
        rmdir reference 2>/dev/null || true
        log_success "Reference movido"
    fi

    # Mover orchestration
    if [ -d "orchestration" ]; then
        log_info "Moviendo orchestration/ → shared/orchestration/"
        mv orchestration/* shared/orchestration/ 2>/dev/null || true
        rmdir orchestration 2>/dev/null || true
        log_success "Orchestration movido"
    fi
}

create_projects_structure() {
    print_header "CREANDO ESTRUCTURA PROJECTS/"

    cd "$WORKSPACE_ROOT"

    # Crear carpeta projects
    mkdir -p projects

    # Crear estructura para cada proyecto
    for project in erp-generic erp-construccion erp-vidrio-templado erp-mecanicas-diesel; do
        log_info "Creando estructura para $project..."

        # Crear carpetas principales
        mkdir -p "projects/$project"/{docs,apps,orchestration,bugs}

        # Crear subcarpetas de docs
        mkdir -p "projects/$project/docs"/{00-overview,01-analysis/{requirements,domain-model,database-design,odoo-comparison},02-modules,03-architecture/{adr,database-schema,api-design},04-development}

        # Crear subcarpetas de apps
        mkdir -p "projects/$project/apps"/{database/{ddl,seeds,migrations,scripts},backend,frontend/{web,mobile}}

        # Crear subcarpetas de orchestration
        mkdir -p "projects/$project/orchestration"/{trazas,inventarios,estados,reportes}

        log_success "$project creado"
    done
}

migrate_construccion_content() {
    print_header "MIGRANDO CONTENIDO DE ERP CONSTRUCCIÓN"

    cd "$WORKSPACE_ROOT"

    # Mover docs
    if [ -d "docs" ]; then
        log_info "Moviendo docs/ → projects/erp-construccion/docs/"

        # Crear carpeta temporal
        mkdir -p temp_docs
        mv docs/* temp_docs/ 2>/dev/null || true

        # Mover a estructura nueva
        mv temp_docs/* "projects/erp-construccion/docs/" 2>/dev/null || true

        # Limpiar
        rmdir temp_docs 2>/dev/null || true
        rmdir docs 2>/dev/null || true

        log_success "Docs migrados"
    fi

    # Mover apps
    if [ -d "apps" ]; then
        log_info "Moviendo apps/ → projects/erp-construccion/apps/"

        # Crear carpeta temporal
        mkdir -p temp_apps
        mv apps/* temp_apps/ 2>/dev/null || true

        # Mover a estructura nueva
        mv temp_apps/* "projects/erp-construccion/apps/" 2>/dev/null || true

        # Limpiar
        rmdir temp_apps 2>/dev/null || true
        rmdir apps 2>/dev/null || true

        log_success "Apps migrados"
    fi
}

create_readme_files() {
    print_header "CREANDO ARCHIVOS README"

    cd "$WORKSPACE_ROOT"

    # README.md para cada proyecto
    log_info "Creando READMEs de proyectos..."

    # ERP Genérico
    cat > "projects/erp-generic/README.md" << 'EOF'
# ERP GENÉRICO

**Tipo:** ERP Base
**Estado:** 📋 En planificación
**Versión:** 0.1.0

## Descripción

ERP genérico que sirve como base para todos los demás ERPs. Contiene módulos comunes reutilizables.

## Módulos Base

- Autenticación y autorización
- Gestión de usuarios y roles
- Gestión de empresas/organizaciones
- Catálogos maestros
- Sistema de reportes
- Módulo financiero básico
- Módulo de inventario básico
- Módulo de compras básico
- CRM básico

## Documentación

Ver `docs/00-overview/` para más información.
EOF

    # ERP Construcción
    cat > "projects/erp-construccion/README.md" << 'EOF'
# ERP CONSTRUCCIÓN

**Tipo:** ERP Especializado
**Giro:** Empresas de construcción e INFONAVIT
**Estado:** 🚧 En desarrollo
**Versión:** 0.1.0
**Base:** ERP Genérico (60-70% de código reutilizado)

## Descripción

ERP especializado para empresas de construcción con módulos específicos para gestión de proyectos, control de obra, presupuestos, y cumplimiento normativo INFONAVIT.

## Módulos Específicos

- Gestión de proyectos de construcción
- Presupuestos y costos
- Control de obra y avances
- INFONAVIT y cumplimiento normativo
- Gestión de activos y maquinaria
- Estimaciones y facturación
- Gestión documental
- HSE (Seguridad e higiene)

## Documentación

Ver `docs/00-overview/MVP-APP.md` para el plan completo del MVP.
EOF

    # ERP Vidrio
    cat > "projects/erp-vidrio-templado/README.md" << 'EOF'
# ERP VIDRIO TEMPLADO

**Tipo:** ERP Especializado
**Giro:** Producción de vidrio templado
**Estado:** 📋 En planificación
**Versión:** 0.1.0
**Base:** ERP Genérico (60-70% de código reutilizado)

## Descripción

ERP especializado para empresas de producción de vidrio templado con módulos para gestión de producción, control de calidad, inventario de materia prima, y órdenes de producción.

## Módulos Específicos

- Órdenes de producción
- Control de calidad (testing de vidrio)
- Inventario de materia prima
- Gestión de hornos/maquinaria
- Trazabilidad de lotes
- Cotizaciones y ventas

## Documentación

Ver `docs/00-overview/` para más información.
EOF

    # ERP Mecánicas
    cat > "projects/erp-mecanicas-diesel/README.md" << 'EOF'
# ERP MECÁNICAS DIESEL

**Tipo:** ERP Especializado
**Giro:** Laboratorios de mecánica diesel
**Estado:** 📋 En planificación
**Versión:** 0.1.0
**Base:** ERP Genérico (50-60% de código reutilizado)

## Descripción

ERP especializado para laboratorios de mecánica diesel con módulos para diagnósticos, reparaciones, gestión de refacciones, y mantenimiento.

## Módulos Específicos

- Diagnósticos y pruebas
- Órdenes de reparación
- Inventario de refacciones
- Gestión de vehículos en servicio
- Cotizaciones y facturación
- Historial de servicios

## Documentación

Ver `docs/00-overview/` para más información.
EOF

    log_success "READMEs creados"

    # README de shared/bugs
    log_info "Creando README de shared/bugs..."
    cat > "shared/bugs/README.md" << 'EOF'
# SISTEMA DE GESTIÓN DE BUGS

## Estructura

- `global/` - Bugs que afectan a componentes compartidos
- `by-component/` - Bugs organizados por componente

## Workflow

### Bug Local (específico de un proyecto)

Reportar en: `projects/{proyecto}/bugs/BUGS-ACTIVOS.md`

### Bug Global (afecta componente compartido)

1. Reportar en: `shared/bugs/global/BUGS-ACTIVOS.md`
2. Identificar proyectos afectados
3. Priorizar según impacto
4. Corregir en `shared/components/`
5. Actualizar todos los proyectos afectados
6. Validar en todos los proyectos
7. Cerrar bug y documentar

## Template de Bug Global

```yaml
## BUG-GLOBAL-XXX: Título del bug
**Componente:** shared/components/...
**Afecta a:**
  - proyecto-1 ✅
  - proyecto-2 ❌
**Prioridad:** 🔴 Alta | 🟡 Media | 🟢 Baja
**Estado:** 🔧 En corrección | 🧪 En testing | ✅ Resuelto
**Detectado en:** proyecto-x
**Fecha:** YYYY-MM-DD
**Asignado a:** Agente-X

### Descripción
...

### Impacto
...

### Plan de corrección
1. ...
```
EOF

    log_success "README de bugs creado"
}

create_initial_files() {
    print_header "CREANDO ARCHIVOS INICIALES"

    cd "$WORKSPACE_ROOT"

    # Crear BUGS-ACTIVOS.md en shared/bugs/global
    log_info "Creando archivos de bugs globales..."
    cat > "shared/bugs/global/BUGS-ACTIVOS.md" << 'EOF'
# BUGS GLOBALES ACTIVOS

**Última actualización:** 2025-11-23

---

## 🔴 PRIORIDAD ALTA

_No hay bugs de prioridad alta actualmente_

---

## 🟡 PRIORIDAD MEDIA

_No hay bugs de prioridad media actualmente_

---

## 🟢 PRIORIDAD BAJA

_No hay bugs de prioridad baja actualmente_

---

## 📝 NOTAS

Los bugs globales afectan a componentes compartidos en `shared/components/`.
Para bugs específicos de un proyecto, usar `projects/{proyecto}/bugs/`.
EOF

    cat > "shared/bugs/global/BUGS-RESUELTOS.md" << 'EOF'
# BUGS GLOBALES RESUELTOS

**Última actualización:** 2025-11-23

---

_No hay bugs resueltos aún_

---
EOF

    log_success "Archivos de bugs creados"

    # Crear PROJECT-STATUS.md para cada proyecto
    log_info "Creando archivos PROJECT-STATUS.md..."

    for project in erp-generic erp-construccion erp-vidrio-templado erp-mecanicas-diesel; do
        if [ "$project" = "erp-construccion" ]; then
            status="🚧 En desarrollo"
            progress="35%"
        else
            status="📋 En planificación"
            progress="0%"
        fi

        cat > "projects/$project/PROJECT-STATUS.md" << EOF
# ESTADO DEL PROYECTO

**Proyecto:** $project
**Estado:** $status
**Progreso:** $progress
**Última actualización:** $(date +%Y-%m-%d)

---

## 📊 RESUMEN

- **Fase actual:** Análisis y planificación
- **Módulos completados:** 0
- **Módulos en desarrollo:** 0
- **Módulos pendientes:** TBD

---

## 🎯 PRÓXIMOS PASOS

1. Completar análisis de requerimientos
2. Modelado de dominio
3. Comparación con Odoo
4. Diseño de base de datos
5. Inicio de desarrollo

---
EOF
    done

    log_success "PROJECT-STATUS.md creados"
}

update_gitignore() {
    print_header "ACTUALIZANDO .gitignore"

    cd "$WORKSPACE_ROOT"

    log_info "Agregando entradas a .gitignore..."

    cat >> .gitignore << 'EOF'

# =============================================================================
# MULTI-PROJECT WORKSPACE
# =============================================================================

# Backups
*_backup_*/

# Temporary files
temp_*/
*.tmp

# Project-specific node_modules
projects/*/apps/backend/node_modules/
projects/*/apps/frontend/web/node_modules/
projects/*/apps/frontend/mobile/node_modules/

# Project-specific build outputs
projects/*/apps/backend/dist/
projects/*/apps/frontend/web/dist/
projects/*/apps/frontend/mobile/dist/

# Environment files
projects/*/apps/backend/.env
projects/*/apps/frontend/web/.env
projects/*/apps/frontend/mobile/.env

# Database dumps
projects/*/apps/database/*.dump
projects/*/apps/database/*.sql.gz

EOF

    log_success ".gitignore actualizado"
}

create_validation_script() {
    print_header "CREANDO SCRIPT DE VALIDACIÓN"

    cd "$WORKSPACE_ROOT"

    log_info "Creando tools/validation/validate-structure.sh..."

    cat > "tools/validation/validate-structure.sh" << 'EOFSCRIPT'
#!/bin/bash

# Script de validación de estructura multi-proyecto

WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$WORKSPACE_ROOT"

echo "🔍 Validando estructura del workspace..."
echo ""

errors=0

# Validar shared/
echo "Validando shared/..."
for dir in reference orchestration analysis bugs components docs; do
    if [ -d "shared/$dir" ]; then
        echo "  ✓ shared/$dir"
    else
        echo "  ✗ shared/$dir NO EXISTE"
        ((errors++))
    fi
done

# Validar projects/
echo ""
echo "Validando projects/..."
for project in erp-generic erp-construccion erp-vidrio-templado erp-mecanicas-diesel; do
    if [ -d "projects/$project" ]; then
        echo "  ✓ projects/$project"

        # Validar subcarpetas
        for subdir in docs apps orchestration bugs; do
            if [ -d "projects/$project/$subdir" ]; then
                echo "    ✓ $subdir/"
            else
                echo "    ✗ $subdir/ NO EXISTE"
                ((errors++))
            fi
        done
    else
        echo "  ✗ projects/$project NO EXISTE"
        ((errors++))
    fi
done

# Validar tools/
echo ""
echo "Validando tools/..."
for dir in scaffolding migration validation; do
    if [ -d "tools/$dir" ]; then
        echo "  ✓ tools/$dir"
    else
        echo "  ✗ tools/$dir NO EXISTE"
        ((errors++))
    fi
done

echo ""
if [ $errors -eq 0 ]; then
    echo "✅ Validación exitosa - Estructura completa"
    exit 0
else
    echo "❌ Validación fallida - $errors errores encontrados"
    exit 1
fi
EOFSCRIPT

    chmod +x "tools/validation/validate-structure.sh"

    log_success "Script de validación creado"
}

# =============================================================================
# SCRIPT PRINCIPAL
# =============================================================================

main() {
    print_header "MIGRACIÓN A ESTRUCTURA MULTI-PROYECTO"

    echo "Este script migrará el workspace actual a la nueva estructura multi-proyecto."
    echo ""
    echo "Workspace: $WORKSPACE_ROOT"
    echo "Backup: $BACKUP_DIR"
    echo ""
    read -p "¿Continuar? (s/N): " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        log_warning "Migración cancelada"
        exit 0
    fi

    # Ejecutar migración
    validate_workspace
    create_backup
    create_shared_structure
    move_shared_content
    create_projects_structure
    migrate_construccion_content
    create_readme_files
    create_initial_files
    update_gitignore
    create_validation_script

    # Validar resultado
    print_header "VALIDANDO RESULTADO"
    bash "$WORKSPACE_ROOT/tools/validation/validate-structure.sh"

    # Resumen
    print_header "MIGRACIÓN COMPLETADA"

    log_success "Migración completada exitosamente"
    echo ""
    echo "📁 Estructura nueva:"
    echo "  - shared/          → Componentes compartidos"
    echo "  - projects/        → Proyectos ERP individuales"
    echo "  - tools/           → Scripts de utilidad"
    echo ""
    echo "📦 Backup guardado en:"
    echo "  $BACKUP_DIR"
    echo ""
    echo "📋 Próximos pasos:"
    echo "  1. Revisar estructura: tree -L 2"
    echo "  2. Revisar README: cat PROPUESTA-REESTRUCTURACION-MULTI-PROYECTO.md"
    echo "  3. Commit de cambios: git add . && git commit -m 'chore: migrate to multi-project structure'"
    echo ""
}

# Ejecutar
main
