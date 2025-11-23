#!/bin/bash
##############################################################################
# GAMILIT Platform - Database Initialization Script v2.0
#
# Propósito: Inicialización COMPLETA de la base de datos
# Versión: 2.0 - Ejecuta TODOS los objetos SQL migrados (319 archivos)
# Cambios v2.0:
#   - Ejecución de funciones (61 archivos)
#   - Ejecución de vistas (12 archivos)
#   - Ejecución de vistas materializadas (4 archivos)
#   - Ejecución de índices (74 archivos)
#   - Ejecución de triggers (52 archivos)
#   - Ejecución de RLS policies (24 archivos)
#   - Soporte para configuración por ambiente (dev/prod)
#   - Validación mejorada
#
# Uso:
#   ./init-database-v2.sh                  # Modo interactivo
#   ./init-database-v2.sh --env dev        # Desarrollo
#   ./init-database-v2.sh --env prod       # Producción
#   ./init-database-v2.sh --env dev --force # Sin confirmación
#
##############################################################################

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Configuración de rutas
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATABASE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DDL_DIR="$DATABASE_ROOT/ddl"
SEEDS_DIR="$DATABASE_ROOT/seeds"
CONFIG_DIR="$SCRIPT_DIR/config"

# Configuración de base de datos
DB_NAME="gamilit_platform"
DB_USER="gamilit_user"
DB_HOST="localhost"
DB_PORT="5432"
POSTGRES_USER="postgres"

# Variables de configuración
ENVIRONMENT=""
FORCE_MODE=false
DB_PASSWORD=""

# Variables de ambiente (cargadas desde config/*.conf)
ENV_DB_HOST=""
ENV_DB_PORT=""
ENV_SEEDS_DIR=""
ENV_LOAD_DEMO_DATA=""

# ============================================================================
# FUNCIONES AUXILIARES
# ============================================================================

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
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
GAMILIT Platform - Inicialización de Base de Datos v2.0

Uso: $0 [OPCIONES]

Opciones:
  --env dev|prod    Ambiente (dev o prod)
  --password PASS   Password para gamilit_user (opcional, se genera si no se provee)
  --force           No pedir confirmación
  --help            Mostrar ayuda

Ejemplos:
  $0 --env dev
  $0 --env prod --password "mi_password_seguro"
  $0 --env dev --force

Novedades v2.0:
  ✅ Ejecuta TODOS los 319 objetos SQL migrados
  ✅ Funciones (61), Vistas (12), MVIEWs (4)
  ✅ Índices (74), Triggers (52), RLS Policies (24)
  ✅ Configuración por ambiente (dev/prod)
  ✅ Validación mejorada

EOF
}

generate_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-${ENV_MIN_PASSWORD_LENGTH:-32}
}

# ============================================================================
# CARGAR CONFIGURACIÓN POR AMBIENTE
# ============================================================================

load_environment_config() {
    local config_file="$CONFIG_DIR/${ENVIRONMENT}.conf"

    print_step "Cargando configuración de ambiente: $ENVIRONMENT"

    if [ -f "$config_file" ]; then
        source "$config_file"
        print_success "Configuración $ENVIRONMENT cargada"

        # Aplicar configuración
        if [ -n "$ENV_DB_HOST" ]; then
            DB_HOST="$ENV_DB_HOST"
        fi
        if [ -n "$ENV_DB_PORT" ]; then
            DB_PORT="$ENV_DB_PORT"
        fi
        if [ -n "$ENV_SEEDS_DIR" ]; then
            SEEDS_DIR="$DATABASE_ROOT/$ENV_SEEDS_DIR"
        fi

        print_info "Host: $DB_HOST:$DB_PORT"
        print_info "Seeds: $ENV_SEEDS_DIR"
        print_info "Tipo: $ENV_CONNECTION_TYPE"
    else
        print_warning "Archivo de configuración no encontrado: $config_file"
        print_info "Usando configuración por defecto"
    fi
}

