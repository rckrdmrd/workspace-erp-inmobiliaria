-- =====================================================
-- Table: educational_content.media_resources
-- Description: Recursos multimedia para contenido educativo - imágenes, videos, audio
-- Dependencies: auth_management.tenants, auth_management.profiles
-- Created: 2025-10-27
-- Migrated: 2025-11-02 (Template T-VM-001 by SA-MIGRACION-EDU-02)
-- Note: used_in_modules[] y used_in_exercises[] son referencias débiles sin FK
-- =====================================================

SET search_path TO educational_content, public;

DROP TABLE IF EXISTS educational_content.media_resources CASCADE;

CREATE TABLE educational_content.media_resources (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid,
    title text NOT NULL,
    description text,
    alt_text text,
    media_type content_management.media_type NOT NULL,
    file_format text,
    file_size_bytes bigint,
    url text NOT NULL,
    thumbnail_url text,
    cdn_url text,
    width integer,
    height integer,
    duration_seconds integer,
    resolution text,
    category text,
    tags text[],
    keywords text[],
    processing_status content_management.processing_status DEFAULT 'ready'::content_management.processing_status,
    is_public boolean DEFAULT false,
    is_active boolean DEFAULT true,
    used_in_modules uuid[],
    used_in_exercises uuid[],
    created_by uuid,
    copyright_info text,
    license text,
    attribution text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT gamilit.now_mexico(),
    updated_at timestamp with time zone DEFAULT gamilit.now_mexico()
);

ALTER TABLE educational_content.media_resources OWNER TO gamilit_user;

-- Primary Key
ALTER TABLE ONLY educational_content.media_resources
    ADD CONSTRAINT media_resources_pkey PRIMARY KEY (id);

-- Constraints
ALTER TABLE educational_content.media_resources
    ADD CONSTRAINT media_resources_file_size_bytes_check CHECK (file_size_bytes >= 0);

-- Indexes
CREATE INDEX idx_media_active ON educational_content.media_resources USING btree (is_active) WHERE (is_active = true);
CREATE INDEX idx_media_category ON educational_content.media_resources USING btree (category);
CREATE INDEX idx_media_created_by ON educational_content.media_resources USING btree (created_by);
CREATE INDEX idx_media_exercises ON educational_content.media_resources USING gin (used_in_exercises);
CREATE INDEX idx_media_modules ON educational_content.media_resources USING gin (used_in_modules);
CREATE INDEX idx_media_tenant_id ON educational_content.media_resources USING btree (tenant_id);
CREATE INDEX idx_media_type ON educational_content.media_resources USING btree (media_type);

-- Triggers
CREATE TRIGGER trg_media_resources_updated_at BEFORE UPDATE ON educational_content.media_resources FOR EACH ROW EXECUTE FUNCTION gamilit.update_updated_at_column();

-- Foreign Keys
ALTER TABLE ONLY educational_content.media_resources
    ADD CONSTRAINT media_resources_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth_management.profiles(id) ON DELETE SET NULL;

ALTER TABLE ONLY educational_content.media_resources
    ADD CONSTRAINT media_resources_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES auth_management.tenants(id) ON DELETE CASCADE;

-- Row Level Security
ALTER TABLE educational_content.media_resources ENABLE ROW LEVEL SECURITY;

-- Permissions
GRANT ALL ON TABLE educational_content.media_resources TO gamilit_user;

-- Comments
COMMENT ON TABLE educational_content.media_resources IS 'Recursos multimedia para contenido educativo - imágenes, videos, audio';
COMMENT ON COLUMN educational_content.media_resources.media_type IS 'Tipo: image, video, audio, document, interactive, animation';
COMMENT ON COLUMN educational_content.media_resources.used_in_modules IS 'Referencias débiles a modules (sin FK constraint)';
COMMENT ON COLUMN educational_content.media_resources.used_in_exercises IS 'Referencias débiles a exercises (sin FK constraint)';
COMMENT ON COLUMN educational_content.media_resources.file_size_bytes IS 'Tamaño del archivo en bytes (debe ser >= 0)';
