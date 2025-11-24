-- =====================================================
-- Function: gamilit.initialize_user_stats
-- Description: Inicializa estadísticas de gamificación para nuevos usuarios
-- Parameters: None
-- Returns: trigger
-- Created: 2025-10-27
-- Updated: 2025-11-12 - Extendido para incluir admin_teacher y super_admin
-- =====================================================

CREATE OR REPLACE FUNCTION gamilit.initialize_user_stats()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Initialize gamification for students, teachers, and admins
    -- Only these roles have gamification enabled
    IF NEW.role IN ('student', 'admin_teacher', 'super_admin') THEN
        -- Use NEW.user_id which points to auth.users.id (correct foreign key reference)
        INSERT INTO gamification_system.user_stats (
            user_id,
            tenant_id,
            ml_coins,
            ml_coins_earned_total
        ) VALUES (
            NEW.user_id,  -- Fixed: usar user_id en lugar de id
            NEW.tenant_id,
            100, -- Welcome bonus
            100
        )
        ON CONFLICT (user_id) DO NOTHING;  -- Prevent duplicates

        -- Create comodines inventory
        -- IMPORTANT: comodines_inventory.user_id references profiles.id (NOT auth.users.id)
        INSERT INTO gamification_system.comodines_inventory (
            user_id
        ) VALUES (
            NEW.id  -- CORRECTED: usar NEW.id (profiles.id) porque FK apunta a profiles(id)
        )
        ON CONFLICT (user_id) DO NOTHING;

        -- Create initial user rank (starting with Ajaw - lowest rank)
        INSERT INTO gamification_system.user_ranks (
            user_id,
            tenant_id,
            current_rank
        ) VALUES (
            NEW.user_id,  -- Fixed: usar user_id en lugar de id
            NEW.tenant_id,
            'Ajaw'::gamification_system.maya_rank
        );

        -- NEW: Initialize daily and weekly missions for new users
        -- This ensures missions are available immediately after registration
        -- PERFORM gamilit.initialize_user_missions(NEW.user_id);  -- TODO: Implementar función
    END IF;

    RETURN NEW;
END;
$function$;

COMMENT ON FUNCTION gamilit.initialize_user_stats() IS 'Inicializa estadísticas de gamificación para nuevos usuarios';
