#!/bin/bash

# SCRIPT DE VALIDACIÓN DE .gitignore
# Agente: Workspace-Manager
# Propósito: Validar que .gitignore cumple con DIRECTIVA-GESTION-BACKUPS-GITIGNORE.md
# Uso: ./orchestration/scripts/validate-gitignore.sh

set -e  # Salir si hay error

echo "=============================================="
echo "VALIDACIÓN DE .gitignore"
echo "=============================================="
echo ""
echo "Directiva: DIRECTIVA-GESTION-BACKUPS-GITIGNORE.md"
echo "Fecha: $(date +%Y-%m-%d)"
echo ""

# Contador de errores
ERRORS=0

# =============================================
# VALIDACIÓN 1: orchestration/ NO ignorado
# =============================================
echo "1. Verificando orchestration/..."
if git check-ignore -q orchestration/prompts/ 2>/dev/null; then
    echo "❌ ERROR: orchestration/ está ignorado"
    echo "   → orchestration/ DEBE estar versionado para Claude Code cloud"
    echo "   → Editar .gitignore y eliminar línea que ignora orchestration/"
    ((ERRORS++))
else
    echo "✅ orchestration/ NO está ignorado (correcto)"
fi

# =============================================
# VALIDACIÓN 2: orchestration/.archive/ SÍ ignorado
# =============================================
echo ""
echo "2. Verificando orchestration/.archive/..."
if git check-ignore -q orchestration/.archive/ 2>/dev/null; then
    echo "✅ orchestration/.archive/ está ignorado (correcto)"
else
    echo "❌ ERROR: orchestration/.archive/ NO está ignorado"
    echo "   → Agregar 'orchestration/.archive/' al .gitignore"
    ((ERRORS++))
fi

# =============================================
# VALIDACIÓN 3: orchestration/.tmp/ SÍ ignorado
# =============================================
echo ""
echo "3. Verificando orchestration/.tmp/..."
if git check-ignore -q orchestration/.tmp/ 2>/dev/null; then
    echo "✅ orchestration/.tmp/ está ignorado (correcto)"
else
    echo "⚠️  ADVERTENCIA: orchestration/.tmp/ NO está ignorado"
    echo "   → Considerar agregar 'orchestration/.tmp/' al .gitignore"
fi

# =============================================
# VALIDACIÓN 3.5: reference/ NO ignorado
# =============================================
echo ""
echo "3.5. Verificando reference/..."
if git check-ignore -q reference/ 2>/dev/null; then
    echo "❌ ERROR: reference/ está ignorado"
    echo "   → reference/ DEBE estar versionado para código de referencia"
    echo "   → Editar .gitignore y eliminar línea que ignora reference/"
    ((ERRORS++))
else
    echo "✅ reference/ NO está ignorado (correcto)"
fi

# =============================================
# VALIDACIÓN 3.6: reference/**/__pycache__/ SÍ ignorado
# =============================================
echo ""
echo "3.6. Verificando reference/**/__pycache__/..."

# Crear estructura de prueba
mkdir -p reference/test-project/__pycache__ 2>/dev/null

if git check-ignore -q reference/test-project/__pycache__/ 2>/dev/null; then
    echo "✅ reference/**/__pycache__/ está ignorado (correcto)"
    rm -rf reference/test-project 2>/dev/null
else
    echo "❌ ERROR: reference/**/__pycache__/ NO está ignorado"
    echo "   → Agregar 'reference/**/__pycache__/' al .gitignore"
    rm -rf reference/test-project 2>/dev/null
    ((ERRORS++))
fi

# =============================================
# VALIDACIÓN 3.7: reference/**/venv/ SÍ ignorado
# =============================================
echo ""
echo "3.7. Verificando reference/**/venv/..."

# Crear estructura de prueba
mkdir -p reference/test-project/venv 2>/dev/null

if git check-ignore -q reference/test-project/venv/ 2>/dev/null; then
    echo "✅ reference/**/venv/ está ignorado (correcto)"
    rm -rf reference/test-project 2>/dev/null
else
    echo "⚠️  ADVERTENCIA: reference/**/venv/ NO está ignorado"
    echo "   → Agregar 'reference/**/venv/' al .gitignore"
    rm -rf reference/test-project 2>/dev/null
fi

# =============================================
# VALIDACIÓN 3.8: reference/**/node_modules/ SÍ ignorado (si aplica)
# =============================================
echo ""
echo "3.8. Verificando reference/**/node_modules/..."

# Crear estructura de prueba
mkdir -p reference/test-project/node_modules 2>/dev/null

if git check-ignore -q reference/test-project/node_modules/ 2>/dev/null; then
    echo "✅ reference/**/node_modules/ está ignorado (correcto)"
    rm -rf reference/test-project 2>/dev/null
else
    echo "⚠️  ADVERTENCIA: reference/**/node_modules/ NO está ignorado"
    echo "   → Agregar 'reference/**/node_modules/' al .gitignore"
    rm -rf reference/test-project 2>/dev/null
fi

# =============================================
# VALIDACIÓN 4: Patrones de carpetas backup
# =============================================
echo ""
echo "4. Verificando patrones de carpetas backup..."

# Crear carpetas de prueba temporales
test_dirs=("test_old" "test_bckp" "test_backup" "test_bkp")
all_patterns_work=true

