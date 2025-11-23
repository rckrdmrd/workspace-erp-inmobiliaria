-- ============================================================================
-- SEED: Media Files for Marie Curie Content
-- ============================================================================
-- Descripción: Archivos multimedia relacionados con Marie Curie para
--              enriquecer el contenido educativo (imágenes, videos, audio)
-- Schema: content_management
-- Tablas: media_files
-- Prioridad: 2
-- Dependencias: Schema content_management debe existir
-- ============================================================================

SET search_path TO content_management, public;

-- ============================================================================
-- MEDIA FILES: Imágenes, Videos, y Audio de Marie Curie
-- ============================================================================

INSERT INTO content_management.media_files (
    filename,
    folder_path,
    file_extension,
    mime_type,
    file_size_bytes,
    title,
    description,
    alt_text,
    tags,
    is_active,
    metadata,
    created_at,
    updated_at
) VALUES

-- ============================================================================
-- IMÁGENES: Fotografías históricas de Marie Curie
-- ============================================================================

(
    'marie-curie-portrait-1903.jpg',
    '/media/images/marie-curie/marie-curie-portrait-1903.jpg',
    'image',
    'image/jpeg',
    245678,
    'Retrato de Marie Curie (1903)',
    'Fotografía oficial de Marie Curie tomada en 1903, año de su primer Premio Nobel de Física. Marie aparece con vestimenta formal de la época, mostrando la dignidad y seriedad que caracterizaban su presencia pública. Esta imagen es icónica y representa el momento en que se convirtió en la primera mujer en ganar un Premio Nobel.',
    'Retrato en blanco y negro de Marie Curie en 1903, mirando directamente a la cámara con expresión seria, vestida con ropa formal de principios del siglo XX',
    ARRAY['Marie Curie', 'Retrato', '1903', 'Nobel', 'Fotografía Histórica', 'Mujer Científica']::text[],
    'active',
    '{
        "year": 1903,
        "photographer": "Desconocido",
        "source": "Dominio Público",
        "copyright": "Public Domain",
        "dimensions": {
            "width": 800,
            "height": 1000,
            "unit": "pixels"
        },
        "historical_context": "Tomada el año de su primer Premio Nobel de Física, compartido con Pierre Curie y Henri Becquerel",
        "location": "París, Francia",
        "quality": "alta",
        "format_original": "negativo de vidrio",
        "educational_use": true,
        "notable_features": ["Primera mujer Nobel", "Vestimenta victoriana", "Expresión determinada"]
    }'::jsonb,
    NOW(),
    NOW()
),

(
    'marie-pierre-curie-laboratory.jpg',
    '/media/images/marie-curie/marie-pierre-curie-laboratory.jpg',
    'image',
    'image/jpeg',
    312456,
    'Marie y Pierre Curie en su laboratorio',
    'Marie y Pierre Curie trabajando juntos en su laboratorio improvisado de París. Esta fotografía captura la colaboración científica extraordinaria entre los dos científicos. Se puede observar el equipamiento científico de la época y las condiciones modestas en las que realizaron descubrimientos revolucionarios.',
    'Marie y Pierre Curie en su laboratorio, ambos inclinados sobre una mesa de trabajo manipulando equipamiento científico, rodeados de instrumentos y frascos',
    ARRAY['Marie Curie', 'Pierre Curie', 'Laboratorio', 'Investigación', 'Colaboración Científica', 'Pechblenda']::text[],
    'active',
    '{
        "year": 1898,
        "year_approx": true,
        "location": "París, Francia",
        "specific_location": "Cobertizo de la École de Physique et Chimie",
        "source": "Dominio Público",
        "copyright": "Public Domain",
        "dimensions": {
            "width": 1200,
            "height": 800,
            "unit": "pixels"
        },
        "historical_context": "Período de descubrimiento del Radio y Polonio",
        "visible_equipment": ["Electrómetro", "Frascos de vidrio", "Mesa de trabajo"],
        "educational_use": true,
        "notable_features": ["Condiciones laborales modestas", "Colaboración igualitaria", "Equipamiento improvisado"]
    }'::jsonb,
    NOW(),
    NOW()
),

