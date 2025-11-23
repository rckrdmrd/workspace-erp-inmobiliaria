-- =====================================================
-- Table: content_management.media_files
-- Description: Archivos multimedia - imágenes, videos, audio, documentos
-- Created: 2025-10-27
-- Migrated: 2025-11-02 by SA-MIGRACION-CONTENT-03
-- Issues corregidos: P1-001, P2-001
--
-- 📚 Documentación:
-- Requerimiento: docs/01-requerimientos/07-contenido-media/RF-CNT-001-gestion-media.md
-- Especificación: docs/02-especificaciones-tecnicas/07-contenido-media/ET-CNT-001-gestion-media.md
-- =====================================================

SET search_path TO content_management, public;

DROP TABLE IF EXISTS content_management.media_files CASCADE;

CREATE TABLE content_management.media_files (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid,
    filename text NOT NULL,
    original_filename text NOT NULL,
    file_extension text,
    mime_type text,
    file_size_bytes bigint,
    media_type content_management.media_type NOT NULL,
    category text,
    subcategory text,
    storage_path text NOT NULL,
    public_url text,
    cdn_url text,
    thumbnail_url text,
    width integer,
    height integer,
    duration_seconds integer,
    bitrate integer,
    resolution text,
    color_profile text,
    alt_text text,
    caption text,
    description text,
    copyright_info text,
    license text,
    attribution text,
    processing_status content_management.processing_status DEFAULT 'completed'::content_management.processing_status,
    processing_info jsonb DEFAULT '{}'::jsonb,
    tags text[],
    keywords text[],
    folder_path text,
    usage_count integer DEFAULT 0,
    download_count integer DEFAULT 0,
    view_count integer DEFAULT 0,
    is_public boolean DEFAULT false,
    is_active boolean DEFAULT true,
    is_optimized boolean DEFAULT false,
    uploaded_by uuid,
    upload_session_id text,
    exif_data jsonb DEFAULT '{}'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT gamilit.now_mexico(),
    updated_at timestamp with time zone DEFAULT gamilit.now_mexico(),
    CONSTRAINT media_files_file_size_bytes_check CHECK ((file_size_bytes > 0))
);

ALTER TABLE content_management.media_files OWNER TO gamilit_user;

-- Primary Key
ALTER TABLE ONLY content_management.media_files
    ADD CONSTRAINT media_files_pkey PRIMARY KEY (id);

-- Indexes
CREATE INDEX idx_media_files_active ON content_management.media_files USING btree (is_active) WHERE (is_active = true);
CREATE INDEX idx_media_files_category ON content_management.media_files USING btree (category);
CREATE INDEX idx_media_files_tags ON content_management.media_files USING gin (tags);
CREATE INDEX idx_media_files_tenant ON content_management.media_files USING btree (tenant_id);
CREATE INDEX idx_media_files_type ON content_management.media_files USING btree (media_type);
CREATE INDEX idx_media_files_uploaded_by ON content_management.media_files USING btree (uploaded_by);

-- Triggers
CREATE TRIGGER trg_media_files_updated_at BEFORE UPDATE ON content_management.media_files FOR EACH ROW EXECUTE FUNCTION gamilit.update_updated_at_column();

-- Foreign Keys
ALTER TABLE ONLY content_management.media_files
    ADD CONSTRAINT media_files_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES auth_management.tenants(id) ON DELETE CASCADE;

-- P2-001 CORREGIDO: Agregado ON DELETE SET NULL
ALTER TABLE ONLY content_management.media_files
    ADD CONSTRAINT media_files_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES auth_management.profiles(id) ON DELETE SET NULL;

-- P1-001 CORREGIDO: Políticas RLS agregadas antes de ENABLE ROW LEVEL SECURITY
-- Política de selección pública: permite ver archivos públicos o si es admin
CREATE POLICY media_files_select_public ON content_management.media_files
    FOR SELECT
    USING (is_public = true OR gamilit.is_admin());

-- Política de selección por tenant: permite ver archivos del mismo tenant o si es admin
CREATE POLICY media_files_select_tenant ON content_management.media_files
    FOR SELECT
    USING (tenant_id = gamilit.get_current_tenant_id() OR gamilit.is_admin());

-- Política de inserción: solo puede insertar en su propio tenant o si es admin
CREATE POLICY media_files_insert_own ON content_management.media_files
    FOR INSERT
    WITH CHECK (tenant_id = gamilit.get_current_tenant_id() OR gamilit.is_admin());

-- Política de actualización: solo puede actualizar archivos de su tenant o si es admin
CREATE POLICY media_files_update_own ON content_management.media_files
    FOR UPDATE
    USING (tenant_id = gamilit.get_current_tenant_id() OR gamilit.is_admin());

-- Política de eliminación: solo puede eliminar archivos de su tenant o si es admin
CREATE POLICY media_files_delete_own ON content_management.media_files
    FOR DELETE
    USING (tenant_id = gamilit.get_current_tenant_id() OR gamilit.is_admin());

-- Row Level Security
ALTER TABLE content_management.media_files ENABLE ROW LEVEL SECURITY;

-- Permissions
GRANT ALL ON TABLE content_management.media_files TO gamilit_user;

-- Comments
COMMENT ON TABLE content_management.media_files IS 'Archivos multimedia - imágenes, videos, audio, documentos';
COMMENT ON COLUMN content_management.media_files.media_type IS 'Tipo: image, video, audio, document, interactive, animation';
COMMENT ON COLUMN content_management.media_files.processing_status IS 'Estado: uploading, processing, ready, error, optimizing';
