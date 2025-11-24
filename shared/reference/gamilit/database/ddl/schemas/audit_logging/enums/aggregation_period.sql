-- Nombre: aggregation_period
-- Descripción: Períodos de agregación para métricas y estadísticas
-- Schema: audit_logging
-- Fuente: SA-DB-005
-- Migrado desde public: 2025-11-09

CREATE TYPE audit_logging.aggregation_period AS ENUM (
    'daily',
    'weekly',
    'monthly',
    'quarterly',
    'yearly'
);
