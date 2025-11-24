#!/bin/bash
##############################################################################
# GAMILIT Platform - Environment Files Updater
#
# Propósito: Sincronizar credenciales de BD y secrets a archivos .env
#
# Uso:
#   ./update-env-files.sh --env dev|prod --credentials-file FILE
#   ./update-env-files.sh --env dev    # Busca database-credentials-dev.txt
#
# Funcionalidades:
#   1. Lee credenciales desde database-credentials-{env}.txt
#   2. Genera JWT secrets si no existen
#   3. Actualiza múltiples archivos .env:
#      - apps/backend/.env.{env}
#      - apps/database/.env.{env}
#      - ../../gamilit-deployment-scripts/.env.{env}
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
APPS_ROOT="$(cd "$DATABASE_ROOT/.." && pwd)"
GAMILIT_ROOT="$(cd "$APPS_ROOT/.." && pwd)"
WORKSPACE_ROOT="$(cd "$GAMILIT_ROOT/../../.." && pwd)"
DEPLOYMENT_SCRIPTS="$WORKSPACE_ROOT/projects/gamilit-deployment-scripts"

# Variables
ENVIRONMENT=""
CREDENTIALS_FILE=""
DB_HOST=""
DB_PORT=""
DB_NAME=""
DB_USER=""
DB_PASSWORD=""
JWT_SECRET=""
JWT_REFRESH_SECRET=""

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
GAMILIT Platform - Actualizador de Archivos .env

Uso: $0 [OPCIONES]

Opciones:
  --env dev|prod              Ambiente (dev o prod)
  --credentials-file FILE     Archivo de credenciales (opcional)
  --help                      Mostrar ayuda

Ejemplos:
  $0 --env dev
  $0 --env prod --credentials-file /path/to/credentials.txt

Archivos que actualiza:
  - apps/backend/.env.{env}
  - apps/database/.env.{env}
  - ../../gamilit-deployment-scripts/.env.{env}

EOF
}

# ============================================================================
# LEER CREDENCIALES
# ============================================================================

read_credentials() {
    print_step "Leyendo credenciales de BD..."

    if [ -z "$CREDENTIALS_FILE" ]; then
        CREDENTIALS_FILE="$DATABASE_ROOT/database-credentials-${ENVIRONMENT}.txt"
    fi

    if [ ! -f "$CREDENTIALS_FILE" ]; then
        print_error "Archivo de credenciales no encontrado: $CREDENTIALS_FILE"
        exit 1
    fi

    # Parsear archivo de credenciales
    DB_HOST=$(grep "^Host:" "$CREDENTIALS_FILE" | awk '{print $2}' | cut -d: -f1)
    DB_PORT=$(grep "^Host:" "$CREDENTIALS_FILE" | awk '{print $2}' | cut -d: -f2)
    DB_NAME=$(grep "^Database:" "$CREDENTIALS_FILE" | awk '{print $2}')
    DB_USER=$(grep "^User:" "$CREDENTIALS_FILE" | awk '{print $2}')
    DB_PASSWORD=$(grep "^Password:" "$CREDENTIALS_FILE" | awk '{print $2}')

    # Validar que se leyeron todos los valores
    if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ] || [ -z "$DB_NAME" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ]; then
        print_error "No se pudieron leer todas las credenciales del archivo"
        exit 1
    fi

    print_success "Credenciales leídas"
    print_info "Host: $DB_HOST:$DB_PORT"
    print_info "Database: $DB_NAME"
    print_info "User: $DB_USER"
}

# ============================================================================
# GENERAR JWT SECRETS
# ============================================================================

generate_jwt_secrets() {
    print_step "Generando JWT secrets..."

    # Verificar si openssl está disponible
    if ! command -v openssl &> /dev/null; then
        print_error "OpenSSL no encontrado. Instálalo primero."
        exit 1
    fi

    # Generar secrets
    JWT_SECRET=$(openssl rand -base64 32)
    JWT_REFRESH_SECRET=$(openssl rand -base64 32)

    print_success "JWT secrets generados"
}

# ============================================================================
# ACTUALIZAR ARCHIVO .ENV
# ============================================================================

