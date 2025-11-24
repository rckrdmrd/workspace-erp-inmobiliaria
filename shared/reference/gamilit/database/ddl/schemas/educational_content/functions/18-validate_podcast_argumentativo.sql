-- ============================================================================
-- FUNCIÓN: validate_podcast_argumentativo
-- Descripción: Validador técnico para podcast argumentativo (Módulo 3)
-- Autor: Database Agent
-- Fecha: 2025-11-19
-- Tarea: DB-116
-- ============================================================================

CREATE OR REPLACE FUNCTION educational_content.validate_podcast_argumentativo(
    p_solution JSONB,
    p_submitted_answer JSONB,
    p_max_points INTEGER,
    p_special_rules JSONB DEFAULT '{}'::jsonb,
    OUT is_correct BOOLEAN,
    OUT score INTEGER,
    OUT feedback TEXT,
    OUT details JSONB
)
RETURNS RECORD
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    v_audio_url TEXT;
    v_duration_seconds INTEGER;
    v_file_format TEXT;
    v_file_size_mb NUMERIC;
    v_min_duration INTEGER;
    v_max_duration INTEGER;
    v_max_size_mb NUMERIC;
    v_allowed_formats TEXT[];
    v_format_valid BOOLEAN := false;
    v_duration_valid BOOLEAN := false;
    v_size_valid BOOLEAN := false;
    v_has_metadata BOOLEAN := false;
BEGIN
    -- Extraer datos del audio enviado
    v_audio_url := p_submitted_answer->>'audio_url';
    v_duration_seconds := (p_submitted_answer->>'duration_seconds')::integer;
    v_file_format := LOWER(TRIM(COALESCE(p_submitted_answer->>'file_format', '')));
    v_file_size_mb := (p_submitted_answer->>'file_size_mb')::numeric;

    -- Verificar que se proporcionó un audio
    IF v_audio_url IS NULL OR TRIM(v_audio_url) = '' THEN
        is_correct := false;
        score := 0;
        feedback := 'No se proporcionó ningún archivo de audio.';
        details := jsonb_build_object('error', 'missing_audio');
        RETURN;
    END IF;

    -- Extraer configuración
    v_min_duration := COALESCE(
        (p_solution->>'min_duration_seconds')::integer,
        (p_special_rules->>'min_duration_seconds')::integer,
        120  -- 2 minutos por defecto
    );

    v_max_duration := COALESCE(
        (p_solution->>'max_duration_seconds')::integer,
        (p_special_rules->>'max_duration_seconds')::integer,
        600  -- 10 minutos por defecto
    );

    v_max_size_mb := COALESCE(
        (p_solution->>'max_size_mb')::numeric,
        (p_special_rules->>'max_size_mb')::numeric,
        50.0  -- 50 MB por defecto
    );

    -- Formatos permitidos
    v_allowed_formats := COALESCE(
        ARRAY(SELECT jsonb_array_elements_text(p_solution->'allowed_formats')),
        ARRAY(SELECT jsonb_array_elements_text(p_special_rules->'allowed_formats')),
        ARRAY['mp3', 'm4a', 'wav', 'ogg', 'aac']
    );

    -- Validar formato
    IF v_file_format = ANY(v_allowed_formats) THEN
        v_format_valid := true;
    END IF;

    -- Validar duración
    IF v_duration_seconds IS NOT NULL
       AND v_duration_seconds >= v_min_duration
       AND v_duration_seconds <= v_max_duration THEN
        v_duration_valid := true;
    END IF;

    -- Validar tamaño
    IF v_file_size_mb IS NOT NULL AND v_file_size_mb <= v_max_size_mb THEN
        v_size_valid := true;
    END IF;

    -- Verificar metadata adicional (título, descripción)
    IF (p_submitted_answer->>'title') IS NOT NULL
       AND TRIM(p_submitted_answer->>'title') != ''
       AND (p_submitted_answer->>'description') IS NOT NULL
       AND TRIM(p_submitted_answer->>'description') != '' THEN
        v_has_metadata := true;
    END IF;

    -- Calcular score técnico
    -- NOTA: Este validador solo verifica criterios técnicos
    -- La calidad del contenido debe ser evaluada manualmente por el profesor
    score := 0;

    -- 30% formato válido
    IF v_format_valid THEN
        score := score + ROUND(p_max_points * 0.30);
    END IF;

    -- 40% duración válida
    IF v_duration_valid THEN
        score := score + ROUND(p_max_points * 0.40);
    ELSIF v_duration_seconds IS NOT NULL THEN
        -- Puntos parciales si está cerca del rango
        IF v_duration_seconds < v_min_duration THEN
            score := score + ROUND((v_duration_seconds::NUMERIC / v_min_duration) * (p_max_points * 0.40));
        ELSIF v_duration_seconds > v_max_duration THEN
            score := score + ROUND(p_max_points * 0.20);  -- Penalización por exceso
        END IF;
    END IF;

    -- 20% tamaño válido
    IF v_size_valid THEN
        score := score + ROUND(p_max_points * 0.20);
    END IF;

    -- 10% metadata completo
    IF v_has_metadata THEN
        score := score + ROUND(p_max_points * 0.10);
    END IF;

    -- Validación técnica completa = 100%
    -- PERO se requiere revisión manual del profesor
    is_correct := (v_format_valid AND v_duration_valid AND v_size_valid);

    -- Feedback
    IF is_correct THEN
        feedback := format('Audio recibido correctamente. Duración: %s segundos. Formato: %s. Pendiente revisión de contenido.',
                          v_duration_seconds, UPPER(v_file_format));
    ELSE
        feedback := 'Errores técnicos: ';
        IF NOT v_format_valid THEN
            feedback := feedback || format('Formato no válido (%s). ', COALESCE(v_file_format, 'desconocido'));
        END IF;
        IF NOT v_duration_valid THEN
            feedback := feedback || format('Duración fuera de rango (necesitas %s-%s seg, tienes %s). ',
                                          v_min_duration, v_max_duration, COALESCE(v_duration_seconds, 0));
        END IF;
        IF NOT v_size_valid THEN
            feedback := feedback || format('Archivo muy grande (máx %s MB). ', v_max_size_mb);
        END IF;
    END IF;

    -- Details
    details := jsonb_build_object(
        'validation_type', 'technical',
        'requires_manual_review', true,
        'audio_url', v_audio_url,
        'duration_seconds', v_duration_seconds,
        'file_format', v_file_format,
        'file_size_mb', v_file_size_mb,
        'format_valid', v_format_valid,
        'duration_valid', v_duration_valid,
        'size_valid', v_size_valid,
        'has_metadata', v_has_metadata,
        'allowed_formats', array_to_json(v_allowed_formats),
        'duration_range', jsonb_build_object(
            'min_seconds', v_min_duration,
            'max_seconds', v_max_duration
        )
    );
END;
$$;

COMMENT ON FUNCTION educational_content.validate_podcast_argumentativo IS
'Validador TÉCNICO para podcast argumentativo (Módulo 3 - Pensamiento Crítico).
Valida formato, duración, tamaño del archivo de audio.
IMPORTANTE: NO valida calidad del contenido - requiere revisión manual del profesor.
Este validador solo verifica criterios técnicos.';
