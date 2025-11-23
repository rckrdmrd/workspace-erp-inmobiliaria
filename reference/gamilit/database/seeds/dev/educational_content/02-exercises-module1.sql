-- =====================================================
-- Seed Data: Exercises Module 1 - Comprensión Literal (PRODUCTION)
-- =====================================================
-- Description: 5 ejercicios interactivos del Módulo 1
-- Module: MOD-01-LITERAL
-- Exercises: Crucigrama, Línea de Tiempo, Sopa de Letras, Mapa Conceptual, Emparejamiento
-- Source: Migrated from DEV seeds (validated and production-ready)
-- Date: 2025-11-11
-- Status: PRODUCTION
-- =====================================================

SET search_path TO educational_content, public;

-- Obtener module_id dinámicamente
DO $$
DECLARE
    mod_id UUID;
BEGIN
    SELECT id INTO mod_id FROM educational_content.modules WHERE module_code = 'MOD-01-LITERAL';

    IF mod_id IS NULL THEN
        RAISE EXCEPTION 'Módulo MOD-01-LITERAL no encontrado. Ejecutar primero 01-modules.sql';
    END IF;

    -- ========================================================================
    -- EXERCISE 1.1: CRUCIGRAMA CIENTÍFICO
    -- ========================================================================
    INSERT INTO educational_content.exercises (
        module_id, title, subtitle, description, instructions,
        objective, how_to_solve, recommended_strategy, pedagogical_notes,
        exercise_type, order_index,
        config, content, solution,
        difficulty_level, max_points, passing_score,
        estimated_time_minutes, time_limit_minutes, max_attempts,
        hints, enable_hints, hint_cost_ml_coins,
        comodines_allowed, comodines_config,
        xp_reward, ml_coins_reward,
        is_active, version
    ) VALUES (
        mod_id,
        'Crucigrama Científico - DISTRIBUCIÓN',
        'Vocabulario de Radioactividad',
        'Completa el crucigrama con términos científicos relacionados con los descubrimientos de Marie Curie.',
        '1. Lee todas las pistas antes de empezar, tanto horizontales como verticales. 2. Comienza con las palabras más largas o las que estés más seguro. 3. Usa las intersecciones - cuando dos palabras se cruzan, la letra debe coincidir. 4. Cuenta las casillas - cada pista indica cuántas letras tiene la respuesta. 5. Revisa el texto base - todas las respuestas están en la biografía de Marie Curie.',

        -- objective (DB-125)
        'Completar un crucigrama de 15×15 casillas con términos relacionados con Marie Curie. Este ejercicio refuerza el vocabulario científico clave (radioactividad, elementos químicos, instituciones académicas) y desarrolla la habilidad de identificar información explícita en textos biográficos, alineado con el nivel de comprensión literal del modelo de Daniel Cassany.',

        -- how_to_solve (DB-125)
        E'Estrategia de resolución paso a paso:\n\n1. Leer todas las pistas primero: Lee tanto las pistas horizontales como verticales antes de empezar a escribir. Esto te da una visión general del crucigrama.\n\n2. Comenzar con las palabras más largas o seguras: Identifica las palabras que conoces con certeza (por ejemplo: POLONIA, MARIE, CURIE, SORBONA, NOBEL). Estas suelen ser las más largas o las más conocidas del texto base.\n\n3. Usar las intersecciones estratégicamente: Cuando dos palabras se cruzan, la letra debe coincidir. Usa estas intersecciones para deducir letras de palabras que no conoces.\n\n4. Contar las casillas: Cada pista indica cuántas letras tiene la respuesta. Cuenta las casillas disponibles para asegurarte de que tu respuesta encaja.\n\n5. Revisar el texto base: Todas las respuestas están explícitamente mencionadas en la biografía de Marie Curie. Si te atascas, vuelve al texto y busca las palabras clave de la pista.',

        -- recommended_strategy (DB-125)
        E'Tips para resolver eficientemente:\n- Empezar por palabras seguras: POLONIA (país de origen), MARIE y CURIE (nombre), SORBONA (universidad) son términos que probablemente conoces.\n- Aprovechar las intersecciones: Una vez que tengas 1-2 palabras seguras, usa las letras compartidas para deducir otras palabras.\n- Usar comodines con inteligencia: Si te atascas completamente, el comodín "Pista" revelará una letra por 15 ML Coins. Úsalo estratégicamente en las palabras más difíciles (RADIOACTIVIDAD, POLONIO, RADIO).\n- No adivinar al azar: Penalizaciones aplican por respuestas incorrectas. Mejor consulta el texto base o usa una pista.',

        -- pedagogical_notes (DB-125)
        E'Este ejercicio desarrolla la competencia de comprensión literal según el modelo de tres niveles de Daniel Cassany. Los estudiantes practican:\n- Identificación de información explícita en textos biográficos\n- Reconocimiento de vocabulario técnico-científico en contexto\n- Asociación de conceptos clave con su significado (universidad → SORBONA, elemento químico → RADIO/POLONIO)\n\nCompetencias trabajadas:\n- Lectura literal (nivel 1 de Cassany)\n- Vocabulario académico y científico\n- Atención al detalle y precisión\n\nAlineación curricular: Este ejercicio es apropiado para estudiantes de nivel beginner (A1 CEFR) en comprensión lectora de textos académicos.',

        'crucigrama', 1,
        '{
            "gridSize": {"rows": 15, "cols": 15},
            "autoCheck": true,
            "showProgress": true,
            "caseSensitive": false,
            "allowSpaces": false
        }'::jsonb,
        '{
            "clues": [
                {
                    "id": "h1",
                    "number": 1,
                    "direction": "horizontal",
                    "clue": "Universidad donde estudió",
                    "answer": "SORBONA",
                    "startRow": 4,
                    "startCol": 3,
                    "length": 7
                },
                {
                    "id": "h2",
                    "number": 2,
                    "direction": "horizontal",
                    "clue": "Premio recibido en 1903 y 1911",
                    "answer": "NOBEL",
                    "startRow": 6,
                    "startCol": 3,
                    "length": 5
                },
                {
                    "id": "h3",
                    "number": 3,
                    "direction": "horizontal",
                    "clue": "Fenómeno de emisión espontánea de radiación descubierto por Marie",
                    "answer": "RADIOACTIVIDAD",
                    "startRow": 8,
                    "startCol": 1,
                    "length": 14
                },
                {
                    "id": "v1",
                    "number": 4,
                    "direction": "vertical",
                    "clue": "Elemento químico nombrado en honor a Polonia",
                    "answer": "POLONIO",
                    "startRow": 3,
                    "startCol": 4,
                    "length": 7
                },
                {
                    "id": "v2",
                    "number": 5,
                    "direction": "vertical",
                    "clue": "Elemento químico radiactivo descubierto",
                    "answer": "RADIO",
                    "startRow": 8,
                    "startCol": 1,
                    "length": 5
                },
                {
                    "id": "v3",
                    "number": 6,
                    "direction": "vertical",
                    "clue": "Apellido de Marie",
                    "answer": "CURIE",
                    "startRow": 8,
                    "startCol": 7,
                    "length": 5
                }
            ]
        }'::jsonb,
        '{
            "clues": {
                "h1": "SORBONA",
                "h2": "NOBEL",
                "h3": "RADIOACTIVIDAD",
                "v1": "POLONIO",
                "v2": "RADIO",
                "v3": "CURIE"
            }
        }'::jsonb,
        'beginner', 100, 70,
        15, 25, 3,
        ARRAY[
            'La universidad francesa donde Marie estudió',
            'Marie ganó este premio dos veces',
            'Elemento nombrado en honor al país de Marie',
            'Apellido de la científica'
        ]::text[],
        true, 15,
        ARRAY['pistas', 'vision_lectora', 'segunda_oportunidad']::gamification_system.comodin_type[],
        '{
            "pistas": {"enabled": true, "cost": 15},
            "vision_lectora": {"enabled": true, "cost": 25},
            "segunda_oportunidad": {"enabled": true, "cost": 40}
        }'::jsonb,
        100, 20,
        true, 1
    ) ON CONFLICT (module_id, exercise_type, order_index) DO UPDATE SET
        content = EXCLUDED.content,
        solution = EXCLUDED.solution,
        updated_at = NOW();

    -- ========================================================================
    -- EXERCISE 1.2: LÍNEA DE TIEMPO
    -- ========================================================================
    INSERT INTO educational_content.exercises (
        module_id, title, subtitle, description, instructions,
        objective, how_to_solve, recommended_strategy, pedagogical_notes,
        exercise_type, order_index,
        config, content, solution,
        difficulty_level, max_points, passing_score,
        estimated_time_minutes, time_limit_minutes, max_attempts,
        hints, enable_hints, hint_cost_ml_coins,
        comodines_allowed, comodines_config,
        xp_reward, ml_coins_reward,
        is_active, version
    ) VALUES (
        mod_id,
        'Línea de Tiempo de Marie Curie',
        'Ordena los Eventos Cronológicamente',
        'Organiza los eventos más importantes de la vida de Marie Curie en orden cronológico correcto.',
        'Arrastra los eventos a la línea de tiempo en el orden correcto. Comienza con el evento más antiguo (1867) y termina con el más reciente (1934).',

        -- objective (DB-125)
        'Ordenar cronológicamente 6 eventos clave de la vida de Marie Curie mediante drag & drop interactivo. Este ejercicio desarrolla la capacidad de secuenciar información temporal explícita, identificar fechas importantes y comprender la cronología de eventos biográficos según el modelo de comprensión literal de Cassany.',

        -- how_to_solve (DB-125)
        E'Pasos para resolver correctamente:\n\n1. Leer todos los eventos antes de empezar: Revisa las 6 tarjetas de eventos para tener una visión general de la vida de Marie.\n\n2. Identificar las fechas clave: Los eventos incluyen fechas explícitas (1867, 1891, 1898, 1903, 1906, 1911) que son tu guía principal.\n\n3. Ordenar de más antiguo a más reciente: Arrastra el evento de 1867 (nacimiento) a la primera posición, luego 1891 (llega a París), y así sucesivamente hasta 1911 (segundo Nobel).\n\n4. Validar con feedback visual: El sistema indica en verde si está correcto y en rojo si está incorrecto. Tienes 3 intentos sin penalización.\n\n5. Revisar la secuencia completa: Una vez ordenados todos, verifica que la historia tiene sentido cronológico (nacimiento → estudios → descubrimientos → premios).',

        -- recommended_strategy (DB-125)
        E'Tips para ordenar eficientemente:\n- Anclar eventos extremos: Coloca primero el nacimiento (1867) y el segundo Nobel (1911) como puntos de referencia.\n- Agrupar eventos relacionados: Los descubrimientos (1898) van antes que el primer Nobel (1903), ya que este premio fue por esos descubrimientos.\n- Usar el contexto lógico: La muerte de Pierre (1906) ocurre después del primer Nobel compartido (1903) y antes del segundo Nobel individual (1911).\n- Aprovechar los 3 intentos: Si te equivocas, el feedback te ayudará a corregir sin perder puntos en los primeros 3 intentos.',

        -- pedagogical_notes (DB-125)
        E'Ejercicio de comprensión literal enfocado en secuenciación temporal. Los estudiantes practican:\n- Identificación de fechas y eventos explícitos en textos biográficos\n- Ordenación cronológica de información temporal\n- Comprensión de secuencias causa-efecto temporales\n\nCompetencias trabajadas:\n- Lectura literal (nivel 1 de Cassany) con énfasis en cronología\n- Pensamiento secuencial y temporal\n- Comprensión de narrativas biográficas\n\nAlineación curricular: Nivel beginner (A1-A2 CEFR). La interfaz drag & drop hace este ejercicio accesible y kinestésico, ideal para estudiantes visuales.',

        'linea_tiempo', 2,
        '{
            "allowReordering": true,
            "showYears": true,
            "visualStyle": "horizontal",
            "dragAndDrop": true,
            "showFeedback": "immediate"
        }'::jsonb,
        '{
            "events": [
                {
                    "id": "event-1",
                    "year": 1867,
                    "date": "1867-11-07",
                    "title": "Nace Maria Sklodowska en Varsovia, Polonia",
                    "description": "Marie Curie nace como Maria Sklodowska en Varsovia, entonces parte del Imperio Ruso",
                    "category": "Personal",
                    "imageUrl": null
                },
                {
                    "id": "event-2",
                    "year": 1891,
                    "title": "Se traslada a París para estudiar en la Sorbona",
                    "description": "Marie se muda a Francia para continuar sus estudios universitarios en física y matemáticas",
                    "category": "Educación",
                    "imageUrl": null
                },
                {
                    "id": "event-3",
                    "year": 1895,
                    "date": "1895-07-25",
                    "title": "Se casa con Pierre Curie",
                    "description": "Marie se casa con el físico francés Pierre Curie, iniciando una colaboración científica histórica",
                    "category": "Personal",
                    "imageUrl": null
                },
                {
                    "id": "event-4",
                    "year": 1898,
                    "date": "1898-12",
                    "title": "Descubre el polonio y el radio",
                    "description": "Marie y Pierre anuncian el descubrimiento de dos nuevos elementos: polonio y radio",
                    "category": "Descubrimiento",
                    "imageUrl": null
                },
                {
                    "id": "event-5",
                    "year": 1903,
                    "title": "Recibe su primer Premio Nobel de Física",
                    "description": "Marie, Pierre y Henri Becquerel reciben el Nobel de Física por sus investigaciones sobre radioactividad",
                    "category": "Reconocimiento",
                    "imageUrl": null
                },
                {
                    "id": "event-6",
                    "year": 1911,
                    "title": "Recibe su segundo Premio Nobel, en Química",
                    "description": "Marie recibe el Nobel de Química por el descubrimiento del radio y polonio, siendo la primera persona en ganar dos Nobel",
                    "category": "Reconocimiento",
                    "imageUrl": null
                },
                {
                    "id": "event-7",
                    "year": 1934,
                    "date": "1934-07-04",
                    "title": "Fallece debido a anemia aplásica",
                    "description": "Marie Curie fallece en Francia a causa de una enfermedad relacionada con su exposición prolongada a la radiación",
                    "category": "Personal",
                    "imageUrl": null
                }
            ],
            "categories": ["Personal", "Educación", "Descubrimiento", "Reconocimiento"]
        }'::jsonb,
        '{
            "correctOrder": ["event-1", "event-2", "event-3", "event-4", "event-5", "event-6", "event-7"],
            "yearSequence": [1867, 1891, 1895, 1898, 1903, 1911, 1934]
        }'::jsonb,
        'beginner', 100, 70,
        12, 20, 3,
        ARRAY[
            'Marie nació en 1867 en Polonia',
            'Se mudó a París en 1891',
            'Ganó su primer Nobel en 1903 y el segundo en 1911'
        ]::text[],
        true, 15,
        ARRAY['pistas', 'vision_lectora', 'segunda_oportunidad']::gamification_system.comodin_type[],
        '{
            "pistas": {"enabled": true, "cost": 15},
            "vision_lectora": {"enabled": true, "cost": 25},
            "segunda_oportunidad": {"enabled": true, "cost": 40}
        }'::jsonb,
        100, 20,
        true, 1
    ) ON CONFLICT (module_id, exercise_type, order_index) DO UPDATE SET
        content = EXCLUDED.content,
        solution = EXCLUDED.solution,
        updated_at = NOW();

    -- ========================================================================
    -- EXERCISE 1.3: COMPLETAR ESPACIOS EN BLANCO
    -- ========================================================================
    -- CHANGED: Replaced "Sopa de Letras" with "Completar Espacios en Blanco" per doc v6.2 (DB-121)
    INSERT INTO educational_content.exercises (
        module_id, title, subtitle, description, instructions,
        objective, how_to_solve, recommended_strategy, pedagogical_notes,
        exercise_type, order_index,
        config, content, solution,
        difficulty_level, max_points, passing_score,
        estimated_time_minutes, time_limit_minutes, max_attempts,
        hints, enable_hints, hint_cost_ml_coins,
        comodines_allowed, comodines_config,
        xp_reward, ml_coins_reward,
        is_active, version
    ) VALUES (
        mod_id,
        'Completar Espacios en Blanco',
        'Datos Biográficos de Marie',
        'Lee el texto sobre Marie Curie y completa los espacios con las palabras correctas del banco de palabras.',
        'Lee el texto completo antes de completar. Arrastra las palabras del banco a los espacios correspondientes. Puedes revisar tus respuestas antes de enviar.',

        -- objective (DB-125)
        'Completar 6 espacios en blanco de un texto biográfico sobre Marie Curie seleccionando las palabras correctas de un banco de opciones. Este ejercicio refuerza la comprensión de datos biográficos explícitos (nombres, lugares, conceptos) y desarrolla la habilidad de identificar información clave en contexto narrativo según el modelo literal de Cassany.',

        -- how_to_solve (DB-125)
        E'Estrategia de resolución:\n\n1. Leer el texto completo primero: Antes de completar espacios, lee todo el párrafo para entender el contexto general sobre la familia y juventud de Marie.\n\n2. Analizar el banco de palabras: Revisa las 8 opciones disponibles (Varsovia, Władysław, Bronisława, educación, ciencias, Polonia, matemáticas, física). Identifica cuáles son nombres propios, lugares o conceptos.\n\n3. Completar por categorías: Primero completa los espacios obvios (nombres de personas y lugares), luego los conceptos más específicos.\n\n4. Usar el contexto gramatical: Cada espacio tiene pistas gramaticales. Por ejemplo, "nació en ___" espera un lugar (Varsovia), "su padre ___" espera un nombre propio.\n\n5. Revisar coherencia: Lee el texto completo con tus respuestas para verificar que tenga sentido lógico antes de enviar.',

        -- recommended_strategy (DB-125)
        E'Tips para completar eficientemente:\n- Espacios de nombres y lugares primero: Varsovia (ciudad natal), Władysław (padre), Bronisława (madre) son datos únicos y fáciles de identificar.\n- Usar eliminación: Si usas "Varsovia" en el espacio (1), ya no estará disponible para otros espacios.\n- Contexto semántico: "valoraba la ___" probablemente es un concepto abstracto (educación), no un nombre propio.\n- Último espacio con 2 opciones: El ejercicio permite matemáticas O física para el espacio (6), ambas son correctas (curiosidad por ciencias y matemáticas/física).\n- Revisar antes de enviar: Tienes 3 intentos, usa el primero para probar, luego ajusta si es necesario.',

        -- pedagogical_notes (DB-125)
        E'Ejercicio de comprensión literal con enfoque en datos biográficos explícitos. Los estudiantes practican:\n- Identificación de información clave: nombres propios, lugares, fechas, conceptos\n- Uso de contexto gramatical y semántico para completar información faltante\n- Atención al detalle y precisión en lectura biográfica\n\nCompetencias trabajadas:\n- Lectura literal (nivel 1 de Cassany) con énfasis en datos biográficos\n- Vocabulario académico y nombres históricos\n- Comprensión de estructura narrativa biográfica\n\nAlineación curricular: Nivel beginner-intermediate (A2 CEFR). El banco de palabras reduce la carga cognitiva, permitiendo enfoque en comprensión contextual.',

        'completar_espacios', 3,
        '{
            "blankCount": 6,
            "allowMultipleAttempts": true,
            "showWordBank": true,
            "caseSensitive": false
        }'::jsonb,
        '{
            "text": "Marie Sklodowska nació en ___, Polonia. Su padre ___ era profesor de matemáticas y física, mientras que su madre ___ dirigía una escuela prestigiosa. La familia valoraba mucho la ___ y Marie mostró desde pequeña gran curiosidad por las ___ y ___.",
            "wordBank": [
                "Varsovia",
                "Władysław",
                "Bronisława",
                "educación",
                "ciencias",
                "Polonia",
                "matemáticas",
                "física"
            ],
            "blanks": [
                {"id": "1", "position": 0, "correctAnswer": "Varsovia", "alternatives": []},
                {"id": "2", "position": 1, "correctAnswer": "Władysław", "alternatives": []},
                {"id": "3", "position": 2, "correctAnswer": "Bronisława", "alternatives": []},
                {"id": "4", "position": 3, "correctAnswer": "educación", "alternatives": []},
                {"id": "5", "position": 4, "correctAnswer": "ciencias", "alternatives": []},
                {"id": "6", "position": 5, "correctAnswer": "matemáticas", "alternatives": ["física"]}
            ]
        }'::jsonb,
        '{
            "correctAnswers": {
                "1": "Varsovia",
                "2": "Władysław",
                "3": "Bronisława",
                "4": "educación",
                "5": "ciencias",
                "6": "matemáticas"
            }
        }'::jsonb,
        'beginner', 100, 60,
        10, NULL, 3,
        ARRAY[
            'Pista 1: El padre de Marie tenía un nombre polaco que comienza con W',
            'Pista 2: Marie nació en la capital de Polonia'
        ]::text[],
        true, 15,
        ARRAY['pistas', 'vision_lectora', 'segunda_oportunidad']::gamification_system.comodin_type[],
        '{
            "pistas": {"enabled": true, "cost": 15},
            "vision_lectora": {"enabled": true, "cost": 25},
            "segunda_oportunidad": {"enabled": true, "cost": 40}
        }'::jsonb,
        100, 20,
        true, 1
    ) ON CONFLICT (module_id, exercise_type, order_index) DO UPDATE SET
        content = EXCLUDED.content,
        solution = EXCLUDED.solution,
        updated_at = NOW();

    -- ========================================================================
    -- EXERCISE 1.4: VERDADERO O FALSO
    -- ========================================================================
    -- CHANGED: Replaced "Mapa Conceptual" with "Verdadero o Falso" per doc v6.2 (DB-121)
    INSERT INTO educational_content.exercises (
        module_id, title, subtitle, description, instructions,
        objective, how_to_solve, recommended_strategy, pedagogical_notes,
        exercise_type, order_index,
        config, content, solution,
        difficulty_level, max_points, passing_score,
        estimated_time_minutes, time_limit_minutes, max_attempts,
        hints, enable_hints, hint_cost_ml_coins,
        comodines_allowed, comodines_config,
        xp_reward, ml_coins_reward,
        is_active, version
    ) VALUES (
        mod_id,
        'Verdadero o Falso',
        'Hechos sobre la Juventud de Marie Curie',
        'Evalúa afirmaciones sobre hechos explícitos de la juventud de Marie Curie según el contexto histórico proporcionado.',
        'Lee el contexto histórico. Marca cada afirmación como Verdadero o Falso. Revisa todas las respuestas antes de enviar.',

        -- objective (DB-125)
        'Evaluar 10 afirmaciones sobre hechos explícitos de la juventud de Marie Curie, determinando si son verdaderas o falsas según un contexto histórico proporcionado. Este ejercicio desarrolla la capacidad de verificar información biográfica explícita contra un texto fuente, fundamental para la comprensión literal según Cassany.',

        -- how_to_solve (DB-125)
        E'Pasos para resolver correctamente:\n\n1. Leer el contexto completo primero: Antes de evaluar afirmaciones, lee todo el párrafo histórico sobre la infancia de Marie para tener el marco de referencia completo.\n\n2. Leer cada afirmación cuidadosamente: No te apresures. Cada afirmación tiene detalles específicos que debes verificar contra el contexto.\n\n3. Buscar evidencia en el texto: Para cada afirmación, busca la información correspondiente en el contexto. Si está explícitamente mencionada = Verdadero. Si contradice el texto = Falso.\n\n4. Cuidado con trampas sutiles: Algunas afirmaciones son parcialmente correctas. Por ejemplo, "su padre era profesor de química solamente" es FALSO porque era de matemáticas Y física, no solo química.\n\n5. Revisar todas antes de enviar: Tienes 3 intentos. Usa el primero para contestar todas, luego revisa las dudosas antes del segundo intento.',

        -- recommended_strategy (DB-125)
        E'Tips para evaluar eficientemente:\n- Afirmaciones obvias primero: Algunas son muy directas ("Marie nació en Francia" - FALSO, nació en Polonia). Contesta estas rápido para ganar confianza.\n- Subrayar mentalmente palabras clave: "solamente", "nunca", "siempre" son señales de alerta. Verifica si el texto realmente usa esos absolutos.\n- Afirmaciones sobre edades/fechas: Verifica números exactos. "Ganó el Nobel a los 20" es FALSO (lo ganó en 1903, con ~36 años).\n- Usar eliminación: Si sabes que estudió en la Sorbona de París, entonces "estudió en Universidad de Varsovia" es automáticamente FALSO.\n- Máximo 3 intentos: Primer intento = contestar todas. Segundo intento = revisar dudosas. Tercer intento = confirmar.',

        -- pedagogical_notes (DB-125)
        E'Ejercicio de comprensión literal con énfasis en verificación de hechos explícitos. Los estudiantes practican:\n- Contrastar afirmaciones con evidencia textual\n- Identificar información explícita vs implícita\n- Detectar afirmaciones falsas por contradicción o ausencia de evidencia\n- Atención al detalle (palabras como "solamente", "nunca" cambian el significado)\n\nCompetencias trabajadas:\n- Lectura literal (nivel 1 de Cassany) con énfasis en verificación factual\n- Pensamiento crítico básico (evidencia vs afirmación)\n- Atención a detalles y precisión lingüística\n\nAlineación curricular: Nivel beginner-intermediate (A2-B1 CEFR). Formato verdadero/falso es accesible pero requiere lectura cuidadosa.',

        'verdadero_falso', 4,
        '{
            "statementCount": 10,
            "randomizeOrder": false,
            "showExplanations": true
        }'::jsonb,
        '{
            "context": "Durante su infancia en Polonia, Marie era conocida por su insaciable curiosidad científica. Su padre le enseñó los primeros principios de las matemáticas y la física, mientras su madre la inspiró con su dedicación a la educación.",
            "statements": [
                {
                    "id": 1,
                    "statement": "Marie mostró curiosidad excepcional por las ciencias desde muy pequeña",
                    "answer": true,
                    "explanation": "El texto menciona su insaciable curiosidad científica"
                },
                {
                    "id": 2,
                    "statement": "Su padre era profesor de química solamente",
                    "answer": false,
                    "explanation": "Era profesor de matemáticas y física"
                },
                {
                    "id": 3,
                    "statement": "Marie nació en Francia",
                    "answer": false,
                    "explanation": "Nació en Polonia (Varsovia)"
                },
                {
                    "id": 4,
                    "statement": "Su familia valoraba mucho la educación",
                    "answer": true,
                    "explanation": "Explícitamente mencionado en el contexto"
                },
                {
                    "id": 5,
                    "statement": "La madre de Marie dirigía una escuela",
                    "answer": true,
                    "explanation": "Se menciona que dirigía una escuela prestigiosa"
                },
                {
                    "id": 6,
                    "statement": "Marie Curie ganó su primer Nobel a los 20 años",
                    "answer": false,
                    "explanation": "Lo ganó en 1903, cuando tenía 36 años"
                },
                {
                    "id": 7,
                    "statement": "El nombre original de Marie era Maria Sklodowska",
                    "answer": true,
                    "explanation": "Nombre de nacimiento confirmado"
                },
                {
                    "id": 8,
                    "statement": "Marie fue la primera mujer en ganar un Premio Nobel",
                    "answer": true,
                    "explanation": "Hecho histórico verificable"
                },
                {
                    "id": 9,
                    "statement": "Su padre no apoyaba su interés en las ciencias",
                    "answer": false,
                    "explanation": "Le enseñó matemáticas y física"
                },
                {
                    "id": 10,
                    "statement": "Marie estudió en la Universidad de Varsovia",
                    "answer": false,
                    "explanation": "Estudió en la Sorbona de París"
                }
            ]
        }'::jsonb,
        '{
            "correctAnswers": {
                "1": true,
                "2": false,
                "3": false,
                "4": true,
                "5": true,
                "6": false,
                "7": true,
                "8": true,
                "9": false,
                "10": false
            }
        }'::jsonb,
        'beginner', 100, 70,
        12, NULL, 3,
        ARRAY[
            'Pista 1: Revisa el contexto histórico proporcionado',
            'Pista 2: Marie nació en Polonia, no en Francia'
        ]::text[],
        true, 15,
        ARRAY['pistas', 'vision_lectora', 'segunda_oportunidad']::gamification_system.comodin_type[],
        '{
            "pistas": {"enabled": true, "cost": 15},
            "vision_lectora": {"enabled": true, "cost": 25},
            "segunda_oportunidad": {"enabled": true, "cost": 40}
        }'::jsonb,
        100, 20,
        true, 1
    ) ON CONFLICT (module_id, exercise_type, order_index) DO UPDATE SET
        content = EXCLUDED.content,
        solution = EXCLUDED.solution,
        updated_at = NOW();

    -- ========================================================================
    -- EXERCISE 1.5: SOPA DE LETRAS (BONUS)
    -- CHANGED: Replaced "Emparejamiento" with "Sopa de Letras (BONUS)" per doc v6.2 (DB-121)
    -- ========================================================================
    INSERT INTO educational_content.exercises (
        module_id, title, subtitle, description, instructions,
        objective, how_to_solve, recommended_strategy, pedagogical_notes,
        exercise_type, order_index,
        config, content, solution,
        difficulty_level, max_points, passing_score,
        estimated_time_minutes, time_limit_minutes, max_attempts,
        hints, enable_hints, hint_cost_ml_coins,
        comodines_allowed, comodines_config,
        xp_reward, ml_coins_reward,
        is_active, version
    ) VALUES (
        mod_id,
        'Sopa de Letras (BONUS)',
        'Vocabulario Científico de Marie Curie',
        'Encuentra palabras clave relacionadas con Marie Curie en una sopa de letras interactiva. Este es un ejercicio bonus opcional.',
        'Busca las 10 palabras en el grid. Haz clic y arrastra para seleccionar. Las palabras pueden estar en horizontal, vertical o diagonal.',

        -- objective (DB-125)
        'Encontrar 10 palabras clave relacionadas con Marie Curie en una cuadrícula de 12×12 letras. Este ejercicio BONUS refuerza el vocabulario científico y biográfico clave (MARIE, CURIE, POLONIA, NOBEL, RADIO, POLONIO, PARIS, SORBONA, CIENCIA, FISICA) mediante búsqueda visual, complementando la comprensión literal con actividad lúdica.',

        -- how_to_solve (DB-125)
        E'Estrategia de búsqueda:\n\n1. Revisar la lista de palabras: Antes de buscar, lee las 10 palabras que debes encontrar (MARIE, CURIE, POLONIA, NOBEL, RADIO, POLONIO, PARIS, SORBONA, CIENCIA, FISICA). Esto activa tu memoria visual.\n\n2. Buscar por longitud: Empieza por palabras largas (RADIOACTIVIDAD sería la más larga si estuviera, pero no está). POLONIA y POLONIO son las más largas con 7 letras.\n\n3. Buscar en todas direcciones: Las palabras pueden estar horizontal (→), vertical (↓) o diagonal (↘). Escanea sistemáticamente.\n\n4. Método de escaneo eficiente: Lee la cuadrícula fila por fila buscando la primera letra de cada palabra. Cuando encuentres una "P", verifica si forma POLONIA, POLONIO o PARIS.\n\n5. Marcar palabras encontradas: Haz clic y arrastra para seleccionar. Las palabras encontradas se iluminan y ya no necesitas buscarlas.',

        -- recommended_strategy (DB-125)
        E'Tips para encontrar eficientemente:\n- Palabras cortas primero: MARIE (5), CURIE (5), NOBEL (5), RADIO (5), PARIS (5) son más fáciles de encontrar que las largas.\n- Esquinas y bordes: Muchas sopas de letras colocan palabras en los bordes. Revisa primero las orillas.\n- Letras poco comunes: "Q", "K", "W" no aparecen en español. Si ves una, probablemente es ruido. Las palabras del ejercicio solo usan letras comunes.\n- Tiempo límite: 10 minutos. No te estreses, es ejercicio BONUS (opcional). Si no terminas, no afecta tu progreso obligatorio.\n- Usar comodín "Pista": Si te atascas, el comodín revelará la posición de una palabra por 15 ML Coins.',

        -- pedagogical_notes (DB-125)
        E'Ejercicio BONUS lúdico que refuerza vocabulario clave mediante búsqueda visual. Los estudiantes practican:\n- Reconocimiento visual de palabras clave biográficas y científicas\n- Atención sostenida y búsqueda sistemática\n- Familiarización con términos importantes (nombres, lugares, conceptos)\n\nCompetencias trabajadas:\n- Vocabulario académico y científico (refuerzo, no evaluación)\n- Atención visual y concentración\n- Gamificación: actividad lúdica reduce ansiedad y aumenta motivación\n\nAlineación curricular: Nivel beginner (A1 CEFR). BONUS significa que es opcional y no afecta la calificación obligatoria del módulo. Ideal para estudiantes que terminan rápido o buscan práctica extra.',

        'sopa_letras', 5,
        '{
            "gridSize": {"rows": 10, "cols": 10},
            "useStaticGrid": true,
            "directions": ["horizontal", "vertical", "diagonal"],
            "selectionMode": "click-drag",
            "highlightFound": true
        }'::jsonb,
        '{
            "grid": [
                ["A", "C", "I", "S", "Í", "F", "K", "A", "V", "S"],
                ["É", "P", "M", "V", "V", "Ó", "I", "A", "N", "Y"],
                ["Í", "A", "Ü", "H", "D", "C", "N", "T", "M", "É"],
                ["N", "R", "A", "I", "N", "O", "L", "O", "P", "É"],
                ["O", "I", "T", "E", "B", "C", "I", "T", "R", "D"],
                ["B", "S", "I", "R", "U", "N", "Ó", "N", "A", "Ó"],
                ["E", "C", "O", "R", "O", "C", "Í", "D", "D", "Í"],
                ["L", "S", "I", "L", "X", "T", "M", "Y", "I", "Ü"],
                ["J", "E", "O", "Í", "Í", "L", "P", "O", "O", "Á"],
                ["N", "P", "M", "A", "R", "I", "E", "E", "O", "V"]
            ],
            "words": [
                "MARIE", "CURIE", "POLONIA", "NOBEL", "RADIO",
                "POLONIO", "PARIS", "SORBONA", "CIENCIA", "FÍSICA"
            ],
            "wordsPositions": [
                {"word": "MARIE", "direction": "horizontal", "startRow": 9, "startCol": 4},
                {"word": "POLONIA", "direction": "horizontal-reverse", "startRow": 3, "startCol": 8},
                {"word": "NOBEL", "direction": "vertical", "startRow": 3, "startCol": 0},
                {"word": "PARIS", "direction": "vertical", "startRow": 1, "startCol": 1}
            ]
        }'::jsonb,
        '{
            "allWords": ["MARIE", "CURIE", "POLONIA", "NOBEL", "RADIO", "POLONIO", "PARIS", "SORBONA", "CIENCIA", "FÍSICA"]
        }'::jsonb,
        'beginner', 100, 70,
        10, 10, 1,
        ARRAY[
            'Pista 1: Busca primero las palabras más largas',
            'Pista 2: Recuerda revisar diagonal'
        ]::text[],
        true, 15,
        ARRAY['pistas', 'vision_lectora']::gamification_system.comodin_type[],
        '{
            "pistas": {"enabled": true, "cost": 15},
            "vision_lectora": {"enabled": true, "cost": 25}
        }'::jsonb,
        100, 20,
        true, 1
    ) ON CONFLICT (module_id, exercise_type, order_index) DO UPDATE SET
        content = EXCLUDED.content,
        solution = EXCLUDED.solution,
        updated_at = NOW();

    -- Update module total_exercises
    UPDATE educational_content.modules
    SET
        total_exercises = 5,
        metadata = jsonb_set(
            COALESCE(metadata, '{}'::jsonb),
            '{exercises_loaded}',
            'true'::jsonb
        ),
        updated_at = NOW()
    WHERE id = mod_id;

    RAISE NOTICE '✅ Módulo 1 (MOD-01-LITERAL): 5 ejercicios cargados exitosamente [PRODUCTION]';
    RAISE NOTICE '   - Crucigrama Científico';
    RAISE NOTICE '   - Línea de Tiempo';
    RAISE NOTICE '   - Completar Espacios en Blanco';
    RAISE NOTICE '   - Verdadero o Falso';
    RAISE NOTICE '   - Sopa de Letras (BONUS)';
END $$;
