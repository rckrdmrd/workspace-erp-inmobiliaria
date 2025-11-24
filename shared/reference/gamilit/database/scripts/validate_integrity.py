#!/usr/bin/env python3
"""
Script de validación exhaustiva de integridad de la base de datos GAMILIT
Fecha: 2025-11-07
"""

import os
import re
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Set, Tuple

# Colores para output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_section(title):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*80}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{title}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*80}{Colors.ENDC}\n")

def print_error(severity, msg):
    color = Colors.FAIL if severity == "CRÍTICO" else Colors.WARNING if severity == "ALTO" else Colors.OKCYAN
    print(f"{color}[{severity}] {msg}{Colors.ENDC}")

def print_ok(msg):
    print(f"{Colors.OKGREEN}✓ {msg}{Colors.ENDC}")

# Configuración de paths
BASE_PATH = Path("/home/isem/workspace/workspace-gamilit/gamilit/projects/gamilit/apps/database/ddl")
SCHEMAS_PATH = BASE_PATH / "schemas"

# 1. EXTRAER TODOS LOS ENUMs DEFINIDOS
def extract_enums():
    """Extrae todos los ENUMs definidos en el sistema"""
    enums = {}

    # 1.1 ENUMs en 00-prerequisites.sql
    prereq_file = BASE_PATH / "00-prerequisites.sql"
    if prereq_file.exists():
        content = prereq_file.read_text()
        # Buscar CREATE TYPE schema.enum AS ENUM
        pattern = r'CREATE TYPE\s+([\w.]+)\s+AS ENUM\s*\((.*?)\);'
        matches = re.findall(pattern, content, re.DOTALL | re.IGNORECASE)
        for enum_name, values in matches:
            schema = "public"
            name = enum_name
            if "." in enum_name:
                schema, name = enum_name.split(".", 1)

            # Limpiar valores
            vals = [v.strip().strip("'").strip('"') for v in re.findall(r"'([^']*)'", values)]
            enums[f"{schema}.{name}"] = {
                "file": str(prereq_file),
                "schema": schema,
                "name": name,
                "values": vals,
                "count": len(vals)
            }

    # 1.2 ENUMs en archivos individuales
    for enum_file in SCHEMAS_PATH.rglob("enums/*.sql"):
        content = enum_file.read_text()

        # Extraer schema del path
        parts = enum_file.parts
        schema_idx = parts.index("schemas") + 1
        schema = parts[schema_idx]

        # Buscar CREATE TYPE
        pattern = r'CREATE TYPE\s+([\w.]+)\s+AS ENUM\s*\((.*?)\);'
        matches = re.findall(pattern, content, re.DOTALL | re.IGNORECASE)

        for enum_name, values in matches:
            if "." in enum_name:
                schema, name = enum_name.split(".", 1)
            else:
                name = enum_name

            vals = [v.strip().strip("'").strip('"') for v in re.findall(r"'([^']*)'", values)]

            full_name = f"{schema}.{name}"
            enums[full_name] = {
                "file": str(enum_file),
                "schema": schema,
                "name": name,
                "values": vals,
                "count": len(vals)
            }

    return enums

# 2. EXTRAER TODAS LAS TABLAS DEFINIDAS
def extract_tables():
    """Extrae todas las tablas definidas"""
    tables = {}

    for table_file in SCHEMAS_PATH.rglob("tables/*.sql"):
        content = table_file.read_text()

        # Extraer schema del path
        parts = table_file.parts
        schema_idx = parts.index("schemas") + 1
        schema = parts[schema_idx]

        # Buscar CREATE TABLE
        pattern = r'CREATE TABLE\s+(?:IF NOT EXISTS\s+)?([\w.]+)'
        matches = re.findall(pattern, content, re.IGNORECASE)

        for table_name in matches:
            if "." in table_name:
                tbl_schema, tbl_name = table_name.split(".", 1)
            else:
                tbl_schema = schema
                tbl_name = table_name

            full_name = f"{tbl_schema}.{tbl_name}"
            tables[full_name] = {
                "file": str(table_file),
                "schema": tbl_schema,
                "name": tbl_name
            }

    return tables

