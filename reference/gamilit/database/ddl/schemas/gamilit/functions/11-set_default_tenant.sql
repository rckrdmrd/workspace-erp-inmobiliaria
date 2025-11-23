-- =====================================================
-- Function: gamilit.set_default_tenant
-- Description: Asigna automáticamente el tenant principal de GAMILIT a nuevos perfiles
-- Parameters: None (trigger function)
-- Returns: trigger
-- Created: 2025-11-19
-- Issue: Usuarios registrados se asignaban a tenants personales en lugar del tenant principal
-- Solution: Trigger BEFORE INSERT que fuerza el uso del tenant principal
-- =====================================================

CREATE OR REPLACE FUNCTION gamilit.set_default_tenant()
RETURNS TRIGGER AS $$
DECLARE
    v_main_tenant_id UUID;
    v_tenant_count INTEGER;
BEGIN
    -- Paso 1: Intentar obtener el tenant principal de GAMILIT por slug
    SELECT id INTO v_main_tenant_id
    FROM auth_management.tenants
    WHERE slug = 'gamilit-prod'
      AND is_active = true
    LIMIT 1;

    -- Paso 2: Si no existe, buscar por nombre
    IF v_main_tenant_id IS NULL THEN
        SELECT id INTO v_main_tenant_id
        FROM auth_management.tenants
        WHERE name = 'GAMILIT Platform'
          AND is_active = true
        LIMIT 1;
    END IF;

    -- Paso 3: Fallback - usar el primer tenant activo (por fecha de creación)
    IF v_main_tenant_id IS NULL THEN
        SELECT id INTO v_main_tenant_id
        FROM auth_management.tenants
        WHERE is_active = true
        ORDER BY created_at ASC
        LIMIT 1;
    END IF;

    -- Paso 4: Validar que existe al menos un tenant
    IF v_main_tenant_id IS NULL THEN
        -- Contar todos los tenants (activos e inactivos)
        SELECT COUNT(*) INTO v_tenant_count
        FROM auth_management.tenants;

        IF v_tenant_count = 0 THEN
            RAISE EXCEPTION 'CRITICAL ERROR: No existe ningún tenant en el sistema. Debe crear el tenant principal antes de registrar usuarios.';
        ELSE
            RAISE EXCEPTION 'CRITICAL ERROR: No hay tenants activos en el sistema (Total tenants: %). Active al menos un tenant.', v_tenant_count;
        END IF;
    END IF;

    -- Paso 5: Asignar el tenant principal al nuevo perfil
    NEW.tenant_id := v_main_tenant_id;

    -- Log informativo (visible en logs de PostgreSQL)
    RAISE NOTICE 'Usuario % asignado al tenant % (id: %)',
        NEW.email,
        (SELECT name FROM auth_management.tenants WHERE id = v_main_tenant_id),
        v_main_tenant_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION gamilit.set_default_tenant() IS
    'Trigger function que asigna automáticamente el tenant principal de GAMILIT a nuevos perfiles. ' ||
    'Implementa lógica de fallback para garantizar que siempre exista un tenant válido. ' ||
    'Prioridad: 1) gamilit-prod, 2) GAMILIT Platform, 3) Primer tenant activo. ' ||
    'Creado: 2025-11-19 para resolver problema de tenants personales en registro.';
