#!/bin/bash
# Script para listar todos los índices por schema
# Parte de SIMCO - Sistema Indexado Modular por Contexto

cd "$(dirname "$0")/../../ddl/schemas" || exit 1

echo "=== INVENTARIO DE ÍNDICES POR SCHEMA ==="
echo ""

total_indexes=0

for schema_dir in */; do
    schema=$(basename "$schema_dir")

    if [ -d "$schema_dir/indexes" ]; then
        count=$(find "$schema_dir/indexes" -name "*.sql" 2>/dev/null | wc -l)

        if [ "$count" -gt 0 ]; then
            echo "Schema: $schema ($count índices)"
            find "$schema_dir/indexes" -name "*.sql" 2>/dev/null | \
                sed 's|.*/||' | \
                sed 's|\.sql||' | \
                sort | \
                sed 's/^/  - /'
            echo ""
            total_indexes=$((total_indexes + count))
        fi
    fi
done

echo "=== TOTAL: $total_indexes índices ==="
