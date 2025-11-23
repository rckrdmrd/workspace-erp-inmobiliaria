#!/bin/bash
# Script para listar todos los ENUMs por schema
# Parte de SIMCO - Sistema Indexado Modular por Contexto

cd "$(dirname "$0")/../../ddl/schemas" || exit 1

echo "=== INVENTARIO DE ENUMs POR SCHEMA ==="
echo ""

total_enums=0

for schema_dir in */; do
    schema=$(basename "$schema_dir")

    if [ -d "$schema_dir/enums" ]; then
        count=$(find "$schema_dir/enums" -name "*.sql" 2>/dev/null | wc -l)

        if [ "$count" -gt 0 ]; then
            echo "Schema: $schema ($count ENUMs)"
            find "$schema_dir/enums" -name "*.sql" 2>/dev/null | \
                sed 's|.*/||' | \
                sed 's|\.sql||' | \
                sort | \
                sed 's/^/  - /'
            echo ""
            total_enums=$((total_enums + count))
        fi
    fi
done

echo "=== TOTAL: $total_enums ENUMs ==="
