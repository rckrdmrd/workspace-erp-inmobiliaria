#!/bin/bash
# ============================================================================
# Script de Validación: create-database.sh
# Fecha: 2025-11-19
# Propósito: Validar que todos los archivos referenciados en create-database.sh existen
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DDL_DIR="$SCRIPT_DIR/ddl"
SEEDS_DIR="$SCRIPT_DIR/seeds/prod"

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
MISSING_FILES=()
MISSING_DIRS=()

echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}VALIDACIÓN: create-database.sh${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""

check_file() {
    local file="$1"
    local description="$2"
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $description"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}❌${NC} $description"
        echo -e "   ${YELLOW}Archivo faltante: $file${NC}"
        MISSING_FILES+=("$file")
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

check_dir() {
    local dir="$1"
    local description="$2"
    local optional="${3:-false}"

    if [ -d "$dir" ]; then
        local file_count=$(find "$dir" -name "*.sql" -type f ! -path "*/_deprecated/*" ! -path "*/tests/*" 2>/dev/null | wc -l)
        if [ "$file_count" -gt 0 ]; then
            echo -e "${GREEN}✅${NC} $description ($file_count archivos)"
            return 0
        elif [ "$optional" = "true" ]; then
            echo -e "${YELLOW}⚠️${NC}  $description (0 archivos - opcional)"
            return 0
        else
            echo -e "${YELLOW}⚠️${NC}  $description (0 archivos)"
            return 1
        fi
    elif [ "$optional" = "true" ]; then
        echo -e "${YELLOW}⚠️${NC}  $description (no existe - opcional)"
        return 0
    else
        echo -e "${RED}❌${NC} $description (directorio no existe)"
        MISSING_DIRS+=("$dir")
        return 1
    fi
}

echo -e "${BLUE}FASE 1: PREREQUISITES${NC}"
check_file "$DDL_DIR/00-prerequisites.sql" "Prerequisites (schemas y ENUMs)"
echo ""

echo -e "${BLUE}FASE 2: FUNCIONES COMPARTIDAS (gamilit)${NC}"
check_dir "$DDL_DIR/schemas/gamilit/functions" "gamilit/functions"
check_dir "$DDL_DIR/schemas/gamilit/views" "gamilit/views" "true"
echo ""

echo -e "${BLUE}FASE 3: AUTH SCHEMA${NC}"
check_dir "$DDL_DIR/schemas/auth/enums" "auth/enums" "true"
check_dir "$DDL_DIR/schemas/auth/tables" "auth/tables"
check_dir "$DDL_DIR/schemas/auth/functions" "auth/functions" "true"
echo ""

echo -e "${BLUE}FASE 4: STORAGE SCHEMA${NC}"
check_dir "$DDL_DIR/schemas/storage/enums" "storage/enums" "true"
echo ""

echo -e "${BLUE}FASE 5: AUTH_MANAGEMENT SCHEMA${NC}"
check_dir "$DDL_DIR/schemas/auth_management/tables" "auth_management/tables"
check_dir "$DDL_DIR/schemas/auth_management/functions" "auth_management/functions"
check_dir "$DDL_DIR/schemas/auth_management/triggers" "auth_management/triggers"
check_dir "$DDL_DIR/schemas/auth_management/indexes" "auth_management/indexes"
check_dir "$DDL_DIR/schemas/auth_management/rls-policies" "auth_management/rls-policies"
echo ""

echo -e "${BLUE}FASE 6: EDUCATIONAL_CONTENT SCHEMA${NC}"
check_dir "$DDL_DIR/schemas/educational_content/enums" "educational_content/enums" "true"
check_dir "$DDL_DIR/schemas/educational_content/tables" "educational_content/tables"
check_dir "$DDL_DIR/schemas/educational_content/functions" "educational_content/functions"
check_dir "$DDL_DIR/schemas/educational_content/views" "educational_content/views" "true"
check_dir "$DDL_DIR/schemas/educational_content/triggers" "educational_content/triggers"
check_dir "$DDL_DIR/schemas/educational_content/indexes" "educational_content/indexes"
check_dir "$DDL_DIR/schemas/educational_content/rls-policies" "educational_content/rls-policies"
echo ""

echo -e "${BLUE}FASE 7: GAMIFICATION_SYSTEM SCHEMA${NC}"
check_dir "$DDL_DIR/schemas/gamification_system/enums" "gamification_system/enums"
check_dir "$DDL_DIR/schemas/gamification_system/tables" "gamification_system/tables"
check_dir "$DDL_DIR/schemas/gamification_system/functions" "gamification_system/functions"
check_dir "$DDL_DIR/schemas/gamification_system/triggers" "gamification_system/triggers"
check_dir "$DDL_DIR/schemas/gamification_system/indexes" "gamification_system/indexes"
check_dir "$DDL_DIR/schemas/gamification_system/views" "gamification_system/views"
check_dir "$DDL_DIR/schemas/gamification_system/materialized-views" "gamification_system/materialized-views"
check_dir "$DDL_DIR/schemas/gamification_system/rls-policies" "gamification_system/rls-policies"
echo ""

echo -e "${BLUE}FASE 8: PROGRESS_TRACKING SCHEMA${NC}"
check_dir "$DDL_DIR/schemas/progress_tracking/enums" "progress_tracking/enums" "true"
check_dir "$DDL_DIR/schemas/progress_tracking/tables" "progress_tracking/tables"
check_dir "$DDL_DIR/schemas/progress_tracking/functions" "progress_tracking/functions"
check_dir "$DDL_DIR/schemas/progress_tracking/triggers" "progress_tracking/triggers"
check_dir "$DDL_DIR/schemas/progress_tracking/indexes" "progress_tracking/indexes"
check_dir "$DDL_DIR/schemas/progress_tracking/views" "progress_tracking/views"
check_dir "$DDL_DIR/schemas/progress_tracking/rls-policies" "progress_tracking/rls-policies"
echo ""

echo -e "${BLUE}FASE 9: SOCIAL_FEATURES SCHEMA${NC}"
check_dir "$DDL_DIR/schemas/social_features/enums" "social_features/enums" "true"
check_dir "$DDL_DIR/schemas/social_features/tables" "social_features/tables"
check_dir "$DDL_DIR/schemas/social_features/functions" "social_features/functions"
check_dir "$DDL_DIR/schemas/social_features/triggers" "social_features/triggers"
check_dir "$DDL_DIR/schemas/social_features/rls-policies" "social_features/rls-policies"
echo ""

echo -e "${BLUE}FASE 9.5: FK CONSTRAINTS DIFERIDOS${NC}"
check_dir "$DDL_DIR/schemas/auth_management/fk-constraints" "auth_management/fk-constraints" "true"
echo ""

echo -e "${BLUE}FASE 9.7: NOTIFICATIONS SCHEMA${NC}"
check_dir "$DDL_DIR/schemas/notifications/tables" "notifications/tables"
check_dir "$DDL_DIR/schemas/notifications/functions" "notifications/functions"
check_dir "$DDL_DIR/schemas/notifications/triggers" "notifications/triggers" "true"
check_dir "$DDL_DIR/schemas/notifications/indexes" "notifications/indexes" "true"
check_dir "$DDL_DIR/schemas/notifications/rls-policies" "notifications/rls-policies" "true"
echo ""

echo -e "${BLUE}FASE 10: CONTENT_MANAGEMENT SCHEMA${NC}"
check_dir "$DDL_DIR/schemas/content_management/enums" "content_management/enums"
check_dir "$DDL_DIR/schemas/content_management/tables" "content_management/tables"
check_dir "$DDL_DIR/schemas/content_management/triggers" "content_management/triggers"
check_dir "$DDL_DIR/schemas/content_management/indexes" "content_management/indexes"
check_dir "$DDL_DIR/schemas/content_management/rls-policies" "content_management/rls-policies"
echo ""

echo -e "${BLUE}FASE 10.5: COMMUNICATION SCHEMA${NC}"
check_file "$DDL_DIR/schemas/communication/00-schema.sql" "communication/00-schema.sql"
check_dir "$DDL_DIR/schemas/communication/tables" "communication/tables"
check_dir "$DDL_DIR/schemas/communication/functions" "communication/functions" "true"
check_dir "$DDL_DIR/schemas/communication/triggers" "communication/triggers" "true"
check_dir "$DDL_DIR/schemas/communication/indexes" "communication/indexes" "true"
check_dir "$DDL_DIR/schemas/communication/views" "communication/views" "true"
echo ""

echo -e "${BLUE}FASE 11: AUDIT_LOGGING SCHEMA${NC}"
check_dir "$DDL_DIR/schemas/audit_logging/enums" "audit_logging/enums"
check_dir "$DDL_DIR/schemas/audit_logging/tables" "audit_logging/tables"
check_dir "$DDL_DIR/schemas/audit_logging/functions" "audit_logging/functions"
check_dir "$DDL_DIR/schemas/audit_logging/triggers" "audit_logging/triggers"
check_dir "$DDL_DIR/schemas/audit_logging/indexes" "audit_logging/indexes"
check_dir "$DDL_DIR/schemas/audit_logging/rls-policies" "audit_logging/rls-policies"
echo ""

echo -e "${BLUE}FASE 12: SYSTEM_CONFIGURATION SCHEMA${NC}"
check_dir "$DDL_DIR/schemas/system_configuration/tables" "system_configuration/tables"
check_dir "$DDL_DIR/schemas/system_configuration/triggers" "system_configuration/triggers"
check_dir "$DDL_DIR/schemas/system_configuration/rls-policies" "system_configuration/rls-policies"
echo ""

echo -e "${BLUE}FASE 13: ADMIN_DASHBOARD SCHEMA${NC}"
check_dir "$DDL_DIR/schemas/admin_dashboard/views" "admin_dashboard/views" "true"
check_dir "$DDL_DIR/schemas/admin_dashboard/tables" "admin_dashboard/tables" "true"
echo ""

echo -e "${BLUE}FASE 14: LTI_INTEGRATION SCHEMA${NC}"
check_dir "$DDL_DIR/schemas/lti_integration/tables" "lti_integration/tables"
check_dir "$DDL_DIR/schemas/lti_integration/functions" "lti_integration/functions"
check_dir "$DDL_DIR/schemas/lti_integration/triggers" "lti_integration/triggers"
echo ""

echo -e "${BLUE}FASE 15.5: POST-DDL PERMISSIONS${NC}"
check_file "$DDL_DIR/99-post-ddl-permissions.sql" "99-post-ddl-permissions.sql"
echo ""

echo -e "${BLUE}FASE 16: SEED DATA (PROD)${NC}"
check_file "$SEEDS_DIR/audit_logging/01-default-config.sql" "audit_logging/01-default-config.sql"
check_file "$SEEDS_DIR/system_configuration/01-system_settings.sql" "system_configuration/01-system_settings.sql"
check_file "$SEEDS_DIR/system_configuration/01-feature_flags_seeds.sql" "system_configuration/01-feature_flags_seeds.sql"
check_file "$SEEDS_DIR/system_configuration/02-gamification_parameters_seeds.sql" "system_configuration/02-gamification_parameters_seeds.sql"
check_file "$SEEDS_DIR/system_configuration/03-notification_settings_global.sql" "system_configuration/03-notification_settings_global.sql"
check_file "$SEEDS_DIR/system_configuration/04-rate_limits.sql" "system_configuration/04-rate_limits.sql"
check_file "$SEEDS_DIR/notifications/01-notification_templates.sql" "notifications/01-notification_templates.sql"
check_file "$SEEDS_DIR/auth_management/01-tenants.sql" "auth_management/01-tenants.sql"
check_file "$SEEDS_DIR/auth_management/02-auth_providers.sql" "auth_management/02-auth_providers.sql"
check_file "$SEEDS_DIR/auth/01-demo-users.sql" "auth/01-demo-users.sql"
check_file "$SEEDS_DIR/auth_management/04-profiles-complete.sql" "auth_management/04-profiles-complete.sql"
check_file "$SEEDS_DIR/content_management/01-default-templates.sql" "content_management/01-default-templates.sql"
check_file "$SEEDS_DIR/social_features/01-schools.sql" "social_features/01-schools.sql"
check_file "$SEEDS_DIR/social_features/02-classrooms.sql" "social_features/02-classrooms.sql"
check_file "$SEEDS_DIR/social_features/03-classroom-members.sql" "social_features/03-classroom-members.sql"
check_file "$SEEDS_DIR/educational_content/01-modules.sql" "educational_content/01-modules.sql"
check_file "$SEEDS_DIR/educational_content/02-exercises-module1.sql" "educational_content/02-exercises-module1.sql (DB-125)"
check_file "$SEEDS_DIR/educational_content/03-exercises-module2.sql" "educational_content/03-exercises-module2.sql (DB-125)"
check_file "$SEEDS_DIR/educational_content/04-exercises-module3.sql" "educational_content/04-exercises-module3.sql (DB-125)"
check_file "$SEEDS_DIR/educational_content/07-assessment-rubrics.sql" "educational_content/07-assessment-rubrics.sql"
check_file "$SEEDS_DIR/educational_content/08-difficulty_criteria.sql" "educational_content/08-difficulty_criteria.sql"
check_file "$SEEDS_DIR/educational_content/09-exercise_mechanic_mapping.sql" "educational_content/09-exercise_mechanic_mapping.sql"
check_file "$SEEDS_DIR/educational_content/10-exercise_validation_config.sql" "educational_content/10-exercise_validation_config.sql (DB-123)"
check_file "$SEEDS_DIR/progress_tracking/01-module_progress.sql" "progress_tracking/01-module_progress.sql"
check_file "$SEEDS_DIR/lti_integration/01-lti_consumers.sql" "lti_integration/01-lti_consumers.sql"
check_file "$SEEDS_DIR/gamification_system/01-achievement_categories.sql" "gamification_system/01-achievement_categories.sql"
check_file "$SEEDS_DIR/gamification_system/02-leaderboard_metadata.sql" "gamification_system/02-leaderboard_metadata.sql"
check_file "$SEEDS_DIR/gamification_system/03-maya_ranks.sql" "gamification_system/03-maya_ranks.sql"
check_file "$SEEDS_DIR/gamification_system/04-achievements.sql" "gamification_system/04-achievements.sql"
check_file "$SEEDS_DIR/gamification_system/05-user_stats.sql" "gamification_system/05-user_stats.sql"
check_file "$SEEDS_DIR/gamification_system/06-user_ranks.sql" "gamification_system/06-user_ranks.sql"
check_file "$SEEDS_DIR/gamification_system/07-ml_coins_transactions.sql" "gamification_system/07-ml_coins_transactions.sql"
check_file "$SEEDS_DIR/gamification_system/08-user_achievements.sql" "gamification_system/08-user_achievements.sql"
check_file "$SEEDS_DIR/gamification_system/09-comodines_inventory.sql" "gamification_system/09-comodines_inventory.sql"
check_file "$SEEDS_DIR/gamification_system/10-missions-init.sql" "gamification_system/10-missions-init.sql"
echo ""

echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}RESUMEN DE VALIDACIÓN${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""
echo -e "Total verificaciones: $TOTAL_CHECKS"
echo -e "${GREEN}✅ Pasaron: $PASSED_CHECKS${NC}"
if [ $FAILED_CHECKS -gt 0 ]; then
    echo -e "${RED}❌ Fallaron: $FAILED_CHECKS${NC}"
fi
echo ""

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo -e "${RED}Archivos faltantes:${NC}"
    for file in "${MISSING_FILES[@]}"; do
        echo -e "  - $file"
    done
    echo ""
fi

if [ ${#MISSING_DIRS[@]} -gt 0 ]; then
    echo -e "${RED}Directorios faltantes:${NC}"
    for dir in "${MISSING_DIRS[@]}"; do
        echo -e "  - $dir"
    done
    echo ""
fi

if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}============================================================================${NC}"
    echo -e "${GREEN}✅ VALIDACIÓN EXITOSA - create-database.sh está completo${NC}"
    echo -e "${GREEN}============================================================================${NC}"
    exit 0
else
    echo -e "${RED}============================================================================${NC}"
    echo -e "${RED}❌ VALIDACIÓN FALLIDA - Hay archivos faltantes${NC}"
    echo -e "${RED}============================================================================${NC}"
    exit 1
fi
