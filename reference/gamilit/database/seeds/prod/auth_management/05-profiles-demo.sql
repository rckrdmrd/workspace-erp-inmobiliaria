-- =====================================================
-- Seed: auth_management.profiles - Demo Users (PROD)
-- Description: Perfiles para los 20 usuarios demo
-- Environment: PRODUCTION
-- Dependencies: auth.users (01-demo-users.sql), auth_management.tenants
-- Order: 05
-- Created: 2025-11-15
-- Version: 1.0
-- =====================================================
--
-- PERFILES DEMO INCLUIDOS:
-- - 15 estudiantes demo
-- - 2 profesores demo
-- - 2 administradores demo
-- - 1 padre demo
--
-- TOTAL: 20 perfiles demo
--
-- IMPORTANTE: Este seed complementa 04-profiles-complete.sql
-- que ya creó los 3 perfiles de testing (admin, teacher, student @gamilit.com)
--
-- El trigger initialize_user_stats() creará automáticamente:
-- - gamification_system.user_stats (con 100 ML Coins iniciales)
-- - gamification_system.user_ranks (rango inicial 'Ajaw')
-- - gamification_system.comodines_inventory
-- =====================================================

SET search_path TO auth_management, public;

-- =====================================================
-- INSERT: Perfiles Demo
-- =====================================================

INSERT INTO auth_management.profiles (
    id,
    tenant_id,
    user_id,
    email,
    display_name,
    full_name,
    first_name,
    last_name,
    avatar_url,
    bio,
    phone,
    date_of_birth,
    grade_level,
    student_id,
    school_id,
    role,
    status,
    email_verified,
    phone_verified,
    preferences,
    metadata,
    created_at,
    updated_at
) VALUES

-- =====================================================
-- ESTUDIANTES DEMO (15)
-- =====================================================

