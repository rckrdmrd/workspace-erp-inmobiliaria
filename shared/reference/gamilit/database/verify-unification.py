#!/usr/bin/env python3
"""
Script de verificación de unificación PROD ↔ DEV
y preparación para carga inicial limpia
"""

import os
import filecmp
from pathlib import Path

# Colores
GREEN = '\033[0;32m'
RED = '\033[0;31m'
YELLOW = '\033[1;33m'
BLUE = '\033[0;34m'
NC = '\033[0m'  # No Color

total_checks = 0
passed_checks = 0
failed_checks = 0
warnings = []

def compare_files(prod_file, dev_file, name):
    """Compara un archivo PROD con DEV"""
    global total_checks, passed_checks, failed_checks

    total_checks += 1

    if not os.path.exists(prod_file):
        print(f"{RED}✗{NC} {name} - PROD no existe: {prod_file}")
        failed_checks += 1
        return False

    if not os.path.exists(dev_file):
        print(f"{RED}✗{NC} {name} - DEV no existe: {dev_file}")
        failed_checks += 1
        return False

    if filecmp.cmp(prod_file, dev_file, shallow=False):
        print(f"{GREEN}✓{NC} {name} - Sincronizado")
        passed_checks += 1
        return True
    else:
        print(f"{RED}✗{NC} {name} - DESINCRONIZADO")
        failed_checks += 1
        return False

def check_file_exists(file_path, name):
    """Verifica que un archivo exista"""
    global total_checks, passed_checks, failed_checks

    total_checks += 1

    if os.path.exists(file_path):
        print(f"{GREEN}✓{NC} {name} existe")
        passed_checks += 1
        return True
    else:
        print(f"{RED}✗{NC} {name} NO EXISTE")
        failed_checks += 1
        return False

print("=" * 75)
print("VERIFICACIÓN DE UNIFICACIÓN PROD ↔ DEV")
print("=" * 75)
print()

# 1. SEEDS EDUCATIONAL_CONTENT
print("1. VERIFICANDO SEEDS EDUCATIONAL_CONTENT")
print("-" * 75)

compare_files(
    "seeds/prod/educational_content/01-modules.sql",
    "seeds/dev/educational_content/01-modules.sql",
    "Modules"
)

for i in range(1, 6):
    module_num = str(i + 1).zfill(2)
    compare_files(
        f"seeds/prod/educational_content/{module_num}-exercises-module{i}.sql",
        f"seeds/dev/educational_content/{module_num}-exercises-module{i}.sql",
        f"Exercises Module {i}"
    )

compare_files(
    "seeds/prod/educational_content/07-assessment-rubrics.sql",
    "seeds/dev/educational_content/07-assessment-rubrics.sql",
    "Assessment Rubrics"
)

compare_files(
    "seeds/prod/educational_content/08-difficulty_criteria.sql",
    "seeds/dev/educational_content/08-difficulty_criteria.sql",
    "Difficulty Criteria"
)

compare_files(
    "seeds/prod/educational_content/09-exercise_mechanic_mapping.sql",
    "seeds/dev/educational_content/09-exercise_mechanic_mapping.sql",
    "Exercise Mechanic Mapping"
)

print()
print("2. VERIFICANDO SEEDS GAMIFICATION_SYSTEM")
print("-" * 75)

compare_files(
    "seeds/prod/gamification_system/01-achievement_categories.sql",
    "seeds/dev/gamification_system/01-achievement_categories.sql",
    "Achievement Categories"
)

compare_files(
    "seeds/prod/gamification_system/02-leaderboard_metadata.sql",
    "seeds/dev/gamification_system/02-leaderboard_metadata.sql",
    "Leaderboard Metadata"
)

compare_files(
    "seeds/prod/gamification_system/03-maya_ranks.sql",
    "seeds/dev/gamification_system/03-maya_ranks.sql",
    "Maya Ranks"
)

compare_files(
    "seeds/prod/gamification_system/04-achievements.sql",
    "seeds/dev/gamification_system/04-achievements.sql",
    "Achievements"
)

