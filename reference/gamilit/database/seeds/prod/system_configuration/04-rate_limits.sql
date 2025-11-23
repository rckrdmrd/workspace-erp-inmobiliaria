-- ============================================================================
-- GAMILIT Platform - Production Seeds
-- Archivo: seeds/prod/system_configuration/04-rate_limits.sql
-- Propósito: Configuración de rate limiting para seguridad y prevención de abuso
-- Creado: 2025-11-08
-- ============================================================================

-- Rate limits por endpoint/operación
INSERT INTO system_configuration.rate_limits (
    resource_type,
    resource_identifier,
    max_requests,
    window_seconds,
    scope,
    is_enabled,
    burst_size,
    description
)
VALUES
    -- Auth endpoints
    (
        'endpoint',
        '/api/auth/login',
        5,
        300,
        'ip',
        true,
        10,
        'Login attempts - 5 per 5 minutes per IP'
    ),
    (
        'endpoint',
        '/api/auth/register',
        3,
        3600,
        'ip',
        true,
        5,
        'Registration - 3 per hour per IP'
    ),
    (
        'endpoint',
        '/api/auth/reset-password',
        3,
        3600,
        'ip',
        true,
        5,
        'Password reset - 3 per hour per IP'
    ),
    (
        'endpoint',
        '/api/auth/verify-email',
        10,
        3600,
        'user',
        true,
        15,
        'Email verification - 10 per hour per user'
    ),

    -- API general
    (
        'endpoint',
        '/api/*',
        1000,
        60,
        'user',
        true,
        1200,
        'General API - 1000 requests per minute per user'
    ),
    (
        'endpoint',
        '/api/*',
        5000,
        60,
        'ip',
        true,
        6000,
        'General API - 5000 requests per minute per IP'
    ),

    -- Exercise submissions
    (
        'operation',
        'exercise_submission',
        100,
        3600,
        'user',
        true,
        120,
        'Exercise submissions - 100 per hour per user'
    ),
    (
        'operation',
        'exercise_attempt',
        200,
        3600,
        'user',
        true,
        250,
        'Exercise attempts - 200 per hour per user'
    ),

    -- File uploads
    (
        'operation',
        'file_upload',
        50,
        3600,
        'user',
        true,
        60,
        'File uploads - 50 per hour per user'
    ),
    (
        'operation',
        'file_upload_size',
        524288000,
        86400,
        'user',
        true,
        629145600,
        'Total upload size - 500MB per day per user (bytes)'
    ),

    -- Social features
    (
        'operation',
        'classroom_create',
        10,
        86400,
        'user',
        true,
        15,
        'Classroom creation - 10 per day per user'
    ),
    (
        'operation',
        'classroom_invitation',
        100,
        3600,
        'user',
        true,
        120,
        'Classroom invitations - 100 per hour per user'
    ),
    (
        'operation',
        'peer_challenge_create',
        50,
        3600,
        'user',
        true,
        60,
        'Peer challenges - 50 per hour per user'
    ),

    -- Gamification
    (
        'operation',
        'achievement_claim',
        1000,
        3600,
        'user',
        true,
        1200,
        'Achievement claims - 1000 per hour per user'
    ),
    (
        'operation',
        'comodin_use',
        100,
        3600,
        'user',
        true,
        120,
        'Comodin usage - 100 per hour per user'
    ),

    -- ML Coins transactions
    (
        'operation',
        'ml_coins_transaction',
        500,
        3600,
        'user',
        true,
        600,
        'ML Coins transactions - 500 per hour per user'
    ),

    -- ⚠️ FUTURE: Parent Portal (Extension EXT-010, v1.3) - Rate limits anticipados
    -- Descomentarlos cuando se active Extension EXT-010
    -- (
    --     'operation',
    --     'parent_report_generate',
    --     10,
    --     3600,
    --     'user',
    --     true,
    --     15,
    --     'Parent report generation - 10 per hour per parent'
    -- ),
    -- (
    --     'operation',
    --     'parent_student_link',
    --     20,
    --     86400,
    --     'user',
    --     true,
    --     25,
    --     'Parent-student linking - 20 per day per parent'
    -- ),

    -- LTI Integration
    (
        'operation',
        'lti_launch',
        1000,
        3600,
        'consumer',
        true,
        1500,
        'LTI launches - 1000 per hour per LMS'
    ),
    (
        'operation',
        'lti_grade_passback',
        500,
        3600,
        'consumer',
        true,
        600,
        'Grade passback - 500 per hour per LMS'
    ),

    -- Admin operations
    (
        'operation',
        'admin_bulk_update',
        50,
        3600,
        'user',
        true,
        60,
        'Bulk updates - 50 per hour per admin'
    ),
    (
        'operation',
        'admin_report_export',
        20,
        3600,
        'user',
        true,
        25,
        'Report exports - 20 per hour per admin'
    ),

    -- Email sending
    (
        'operation',
        'email_send',
        100,
        3600,
        'user',
        true,
        120,
        'Email sending - 100 per hour per user'
    ),

    -- Search operations
    (
        'operation',
        'search_query',
        200,
        60,
        'user',
        true,
        250,
        'Search queries - 200 per minute per user'
    ),

    -- Content creation
    (
        'operation',
        'content_create',
        50,
        3600,
        'user',
        true,
        60,
        'Content creation - 50 per hour per user'
    ),
    (
        'operation',
        'content_update',
        200,
        3600,
        'user',
        true,
        250,
        'Content updates - 200 per hour per user'
    )

ON CONFLICT (resource_type, resource_identifier, scope) DO UPDATE SET
    max_requests = EXCLUDED.max_requests,
    window_seconds = EXCLUDED.window_seconds,
    is_enabled = EXCLUDED.is_enabled,
    burst_size = EXCLUDED.burst_size,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Verificación
SELECT
    resource_type,
    resource_identifier,
    max_requests,
    CASE
        WHEN window_seconds < 60 THEN max_requests || ' per ' || window_seconds || 's'
        WHEN window_seconds < 3600 THEN max_requests || ' per ' || (window_seconds / 60) || 'm'
        WHEN window_seconds < 86400 THEN max_requests || ' per ' || (window_seconds / 3600) || 'h'
        ELSE max_requests || ' per ' || (window_seconds / 86400) || 'd'
    END as rate_limit,
    scope,
    CASE WHEN is_enabled THEN '✅' ELSE '❌' END as enabled,
    description
FROM system_configuration.rate_limits
ORDER BY
    CASE resource_type
        WHEN 'endpoint' THEN 1
        WHEN 'operation' THEN 2
    END,
    resource_identifier;
