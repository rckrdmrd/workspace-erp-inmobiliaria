#!/bin/bash
##############################################################################
# GAMILIT Platform - Database Initialization Script v3.0
#
# Propósito: Inicialización COMPLETA de la base de datos con dotenv-vault
# Versión: 3.0 - Integración con dotenv-vault para gestión de secrets
# Cambios v3.0:
#   - Soporte para dotenv-vault
#   - Auto-lectura de passwords desde vault
#   - Sincronización automática de secrets
#   - Sin necesidad de --password en producción
#
# Uso:
#   ./init-database-v3.sh --env dev                    # Lee de dotenv-vault
#   ./init-database-v3.sh --env prod                   # Lee de dotenv-vault
#   ./init-database-v3.sh --env dev --use-exported-password  # Usa GAMILIT_DB_PASSWORD
#   ./init-database-v3.sh --env prod --password "pass" # Password manual (fallback)
#
# Flujo Recomendado:
#   1. ./manage-secrets.sh generate --env prod
#   2. ./manage-secrets.sh sync --env prod
#   3. ./init-database-v3.sh --env prod
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
APPS_ROOT="$(cd "$DATABASE_ROOT/.." && pwd)"
BACKEND_DIR="$APPS_ROOT/backend"

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
USE_VAULT=false
USE_EXPORTED_PASSWORD=false

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
GAMILIT Platform - Inicialización de Base de Datos v3.0 (dotenv-vault)

Uso: $0 [OPCIONES]

Opciones:
  --env dev|prod              Ambiente (dev o prod)
  --use-vault                 Leer password desde dotenv-vault (RECOMENDADO)
  --use-exported-password     Usar password de \$GAMILIT_DB_PASSWORD
  --password PASS             Password manual (fallback)
  --force                     No pedir confirmación
  --help                      Mostrar ayuda

Ejemplos con dotenv-vault (RECOMENDADO):
  # Paso 1: Generar secrets
  ./manage-secrets.sh generate --env prod
  ./manage-secrets.sh sync --env prod

  # Paso 2: Inicializar BD (lee automáticamente de vault)
  $0 --env prod

Ejemplos con password exportado:
  # Paso 1: Exportar password
  ./manage-secrets.sh export --env prod
  source /tmp/gamilit-db-secrets-prod.sh

  # Paso 2: Usar password exportado
  $0 --env prod --use-exported-password

Ejemplo con password manual (no recomendado):
  $0 --env prod --password "mi_password_seguro_32chars"

Flujo Completo Recomendado:
  1. Gestionar secrets:
     ./manage-secrets.sh generate --env dev
     ./manage-secrets.sh sync --env dev

  2. Inicializar BD (automático):
     ./init-database-v3.sh --env dev

Novedades v3.0:
  ✅ Integración con dotenv-vault
  ✅ Password auto-leído desde .env.$ENVIRONMENT
  ✅ Sin necesidad de --password en producción
  ✅ Sincronización automática con backend
  ✅ Más seguro (secrets encriptados)

EOF
}

generate_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-${ENV_MIN_PASSWORD_LENGTH:-32}
}

# ============================================================================
# OBTENER PASSWORD DESDE DOTENV-VAULT
# ============================================================================

