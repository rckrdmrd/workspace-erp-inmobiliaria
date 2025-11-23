-- Nombre: consume_comodin
-- Descripción: Consume un comodín del usuario y aplica su efecto
-- Schema: gamification_system
-- Tipo: FUNCTION

CREATE OR REPLACE FUNCTION gamification_system.consume_comodin(
    p_user_id UUID,
    p_comodin_id UUID
)
RETURNS TABLE (
    success BOOLEAN,
    comodin_type VARCHAR,
    effect_applied VARCHAR,
    value_applied INTEGER,
    message VARCHAR
) AS $$
DECLARE
    v_comodin RECORD;
    v_user_comodin RECORD;
    v_remaining_quantity INTEGER;
BEGIN
    -- Obtener información del comodín
    SELECT * INTO v_comodin
    FROM gamification_system.user_inventory
    WHERE user_id = p_user_id
    AND item_id = p_comodin_id;

    IF NOT FOUND THEN
        RETURN QUERY SELECT
            false,
            'UNKNOWN'::VARCHAR,
            'NONE'::VARCHAR,
            0,
            'Usuario no posee este comodín'::VARCHAR;
        RETURN;
    END IF;

    -- Obtener detalles del item
    SELECT * INTO v_comodin
    FROM gamification_system.store_items
    WHERE id = p_comodin_id;

    IF NOT FOUND THEN
        RETURN QUERY SELECT
            false,
            'UNKNOWN'::VARCHAR,
            'NONE'::VARCHAR,
            0,
            'Comodín no encontrado'::VARCHAR;
        RETURN;
    END IF;

    -- Verificar que sea un comodín (item_type)
    IF v_comodin.item_type != 'CONSUMABLE' THEN
        RETURN QUERY SELECT
            false,
            v_comodin.category::VARCHAR,
            'NONE'::VARCHAR,
            0,
            'Este item no es un comodín consumible'::VARCHAR;
        RETURN;
    END IF;

    -- Consumir el comodín (reducir cantidad)
    UPDATE gamification_system.user_inventory
    SET quantity = quantity - 1,
        updated_at = NOW()
    WHERE user_id = p_user_id
    AND item_id = p_comodin_id
    RETURNING quantity INTO v_remaining_quantity;

    -- Aplicar efecto según tipo de comodín
    CASE v_comodin.category
        WHEN 'XP_BOOST' THEN
            -- Aplicar boost de XP
            UPDATE gamification_system.user_stats
            SET total_xp = total_xp + 100,
                updated_at = NOW()
            WHERE user_id = p_user_id;

            RETURN QUERY SELECT
                true,
                'XP_BOOST'::VARCHAR,
                'GRANTED_XP'::VARCHAR,
                100,
                'Comodín XP consumido: +100 XP'::VARCHAR;

        WHEN 'COIN_MULTIPLIER' THEN
            -- Aplicar multiplicador de coins temporalmente (almacenado en active_boosts)
            INSERT INTO gamification_system.active_boosts (
                user_id,
                boost_type,
                multiplier,
                source,
                activated_at,
                expires_at,
                is_active
            ) VALUES (
                p_user_id,
                'COINS',
                1.5,
                'COMODIN_' || p_comodin_id::VARCHAR,
                NOW(),
                NOW() + INTERVAL '1 hour',
                true
            );

            RETURN QUERY SELECT
                true,
                'COIN_MULTIPLIER'::VARCHAR,
                'COINS_MULTIPLIER_APPLIED'::VARCHAR,
                150,
                'Multiplicador de coins aplicado: 1.5x por 1 hora'::VARCHAR;

        WHEN 'SKIP_MISSION' THEN
            -- Permite saltar una misión
            RETURN QUERY SELECT
                true,
                'SKIP_MISSION'::VARCHAR,
                'MISSION_SKIP_AVAILABLE'::VARCHAR,
                1,
                'Permiso de saltar misión otorgado'::VARCHAR;

        ELSE
            RETURN QUERY SELECT
                false,
                v_comodin.category::VARCHAR,
                'UNKNOWN'::VARCHAR,
                0,
                'Tipo de comodín desconocido'::VARCHAR;
    END CASE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION gamification_system.consume_comodin(UUID, UUID) IS
    'Consume un comodín del usuario y aplica su efecto';

GRANT EXECUTE ON FUNCTION gamification_system.consume_comodin(UUID, UUID) TO authenticated;
