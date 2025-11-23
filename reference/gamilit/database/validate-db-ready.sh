#!/bin/bash

# ============================================================================
# Database Validation Script - Post-Reset
# ============================================================================
# Purpose: Validate database is ready for user registration
# Usage: ./validate-db-ready.sh
# Exit codes: 0 = Success, 1 = Failure
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Database connection
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-gamilit_platform}"
DB_USER="${DB_USER:-gamilit_user}"
DB_PASSWORD="${DB_PASSWORD:-3RZ2uYhCnJBXQqEwPPbZK3NFfk4T4W4Q}"

# Test configuration
TEST_EMAIL="validation-test-$(date +%s)@gamilit.local"
BACKEND_URL="${BACKEND_URL:-http://localhost:3006}"

echo "============================================================"
echo "  GAMILIT Database Validation - Post-Reset"
echo "============================================================"
echo ""

# Function to run SQL query
run_query() {
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -t -c "$1" 2>&1
}

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        return 0
    else
        echo -e "${RED}❌ $2${NC}"
        return 1
    fi
}

# Counter for failures
FAILURES=0

# ============================================================================
# 1. Check Required Tables Exist
# ============================================================================
echo "🔍 Checking required tables..."

TABLES=(
    "auth_management.tenants"
    "auth_management.profiles"
    "auth.users"
    "gamification_system.user_stats"
    "gamification_system.comodines_inventory"
    "gamification_system.user_ranks"
    "gamification_system.maya_ranks"
)

for table in "${TABLES[@]}"; do
    result=$(run_query "SELECT to_regclass('$table');")
    if [[ "$result" == *"$table"* ]]; then
        print_status 0 "Table exists: $table"
    else
        print_status 1 "Table missing: $table"
        ((FAILURES++))
    fi
done

echo ""

# ============================================================================
# 2. Check Required Seed Data
# ============================================================================
echo "🔍 Checking required seed data..."

# Check tenants
tenant_count=$(run_query "SELECT COUNT(*) FROM auth_management.tenants;" | xargs)
if [ "$tenant_count" -gt 0 ]; then
    print_status 0 "Tenants: $tenant_count found"
else
    print_status 1 "Tenants: None found (REQUIRED for registration)"
    ((FAILURES++))
fi

# Check maya ranks
rank_count=$(run_query "SELECT COUNT(*) FROM gamification_system.maya_ranks;" | xargs)
if [ "$rank_count" -eq 5 ]; then
    print_status 0 "Maya ranks: $rank_count found (expected 5)"
else
    print_status 1 "Maya ranks: $rank_count found (expected 5)"
    ((FAILURES++))
fi

# Check Ajaw rank exists
ajaw_exists=$(run_query "SELECT COUNT(*) FROM gamification_system.maya_ranks WHERE rank_name = 'Ajaw';" | xargs)
if [ "$ajaw_exists" -eq 1 ]; then
    print_status 0 "Initial rank 'Ajaw' exists"
else
    print_status 1 "Initial rank 'Ajaw' missing"
    ((FAILURES++))
fi

echo ""

# ============================================================================
# 3. Check Critical Function: initialize_user_stats
# ============================================================================
echo "🔍 Validating initialize_user_stats() function..."

# Check function exists
func_exists=$(run_query "SELECT COUNT(*) FROM pg_proc WHERE proname = 'initialize_user_stats';" | xargs)
if [ "$func_exists" -eq 1 ]; then
    print_status 0 "Function initialize_user_stats() exists"

    # Check if fix is applied (uses NEW.id for comodines_inventory)
    func_code=$(run_query "SELECT prosrc FROM pg_proc WHERE proname = 'initialize_user_stats';")
    if [[ "$func_code" == *"NEW.id  -- CORRECTED"* ]]; then
        print_status 0 "Fix applied: Uses NEW.id for comodines_inventory"
    else
        print_status 1 "Fix NOT applied: Still uses NEW.user_id for comodines_inventory"
        echo -e "${YELLOW}⚠️  This will cause 500 error on registration!${NC}"
        echo -e "${YELLOW}⚠️  Run: psql -f apps/database/ddl/schemas/gamilit/functions/04-initialize_user_stats.sql${NC}"
        ((FAILURES++))
    fi
else
    print_status 1 "Function initialize_user_stats() missing"
    ((FAILURES++))
fi

echo ""

# ============================================================================
# 4. Check Foreign Key Constraints
# ============================================================================
echo "🔍 Checking foreign key constraints..."

# comodines_inventory should reference profiles.id
fk_comodines=$(run_query "SELECT confrelid::regclass FROM pg_constraint WHERE conname = 'comodines_inventory_user_id_fkey';")
if [[ "$fk_comodines" == *"profiles"* ]]; then
    print_status 0 "comodines_inventory.user_id → profiles.id (correct)"
