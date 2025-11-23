-- ============================================================================
-- SEED: Tags for Content Organization
-- ============================================================================
-- Descripción: Sistema de tags organizacionales para contenido educativo
--              relacionado con Marie Curie y temas científicos/históricos
-- Schema: content_management
-- Tablas: tags
-- Prioridad: 2
-- Dependencias: Schema content_management debe existir
-- ============================================================================

SET search_path TO content_management, public;

-- ============================================================================
-- TAGS: Sistema de organización de contenido
-- ============================================================================

INSERT INTO content_management.tags (
    tag_name,
    tag_slug,
    tag_category,
    description,
    usage_count,
    created_at,
    updated_at
) VALUES

-- ============================================================================
-- CATEGORÍA: Personas (person)
-- ============================================================================

(
    'Marie Curie',
    'marie-curie',
    'person',
    'Marie Curie (Maria Sklodowska-Curie, 1867-1934): Científica polaco-francesa, pionera en el estudio de la radioactividad. Primera mujer en ganar un Premio Nobel, primera persona en ganar dos Premios Nobel en diferentes ciencias (Física 1903, Química 1911). Descubridora de los elementos Radio y Polonio.',
    0,
    NOW(),
    NOW()
),

(
    'Pierre Curie',
    'pierre-curie',
    'person',
    'Pierre Curie (1859-1906): Físico francés, esposo y colaborador científico de Marie Curie. Co-descubridor del Radio y Polonio. Ganador del Premio Nobel de Física 1903 junto con Marie Curie y Henri Becquerel. Pionero en el estudio de la piezoelectricidad y el magnetismo.',
    0,
    NOW(),
    NOW()
),

(
    'Henri Becquerel',
    'henri-becquerel',
    'person',
    'Henri Becquerel (1852-1908): Físico francés que descubrió la radioactividad natural del uranio en 1896. Premio Nobel de Física 1903 compartido con Marie y Pierre Curie. Su descubrimiento inspiró la investigación de Marie Curie.',
    0,
    NOW(),
    NOW()
),

(
    'Irène Joliot-Curie',
    'irene-joliot-curie',
    'person',
    'Irène Joliot-Curie (1897-1956): Hija mayor de Marie y Pierre Curie. Física y química francesa, Premio Nobel de Química 1935 por el descubrimiento de la radioactividad artificial. Continuó el legado científico de sus padres.',
    0,
    NOW(),
    NOW()
),

-- ============================================================================
-- CATEGORÍA: Conceptos Científicos (scientific_concept)
-- ============================================================================

(
    'Radioactividad',
    'radioactividad',
    'scientific_concept',
    'Fenómeno por el cual ciertos núcleos atómicos inestables emiten radiación espontáneamente. Término acuñado por Marie Curie en 1898. Representa una propiedad fundamental del átomo que llevó a revolucionar la física y la química modernas.',
    0,
    NOW(),
    NOW()
),

(
    'Radio',
    'radio',
    'scientific_concept',
    'Radio (Ra, elemento 88): Elemento químico altamente radioactivo descubierto por Marie y Pierre Curie en diciembre de 1898. Emite un brillo azul-verdoso en la oscuridad y genera calor constantemente. Fue crucial en el desarrollo de la física nuclear y la radioterapia.',
    0,
    NOW(),
    NOW()
),

(
    'Polonio',
    'polonio',
    'scientific_concept',
    'Polonio (Po, elemento 84): Elemento químico extremadamente radioactivo descubierto por Marie Curie en julio de 1898. Nombrado en honor a Polonia, país natal de Marie. Fue el primer elemento nuevo que descubrió Marie en su investigación sobre sustancias radioactivas.',
    0,
    NOW(),
    NOW()
),

(
    'Pechblenda',
    'pechblenda',
    'scientific_concept',
    'Pechblenda (uraninita): Mineral de uranio del cual Marie y Pierre Curie extrajeron el Radio y el Polonio. Los Curie procesaron literalmente toneladas de pechblenda durante cuatro años para aislar fracciones de gramo de elementos radioactivos puros.',
    0,
    NOW(),
    NOW()
),

