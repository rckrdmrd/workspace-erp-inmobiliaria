-- ============================================================================
-- Archivo: 00-init.sql
-- Descripción: Inicialización de base de datos + extensiones
-- Autor: Database-Agent
-- Fecha: 2025-11-20
-- ============================================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- Generación de UUIDs
CREATE EXTENSION IF NOT EXISTS "postgis";        -- Geolocalización
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Búsqueda fuzzy
CREATE EXTENSION IF NOT EXISTS "btree_gist";     -- Índices GiST avanzados

-- Verificar versiones
SELECT extname, extversion
FROM pg_extension
WHERE extname IN ('uuid-ossp', 'postgis', 'pg_trgm', 'btree_gist');

-- Crear schemas (si no existen)
CREATE SCHEMA IF NOT EXISTS auth_management;
CREATE SCHEMA IF NOT EXISTS project_management;
CREATE SCHEMA IF NOT EXISTS financial_management;
CREATE SCHEMA IF NOT EXISTS purchasing_management;
CREATE SCHEMA IF NOT EXISTS construction_management;
CREATE SCHEMA IF NOT EXISTS quality_management;
CREATE SCHEMA IF NOT EXISTS infonavit_management;

-- Comentarios en schemas
COMMENT ON SCHEMA auth_management IS
    'Autenticación, usuarios, roles y permisos';

COMMENT ON SCHEMA project_management IS
    'Proyectos, desarrollos, fases y viviendas (jerarquía de obra)';

COMMENT ON SCHEMA financial_management IS
    'Presupuestos, partidas, estimaciones y control de costos';

COMMENT ON SCHEMA purchasing_management IS
    'Compras, proveedores, inventarios y almacenes';

COMMENT ON SCHEMA construction_management IS
    'Control de avances, recursos, materiales y mano de obra';

COMMENT ON SCHEMA quality_management IS
    'Inspecciones, pruebas, no conformidades y calidad postventa';

COMMENT ON SCHEMA infonavit_management IS
    'Integración INFONAVIT, cumplimiento normativo y trámites';

-- Función auxiliar para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column() IS
    'Trigger function para actualizar automáticamente la columna updated_at';

-- ============================================================================
-- Verificación de inicialización
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Base de datos inicializada correctamente';
    RAISE NOTICE '✅ Extensiones habilitadas: uuid-ossp, postgis, pg_trgm, btree_gist';
    RAISE NOTICE '✅ Schemas creados: 7 schemas de negocio';
    RAISE NOTICE '📝 Siguiente paso: Ejecutar DDL de tablas por schema';
END $$;
