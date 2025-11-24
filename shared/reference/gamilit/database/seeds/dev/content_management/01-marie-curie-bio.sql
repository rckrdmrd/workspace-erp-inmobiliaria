-- ============================================================================
-- SEED: Marie Curie Biography - Content Library
-- ============================================================================
-- Descripción: Biografía completa de Marie Curie dividida en 4 periodos
--              históricos para enriquecer el contenido educativo
-- Schema: content_management
-- Tablas: content_library
-- Prioridad: 2
-- Dependencias: Schema content_management debe existir
-- ============================================================================

SET search_path TO content_management, public;

-- ============================================================================
-- CONTENT LIBRARY: Biografía de Marie Curie (4 periodos)
-- ============================================================================

INSERT INTO content_management.marie_curie_content (
    title,
    subtitle,
    content_type,
    content_format,
    content_body,
    summary,
    author,
    tags,
    subjects,
    grade_levels,
    language,
    status,
    is_published,
    is_featured,
    metadata,
    created_at,
    updated_at
) VALUES

-- ============================================================================
-- Periodo 1: Primeros Años en Polonia (1867-1891)
-- ============================================================================
(
    'Marie Curie: Primeros Años en Polonia',
    'La infancia de Maria Sklodowska en Varsovia',
    'biography',
    'html',
    '<div class="biography-content">
        <h1>Los Primeros Años de Maria Sklodowska</h1>

        <section class="birth-family">
            <h2>Nacimiento y Familia</h2>
            <p>Maria Sklodowska nació el 7 de noviembre de 1867 en Varsovia, Polonia, en una época en que su país estaba bajo ocupación rusa. Era la menor de cinco hermanos en una familia de educadores comprometidos con el conocimiento y la resistencia cultural polaca.</p>

            <p>Su padre, Wladyslaw Sklodowski, era profesor de matemáticas y física, mientras que su madre, Bronislawa Boguska, dirigía un prestigioso internado para niñas. Ambos padres inculcaron en sus hijos el amor por el aprendizaje y el orgullo por su identidad polaca, a pesar de las restricciones impuestas por el régimen zarista.</p>

            <p>La familia Sklodowski vivía en condiciones modestas pero intelectualmente ricas. El apartamento familiar estaba lleno de libros, instrumentos científicos y conversaciones estimulantes sobre ciencia, literatura y política.</p>
        </section>

        <section class="childhood-education">
            <h2>Infancia y Educación Temprana</h2>
            <p>Desde muy pequeña, Maria mostró una capacidad intelectual excepcional. A los cuatro años ya sabía leer, y su memoria fotográfica asombraba a todos. Era especialmente hábil con los números y mostraba una curiosidad insaciable por comprender cómo funcionaban las cosas.</p>

            <p>La educación formal en la Polonia ocupada era complicada. Las autoridades rusas habían prohibido la enseñanza en polaco y controlaban estrictamente el currículo. Sin embargo, Maria asistió a una escuela clandestina donde se enseñaba la historia y cultura polaca en secreto, arriesgando severos castigos si eran descubiertos.</p>

            <p>A los 11 años, Maria enfrentó la primera gran tragedia de su vida: su madre murió de tuberculosis. Dos años antes, había perdido también a su hermana mayor, Zofia, víctima del tifus. Estas pérdidas marcaron profundamente a la joven Maria, quien encontró consuelo en los estudios y en el apoyo de su padre.</p>
        </section>

        <section class="gymnasium-years">
            <h2>Años de Gymnasium y Graduación</h2>
            <p>Maria asistió al Gymnasium número 3 de Varsovia, una escuela exclusiva para niñas. A pesar de tener que estudiar en ruso bajo la vigilancia de inspectores zaristas, destacó en todas las materias. Su dedicación era tal que a menudo estudiaba hasta altas horas de la noche, lo que preocupaba a su padre por su salud.</p>

            <p>En 1883, a los 15 años, Maria se graduó con honores, obteniendo la medalla de oro por sus logros académicos excepcionales. Sin embargo, su alegría estaba mezclada con frustración: como mujer y como polaca, no podía acceder a la educación universitaria en su propio país. La Universidad de Varsovia no admitía mujeres.</p>

            <p>Después de su graduación, Maria pasó un año en el campo con familiares, descansando de la intensidad de sus estudios. Fue un periodo de reflexión sobre su futuro incierto.</p>
        </section>

        <section class="underground-university">
            <h2>La Universidad Volante</h2>
            <p>Al regresar a Varsovia, Maria y su hermana Bronya se unieron a la "Universidad Volante" (Uniwersytet Latający), una institución clandestina que ofrecía educación superior en polaco a estudiantes que no podían acceder a universidades oficiales. Las clases se realizaban en secreto en casas particulares, cambiando constantemente de ubicación para evitar ser detectados por la policía rusa.</p>

            <p>Allí, Maria estudió ciencias naturales, química, anatomía y sociología, alimentando su pasión por la investigación científica. Participaba también en reuniones de pensamiento progresista, donde se discutían ideas sobre justicia social y la emancipación de la mujer.</p>

            <p>Durante este periodo, Maria trabajó como tutora privada para ayudar económicamente a su familia y ahorrar dinero para futuros estudios.</p>
        </section>

        <section class="the-pact">
            <h2>El Pacto de las Hermanas</h2>
            <p>Maria y su hermana Bronya hicieron un pacto que cambiaría sus vidas. Bronya soñaba con estudiar medicina en París, pero ninguna de las dos tenía suficiente dinero. Acordaron que Maria trabajaría como institutriz para financiar los estudios de Bronya en París. Una vez que Bronya se estableciera como médica, devolvería el favor financiando los estudios de Maria.</p>

            <p>En 1885, a los 18 años, Maria aceptó un puesto como institutriz en la familia Zorawski en Szczuki, una zona rural a unos 100 kilómetros de Varsovia. Allí pasaría casi tres años, enseñando a los hijos de la familia mientras ahorraba cada zloty que podía.</p>

            <p>Durante esos años en Szczuki, Maria vivió un romance con Kazimierz Zorawski, el hijo mayor de la familia. Sin embargo, cuando hablaron de matrimonio, los padres de Kazimierz se opusieron firmemente a que su hijo se casara con una simple institutriz sin fortuna. Esta experiencia dejó a Maria profundamente herida y reforzó su determinación de conseguir educación y respetabilidad por sí misma.</p>
        </section>

        <section class="preparation-paris">
            <h2>Preparándose para París</h2>
            <p>En 1889, Maria regresó a Varsovia y continuó trabajando como institutriz privada. Su hermana Bronya, ya establecida en París y casada con otro médico polaco, comenzó a enviar cartas instándola a que viniera a Francia para comenzar sus estudios universitarios.</p>

            <p>Sin embargo, Maria dudaba. Se sentía responsable de su padre, que ahora estaba solo, y no estaba segura de tener el nivel académico necesario para la Universidad de la Sorbona. Pasó meses estudiando por su cuenta matemáticas, física y francés, preparándose para el gran salto.</p>

            <p>Finalmente, en el otoño de 1891, con 24 años y sus ahorros en el bolsillo, Maria Sklodowska abordó un tren de cuarta clase que la llevaría en un viaje de tres días a París. Llevaba consigo una maleta de ropa, algunos libros y un sueño que parecía imposible: convertirse en científica.</p>

            <p>No podía imaginar que décadas después sería la primera mujer en ganar un Premio Nobel, la primera persona en ganar dos Premios Nobel en diferentes ciencias, y una de las científicas más influyentes de todos los tiempos.</p>
        </section>

        <div class="educational-reflection">
            <h3>Reflexiones para el Estudiante</h3>
            <ul>
                <li><strong>Perseverancia ante la adversidad:</strong> Maria enfrentó la pérdida familiar, discriminación de género, ocupación extranjera y limitaciones económicas, pero nunca abandonó su sueño.</li>
                <li><strong>El poder de la educación:</strong> En un contexto donde la educación era vista como subversiva, Maria arriesgó su seguridad para aprender.</li>
                <li><strong>Solidaridad familiar:</strong> El pacto con su hermana Bronya demuestra el poder del apoyo mutuo para superar obstáculos.</li>
                <li><strong>Educación como resistencia:</strong> Aprender en polaco era un acto de resistencia cultural contra la opresión rusa.</li>
            </ul>
        </div>
    </div>',
    'Biografía de los primeros años de Marie Curie en Polonia bajo ocupación rusa, desde su nacimiento en 1867 hasta su partida a París en 1891. Incluye su infancia en Varsovia, educación clandestina, trabajo como institutriz, y la preparación para sus estudios universitarios en Francia.',
    'GLIT Content Team',
    ARRAY['Marie Curie', 'Biografía', 'Polonia', 'Infancia', 'Educación', 'Varsovia', 'Institutriz', 'Universidad Volante', 'Perseverancia']::text[],
    ARRAY['Historia', 'Ciencias', 'Estudios Sociales', 'Biografías']::text[],
    ARRAY['6','7','8']::text[],
    'es',
    'published',
    true,
    true,
    '{
        "period": "1867-1891",
        "location": "Varsovia, Polonia",
        "key_dates": {
            "1867": "Nacimiento en Varsovia",
            "1878": "Muerte de su madre",
            "1883": "Graduación del Gymnasium con medalla de oro",
            "1885": "Comienza trabajo como institutriz",
            "1891": "Partida a París"
        },
        "key_themes": ["adversidad", "educación clandestina", "discriminación de género", "ocupación rusa", "familia"],
        "word_count": 1285,
        "reading_time_minutes": 6,
        "educational_level": "secundaria",
        "curriculum_connections": ["Historia de Europa siglo XIX", "Movimientos de resistencia", "Educación de la mujer"]
    }'::jsonb,
    NOW(),
    NOW()
),

