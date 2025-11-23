#!/bin/bash
# Script para listar todas las RLS policies por schema
# Parte de SIMCO - Sistema Indexado Modular por Contexto

cd "$(dirname "$0")/../../ddl/schemas" || exit 1

echo "=== INVENTARIO DE RLS POLICIES POR SCHEMA ==="
echo ""

total_rls=0

for schema_dir in */; do
    schema=$(basename "$schema_dir")

    if [ -d "$schema_dir/rls-policies" ]; then
        count=$(find "$schema_dir/rls-policies" -name "*.sql" 2>/dev/null | wc -l)

        if [ "$count" -gt 0 ]; then
            echo "Schema: $schema ($count policies)"
            find "$schema_dir/rls-policies" -name "*.sql" 2>/dev/null | \
                sed 's|.*/||' | \
                sed 's|\.sql||' | \
                sort | \
                sed 's/^/  - /'
            echo ""
            total_rls=$((total_rls + count))
        fi
    fi
done

echo "=== TOTAL: $total_rls RLS policies ==="
