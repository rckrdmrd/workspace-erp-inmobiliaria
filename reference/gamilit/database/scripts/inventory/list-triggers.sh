#!/bin/bash
# Script para listar todos los triggers por schema
# Parte de SIMCO - Sistema Indexado Modular por Contexto

cd "$(dirname "$0")/../../ddl/schemas" || exit 1

echo "=== INVENTARIO DE TRIGGERS POR SCHEMA ==="
echo ""

total_triggers=0

for schema_dir in */; do
    schema=$(basename "$schema_dir")

    if [ -d "$schema_dir/triggers" ]; then
        count=$(find "$schema_dir/triggers" -name "*.sql" 2>/dev/null | wc -l)

        if [ "$count" -gt 0 ]; then
            echo "Schema: $schema ($count triggers)"
            find "$schema_dir/triggers" -name "*.sql" 2>/dev/null | \
                sed 's|.*/||' | \
                sed 's|\.sql||' | \
                sort | \
                sed 's/^/  - /'
            echo ""
            total_triggers=$((total_triggers + count))
        fi
    fi
done

echo "=== TOTAL: $total_triggers triggers ==="
