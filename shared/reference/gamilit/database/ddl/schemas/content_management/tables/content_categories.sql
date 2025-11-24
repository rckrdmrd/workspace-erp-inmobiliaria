-- Tabla: content_categories
-- Schema: content_management
-- Descripción: Categorías jerárquicas para organización de contenido
-- CREADO: 2025-11-08

CREATE TABLE content_management.content_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_category_id UUID REFERENCES content_management.content_categories(id) ON DELETE SET NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    icon VARCHAR(50),
    color VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_content_categories_parent_id ON content_management.content_categories(parent_category_id) WHERE parent_category_id IS NOT NULL;
CREATE INDEX idx_content_categories_slug ON content_management.content_categories(slug);
CREATE INDEX idx_content_categories_is_active ON content_management.content_categories(is_active);
CREATE INDEX idx_content_categories_display_order ON content_management.content_categories(display_order);

-- Comentarios
COMMENT ON TABLE content_management.content_categories IS 'Hierarchical categories for content organization';
COMMENT ON COLUMN content_management.content_categories.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN content_management.content_categories.parent_category_id IS 'Parent category for hierarchical organization';
COMMENT ON COLUMN content_management.content_categories.display_order IS 'Order for displaying categories';

-- Trigger para updated_at
CREATE TRIGGER update_content_categories_updated_at
    BEFORE UPDATE ON content_management.content_categories
    FOR EACH ROW
    EXECUTE FUNCTION gamilit.update_updated_at_column();
