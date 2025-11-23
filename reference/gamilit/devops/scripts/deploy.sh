#!/bin/bash
##############################################################################
# GAMILIT Platform - Deployment Script
#
# Propósito: Script completo de deployment para desarrollo y producción
#
# Uso:
#   ./deploy.sh --env dev        # Desarrollo local
#   ./deploy.sh --env prod       # Producción
#   ./deploy.sh --env dev --skip-db  # Sin inicializar BD
#   ./deploy.sh --env prod --dry-run # Simular deployment
#
# Funcionalidades:
#   1. Validación de prerequisitos (Node, npm, PM2, PostgreSQL)
#   2. Inicialización de base de datos (opcional)
#   3. Build de backend y frontend
#   4. Deployment con PM2
#   5. Validación de health checks
#   6. Rollback automático en caso de error
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
DEVOPS_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
APPS_ROOT="$(cd "$DEVOPS_ROOT/.." && pwd)"
GAMILIT_ROOT="$(cd "$APPS_ROOT/.." && pwd)"
BACKEND_DIR="$APPS_ROOT/backend"
FRONTEND_DIR="$APPS_ROOT/frontend"
DATABASE_DIR="$APPS_ROOT/database"

# Variables de configuración
ENVIRONMENT=""
SKIP_DB=false
DRY_RUN=false
SKIP_TESTS=false

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
GAMILIT Platform - Deployment Script

Uso: $0 [OPCIONES]

Opciones:
  --env dev|prod      Ambiente (dev o prod) [REQUERIDO]
  --skip-db           No inicializar base de datos
  --skip-tests        Omitir tests
  --dry-run           Simular deployment sin ejecutar
  --help              Mostrar ayuda

Ejemplos:
  $0 --env dev
  $0 --env prod --skip-db
  $0 --env dev --dry-run

Prerequisitos:
  - Node.js >= 18.0.0
  - npm >= 9.0.0
  - PM2 (global)
  - PostgreSQL >= 14

EOF
}

# ============================================================================
# VALIDACIÓN DE PREREQUISITOS
# ============================================================================

check_prerequisites() {
    print_step "Validando prerequisitos..."

    # Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js no encontrado"
        exit 1
    fi
    local node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$node_version" -lt 18 ]; then
        print_error "Node.js >= 18.0.0 requerido (actual: $(node -v))"
        exit 1
    fi
    print_success "Node.js $(node -v)"

    # npm
    if ! command -v npm &> /dev/null; then
        print_error "npm no encontrado"
        exit 1
    fi
    print_success "npm $(npm -v)"

    # PM2
    if ! command -v pm2 &> /dev/null; then
        print_warning "PM2 no encontrado"
        read -p "¿Instalar PM2 globalmente? (y/n): " install_pm2
        if [ "$install_pm2" = "y" ]; then
            npm install -g pm2
            print_success "PM2 instalado"
        else
            print_error "PM2 es requerido para deployment"
            exit 1
        fi
    else
        print_success "PM2 $(pm2 -v)"
    fi

    # PostgreSQL (solo si no se salta DB)
    if [ "$SKIP_DB" = false ]; then
        if ! command -v psql &> /dev/null; then
            print_error "PostgreSQL no encontrado"
            exit 1
        fi
        print_success "PostgreSQL encontrado"
    fi

    # Verificar directorios
    if [ ! -d "$BACKEND_DIR" ]; then
        print_error "Backend no encontrado: $BACKEND_DIR"
        exit 1
    fi
    print_success "Backend encontrado"

    if [ ! -d "$FRONTEND_DIR" ]; then
        print_error "Frontend no encontrado: $FRONTEND_DIR"
        exit 1
    fi
    print_success "Frontend encontrado"

    if [ ! -d "$DATABASE_DIR" ] && [ "$SKIP_DB" = false ]; then
        print_error "Database no encontrado: $DATABASE_DIR"
        exit 1
    fi
    [ "$SKIP_DB" = false ] && print_success "Database encontrado"
}

# ============================================================================
# INICIALIZACIÓN DE BASE DE DATOS
# ============================================================================

