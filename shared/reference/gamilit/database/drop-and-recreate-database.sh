#!/bin/bash
# ============================================================================
# Script: Drop y Recreación de Base de Datos Gamilit
# Fecha: 2025-11-11
# Versión: 1.0
# ============================================================================
#
# DESCRIPCIÓN:
#   Elimina la base de datos existente y la vuelve a crear limpia
#
# USO:
#   ./drop-and-recreate-database.sh [DATABASE_URL]
#
# ============================================================================

set -e  # Exit on error
set -u  # Exit on undefined variable

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get database URL from argument or environment
DATABASE_URL="${1:-${DATABASE_URL:-}}"

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}ERROR: DATABASE_URL no está configurada${NC}"
    echo "Uso: $0 <DATABASE_URL>"
    exit 1
fi

# Extract database name and connection details
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's|.*://[^/]*/\([^?]*\).*|\1|p')
ADMIN_URL=$(echo "$DATABASE_URL" | sed 's|/[^/]*$|/postgres|')

echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}DROP Y RECREACIÓN DE BASE DE DATOS${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo -e "Base de datos: ${YELLOW}$DB_NAME${NC}"
echo ""

# Confirmar acción (comentar para automatización)
# read -p "¿Estás seguro de ELIMINAR la base de datos $DB_NAME? (yes/no): " -r
# if [[ ! $REPLY =~ ^yes$ ]]; then
#     echo "Operación cancelada"
#     exit 0
# fi

echo -e "${YELLOW}Desconectando usuarios activos...${NC}"
psql "$ADMIN_URL" -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();" 2>/dev/null || true

echo -e "${YELLOW}Eliminando base de datos $DB_NAME...${NC}"
psql "$ADMIN_URL" -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>/dev/null || {
    echo -e "${RED}Error al eliminar la base de datos${NC}"
    exit 1
}

echo -e "${GREEN}✅ Base de datos eliminada${NC}"
echo ""

echo -e "${YELLOW}Creando nueva base de datos $DB_NAME...${NC}"
psql "$ADMIN_URL" -c "CREATE DATABASE $DB_NAME OWNER gamilit_user ENCODING 'UTF8';" || {
    echo -e "${RED}Error al crear la base de datos${NC}"
    exit 1
}

echo -e "${GREEN}✅ Base de datos creada${NC}"
echo ""

echo -e "${GREEN}============================================================================${NC}"
echo -e "${GREEN}✅ BASE DE DATOS RECREADA EXITOSAMENTE${NC}"
echo -e "${GREEN}============================================================================${NC}"
echo ""

# Ejecutar create-database.sh automáticamente
echo -e "${BLUE}Iniciando creación de estructura DDL...${NC}"
echo ""

if [ -f "./create-database.sh" ]; then
    ./create-database.sh "$DATABASE_URL"
    exit_code=$?

    if [ $exit_code -eq 0 ]; then
        echo ""
        echo -e "${GREEN}============================================================================${NC}"
        echo -e "${GREEN}✅ PROCESO COMPLETO: Base de datos lista para usar${NC}"
        echo -e "${GREEN}============================================================================${NC}"
    else
        echo ""
        echo -e "${RED}============================================================================${NC}"
        echo -e "${RED}❌ ERROR: create-database.sh falló con código $exit_code${NC}"
        echo -e "${RED}============================================================================${NC}"
        exit $exit_code
    fi
else
    echo -e "${RED}ERROR: No se encontró create-database.sh en el directorio actual${NC}"
    exit 1
fi

exit 0