# 3. VALIDAR FOREIGN KEYS
def validate_foreign_keys(tables):
    """Valida que todas las referencias de FK apunten a tablas existentes"""
    issues = []

    print_section("VALIDACIÓN 1: INTEGRIDAD DE FOREIGN KEYS")

    for table_file in SCHEMAS_PATH.rglob("tables/*.sql"):
        content = table_file.read_text()

        # Buscar REFERENCES
        pattern = r'REFERENCES\s+([\w.]+)\s*\('
        matches = re.findall(pattern, content, re.IGNORECASE)

        for ref_table in matches:
            # Normalizar nombre
            if "." not in ref_table:
                # Buscar schema del archivo actual
                parts = table_file.parts
                schema_idx = parts.index("schemas") + 1
                schema = parts[schema_idx]
                ref_table = f"{schema}.{ref_table}"

            if ref_table not in tables:
                issues.append({
                    "severity": "CRÍTICO",
                    "type": "FK_BROKEN",
                    "file": str(table_file),
                    "message": f"Referencia a tabla inexistente: {ref_table}"
                })

    if not issues:
        print_ok("Todas las Foreign Keys apuntan a tablas existentes")
    else:
        for issue in issues:
            print_error(issue["severity"], f"{issue['message']}\n  Archivo: {issue['file']}")

    return issues

# 4. VALIDAR ENUMS EN TABLAS
def validate_enum_references(enums, tables):
    """Valida que todos los ENUMs usados en tablas existan"""
    issues = []

    print_section("VALIDACIÓN 2: INTEGRIDAD DE ENUMs")

    for table_file in SCHEMAS_PATH.rglob("tables/*.sql"):
        content = table_file.read_text()

        # Buscar columnas con tipo ENUM (schema.enum_name)
        pattern = r'(\w+)\s+([\w.]+)(?:\s+(?:NOT NULL|DEFAULT|CHECK|UNIQUE|PRIMARY KEY))?'

        # Buscar específicamente tipos que parecen ENUMs (esquema.tipo)
        enum_pattern = r'\s+([\w]+\.\w+)(?:\s|,|\))'
        enum_matches = re.findall(enum_pattern, content)

        for enum_ref in enum_matches:
            # Ignorar cosas que no son ENUMs
            if enum_ref.startswith('auth.') or enum_ref.startswith('educational_content.') or enum_ref.startswith('social_features.'):
                if '(' in enum_ref or ')' in enum_ref:
                    continue

            # Verificar si es un ENUM conocido
            if enum_ref not in enums:
                # Podría ser una tabla, verificar
                if enum_ref not in tables:
                    issues.append({
                        "severity": "ALTO",
                        "type": "ENUM_NOT_FOUND",
                        "file": str(table_file),
                        "message": f"Posible referencia a ENUM inexistente: {enum_ref}"
                    })

    if not issues:
        print_ok("Todos los ENUMs referenciados existen")
    else:
        for issue in issues:
            print_error(issue["severity"], f"{issue['message']}\n  Archivo: {issue['file']}")

    return issues

