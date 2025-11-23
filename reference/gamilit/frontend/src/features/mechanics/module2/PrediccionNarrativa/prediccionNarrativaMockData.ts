import type { PrediccionNarrativaData } from './prediccionNarrativaTypes';

export const mockExerciseData: PrediccionNarrativaData = {
  id: 'ex-2-3',
  title: 'Predicción Narrativa: ¿Qué Sucederá Después?',
  subtitle: 'Predice Eventos Basándote en el Contexto',
  description: 'Lee escenarios de la vida de Marie Curie y predice qué sucederá después basándote en el contexto histórico y las pistas del texto.',
  instructions: 'Analiza cada situación y selecciona la predicción más lógica considerando el contexto histórico y las motivaciones de Marie.',
  scenarios: [
    {
      id: 'pred-1',
      context: 'Año 1911. Marie Curie ya ha ganado el Premio Nobel de Física (1903) junto a Pierre Curie y Henri Becquerel por sus investigaciones sobre la radiactividad. Ahora, siendo viuda desde 1906, ha continuado sus investigaciones y ha aislado el radio puro, un logro científico extraordinario.',
      beginning: 'Cuando Marie presentó su candidatura a la Academia de Ciencias Francesa en 1911, siendo ya ganadora del Nobel...',
      question: '¿Cómo continúa más probablemente?',
      predictions: [
        {
          id: 'p1',
          text: 'fue aceptada inmediatamente con honores',
          isCorrect: false,
          explanation: 'Aunque Marie tenía méritos excepcionales, la Academia Francesa era una institución profundamente conservadora que nunca había admitido mujeres en sus más de 200 años de historia.'
        },
        {
          id: 'p2',
          text: 'fue rechazada por ser mujer, a pesar de sus logros',
          isCorrect: true,
          explanation: 'Correcto. A pesar de sus extraordinarios logros científicos, Marie fue rechazada por la Academia de Ciencias Francesa en 1911 por un voto (30-28). Los prejuicios de género de la época pesaron más que sus méritos. Irónicamente, ese mismo año ganó su segundo Nobel, esta vez en Química, convirtiéndose en la primera persona en ganar dos premios Nobel.'
        },
        {
          id: 'p3',
          text: 'decidió retirar su candidatura',
          isCorrect: false,
          explanation: 'Marie no era de las que se rendían ante obstáculos. Su determinación y convicción en su trabajo científico la llevaron a mantener su candidatura hasta el final, a pesar de la oposición.'
        },
        {
          id: 'p4',
          text: 'fue elegida presidenta de la Academia',
          isCorrect: false,
          explanation: 'Este escenario es completamente anacrónico. No solo no fue aceptada, sino que la Academia no admitiría a su primera mujer hasta 1979, décadas después de la muerte de Marie.'
        }
      ],
      contextualHint: 'Considera los prejuicios de género de la época. Recuerda que Marie era perseverante pero modesta, y que los hechos históricos no se pueden cambiar.'
    }
  ]
};
