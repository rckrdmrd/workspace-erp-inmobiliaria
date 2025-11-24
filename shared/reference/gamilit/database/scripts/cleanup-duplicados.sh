#!/bin/bash
# ==============================================================================
# Script: cleanup-duplicados.sh
# Propósito: Eliminar duplicados detectados en análisis de dependencias
# Generado: 2025-11-07
# Autor: NEXUS-DATABASE-AVANZADO
# Documentación: /gamilit/orchestration/05-validaciones/database/ANALISIS-DEPENDENCIAS-DUPLICADOS-2025-11-07.md
# ==============================================================================

set -e  # Exit on error
set -u  # Exit on undefined variable

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
BACKUP_DIR="$PROJECT_ROOT/apps/database/backups/duplicados/2025-11-07"
DDL_DIR="$PROJECT_ROOT/apps/database/ddl"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  CLEANUP DE DUPLICADOS - DATABASE${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# ==============================================================================
# PASO 0: Verificar ubicación
# ==============================================================================
echo -e "${YELLOW}📍 Verificando ubicación...${NC}"
if [ ! -d "$PROJECT_ROOT/apps/database" ]; then
    echo -e "${RED}❌ Error: No se encuentra el directorio de database${NC}"
    echo -e "${RED}   Ejecutar desde: /gamilit/apps/database/scripts/${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Ubicación correcta${NC}"
echo ""

# ==============================================================================
# PASO 1: Crear estructura de backups
# ==============================================================================
echo -e "${YELLOW}📦 PASO 1: Creando estructura de backups...${NC}"

mkdir -p "$BACKUP_DIR"

cat > "$BACKUP_DIR/README.md" << 'EOF'
# Backups de Archivos Duplicados - 2025-11-07

## Razón del Backup
Archivos duplicados detectados por análisis de dependencias.
Estos archivos fueron eliminados tras confirmar que no tienen referencias activas.

## Archivos en este backup
1. `auth_get_current_user_id.sql` - Duplicado de gamilit/functions/02-get_current_user_id.sql (0 referencias)
2. `public_trg_feature_flags_updated_at.sql` - Duplicado en schema incorrecto
3. `public_trg_system_settings_updated_at.sql` - Duplicado en schema incorrecto

## Análisis Completo
Ver: `/gamilit/orchestration/05-validaciones/database/ANALISIS-DEPENDENCIAS-DUPLICADOS-2025-11-07.md`

## Versiones Canónicas (MANTENER)
1. `gamilit/functions/02-get_current_user_id.sql` - 73 referencias en DDL
2. `system_configuration/triggers/29-trg_feature_flags_updated_at.sql` - Ubicación correcta
3. `system_configuration/triggers/30-trg_system_settings_updated_at.sql` - Ubicación correcta

## Restauración (solo si es necesario)
```bash
# Restaurar función (NO RECOMENDADO - 0 referencias)
cp auth_get_current_user_id.sql ../../ddl/schemas/auth/functions/get_current_user_id.sql

# Restaurar triggers (NO RECOMENDADO - schema incorrecto)
cp public_trg_feature_flags_updated_at.sql ../../ddl/schemas/public/triggers/29-trg_feature_flags_updated_at.sql
cp public_trg_system_settings_updated_at.sql ../../ddl/schemas/public/triggers/30-trg_system_settings_updated_at.sql
```

**IMPORTANTE:** Los archivos eliminados NO tienen referencias activas o están en ubicación incorrecta.
La restauración solo debe hacerse si se detecta un error específico.

## Timestamp
- **Fecha backup:** 2025-11-07T18:45:00Z
- **Análisis basado en:** 73 referencias medidas en DDL, Backend, Frontend y Docs
- **Decisión:** Data-driven
EOF

echo -e "${GREEN}✅ Estructura de backups creada${NC}"
echo -e "   Ubicación: $BACKUP_DIR"
echo ""

# ==============================================================================
# PASO 2: Realizar backups
# ==============================================================================
echo -e "${YELLOW}💾 PASO 2: Creando backups de duplicados...${NC}"

DUPLICADOS=(
    "schemas/auth/functions/get_current_user_id.sql:auth_get_current_user_id.sql"
    "schemas/public/triggers/29-trg_feature_flags_updated_at.sql:public_trg_feature_flags_updated_at.sql"
    "schemas/public/triggers/30-trg_system_settings_updated_at.sql:public_trg_system_settings_updated_at.sql"
)

BACKUP_COUNT=0
for DUP in "${DUPLICADOS[@]}"; do
    SOURCE_PATH="${DUP%%:*}"
    BACKUP_NAME="${DUP##*:}"
    FULL_PATH="$DDL_DIR/$SOURCE_PATH"

    if [ -f "$FULL_PATH" ]; then
        cp "$FULL_PATH" "$BACKUP_DIR/$BACKUP_NAME"
        echo -e "${GREEN}   ✅ Backup: $BACKUP_NAME${NC}"
        BACKUP_COUNT=$((BACKUP_COUNT + 1))
    else
        echo -e "${YELLOW}   ⚠️  No encontrado: $SOURCE_PATH (posiblemente ya eliminado)${NC}"
    fi
done

echo -e "${GREEN}✅ Backups completados: $BACKUP_COUNT archivos${NC}"
echo ""

# ==============================================================================
# PASO 3: Verificar estado antes de eliminar
# ==============================================================================
echo -e "${YELLOW}🔍 PASO 3: Verificando estado ANTES de eliminar...${NC}"

# Contar referencias actuales
AUTH_REFS_BEFORE=$(grep -r "auth\.get_current_user_id" "$DDL_DIR" --include="*.sql" 2>/dev/null | wc -l || echo "0")
GAMILIT_REFS_BEFORE=$(grep -r "gamilit\.get_current_user_id" "$DDL_DIR" --include="*.sql" 2>/dev/null | wc -l || echo "0")

echo -e "   Referencias auth.get_current_user_id: $AUTH_REFS_BEFORE"
echo -e "   Referencias gamilit.get_current_user_id: $GAMILIT_REFS_BEFORE"

# Contar archivos de triggers
FEATURE_FLAGS_COUNT=$(find "$DDL_DIR" -name "*trg_feature_flags_updated_at*" 2>/dev/null | wc -l || echo "0")
SYSTEM_SETTINGS_COUNT=$(find "$DDL_DIR" -name "*trg_system_settings_updated_at*" 2>/dev/null | wc -l || echo "0")

echo -e "   Archivos trg_feature_flags_updated_at: $FEATURE_FLAGS_COUNT"
echo -e "   Archivos trg_system_settings_updated_at: $SYSTEM_SETTINGS_COUNT"
echo ""

# ==============================================================================
# PASO 4: Eliminar duplicados
# ==============================================================================
echo -e "${YELLOW}🗑️  PASO 4: Eliminando duplicados...${NC}"

DELETED_COUNT=0
for DUP in "${DUPLICADOS[@]}"; do
    SOURCE_PATH="${DUP%%:*}"
    FULL_PATH="$DDL_DIR/$SOURCE_PATH"

    if [ -f "$FULL_PATH" ]; then
        rm "$FULL_PATH"
        echo -e "${GREEN}   ✅ Eliminado: $SOURCE_PATH${NC}"
        DELETED_COUNT=$((DELETED_COUNT + 1))
    else
        echo -e "${YELLOW}   ⚠️  Ya eliminado: $SOURCE_PATH${NC}"
    fi
done

echo -e "${GREEN}✅ Duplicados eliminados: $DELETED_COUNT archivos${NC}"
echo ""

# ==============================================================================
# PASO 5: Verificar integridad POST-eliminación
# ==============================================================================
echo -e "${YELLOW}✅ PASO 5: Verificando integridad POST-eliminación...${NC}"

# Verificar referencias
AUTH_REFS_AFTER=$(grep -r "auth\.get_current_user_id" "$DDL_DIR" --include="*.sql" 2>/dev/null | wc -l || echo "0")
GAMILIT_REFS_AFTER=$(grep -r "gamilit\.get_current_user_id" "$DDL_DIR" --include="*.sql" 2>/dev/null | wc -l || echo "0")

echo -e "   Referencias auth.get_current_user_id: $AUTH_REFS_AFTER (esperado: 0)"
echo -e "   Referencias gamilit.get_current_user_id: $GAMILIT_REFS_AFTER (esperado: 73)"

# Verificar archivos de triggers
FEATURE_FLAGS_AFTER=$(find "$DDL_DIR" -name "*trg_feature_flags_updated_at*" 2>/dev/null | wc -l || echo "0")
SYSTEM_SETTINGS_AFTER=$(find "$DDL_DIR" -name "*trg_system_settings_updated_at*" 2>/dev/null | wc -l || echo "0")

echo -e "   Archivos trg_feature_flags_updated_at: $FEATURE_FLAGS_AFTER (esperado: 1)"
echo -e "   Archivos trg_system_settings_updated_at: $SYSTEM_SETTINGS_AFTER (esperado: 1)"
echo ""

# ==============================================================================
# PASO 6: Validación de resultados
# ==============================================================================
echo -e "${YELLOW}🎯 PASO 6: Validando resultados...${NC}"

ERRORS=0

# Validar función
if [ "$AUTH_REFS_AFTER" -ne 0 ]; then
    echo -e "${RED}   ❌ FALLO: auth.get_current_user_id tiene $AUTH_REFS_AFTER referencias (esperado: 0)${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}   ✅ auth.get_current_user_id: 0 referencias${NC}"
fi

if [ "$GAMILIT_REFS_AFTER" -eq 73 ]; then
    echo -e "${GREEN}   ✅ gamilit.get_current_user_id: 73 referencias${NC}"
elif [ "$GAMILIT_REFS_AFTER" -gt 70 ]; then
    echo -e "${YELLOW}   ⚠️  gamilit.get_current_user_id: $GAMILIT_REFS_AFTER referencias (esperado: 73, aceptable)${NC}"
else
    echo -e "${RED}   ❌ FALLO: gamilit.get_current_user_id tiene $GAMILIT_REFS_AFTER referencias (esperado: 73)${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Validar triggers
if [ "$FEATURE_FLAGS_AFTER" -eq 1 ]; then
    echo -e "${GREEN}   ✅ trg_feature_flags_updated_at: 1 archivo${NC}"
else
    echo -e "${RED}   ❌ FALLO: trg_feature_flags_updated_at tiene $FEATURE_FLAGS_AFTER archivos (esperado: 1)${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ "$SYSTEM_SETTINGS_AFTER" -eq 1 ]; then
    echo -e "${GREEN}   ✅ trg_system_settings_updated_at: 1 archivo${NC}"
else
    echo -e "${RED}   ❌ FALLO: trg_system_settings_updated_at tiene $SYSTEM_SETTINGS_AFTER archivos (esperado: 1)${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# ==============================================================================
# PASO 7: Listar archivos preservados
# ==============================================================================
echo -e "${YELLOW}📋 PASO 7: Verificando archivos preservados...${NC}"

CANONICOS=(
    "schemas/gamilit/functions/02-get_current_user_id.sql:gamilit.get_current_user_id()"
    "schemas/system_configuration/triggers/29-trg_feature_flags_updated_at.sql:trg_feature_flags_updated_at"
    "schemas/system_configuration/triggers/30-trg_system_settings_updated_at.sql:trg_system_settings_updated_at"
)

for CANONICO in "${CANONICOS[@]}"; do
    FILE_PATH="${CANONICO%%:*}"
    FUNC_NAME="${CANONICO##*:}"
    FULL_PATH="$DDL_DIR/$FILE_PATH"

    if [ -f "$FULL_PATH" ]; then
        echo -e "${GREEN}   ✅ $FUNC_NAME${NC}"
        echo -e "      $FILE_PATH"
    else
        echo -e "${RED}   ❌ FALLO: No se encuentra $FUNC_NAME${NC}"
        echo -e "${RED}      $FILE_PATH${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""

# ==============================================================================
# RESUMEN FINAL
# ==============================================================================
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  RESUMEN FINAL${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

echo -e "📊 Estadísticas:"
echo -e "   - Archivos respaldados: $BACKUP_COUNT"
echo -e "   - Archivos eliminados: $DELETED_COUNT"
echo -e "   - Archivos preservados: 3"
echo -e "   - Errores detectados: $ERRORS"
echo ""

echo -e "📁 Backups guardados en:"
echo -e "   $BACKUP_DIR"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 PROCESO COMPLETADO EXITOSAMENTE${NC}"
    echo -e "${GREEN}✅ 0 duplicados restantes${NC}"
    echo -e "${GREEN}✅ Integridad verificada${NC}"
    echo -e ""
    echo -e "${BLUE}📚 Ver análisis completo:${NC}"
    echo -e "   orchestration/05-validaciones/database/ANALISIS-DEPENDENCIAS-DUPLICADOS-2025-11-07.md"
    exit 0
else
    echo -e "${RED}❌ PROCESO COMPLETADO CON ERRORES${NC}"
    echo -e "${RED}   Errores encontrados: $ERRORS${NC}"
    echo -e ""
    echo -e "${YELLOW}⚠️  Acciones recomendadas:${NC}"
    echo -e "   1. Revisar archivos preservados"
    echo -e "   2. Verificar backups en: $BACKUP_DIR"
    echo -e "   3. Consultar análisis: orchestration/05-validaciones/database/ANALISIS-DEPENDENCIAS-DUPLICADOS-2025-11-07.md"
    exit 1
fi
