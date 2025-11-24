-- ============================================================================
-- ENUM: progress_status
-- Schema: progress_tracking
-- Descripción: Estados de progreso de módulos y ejercicios
-- Fecha: 2025-11-08
-- Versión: 1.0
-- ============================================================================
--
-- DESCRIPCIÓN:
--   Define los posibles estados de progreso que puede tener un usuario
--   al trabajar con módulos y ejercicios educativos.
--
-- USADO EN:
--   - progress_tracking.module_progress.status
--   - progress_tracking.exercise_submissions.status
--   - progress_tracking.learning_sessions.status
--
-- VALORES:
--   - not_started:   El usuario no ha comenzado el contenido
--   - in_progress:   El usuario está trabajando en el contenido
--   - completed:     El usuario completó el contenido exitosamente
--   - needs_review:  El contenido fue completado pero requiere revisión
--   - mastered:      El usuario dominó el contenido (nivel de excelencia)
--   - abandoned:     El usuario abandonó el contenido sin completar (tracking futuro)
--
-- REFERENCIAS:
--   - Backend: apps/backend/src/shared/constants/enums.constants.ts
--              (ProgressStatusEnum - v1.1)
--   - Docs: docs/01-requerimientos/04-seguimiento-progreso/RF-PRG-001.md
--
-- HISTORIAL:
--   - 2025-11-08 v1.1: Agregado valor 'mastered' para alineación con backend
--                      Sincronizado con backend ProgressStatusEnum v1.1
--   - 2025-11-08 v1.0: Creación inicial
--
-- ============================================================================

-- Crear el ENUM progress_status
CREATE TYPE progress_tracking.progress_status AS ENUM (
    'not_started',
    'in_progress',
    'completed',
    'needs_review',
    'mastered',
    'abandoned'
);

-- Comentario descriptivo
COMMENT ON TYPE progress_tracking.progress_status IS
    'Estados de progreso para módulos y ejercicios (v1.1 - 2025-11-08). '
    'Valores: not_started (sin iniciar), in_progress (en progreso), '
    'completed (completado), needs_review (necesita revisión), mastered (dominado), abandoned (abandonado). '
    'Backend usa principalmente: not_started, in_progress, completed, needs_review, mastered. '
    'Sincronizado con backend ProgressStatusEnum v1.1.';

-- ============================================================================
-- VALIDACIÓN
-- ============================================================================

DO $$
DECLARE
    v_enum_exists BOOLEAN;
    v_value_count INTEGER;
BEGIN
    -- Verificar que el ENUM fue creado
    SELECT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n ON t.typnamespace = n.oid
        WHERE n.nspname = 'progress_tracking'
          AND t.typname = 'progress_status'
    ) INTO v_enum_exists;

    IF NOT v_enum_exists THEN
        RAISE EXCEPTION 'ENUM progress_tracking.progress_status was not created';
    END IF;

    -- Verificar que tiene los 6 valores esperados
    SELECT COUNT(*) INTO v_value_count
    FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    JOIN pg_namespace n ON t.typnamespace = n.oid
    WHERE n.nspname = 'progress_tracking'
      AND t.typname = 'progress_status';

    IF v_value_count != 6 THEN
        RAISE EXCEPTION 'Expected 6 values in progress_status, found %', v_value_count;
    END IF;

    RAISE NOTICE '✅ ENUM progress_tracking.progress_status created successfully with % values', v_value_count;
END $$;

-- ============================================================================
-- EJEMPLOS DE USO
-- ============================================================================
--
-- -- Obtener todos los valores del ENUM
-- SELECT unnest(enum_range(NULL::progress_tracking.progress_status));
--
-- -- Usar en consulta
-- SELECT *
-- FROM progress_tracking.module_progress
-- WHERE status = 'completed';
--
-- -- Actualizar estado
-- UPDATE progress_tracking.module_progress
-- SET status = 'completed',
--     completed_at = NOW()
-- WHERE user_id = '...' AND status = 'in_progress';
--
-- ============================================================================
