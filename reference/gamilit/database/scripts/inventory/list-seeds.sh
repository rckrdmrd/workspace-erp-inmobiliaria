#!/bin/bash
# Script para listar todos los seeds por schema
# Parte de SIMCO - Sistema Indexado Modular por Contexto

cd "$(dirname "$0")/../../seeds" || exit 1

echo "=== INVENTARIO DE SEEDS POR SCHEMA ==="
echo ""

total_seeds=0

for seed_dir in */; do
    if [ -d "$seed_dir" ]; then
        schema=$(basename "$seed_dir")
        count=$(find "$seed_dir" -name "*.sql" 2>/dev/null | wc -l)

        if [ "$count" -gt 0 ]; then
            echo "Schema: $schema ($count seeds)"
            find "$seed_dir" -name "*.sql" 2>/dev/null | \
                sed 's|.*/||' | \
                sed 's|\.sql||' | \
                sort | \
                sed 's/^/  - /'
            echo ""
            total_seeds=$((total_seeds + count))
        fi
    fi
done

echo "=== TOTAL: $total_seeds seeds ==="