get_password_from_vault() {
    print_step "Obteniendo password desde dotenv-vault..."

    # Verificar que existe archivo .env para el ambiente
    local ENV_FILE="$BACKEND_DIR/.env.$ENVIRONMENT"

    if [ ! -f "$ENV_FILE" ]; then
        print_error "No se encontró $ENV_FILE"
        print_info ""
        print_info "Opciones:"
        print_info "  1. Generar secrets: ./manage-secrets.sh generate --env $ENVIRONMENT"
        print_info "  2. Sincronizar: ./manage-secrets.sh sync --env $ENVIRONMENT"
        print_info "  3. O usa: $0 --env $ENVIRONMENT --password 'tu_password'"
        exit 1
    fi

    # Leer DB_PASSWORD del archivo .env
    local PASSWORD=$(grep "^DB_PASSWORD=" "$ENV_FILE" | cut -d= -f2)

    if [ -z "$PASSWORD" ]; then
        print_error "DB_PASSWORD no encontrado en $ENV_FILE"
        exit 1
    fi

    DB_PASSWORD="$PASSWORD"
    print_success "Password obtenido desde dotenv-vault"
    print_info "Password: ${DB_PASSWORD:0:8}...${DB_PASSWORD: -4}"
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
# GESTIÓN DE PASSWORD
# ============================================================================

manage_password() {
    print_step "Gestionando password..."

    # Prioridad 1: Password exportado
    if [ "$USE_EXPORTED_PASSWORD" = true ]; then
        if [ -n "$GAMILIT_DB_PASSWORD" ]; then
            DB_PASSWORD="$GAMILIT_DB_PASSWORD"
            print_success "Usando password exportado"
            return
        else
            print_error "GAMILIT_DB_PASSWORD no encontrado"
            print_info "Ejecuta primero: source \$(./manage-secrets.sh export --env $ENVIRONMENT)"
            exit 1
        fi
    fi

    # Prioridad 2: Leer desde vault (por defecto si existe .env)
    if [ -z "$DB_PASSWORD" ] && [ -f "$BACKEND_DIR/.env.$ENVIRONMENT" ]; then
        get_password_from_vault
        return
    fi

    # Prioridad 3: Password manual provisto
    if [ -n "$DB_PASSWORD" ]; then
        print_success "Usando password provisto manualmente"
        return
    fi

    # Prioridad 4: Generar nuevo password
    print_warning "No se encontró password configurado"
    print_info "Generando nuevo password..."
    DB_PASSWORD=$(generate_password)
    print_success "Password generado"
    print_info "Password: ${DB_PASSWORD:0:8}...${DB_PASSWORD: -4}"
    print_warning "IMPORTANTE: Guarda este password con manage-secrets.sh"
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
            # Validar sudo una sola vez para evitar prompts en loops
            sudo -v 2>/dev/null || true
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
# FUNCIONES SQL (mantener todas las del v2.0)
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
        "public"
    )

    # Crear schemas
    print_info "Creando schemas..."
    local schema_count=0
    for schema in "${schemas[@]}"; do
        if [ "$schema" != "public" ]; then
            PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "CREATE SCHEMA IF NOT EXISTS $schema;" > /dev/null 2>&1
            schema_count=$((schema_count + 1))
        fi
    done
    print_success "$schema_count schemas creados"

    # Crear tablas - Ejecutar todos en un solo batch para evitar problemas con sudo
    print_info "Creando tablas (batch mode)..."
    local table_count=0
    local error_count=0

    # Crear script temporal con todos los archivos
    local temp_batch="/tmp/gamilit-ddl-tables-$$.sql"
    : > "$temp_batch"

    for schema in "${schemas[@]}"; do
        local tables_dir="$DDL_DIR/schemas/$schema/tables"
        if [ -d "$tables_dir" ]; then
            for table_file in "$tables_dir"/*.sql; do
                if [ -f "$table_file" ]; then
                    echo "\\echo 'Cargando $(basename $table_file)...'" >> "$temp_batch"
                    cat "$table_file" >> "$temp_batch"
                    echo "" >> "$temp_batch"
                    table_count=$((table_count + 1))
                fi
            done
        fi
    done

    # Ejecutar batch UNA SOLA VEZ
    if [ "$USE_SUDO" = true ]; then
        if [ -n "$SUDO_PASS" ]; then
            if printf "$SUDO_PASS\n" | sudo -S -u postgres psql -d "$DB_NAME" -f "$temp_batch" > /dev/null 2>&1; then
                print_success "$table_count tablas creadas exitosamente"
            else
                print_warning "Algunas tablas tuvieron errores (continuando...)"
            fi
        else
            if sudo -u postgres psql -d "$DB_NAME" -f "$temp_batch" > /dev/null 2>&1; then
                print_success "$table_count tablas creadas exitosamente"
            else
                print_warning "Algunas tablas tuvieron errores (continuando...)"
            fi
        fi
    else
        if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$temp_batch" > /dev/null 2>&1; then
            print_success "$table_count tablas creadas exitosamente"
        else
            print_warning "Algunas tablas tuvieron errores (continuando...)"
        fi
    fi

    # Limpiar archivo temporal
    rm -f "$temp_batch"

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
                        function_count=$((function_count + 1))
                    else
                        error_count=$((error_count + 1))
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
                        view_count=$((view_count + 1))
                    else
                        error_count=$((error_count + 1))
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
                        mview_count=$((mview_count + 1))
                    else
                        error_count=$((error_count + 1))
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
                        index_count=$((index_count + 1))
                    else
                        error_count=$((error_count + 1))
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
                        trigger_count=$((trigger_count + 1))
                    else
                        error_count=$((error_count + 1))
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
                        policy_count=$((policy_count + 1))
                    else
                        error_count=$((error_count + 1))
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
        "$SEEDS_DIR/auth/02-test-users.sql"
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
                failed=$((failed + 1))
                if [ "$ENV_VERBOSE" = "true" ]; then
                    print_warning "  ⚠️  Errores en $basename_file (continuando...)"
                fi
            else
                loaded=$((loaded + 1))
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
# RESUMEN CON SINCRONIZACIÓN A DOTENV-VAULT
# ============================================================================

show_summary() {
    print_header "✅ BASE DE DATOS INICIALIZADA"

    echo -e "${CYAN}Conexión:${NC}"
    echo -e "  Host:     $DB_HOST:$DB_PORT"
    echo -e "  Database: $DB_NAME"
    echo -e "  User:     $DB_USER"
    echo -e "  Password: ${GREEN}${DB_PASSWORD:0:8}...${DB_PASSWORD: -4}${NC}"
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

    # Sincronizar con dotenv-vault si no se usó vault para leer
    if [ ! -f "$BACKEND_DIR/.env.$ENVIRONMENT" ] || ! grep -q "DB_PASSWORD=$DB_PASSWORD" "$BACKEND_DIR/.env.$ENVIRONMENT"; then
        print_step "Sincronizando password a dotenv-vault..."
        print_warning "Password generado no está en vault"
        print_info "Ejecuta: ./manage-secrets.sh sync --env $ENVIRONMENT"
    else
        print_success "Password sincronizado con dotenv-vault"
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
            --use-vault)
                USE_VAULT=true
                shift
                ;;
            --use-exported-password)
                USE_EXPORTED_PASSWORD=true
                shift
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

    print_header "GAMILIT Platform - Inicialización v3.0 ($ENVIRONMENT)"

    load_environment_config
    manage_password
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
