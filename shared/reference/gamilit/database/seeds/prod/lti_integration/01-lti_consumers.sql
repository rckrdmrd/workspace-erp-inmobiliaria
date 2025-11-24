-- =====================================================
-- Seed: lti_integration.lti_consumers (PROD)
-- Description: Configuración inicial de consumidores LTI 1.3
-- Environment: PRODUCTION
-- Dependencies: lti_integration tables must exist
-- Order: 01
-- Created: 2025-11-11
-- Version: 1.0
-- =====================================================
--
-- PROPÓSITO:
-- Cargar configuración inicial de plataformas LMS que pueden conectarse
-- vía LTI 1.3 (Learning Tools Interoperability).
--
-- ALCANCE:
-- - Configuración genérica para plataformas LMS comunes
-- - Placeholders para credenciales (deben configurarse después)
-- - Capacidades LTI estándar habilitadas
--
-- IMPORTANTE:
-- Las credenciales reales (client_id, client_secret, etc.) deben
-- configurarse vía variables de entorno o vault después del deployment.
-- Los valores aquí son PLACEHOLDERS que deben reemplazarse.
--
-- SEGURIDAD:
-- - NO incluir credenciales reales en este archivo
-- - Usar manage-secrets.sh para credenciales de producción
-- - Validar JWKs y endpoints antes de habilitar en producción
--
-- =====================================================

SET search_path TO lti_integration, public;

-- =====================================================
-- VALIDACIÓN PREVIA
-- =====================================================

DO $$
DECLARE
    missing_columns TEXT[];
    expected_columns TEXT[] := ARRAY[
        'id', 'platform_name', 'platform_id', 'client_id', 'deployment_id',
        'public_keyset_url', 'access_token_url', 'oidc_auth_url',
        'is_enabled', 'supports_deep_linking', 'supports_nrps', 'supports_ags',
        'custom_parameters', 'created_at', 'updated_at'
    ];
    col TEXT;
BEGIN
    -- Verificar que la tabla existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'lti_integration'
        AND table_name = 'lti_consumers'
    ) THEN
        RAISE EXCEPTION 'Tabla lti_integration.lti_consumers no existe. Ejecutar DDL primero.';
    END IF;

    -- Verificar columnas esperadas
    SELECT ARRAY_AGG(column_name) INTO missing_columns
    FROM (SELECT UNNEST(expected_columns) AS column_name) expected
    WHERE column_name NOT IN (
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'lti_integration'
        AND table_name = 'lti_consumers'
    );

    IF missing_columns IS NOT NULL AND array_length(missing_columns, 1) > 0 THEN
        RAISE WARNING 'Columnas faltantes en lti_consumers: %', missing_columns;
    END IF;

    RAISE NOTICE '✓ Validación de estructura completada';
END $$;

-- =====================================================
-- INSERCIÓN DE CONSUMIDORES LTI (PRODUCCIÓN)
-- =====================================================

-- NOTA: Estos son templates/placeholders para configuración inicial.
-- Las credenciales reales deben cargarse después vía secrets management.

INSERT INTO lti_integration.lti_consumers (
    id,
    platform_name,
    platform_id,
    client_id,
    deployment_id,
    public_keyset_url,
    access_token_url,
    oidc_auth_url,
    is_enabled,
    supports_deep_linking,
    supports_nrps,
    supports_ags,
    custom_parameters,
    metadata,
    created_at,
    updated_at
) VALUES

