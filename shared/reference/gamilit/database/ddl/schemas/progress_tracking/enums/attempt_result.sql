-- Nombre: attempt_result
-- Descripción: Resultados posibles de intentos de ejercicios
-- Schema: progress_tracking
-- Fuente: SA-DB-005
-- Migrado desde public: 2025-11-09

CREATE TYPE progress_tracking.attempt_result AS ENUM (
    'correct',
    'incorrect',
    'partial',
    'skipped'
);
