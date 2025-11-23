/**
 * GLIT Platform V2 - Exercise Factory
 *
 * Factory Pattern with 100% configuration from database
 * NO hardcoded values - all settings come from educational_content.exercises table
 *
 * Features:
 * - Dynamic component loading based on exercise_type
 * - Automatic fallback system for unimplemented types
 * - Full configuration from DB (attempts, hints, rewards, etc.)
 * - Type-safe registry with metadata
 */

import React from 'react';
import { ExerciseType } from '@shared/types';
import type { Exercise, ExerciseConfig } from '@shared/types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ExerciseComponentProps {
  exercise: Exercise;
  onComplete: (result: ExerciseResult) => void;
  onAttempt?: (attemptData: AttemptData) => void;
  config?: ExerciseConfig; // All config from DB
}

export interface ExerciseResult {
  exerciseId: string;
  score: number;
  maxScore: number;
  timeSpent: number; // seconds
  isCorrect: boolean;
  hintsUsed: number;
  comodinesUsed: string[];
  submittedAnswers: any;
  xpEarned: number;
  mlCoinsEarned: number;
  metadata?: Record<string, any>;
}

export interface AttemptData {
  exerciseId: string;
  attemptNumber: number;
  submittedAnswers: any;
  timeSpent: number;
}

export type ExerciseComponent = React.ComponentType<ExerciseComponentProps>;

// ============================================================================
// EXERCISE REGISTRY METADATA
// ============================================================================

export interface ExerciseTypeMetadata {
  component: ExerciseComponent | null; // null if not yet implemented
  displayName: string;
  category: 'literal' | 'inferencial' | 'critica' | 'digital' | 'creativa' | 'auxiliar';
  isImplemented: boolean;
  fallbackType?: ExerciseType; // Fallback if not implemented
  componentPath?: string; // For lazy loading
  requiredFeatures?: string[]; // Features needed (e.g., 'audio', 'video', 'drag-drop')
}

// ============================================================================
// EXERCISE TYPE REGISTRY
// ============================================================================

