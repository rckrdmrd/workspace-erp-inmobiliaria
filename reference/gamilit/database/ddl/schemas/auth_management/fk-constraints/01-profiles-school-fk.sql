-- =====================================================
-- Foreign Key Constraint (Deferred): profiles → schools
-- Schema: auth_management
-- Description: FK diferido para resolver dependencia circular
-- Created: 2025-11-11
-- =====================================================
--
-- CONTEXTO:
-- Este FK se ejecuta DESPUÉS de crear social_features.schools (Fase 9)
-- para resolver la dependencia circular entre profiles (Fase 5) y schools (Fase 9).
--
-- DEPENDENCIA CIRCULAR:
-- auth_management.profiles (Fase 5)
--     └── FK school_id → social_features.schools(id) ❌ NO EXISTE EN FASE 5
--                              ↓
-- social_features.schools (Fase 9)
--     ├── FK principal_id → auth_management.profiles(id) ✅
--     └── FK administrative_contact_id → auth_management.profiles(id) ✅
--
-- SOLUCIÓN:
-- 1. Crear tabla profiles SIN FK a schools (Fase 5)
-- 2. Crear tabla schools CON FK a profiles (Fase 9) ✅
-- 3. Agregar FK diferido profiles → schools (Fase 9.5) ← ESTE ARCHIVO
--
-- REFERENCIAS:
-- - Tabla origen: ddl/schemas/auth_management/tables/03-profiles.sql
-- - Tabla destino: ddl/schemas/social_features/tables/02-schools.sql
-- - Análisis: REPORTE-ANALISIS-DEPENDENCIAS-DDL-2025-11-10.md
--
-- =====================================================

SET search_path TO auth_management, public;

-- =====================================================
-- AGREGAR FK CONSTRAINT DIFERIDO
-- =====================================================

ALTER TABLE auth_management.profiles
    ADD CONSTRAINT profiles_school_id_fkey
    FOREIGN KEY (school_id)
    REFERENCES social_features.schools(id)
    ON DELETE SET NULL;

-- =====================================================
-- COMMENT
-- =====================================================

COMMENT ON CONSTRAINT profiles_school_id_fkey ON auth_management.profiles IS
'FK diferido agregado después de crear schools (Fase 9) para resolver dependencia circular.
Permite a los estudiantes asociarse a una escuela.
Ver: REPORTE-ANALISIS-DEPENDENCIAS-DDL-2025-11-10.md [DEP-001]';

-- =====================================================
-- VALIDACIÓN
-- =====================================================

-- Verificar que el constraint existe
DO $$
DECLARE
    fk_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO fk_count
    FROM information_schema.table_constraints
    WHERE constraint_schema = 'auth_management'
      AND table_name = 'profiles'
      AND constraint_name = 'profiles_school_id_fkey'
      AND constraint_type = 'FOREIGN KEY';

    IF fk_count = 1 THEN
        RAISE NOTICE '✓ FK profiles_school_id_fkey creado correctamente';
    ELSE
        RAISE WARNING '⚠ FK profiles_school_id_fkey NO fue creado';
    END IF;
END $$;
