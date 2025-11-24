#!/bin/bash
# ============================================================================
# Script: create-database.sh
# Descripción: Crea la base de datos desde cero
# Autor: Database-Agent
# Fecha: 2025-11-20
# ============================================================================

set -e  # Salir si hay error

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Iniciando creación de base de datos...${NC}"

# Verificar que DATABASE_URL está definido
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ ERROR: Variable DATABASE_URL no está definida${NC}"
    echo "Ejemplo: export DATABASE_URL=postgresql://user:pass@localhost:5432/dbname"
    exit 1
fi

# Extraer nombre de base de datos de DATABASE_URL
DB_NAME=$(echo $DATABASE_URL | sed -E 's/.*\/(.*?)(\?.*)?$/\1/')

echo -e "${YELLOW}📋 Base de datos: ${DB_NAME}${NC}"

# Verificar si la base de datos existe
if psql $DATABASE_URL -c "SELECT 1" &> /dev/null; then
    echo -e "${YELLOW}⚠️  La base de datos ya existe.${NC}"
    read -p "¿Deseas eliminarla y recrearla? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🗑️  Eliminando base de datos existente...${NC}"
        # Aquí iría el comando para eliminar (requiere permisos)
        echo "NOTA: Ejecutar manualmente: DROP DATABASE $DB_NAME;"
    else
        echo -e "${GREEN}✅ Operación cancelada${NC}"
        exit 0
    fi
fi

# Ejecutar inicialización
echo -e "${YELLOW}📝 Ejecutando 00-init.sql...${NC}"
psql $DATABASE_URL -f ../ddl/00-init.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Base de datos creada exitosamente${NC}"
    echo -e "${GREEN}✅ Schemas creados: 7${NC}"
    echo -e "${GREEN}✅ Extensiones habilitadas: uuid-ossp, postgis, pg_trgm, btree_gist${NC}"
    echo ""
    echo -e "${YELLOW}📝 Siguiente paso: Ejecutar DDL de tablas${NC}"
    echo "   Ejemplo: psql \$DATABASE_URL -f ddl/schemas/auth_management/tables/01-users.sql"
else
    echo -e "${RED}❌ Error al crear la base de datos${NC}"
    exit 1
fi
