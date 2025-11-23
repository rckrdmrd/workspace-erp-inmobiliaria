#!/bin/bash
##############################################################################
# GAMILIT Platform - Secrets Management with dotenv-vault
#
# Propósito: Gestión centralizada de secrets con dotenv-vault
#
# Funcionalidades:
#   1. Genera passwords seguros para BD
#   2. Guarda en dotenv-vault (dev y prod)
#   3. Sincroniza automáticamente con backend
#   4. Exporta para uso en scripts de BD
#   5. Rotación de passwords
#
# Uso:
#   ./manage-secrets.sh generate --env dev|prod      # Generar nuevos secrets
#   ./manage-secrets.sh sync --env dev|prod          # Sincronizar a backend
#   ./manage-secrets.sh rotate --env dev|prod        # Rotar passwords
#   ./manage-secrets.sh export --env dev|prod        # Exportar para uso
#   ./manage-secrets.sh status --env dev|prod        # Ver estado
#
# Requisitos:
#   - dotenv-vault CLI instalado (npm install -g dotenv-vault)
#   - Acceso a dotenv-vault keys
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
BACKEND_DIR="$APPS_ROOT/backend"
GAMILIT_ROOT="$(cd "$APPS_ROOT/.." && pwd)"

# Variables
ENVIRONMENT=""
COMMAND=""
FORCE_MODE=false

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
GAMILIT Platform - Secrets Management con dotenv-vault

Uso: $0 COMMAND --env ENVIRONMENT [OPTIONS]

Comandos:
  generate    Generar nuevos secrets (DB password, JWT secrets)
  sync        Sincronizar secrets a dotenv-vault
  rotate      Rotar passwords existentes
  export      Exportar secrets para uso en scripts
  status      Mostrar estado de secrets
  init        Inicializar dotenv-vault (primera vez)

Opciones:
  --env dev|prod    Ambiente
  --force           No pedir confirmación
  --help            Mostrar ayuda

Ejemplos:
  # Generar secrets para desarrollo
  $0 generate --env dev

  # Sincronizar a dotenv-vault y backend
  $0 sync --env dev

  # Rotar password de producción
  $0 rotate --env prod

  # Exportar para init-database.sh
  $0 export --env prod

  # Ver estado de secrets
  $0 status --env dev

Flujo Recomendado:
  1. Primera vez: ./manage-secrets.sh init --env dev
  2. Generar: ./manage-secrets.sh generate --env dev
  3. Sincronizar: ./manage-secrets.sh sync --env dev
  4. Usar en BD: ./init-database-v2.sh --env dev --use-vault

EOF
}

generate_password() {
    local length=${1:-32}
    openssl rand -base64 48 | tr -d "=+/" | cut -c1-$length
}

generate_jwt_secret() {
    openssl rand -base64 64 | tr -d "=+/"
}

# ============================================================================
# VERIFICAR PREREQUISITOS
# ============================================================================

check_prerequisites() {
    print_step "Verificando prerequisitos..."

    # Verificar openssl
    if ! command -v openssl &> /dev/null; then
        print_error "openssl no encontrado"
        exit 1
    fi

    # Verificar dotenv-vault CLI
    if ! command -v npx &> /dev/null; then
        print_error "npx no encontrado. Instala Node.js primero."
        exit 1
    fi

    # Verificar que existe directorio backend
    if [ ! -d "$BACKEND_DIR" ]; then
        print_error "Directorio backend no encontrado: $BACKEND_DIR"
        exit 1
    fi

    print_success "Prerequisites OK"
}

# ============================================================================
# COMANDO: INIT - Inicializar dotenv-vault
# ============================================================================

cmd_init() {
    print_header "Inicializando dotenv-vault para $ENVIRONMENT"

    cd "$BACKEND_DIR"

    # Verificar si ya existe .env.vault
    if [ -f ".env.vault" ]; then
        print_warning ".env.vault ya existe"
        if [ "$FORCE_MODE" = false ]; then
            read -p "¿Reinicializar? (yes/no): " reinit
            if [ "$reinit" != "yes" ]; then
                print_info "Operación cancelada"
                exit 0
            fi
        fi
    fi

    print_step "Inicializando dotenv-vault..."

    # Inicializar dotenv-vault
    if npx dotenv-vault new; then
        print_success "dotenv-vault inicializado"
    else
        print_error "Error al inicializar dotenv-vault"
        exit 1
    fi

    print_info "Próximos pasos:"
    print_info "1. Ejecuta: ./manage-secrets.sh generate --env $ENVIRONMENT"
    print_info "2. Ejecuta: ./manage-secrets.sh sync --env $ENVIRONMENT"
}

# ============================================================================
# COMANDO: GENERATE - Generar nuevos secrets
# ============================================================================

