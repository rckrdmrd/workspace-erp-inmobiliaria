-- Nombre: social_event_type
-- Descripción: Tipos de eventos sociales y competencias
-- Schema: social_features
-- Fuente: SA-DB-005
-- Migrado desde public: 2025-11-09

CREATE TYPE social_features.social_event_type AS ENUM (
    'competition',
    'collaboration',
    'challenge',
    'tournament',
    'workshop'
);
