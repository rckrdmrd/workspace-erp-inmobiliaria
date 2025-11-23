-- Nombre: metric_type
-- Descripción: Tipos de métricas para análisis y seguimiento
-- Schema: audit_logging
-- Fuente: SA-DB-005
-- Migrado desde public: 2025-11-09

CREATE TYPE audit_logging.metric_type AS ENUM (
    'engagement',
    'performance',
    'completion',
    'time_spent',
    'accuracy',
    'streak',
    'social_interaction'
);
