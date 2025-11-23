import { NewsArticle, SourceReference, FactCheckResult } from './verificadorFakeNewsTypes';

export const mockArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Marie Curie descubrió la radioactividad en 1898',
    content: `Marie Curie, científica polaca-francesa, fue la primera persona en descubrir la radioactividad en 1898.
    Trabajando en un laboratorio improvisado en París, Marie identificó dos nuevos elementos radioactivos: el polonio
    y el radio. Su investigación revolucionó la ciencia y le valió dos Premios Nobel. Marie fue la primera mujer en
    ganar un Premio Nobel y la única persona en ganar premios Nobel en dos campos científicos diferentes: Física en
    1903 y Química en 1911. Murió en 1934 debido a la exposición prolongada a la radiación.`,
    source: 'Science News Daily',
    date: '2024-03-15',
  },
  {
    id: '2',
    title: 'Marie Curie fue la primera mujer profesora en la Universidad de París',
    content: `En 1906, Marie Curie hizo historia al convertirse en la primera mujer profesora de la Universidad de París
    (La Sorbonne). Este nombramiento histórico ocurrió tras la muerte de su esposo Pierre Curie en un accidente de
    tráfico. Marie asumió la cátedra de Física que su esposo había ocupado, rompiendo barreras en el mundo académico.
    Su primera conferencia atrajo a cientos de estudiantes y académicos curiosos. Durante la Primera Guerra Mundial,
    Marie desarrolló unidades móviles de rayos X, conocidas como "petites Curies", que salvaron miles de vidas en el
    frente de batalla.`,
    source: 'Historia Científica',
    date: '2024-03-20',
  },
  {
    id: '3',
    title: 'El radio descubierto por Curie curaba el cáncer sin efectos secundarios',
    content: `Un nuevo estudio revela que el radio, elemento descubierto por Marie Curie en 1898, era ampliamente
    utilizado en la década de 1920 como cura milagrosa para el cáncer sin ningún efecto secundario. Productos de radio
    se vendían libremente en farmacias como tónicos energéticos y tratamientos de belleza. Marie Curie consumía agua
    con radio diariamente para mantener su energía durante largas jornadas de investigación. El radio se consideraba
    tan seguro que se añadía a cosméticos, pasta de dientes y hasta chocolate. Expertos de la época afirmaban que la
    radiación era beneficiosa para la salud humana en cualquier dosis.`,
    source: 'Pseudociencia Hoy',
    date: '2024-03-25',
  },
];

export const mockSources: SourceReference[] = [
  {
    name: 'Nobel Prize Official Website',
    url: 'https://www.nobelprize.org',
    credibilityScore: 98,
    type: 'government',
  },
  {
    name: 'Encyclopaedia Britannica',
    url: 'https://www.britannica.com',
    credibilityScore: 95,
    type: 'encyclopedia',
  },
  {
    name: 'Nature Journal',
    url: 'https://www.nature.com',
    credibilityScore: 97,
    type: 'academic',
  },
  {
    name: 'Science Magazine',
    url: 'https://www.science.org',
    credibilityScore: 96,
    type: 'academic',
  },
  {
    name: 'BBC History',
    url: 'https://www.bbc.com/history',
    credibilityScore: 90,
    type: 'news',
  },
];

export const mockFactCheckResults: Record<string, FactCheckResult[]> = {
  '1': [
    {
      claimId: 'claim-1-1',
      verdict: 'false',
      confidence: 0.95,
      sources: [mockSources[0], mockSources[1]],
      explanation: 'Henri Becquerel descubrió la radioactividad en 1896, no Marie Curie. Marie y Pierre Curie investigaron la radioactividad y descubrieron el polonio y el radio, pero no descubrieron el fenómeno en sí.',
    },
    {
      claimId: 'claim-1-2',
      verdict: 'true',
      confidence: 0.99,
      sources: [mockSources[0], mockSources[2]],
      explanation: 'Marie Curie efectivamente descubrió el polonio (nombrado en honor a Polonia) y el radio junto con su esposo Pierre en 1898.',
    },
    {
      claimId: 'claim-1-3',
      verdict: 'true',
      confidence: 0.99,
      sources: [mockSources[0]],
      explanation: 'Marie Curie es la única persona en la historia en ganar Premios Nobel en dos campos científicos diferentes: Física (1903) y Química (1911).',
    },
  ],
  '2': [
    {
      claimId: 'claim-2-1',
      verdict: 'true',
      confidence: 0.98,
      sources: [mockSources[1], mockSources[4]],
      explanation: 'Marie Curie se convirtió en la primera mujer profesora de la Universidad de París en 1906, asumiendo la cátedra de su fallecido esposo Pierre.',
    },
    {
      claimId: 'claim-2-2',
      verdict: 'true',
      confidence: 0.97,
      sources: [mockSources[4], mockSources[3]],
      explanation: 'Durante la Primera Guerra Mundial, Marie Curie desarrolló unidades móviles de rayos X llamadas "petites Curies" que se usaron para diagnosticar soldados heridos en el frente.',
    },
  ],
  '3': [
    {
      claimId: 'claim-3-1',
      verdict: 'false',
      confidence: 0.99,
      sources: [mockSources[2], mockSources[3]],
      explanation: 'El radio es extremadamente peligroso y radioactivo. Nunca fue una cura sin efectos secundarios. La radiación del radio causa cáncer y daño severo a los tejidos.',
    },
    {
      claimId: 'claim-3-2',
      verdict: 'misleading',
      confidence: 0.95,
      sources: [mockSources[1], mockSources[4]],
      explanation: 'Si bien productos con radio se vendieron en la década de 1920, esto fue antes de comprender completamente sus peligros. Marie Curie NO consumía agua con radio intencionalmente como tónico.',
    },
    {
      claimId: 'claim-3-3',
      verdict: 'false',
      confidence: 0.98,
      sources: [mockSources[2]],
      explanation: 'Completamente falso. La radiación en altas dosis es extremadamente peligrosa. Marie Curie murió de anemia aplásica causada por exposición prolongada a la radiación.',
    },
  ],
};