(
    'marie-curie-sorbonne-lecture.jpg',
    '/media/images/marie-curie/marie-curie-sorbonne-lecture.jpg',
    'image',
    'image/jpeg',
    278934,
    'Marie Curie dando clase en la Sorbona',
    'Fotografía de Marie Curie como profesora en la Universidad de la Sorbona, la primera mujer en ocupar una cátedra en esta prestigiosa institución. Se la ve frente a una pizarra con ecuaciones, demostrando su rol como educadora además de investigadora.',
    'Marie Curie de pie junto a una pizarra con fórmulas científicas, vestida formalmente, en un aula de la Sorbona',
    ARRAY['Marie Curie', 'Sorbona', 'Profesora', 'Educación', 'Primera Mujer', 'Universidad']::text[],
    'active',
    '{
        "year": 1906,
        "year_range": "1906-1910",
        "location": "Universidad de la Sorbona, París",
        "source": "Dominio Público",
        "copyright": "Public Domain",
        "dimensions": {
            "width": 900,
            "height": 700,
            "unit": "pixels"
        },
        "historical_significance": "Primera mujer profesora en la Sorbona en 650 años de historia",
        "context": "Asumió la cátedra de Pierre Curie después de su muerte en 1906",
        "educational_use": true,
        "notable_features": ["Pizarra con ecuaciones", "Postura profesoral", "Aula histórica"]
    }'::jsonb,
    NOW(),
    NOW()
),

(
    'marie-curie-radium-glowing.jpg',
    '/media/images/marie-curie/marie-curie-radium-glowing.jpg',
    'image',
    'image/jpeg',
    198234,
    'Marie Curie observando el brillo del Radio',
    'Recreación artística basada en descripciones históricas de Marie Curie observando tubos de ensayo con radio en la oscuridad. El radio emitía un brillo azul-verdoso natural que fascinaba a los Curie, aunque no conocían los peligros de la radiación.',
    'Imagen artística de Marie Curie en la oscuridad observando tubos de ensayo que emiten un brillo fosforescente azul-verdoso',
    ARRAY['Marie Curie', 'Radio', 'Fosforescencia', 'Descubrimiento', 'Noche', 'Laboratorio']::text[],
    'active',
    '{
        "type": "recreación artística",
        "based_on": "Descripciones históricas de los Curie",
        "year_depicted": 1898,
        "source": "Ilustración educativa",
        "copyright": "Uso educativo permitido",
        "dimensions": {
            "width": 1024,
            "height": 768,
            "unit": "pixels"
        },
        "historical_accuracy": "Alta - basada en diarios y cartas de Marie",
        "educational_value": "Ilustra el descubrimiento y las propiedades del radio",
        "safety_note": "Esta práctica era peligrosa - hoy sabemos que la radiación requiere protección",
        "notable_features": ["Brillo fosforescente del radio", "Oscuridad del laboratorio", "Fascinación científica"]
    }'::jsonb,
    NOW(),
    NOW()
),

(
    'marie-curie-nobel-ceremony-1903.jpg',
    '/media/images/marie-curie/marie-curie-nobel-ceremony-1903.jpg',
    'image',
    'image/jpeg',
    289456,
    'Ceremonia Premio Nobel 1903',
    'Fotografía conmemorativa relacionada con el Premio Nobel de Física de 1903. Marie y Pierre Curie no asistieron a la ceremonia original por enfermedad y trabajo, pero esta imagen documenta el reconocimiento histórico.',
    'Fotografía formal relacionada con la ceremonia del Premio Nobel de Física 1903',
    ARRAY['Marie Curie', 'Pierre Curie', 'Premio Nobel', 'Física', '1903', 'Ceremonia']::text[],
    'active',
    '{
        "year": 1903,
        "event": "Premio Nobel de Física 1903",
        "recipients": ["Marie Curie", "Pierre Curie", "Henri Becquerel"],
        "source": "Archivos Nobel",
        "copyright": "Dominio Público",
        "dimensions": {
            "width": 1100,
            "height": 850,
            "unit": "pixels"
        },
        "historical_note": "Los Curie no asistieron a la ceremonia original en diciembre 1903",
        "significance": "Primera mujer en ganar Premio Nobel",
        "educational_use": true
    }'::jsonb,
    NOW(),
    NOW()
),

