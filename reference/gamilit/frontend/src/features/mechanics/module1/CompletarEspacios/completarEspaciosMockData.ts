import { CompletarEspaciosData } from './completarEspaciosTypes';

export const mockCompletarEspaciosExercises: CompletarEspaciosData[] = [
  {
    id: 'completar-espacios-001',
    title: 'Completa los espacios en blanco',
    description: 'Lee el texto y completa los espacios en blanco con las palabras correctas del banco de palabras. Módulo 1 - Ejercicio 4',
    difficulty: 'medio',
    estimatedTime: 360,
    topic: 'Marie Curie - Módulo 1: Comprensión Literal',
    hints: [
      { id: 'hint-ce1', text: 'Marie nació en la capital de Polonia', cost: 15 },
      { id: 'hint-ce2', text: 'El nombre del padre empieza con W', cost: 15 },
      { id: 'hint-ce3', text: 'La madre se llamaba Bronisława', cost: 15 }
    ],
    scenarioText: 'Marie Curie provenía de una familia polaca muy dedicada a la educación y las ciencias. Sus padres fueron grandes influencias en su desarrollo intelectual.',
    text: 'Marie Sklodowska nació en ___, Polonia. Su padre ___ era profesor de matemáticas y física, mientras que su madre ___ dirigía una escuela prestigiosa. La familia valoraba mucho la ___ y Marie mostró desde pequeña gran curiosidad por las ___ y ___.',
    blanks: [
      {
        id: 'blank-1',
        position: 0,
        correctAnswer: 'Varsovia',
        alternatives: ['varsovia']
      },
      {
        id: 'blank-2',
        position: 1,
        correctAnswer: 'Władysław',
        alternatives: ['Wladyslaw', 'władysław', 'wladyslaw']
      },
      {
        id: 'blank-3',
        position: 2,
        correctAnswer: 'Bronisława',
        alternatives: ['Bronislawa', 'bronisława', 'bronislawa']
      },
      {
        id: 'blank-4',
        position: 3,
        correctAnswer: 'educación',
        alternatives: ['educacion']
      },
      {
        id: 'blank-5',
        position: 4,
        correctAnswer: 'ciencias',
        alternatives: []
      },
      {
        id: 'blank-6',
        position: 5,
        correctAnswer: 'matemáticas',
        alternatives: ['matematicas']
      }
    ],
    wordBank: [
      'Varsovia',
      'Władysław',
      'Bronisława',
      'educación',
      'ciencias',
      'Polonia',
      'matemáticas',
      'física'
    ]
  }
];
