#!/bin/bash
##############################################################################
# GAMILIT Platform - Database Initialization Script
#
# Propósito: Inicialización COMPLETA de la base de datos
#
# Uso:
#   ./init-database.sh                  # Modo interactivo
#   ./init-database.sh --env dev        # Desarrollo
#   ./init-database.sh --env prod       # Producción
#   ./init-database.sh --env dev --force # Sin confirmación
#
# Funcionalidades:
#   1. Crea usuario PostgreSQL gamilit_user (si no existe)
#   2. Crea base de datos gamilit_platform
#   3. Ejecuta todos los DDL (schemas, tablas, enums)
#   4. Carga todos los seeds (32 archivos)
#   5. Valida instalación
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

# Variables de configuración
ENVIRONMENT=""
FORCE_MODE=false
DB_PASSWORD=""

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
GAMILIT Platform - Inicialización de Base de Datos

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

EOF
}

generate_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
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
        print_error "Directorio seeds no encontrado: $SEEDS_DIR"
        exit 1
    fi
    print_success "Directorio seeds encontrado"

    # Verificar conexión PostgreSQL
    # Intentar con sudo usando password si está disponible
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
    print_step "PASO 1/4: Creando usuario y base de datos..."

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
# PASO 2: EJECUTAR DDL
# ============================================================================

execute_ddl() {
    print_step "PASO 2/4: Ejecutando DDL..."

    # Ejecutar prerequisites (ENUMs y funciones)
    print_info "Ejecutando prerequisites (ENUMs y funciones)..."
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

    # Crear tablas usando postgres user (para ownership)
    print_info "Creando tablas..."
    local table_count=0
    local error_count=0

    for schema in "${schemas[@]}"; do
        local tables_dir="$DDL_DIR/schemas/$schema/tables"
        if [ -d "$tables_dir" ]; then
            for table_file in "$tables_dir"/*.sql; do
                if [ -f "$table_file" ]; then
                    # Ejecutar como postgres si USE_SUDO está disponible
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
                        # Ejecutar como gamilit_user
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
    else
        print_warning "Archivo de permisos no encontrado: $perms_file"
    fi
}

# ============================================================================
# PASO 3: CARGAR SEEDS
# ============================================================================

load_seeds() {
    print_step "PASO 3/4: Cargando seeds..."

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
# PASO 4: VALIDAR
# ============================================================================

validate_installation() {
    print_step "PASO 4/4: Validando instalación..."

    export PGPASSWORD="$DB_PASSWORD"

    local schema_count=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc \
        "SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name IN ('auth', 'auth_management', 'gamification_system', 'educational_content', 'content_management', 'social_features', 'progress_tracking', 'audit_logging', 'system_configuration');")
    print_info "Schemas: $schema_count/9"

    local table_count=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc \
        "SELECT COUNT(*) FROM pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema');")
    print_info "Tablas: $table_count"

    local user_count=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc \
        "SELECT COUNT(*) FROM auth.users WHERE deleted_at IS NULL;" 2>/dev/null || echo "0")
    print_info "Usuarios: $user_count"

    local module_count=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -tAc \
        "SELECT COUNT(*) FROM educational_content.modules;" 2>/dev/null || echo "0")
    print_info "Módulos: $module_count"

    unset PGPASSWORD

    if [ "$schema_count" -lt 9 ]; then
        print_error "Faltan schemas"
        return 1
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
    else
        print_warning "Script update-env-files.sh no encontrado, omitiendo actualización de .env"
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

    print_header "GAMILIT Platform - Inicialización ($ENVIRONMENT)"

    check_prerequisites
    create_user_and_database
    execute_ddl
    load_seeds
    validate_installation
    show_summary
}

main "$@"