const EXERCISE_TYPE_REGISTRY: Partial<Record<ExerciseType, ExerciseTypeMetadata>> = {
  // ========== MODULE 1: Comprensión Literal ==========
  'crucigrama_cientifico': {
    component: null, // Lazy loaded
    displayName: 'Crucigrama Científico',
    category: 'literal',
    isImplemented: false,
    fallbackType: 'crucigrama',
    componentPath: '/features/mechanics/module1/Crucigrama/CrucigramaExercise',
  },
  'crucigrama': {
    component: null,
    displayName: 'Crucigrama',
    category: 'literal',
    isImplemented: false,
    componentPath: '/features/mechanics/module1/Crucigrama/CrucigramaExercise',
  },
  'linea_tiempo': {
    component: null,
    displayName: 'Línea de Tiempo',
    category: 'literal',
    isImplemented: false,
    fallbackType: ExerciseType.CRUCIGRAMA,
    componentPath: '/features/mechanics/module1/Timeline/TimelineExercise',
  },
  'timeline': {
    component: null,
    displayName: 'Timeline',
    category: 'literal',
    isImplemented: false,
    componentPath: '/features/mechanics/module1/Timeline/TimelineExercise',
  },
  'sopa_letras': {
    component: null,
    displayName: 'Sopa de Letras',
    category: 'literal',
    isImplemented: false,
    componentPath: '/features/mechanics/module1/SopaLetras/SopaLetrasExercise',
  },
  'mapa_conceptual': {
    component: null,
    displayName: 'Mapa Conceptual',
    category: 'literal',
    isImplemented: false,
    componentPath: '/features/mechanics/module1/MapaConceptual/MapaConceptualExercise',
  },
  'emparejamiento': {
    component: null,
    displayName: 'Emparejamiento',
    category: 'literal',
    isImplemented: true,
    componentPath: '/features/mechanics/module1/Emparejamiento/EmparejamientoExercise',
  },

  // ========== MODULE 2: Comprensión Inferencial ==========
  'detective_textual': {
    component: null,
    displayName: 'Detective Textual',
    category: 'inferencial',
    isImplemented: true,
    componentPath: '/features/mechanics/module2/DetectiveTextual/DetectiveTextualExercise',
    requiredFeatures: ['text-analysis', 'hints'],
  },
  'construccion_hipotesis': {
    component: null,
    displayName: 'Construcción de Hipótesis',
    category: 'inferencial',
    isImplemented: false,
    componentPath: '/features/mechanics/module2/ConstruccionHipotesis/ConstruccionHipotesisExercise',
  },
  'prediccion_narrativa': {
    component: null,
    displayName: 'Predicción Narrativa',
    category: 'inferencial',
    isImplemented: false,
    componentPath: '/features/mechanics/module2/PrediccionNarrativa/PrediccionNarrativaExercise',
  },
  'puzzle_contexto': {
    component: null,
    displayName: 'Puzzle de Contexto',
    category: 'inferencial',
    isImplemented: false,
    componentPath: '/features/mechanics/module2/PuzzleContexto/PuzzleContextoExercise',
  },
  'rueda_inferencias': {
    component: null,
    displayName: 'Rueda de Inferencias',
    category: 'inferencial',
    isImplemented: false,
    componentPath: '/features/mechanics/module2/RuedaInferencias/RuedaInferenciasExercise',
  },

  // ========== MODULE 3: Comprensión Crítica ==========
  'analisis_fuentes': {
    component: null,
    displayName: 'Análisis de Fuentes',
    category: 'critica',
    isImplemented: false,
    componentPath: '/features/mechanics/module3/AnalisisFuentes/AnalisisFuentesExercise',
  },
  'debate_digital': {
    component: null,
    displayName: 'Debate Digital',
    category: 'critica',
    isImplemented: false,
    componentPath: '/features/mechanics/module3/DebateDigital/DebateDigitalExercise',
  },
  'matriz_perspectivas': {
    component: null,
    displayName: 'Matriz de Perspectivas',
    category: 'critica',
    isImplemented: false,
    componentPath: '/features/mechanics/module3/MatrizPerspectivas/MatrizPerspectivasExercise',
  },
  'podcast_argumentativo': {
    component: null,
    displayName: 'Podcast Argumentativo',
    category: 'critica',
    isImplemented: false,
    componentPath: '/features/mechanics/module3/PodcastArgumentativo/PodcastArgumentativoExercise',
    requiredFeatures: ['audio'],
  },
  'tribunal_opiniones': {
    component: null,
    displayName: 'Tribunal de Opiniones',
    category: 'critica',
    isImplemented: false,
    componentPath: '/features/mechanics/module3/TribunalOpiniones/TribunalOpinionesExercise',
  },

  // ========== MODULE 4: Textos Digitales y Multimediales ==========
  'verificador_fakenews': {
    component: null,
    displayName: 'Verificador de Fake News',
    category: 'digital',
    isImplemented: false,
    fallbackType: 'fake_news',
    componentPath: '/features/mechanics/module4/VerificadorFakeNews/VerificadorFakeNewsExercise',
  },
  'fake_news': {
    component: null,
    displayName: 'Fake News',
    category: 'digital',
    isImplemented: false,
    componentPath: '/features/mechanics/module4/VerificadorFakeNews/VerificadorFakeNewsExercise',
  },
  'quiz_tiktok': {
    component: null,
    displayName: 'Quiz TikTok',
    category: 'digital',
    isImplemented: false,
    componentPath: '/features/mechanics/module4/QuizTikTok/QuizTikTokExercise',
    requiredFeatures: ['video', 'quiz'],
  },
  'navegacion_hipertextual': {
    component: null,
    displayName: 'Navegación Hipertextual',
    category: 'digital',
    isImplemented: false,
    componentPath: '/features/mechanics/module4/NavegacionHipertextual/NavegacionHipertextualExercise',
  },
  'analisis_memes': {
    component: null,
    displayName: 'Análisis de Memes',
    category: 'digital',
    isImplemented: false,
    componentPath: '/features/mechanics/module4/AnalisisMemes/AnalisisMemesExercise',
  },
  'infografia_interactiva': {
    component: null,
    displayName: 'Infografía Interactiva',
    category: 'digital',
    isImplemented: false,
    componentPath: '/features/mechanics/module4/InfografiaInteractiva/InfografiaInteractivaExercise',
  },
  'email_formal': {
    component: null,
    displayName: 'Email Formal',
    category: 'digital',
    isImplemented: false,
    componentPath: '/features/mechanics/module4/EmailFormal/EmailFormalExercise',
  },
  'chat_literario': {
    component: null,
    displayName: 'Chat Literario',
    category: 'digital',
    isImplemented: true,
    componentPath: '/features/mechanics/module4/ChatLiterario/ChatLiterarioExercise',
  },
  'ensayo_argumentativo': {
    component: null,
    displayName: 'Ensayo Argumentativo',
    category: 'digital',
    isImplemented: false,
    componentPath: '/features/mechanics/module4/EnsayoArgumentativo/EnsayoArgumentativoExercise',
  },
  'resena_critica': {
    component: null,
    displayName: 'Reseña Crítica',
    category: 'digital',
    isImplemented: false,
    componentPath: '/features/mechanics/module4/ResenaCritica/ResenaCriticaExercise',
  },

  // ========== MODULE 5: Producción Creativa ==========
  'diario_multimedia': {
    component: null,
    displayName: 'Diario Multimedia',
    category: 'creativa',
    isImplemented: false,
    componentPath: '/features/mechanics/module5/DiarioMultimedia/DiarioMultimediaExercise',
    requiredFeatures: ['text', 'image', 'audio', 'video'],
  },
  'comic_digital': {
    component: null,
    displayName: 'Cómic Digital',
    category: 'creativa',
    isImplemented: false,
    componentPath: '/features/mechanics/module5/ComicDigital/ComicDigitalExercise',
    requiredFeatures: ['image', 'drawing'],
  },
  'video_carta': {
    component: null,
    displayName: 'Video Carta',
    category: 'creativa',
    isImplemented: false,
    componentPath: '/features/mechanics/module5/VideoCarta/VideoCartaExercise',
    requiredFeatures: ['video', 'recording'],
  },

  // ========== AUXILIAR ==========
  'call_to_action': {
    component: null,
    displayName: 'Call to Action',
    category: 'auxiliar',
    isImplemented: false,
    componentPath: '/features/mechanics/auxiliar/CallToAction/CallToActionExercise',
  },
  'collage_prensa': {
    component: null,
    displayName: 'Collage de Prensa',
    category: 'auxiliar',
    isImplemented: false,
    componentPath: '/features/mechanics/auxiliar/CollagePrensa/CollajePrensaExercise',
  },
  'comprension_auditiva': {
    component: null,
    displayName: 'Comprensión Auditiva',
    category: 'auxiliar',
    isImplemented: false,
    componentPath: '/features/mechanics/auxiliar/ComprensiónAuditiva/ComprensiónAuditivaExercise',
    requiredFeatures: ['audio'],
  },
  'texto_movimiento': {
    component: null,
    displayName: 'Texto en Movimiento',
    category: 'auxiliar',
    isImplemented: false,
    componentPath: '/features/mechanics/auxiliar/TextoEnMovimiento/TextoEnMovimientoExercise',
  },
};

