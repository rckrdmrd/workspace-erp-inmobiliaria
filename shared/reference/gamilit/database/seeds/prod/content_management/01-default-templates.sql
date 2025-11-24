-- =====================================================
-- Seed: content_management templates (PROD)
-- Description: Templates iniciales de contenido para Marie Curie
-- Environment: PRODUCTION
-- Dependencies: content_management schema
-- Order: 01
-- Created: 2025-11-11
-- Version: 1.0
-- =====================================================
--
-- PROPÓSITO:
-- - Proveer templates base para generación de contenido Marie Curie
-- - Establecer estructura inicial de contenido educativo
--
-- VALIDADO CONTRA:
-- - DDL: ddl/schemas/content_management/tables/01-content_templates.sql
--
-- =====================================================

SET search_path TO content_management, public;

-- =====================================================
-- INSERT: Templates de contenido base (PRODUCTION)
-- =====================================================

-- Template 1: Texto de comprensión lectora
INSERT INTO content_management.content_templates (
    id,
    tenant_id,
    name,
    description,
    template_type,
    structure,
    is_active,
    created_at,
    updated_at
) VALUES (
    'a1b2c3d4-0001-0000-0000-000000000001'::uuid,
    NULL,  -- Disponible para todos los tenants
    'Comprensión Lectora Básica',
    'Template para generar ejercicios de comprensión lectora con texto, preguntas y opciones múltiples',
    'reading_comprehension',
    '{
        "sections": [
            {"type": "text", "label": "Texto principal", "required": true},
            {"type": "questions", "count": 5, "format": "multiple_choice"}
        ],
        "difficulty_levels": ["facil", "medio", "dificil"],
        "bloom_taxonomy": ["recordar", "comprender", "aplicar"]
    }'::jsonb,
    true,
    gamilit.now_mexico(),
    gamilit.now_mexico()
) ON CONFLICT (id) DO NOTHING;

-- Template 2: Inferencia y análisis
INSERT INTO content_management.content_templates (
    id,
    tenant_id,
    name,
    description,
    template_type,
    structure,
    is_active,
    created_at,
    updated_at
) VALUES (
    'a1b2c3d4-0002-0000-0000-000000000002'::uuid,
    NULL,
    'Comprensión Inferencial',
    'Template para ejercicios que requieren inferencia y análisis de información implícita',
    'inferential_reading',
    '{
        "sections": [
            {"type": "text", "label": "Texto con información implícita", "required": true},
            {"type": "questions", "count": 4, "format": "multiple_choice"},
            {"type": "explanation", "label": "Justificación de respuesta", "required": false}
        ],
        "difficulty_levels": ["medio", "dificil"],
        "bloom_taxonomy": ["analizar", "evaluar"]
    }'::jsonb,
    true,
    gamilit.now_mexico(),
    gamilit.now_mexico()
) ON CONFLICT (id) DO NOTHING;

-- Template 3: Producción de textos
INSERT INTO content_management.content_templates (
    id,
    tenant_id,
    name,
    description,
    template_type,
    structure,
    is_active,
    created_at,
    updated_at
) VALUES (
    'a1b2c3d4-0003-0000-0000-000000000003'::uuid,
    NULL,
    'Producción de Textos',
    'Template para ejercicios de escritura y producción textual',
    'text_production',
    '{
        "sections": [
            {"type": "prompt", "label": "Indicaciones", "required": true},
            {"type": "rubric", "label": "Criterios de evaluación", "required": true},
            {"type": "text_area", "label": "Espacio de escritura", "min_words": 50}
        ],
        "difficulty_levels": ["facil", "medio", "dificil"],
        "bloom_taxonomy": ["crear", "evaluar"]
    }'::jsonb,
    true,
    gamilit.now_mexico(),
    gamilit.now_mexico()
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- RESULTADO ESPERADO
-- =====================================================
-- 3 templates base insertados en content_templates
-- Disponibles para generación de contenido por Marie Curie
-- =====================================================
