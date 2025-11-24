-- Nombre: is_super_admin
-- Descripción: Alias de is_admin() - Verifica si el usuario actual tiene rol de super administrador
-- Schema: gamilit
-- Tipo: FUNCTION
-- Dependencias: gamilit.is_admin()
-- Uso: Políticas RLS para control de acceso administrativo (alias para compatibilidad)

CREATE OR REPLACE FUNCTION gamilit.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
    -- Alias de is_admin() para compatibilidad con RLS policies existentes
    RETURN gamilit.is_admin();
END;
$$;

-- Comentario descriptivo
COMMENT ON FUNCTION gamilit.is_super_admin() IS
    'Alias de is_admin() para compatibilidad. '
    'Retorna TRUE si el usuario actual es administrador (admin_teacher o super_admin). '
    'Utilizada por políticas RLS para control de acceso administrativo.';

-- Permisos
GRANT EXECUTE ON FUNCTION gamilit.is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION gamilit.is_super_admin() TO gamilit_user;