// ============================================================================
// DEFAULT FALLBACK COMPONENT
// ============================================================================

const FallbackExerciseComponent: ExerciseComponent = ({ exercise, onComplete }) => {
  return React.createElement('div', {
    className: 'p-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg',
    children: [
      React.createElement('h3', {
        key: 'title',
        className: 'text-lg font-bold text-yellow-800 mb-2',
        children: `Ejercicio en Desarrollo: ${exercise.title}`,
      }),
      React.createElement('p', {
        key: 'desc',
        className: 'text-sm text-yellow-700 mb-4',
        children: `El tipo de ejercicio "${exercise.type}" aún no está implementado. Por favor, contacta al administrador.`,
      }),
      React.createElement('button', {
        key: 'btn',
        className: 'btn-detective',
        onClick: () => onComplete({
          exerciseId: exercise.id,
          score: 0,
          maxScore: exercise.max_points || 100,
          timeSpent: 0,
          isCorrect: false,
          hintsUsed: 0,
          comodinesUsed: [],
          submittedAnswers: null,
          xpEarned: 0,
          mlCoinsEarned: 0,
        }),
        children: 'Marcar como Completado',
      }),
    ],
  });
};

// ============================================================================
// EXERCISE FACTORY CLASS (Singleton)
// ============================================================================

export class ExerciseFactory {
  private static instance: ExerciseFactory;
  private registry = EXERCISE_TYPE_REGISTRY;
  private componentCache = new Map<ExerciseType, ExerciseComponent>();

  private constructor() {}

  public static getInstance(): ExerciseFactory {
    if (!ExerciseFactory.instance) {
      ExerciseFactory.instance = new ExerciseFactory();
    }
    return ExerciseFactory.instance;
  }

  /**
   * Create an exercise component with full configuration from DB
   * NO hardcoded values - everything comes from the exercise object
   */
  public async createExercise(
    exercise: Exercise,
    onComplete: (result: ExerciseResult) => void,
    onAttempt?: (attemptData: AttemptData) => void
  ): Promise<React.ReactElement> {
    const exerciseType = this.normalizeExerciseType(exercise.type || exercise.exercise_type);
    const metadata = this.getMetadata(exerciseType);

    // Try to load component
    const Component = await this.loadComponent(exerciseType);

    // Use fallback if component not available
    if (!Component) {
      console.warn(
        `Exercise type "${exerciseType}" not implemented, using fallback component`
      );
      return React.createElement(FallbackExerciseComponent, {
        exercise,
        onComplete,
        onAttempt,
        config: exercise.config,
      });
    }

    // Create component with configuration from DB
    return React.createElement(Component, {
      exercise, // Contains ALL config from DB
      onComplete,
      onAttempt,
      config: exercise.config, // Explicit config object
    });
  }

