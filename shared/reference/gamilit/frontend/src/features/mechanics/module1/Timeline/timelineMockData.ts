import { TimelineData } from './timelineTypes';
import { DifficultyLevel } from '@shared/types/educational.types';

export const mockTimelineExercises: TimelineData[] = [
  {
    id: 'timeline-001',
    title: 'Línea de Tiempo de Marie Curie',
    description: 'Arrastra cada evento a su fecha correspondiente en la línea de tiempo. Basado en Módulo 1 - Ejercicio 1',
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedTime: 480,
    topic: 'Marie Curie - Módulo 1: Comprensión Literal',
    hints: [
      { id: 'hint-t1', text: 'Marie Curie nació en Varsovia, Polonia en el siglo XIX', cost: 15 },
      { id: 'hint-t2', text: 'Se trasladó a París antes de recibir su primer Nobel', cost: 15 },
      { id: 'hint-t3', text: 'Recibió dos Premios Nobel en diferentes años', cost: 15 }
    ],
    events: [
      {
        id: 'event-1',
        year: 1867,
        title: 'Nace en Varsovia, Polonia, como Maria Sklodowska',
        description: 'Nace en Varsovia, Polonia, como Maria Sklodowska',
        category: 'Personal'
      },
      {
        id: 'event-2',
        year: 1891,
        title: 'Se traslada a París para estudiar en la Sorbona',
        description: 'Se traslada a París para estudiar en la Sorbona',
        category: 'Educación'
      },
      {
        id: 'event-3',
        year: 1903,
        title: 'Recibe el Premio Nobel de Física junto con Pierre y Becquerel',
        description: 'Recibe el Premio Nobel de Física junto con Pierre y Becquerel',
        category: 'Reconocimiento'
      },
      {
        id: 'event-4',
        year: 1911,
        title: 'Recibe el Premio Nobel de Química por el descubrimiento del radio y polonio',
        description: 'Recibe el Premio Nobel de Química por el descubrimiento del radio y polonio',
        category: 'Reconocimiento'
      }
    ],
    correctOrder: ['event-1', 'event-2', 'event-3', 'event-4']
  },
  {
    id: 'timeline-002',
    title: 'Descubrimientos Científicos de Marie Curie',
    description: 'Ordena los descubrimientos y avances científicos de Marie Curie',
    difficulty: DifficultyLevel.BEGINNER,
    estimatedTime: 360,
    topic: 'Marie Curie - Ciencia',
    hints: [
      { id: 'hint-t4', text: 'La tesis doctoral fue sobre radioactividad', cost: 5 },
      { id: 'hint-t5', text: 'El polonio fue descubierto antes que el radio', cost: 7 }
    ],
    events: [
      {
        id: 'event-10',
        year: 1897,
        title: 'Tesis Doctoral',
        description: 'Comienza su tesis doctoral sobre radioactividad',
        category: 'Investigación'
      },
      {
        id: 'event-11',
        year: 1898,
        title: 'Polonio',
        description: 'Primer elemento descubierto: Polonio',
        category: 'Descubrimiento'
      },
      {
        id: 'event-12',
        year: 1902,
        title: 'Aislamiento del Radio',
        description: 'Logra aislar el radio puro',
        category: 'Descubrimiento'
      },
      {
        id: 'event-13',
        year: 1910,
        title: 'Radio Metálico',
        description: 'Produce radio en forma metálica',
        category: 'Investigación'
      }
    ],
    correctOrder: ['event-10', 'event-11', 'event-12', 'event-13']
  },
  {
    id: 'timeline-003',
    title: 'Reconocimientos Internacionales',
    description: 'Ordena los premios y reconocimientos que recibió Marie Curie',
    difficulty: DifficultyLevel.ADVANCED,
    estimatedTime: 600,
    topic: 'Marie Curie - Logros',
    hints: [
      { id: 'hint-t6', text: 'Fue la primera mujer en recibir un Premio Nobel', cost: 10 },
      { id: 'hint-t7', text: 'Recibió medallas antes de su segundo Nobel', cost: 12 }
    ],
    events: [
      {
        id: 'event-14',
        year: 1903,
        title: 'Nobel de Física',
        description: 'Primer Premio Nobel compartido',
        category: 'Premio'
      },
      {
        id: 'event-15',
        year: 1911,
        title: 'Nobel de Química',
        description: 'Segundo Premio Nobel, esta vez en solitario',
        category: 'Premio'
      },
      {
        id: 'event-16',
        year: 1921,
        title: 'Gira por Estados Unidos',
        description: 'Recibe homenajes y donaciones en EE.UU.',
        category: 'Reconocimiento'
      },
      {
        id: 'event-17',
        year: 1995,
        title: 'Panteón de París',
        description: 'Sus restos son trasladados al Panteón de París (póstumamente)',
        category: 'Homenaje'
      }
    ],
    correctOrder: ['event-14', 'event-15', 'event-16', 'event-17']
  }
];