(
    'marie-curie-wwi-xray-vehicle.jpg',
    '/media/images/marie-curie/marie-curie-wwi-xray-vehicle.jpg',
    'image',
    'image/jpeg',
    334567,
    'Marie Curie con vehículo de rayos X (Petit Curie)',
    'Marie Curie junto a una de las unidades móviles de radiología que equipó durante la Primera Guerra Mundial. Estos "petits Curies" llevaban equipamiento de rayos X a hospitales de campaña cerca del frente de batalla.',
    'Marie Curie de pie junto a un vehículo automóvil equipado con máquina de rayos X, durante la Primera Guerra Mundial',
    ARRAY['Marie Curie', 'Primera Guerra Mundial', 'Rayos X', 'Petit Curie', 'Servicio Humanitario', 'Medicina']::text[],
    'active',
    '{
        "year": 1914,
        "year_range": "1914-1918",
        "period": "Primera Guerra Mundial",
        "location": "Francia",
        "source": "Archivos de guerra",
        "copyright": "Dominio Público",
        "dimensions": {
            "width": 1150,
            "height": 900,
            "unit": "pixels"
        },
        "historical_context": "Marie equipó 20 unidades móviles y 200 puestos fijos de radiología",
        "impact": "Más de 1 millón de soldados radiografiados",
        "educational_value": "Demuestra aplicación práctica de la ciencia para ayudar a la humanidad",
        "notable_features": ["Vehículo equipado", "Equipo de rayos X portátil", "Compromiso humanitario"]
    }'::jsonb,
    NOW(),
    NOW()
),

-- ============================================================================
-- DIAGRAMAS: Ilustraciones educativas
-- ============================================================================

(
    'periodic-table-curie-elements.svg',
    '/media/diagrams/periodic-table-curie-elements.svg',
    'image',
    'image/svg+xml',
    45678,
    'Tabla Periódica: Radio (Ra) y Polonio (Po)',
    'Tabla periódica de los elementos con los elementos descubiertos por Marie Curie claramente destacados: Polonio (Po, elemento 84) y Radio (Ra, elemento 88). Incluye información básica sobre cada elemento: número atómico, símbolo, masa atómica, y año de descubrimiento.',
    'Tabla periódica de elementos químicos con el Polonio (Po) y el Radio (Ra) resaltados en color diferente, mostrando sus propiedades básicas',
    ARRAY['Tabla Periódica', 'Radio', 'Polonio', 'Química', 'Elementos', 'Descubrimientos']::text[],
    'active',
    '{
        "type": "diagrama educativo",
        "format": "SVG vectorial",
        "elements_highlighted": [
            {
                "symbol": "Po",
                "name": "Polonio",
                "atomic_number": 84,
                "discoverer": "Marie Curie",
                "year": 1898,
                "named_after": "Polonia"
            },
            {
                "symbol": "Ra",
                "name": "Radio",
                "atomic_number": 88,
                "discoverer": "Marie y Pierre Curie",
                "year": 1898,
                "properties": "Altamente radioactivo, brilla en la oscuridad"
            }
        ],
        "educational_use": true,
        "interactive": false,
        "can_be_made_interactive": true,
        "dimensions": {
            "width": 1920,
            "height": 1080,
            "unit": "pixels",
            "scalable": true
        },
        "color_scheme": "Educativo - elementos Curie en azul",
        "includes": ["Números atómicos", "Símbolos", "Nombres", "Categorías"]
    }'::jsonb,
    NOW(),
    NOW()
),

