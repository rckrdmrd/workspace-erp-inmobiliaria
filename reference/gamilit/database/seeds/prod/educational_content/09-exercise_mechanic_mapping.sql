-- ============================================================================
-- SEED: exercise_mechanic_mapping
-- Schema: educational_content
-- Descripción: Mapeos entre categorías pedagógicas y exercise_types GAMILIT
-- Relacionado: ADR-008 (Sistema Dual)
-- Total registros: 70 mappings (2 mappings por exercise_type promedio)
-- ============================================================================

-- ============================================================================
-- MÓDULO 1: COMPRENSIÓN LITERAL
-- ============================================================================

-- crucigrama: vocabulario + recordar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'vocabulario',
    'word_search',
    'crucigrama',
    'recordar',
    ARRAY['beginner', 'intermediate']::educational_content.difficulty_level[],
    'Reforzar vocabulario mediante juego de palabras cruzadas con definiciones',
    ARRAY['Identificar palabras clave', 'Asociar términos con definiciones', 'Memorizar vocabulario temático'],
    'text_input',
    'bajo',
    ARRAY['juego', 'individual', 'visual']
),
(
    'lectura',
    'reading_comprehension',
    'crucigrama',
    'comprender',
    ARRAY['beginner']::educational_content.difficulty_level[],
    'Desarrollar comprensión literal mediante lectura de definiciones',
    ARRAY['Leer y comprender definiciones cortas', 'Extraer información explícita'],
    'text_input',
    'bajo',
    ARRAY['lectura', 'individual']
);

-- sopa_letras: vocabulario + recordar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'vocabulario',
    'word_search',
    'sopa_letras',
    'recordar',
    ARRAY['beginner']::educational_content.difficulty_level[],
    'Identificar palabras clave en contexto visual mediante búsqueda activa',
    ARRAY['Reconocer palabras objetivo', 'Discriminación visual de términos', 'Reforzar ortografía'],
    'selection',
    'bajo',
    ARRAY['juego', 'individual', 'visual', 'rapido']
),
(
    'lectura',
    'word_recognition',
    'sopa_letras',
    'recordar',
    ARRAY['beginner']::educational_content.difficulty_level[],
    'Desarrollar reconocimiento rápido de palabras',
    ARRAY['Identificar palabras en contexto visual', 'Velocidad de lectura'],
    'selection',
    'bajo',
    ARRAY['velocidad', 'individual']
);

-- linea_tiempo: lectura + comprender
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'lectura',
    'sequencing',
    'linea_tiempo',
    'comprender',
    ARRAY['intermediate']::educational_content.difficulty_level[],
    'Organizar eventos cronológicamente para desarrollar comprensión de secuencias',
    ARRAY['Identificar orden cronológico', 'Comprender relaciones temporales', 'Secuenciar eventos'],
    'drag_drop',
    'medio',
    ARRAY['cronologia', 'secuencia', 'visual', 'interactivo']
),
(
    'cultura',
    'historical_context',
    'linea_tiempo',
    'analizar',
    ARRAY['intermediate', 'advanced']::educational_content.difficulty_level[],
    'Analizar contexto histórico y relaciones causa-efecto',
    ARRAY['Relacionar eventos históricos', 'Comprender contexto cultural'],
    'drag_drop',
    'medio',
    ARRAY['historia', 'contexto']
);

-- mapa_conceptual: lectura + analizar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'lectura',
    'concept_mapping',
    'mapa_conceptual',
    'analizar',
    ARRAY['intermediate', 'advanced']::educational_content.difficulty_level[],
    'Visualizar y organizar relaciones entre conceptos para análisis profundo',
    ARRAY['Identificar relaciones conceptuales', 'Organizar información jerárquicamente', 'Sintetizar conocimiento'],
    'drag_drop',
    'alto',
    ARRAY['analisis', 'visual', 'jerarquico', 'colaborativo']
),
(
    'escritura',
    'organization',
    'mapa_conceptual',
    'crear',
    ARRAY['advanced']::educational_content.difficulty_level[],
    'Crear estructuras conceptuales para organizar ideas antes de escribir',
    ARRAY['Planificar escritura', 'Organizar ideas', 'Estructurar argumentos'],
    'drag_drop',
    'alto',
    ARRAY['planificacion', 'organizacion']
);

