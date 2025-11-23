#!/bin/bash

echo "🧹 Limpiando referencias incorrectas en Backend..."
echo ""

# Contador de archivos modificados
COUNT=0

# Backup antes de modificar
echo "📦 Creando backup..."
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Encontrar archivos con violaciones
FILES_WITH_VIOLATIONS=$(grep -r "@see.*docs/" src/ migrations/ --include="*.ts" --include="*.sql" -l 2>/dev/null || true)

if [ -z "$FILES_WITH_VIOLATIONS" ]; then
  echo "✅ No se encontraron referencias incorrectas"
  exit 0
fi

echo "Archivos a limpiar:"
echo "$FILES_WITH_VIOLATIONS"
echo ""

# Procesar cada archivo
for FILE in $FILES_WITH_VIOLATIONS; do
  echo "  🔧 Limpiando: $FILE"

  # Hacer backup
  cp "$FILE" "$BACKUP_DIR/"

  # Eliminar líneas con @see docs/
  sed -i '/@see.*docs\//d' "$FILE"
  sed -i '/@see Docs:/d' "$FILE"
  sed -i '/@see ADR:/d' "$FILE"

  # Limpiar líneas vacías consecutivas
  sed -i '/^$/N;/^\n$/D' "$FILE"

  COUNT=$((COUNT + 1))
done

echo ""
echo "✅ Limpieza completada"
echo "📊 Archivos modificados: $COUNT"
echo "💾 Backup guardado en: $BACKUP_DIR"
echo ""
echo "🔍 Verificando limpieza..."
REMAINING=$(grep -r "@see.*docs/" src/ migrations/ --include="*.ts" --include="*.sql" 2>/dev/null | wc -l)

if [ "$REMAINING" -eq 0 ]; then
  echo "✅ ¡Código limpio! (0 referencias a docs)"
else
  echo "⚠️  Aún quedan $REMAINING referencias"
  grep -r "@see.*docs/" src/ migrations/ --include="*.ts" --include="*.sql"
fi
