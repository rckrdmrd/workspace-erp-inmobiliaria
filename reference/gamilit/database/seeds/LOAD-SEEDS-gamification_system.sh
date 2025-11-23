#!/bin/bash
# =====================================================
# LOAD-SEEDS-gamification_system.sh
# =====================================================
# Description: Carga seeds de gamification_system según entorno
# Environments: dev, staging, production
# Date: 2025-11-02
# Migrated by: SA-SEEDS-GAM-01
# =====================================================

set -e  # Exit on error

# =====================================================
# CONFIGURACIÓN
# =====================================================

ENV=${1:-dev}
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-gamilit_platform}
DB_USER=${DB_USER:-postgres}

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# =====================================================
# FUNCIONES
# =====================================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

execute_seed() {
    local file=$1
    local filename=$(basename "$file")

    log_info "Ejecutando: $filename"

    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file" > /dev/null 2>&1; then
        log_success "✓ $filename completado"
        return 0
    else
        log_error "✗ $filename falló"
        return 1
    fi
}

# =====================================================
# VALIDACIÓN DE ENTORNO
# =====================================================

if [[ ! "$ENV" =~ ^(dev|staging|production)$ ]]; then
    log_error "Entorno inválido: $ENV"
    echo "Uso: $0 [dev|staging|production]"
    exit 1
fi

log_info "========================================="
log_info "  CARGA DE SEEDS: gamification_system"
log_info "========================================="
log_info "Entorno:  $ENV"
log_info "Base de datos: $DB_NAME"
log_info "Host:     $DB_HOST:$DB_PORT"
log_info "Usuario:  $DB_USER"
log_info "========================================="
echo ""

# Directorio base
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SEED_DIR="$SCRIPT_DIR/$ENV/gamification_system"

# Validar que existe el directorio
if [ ! -d "$SEED_DIR" ]; then
    log_error "No existe el directorio: $SEED_DIR"
    exit 1
fi

# =====================================================
# CONFIRMACIÓN (solo para production)
# =====================================================

if [ "$ENV" = "production" ]; then
    log_warning "ADVERTENCIA: Vas a ejecutar seeds en PRODUCTION"
    read -p "¿Estás seguro? (escribe 'YES' para continuar): " confirm
    if [ "$confirm" != "YES" ]; then
        log_info "Operación cancelada por el usuario"
        exit 0
    fi
fi

# =====================================================
# CARGA DE SEEDS POR ENTORNO
# =====================================================

case $ENV in
  dev)
    log_info "Cargando seeds de DEVELOPMENT (todos los datos)..."
    echo ""

    execute_seed "$SEED_DIR/01-achievement_categories.sql" || exit 1
    execute_seed "$SEED_DIR/02-achievements.sql" || exit 1
    execute_seed "$SEED_DIR/03-leaderboard_metadata.sql" || exit 1
    execute_seed "$SEED_DIR/04-initialize_user_gamification.sql" || exit 1

    echo ""
    log_success "Seeds de DEV cargados exitosamente"
    log_info "Total de archivos: 4"
    ;;

  staging)
    log_info "Cargando seeds de STAGING (configuración + demo)..."
    echo ""

    execute_seed "$SEED_DIR/01-achievement_categories.sql" || exit 1
    execute_seed "$SEED_DIR/02-achievements.sql" || exit 1
    execute_seed "$SEED_DIR/03-leaderboard_metadata.sql" || exit 1

    echo ""
    log_success "Seeds de STAGING cargados exitosamente"
    log_info "Total de archivos: 3"
    ;;

  production)
    log_info "Cargando seeds de PRODUCTION (solo configuración esencial)..."
    echo ""

    execute_seed "$SEED_DIR/01-achievement_categories.sql" || exit 1
    execute_seed "$SEED_DIR/02-leaderboard_metadata.sql" || exit 1

    echo ""
    log_success "Seeds de PRODUCTION cargados exitosamente"
    log_info "Total de archivos: 2"
    log_warning "NOTA: No se cargaron achievements demo ni datos de prueba"
    ;;
esac

echo ""
log_info "========================================="
log_success "PROCESO COMPLETADO"
log_info "========================================="

exit 0