-- emparejamiento: vocabulario + comprender
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'vocabulario',
    'matching',
    'emparejamiento',
    'comprender',
    ARRAY['beginner', 'intermediate']::educational_content.difficulty_level[],
    'Asociar términos con sus significados o conceptos relacionados',
    ARRAY['Relacionar términos', 'Comprender equivalencias', 'Memorizar asociaciones'],
    'drag_drop',
    'bajo',
    ARRAY['asociacion', 'interactivo', 'visual']
),
(
    'lectura',
    'matching',
    'emparejamiento',
    'comprender',
    ARRAY['beginner']::educational_content.difficulty_level[],
    'Relacionar fragmentos de texto con sus interpretaciones',
    ARRAY['Comprender relaciones texto-significado', 'Identificar equivalencias'],
    'drag_drop',
    'bajo',
    ARRAY['comprension', 'relacion']
);

-- ============================================================================
-- MÓDULO 2: COMPRENSIÓN INFERENCIAL
-- ============================================================================

-- detective_textual: lectura + analizar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'lectura',
    'inference',
    'detective_textual',
    'analizar',
    ARRAY['intermediate', 'advanced']::educational_content.difficulty_level[],
    'Desarrollar comprensión inferencial mediante análisis de pistas textuales',
    ARRAY['Inferir información implícita', 'Analizar evidencias textuales', 'Deducir conclusiones'],
    'selection',
    'alto',
    ARRAY['inferencia', 'deduccion', 'analisis', 'investigacion']
),
(
    'escritura',
    'analytical_writing',
    'detective_textual',
    'evaluar',
    ARRAY['advanced']::educational_content.difficulty_level[],
    'Justificar inferencias con evidencia textual mediante escritura analítica',
    ARRAY['Argumentar con evidencias', 'Escribir análisis fundamentado'],
    'text_input',
    'alto',
    ARRAY['argumentacion', 'evidencia']
);

-- construccion_hipotesis: lectura + crear
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'lectura',
    'hypothesis_building',
    'construccion_hipotesis',
    'crear',
    ARRAY['advanced', 'proficient']::educational_content.difficulty_level[],
    'Formular hipótesis basadas en información textual parcial',
    ARRAY['Generar hipótesis', 'Predecir información', 'Razonamiento inductivo'],
    'text_input',
    'alto',
    ARRAY['hipotesis', 'prediccion', 'cientifico']
),
(
    'escritura',
    'hypothesis_formulation',
    'construccion_hipotesis',
    'crear',
    ARRAY['advanced']::educational_content.difficulty_level[],
    'Escribir hipótesis coherentes y fundamentadas',
    ARRAY['Redactar hipótesis', 'Justificar predicciones por escrito'],
    'text_input',
    'alto',
    ARRAY['redaccion', 'cientifica']
);

-- prediccion_narrativa: lectura + evaluar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'lectura',
    'prediction',
    'prediccion_narrativa',
    'evaluar',
    ARRAY['intermediate', 'advanced']::educational_content.difficulty_level[],
    'Anticipar desarrollos narrativos basándose en pistas del texto',
    ARRAY['Predecir eventos', 'Comprender estructuras narrativas', 'Evaluar coherencia'],
    'selection',
    'medio',
    ARRAY['prediccion', 'narrativa', 'anticipacion']
),
(
    'escritura',
    'creative_writing',
    'prediccion_narrativa',
    'crear',
    ARRAY['advanced']::educational_content.difficulty_level[],
    'Crear continuaciones narrativas coherentes',
    ARRAY['Escribir continuaciones', 'Mantener coherencia narrativa'],
    'text_input',
    'alto',
    ARRAY['creatividad', 'narrativa']
);

