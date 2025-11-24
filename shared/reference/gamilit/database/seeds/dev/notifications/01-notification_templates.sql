-- =====================================================
-- Seeds DEV: notification_templates
-- Schema: notifications
-- Descripción: Plantillas para desarrollo y testing (incluye templates de producción + test templates)
-- Relacionado: EXT-003 (Notificaciones Multi-Canal)
-- Fecha: 2025-11-13
-- =====================================================
--
-- NOTA: Este archivo incluye todas las plantillas de producción
-- más plantillas adicionales para testing y desarrollo
--
-- =====================================================

-- Cargar primero todas las plantillas de producción
\ir ../../prod/notifications/01-notification_templates.sql

-- Templates adicionales para DEV/TESTING

-- Template TEST 1: Notificación de prueba simple
INSERT INTO notifications.notification_templates (
    template_key,
    name,
    description,
    subject_template,
    body_template,
    html_template,
    variables,
    default_channels,
    is_active
) VALUES (
    'test_notification',
    '[TEST] Notificación de Prueba',
    'Template simple para testing de sistema de notificaciones',
    'Test: {{test_type}}',
    'Esto es una notificación de prueba.

Tipo: {{test_type}}
Timestamp: {{timestamp}}
Usuario: {{user_id}}

Este template se usa solo para testing.',
    '<html><body><p>Test notification: {{test_type}}</p><p>Timestamp: {{timestamp}}</p></body></html>',
    '["test_type", "timestamp", "user_id"]'::jsonb,
    ARRAY['in_app'],
    true
);

-- Template TEST 2: Notificación con todas las variables posibles
INSERT INTO notifications.notification_templates (
    template_key,
    name,
    description,
    subject_template,
    body_template,
    html_template,
    variables,
    default_channels,
    is_active
) VALUES (
    'test_all_variables',
    '[TEST] Template con Todas las Variables',
    'Template de testing que usa múltiples variables para validar interpolación',
    'Test completo: {{title}}',
    'Usuario: {{user_name}} ({{user_email}})
Profesor: {{teacher_name}}
Asignación: {{assignment_title}}
Módulo: {{module_name}}
Puntaje: {{score}}
XP: {{xp_earned}}
Coins: {{ml_coins_earned}}
Fecha: {{date}}',
    '<html><body><ul>
<li>Usuario: {{user_name}}</li>
<li>Email: {{user_email}}</li>
<li>Profesor: {{teacher_name}}</li>
<li>Asignación: {{assignment_title}}</li>
<li>Módulo: {{module_name}}</li>
<li>Puntaje: {{score}}</li>
<li>XP: {{xp_earned}}</li>
<li>ML Coins: {{ml_coins_earned}}</li>
<li>Fecha: {{date}}</li>
</ul></body></html>',
    '["user_name", "user_email", "teacher_name", "assignment_title", "module_name", "score", "xp_earned", "ml_coins_earned", "date", "title"]'::jsonb,
    ARRAY['in_app', 'email', 'push'],
    true
);

-- Template TEST 3: Template multicanal para testing
INSERT INTO notifications.notification_templates (
    template_key,
    name,
    description,
    subject_template,
    body_template,
    html_template,
    variables,
    default_channels,
    is_active
) VALUES (
    'test_multichannel',
    '[TEST] Notificación Multi-Canal',
    'Template para probar envío simultáneo por múltiples canales',
    'Test Multi-Canal: {{channel_test}}',
    'Esta notificación debe enviarse por:
- In-app notification
- Email
- Push notification

Test ID: {{test_id}}
Canales: {{channels}}',
    '<html>
<body>
    <h3>Test Multi-Canal</h3>
    <p>Esta notificación se envía por múltiples canales:</p>
    <ul>
        <li>✓ In-app notification</li>
        <li>✓ Email</li>
        <li>✓ Push notification</li>
    </ul>
    <p><strong>Test ID:</strong> {{test_id}}</p>
    <p><strong>Canales:</strong> {{channels}}</p>
</body>
</html>',
    '["test_id", "channels", "channel_test"]'::jsonb,
    ARRAY['in_app', 'email', 'push'],
    true
);

-- Comentario final para DEV
COMMENT ON TABLE notifications.notification_templates IS 'Contiene 11 plantillas (8 prod + 3 test) para notificaciones del sistema (DB-115 DEV - 2025-11-13)';
