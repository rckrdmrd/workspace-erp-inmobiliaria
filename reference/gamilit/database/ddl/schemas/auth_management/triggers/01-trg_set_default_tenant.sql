-- =====================================================
-- Trigger: trg_set_default_tenant
-- Table: auth_management.profiles
-- Description: Asigna automáticamente el tenant principal de GAMILIT a nuevos perfiles
-- Timing: BEFORE INSERT
-- Function: gamilit.set_default_tenant()
-- Created: 2025-11-19
-- =====================================================
--
-- PROPÓSITO:
-- Garantiza que todos los usuarios registrados se asignen al tenant principal
-- de GAMILIT en lugar de crear tenants personales para cada usuario.
--
-- PROBLEMA RESUELTO:
-- - Backend creaba tenant personal para cada usuario
-- - Usuarios quedaban aislados sin acceso a módulos/ejercicios
-- - Módulos configurados con tenant_id NULL (compartidos)
--
-- SOLUCIÓN:
-- - Trigger BEFORE INSERT intercepta la creación del perfil
-- - Fuerza el uso del tenant principal (gamilit-prod)
-- - Funciona independientemente de cómo se cree el usuario
--
-- ORDEN DE EJECUCIÓN:
-- 1. BEFORE INSERT: trg_set_default_tenant (este trigger)
-- 2. INSERT: Se inserta el registro en profiles
-- 3. AFTER INSERT: trg_initialize_user_stats (crea gamificación)
--
-- =====================================================

SET search_path TO auth_management, public;

-- Eliminar trigger si existe (para permitir re-creación)
DROP TRIGGER IF EXISTS trg_set_default_tenant ON auth_management.profiles CASCADE;

-- Crear trigger BEFORE INSERT
CREATE TRIGGER trg_set_default_tenant
    BEFORE INSERT ON auth_management.profiles
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.set_default_tenant();

COMMENT ON TRIGGER trg_set_default_tenant ON auth_management.profiles IS
    'Asigna automáticamente el tenant principal de GAMILIT a nuevos perfiles. ' ||
    'Ejecuta ANTES de INSERT para garantizar tenant correcto desde el inicio. ' ||
    'Creado: 2025-11-19 para resolver problema de registro con tenants personales.';