(
    'Rayos X',
    'rayos-x',
    'scientific_concept',
    'Forma de radiación electromagnética de alta energía capaz de atravesar tejidos. Descubiertos por Wilhelm Röntgen en 1895. Marie Curie desarrolló unidades móviles de rayos X durante la Primera Guerra Mundial para uso médico en el campo de batalla.',
    0,
    NOW(),
    NOW()
),

(
    'Desintegración Radioactiva',
    'desintegracion-radioactiva',
    'scientific_concept',
    'Proceso por el cual un núcleo atómico inestable pierde energía mediante la emisión de radiación (partículas alfa, beta, o rayos gamma). Estudiado extensamente por Marie Curie, demostró que los átomos no son inmutables sino que pueden transformarse.',
    0,
    NOW(),
    NOW()
),

(
    'Física Nuclear',
    'fisica-nuclear',
    'scientific_concept',
    'Rama de la física que estudia el núcleo atómico y sus interacciones. Fundada en gran parte por el trabajo pionero de Marie Curie sobre radioactividad. Llevó al desarrollo de aplicaciones como la energía nuclear y la medicina nuclear.',
    0,
    NOW(),
    NOW()
),

(
    'Curio',
    'curio',
    'scientific_concept',
    'Curio (Cm, elemento 96): Elemento químico sintético nombrado en honor a Marie y Pierre Curie. También el nombre de una unidad obsoleta de radioactividad (Ci), reemplazada por el Becquerel en el Sistema Internacional.',
    0,
    NOW(),
    NOW()
),

-- ============================================================================
-- CATEGORÍA: Lugares (location)
-- ============================================================================

(
    'Varsovia',
    'varsovia',
    'location',
    'Varsovia, Polonia: Ciudad natal de Marie Curie (entonces Maria Sklodowska). Nació allí el 7 de noviembre de 1867. Durante su juventud, Polonia estaba bajo ocupación rusa, lo que motivó su activismo educativo clandestino y su orgullo patriótico.',
    0,
    NOW(),
    NOW()
),

(
    'París',
    'paris',
    'location',
    'París, Francia: Ciudad donde Marie estudió en la Universidad de la Sorbona, realizó sus descubrimientos científicos revolucionarios, y pasó la mayor parte de su vida adulta. Centro de su carrera científica y del desarrollo de la física nuclear moderna.',
    0,
    NOW(),
    NOW()
),

(
    'Sorbona',
    'sorbona',
    'location',
    'Universidad de la Sorbona (Universidad de París): Institución donde Marie Curie estudió física y matemáticas (1891-1894), se doctoró en física (1903), y se convirtió en la primera mujer profesora en sus 650 años de historia (1906).',
    0,
    NOW(),
    NOW()
),

(
    'Instituto del Radio',
    'instituto-del-radio',
    'location',
    'Instituto del Radio (Institut du Radium, ahora Instituto Curie): Centro de investigación fundado por Marie Curie en París en 1914. Dedicado al estudio de la radioactividad y sus aplicaciones médicas. Continúa siendo un centro líder mundial en investigación oncológica.',
    0,
    NOW(),
    NOW()
),

(
    'Polonia',
    'polonia',
    'location',
    'Polonia: País natal de Marie Curie. Durante su vida estuvo dividido entre Rusia, Prusia y Austria. Marie nombró el Polonio en honor a su país, un acto de patriotismo y protesta política. Polonia recuperó su independencia en 1918.',
    0,
    NOW(),
    NOW()
),

-- ============================================================================
-- CATEGORÍA: Logros y Premios (achievement)
-- ============================================================================

(
    'Premio Nobel',
    'premio-nobel',
    'achievement',
    'Premio Nobel: Máximo galardón científico internacional. Marie Curie ganó dos: Nobel de Física 1903 (con Pierre Curie y Henri Becquerel) por la investigación sobre radioactividad, y Nobel de Química 1911 por el descubrimiento del Radio y Polonio. Fue la primera persona en ganar dos Nobeles en ciencias diferentes.',
    0,
    NOW(),
    NOW()
),