print()
print("3. VERIFICANDO SEEDS AUTH")
print("-" * 75)

compare_files(
    "seeds/prod/auth/01-demo-users.sql",
    "seeds/dev/auth/01-demo-users.sql",
    "Demo Users"
)

print()
print("4. VERIFICANDO ARCHIVOS CRÍTICOS DDL")
print("-" * 75)

critical_ddl = [
    ("ddl/schemas/educational_content/tables/01-modules.sql", "Modules Table DDL"),
    ("ddl/schemas/educational_content/tables/02-exercises.sql", "Exercises Table DDL"),
    ("ddl/schemas/gamification_system/tables/13-maya_ranks.sql", "Maya Ranks Table DDL"),
    ("ddl/schemas/gamification_system/tables/01-user_stats.sql", "User Stats Table DDL"),
    ("ddl/schemas/educational_content/tables/03-assessment_rubrics.sql", "Assessment Rubrics DDL"),
]

for file_path, name in critical_ddl:
    check_file_exists(file_path, name)

print()
print("5. VERIFICANDO SCRIPT create-database.sh")
print("-" * 75)

check_file_exists("create-database.sh", "create-database.sh")

if os.path.exists("create-database.sh"):
    total_checks += 1
    if os.access("create-database.sh", os.X_OK):
        print(f"{GREEN}✓{NC} create-database.sh es ejecutable")
        passed_checks += 1
    else:
        print(f"{YELLOW}⚠{NC}  create-database.sh NO es ejecutable (pero existe)")
        warnings.append("create-database.sh no es ejecutable")
        passed_checks += 1

    total_checks += 1
    with open("create-database.sh", "r") as f:
        content = f.read()
        if "FASE 16: SEED DATA" in content:
            print(f"{GREEN}✓{NC} create-database.sh contiene carga de seeds")
            passed_checks += 1
        else:
            print(f"{RED}✗{NC} create-database.sh NO contiene carga de seeds")
            failed_checks += 1

print()
print("6. VERIFICANDO ARCHIVOS OBSOLETOS/TEMPORALES")
print("-" * 75)

# Buscar archivos que NO deberían estar
obsolete_found = False

# Migraciones (no deberían usarse en carga limpia)
migration_path = Path("scripts/migrations")
if migration_path.exists():
    migrations = list(migration_path.glob("*.sql"))
    if migrations:
        print(f"{YELLOW}⚠{NC}  Se encontraron {len(migrations)} archivos de migración")
        warnings.append(f"{len(migrations)} archivos de migración encontrados")
        obsolete_found = True

# Archivos temporales
for pattern in ["**/*~", "**/*.bak", "**/*.tmp"]:
    temp_files = list(Path(".").glob(pattern))
    if temp_files:
        print(f"{YELLOW}⚠{NC}  Archivos temporales encontrados: {pattern}")
        warnings.append(f"Archivos temporales: {pattern}")
        obsolete_found = True

if not obsolete_found:
    print(f"{GREEN}✓{NC} No se encontraron archivos obsoletos")

print()
print("=" * 75)
print("RESUMEN")
print("=" * 75)
print()
print(f"Total de verificaciones: {total_checks}")
print(f"{GREEN}Pasadas: {passed_checks}{NC}")
print(f"{RED}Fallidas: {failed_checks}{NC}")

if warnings:
    print(f"{YELLOW}Advertencias: {len(warnings)}{NC}")
    for warning in warnings:
        print(f"  - {warning}")

print()

if failed_checks == 0:
    print(f"{GREEN}✅ TODOS LOS CHECKS PASARON{NC}")
    print(f"{GREEN}✅ Sistema listo para carga inicial limpia{NC}")

    if warnings:
        print()
        print(f"{YELLOW}⚠️  Hay {len(warnings)} advertencias menores (no críticas){NC}")

    exit(0)
else:
    print(f"{RED}❌ HAY {failed_checks} CHECKS FALLIDOS{NC}")
    print(f"{YELLOW}⚠️  Revisar archivos desincronizados antes de carga limpia{NC}")
    exit(1)