cmd_generate() {
    print_header "Generando secrets para $ENVIRONMENT"

    # Generar secrets
    print_step "Generando passwords y secrets..."

    local DB_PASSWORD=$(generate_password 32)
    local JWT_SECRET=$(generate_jwt_secret)
    local JWT_REFRESH_SECRET=$(generate_jwt_secret)
    local ENCRYPTION_KEY=$(generate_jwt_secret)

    print_success "Secrets generados"

    # Determinar host según ambiente
    local DB_HOST="localhost"
    local DB_SSL="false"
    if [ "$ENVIRONMENT" = "prod" ]; then
        DB_HOST="74.208.126.102"
        DB_SSL="true"
    fi

    # Crear archivo temporal con secrets
    local TEMP_ENV_FILE="/tmp/gamilit-secrets-${ENVIRONMENT}-$(date +%s).env"

    cat > "$TEMP_ENV_FILE" << EOF
# ============================================================================
# GAMILIT Platform - Secrets for $ENVIRONMENT
# Generated: $(date)
# ⚠️  Este archivo contiene información sensible - NO COMMITEAR
# ============================================================================

# Database Configuration
DB_HOST=$DB_HOST
DB_PORT=5432
DB_NAME=gamilit_platform
DB_USER=gamilit_user
DB_PASSWORD=$DB_PASSWORD
DATABASE_URL=postgresql://gamilit_user:$DB_PASSWORD@$DB_HOST:5432/gamilit_platform

# Database Pool
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_SSL=$DB_SSL

# JWT Authentication
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Encryption
ENCRYPTION_KEY=$ENCRYPTION_KEY

# Environment
NODE_ENV=$ENVIRONMENT
APP_ENV=$ENVIRONMENT

# API Keys (CONFIGURAR MANUALMENTE)
OPENAI_API_KEY=PENDIENTE_CONFIGURACION
SENDGRID_API_KEY=PENDIENTE_CONFIGURACION

# OAuth (CONFIGURAR MANUALMENTE)
GOOGLE_CLIENT_ID=PENDIENTE_CONFIGURACION
GOOGLE_CLIENT_SECRET=PENDIENTE_CONFIGURACION

# Frontend (Vite)
VITE_JWT_SECRET=$JWT_SECRET
VITE_API_URL=http://localhost:3006
EOF

    chmod 600 "$TEMP_ENV_FILE"

    print_success "Archivo de secrets creado"
    print_info "Ubicación: $TEMP_ENV_FILE"
    echo ""

    # Mostrar secrets generados (parcialmente ocultos)
    echo -e "${CYAN}Secrets Generados:${NC}"
    echo -e "  DB_PASSWORD:        ${GREEN}${DB_PASSWORD:0:8}...${DB_PASSWORD: -4}${NC}"
    echo -e "  JWT_SECRET:         ${GREEN}${JWT_SECRET:0:12}...${JWT_SECRET: -4}${NC}"
    echo -e "  JWT_REFRESH_SECRET: ${GREEN}${JWT_REFRESH_SECRET:0:12}...${JWT_REFRESH_SECRET: -4}${NC}"
    echo ""

    # Guardar referencia al archivo temporal
    echo "$TEMP_ENV_FILE" > "/tmp/gamilit-secrets-${ENVIRONMENT}-latest.txt"

    print_info "Próximo paso: ./manage-secrets.sh sync --env $ENVIRONMENT"
}

# ============================================================================
# COMANDO: SYNC - Sincronizar a dotenv-vault
# ============================================================================