-- ============================================================================
-- Periodo 2: Estudios en la Sorbona (1891-1895)
-- ============================================================================
(
    'Marie Curie: Estudios en la Sorbona',
    'Los años universitarios de Marie en París',
    'biography',
    'html',
    '<div class="biography-content">
        <h1>Estudios en la Sorbona: Una Nueva Vida</h1>

        <section class="arrival-paris">
            <h2>Llegada a París</h2>
            <p>En noviembre de 1891, Maria Sklodowska llegó a París y se matriculó en la Facultad de Ciencias de la Universidad de la Sorbona. Por fin, después de años de espera, podía estudiar libremente en una universidad de verdad. Para adaptarse a su nuevo entorno francés, comenzó a usar la versión francesa de su nombre: Marie.</p>

            <p>Los primeros meses fueron difíciles. Su francés era básico, y descubrió que su preparación académica en Polonia, aunque sólida, tenía lagunas comparada con la de sus compañeros franceses. Además, era una de las pocas mujeres en la facultad de ciencias - de 1,825 estudiantes, solo 23 eran mujeres.</p>

            <p>Al principio vivió con su hermana Bronya y su cuñado Kazimierz, pero el apartamento quedaba lejos de la Sorbona y el ambiente familiar la distraía de sus estudios. Después de unos meses, se mudó sola a una buhardilla en el Barrio Latino, cerca de la universidad.</p>
        </section>

        <section class="student-life">
            <h2>Vida de Estudiante</h2>
            <p>La vida de Marie en París era de extrema austeridad. Su buhardilla en el sexto piso era tan pequeña que apenas cabían una cama de hierro, una mesa, una silla y una estufa. En invierno hacía tanto frío que a veces el agua se congelaba en la palangana. Su dieta consistía principalmente en pan, chocolate y té, ocasionalmente algunos huevos o fruta.</p>

            <p>A menudo, Marie se desmayaba en clase por el hambre y el agotamiento. Su hermana Bronya, alarmada, intentaba convencerla de comer más y cuidarse mejor, pero Marie estaba completamente absorta en sus estudios. Cada franco que ahorraba en comida o calefacción era un franco que prolongaba su tiempo en la universidad.</p>

            <p>Sin embargo, Marie era feliz. Por primera vez en su vida, podía dedicarse completamente al estudio de la física y las matemáticas. Pasaba sus días en conferencias, en la biblioteca y en laboratorios. Por las noches, estudiaba bajo la luz de una lámpara de queroseno hasta que sus ojos ya no podían más.</p>
        </section>

        <section class="academic-achievements">
            <h2>Logros Académicos</h2>
            <p>A pesar de las dificultades iniciales con el idioma y las lagunas en su preparación, Marie destacó rápidamente. Su dedicación obsesiva a los estudios dio frutos extraordinarios.</p>

            <p>En julio de 1893, apenas dos años después de llegar a París, Marie se graduó en física con el primer lugar de su promoción (licence ès sciences physiques). Fue la primera mujer en Francia en obtener este título con tal distinción.</p>

            <p>Este logro le valió una beca de 600 francos de la Sociedad para el Fomento de la Industria Nacional, que le permitió continuar sus estudios. Decidió obtener un segundo grado, esta vez en matemáticas.</p>

            <p>En 1894, obtuvo su licence ès sciences mathématiques, graduándose en segundo lugar de su clase. Era extraordinario: en solo tres años, había conseguido dos títulos universitarios en disciplinas altamente exigentes, siendo mujer y extranjera en un ambiente predominantemente masculino y francés.</p>
        </section>

        <section class="meeting-pierre">
            <h2>El Encuentro con Pierre Curie</h2>
            <p>En la primavera de 1894, Marie buscaba espacio de laboratorio para realizar investigaciones sobre las propiedades magnéticas de diferentes tipos de acero, un proyecto encargado por la Sociedad para el Fomento de la Industria Nacional. Un profesor polaco, sabiendo de sus dificultades para encontrar espacio adecuado, le sugirió que conociera a Pierre Curie, un joven científico que trabajaba en la École de Physique et Chimie de París.</p>

            <p>Pierre Curie, a sus 35 años, ya era un físico respetado. Junto con su hermano Jacques, había descubierto la piezoelectricidad y había realizado importantes investigaciones sobre cristalografía y magnetismo. Era también un hombre tímido, idealista, completamente dedicado a la ciencia.</p>

            <p>Cuando Marie y Pierre se conocieron, la conexión fue inmediata. Encontraron en el otro no solo atracción personal, sino una afinidad intelectual profunda. Compartían una pasión por la ciencia, una disposición a la investigación rigurosa, y un cierto ascetismo en su dedicación al trabajo científico.</p>

            <p>Pierre quedó fascinado por esta joven polaca de ojos grises intensos que hablaba de física con una comprensión que igualaba la suya. Marie, por su parte, encontró en Pierre a alguien que no solo respetaba su inteligencia, sino que la valoraba profundamente.</p>
        </section>

        <section class="courtship-decision">
            <h2>Noviazgo y una Decisión Difícil</h2>
            <p>Durante el verano de 1894, Pierre cortejó a Marie con persistencia gentil. Le escribía cartas expresando no solo su amor, sino su deseo de compartir con ella una vida dedicada a la ciencia: "Sería algo hermoso pasar la vida uno al lado del otro, hipnotizados por nuestros sueños: tu sueño patriótico, nuestro sueño humanitario y nuestro sueño científico."</p>

            <p>Sin embargo, Marie estaba dividida. Había planeado regresar a Polonia al terminar sus estudios, cumplir con su deber patriótico y estar cerca de su padre. La idea de quedarse permanentemente en Francia la llenaba de culpa.</p>

            <p>Ese verano regresó a Varsovia, esperando que la distancia clarificara sus sentimientos. Intentó encontrar un puesto académico en Polonia, pero se enfrentó nuevamente con la dura realidad: como mujer, no era bienvenida en las instituciones científicas polacas. La Universidad de Cracovia rechazó su solicitud simplemente por su género.</p>

            <p>Mientras tanto, Pierre le escribía constantemente. En una carta memorable, le escribió: "Si no puedes amarte a ti misma, ¿podrías al menos amarme un poco?" Y añadió una propuesta extraordinaria para la época: si ella no podía quedarse en Francia, él renunciaría a su carrera y se mudaría a Polonia con ella.</p>

            <p>Esta declaración convenció a Marie. Pocos hombres de esa época habrían considerado sacrificar su carrera por seguir a una mujer. La propuesta de Pierre demostraba que él la veía verdaderamente como una igual.</p>
        </section>

        <section class="marriage">
            <h2>Matrimonio</h2>
            <p>Marie regresó a París en octubre de 1894. El 26 de julio de 1895, Marie Sklodowska y Pierre Curie se casaron en una ceremonia civil simple en Sceaux, en las afueras de París. No hubo iglesia, no hubo anillos de oro, no hubo vestido blanco.</p>

            <p>Marie llevó un traje azul oscuro práctico que podría usar después en el laboratorio. El padre de Marie viajó desde Polonia para la ocasión, y la familia de Pierre también estuvo presente. Después de la ceremonia, los recién casados se montaron en bicicletas nuevas - regalo de un primo - y se fueron de luna de miel en bicicleta por la campiña francesa.</p>

            <p>No era un matrimonio convencional. Ambos acordaron que su relación se basaría en la igualdad intelectual y en el compromiso compartido con la investigación científica. Marie no renunciaría a sus ambiciones científicas, y Pierre no esperaba que lo hiciera.</p>

            <p>Se mudaron a un pequeño apartamento de tres habitaciones en la Rue de la Glacière. Era modesto pero cómodo - una mejora considerable sobre la buhardilla de Marie. Organizaron su hogar con sencillez espartana: muebles mínimos, sin cortinas en las ventanas, sin alfombras. El tiempo que otros dedicaban a decorar o a entretenimientos sociales, ellos lo dedicarían a la ciencia.</p>
        </section>

        <section class="partnership-begins">
            <h2>El Inicio de una Colaboración Histórica</h2>
            <p>Después del matrimonio, Marie comenzó a trabajar junto a Pierre en su laboratorio. Mientras Pierre continuaba sus investigaciones sobre cristales, Marie empezó a buscar un tema para su doctorado - un paso crucial que la convertiría en una de las primeras mujeres en Francia en obtener un doctorado en física.</p>

            <p>Lo que Marie no sabía aún era que estaba a punto de embarcarse en una investigación que no solo cumpliría su sueño de convertirse en doctora, sino que revolucionaría la ciencia y cambiaría nuestra comprensión fundamental de la materia.</p>

            <p>Los años de dificultad, sacrificio y preparación estaban a punto de dar frutos extraordinarios.</p>
        </section>

        <div class="educational-reflection">
            <h3>Reflexiones para el Estudiante</h3>
            <ul>
                <li><strong>Sacrificio por los sueños:</strong> Marie vivió en pobreza extrema para poder estudiar, demostrando que los sueños grandes requieren sacrificios grandes.</li>
                <li><strong>Superación de barreras:</strong> Como mujer extranjera en un ambiente masculino francés, Marie enfrentó múltiples formas de discriminación pero perseveró.</li>
                <li><strong>Asociaciones igualitarias:</strong> El matrimonio de Marie y Pierre fue revolucionario para su época, basado en respeto mutuo e igualdad intelectual.</li>
                <li><strong>Excelencia académica:</strong> A pesar de comenzar con desventajas, Marie se graduó primera en física y segunda en matemáticas.</li>
            </ul>
        </div>
    </div>',
    'Biografía de Marie Curie durante sus estudios universitarios en la Sorbona (1891-1895), incluyendo su vida como estudiante en París, sus logros académicos, el encuentro con Pierre Curie, y su matrimonio basado en igualdad intelectual y compromiso científico compartido.',
    'GLIT Content Team',
    ARRAY['Marie Curie', 'Pierre Curie', 'Sorbona', 'París', 'Universidad', 'Física', 'Matemáticas', 'Matrimonio', 'Igualdad']::text[],
    ARRAY['Historia', 'Ciencias', 'Estudios de Género', 'Biografías']::text[],
    ARRAY['7','8','9']::text[],
    'es',
    'published',
    true,
    true,
    '{
        "period": "1891-1895",
        "location": "París, Francia",
        "key_dates": {
            "1891": "Llegada a París y matrícula en la Sorbona",
            "1893": "Graduación en Física (1er lugar)",
            "1894": "Graduación en Matemáticas (2do lugar), Conoce a Pierre Curie",
            "1895": "Matrimonio con Pierre Curie"
        },
        "key_themes": ["educación superior", "superación", "discriminación de género", "amor y ciencia", "asociación igualitaria"],
        "word_count": 1620,
        "reading_time_minutes": 8,
        "educational_level": "secundaria-preparatoria",
        "curriculum_connections": ["Historia de la ciencia", "Estudios de género", "Educación superior", "Francia del siglo XIX"]
    }'::jsonb,
    NOW(),
    NOW()
),