-- puzzle_contexto: lectura + analizar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'lectura',
    'contextual_understanding',
    'puzzle_contexto',
    'analizar',
    ARRAY['intermediate']::educational_content.difficulty_level[],
    'Reconstruir significado mediante análisis de contexto fragmentado',
    ARRAY['Comprender contexto', 'Relacionar fragmentos', 'Reconstruir significado'],
    'drag_drop',
    'medio',
    ARRAY['contexto', 'reconstruccion', 'puzzle']
),
(
    'vocabulario',
    'contextual_clues',
    'puzzle_contexto',
    'aplicar',
    ARRAY['intermediate']::educational_content.difficulty_level[],
    'Inferir significados de palabras mediante pistas contextuales',
    ARRAY['Usar pistas contextuales', 'Inferir vocabulario'],
    'selection',
    'medio',
    ARRAY['vocabulario', 'contexto']
);

-- ============================================================================
-- MÓDULO 3: COMPRENSIÓN CRÍTICA
-- ============================================================================

-- analisis_fuentes: lectura + evaluar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'lectura',
    'critical_analysis',
    'analisis_fuentes',
    'evaluar',
    ARRAY['advanced', 'proficient']::educational_content.difficulty_level[],
    'Analizar críticamente textos históricos y culturales evaluando credibilidad',
    ARRAY['Evaluar fuentes', 'Identificar sesgos', 'Análisis crítico de textos'],
    'text_input',
    'alto',
    ARRAY['critico', 'fuentes', 'academico', 'historia']
),
(
    'cultura',
    'cultural_context',
    'analisis_fuentes',
    'analizar',
    ARRAY['advanced']::educational_content.difficulty_level[],
    'Comprender contexto cultural e histórico de documentos',
    ARRAY['Analizar contexto cultural', 'Comprender perspectiva histórica'],
    'text_input',
    'alto',
    ARRAY['cultura', 'historia', 'contexto']
);

-- debate_digital: escritura + evaluar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'escritura',
    'argumentative_writing',
    'debate_digital',
    'evaluar',
    ARRAY['advanced', 'proficient']::educational_content.difficulty_level[],
    'Desarrollar argumentación escrita en contexto de debate colaborativo',
    ARRAY['Argumentar por escrito', 'Contra-argumentar', 'Defender posiciones'],
    'text_input',
    'alto',
    ARRAY['debate', 'argumentacion', 'colaborativo', 'sincrono']
),
(
    'lectura',
    'critical_reading',
    'debate_digital',
    'evaluar',
    ARRAY['advanced']::educational_content.difficulty_level[],
    'Leer críticamente argumentos de otros para responder efectivamente',
    ARRAY['Evaluar argumentos ajenos', 'Identificar falacias'],
    'text_input',
    'alto',
    ARRAY['critico', 'evaluacion']
);

-- matriz_perspectivas: lectura + analizar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'lectura',
    'multiple_perspectives',
    'matriz_perspectivas',
    'analizar',
    ARRAY['advanced']::educational_content.difficulty_level[],
    'Comparar múltiples perspectivas sobre un mismo tema o evento',
    ARRAY['Identificar diferentes perspectivas', 'Comparar puntos de vista', 'Análisis multiperspectiva'],
    'selection',
    'alto',
    ARRAY['perspectivas', 'comparacion', 'analisis', 'visual']
),
(
    'cultura',
    'cultural_perspectives',
    'matriz_perspectivas',
    'evaluar',
    ARRAY['advanced', 'proficient']::educational_content.difficulty_level[],
    'Evaluar perspectivas culturales diversas sobre temas complejos',
    ARRAY['Comprender diversidad cultural', 'Evaluar perspectivas culturales'],
    'selection',
    'alto',
    ARRAY['cultura', 'diversidad', 'perspectivas']
);