cmd_sync() {
    print_header "Sincronizando secrets a dotenv-vault para $ENVIRONMENT"

    # Leer archivo temporal más reciente
    local LATEST_FILE_REF="/tmp/gamilit-secrets-${ENVIRONMENT}-latest.txt"
    if [ ! -f "$LATEST_FILE_REF" ]; then
        print_error "No se encontró archivo de secrets generado"
        print_info "Primero ejecuta: ./manage-secrets.sh generate --env $ENVIRONMENT"
        exit 1
    fi

    local TEMP_ENV_FILE=$(cat "$LATEST_FILE_REF")
    if [ ! -f "$TEMP_ENV_FILE" ]; then
        print_error "Archivo de secrets no encontrado: $TEMP_ENV_FILE"
        exit 1
    fi

    print_step "Sincronizando secrets..."

    cd "$BACKEND_DIR"

    # Backup del .env actual si existe
    if [ -f ".env.$ENVIRONMENT" ]; then
        cp ".env.$ENVIRONMENT" ".env.$ENVIRONMENT.backup.$(date +%Y%m%d_%H%M%S)"
        print_info "Backup creado: .env.$ENVIRONMENT.backup"
    fi

    # Copiar secrets al archivo .env del ambiente
    cp "$TEMP_ENV_FILE" ".env.$ENVIRONMENT"
    print_success "Secrets copiados a .env.$ENVIRONMENT"

    # Sincronizar con dotenv-vault
    print_step "Subiendo secrets a dotenv-vault..."

    if npx dotenv-vault push "$ENVIRONMENT"; then
        print_success "Secrets sincronizados a dotenv-vault"
    else
        print_error "Error al sincronizar con dotenv-vault"
        exit 1
    fi

    # Limpiar archivo temporal
    rm -f "$TEMP_ENV_FILE"
    rm -f "$LATEST_FILE_REF"

    print_success "Sincronización completada"

    # Actualizar también frontend si existe
    if [ -d "$APPS_ROOT/frontend" ]; then
        print_step "Actualizando frontend..."
        local FRONTEND_ENV="$APPS_ROOT/frontend/.env.$ENVIRONMENT"

        cat > "$FRONTEND_ENV" << EOF
# ============================================================================
# GAMILIT Platform Frontend - $ENVIRONMENT
# Generated: $(date)
# ============================================================================

VITE_API_URL=http://localhost:3006
VITE_JWT_SECRET=$(grep "^JWT_SECRET=" "$BACKEND_DIR/.env.$ENVIRONMENT" | cut -d= -f2)
VITE_ENVIRONMENT=$ENVIRONMENT
EOF
        chmod 600 "$FRONTEND_ENV"
        print_success "Frontend .env.$ENVIRONMENT actualizado"
    fi

    echo ""
    print_info "Secrets disponibles en:"
    print_info "  • dotenv-vault (encriptado)"
    print_info "  • $BACKEND_DIR/.env.$ENVIRONMENT"
    print_info "  • $APPS_ROOT/frontend/.env.$ENVIRONMENT"
}

# ============================================================================
# COMANDO: EXPORT - Exportar secrets para scripts
# ============================================================================

cmd_export() {
    print_header "Exportando secrets para scripts de BD ($ENVIRONMENT)"

    cd "$BACKEND_DIR"

    # Verificar que existe .env para el ambiente
    if [ ! -f ".env.$ENVIRONMENT" ]; then
        print_error "No se encontró .env.$ENVIRONMENT"
        print_info "Primero ejecuta: ./manage-secrets.sh generate --env $ENVIRONMENT"
        print_info "Luego: ./manage-secrets.sh sync --env $ENVIRONMENT"
        exit 1
    fi

    # Exportar secrets desde dotenv-vault
    print_step "Obteniendo secrets desde dotenv-vault..."

    # Extraer DB_PASSWORD del .env
    local DB_PASSWORD=$(grep "^DB_PASSWORD=" ".env.$ENVIRONMENT" | cut -d= -f2)

    if [ -z "$DB_PASSWORD" ]; then
        print_error "DB_PASSWORD no encontrado en .env.$ENVIRONMENT"
        exit 1
    fi

    # Crear script temporal para exportar
    local EXPORT_FILE="/tmp/gamilit-db-secrets-${ENVIRONMENT}.sh"

    cat > "$EXPORT_FILE" << EOF
#!/bin/bash
# ============================================================================
# GAMILIT Platform - Database Secrets Export
# Environment: $ENVIRONMENT
# Generated: $(date)
# ⚠️  Este archivo se auto-destruye después de 1 hora
# ============================================================================

export GAMILIT_ENV="$ENVIRONMENT"
export GAMILIT_DB_PASSWORD="$DB_PASSWORD"

echo "✓ Secrets exportados para $ENVIRONMENT"
echo "  DB_PASSWORD: ${DB_PASSWORD:0:8}...${DB_PASSWORD: -4}"
echo ""
echo "Uso: source $EXPORT_FILE"
echo "Luego: ./init-database-v2.sh --env $ENVIRONMENT --use-exported-password"
EOF

    chmod 600 "$EXPORT_FILE"

    print_success "Secrets exportados"
    echo ""
    echo -e "${CYAN}Para usar en init-database.sh:${NC}"
    echo -e "  ${GREEN}source $EXPORT_FILE${NC}"
    echo -e "  ${GREEN}./init-database-v2.sh --env $ENVIRONMENT --use-exported-password${NC}"
    echo ""

    # Programar auto-destrucción en 1 hora
    (sleep 3600 && rm -f "$EXPORT_FILE" 2>/dev/null) &

    print_warning "Este archivo se auto-destruirá en 1 hora"
}

# ============================================================================
# COMANDO: STATUS - Ver estado de secrets
# ============================================================================

