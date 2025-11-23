#!/bin/bash
# Script para listar todas las funciones por schema
# Parte de SIMCO - Sistema Indexado Modular por Contexto

cd "$(dirname "$0")/../../ddl/schemas" || exit 1

echo "=== INVENTARIO DE FUNCIONES POR SCHEMA ==="
echo ""

total_functions=0

for schema_dir in */; do
    schema=$(basename "$schema_dir")

    if [ -d "$schema_dir/functions" ]; then
        count=$(find "$schema_dir/functions" -name "*.sql" 2>/dev/null | wc -l)

        if [ "$count" -gt 0 ]; then
            echo "Schema: $schema ($count funciones)"
            find "$schema_dir/functions" -name "*.sql" 2>/dev/null | \
                sed 's|.*/||' | \
                sed 's|\.sql||' | \
                sort | \
                sed 's/^/  - /'
            echo ""
            total_functions=$((total_functions + count))
        fi
    fi
done

echo "=== TOTAL: $total_functions funciones ==="