update_env_file() {
    local env_file="$1"
    local env_name="$2"

    print_step "Actualizando $env_name..."

    # Crear directorio si no existe
    local dir=$(dirname "$env_file")
    mkdir -p "$dir"

    # Determinar si es archivo nuevo o existente
    if [ -f "$env_file" ]; then
        print_info "Actualizando archivo existente"
        # Crear backup
        cp "$env_file" "${env_file}.backup.$(date +%Y%m%d_%H%M%S)"

        # Actualizar valores existentes
        sed -i "s|^DB_HOST=.*|DB_HOST=$DB_HOST|" "$env_file"
        sed -i "s|^DB_PORT=.*|DB_PORT=$DB_PORT|" "$env_file"
        sed -i "s|^DB_NAME=.*|DB_NAME=$DB_NAME|" "$env_file"
        sed -i "s|^DB_USER=.*|DB_USER=$DB_USER|" "$env_file"
        sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=$DB_PASSWORD|" "$env_file"
        sed -i "s|^DATABASE_URL=.*|DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME|" "$env_file"

        # Actualizar JWT secrets si las líneas existen
        if grep -q "^JWT_SECRET=" "$env_file"; then
            sed -i "s|^JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" "$env_file"
        else
            echo "JWT_SECRET=$JWT_SECRET" >> "$env_file"
        fi

        if grep -q "^JWT_REFRESH_SECRET=" "$env_file"; then
            sed -i "s|^JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET|" "$env_file"
        else
            echo "JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET" >> "$env_file"
        fi

        if grep -q "^VITE_JWT_SECRET=" "$env_file"; then
            sed -i "s|^VITE_JWT_SECRET=.*|VITE_JWT_SECRET=$JWT_SECRET|" "$env_file"
        fi
    else
        print_info "Creando archivo nuevo"
        # Crear archivo nuevo con template básico
        cat > "$env_file" << EOF
# ============================================================================
# GAMILIT Platform - $ENVIRONMENT Environment
# Generated: $(date)
# ============================================================================

# Database Configuration
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME

# Pool Configuration
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_SSL=false

# JWT Authentication
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# VITE Frontend
VITE_JWT_SECRET=$JWT_SECRET

# Environment
NODE_ENV=$ENVIRONMENT
APP_ENV=$ENVIRONMENT
EOF
    fi

    # Asegurar permisos restringidos
    chmod 600 "$env_file"

    print_success "Archivo actualizado: $env_file"
}

# ============================================================================
# MAIN
# ============================================================================

main() {
    # Parsear argumentos
    while [[ $# -gt 0 ]]; do
        case $1 in
            --env)
                ENVIRONMENT="$2"
                shift 2
                ;;
            --credentials-file)
                CREDENTIALS_FILE="$2"
                shift 2
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

    # Validar argumentos
    if [ -z "$ENVIRONMENT" ]; then
        print_error "Debe especificar --env dev|prod"
        show_help
        exit 1
    fi

    if [ "$ENVIRONMENT" != "dev" ] && [ "$ENVIRONMENT" != "prod" ]; then
        print_error "Ambiente debe ser 'dev' o 'prod'"
        exit 1
    fi

    print_header "🔧 ACTUALIZADOR DE ARCHIVOS .ENV - $ENVIRONMENT"

    # Ejecutar pasos
    read_credentials
    generate_jwt_secrets

    echo ""
    print_header "Actualizando archivos .env"

    # Actualizar apps/backend/.env.{env}
    BACKEND_ENV="$APPS_ROOT/backend/.env.$ENVIRONMENT"
    update_env_file "$BACKEND_ENV" "Backend .env.$ENVIRONMENT"

    # Actualizar apps/database/.env.{env}
    DATABASE_ENV="$DATABASE_ROOT/.env.$ENVIRONMENT"
    update_env_file "$DATABASE_ENV" "Database .env.$ENVIRONMENT"

    # Actualizar deployment-scripts/.env.{env}
    if [ -d "$DEPLOYMENT_SCRIPTS" ]; then
        DEPLOY_ENV="$DEPLOYMENT_SCRIPTS/.env.$ENVIRONMENT"
        update_env_file "$DEPLOY_ENV" "Deployment .env.$ENVIRONMENT"
    else
        print_warning "Carpeta deployment-scripts no encontrada, omitiendo"
    fi

    echo ""
    print_header "✅ ARCHIVOS .ENV ACTUALIZADOS"
    print_info "Ambiente: $ENVIRONMENT"
    print_info "Database: $DB_NAME"
    print_info ""
    print_info "Archivos actualizados:"
    [ -f "$BACKEND_ENV" ] && print_info "  - $BACKEND_ENV"
    [ -f "$DATABASE_ENV" ] && print_info "  - $DATABASE_ENV"
    [ -f "$DEPLOY_ENV" ] && print_info "  - $DEPLOY_ENV"
    echo ""
}

main "$@"
