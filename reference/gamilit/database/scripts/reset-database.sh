#!/bin/bash
##############################################################################
# GAMILIT Platform - Database Reset Script
#
# Propósito: Reiniciar SOLO la base de datos (mantiene usuario existente)
#            ⚠️  Elimina datos pero NO el usuario PostgreSQL
#
# Uso:
#   ./reset-database.sh                         # Modo interactivo
#   ./reset-database.sh --env dev               # Desarrollo
#   ./reset-database.sh --env prod              # Producción
#   ./reset-database.sh --env dev --force       # Sin confirmación
#   ./reset-database.sh --password "mi_pass"    # Con password conocido
#
# Funcionalidades:
#   1. ⚠️ Elimina la BD gamilit_platform
#   2. ✅ Mantiene el usuario gamilit_user
#   3. Recrea BD, ejecuta DDL y carga seeds
#
# Ideal para:
#   - Usuario ya existe con password conocido
#   - Resetear datos sin tocar configuración de usuario
#   - Ambientes donde el usuario tiene permisos específicos
#
##############################################################################

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuración de rutas
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATABASE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DDL_DIR="$DATABASE_ROOT/ddl"
SEEDS_DIR="$DATABASE_ROOT/seeds"

# Configuración de base de datos
DB_NAME="gamilit_platform"
DB_USER="gamilit_user"
DB_HOST="localhost"
DB_PORT="5432"
POSTGRES_USER="postgres"

# Variables
ENVIRONMENT=""
FORCE_MODE=false
DB_PASSWORD=""

# ============================================================================
# FUNCIONES AUXILIARES
# ============================================================================

print_header() {
    echo ""
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}$1${NC}"
    echo -e "${YELLOW}========================================${NC}"
    echo ""
}

print_step() {
    echo -e "${CYAN}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo "  $1"
}

show_help() {
    cat << EOF
GAMILIT Platform - Reset de Base de Datos (Mantiene Usuario)

Uso: $0 [OPCIONES]

Opciones:
  --env dev|prod      Ambiente
  --password PASS     Password del usuario existente (requerido)
  --force             No pedir confirmación
  --help              Mostrar ayuda

Ejemplos:
  $0 --env dev --password "mi_password"
  $0 --env prod --password "prod_pass" --force

Este script:
  1. Elimina la base de datos gamilit_platform
  2. Mantiene el usuario gamilit_user
  3. Recrea la BD con DDL y seeds

⚠️  Requiere conocer el password del usuario existente

EOF
}

# ============================================================================
# FUNCIONES SQL
# ============================================================================

execute_as_postgres() {
    local sql="$1"
    if [ "$USE_SUDO" = true ]; then
        echo "$sql" | sudo -u postgres psql 2>&1
    else
        PGPASSWORD="$PGPASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -c "$sql" 2>&1
    fi
}

query_as_postgres() {
    local sql="$1"
    if [ "$USE_SUDO" = true ]; then
        echo "$sql" | sudo -u postgres psql -t | xargs
    else
        PGPASSWORD="$PGPASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -t -c "$sql" | xargs
    fi
}

execute_sql_file() {
    local file="$1"
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file" 2>&1
}

# ============================================================================
# VERIFICACIÓN
# ============================================================================

check_prerequisites() {
    print_step "Verificando prerequisitos..."

    if ! command -v psql &> /dev/null; then
        print_error "psql no encontrado"
        exit 1
    fi
    print_success "psql encontrado"

    if [ ! -d "$DDL_DIR" ]; then
        print_error "Directorio DDL no encontrado: $DDL_DIR"
        exit 1
    fi

    if [ ! -d "$SEEDS_DIR" ]; then
        print_error "Directorio seeds no encontrado: $SEEDS_DIR"
        exit 1
    fi

    # Verificar conexión PostgreSQL
    if sudo -n -u postgres psql -c "SELECT 1" &> /dev/null 2>&1; then
        USE_SUDO=true
        print_success "Conectado a PostgreSQL (sudo)"
    elif [ -n "$PGPASSWORD" ] && psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -c "SELECT 1" &> /dev/null 2>&1; then
        USE_SUDO=false
        print_success "Conectado a PostgreSQL (TCP)"
    else
        print_error "No se puede conectar a PostgreSQL"
        exit 1
    fi

    # Verificar que el usuario existe
    user_exists=$(query_as_postgres "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'")
    if [ -z "$user_exists" ]; then
        print_error "Usuario '$DB_USER' no existe"
        print_info "Usa init-database.sh para crear el usuario primero"
        exit 1
    fi
    print_success "Usuario $DB_USER existe"

    # Verificar password del usuario
    if [ -z "$DB_PASSWORD" ]; then
        print_error "Password requerido (usar --password)"
        exit 1
    fi

    # Probar conexión con el password
    if ! PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "SELECT 1" > /dev/null 2>&1; then
        print_error "Password incorrecto para usuario $DB_USER"
        exit 1
    fi
    print_success "Password verificado"
}

