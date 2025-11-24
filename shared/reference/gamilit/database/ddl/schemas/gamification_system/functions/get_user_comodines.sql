-- Nombre: get_user_comodines
-- Descripción: Obtiene todos los comodines disponibles del usuario
-- Schema: gamification_system
-- Tipo: FUNCTION

CREATE OR REPLACE FUNCTION gamification_system.get_user_comodines(p_user_id UUID)
RETURNS TABLE (
    comodin_id UUID,
    comodin_name VARCHAR,
    comodin_type VARCHAR,
    category VARCHAR,
    quantity INTEGER,
    effect_description TEXT,
    acquired_at TIMESTAMP,
    expires_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        si.id,
        si.name,
        si.item_type::VARCHAR,
        si.category::VARCHAR,
        ui.quantity,
        si.description,
        ui.acquired_at,
        ui.expires_at
    FROM gamification_system.user_inventory ui
    JOIN gamification_system.store_items si ON si.id = ui.item_id
    WHERE ui.user_id = p_user_id
    AND si.item_type = 'CONSUMABLE'
    AND ui.quantity > 0
    AND (ui.expires_at IS NULL OR ui.expires_at > NOW())
    ORDER BY
        CASE si.category
            WHEN 'XP_BOOST' THEN 1
            WHEN 'COIN_MULTIPLIER' THEN 2
            WHEN 'SKIP_MISSION' THEN 3
            ELSE 4
        END,
        ui.acquired_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION gamification_system.get_user_comodines(UUID) IS
    'Obtiene todos los comodines disponibles del usuario';

GRANT EXECUTE ON FUNCTION gamification_system.get_user_comodines(UUID) TO authenticated;
