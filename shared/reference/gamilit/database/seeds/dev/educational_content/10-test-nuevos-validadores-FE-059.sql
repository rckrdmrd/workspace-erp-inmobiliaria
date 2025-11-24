-- =====================================================
-- Seed Data: Testing para Nuevos Validadores FE-059
-- =====================================================
-- Description: Ejercicios de prueba para validar los 3 nuevos validadores
-- Validators: validate_detective_connections, validate_prediction_scenarios, validate_causa_efecto_matching
-- Created by: Frontend Agent - FE-059
-- Date: 2025-11-19
-- Status: TESTING
-- Purpose: Proveer datos de prueba para validación de nuevos formatos DTO
-- =====================================================

SET search_path TO educational_content, public;

DO $$
DECLARE
    mod_id UUID;
BEGIN
    -- Usar Módulo 2 para testing
    SELECT id INTO mod_id FROM educational_content.modules WHERE module_code = 'MOD-02-INFERENCIAL';

    IF mod_id IS NULL THEN
        RAISE EXCEPTION 'Módulo MOD-02-INFERENCIAL no encontrado';
    END IF;

    -- ========================================================================
    -- TEST 1: DETECTIVE TEXTUAL - Conexión de Evidencias (NUEVO FORMATO)
    -- ========================================================================
    -- Tipo: detective_textual
    -- Subtipo: connections
    -- Frontend DTO: { "connections": [{"from": "...", "to": "...", "relationship": "..."}] }
    -- ========================================================================

    INSERT INTO educational_content.exercises (
        module_id, title, subtitle, description, instructions,
        exercise_type, order_index,
        config, content, solution,
        difficulty_level, max_points, passing_score,
        estimated_time_minutes, max_attempts,
        hints, enable_hints, hint_cost_ml_coins,
        xp_reward, ml_coins_reward,
        is_active, version
    ) VALUES (
        mod_id,
        '[TEST] Detective Textual: Investigación de los Descubrimientos de Curie',
        'Conecta las Evidencias para Resolver el Caso',
        'Analiza los documentos históricos y conecta las evidencias que están relacionadas. Explica la relación entre cada par de documentos.',
        'Lee cada evidencia cuidadosamente. Arrastra desde un documento hacia otro para crear una conexión. Escribe una breve descripción de la relación que identificas.',
        'detective_textual', 101, -- order_index alto para distinguir de producción
        '{
            "allowMultipleConnections": true,
            "minConnectionsRequired": 3,
            "showEvidenceDetails": true
        }'::jsonb,
        '{
            "evidences": [
                {
                    "id": "evidence-1",
                    "title": "Artículo Científico: Comptes Rendus (1898)",
                    "type": "publication",
                    "content": "Presentamos en esta comunicación el descubrimiento de dos nuevos elementos altamente radiactivos. El primero, al que denominamos POLONIO en honor a mi país natal, y el segundo, el RADIO, presenta una radiactividad extraordinaria, aproximadamente un millón de veces mayor que la del uranio. Estos descubrimientos abren nuevas fronteras en la comprensión de la materia.",
                    "date": "1898-12-26",
                    "author": "Pierre y Marie Curie"
                },
                {
                    "id": "evidence-2",
                    "title": "Cuaderno de Laboratorio Personal de Marie",
                    "type": "notes",
                    "content": "15 de diciembre, 1898: Después de procesar toneladas de pechblenda, finalmente hemos aislado una muestra pura. La radiación que emite es asombrosa. Pierre me advierte sobre el tiempo de exposición, pero la emoción del descubrimiento es abrumadora. Los experimentos del 10 al 14 de diciembre confirmaron que el nuevo elemento mantiene una actividad constante incluso después de varios días.",
                    "date": "1898-12-15",
                    "author": "Marie Curie"
                },
                {
                    "id": "evidence-3",
                    "title": "Carta a la Academia de Ciencias",
                    "type": "correspondence",
                    "content": "Distinguidos miembros de la Academia: Me dirijo a ustedes para informar formalmente sobre el descubrimiento que hemos anunciado en Comptes Rendus. Adjunto muestras del nuevo elemento radiactivo. Solicitamos respetuosamente que se considere nuestro trabajo para una presentación formal ante la Academia. Los experimentos documentados en nuestros cuadernos de laboratorio desde septiembre confirman la naturaleza extraordinaria de este hallazgo.",
                    "date": "1899-01-03",
                    "author": "Marie Curie"
                },
                {
                    "id": "evidence-4",
                    "title": "Acta de Reunión de la Academia",
                    "type": "official_record",
                    "content": "En la sesión del 18 de enero de 1899, se recibió la comunicación de Madame Curie sobre sus descubrimientos. Tras examinar las muestras presentadas y revisar la documentación experimental, la Academia reconoce la importancia de este trabajo. Se aprueba la publicación oficial y se recomienda para consideración del premio científico anual.",
                    "date": "1899-01-18",
                    "author": "Academia de Ciencias de Francia"
                }
            ],
            "instructions": {
                "step1": "Lee cada evidencia cuidadosamente",
                "step2": "Identifica relaciones entre los documentos (referencias cruzadas, cronología, confirmaciones)",
                "step3": "Crea conexiones arrastrando desde un documento hacia otro",
                "step4": "Describe la relación que identificaste"
            }
        }'::jsonb,
        '{
            "connections": [
                {
                    "from": "evidence-1",
                    "to": "evidence-2",
                    "relationship": "documentation",
                    "requiredKeywords": ["experimento", "descubrimiento", "radiación", "diciembre"],
                    "explanation": "El artículo científico del 26 de diciembre describe los descubrimientos que fueron documentados en el cuaderno de laboratorio del 15 de diciembre. Los experimentos del cuaderno precedieron y fundamentaron la publicación."
                },
                {
                    "from": "evidence-2",
                    "to": "evidence-3",
                    "relationship": "reference",
                    "requiredKeywords": ["experimentos", "cuadernos", "laboratorio", "documentados"],
                    "explanation": "La carta menciona explícitamente los experimentos documentados en los cuadernos de laboratorio desde septiembre, haciendo referencia directa a las notas de Marie."
                },
                {
                    "from": "evidence-1",
                    "to": "evidence-3",
                    "relationship": "announcement",
                    "requiredKeywords": ["descubrimiento", "anunciado", "Comptes Rendus", "publicación"],
                    "explanation": "La carta a la Academia menciona el descubrimiento que fue anunciado en Comptes Rendus (el artículo científico), estableciendo una conexión directa entre ambos documentos."
                },
                {
                    "from": "evidence-3",
                    "to": "evidence-4",
                    "relationship": "response",
                    "requiredKeywords": ["comunicación", "muestras", "documentación", "trabajo"],
                    "explanation": "El acta de la Academia responde directamente a la carta de Marie, mencionando la recepción de su comunicación, el examen de las muestras, y la revisión de la documentación."
                }
            ],
            "minCorrectConnections": 3,
            "allowPartialCredit": true,
            "scoringRules": {
                "perfectScore": 100,
                "minPassingConnections": 3,
                "keywordWeight": 0.4,
                "relationshipWeight": 0.6
            }
        }'::jsonb,
        'intermediate', 100, 70,
        25, 3,
        ARRAY[
            'Busca fechas y referencias cruzadas entre documentos',
            'El cuaderno de laboratorio suele ser la fuente primaria de los artículos científicos',
            'Las cartas oficiales típicamente hacen referencia a publicaciones previas',
            'Los actas de reuniones responden a comunicaciones formales'
        ]::text[],
        true, 20,
        150, 30,
        true, 1
    ) ON CONFLICT (module_id, exercise_type, order_index) DO UPDATE SET
        content = EXCLUDED.content,
        solution = EXCLUDED.solution,
        updated_at = NOW();

    -- ========================================================================
    -- TEST 2: PREDICCIÓN NARRATIVA - Escenarios Múltiples (NUEVO FORMATO)
    -- ========================================================================
    -- Tipo: prediccion_narrativa
    -- Subtipo: scenarios
    -- Frontend DTO: { "scenarios": { "s1": "pred_a", "s2": "pred_b" } }
    -- ========================================================================

    INSERT INTO educational_content.exercises (
        module_id, title, subtitle, description, instructions,
        exercise_type, order_index,
        config, content, solution,
        difficulty_level, max_points, passing_score,
        estimated_time_minutes, max_attempts,
        hints, enable_hints, hint_cost_ml_coins,
        xp_reward, ml_coins_reward,
        is_active, version
    ) VALUES (
        mod_id,
        '[TEST] Predicción Narrativa: Las Decisiones de Marie Curie',
        'Predice las Acciones más Probables en Diferentes Escenarios',
        'Basándote en el contexto histórico y el carácter de Marie Curie, predice qué decisión tomaría en cada situación hipotética.',
        'Lee cada escenario cuidadosamente. Considera el contexto histórico, los valores de Marie, y sus motivaciones. Selecciona la predicción más probable.',
        'prediccion_narrativa', 102,
        '{
            "showContext": true,
            "allowExplanations": true,
            "multipleScenarios": true
        }'::jsonb,
        '{
            "introduction": "Marie Curie fue una científica pionera conocida por su dedicación a la ciencia, su altruismo, y su determinación ante la adversidad. A continuación, varios escenarios hipotéticos basados en momentos reales de su vida.",
            "scenarios": [
                {
                    "id": "scenario-1",
                    "title": "La Oferta de Patente (1902)",
                    "context": "Tras descubrir el proceso de aislamiento del radio, Marie y Pierre reciben una oferta millonaria de industriales estadounidenses para patentar el proceso. La patente les haría inmensamente ricos, pero limitaría el acceso de otros científicos al conocimiento.",
                    "question": "¿Qué decisión tomaría Marie?",
                    "predictions": [
                        {
                            "id": "prediction-a",
                            "text": "Rechazar la patente para que la ciencia sea libre y accesible",
                            "reasoning": "Histórico: Marie y Pierre rechazaron patentar por principios altruistas"
                        },
                        {
                            "id": "prediction-b",
                            "text": "Aceptar la patente para financiar más investigación",
                            "reasoning": "Pragmático pero contradice sus valores documentados"
                        },
                        {
                            "id": "prediction-c",
                            "text": "Patentar pero licenciar gratuitamente a instituciones científicas",
                            "reasoning": "Solución de compromiso poco práctica en esa época"
                        }
                    ]
                },
                {
                    "id": "scenario-2",
                    "title": "La Cátedra de la Sorbona (1906)",
                    "context": "Después de la muerte de Pierre en 1906, la Universidad de la Sorbona ofrece a Marie suceder a su esposo como profesora de física, convirtiéndose en la primera mujer profesora en 650 años de historia de la universidad. Sin embargo, aceptar significa dejar temporalmente su investigación activa.",
                    "question": "¿Qué haría Marie?",
                    "predictions": [
                        {
                            "id": "prediction-d",
                            "text": "Rechazar para continuar su investigación en el laboratorio",
                            "reasoning": "Prioriza investigación pero ignora oportunidad histórica"
                        },
                        {
                            "id": "prediction-e",
                            "text": "Aceptar para inspirar a futuras mujeres científicas",
                            "reasoning": "Histórico: Marie aceptó esta posición en 1906"
                        },
                        {
                            "id": "prediction-f",
                            "text": "Delegar la cátedra en un colega masculino",
                            "reasoning": "Contradice su lucha por la igualdad de género"
                        }
                    ]
                },
                {
                    "id": "scenario-3",
                    "title": "El Segundo Nobel (1911)",
                    "context": "En 1911, Marie es nominada para un segundo Premio Nobel, esta vez en Química por el aislamiento del radio puro. Sin embargo, simultáneamente enfrenta un escándalo mediático por su relación con el científico Paul Langevin. Algunos le aconsejan rechazar el Nobel para evitar más controversia.",
                    "question": "¿Qué decisión tomaría Marie?",
                    "predictions": [
                        {
                            "id": "prediction-g",
                            "text": "Rechazar el Nobel para proteger su reputación",
                            "reasoning": "Defensivo pero contradice su valentía característica"
                        },
                        {
                            "id": "prediction-h",
                            "text": "Retirarse de la vida pública por completo",
                            "reasoning": "Rendirse no coincide con su personalidad perseverante"
                        },
                        {
                            "id": "prediction-i",
                            "text": "Aceptar el Nobel con dignidad, separando vida personal de logros científicos",
                            "reasoning": "Histórico: Marie asistió a la ceremonia con orgullo en Estocolmo"
                        }
                    ]
                },
                {
                    "id": "scenario-4",
                    "title": "La Primera Guerra Mundial (1914)",
                    "context": "Cuando estalla la Primera Guerra Mundial en 1914, Marie tiene 47 años y es una científica consagrada con dos Premios Nobel. Francia moviliza a sus ciudadanos para el esfuerzo bélico. Marie podría continuar su investigación en seguridad o contribuir directamente.",
                    "question": "¿Cómo contribuiría Marie?",
                    "predictions": [
                        {
                            "id": "prediction-j",
                            "text": "Permanecer en su laboratorio investigando",
                            "reasoning": "Seguro pero no refleja su compromiso patriótico"
                        },
                        {
                            "id": "prediction-k",
                            "text": "Desarrollar unidades móviles de rayos X para hospitales de campaña",
                            "reasoning": "Histórico: Marie creó las petites Curies, ambulancias radiológicas"
                        },
                        {
                            "id": "prediction-l",
                            "text": "Emigrar a un país neutral para proteger su trabajo",
                            "reasoning": "Contradice su amor por Francia adoptiva"
                        }
                    ]
                }
            ]
        }'::jsonb,
        '{
            "scenarios": {
                "scenario-1": "prediction-a",
                "scenario-2": "prediction-e",
                "scenario-3": "prediction-i",
                "scenario-4": "prediction-k"
            },
            "explanations": {
                "scenario-1": "Marie y Pierre Curie rechazaron patentar el proceso de aislamiento del radio, creyendo que el conocimiento científico debía ser libre para el beneficio de la humanidad. Esta decisión altruista les costó una fortuna potencial.",
                "scenario-2": "Marie Curie aceptó la cátedra en la Sorbona en 1906, convirtiéndose en la primera mujer profesora en su historia. Combinó la docencia con su investigación, inspirando a generaciones futuras.",
                "scenario-3": "A pesar del escándalo mediático, Marie viajó a Estocolmo en diciembre de 1911 para recibir su segundo Nobel con dignidad, separando su vida privada de sus logros científicos. Se convirtió en la primera persona en ganar dos Premios Nobel.",
                "scenario-4": "Durante la Primera Guerra Mundial, Marie desarrolló las petites Curies, unidades móviles de rayos X que salvaron miles de vidas. Incluso aprendió a conducir y reparar los vehículos ella misma, viajando al frente de batalla."
            },
            "scoringRules": {
                "perfectScore": 100,
                "partialCredit": true,
                "pointsPerScenario": 25
            }
        }'::jsonb,
        'advanced', 100, 75,
        20, 3,
        ARRAY[
            'Considera los valores documentados de Marie: altruismo, dedicación científica, determinación',
            'Marie históricamente eligió el beneficio de la humanidad sobre el beneficio personal',
            'Nunca se rindió ante la adversidad o los prejuicios de género',
            'Combinaba idealismo científico con pragmatismo cuando era necesario'
        ]::text[],
        true, 20,
        150, 30,
        true, 1
    ) ON CONFLICT (module_id, exercise_type, order_index) DO UPDATE SET
        content = EXCLUDED.content,
        solution = EXCLUDED.solution,
        updated_at = NOW();

    -- ========================================================================
    -- TEST 3: CAUSA-EFECTO - Asociación/Matching (NUEVO FORMATO)
    -- ========================================================================
    -- Tipo: construccion_hipotesis
    -- Subtipo: matching
    -- Frontend DTO: { "causes": { "c1": ["cons1", "cons2"], "c2": ["cons3"] } }
    -- ========================================================================

    INSERT INTO educational_content.exercises (
        module_id, title, subtitle, description, instructions,
        exercise_type, order_index,
        config, content, solution,
        difficulty_level, max_points, passing_score,
        estimated_time_minutes, max_attempts,
        hints, enable_hints, hint_cost_ml_coins,
        xp_reward, ml_coins_reward,
        is_active, version
    ) VALUES (
        mod_id,
        '[TEST] Causa-Efecto: Impacto de los Descubrimientos de Curie',
        'Asocia Cada Causa con sus Consecuencias',
        'Identifica las consecuencias (efectos) que resultaron de cada causa relacionada con la vida y trabajo de Marie Curie. Una causa puede tener múltiples efectos.',
        'Lee cada causa en la columna izquierda. Arrastra las consecuencias correspondientes desde la columna derecha. Una causa puede tener 1-3 consecuencias. Piensa en efectos inmediatos, a largo plazo y en otros.',
        'construccion_hipotesis', 103,
        '{
            "allowMultiple": true,
            "dragAndDrop": true,
            "showFeedback": true,
            "visualStyle": "columns"
        }'::jsonb,
        '{
            "causes": [
                {
                    "id": "cause-1",
                    "text": "Descubrimiento del radio y sus propiedades radiactivas (1898)",
                    "category": "scientific_discovery",
                    "icon": "flask"
                },
                {
                    "id": "cause-2",
                    "text": "Decisión de no patentar el proceso de aislamiento del radio",
                    "category": "ethical_decision",
                    "icon": "handshake"
                },
                {
                    "id": "cause-3",
                    "text": "Exposición prolongada a radiación sin medidas de protección",
                    "category": "health_risk",
                    "icon": "alert-triangle"
                },
                {
                    "id": "cause-4",
                    "text": "Ser la primera mujer profesora en la Universidad de la Sorbona (1906)",
                    "category": "social_milestone",
                    "icon": "award"
                },
                {
                    "id": "cause-5",
                    "text": "Ganar dos Premios Nobel en diferentes disciplinas (1903 y 1911)",
                    "category": "recognition",
                    "icon": "trophy"
                }
            ],
            "consequences": [
                {
                    "id": "consequence-a",
                    "text": "Desarrollo de tratamientos de radioterapia contra el cáncer",
                    "type": "medical_advancement"
                },
                {
                    "id": "consequence-b",
                    "text": "Fundación de la física nuclear como disciplina",
                    "type": "scientific_field"
                },
                {
                    "id": "consequence-c",
                    "text": "Descubrimiento de la fisión nuclear por otros científicos",
                    "type": "future_discoveries"
                },
                {
                    "id": "consequence-d",
                    "text": "Otros científicos pudieron replicar y continuar la investigación libremente",
                    "type": "knowledge_sharing"
                },
                {
                    "id": "consequence-e",
                    "text": "No obtuvieron beneficios económicos significativos de su descubrimiento",
                    "type": "financial_impact"
                },
                {
                    "id": "consequence-f",
                    "text": "La medicina nuclear se desarrolló más rápidamente",
                    "type": "medical_advancement"
                },
                {
                    "id": "consequence-g",
                    "text": "Marie desarrolló anemia aplásica y otros problemas de salud graves",
                    "type": "health_consequence"
                },
                {
                    "id": "consequence-h",
                    "text": "Se establecieron posteriormente protocolos de seguridad radiológica",
                    "type": "safety_regulations"
                },
                {
                    "id": "consequence-i",
                    "text": "Sus cuadernos de laboratorio siguen siendo radiactivos hoy en día",
                    "type": "lasting_effect"
                },
                {
                    "id": "consequence-j",
                    "text": "Inspiró a generaciones de mujeres a estudiar ciencia",
                    "type": "social_impact"
                },
                {
                    "id": "consequence-k",
                    "text": "Rompió barreras de género en la academia francesa",
                    "type": "social_change"
                },
                {
                    "id": "consequence-l",
                    "text": "Estableció que las mujeres podían alcanzar el más alto nivel científico",
                    "type": "gender_equality"
                },
                {
                    "id": "consequence-m",
                    "text": "Se convirtió en un icono científico reconocido mundialmente",
                    "type": "legacy"
                },
                {
                    "id": "consequence-n",
                    "text": "Demostró que era posible ganar Nobel en más de una disciplina",
                    "type": "achievement"
                },
                {
                    "id": "consequence-o",
                    "text": "Incrementó el prestigio de Francia en la comunidad científica internacional",
                    "type": "national_pride"
                }
            ],
            "layout": {
                "causesColumn": "left",
                "consequencesColumn": "right",
                "showConnections": true
            }
        }'::jsonb,
        '{
            "causes": {
                "cause-1": ["consequence-a", "consequence-b", "consequence-c"],
                "cause-2": ["consequence-d", "consequence-e", "consequence-f"],
                "cause-3": ["consequence-g", "consequence-h", "consequence-i"],
                "cause-4": ["consequence-j", "consequence-k", "consequence-l"],
                "cause-5": ["consequence-m", "consequence-n", "consequence-o"]
            },
            "allowPartialMatches": true,
            "strictOrder": false,
            "scoringRules": {
                "perfectScore": 100,
                "pointsPerCorrectMatch": 6.67,
                "minPassingMatches": 11,
                "allowPartialCredit": true
            },
            "explanations": {
                "cause-1": "El descubrimiento del radio revolucionó la medicina (radioterapia), fundó una nueva rama de la física, y abrió el camino para descubrimientos futuros como la fisión nuclear.",
                "cause-2": "Al no patentar, permitieron que otros científicos accedieran libremente al conocimiento, acelerando el desarrollo de la medicina nuclear, aunque sacrificando ganancias personales.",
                "cause-3": "La exposición sin protección causó problemas de salud graves a Marie, evidenció la necesidad de seguridad radiológica, y contaminó permanentemente sus materiales de trabajo.",
                "cause-4": "Su nombramiento histórico inspiró a mujeres científicas, rompió barreras institucionales de género, y estableció un precedente de igualdad en la academia.",
                "cause-5": "Sus dos Nobel consolidaron su legado mundial, demostraron la posibilidad de excelencia multidisciplinaria, e incrementaron el prestigio científico de Francia."
            }
        }'::jsonb,
        'advanced', 100, 70,
        25, 3,
        ARRAY[
            'Piensa en tres tipos de efectos: inmediatos, a largo plazo, y en otros',
            'Una causa científica puede tener efectos médicos, sociales y en futuras investigaciones',
            'Las decisiones éticas tienen consecuencias tanto positivas como negativas',
            'Los riesgos de salud pueden generar efectos duraderos y cambios en políticas de seguridad'
        ]::text[],
        true, 20,
        150, 30,
        true, 1
    ) ON CONFLICT (module_id, exercise_type, order_index) DO UPDATE SET
        content = EXCLUDED.content,
        solution = EXCLUDED.solution,
        updated_at = NOW();

    RAISE NOTICE 'Seeds de testing para nuevos validadores FE-059 creados exitosamente';
    RAISE NOTICE 'Ejercicios creados con order_index 101, 102, 103 para distinguirlos de producción';
END $$;