# ============================================================================
# PASO 1: ELIMINAR BASE DE DATOS
# ============================================================================

drop_database() {
    print_step "PASO 1/4: Eliminando base de datos..."

    db_exists=$(query_as_postgres "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

    if [ -z "$db_exists" ]; then
        print_info "Base de datos '$DB_NAME' no existe, se creará nueva"
        return
    fi

    print_info "Terminando conexiones activas..."
    execute_as_postgres "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();" > /dev/null 2>&1 || true
    sleep 1

    print_info "Eliminando base de datos '$DB_NAME'..."
    if execute_as_postgres "DROP DATABASE IF EXISTS $DB_NAME;" > /dev/null 2>&1; then
        print_success "Base de datos eliminada"
    else
        print_error "Error al eliminar base de datos"
        exit 1
    fi
}

# ============================================================================
# PASO 2: CREAR BASE DE DATOS
# ============================================================================

create_database() {
    print_step "PASO 2/4: Creando base de datos..."

    print_info "Creando base de datos $DB_NAME..."
    execute_as_postgres "CREATE DATABASE $DB_NAME OWNER $DB_USER ENCODING 'UTF8';" > /dev/null
    print_success "Base de datos creada"

    execute_as_postgres "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" > /dev/null
    print_success "Privilegios otorgados"
}

# ============================================================================
# PASO 3: EJECUTAR DDL Y SEEDS
# ============================================================================

execute_ddl() {
    print_step "PASO 3/4: Ejecutando DDL..."

    export PGPASSWORD="$DB_PASSWORD"

    local schemas=(
        "auth"
        "auth_management"
        "system_configuration"
        "gamification_system"
        "educational_content"
        "content_management"
        "social_features"
        "progress_tracking"
        "audit_logging"
    )

    # Crear schemas
    print_info "Creando schemas..."
    for schema in "${schemas[@]}"; do
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "CREATE SCHEMA IF NOT EXISTS $schema;" > /dev/null 2>&1
    done
    print_success "9 schemas creados"

    # Crear ENUMs
    print_info "Creando ENUMs..."
    if [ -d "$DDL_DIR/schemas/gamification_system/enums" ]; then
        for enum_file in "$DDL_DIR/schemas/gamification_system/enums"/*.sql; do
            if [ -f "$enum_file" ]; then
                execute_sql_file "$enum_file" > /dev/null 2>&1 || true
            fi
        done
    fi
    print_success "ENUMs creados"

    # Crear tablas
    print_info "Creando tablas..."
    local table_count=0
    for schema in "${schemas[@]}"; do
        local tables_dir="$DDL_DIR/schemas/$schema/tables"
        if [ -d "$tables_dir" ]; then
            for table_file in "$tables_dir"/*.sql; do
                if [ -f "$table_file" ]; then
                    if execute_sql_file "$table_file" > /dev/null 2>&1; then
                        ((table_count++))
                    fi
                fi
            done
        fi
    done
    print_success "$table_count tablas creadas"

    # Otorgar permisos a gamilit_user
    print_info "Otorgando permisos a gamilit_user..."
    local perms_file="$DDL_DIR/99-post-ddl-permissions.sql"
    if [ -f "$perms_file" ]; then
        execute_sql_file "$perms_file" > /dev/null 2>&1
        print_success "Permisos otorgados"
    else
        print_warning "Archivo de permisos no encontrado: $perms_file"
    fi

    unset PGPASSWORD
}

load_seeds() {
    print_step "PASO 4/4: Cargando seeds..."

    export PGPASSWORD="$DB_PASSWORD"

    local seeds_base="$SEEDS_DIR/dev"
    local loaded=0
    local failed=0

    # Array con orden específico respetando dependencias
    # IMPORTANTE: Este orden es crítico para evitar errores de FK
    local seed_files=(
        # 1. Tenants y auth providers (sin dependencias)
        "$seeds_base/auth_management/01-tenants.sql"
        "$seeds_base/auth_management/02-auth_providers.sql"

        # 2. Users (depende de tenants - opcional)
        "$seeds_base/auth/01-demo-users.sql"

        # 3. Profiles (CRÍTICO: depende de users y tenants)
        "$seeds_base/auth_management/03-profiles.sql"

        # 4. Resto de auth_management
        "$seeds_base/auth_management/04-user_roles.sql"
        "$seeds_base/auth_management/05-user_preferences.sql"
        "$seeds_base/auth_management/06-auth_attempts.sql"
        "$seeds_base/auth_management/07-security_events.sql"

        # 5. System configuration
        "$seeds_base/system_configuration/01-system_settings.sql"
        "$seeds_base/system_configuration/02-feature_flags.sql"

        # 6. Gamificación (depende de users/profiles)
        "$seeds_base/gamification_system/01-achievement_categories.sql"
        "$seeds_base/gamification_system/02-achievements.sql"
        "$seeds_base/gamification_system/03-leaderboard_metadata.sql"
        "$seeds_base/gamification_system/04-initialize_user_gamification.sql"

        # 7. Educational content
        "$seeds_base/educational_content/01-modules.sql"
        "$seeds_base/educational_content/02-exercises-module1.sql"
        "$seeds_base/educational_content/03-exercises-module2.sql"
        "$seeds_base/educational_content/04-exercises-module3.sql"
        "$seeds_base/educational_content/05-exercises-module4.sql"
        "$seeds_base/educational_content/06-exercises-module5.sql"
        "$seeds_base/educational_content/07-assessment-rubrics.sql"

        # 8. Content management
        "$seeds_base/content_management/01-marie-curie-bio.sql"
        "$seeds_base/content_management/02-media-files.sql"
        "$seeds_base/content_management/03-tags.sql"

        # 9. Social features
        "$seeds_base/social_features/01-schools.sql"
        "$seeds_base/social_features/02-classrooms.sql"
        "$seeds_base/social_features/03-classroom-members.sql"
        "$seeds_base/social_features/04-teams.sql"

        # 10. Progress tracking
        "$seeds_base/progress_tracking/01-demo-progress.sql"
        "$seeds_base/progress_tracking/02-exercise-attempts.sql"

        # 11. Audit logging
        "$seeds_base/audit_logging/01-audit-logs.sql"
        "$seeds_base/audit_logging/02-system-metrics.sql"
    )

    for seed_file in "${seed_files[@]}"; do
        if [ -f "$seed_file" ]; then
            local basename_file=$(basename "$seed_file")
            print_info "  $basename_file"

            # CRÍTICO: NO ocultar errores - ejecutar y mostrar salida
            if execute_sql_file "$seed_file" 2>&1 | grep -i "error" > /dev/null; then
                ((failed++))
                print_warning "  ⚠️  Errores en $basename_file (continuando...)"
            else
                ((loaded++))
            fi
        else
            print_warning "Seed no encontrado: $(basename $seed_file)"
        fi
    done

    if [ $failed -gt 0 ]; then
        print_warning "$loaded seeds cargados, $failed con errores"
    else
        print_success "$loaded seeds cargados exitosamente"
    fi

    unset PGPASSWORD
}

# ============================================================================
# CONFIRMACIÓN
# ============================================================================

confirm_reset() {
    print_header "⚠️  ADVERTENCIA: RESET DE BASE DE DATOS"

    echo -e "${YELLOW}Este script:${NC}"
    echo -e "  • Eliminará la base de datos: ${RED}$DB_NAME${NC}"
    echo -e "  • Mantendrá el usuario: ${GREEN}$DB_USER${NC}"
    echo -e "  • Recreará schemas, tablas y datos"
    echo ""

    if [ "$FORCE_MODE" = false ]; then
        read -p "¿Continuar con el reset? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            print_info "Operación cancelada"
            exit 0
        fi
    fi
}

# ============================================================================
# MAIN
# ============================================================================

main() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --env)
                ENVIRONMENT="$2"
                shift 2
                ;;
            --password)
                DB_PASSWORD="$2"
                shift 2
                ;;
            --force)
                FORCE_MODE=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                print_error "Opción desconocida: $1"
                show_help
                exit 1
                ;;
        esac
    done

    if [ -z "$ENVIRONMENT" ]; then
        print_header "GAMILIT Platform - Reset de BD"
        echo "Selecciona ambiente:"
        echo "  1) dev"
        echo "  2) prod"
        read -p "Opción: " env_option

        case $env_option in
            1) ENVIRONMENT="dev" ;;
            2) ENVIRONMENT="prod" ;;
            *)
                print_error "Opción inválida"
                exit 1
                ;;
        esac
    fi

    if [ "$ENVIRONMENT" != "dev" ] && [ "$ENVIRONMENT" != "prod" ]; then
        print_error "Ambiente inválido: $ENVIRONMENT"
        exit 1
    fi

    # Si no se proveyó password, preguntar
    if [ -z "$DB_PASSWORD" ]; then
        read -sp "Password para usuario $DB_USER: " DB_PASSWORD
        echo ""
    fi

    confirm_reset
    check_prerequisites
    drop_database
    create_database
    execute_ddl
    load_seeds

    print_header "✅ BASE DE DATOS RESETEADA"

    echo -e "${GREEN}Base de datos recreada exitosamente${NC}"
    echo ""
    echo -e "${CYAN}Conexión:${NC}"
    echo -e "  Database: $DB_NAME"
    echo -e "  User:     $DB_USER"
    echo -e "  Host:     $DB_HOST:$DB_PORT"
    echo ""
    print_success "¡Listo para usar!"
    echo ""
}

main "$@"
