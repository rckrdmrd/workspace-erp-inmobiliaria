-- =====================================================
-- Seed Data: Exercises Module 2 - Comprensión Inferencial (PRODUCTION)
-- =====================================================
-- Description: Ejercicios interactivos del Módulo (PRODUCTION) 2
-- Module: MOD-02-INFERENCIAL
-- Exercises: Detective Textual, Construcción Hipótesis, Predicción, Puzzle, Rueda Inferencias
-- Created by: SA-SEEDS-EDUCATIONAL
-- Date: 2025-11-11
-- Status: PRODUCTION
-- =====================================================

SET search_path TO educational_content, public;

DO $$
DECLARE
    mod_id UUID;
BEGIN
    SELECT id INTO mod_id FROM educational_content.modules WHERE module_code = 'MOD-02-INFERENCIAL';

    IF mod_id IS NULL THEN
        RAISE EXCEPTION 'Módulo MOD-02-INFERENCIAL no encontrado';
    END IF;

    -- ========================================================================
    -- EXERCISE 2.1: DETECTIVE TEXTUAL
    -- ========================================================================
    INSERT INTO educational_content.exercises (
        module_id, title, subtitle, description, instructions,
        objective, how_to_solve, recommended_strategy, pedagogical_notes,
        exercise_type, order_index,
        config, content, solution,
        difficulty_level, max_points, passing_score,
        estimated_time_minutes, time_limit_minutes, max_attempts,
        hints, enable_hints, hint_cost_ml_coins,
        xp_reward, ml_coins_reward,
        is_active, version
    ) VALUES (
        mod_id,
        'Detective Textual: El Misterio de la Radiación',
        'Encuentra Evidencias Implícitas',
        'Analiza el texto sobre Marie Curie para encontrar información que no está escrita directamente pero que puedes deducir del contexto.',
        'Lee cuidadosamente el pasaje y responde las preguntas basándote en las pistas implícitas del texto.',
        E'Desarrollar la competencia de comprensión inferencial (Nivel 2 del modelo de Cassany) mediante el análisis de textos sobre Marie Curie para identificar información implícita que no está explícitamente mencionada. Este ejercicio entrena la capacidad de "leer entre líneas" deduciendo causas, efectos, motivaciones y contextos a partir de pistas textuales indirectas.\n\nLos estudiantes aprenderán a:\n- Inferir causas y efectos de eventos históricos a partir de descripciones indirectas\n- Deducir información sobre condiciones ambientales, protocolos de seguridad y prácticas científicas de la época\n- Identificar relaciones causa-efecto entre exposición a materiales peligrosos y síntomas de salud\n- Reconocer motivaciones personales implícitas en las acciones de personajes históricos\n- Diferenciar entre hechos explícitos e inferencias razonables basadas en evidencia contextual\n\nEste tipo de comprensión es fundamental para el pensamiento crítico científico, donde frecuentemente debemos deducir conclusiones a partir de observaciones indirectas y evidencia circunstancial. El ejercicio simula el proceso de investigación científica donde las respuestas no son obvias y requieren análisis cuidadoso del contexto.',
        E'Estrategia de resolución paso a paso:\n\n1. LECTURA COMPLETA INICIAL (2-3 min):\n   - Leer el pasaje completo sin saltar a las preguntas\n   - Identificar el contexto histórico y temporal (época de Marie Curie: finales s.XIX - principios s.XX)\n   - Observar detalles aparentemente insignificantes (brillos, síntomas, prácticas laborales)\n\n2. IDENTIFICACIÓN DE PISTAS CONTEXTUALES (por pregunta):\n   - Releer la porción relevante del texto para cada pregunta\n   - Subrayar mentalmente palabras clave: "mal ventilado", "en los bolsillos", "brillaban", "fatigada"\n   - Preguntarse: ¿Qué información NO dice el texto directamente pero puedo deducir?\n\n3. ANÁLISIS DE CADA PREGUNTA:\n   - Tipo "Causa-Efecto": Buscar conexiones lógicas (radiación → objetos brillan)\n   - Tipo "Contexto Situacional": Evaluar normas de seguridad de la época vs. prácticas descritas\n   - Tipo "Motivación": Identificar declaraciones que revelen valores o intenciones personales\n\n4. EVALUACIÓN DE OPCIONES:\n   - Descartar respuestas que requieran información externa no presente en el texto\n   - Eliminar opciones anacrónicas (ej: "estándares modernos" en contexto del s.XIX)\n   - Seleccionar la respuesta que mejor conecte las pistas textuales con conocimiento general razonable\n\n5. VALIDACIÓN DE RESPUESTA:\n   - Verificar que la inferencia esté APOYADA por evidencia textual específica\n   - Confirmar que la conclusión sea lógica y no especulativa\n   - Usar las pistas proporcionadas si tienes dudas (15 ML Coins c/u)',
        E'Tips para hacer inferencias correctas:\n\n- BUSCAR PISTAS CONTEXTUALES: Palabras como "mal ventilado", "sin protección", "a pesar de" son señales de condiciones o problemas implícitos\n- APLICAR CONOCIMIENTO GENERAL: Combinar información del texto con conocimiento histórico básico (ej: en 1900 no se conocían los peligros de la radiación)\n- EVITAR SOBRE-INTERPRETACIÓN: Las inferencias deben estar razonablemente apoyadas por el texto, no ser especulaciones creativas\n- PENSAR CAUSA-EFECTO: Muchas inferencias se basan en relaciones de causalidad (exposición a radiación → síntomas de salud)\n- CONSIDERAR LA ÉPOCA: Juzgar las prácticas según los estándares de la época de Marie, no los actuales\n- LEER LAS EXPLICACIONES: Después de responder, revisar las explicaciones correctas para mejorar tu técnica inferencial\n\nEl comodín "Visión Lectora" (25 ML Coins) puede ayudarte resaltando las oraciones clave del pasaje para cada pregunta.',
        E'Este ejercicio desarrolla la competencia de comprensión inferencial (Nivel 2 de Cassany), esencial para el pensamiento científico y la alfabetización académica. A diferencia de la comprensión literal que identifica información explícita, la comprensión inferencial requiere que los estudiantes construyan significado a partir de pistas implícitas.\n\nAlineación con modelo de Cassany:\n- Trasciende la identificación de hechos superficiales\n- Requiere activación de conocimiento previo (contexto histórico del s.XIX-XX)\n- Desarrolla conexiones lógicas entre evidencia textual y conclusiones razonables\n- Practica pensamiento deductivo fundamental para ciencias\n\nDificultad: Intermedia (CEFR: B1). Apropiada para estudiantes que dominan comprensión literal y están listos para analizar textos en profundidad. El contexto histórico de Marie Curie facilita inferencias porque combina narrativa humana accesible con conceptos científicos concretos.\n\nLos 4 tipos de inferencia cubiertos (causa-efecto, contexto situacional, síntomas-exposición, motivación) representan habilidades transferibles a cualquier tipo de texto académico o científico.',
        'detective_textual', 1,
        '{
            "showHints": true,
            "timePerQuestion": 90,
            "allowReview": true
        }'::jsonb,
        '{
            "passage": "Marie Curie trabajaba largas horas en un laboratorio mal ventilado, rodeada de materiales radiactivos. A menudo llevaba tubos de ensayo con radio en los bolsillos de su bata de trabajo. Sus cuadernos de investigación brillaban misteriosamente en la oscuridad de la noche. A pesar de sentirse frecuentemente fatigada y con dolores, Marie continuaba su investigación sin descanso, convencida de que su trabajo beneficiaría a la humanidad.",
            "questions": [
                {
                    "id": "q1",
                    "question": "¿Por qué los cuadernos de Marie brillaban en la oscuridad?",
                    "options": [
                        "Usaba tinta especial fluorescente para escribir",
                        "Estaban contaminados con material radiactivo",
                        "Los escribía con lápiz luminoso importado",
                        "Era un efecto óptico de la luz de la luna"
                    ],
                    "correctAnswer": 1,
                    "explanation": "La radiación del radio con el que trabajaba constantemente contaminó sus cuadernos, haciéndolos radioactivos y, por tanto, luminiscentes.",
                    "inference_type": "causa_efecto"
                },
                {
                    "id": "q2",
                    "question": "¿Qué podemos inferir sobre las condiciones de seguridad en su laboratorio?",
                    "options": [
                        "Eran excelentes y seguían protocolos estrictos",
                        "Eran inadecuadas y peligrosas para la salud",
                        "Cumplían con los estándares modernos de seguridad",
                        "No trabajaba con materiales peligrosos realmente"
                    ],
                    "correctAnswer": 1,
                    "explanation": "Llevar material radiactivo en los bolsillos y trabajar en un lugar mal ventilado indica una total falta de protocolos de seguridad adecuados.",
                    "inference_type": "contexto_situacional"
                },
                {
                    "id": "q3",
                    "question": "¿Qué sugiere el texto sobre la relación entre sus síntomas físicos y su trabajo?",
                    "options": [
                        "Sus síntomas no tenían relación con su investigación",
                        "La fatiga y dolores probablemente eran causados por la exposición a radiación",
                        "Sufría de enfermedades comunes no relacionadas",
                        "Los síntomas eran psicosomáticos por estrés"
                    ],
                    "correctAnswer": 1,
                    "explanation": "La conexión entre trabajar con materiales radiactivos sin protección y experimentar fatiga y dolores sugiere fuertemente que la radiación estaba afectando su salud.",
                    "inference_type": "causa_efecto"
                },
                {
                    "id": "q4",
                    "question": "¿Qué motivación impulsaba a Marie a continuar trabajando a pesar de sus malestares?",
                    "options": [
                        "El deseo de ganar fama y reconocimiento personal",
                        "La convicción de que su trabajo ayudaría a la humanidad",
                        "La presión de su esposo Pierre",
                        "La necesidad económica de su familia"
                    ],
                    "correctAnswer": 1,
                    "explanation": "El texto menciona explícitamente que Marie continuaba su trabajo convencida de que beneficiaría a la humanidad, mostrando su motivación altruista.",
                    "inference_type": "motivacion"
                }
            ]
        }'::jsonb,
        '{
            "correctAnswers": {
                "q1": "1",
                "q2": "1",
                "q3": "1",
                "q4": "1"
            },
            "totalQuestions": 4
        }'::jsonb,
        'intermediate', 100, 75,
        25, 35, 3,
        ARRAY[
            'Piensa en cómo los materiales radiactivos pueden contaminar objetos',
            'En esa época no se conocían bien los riesgos de la radiación',
            'Las motivaciones de Marie eran principalmente científicas y humanitarias'
        ]::text[],
        true, 15,
        100, 20,
        true, 1
    ) ON CONFLICT (module_id, exercise_type, order_index) DO UPDATE SET
        content = EXCLUDED.content,
        updated_at = NOW();

    -- ========================================================================
    -- EXERCISE 2.2: RELACIONES CAUSA-EFECTO (DRAG & DROP)
    -- ========================================================================
    INSERT INTO educational_content.exercises (
        module_id, title, subtitle, description, instructions,
        objective, how_to_solve, recommended_strategy, pedagogical_notes,
        exercise_type, order_index,
        config, content, solution,
        difficulty_level, max_points, passing_score,
        estimated_time_minutes, max_attempts,
        hints, enable_hints, hint_cost_ml_coins,
        xp_reward, ml_coins_reward,
        is_active, version
    ) VALUES (
        mod_id,
        'Relaciones Causa-Efecto sobre Marie Curie',
        'Conectando Causas con sus Consecuencias',
        'Conecta causas con sus consecuencias lógicas sobre decisiones y eventos de la vida de Marie Curie.',
        'Lee la CAUSA en la columna izquierda y arrastra las CONSECUENCIAS correctas desde la derecha. Cada causa puede tener 1-3 consecuencias. Piensa en efectos inmediatos, efectos a largo plazo e impacto en otros.',
        E'Desarrollar la capacidad de pensamiento causal y razonamiento hipotético mediante el análisis de relaciones causa-efecto en eventos históricos de la vida de Marie Curie. Este ejercicio fortalece la comprensión inferencial al requerir que los estudiantes deduzcan las consecuencias lógicas de decisiones y acciones específicas.\n\nLos estudiantes aprenderán a:\n- Identificar relaciones causales directas e indirectas entre eventos históricos\n- Diferenciar entre efectos inmediatos, efectos a largo plazo e impacto en terceros\n- Evaluar múltiples consecuencias derivadas de una sola causa\n- Distinguir consecuencias razonables de correlaciones espurias o irrelevantes\n- Aplicar razonamiento lógico para conectar decisiones con sus resultados observables\n- Desarrollar pensamiento contrafactual ("¿qué hubiera pasado si...?")\n\nEl formato de emparejamiento múltiple (drag & drop) refleja la realidad de que las decisiones históricas rara vez tienen una sola consecuencia, sino que generan cadenas causales complejas. Esta mecánica también entrena la habilidad científica de identificar variables dependientes resultantes de variables independientes.',
        E'Metodología de análisis causal paso a paso:\n\n1. LECTURA Y COMPRENSIÓN DE LA CAUSA (1-2 min):\n   - Leer cuidadosamente el enunciado de la causa\n   - Identificar quién tomó la decisión, qué hizo exactamente, y cuándo\n   - Considerar el contexto histórico y social de la época\n\n2. LECTURA DE TODAS LAS CONSECUENCIAS DISPONIBLES (2 min):\n   - Revisar todas las opciones de consecuencias antes de emparejar\n   - Clasificarlas mentalmente en:\n     * Efectos inmediatos (corto plazo: días/meses)\n     * Efectos a largo plazo (años/décadas)\n     * Impacto en la propia persona vs. impacto en otros\n\n3. APLICACIÓN DE CRITERIOS DE CAUSALIDAD:\n   Para cada consecuencia, preguntarse:\n   - ¿Esta consecuencia es resultado LÓGICO de la causa? (no solo correlación temporal)\n   - ¿Es históricamente verificable o razonable?\n   - ¿La causa es NECESARIA para que ocurra esta consecuencia?\n\n4. PROCESO DE EMPAREJAMIENTO:\n   - Empezar con las consecuencias más obvias y directas\n   - Buscar al menos 1-3 consecuencias por cada causa (según instrucciones)\n   - Descartar "distractores" (consecuencias no relacionadas causalmente)\n   - Verificar coherencia temporal (la causa debe preceder al efecto)\n\n5. REVISIÓN Y VALIDACIÓN:\n   - Asegurar que cada causa tenga el número esperado de consecuencias\n   - Verificar que no haya consecuencias huérfanas (sin causa asignada cuando deberían tenerla)\n   - Usar feedback inmediato del sistema para aprender de errores',
        E'Estrategias para identificar relaciones causa-efecto correctas:\n\n- PENSAR EN ESCALAS TEMPORALES: Las causas pueden tener efectos inmediatos (ej: "no patentar" → "no obtener riquezas") y efectos demorados (ej: "no patentar" → "medicina avanzó más rápido")\n- CONSIDERAR MÚLTIPLES DOMINIOS: Una decisión científica puede tener consecuencias económicas, sociales, académicas y personales simultáneamente\n- EVITAR CORRELACIÓN ≠ CAUSALIDAD: Que dos eventos ocurran cerca en el tiempo no significa que uno causó al otro\n- BUSCAR MECANISMOS EXPLICATIVOS: La mejor forma de confirmar causalidad es identificar el "cómo" (ej: no patentar → información libre → otros científicos investigan → medicina avanza)\n- USAR CONOCIMIENTO HISTÓRICO: El contexto de la época ayuda a evaluar qué consecuencias eran posibles o probables\n- APRENDER DEL FEEDBACK: El sistema indica emparejamientos correctos/incorrectos; analiza por qué para mejorar tu razonamiento causal\n\nRecuerda: una causa bien fundamentada puede tener 1, 2 o 3 consecuencias legítimas. No fuerces emparejamientos solo para completar un número.',
        E'Este ejercicio desarrolla pensamiento causal complejo, una habilidad fundamental del razonamiento científico e histórico. Se alinea con el Nivel 2 (comprensión inferencial) del modelo de Cassany al requerir que los estudiantes vayan más allá de información explícita y construyan conexiones lógicas entre eventos.\n\nHabilidades cognitivas desarrolladas:\n- Razonamiento hipotético-deductivo (fundamental para ciencias)\n- Análisis de sistemas complejos con múltiples variables interdependientes\n- Pensamiento contrafactual (evaluar escenarios alternativos)\n- Evaluación crítica de evidencia histórica\n\nDificultad: Intermedia (CEFR: B1-B2). Apropiada porque:\n- Las causas son eventos históricos concretos y verificables\n- Las consecuencias están formuladas claramente\n- El contexto de Marie Curie es familiar tras completar Módulo 1\n- El formato drag-and-drop reduce carga cognitiva al eliminar escritura libre\n\nEste tipo de ejercicio es especialmente valioso para estudiantes de ciencias, donde constantemente deben identificar relaciones causales entre variables experimentales y resultados observados. La mecánica de "una causa → múltiples efectos" refleja la realidad de fenómenos científicos complejos.',
        'construccion_hipotesis', 2,
        '{
            "allowMultiple": true,
            "showFeedback": true,
            "dragAndDrop": true
        }'::jsonb,
        '{
            "causes": [
                {
                    "id": "c1",
                    "text": "Marie decidió no patentar el proceso de aislamiento del radio"
                },
                {
                    "id": "c2",
                    "text": "Marie continuó trabajando después de la muerte de Pierre"
                }
            ],
            "consequences": [
                {
                    "id": "e1",
                    "text": "Otros científicos pudieron continuar la investigación",
                    "correctCauseIds": ["c1"]
                },
                {
                    "id": "e2",
                    "text": "No obtuvo riquezas de su descubrimiento",
                    "correctCauseIds": ["c1"]
                },
                {
                    "id": "e3",
                    "text": "La medicina avanzó más rápidamente",
                    "correctCauseIds": ["c1"]
                },
                {
                    "id": "e4",
                    "text": "Demostró su independencia científica",
                    "correctCauseIds": []
                },
                {
                    "id": "e5",
                    "text": "Completó investigaciones pendientes",
                    "correctCauseIds": ["c2"]
                },
                {
                    "id": "e6",
                    "text": "Se convirtió en la primera profesora de la Sorbona",
                    "correctCauseIds": ["c2"]
                }
            ]
        }'::jsonb,
        '{
            "causes": {
                "c1": ["e1", "e2", "e3"],
                "c2": ["e5", "e6"]
            }
        }'::jsonb,
        'intermediate', 100, 70,
        20, 20,
        ARRAY[
            'Lee cada causa cuidadosamente antes de seleccionar las consecuencias',
            'Una causa puede tener múltiples efectos: inmediatos, a largo plazo y en otros',
            'No todas las consecuencias pertenecen a todas las causas'
        ]::text[],
        true, 15,
        100, 20,
        true, 1
    ) ON CONFLICT (module_id, exercise_type, order_index) DO UPDATE SET
        content = EXCLUDED.content,
        updated_at = NOW();

    -- ========================================================================
    -- EXERCISE 2.3: PREDICCIÓN NARRATIVA
    -- ========================================================================
    INSERT INTO educational_content.exercises (
        module_id, title, subtitle, description, instructions,
        objective, how_to_solve, recommended_strategy, pedagogical_notes,
        exercise_type, order_index,
        config, content, solution,
        difficulty_level, max_points, passing_score,
        estimated_time_minutes, max_attempts,
        hints, enable_hints, hint_cost_ml_coins,
        xp_reward, ml_coins_reward,
        is_active, version
    ) VALUES (
        mod_id,
        'Predicción Narrativa: ¿Qué Sucederá Después?',
        'Predice Eventos Basándote en el Contexto',
        'Lee escenarios de la vida de Marie Curie y predice qué sucederá después basándote en el contexto histórico y las pistas del texto.',
        'Analiza cada situación y selecciona la predicción más lógica considerando el contexto histórico y las motivaciones de Marie.',
        E'Desarrollar la capacidad de predicción lógica basada en contexto histórico y comprensión de personajes, una habilidad esencial de la comprensión inferencial. Este ejercicio entrena a los estudiantes para anticipar eventos futuros no mencionados explícitamente en el texto mediante la integración de:\n\n1. Información contextual (época histórica, normas sociales)\n2. Rasgos de personalidad del personaje histórico\n3. Hechos históricos verificables\n4. Patrones lógicos de comportamiento humano\n\nLos estudiantes aprenderán a:\n- Predecir continuaciones narrativas coherentes con el contexto histórico\n- Identificar y descartar opciones anacrónicas (eventos imposibles para la época)\n- Evaluar la coherencia entre personalidad del personaje y acciones predichas\n- Diferenciar entre deseos modernos y realidades históricas\n- Usar evidencia contextual para fundamentar predicciones lógicas\n- Reconocer el papel de factores sociales (discriminación de género, normas de época) en resultados históricos\n\nEsta habilidad es fundamental para la comprensión profunda de textos históricos, narrativos y científicos, donde frecuentemente debemos inferir eventos no explícitamente mencionados.',
        E'Metodología de predicción narrativa basada en contexto:\n\n1. LECTURA DEL CONTEXTO HISTÓRICO (2-3 min):\n   - Identificar la época exacta (año, siglo) y ubicación\n   - Reconocer normas sociales de la época (ej: discriminación de género en instituciones científicas del s.XX)\n   - Comprender el estado del personaje en ese momento (ej: viuda, ya ganadora del Nobel, científica reconocida)\n\n2. ANÁLISIS DEL INICIO NARRATIVO (1 min):\n   - Leer el fragmento incompleto cuidadosamente\n   - Identificar:\n     * ¿Qué está a punto de suceder?\n     * ¿Quiénes están involucrados?\n     * ¿Cuál es la situación crítica?\n   - Determinar qué tipo de desenlace sería coherente\n\n3. EVALUACIÓN DE OPCIONES (3-4 min por escenario):\n   Para cada predicción, aplicar 4 filtros:\n\n   FILTRO 1 - Coherencia Temporal:\n   - ¿Es posible para la época? (eliminar anacronismos)\n   - Ejemplo: "elegida presidenta" en 1911 es anacrónico (la Academia no aceptó mujeres hasta 1979)\n\n   FILTRO 2 - Coherencia con Personalidad:\n   - ¿Corresponde con lo que sabemos del personaje?\n   - Marie era perseverante → probablemente NO retiraría su candidatura\n   - Marie era modesta → probablemente NO buscaría honores excesivos\n\n   FILTRO 3 - Plausibilidad Histórica:\n   - ¿Qué dicen los hechos históricos verificables?\n   - Considerar prejuicios sociales de la época\n   - La Academia Francesa era profundamente conservadora\n\n   FILTRO 4 - Lógica Narrativa:\n   - ¿Cuál desenlace es más coherente con la tensión establecida?\n   - El texto menciona sus logros excepcionales Y su condición de mujer → sugiere conflicto entre mérito y prejuicio\n\n4. SELECCIÓN Y VALIDACIÓN:\n   - Elegir la opción que pase los 4 filtros\n   - Leer la explicación proporcionada para confirmar razonamiento\n   - Aprender de predicciones incorrectas analizando qué filtro falló',
        E'Estrategias para predecir correctamente:\n\n- PENSAR COMO HISTORIADOR, NO COMO IDEALISTA: Predice lo que PROBABLEMENTE sucedió según las normas de la época, no lo que DEBERÍA haber sucedido según valores modernos\n- USAR PISTAS CONTEXTUALES EXPLÍCITAS: Si el texto menciona "prejuicios de género" o "instituciones conservadoras", esa información es clave para predecir el desenlace\n- CONOCER AL PERSONAJE: La personalidad de Marie (perseverante, modesta, dedicada a la ciencia) debe ser consistente con la predicción elegida\n- DETECTAR ANACRONISMOS: Opciones con lenguaje moderno, conceptos anacrónicos o tecnologías inexistentes son pistas de respuestas incorrectas\n- VERIFICAR HECHOS HISTÓRICOS: Si conoces el evento histórico real, úsalo; si no, deduce basándote en contexto\n- CONSIDERAR MÚLTIPLES FACTORES: Los eventos históricos suelen ser resultado de varios factores combinados (mérito científico + prejuicios sociales + política institucional)\n\nLas pistas contextuales (disponibles por 15 ML Coins) te ayudan identificando los factores históricos más relevantes para cada predicción.',
        E'Este ejercicio desarrolla comprensión inferencial predictiva, una habilidad crítica del modelo de Cassany (Nivel 2). A diferencia de ejercicios que piden identificar información pasada implícita, este requiere proyectar eventos futuros no mencionados usando:\n\n- Conocimiento del mundo (normas sociales, contextos históricos)\n- Comprensión profunda de personajes (motivaciones, personalidad, valores)\n- Razonamiento lógico temporal (causas preceden efectos)\n\nHabilidades cognitivas desarrolladas:\n- Anticipación y razonamiento prospectivo\n- Integración de múltiples fuentes de información (texto + contexto histórico + psicología del personaje)\n- Evaluación crítica de plausibilidad\n- Pensamiento contrafactual controlado (considerar posibilidades, pero limitadas por realidad histórica)\n\nDificultad: Intermedia-Avanzada (CEFR: B1-B2). Requiere:\n- Conocimiento cultural e histórico básico (instituciones del s.XX, discriminación de género)\n- Capacidad de distinguir perspectivas modernas vs. históricas\n- Integración de múltiples factores simultáneos\n\nEste ejercicio es especialmente valioso porque combina comprensión lectora con pensamiento histórico y empatía cultural, preparando estudiantes para analizar textos complejos en contextos académicos y profesionales donde deben anticipar consecuencias basándose en información incompleta.',
        'prediccion_narrativa', 3,
        '{
            "showContext": true,
            "allowExplanations": true
        }'::jsonb,
        '{
            "scenarios": [
                {
                    "id": "pred-1",
                    "context": "Año 1911. Marie Curie ya ha ganado el Premio Nobel de Física (1903) junto a Pierre Curie y Henri Becquerel por sus investigaciones sobre la radiactividad. Ahora, siendo viuda desde 1906, ha continuado sus investigaciones y ha aislado el radio puro, un logro científico extraordinario.",
                    "beginning": "Cuando Marie presentó su candidatura a la Academia de Ciencias Francesa en 1911, siendo ya ganadora del Nobel...",
                    "question": "¿Cómo continúa más probablemente?",
                    "predictions": [
                        {
                            "id": "p1",
                            "text": "fue aceptada inmediatamente con honores",
                            "isCorrect": false,
                            "explanation": "Aunque Marie tenía méritos excepcionales, la Academia Francesa era una institución profundamente conservadora que nunca había admitido mujeres en sus más de 200 años de historia."
                        },
                        {
                            "id": "p2",
                            "text": "fue rechazada por ser mujer, a pesar de sus logros",
                            "isCorrect": true,
                            "explanation": "Correcto. A pesar de sus extraordinarios logros científicos, Marie fue rechazada por la Academia de Ciencias Francesa en 1911 por un voto (30-28). Los prejuicios de género de la época pesaron más que sus méritos. Irónicamente, ese mismo año ganó su segundo Nobel, esta vez en Química, convirtiéndose en la primera persona en ganar dos premios Nobel."
                        },
                        {
                            "id": "p3",
                            "text": "decidió retirar su candidatura",
                            "isCorrect": false,
                            "explanation": "Marie no era de las que se rendían ante obstáculos. Su determinación y convicción en su trabajo científico la llevaron a mantener su candidatura hasta el final, a pesar de la oposición."
                        },
                        {
                            "id": "p4",
                            "text": "fue elegida presidenta de la Academia",
                            "isCorrect": false,
                            "explanation": "Este escenario es completamente anacrónico. No solo no fue aceptada, sino que la Academia no admitiría a su primera mujer hasta 1979, décadas después de la muerte de Marie."
                        }
                    ],
                    "contextualHint": "Considera los prejuicios de género de la época. Recuerda que Marie era perseverante pero modesta, y que los hechos históricos no se pueden cambiar."
                }
            ]
        }'::jsonb,
        '{
            "scenarios": {
                "pred-1": "p2"
            }
        }'::jsonb,
        'intermediate', 100, 70,
        15, 3,
        ARRAY[
            'Recuerda el contexto de discriminación de género de la época - las instituciones científicas eran profundamente conservadoras',
            'Marie era perseverante pero modesta - enfrentó muchos rechazos pero nunca se rindió',
            'Los hechos históricos no se pueden cambiar - considera qué realmente sucedió en 1911'
        ]::text[],
        true, 15,
        100, 20,
        true, 1
    ) ON CONFLICT (module_id, exercise_type, order_index) DO UPDATE SET
        content = EXCLUDED.content,
        updated_at = NOW();

    -- ========================================================================
    -- EXERCISE 2.4: PUZZLE DE CONTEXTO
    -- ========================================================================
    INSERT INTO educational_content.exercises (
        module_id, title, subtitle, description, instructions,
        objective, how_to_solve, recommended_strategy, pedagogical_notes,
        exercise_type, order_index,
        config, content, solution,
        difficulty_level, max_points, passing_score,
        estimated_time_minutes, max_attempts,
        hints, enable_hints, hint_cost_ml_coins,
        xp_reward, ml_coins_reward,
        is_active, version
    ) VALUES (
        mod_id,
        'Puzzle de Contexto',
        'Ordenar fragmentos para crear una inferencia coherente',
        'Ordena los fragmentos para formar una inferencia completa y coherente sobre Marie Curie.',
        'Arrastra los fragmentos desordenados al área de construcción para formar la inferencia en el orden correcto.',
        E'Desarrollar la capacidad de comprensión sintáctica y construcción lógica de inferencias mediante el ordenamiento coherente de fragmentos textuales. Este ejercicio entrena habilidades fundamentales de comprensión inferencial:\n\n1. Análisis de relaciones sintácticas entre fragmentos (conectores, pronombres relativos, subordinación)\n2. Reconocimiento de progresión lógica de ideas (contexto → acción → resultado)\n3. Identificación de dependencias gramaticales (qué fragmentos requieren otros para ser gramaticalmente correctos)\n4. Construcción de significado a partir de elementos dispersos\n\nLos estudiantes aprenderán a:\n- Identificar fragmentos de inicio (introducen contexto o premisas)\n- Reconocer fragmentos de transición (conectan ideas mediante pronombres relativos o conjunciones)\n- Detectar fragmentos de conclusión (expresan resultados o consecuencias)\n- Evaluar coherencia gramatical (concordancia, uso correcto de conectores)\n- Construir inferencias completas y bien estructuradas a partir de información fragmentada\n- Comprender cómo el orden de las palabras afecta el significado\n\nEsta habilidad es esencial para la comprensión profunda de textos complejos, donde las ideas no siempre se presentan en orden lineal y el lector debe reconstruir argumentos a partir de información dispersa.',
        E'Estrategia paso a paso para ordenar fragmentos:\n\n1. LECTURA COMPLETA DE TODOS LOS FRAGMENTOS (1-2 min):\n   - Leer cada fragmento individualmente sin intentar ordenarlos todavía\n   - Identificar el tema general (en este caso: logros de Marie Curie a pesar de obstáculos)\n   - Observar palabras clave en cada fragmento\n\n2. IDENTIFICACIÓN DE TIPOS DE FRAGMENTOS (2 min):\n   \n   FRAGMENTO DE INICIO (usualmente empieza con conectores como "A pesar de", "Aunque", "Si bien"):\n   - Introduce el contexto o premisa inicial\n   - Ejemplo: "A pesar de las barreras sociales y económicas"\n   \n   FRAGMENTOS DE DESARROLLO (contienen pronombres relativos "que", "quien", "cuyo"):\n   - Dependen gramaticalmente de fragmentos previos\n   - Ejemplo: "que enfrentó como mujer inmigrante" (el "que" requiere un antecedente)\n   \n   FRAGMENTO DE ACCIÓN/TRANSICIÓN (verbos principales):\n   - Expresan la acción principal del sujeto\n   - Ejemplo: "demostró una determinación extraordinaria"\n   \n   FRAGMENTO DE CONCLUSIÓN (gerundios de resultado: "convirtiéndose", "logrando"):\n   - Expresan consecuencia o resultado final\n   - Ejemplo: "convirtiéndose en pionera de la ciencia moderna"\n\n3. APLICACIÓN DE REGLAS GRAMATICALES:\n   - Pronombres relativos ("que", "quien") DEBEN seguir inmediatamente a su antecedente\n   - Conectores adversativos ("A pesar de", "Aunque") generalmente inician la oración\n   - Gerundios de consecuencia ("convirtiéndose", "logrando") generalmente van al final\n\n4. CONSTRUCCIÓN Y VALIDACIÓN:\n   - Ensamblar fragmentos siguiendo la lógica: Contexto → Especificación → Acción → Resultado\n   - Leer la oración completa en voz alta (mentalmente) para verificar fluidez\n   - Confirmar coherencia semántica (¿tiene sentido la inferencia completa?)\n   - Verificar concordancia gramatical (género, número, tiempos verbales)',
        E'Tips para ordenar fragmentos correctamente:\n\n- BUSCAR CONECTORES EXPLÍCITOS: Palabras como "A pesar de", "aunque", "sin embargo" generalmente marcan el inicio de la oración\n- IDENTIFICAR DEPENDENCIAS GRAMATICALES: Fragmentos con "que" relativo REQUIEREN un antecedente inmediatamente antes\n- SEGUIR LA ESTRUCTURA LÓGICA: Contexto (obstáculos) → Acción (cómo respondió) → Resultado (qué logró)\n- VERIFICAR CONCORDANCIA: El sujeto implícito debe ser consistente en todos los fragmentos (Marie Curie)\n- LEER EN VOZ ALTA: Una vez ordenados, la oración debe sonar natural y fluida\n- BUSCAR PISTAS SINTÁCTICAS: Comas, gerundios, pronombres relativos indican relaciones entre fragmentos\n- PENSAR EN PROGRESIÓN NARRATIVA: Las buenas inferencias siguen una progresión lógica (problema → respuesta → resultado)\n\nSi tienes dudas, el comodín "Visión Lectora" (25 ML Coins) puede resaltar los conectores clave en cada fragmento.',
        E'Este ejercicio desarrolla dos competencias simultáneas del modelo de Cassany:\n\n1. COMPETENCIA SINTÁCTICA (comprensión de estructuras gramaticales complejas):\n   - Reconocimiento de subordinación y coordinación\n   - Uso correcto de pronombres relativos y conectores\n   - Comprensión de cómo el orden sintáctico afecta el significado\n\n2. COMPETENCIA INFERENCIAL (construcción de significado no explícito):\n   - La inferencia completa expresa una idea que trasciende la suma de fragmentos\n   - Requiere comprender la relación lógica entre obstáculos y logros\n   - Desarrolla la capacidad de reconstruir argumentos complejos\n\nDificultad: Intermedia (CEFR: B1). Apropiada porque:\n- Los fragmentos son gramaticalmente complejos pero no excesivamente técnicos\n- Requiere conocimiento de conectores y pronombres relativos del español\n- El tema (logros de Marie) es familiar tras ejercicios previos\n- La mecánica drag-and-drop reduce carga cognitiva (no hay escritura libre)\n\nEste tipo de ejercicio es especialmente valioso para:\n- Estudiantes que aprenden español como L2 (refuerza sintaxis)\n- Preparación para lectura académica (textos científicos usan estructuras complejas)\n- Desarrollo de habilidades de síntesis (reconstruir argumentos a partir de información fragmentada)\n\nLa habilidad de ordenar fragmentos lógicamente es transferible a contextos académicos donde los estudiantes deben organizar ideas para escribir ensayos, reportes o análisis estructurados.',
        'puzzle_contexto', 4,
        '{
            "dragAndDrop": true,
            "allowReordering": true,
            "showValidation": "onComplete"
        }'::jsonb,
        '{
            "completeInference": "A pesar de las barreras sociales y económicas que enfrentó como mujer inmigrante, demostró una determinación extraordinaria, convirtiéndose en pionera de la ciencia moderna.",
            "fragments": [
                {
                    "id": "frag-a",
                    "label": "A",
                    "text": "demostró una determinación extraordinaria",
                    "correctPosition": 2
                },
                {
                    "id": "frag-b",
                    "label": "B",
                    "text": "A pesar de las barreras sociales y económicas",
                    "correctPosition": 0
                },
                {
                    "id": "frag-c",
                    "label": "C",
                    "text": "que enfrentó como mujer inmigrante",
                    "correctPosition": 1
                },
                {
                    "id": "frag-d",
                    "label": "D",
                    "text": "convirtiéndose en pionera de la ciencia moderna",
                    "correctPosition": 3
                }
            ]
        }'::jsonb,
        '{
            "correctAnswers": {
                "frag-b": "0",
                "frag-c": "1",
                "frag-a": "2",
                "frag-d": "3"
            }
        }'::jsonb,
        'intermediate', 100, 70,
        15, 3,
        ARRAY[
            'Lee todos los fragmentos antes de empezar a ordenarlos',
            'Busca conectores lógicos entre fragmentos (aunque, que, por lo tanto)',
            'La inferencia debe tener coherencia gramatical y sentido completo'
        ]::text[],
        true, 15,
        100, 20,
        true, 1
    ) ON CONFLICT (module_id, exercise_type, order_index) DO UPDATE SET
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        description = EXCLUDED.description,
        instructions = EXCLUDED.instructions,
        content = EXCLUDED.content,
        solution = EXCLUDED.solution,
        hints = EXCLUDED.hints,
        estimated_time_minutes = EXCLUDED.estimated_time_minutes,
        max_attempts = EXCLUDED.max_attempts,
        updated_at = NOW();

    -- ========================================================================
    -- EXERCISE 2.5: RUEDA DE INFERENCIAS
    -- ========================================================================
    INSERT INTO educational_content.exercises (
        module_id, title, subtitle, description, instructions,
        objective, how_to_solve, recommended_strategy, pedagogical_notes,
        exercise_type, order_index,
        config, content, solution,
        difficulty_level, max_points, passing_score,
        estimated_time_minutes, max_attempts,
        hints, enable_hints, hint_cost_ml_coins,
        xp_reward, ml_coins_reward,
        is_active, version
    ) VALUES (
        mod_id,
        'Rueda de Inferencias: Conectando Ideas',
        'Visualiza las Relaciones entre Causas y Efectos',
        'Crea conexiones entre observaciones directas y las inferencias que podemos hacer sobre la vida de Marie Curie.',
        'Arrastra las inferencias correctas para conectarlas con las observaciones del texto central.',
        E'Desarrollar la capacidad de generar inferencias sofisticadas en múltiples categorías analíticas a partir de observaciones históricas específicas. Este ejercicio de cierre del Módulo 2 integra y consolida todas las habilidades inferenciales previas mediante un formato visual radial que muestra cómo una sola observación puede generar múltiples tipos de inferencias válidas.\n\nLos estudiantes aprenderán a:\n- Diferenciar entre observaciones directas (hechos explícitos) e inferencias (conclusiones deducidas)\n- Clasificar inferencias en 4 categorías principales:\n  * Contexto Histórico: Deducir conocimiento/normas de la época\n  * Causa-Efecto: Conectar acciones con consecuencias\n  * Motivación: Inferir intenciones y valores del personaje\n  * Consecuencias Duraderas: Identificar efectos a largo plazo\n- Distinguir inferencias razonables de juicios de valor injustificados\n- Reconocer la diferencia entre limitaciones de conocimiento histórico vs. irresponsabilidad personal\n- Evaluar múltiples interpretaciones válidas de un mismo hecho histórico\n- Integrar conocimiento científico moderno con contexto histórico sin anacronismos\n\nLa mecánica radial/visual refuerza el concepto pedagógico clave: un solo hecho puede tener múltiples interpretaciones válidas según la lente analítica aplicada.',
        E'Metodología para generar y evaluar inferencias correctas:\n\n1. COMPRENSIÓN DE LA OBSERVACIÓN CENTRAL (2 min):\n   - Leer cuidadosamente el hecho observado (ej: "trabajó con radiación sin protección")\n   - Identificar elementos clave:\n     * ¿Quién? (Marie Curie)\n     * ¿Qué hizo? (trabajó con materiales radiactivos)\n     * ¿Cómo? (sin protección adecuada)\n     * ¿Cuándo? (toda su vida: ~1890s-1934)\n   - Reconocer que es una OBSERVACIÓN (hecho verificable), no una inferencia\n\n2. LECTURA DE TODAS LAS INFERENCIAS PROPUESTAS (3 min):\n   - Revisar las 4-6 opciones antes de conectar\n   - Clasificarlas mentalmente por tipo:\n     * ¿Habla del contexto histórico?\n     * ¿Establece relación causa-efecto?\n     * ¿Infiere motivaciones/valores?\n     * ¿Identifica consecuencias a largo plazo?\n     * ¿Hace juicios de valor sin evidencia?\n\n3. APLICACIÓN DE CRITERIOS DE VALIDACIÓN:\n   Para cada inferencia propuesta, preguntarse:\n\n   CRITERIO 1 - ¿Es DEDUCIBLE lógicamente de la observación?\n   - ✓ Correcto: "No conocía los riesgos" (explicable: en 1900 no se sabía)\n   - ✗ Incorrecto: "Era irresponsable" (juicio de valor no respaldado)\n\n   CRITERIO 2 - ¿Considera el contexto histórico apropiadamente?\n   - ✓ Correcto: "Priorizaba ciencia sobre seguridad" (coherente con valores de la época)\n   - ✗ Incorrecto: "El radio no es peligroso" (contradicho por evidencia científica moderna)\n\n   CRITERIO 3 - ¿Es una INFERENCIA o solo reformula la observación?\n   - Inferencia válida: "Muerte por anemia fue causada por radiación" (conexión causal deducida)\n   - Reformulación: "Trabajó sin cuidado" (solo parafrasea sin agregar significado)\n\n   CRITERIO 4 - ¿Evita anacronismos y juicios modernos?\n   - ✓ Correcto: Reconocer limitaciones de conocimiento de la época\n   - ✗ Incorrecto: Juzgar a Marie con estándares de seguridad del s.XXI\n\n4. CONEXIÓN Y VERIFICACIÓN:\n   - Conectar las inferencias que pasen los 4 criterios\n   - El sistema proporciona feedback inmediato\n   - Leer las explicaciones para entender el razonamiento correcto\n   - Aprender de errores: ¿qué criterio falló en las inferencias incorrectas?',
        E'Estrategias para distinguir inferencias válidas de juicios injustificados:\n\n- DIFERENCIA ENTRE LIMITACIÓN Y FALLO: "No conocía los riesgos" (limitación histórica) ≠ "Era descuidada" (juicio de valor). Siempre preferir explicaciones basadas en contexto.\n- BUSCAR MECANISMOS CAUSALES: Las mejores inferencias explican CÓMO (ej: "radiación → daño médula ósea → anemia aplásica")\n- CONSIDERAR MÚLTIPLES TIPOS: Una observación puede generar inferencias de contexto histórico, causa-efecto, motivación y consecuencias duraderas SIMULTÁNEAMENTE\n- USAR CONOCIMIENTO CIENTÍFICO ACTUAL SIN ANACRONISMOS: Está bien inferir "sus cuadernos son radiactivos 100 años después" (física del radio-226), pero NO "debió usar equipo moderno"\n- EVITAR FALACIAS AFECTIVAS: No inferir intenciones negativas cuando las acciones se explican por conocimiento limitado de la época\n- VERIFICAR CON EVIDENCIA: Cada inferencia debe poder rastrearse lógicamente a la observación central mediante pasos razonables\n\nEl comodín "Pistas" (15 ML Coins) puede ayudarte identificando qué tipo de inferencia estás evaluando (contexto, causa-efecto, motivación, consecuencia).',
        E'Este ejercicio culminante del Módulo 2 sintetiza todas las habilidades de comprensión inferencial desarrolladas en ejercicios previos:\n- Detective Textual: Inferencias de contexto situacional\n- Causa-Efecto: Relaciones causales\n- Predicción Narrativa: Anticipación basada en contexto\n- Puzzle de Contexto: Construcción sintáctica de inferencias\n\nLa mecánica radial enseña un concepto metacognitivo crucial: la MULTIPERSPECTIVIDAD INFERENCIAL. Un solo hecho histórico puede analizarse desde múltiples lentes (histórica, científica, psicológica, ética), y cada lente genera inferencias válidas diferentes.\n\nAlineación con Cassany (Nivel 2 - Comprensión Inferencial):\n- Trasciende completamente la información explícita\n- Requiere integración de conocimiento previo (historia, ciencia, psicología)\n- Desarrolla pensamiento crítico al distinguir inferencias de juicios\n- Practica razonamiento hipotético-deductivo\n\nDificultad: Intermedia-Avanzada (CEFR: B2). Requiere:\n- Conocimiento científico básico (radiactividad, vida media de isótopos)\n- Comprensión de contextos históricos (conocimiento científico del s.XIX-XX)\n- Pensamiento categórico (clasificar inferencias por tipo)\n- Juicio epistémico (distinguir lo deducible de lo especulativo)\n\nEste ejercicio es especialmente valioso porque:\n1. Integra ciencias y humanidades (física nuclear + historia social)\n2. Desarrolla pensamiento no-lineal (una observación → múltiples inferencias)\n3. Refuerza empatía histórica (juzgar acciones en su contexto original)\n4. Prepara para análisis académico avanzado donde múltiples interpretaciones coexisten legítimamente',
        'rueda_inferencias', 5,
        '{
            "wheelAnimation": true,
            "showTimer": true,
            "allowSkip": false
        }'::jsonb,
        '{
            "categories": [
                {
                    "id": "cat-literal",
                    "name": "Literal",
                    "description": "Información directa del texto",
                    "color": "#3B82F6",
                    "icon": "book"
                },
                {
                    "id": "cat-inferencial",
                    "name": "Inferencial",
                    "description": "Conclusiones basadas en pistas del texto",
                    "color": "#10B981",
                    "icon": "search"
                },
                {
                    "id": "cat-critico",
                    "name": "Crítico",
                    "description": "Análisis y evaluación del contenido",
                    "color": "#F59E0B",
                    "icon": "lightbulb"
                },
                {
                    "id": "cat-creativo",
                    "name": "Creativo",
                    "description": "Ideas originales relacionadas con el texto",
                    "color": "#8B5CF6",
                    "icon": "palette"
                }
            ],
            "fragments": [
                {
                    "id": "frag-1",
                    "text": "Marie Curie fue pionera en el estudio de la radiactividad, convirtiéndose en la primera mujer en ganar un Premio Nobel y la única persona en ganar en dos campos científicos diferentes.",
                    "difficulty": "medium"
                },
                {
                    "id": "frag-2",
                    "text": "A pesar de enfrentar discriminación por ser mujer en un campo dominado por hombres, Marie persistió en su investigación, trabajando en condiciones difíciles en un laboratorio improvisado.",
                    "difficulty": "medium"
                },
                {
                    "id": "frag-3",
                    "text": "Los cuadernos de Marie Curie todavía son radiactivos y se guardan en cajas especiales de plomo. Las personas que quieren consultarlos deben firmar un descargo de responsabilidad.",
                    "difficulty": "hard"
                }
            ],
            "settings": {
                "timeLimit": 30,
                "minTextLength": 20,
                "maxTextLength": 200
            },
            "instructions": "1. Gira la ruleta para seleccionar una categoría de inferencia\n2. Lee el fragmento de texto con atención\n3. Escribe una inferencia según la categoría seleccionada en 30 segundos\n4. Tu inferencia debe incluir conceptos clave del texto"
        }'::jsonb,
        '{
            "validation": {
                "minKeywords": 2,
                "minLength": 20,
                "maxLength": 200
            },
            "fragments": [
                {
                    "id": "frag-1",
                    "keywords": ["pionera", "radiactividad", "nobel", "primera", "mujer", "cientifico", "premio", "campos", "unica"],
                    "points": 20
                },
                {
                    "id": "frag-2",
                    "keywords": ["discriminacion", "mujer", "persistio", "investigacion", "laboratorio", "condiciones", "dificiles", "hombres", "campo"],
                    "points": 20
                },
                {
                    "id": "frag-3",
                    "keywords": ["cuadernos", "radiactivos", "plomo", "cajas", "peligroso", "descargo", "responsabilidad", "anos", "consultar"],
                    "points": 20
                }
            ]
        }'::jsonb,
        'intermediate', 100, 75,
        20, 20,
        ARRAY[
            'Distingue entre inferencias basadas en evidencia y juicios de valor',
            'Considera el contexto histórico: el conocimiento científico de esa época era limitado',
            'Las inferencias correctas explican hechos observables de manera lógica'
        ]::text[],
        true, 15,
        100, 20,
        true, 1
    ) ON CONFLICT (module_id, exercise_type, order_index) DO UPDATE SET
        content = EXCLUDED.content,
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

    RAISE NOTICE '✅ Módulo 2 (MOD-02-INFERENCIAL): 5 ejercicios cargados exitosamente';
    RAISE NOTICE '   - Detective Textual';
    RAISE NOTICE '   - Construcción de Hipótesis';
    RAISE NOTICE '   - Predicción Narrativa';
    RAISE NOTICE '   - Puzzle de Contexto';
    RAISE NOTICE '   - Rueda de Inferencias';
END $$;