(
    'Primera Mujer Nobel',
    'primera-mujer-nobel',
    'achievement',
    'Marie Curie fue la primera mujer en ganar un Premio Nobel (Física, 1903). Rompió una barrera de género histórica en el reconocimiento científico. Solo 61 mujeres han ganado el Nobel en sus más de 120 años de historia (hasta 2024).',
    0,
    NOW(),
    NOW()
),

(
    'Doctorado en Física',
    'doctorado-en-fisica',
    'achievement',
    'Marie Curie fue la primera mujer en Francia en obtener un doctorado en física (1903). Su tesis "Investigaciones sobre Sustancias Radioactivas" fue considerada el mejor trabajo doctoral jamás presentado. Abrió el camino para mujeres en física.',
    0,
    NOW(),
    NOW()
),

(
    'Primera Profesora Sorbona',
    'primera-profesora-sorbona',
    'achievement',
    'En 1906, Marie Curie se convirtió en la primera mujer profesora de la Universidad de la Sorbona en sus 650 años de historia. Asumió la cátedra de su esposo Pierre después de su muerte, continuando su legado científico y educativo.',
    0,
    NOW(),
    NOW()
),

(
    'Descubrimiento de Elementos',
    'descubrimiento-de-elementos',
    'achievement',
    'Marie Curie descubrió dos elementos químicos nuevos: Polonio (Po, elemento 84) en julio de 1898 y Radio (Ra, elemento 88) en diciembre de 1898. Expandió la tabla periódica y demostró la existencia de elementos más radioactivos que el uranio.',
    0,
    NOW(),
    NOW()
),

-- ============================================================================
-- CATEGORÍA: Eventos Históricos (historical_event)
-- ============================================================================

(
    'Primera Guerra Mundial',
    'primera-guerra-mundial',
    'historical_event',
    'Primera Guerra Mundial (1914-1918): Conflicto durante el cual Marie Curie desarrolló unidades móviles de radiología ("petits Curies") para ayudar a los soldados heridos. Equipó 20 vehículos móviles y 200 puestos fijos de rayos X, permitiendo radiografiar a más de 1 millón de soldados.',
    0,
    NOW(),
    NOW()
),

(
    'Belle Époque',
    'belle-epoque',
    'historical_event',
    'Belle Époque (1871-1914): Período de florecimiento cultural y científico en Francia durante el cual Marie Curie realizó sus descubrimientos más importantes. Fue una era de optimismo, innovación artística y avances científicos sin precedentes en Europa.',
    0,
    NOW(),
    NOW()
),

(
    'Ocupación Rusa de Polonia',
    'ocupacion-rusa-polonia',
    'historical_event',
    'Ocupación Rusa de Polonia (1795-1918): Período durante el cual Polonia fue dividida entre Rusia, Prusia y Austria. Marie Curie creció bajo ocupación rusa en Varsovia, enfrentando la supresión de la cultura polaca y restricciones educativas, lo que motivó su participación en la "Universidad Volante".',
    0,
    NOW(),
    NOW()
),

-- ============================================================================
-- CATEGORÍA: Materias Educativas (subject)
-- ============================================================================

(
    'Física',
    'fisica',
    'subject',
    'Física: Ciencia natural que estudia la materia, energía, espacio y tiempo. Marie Curie se graduó en física en la Sorbona (1893, primer lugar) y ganó el Nobel de Física (1903). Su trabajo sobre radioactividad revolucionó la física moderna.',
    0,
    NOW(),
    NOW()
),

(
    'Química',
    'quimica',
    'subject',
    'Química: Ciencia que estudia la composición, estructura y propiedades de las sustancias. Marie Curie se graduó en matemáticas (con fuerte componente químico) y ganó el Nobel de Química (1911) por aislar el Radio puro y determinar sus propiedades.',
    0,
    NOW(),
    NOW()
),

(
    'Historia de la Ciencia',
    'historia-de-la-ciencia',
    'subject',
    'Historia de la Ciencia: Disciplina que estudia el desarrollo del conocimiento científico. Marie Curie es una figura central en la transición de la física clásica a la moderna, y su biografía ilustra la evolución de la ciencia a finales del siglo XIX y principios del XX.',
    0,
    NOW(),
    NOW()
),