(
    'radioactivity-decay-diagram.svg',
    '/media/diagrams/radioactivity-decay-diagram.svg',
    'image',
    'image/svg+xml',
    38924,
    'Diagrama: Desintegración Radioactiva',
    'Diagrama educativo que ilustra el concepto de desintegración radioactiva descubierto por Marie Curie. Muestra cómo un átomo radioactivo emite partículas alfa, beta, o rayos gamma, transformándose en otro elemento.',
    'Diagrama científico mostrando un núcleo atómico emitiendo radiación, con flechas indicando partículas alfa, beta y rayos gamma',
    ARRAY['Radioactividad', 'Desintegración', 'Física Nuclear', 'Partículas', 'Diagrama Educativo']::text[],
    'active',
    '{
        "type": "diagrama científico",
        "format": "SVG vectorial",
        "concept": "Desintegración radioactiva",
        "discovered_by": "Marie Curie (término acuñado)",
        "educational_level": "Secundaria-Preparatoria",
        "shows": [
            "Núcleo atómico",
            "Emisión de partículas alfa (He)",
            "Emisión de partículas beta (electrones)",
            "Emisión de rayos gamma (ondas electromagnéticas)"
        ],
        "dimensions": {
            "width": 1200,
            "height": 900,
            "unit": "pixels",
            "scalable": true
        },
        "color_coded": true,
        "labels": "Español",
        "curriculum_connections": ["Física nuclear", "Química nuclear", "Estructura atómica"]
    }'::jsonb,
    NOW(),
    NOW()
),

(
    'curie-timeline-infographic.svg',
    '/media/diagrams/curie-timeline-infographic.svg',
    'image',
    'image/svg+xml',
    67890,
    'Línea de Tiempo: Vida de Marie Curie',
    'Infografía interactiva que presenta los momentos clave de la vida de Marie Curie desde su nacimiento en 1867 hasta su muerte en 1934. Incluye hitos personales, descubrimientos científicos, premios, y contexto histórico.',
    'Línea de tiempo horizontal ilustrada con iconos y fechas clave de la vida de Marie Curie, desde 1867 hasta 1934',
    ARRAY['Marie Curie', 'Línea de Tiempo', 'Biografía', 'Infografía', 'Historia']::text[],
    'active',
    '{
        "type": "infografía educativa",
        "format": "SVG vectorial",
        "span": "1867-1934",
        "major_events": [
            {"year": 1867, "event": "Nacimiento en Varsovia"},
            {"year": 1891, "event": "Llegada a París"},
            {"year": 1895, "event": "Matrimonio con Pierre"},
            {"year": 1898, "event": "Descubrimiento Po y Ra"},
            {"year": 1903, "event": "Primer Nobel (Física)"},
            {"year": 1906, "event": "Muerte de Pierre"},
            {"year": 1911, "event": "Segundo Nobel (Química)"},
            {"year": 1914, "event": "WWI - Petits Curies"},
            {"year": 1934, "event": "Muerte"}
        ],
        "dimensions": {
            "width": 2400,
            "height": 600,
            "unit": "pixels",
            "scalable": true
        },
        "visual_elements": ["Iconos", "Ilustraciones", "Códigos de color por tipo de evento"],
        "interactive": false,
        "can_be_made_interactive": true,
        "educational_use": true
    }'::jsonb,
    NOW(),
    NOW()
),

-- ============================================================================
-- VIDEO: Contenido multimedia educativo
-- ============================================================================

