#!/bin/bash
# ============================================================================
# Script: verify-users.sh
# Descripción: Verifica que usuarios y perfiles estén correctamente cargados
# Fecha: 2025-11-09
# Autor: Claude Code (AI Assistant)
# ============================================================================

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
echo "  VERIFICACIÓN DE USUARIOS Y PERFILES"
echo "════════════════════════════════════════════════════════════════"
echo ""

echo "📊 USUARIOS EN auth.users:"
echo ""
$PSQL -c "
SELECT
    email,
    role,
    email_confirmed_at IS NOT NULL as confirmed,
    TO_CHAR(created_at, 'YYYY-MM-DD') as created
FROM auth.users
WHERE email LIKE '%@glit.edu.mx'
   OR email LIKE '%@demo.glit.edu.mx'
   OR email LIKE '%@gamilit.com'
ORDER BY role, email;
"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "📝 PERFILES EN auth_management.profiles:"
echo ""
$PSQL -c "
SELECT
    email,
    role,
    full_name,
    status,
    email_verified
FROM auth_management.profiles
WHERE email LIKE '%@glit.edu.mx'
   OR email LIKE '%@demo.glit.edu.mx'
   OR email LIKE '%@gamilit.com'
ORDER BY role, email;
"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "🔗 VINCULACIÓN users <-> profiles:"
echo ""
$PSQL -c "
SELECT
    u.email,
    CASE
        WHEN p.user_id IS NOT NULL THEN '✅ Vinculado'
        ELSE '❌ Sin Profile'
    END as vinculacion,
    u.role as user_role,
    p.role as profile_role
FROM auth.users u
LEFT JOIN auth_management.profiles p ON u.id = p.user_id
WHERE u.email LIKE '%@glit.edu.mx'
   OR u.email LIKE '%@demo.glit.edu.mx'
   OR u.email LIKE '%@gamilit.com'
ORDER BY u.role, u.email;
"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "📈 RESUMEN:"
echo ""

# Contar totales
TOTAL_USERS=$($PSQL -t -c "
SELECT COUNT(*) FROM auth.users
WHERE email LIKE '%@glit.edu.mx'
   OR email LIKE '%@demo.glit.edu.mx'
   OR email LIKE '%@gamilit.com';
" | tr -d ' ')

TOTAL_PROFILES=$($PSQL -t -c "
SELECT COUNT(*) FROM auth_management.profiles
WHERE email LIKE '%@glit.edu.mx'
   OR email LIKE '%@demo.glit.edu.mx'
   OR email LIKE '%@gamilit.com';
" | tr -d ' ')

LINKED=$($PSQL -t -c "
SELECT COUNT(*)
FROM auth.users u
INNER JOIN auth_management.profiles p ON u.id = p.user_id
WHERE u.email LIKE '%@glit.edu.mx'
   OR u.email LIKE '%@demo.glit.edu.mx'
   OR u.email LIKE '%@gamilit.com';
" | tr -d ' ')

UNLINKED=$((TOTAL_USERS - LINKED))

echo "   Total usuarios:       $TOTAL_USERS"
echo "   Total profiles:       $TOTAL_PROFILES"
echo "   Vinculados:           $LINKED"
echo "   Sin vincular:         $UNLINKED"

echo ""

if [ "$TOTAL_USERS" -eq "$TOTAL_PROFILES" ] && [ "$UNLINKED" -eq 0 ]; then
    echo "✅ Estado: CORRECTO - Todos los usuarios tienen perfil"
else
    echo "⚠️  Estado: REVISAR - Hay usuarios sin perfil o desvinculados"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