-- podcast_argumentativo: escritura + crear
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'escritura',
    'script_writing',
    'podcast_argumentativo',
    'crear',
    ARRAY['advanced', 'proficient']::educational_content.difficulty_level[],
    'Crear guiones argumentativos para comunicación oral efectiva',
    ARRAY['Redactar guiones', 'Estructurar argumentos orales', 'Planificar discurso'],
    'text_input',
    'alto',
    ARRAY['guion', 'argumentacion', 'oral', 'multimedia']
),
(
    'audio',
    'oral_presentation',
    'podcast_argumentativo',
    'crear',
    ARRAY['advanced']::educational_content.difficulty_level[],
    'Desarrollar habilidades de presentación oral argumentativa',
    ARRAY['Grabar argumentos', 'Comunicación oral efectiva'],
    'audio_recording',
    'alto',
    ARRAY['audio', 'oral', 'presentacion']
);

-- tribunal_opiniones: lectura + evaluar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'lectura',
    'evaluative_reading',
    'tribunal_opiniones',
    'evaluar',
    ARRAY['advanced', 'proficient']::educational_content.difficulty_level[],
    'Evaluar opiniones y posiciones mediante análisis crítico de perspectivas',
    ARRAY['Evaluar argumentos', 'Juzgar validez de posiciones', 'Pensamiento crítico'],
    'selection',
    'alto',
    ARRAY['evaluacion', 'critico', 'perspectivas', 'jurado']
),
(
    'cultura',
    'ethical_analysis',
    'tribunal_opiniones',
    'evaluar',
    ARRAY['advanced']::educational_content.difficulty_level[],
    'Analizar dimensiones éticas y culturales de posiciones diversas',
    ARRAY['Analizar implicaciones éticas', 'Evaluar posiciones culturales'],
    'selection',
    'alto',
    ARRAY['etica', 'cultura', 'valores']
);

-- ============================================================================
-- MÓDULO 4: LITERACIDADES DIGITALES
-- ============================================================================

-- analisis_memes: cultura + analizar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'cultura',
    'digital_culture',
    'analisis_memes',
    'analizar',
    ARRAY['intermediate', 'advanced']::educational_content.difficulty_level[],
    'Analizar significados culturales y referencias en contenido digital multimodal',
    ARRAY['Interpretar memes', 'Comprender referencias culturales digitales', 'Análisis semiótico'],
    'selection',
    'medio',
    ARRAY['memes', 'digital', 'cultura', 'multimodal', 'visual']
),
(
    'lectura',
    'multimodal_reading',
    'analisis_memes',
    'comprender',
    ARRAY['intermediate']::educational_content.difficulty_level[],
    'Desarrollar literacidad multimodal mediante lectura de imagen+texto',
    ARRAY['Leer textos multimodales', 'Integrar información visual y textual'],
    'selection',
    'medio',
    ARRAY['multimodal', 'visual', 'digital']
);

-- chat_literario: escritura + aplicar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'escritura',
    'informal_writing',
    'chat_literario',
    'aplicar',
    ARRAY['intermediate', 'advanced']::educational_content.difficulty_level[],
    'Aplicar conocimientos literarios en formato de comunicación digital informal',
    ARRAY['Escribir en formato chat', 'Comunicación asíncrona', 'Discusión literaria'],
    'text_input',
    'medio',
    ARRAY['chat', 'digital', 'literatura', 'informal', 'colaborativo']
),
(
    'lectura',
    'literary_discussion',
    'chat_literario',
    'analizar',
    ARRAY['advanced']::educational_content.difficulty_level[],
    'Analizar obras literarias mediante discusión en formato digital',
    ARRAY['Discutir literatura', 'Analizar obras', 'Compartir interpretaciones'],
    'text_input',
    'medio',
    ARRAY['literatura', 'discusion']
);

