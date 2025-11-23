#!/bin/bash
#
# Script de verificación de unificación PROD ↔ DEV
# y preparación para carga inicial limpia
#

echo "========================================================================"
echo "VERIFICACIÓN DE UNIFICACIÓN PROD ↔ DEV"
echo "========================================================================"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

total_checks=0
passed_checks=0
failed_checks=0

# Función para comparar archivos
compare_files() {
    local prod_file=$1
    local dev_file=$2
    local name=$3

    total_checks=$((total_checks + 1))

    if [ ! -f "$prod_file" ]; then
        echo -e "${RED}✗${NC} $name - PROD no existe: $prod_file"
        failed_checks=$((failed_checks + 1))
        return 1
    fi

    if [ ! -f "$dev_file" ]; then
        echo -e "${RED}✗${NC} $name - DEV no existe: $dev_file"
        failed_checks=$((failed_checks + 1))
        return 1
    fi

    if diff -q "$prod_file" "$dev_file" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $name - Sincronizado"
        passed_checks=$((passed_checks + 1))
        return 0
    else
        echo -e "${RED}✗${NC} $name - DESINCRONIZADO"
        failed_checks=$((failed_checks + 1))
        return 1
    fi
}

echo "1. VERIFICANDO SEEDS EDUCATIONAL_CONTENT"
echo "------------------------------------------------------------------------"

# Módulos
compare_files \
    "seeds/prod/educational_content/01-modules.sql" \
    "seeds/dev/educational_content/01-modules.sql" \
    "Modules"

# Ejercicios por módulo
for i in {1..5}; do
    module_num=$(printf "%02d" $((i + 1)))
    compare_files \
        "seeds/prod/educational_content/${module_num}-exercises-module${i}.sql" \
        "seeds/dev/educational_content/${module_num}-exercises-module${i}.sql" \
        "Exercises Module $i"
done

# Assessment rubrics
compare_files \
    "seeds/prod/educational_content/07-assessment_rubrics.sql" \
    "seeds/dev/educational_content/07-assessment_rubrics.sql" \
    "Assessment Rubrics"

# Difficulty criteria
compare_files \
    "seeds/prod/educational_content/08-difficulty_criteria.sql" \
    "seeds/dev/educational_content/08-difficulty_criteria.sql" \
    "Difficulty Criteria"

# Exercise mechanic mapping
compare_files \
    "seeds/prod/educational_content/09-exercise_mechanic_mapping.sql" \
    "seeds/dev/educational_content/09-exercise_mechanic_mapping.sql" \
    "Exercise Mechanic Mapping"

echo ""
echo "2. VERIFICANDO SEEDS GAMIFICATION_SYSTEM"
echo "------------------------------------------------------------------------"

compare_files \
    "seeds/prod/gamification_system/01-achievement_categories.sql" \
    "seeds/dev/gamification_system/01-achievement_categories.sql" \
    "Achievement Categories"

compare_files \
    "seeds/prod/gamification_system/02-leaderboard_metadata.sql" \
    "seeds/dev/gamification_system/02-leaderboard_metadata.sql" \
    "Leaderboard Metadata"

compare_files \
    "seeds/prod/gamification_system/03-maya_ranks.sql" \
    "seeds/dev/gamification_system/03-maya_ranks.sql" \
    "Maya Ranks"

compare_files \
    "seeds/prod/gamification_system/04-achievements.sql" \
    "seeds/dev/gamification_system/04-achievements.sql" \
    "Achievements"

echo ""
echo "3. VERIFICANDO SEEDS AUTH"
echo "------------------------------------------------------------------------"

compare_files \
    "seeds/prod/auth/01-demo-users.sql" \
    "seeds/dev/auth/01-demo-users.sql" \
    "Demo Users"

echo ""
echo "4. VERIFICANDO ARCHIVOS CRÍTICOS DDL"
echo "------------------------------------------------------------------------"

# Verificar que existan archivos DDL críticos
critical_ddl_files=(
    "ddl/schemas/educational_content/tables/01-modules.sql"
    "ddl/schemas/educational_content/tables/02-exercises.sql"
    "ddl/schemas/gamification_system/tables/maya_ranks.sql"
    "ddl/schemas/gamification_system/tables/user_stats.sql"
    "ddl/schemas/gamilit/functions/01-create_all_schemas.sql"
)

for ddl_file in "${critical_ddl_files[@]}"; do
    total_checks=$((total_checks + 1))
    if [ -f "$ddl_file" ]; then
        echo -e "${GREEN}✓${NC} $ddl_file existe"
        passed_checks=$((passed_checks + 1))
    else
        echo -e "${RED}✗${NC} $ddl_file NO EXISTE"
        failed_checks=$((failed_checks + 1))
    fi
done

echo ""
echo "5. VERIFICANDO ARCHIVOS TEMPORALES/OBSOLETOS"
echo "------------------------------------------------------------------------"

# Buscar archivos que NO deberían estar
obsolete_patterns=(
    "scripts/migrations/*.sql"
    "seeds/*/educational_content/*~"
    "seeds/*/*.bak"
    "*.tmp"
)

found_obsolete=0
for pattern in "${obsolete_patterns[@]}"; do
    files=$(find . -path "./$pattern" 2>/dev/null)
    if [ -n "$files" ]; then
        echo -e "${YELLOW}⚠${NC}  Archivos obsoletos encontrados: $pattern"
        echo "$files"
        found_obsolete=1
    fi
done

if [ $found_obsolete -eq 0 ]; then
    echo -e "${GREEN}✓${NC} No se encontraron archivos obsoletos"
fi

echo ""
echo "6. VERIFICANDO SCRIPT create-database.sh"
echo "------------------------------------------------------------------------"

total_checks=$((total_checks + 1))
if [ -x "create-database.sh" ]; then
    echo -e "${GREEN}✓${NC} create-database.sh es ejecutable"
    passed_checks=$((passed_checks + 1))
else
    echo -e "${RED}✗${NC} create-database.sh NO es ejecutable"
    failed_checks=$((failed_checks + 1))
fi

total_checks=$((total_checks + 1))
if grep -q "FASE 16: SEED DATA" create-database.sh; then
    echo -e "${GREEN}✓${NC} create-database.sh contiene carga de seeds"
    passed_checks=$((passed_checks + 1))
else
    echo -e "${RED}✗${NC} create-database.sh NO contiene carga de seeds"
    failed_checks=$((failed_checks + 1))
fi

echo ""
echo "========================================================================"
echo "RESUMEN"
echo "========================================================================"
echo ""
echo "Total de verificaciones: $total_checks"
echo -e "${GREEN}Pasadas: $passed_checks${NC}"
echo -e "${RED}Fallidas: $failed_checks${NC}"
echo ""

if [ $failed_checks -eq 0 ]; then
    echo -e "${GREEN}✅ TODOS LOS CHECKS PASARON${NC}"
    echo -e "${GREEN}✅ Sistema listo para carga inicial limpia${NC}"
    exit 0
else
    echo -e "${RED}❌ HAY $failed_checks CHECKS FALLIDOS${NC}"
    echo -e "${YELLOW}⚠️  Revisar archivos desincronizados antes de carga limpia${NC}"
    exit 1
fi