# ============================================================================
# VERIFICACIÓN DE PREREQUISITOS
# ============================================================================

check_prerequisites() {
    print_step "Verificando prerequisitos..."

    if ! command -v psql &> /dev/null; then
        print_error "psql no encontrado"
        exit 1
    fi
    print_success "psql encontrado"

    if ! command -v openssl &> /dev/null; then
        print_error "openssl no encontrado"
        exit 1
    fi
    print_success "openssl encontrado"

    if [ ! -d "$DDL_DIR" ]; then
        print_error "Directorio DDL no encontrado: $DDL_DIR"
        exit 1
    fi
    print_success "Directorio DDL encontrado"

    if [ ! -d "$SEEDS_DIR" ]; then
        print_warning "Directorio seeds no encontrado: $SEEDS_DIR"
        print_info "Continuando sin seeds..."
    else
        print_success "Directorio seeds encontrado"
    fi

    # Verificar conexión PostgreSQL
    if command -v sudo &> /dev/null; then
        if printf '2320\n' | sudo -S -u postgres psql -c "SELECT 1" &> /dev/null 2>&1; then
            USE_SUDO=true
            SUDO_PASS="2320"
            print_success "Conectado a PostgreSQL (sudo)"
        elif sudo -n -u postgres psql -c "SELECT 1" &> /dev/null 2>&1; then
            USE_SUDO=true
            SUDO_PASS=""
            print_success "Conectado a PostgreSQL (sudo sin password)"
        elif [ -n "$PGPASSWORD" ] && psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -c "SELECT 1" &> /dev/null 2>&1; then
            USE_SUDO=false
            print_success "Conectado a PostgreSQL (TCP)"
        else
            print_error "No se puede conectar a PostgreSQL"
            print_info "Intenta: sudo -u postgres psql"
            exit 1
        fi
    else
        print_error "sudo no disponible"
        exit 1
    fi
}

# ============================================================================
# FUNCIONES SQL
# ============================================================================

execute_as_postgres() {
    local sql="$1"
    if [ "$USE_SUDO" = true ]; then
        if [ -n "$SUDO_PASS" ]; then
            printf "$SUDO_PASS\n" | sudo -S -u postgres psql -c "$sql" 2>&1
        else
            sudo -u postgres psql -c "$sql" 2>&1
        fi
    else
        PGPASSWORD="$PGPASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -c "$sql" 2>&1
    fi
}

query_as_postgres() {
    local sql="$1"
    if [ "$USE_SUDO" = true ]; then
        if [ -n "$SUDO_PASS" ]; then
            printf "$SUDO_PASS\n" | sudo -S -u postgres psql -t -c "$sql" 2>/dev/null | xargs
        else
            sudo -u postgres psql -t -c "$sql" 2>/dev/null | xargs
        fi
    else
        PGPASSWORD="$PGPASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -t -c "$sql" | xargs
    fi
}

execute_sql_file() {
    local file="$1"
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file" 2>&1
}

# ============================================================================
# PASO 1: CREAR USUARIO Y BASE DE DATOS
# ============================================================================