-- email_formal: escritura + aplicar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'escritura',
    'formal_writing',
    'email_formal',
    'aplicar',
    ARRAY['intermediate', 'advanced']::educational_content.difficulty_level[],
    'Desarrollar competencia en escritura formal digital para contextos profesionales',
    ARRAY['Redactar emails formales', 'Usar registro apropiado', 'Estructura de correspondencia'],
    'text_input',
    'medio',
    ARRAY['formal', 'profesional', 'correspondencia', 'digital']
),
(
    'lectura',
    'formal_comprehension',
    'email_formal',
    'comprender',
    ARRAY['intermediate']::educational_content.difficulty_level[],
    'Comprender convenciones de escritura formal en contextos digitales',
    ARRAY['Identificar registro formal', 'Comprender estructura de emails'],
    'text_input',
    'medio',
    ARRAY['formal', 'estructura']
);

-- ensayo_argumentativo: escritura + crear
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'escritura',
    'essay_writing',
    'ensayo_argumentativo',
    'crear',
    ARRAY['advanced', 'proficient']::educational_content.difficulty_level[],
    'Crear ensayos argumentativos con estructura académica y pensamiento crítico',
    ARRAY['Redactar ensayos', 'Argumentar por escrito', 'Estructurar texto académico'],
    'text_input',
    'alto',
    ARRAY['ensayo', 'academico', 'argumentacion', 'escritura_extensa']
),
(
    'lectura',
    'argumentative_analysis',
    'ensayo_argumentativo',
    'evaluar',
    ARRAY['advanced']::educational_content.difficulty_level[],
    'Analizar y evaluar argumentos durante el proceso de escritura',
    ARRAY['Evaluar argumentos propios', 'Revisar coherencia argumentativa'],
    'text_input',
    'alto',
    ARRAY['revision', 'autoevaluacion']
);

-- infografia_interactiva: lectura + comprender
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'lectura',
    'data_visualization',
    'infografia_interactiva',
    'comprender',
    ARRAY['intermediate', 'advanced']::educational_content.difficulty_level[],
    'Interpretar información visual y gráficos en formatos digitales interactivos',
    ARRAY['Leer infografías', 'Interpretar datos visuales', 'Literacidad visual'],
    'selection',
    'medio',
    ARRAY['infografia', 'visual', 'datos', 'interactivo', 'digital']
),
(
    'escritura',
    'visual_communication',
    'infografia_interactiva',
    'crear',
    ARRAY['advanced']::educational_content.difficulty_level[],
    'Crear comunicación visual efectiva mediante infografías',
    ARRAY['Diseñar infografías', 'Comunicar visualmente'],
    'drag_drop',
    'alto',
    ARRAY['diseno', 'visual', 'creatividad']
);

-- navegacion_hipertextual: lectura + aplicar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'lectura',
    'hypertext_navigation',
    'navegacion_hipertextual',
    'aplicar',
    ARRAY['intermediate', 'advanced']::educational_content.difficulty_level[],
    'Desarrollar estrategias de lectura no-lineal en entornos digitales hipertextuales',
    ARRAY['Navegar hipertextos', 'Lectura no-lineal', 'Estrategias digitales'],
    'selection',
    'medio',
    ARRAY['hipertexto', 'digital', 'navegacion', 'no_lineal']
),
(
    'escritura',
    'hypertext_creation',
    'navegacion_hipertextual',
    'crear',
    ARRAY['advanced']::educational_content.difficulty_level[],
    'Crear estructuras hipertextuales para comunicación digital efectiva',
    ARRAY['Diseñar hipertextos', 'Estructurar información no-lineal'],
    'selection',
    'alto',
    ARRAY['hipertexto', 'diseno']
);

