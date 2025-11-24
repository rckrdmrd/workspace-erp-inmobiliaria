-- =====================================================
-- Seeds: Reglas básicas de moderación automática
-- Schema: content_management
-- Descripción: Reglas de ejemplo para el sistema de moderación
-- Relacionado: EXT-002 (Admin Extendido - Moderación Automática)
-- Fecha: 2025-11-11
-- =====================================================

-- Insertar usuario sistema para created_by (si no existe)
INSERT INTO auth.users (id, email, encrypted_password, gamilit_role)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'system@gamilit.com',
    'n/a', -- No se puede hacer login con esta cuenta
    'super_admin'
)
ON CONFLICT (email) DO NOTHING;

-- Insertar reglas básicas de moderación
INSERT INTO content_management.moderation_rules
(rule_name, rule_type, target_entity, rule_config, action, severity, auto_execute, require_review, is_active, priority, created_by) VALUES

-- ===== REGLAS CRÍTICAS (auto_execute = true) =====

-- Palabras prohibidas críticas (SPAM, phishing, malware)
('Palabras Prohibidas - Crítico', 'keyword', 'content',
 '{
   "keywords": ["spam", "phishing", "scam", "malware", "virus", "hack"],
   "case_sensitive": false,
   "match_whole_word": true
 }'::jsonb,
 'block', 'critical', true, true, true, 100,
 '00000000-0000-0000-0000-000000000001'),

-- Contenido ofensivo extremo
('Lenguaje Ofensivo Extremo', 'keyword', 'content',
 '{
   "keywords": ["palabra1", "palabra2", "palabra3"],
   "case_sensitive": false,
   "match_whole_word": true
 }'::jsonb,
 'block', 'critical', true, true, true, 95,
 '00000000-0000-0000-0000-000000000001'),

-- ===== REGLAS DE ALTA PRIORIDAD =====

-- Detección de números de teléfono
('Detección Teléfonos', 'pattern', 'content',
 '{
   "regex": "\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b",
   "description": "Detecta números de teléfono formato XXX-XXX-XXXX",
   "case_sensitive": false
 }'::jsonb,
 'flag', 'high', false, true, true, 80,
 '00000000-0000-0000-0000-000000000001'),

-- Detección de emails (posible spam)
('Detección Emails', 'pattern', 'content',
 '{
   "regex": "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b",
   "description": "Detecta direcciones de email",
   "case_sensitive": false
 }'::jsonb,
 'flag', 'medium', false, true, true, 70,
 '00000000-0000-0000-0000-000000000001'),

-- Detección de URLs sospechosas
('URLs Externas', 'pattern', 'content',
 '{
   "regex": "https?://[^\\s]+",
   "description": "Detecta URLs en el contenido",
   "case_sensitive": false
 }'::jsonb,
 'flag', 'medium', false, true, true, 60,
 '00000000-0000-0000-0000-000000000001'),

-- ===== REGLAS DE CALIDAD =====

-- Contenido excesivamente corto
('Contenido Muy Corto', 'length', 'content',
 '{
   "min_length": 10,
   "max_length": 999999,
   "action_on": "below"
 }'::jsonb,
 'flag', 'low', false, false, true, 20,
 '00000000-0000-0000-0000-000000000001'),

-- Contenido excesivamente largo (posible spam)
('Contenido Muy Largo', 'length', 'content',
 '{
   "min_length": 0,
   "max_length": 10000,
   "action_on": "exceed"
 }'::jsonb,
 'flag', 'medium', false, true, true, 30,
 '00000000-0000-0000-0000-000000000001'),

-- ===== REGLAS PARA COMENTARIOS =====

-- Palabras prohibidas en comentarios
('Palabras Prohibidas - Comentarios', 'keyword', 'comment',
 '{
   "keywords": ["spam", "scam", "phishing"],
   "case_sensitive": false,
   "match_whole_word": true
 }'::jsonb,
 'flag', 'high', false, true, true, 85,
 '00000000-0000-0000-0000-000000000001'),

-- ===== REGLAS PARA MENSAJES =====

-- Detección de spam en mensajes privados
('Spam en Mensajes', 'keyword', 'message',
 '{
   "keywords": ["oferta", "promoción", "descuento", "gratis", "premio"],
   "case_sensitive": false,
   "match_whole_word": false
 }'::jsonb,
 'flag', 'medium', false, true, true, 50,
 '00000000-0000-0000-0000-000000000001');

-- Comentarios
COMMENT ON COLUMN content_management.moderation_rules.created_by IS 'Usuario que creó la regla (system user para seeds)';
