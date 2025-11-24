-- =====================================================
-- Seed: audit_logging configuration (PROD)
-- Description: Configuración inicial de auditoría para producción
-- Environment: PRODUCTION
-- Dependencies: audit_logging schema
-- Order: 01
-- Created: 2025-11-11
-- Version: 1.0
-- =====================================================
--
-- PROPÓSITO:
-- - Configurar retención de logs por defecto
-- - Establecer umbrales de métricas y alertas
-- - Preparar sistema de auditoría para producción
--
-- VALIDADO CONTRA:
-- - DDL: ddl/schemas/audit_logging/tables/
--
-- =====================================================

SET search_path TO audit_logging, public;

-- =====================================================
-- COMENTARIO INICIAL
-- =====================================================

-- Este archivo configura los valores iniciales mínimos para el sistema de auditoría en producción.
-- Los logs y métricas se almacenarán según las políticas definidas aquí.

-- =====================================================
-- NOTA: En producción, las tablas de audit_logging se llenarán dinámicamente
-- Este seed solo establece configuración inicial si es necesaria.
-- La mayoría de las tablas (audit_logs, system_logs, etc.) se poblarán en tiempo de ejecución.
-- =====================================================

-- Puedes agregar configuración inicial aquí si es necesaria en el futuro
-- Por ejemplo:
--   - Umbrales de alertas por defecto
--   - Políticas de retención
--   - Configuración de métricas críticas

-- Por ahora, este seed está vacío intencionalmente ya que audit_logging
-- es principalmente un sink de datos generados por la aplicación.

-- =====================================================
-- FIN DEL SEED
-- =====================================================