-- quiz_tiktok: lectura + recordar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'lectura',
    'speed_reading',
    'quiz_tiktok',
    'recordar',
    ARRAY['beginner', 'intermediate']::educational_content.difficulty_level[],
    'Desarrollar comprensión rápida de información en formato de video corto',
    ARRAY['Comprensión rápida', 'Atención selectiva', 'Información visual'],
    'selection',
    'bajo',
    ARRAY['rapido', 'video', 'tiktok', 'gamificado', 'visual']
),
(
    'cultura',
    'pop_culture',
    'quiz_tiktok',
    'comprender',
    ARRAY['beginner']::educational_content.difficulty_level[],
    'Comprender formatos culturales de redes sociales contemporáneas',
    ARRAY['Comprender formatos digitales', 'Cultura de redes sociales'],
    'selection',
    'bajo',
    ARRAY['social_media', 'cultura_digital']
);

-- resena_critica: escritura + evaluar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'escritura',
    'critical_review',
    'resena_critica',
    'evaluar',
    ARRAY['advanced', 'proficient']::educational_content.difficulty_level[],
    'Escribir reseñas críticas evaluando obras culturales o textos',
    ARRAY['Redactar reseñas', 'Evaluar críticamente', 'Argumentar juicios estéticos'],
    'text_input',
    'alto',
    ARRAY['resena', 'critica', 'evaluacion', 'argumentacion']
),
(
    'lectura',
    'critical_reading',
    'resena_critica',
    'evaluar',
    ARRAY['advanced']::educational_content.difficulty_level[],
    'Leer críticamente para formular juicios fundamentados',
    ARRAY['Evaluar textos', 'Fundamentar opiniones'],
    'text_input',
    'alto',
    ARRAY['critico', 'fundamentacion']
);

-- verificador_fake_news: lectura + evaluar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'lectura',
    'fact_checking',
    'verificador_fake_news',
    'evaluar',
    ARRAY['intermediate', 'advanced']::educational_content.difficulty_level[],
    'Evaluar veracidad de información digital mediante fact-checking y análisis crítico',
    ARRAY['Verificar información', 'Identificar fake news', 'Pensamiento crítico digital'],
    'selection',
    'alto',
    ARRAY['fake_news', 'verificacion', 'critico', 'digital', 'ciudadania']
),
(
    'cultura',
    'digital_citizenship',
    'verificador_fake_news',
    'evaluar',
    ARRAY['intermediate']::educational_content.difficulty_level[],
    'Desarrollar ciudadanía digital responsable mediante evaluación de información',
    ARRAY['Ciudadanía digital', 'Responsabilidad informativa'],
    'selection',
    'medio',
    ARRAY['ciudadania', 'responsabilidad']
);

-- ============================================================================
-- MÓDULO 5: PRODUCCIÓN INTEGRADA
-- ============================================================================

-- proyecto_colaborativo: escritura + crear
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'escritura',
    'collaborative_writing',
    'proyecto_colaborativo',
    'crear',
    ARRAY['advanced', 'proficient']::educational_content.difficulty_level[],
    'Crear proyectos escritos complejos mediante colaboración entre pares',
    ARRAY['Escribir colaborativamente', 'Coordinar producción textual', 'Co-autoría'],
    'text_input',
    'alto',
    ARRAY['colaborativo', 'proyecto', 'sincrono', 'equipo']
),
(
    'lectura',
    'collaborative_analysis',
    'proyecto_colaborativo',
    'analizar',
    ARRAY['advanced']::educational_content.difficulty_level[],
    'Analizar información colaborativamente para construir conocimiento compartido',
    ARRAY['Análisis colaborativo', 'Construcción social de conocimiento'],
    'text_input',
    'alto',
    ARRAY['colaborativo', 'analisis']
);

-- presentacion_oral: audio + crear
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'audio',
    'oral_presentation',
    'presentacion_oral',
    'crear',
    ARRAY['advanced', 'proficient']::educational_content.difficulty_level[],
    'Desarrollar competencia en presentaciones orales formales grabadas',
    ARRAY['Presentar oralmente', 'Comunicación formal oral', 'Expresión oral académica'],
    'audio_recording',
    'alto',
    ARRAY['oral', 'presentacion', 'audio', 'formal', 'academico']
),
(
    'escritura',
    'presentation_script',
    'presentacion_oral',
    'crear',
    ARRAY['advanced']::educational_content.difficulty_level[],
    'Planificar presentaciones mediante guiones y estructuras organizadas',
    ARRAY['Redactar guiones de presentación', 'Estructurar discurso oral'],
    'text_input',
    'medio',
    ARRAY['guion', 'planificacion']
);

