-- =====================================================
-- GLIT Platform - Audit Logging Seeds
-- =====================================================
-- Schema: audit_logging
-- Description: Audit logs, system logs históricos demo
-- Dependencies: auth schema (users)
-- =====================================================

SET search_path TO audit_logging, auth, public;

DO $$
DECLARE
    admin_id UUID;
    instructor_id UUID;
    student1_id UUID;
    student2_id UUID;
    student3_id UUID;
BEGIN
    -- =====================================================
    -- OBTENER USER IDs
    -- =====================================================
    SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@glit.edu.mx';
    SELECT id INTO instructor_id FROM auth.users WHERE email = 'instructor@demo.glit.edu.mx';
    SELECT id INTO student1_id FROM auth.users WHERE email = 'estudiante1@demo.glit.edu.mx';
    SELECT id INTO student2_id FROM auth.users WHERE email = 'estudiante2@demo.glit.edu.mx';
    SELECT id INTO student3_id FROM auth.users WHERE email = 'estudiante3@demo.glit.edu.mx';

    -- =====================================================
    -- AUDIT LOGS: Logs de acciones importantes
    -- =====================================================
    INSERT INTO audit_logging.audit_logs (
        actor_id, action, resource_type, resource_id,
        changes, actor_ip, actor_user_agent,
        severity, status,
        additional_data, created_at
    ) VALUES

    -- ============ ADMIN ACTIONS ============

    -- Admin: Creación de system settings
    (
        admin_id,
        'create',
        'system_settings',
        gen_random_uuid(),
        '{
            "before": null,
            "after": {
                "setting_key": "ml_coins_welcome_bonus",
                "setting_value": "100"
            }
        }'::jsonb,
        '192.168.1.100',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
        'info',
        'success',
        '{
            "category": "system_configuration",
            "impact": "medium",
            "automated": false,
            "context": "Initial platform setup"
        }'::jsonb,
        NOW() - INTERVAL '15 days'
    ),

    -- Admin: Actualización de feature flag
    (
        admin_id,
        'update',
        'feature_flags',
        gen_random_uuid(),
        '{
            "before": {"is_enabled": false, "rollout_percentage": 0},
            "after": {"is_enabled": true, "rollout_percentage": 100}
        }'::jsonb,
        '192.168.1.100',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
        'info',
        'success',
        '{
            "flag_name": "missions_system",
            "impact": "high",
            "reason": "Production rollout",
            "approved_by": "admin@glit.edu.mx"
        }'::jsonb,
        NOW() - INTERVAL '14 days'
    ),

    -- Admin: Creación de achievement
    (
        admin_id,
        'create',
        'achievements',
        gen_random_uuid(),
        '{
            "before": null,
            "after": {
                "achievement_code": "reading_master",
                "achievement_name": "Maestro Lector",
                "ml_coins_reward": 500,
                "xp_reward": 250
            }
        }'::jsonb,
        '192.168.1.100',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
        'info',
        'success',
        '{
            "category": "gamification",
            "impact": "medium",
            "automated": false
        }'::jsonb,
        NOW() - INTERVAL '13 days'
    ),

    -- Admin: Intento fallido de eliminar módulo (protegido)
    (
        admin_id,
        'delete',
        'modules',
        gen_random_uuid(),
        '{
            "before": {"module_code": "MOD-01-LITERAL", "module_name": "Comprensión Literal"},
            "after": null,
            "error": "Cannot delete module with active exercises"
        }'::jsonb,
        '192.168.1.100',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
        'warning',
        'failure',
        '{
            "constraint_violated": "fk_exercises_module",
            "active_exercises_count": 15,
            "automated": false,
            "error_code": "CONSTRAINT_VIOLATION"
        }'::jsonb,
        NOW() - INTERVAL '5 days'
    ),

    -- Admin: Bulk user role update
    (
        admin_id,
        'bulk_update',
        'users',
        NULL,
        '{
            "users_affected": 3,
            "changes": {
                "role": "student",
                "is_active": true
            }
        }'::jsonb,
        '192.168.1.100',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
        'info',
        'success',
        '{
            "operation": "activate_students",
            "automated": false,
            "execution_time_ms": 250
        }'::jsonb,
        NOW() - INTERVAL '10 days'
    ),

    -- ============ INSTRUCTOR ACTIONS ============

    -- Instructor: Creación de aula
    (
        instructor_id,
        'create',
        'classrooms',
        gen_random_uuid(),
        '{
            "before": null,
            "after": {
                "classroom_name": "2° A - Comprensión Lectora",
                "classroom_code": "2A-LECT-2025",
                "grade_level": "2nd_grade",
                "max_students": 30
            }
        }'::jsonb,
        '10.0.2.50',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15',
        'info',
        'success',
        '{
            "school": "SF-015-CDMX",
            "automated": false,
            "context": "New semester setup"
        }'::jsonb,
        NOW() - INTERVAL '12 days'
    ),

    -- Instructor: Asignación de estudiante a aula
    (
        instructor_id,
        'create',
        'classroom_members',
        gen_random_uuid(),
        '{
            "before": null,
            "after": {
                "classroom_code": "2A-LECT-2025",
                "student_email": "estudiante1@demo.glit.edu.mx",
                "role": "student",
                "enrollment_date": "2025-10-21"
            }
        }'::jsonb,
        '10.0.2.50',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15',
        'info',
        'success',
        '{
            "enrollment_type": "manual",
            "automated": false,
            "classroom_size": 1
        }'::jsonb,
        NOW() - INTERVAL '11 days'
    ),

    -- Instructor: Actualización de mission assignment
    (
        instructor_id,
        'update',
        'mission_assignments',
        gen_random_uuid(),
        '{
            "before": {"due_date": "2025-11-10"},
            "after": {"due_date": "2025-11-15"}
        }'::jsonb,
        '10.0.2.50',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15',
        'info',
        'success',
        '{
            "mission_code": "MISSION-LITERAL-01",
            "reason": "Student request for extension",
            "automated": false
        }'::jsonb,
        NOW() - INTERVAL '3 days'
    ),

    -- ============ STUDENT ACTIONS ============

    -- Student1: Login exitoso
    (
        student1_id,
        'login',
        'auth_session',
        gen_random_uuid(),
        '{
            "login_method": "email_password",
            "mfa_used": false,
            "session_created": true
        }'::jsonb,
        '192.168.1.45',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0',
        'info',
        'success',
        '{
            "session_duration_hours": 8,
            "device_type": "desktop",
            "browser": "Chrome",
            "os": "Linux"
        }'::jsonb,
        NOW() - INTERVAL '1 hour'
    ),

    -- Student1: Completó ejercicio (achievement unlock)
    (
        student1_id,
        'achievement_unlocked',
        'user_achievements',
        gen_random_uuid(),
        '{
            "achievement": {
                "achievement_code": "first_steps",
                "achievement_name": "Primeros Pasos",
                "tier": "bronze"
            }
        }'::jsonb,
        '192.168.1.45',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0',
        'info',
        'success',
        '{
            "ml_coins_awarded": 50,
            "xp_awarded": 25,
            "automated": true,
            "trigger": "exercise_completion_count"
        }'::jsonb,
        NOW() - INTERVAL '30 minutes'
    ),

    -- Student2: Password reset request
    (
        student2_id,
        'password_reset_request',
        'auth_session',
        gen_random_uuid(),
        '{
            "reset_token_sent": true,
            "email_sent": true
        }'::jsonb,
        '192.168.1.67',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
        'info',
        'success',
        '{
            "reset_method": "email",
            "token_expiry_hours": 24,
            "automated": true
        }'::jsonb,
        NOW() - INTERVAL '8 hours'
    ),

    -- Student3: Failed login attempt
    (
        student3_id,
        'login',
        'auth_session',
        gen_random_uuid(),
        '{
            "login_method": "email_password",
            "error": "Invalid credentials"
        }'::jsonb,
        '192.168.1.89',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
        'warning',
        'failure',
        '{
            "attempt_number": 2,
            "max_attempts": 5,
            "device_type": "mobile",
            "automated": false
        }'::jsonb,
        NOW() - INTERVAL '2 hours'
    ),

    -- ============ SYSTEM ACTIONS ============

    -- System: Scheduled backup
    (
        NULL,
        'backup',
        'database',
        NULL,
        '{
            "backup_type": "automated",
            "size_mb": 450,
            "duration_seconds": 45,
            "status": "completed"
        }'::jsonb,
        '127.0.0.1',
        'PostgreSQL Backup Scheduler v1.0',
        'info',
        'success',
        '{
            "backup_location": "/backups/glit_dev_2025-11-02.sql.gz",
            "automated": true,
            "retention_days": 30,
            "compression": "gzip"
        }'::jsonb,
        NOW() - INTERVAL '6 hours'
    ),

    -- System: Data cleanup job
    (
        NULL,
        'cleanup',
        'database',
        NULL,
        '{
            "tables_cleaned": ["audit_logs", "system_logs"],
            "records_deleted": 1500,
            "retention_days": 90
        }'::jsonb,
        '127.0.0.1',
        'GLIT Cleanup Service v1.0',
        'info',
        'success',
        '{
            "automated": true,
            "execution_time_seconds": 12,
            "freed_space_mb": 25
        }'::jsonb,
        NOW() - INTERVAL '12 hours'
    )
    ON CONFLICT DO NOTHING;

    -- =====================================================
    -- SYSTEM LOGS: Logs del sistema
    -- =====================================================
    INSERT INTO audit_logging.system_logs (
        log_level, component, message,
        error_code, stack_trace,
        additional_data, created_at
    ) VALUES

    -- ============ INFO LOGS ============

    -- Info: Aplicación iniciada
    (
        'info',
        'application',
        'GLIT application started successfully',
        NULL,
        NULL,
        '{
            "version": "1.0.0",
            "environment": "development",
            "startup_time_ms": 1250,
            "node_version": "v20.11.0",
            "postgres_version": "15.5"
        }'::jsonb,
        NOW() - INTERVAL '1 day'
    ),

    -- Debug: Database connection pool
    (
        'debug',
        'database',
        'Connection pool initialized',
        NULL,
        NULL,
        '{
            "pool_size": 20,
            "min_connections": 5,
            "max_connections": 50,
            "idle_timeout_ms": 30000
        }'::jsonb,
        NOW() - INTERVAL '1 day' + INTERVAL '2 seconds'
    ),

    -- Info: Cache initialized
    (
        'info',
        'cache',
        'Redis cache connected successfully',
        NULL,
        NULL,
        '{
            "redis_version": "7.2.0",
            "connection_time_ms": 45,
            "max_memory_mb": 256
        }'::jsonb,
        NOW() - INTERVAL '1 day' + INTERVAL '5 seconds'
    ),

    -- Info: Scheduled job completed
    (
        'info',
        'scheduler',
        'Daily achievement recalculation completed',
        NULL,
        NULL,
        '{
            "users_processed": 5,
            "achievements_updated": 12,
            "duration_seconds": 3.5,
            "next_run": "2025-11-03T00:00:00Z"
        }'::jsonb,
        NOW() - INTERVAL '2 hours'
    ),

    -- ============ WARNING LOGS ============

    -- Warning: Slow query detected
    (
        'warning',
        'database',
        'Slow query detected',
        'SLOW_QUERY_001',
        NULL,
        '{
            "query": "SELECT * FROM progress_tracking.exercise_attempts WHERE student_id = $1 ORDER BY attempted_at DESC",
            "duration_ms": 2500,
            "threshold_ms": 1000,
            "optimization_suggested": true,
            "suggested_index": "idx_exercise_attempts_student_attempted"
        }'::jsonb,
        NOW() - INTERVAL '12 hours'
    ),

    -- Warning: Cache miss rate high
    (
        'warning',
        'cache',
        'High cache miss rate detected',
        'CACHE_MISS_HIGH',
        NULL,
        '{
            "miss_rate_percentage": 45,
            "threshold_percentage": 30,
            "total_requests": 10000,
            "cache_hits": 5500,
            "cache_misses": 4500
        }'::jsonb,
        NOW() - INTERVAL '4 hours'
    ),

    -- ============ ERROR LOGS ============

    -- Error: Failed to send email
    (
        'error',
        'email_service',
        'Failed to send welcome email',
        'EMAIL_SEND_FAILURE',
        'at EmailService.send (email.service.ts:45)\nat UserController.register (user.controller.ts:123)\nat Layer.handle (express/lib/router/layer.js:95)',
        '{
            "recipient": "test@example.com",
            "error": "SMTP connection timeout",
            "retry_count": 3,
            "smtp_host": "smtp.example.com",
            "smtp_port": 587
        }'::jsonb,
        NOW() - INTERVAL '6 hours'
    ),

    -- Error: API rate limit exceeded
    (
        'error',
        'api_server',
        'Rate limit exceeded for endpoint',
        'RATE_LIMIT_EXCEEDED',
        NULL,
        '{
            "endpoint": "/api/exercises/search",
            "client_ip": "203.0.113.42",
            "requests_count": 150,
            "limit": 100,
            "window_seconds": 60,
            "action_taken": "Request blocked"
        }'::jsonb,
        NOW() - INTERVAL '3 hours'
    ),

    -- Error: Database connection failed
    (
        'error',
        'database',
        'Database connection attempt failed',
        'DB_CONNECTION_FAILED',
        'Error: connect ECONNREFUSED 127.0.0.1:5432\nat TCPConnectWrap.afterConnect (net.js:1144:16)',
        '{
            "host": "localhost",
            "port": 5432,
            "database": "glit_dev",
            "retry_attempt": 1,
            "max_retries": 5
        }'::jsonb,
        NOW() - INTERVAL '18 hours'
    ),

    -- ============ DEBUG LOGS ============

    -- Debug: API request details
    (
        'debug',
        'api_server',
        'API request received',
        NULL,
        NULL,
        '{
            "method": "GET",
            "path": "/api/modules",
            "query_params": {"grade_level": "2nd_grade"},
            "actor_id": "' || student1_id || '",
            "response_time_ms": 45,
            "status_code": 200
        }'::jsonb,
        NOW() - INTERVAL '15 minutes'
    )
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Audit logging seeds completed successfully';
    RAISE NOTICE '- % audit_logs inserted', (SELECT COUNT(*) FROM audit_logging.audit_logs);
    RAISE NOTICE '- % system_logs inserted', (SELECT COUNT(*) FROM audit_logging.system_logs);

END $$;
