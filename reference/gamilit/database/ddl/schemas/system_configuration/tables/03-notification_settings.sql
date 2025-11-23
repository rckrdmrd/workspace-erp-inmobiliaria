-- =====================================================
-- Table: system_configuration.notification_settings
-- Description: Configuración de notificaciones por usuario y canal
-- Created: 2025-11-02
-- =====================================================

SET search_path TO system_configuration, public;

DROP TABLE IF EXISTS system_configuration.notification_settings CASCADE;

CREATE TABLE system_configuration.notification_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid,
    user_id uuid NOT NULL,
    notification_type text NOT NULL,
    channel text NOT NULL,
    is_enabled boolean DEFAULT true,
    frequency text DEFAULT 'immediate'::text,
    quiet_hours_start time without time zone,
    quiet_hours_end time without time zone,
    max_per_day integer DEFAULT 999,
    template_id uuid,
    retry_policy jsonb DEFAULT '{}'::jsonb,
    delivery_settings jsonb DEFAULT '{}'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_by uuid,
    updated_by uuid,
    created_at timestamp with time zone DEFAULT gamilit.now_mexico(),
    updated_at timestamp with time zone DEFAULT gamilit.now_mexico(),
    CONSTRAINT notification_settings_channel_check CHECK ((channel = ANY (ARRAY['email'::text, 'sms'::text, 'push'::text, 'in_app'::text, 'webhook'::text]))),
    CONSTRAINT notification_settings_frequency_check CHECK ((frequency = ANY (ARRAY['immediate'::text, 'daily'::text, 'weekly'::text, 'never'::text]))),
    CONSTRAINT notification_settings_max_per_day_check CHECK ((max_per_day > 0))
);

ALTER TABLE system_configuration.notification_settings OWNER TO gamilit_user;

-- =====================================================
-- Primary Key
-- =====================================================

ALTER TABLE ONLY system_configuration.notification_settings
    ADD CONSTRAINT notification_settings_pkey PRIMARY KEY (id);

-- =====================================================
-- Unique Constraints
-- =====================================================

ALTER TABLE ONLY system_configuration.notification_settings
    ADD CONSTRAINT notification_settings_user_type_channel_key UNIQUE (user_id, notification_type, channel);

-- =====================================================
-- Indexes
-- =====================================================

CREATE INDEX idx_notification_settings_user ON system_configuration.notification_settings USING btree (user_id);

CREATE INDEX idx_notification_settings_enabled ON system_configuration.notification_settings USING btree (is_enabled) WHERE (is_enabled = true);

CREATE INDEX idx_notification_settings_type ON system_configuration.notification_settings USING btree (notification_type);

CREATE INDEX idx_notification_settings_channel ON system_configuration.notification_settings USING btree (channel);

CREATE INDEX idx_notification_settings_tenant ON system_configuration.notification_settings USING btree (tenant_id);

-- =====================================================
-- Triggers
-- =====================================================

CREATE TRIGGER trg_notification_settings_updated_at BEFORE UPDATE ON system_configuration.notification_settings FOR EACH ROW EXECUTE FUNCTION gamilit.update_updated_at_column();

-- =====================================================
-- Foreign Keys
-- =====================================================

ALTER TABLE ONLY system_configuration.notification_settings
    ADD CONSTRAINT notification_settings_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth_management.profiles(id);

ALTER TABLE ONLY system_configuration.notification_settings
    ADD CONSTRAINT notification_settings_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES auth_management.tenants(id) ON DELETE CASCADE;

ALTER TABLE ONLY system_configuration.notification_settings
    ADD CONSTRAINT notification_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth_management.profiles(id);

ALTER TABLE ONLY system_configuration.notification_settings
    ADD CONSTRAINT notification_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth_management.profiles(id) ON DELETE CASCADE;

-- =====================================================
-- Row Level Security
-- =====================================================

ALTER TABLE system_configuration.notification_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Policies
-- =====================================================

CREATE POLICY notification_settings_select_admin ON system_configuration.notification_settings FOR SELECT USING (gamilit.is_admin());

CREATE POLICY notification_settings_insert_admin ON system_configuration.notification_settings FOR INSERT WITH CHECK (gamilit.is_admin());

CREATE POLICY notification_settings_update_admin ON system_configuration.notification_settings FOR UPDATE USING (gamilit.is_admin());

CREATE POLICY notification_settings_delete_admin ON system_configuration.notification_settings FOR DELETE USING (gamilit.is_admin());

CREATE POLICY notification_settings_select_own ON system_configuration.notification_settings FOR SELECT USING ((user_id = gamilit.get_current_user_id()));

CREATE POLICY notification_settings_update_own ON system_configuration.notification_settings FOR UPDATE USING ((user_id = gamilit.get_current_user_id()));

CREATE POLICY notification_settings_select_tenant ON system_configuration.notification_settings FOR SELECT USING ((tenant_id = gamilit.get_current_tenant_id()));

-- =====================================================
-- Grants
-- =====================================================

GRANT ALL ON TABLE system_configuration.notification_settings TO gamilit_user;

-- =====================================================
-- Comments
-- =====================================================

COMMENT ON TABLE system_configuration.notification_settings IS 'Configuración de notificaciones por usuario y canal de entrega';

COMMENT ON COLUMN system_configuration.notification_settings.user_id IS 'Usuario propietario de la configuración de notificación';

COMMENT ON COLUMN system_configuration.notification_settings.notification_type IS 'Tipo de notificación (ej: order_confirmation, achievement_earned, etc)';

COMMENT ON COLUMN system_configuration.notification_settings.channel IS 'Canal de entrega: email, sms, push, in_app, webhook';

COMMENT ON COLUMN system_configuration.notification_settings.frequency IS 'Frecuencia de entrega: immediate, daily, weekly, never';

COMMENT ON COLUMN system_configuration.notification_settings.quiet_hours_start IS 'Hora de inicio para no enviar notificaciones (ej: 22:00)';

COMMENT ON COLUMN system_configuration.notification_settings.max_per_day IS 'Máximo número de notificaciones por día para este tipo';

COMMENT ON COLUMN system_configuration.notification_settings.retry_policy IS 'Política de reintentos en formato JSON';

COMMENT ON COLUMN system_configuration.notification_settings.delivery_settings IS 'Configuraciones específicas del canal de entrega';