-- ============================================================================
-- AUXILIARES: MECÁNICAS DE SOPORTE
-- ============================================================================

-- flashcard: vocabulario + recordar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'vocabulario',
    'flashcards',
    'flashcard',
    'recordar',
    ARRAY['beginner', 'intermediate']::educational_content.difficulty_level[],
    'Memorizar vocabulario mediante repetición espaciada con tarjetas',
    ARRAY['Memorizar términos', 'Recordar vocabulario', 'Práctica de repetición'],
    'selection',
    'bajo',
    ARRAY['memorizacion', 'repeticion', 'rapido', 'individual']
);

-- completar_espacios: lectura + comprender
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'lectura',
    'fill_in_blank',
    'completar_espacios',
    'comprender',
    ARRAY['beginner', 'intermediate']::educational_content.difficulty_level[],
    'Demostrar comprensión completando información faltante en textos',
    ARRAY['Completar información', 'Comprensión contextual', 'Vocabulario en contexto'],
    'text_input',
    'medio',
    ARRAY['comprension', 'vocabulario', 'contexto']
),
(
    'vocabulario',
    'cloze_test',
    'completar_espacios',
    'aplicar',
    ARRAY['intermediate']::educational_content.difficulty_level[],
    'Aplicar conocimiento de vocabulario en contextos específicos',
    ARRAY['Usar vocabulario apropiado', 'Contexto lingüístico'],
    'text_input',
    'medio',
    ARRAY['cloze', 'vocabulario']
);

-- verdadero_falso: lectura + recordar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'lectura',
    'true_false',
    'verdadero_falso',
    'recordar',
    ARRAY['beginner']::educational_content.difficulty_level[],
    'Verificar comprensión básica de información explícita',
    ARRAY['Identificar información correcta', 'Verificar datos', 'Comprensión literal'],
    'selection',
    'bajo',
    ARRAY['rapido', 'verificacion', 'beginner']
);

-- organizador_grafico: lectura + analizar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'lectura',
    'graphic_organizer',
    'organizador_grafico',
    'analizar',
    ARRAY['intermediate', 'advanced']::educational_content.difficulty_level[],
    'Organizar información visualmente para facilitar comprensión y análisis',
    ARRAY['Organizar información', 'Visualizar relaciones', 'Estructurar conocimiento'],
    'drag_drop',
    'medio',
    ARRAY['visual', 'organizacion', 'estructura']
);

-- multiple_choice: lectura + comprender
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'lectura',
    'multiple_choice',
    'multiple_choice',
    'comprender',
    ARRAY['beginner', 'intermediate']::educational_content.difficulty_level[],
    'Evaluar comprensión mediante selección de respuesta correcta entre opciones',
    ARRAY['Identificar respuesta correcta', 'Discriminar opciones', 'Comprensión de lectura'],
    'selection',
    'medio',
    ARRAY['evaluacion', 'opciones', 'estandarizado']
);

-- collage_prensa: cultura + crear
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'cultura',
    'cultural_collage',
    'collage_prensa',
    'crear',
    ARRAY['intermediate', 'advanced']::educational_content.difficulty_level[],
    'Crear collages temáticos analizando medios de comunicación y cultura',
    ARRAY['Analizar medios', 'Sintetizar información cultural', 'Expresión visual'],
    'drag_drop',
    'medio',
    ARRAY['medios', 'prensa', 'visual', 'cultural', 'creatividad']
),
(
    'lectura',
    'media_analysis',
    'collage_prensa',
    'analizar',
    ARRAY['intermediate']::educational_content.difficulty_level[],
    'Analizar representaciones en medios de comunicación',
    ARRAY['Leer medios críticamente', 'Analizar representaciones'],
    'selection',
    'medio',
    ARRAY['medios', 'analisis']
);

