-- Tabla: taxonomies
-- Schema: educational_content
-- Descripción: Taxonomías educativas (Bloom, etc.)
-- CREADO: 2025-11-08

CREATE TABLE educational_content.taxonomies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    taxonomy_type VARCHAR(50) NOT NULL CHECK (taxonomy_type IN ('bloom', 'solo', 'webb', 'custom')),
    levels JSONB NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_taxonomies_type ON educational_content.taxonomies(taxonomy_type);
CREATE INDEX idx_taxonomies_is_active ON educational_content.taxonomies(is_active);
CREATE INDEX idx_taxonomies_levels_gin ON educational_content.taxonomies USING GIN(levels);

-- Comentarios
COMMENT ON TABLE educational_content.taxonomies IS 'Educational taxonomies (Bloom, SOLO, Webb DOK, custom)';
COMMENT ON COLUMN educational_content.taxonomies.taxonomy_type IS 'Type: bloom (Bloom''s Taxonomy), solo (SOLO Taxonomy), webb (Webb''s DOK), custom';
COMMENT ON COLUMN educational_content.taxonomies.levels IS 'JSONB array of taxonomy levels with descriptions';
COMMENT ON COLUMN educational_content.taxonomies.is_active IS 'Whether this taxonomy is currently active for use';

-- Trigger para updated_at
CREATE TRIGGER update_taxonomies_updated_at
    BEFORE UPDATE ON educational_content.taxonomies
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();

-- Datos iniciales: Taxonomía de Bloom
INSERT INTO educational_content.taxonomies (name, taxonomy_type, description, levels) VALUES
('Taxonomía de Bloom', 'bloom', 'Taxonomía cognitiva de Benjamin Bloom',
'[
  {"level": 1, "name": "Recordar", "description": "Recuperar conocimiento de la memoria"},
  {"level": 2, "name": "Comprender", "description": "Construir significado a partir de mensajes"},
  {"level": 3, "name": "Aplicar", "description": "Usar procedimientos en situaciones dadas"},
  {"level": 4, "name": "Analizar", "description": "Descomponer en partes e identificar relaciones"},
  {"level": 5, "name": "Evaluar", "description": "Hacer juicios basados en criterios"},
  {"level": 6, "name": "Crear", "description": "Reorganizar elementos en nuevo patrón"}
]'::jsonb);
