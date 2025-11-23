-- =====================================================
-- Tabla: notification_templates
-- Schema: notifications
-- Descripción: Plantillas de notificaciones reutilizables
-- Relacionado: EXT-003 (Notificaciones Multi-Canal)
-- Fecha: 2025-11-11
-- =====================================================

CREATE TABLE notifications.notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Clave única para identificar el template
    -- Ejemplo: 'achievement_unlocked', 'mission_completed', 'assignment_due'
    template_key VARCHAR(100) NOT NULL UNIQUE,

    -- Nombre descriptivo
    name VARCHAR(255) NOT NULL,

    -- Descripción del propósito del template
    description TEXT,

    -- Plantillas de contenido
    subject_template TEXT, -- Para emails
    body_template TEXT NOT NULL, -- Texto plano con variables {{variable}}
    html_template TEXT, -- HTML para emails (opcional)

    -- Variables disponibles en el template
    -- Ejemplo: ["user_name", "achievement_name", "points_earned"]
    variables JSONB DEFAULT '[]'::jsonb,

    -- Canales por defecto para este tipo de notificación
    default_channels VARCHAR(50)[] DEFAULT ARRAY['in_app'],

    -- Estado
    is_active BOOLEAN DEFAULT true,

    -- Timestamps
    created_at TIMESTAMP DEFAULT gamilit.now_mexico(),
    updated_at TIMESTAMP DEFAULT gamilit.now_mexico()
);

-- Índices
CREATE INDEX idx_notif_templates_key ON notifications.notification_templates(template_key);
CREATE INDEX idx_notif_templates_active ON notifications.notification_templates(is_active);

-- Comentarios
COMMENT ON TABLE notifications.notification_templates IS 'Plantillas reutilizables para notificaciones (con soporte de variables)';
COMMENT ON COLUMN notifications.notification_templates.template_key IS 'Clave única del template (ej: achievement_unlocked)';
COMMENT ON COLUMN notifications.notification_templates.body_template IS 'Plantilla del cuerpo con variables {{variable_name}}';
COMMENT ON COLUMN notifications.notification_templates.variables IS 'Array JSON con nombres de variables disponibles';
COMMENT ON COLUMN notifications.notification_templates.default_channels IS 'Canales por defecto: in_app, email, push';