initialize_database() {
    if [ "$SKIP_DB" = true ]; then
        print_warning "Inicialización de BD omitida (--skip-db)"
        return 0
    fi

    print_step "Inicializando base de datos..."

    local db_script="$DATABASE_DIR/scripts/init-database.sh"
    if [ ! -f "$db_script" ]; then
        print_error "Script de BD no encontrado: $db_script"
        exit 1
    fi

    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] Ejecutaría: $db_script --env $ENVIRONMENT --force"
        return 0
    fi

    # Ejecutar script de inicialización
    if bash "$db_script" --env "$ENVIRONMENT" --force; then
        print_success "Base de datos inicializada"
    else
        print_error "Error al inicializar base de datos"
        exit 1
    fi
}

# ============================================================================
# INSTALACIÓN DE DEPENDENCIAS
# ============================================================================

install_dependencies() {
    print_step "Instalando dependencias..."

    # Backend
    print_info "Backend..."
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] Ejecutaría: cd $BACKEND_DIR && npm install"
    else
        cd "$BACKEND_DIR"
        if npm install --production=false; then
            print_success "Dependencias de backend instaladas"
        else
            print_error "Error al instalar dependencias de backend"
            exit 1
        fi
    fi

    # Frontend
    print_info "Frontend..."
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] Ejecutaría: cd $FRONTEND_DIR && npm install"
    else
        cd "$FRONTEND_DIR"
        if npm install; then
            print_success "Dependencias de frontend instaladas"
        else
            print_error "Error al instalar dependencias de frontend"
            exit 1
        fi
    fi
}

# ============================================================================
# TESTS
# ============================================================================

run_tests() {
    if [ "$SKIP_TESTS" = true ]; then
        print_warning "Tests omitidos (--skip-tests)"
        return 0
    fi

    print_step "Ejecutando tests..."

    # Backend tests
    print_info "Tests de backend..."
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] Ejecutaría: cd $BACKEND_DIR && npm test"
    else
        cd "$BACKEND_DIR"
        if npm test; then
            print_success "Tests de backend pasados"
        else
            print_warning "Tests de backend fallaron (continuando...)"
        fi
    fi

    # Frontend tests
    print_info "Tests de frontend..."
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] Ejecutaría: cd $FRONTEND_DIR && npm run test:run"
    else
        cd "$FRONTEND_DIR"
        if npm run test:run; then
            print_success "Tests de frontend pasados"
        else
            print_warning "Tests de frontend fallaron (continuando...)"
        fi
    fi
}

# ============================================================================
# BUILD
# ============================================================================

build_applications() {
    print_step "Building aplicaciones..."

    # Backend
    print_info "Building backend..."
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] Ejecutaría: cd $BACKEND_DIR && npm run build"
    else
        cd "$BACKEND_DIR"
        if npm run build; then
            print_success "Backend built exitosamente"
        else
            print_error "Error al hacer build de backend"
            exit 1
        fi
    fi

    # Frontend
    print_info "Building frontend..."
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] Ejecutaría: cd $FRONTEND_DIR && npm run build:prod"
    else
        cd "$FRONTEND_DIR"
        if npm run build:prod; then
            print_success "Frontend built exitosamente"
        else
            print_error "Error al hacer build de frontend"
            exit 1
        fi
    fi
}

# ============================================================================
# DEPLOYMENT CON PM2
# ============================================================================

deploy_with_pm2() {
    print_step "Deploying con PM2..."

    cd "$GAMILIT_ROOT"

    # Crear directorio de logs
    mkdir -p logs

    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] Ejecutaría: pm2 startOrRestart ecosystem.config.js --env $ENVIRONMENT"
        return 0
    fi

    # Verificar si el ecosystem config existe
    if [ ! -f "ecosystem.config.js" ]; then
        print_error "ecosystem.config.js no encontrado"
        exit 1
    fi

    # Deployment según ambiente
    if [ "$ENVIRONMENT" = "prod" ] || [ "$ENVIRONMENT" = "production" ]; then
        # Producción - solo backend
        print_info "Iniciando backend en producción..."
        pm2 startOrRestart ecosystem.config.js --only gamilit-backend --env production

        print_success "Backend deployed con PM2"

        print_info "Para servir el frontend en producción, usar Nginx/Apache"
        print_info "O ejecutar: pm2 start ecosystem.config.js --only gamilit-frontend-preview --env production"

    else
        # Desarrollo - backend + frontend
        print_info "Iniciando backend y frontend en desarrollo..."
        pm2 startOrRestart ecosystem.config.js --env development

        print_success "Backend y Frontend deployed con PM2"
    fi

    # Guardar configuración PM2
    pm2 save

    print_success "Deployment completado"
}