# 5. VALIDAR CORRECCIONES APLICADAS
def validate_corrections():
    """Valida las correcciones específicas mencionadas en el tracking"""
    issues = []

    print_section("VALIDACIÓN 3: CORRECCIONES APLICADAS")

    # 5.1 notification_type - Debe tener 11 valores
    print("\n--- notification_type ---")
    enum_file = SCHEMAS_PATH / "public" / "enums" / "notification_type.sql"
    if enum_file.exists():
        content = enum_file.read_text()
        values = re.findall(r"'([^']*)'", content)
        if len(values) == 11:
            print_ok(f"notification_type tiene 11 valores correctos")
            expected = ['achievement_unlocked', 'rank_up', 'friend_request', 'guild_invitation',
                       'mission_completed', 'level_up', 'message_received', 'system_announcement',
                       'ml_coins_earned', 'streak_milestone', 'exercise_feedback']
            missing = set(expected) - set(values)
            if missing:
                issues.append({
                    "severity": "ALTO",
                    "type": "ENUM_VALUES",
                    "file": str(enum_file),
                    "message": f"notification_type falta valores: {missing}"
                })
        else:
            issues.append({
                "severity": "CRÍTICO",
                "type": "ENUM_VALUES",
                "file": str(enum_file),
                "message": f"notification_type tiene {len(values)} valores, esperados 11"
            })

    # 5.2 achievement_category - Debe estar en gamification_system
    print("\n--- achievement_category ---")
    enum_file = SCHEMAS_PATH / "gamification_system" / "enums" / "achievement_category.sql"
    if enum_file.exists():
        print_ok(f"achievement_category está en gamification_system")

        # Verificar que la tabla achievements lo usa
        table_file = SCHEMAS_PATH / "gamification_system" / "tables" / "03-achievements.sql"
        if table_file.exists():
            content = table_file.read_text()
            if "gamification_system.achievement_category" in content:
                print_ok("achievements usa gamification_system.achievement_category")
            elif "public.achievement_category" in content:
                issues.append({
                    "severity": "CRÍTICO",
                    "type": "ENUM_SCHEMA",
                    "file": str(table_file),
                    "message": "achievements usa public.achievement_category (debe ser gamification_system)"
                })
    else:
        issues.append({
            "severity": "CRÍTICO",
            "type": "ENUM_MISSING",
            "file": "N/A",
            "message": "achievement_category no existe en gamification_system"
        })

    # 5.3 transaction_type - Debe estar en gamification_system
    print("\n--- transaction_type ---")
    enum_file = SCHEMAS_PATH / "gamification_system" / "enums" / "transaction_type.sql"
    if enum_file.exists():
        content = enum_file.read_text()
        values = re.findall(r"'([^']*)'", content)
        print_ok(f"transaction_type existe en gamification_system con {len(values)} valores")

        # Debe tener 14 valores según tracking
        if len(values) != 14:
            issues.append({
                "severity": "MEDIO",
                "type": "ENUM_VALUES",
                "file": str(enum_file),
                "message": f"transaction_type tiene {len(values)} valores, esperados 14 según tracking"
            })
    else:
        issues.append({
            "severity": "CRÍTICO",
            "type": "ENUM_MISSING",
            "file": "N/A",
            "message": "transaction_type no existe en gamification_system"
        })

    return issues

# 6. BUSCAR FUNCIONES CON REFERENCIAS ROTAS
def validate_functions(tables):
    """Busca funciones que referencien tablas inexistentes"""
    issues = []

    print_section("VALIDACIÓN 4: FUNCIONES CON REFERENCIAS ROTAS")

    function_files = list(SCHEMAS_PATH.rglob("functions/*.sql"))

    for func_file in function_files:
        content = func_file.read_text()

        # Buscar FROM, JOIN, INSERT INTO, UPDATE, DELETE FROM
        patterns = [
            r'FROM\s+([\w.]+)',
            r'JOIN\s+([\w.]+)',
            r'INSERT INTO\s+([\w.]+)',
            r'UPDATE\s+([\w.]+)',
            r'DELETE FROM\s+([\w.]+)'
        ]

        for pattern in patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            for table_ref in matches:
                # Normalizar
                if "." not in table_ref and table_ref not in ['NEW', 'OLD', 'RETURNING', 'VALUES']:
                    parts = func_file.parts
                    schema_idx = parts.index("schemas") + 1
                    schema = parts[schema_idx]
                    table_ref = f"{schema}.{table_ref}"

                if "." in table_ref and table_ref not in tables:
                    # Verificar que no sea palabra clave SQL
                    if table_ref.lower() not in ['with.recursive', 'select.distinct']:
                        issues.append({
                            "severity": "ALTO",
                            "type": "FUNCTION_BROKEN_REF",
                            "file": str(func_file),
                            "message": f"Función referencia tabla inexistente: {table_ref}"
                        })

    if not issues:
        print_ok("Todas las funciones referencian tablas válidas")
    else:
        for issue in issues:
            print_error(issue["severity"], f"{issue['message']}\n  Archivo: {issue['file']}")

    return issues

