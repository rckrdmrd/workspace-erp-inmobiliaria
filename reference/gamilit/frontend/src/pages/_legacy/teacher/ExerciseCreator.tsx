/**
 * ExerciseCreator Component
 *
 * Allows teachers to create new exercises of various types.
 * Supports all exercise mechanics: MultipleChoice, TrueFalse, FillBlank,
 * DragDrop, Ordering, and Matching.
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthContext';
import { TeacherLayout } from '@/apps/teacher/layouts/TeacherLayout';

// ===== TYPES =====

type ExerciseType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'
  | 'drag_drop'
  | 'ordering'
  | 'matching';

type ExerciseDifficulty = 'facil' | 'intermedio' | 'avanzado' | 'experto';

interface ExerciseFormData {
  title: string;
  instructions: string;
  type: ExerciseType;
  difficulty: ExerciseDifficulty;
  xp_reward: number;
  ml_coins_reward: number;
  time_limit_seconds?: number;
  module_id?: string;
  activity_id?: string;
  hints: HintData[];
  content: ExerciseContent;
}

interface HintData {
  id: string;
  text: string;
  ml_coins_cost: number;
  order: number;
}

interface ExerciseContent {
  // Multiple Choice
  question?: string;
  options?: OptionData[];

  // True/False
  statement?: string;
  correct_answer?: boolean;

  // Fill Blank
  text?: string;
  blanks?: BlankData[];

  // Drag Drop
  drop_zones?: DropZoneData[];
  items?: DragItemData[];

  // Ordering
  sequence?: SequenceItemData[];

  // Matching
  left_items?: MatchItemData[];
  right_items?: MatchItemData[];
  correct_pairs?: MatchPairData[];
}

interface OptionData {
  id: string;
  text: string;
  is_correct: boolean;
}

interface BlankData {
  id: string;
  position: number;
  correct_answer: string;
  accept_variations: string[];
}

interface DropZoneData {
  id: string;
  label: string;
  accepts_multiple: boolean;
  correct_items: string[];
}

interface DragItemData {
  id: string;
  text: string;
  image_url?: string;
}

interface SequenceItemData {
  id: string;
  text: string;
  correct_position: number;
}

interface MatchItemData {
  id: string;
  text: string;
  image_url?: string;
}

interface MatchPairData {
  left_id: string;
  right_id: string;
}

interface Module {
  id: string;
  name: string;
}

interface Activity {
  id: string;
  name: string;
  module_id: string;
}

// ===== HELPER FUNCTIONS =====

const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ===== MAIN COMPONENT =====

export const ExerciseCreator: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState<ExerciseFormData>({
    title: '',
    instructions: '',
    type: 'multiple_choice',
    difficulty: 'intermedio',
    xp_reward: 50,
    ml_coins_reward: 10,
    hints: [],
    content: {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Load modules and activities
  React.useEffect(() => {
    // TODO: Replace with actual API call
    const mockModules: Module[] = [
      { id: '1', name: 'Introducción a las Matemáticas Mayas' },
      { id: '2', name: 'Sistema Numérico Vigesimal' },
      { id: '3', name: 'Operaciones Básicas' },
    ];

    const mockActivities: Activity[] = [
      { id: '1', name: 'Actividad 1: Conceptos básicos', module_id: '1' },
      { id: '2', name: 'Actividad 2: Práctica de símbolos', module_id: '1' },
      { id: '3', name: 'Actividad 1: Conversión de números', module_id: '2' },
    ];

    setModules(mockModules);
    setActivities(mockActivities);
  }, []);

  // Filtered activities based on selected module
  const filteredActivities = formData.module_id
    ? activities.filter((a) => a.module_id === formData.module_id)
    : [];

  // Update form field
  const updateField = useCallback((field: keyof ExerciseFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }, []);

  // Update content field
  const updateContent = useCallback((field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      content: { ...prev.content, [field]: value },
    }));
  }, []);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Las instrucciones son requeridas';
    }

    // Type-specific validation
    switch (formData.type) {
      case 'multiple_choice':
        if (!formData.content.question?.trim()) {
          newErrors.question = 'La pregunta es requerida';
        }
        if (!formData.content.options || formData.content.options.length < 2) {
          newErrors.options = 'Se requieren al menos 2 opciones';
        }
        if (formData.content.options && !formData.content.options.some((o) => o.is_correct)) {
          newErrors.options = 'Debe haber al menos una respuesta correcta';
        }
        break;

      case 'true_false':
        if (!formData.content.statement?.trim()) {
          newErrors.statement = 'La declaración es requerida';
        }
        if (formData.content.correct_answer === undefined) {
          newErrors.correct_answer = 'Debe indicar si es verdadero o falso';
        }
        break;

      case 'fill_blank':
        if (!formData.content.text?.trim()) {
          newErrors.text = 'El texto es requerido';
        }
        if (!formData.content.blanks || formData.content.blanks.length === 0) {
          newErrors.blanks = 'Se requiere al menos un espacio en blanco';
        }
        break;

      case 'drag_drop':
        if (!formData.content.drop_zones || formData.content.drop_zones.length === 0) {
          newErrors.drop_zones = 'Se requiere al menos una zona de soltar';
        }
        if (!formData.content.items || formData.content.items.length === 0) {
          newErrors.items = 'Se requiere al menos un elemento arrastrable';
        }
        break;

      case 'ordering':
        if (!formData.content.sequence || formData.content.sequence.length < 2) {
          newErrors.sequence = 'Se requieren al menos 2 elementos para ordenar';
        }
        break;

      case 'matching':
        if (!formData.content.left_items || formData.content.left_items.length < 2) {
          newErrors.left_items = 'Se requieren al menos 2 elementos en la columna izquierda';
        }
        if (!formData.content.right_items || formData.content.right_items.length < 2) {
          newErrors.right_items = 'Se requieren al menos 2 elementos en la columna derecha';
        }
        if (!formData.content.correct_pairs || formData.content.correct_pairs.length === 0) {
          newErrors.correct_pairs = 'Debe definir los pares correctos';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save exercise
  const handleSave = async (publish: boolean = false) => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Replace with actual API call
      // const token = localStorage.getItem('access_token');
      // const response = await fetch('/api/teacher/exercises', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({ ...formData, is_published: publish }),
      // });

      console.log('Saving exercise:', { ...formData, is_published: publish });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(publish ? '¡Ejercicio publicado exitosamente!' : '¡Borrador guardado!');
      navigate('/teacher/dashboard');
    } catch (error) {
      console.error('Error saving exercise:', error);
      alert('Error al guardar el ejercicio. Por favor intente nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // ===== CONTENT BUILDERS =====

  // Multiple Choice Builder
  const renderMultipleChoiceBuilder = () => {
    const options = formData.content.options || [];

    const addOption = () => {
      updateContent('options', [
        ...options,
        { id: generateId(), text: '', is_correct: false },
      ]);
    };

    const updateOption = (id: string, field: keyof OptionData, value: any) => {
      updateContent(
        'options',
        options.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt))
      );
    };

    const removeOption = (id: string) => {
      updateContent('options', options.filter((opt) => opt.id !== id));
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Pregunta <span className="text-red-400">*</span>
          </label>
          <textarea
            value={formData.content.question || ''}
            onChange={(e) => updateContent('question', e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
            placeholder="Escribe la pregunta aquí..."
          />
          {errors.question && <p className="text-red-400 text-sm mt-1">{errors.question}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-300">
              Opciones <span className="text-red-400">*</span>
            </label>
            <button
              onClick={addOption}
              className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
            >
              <Plus className="w-4 h-4" />
              Agregar opción
            </button>
          </div>

          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={option.id} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={option.is_correct}
                  onChange={(e) => updateOption(option.id, 'is_correct', e.target.checked)}
                  className="mt-3"
                />
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => updateOption(option.id, 'text', e.target.value)}
                  placeholder={`Opción ${index + 1}`}
                  className="flex-1 bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => removeOption(option.id)}
                  className="p-2 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {errors.options && <p className="text-red-400 text-sm mt-1">{errors.options}</p>}
        </div>
      </div>
    );
  };

  // True/False Builder
  const renderTrueFalseBuilder = () => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Declaración <span className="text-red-400">*</span>
          </label>
          <textarea
            value={formData.content.statement || ''}
            onChange={(e) => updateContent('statement', e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
            placeholder="Escribe la declaración aquí..."
          />
          {errors.statement && <p className="text-red-400 text-sm mt-1">{errors.statement}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Respuesta Correcta <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => updateContent('correct_answer', true)}
              className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
                formData.content.correct_answer === true
                  ? 'border-green-500 bg-green-500/20 text-green-400'
                  : 'border-slate-600 bg-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              Verdadero
            </button>
            <button
              onClick={() => updateContent('correct_answer', false)}
              className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
                formData.content.correct_answer === false
                  ? 'border-red-500 bg-red-500/20 text-red-400'
                  : 'border-slate-600 bg-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              Falso
            </button>
          </div>
          {errors.correct_answer && (
            <p className="text-red-400 text-sm mt-1">{errors.correct_answer}</p>
          )}
        </div>
      </div>
    );
  };

  // Fill Blank Builder
  const renderFillBlankBuilder = () => {
    const blanks = formData.content.blanks || [];

    const addBlank = () => {
      updateContent('blanks', [
        ...blanks,
        { id: generateId(), position: blanks.length, correct_answer: '', accept_variations: [] },
      ]);
    };

    const updateBlank = (id: string, field: keyof BlankData, value: any) => {
      updateContent(
        'blanks',
        blanks.map((blank) => (blank.id === id ? { ...blank, [field]: value } : blank))
      );
    };

    const removeBlank = (id: string) => {
      updateContent('blanks', blanks.filter((blank) => blank.id !== id));
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Texto del ejercicio <span className="text-red-400">*</span>
          </label>
          <textarea
            value={formData.content.text || ''}
            onChange={(e) => updateContent('text', e.target.value)}
            className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={4}
            placeholder="Usa ___ para indicar espacios en blanco. Ejemplo: Los mayas usaban un sistema de base ___."
          />
          {errors.text && <p className="text-red-400 text-sm mt-1">{errors.text}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-300">
              Respuestas para espacios en blanco <span className="text-red-400">*</span>
            </label>
            <button
              onClick={addBlank}
              className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
            >
              <Plus className="w-4 h-4" />
              Agregar espacio
            </button>
          </div>

          <div className="space-y-3">
            {blanks.map((blank, index) => (
              <div key={blank.id} className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-slate-400 font-medium">Espacio #{index + 1}</span>
                  <button
                    onClick={() => removeBlank(blank.id)}
                    className="ml-auto text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={blank.correct_answer}
                  onChange={(e) => updateBlank(blank.id, 'correct_answer', e.target.value)}
                  placeholder="Respuesta correcta"
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                />
                <input
                  type="text"
                  value={blank.accept_variations.join(', ')}
                  onChange={(e) =>
                    updateBlank(
                      blank.id,
                      'accept_variations',
                      e.target.value.split(',').map((v) => v.trim()).filter((v) => v)
                    )
                  }
                  placeholder="Variaciones aceptadas (separadas por comas)"
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            ))}
          </div>

          {errors.blanks && <p className="text-red-400 text-sm mt-1">{errors.blanks}</p>}
        </div>
      </div>
    );
  };

  // Ordering Builder
  const renderOrderingBuilder = () => {
    const sequence = formData.content.sequence || [];

    const addItem = () => {
      updateContent('sequence', [
        ...sequence,
        { id: generateId(), text: '', correct_position: sequence.length },
      ]);
    };

    const updateItem = (id: string, text: string) => {
      updateContent(
        'sequence',
        sequence.map((item) => (item.id === id ? { ...item, text } : item))
      );
    };

    const removeItem = (id: string) => {
      const filtered = sequence.filter((item) => item.id !== id);
      // Reorder positions
      updateContent(
        'sequence',
        filtered.map((item, index) => ({ ...item, correct_position: index }))
      );
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
      const newSequence = [...sequence];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newSequence.length) return;

      [newSequence[index], newSequence[targetIndex]] = [newSequence[targetIndex], newSequence[index]];

      // Update positions
      updateContent(
        'sequence',
        newSequence.map((item, idx) => ({ ...item, correct_position: idx }))
      );
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-300">
            Elementos a ordenar <span className="text-red-400">*</span>
          </label>
          <button
            onClick={addItem}
            className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
          >
            <Plus className="w-4 h-4" />
            Agregar elemento
          </button>
        </div>

        <div className="space-y-2">
          {sequence.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-3">
              <span className="text-slate-400 font-mono">{index + 1}.</span>
              <input
                type="text"
                value={item.text}
                onChange={(e) => updateItem(item.id, e.target.value)}
                placeholder={`Elemento ${index + 1}`}
                className="flex-1 bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex gap-1">
                <button
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Mover arriba"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === sequence.length - 1}
                  className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Mover abajo"
                >
                  ↓
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {errors.sequence && <p className="text-red-400 text-sm mt-1">{errors.sequence}</p>}
      </div>
    );
  };

  // Matching Builder (simplified)
  const renderMatchingBuilder = () => {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-200 text-sm">
              El creador de ejercicios de emparejamiento (Matching) requiere una interfaz más
              compleja. Por simplicidad en esta demostración, se recomienda usar los otros tipos de
              ejercicio o implementar esta funcionalidad en una fase posterior.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Drag Drop Builder (simplified)
  const renderDragDropBuilder = () => {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-200 text-sm">
              El creador de ejercicios de arrastrar y soltar (Drag & Drop) requiere una interfaz
              más compleja. Por simplicidad en esta demostración, se recomienda usar los otros
              tipos de ejercicio o implementar esta funcionalidad en una fase posterior.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Render content builder based on type
  const renderContentBuilder = () => {
    switch (formData.type) {
      case 'multiple_choice':
        return renderMultipleChoiceBuilder();
      case 'true_false':
        return renderTrueFalseBuilder();
      case 'fill_blank':
        return renderFillBlankBuilder();
      case 'ordering':
        return renderOrderingBuilder();
      case 'drag_drop':
        return renderDragDropBuilder();
      case 'matching':
        return renderMatchingBuilder();
      default:
        return null;
    }
  };

  // Hints Builder
  const renderHintsBuilder = () => {
    const addHint = () => {
      updateField('hints', [
        ...formData.hints,
        { id: generateId(), text: '', ml_coins_cost: 5, order: formData.hints.length },
      ]);
    };

    const updateHint = (id: string, field: keyof HintData, value: any) => {
      updateField(
        'hints',
        formData.hints.map((hint) => (hint.id === id ? { ...hint, [field]: value } : hint))
      );
    };

    const removeHint = (id: string) => {
      const filtered = formData.hints.filter((hint) => hint.id !== id);
      updateField(
        'hints',
        filtered.map((hint, index) => ({ ...hint, order: index }))
      );
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            Pistas (Opcional)
          </label>
          <button
            onClick={addHint}
            className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
          >
            <Plus className="w-4 h-4" />
            Agregar pista
          </button>
        </div>

        {formData.hints.length > 0 ? (
          <div className="space-y-2">
            {formData.hints.map((hint, index) => (
              <div key={hint.id} className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-slate-400 font-medium">Pista #{index + 1}</span>
                  <button
                    onClick={() => removeHint(hint.id)}
                    className="ml-auto text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={hint.text}
                  onChange={(e) => updateHint(hint.id, 'text', e.target.value)}
                  placeholder="Texto de la pista"
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                  rows={2}
                />
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-400">Costo en ML Coins:</label>
                  <input
                    type="number"
                    value={hint.ml_coins_cost}
                    onChange={(e) => updateHint(hint.id, 'ml_coins_cost', parseInt(e.target.value) || 0)}
                    min="0"
                    className="bg-slate-700 text-white rounded-lg px-3 py-1 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 w-24"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm italic">
            No hay pistas configuradas. Las pistas ayudan a los estudiantes cuando tienen dificultades.
          </p>
        )}
      </div>
    );
  };

  return (
    <TeacherLayout user={user} onLogout={logout}>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/teacher/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Dashboard
        </button>
        <h1 className="text-3xl font-bold text-white">Crear Nuevo Ejercicio</h1>
        <p className="text-slate-400 mt-1">
          Completa todos los campos para crear un ejercicio para tus estudiantes
        </p>
      </div>

      <div className="max-w-4xl">
        {/* Basic Information */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Información Básica</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Título del Ejercicio <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: Conversión de números mayas"
              />
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Instrucciones <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => updateField('instructions', e.target.value)}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="Instrucciones claras para el estudiante..."
              />
              {errors.instructions && (
                <p className="text-red-400 text-sm mt-1">{errors.instructions}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tipo de Ejercicio <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    updateField('type', e.target.value as ExerciseType);
                    updateField('content', {}); // Reset content when type changes
                  }}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="multiple_choice">Opción Múltiple</option>
                  <option value="true_false">Verdadero/Falso</option>
                  <option value="fill_blank">Llenar Espacios</option>
                  <option value="ordering">Ordenar Secuencia</option>
                  <option value="drag_drop">Arrastrar y Soltar</option>
                  <option value="matching">Emparejamiento</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Dificultad <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => updateField('difficulty', e.target.value as ExerciseDifficulty)}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="facil">Fácil</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                  <option value="experto">Experto</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">XP Recompensa</label>
                <input
                  type="number"
                  value={formData.xp_reward}
                  onChange={(e) => updateField('xp_reward', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">ML Coins Recompensa</label>
                <input
                  type="number"
                  value={formData.ml_coins_reward}
                  onChange={(e) => updateField('ml_coins_reward', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Límite de Tiempo (segundos)
                </label>
                <input
                  type="number"
                  value={formData.time_limit_seconds || ''}
                  onChange={(e) =>
                    updateField('time_limit_seconds', e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  min="0"
                  placeholder="Sin límite"
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Módulo (Opcional)</label>
                <select
                  value={formData.module_id || ''}
                  onChange={(e) => {
                    updateField('module_id', e.target.value || undefined);
                    updateField('activity_id', undefined); // Reset activity when module changes
                  }}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Sin asignar</option>
                  {modules.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Actividad (Opcional)</label>
                <select
                  value={formData.activity_id || ''}
                  onChange={(e) => updateField('activity_id', e.target.value || undefined)}
                  disabled={!formData.module_id}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  <option value="">Sin asignar</option>
                  {filteredActivities.map((activity) => (
                    <option key={activity.id} value={activity.id}>
                      {activity.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Exercise Content */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Contenido del Ejercicio</h2>
          {renderContentBuilder()}
        </div>

        {/* Hints */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
          {renderHintsBuilder()}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancelar
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Guardar Borrador
            </button>

            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" />
              Publicar Ejercicio
            </button>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};