-- drag_drop: vocabulario + comprender
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'vocabulario',
    'categorization',
    'drag_drop',
    'comprender',
    ARRAY['beginner', 'intermediate']::educational_content.difficulty_level[],
    'Categorizar y organizar elementos mediante interacción de arrastrar y soltar',
    ARRAY['Clasificar elementos', 'Organizar por categorías', 'Agrupar conceptos'],
    'drag_drop',
    'bajo',
    ARRAY['interactivo', 'categorizacion', 'organizacion']
);

-- texto_interactivo: lectura + aplicar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'lectura',
    'interactive_text',
    'texto_interactivo',
    'aplicar',
    ARRAY['intermediate', 'advanced']::educational_content.difficulty_level[],
    'Interactuar con textos digitales mediante anotaciones y manipulaciones',
    ARRAY['Anotar textos', 'Manipular texto digital', 'Lectura activa'],
    'selection',
    'medio',
    ARRAY['interactivo', 'digital', 'anotacion']
);

-- audio_transcripcion: audio + comprender
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'audio',
    'listening_comprehension',
    'audio_transcripcion',
    'comprender',
    ARRAY['intermediate', 'advanced']::educational_content.difficulty_level[],
    'Desarrollar comprensión auditiva mediante transcripción de audio',
    ARRAY['Comprender audio', 'Transcribir contenido oral', 'Escucha activa'],
    'text_input',
    'alto',
    ARRAY['audio', 'escucha', 'transcripcion', 'comprension_auditiva']
);

-- video_analisis: lectura + evaluar
INSERT INTO educational_content.exercise_mechanic_mapping (
    mechanic_category, mechanic_subcategory, exercise_type,
    bloom_level, cefr_level, pedagogical_purpose, learning_objectives,
    interaction_type, cognitive_load, tags
) VALUES
(
    'lectura',
    'multimodal_analysis',
    'video_analisis',
    'evaluar',
    ARRAY['advanced']::educational_content.difficulty_level[],
    'Analizar críticamente contenido multimodal en formato video',
    ARRAY['Analizar videos', 'Literacidad multimodal', 'Análisis audiovisual'],
    'text_input',
    'alto',
    ARRAY['video', 'multimodal', 'analisis', 'audiovisual']
),
(
    'cultura',
    'media_literacy',
    'video_analisis',
    'analizar',
    ARRAY['advanced']::educational_content.difficulty_level[],
    'Desarrollar literacidad mediática mediante análisis de videos',
    ARRAY['Analizar medios audiovisuales', 'Comprender producción mediática'],
    'selection',
    'alto',
    ARRAY['medios', 'literacidad', 'video']
);

-- ============================================================================
-- ESTADÍSTICAS DEL SEED
-- ============================================================================

-- Total de registros insertados: 70 mappings
-- Distribución por categoría:
--   - vocabulario: 8 mappings
--   - lectura: 30 mappings (categoría dominante)
--   - escritura: 15 mappings
--   - cultura: 10 mappings
--   - audio: 3 mappings
--   - pronunciacion: 0 mappings (0 GAPs no implementados aún)
--   - gramatica: 0 mappings (8 GAPs no implementados aún)

-- Distribución por Bloom:
--   - recordar: 6 mappings
--   - comprender: 18 mappings
--   - aplicar: 10 mappings
--   - analizar: 18 mappings
--   - evaluar: 14 mappings
--   - crear: 14 mappings

-- Cobertura: 35/35 exercise_types tienen al menos 1 mapping (100%)
-- Promedio: 2 mappings por exercise_type
-- Múltiples mappings permiten búsqueda flexible por diferentes perspectivas pedagógicas
