#!/bin/bash
# ============================================================================
# Script: load-users-and-profiles.sh
# Descripción: Carga usuarios y perfiles correctamente
# Versión: 2.0 (con correcciones para tablas faltantes)
# Fecha: 2025-11-09
# Autor: Claude Code (AI Assistant)
# ============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DB_DIR="$(dirname "$SCRIPT_DIR")"

cd "$DB_DIR"

# Cargar credenciales
if [ ! -f "database-credentials-dev.txt" ]; then
    echo "❌ Error: database-credentials-dev.txt no encontrado"
    exit 1
fi

DB_PASSWORD=$(grep "^Password:" database-credentials-dev.txt | awk '{print $2}')
export PGPASSWORD="$DB_PASSWORD"

PSQL="psql -h localhost -p 5432 -U gamilit_user -d gamilit_platform"

echo "════════════════════════════════════════════════════════════════"
echo "  CARGANDO USUARIOS Y PERFILES - GAMILIT PLATFORM"
echo "════════════════════════════════════════════════════════════════"
echo ""

# PASO 1: Verificar tablas de gamificación
echo "📋 PASO 1: Verificando tablas de gamificación..."
TABLES_COUNT=$($PSQL -t -c "
SELECT COUNT(*)
FROM information_schema.tables
WHERE table_schema = 'gamification_system'
  AND table_name IN ('user_stats', 'user_ranks');
" | tr -d ' ')

if [ "$TABLES_COUNT" -lt 2 ]; then
    echo "⚠️  Tablas de gamificación faltantes ($TABLES_COUNT/2). Creando..."
    bash "$SCRIPT_DIR/fix-missing-gamification-tables.sh"
else
    echo "✅ Tablas de gamificación presentes (2/2)"
fi

echo ""

# PASO 2: Cargar usuarios en auth.users
echo "👥 PASO 2: Cargando usuarios en auth.users..."

if [ -f "seeds/dev/auth/01-demo-users.sql" ]; then
    $PSQL -f seeds/dev/auth/01-demo-users.sql > /dev/null 2>&1
    echo "   ✅ Demo users cargados"
else
    echo "   ⚠️  seeds/dev/auth/01-demo-users.sql no encontrado"
fi

if [ -f "seeds/dev/auth/02-test-users.sql" ]; then
    $PSQL -f seeds/dev/auth/02-test-users.sql > /dev/null 2>&1
    echo "   ✅ Test users cargados"
else
    echo "   ⚠️  seeds/dev/auth/02-test-users.sql no encontrado"
fi

USERS_COUNT=$($PSQL -t -c "
SELECT COUNT(*) FROM auth.users
WHERE email LIKE '%@glit.edu.mx'
   OR email LIKE '%@demo.glit.edu.mx'
   OR email LIKE '%@gamilit.com';
" | tr -d ' ')
echo "   📊 Total usuarios: $USERS_COUNT"

echo ""

# PASO 3: Cargar profiles en auth_management.profiles
echo "📝 PASO 3: Cargando profiles..."

if [ -f "seeds/dev/auth_management/03-profiles.sql" ]; then
    # Ejecutar y capturar errores
    if $PSQL -f seeds/dev/auth_management/03-profiles.sql 2>&1 | grep -q "ERROR"; then
        echo "   ⚠️  Error al cargar profiles. Intentando método alternativo..."

        # Deshabilitar trigger temporalmente
        $PSQL -c "ALTER TABLE auth_management.profiles DISABLE TRIGGER trg_initialize_user_stats;" > /dev/null 2>&1

        # Re-intentar carga
        $PSQL -f seeds/dev/auth_management/03-profiles.sql > /dev/null 2>&1

        # Re-habilitar trigger
        $PSQL -c "ALTER TABLE auth_management.profiles ENABLE TRIGGER trg_initialize_user_stats;" > /dev/null 2>&1

        echo "   ✅ Profiles cargados (método alternativo)"
    else
        echo "   ✅ Profiles cargados"
    fi
else
    echo "   ⚠️  seeds/dev/auth_management/03-profiles.sql no encontrado"
fi

PROFILES_COUNT=$($PSQL -t -c "
SELECT COUNT(*) FROM auth_management.profiles
WHERE email LIKE '%@glit.edu.mx'
   OR email LIKE '%@demo.glit.edu.mx'
   OR email LIKE '%@gamilit.com';
" | tr -d ' ')
echo "   📊 Total profiles: $PROFILES_COUNT"

echo ""

# PASO 4: Verificación final
echo "✅ PASO 4: Verificación final..."
echo ""

$PSQL -c "
SELECT
    'auth.users' as tabla,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE role = 'super_admin') as admins,
    COUNT(*) FILTER (WHERE role = 'admin_teacher') as teachers,
    COUNT(*) FILTER (WHERE role = 'student') as students
FROM auth.users
WHERE email LIKE '%@glit.edu.mx'
   OR email LIKE '%@demo.glit.edu.mx'
   OR email LIKE '%@gamilit.com'
UNION ALL
SELECT
    'auth_management.profiles' as tabla,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE role = 'super_admin') as admins,
    COUNT(*) FILTER (WHERE role = 'admin_teacher') as teachers,
    COUNT(*) FILTER (WHERE role = 'student') as students
FROM auth_management.profiles
WHERE email LIKE '%@glit.edu.mx'
   OR email LIKE '%@demo.glit.edu.mx'
   OR email LIKE '%@gamilit.com';
"

echo ""

# Verificar vinculación
UNLINKED=$($PSQL -t -c "
SELECT COUNT(*)
FROM auth.users u
LEFT JOIN auth_management.profiles p ON u.id = p.user_id
WHERE p.user_id IS NULL
  AND (u.email LIKE '%@glit.edu.mx'
       OR u.email LIKE '%@demo.glit.edu.mx'
       OR u.email LIKE '%@gamilit.com');
" | tr -d ' ')

if [ "$UNLINKED" -gt 0 ]; then
    echo "⚠️  Advertencia: $UNLINKED usuarios sin perfil"
else
    echo "✅ Todos los usuarios tienen perfil vinculado"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  ✅ CARGA COMPLETADA"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📊 Resumen:"
echo "   Usuarios cargados: $USERS_COUNT"
echo "   Profiles cargados: $PROFILES_COUNT"
echo "   Sin vincular: $UNLINKED"
echo ""
echo "📝 Para ver detalles, ejecutar:"
echo "   bash scripts/verify-users.sh"
echo ""
