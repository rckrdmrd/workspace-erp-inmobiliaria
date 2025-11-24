-- =====================================================
-- Seed Data: Exercises Module 5 - Producción Creativa (PRODUCTION)
-- =====================================================
-- Description: 3 ejercicios creativos del Módulo 5 COMPLETOS
-- Module: MOD-05-PRODUCCION
-- Exercises: Diario Multimedia, Cómic Digital, Video-Carta
-- Created by: SA-SEEDS-EDUCATIONAL
-- Date: 2025-11-11
-- Status: PRODUCTION
-- Updated: 2025-11-11 (Expansión completa + corrección código módulo)
-- =====================================================

SET search_path TO educational_content, public;

DO $$
DECLARE
    mod_id UUID;
BEGIN
    SELECT id INTO mod_id FROM educational_content.modules WHERE module_code = 'MOD-05-PRODUCCION';

    IF mod_id IS NULL THEN
        RAISE EXCEPTION 'Módulo MOD-05-PRODUCCION no encontrado. Ejecutar primero 01-modules.sql';
    END IF;

    -- ========================================================================
    -- EXERCISE 5.1: DIARIO MULTIMEDIA DE MARIE CURIE
    -- ========================================================================
    INSERT INTO educational_content.exercises (
        module_id, title, subtitle, description, instructions,
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
        'Diario Interactivo de Marie',
        'Imagina su Vida Cotidiana en 1898',
        'Crea un diario multimedia desde la perspectiva de Marie Curie durante el descubrimiento del radio. Incluye entradas de texto, reflexiones, y elementos multimedia que capturen sus emociones, desafíos y triunfos.',
        'Escribe al menos 3 entradas de diario desde la perspectiva de Marie Curie. Cada entrada debe incluir: fecha histórica, contexto del día, estado emocional, reflexión personal, y opcionalmente elementos multimedia (imagen, audio, o boceto). Usa tu creatividad pero mantén precisión histórica.',
        'diario_multimedia', 1,
        '{
            "allowMultimedia": true,
            "minEntries": 3,
            "maxEntries": 5,
            "formats": ["text", "image", "audio", "video"],
            "minWordsPerEntry": 150,
            "maxWordsPerEntry": 400,
            "requireDates": true,
            "historicalAccuracyRequired": true,
            "multimediaOptional": true,
            "layouts": ["simple", "journal", "notebook", "letter"],
            "fonts": ["handwriting", "typewriter", "modern"],
            "templates": [
                {
                    "id": "template_classic",
                    "name": "Diario Clásico",
                    "style": "vintage",
                    "features": ["date_header", "mood_icon", "weather", "location"]
                },
                {
                    "id": "template_scientific",
                    "name": "Cuaderno Científico",
                    "style": "lab_notebook",
                    "features": ["date_header", "observations", "calculations", "sketches"]
                },
                {
                    "id": "template_letter",
                    "name": "Carta Personal",
                    "style": "letter",
                    "features": ["recipient", "signature", "postscript"]
                }
            ],
            "autoSave": true,
            "saveInterval": 30,
            "characterLimit": 2000
        }'::jsonb,
        '{
            "prompts": [
                {
                    "id": "entry1",
                    "date": "1898-12-15",
                    "title": "El Día del Descubrimiento",
                    "context": "Marie y Pierre acaban de aislar el radio por primera vez. El mineral brilla en la oscuridad del laboratorio.",
                    "mood": "excitement",
                    "weather": "Frío invernal en París",
                    "location": "Laboratorio en Rue Lhomond",
                    "guidingQuestions": [
                        "¿Cómo te sentiste al ver el radio brillar por primera vez?",
                        "¿Qué significó este momento para tu investigación?",
                        "¿Cuáles fueron las dificultades para llegar aquí?",
                        "¿Qué esperanzas tienes para este descubrimiento?"
                    ],
                    "historicalContext": "Después de 4 años de procesar toneladas de pechblenda, Marie y Pierre finalmente aislaron 0.1 gramos de radio puro. El elemento brillaba con luz azul-verde en la oscuridad.",
                    "suggestedElements": ["emoción", "perseverancia", "colaboración", "visión científica"]
                },
                {
                    "id": "entry2",
                    "date": "1898-12-20",
                    "title": "Reflexiones sobre Dificultades",
                    "context": "Cinco días después del descubrimiento. Marie reflexiona sobre los años de trabajo en condiciones precarias.",
                    "mood": "determination",
                    "weather": "Nieve ligera",
                    "location": "Apartamento en París",
                    "guidingQuestions": [
                        "¿Qué obstáculos enfrentaste en estos 4 años?",
                        "¿Hubo momentos donde quisiste rendirte?",
                        "¿Cómo el apoyo de Pierre fue crucial?",
                        "¿Qué sacrificios personales hiciste por la ciencia?"
                    ],
                    "historicalContext": "Marie trabajó en un hangar abandonado sin calefacción, procesando manualmente toneladas de mineral. Vivían en pobreza, priorizando investigación sobre comodidad.",
                    "suggestedElements": ["sacrificio", "pareja", "pobreza", "dedicación"]
                },
                {
                    "id": "entry3",
                    "date": "1898-12-26",
                    "title": "Sueños para el Futuro",
                    "context": "Navidad 1898. Marie imagina cómo el radio podría cambiar la medicina y la ciencia.",
                    "mood": "hope",
                    "weather": "Noche clara y fría",
                    "location": "Junto a la ventana del apartamento",
                    "guidingQuestions": [
                        "¿Cómo podría el radio ayudar a la humanidad?",
                        "¿Qué otros descubrimientos te gustaría hacer?",
                        "¿Qué significa ser una mujer científica en 1898?",
                        "¿Qué le dirías a las futuras generaciones de científicas?"
                    ],
                    "historicalContext": "Marie ya visualizaba aplicaciones médicas del radio (radioterapia). También reflexionaba sobre su rol como mujer en ciencia, un campo dominado por hombres.",
                    "suggestedElements": ["esperanza", "medicina", "igualdad", "legado"]
                },
                {
                    "id": "entry4",
                    "date": "1899-01-05",
                    "title": "Primera Aplicación Médica",
                    "context": "Un médico visitó el laboratorio interesado en usar radio para tratar tumores.",
                    "mood": "anticipation",
                    "weather": "Helada matinal",
                    "location": "Laboratorio",
                    "guidingQuestions": [
                        "¿Cómo te sientes al saber que tu descubrimiento salvará vidas?",
                        "¿Qué responsabilidades sientes ahora?",
                        "¿Preocupa el uso potencialmente peligroso de la radiación?"
                    ],
                    "historicalContext": "En 1899, los primeros médicos comenzaron a experimentar con radio para tratar cáncer de piel, iniciando la era de la radioterapia.",
                    "suggestedElements": ["medicina", "responsabilidad", "peligro", "esperanza"]
                },
                {
                    "id": "entry5",
                    "date": "1899-02-14",
                    "title": "Amor y Ciencia",
                    "context": "Día de San Valentín. Marie reflexiona sobre su relación con Pierre y cómo la ciencia los une.",
                    "mood": "love",
                    "weather": "Primeros signos de primavera",
                    "location": "Caminata por el Sena",
                    "guidingQuestions": [
                        "¿Cómo es trabajar con tu pareja en ciencia?",
                        "¿Qué admiras más de Pierre?",
                        "¿Cómo balanceas vida personal y científica?",
                        "¿Qué significa el amor en tu vida?"
                    ],
                    "historicalContext": "Marie y Pierre tenían una relación única: socios científicos y románticos. Su luna de miel fue un viaje en bicicleta donde discutían física.",
                    "suggestedElements": ["amor", "pareja", "colaboración", "balance"]
                }
            ],
            "rubricDetails": {
                "creativity": {
                    "weight": 30,
                    "criteria": [
                        "Originalidad en la expresión",
                        "Uso creativo de metáforas y lenguaje",
                        "Perspectiva única y personal",
                        "Elementos visuales o multimedia creativos"
                    ]
                },
                "historicalAccuracy": {
                    "weight": 30,
                    "criteria": [
                        "Fechas y eventos históricos correctos",
                        "Contexto científico preciso",
                        "Detalles biográficos auténticos",
                        "Vocabulario y tono de época apropiado"
                    ]
                },
                "multimedia": {
                    "weight": 20,
                    "criteria": [
                        "Uso efectivo de imágenes/bocetos",
                        "Integración coherente de elementos multimedia",
                        "Calidad de presentación visual",
                        "Relevancia de elementos multimedia al contenido"
                    ]
                },
                "expression": {
                    "weight": 20,
                    "criteria": [
                        "Claridad y coherencia narrativa",
                        "Profundidad emocional",
                        "Voz auténtica del personaje",
                        "Gramática y ortografía correcta"
                    ]
                }
            },
            "exampleEntry": {
                "date": "1898-12-15",
                "title": "¡El Radio Brilla!",
                "content": "Querido diario,\\n\\nHoy, 15 de diciembre de 1898, es un día que nunca olvidaré. Después de cuatro años de trabajo incansable, Pierre y yo finalmente lo logramos. En la oscuridad de nuestro laboratorio, el radio brilló con una luz azul-verde etérea que parecía mágica.\\n\\nMis manos están agrietadas por el frío y el trabajo con ácidos. He procesado toneladas de pechblenda en ese hangar helado. Hubo días donde dudé, donde el cansancio era insoportable. Pero hoy, todo cobra sentido.\\n\\nEl radio pesa apenas 0.1 gramos, pero representa años de fe, perseverancia y amor por la ciencia. Pierre me abrazó cuando vimos la luminiscencia. No dijimos nada; no hacían falta palabras.\\n\\nEste descubrimiento abrirá nuevas puertas en física y, espero, en medicina. Imagino un futuro donde la radiactividad ayude a curar enfermedades. Pero por ahora, simplemente contemplo este pequeño milagro brillante.\\n\\nCon emoción y gratitud,\\nMarie",
                "mood": "excitement",
                "multimedia": null,
                "wordCount": 156
            },
            "assessmentGuidelines": "El diario será evaluado por: (1) Creatividad en expresión y perspectiva (30%), (2) Precisión histórica y científica (30%), (3) Uso efectivo de multimedia cuando aplique (20%), (4) Claridad, profundidad emocional y voz auténtica (20%). Se valorará especialmente la capacidad de ponerse en los zapatos de Marie Curie y transmitir sus emociones, desafíos y visión científica de manera auténtica y conmovedora."
        }'::jsonb,
        '{
            "rubric": {
                "creativity": 30,
                "historicalAccuracy": 30,
                "multimedia": 20,
                "expression": 20
            },
            "sampleEvaluation": {
                "excellentEntry": {
                    "score": 95,
                    "feedback": "Excelente trabajo. Tu diario captura magistralmente la voz de Marie Curie, combinando precisión histórica con profundidad emocional. Los detalles sobre el laboratorio frío, las manos agrietadas, y la luminiscencia del radio demuestran investigación cuidadosa. Tu expresión es auténtica y conmovedora."
                },
                "goodEntry": {
                    "score": 80,
                    "feedback": "Buen trabajo. Tu diario muestra comprensión del contexto histórico y captura aspectos emocionales de Marie. Para mejorar, incluye más detalles específicos sobre el proceso científico y profundiza en las reflexiones personales."
                },
                "averageEntry": {
                    "score": 70,
                    "feedback": "Trabajo adecuado. Has cumplido con los requisitos básicos, pero la entrada se siente genérica. Investiga más sobre la vida de Marie y usa detalles específicos para hacer tu diario más auténtico y personal."
                }
            }
        }'::jsonb,
        'intermediate', 100, 70,
        40, 60, 3,
        ARRAY[
            'Investiga sobre la vida diaria de Marie en 1898: dónde vivía, cómo era su laboratorio',
            'Lee cartas reales de Marie Curie para capturar su voz y tono',
            'Piensa en las emociones: frustración del trabajo tedioso, emoción del descubrimiento',
            'Incluye detalles sensoriales: frío del laboratorio, brillo del radio, olor de químicos',
            'No olvides el contexto histórico: ser mujer científica en 1898 era revolucionario'
        ],
        true, 5,
        ARRAY['pistas', 'vision_lectora']::gamification_system.comodin_type[],
        '{
            "pistas": {"cost": 15, "enabled": true, "description": "Revela contexto histórico adicional"},
            "vision_lectora": {"cost": 25, "enabled": true, "description": "Muestra ejemplo de entrada de diario"}
        }'::jsonb,
        500, 100,
        true, 1
    ) ON CONFLICT (module_id, exercise_type, order_index) DO UPDATE SET
        content = EXCLUDED.content,
        config = EXCLUDED.config,
        solution = EXCLUDED.solution,
        hints = EXCLUDED.hints,
        updated_at = gamilit.now_mexico();

    -- ========================================================================
    -- EXERCISE 5.2: CÓMIC DIGITAL - EL DESCUBRIMIENTO DEL RADIO
    -- ========================================================================
    INSERT INTO educational_content.exercises (
        module_id, title, subtitle, description, instructions,
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
        'Resumen Visual Progresivo (Cómic Digital)',
        'Narrativa Visual Científica',
        'Crea un cómic digital de 4-6 viñetas narrando el descubrimiento del radio por Marie Curie. Usa narrativa visual para contar esta historia científica de manera atractiva y educativa.',
        'Diseña un cómic de 4-6 viñetas (panels) que cuente la historia del descubrimiento del radio. Cada viñeta debe incluir: ilustración/boceto, diálogo de personajes, narración contextual, y elementos visuales que refuercen la historia. Usa la herramienta de creación de cómics o dibuja manualmente y sube imágenes.',
        'comic_digital', 2,
        '{
            "minPanels": 4,
            "maxPanels": 6,
            "requireDialogue": true,
            "requireNarration": true,
            "requireCaption": true,
            "allowSketches": true,
            "allowDigitalDrawing": true,
            "allowPhotoComposition": true,
            "panelLayouts": [
                {"id": "classic_4", "name": "4 Viñetas Clásicas", "grid": "2x2"},
                {"id": "vertical_strip", "name": "Tira Vertical", "grid": "1xN"},
                {"id": "horizontal_strip", "name": "Tira Horizontal", "grid": "Nx1"},
                {"id": "dynamic", "name": "Layout Dinámico", "grid": "variable"}
            ],
            "visualStyles": [
                {"id": "realistic", "name": "Realista"},
                {"id": "cartoon", "name": "Caricatura"},
                {"id": "manga", "name": "Manga/Anime"},
                {"id": "sketch", "name": "Boceto"},
                {"id": "minimalist", "name": "Minimalista"}
            ],
            "colorOptions": ["black_white", "grayscale", "full_color", "sepia", "two_tone"],
            "speechBubbleTypes": ["round", "square", "thought", "shout", "whisper", "narration"],
            "drawingTools": {
                "pencil": true,
                "pen": true,
                "brush": true,
                "eraser": true,
                "colorPicker": true,
                "shapes": ["circle", "rectangle", "line", "arrow"],
                "textTool": true,
                "layers": true,
                "undo_redo": true
            },
            "characters": [
                {"name": "Marie Curie", "description": "Mujer de ~31 años, cabello oscuro recogido, bata de laboratorio"},
                {"name": "Pierre Curie", "description": "Hombre de ~39 años, barba, bata de laboratorio"},
                {"name": "Narrador", "description": "Voz omnisciente que provee contexto"}
            ],
            "settings": [
                {"name": "Laboratorio", "description": "Hangar frío, mesas con equipo, pechblenda"},
                {"name": "Noche oscura", "description": "Laboratorio a oscuras, radio brillando"},
                {"name": "Universidad", "description": "Sorbonne, aulas"},
                {"name": "Hogar Curie", "description": "Apartamento modesto"}
            ]
        }'::jsonb,
        '{
            "storyStructure": {
                "act1_setup": {
                    "panels": [1],
                    "purpose": "Establecer el contexto y el desafío",
                    "description": "Introducción a Marie y Pierre trabajando en el laboratorio con pechblenda"
                },
                "act2_rising_action": {
                    "panels": [2, 3],
                    "purpose": "Mostrar el proceso y las dificultades",
                    "description": "El trabajo tedioso de procesar toneladas de mineral, años de esfuerzo"
                },
                "act3_climax": {
                    "panels": [4],
                    "purpose": "El momento del descubrimiento",
                    "description": "El radio brilla en la oscuridad - momento culminante"
                },
                "act4_resolution": {
                    "panels": [5, 6],
                    "purpose": "Impacto y legado (opcional)",
                    "description": "Aplicaciones médicas y el legado de Marie"
                }
            },
            "storyBeats": [
                {
                    "panel": 1,
                    "title": "El Laboratorio Humilde",
                    "scene": "Marie y Pierre en laboratorio con pechblenda",
                    "action": "observing",
                    "time": "1898, día",
                    "location": "Hangar en Rue Lhomond, París",
                    "visualDescription": "Laboratorio frío y destartalado. Marie y Pierre con batas manchadas examinando mineral oscuro (pechblenda) sobre una mesa. Herramientas científicas del siglo XIX alrededor. Luz entrando por ventanas rotas.",
                    "keyElements": ["pechblenda", "microscopio", "balanza", "frío visible (aliento)"],
                    "suggestedDialogue": {
                        "Marie": "Este mineral contiene algo extraordinario, Pierre. La radiación es demasiado intensa para ser solo uranio.",
                        "Pierre": "Entonces debemos aislarlo, por muy difícil que sea."
                    },
                    "narration": "1898. Marie Curie y su esposo Pierre investigan un mineral llamado pechblenda que emite radiación misteriosa.",
                    "mood": "determination",
                    "colorPalette": "Tonos grises y marrones, luz natural fría"
                },
                {
                    "panel": 2,
                    "title": "La Anomalía",
                    "scene": "Marie descubre anomalía en mediciones de radiación",
                    "action": "discovery",
                    "time": "Día siguiente",
                    "location": "Mismo laboratorio",
                    "visualDescription": "Close-up de Marie mirando electroscopio con expresión de sorpresa y emoción. El dispositivo muestra lectura inesperada. Pierre observando desde atrás con interés.",
                    "keyElements": ["electroscopio", "cuaderno con cálculos", "expresión de eureka"],
                    "suggestedDialogue": {
                        "Marie": "¡Mira estos números! La radiación es cuatro veces más intensa de lo esperado.",
                        "Pierre": "Debe haber un nuevo elemento..."
                    },
                    "narration": "Las mediciones revelan algo inesperado: la pechblenda es más radiactiva que el uranio puro. Debe contener un elemento desconocido.",
                    "mood": "excitement",
                    "colorPalette": "Contraste: luz del instrumento vs sombras del laboratorio"
                },
                {
                    "panel": 3,
                    "title": "Años de Trabajo",
                    "scene": "Montaje de Marie trabajando duro refinando mineral",
                    "action": "perseverance",
                    "time": "1898-1902 (4 años)",
                    "location": "Laboratorio, diferentes estaciones",
                    "visualDescription": "Panel dividido en sub-viñetas mostrando paso del tiempo: Marie removiendo barril de pechblenda, hirviendo soluciones, cristalizando sales. Cambios de estación (nieve afuera, luego sol). Marie cada vez más cansada pero determinada. Montañas de material procesado.",
                    "keyElements": ["barriles de mineral", "calderos hirviendo", "manos agrietadas", "montañas de residuos"],
                    "suggestedDialogue": {
                        "Narrador": "Cuatro años. Ocho toneladas de pechblenda. Trabajo manual extenuante.",
                        "Marie (pensando)": "No puedo rendirme. El secreto está ahí, solo debo seguir buscando."
                    },
                    "narration": "El proceso es brutal: procesar toneladas de mineral tóxico en un hangar sin calefacción. Muchos habrían renunciado, pero Marie persevera.",
                    "mood": "perseverance",
                    "colorPalette": "Tonos oscuros y cansados, iluminación dramática"
                },
                {
                    "panel": 4,
                    "title": "¡Brilla en la Oscuridad!",
                    "scene": "Noche - El radio aislado brilla con luz azul-verde",
                    "action": "triumph",
                    "time": "Diciembre 1898, noche",
                    "location": "Laboratorio a oscuras",
                    "visualDescription": "Laboratorio completamente oscuro. En el centro, un pequeño frasco con radio brillando con intensa luz azul-verde etérea. Marie y Pierre de pie a los lados, sus caras iluminadas por el brillo radiactivo, expresiones de asombro y triunfo. El brillo del radio es el único punto de luz.",
                    "keyElements": ["radio brillante (luz azul-verde)", "oscuridad profunda", "caras iluminadas", "pequeño frasco"],
                    "suggestedDialogue": {
                        "Pierre": "Es... hermoso. Como pequeñas luces de hadas.",
                        "Marie": "Lo logramos, Pierre. Aislamos el radio."
                    },
                    "narration": "15 de diciembre de 1898. Después de cuatro años, Marie y Pierre aislan 0.1 gramos de radio puro. Brilla espontáneamente en la oscuridad.",
                    "mood": "triumph",
                    "colorPalette": "Negro profundo con brillo azul-verde radiante como focal point"
                },
                {
                    "panel": 5,
                    "title": "Medicina del Futuro (Opcional)",
                    "scene": "Aplicación de radio en medicina",
                    "action": "legacy",
                    "time": "Años posteriores",
                    "location": "Hospital",
                    "visualDescription": "Split panel: Arriba - Marie presentando radio a médicos en conferencia. Abajo - Médico usando radioterapia para tratar paciente con tumor. Conexión visual entre el descubrimiento y su aplicación.",
                    "keyElements": ["radio en contenedor", "médicos interesados", "tratamiento médico", "esperanza"],
                    "suggestedDialogue": {
                        "Médico": "Con este ''radio'' podemos atacar tumores sin cirugía invasiva.",
                        "Marie": "La ciencia debe servir a la humanidad."
                    },
                    "narration": "El descubrimiento de Marie revoluciona la medicina. La radioterapia salva miles de vidas.",
                    "mood": "hope",
                    "colorPalette": "Tonos cálidos, iluminación optimista"
                },
                {
                    "panel": 6,
                    "title": "Legado Inmortal (Opcional)",
                    "scene": "Marie mayor, su legado perdura",
                    "action": "reflection",
                    "time": "1925 (Marie a los 58 años)",
                    "location": "Marie en su oficina",
                    "visualDescription": "Marie mayor, sentada en su oficina del Instituto Curie. Detrás de ella, estanterías con libros y un retrato de Pierre (fallecido 1906). Por la ventana, se ve el Instituto Curie moderno. Marie sostiene una muestra de radio, mirándola reflexivamente.",
                    "keyElements": ["Marie mayor", "retrato de Pierre", "Instituto Curie", "muestra de radio", "libros científicos"],
                    "suggestedDialogue": {
                        "Marie (pensando)": "Pierre, lo que comenzamos juntos cambió el mundo. Dos premios Nobel... pero a qué costo.",
                        "Narrador": "Marie Curie: primera mujer en ganar Nobel, única en ganar dos. Su legado inspira a generaciones."
                    },
                    "narration": "Marie Curie falleció en 1934 de anemia aplásica, probablemente causada por exposición a radiación. Pero su legado científico perdura eternamente.",
                    "mood": "bittersweet",
                    "colorPalette": "Tonos sépia nostálgicos, luz suave"
                }
            ],
            "characterEmotions": {
                "joy": ["sonrisa", "ojos brillantes", "postura erguida"],
                "determination": ["ceño fruncido", "mandíbula apretada", "mirada intensa"],
                "exhaustion": ["hombros caídos", "ojeras", "expresión cansada"],
                "triumph": ["brazos levantados", "sonrisa amplia", "lágrimas de alegría"],
                "wonder": ["ojos muy abiertos", "boca entreabierta", "mano en mejilla"]
            },
            "visualTechniques": [
                "Contraste luz/oscuridad para dramatismo",
                "Close-ups para momentos emotivos",
                "Wide shots para contexto y escala",
                "Motion lines para indicar acción",
                "Color simbólico: azul-verde para radio (científico), tonos cálidos para emociones"
            ],
            "rubricDetails": {
                "narrative": {
                    "weight": 25,
                    "criteria": [
                        "Historia clara con principio, desarrollo y conclusión",
                        "Secuencia lógica de eventos",
                        "Transiciones efectivas entre viñetas",
                        "Ritmo narrativo apropiado"
                    ]
                },
                "visual": {
                    "weight": 25,
                    "criteria": [
                        "Composición efectiva en cada viñeta",
                        "Uso de elementos visuales para contar historia",
                        "Expresiones faciales y lenguaje corporal claros",
                        "Consistencia visual entre viñetas"
                    ]
                },
                "accuracy": {
                    "weight": 25,
                    "criteria": [
                        "Detalles históricos correctos (fechas, lugares)",
                        "Representación precisa del proceso científico",
                        "Vestuario y escenarios de época apropiados",
                        "Eventos basados en hechos reales"
                    ]
                },
                "creativity": {
                    "weight": 25,
                    "criteria": [
                        "Originalidad en presentación visual",
                        "Uso creativo de técnicas de cómic",
                        "Estilo artístico único",
                        "Elementos innovadores en diseño"
                    ]
                }
            },
            "assessmentGuidelines": "El cómic será evaluado en cuatro dimensiones iguales (25% cada una): (1) Narrativa clara y cohesiva con estructura dramática, (2) Calidad visual con composición efectiva y expresiones claras, (3) Precisión histórica y científica en detalles y eventos, (4) Creatividad y originalidad en diseño y técnica. Se valorará especialmente la capacidad de contar una historia científica compleja de manera visual y accesible."
        }'::jsonb,
        '{
            "rubric": {
                "narrative": 25,
                "visual": 25,
                "accuracy": 25,
                "creativity": 25
            },
            "sampleEvaluation": {
                "excellent": {
                    "score": 95,
                    "feedback": "Excelente cómic. Tu narrativa visual es clara y emotiva, con excelente uso de composición y secuencia. La historia del descubrimiento está magistralmente contada con detalles históricos precisos. El panel del radio brillando en la oscuridad es particularmente impactante. La creatividad en diseño y estilo artístico es sobresaliente."
                },
                "good": {
                    "score": 80,
                    "feedback": "Buen cómic. La historia se sigue claramente y los detalles históricos son correctos. Para mejorar, trabaja en las expresiones faciales de los personajes y el uso de técnicas visuales como contraste y composición para mayor impacto dramático."
                },
                "average": {
                    "score": 70,
                    "feedback": "Cómic adecuado. Cumples con los requisitos básicos de viñetas y diálogo. Para mejorar, investiga más sobre la historia real, usa técnicas visuales más sofisticadas, y enfócate en contar la historia de manera más visual y menos dependiente del texto."
                }
            }
        }'::jsonb,
        'intermediate', 100, 70,
        50, 75, 3,
        ARRAY[
            'Usa el panel del radio brillando como clímax visual - es tu imagen más dramática',
            'Investiga cómics científicos existentes para inspiración (ej: "Radium Girls")',
            'Las expresiones faciales comunican más que el diálogo - dibuja emociones claramente',
            'Piensa en el flujo visual: el ojo del lector debe moverse naturalmente de panel a panel',
            'Menos texto, más visual: un buen cómic cuenta la historia con imágenes'
        ],
        true, 5,
        ARRAY['pistas', 'vision_lectora']::gamification_system.comodin_type[],
        '{
            "pistas": {"cost": 15, "enabled": true, "description": "Revela técnicas visuales específicas"},
            "vision_lectora": {"cost": 25, "enabled": true, "description": "Muestra ejemplo de panel completado"}
        }'::jsonb,
        500, 100,
        true, 1
    ) ON CONFLICT (module_id, exercise_type, order_index) DO UPDATE SET
        content = EXCLUDED.content,
        config = EXCLUDED.config,
        solution = EXCLUDED.solution,
        hints = EXCLUDED.hints,
        updated_at = gamilit.now_mexico();

    -- ========================================================================
    -- EXERCISE 5.3: VIDEO-CARTA - MENSAJE DE MARIE AL FUTURO
    -- ========================================================================
    INSERT INTO educational_content.exercises (
        module_id, title, subtitle, description, instructions,
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
        'Cápsula del Tiempo Digital',
        'Comunicación a Través del Tiempo',
        'Graba un video (o escribe guión detallado) como Marie Curie en 1925 enviando un mensaje inspirador y reflexivo a las generaciones del siglo XXI. Captura su sabiduría, esperanzas y advertencias.',
        'Imagina que eres Marie Curie en 1925, a los 58 años, con dos premios Nobel y décadas de experiencia. Graba un video de 2-5 minutos (o escribe guión de 400-600 palabras) dirigido a los jóvenes del siglo XXI. Habla desde tu perspectiva sobre educación, ciencia, igualdad, responsabilidad, y tu legado. Sé auténtica, inspiradora y reflexiva.',
        'video_carta', 3,
        '{
            "videoRequired": false,
            "scriptAlternative": true,
            "videoOptional": true,
            "minDuration": 120,
            "maxDuration": 300,
            "minWords": 400,
            "maxWords": 600,
            "allowedFormats": ["mp4", "webm", "mov", "script"],
            "recordingOptions": {
                "webcam": true,
                "screenRecord": false,
                "audioOnly": true,
                "scriptOnly": true
            },
            "technicalRequirements": {
                "resolution": "720p minimum",
                "audioQuality": "clear and audible",
                "lighting": "face visible",
                "background": "neutral or period-appropriate"
            },
            "deliveryGuidelines": {
                "pace": "moderate (120-150 words per minute)",
                "tone": "warm, wise, inspirational",
                "eyeContact": "look at camera (as if at audience)",
                "posture": "seated or standing, confident",
                "gestures": "natural, not distracting",
                "costume": "period-appropriate or neutral"
            },
            "editingAllowed": {
                "cuts": true,
                "transitions": "simple",
                "music": "subtle background music allowed",
                "subtitles": "encouraged",
                "effects": "minimal, not distracting"
            }
        }'::jsonb,
        '{
            "context": {
                "year": 1925,
                "marieAge": 58,
                "location": "Instituto Curie, París",
                "situation": "Marie está en la cúspide de su carrera pero su salud se deteriora por exposición a radiación",
                "achievements": [
                    "Primera mujer en ganar Nobel (Física, 1903)",
                    "Primera persona en ganar dos Nobel (Química, 1911)",
                    "Única persona en ganar Nobel en dos ciencias diferentes",
                    "Fundadora del Instituto Curie",
                    "Pionera en radioterapia",
                    "Directora del Servicio de Radiología durante WWI"
                ],
                "challenges": [
                    "Discriminación como mujer en ciencia",
                    "Pobreza extrema durante investigación",
                    "Muerte de Pierre en 1906 (atropellado)",
                    "Escándalo de relación con Paul Langevin (1911)",
                    "Rechazo inicial de Academia Francesa de Ciencias",
                    "Salud deteriorada por radiación"
                ],
                "historicalMoment": "Europa se recupera de WWI. Movimiento sufragista. Cambios sociales rápidos. Marie ve cómo la ciencia puede usarse para bien (medicina) o mal (armas)."
            },
            "themes": [
                {
                    "theme": "Educación para Mujeres",
                    "description": "La importancia crucial de la educación sin importar género",
                    "personalExperience": "Marie tuvo que salir de Polonia para estudiar en Sorbonne. Vivió en pobreza extrema para poder educarse.",
                    "message": "La educación es liberación. Las mujeres deben tener las mismas oportunidades que los hombres para desarrollar su potencial intelectual.",
                    "quotes": [
                        "Nada en la vida debe ser temido, solamente comprendido. Ahora es tiempo de comprender más, para temer menos.",
                        "Fui enseñada que el camino del progreso no es ni rápido ni fácil."
                    ]
                },
                {
                    "theme": "Futuro de la Ciencia y Tecnología",
                    "description": "Visión sobre cómo la ciencia transformará el mundo",
                    "personalExperience": "Marie vio cómo su descubrimiento revolucionó la medicina (radioterapia) pero también se usó en armas.",
                    "message": "La ciencia es neutral, pero los científicos tienen responsabilidad ética. Espero que el siglo XXI use conocimiento para curar, no para destruir.",
                    "speculation": "¿Habrá cura para cáncer? ¿Energía limpia de átomos? ¿Viajes espaciales? La ciencia de 2025 será inimaginable para mí, pero espero que sirva a la humanidad."
                },
                {
                    "theme": "Ética Científica y Responsabilidad",
                    "description": "Obligaciones morales de los científicos",
                    "personalExperience": "Marie y Pierre decidieron NO patentar el proceso de extracción de radio, permitiendo que otros lo usaran libremente para investigación médica.",
                    "message": "Los científicos no deben buscar sólo fama o riqueza. La ciencia debe servir al bien común. Con gran poder viene gran responsabilidad.",
                    "warning": "He visto mi descubrimiento salvar vidas con radioterapia, pero también usarse en armas. Jóvenes científicos: consideren siempre las consecuencias éticas de su trabajo."
                },
                {
                    "theme": "Perseverancia Frente a Adversidad",
                    "description": "Importancia de no rendirse ante obstáculos",
                    "personalExperience": "4 años procesando 8 toneladas de pechblenda en hangar helado. Discriminación constante. Muerte de Pierre. Escándalo público. Rechazo de Academia.",
                    "message": "Los obstáculos son inevitables. Lo que importa es cómo respondemos. La perseverancia, no el talento, fue mi verdadera fortaleza.",
                    "encouragement": "Si una chica pobre de Polonia pudo cambiar el mundo, tú también puedes. No permitas que nada te detenga."
                },
                {
                    "theme": "Legado Personal y Profesional",
                    "description": "Qué desea ser recordada y qué espera legar",
                    "personalExperience": "Marie sabe que su exposición a radiación la está matando lentamente, pero no se arrepiente.",
                    "message": "Mi vida fue dedicada a la ciencia. No busqué fama o fortuna. Busqué verdad y conocimiento. Espero que mi trabajo inspire a otras mujeres a seguir carreras científicas.",
                    "legacy": "El Instituto Curie continuará mi trabajo. Mis hijas continuarán mi legado (Irène ganará Nobel en 1935). La radioactividad que descubrí transformará medicina, energía, y comprensión del átomo."
                },
                {
                    "theme": "Amor y Colaboración",
                    "description": "Importancia de colaboración y apoyo mutuo",
                    "personalExperience": "Pierre fue socio científico y romántico. Su muerte en 1906 la devastó pero continuó su trabajo.",
                    "message": "Pierre y yo éramos un equipo perfecto. La ciencia no se hace en aislamiento. Busquen colaboradores que los inspiren y desafíen. El amor y la ciencia no son mutuamente excluyentes."
                }
            ],
            "scriptStructure": {
                "introduction": {
                    "duration": "30 seconds",
                    "purpose": "Establecer quién es y por qué habla",
                    "suggestedContent": "Buenos días jóvenes del siglo XXI. Soy Marie Curie, y les hablo desde el año 1925. Tengo 58 años, dos premios Nobel, y mucho que compartir con ustedes."
                },
                "body_main_message": {
                    "duration": "3-4 minutes",
                    "purpose": "Desarrollar 2-3 temas principales",
                    "structure": [
                        "Tema 1: Elegir un tema (ej: educación para mujeres)",
                        "Anécdota personal relacionada",
                        "Mensaje/consejo para el futuro",
                        "Tema 2: Segundo tema (ej: ética científica)",
                        "Reflexión sobre responsabilidad",
                        "Esperanzas y advertencias"
                    ]
                },
                "conclusion": {
                    "duration": "30 seconds",
                    "purpose": "Mensaje final inspirador",
                    "suggestedContent": "El futuro está en sus manos. Usen el conocimiento sabiamente, con compasión y valentía. Nunca dejen de cuestionar, de aprender, de soñar. Buena suerte, jóvenes del futuro."
                }
            },
            "sampleScript": {
                "title": "Mensaje de Marie Curie al Siglo XXI",
                "wordCount": 487,
                "estimatedDuration": "3 minutes 15 seconds",
                "content": "Buenos días, jóvenes del siglo XXI. Soy Marie Curie, y les hablo desde el año 1925, desde mi laboratorio en el Instituto Curie de París. Tengo 58 años, dos premios Nobel, y décadas de experiencia en un mundo que no siempre fue amable con una mujer científica.\\n\\nPermítanme contarles mi historia, no para glorificarme, sino para inspirarlos. Nací en Polonia bajo ocupación rusa, donde las mujeres no podíamos acceder a universidad. Trabajé años como institutriz, ahorrando cada centavo, para finalmente viajar a París y estudiar en la Sorbonne. Vivía en una buhardilla helada, comiendo pan y té, pero era libre de aprender. Esa libertad no tiene precio.\\n\\nLuego conocí a Pierre. Juntos descubrimos el radio después de cuatro años procesando ocho toneladas de pechblenda en un hangar sin calefacción. Mis manos se agrietaron por el frío y los ácidos. Hubo días donde el cansancio era insoportable. Pero no nos rendimos, porque sabíamos que estábamos tocando algo fundamental sobre la naturaleza del universo.\\n\\nEl radio brillaba en la oscuridad con luz azul-verde, como pequeñas luces de hadas. Era hermoso. Decidimos no patentarlo, permitiendo que otros científicos lo usaran libremente. Esa decisión nos costó millones, pero permitió que la radioterapia salvara miles de vidas. No me arrepiento.\\n\\nPero debo advertirles: la ciencia es una espada de doble filo. Mi descubrimiento cura cáncer, pero también se usa en armas. Ustedes, científicos del siglo XXI, enfrentarán dilemas éticos que ni siquiera puedo imaginar. Les pido: usen el conocimiento sabiamente. Con gran poder viene gran responsabilidad.\\n\\nPierdo a mi amado Pierre en un accidente en 1906. El dolor fue indescriptible. Pero continué nuestro trabajo, porque eso es lo que él hubiera querido. La vida nos golpea, pero no podemos rendirnos. La perseverancia, no el genio, fue mi verdadera fortaleza.\\n\\nA las jóvenes mujeres del futuro: espero que en el siglo XXI tengan las oportunidades que a mí me costaron tanto conseguir. No permitan que nadie les diga que la ciencia no es para ustedes. Yo fui la primera mujer en ganar el Nobel, pero no debo ser la última. Sueñen sin límites.\\n\\nMi cuerpo está débil. La radiación que tanto amé me está matando lentamente. Pero no tengo remordimientos. Di mi vida por la ciencia, y fue una vida bien vivida.\\n\\nJóvenes del siglo XXI: el futuro es suyo. Úsenlo sabiamente. Sean valientes. Sean curiosos. Sean compasivos. Y nunca, nunca dejen de hacer preguntas.\\n\\nCon esperanza y fe en la humanidad,\\nMarie Curie\\nInstituto Curie, París\\n1925"
            },
            "deliveryTips": [
                "Habla como una mujer de 58 años con sabiduría y experiencia, no como joven",
                "Usa pauses para dar peso a momentos emotivos",
                "Tu voz debe transmitir tanto fortaleza como vulnerabilidad",
                "Menciona detalles específicos (pechblenda, hangar helado) para autenticidad",
                "Balancea logros con dificultades - Marie fue humilde pero orgullosa",
                "El acento francés es opcional pero puede agregar autenticidad",
                "Permite que las emociones se muestren: dolor por Pierre, orgullo por descubrimientos",
                "Termina con esperanza - Marie era optimista sobre el futuro"
            ],
            "rubricDetails": {
                "authenticity": {
                    "weight": 25,
                    "criteria": [
                        "Voz y perspectiva auténtica de Marie en 1925",
                        "Detalles biográficos e históricos precisos",
                        "Tono apropiado: sabio, humilde, determinado",
                        "Lenguaje y vocabulario de época cuando apropiado"
                    ]
                },
                "message": {
                    "weight": 25,
                    "criteria": [
                        "Mensaje claro e inspirador",
                        "Temas relevantes bien desarrollados",
                        "Conexión efectiva con audiencia del siglo XXI",
                        "Profundidad de reflexión y sabiduría"
                    ]
                },
                "presentation": {
                    "weight": 25,
                    "criteria": [
                        "Claridad en entrega (audio claro, ritmo apropiado)",
                        "Presencia frente a cámara o calidad de guión",
                        "Estructura lógica (introducción, desarrollo, conclusión)",
                        "Técnica: iluminación, sonido, edición (si video)"
                    ]
                },
                "emotion": {
                    "weight": 25,
                    "criteria": [
                        "Conexión emocional con audiencia",
                        "Expresión auténtica de sentimientos",
                        "Balance entre vulnerabilidad y fortaleza",
                        "Impacto e inspiración final"
                    ]
                }
            },
            "assessmentGuidelines": "La video-carta será evaluada en cuatro dimensiones iguales (25% cada una): (1) Autenticidad de voz y perspectiva de Marie en 1925 con detalles precisos, (2) Claridad y profundidad del mensaje inspirador para el siglo XXI, (3) Calidad de presentación incluyendo estructura, claridad y técnica, (4) Conexión emocional y capacidad de inspirar a la audiencia. Se valorará especialmente la capacidad de transmitir sabiduría, vulnerabilidad y esperanza de manera auténtica y conmovedora."
        }'::jsonb,
        '{
            "rubric": {
                "authenticity": 25,
                "message": 25,
                "presentation": 25,
                "emotion": 25
            },
            "sampleEvaluation": {
                "excellent": {
                    "score": 95,
                    "feedback": "Video-carta excepcional. Capturaste magistralmente la voz de Marie: sabia, humilde, y profundamente humana. Tu mensaje sobre educación y ética científica es poderoso y relevante. La presentación es clara y profesional. Más impresionante, lograste una conexión emocional genuina - tu reflexión sobre Pierre fue conmovedora. El balance entre fortaleza y vulnerabilidad es perfecto."
                },
                "good": {
                    "score": 80,
                    "feedback": "Buen trabajo. Tu mensaje es inspirador y auténtico, con buenos detalles históricos. La presentación es clara. Para mejorar, profundiza más en las emociones - no tengas miedo de mostrar vulnerabilidad. Marie fue fuerte pero también sintió dolor profundamente. Permite que eso se vea en tu entrega."
                },
                "average": {
                    "score": 70,
                    "feedback": "Video-carta adecuada. Cumples con requisitos básicos y tu mensaje es positivo. Para elevar tu trabajo, investiga más sobre la vida de Marie para agregar detalles específicos auténticos. Trabaja en la conexión emocional - habla desde el corazón, no solo desde el guión. Y estructura tu mensaje de manera más cohesiva."
                }
            }
        }'::jsonb,
        'advanced', 100, 70,
        60, 90, 3,
        ARRAY[
            'Lee cartas reales de Marie Curie para capturar su voz y forma de expresarse',
            'Investiga su biografía a fondo: sus logros, sus tragedias, sus valores personales',
            'Piensa: ¿Qué le importaba MÁS a Marie? Educación, ciencia ética, igualdad...',
            'No intentes ser perfecta - Marie era humana. Muestra vulnerabilidad además de fortaleza',
            'Practica tu entrega antes de grabar. El ritmo y las pausas importan tanto como las palabras',
            'Si escribes guión: léelo en voz alta para verificar que suene natural, no académico'
        ],
        true, 5,
        ARRAY['pistas', 'vision_lectora']::gamification_system.comodin_type[],
        '{
            "pistas": {"cost": 15, "enabled": true, "description": "Revela citas reales de Marie Curie"},
            "vision_lectora": {"cost": 25, "enabled": true, "description": "Muestra guión completo de ejemplo"}
        }'::jsonb,
        500, 100,
        true, 1
    ) ON CONFLICT (module_id, exercise_type, order_index) DO UPDATE SET
        content = EXCLUDED.content,
        config = EXCLUDED.config,
        solution = EXCLUDED.solution,
        hints = EXCLUDED.hints,
        updated_at = gamilit.now_mexico();

    -- ========================================================================
    -- UPDATE MODULE METADATA
    -- ========================================================================
    UPDATE educational_content.modules
    SET
        total_exercises = 3,
        metadata = jsonb_set(
            jsonb_set(
                COALESCE(metadata, '{}'::jsonb),
                '{exercises_loaded}',
                'true'::jsonb
            ),
            '{last_seed_update}',
            to_jsonb(gamilit.now_mexico())
        ),
        updated_at = gamilit.now_mexico()
    WHERE id = mod_id;

    RAISE NOTICE '✅ Módulo 5 (MOD-05-PRODUCCION): 3 ejercicios COMPLETOS cargados exitosamente';
    RAISE NOTICE '   - Diario Multimedia: Templates completos, 5 prompts detallados';
    RAISE NOTICE '   - Cómic Digital: 6 story beats, guías visuales, assets';
    RAISE NOTICE '   - Video-Carta: Guión completo, 6 temas, tips de entrega';
    RAISE NOTICE '✅ Module 5 expandido de 97 a 545 líneas (+462%%)';

END $$;
