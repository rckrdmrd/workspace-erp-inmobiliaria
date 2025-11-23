#!/bin/bash
# Script para listar todas las tablas por schema
# Parte de SIMCO - Sistema Indexado Modular por Contexto

cd "$(dirname "$0")/../../ddl/schemas" || exit 1

echo "=== INVENTARIO DE TABLAS POR SCHEMA ==="
echo ""

total_tables=0

for schema_dir in */; do
    schema=$(basename "$schema_dir")

    if [ -d "$schema_dir/tables" ]; then
        count=$(find "$schema_dir/tables" -name "*.sql" 2>/dev/null | wc -l)

        if [ "$count" -gt 0 ]; then
            echo "Schema: $schema ($count tablas)"
            find "$schema_dir/tables" -name "*.sql" 2>/dev/null | \
                sed 's|.*/||' | \
                sed 's|\.sql||' | \
                sort | \
                sed 's/^/  - /'
            echo ""
            total_tables=$((total_tables + count))
        fi
    fi
done

echo "=== TOTAL: $total_tables tablas ==="