-- =====================================================
-- 1. MOODLE LMS (Placeholder)
-- =====================================================
(
    '10000000-0000-0000-0000-000000000001'::uuid,
    'Moodle LMS',
    'https://moodle.example.edu',
    'MOODLE_CLIENT_ID_PLACEHOLDER', -- REEMPLAZAR con credencial real
    '1',
    'https://moodle.example.edu/mod/lti/certs.php',
    'https://moodle.example.edu/mod/lti/token.php',
    'https://moodle.example.edu/mod/lti/auth.php',
    false, -- Deshabilitado hasta configurar credenciales reales
    true,  -- Supports Deep Linking
    true,  -- Supports Name and Role Provisioning Services
    true,  -- Supports Assignment and Grade Services
    jsonb_build_object(
        'custom_context_id', '$Context.id',
        'custom_course_id', '$CourseSection.sourcedId',
        'custom_user_id', '$User.id'
    ),
    jsonb_build_object(
        'platform_type', 'moodle',
        'platform_version', '4.x',
        'configuration_status', 'pending',
        'notes', 'Configurar credenciales antes de habilitar'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- 2. CANVAS LMS (Placeholder)
-- =====================================================
(
    '20000000-0000-0000-0000-000000000002'::uuid,
    'Canvas LMS',
    'https://canvas.example.edu',
    'CANVAS_CLIENT_ID_PLACEHOLDER', -- REEMPLAZAR con credencial real
    '1',
    'https://canvas.example.edu/api/lti/security/jwks',
    'https://canvas.example.edu/login/oauth2/token',
    'https://canvas.example.edu/api/lti/authorize_redirect',
    false, -- Deshabilitado hasta configurar credenciales reales
    true,  -- Supports Deep Linking
    true,  -- Supports NRPS
    true,  -- Supports AGS
    jsonb_build_object(
        'custom_canvas_course_id', '$Canvas.course.id',
        'custom_canvas_user_id', '$Canvas.user.id',
        'custom_canvas_enrollment_state', '$Canvas.enrollment.enrollmentState'
    ),
    jsonb_build_object(
        'platform_type', 'canvas',
        'platform_version', 'cloud',
        'configuration_status', 'pending',
        'notes', 'Configurar credenciales antes de habilitar'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- 3. BLACKBOARD LEARN (Placeholder)
-- =====================================================
(
    '30000000-0000-0000-0000-000000000003'::uuid,
    'Blackboard Learn',
    'https://blackboard.example.edu',
    'BLACKBOARD_CLIENT_ID_PLACEHOLDER', -- REEMPLAZAR con credencial real
    '1',
    'https://blackboard.example.edu/learn/api/v1/lti/jwks',
    'https://blackboard.example.edu/learn/api/v1/lti/token',
    'https://blackboard.example.edu/learn/api/v1/lti/authorize',
    false, -- Deshabilitado hasta configurar credenciales reales
    true,  -- Supports Deep Linking
    true,  -- Supports NRPS
    true,  -- Supports AGS
    jsonb_build_object(
        'custom_bb_course_id', '$Context.id',
        'custom_bb_user_id', '$User.id'
    ),
    jsonb_build_object(
        'platform_type', 'blackboard',
        'platform_version', 'ultra',
        'configuration_status', 'pending',
        'notes', 'Configurar credenciales antes de habilitar'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
)

ON CONFLICT (platform_id, client_id) DO UPDATE SET
    platform_name = EXCLUDED.platform_name,
    deployment_id = EXCLUDED.deployment_id,
    public_keyset_url = EXCLUDED.public_keyset_url,
    access_token_url = EXCLUDED.access_token_url,
    oidc_auth_url = EXCLUDED.oidc_auth_url,
    is_enabled = EXCLUDED.is_enabled,
    supports_deep_linking = EXCLUDED.supports_deep_linking,
    supports_nrps = EXCLUDED.supports_nrps,
    supports_ags = EXCLUDED.supports_ags,
    custom_parameters = EXCLUDED.custom_parameters,
    metadata = EXCLUDED.metadata,
    updated_at = gamilit.now_mexico();

-- =====================================================
-- VERIFICACIÓN DE INSERCIÓN
-- =====================================================

DO $$
DECLARE
    consumers_count INTEGER;
    enabled_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO consumers_count FROM lti_integration.lti_consumers;
    SELECT COUNT(*) INTO enabled_count FROM lti_integration.lti_consumers WHERE is_enabled = true;

    RAISE NOTICE '════════════════════════════════════════════════════════';
    RAISE NOTICE '  SEED COMPLETADO: lti_consumers';
    RAISE NOTICE '════════════════════════════════════════════════════════';
    RAISE NOTICE '✓ Consumidores LTI insertados: %', consumers_count;
    RAISE NOTICE '  └─ Habilitados: %', enabled_count;
    RAISE NOTICE '  └─ Pendientes configuración: %', consumers_count - enabled_count;
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANTE:';
    RAISE NOTICE '  1. Configurar credenciales reales vía manage-secrets.sh';
    RAISE NOTICE '  2. Actualizar client_id con valores de cada plataforma';
    RAISE NOTICE '  3. Validar URLs y endpoints';
    RAISE NOTICE '  4. Habilitar (is_enabled = true) después de configurar';
    RAISE NOTICE '════════════════════════════════════════════════════════';

    IF consumers_count = 0 THEN
        RAISE EXCEPTION 'ERROR: No se insertó ningún consumidor LTI';
    END IF;
END $$;

-- =====================================================
-- DOCUMENTACIÓN DE CONFIGURACIÓN POST-DEPLOYMENT
-- =====================================================

/*
PASOS PARA CONFIGURAR EN PRODUCCIÓN:

1. Obtener credenciales de cada plataforma LMS:
   - Registrar GAMILIT como LTI Tool en la plataforma
   - Obtener client_id, deployment_id
   - Obtener URLs de OIDC, token, JWKs

2. Configurar secrets:
   ```bash
   ./manage-secrets.sh set --env prod LTI_MOODLE_CLIENT_ID "real-client-id"
   ./manage-secrets.sh set --env prod LTI_CANVAS_CLIENT_ID "real-client-id"
   ./manage-secrets.sh set --env prod LTI_BLACKBOARD_CLIENT_ID "real-client-id"
   ```

3. Actualizar consumidores con credenciales reales:
   ```sql
   UPDATE lti_integration.lti_consumers
   SET client_id = 'real-client-id',
       is_enabled = true,
       updated_at = gamilit.now_mexico()
   WHERE platform_name = 'Moodle LMS';
   ```

4. Validar configuración:
   ```sql
   SELECT platform_name, is_enabled, configuration_status
   FROM lti_integration.lti_consumers;
   ```

5. Testing:
   - Iniciar LTI launch desde la plataforma LMS
   - Verificar OIDC authentication flow
   - Validar Deep Linking (si aplica)
   - Probar grade passback (AGS)

REFERENCIAS:
- Docs: docs/02-especificaciones-tecnicas/lti-integration/
- Epic: docs/03-fase-extensiones/EXT-007-lti-integration/
- Spec: https://www.imsglobal.org/spec/lti/v1p3/
*/
