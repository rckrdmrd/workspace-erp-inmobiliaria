#!/usr/bin/env python3
"""
Script para corregir la unificación PROD ↔ DEV
"""

import os
import shutil
from pathlib import Path

GREEN = '\033[0;32m'
RED = '\033[0;31m'
YELLOW = '\033[1;33m'
NC = '\033[0m'

print("=" * 75)
print("CORRECCIÓN DE UNIFICACIÓN PROD ↔ DEV")
print("=" * 75)
print()

actions_taken = []

# 1. Sincronizar archivos desincronizados (PROD → DEV)
print("1. SINCRONIZANDO ARCHIVOS PROD → DEV")
print("-" * 75)

sync_files = [
    ("seeds/prod/educational_content/01-modules.sql", "seeds/dev/educational_content/01-modules.sql"),
    ("seeds/prod/gamification_system/01-achievement_categories.sql", "seeds/dev/gamification_system/01-achievement_categories.sql"),
    ("seeds/prod/auth/01-demo-users.sql", "seeds/dev/auth/01-demo-users.sql"),
]

for prod_file, dev_file in sync_files:
    if os.path.exists(prod_file):
        os.makedirs(os.path.dirname(dev_file), exist_ok=True)
        shutil.copy2(prod_file, dev_file)
        print(f"{GREEN}✓{NC} Copiado: {prod_file} → {dev_file}")
        actions_taken.append(f"Sincronizado: {os.path.basename(dev_file)}")
    else:
        print(f"{RED}✗{NC} PROD no existe: {prod_file}")

# 2. Copiar archivos faltantes en DEV
print()
print("2. COPIANDO ARCHIVOS FALTANTES PROD → DEV")
print("-" * 75)

missing_in_dev = [
    ("seeds/prod/gamification_system/02-leaderboard_metadata.sql", "seeds/dev/gamification_system/02-leaderboard_metadata.sql"),
    ("seeds/prod/gamification_system/03-maya_ranks.sql", "seeds/dev/gamification_system/03-maya_ranks.sql"),
    ("seeds/prod/gamification_system/04-achievements.sql", "seeds/dev/gamification_system/04-achievements.sql"),
]

for prod_file, dev_file in missing_in_dev:
    if os.path.exists(prod_file):
        os.makedirs(os.path.dirname(dev_file), exist_ok=True)
        shutil.copy2(prod_file, dev_file)
        print(f"{GREEN}✓{NC} Copiado: {prod_file} → {dev_file}")
        actions_taken.append(f"Creado: {os.path.basename(dev_file)}")
    else:
        print(f"{YELLOW}⚠{NC}  PROD no existe: {prod_file}")

# 3. Copiar archivos faltantes en educational_content (si existen)
print()
print("3. VERIFICANDO educational_content ADICIONALES")
print("-" * 75)

additional_files = [
    ("seeds/prod/educational_content/07-assessment-rubrics.sql", "seeds/dev/educational_content/07-assessment-rubrics.sql"),
    ("seeds/prod/educational_content/08-difficulty_criteria.sql", "seeds/dev/educational_content/08-difficulty_criteria.sql"),
    ("seeds/prod/educational_content/09-exercise_mechanic_mapping.sql", "seeds/dev/educational_content/09-exercise_mechanic_mapping.sql"),
]

for prod_file, dev_file in additional_files:
    if os.path.exists(prod_file):
        os.makedirs(os.path.dirname(dev_file), exist_ok=True)
        shutil.copy2(prod_file, dev_file)
        print(f"{GREEN}✓{NC} Copiado: {prod_file} → {dev_file}")
        actions_taken.append(f"Creado: {os.path.basename(dev_file)}")
    else:
        print(f"{YELLOW}⚠{NC}  PROD no existe (OK si no se usa): {prod_file}")

# 4. Eliminar archivos temporales
print()
print("4. ELIMINANDO ARCHIVOS TEMPORALES")
print("-" * 75)

temp_patterns = ["**/*.bak", "**/*~", "**/*.tmp"]
deleted_count = 0

for pattern in temp_patterns:
    for temp_file in Path(".").glob(pattern):
        try:
            temp_file.unlink()
            print(f"{GREEN}✓{NC} Eliminado: {temp_file}")
            deleted_count += 1
        except Exception as e:
            print(f"{RED}✗{NC} Error eliminando {temp_file}: {e}")

if deleted_count == 0:
    print(f"{GREEN}✓{NC} No se encontraron archivos temporales")
else:
    actions_taken.append(f"Eliminados {deleted_count} archivos temporales")

# Resumen
print()
print("=" * 75)
print("RESUMEN DE ACCIONES")
print("=" * 75)
print()

if actions_taken:
    for action in actions_taken:
        print(f"  • {action}")
    print()
    print(f"{GREEN}✅ Se realizaron {len(actions_taken)} acciones de corrección{NC}")
else:
    print(f"{GREEN}✅ No se necesitaron correcciones{NC}")

print()
print("Ejecuta verify-unification.py nuevamente para verificar")
