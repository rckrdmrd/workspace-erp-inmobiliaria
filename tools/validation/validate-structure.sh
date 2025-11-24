#!/bin/bash

# Script de validación de estructura multi-proyecto

WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$WORKSPACE_ROOT"

echo "🔍 Validando estructura del workspace..."
echo ""

errors=0

# Validar shared/
echo "Validando shared/..."
for dir in reference orchestration analysis bugs components docs; do
    if [ -d "shared/$dir" ]; then
        echo "  ✓ shared/$dir"
    else
        echo "  ✗ shared/$dir NO EXISTE"
        ((errors++))
    fi
done

# Validar projects/
echo ""
echo "Validando projects/..."
for project in erp-generic erp-construccion erp-vidrio-templado erp-mecanicas-diesel; do
    if [ -d "projects/$project" ]; then
        echo "  ✓ projects/$project"

        # Validar subcarpetas
        for subdir in docs apps orchestration bugs; do
            if [ -d "projects/$project/$subdir" ]; then
                echo "    ✓ $subdir/"
            else
                echo "    ✗ $subdir/ NO EXISTE"
                ((errors++))
            fi
        done

        # Validar archivos README
        if [ -f "projects/$project/README.md" ]; then
            echo "    ✓ README.md"
        else
            echo "    ✗ README.md NO EXISTE"
            ((errors++))
        fi

        if [ -f "projects/$project/PROJECT-STATUS.md" ]; then
            echo "    ✓ PROJECT-STATUS.md"
        else
            echo "    ✗ PROJECT-STATUS.md NO EXISTE"
            ((errors++))
        fi
    else
        echo "  ✗ projects/$project NO EXISTE"
        ((errors++))
    fi
done

# Validar tools/
echo ""
echo "Validando tools/..."
for dir in scaffolding migration validation; do
    if [ -d "tools/$dir" ]; then
        echo "  ✓ tools/$dir"
    else
        echo "  ✗ tools/$dir NO EXISTE"
        ((errors++))
    fi
done

# Validar archivos raíz
echo ""
echo "Validando archivos raíz..."
for file in README.md WORKSPACE-OVERVIEW.md PROPUESTA-REESTRUCTURACION-MULTI-PROYECTO.md; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file NO EXISTE"
        ((errors++))
    fi
done

echo ""
if [ $errors -eq 0 ]; then
    echo "✅ Validación exitosa - Estructura completa"
    exit 0
else
    echo "❌ Validación fallida - $errors errores encontrados"
    exit 1
fi
