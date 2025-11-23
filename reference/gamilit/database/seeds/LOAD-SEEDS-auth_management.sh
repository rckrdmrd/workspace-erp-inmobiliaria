#!/bin/bash
# =====================================================
# Script: Load Seeds - auth_management Schema
# Description: Carga seeds en orden correcto respetando dependencias
# Created: 2025-11-02
# Usage: ./LOAD-SEEDS-auth_management.sh [dev|staging|production]
# =====================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default environment
ENVIRONMENT="${1:-dev}"

# Database connection settings
DB_NAME="${DB_NAME:-gamilit}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

echo -e "${BLUE}=============================================="
echo "  Loading auth_management Seeds"
echo "  Environment: ${ENVIRONMENT}"
echo "  Database: ${DB_NAME}"
echo "  Host: ${DB_HOST}"
echo "=============================================${NC}"
echo ""

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|production)$ ]]; then
    echo -e "${RED}Error: Invalid environment '${ENVIRONMENT}'"
    echo "Usage: $0 [dev|staging|production]${NC}"
    exit 1
fi

# Check if seeds directory exists
SEEDS_DIR="$(cd "$(dirname "$0")/${ENVIRONMENT}/auth_management" && pwd)"
if [ ! -d "$SEEDS_DIR" ]; then
    echo -e "${RED}Error: Seeds directory not found: ${SEEDS_DIR}${NC}"
    exit 1
fi

echo -e "${BLUE}Seeds directory: ${SEEDS_DIR}${NC}"
echo ""

# Function to execute SQL file
execute_sql() {
    local file=$1
    local filename=$(basename "$file")

    echo -e "${YELLOW}→ Executing: ${filename}${NC}"

    if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Success: ${filename}${NC}"
        return 0
    else
        echo -e "${RED}✗ Failed: ${filename}${NC}"
        return 1
    fi
}

# Order of execution (respecting dependencies)
declare -a SEED_FILES

if [ "$ENVIRONMENT" = "production" ]; then
    # Production: Only configuration seeds
    SEED_FILES=(
        "01-auth_providers.sql"
    )
else
    # Dev/Staging: All seeds
    SEED_FILES=(
        "01-tenants.sql"
        "02-auth_providers.sql"
        "03-profiles.sql"
        "04-user_roles.sql"
        "05-user_preferences.sql"
        "06-auth_attempts.sql"
        "07-security_events.sql"
    )
fi

# Execute seeds in order
echo -e "${BLUE}Starting seed execution...${NC}"
echo ""

TOTAL=${#SEED_FILES[@]}
SUCCESS=0
FAILED=0

for seed_file in "${SEED_FILES[@]}"; do
    file_path="${SEEDS_DIR}/${seed_file}"

    if [ ! -f "$file_path" ]; then
        echo -e "${YELLOW}⚠ Warning: File not found: ${seed_file} (skipping)${NC}"
        continue
    fi

    if execute_sql "$file_path"; then
        ((SUCCESS++))
    else
        ((FAILED++))

        # Ask if continue on error
        read -p "Continue with remaining seeds? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            break
        fi
    fi

    echo ""
done

# Summary
echo ""
echo -e "${BLUE}=============================================="
echo "  Execution Summary"
echo "=============================================${NC}"
echo -e "Total seeds: ${TOTAL}"
echo -e "${GREEN}Successful: ${SUCCESS}${NC}"

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Failed: ${FAILED}${NC}"
    echo ""
    echo -e "${RED}Some seeds failed to load. Check errors above.${NC}"
    exit 1
else
    echo -e "${RED}Failed: ${FAILED}${NC}"
    echo ""
    echo -e "${GREEN}✓ All seeds loaded successfully!${NC}"
fi

echo ""

# Show loaded data summary
echo -e "${BLUE}Verifying loaded data...${NC}"
echo ""

PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" <<EOF
SET search_path TO auth_management, public;

SELECT
    'Tenants' as table_name,
    COUNT(*)::text as record_count
FROM auth_management.tenants
UNION ALL
SELECT
    'Profiles',
    COUNT(*)::text
FROM auth_management.profiles
UNION ALL
SELECT
    'User Roles',
    COUNT(*)::text
FROM auth_management.user_roles
UNION ALL
SELECT
    'Auth Providers',
    COUNT(*)::text
FROM auth_management.auth_providers
UNION ALL
SELECT
    'User Preferences',
    COUNT(*)::text
FROM auth_management.user_preferences
UNION ALL
SELECT
    'Auth Attempts',
    COUNT(*)::text
FROM auth_management.auth_attempts
UNION ALL
SELECT
    'Security Events',
    COUNT(*)::text
FROM auth_management.security_events;
EOF

echo ""
echo -e "${GREEN}Done!${NC}"
