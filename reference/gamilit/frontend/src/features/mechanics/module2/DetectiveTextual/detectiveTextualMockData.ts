/**
 * Detective Textual Mock Data - Marie Curie Investigation
 */

import type { Investigation, Evidence } from './detectiveTextualTypes';

export const mockEvidence: Evidence[] = [
  {
    id: 'evidence-1',
    type: 'letter',
    title: 'Carta a Bronia (1891)',
    content:
      'Querida hermana, he sido aceptada en la Sorbonne. Estudiaré física y matemáticas. París es fascinante, aunque vivo con muy poco dinero. Pero nada me detendrá en mi búsqueda del conocimiento.',
    date: '1891-11-03',
    discovered: true,
    relevance: 0.85,
  },
  {
    id: 'evidence-2',
    type: 'document',
    title: 'Notas de Laboratorio (1898)',
    content:
      'Observo que el tono de pechblenda emite radiación más intensa que el uranio puro. Esto sugiere la presencia de un elemento desconocido. Pierre y yo hemos decidido aislar este elemento. El proceso es arduo.',
    date: '1898-07-18',
    discovered: false,
    relevance: 0.95,
  },
  {
    id: 'evidence-3',
    type: 'photo',
    title: 'Fotografía del Laboratorio',
    content:
      'Imagen del laboratorio improvisado donde Marie y Pierre trabajaban. Equipamiento básico, sin ventilación adecuada.',
    imageUrl: '/images/curie-lab.jpg',
    discovered: false,
    relevance: 0.75,
  },
  {
    id: 'evidence-4',
    type: 'document',
    title: 'Registro Médico (1903)',
    content:
      'La paciente Marie Curie presenta quemaduras en las manos y fatiga crónica. Atribuye los síntomas a largas jornadas de trabajo. Se recomienda descanso.',
    date: '1903-12-10',
    discovered: false,
    relevance: 0.90,
  },
  {
    id: 'evidence-5',
    type: 'note',
    title: 'Nota Personal',
    content:
      'El material brilla en la oscuridad con una luz verde-azulada. Es hermoso y terrible a la vez. No puedo dejar de preguntarme sobre su naturaleza.',
    date: '1898-12-21',
    discovered: false,
    relevance: 0.80,
  },
  {
    id: 'evidence-6',
    type: 'letter',
    title: 'Carta de Pierre a Marie (1894)',
    content:
      'Estimada Mademoiselle Sklodowska, sería un honor trabajar con usted en mi laboratorio. Su trabajo en magnetismo es excepcional. Adjunto las especificaciones del equipamiento disponible.',
    date: '1894-03-15',
    discovered: false,
    relevance: 0.70,
  },
];

export const mockInvestigation: Investigation = {
  id: 'investigation-marie-curie-1',
  title: 'El Misterio de los Elementos Radiactivos',
  description:
    'Investiga cómo Marie Curie descubrió el radio y el polonio, y las consecuencias de trabajar con materiales radiactivos sin protección.',
  mystery:
    '¿Cómo logró Marie Curie descubrir nuevos elementos, y qué precio pagó por su dedicación a la ciencia?',
  availableEvidence: mockEvidence,
  // FE-059: correctConnections field removed - sanitized for security
  /* correctConnections: [
    {
      id: 'conn-1',
      fromEvidenceId: 'evidence-2',
      toEvidenceId: 'evidence-5',
      relationship: 'Ambos documentos describen las propiedades luminiscentes del radio',
      userCreated: false,
      isCorrect: true,
    },
    {
      id: 'conn-2',
      fromEvidenceId: 'evidence-3',
      toEvidenceId: 'evidence-4',
      relationship: 'Las condiciones del laboratorio causaron problemas de salud',
      userCreated: false,
      isCorrect: true,
    },
    {
      id: 'conn-3',
      fromEvidenceId: 'evidence-6',
      toEvidenceId: 'evidence-2',
      relationship: 'Pierre invitó a Marie, iniciando su colaboración científica',
      userCreated: false,
      isCorrect: true,
    },
  ], */
  difficulty: 'medio',
};
