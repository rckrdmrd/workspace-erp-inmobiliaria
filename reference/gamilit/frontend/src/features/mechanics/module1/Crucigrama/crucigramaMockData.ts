import { CrucigramaData } from './crucigramaTypes';
import { DifficultyLevel } from '@shared/types/educational.types';

// Helper function to create grid
const createGrid = (rows: number, cols: number): CrucigramaData['grid'] => {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      letter: '',
      isBlack: false,
      userInput: ''
    }))
  );
};

export const mockCrucigramaExercises: CrucigramaData[] = [
  {
    id: 'crucigrama-001',
    title: 'Crucigrama Científico: Descubrimientos de Marie Curie',
    description: 'Resuelve este crucigrama de 15×15 sobre los descubrimientos científicos de Marie Curie. Basado en PDF oficial v3.0',
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedTime: 600, // 10 minutos
    topic: 'Marie Curie - Módulo 1: Comprensión Literal',
    hints: [
      {
        id: 'hint-001',
        text: 'El elemento descubierto por Marie Curie tiene símbolo Ra',
        cost: 15
      },
      {
        id: 'hint-002',
        text: 'El fenómeno descubierto por los Curie está en la fila 5',
        cost: 15
      },
      {
        id: 'hint-003',
        text: 'Marie Curie fue la primera mujer en recibir este galardón (vertical, fila 1)',
        cost: 15
      }
    ],
    rows: 15,
    cols: 15,
    grid: (() => {
      // PDF Grid: 15×15 con 6 palabras exactas del PDF
      const grid = createGrid(15, 15);

      // 1. HORIZONTAL (Fila 5, Col 1): "Fenómeno descubierto por los Curie" → RADIACTIVIDAD
      'RADIACTIVIDAD'.split('').forEach((letter, i) => {
        grid[4][i].letter = letter; // Fila 5 = index 4
        if (i === 0) grid[4][i].number = 1;
      });

      // 2. VERTICAL (Fila 2, Col 5): "Elemento nombrado por la patria de Marie" → POLONIO
      'POLONIO'.split('').forEach((letter, i) => {
        grid[1 + i][4].letter = letter; // Fila 2 = index 1, Col 5 = index 4
        if (i === 0) grid[1][4].number = 2;
      });

      // 3. HORIZONTAL (Fila 8, Col 3): "Elemento que brilla en la oscuridad" → RADIO
      'RADIO'.split('').forEach((letter, i) => {
        grid[7][2 + i].letter = letter; // Fila 8 = index 7, Col 3 = index 2
        if (i === 0) grid[7][2].number = 3;
      });

      // 4. VERTICAL (Fila 1, Col 10): "Premio ganado dos veces" → NOBEL
      'NOBEL'.split('').forEach((letter, i) => {
        grid[i][9].letter = letter; // Fila 1 = index 0, Col 10 = index 9
        if (i === 0) grid[0][9].number = 4;
      });

      // 5. HORIZONTAL (Fila 10, Col 4): "Universidad francesa donde estudió" → SORBONA
      'SORBONA'.split('').forEach((letter, i) => {
        grid[9][3 + i].letter = letter; // Fila 10 = index 9, Col 4 = index 3
        if (i === 0) grid[9][3].number = 5;
      });

      // 6. VERTICAL (Fila 3, Col 12): "Apellido de Marie" → CURIE
      'CURIE'.split('').forEach((letter, i) => {
        grid[2 + i][11].letter = letter; // Fila 3 = index 2, Col 12 = index 11
        if (i === 0) grid[2][11].number = 6;
      });

      return grid;
    })(),
    clues: [
      {
        id: 'clue-1',
        number: 1,
        direction: 'horizontal',
        clue: 'Fenómeno descubierto por los Curie',
        answer: 'RADIACTIVIDAD',
        startRow: 4,
        startCol: 0
      },
      {
        id: 'clue-2',
        number: 2,
        direction: 'vertical',
        clue: 'Elemento nombrado por la patria de Marie',
        answer: 'POLONIO',
        startRow: 1,
        startCol: 4
      },
      {
        id: 'clue-3',
        number: 3,
        direction: 'horizontal',
        clue: 'Elemento que brilla en la oscuridad',
        answer: 'RADIO',
        startRow: 7,
        startCol: 2
      },
      {
        id: 'clue-4',
        number: 4,
        direction: 'vertical',
        clue: 'Premio ganado dos veces',
        answer: 'NOBEL',
        startRow: 0,
        startCol: 9
      },
      {
        id: 'clue-5',
        number: 5,
        direction: 'horizontal',
        clue: 'Universidad francesa donde estudió',
        answer: 'SORBONA',
        startRow: 9,
        startCol: 3
      },
      {
        id: 'clue-6',
        number: 6,
        direction: 'vertical',
        clue: 'Apellido de Marie',
        answer: 'CURIE',
        startRow: 2,
        startCol: 11
      }
    ]
  },
  {
    id: 'crucigrama-002',
    title: 'Crucigrama: Vida de Marie Curie',
    description: 'Completa este crucigrama sobre la biografía de Marie Curie',
    difficulty: DifficultyLevel.BEGINNER,
    estimatedTime: 480,
    topic: 'Marie Curie - Biografía',
    hints: [
      {
        id: 'hint-004',
        text: 'Marie Curie nació en este país europeo',
        cost: 5
      },
      {
        id: 'hint-005',
        text: 'El nombre de su esposo científico',
        cost: 8
      }
    ],
    rows: 8,
    cols: 8,
    grid: (() => {
      const grid = createGrid(8, 8);
      // POLONIA (row 1, col 1-7)
      'POLONIA'.split('').forEach((letter, i) => {
        grid[1][1 + i].letter = letter;
        if (i === 0) grid[1][1 + i].number = 1;
      });
      // PIERRE (row 3, col 2-7)
      'PIERRE'.split('').forEach((letter, i) => {
        grid[3][2 + i].letter = letter;
        if (i === 0) grid[3][2 + i].number = 3;
      });
      // PARIS (row 5, col 3-7)
      'PARIS'.split('').forEach((letter, i) => {
        grid[5][3 + i].letter = letter;
        if (i === 0) grid[5][3 + i].number = 5;
      });
      return grid;
    })(),
    clues: [
      {
        id: 'clue-8',
        number: 1,
        direction: 'horizontal',
        clue: 'País donde nació Marie Curie',
        answer: 'POLONIA',
        startRow: 1,
        startCol: 1
      },
      {
        id: 'clue-9',
        number: 2,
        direction: 'vertical',
        clue: 'Nombre real de Marie Curie',
        answer: 'MARIA',
        startRow: 0,
        startCol: 3
      },
      {
        id: 'clue-10',
        number: 3,
        direction: 'horizontal',
        clue: 'Nombre de su esposo y colaborador',
        answer: 'PIERRE',
        startRow: 3,
        startCol: 2
      },
      {
        id: 'clue-11',
        number: 5,
        direction: 'horizontal',
        clue: 'Ciudad donde vivió y trabajó Marie Curie',
        answer: 'PARIS',
        startRow: 5,
        startCol: 3
      }
    ]
  },
  {
    id: 'crucigrama-003',
    title: 'Crucigrama Avanzado: Legado Científico',
    description: 'Crucigrama desafiante sobre el impacto científico de Marie Curie',
    difficulty: DifficultyLevel.ADVANCED,
    estimatedTime: 900,
    topic: 'Marie Curie - Legado',
    hints: [
      {
        id: 'hint-006',
        text: 'Marie Curie fue pionera en el tratamiento del cáncer con este método',
        cost: 12
      },
      {
        id: 'hint-007',
        text: 'La unidad de radioactividad lleva su nombre',
        cost: 15
      }
    ],
    rows: 12,
    cols: 12,
    grid: createGrid(12, 12),
    clues: [
      {
        id: 'clue-12',
        number: 1,
        direction: 'horizontal',
        clue: 'Tratamiento contra el cáncer desarrollado a partir de sus descubrimientos',
        answer: 'RADIOTERAPIA',
        startRow: 2,
        startCol: 0
      },
      {
        id: 'clue-13',
        number: 2,
        direction: 'vertical',
        clue: 'Unidad de medida de radioactividad nombrada en su honor',
        answer: 'CURIO',
        startRow: 0,
        startCol: 5
      },
      {
        id: 'clue-14',
        number: 3,
        direction: 'horizontal',
        clue: 'Instituto fundado por Marie Curie',
        answer: 'RADIUM',
        startRow: 6,
        startCol: 3
      }
    ]
  }
];
