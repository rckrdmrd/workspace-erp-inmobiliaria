#!/bin/bash
# Script para listar todas las vistas por schema
# Parte de SIMCO - Sistema Indexado Modular por Contexto

cd "$(dirname "$0")/../../ddl/schemas" || exit 1

echo "=== INVENTARIO DE VISTAS POR SCHEMA ==="
echo ""

total_views=0

for schema_dir in */; do
    schema=$(basename "$schema_dir")

    # Buscar en views/ y materialized-views/
    for view_dir in "views" "materialized-views"; do
        if [ -d "$schema_dir/$view_dir" ]; then
            count=$(find "$schema_dir/$view_dir" -name "*.sql" 2>/dev/null | wc -l)

            if [ "$count" -gt 0 ]; then
                echo "Schema: $schema/$view_dir ($count vistas)"
                find "$schema_dir/$view_dir" -name "*.sql" 2>/dev/null | \
                    sed 's|.*/||' | \
                    sed 's|\.sql||' | \
                    sort | \
                    sed 's/^/  - /'
                echo ""
                total_views=$((total_views + count))
            fi
        fi
    done
done

echo "=== TOTAL: $total_views vistas ==="
