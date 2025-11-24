-- =====================================================
-- Table: content_management.content_templates
-- Description: Plantillas reutilizables para crear contenido
-- Created: 2025-10-27
-- Migrated: 2025-11-02
-- Issues Corregidos: P1-001 (RLS sin políticas), P2-001 (FK sin ON DELETE)
-- =====================================================

SET search_path TO content_management, public;

DROP TABLE IF EXISTS content_management.content_templates CASCADE;

CREATE TABLE content_management.content_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid,
    name text NOT NULL,
    description text,
    template_type text,
    template_structure jsonb DEFAULT '{}'::jsonb NOT NULL,
    default_values jsonb DEFAULT '{}'::jsonb,
    required_fields text[],
    optional_fields text[],
    is_public boolean DEFAULT false,
    is_system_template boolean DEFAULT false,
    difficulty_level educational_content.difficulty_level,
    usage_count integer DEFAULT 0,
    created_by uuid,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT gamilit.now_mexico(),
    updated_at timestamp with time zone DEFAULT gamilit.now_mexico(),
    CONSTRAINT content_templates_template_type_check CHECK ((template_type = ANY (ARRAY['exercise'::text, 'module'::text, 'assessment'::text, 'announcement'::text, 'feedback'::text])))
);

ALTER TABLE content_management.content_templates OWNER TO gamilit_user;

-- Primary Key
ALTER TABLE ONLY content_management.content_templates
    ADD CONSTRAINT content_templates_pkey PRIMARY KEY (id);

-- Indexes
CREATE INDEX idx_templates_public ON content_management.content_templates USING btree (is_public) WHERE (is_public = true);
CREATE INDEX idx_templates_tenant ON content_management.content_templates USING btree (tenant_id);
CREATE INDEX idx_templates_type ON content_management.content_templates USING btree (template_type);

-- Triggers
CREATE TRIGGER trg_content_templates_updated_at BEFORE UPDATE ON content_management.content_templates FOR EACH ROW EXECUTE FUNCTION gamilit.update_updated_at_column();

-- Foreign Keys (P2-001 CORREGIDO: ON DELETE SET NULL agregado a created_by)
ALTER TABLE ONLY content_management.content_templates
    ADD CONSTRAINT content_templates_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth_management.profiles(id) ON DELETE SET NULL;

ALTER TABLE ONLY content_management.content_templates
    ADD CONSTRAINT content_templates_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES auth_management.tenants(id) ON DELETE CASCADE;

-- Row Level Security (P1-001 CORREGIDO: Políticas RLS agregadas)
-- Política SELECT para plantillas públicas o si es admin
CREATE POLICY content_templates_select_public ON content_management.content_templates
    FOR SELECT
    USING (is_public = true OR gamilit.is_admin());

-- Política SELECT para plantillas del tenant o si es admin
CREATE POLICY content_templates_select_tenant ON content_management.content_templates
    FOR SELECT
    USING (tenant_id = gamilit.get_current_tenant_id() OR gamilit.is_admin());

-- Política INSERT solo para el tenant actual o admin
CREATE POLICY content_templates_insert_own ON content_management.content_templates
    FOR INSERT
    WITH CHECK (tenant_id = gamilit.get_current_tenant_id() OR gamilit.is_admin());

-- Política UPDATE solo para el tenant actual o admin
CREATE POLICY content_templates_update_own ON content_management.content_templates
    FOR UPDATE
    USING (tenant_id = gamilit.get_current_tenant_id() OR gamilit.is_admin());

-- Política DELETE solo para el tenant actual o admin
CREATE POLICY content_templates_delete_own ON content_management.content_templates
    FOR DELETE
    USING (tenant_id = gamilit.get_current_tenant_id() OR gamilit.is_admin());

-- Habilitar RLS después de definir las políticas
ALTER TABLE content_management.content_templates ENABLE ROW LEVEL SECURITY;

-- Permissions
GRANT ALL ON TABLE content_management.content_templates TO gamilit_user;

-- Comments
COMMENT ON TABLE content_management.content_templates IS 'Plantillas reutilizables para crear contenido';
COMMENT ON COLUMN content_management.content_templates.template_type IS 'Tipo: exercise, module, assessment, announcement, feedback';