-- 1. Ana García Pérez (estudiante1@demo.glit.edu.mx)
(
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '01ac4f00-082e-4287-b899-2e169c49b05e'::uuid,
    'estudiante1@demo.glit.edu.mx',
    'Ana García',
    'Ana García Pérez',
    'Ana',
    'García Pérez',
    '/avatars/demo/student-01.png',
    'Me encanta leer sobre ciencia y explorar nuevos temas.',
    '55-1001-0001',
    '2013-03-15'::date,
    '5',
    'EST-DEMO-001',
    '50000000-0000-0000-0000-000000000001'::uuid,  -- Escuela Marie Curie
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    false,
    jsonb_build_object(
        'theme', 'ocean',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true,
        'gamification', jsonb_build_object(
            'show_leaderboard', true,
            'show_achievements', true,
            'show_rank', true
        )
    ),
    jsonb_build_object(
        'demo_user', true,
        'interests', ARRAY['ciencia', 'lectura', 'astronomía'],
        'learning_style', 'visual'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- 2. Carlos Ramírez López (estudiante2@demo.glit.edu.mx)
(
    '02bc5f00-182e-5387-c899-3f269d49c06f'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '02bc5f00-182e-5387-c899-3f269d49c06f'::uuid,
    'estudiante2@demo.glit.edu.mx',
    'Carlos Ramírez',
    'Carlos Ramírez López',
    'Carlos',
    'Ramírez López',
    '/avatars/demo/student-02.png',
    'Disfruto los deportes y aprender cosas nuevas.',
    '55-1001-0002',
    '2013-07-22'::date,
    '5',
    'EST-DEMO-002',
    '50000000-0000-0000-0000-000000000001'::uuid,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    false,
    jsonb_build_object(
        'theme', 'space',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true,
        'gamification', jsonb_build_object(
            'show_leaderboard', true,
            'show_achievements', true,
            'show_rank', true
        )
    ),
    jsonb_build_object(
        'demo_user', true,
        'interests', ARRAY['deportes', 'matemáticas', 'tecnología'],
        'learning_style', 'kinesthetic'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- 3. María Fernanda Sánchez (estudiante3@demo.glit.edu.mx)
(
    '03cd6000-282e-6487-d899-40369e49d070'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '03cd6000-282e-6487-d899-40369e49d070'::uuid,
    'estudiante3@demo.glit.edu.mx',
    'María Fernanda',
    'María Fernanda Sánchez',
    'María Fernanda',
    'Sánchez',
    '/avatars/demo/student-03.png',
    'Me fascina la lectura y escribir historias creativas.',
    '55-1001-0003',
    '2013-11-05'::date,
    '5',
    'EST-DEMO-003',
    '50000000-0000-0000-0000-000000000001'::uuid,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    false,
    jsonb_build_object(
        'theme', 'forest',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true,
        'gamification', jsonb_build_object(
            'show_leaderboard', true,
            'show_achievements', true,
            'show_rank', true
        )
    ),
    jsonb_build_object(
        'demo_user', true,
        'interests', ARRAY['lectura', 'escritura', 'arte'],
        'learning_style', 'verbal'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- 4. Luis Miguel Torres (estudiante4@demo.glit.edu.mx)
(
    '04de7000-382e-7587-e899-51469f49e081'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '04de7000-382e-7587-e899-51469f49e081'::uuid,
    'estudiante4@demo.glit.edu.mx',
    'Luis Miguel',
    'Luis Miguel Torres',
    'Luis Miguel',
    'Torres',
    '/avatars/demo/student-04.png',
    'Me gusta resolver problemas y jugar ajedrez.',
    '55-1001-0004',
    '2013-02-18'::date,
    '5',
    'EST-DEMO-004',
    '50000000-0000-0000-0000-000000000001'::uuid,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    false,
    jsonb_build_object(
        'theme', 'detective',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true,
        'gamification', jsonb_build_object(
            'show_leaderboard', true,
            'show_achievements', true,
            'show_rank', true
        )
    ),
    jsonb_build_object(
        'demo_user', true,
        'interests', ARRAY['ajedrez', 'matemáticas', 'lógica'],
        'learning_style', 'logical'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- 5. Sofía Martínez Hernández (estudiante5@demo.glit.edu.mx)
(
    '05ef8000-482e-8687-f899-62569049f092'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '05ef8000-482e-8687-f899-62569049f092'::uuid,
    'estudiante5@demo.glit.edu.mx',
    'Sofía Martínez',
    'Sofía Martínez Hernández',
    'Sofía',
    'Martínez Hernández',
    '/avatars/demo/student-05.png',
    'Soy curiosa y me encanta aprender sobre el universo.',
    '55-1001-0005',
    '2012-06-10'::date,
    '6',
    'EST-DEMO-005',
    '50000000-0000-0000-0000-000000000001'::uuid,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    true,
    jsonb_build_object(
        'theme', 'galaxy',
        'language', 'es',
        'timezone', 'America/Mexico_City',
        'sound_enabled', true,
        'notifications_enabled', true,
        'gamification', jsonb_build_object(
            'show_leaderboard', true,
            'show_achievements', true,
            'show_rank', true
        )
    ),
    jsonb_build_object(
        'demo_user', true,
        'interests', ARRAY['astronomía', 'física', 'ciencias naturales'],
        'learning_style', 'visual'
    ),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- 6-15: Resto de estudiantes (formato compacto)
(
    '06f09000-582e-9787-0899-73679149010d'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '06f09000-582e-9787-0899-73679149010d'::uuid,
    'estudiante6@demo.glit.edu.mx',
    'Diego Rodríguez',
    'Diego Rodríguez Vega',
    'Diego',
    'Rodríguez Vega',
    '/avatars/demo/student-06.png',
    'Me gusta la tecnología y crear cosas nuevas.',
    '55-1001-0006',
    '2012-09-14'::date,
    '6',
    'EST-DEMO-006',
    '50000000-0000-0000-0000-000000000001'::uuid,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    false,
    jsonb_build_object('theme', 'detective', 'language', 'es', 'timezone', 'America/Mexico_City', 'sound_enabled', true, 'notifications_enabled', true, 'gamification', jsonb_build_object('show_leaderboard', true, 'show_achievements', true, 'show_rank', true)),
    jsonb_build_object('demo_user', true, 'interests', ARRAY['tecnología', 'robótica', 'programación'], 'learning_style', 'kinesthetic'),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
(
    '07010000-682e-0887-1999-847802491e14'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '07010000-682e-0887-1999-847802491e14'::uuid,
    'estudiante7@demo.glit.edu.mx',
    'Valentina Cruz',
    'Valentina Cruz Morales',
    'Valentina',
    'Cruz Morales',
    '/avatars/demo/student-07.png',
    'Amo la música y las artes.',
    '55-1001-0007',
    '2013-04-20'::date,
    '5',
    'EST-DEMO-007',
    '50000000-0000-0000-0000-000000000001'::uuid,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    false,
    jsonb_build_object('theme', 'ocean', 'language', 'es', 'timezone', 'America/Mexico_City', 'sound_enabled', true, 'notifications_enabled', true, 'gamification', jsonb_build_object('show_leaderboard', true, 'show_achievements', true, 'show_rank', true)),
    jsonb_build_object('demo_user', true, 'interests', ARRAY['música', 'arte', 'danza'], 'learning_style', 'musical'),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
(
    '08121000-782e-1987-2009-9f891349212f'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '08121000-782e-1987-2009-9f891349212f'::uuid,
    'estudiante8@demo.glit.edu.mx',
    'Mateo Flores',
    'Mateo Flores Jiménez',
    'Mateo',
    'Flores Jiménez',
    '/avatars/demo/student-08.png',
    'Me gusta explorar la naturaleza.',
    '55-1001-0008',
    '2013-08-30'::date,
    '5',
    'EST-DEMO-008',
    '50000000-0000-0000-0000-000000000001'::uuid,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    false,
    jsonb_build_object('theme', 'forest', 'language', 'es', 'timezone', 'America/Mexico_City', 'sound_enabled', true, 'notifications_enabled', true, 'gamification', jsonb_build_object('show_leaderboard', true, 'show_achievements', true, 'show_rank', true)),
    jsonb_build_object('demo_user', true, 'interests', ARRAY['naturaleza', 'biología', 'ecología'], 'learning_style', 'naturalist'),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
(
    '09232000-882e-2087-3119-0a90244931a3'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '09232000-882e-2087-3119-0a90244931a3'::uuid,
    'estudiante9@demo.glit.edu.mx',
    'Isabella Romero',
    'Isabella Romero Silva',
    'Isabella',
    'Romero Silva',
    '/avatars/demo/student-09.png',
    'Me encanta leer aventuras y misterios.',
    '55-1001-0009',
    '2012-12-08'::date,
    '6',
    'EST-DEMO-009',
    '50000000-0000-0000-0000-000000000001'::uuid,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    false,
    jsonb_build_object('theme', 'detective', 'language', 'es', 'timezone', 'America/Mexico_City', 'sound_enabled', true, 'notifications_enabled', true, 'gamification', jsonb_build_object('show_leaderboard', true, 'show_achievements', true, 'show_rank', true)),
    jsonb_build_object('demo_user', true, 'interests', ARRAY['lectura', 'misterios', 'investigación'], 'learning_style', 'verbal'),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
(
    '10343000-982e-3187-4229-1b01354941b4'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '10343000-982e-3187-4229-1b01354941b4'::uuid,
    'estudiante10@demo.glit.edu.mx',
    'Sebastián Vargas',
    'Sebastián Vargas Castro',
    'Sebastián',
    'Vargas Castro',
    '/avatars/demo/student-10.png',
    'Soy deportista y me gusta trabajar en equipo.',
    '55-1001-0010',
    '2013-01-25'::date,
    '5',
    'EST-DEMO-010',
    '50000000-0000-0000-0000-000000000001'::uuid,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    false,
    jsonb_build_object('theme', 'space', 'language', 'es', 'timezone', 'America/Mexico_City', 'sound_enabled', true, 'notifications_enabled', true, 'gamification', jsonb_build_object('show_leaderboard', true, 'show_achievements', true, 'show_rank', true)),
    jsonb_build_object('demo_user', true, 'interests', ARRAY['deportes', 'trabajo en equipo', 'liderazgo'], 'learning_style', 'kinesthetic'),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
(
    '11454000-092e-4287-5339-2c12464951c5'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '11454000-092e-4287-5339-2c12464951c5'::uuid,
    'estudiante11@demo.glit.edu.mx',
    'Camila Ortiz',
    'Camila Ortiz Reyes',
    'Camila',
    'Ortiz Reyes',
    '/avatars/demo/student-11.png',
    'Me gusta pintar y crear arte digital.',
    '55-1001-0011',
    '2012-05-12'::date,
    '6',
    'EST-DEMO-011',
    '50000000-0000-0000-0000-000000000001'::uuid,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    false,
    jsonb_build_object('theme', 'galaxy', 'language', 'es', 'timezone', 'America/Mexico_City', 'sound_enabled', true, 'notifications_enabled', true, 'gamification', jsonb_build_object('show_leaderboard', true, 'show_achievements', true, 'show_rank', true)),
    jsonb_build_object('demo_user', true, 'interests', ARRAY['arte', 'diseño', 'tecnología'], 'learning_style', 'visual'),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
(
    '12565000-102e-5387-6449-3d23574961d6'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '12565000-102e-5387-6449-3d23574961d6'::uuid,
    'estudiante12@demo.glit.edu.mx',
    'Leonardo Méndez',
    'Leonardo Méndez Ruiz',
    'Leonardo',
    'Méndez Ruiz',
    '/avatars/demo/student-12.png',
    'Me interesa la historia y las culturas.',
    '55-1001-0012',
    '2013-10-03'::date,
    '5',
    'EST-DEMO-012',
    '50000000-0000-0000-0000-000000000001'::uuid,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    false,
    jsonb_build_object('theme', 'detective', 'language', 'es', 'timezone', 'America/Mexico_City', 'sound_enabled', true, 'notifications_enabled', true, 'gamification', jsonb_build_object('show_leaderboard', true, 'show_achievements', true, 'show_rank', true)),
    jsonb_build_object('demo_user', true, 'interests', ARRAY['historia', 'culturas', 'geografía'], 'learning_style', 'verbal'),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
(
    '13676000-202e-6487-7559-4e34684971e7'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '13676000-202e-6487-7559-4e34684971e7'::uuid,
    'estudiante13@demo.glit.edu.mx',
    'Emilia Navarro',
    'Emilia Navarro Gutiérrez',
    'Emilia',
    'Navarro Gutiérrez',
    '/avatars/demo/student-13.png',
    'Me fascina la química y los experimentos.',
    '55-1001-0013',
    '2012-03-28'::date,
    '6',
    'EST-DEMO-013',
    '50000000-0000-0000-0000-000000000001'::uuid,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    true,
    jsonb_build_object('theme', 'space', 'language', 'es', 'timezone', 'America/Mexico_City', 'sound_enabled', true, 'notifications_enabled', true, 'gamification', jsonb_build_object('show_leaderboard', true, 'show_achievements', true, 'show_rank', true)),
    jsonb_build_object('demo_user', true, 'interests', ARRAY['química', 'experimentos', 'ciencia'], 'learning_style', 'kinesthetic'),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
(
    '14787000-302e-7587-8669-5f45794981f8'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '14787000-302e-7587-8669-5f45794981f8'::uuid,
    'estudiante14@demo.glit.edu.mx',
    'Joaquín Castro',
    'Joaquín Castro Delgado',
    'Joaquín',
    'Castro Delgado',
    '/avatars/demo/student-14.png',
    'Me gusta la música clásica y tocar el piano.',
    '55-1001-0014',
    '2013-06-17'::date,
    '5',
    'EST-DEMO-014',
    '50000000-0000-0000-0000-000000000001'::uuid,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    false,
    jsonb_build_object('theme', 'ocean', 'language', 'es', 'timezone', 'America/Mexico_City', 'sound_enabled', true, 'notifications_enabled', true, 'gamification', jsonb_build_object('show_leaderboard', true, 'show_achievements', true, 'show_rank', true)),
    jsonb_build_object('demo_user', true, 'interests', ARRAY['música', 'piano', 'composición'], 'learning_style', 'musical'),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
(
    '15898000-402e-8687-9779-60568a4991a9'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '15898000-402e-8687-9779-60568a4991a9'::uuid,
    'estudiante15@demo.glit.edu.mx',
    'Renata Guerrero',
    'Renata Guerrero Medina',
    'Renata',
    'Guerrero Medina',
    '/avatars/demo/student-15.png',
    'Me interesa la programación y crear videojuegos.',
    '55-1001-0015',
    '2012-11-22'::date,
    '6',
    'EST-DEMO-015',
    '50000000-0000-0000-0000-000000000001'::uuid,
    'student'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    true,
    jsonb_build_object('theme', 'galaxy', 'language', 'es', 'timezone', 'America/Mexico_City', 'sound_enabled', true, 'notifications_enabled', true, 'gamification', jsonb_build_object('show_leaderboard', true, 'show_achievements', true, 'show_rank', true)),
    jsonb_build_object('demo_user', true, 'interests', ARRAY['programación', 'videojuegos', 'tecnología'], 'learning_style', 'logical'),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- PROFESORES DEMO (2)
-- =====================================================

(
    '10ac4f00-092e-4297-b909-2e179c49b15e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '10ac4f00-092e-4297-b909-2e179c49b15e'::uuid,
    'profesor1@demo.glit.edu.mx',
    'Prof. Roberto Méndez',
    'Profesor Roberto Méndez García',
    'Roberto',
    'Méndez García',
    '/avatars/demo/teacher-01.png',
    'Profesor de Lengua Española y Literatura con 10 años de experiencia.',
    '55-2001-0001',
    '1985-04-12'::date,
    NULL,
    NULL,
    '50000000-0000-0000-0000-000000000001'::uuid,
    'admin_teacher'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    true,
    jsonb_build_object('theme', 'professional', 'language', 'es', 'timezone', 'America/Mexico_City', 'sound_enabled', true, 'notifications_enabled', true),
    jsonb_build_object('demo_user', true, 'subjects', ARRAY['Lengua Española', 'Literatura'], 'years_experience', 10),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
(
    '11bc5f00-192e-5397-c919-3f279d49c26f'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '11bc5f00-192e-5397-c919-3f279d49c26f'::uuid,
    'profesor2@demo.glit.edu.mx',
    'Profa. Laura González',
    'Profesora Laura González Martínez',
    'Laura',
    'González Martínez',
    '/avatars/demo/teacher-02.png',
    'Profesora de Comprensión Lectora especializada en metodologías activas.',
    '55-2001-0002',
    '1988-09-25'::date,
    NULL,
    NULL,
    '50000000-0000-0000-0000-000000000001'::uuid,
    'admin_teacher'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    true,
    jsonb_build_object('theme', 'professional', 'language', 'es', 'timezone', 'America/Mexico_City', 'sound_enabled', true, 'notifications_enabled', true),
    jsonb_build_object('demo_user', true, 'subjects', ARRAY['Comprensión Lectora', 'Español'], 'years_experience', 7),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- ADMINISTRADORES DEMO (2)
-- =====================================================

(
    '20ac4f00-002e-4207-b809-2e189c49b25e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '20ac4f00-002e-4207-b809-2e189c49b25e'::uuid,
    'admin-sistema@gamilit.com',
    'Admin Sistema GAMILIT',
    'Administrador del Sistema GAMILIT',
    'Administrador',
    'Sistema',
    '/avatars/demo/admin-01.png',
    'Administrador secundario del sistema GAMILIT.',
    '55-3001-0001',
    '1982-01-15'::date,
    NULL,
    NULL,
    NULL,
    'super_admin'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    true,
    jsonb_build_object('theme', 'professional', 'language', 'es', 'timezone', 'America/Mexico_City', 'sound_enabled', true, 'notifications_enabled', true),
    jsonb_build_object('demo_user', true, 'admin_level', 'system'),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),
(
    '21bc5f00-102e-5307-c829-3f289d49c36f'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '21bc5f00-102e-5307-c829-3f289d49c36f'::uuid,
    'director@demo.glit.edu.mx',
    'Lic. Patricia Hernández',
    'Licenciada Patricia Hernández López',
    'Patricia',
    'Hernández López',
    '/avatars/demo/admin-02.png',
    'Directora de la Escuela Primaria Marie Curie.',
    '55-3001-0002',
    '1980-07-08'::date,
    NULL,
    NULL,
    '50000000-0000-0000-0000-000000000001'::uuid,
    'admin_teacher'::auth_management.gamilit_role,
    'active'::auth_management.user_status,
    true,
    true,
    jsonb_build_object('theme', 'professional', 'language', 'es', 'timezone', 'America/Mexico_City', 'sound_enabled', true, 'notifications_enabled', true),
    jsonb_build_object('demo_user', true, 'position', 'Director', 'school_id', '50000000-0000-0000-0000-000000000001'),
    gamilit.now_mexico(),
    gamilit.now_mexico()
),

-- =====================================================
-- PADRES (1)
-- =====================================================

(
    '30ac4f00-012e-4217-b819-2e199c49b35e'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '30ac4f00-012e-4217-b819-2e199c49b35e'::uuid,
    'padre1@demo.glit.edu.mx',
    'Sr. Jorge García',
    'Jorge García Martínez',
    'Jorge',
    'García Martínez',
    '/avatars/demo/parent-01.png',
    'Padre de familia de Ana García Pérez.',
    '55-4001-0001',
    '1978-03-20'::date,
    NULL,
    NULL,
    NULL,
    'student'::auth_management.gamilit_role,  -- Note: Parent role uses student for now
    'active'::auth_management.user_status,
    true,
    true,
    jsonb_build_object('theme', 'professional', 'language', 'es', 'timezone', 'America/Mexico_City', 'sound_enabled', true, 'notifications_enabled', true),
    jsonb_build_object('demo_user', true, 'user_type', 'parent', 'children_ids', ARRAY['01ac4f00-082e-4287-b899-2e169c49b05e']),
    gamilit.now_mexico(),
    gamilit.now_mexico()
)

ON CONFLICT (user_id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    full_name = EXCLUDED.full_name,
    bio = EXCLUDED.bio,
    preferences = EXCLUDED.preferences,
    metadata = EXCLUDED.metadata,
    updated_at = gamilit.now_mexico();

-- =====================================================
-- Verification Query
-- =====================================================

DO $$
DECLARE
    profile_count INTEGER;
    student_profiles INTEGER;
    teacher_profiles INTEGER;
    admin_profiles INTEGER;
    parent_profiles INTEGER;
BEGIN
    SELECT COUNT(*) INTO profile_count
    FROM auth_management.profiles
    WHERE metadata->>'demo_user' = 'true';

    SELECT COUNT(*) INTO student_profiles
    FROM auth_management.profiles
    WHERE role = 'student' AND metadata->>'demo_user' = 'true';

    SELECT COUNT(*) INTO teacher_profiles
    FROM auth_management.profiles
    WHERE role = 'admin_teacher' AND metadata->>'demo_user' = 'true';

    SELECT COUNT(*) INTO admin_profiles
    FROM auth_management.profiles
    WHERE role = 'super_admin' AND metadata->>'demo_user' = 'true';

    SELECT COUNT(*) INTO parent_profiles
    FROM auth_management.profiles
    WHERE metadata->>'user_type' = 'parent';

    RAISE NOTICE '========================================';
    RAISE NOTICE 'PERFILES DEMO CREADOS EXITOSAMENTE';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total perfiles demo: %', profile_count;
    RAISE NOTICE '  - Estudiantes: %', student_profiles;
    RAISE NOTICE '  - Profesores: %', teacher_profiles;
    RAISE NOTICE '  - Administradores: %', admin_profiles;
    RAISE NOTICE '  - Padres: %', parent_profiles;
    RAISE NOTICE '========================================';

    IF profile_count = 20 THEN
        RAISE NOTICE '✓ Todos los perfiles demo fueron creados correctamente';
        RAISE NOTICE '';
        RAISE NOTICE 'El trigger initialize_user_stats() creará automáticamente:';
        RAISE NOTICE '  - gamification_system.user_stats (100 ML Coins iniciales)';
        RAISE NOTICE '  - gamification_system.user_ranks (rango Ajaw inicial)';
        RAISE NOTICE '  - gamification_system.comodines_inventory';
    ELSE
        RAISE WARNING '⚠ Se esperaban 20 perfiles demo, se crearon %', profile_count;
    END IF;
END $$;

-- =====================================================
-- Testing Info
-- =====================================================
-- Los perfiles demo ahora están completos.
-- Total profiles: 23 (3 testing + 20 demo)
--
-- Para verificar que el trigger funcionó:
-- SELECT COUNT(*) FROM gamification_system.user_stats;  -- Debe ser 23
-- SELECT COUNT(*) FROM gamification_system.user_ranks;  -- Debe ser 23
-- SELECT COUNT(*) FROM gamification_system.comodines_inventory;  -- Debe ser 23
-- =====================================================
