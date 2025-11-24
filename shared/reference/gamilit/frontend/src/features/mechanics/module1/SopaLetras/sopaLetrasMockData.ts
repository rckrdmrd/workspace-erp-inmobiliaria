import { SopaLetrasData } from './sopaLetrasTypes';
import { DifficultyLevel } from '@shared/types/educational.types';

const createGrid = (rows: number, cols: number): string[][] => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => letters[Math.floor(Math.random() * letters.length)])
  );
};

export const mockSopaLetrasExercises: SopaLetrasData[] = [
  {
    id: 'sopa-001',
    title: 'Sopa de Letras: Conceptos Científicos de Marie Curie',
    description: 'Encuentra palabras relacionadas con el trabajo científico de Marie Curie',
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedTime: 600,
    topic: 'Marie Curie - Vocabulario Científico',
    hints: [
      { id: 'hint-s1', text: 'Busca el nombre de los elementos que descubrió', cost: 5 },
      { id: 'hint-s2', text: 'El fenómeno que estudió comienza con R', cost: 8 }
    ],
    rows: 12,
    cols: 12,
    config: {
      gridSize: { rows: 12, cols: 12 },
      useStaticGrid: true,
      directions: ['horizontal', 'vertical', 'diagonal'],
      selectionMode: 'click-drag',
      highlightFound: true
    },
    content: {
      grid: (() => {
        const grid = createGrid(12, 12);
        'RADIOACTIVIDAD'.split('').forEach((l, i) => { grid[0][i] = l; });
        'POLONIO'.split('').forEach((l, i) => { grid[2][i] = l; });
        'RADIO'.split('').forEach((l, i) => { grid[4][i] = l; });
        'CURIO'.split('').forEach((l, i) => { grid[6][i] = l; });
        'NOBEL'.split('').forEach((l, i) => { grid[8][i] = l; });
        return grid;
      })(),
      words: ['RADIOACTIVIDAD', 'POLONIO', 'RADIO', 'CURIO', 'NOBEL'],
      wordsPositions: [
        { word: 'RADIOACTIVIDAD', startRow: 0, startCol: 0, direction: 'horizontal', found: false },
        { word: 'POLONIO', startRow: 2, startCol: 0, direction: 'horizontal', found: false },
        { word: 'RADIO', startRow: 4, startCol: 0, direction: 'horizontal', found: false },
        { word: 'CURIO', startRow: 6, startCol: 0, direction: 'horizontal', found: false },
        { word: 'NOBEL', startRow: 8, startCol: 0, direction: 'horizontal', found: false }
      ]
    }
  }
];
