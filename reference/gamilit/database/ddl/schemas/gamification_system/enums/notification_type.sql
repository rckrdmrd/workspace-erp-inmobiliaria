-- =====================================================
-- ENUM: gamification_system.notification_type
-- Descripción: 11 tipos de notificaciones del sistema
-- Documentación: docs/02-especificaciones-tecnicas/tipos-compartidos/TYPES-NOTIFICATIONS.md
-- Epic: EXT-003
-- Created: 2025-11-08
-- =====================================================

CREATE TYPE gamification_system.notification_type AS ENUM (
    'achievement_unlocked',   -- Logro desbloqueado
    'rank_up',                -- Subida de rango maya
    'friend_request',         -- Solicitud de amistad
    'guild_invitation',       -- Invitación a equipo/guild
    'mission_completed',      -- Misión completada
    'level_up',               -- Subida de nivel
    'message_received',       -- Mensaje recibido
    'system_announcement',    -- Anuncio del sistema
    'ml_coins_earned',        -- ML Coins ganadas
    'streak_milestone',       -- Hito de racha alcanzado
    'exercise_feedback'       -- Retroalimentación de ejercicio
);

COMMENT ON TYPE gamification_system.notification_type IS
'Tipos de notificaciones del sistema (11 tipos).
Sincronizado con backend NotificationTypeEnum (apps/backend/src/shared/constants/enums.constants.ts).
Prioridades sugeridas: system_announcement (critical), message_received/rank_up (high), achievement_unlocked/mission_completed (medium), level_up/ml_coins_earned (low).';
