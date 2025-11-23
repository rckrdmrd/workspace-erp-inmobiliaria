#!/bin/bash

# =============================================================================
# Script: validate-ddl-organization.sh
# Propósito: Validar que todos los objetos DDL estén en los schemas correctos
# Uso: ./validate-ddl-organization.sh
# Salida: Reporte de validación en formato YAML
# Creado: 2025-11-09
# =============================================================================

set -e

BASE_DIR="/home/isem/workspace/workspace-gamilit/gamilit/projects/gamilit/apps/database/ddl/schemas"
OUTPUT_FILE="/tmp/ddl-validation-$(date +%Y%m%d-%H%M%S).yaml"

echo "=== VALIDACIÓN DE ORGANIZACIÓN DDL ==="
echo "Fecha: $(date)"
echo "Base directory: $BASE_DIR"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores globales
TOTAL_ISSUES=0
CRITICAL_ISSUES=0
MINOR_ISSUES=0

# =============================================================================
# 1. VALIDAR PUBLIC SCHEMA
# =============================================================================

echo "1. Validando Public Schema..."

PUBLIC_TABLES=$(find "$BASE_DIR/public/tables" -name "*.sql" 2>/dev/null | wc -l)
PUBLIC_FUNCTIONS=$(find "$BASE_DIR/public/functions" -name "*.sql" 2>/dev/null | wc -l)
PUBLIC_ENUMS=$(find "$BASE_DIR/public/enums" -name "*.sql" ! -path "*/_deprecated/*" 2>/dev/null | wc -l)
PUBLIC_VIEWS=$(find "$BASE_DIR/public/views" -name "*.sql" 2>/dev/null | wc -l)

if [ "$PUBLIC_TABLES" -gt 0 ]; then
    echo -e "${RED}✗ ERROR: Tablas encontradas en public schema${NC}"
    CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
else
    echo -e "${GREEN}✓ No hay tablas en public schema${NC}"
fi

if [ "$PUBLIC_FUNCTIONS" -gt 0 ]; then
    echo -e "${RED}✗ ERROR: Funciones encontradas en public schema${NC}"
    CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
else
    echo -e "${GREEN}✓ No hay funciones en public schema${NC}"
fi

if [ "$PUBLIC_ENUMS" -gt 0 ]; then
    echo -e "${RED}✗ ERROR: ENUMs activos encontrados en public schema${NC}"
    CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
else
    echo -e "${GREEN}✓ No hay ENUMs activos en public schema${NC}"
fi

if [ "$PUBLIC_VIEWS" -le 5 ]; then
    echo -e "${GREEN}✓ Public schema tiene $PUBLIC_VIEWS views (aceptable)${NC}"
else
    echo -e "${YELLOW}⚠ Public schema tiene $PUBLIC_VIEWS views (considerar mover a schema dedicado)${NC}"
    MINOR_ISSUES=$((MINOR_ISSUES + 1))
fi

echo ""

# =============================================================================
# 2. VALIDAR INDEXES CON SCHEMA CALIFICADO
# =============================================================================

echo "2. Validando Indexes con schema calificado..."

TOTAL_INDEXES=$(find "$BASE_DIR" -path "*/indexes/*.sql" -type f 2>/dev/null | wc -l)

# Buscar indexes sin schema.tabla en ON clause
UNQUALIFIED_INDEXES=0

while IFS= read -r file; do
    # Extraer líneas CREATE INDEX y verificar si la siguiente línea tiene schema.tabla
    if grep -q "CREATE INDEX" "$file"; then
        # Obtener línea completa del CREATE INDEX + ON
        INDEX_STATEMENT=$(grep -A1 "CREATE INDEX" "$file" | tr '\n' ' ')

        # Verificar si contiene ON schema.tabla
        if ! echo "$INDEX_STATEMENT" | grep -q "ON [a-z_]*\.[a-z_]*"; then
            echo -e "${YELLOW}⚠ Index sin schema calificado: $file${NC}"
            UNQUALIFIED_INDEXES=$((UNQUALIFIED_INDEXES + 1))
        fi
    fi
done < <(find "$BASE_DIR" -path "*/indexes/*.sql" -type f 2>/dev/null)

if [ "$UNQUALIFIED_INDEXES" -eq 0 ]; then
    echo -e "${GREEN}✓ Todos los $TOTAL_INDEXES indexes tienen schema calificado${NC}"
else
    echo -e "${YELLOW}⚠ $UNQUALIFIED_INDEXES de $TOTAL_INDEXES indexes sin schema calificado${NC}"
    MINOR_ISSUES=$((MINOR_ISSUES + UNQUALIFIED_INDEXES))
fi

echo ""

# =============================================================================
# 3. VALIDAR DISTRIBUCIÓN DE FUNCIONES
# =============================================================================

echo "3. Validando distribución de funciones..."

TOTAL_FUNCTIONS=$(find "$BASE_DIR" -path "*/functions/*.sql" ! -path "*/_deprecated/*" -type f 2>/dev/null | wc -l)