(
    'marie-curie-documentary-intro.mp4',
    '/media/videos/marie-curie-documentary-intro.mp4',
    'video',
    'video/mp4',
    15678900,
    'Introducción: La Vida de Marie Curie',
    'Video introductorio de 3 minutos sobre la vida de Marie Curie. Combina fotografías históricas, animaciones educativas, y narración clara para presentar los momentos más importantes de su vida y sus descubrimientos científicos. Ideal como introducción antes de estudiar su biografía en detalle.',
    'Video documental introductorio sobre Marie Curie con fotografías históricas y narración',
    ARRAY['Marie Curie', 'Documental', 'Video Educativo', 'Biografía', 'Introducción']::text[],
    'active',
    '{
        "duration_seconds": 180,
        "duration_formatted": "03:00",
        "resolution": "1080p",
        "width": 1920,
        "height": 1080,
        "fps": 30,
        "codec": "H.264",
        "has_subtitles": true,
        "subtitle_languages": ["es", "en"],
        "has_audio_description": false,
        "languages": {
            "audio": ["es"],
            "subtitles": ["es", "en"]
        },
        "content_structure": [
            {"timestamp": "00:00-00:30", "section": "Infancia en Polonia"},
            {"timestamp": "00:30-01:00", "section": "Estudios en París"},
            {"timestamp": "01:00-02:00", "section": "Descubrimientos científicos"},
            {"timestamp": "02:00-02:30", "section": "Premios Nobel"},
            {"timestamp": "02:30-03:00", "section": "Legado"}
        ],
        "educational_level": "Secundaria-Preparatoria",
        "visual_elements": ["Fotografías históricas", "Animaciones", "Texto en pantalla", "Transiciones"],
        "accessibility": {
            "closed_captions": true,
            "transcript_available": true
        },
        "curriculum_connections": ["Historia de la Ciencia", "Biografías", "Física", "Química"]
    }'::jsonb,
    NOW(),
    NOW()
),

(
    'radioactivity-explanation-animated.mp4',
    '/media/videos/radioactivity-explanation-animated.mp4',
    'video',
    'video/mp4',
    22345678,
    'Explicación Animada: ¿Qué es la Radioactividad?',
    'Video educativo de 5 minutos que explica el concepto de radioactividad usando animaciones claras y accesibles. Cubre el descubrimiento por Marie Curie, la naturaleza de la radiación, tipos de desintegración radioactiva, y aplicaciones modernas.',
    'Video animado explicando el concepto de radioactividad con gráficos de átomos y partículas',
    ARRAY['Radioactividad', 'Educación', 'Animación', 'Física Nuclear', 'Concepto Científico']::text[],
    'active',
    '{
        "duration_seconds": 300,
        "duration_formatted": "05:00",
        "resolution": "1080p",
        "width": 1920,
        "height": 1080,
        "fps": 60,
        "codec": "H.264",
        "animation_style": "2D educativo",
        "has_subtitles": true,
        "subtitle_languages": ["es", "en", "fr"],
        "languages": {
            "audio": ["es"],
            "subtitles": ["es", "en", "fr"]
        },
        "content_structure": [
            {"timestamp": "00:00-01:00", "topic": "Introducción - Descubrimiento de Marie Curie"},
            {"timestamp": "01:00-02:30", "topic": "¿Qué es un átomo radioactivo?"},
            {"timestamp": "02:30-03:30", "topic": "Tipos de radiación (alfa, beta, gamma)"},
            {"timestamp": "03:30-04:30", "topic": "Aplicaciones: medicina, datación"},
            {"timestamp": "04:30-05:00", "topic": "Seguridad y protección radiológica"}
        ],
        "educational_level": "Secundaria",
        "visual_style": "Animación clara con colores educativos",
        "pedagogy": "Construye de simple a complejo",
        "includes_quiz": false,
        "accessibility": {
            "closed_captions": true,
            "transcript_available": true,
            "audio_description": false
        }
    }'::jsonb,
    NOW(),
    NOW()
),

-- ============================================================================
-- AUDIO: Pronunciaciones y contenido auditivo
-- ============================================================================