-- ============================================================================
-- Periodo 3: Los Grandes Descubrimientos (1895-1911)
-- ============================================================================
(
    'Marie Curie: Los Grandes Descubrimientos',
    'Radio, Polonio y los Premios Nobel',
    'biography',
    'html',
    '<div class="biography-content">
        <h1>Los Descubrimientos que Revolucionaron la Ciencia</h1>

        <section class="search-topic">
            <h2>La Búsqueda de un Tema de Doctorado</h2>
            <p>En 1896, Marie estaba buscando un tema para su tesis doctoral. Necesitaba algo original, un fenómeno inexplorado que le permitiera hacer una contribución significativa a la ciencia. Ese mismo año, el físico francés Henri Becquerel había hecho un descubrimiento intrigante: el uranio emitía espontáneamente rayos misteriosos que podían atravesar papel negro y impresionar placas fotográficas.</p>

            <p>Este fenómeno era completamente desconcertante. Los rayos X, descubiertos por Röntgen el año anterior, requerían electricidad y equipamiento especial. Pero el uranio emitía estos rayos por sí solo, sin energía externa. Becquerel llamó al fenómeno "rayos uraniosos" pero no lo investigó más allá.</p>

            <p>Marie decidió que este sería su tema. Quería determinar si otros elementos además del uranio emitían estos rayos misteriosos, y entender la naturaleza fundamental del fenómeno. Pierre, reconociendo la importancia potencial del trabajo, decidió dejar sus propias investigaciones sobre cristales para unirse a ella.</p>
        </section>

        <section class="research-conditions">
            <h2>Condiciones de Investigación</h2>
            <p>El lugar de trabajo que Pierre consiguió para su investigación conjunta era lamentable. Era un cobertizo acristalado en el patio de la École de Physique et Chimie, anteriormente usado como sala de disección. En verano era sofocante; en invierno, helado. El techo tenía goteras. No había ventilación adecuada, y el lugar estaba lleno de corrientes de aire que hacían imposible mantener temperaturas constantes para experimentos delicados.</p>

            <p>Allí, Marie y Pierre instalaron su laboratorio improvisado. Conseguían equipo científico de segunda mano, lo reparaban ellos mismos, y construían instrumentos a partir de materiales baratos. Usaron el electrómetro piezoeléctrico de cuarzo que Pierre y su hermano habían inventado años antes - era perfecto para medir las pequeñas corrientes eléctricas que producían los rayos misteriosos.</p>
        </section>

        <section class="radioactivity">
            <h2>El Descubrimiento de la Radioactividad</h2>
            <p>Marie comenzó su investigación metódicamente. Probó todos los elementos conocidos para ver si alguno además del uranio emitía estos rayos. Desarrolló un método preciso para cuantificar la intensidad de la radiación midiendo la conductividad eléctrica del aire alrededor de las muestras.</p>

            <p>Descubrió que el torio también emitía rayos. Pero más importante, hizo una observación crucial: la intensidad de la radiación dependía solamente de la cantidad de uranio o torio presente, no de su forma química ni de condiciones externas como temperatura o luz. Esto significaba que la radiación no era resultado de reacciones químicas, sino una propiedad del átomo mismo.</p>

            <p>Este fue un descubrimiento revolucionario. Sugería que el átomo, que se creía indivisible e inmutable, tenía una estructura interna y podía cambiar. Marie necesitaba un término para este fenómeno nuevo. Tomando prestado del latín "radius" (rayo), acuñó el término "radioactividad" (radioactivité).</p>

            <p>En abril de 1898, Marie presentó sus hallazgos preliminares a la Academia de Ciencias de París. Fue su primera publicación científica importante.</p>
        </section>

        <section class="polonium-radium">
            <h2>Descubrimiento del Polonio y el Radio</h2>
            <p>Marie hizo otra observación crucial: algunos minerales de uranio eran más radioactivos que el uranio puro. Esto solo podía significar una cosa: esos minerales contenían otro elemento, desconocido, más radioactivo que el uranio.</p>

            <p>Los Curie comenzaron la ardua tarea de separar este elemento misterioso de toneladas de pechblenda, un mineral de uranio. Era un trabajo agotador, químicamente complicado y físicamente extenuante. Marie procesaba hasta 20 kilogramos de material al día, removiendo calderos hirvientes con una barra de hierro casi tan grande como ella.</p>

            <p>En julio de 1898, aislaron una fracción altamente radioactiva. Contenía un elemento nuevo. Marie eligió llamarlo "polonio" en honor a su Polonia natal, un acto de patriotismo que también era una protesta política - Polonia no existía como país independiente en los mapas de 1898.</p>

            <p>Pero había más. En diciembre de 1898, los Curie anunciaron el descubrimiento de un segundo elemento nuevo, incluso más radioactivo que el polonio. Lo llamaron "radio" por su radiación intensa. El radio era extraordinario: brillaba en la oscuridad con una luz azul-verde fantasmal y generaba calor constantemente sin fuente externa de energía.</p>
        </section>

        <section class="isolation-radium">
            <h2>El Aislamiento del Radio</h2>
            <p>Anunciar el descubrimiento era solo el primer paso. Para probar que el polonio y el radio eran elementos verdaderos, Marie necesitaba aislarlos en forma pura y determinar su peso atómico.</p>

            <p>Esto requirió cuatro años más de trabajo brutal. La Academia de Ciencias de Austria les donó una tonelada de residuos de pechblenda de sus minas de Joachimsthal (ahora Jáchymov, República Checa). Los residuos se amontonaban en el patio junto al cobertizo-laboratorio.</p>

            <p>El trabajo era inmensamente tedioso. Marie hervía enormes calderos de mineral, filtraba precipitados, cristalizaba y re-cristalizaba sales una y otra vez, cada vez obteniendo material un poco más puro. El proceso se repetía docenas de veces. Los vapores químicos corrosivos llenaban el cobertizo. En verano, el calor de los hornos era insoportable. En invierno, sus manos se agrietaban por el frío y los productos químicos.</p>

            <p>Durante este período, Marie también dio a luz a dos hijas: Irène en 1897 y Eve en 1904. Continuó trabajando incluso durante sus embarazos, solo tomando breves descansos para los partos.</p>

            <p>Finalmente, en 1902, después de procesar literalmente toneladas de pechblenda, Marie logró aislar un decigramo (0.1 gramos) de cloruro de radio puro. Determinó su peso atómico: 226. El radio era oficial e irrefutablemente un elemento nuevo.</p>
        </section>

        <section class="doctorate-nobel">
            <h2>Doctorado y el Primer Nobel</h2>
            <p>En 1903, Marie presentó su tesis doctoral: "Investigaciones sobre Sustancias Radioactivas". El jurado, que incluía a los físicos más eminentes de Francia, la declaró el mejor trabajo de investigación jamás presentado en una tesis doctoral.</p>

            <p>Marie Curie se convirtió en la primera mujer en Francia en obtener un doctorado en física. Tenía 36 años.</p>

            <p>Ese mismo año, el mundo científico reconoció la trascendencia de su trabajo. Marie y Pierre Curie, junto con Henri Becquerel, recibieron el Premio Nobel de Física "en reconocimiento de los extraordinarios servicios que han prestado mediante sus investigaciones conjuntas sobre los fenómenos de radiación descubiertos por el profesor Henri Becquerel".</p>

            <p>Hubo controversia: inicialmente, el comité del Nobel solo iba a premiar a Pierre y a Becquerel. Fue Pierre quien insistió en que Marie fuera incluida, amenazando con rechazar el premio si no lo hacían. Marie se convirtió en la primera mujer en ganar un Premio Nobel.</p>

            <p>Los Curie no viajaron a Estocolmo para la ceremonia - estaban demasiado ocupados con su trabajo y Pierre estaba enfermo. Recogieron su premio y dieron su conferencia Nobel más de un año después.</p>
        </section>

        <section class="tragedy-pierre">
            <h2>Tragedia: La Muerte de Pierre</h2>
            <p>El 19 de abril de 1906, sucedió lo impensable. Pierre, caminando bajo una lluvia intensa en París, fue atropellado por un carruaje tirado por caballos. Murió instantáneamente.</p>

            <p>Marie quedó devastada. En su diario personal, escribió: "Entraron y me dijeron: 'Pierre está muerto'. ¿Puedo creer lo que he escrito? ... Me siento como si no pudiera vivir más." Durante semanas, apenas comió o durmió, sumida en una depresión profunda.</p>

            <p>Pero Marie tenía dos hijas que criar y un legado científico que preservar. Tomó la extraordinaria decisión de continuar el trabajo que ella y Pierre habían comenzado juntos. La Universidad de la Sorbona le ofreció la cátedra de Pierre - un honor sin precedentes. Se convirtió en la primera mujer profesora en la Universidad de París en sus 650 años de historia.</p>

            <p>Su conferencia inaugural, el 5 de noviembre de 1906, atrajo multitudes. El aula estaba repleta de curiosos que querían ver a la viuda del famoso Pierre Curie. Marie llegó, vestida de negro, y comenzó su conferencia exactamente donde Pierre había dejado su última clase, como si continuara una conversación interrumpida. Su voz temblaba, pero no lloró. Habló de física, no de Pierre. Fue un momento de dignidad extraordinaria.</p>
        </section>

        <section class="second-nobel">
            <h2>El Segundo Premio Nobel</h2>
            <p>Marie continuó investigando con determinación renovada. Se enfocó en aislar radio metálico puro (hasta entonces solo había obtenido sales de radio) y en determinar con precisión las propiedades del radio y otros elementos radioactivos.</p>

            <p>En 1910, logró aislar radio metálico puro por primera vez en colaboración con André Debierne. Fue un triunfo químico extraordinario.</p>

            <p>En 1911, la Academia Sueca de Ciencias le otorgó a Marie su segundo Premio Nobel, esta vez en Química, "por el descubrimiento de los elementos radio y polonio, por el aislamiento del radio y el estudio de la naturaleza y compuestos de este elemento notable".</p>

            <p>Marie Curie se convirtió en la primera persona en la historia en ganar dos Premios Nobel. Además, eran en dos ciencias diferentes: Física y Química. Hasta el día de hoy, solo una persona más (Linus Pauling) ha igualado esta hazaña.</p>

            <p>Sin embargo, el año 1911 fue agridulce. Mientras recibía el Nobel en Estocolmo, en París estallaba un escándalo público sobre su supuesto romance con el físico Paul Langevin, un hombre casado. La prensa francesa la atacó brutalmente con titulares xenófobos y sexistas. Algunos llamaban a que devolviera su Nobel y abandonara Francia.</p>

            <p>Marie consideró seriamente dejar Francia y regresar a Polonia. Fue Albert Einstein, entre otros, quien la convenció de quedarse, escribiéndole: "Si la chusma continúa ocupándose de usted, simplemente deje de leer esa basura. Déjesela a las víboras para quienes fue fabricada."</p>
        </section>

        <div class="educational-reflection">
            <h3>Reflexiones para el Estudiante</h3>
            <ul>
                <li><strong>Método científico riguroso:</strong> Marie midió sistemáticamente todos los elementos conocidos, estableciendo el rigor metodológico que caracteriza la ciencia moderna.</li>
                <li><strong>Persistencia monumental:</strong> Procesar toneladas de pechblenda durante cuatro años para obtener 0.1 gramos de radio puro demuestra dedicación extraordinaria.</li>
                <li><strong>Revolución conceptual:</strong> El descubrimiento de la radioactividad cambió nuestra comprensión del átomo y abrió la era de la física moderna.</li>
                <li><strong>Resiliencia ante la tragedia:</strong> Después de la muerte de Pierre, Marie continuó su trabajo, convirtiéndose en la primera mujer profesora de la Sorbona.</li>
                <li><strong>Doble estándar de género:</strong> A pesar de ganar dos Premios Nobel, Marie enfrentó ataques misóginos que ningún científico hombre habría sufrido.</li>
            </ul>
        </div>
    </div>',
    'Biografía de Marie Curie durante sus años de investigación y descubrimientos (1895-1911). Incluye el descubrimiento de la radioactividad, el aislamiento del polonio y el radio, su primer Premio Nobel de Física (1903), la trágica muerte de Pierre Curie (1906), su nombramiento como primera mujer profesora de la Sorbona, y su segundo Premio Nobel de Química (1911).',
    'GLIT Content Team',
    ARRAY['Marie Curie', 'Pierre Curie', 'Radio', 'Polonio', 'Radioactividad', 'Premio Nobel', 'Descubrimientos', 'Física', 'Química']::text[],
    ARRAY['Ciencias', 'Química', 'Física', 'Historia de la Ciencia', 'Biografías']::text[],
    ARRAY['7','8','9','10']::text[],
    'es',
    'published',
    true,
    true,
    '{
        "period": "1895-1911",
        "key_dates": {
            "1896": "Inicio investigación radioactividad",
            "1898": "Descubrimiento Polonio (julio) y Radio (diciembre)",
            "1902": "Aislamiento de 0.1g de radio puro",
            "1903": "Doctorado y primer Nobel (Física)",
            "1906": "Muerte de Pierre, Primera mujer profesora Sorbona",
            "1910": "Aislamiento de radio metálico puro",
            "1911": "Segundo Nobel (Química)"
        },
        "key_discoveries": [
            "Término radioactividad",
            "Elemento Polonio (84)",
            "Elemento Radio (88)",
            "Radioactividad como propiedad atómica"
        ],
        "key_themes": ["descubrimiento científico", "método riguroso", "colaboración científica", "resiliencia", "discriminación de género"],
        "word_count": 2180,
        "reading_time_minutes": 11,
        "educational_level": "secundaria-preparatoria-universidad",
        "curriculum_connections": ["Química nuclear", "Historia de la física", "Método científico", "Estructura atómica"]
    }'::jsonb,
    NOW(),
    NOW()
),