for dir in "${test_dirs[@]}"; do
    mkdir -p "$dir"
    if git check-ignore -q "$dir/" 2>/dev/null; then
        echo "   ✅ Patrón ${dir}/ funciona"
        rm -rf "$dir"
    else
        echo "   ❌ ERROR: Patrón ${dir}/ NO funciona"
        echo "      → Agregar '${dir}/' o patrón genérico al .gitignore"
        rm -rf "$dir"
        all_patterns_work=false
        ((ERRORS++))
    fi
done

if [ "$all_patterns_work" = true ]; then
    echo "✅ Todos los patrones de backup funcionan"
fi

# =============================================
# VALIDACIÓN 5: Archivos .tar.gz ignorados
# =============================================
echo ""
echo "5. Verificando que archivos .tar.gz están ignorados..."

# Crear archivo de prueba
test_file="test-backup-20251123.tar.gz"
touch "$test_file"

if git check-ignore -q "$test_file" 2>/dev/null; then
    echo "✅ Archivos .tar.gz están ignorados (correcto)"
    rm -f "$test_file"
else
    echo "⚠️  ADVERTENCIA: Archivos .tar.gz NO están ignorados"
    echo "   → Verificar que '*.tar.gz' está en .gitignore"
    rm -f "$test_file"
fi

# =============================================
# VALIDACIÓN 6: Buscar carpetas backup en workspace
# =============================================
echo ""
echo "6. Buscando carpetas backup en workspace..."

backup_dirs=$(find . -maxdepth 3 -type d \( \
    -name "*_old" -o -name "*_bckp" -o -name "*_bkp" -o -name "*_backup" \
\) ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/.turbo/*" ! -path "*/__pycache__/*" 2>/dev/null)

if [ -n "$backup_dirs" ]; then
    echo "⚠️  ADVERTENCIA: Carpetas backup encontradas en workspace:"
    echo "$backup_dirs" | while read -r dir; do
        size=$(du -sh "$dir" 2>/dev/null | cut -f1)
        echo "   - $dir ($size)"
    done
    echo ""
    echo "   → Acción recomendada:"
    echo "      1. Verificar contenido migrado"
    echo "      2. Archivar en .tar.gz"
    echo "      3. Eliminar carpeta original"
else
    echo "✅ No hay carpetas backup en workspace"
fi

# =============================================
# VALIDACIÓN 7: Verificar archivos en staging
# =============================================
echo ""
echo "7. Verificando que no hay archivos backup en staging..."

staged_backups=$(git status --short | grep -E "^\?\? .*(old|bckp|bkp|backup)" || true)

if [ -n "$staged_backups" ]; then
    echo "⚠️  ADVERTENCIA: Archivos/carpetas backup no trackeados:"
    echo "$staged_backups"
    echo "   → Verificar que están en .gitignore"
else
    echo "✅ No hay archivos backup en staging"
fi

# =============================================
# VALIDACIÓN 8: Verificar archivos de orchestration en repo
# =============================================
echo ""
echo "8. Verificando archivos de orchestration en repositorio..."

orchestration_files=$(git ls-files orchestration/ 2>/dev/null | wc -l)

if [ "$orchestration_files" -gt 10 ]; then
    echo "✅ orchestration/ está en repositorio ($orchestration_files archivos)"
else
    echo "❌ ERROR: orchestration/ tiene pocos archivos en repo ($orchestration_files archivos)"
    echo "   → Verificar que orchestration/ está correctamente versionado"
    echo "   → Ejecutar: git add orchestration/ && git status"
    ((ERRORS++))
fi

# =============================================
# VALIDACIÓN 9: Verificar archivos Python cache ignorados
# =============================================
echo ""
echo "9. Verificando que archivos Python cache están ignorados..."

# Crear archivo de prueba
mkdir -p test_module/__pycache__ 2>/dev/null
touch test_module/__pycache__/test.pyc

if git check-ignore -q test_module/__pycache__/ 2>/dev/null; then
    echo "✅ __pycache__/ está ignorado (correcto)"
    rm -rf test_module
else
    echo "❌ ERROR: __pycache__/ NO está ignorado"
    echo "   → Agregar '__pycache__/' al .gitignore"
    rm -rf test_module
    ((ERRORS++))
fi

# =============================================
# RESUMEN
# =============================================
echo ""
echo "=============================================="
echo "RESUMEN DE VALIDACIÓN"
echo "=============================================="
echo ""

if [ $ERRORS -eq 0 ]; then
    echo "✅ TODAS LAS VALIDACIONES PASARON"
    echo ""
    echo "Estado de .gitignore: CORRECTO"
    echo "Estado de workspace: LIMPIO"
    echo ""
    exit 0
else
    echo "❌ SE ENCONTRARON $ERRORS ERROR(ES)"
    echo ""
    echo "Estado de .gitignore: REQUIERE CORRECCIÓN"
    echo ""
    echo "Acciones recomendadas:"
    echo "1. Revisar errores marcados con ❌ arriba"
    echo "2. Editar .gitignore según indicaciones"
    echo "3. Ejecutar nuevamente este script"
    echo ""
    echo "Referencias:"
    echo "- orchestration/directivas/DIRECTIVA-GESTION-BACKUPS-GITIGNORE.md"
    echo ""
    exit 1
fi