(
    'scientific-terms-pronunciation.mp3',
    '/media/audio/scientific-terms-pronunciation.mp3',
    'audio',
    'audio/mpeg',
    2345678,
    'Pronunciación: Términos Científicos Marie Curie',
    'Audio educativo con la pronunciación correcta de términos científicos clave relacionados con Marie Curie y sus descubrimientos. Incluye: Radio, Polonio, Radioactividad, Pechblenda, Sorbona, Curie (unidad), Becquerel. Cada término se pronuncia dos veces con una pausa entre repeticiones.',
    'Audio educativo de pronunciación de términos científicos relacionados con Marie Curie',
    ARRAY['Pronunciación', 'Vocabulario', 'Ciencias', 'Audio Educativo', 'Términos Técnicos']::text[],
    'active',
    '{
        "duration_seconds": 120,
        "duration_formatted": "02:00",
        "bitrate": "192kbps",
        "sample_rate": "44.1kHz",
        "channels": "stereo",
        "language": "es",
        "narrator": "Profesional nativo español",
        "terms_included": [
            {"term": "Radio", "timestamp": "00:05", "etymology": "Del latín radius (rayo)"},
            {"term": "Polonio", "timestamp": "00:15", "etymology": "Nombrado por Polonia"},
            {"term": "Radioactividad", "timestamp": "00:25", "note": "Término acuñado por Marie Curie"},
            {"term": "Pechblenda", "timestamp": "00:40", "note": "Mineral de uranio"},
            {"term": "Sorbona", "timestamp": "00:50", "note": "Universidad de París"},
            {"term": "Curie", "timestamp": "01:00", "note": "Unidad de radioactividad"},
            {"term": "Becquerel", "timestamp": "01:15", "note": "Otra unidad de radioactividad"},
            {"term": "Marie Sklodowska-Curie", "timestamp": "01:30", "note": "Nombre completo"}
        ],
        "repetitions": 2,
        "pause_between": "1 segundo",
        "educational_use": true,
        "curriculum_connections": ["Vocabulario científico", "Pronunciación", "Ciencias"]
    }'::jsonb,
    NOW(),
    NOW()
),

(
    'marie-curie-quotes-narrated.mp3',
    '/media/audio/marie-curie-quotes-narrated.mp3',
    'audio',
    'audio/mpeg',
    3456789,
    'Frases Célebres de Marie Curie (Narradas)',
    'Colección de 10 frases inspiradoras de Marie Curie, narradas con música de fondo suave. Incluye citas sobre ciencia, perseverancia, educación, y el papel de la mujer en la ciencia. Cada cita se presenta primero en español, luego en su inglés o francés original.',
    'Audio con frases célebres de Marie Curie narradas con música de fondo',
    ARRAY['Marie Curie', 'Frases', 'Inspiración', 'Audio Educativo', 'Motivación']::text[],
    'active',
    '{
        "duration_seconds": 240,
        "duration_formatted": "04:00",
        "bitrate": "192kbps",
        "sample_rate": "44.1kHz",
        "channels": "stereo",
        "primary_language": "es",
        "includes_original_language": true,
        "has_background_music": true,
        "music_type": "Clásica suave (sin derechos de autor)",
        "quotes_included": [
            {
                "quote_es": "Nada en la vida debe ser temido, solamente comprendido",
                "quote_en": "Nothing in life is to be feared, it is only to be understood",
                "context": "Sobre el miedo y el conocimiento"
            },
            {
                "quote_es": "Yo estaba enseñada a la convicción de que no hay que hacer nunca nada a medias",
                "quote_fr": "J étais convaincue qu il ne faut jamais faire les choses à moitié",
                "context": "Sobre dedicación y excelencia"
            },
            {
                "quote_es": "La vida no es fácil para ninguno de nosotros. Pero qué importa. Hay que perseverar y sobre todo tener confianza en uno mismo",
                "quote_fr": "La vie n est facile pour aucun de nous. Mais quoi, il faut avoir de la persévérance",
                "context": "Sobre perseverancia"
            }
        ],
        "quotes_count": 10,
        "educational_use": true,
        "use_cases": ["Inicio de clase", "Motivación", "Reflexión", "Contexto histórico"]
    }'::jsonb,
    NOW(),
    NOW()
)

ON CONFLICT (folder_path)
DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    alt_text = EXCLUDED.alt_text,
    metadata = EXCLUDED.metadata,
    updated_at = NOW();

-- ============================================================================
-- FIN: Media Files Seeds
-- ============================================================================