(
    'Biografía',
    'biografia',
    'subject',
    'Biografía: Género literario que narra la vida de personas reales. La biografía de Marie Curie es particularmente rica en lecciones sobre perseverancia, superación de barreras, colaboración científica, y el papel de las mujeres en la ciencia.',
    0,
    NOW(),
    NOW()
),

(
    'Matemáticas',
    'matematicas',
    'subject',
    'Matemáticas: Ciencia formal que estudia patrones, estructuras y relaciones abstractas. Marie Curie se graduó en matemáticas en la Sorbona (1894, segundo lugar). Las matemáticas fueron esenciales para sus cálculos de pesos atómicos y análisis de datos experimentales.',
    0,
    NOW(),
    NOW()
),

(
    'Medicina Nuclear',
    'medicina-nuclear',
    'subject',
    'Medicina Nuclear: Especialidad médica que usa materiales radioactivos para diagnóstico y tratamiento. Fundada en gran parte por el descubrimiento del Radio por Marie Curie. La radioterapia moderna es descendiente directa de sus investigaciones.',
    0,
    NOW(),
    NOW()
),

(
    'Estudios de Género',
    'estudios-de-genero',
    'subject',
    'Estudios de Género: Campo académico que examina las construcciones sociales de género. Marie Curie es un caso de estudio fundamental sobre barreras de género en la ciencia, discriminación académica, y el papel de las mujeres como pioneras intelectuales.',
    0,
    NOW(),
    NOW()
),

-- ============================================================================
-- CATEGORÍA: Temas y Conceptos Transversales (theme)
-- ============================================================================

(
    'Mujeres en Ciencia',
    'mujeres-en-ciencia',
    'theme',
    'Tema que explora la participación, contribuciones y desafíos de las mujeres en campos científicos. Marie Curie es el ejemplo paradigmático de mujer científica que superó barreras de género masivas para lograr reconocimiento mundial.',
    0,
    NOW(),
    NOW()
),

(
    'Ciencia Abierta',
    'ciencia-abierta',
    'theme',
    'Movimiento que promueve que el conocimiento científico sea accesible libremente. Marie y Pierre Curie rechazaron patentar el proceso de aislamiento del Radio, creyendo que el conocimiento científico debe compartirse para el beneficio de la humanidad.',
    0,
    NOW(),
    NOW()
),

(
    'Colaboración Científica',
    'colaboracion-cientifica',
    'theme',
    'Trabajo conjunto de científicos para investigar problemas complejos. La asociación entre Marie y Pierre Curie ejemplifica una colaboración científica exitosa basada en respeto mutuo, igualdad intelectual y pasión compartida por la ciencia.',
    0,
    NOW(),
    NOW()
),

(
    'Ética Científica',
    'etica-cientifica',
    'theme',
    'Principios morales que guían la investigación y aplicación de la ciencia. Marie Curie demostró ética ejemplar al rechazar lucrar con sus descubrimientos, compartir conocimiento abiertamente, y usar la ciencia para ayudar durante la Primera Guerra Mundial.',
    0,
    NOW(),
    NOW()
),

(
    'Ciencia y Sociedad',
    'ciencia-y-sociedad',
    'theme',
    'Relación bidireccional entre avances científicos y cambios sociales. El trabajo de Marie Curie tuvo impactos profundos en medicina, energía, y la percepción social de las capacidades intelectuales de las mujeres.',
    0,
    NOW(),
    NOW()
),

(
    'Educación Superior',
    'educacion-superior',
    'theme',
    'Educación universitaria y de posgrado. La historia de Marie Curie ilustra la importancia del acceso a educación superior de calidad y los obstáculos que enfrentaban las mujeres y extranjeros en el sistema educativo del siglo XIX.',
    0,
    NOW(),
    NOW()
),

(
    'Innovación Científica',
    'innovacion-cientifica',
    'theme',
    'Desarrollo de nuevas teorías, métodos o aplicaciones científicas. Marie Curie innovó en metodología experimental, acuñó nuevos términos (radioactividad), descubrió nuevos elementos, y desarrolló nuevas aplicaciones médicas.',
    0,
    NOW(),
    NOW()
),

-- ============================================================================
-- CATEGORÍA: Valores y Lecciones (value)
-- ============================================================================