else
    print_status 1 "comodines_inventory.user_id foreign key incorrect"
    ((FAILURES++))
fi

# user_stats should reference auth.users.id
fk_stats=$(run_query "SELECT confrelid::regclass FROM pg_constraint WHERE conname = 'user_stats_user_id_fkey';")
if [[ "$fk_stats" == *"users"* ]]; then
    print_status 0 "user_stats.user_id → auth.users.id (correct)"
else
    print_status 1 "user_stats.user_id foreign key incorrect"
    ((FAILURES++))
fi

# user_ranks should reference auth.users.id
fk_ranks=$(run_query "SELECT confrelid::regclass FROM pg_constraint WHERE conname = 'user_ranks_user_id_fkey';")
if [[ "$fk_ranks" == *"users"* ]]; then
    print_status 0 "user_ranks.user_id → auth.users.id (correct)"
else
    print_status 1 "user_ranks.user_id foreign key incorrect"
    ((FAILURES++))
fi

echo ""

# ============================================================================
# 5. Test Registration (if backend is running)
# ============================================================================
echo "🔍 Testing user registration..."

# Check if backend is running
if curl -s -f "$BACKEND_URL/api/health" > /dev/null 2>&1 || \
   curl -s "$BACKEND_URL/api/auth/login" > /dev/null 2>&1; then

    echo "Backend detected at $BACKEND_URL"

    # Attempt registration
    response=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/auth/register" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"Test123!@#\",\"first_name\":\"Test\",\"last_name\":\"User\"}" \
        2>&1)

    # Extract HTTP code (last line)
    http_code=$(echo "$response" | tail -n 1)
    response_body=$(echo "$response" | sed '$d')

    if [ "$http_code" = "201" ] || [ "$http_code" = "200" ]; then
        print_status 0 "Registration endpoint: HTTP $http_code (success)"

        # Verify user was created in DB
        user_created=$(run_query "SELECT COUNT(*) FROM auth.users WHERE email = '$TEST_EMAIL';" | xargs)
        if [ "$user_created" -eq 1 ]; then
            print_status 0 "User created in database"

            # Verify gamification data
            stats_created=$(run_query "SELECT COUNT(*) FROM gamification_system.user_stats us JOIN auth.users u ON us.user_id = u.id WHERE u.email = '$TEST_EMAIL';" | xargs)
            comodines_created=$(run_query "SELECT COUNT(*) FROM gamification_system.comodines_inventory ci JOIN auth_management.profiles p ON ci.user_id = p.id JOIN auth.users u ON p.user_id = u.id WHERE u.email = '$TEST_EMAIL';" | xargs)
            ranks_created=$(run_query "SELECT COUNT(*) FROM gamification_system.user_ranks ur JOIN auth.users u ON ur.user_id = u.id WHERE u.email = '$TEST_EMAIL';" | xargs)

            if [ "$stats_created" -eq 1 ] && [ "$comodines_created" -eq 1 ] && [ "$ranks_created" -eq 1 ]; then
                print_status 0 "Gamification data initialized (stats, comodines, ranks)"
            else
                print_status 1 "Gamification data incomplete (stats:$stats_created, comodines:$comodines_created, ranks:$ranks_created)"
                ((FAILURES++))
            fi

            # Cleanup test user
            run_query "DELETE FROM auth.users WHERE email = '$TEST_EMAIL';" > /dev/null
        else
            print_status 1 "User not created in database"
            ((FAILURES++))
        fi
    elif [ "$http_code" = "409" ]; then
        echo -e "${YELLOW}⚠️  Registration: HTTP 409 (user already exists - OK)${NC}"
    else
        print_status 1 "Registration endpoint: HTTP $http_code (expected 201)"
        echo "Response: $response_body"
        ((FAILURES++))
    fi
else
    echo -e "${YELLOW}⚠️  Backend not running - skipping registration test${NC}"
    echo "   Start backend with: cd apps/backend && npm run dev"
fi

echo ""
echo "============================================================"

# ============================================================================
# Summary
# ============================================================================
if [ $FAILURES -eq 0 ]; then
    echo -e "${GREEN}✅ VALIDATION PASSED${NC}"
    echo "   Database is ready for user registration"
    exit 0
else
    echo -e "${RED}❌ VALIDATION FAILED${NC}"
    echo "   Found $FAILURES issue(s) that need to be fixed"
    echo ""
    echo "Common fixes:"
    echo "  1. Run database initialization: ./create-database.sh"
    echo "  2. Apply function fix: psql -f ddl/schemas/gamilit/functions/04-initialize_user_stats.sql"
    echo "  3. Load seed data: psql -f seeds/prod/00-master-tenant.sql"
    echo "                     psql -f seeds/prod/gamification/01-maya-ranks.sql"
    exit 1
fi