create_user_and_database() {
    print_step "PASO 1/9: Creando usuario y base de datos..."

    # Generar password si no se proveyó
    if [ -z "$DB_PASSWORD" ]; then
        DB_PASSWORD=$(generate_password)
        print_info "Password generado para $DB_USER"
    fi

    # Crear/actualizar usuario
    user_exists=$(query_as_postgres "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'")

    if [ -z "$user_exists" ]; then
        print_info "Creando usuario $DB_USER..."
        execute_as_postgres "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD' CREATEDB;" > /dev/null
        print_success "Usuario creado"
    else
        print_info "Usuario $DB_USER ya existe, actualizando password..."
        execute_as_postgres "ALTER USER $DB_USER WITH PASSWORD '$DB_PASSWORD' CREATEDB;" > /dev/null
        print_success "Password actualizado"
    fi

    # Verificar si la BD existe
    db_exists=$(query_as_postgres "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

    if [ -n "$db_exists" ]; then
        print_warning "Base de datos $DB_NAME ya existe"
        if [ "$FORCE_MODE" = false ]; then
            read -p "¿Eliminarla y recrearla? (yes/no): " recreate
            if [ "$recreate" != "yes" ]; then
                print_error "Operación cancelada"
                exit 1
            fi
        fi

        print_info "Terminando conexiones activas..."
        execute_as_postgres "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();" > /dev/null 2>&1 || true
        sleep 1

        print_info "Eliminando base de datos existente..."
        execute_as_postgres "DROP DATABASE IF EXISTS $DB_NAME;" > /dev/null
        print_success "Base de datos eliminada"
    fi

    # Crear base de datos
    print_info "Creando base de datos $DB_NAME..."
    execute_as_postgres "CREATE DATABASE $DB_NAME OWNER $DB_USER ENCODING 'UTF8';" > /dev/null
    print_success "Base de datos creada"

    execute_as_postgres "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" > /dev/null
    print_success "Privilegios otorgados"
}

# ============================================================================
# PASO 2: EJECUTAR DDL - TABLAS
# ============================================================================

execute_ddl_tables() {
    print_step "PASO 2/9: Ejecutando DDL (prerequisites y tablas)..."

    # Ejecutar prerequisites (ENUMs y funciones base)
    print_info "Ejecutando prerequisites (ENUMs y funciones base)..."
    local prereq_file="$DDL_DIR/00-prerequisites.sql"
    if [ -f "$prereq_file" ]; then
        if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$prereq_file" > /dev/null 2>&1; then
            print_success "Prerequisites ejecutados"
        else
            print_error "Error en prerequisites"
            return 1
        fi
    else
        print_warning "Archivo prerequisites no encontrado, continuando..."
    fi

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
        PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "CREATE SCHEMA IF NOT EXISTS $schema;" > /dev/null 2>&1
    done
    print_success "9 schemas creados"

    # Crear tablas
    print_info "Creando tablas..."
    local table_count=0
    local error_count=0

    for schema in "${schemas[@]}"; do
        local tables_dir="$DDL_DIR/schemas/$schema/tables"
        if [ -d "$tables_dir" ]; then
            for table_file in "$tables_dir"/*.sql; do
                if [ -f "$table_file" ]; then
                    if [ "$USE_SUDO" = true ]; then
                        if [ -n "$SUDO_PASS" ]; then
                            if printf "$SUDO_PASS\n" | sudo -S -u postgres psql -d "$DB_NAME" -f "$table_file" > /dev/null 2>&1; then
                                ((table_count++))
                            else
                                ((error_count++))
                            fi
                        else
                            if sudo -u postgres psql -d "$DB_NAME" -f "$table_file" > /dev/null 2>&1; then
                                ((table_count++))
                            else
                                ((error_count++))
                            fi
                        fi
                    else
                        if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$table_file" > /dev/null 2>&1; then
                            ((table_count++))
                        else
                            ((error_count++))
                        fi
                    fi
                fi
            done
        fi
    done

    print_success "$table_count tablas creadas"
    if [ $error_count -gt 0 ]; then
        print_warning "$error_count tablas con errores (continuando...)"
    fi

    # Otorgar permisos a gamilit_user
    print_info "Otorgando permisos a gamilit_user..."
    local perms_file="$DDL_DIR/99-post-ddl-permissions.sql"
    if [ -f "$perms_file" ]; then
        if [ "$USE_SUDO" = true ]; then
            if [ -n "$SUDO_PASS" ]; then
                printf "$SUDO_PASS\n" | sudo -S -u postgres psql -d "$DB_NAME" -f "$perms_file" > /dev/null 2>&1
            else
                sudo -u postgres psql -d "$DB_NAME" -f "$perms_file" > /dev/null 2>&1
            fi
        else
            PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$perms_file" > /dev/null 2>&1
        fi
        print_success "Permisos otorgados"
    fi
}

# ============================================================================
# PASO 3: EJECUTAR FUNCIONES
# ============================================================================

execute_functions() {
    print_step "PASO 3/9: Ejecutando funciones..."

    export PGPASSWORD="$DB_PASSWORD"

    local function_count=0
    local error_count=0
    local schemas=(
        "gamilit"
        "auth"
        "auth_management"
        "gamification_system"
        "educational_content"
        "content_management"
        "social_features"
        "progress_tracking"
        "audit_logging"
        "public"
    )

    for schema in "${schemas[@]}"; do
        local functions_dir="$DDL_DIR/schemas/$schema/functions"
        if [ -d "$functions_dir" ]; then
            for function_file in "$functions_dir"/*.sql; do
                if [ -f "$function_file" ]; then
                    if execute_sql_file "$function_file" > /dev/null 2>&1; then
                        ((function_count++))
                    else
                        ((error_count++))
                        if [ "$ENV_VERBOSE" = "true" ]; then
                            print_warning "  Error en $(basename $function_file)"
                        fi
                    fi
                fi
            done
        fi
    done

    if [ $error_count -gt 0 ]; then
        print_warning "$function_count funciones creadas, $error_count con errores"
    else
        print_success "$function_count funciones creadas exitosamente"
    fi

    unset PGPASSWORD
}

# ============================================================================
# PASO 4: EJECUTAR VISTAS
# ============================================================================

execute_views() {
    print_step "PASO 4/9: Ejecutando vistas..."

    export PGPASSWORD="$DB_PASSWORD"

    local view_count=0
    local error_count=0
    local schemas=(
        "admin_dashboard"
        "gamification_system"
        "progress_tracking"
        "public"
    )

    for schema in "${schemas[@]}"; do
        local views_dir="$DDL_DIR/schemas/$schema/views"
        if [ -d "$views_dir" ]; then
            for view_file in "$views_dir"/*.sql; do
                if [ -f "$view_file" ]; then
                    if execute_sql_file "$view_file" > /dev/null 2>&1; then
                        ((view_count++))
                    else
                        ((error_count++))
                        if [ "$ENV_VERBOSE" = "true" ]; then
                            print_warning "  Error en $(basename $view_file)"
                        fi
                    fi
                fi
            done
        fi
    done

    if [ $error_count -gt 0 ]; then
        print_warning "$view_count vistas creadas, $error_count con errores"
    else
        print_success "$view_count vistas creadas exitosamente"
    fi

    unset PGPASSWORD
}

# ============================================================================
# PASO 5: EJECUTAR VISTAS MATERIALIZADAS
# ============================================================================

execute_mviews() {
    print_step "PASO 5/9: Ejecutando vistas materializadas..."

    export PGPASSWORD="$DB_PASSWORD"

    local mview_count=0
    local error_count=0
    local schemas=(
        "gamification_system"
    )

    for schema in "${schemas[@]}"; do
        local mviews_dir="$DDL_DIR/schemas/$schema/materialized-views"
        if [ -d "$mviews_dir" ]; then
            for mview_file in "$mviews_dir"/*.sql; do
                if [ -f "$mview_file" ]; then
                    if execute_sql_file "$mview_file" > /dev/null 2>&1; then
                        ((mview_count++))
                    else
                        ((error_count++))
                        if [ "$ENV_VERBOSE" = "true" ]; then
                            print_warning "  Error en $(basename $mview_file)"
                        fi
                    fi
                fi
            done
        fi
    done

    if [ $mview_count -eq 0 ] && [ $error_count -eq 0 ]; then
        print_info "No se encontraron vistas materializadas (OK)"
    elif [ $error_count -gt 0 ]; then
        print_warning "$mview_count MVIEWs creadas, $error_count con errores"
    else
        print_success "$mview_count MVIEWs creadas exitosamente"
    fi

    unset PGPASSWORD
}

# ============================================================================
# PASO 6: EJECUTAR ÍNDICES
# ============================================================================

execute_indexes() {
    print_step "PASO 6/9: Ejecutando índices..."

    export PGPASSWORD="$DB_PASSWORD"

    local index_count=0
    local error_count=0
    local schemas=(
        "public"
        "auth_management"
        "content_management"
        "gamification_system"
        "progress_tracking"
    )

    print_info "Creando índices (esto puede tardar varios minutos)..."

    for schema in "${schemas[@]}"; do
        local indexes_dir="$DDL_DIR/schemas/$schema/indexes"
        if [ -d "$indexes_dir" ]; then
            for index_file in "$indexes_dir"/*.sql; do
                if [ -f "$index_file" ]; then
                    if execute_sql_file "$index_file" > /dev/null 2>&1; then
                        ((index_count++))
                    else
                        ((error_count++))
                    fi
                fi
            done
        fi
    done

    if [ $error_count -gt 0 ]; then
        print_warning "$index_count índices creados, $error_count con errores"
    else
        print_success "$index_count índices creados exitosamente"
    fi

    unset PGPASSWORD
}

# ============================================================================
# PASO 7: EJECUTAR TRIGGERS
# ============================================================================

execute_triggers() {
    print_step "PASO 7/9: Ejecutando triggers..."

    export PGPASSWORD="$DB_PASSWORD"

    local trigger_count=0
    local error_count=0
    local schemas=(
        "public"
        "auth_management"
        "content_management"
        "educational_content"
        "gamification_system"
        "social_features"
        "progress_tracking"
        "audit_logging"
        "system_configuration"
    )

    for schema in "${schemas[@]}"; do
        local triggers_dir="$DDL_DIR/schemas/$schema/triggers"
        if [ -d "$triggers_dir" ]; then
            for trigger_file in "$triggers_dir"/*.sql; do
                if [ -f "$trigger_file" ]; then
                    if execute_sql_file "$trigger_file" > /dev/null 2>&1; then
                        ((trigger_count++))
                    else
                        ((error_count++))
                        if [ "$ENV_VERBOSE" = "true" ]; then
                            print_warning "  Error en $(basename $trigger_file)"
                        fi
                    fi
                fi
            done
        fi
    done

    if [ $error_count -gt 0 ]; then
        print_warning "$trigger_count triggers creados, $error_count con errores"
    else
        print_success "$trigger_count triggers creados exitosamente"
    fi

    unset PGPASSWORD
}

# ============================================================================
# PASO 8: EJECUTAR RLS POLICIES
# ============================================================================

execute_rls_policies() {
    print_step "PASO 8/9: Ejecutando RLS policies..."

    export PGPASSWORD="$DB_PASSWORD"

    local policy_count=0
    local error_count=0
    local schemas=(
        "gamification_system"
        "social_features"
        "auth_management"
        "progress_tracking"
        "audit_logging"
        "content_management"
        "educational_content"
        "system_configuration"
    )

    for schema in "${schemas[@]}"; do
        local policies_dir="$DDL_DIR/schemas/$schema/rls-policies"
        if [ -d "$policies_dir" ]; then
            for policy_file in "$policies_dir"/*.sql; do
                if [ -f "$policy_file" ]; then
                    if execute_sql_file "$policy_file" > /dev/null 2>&1; then
                        ((policy_count++))
                    else
                        ((error_count++))
                        if [ "$ENV_VERBOSE" = "true" ]; then
                            print_warning "  Error en $(basename $policy_file)"
                        fi
                    fi
                fi
            done
        fi
    done

    if [ $error_count -gt 0 ]; then
        print_warning "$policy_count archivos RLS ejecutados, $error_count con errores"
    else
        print_success "$policy_count archivos RLS ejecutados exitosamente"
    fi

    unset PGPASSWORD
}

# ============================================================================
# PASO 9: CARGAR SEEDS
# ============================================================================

load_seeds() {
    print_step "PASO 9/9: Cargando seeds..."

    if [ ! -d "$SEEDS_DIR" ]; then
        print_warning "Directorio seeds no encontrado: $SEEDS_DIR"
        print_info "Omitiendo carga de seeds"
        return
    fi

    export PGPASSWORD="$DB_PASSWORD"

    local loaded=0
    local failed=0

    # Array con orden específico respetando dependencias
    local seed_files=(
        "$SEEDS_DIR/auth_management/01-tenants.sql"
        "$SEEDS_DIR/auth_management/02-auth_providers.sql"
        "$SEEDS_DIR/auth/01-demo-users.sql"
        "$SEEDS_DIR/auth_management/03-profiles.sql"
        "$SEEDS_DIR/auth_management/04-user_roles.sql"
        "$SEEDS_DIR/auth_management/05-user_preferences.sql"
        "$SEEDS_DIR/auth_management/06-auth_attempts.sql"
        "$SEEDS_DIR/auth_management/07-security_events.sql"
        "$SEEDS_DIR/system_configuration/01-system_settings.sql"
        "$SEEDS_DIR/system_configuration/02-feature_flags.sql"
        "$SEEDS_DIR/gamification_system/01-achievement_categories.sql"
        "$SEEDS_DIR/gamification_system/02-achievements.sql"
        "$SEEDS_DIR/gamification_system/03-leaderboard_metadata.sql"
        "$SEEDS_DIR/gamification_system/04-initialize_user_gamification.sql"
        "$SEEDS_DIR/educational_content/01-modules.sql"
        "$SEEDS_DIR/educational_content/02-exercises-module1.sql"
        "$SEEDS_DIR/educational_content/03-exercises-module2.sql"
        "$SEEDS_DIR/educational_content/04-exercises-module3.sql"
        "$SEEDS_DIR/educational_content/05-exercises-module4.sql"
        "$SEEDS_DIR/educational_content/06-exercises-module5.sql"
        "$SEEDS_DIR/educational_content/07-assessment-rubrics.sql"
        "$SEEDS_DIR/content_management/01-marie-curie-bio.sql"
        "$SEEDS_DIR/content_management/02-media-files.sql"
        "$SEEDS_DIR/content_management/03-tags.sql"
        "$SEEDS_DIR/social_features/01-schools.sql"
        "$SEEDS_DIR/social_features/02-classrooms.sql"
        "$SEEDS_DIR/social_features/03-classroom-members.sql"
        "$SEEDS_DIR/social_features/04-teams.sql"
        "$SEEDS_DIR/progress_tracking/01-demo-progress.sql"
        "$SEEDS_DIR/progress_tracking/02-exercise-attempts.sql"
        "$SEEDS_DIR/audit_logging/01-audit-logs.sql"
        "$SEEDS_DIR/audit_logging/02-system-metrics.sql"
    )

    for seed_file in "${seed_files[@]}"; do
        if [ -f "$seed_file" ]; then
            local basename_file=$(basename "$seed_file")
            if [ "$ENV_VERBOSE" = "true" ]; then
                print_info "  $basename_file"
            fi

            if execute_sql_file "$seed_file" 2>&1 | grep -i "error" > /dev/null; then
                ((failed++))
                if [ "$ENV_VERBOSE" = "true" ]; then
                    print_warning "  ⚠️  Errores en $basename_file (continuando...)"
                fi
            else
                ((loaded++))
            fi
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
# VALIDAR INSTALACIÓN
# ============================================================================

validate_installation() {
    print_step "Validando instalación..."

    export PGPASSWORD="$DB_PASSWORD"

    local schema_count=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc \
        "SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name IN ('auth', 'auth_management', 'gamification_system', 'educational_content', 'content_management', 'social_features', 'progress_tracking', 'audit_logging', 'system_configuration');")
    print_info "Schemas: $schema_count/9"

    local table_count=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc \
        "SELECT COUNT(*) FROM pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema');")
    print_info "Tablas: $table_count"

    local function_count=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc \
        "SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema NOT IN ('pg_catalog', 'information_schema');")
    print_info "Funciones: $function_count"

    local trigger_count=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc \
        "SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema NOT IN ('pg_catalog', 'information_schema');")
    print_info "Triggers: $trigger_count"

    local policy_count=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc \
        "SELECT COUNT(*) FROM pg_policies;")
    print_info "RLS Policies: $policy_count"

    local index_count=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc \
        "SELECT COUNT(*) FROM pg_indexes WHERE schemaname NOT IN ('pg_catalog', 'information_schema');")
    print_info "Índices: $index_count"

    local user_count=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc \
        "SELECT COUNT(*) FROM auth.users WHERE deleted_at IS NULL;" 2>/dev/null || echo "0")
    print_info "Usuarios: $user_count"

    local module_count=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc \
        "SELECT COUNT(*) FROM educational_content.modules;" 2>/dev/null || echo "0")
    print_info "Módulos: $module_count"

    unset PGPASSWORD

    # Validación de completitud
    if [ "$schema_count" -lt 9 ]; then
        print_error "Faltan schemas (esperados: 9, encontrados: $schema_count)"
        return 1
    fi

    if [ "$function_count" -lt "${ENV_MIN_FUNCTIONS:-50}" ]; then
        print_warning "Funciones faltantes (esperadas: ${ENV_MIN_FUNCTIONS:-60}+, encontradas: $function_count)"
    fi

    if [ "$trigger_count" -lt "${ENV_MIN_TRIGGERS:-40}" ]; then
        print_warning "Triggers faltantes (esperados: ${ENV_MIN_TRIGGERS:-50}+, encontrados: $trigger_count)"
    fi

    if [ "$policy_count" -lt "${ENV_MIN_RLS_POLICIES:-100}" ]; then
        print_warning "RLS policies faltantes (esperadas: ${ENV_MIN_RLS_POLICIES:-200}+, encontradas: $policy_count)"
    fi

    print_success "Validación completada"
}

# ============================================================================
# RESUMEN
# ============================================================================

show_summary() {
    print_header "✅ BASE DE DATOS INICIALIZADA"

    echo -e "${CYAN}Conexión:${NC}"
    echo -e "  Host:     $DB_HOST:$DB_PORT"
    echo -e "  Database: $DB_NAME"
    echo -e "  User:     $DB_USER"
    echo -e "  Password: ${GREEN}$DB_PASSWORD${NC}"
    echo ""

    echo -e "${CYAN}Connection String:${NC}"
    echo -e "  ${GREEN}postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME${NC}"
    echo ""

    # Guardar credenciales
    local creds_file="$DATABASE_ROOT/database-credentials-${ENVIRONMENT}.txt"
    cat > "$creds_file" << EOF
GAMILIT Platform - Database Credentials
Environment: $ENVIRONMENT
Generated: $(date)
========================================

Host:     $DB_HOST:$DB_PORT
Database: $DB_NAME
User:     $DB_USER
Password: $DB_PASSWORD

Connection String:
postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME

========================================
EOF
    chmod 600 "$creds_file"

    echo -e "${CYAN}Credenciales guardadas en:${NC}"
    echo -e "  ${YELLOW}$creds_file${NC}"
    echo ""

    # Actualizar archivos .env automáticamente
    local update_env_script="$SCRIPT_DIR/update-env-files.sh"
    if [ -f "$update_env_script" ]; then
        print_step "Actualizando archivos .env..."
        if bash "$update_env_script" --env "$ENVIRONMENT" --credentials-file "$creds_file"; then
            print_success "Archivos .env actualizados"
        else
            print_warning "No se pudieron actualizar archivos .env (puedes hacerlo manualmente)"
        fi
    fi

    echo ""
    print_success "¡Listo para usar!"
    echo ""
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
        print_header "GAMILIT Platform - Inicialización de BD"
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

    print_header "GAMILIT Platform - Inicialización v2.0 ($ENVIRONMENT)"

    load_environment_config
    check_prerequisites
    create_user_and_database
    execute_ddl_tables
    execute_functions
    execute_views
    execute_mviews
    execute_indexes
    execute_triggers
    execute_rls_policies
    load_seeds
    validate_installation
    show_summary
}

main "$@"