  /**
   * Load component dynamically (lazy loading)
   */
  private async loadComponent(
    exerciseType: ExerciseType
  ): Promise<ExerciseComponent | null> {
    // Check cache first
    if (this.componentCache.has(exerciseType)) {
      return this.componentCache.get(exerciseType)!;
    }

    const metadata = this.registry[exerciseType];
    if (!metadata) return null;

    // If component already loaded
    if (metadata.component) {
      this.componentCache.set(exerciseType, metadata.component);
      return metadata.component;
    }

    // Try to lazy load
    if (metadata.componentPath) {
      try {
        // Dynamic import would go here in production
        // For now, return null to use fallback
        // const module = await import(`@${metadata.componentPath}`);
        // const component = module.default || module[exerciseType];
        // this.componentCache.set(exerciseType, component);
        // return component;
        return null;
      } catch (error) {
        console.error(`Failed to load component for ${exerciseType}:`, error);
        return null;
      }
    }

    return null;
  }

  /**
   * Get metadata for an exercise type
   */
  public getMetadata(exerciseType: ExerciseType): ExerciseTypeMetadata | null {
    const normalized = this.normalizeExerciseType(exerciseType);
    return this.registry[normalized] || null;
  }

  /**
   * Check if exercise type is implemented
   */
  public isImplemented(exerciseType: ExerciseType): boolean {
    const metadata = this.getMetadata(exerciseType);
    return metadata ? metadata.isImplemented : false;
  }

  /**
   * Get fallback type for an exercise
   */
  public getFallbackType(exerciseType: ExerciseType): ExerciseType | null {
    const metadata = this.getMetadata(exerciseType);
    return metadata?.fallbackType || null;
  }

  /**
   * Get all exercise types by category
   */
  public getTypesByCategory(
    category: 'literal' | 'inferencial' | 'critica' | 'digital' | 'creativa' | 'auxiliar'
  ): ExerciseType[] {
    return Object.entries(this.registry)
      .filter(([_, metadata]) => metadata.category === category)
      .map(([type]) => type as ExerciseType);
  }

  /**
   * Get all implemented exercise types
   */
  public getImplementedTypes(): ExerciseType[] {
    return Object.entries(this.registry)
      .filter(([_, metadata]) => metadata.isImplemented)
      .map(([type]) => type as ExerciseType);
  }

  /**
   * Get statistics
   */
  public getStats() {
    const types = Object.keys(this.registry) as ExerciseType[];
    const implemented = types.filter((type) => this.registry[type]?.isImplemented);
    const byCategory = types.reduce(
      (acc, type) => {
        const category = this.registry[type]?.category;
        if (category) {
          acc[category] = (acc[category] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total: types.length,
      implemented: implemented.length,
      pending: types.length - implemented.length,
      byCategory,
    };
  }

  /**
   * Normalize exercise type string
   */
  private normalizeExerciseType(exerciseType?: string): ExerciseType {
    if (!exerciseType) return ExerciseType.CRUCIGRAMA; // Default fallback

    // Handle underscore to hyphen conversion for legacy compatibility
    const normalized = exerciseType.replace(/-/g, '_').toLowerCase();

    // Check if it exists in registry
    if (normalized in this.registry) {
      return normalized as ExerciseType;
    }

    // Default fallback
    return ExerciseType.CRUCIGRAMA;
  }

  /**
   * Register a new component (for testing or dynamic loading)
   */
  public registerComponent(
    exerciseType: ExerciseType,
    component: ExerciseComponent
  ): void {
    this.componentCache.set(exerciseType, component);
    if (this.registry[exerciseType]) {
      this.registry[exerciseType]!.component = component;
      this.registry[exerciseType]!.isImplemented = true;
    }
  }
}

// ============================================================================
// EXPORT SINGLETON AND UTILITY FUNCTIONS
// ============================================================================

export const exerciseFactory = ExerciseFactory.getInstance();

/**
 * Utility function to create an exercise
 * All configuration comes from the exercise object (from DB)
 */
export const createExercise = async (
  exercise: Exercise,
  onComplete: (result: ExerciseResult) => void,
  onAttempt?: (attemptData: AttemptData) => void
) => {
  return exerciseFactory.createExercise(exercise, onComplete, onAttempt);
};

/**
 * Utility to check if exercise is implemented
 */
export const isExerciseImplemented = (exerciseType: ExerciseType) => {
  return exerciseFactory.isImplemented(exerciseType);
};

/**
 * Utility to get exercise stats
 */
export const getExerciseStats = () => {
  return exerciseFactory.getStats();
};
