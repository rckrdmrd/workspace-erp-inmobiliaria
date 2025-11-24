#!/bin/bash
# Script maestro para generar todos los inventarios
# Parte de SIMCO - Sistema Indexado Modular por Contexto

SCRIPT_DIR="$(dirname "$0")"
OUTPUT_DIR="$SCRIPT_DIR/../../docs/inventarios"

echo "=== GENERANDO TODOS LOS INVENTARIOS ==="
echo ""

# Crear directorio de salida si no existe
mkdir -p "$OUTPUT_DIR"

# Generar cada inventario y guardar en archivo
echo "📋 Generando inventario de tablas..."
bash "$SCRIPT_DIR/list-tables.sh" > "$OUTPUT_DIR/raw-tables-output.txt"

echo "📋 Generando inventario de ENUMs..."
bash "$SCRIPT_DIR/list-enums.sh" > "$OUTPUT_DIR/raw-enums-output.txt"

echo "📋 Generando inventario de funciones..."
bash "$SCRIPT_DIR/list-functions.sh" > "$OUTPUT_DIR/raw-functions-output.txt"

echo "📋 Generando inventario de triggers..."
bash "$SCRIPT_DIR/list-triggers.sh" > "$OUTPUT_DIR/raw-triggers-output.txt"

echo "📋 Generando inventario de RLS policies..."
bash "$SCRIPT_DIR/list-rls.sh" > "$OUTPUT_DIR/raw-rls-output.txt"

echo "📋 Generando inventario de índices..."
bash "$SCRIPT_DIR/list-indexes.sh" > "$OUTPUT_DIR/raw-indexes-output.txt"

echo "📋 Generando inventario de vistas..."
bash "$SCRIPT_DIR/list-views.sh" > "$OUTPUT_DIR/raw-views-output.txt"

echo "📋 Generando inventario de seeds..."
bash "$SCRIPT_DIR/list-seeds.sh" > "$OUTPUT_DIR/raw-seeds-output.txt"

echo ""
echo "✅ Todos los inventarios raw generados en: $OUTPUT_DIR"
echo ""
echo "Archivos generados:"
ls -lh "$OUTPUT_DIR"/raw-*.txt