# Verificar que funciones utilitarias estén en gamilit
GAMILIT_FUNCTIONS=$(find "$BASE_DIR/gamilit/functions" -name "*.sql" 2>/dev/null | wc -l)

echo -e "${GREEN}✓ Total funciones: $TOTAL_FUNCTIONS${NC}"
echo -e "${GREEN}✓ Funciones en gamilit (utilitarias): $GAMILIT_FUNCTIONS${NC}"

# Listar funciones por schema
for schema in audit_logging gamification_system educational_content progress_tracking auth_management; do
    count=$(find "$BASE_DIR/$schema/functions" -name "*.sql" ! -path "*/_deprecated/*" 2>/dev/null | wc -l)
    if [ "$count" -gt 0 ]; then
        echo "  - $schema: $count funciones"
    fi
done

echo ""

# =============================================================================
# 4. VALIDAR RLS EN TABLAS CRÍTICAS
# =============================================================================

echo "4. Validando RLS en tablas críticas..."

CRITICAL_TABLES=("user_suspensions" "flagged_content" "user_activity_logs")
RLS_MISSING=0

for table in "${CRITICAL_TABLES[@]}"; do
    # Buscar si hay RLS policies para esta tabla
    if grep -rq "$table" "$BASE_DIR"/*/rls-policies/*.sql 2>/dev/null; then
        echo -e "${GREEN}✓ Tabla crítica '$table' tiene RLS policies${NC}"
    else
        echo -e "${RED}✗ ERROR: Tabla crítica '$table' NO tiene RLS policies${NC}"
        CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
        RLS_MISSING=$((RLS_MISSING + 1))
    fi
done

echo ""

# =============================================================================
# 5. VALIDAR TRIGGERS HUÉRFANOS
# =============================================================================

echo "5. Validando triggers huérfanos..."

TOTAL_TRIGGERS=$(find "$BASE_DIR" -path "*/triggers/*.sql" -type f 2>/dev/null | wc -l)

echo -e "${GREEN}✓ Total triggers: $TOTAL_TRIGGERS${NC}"
echo "  (Validación manual requerida para verificar que triggers tengan tablas correspondientes)"

echo ""

# =============================================================================
# 6. GENERAR REPORTE YAML
# =============================================================================

cat > "$OUTPUT_FILE" << EOF
validacion_ddl_organization:
  fecha: "$(date -I)"
  hora: "$(date +%H:%M:%S)"

  resumen:
    estado_general: "$([ $CRITICAL_ISSUES -eq 0 ] && echo "PASS" || echo "FAIL")"
    problemas_criticos: $CRITICAL_ISSUES
    problemas_menores: $MINOR_ISSUES
    total_problemas: $((CRITICAL_ISSUES + MINOR_ISSUES))

  public_schema:
    tablas: $PUBLIC_TABLES
    funciones: $PUBLIC_FUNCTIONS
    enums: $PUBLIC_ENUMS
    views: $PUBLIC_VIEWS
    estado: "$([ $PUBLIC_TABLES -eq 0 ] && [ $PUBLIC_FUNCTIONS -eq 0 ] && [ $PUBLIC_ENUMS -eq 0 ] && echo "LIMPIO" || echo "CONTAMINADO")"

  indexes:
    total: $TOTAL_INDEXES
    sin_schema_calificado: $UNQUALIFIED_INDEXES
    porcentaje_correctos: $(awk "BEGIN {printf \"%.1f\", ($TOTAL_INDEXES - $UNQUALIFIED_INDEXES) * 100.0 / $TOTAL_INDEXES}")%

  funciones:
    total: $TOTAL_FUNCTIONS
    en_gamilit: $GAMILIT_FUNCTIONS

  rls_policies:
    tablas_criticas_validadas: ${#CRITICAL_TABLES[@]}
    tablas_sin_rls: $RLS_MISSING
    cobertura: "$([ $RLS_MISSING -eq 0 ] && echo "100%" || echo "Incompleta")"

  triggers:
    total: $TOTAL_TRIGGERS

  recomendacion: "$([ $CRITICAL_ISSUES -eq 0 ] && echo "APROBAR" || echo "RECHAZAR - Corregir problemas críticos")"
EOF

echo "=== RESUMEN ==="
echo ""
echo "Problemas críticos: $CRITICAL_ISSUES"
echo "Problemas menores:  $MINOR_ISSUES"
echo "Total problemas:    $((CRITICAL_ISSUES + MINOR_ISSUES))"
echo ""

if [ $CRITICAL_ISSUES -eq 0 ]; then
    echo -e "${GREEN}✓ VALIDACIÓN EXITOSA - No hay problemas críticos${NC}"
    EXIT_CODE=0
else
    echo -e "${RED}✗ VALIDACIÓN FALLIDA - $CRITICAL_ISSUES problema(s) crítico(s)${NC}"
    EXIT_CODE=1
fi

echo ""
echo "Reporte generado: $OUTPUT_FILE"
echo ""

# Mostrar contenido del reporte
cat "$OUTPUT_FILE"

exit $EXIT_CODE