cmd_status() {
    print_header "Estado de secrets para $ENVIRONMENT"

    cd "$BACKEND_DIR"

    # Verificar archivo .env
    print_step "Verificando archivos de configuración..."

    if [ -f ".env.$ENVIRONMENT" ]; then
        print_success ".env.$ENVIRONMENT existe"

        # Verificar campos críticos
        local has_db_password=$(grep -c "^DB_PASSWORD=" ".env.$ENVIRONMENT" || echo "0")
        local has_jwt=$(grep -c "^JWT_SECRET=" ".env.$ENVIRONMENT" || echo "0")

        if [ "$has_db_password" -gt 0 ]; then
            print_success "  DB_PASSWORD configurado"
        else
            print_error "  DB_PASSWORD NO configurado"
        fi

        if [ "$has_jwt" -gt 0 ]; then
            print_success "  JWT_SECRET configurado"
        else
            print_error "  JWT_SECRET NO configurado"
        fi
    else
        print_error ".env.$ENVIRONMENT NO existe"
    fi

    # Verificar dotenv-vault
    print_step "Verificando dotenv-vault..."

    if [ -f ".env.vault" ]; then
        print_success ".env.vault existe"
    else
        print_warning ".env.vault NO existe (ejecuta: ./manage-secrets.sh init)"
    fi

    # Verificar credentials file de BD
    local CREDS_FILE="$DATABASE_ROOT/database-credentials-${ENVIRONMENT}.txt"
    print_step "Verificando credentials de BD..."

    if [ -f "$CREDS_FILE" ]; then
        print_success "database-credentials-${ENVIRONMENT}.txt existe"

        local saved_password=$(grep "^Password:" "$CREDS_FILE" | awk '{print $2}')
        local env_password=$(grep "^DB_PASSWORD=" "$BACKEND_DIR/.env.$ENVIRONMENT" | cut -d= -f2)

        if [ "$saved_password" = "$env_password" ]; then
            print_success "  Passwords sincronizados"
        else
            print_warning "  Passwords NO sincronizados"
        fi
    else
        print_info "database-credentials-${ENVIRONMENT}.txt NO existe (se creará al init DB)"
    fi

    echo ""
    print_info "Estado general: $([ -f ".env.$ENVIRONMENT" ] && [ -f ".env.vault" ] && echo '✅ LISTO' || echo '⚠️ REQUIERE CONFIGURACIÓN')"
}

# ============================================================================
# COMANDO: ROTATE - Rotar passwords
# ============================================================================

cmd_rotate() {
    print_header "Rotando passwords para $ENVIRONMENT"

    print_warning "⚠️  ADVERTENCIA: Esto generará nuevos passwords"
    print_info "Esto requerirá:"
    print_info "  1. Reiniciar la base de datos con nuevo password"
    print_info "  2. Reiniciar el backend"
    print_info "  3. Actualizar todos los servicios"
    echo ""

    if [ "$FORCE_MODE" = false ]; then
        read -p "¿Continuar con rotación? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            print_info "Operación cancelada"
            exit 0
        fi
    fi

    # Ejecutar generate y sync
    cmd_generate
    echo ""
    cmd_sync

    print_success "Rotación completada"
    echo ""
    print_warning "IMPORTANTE: Reinicia los siguientes servicios:"
    print_info "  1. Base de datos: ./init-database-v2.sh --env $ENVIRONMENT --use-vault"
    print_info "  2. Backend: npm run dev (recargará nuevos secrets)"
}

# ============================================================================
# MAIN
# ============================================================================

main() {
    # Parsear argumentos
    while [[ $# -gt 0 ]]; do
        case $1 in
            generate|sync|rotate|export|status|init)
                COMMAND="$1"
                shift
                ;;
            --env)
                ENVIRONMENT="$2"
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

    # Validar argumentos
    if [ -z "$COMMAND" ]; then
        print_error "Debe especificar un comando"
        show_help
        exit 1
    fi

    if [ -z "$ENVIRONMENT" ] && [ "$COMMAND" != "help" ]; then
        print_error "Debe especificar --env dev|prod"
        show_help
        exit 1
    fi

    if [ "$ENVIRONMENT" != "dev" ] && [ "$ENVIRONMENT" != "prod" ] && [ -n "$ENVIRONMENT" ]; then
        print_error "Ambiente debe ser 'dev' o 'prod'"
        exit 1
    fi

    # Verificar prerequisitos
    check_prerequisites

    # Ejecutar comando
    case $COMMAND in
        init)
            cmd_init
            ;;
        generate)
            cmd_generate
            ;;
        sync)
            cmd_sync
            ;;
        export)
            cmd_export
            ;;
        status)
            cmd_status
            ;;
        rotate)
            cmd_rotate
            ;;
        *)
            print_error "Comando desconocido: $COMMAND"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