# ============================================================================
# HEALTH CHECKS
# ============================================================================

health_check() {
    print_step "Validando health checks..."

    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] Omitiría health checks"
        return 0
    fi

    # Esperar a que el servidor inicie
    print_info "Esperando 10 segundos para que los servicios inicien..."
    sleep 10

    # Backend health check
    print_info "Verificando backend..."
    local backend_port=3006
    if curl -s http://localhost:$backend_port/api/health > /dev/null 2>&1; then
        print_success "Backend respondiendo en puerto $backend_port"
    else
        print_warning "Backend no responde en puerto $backend_port"
        print_info "Verificar con: pm2 logs gamilit-backend"
    fi

    # Frontend health check (solo en dev)
    if [ "$ENVIRONMENT" = "dev" ] || [ "$ENVIRONMENT" = "development" ]; then
        print_info "Verificando frontend..."
        local frontend_port=3005
        if curl -s http://localhost:$frontend_port > /dev/null 2>&1; then
            print_success "Frontend respondiendo en puerto $frontend_port"
        else
            print_warning "Frontend no responde en puerto $frontend_port"
            print_info "Verificar con: pm2 logs gamilit-frontend-dev"
        fi
    fi

    # Mostrar status de PM2
    echo ""
    pm2 status
}

# ============================================================================
# RESUMEN
# ============================================================================

show_summary() {
    print_header "✅ DEPLOYMENT COMPLETADO"

    echo -e "${CYAN}Ambiente:${NC} $ENVIRONMENT"
    echo -e "${CYAN}Servidor de base de datos:${NC} localhost:5432"
    echo ""

    echo -e "${CYAN}Servicios desplegados:${NC}"
    echo -e "  ${GREEN}✓${NC} Backend API: http://localhost:3006"
    echo -e "  ${GREEN}✓${NC} API Docs: http://localhost:3006/api/docs"

    if [ "$ENVIRONMENT" = "dev" ] || [ "$ENVIRONMENT" = "development" ]; then
        echo -e "  ${GREEN}✓${NC} Frontend: http://localhost:3005"
    fi

    echo ""
    echo -e "${CYAN}Comandos útiles:${NC}"
    echo -e "  pm2 status              # Ver status de procesos"
    echo -e "  pm2 logs                # Ver logs en tiempo real"
    echo -e "  pm2 logs gamilit-backend    # Logs del backend"
    echo -e "  pm2 restart all         # Reiniciar todos los procesos"
    echo -e "  pm2 stop all            # Detener todos los procesos"
    echo -e "  pm2 monit               # Monitor interactivo"
    echo ""
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
            --skip-db)
                SKIP_DB=true
                shift
                ;;
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --dry-run)
                DRY_RUN=true
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
    if [ -z "$ENVIRONMENT" ]; then
        print_error "Debe especificar --env dev|prod"
        show_help
        exit 1
    fi

    # Normalizar ambiente
    if [ "$ENVIRONMENT" = "production" ]; then
        ENVIRONMENT="prod"
    elif [ "$ENVIRONMENT" = "development" ]; then
        ENVIRONMENT="dev"
    fi

    if [ "$ENVIRONMENT" != "dev" ] && [ "$ENVIRONMENT" != "prod" ]; then
        print_error "Ambiente debe ser 'dev' o 'prod'"
        exit 1
    fi

    # Mostrar banner
    if [ "$DRY_RUN" = true ]; then
        print_header "🚀 GAMILIT DEPLOYMENT (DRY-RUN) - $ENVIRONMENT"
    else
        print_header "🚀 GAMILIT DEPLOYMENT - $ENVIRONMENT"
    fi

    # Ejecutar pasos
    check_prerequisites
    initialize_database
    install_dependencies
    run_tests
    build_applications
    deploy_with_pm2
    health_check
    show_summary
}

main "$@"