-- ============================================================================
-- Periodo 4: Legado e Impacto (1911-1934)
-- ============================================================================
(
    'Marie Curie: Legado e Impacto',
    'Los últimos años y el impacto en la ciencia',
    'biography',
    'html',
    '<div class="biography-content">
        <h1>Legado: Los Últimos Años y el Impacto Duradero</h1>

        <section class="radium-institute">
            <h2>El Instituto del Radio</h2>
            <p>Después de ganar su segundo Nobel en 1911, Marie se convirtió en una figura científica de importancia internacional. Utilizó su influencia para fundar el Instituto del Radio (Institut du Radium) en París, una iniciativa conjunta entre la Universidad de París y el Instituto Pasteur.</p>

            <p>El Instituto, inaugurado en 1914, estaba diseñado específicamente para investigar la radioactividad y sus aplicaciones, particularmente en el tratamiento del cáncer. Marie soñaba con un centro de excelencia donde jóvenes científicos pudieran realizar investigaciones de vanguardia en condiciones adecuadas - muy diferente del cobertizo donde ella y Pierre habían trabajado.</p>

            <p>El Instituto del Radio (ahora Instituto Curie) se convertiría en uno de los centros de investigación oncológica más importantes del mundo, y sigue funcionando hasta hoy, más de 110 años después.</p>
        </section>

        <section class="world-war-one">
            <h2>La Primera Guerra Mundial: Los "Petits Curies"</h2>
            <p>El Instituto del Radio apenas había abierto cuando estalló la Primera Guerra Mundial en agosto de 1914. En lugar de continuar su investigación fundamental, Marie vio una necesidad urgente y actuó con decisión.</p>

            <p>Los rayos X podían localizar balas y fragmentos de metralla en los cuerpos de los soldados heridos, permitiendo cirugías más precisas y salvando vidas. Pero la mayoría de los hospitales de campaña no tenían equipamiento de rayos X. Marie decidió llevar los rayos X al frente de batalla.</p>

            <p>Con su propio dinero y fondos que recaudó, equipó vehículos con máquinas de rayos X portátiles, generadores eléctricos y equipo de fotografía. Estos "petits Curies" (pequeños Curies) eran las primeras unidades móviles de radiología del mundo.</p>

            <p>Marie, a sus 47 años, aprendió a conducir y a reparar automóviles. Durante la guerra, ella misma condujo estas unidades móviles a hospitales de campaña cerca del frente, a menudo bajo fuego de artillería. Su hija Irène, entonces de apenas 18 años, la acompañaba frecuentemente, operando el equipo de rayos X.</p>

            <p>Marie también estableció 200 puestos de radiología fijos en hospitales y entrenó a 150 operadores de rayos X. Se estima que sus esfuerzos permitieron realizar radiografías a más de un millón de soldados heridos durante la guerra.</p>

            <p>Marie nunca buscó reconocimiento por este trabajo. Lo veía como su deber patriótico - no solo hacia Francia, sino hacia la humanidad. Cuando terminó la guerra en 1918, simplemente regresó a su laboratorio.</p>
        </section>

        <section class="post-war">
            <h2>Años de Posguerra</h2>
            <p>Después de la guerra, Marie se dedicó a construir el Instituto del Radio como un centro de excelencia científica. Reclutó jóvenes investigadores talentosos, incluyendo muchas mujeres - algo muy inusual para la época. Bajo su dirección, el Instituto produjo investigación de primera calidad sobre radioactividad, física nuclear y aplicaciones médicas.</p>

            <p>Marie también se involucró en la cooperación científica internacional. Fue nombrada miembro de la Comisión Internacional de Cooperación Intelectual de la Sociedad de Naciones (precursora de la UNESCO), trabajando junto a figuras como Albert Einstein para promover la colaboración científica entre naciones.</p>

            <p>En 1921, emprendió un agotador viaje a Estados Unidos. La periodista estadounidense Marie Mattingly Meloney había organizado una campaña de recaudación para comprarle a Marie un gramo de radio puro para su investigación - el radio era extremadamente caro, y Marie no tenía fondos suficientes. El viaje fue un triunfo: Marie fue recibida por el presidente Warren Harding en la Casa Blanca y aclamada en universidades de todo el país.</p>

            <p>Sin embargo, el viaje también fue extenuante. Marie, siempre privada y tímida, encontraba agotadoras las multitudes y la atención pública. Pero sonreía y daba conferencias, porque necesitaba ese radio para continuar su investigación.</p>
        </section>

        <section class="health-decline">
            <h2>Declive de Salud</h2>
            <p>Durante años, Marie había trabajado con materiales intensamente radioactivos sin ninguna protección. Ella y Pierre habían manipulado radio con las manos desnudas. Marie llevaba tubos de ensayo con radio en los bolsillos de su delantal. A veces, admiraban el brillo fosforescente del radio en la oscuridad de su laboratorio, sin comprender el peligro.</p>

            <p>Los efectos de décadas de exposición comenzaron a manifestarse. Marie desarrolló cataratas en ambos ojos, requiriendo múltiples cirugías. Sus manos estaban quemadas y agrietadas permanentemente. Sufría de fatiga constante y mareos.</p>

            <p>Más grave, sus recuentos sanguíneos mostraban anormalidades preocupantes. Los médicos diagnosticaron anemia perniciosa aplásica - su médula ósea había sido dañada por la radiación y ya no producía suficientes células sanguíneas.</p>

            <p>Marie minimizaba sus síntomas y continuaba trabajando. Incluso cuando estaba tan débil que apenas podía caminar, insistía en ir al laboratorio. La ciencia era su vida; no podía imaginarse deteniéndose.</p>
        </section>

        <section class="final-days">
            <h2>Los Últimos Días</h2>
            <p>En la primavera de 1934, la salud de Marie se deterioró rápidamente. Tenía fiebre persistente y estaba extremadamente débil. Su hija Eve la llevó a un sanatorio en Sancellemoz, en los Alpes franceses, esperando que el aire de montaña la ayudara.</p>

            <p>Pero era demasiado tarde. El 4 de julio de 1934, Marie Curie murió a los 66 años. Su muerte fue causada por anemia aplásica, consecuencia directa de su exposición prolongada a la radiación.</p>

            <p>Fue enterrada junto a Pierre en el cementerio de Sceaux. El gobierno francés ofreció un funeral de estado, pero la familia Curie lo rechazó, prefiriendo una ceremonia simple y privada, como Marie habría querido.</p>

            <p>En 1995, sesenta años después de su muerte, los restos de Marie y Pierre Curie fueron trasladados al Panteón de París, el mausoleo donde Francia honra a sus ciudadanos más ilustres. Marie se convirtió en la primera mujer honrada en el Panteón por sus propios méritos (otras mujeres habían sido enterradas allí, pero como esposas de hombres famosos).</p>

            <p>Incluso su ataúd era radioactivo - tuvo que ser recubierto de plomo. Sus documentos de laboratorio de la década de 1890 todavía están contaminados con radiación y se conservan en cajas forradas de plomo. Cualquiera que desee consultarlos debe usar protección y firmar un formulario de responsabilidad.</p>
        </section>

        <section class="scientific-legacy">
            <h2>Legado Científico</h2>
            <p>El impacto científico de Marie Curie es incalculable:</p>

            <ul>
                <li><strong>Fundó una nueva ciencia:</strong> Su trabajo estableció las bases de la física nuclear y la química nuclear como disciplinas científicas.</li>

                <li><strong>Cambió la comprensión del átomo:</strong> Al demostrar que la radioactividad es una propiedad atómica, contribuyó a desmantelar la idea del átomo como indivisible e inmutable, abriendo el camino para la física cuántica.</li>

                <li><strong>Aplicaciones médicas:</strong> El radio fue la primera forma de radioterapia para el cáncer. Aunque hoy usamos isótopos más seguros, Marie inició el campo de la oncología por radiación que ha salvado millones de vidas.</li>

                <li><strong>Dinastía científica:</strong> Su hija Irène Joliot-Curie ganó el Premio Nobel de Química en 1935 (un año después de la muerte de Marie) por el descubrimiento de la radioactividad artificial. El yerno de Marie, Frédéric Joliot, compartió ese Nobel. Su nieto Pierre Joliot se convirtió en un bioquímico reconocido.</li>

                <li><strong>Nomenclatura científica:</strong> El elemento curio (Cm, número atómico 96) fue nombrado en honor a Marie y Pierre Curie. Una unidad de radioactividad, el curie (Ci), también lleva su nombre.</li>
            </ul>
        </section>

        <section class="social-legacy">
            <h2>Legado Social y Cultural</h2>
            <p>Más allá de la ciencia, Marie Curie se convirtió en un símbolo y una inspiración:</p>

            <ul>
                <li><strong>Pionera para las mujeres:</strong> Como la primera mujer profesora en la Sorbona, la primera mujer en ganar un Nobel, y la primera persona en ganar dos Nobeles, Marie rompió barreras de género que parecían infranqueables.</li>

                <li><strong>Modelo de determinación:</strong> Su historia de superación - desde institutriz pobre en Polonia hasta científica laureada con dos Nobel - inspira a generaciones a perseguir sus sueños a pesar de los obstáculos.</li>

                <li><strong>Integridad científica:</strong> Marie y Pierre rechazaron patentar el proceso de aislamiento del radio, a pesar de que podría haberlos hecho millonarios. Creían que el conocimiento científico debía compartirse libremente para el beneficio de la humanidad.</li>

                <li><strong>Ciencia como vocación:</strong> Marie vivió modestamente toda su vida, invirtiendo cualquier dinero de premios en su investigación. Para ella, la ciencia no era un medio para la riqueza o la fama, sino una búsqueda apasionada de comprensión.</li>
            </ul>
        </section>

        <section class="modern-impact">
            <h2>Impacto en el Mundo Moderno</h2>
            <p>El trabajo de Marie Curie resuena en el siglo XXI:</p>

            <ul>
                <li><strong>Medicina nuclear:</strong> Los escáneres PET, la radioterapia moderna, y el diagnóstico por isótopos radiactivos son descendientes directos de la investigación de Marie.</li>

                <li><strong>Energía nuclear:</strong> Aunque Marie nunca trabajó con fisión nuclear, su investigación sobre radioactividad fue esencial para comprender los procesos nucleares que eventualmente condujeron a la energía nuclear.</li>

                <li><strong>Datación radiométrica:</strong> Métodos como el carbono-14 para datar artefactos arqueológicos se basan en principios de radioactividad que Marie ayudó a establecer.</li>

                <li><strong>Seguridad radiológica:</strong> Irónicamente, la muerte de Marie por exposición a radiación ayudó a establecer la necesidad de protocolos de seguridad radiológica que ahora protegen a científicos y trabajadores médicos.</li>
            </ul>
        </section>

        <section class="lessons-today">
            <h2>Lecciones para Hoy</h2>
            <p>¿Qué podemos aprender de Marie Curie en el siglo XXI?</p>

            <ul>
                <li><strong>La perseverancia transforma obstáculos:</strong> Marie enfrentó discriminación de género, xenofobia, pobreza, y tragedia personal, pero nunca se rindió.</li>

                <li><strong>La educación es poder:</strong> Marie arriesgó todo - confort, seguridad, convención social - para obtener educación. Esa educación transformó no solo su vida, sino el mundo.</li>

                <li><strong>La curiosidad impulsa el progreso:</strong> Marie investigó la radioactividad no porque fuera práctica o rentable, sino porque era misterioso. La ciencia básica, impulsada por curiosidad pura, eventualmente produce aplicaciones transformadoras.</li>

                <li><strong>La colaboración multiplica el impacto:</strong> El trabajo de Marie con Pierre demuestra que las asociaciones basadas en respeto mutuo e igualdad pueden lograr más que cualquier individuo solo.</li>

                <li><strong>La ciencia tiene responsabilidad social:</strong> El rechazo de Marie a patentar sus descubrimientos y su trabajo humanitario durante la Primera Guerra Mundial muestran que los científicos tienen obligaciones más allá del laboratorio.</li>
            </ul>
        </section>

        <section class="final-reflection">
            <h2>Reflexión Final</h2>
            <p>Marie Curie vivió una vida de contrastes extraordinarios. Fue una mujer que rompió las normas de género más rígidas de su época, pero que era profundamente reservada y evitaba el centro de atención. Ganó premios internacionales y honores, pero vivió modestamente y reinvertía todo en su ciencia. Hizo descubrimientos que revolucionaron nuestra comprensión del universo, pero pagó el precio último: su propia vida.</p>

            <p>Su historia nos recuerda que el progreso humano - en ciencia, en derechos, en comprensión - lo construyen personas reales con dudas, miedos, y limitaciones, que eligen perseverar de todas formas. Marie Curie no era sobrehumana. Era extraordinariamente humana: vulnerable, terca, apasionada, imperfecta, brillante.</p>

            <p>Y precisamente por eso, su ejemplo es tan poderoso. Si Marie Sklodowska, una niña de la Polonia ocupada, pudo cambiar el mundo, quizás nosotros también podemos.</p>
        </section>

        <div class="educational-reflection">
            <h3>Reflexiones para el Estudiante</h3>
            <ul>
                <li><strong>Ciencia y humanidad:</strong> Durante la Primera Guerra Mundial, Marie usó su ciencia para salvar vidas, demostrando que el conocimiento tiene propósito humano.</li>
                <li><strong>Precio del pionerismo:</strong> Marie murió por exposición a radiación porque trabajó antes de que se conocieran los peligros - los pioneros a menudo pagan un precio alto.</li>
                <li><strong>Legado intergeneracional:</strong> La familia Curie produjo cinco ganadores del Nobel, demostrando cómo el ambiente intelectual familiar puede cultivar excelencia.</li>
                <li><strong>Reconocimiento póstumo:</strong> El traslado de Marie al Panteón en 1995 muestra cómo el reconocimiento histórico puede tardar, pero eventualmente se rinde justicia.</li>
                <li><strong>Ciencia abierta:</strong> El rechazo de Marie a patentar sus descubrimientos estableció un precedente de ciencia como bien público.</li>
            </ul>
        </div>
    </div>',
    'Biografía de los últimos años de Marie Curie (1911-1934) y su legado duradero. Incluye la fundación del Instituto del Radio, su trabajo humanitario durante la Primera Guerra Mundial con las unidades móviles de rayos X, su declive de salud por exposición a radiación, su muerte en 1934, y el impacto profundo de su trabajo en la ciencia moderna, medicina, y como inspiración para generaciones de científicas.',
    'GLIT Content Team',
    ARRAY['Marie Curie', 'Legado', 'Instituto del Radio', 'Primera Guerra Mundial', 'Radiología', 'Impacto Científico', 'Panteón', 'Inspiración']::text[],
    ARRAY['Historia', 'Ciencias', 'Medicina', 'Impacto Social', 'Biografías']::text[],
    ARRAY['8','9','10','11']::text[],
    'es',
    'published',
    true,
    true,
    '{
        "period": "1911-1934",
        "key_dates": {
            "1914": "Fundación Instituto del Radio, Inicio WWI (petits Curies)",
            "1918": "Fin Primera Guerra Mundial",
            "1921": "Viaje a Estados Unidos",
            "1934": "Muerte por anemia aplásica (4 julio)",
            "1995": "Traslado al Panteón de París"
        },
        "key_contributions": [
            "Instituto del Radio/Instituto Curie",
            "Unidades móviles de radiología (WWI)",
            "Más de 1 millón de soldados radiografiados",
            "200 puestos fijos de radiología",
            "Entrenamiento de 150 operadores de rayos X"
        ],
        "legacy_impact": [
            "Fundación de física y química nuclear",
            "Radioterapia para cáncer",
            "Primera mujer profesora Sorbona",
            "Primera mujer Nobel, única con 2 Nobeles en ciencias diferentes",
            "Elemento Curio nombrado en su honor",
            "Inspiración para mujeres en STEM"
        ],
        "key_themes": ["legado científico", "servicio humanitario", "precio del pionerismo", "ciencia abierta", "inspiración generacional"],
        "word_count": 2450,
        "reading_time_minutes": 12,
        "educational_level": "secundaria-preparatoria-universidad",
        "curriculum_connections": ["Historia de la ciencia", "Medicina nuclear", "Primera Guerra Mundial", "Ética científica", "Impacto social de la ciencia"]
    }'::jsonb,
    NOW(),
    NOW()
)

ON CONFLICT (title, content_type)
DO UPDATE SET
    content_body = EXCLUDED.content_body,
    summary = EXCLUDED.summary,
    metadata = EXCLUDED.metadata,
    tags = EXCLUDED.tags,
    subjects = EXCLUDED.subjects,
    updated_at = NOW();

-- ============================================================================
-- FIN: Marie Curie Biography Seeds
-- ============================================================================