# 7. BUSCAR TRIGGERS CON REFERENCIAS ROTAS
def validate_triggers():
    """Busca triggers que llamen funciones inexistentes"""
    issues = []

    print_section("VALIDACIÓN 5: TRIGGERS CON REFERENCIAS ROTAS")

    # Primero extraer todas las funciones
    functions = set()
    for func_file in SCHEMAS_PATH.rglob("functions/*.sql"):
        content = func_file.read_text()
        pattern = r'CREATE\s+(?:OR REPLACE\s+)?FUNCTION\s+([\w.]+)\s*\('
        matches = re.findall(pattern, content, re.IGNORECASE)
        functions.update(matches)

    # Agregar funciones de prerequisites
    prereq_file = BASE_PATH / "00-prerequisites.sql"
    if prereq_file.exists():
        content = prereq_file.read_text()
        pattern = r'CREATE\s+(?:OR REPLACE\s+)?FUNCTION\s+([\w.]+)\s*\('
        matches = re.findall(pattern, content, re.IGNORECASE)
        functions.update(matches)

    # Validar triggers
    for trigger_file in SCHEMAS_PATH.rglob("triggers/*.sql"):
        content = trigger_file.read_text()

        # Buscar EXECUTE FUNCTION
        pattern = r'EXECUTE\s+(?:FUNCTION|PROCEDURE)\s+([\w.]+)\s*\('
        matches = re.findall(pattern, content, re.IGNORECASE)

        for func_ref in matches:
            if func_ref not in functions:
                issues.append({
                    "severity": "CRÍTICO",
                    "type": "TRIGGER_BROKEN_REF",
                    "file": str(trigger_file),
                    "message": f"Trigger llama función inexistente: {func_ref}"
                })

    if not issues:
        print_ok("Todos los triggers llaman funciones válidas")
    else:
        for issue in issues:
            print_error(issue["severity"], f"{issue['message']}\n  Archivo: {issue['file']}")

    return issues

# 8. BUSCAR ENUMS DUPLICADOS
def check_duplicate_enums(enums):
    """Busca ENUMs duplicados en múltiples schemas"""
    issues = []

    print_section("VALIDACIÓN 6: ENUMs DUPLICADOS")

    enum_names = defaultdict(list)
    for full_name, info in enums.items():
        name = info["name"]
        enum_names[name].append(full_name)

    for name, locations in enum_names.items():
        if len(locations) > 1:
            issues.append({
                "severity": "ALTO",
                "type": "ENUM_DUPLICATE",
                "file": "N/A",
                "message": f"ENUM '{name}' duplicado en: {', '.join(locations)}"
            })

    if not issues:
        print_ok("No hay ENUMs duplicados")
    else:
        for issue in issues:
            print_error(issue["severity"], issue["message"])

    return issues

# MAIN
def main():
    print(f"\n{Colors.BOLD}VALIDACIÓN EXHAUSTIVA DE INTEGRIDAD - BASE DE DATOS GAMILIT{Colors.ENDC}")
    print(f"{Colors.BOLD}Fecha: 2025-11-07{Colors.ENDC}")
    print(f"{Colors.BOLD}Post-correcciones: 9/142 completadas{Colors.ENDC}\n")

    # Extraer información
    print("Extrayendo información de la base de datos...")
    enums = extract_enums()
    tables = extract_tables()

    print(f"✓ {len(enums)} ENUMs encontrados")
    print(f"✓ {len(tables)} tablas encontradas")

    # Ejecutar validaciones
    all_issues = []

    all_issues.extend(validate_foreign_keys(tables))
    all_issues.extend(validate_enum_references(enums, tables))
    all_issues.extend(validate_corrections())
    all_issues.extend(validate_functions(tables))
    all_issues.extend(validate_triggers())
    all_issues.extend(check_duplicate_enums(enums))

    # RESUMEN FINAL
    print_section("RESUMEN DE VALIDACIÓN")

    critical = [i for i in all_issues if i["severity"] == "CRÍTICO"]
    high = [i for i in all_issues if i["severity"] == "ALTO"]
    medium = [i for i in all_issues if i["severity"] == "MEDIO"]
    low = [i for i in all_issues if i["severity"] == "BAJO"]

    print(f"\n{Colors.FAIL}CRÍTICO: {len(critical)} problemas{Colors.ENDC}")
    print(f"{Colors.WARNING}ALTO: {len(high)} problemas{Colors.ENDC}")
    print(f"{Colors.OKCYAN}MEDIO: {len(medium)} problemas{Colors.ENDC}")
    print(f"{Colors.OKBLUE}BAJO: {len(low)} problemas{Colors.ENDC}")
    print(f"\n{Colors.BOLD}TOTAL: {len(all_issues)} problemas encontrados{Colors.ENDC}\n")

    if len(all_issues) == 0:
        print(f"{Colors.OKGREEN}{Colors.BOLD}✓✓✓ BASE DE DATOS VALIDADA EXITOSAMENTE ✓✓✓{Colors.ENDC}\n")
    else:
        print(f"{Colors.FAIL}{Colors.BOLD}⚠ SE REQUIERE ATENCIÓN ⚠{Colors.ENDC}\n")

    return all_issues

if __name__ == "__main__":
    issues = main()
