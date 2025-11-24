-- =====================================================
-- Seed: progress_tracking.module_progress (PROD)
-- Description: Progreso inicial de usuarios (SOLO DEMO, NO TESTING)
-- Environment: PRODUCTION
-- Dependencies: auth_management.profiles, educational_content.modules
-- Order: 01
-- Created: 2025-11-11
-- Version: 3.0 (Limpiado - NO carga datos para usuarios de testing)
-- =====================================================
--
-- CAMBIOS v3.0 (2025-11-16):
-- - ❌ ELIMINADO: Progreso pre-cargado para student@gamilit.com
-- - ✅ RAZÓN: Los usuarios de testing deben iniciar en blanco
-- - ✅ POLÍTICA: Solo usuarios DEMO pueden tener progreso pre-cargado
--
-- USUARIOS DE TESTING (deben iniciar en BLANCO):
-- - admin@gamilit.com
-- - teacher@gamilit.com
-- - student@gamilit.com
--
-- USUARIOS DEMO (pueden tener progreso pre-cargado):
-- - estudiante1@demo.glit.edu.mx
-- - estudiante2@demo.glit.edu.mx
-- - etc.
--
-- PROGRESO INCLUIDO:
-- - NINGUNO (usuarios de testing inician en blanco)
--
-- TOTAL: 0 registros de module_progress para testing
-- =====================================================

SET search_path TO progress_tracking, educational_content, auth_management, public;

-- =====================================================
-- NOTA: Seed vacío intencionalmente
-- =====================================================
-- Los usuarios de testing (admin@gamilit.com, teacher@gamilit.com, student@gamilit.com)
-- deben iniciar sin progreso pre-cargado para permitir testing limpio.
--
-- Si se requiere progreso demo, agregar aquí solo para usuarios demo
-- (estudiante1@demo.glit.edu.mx, etc.)
-- =====================================================

-- =====================================================
-- Verification
-- =====================================================

DO $$
DECLARE
    progress_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO progress_count FROM progress_tracking.module_progress;
    RAISE NOTICE '✅ Registros de module_progress creados: %', progress_count;
END $$;
