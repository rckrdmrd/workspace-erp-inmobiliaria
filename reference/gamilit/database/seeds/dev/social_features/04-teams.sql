-- =====================================================================
-- Archivo: 04-teams.sql
-- Schema: social_features
-- Descripción: Seeds de equipos colaborativos y sus membresías
-- Dependencias: 02-classrooms.sql, 03-classroom-members.sql
-- Autor: SA-SEEDS-SOCIAL
-- Fecha: 2025-11-02
-- =====================================================================

SET search_path TO social_features, auth, public;

-- =====================================================================
-- TEAMS: Equipos colaborativos dentro de aulas
-- =====================================================================

DO $$
DECLARE
    classroom_2a UUID;
    classroom_3b UUID;
    classroom_1a UUID;
    classroom_2st UUID;
    student1_id UUID;
    student2_id UUID;
    student3_id UUID;
    team_cientificos UUID;
    team_exploradores UUID;
    team_pioneros UUID;
    team_innovadores UUID;
    team_count INTEGER;
    member_count INTEGER;
BEGIN
    -- =====================================================================
    -- Obtener classroom IDs
    -- =====================================================================
    SELECT classroom_id INTO classroom_2a
    FROM social_features.classrooms
    WHERE classroom_code = '2A-LECT-2025';

    SELECT classroom_id INTO classroom_3b
    FROM social_features.classrooms
    WHERE classroom_code = '3B-DIGI-2025';

    SELECT classroom_id INTO classroom_1a
    FROM social_features.classrooms
    WHERE classroom_code = '1A-INTRO-2025';

    SELECT classroom_id INTO classroom_2st
    FROM social_features.classrooms
    WHERE classroom_code = '2ST-LITC-2025';

    -- =====================================================================
    -- Obtener student IDs
    -- =====================================================================
    SELECT user_id INTO student1_id
    FROM auth.users
    WHERE email = 'estudiante1@demo.glit.edu.mx';

    SELECT user_id INTO student2_id
    FROM auth.users
    WHERE email = 'estudiante2@demo.glit.edu.mx';

    SELECT user_id INTO student3_id
    FROM auth.users
    WHERE email = 'estudiante3@demo.glit.edu.mx';

    -- Validar que existan los recursos necesarios
    IF classroom_2a IS NULL THEN
        RAISE EXCEPTION 'No se encontró el aula 2A-LECT-2025. Ejecutar seeds de classrooms primero.';
    END IF;

    IF student1_id IS NULL THEN
        RAISE EXCEPTION 'No se encontraron estudiantes demo. Ejecutar seeds de auth primero.';
    END IF;

    -- =====================================================================
    -- EQUIPO 1: Los Científicos (Aula 2° A - Secundaria Federal 15)
    -- Enfoque: Biografías de científicos
    -- =====================================================================
    INSERT INTO social_features.teams (
        classroom_id, name, code, description,
        capacity, current_members_count,
        is_active, is_active,
        settings, metadata,
        created_at, updated_at
    ) VALUES
    (
        classroom_2a,
        'Los Científicos',
        'TEAM-CIENT-2A',
        'Equipo enfocado en explorar biografías de científicos famosos y sus contribuciones a la humanidad. Proyecto: "Mujeres en la Ciencia".',
        5,
        0,
        'active',
        true,
        '{
            "allow_public_join": false,
            "require_approval": true,
            "enable_team_chat": true,
            "collaboration_tools": ["shared_documents", "video_calls", "task_board"],
            "meeting_schedule": {
                "frequency": "weekly",
                "day": "Viernes",
                "time": "15:00-16:00"
            }
        }'::jsonb,
        '{
            "color": "#3498db",
            "icon": "flask",
            "motto": "Explorando la ciencia juntos",
            "current_project": "Biografías de Mujeres Científicas",
            "achievements": [],
            "team_goals": [
                "Completar 5 biografías científicas",
                "Presentar en Feria de Ciencias",
                "Crear podcast educativo"
            ]
        }'::jsonb,
        NOW(),
        NOW()
    )
    RETURNING team_id INTO team_cientificos;

    -- =====================================================================
    -- EQUIPO 2: Exploradores Digitales (Aula 3° B - Secundaria Federal 15)
    -- Enfoque: Lectura digital y fact-checking
    -- =====================================================================
    INSERT INTO social_features.teams (
        classroom_id, name, code, description,
        capacity, current_members_count,
        is_active, is_active,
        settings, metadata,
        created_at, updated_at
    ) VALUES
    (
        classroom_3b,
        'Exploradores Digitales',
        'TEAM-EXPLO-3B',
        'Equipo dedicado a dominar la lectura digital, fact-checking y análisis crítico de medios. Proyecto: "Cazadores de Fake News".',
        5,
        0,
        'active',
        true,
        '{
            "allow_public_join": false,
            "require_approval": true,
            "enable_team_chat": true,
            "collaboration_tools": ["shared_documents", "video_calls", "annotation_tools"],
            "meeting_schedule": {
                "frequency": "biweekly",
                "day": "Jueves",
                "time": "16:00-17:00"
            }
        }'::jsonb,
        '{
            "color": "#2ecc71",
            "icon": "compass",
            "motto": "Navegando el mundo digital con criterio",
            "current_project": "Cazadores de Fake News",
            "achievements": ["Primera verificación exitosa"],
            "team_goals": [
                "Verificar 10 noticias virales",
                "Crear guía de fact-checking",
                "Workshop para la comunidad"
            ],
            "tools_mastered": ["Google Fact Check", "TinEye", "Wayback Machine"]
        }'::jsonb,
        NOW(),
        NOW()
    )
    RETURNING team_id INTO team_exploradores;

    -- =====================================================================
    -- EQUIPO 3: Pioneros Técnicos (Aula 1° A - Secundaria Técnica 42)
    -- Enfoque: Lectura de manuales técnicos
    -- =====================================================================
    INSERT INTO social_features.teams (
        classroom_id, name, code, description,
        capacity, current_members_count,
        is_active, is_active,
        settings, metadata,
        created_at, updated_at
    ) VALUES
    (
        classroom_1a,
        'Pioneros Técnicos',
        'TEAM-PION-1A',
        'Equipo enfocado en comprensión de manuales técnicos, documentación de software y estándares industriales.',
        6,
        0,
        'active',
        true,
        '{
            "allow_public_join": false,
            "require_approval": true,
            "enable_team_chat": true,
            "collaboration_tools": ["shared_documents", "code_repository"],
            "meeting_schedule": {
                "frequency": "weekly",
                "day": "Miércoles",
                "time": "17:00-18:00"
            }
        }'::jsonb,
        '{
            "color": "#e74c3c",
            "icon": "wrench",
            "motto": "Leyendo el futuro técnico",
            "current_project": "Manual de Arduino para Principiantes",
            "achievements": [],
            "team_goals": [
                "Completar manual Arduino",
                "Construir proyecto electrónico",
                "Documentar proceso técnico"
            ]
        }'::jsonb,
        NOW(),
        NOW()
    )
    RETURNING team_id INTO team_pioneros;

    -- =====================================================================
    -- EQUIPO 4: Innovadores STEAM (Aula 2° STEAM - Colegio Einstein)
    -- Enfoque: Literatura científica bilingüe
    -- =====================================================================
    INSERT INTO social_features.teams (
        classroom_id, name, code, description,
        capacity, current_members_count,
        is_active, is_active,
        settings, metadata,
        created_at, updated_at
    ) VALUES
    (
        classroom_2st,
        'Innovadores STEAM',
        'TEAM-INNOV-2ST',
        'Equipo bilingüe enfocado en integrar literatura científica con proyectos STEAM. Proyecto: "Scientists Who Changed the World".',
        4,
        0,
        'active',
        true,
        '{
            "allow_public_join": false,
            "require_approval": true,
            "enable_team_chat": true,
            "bilingual_communication": true,
            "collaboration_tools": ["shared_documents", "video_calls", "design_tools"],
            "meeting_schedule": {
                "frequency": "weekly",
                "day": "Viernes",
                "time": "14:00-15:30"
            }
        }'::jsonb,
        '{
            "color": "#9b59b6",
            "icon": "lightbulb",
            "motto": "Innovation through knowledge / Innovación a través del conocimiento",
            "current_project": "Scientists Who Changed the World",
            "bilingual": true,
            "achievements": ["STEAM Fair Participation"],
            "team_goals": [
                "Complete 3 bilingual biographies",
                "Create interactive exhibition",
                "Present at International STEAM Fair"
            ],
            "partnership": "MIT Pre-Collegiate Program"
        }'::jsonb,
        NOW(),
        NOW()
    )
    RETURNING team_id INTO team_innovadores;

    -- =====================================================================
    -- MEMBRESÍAS DE EQUIPOS
    -- =====================================================================

    -- Equipo 1: Los Científicos
    INSERT INTO social_features.team_members (
        team_id, user_id, role,
        joined_date, is_active, is_active,
        metadata, created_at, updated_at
    ) VALUES
    (
        team_cientificos,
        student1_id,
        'leader',
        NOW(),
        'active',
        true,
        '{
            "responsibilities": ["Coordinar reuniones", "Asignar tareas", "Revisar entregas"],
            "expertise": ["Investigación", "Organización"],
            "contribution_score": 95
        }'::jsonb,
        NOW(),
        NOW()
    ),
    (
        team_cientificos,
        student3_id,
        'member',
        NOW(),
        'active',
        true,
        '{
            "responsibilities": ["Investigar biografías", "Editar contenido"],
            "expertise": ["Escritura creativa", "Investigación"],
            "contribution_score": 88
        }'::jsonb,
        NOW(),
        NOW()
    ),

    -- Equipo 2: Exploradores Digitales
    (
        team_exploradores,
        student2_id,
        'leader',
        NOW(),
        'active',
        true,
        '{
            "responsibilities": ["Coordinar verificaciones", "Gestionar herramientas", "Moderar discusiones"],
            "expertise": ["Fact-checking", "Alfabetización digital"],
            "contribution_score": 92,
            "certifications": ["Digital Literacy Basic"]
        }'::jsonb,
        NOW(),
        NOW()
    ),
    (
        team_exploradores,
        student1_id,
        'member',
        NOW(),
        'active',
        true,
        '{
            "responsibilities": ["Verificar noticias", "Documentar hallazgos"],
            "expertise": ["Análisis crítico", "Búsqueda avanzada"],
            "contribution_score": 90
        }'::jsonb,
        NOW(),
        NOW()
    ),

    -- Equipo 3: Pioneros Técnicos
    (
        team_pioneros,
        student3_id,
        'leader',
        NOW(),
        'active',
        true,
        '{
            "responsibilities": ["Coordinar proyectos técnicos", "Revisar documentación"],
            "expertise": ["Electrónica básica", "Lectura técnica"],
            "contribution_score": 85
        }'::jsonb,
        NOW(),
        NOW()
    ),

    -- Equipo 4: Innovadores STEAM
    (
        team_innovadores,
        student1_id,
        'co-leader',
        NOW(),
        'active',
        true,
        '{
            "responsibilities": ["Traducción bilingüe", "Diseño de presentaciones"],
            "expertise": ["Bilingüismo", "Diseño gráfico"],
            "contribution_score": 94,
            "languages": ["Español", "English"]
        }'::jsonb,
        NOW(),
        NOW()
    ),
    (
        team_innovadores,
        student2_id,
        'member',
        NOW(),
        'active',
        true,
        '{
            "responsibilities": ["Investigación científica", "Redacción técnica"],
            "expertise": ["Investigación", "STEAM projects"],
            "contribution_score": 89,
            "languages": ["Español", "English"]
        }'::jsonb,
        NOW(),
        NOW()
    )
    ON CONFLICT (team_id, user_id) DO UPDATE SET
        status = EXCLUDED.is_active,
        role = EXCLUDED.role,
        metadata = EXCLUDED.metadata,
        updated_at = NOW();

    -- =====================================================================
    -- Actualizar member counts en teams
    -- =====================================================================
    UPDATE social_features.teams
    SET current_members_count = (
        SELECT COUNT(*)
        FROM social_features.team_members
        WHERE team_members.team_id = teams.team_id
          AND status = 'active'
    )
    WHERE team_id IN (
        team_cientificos, team_exploradores,
        team_pioneros, team_innovadores
    );

    -- =====================================================================
    -- Verificación de inserción
    -- =====================================================================
    SELECT COUNT(*) INTO team_count
    FROM social_features.teams
    WHERE status = 'active';

    SELECT COUNT(*) INTO member_count
    FROM social_features.team_members
    WHERE status = 'active';

    RAISE NOTICE '================================================';
    RAISE NOTICE 'TEAMS SEEDS - RESUMEN DE INSERCIÓN';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Total de equipos creados: %', team_count;
    RAISE NOTICE 'Total de membresías activas: %', member_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Equipos por aula:';
    RAISE NOTICE '- Los Científicos (2A): % miembros', (
        SELECT current_members_count FROM social_features.teams WHERE team_id = team_cientificos
    );
    RAISE NOTICE '- Exploradores Digitales (3B): % miembros', (
        SELECT current_members_count FROM social_features.teams WHERE team_id = team_exploradores
    );
    RAISE NOTICE '- Pioneros Técnicos (1A): % miembros', (
        SELECT current_members_count FROM social_features.teams WHERE team_id = team_pioneros
    );
    RAISE NOTICE '- Innovadores STEAM (2ST): % miembros', (
        SELECT current_members_count FROM social_features.teams WHERE team_id = team_innovadores
    );
    RAISE NOTICE '================================================';

END $$;