(
    'Perseverancia',
    'perseverancia',
    'value',
    'Persistencia constante en la consecución de un objetivo a pesar de dificultades. Marie Curie demostró perseverancia extraordinaria: procesó toneladas de pechblenda durante años, superó discriminación de género, y continuó investigando después de la muerte de Pierre.',
    0,
    NOW(),
    NOW()
),

(
    'Curiosidad Intelectual',
    'curiosidad-intelectual',
    'value',
    'Deseo profundo de comprender y aprender. La curiosidad de Marie sobre los "rayos uraniosos" de Becquerel la llevó a investigación que revolucionó la ciencia. Eligió un tema por pura curiosidad, no por utilidad práctica inmediata.',
    0,
    NOW(),
    NOW()
),

(
    'Rigor Científico',
    'rigor-cientifico',
    'value',
    'Aplicación estricta del método científico y estándares de precisión. Marie Curie midió sistemáticamente todos los elementos conocidos, repitió experimentos incansablemente, y solo aceptó conclusiones respaldadas por datos sólidos.',
    0,
    NOW(),
    NOW()
),

(
    'Humildad',
    'humildad',
    'value',
    'Modestia sobre los propios logros. A pesar de ganar dos Premios Nobel, Marie Curie vivió modestamente, evitaba la fama, y consideraba su trabajo como servicio a la ciencia más que como búsqueda de gloria personal.',
    0,
    NOW(),
    NOW()
),

(
    'Sacrificio',
    'sacrificio',
    'value',
    'Renuncia a comodidad o beneficio personal por un objetivo mayor. Marie sacrificó confort, salud, riqueza potencial y tiempo con familia para dedicarse a la ciencia. Literalmente dio su vida por su investigación, muriendo por exposición a radiación.',
    0,
    NOW(),
    NOW()
),

(
    'Igualdad',
    'igualdad',
    'value',
    'Principio de que todas las personas merecen trato equitativo. Marie Curie luchó por ser reconocida como científica igual a sus colegas hombres. Su matrimonio con Pierre se basó en igualdad intelectual poco común para su época.',
    0,
    NOW(),
    NOW()
),

(
    'Patriotismo',
    'patriotismo',
    'value',
    'Amor y lealtad al país de origen. Marie Curie nunca olvidó sus raíces polacas: nombró el Polonio por Polonia, enseñó polaco a sus hijas, y consideró regresar a Polonia múltiples veces. Su patriotismo coexistía con su identidad como científica internacional.',
    0,
    NOW(),
    NOW()
),

-- ============================================================================
-- CATEGORÍA: Métodos y Técnicas (method)
-- ============================================================================

(
    'Método Científico',
    'metodo-cientifico',
    'method',
    'Proceso sistemático de investigación basado en observación, hipótesis, experimentación y análisis. Marie Curie ejemplificó el método científico riguroso: observó anomalías en minerales de uranio, formuló hipótesis sobre nuevos elementos, experimentó sistemáticamente, y llegó a conclusiones basadas en datos.',
    0,
    NOW(),
    NOW()
),

(
    'Cristalización Fraccionada',
    'cristalizacion-fraccionada',
    'method',
    'Técnica química para separar sustancias basada en diferencias de solubilidad. Marie Curie usó cristalización fraccionada repetida (docenas de veces) para purificar gradualmente el Radio de toneladas de pechblenda hasta obtener una fracción de gramo puro.',
    0,
    NOW(),
    NOW()
),

(
    'Medición de Radioactividad',
    'medicion-de-radioactividad',
    'method',
    'Técnicas para cuantificar emisiones radioactivas. Marie Curie desarrolló métodos precisos usando el electrómetro piezoeléctrico de cuarzo inventado por Pierre y su hermano, midiendo la conductividad eléctrica del aire ionizado por radiación.',
    0,
    NOW(),
    NOW()
)

ON CONFLICT (tag_slug)
DO UPDATE SET
    tag_name = EXCLUDED.tag_name,
    description = EXCLUDED.description,
    updated_at = NOW();

-- ============================================================================
-- FIN: Tags Seeds
-- ============================================================================
