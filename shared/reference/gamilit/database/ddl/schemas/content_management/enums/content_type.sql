-- Nombre: content_type
-- Descripción: Tipos de contenido educativo
-- Schema: content_management
-- Fuente: SA-DB-005
-- Migrado desde public: 2025-11-09

CREATE TYPE content_management.content_type AS ENUM (
    'video',
    'text',
    'interactive',
    'quiz',
    'game',
    'simulation'
);
