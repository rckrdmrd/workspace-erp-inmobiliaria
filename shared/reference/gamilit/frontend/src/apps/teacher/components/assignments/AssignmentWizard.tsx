import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Calendar, Settings, Users } from 'lucide-react';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { InputDetective } from '@shared/components/base/InputDetective';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';

interface AssignmentData {
  title: string;
  module_id: string;
  exercise_ids: string[];
  start_date: string;
  end_date: string;
  max_attempts: number;
  allow_powerups: boolean;
  custom_points: number | null;
  assigned_to: string[];
}

interface AssignmentWizardProps {
  modules: Array<{ id: string; title: string; exercises: Array<{ id: string; title: string }> }>;
  students: Array<{ id: string; full_name: string }>;
  onComplete: (data: AssignmentData) => void;
  onCancel: () => void;
}

export function AssignmentWizard({ modules, students, onComplete, onCancel }: AssignmentWizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AssignmentData>({
    title: '',
    module_id: '',
    exercise_ids: [],
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    max_attempts: 3,
    allow_powerups: true,
    custom_points: null,
    assigned_to: [],
  });

  const selectedModule = modules.find((m) => m.id === data.module_id);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    onComplete(data);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.module_id && data.exercise_ids.length > 0;
      case 2:
        return data.title && data.end_date;
      case 3:
        return data.assigned_to.length > 0;
      default:
        return false;
    }
  };

  const toggleExercise = (exerciseId: string) => {
    setData((prev) => ({
      ...prev,
      exercise_ids: prev.exercise_ids.includes(exerciseId)
        ? prev.exercise_ids.filter((id) => id !== exerciseId)
        : [...prev.exercise_ids, exerciseId],
    }));
  };

  const toggleStudent = (studentId: string) => {
    setData((prev) => ({
      ...prev,
      assigned_to: prev.assigned_to.includes(studentId)
        ? prev.assigned_to.filter((id) => id !== studentId)
        : [...prev.assigned_to, studentId],
    }));
  };

  const selectAllStudents = () => {
    setData((prev) => ({
      ...prev,
      assigned_to: students.map((s) => s.id),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                s === step
                  ? 'bg-detective-orange text-white'
                  : s < step
                  ? 'bg-green-500 text-white'
                  : 'bg-detective-bg-secondary text-detective-text-secondary'
              }`}
            >
              {s < step ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  s < step ? 'bg-green-500' : 'bg-detective-bg-secondary'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center justify-center gap-8 text-sm">
        <span className={step === 1 ? 'text-detective-orange font-semibold' : 'text-detective-text-secondary'}>
          1. Seleccionar Contenido
        </span>
        <span className={step === 2 ? 'text-detective-orange font-semibold' : 'text-detective-text-secondary'}>
          2. Configurar
        </span>
        <span className={step === 3 ? 'text-detective-orange font-semibold' : 'text-detective-text-secondary'}>
          3. Asignar Estudiantes
        </span>
      </div>

      {/* Step Content */}
      <DetectiveCard>
        <div className="min-h-[400px]">
          {/* Step 1: Select Module and Exercises */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-detective-orange" />
                <h3 className="text-xl font-bold text-detective-text">Seleccionar Módulo y Ejercicios</h3>
              </div>

              <div>
                <label className="block text-sm font-semibold text-detective-text mb-2">
                  Módulo
                </label>
                <select
                  value={data.module_id}
                  onChange={(e) => setData({ ...data, module_id: e.target.value, exercise_ids: [] })}
                  className="w-full bg-detective-bg-secondary border border-detective-border rounded-lg px-4 py-2 text-detective-text focus:outline-none focus:border-detective-orange"
                >
                  <option value="">Seleccionar módulo...</option>
                  {modules.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedModule && (
                <div>
                  <label className="block text-sm font-semibold text-detective-text mb-2">
                    Ejercicios ({data.exercise_ids.length} seleccionados)
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedModule.exercises.map((exercise) => (
                      <label
                        key={exercise.id}
                        className="flex items-center gap-3 p-3 bg-detective-bg-secondary rounded-lg cursor-pointer hover:bg-opacity-80 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={data.exercise_ids.includes(exercise.id)}
                          onChange={() => toggleExercise(exercise.id)}
                          className="rounded border-detective-orange text-detective-orange focus:ring-detective-orange"
                        />
                        <span className="text-detective-text">{exercise.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Configure Assignment */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-detective-orange" />
                <h3 className="text-xl font-bold text-detective-text">Configurar Asignación</h3>
              </div>

              <div>
                <label className="block text-sm font-semibold text-detective-text mb-2">
                  Título de la Asignación *
                </label>
                <InputDetective
                  type="text"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Ej: Práctica semanal de Marie Curie"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-detective-text mb-2">
                    Fecha de Inicio
                  </label>
                  <InputDetective
                    type="date"
                    value={data.start_date}
                    onChange={(e) => setData({ ...data, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-detective-text mb-2">
                    Fecha Límite *
                  </label>
                  <InputDetective
                    type="date"
                    value={data.end_date}
                    onChange={(e) => setData({ ...data, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-detective-text mb-2">
                    Intentos Permitidos
                  </label>
                  <InputDetective
                    type="number"
                    min="1"
                    max="10"
                    value={data.max_attempts}
                    onChange={(e) => setData({ ...data, max_attempts: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-detective-text mb-2">
                    Puntos Personalizados
                  </label>
                  <InputDetective
                    type="number"
                    min="0"
                    value={data.custom_points || ''}
                    onChange={(e) =>
                      setData({ ...data, custom_points: e.target.value ? parseInt(e.target.value) : null })
                    }
                    placeholder="Dejar vacío para puntos por defecto"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 p-4 bg-detective-bg-secondary rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.allow_powerups}
                    onChange={(e) => setData({ ...data, allow_powerups: e.target.checked })}
                    className="rounded border-detective-orange text-detective-orange focus:ring-detective-orange"
                  />
                  <div>
                    <span className="text-detective-text font-semibold">Permitir Power-ups</span>
                    <p className="text-sm text-detective-text-secondary">
                      Los estudiantes podrán usar power-ups en esta asignación
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Assign to Students */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-detective-orange" />
                  <h3 className="text-xl font-bold text-detective-text">Seleccionar Estudiantes</h3>
                </div>
                <DetectiveButton variant="secondary" onClick={selectAllStudents}>
                  Seleccionar Todos
                </DetectiveButton>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {students.map((student) => (
                  <label
                    key={student.id}
                    className="flex items-center gap-3 p-3 bg-detective-bg-secondary rounded-lg cursor-pointer hover:bg-opacity-80 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={data.assigned_to.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      className="rounded border-detective-orange text-detective-orange focus:ring-detective-orange"
                    />
                    <span className="text-detective-text">{student.full_name}</span>
                  </label>
                ))}
              </div>

              <div className="bg-detective-bg-secondary p-4 rounded-lg">
                <p className="text-detective-text-secondary text-sm">
                  <strong className="text-detective-text">{data.assigned_to.length}</strong> estudiante(s) seleccionado(s)
                </p>
              </div>
            </div>
          )}
        </div>
      </DetectiveCard>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <DetectiveButton variant="secondary" onClick={onCancel}>
          Cancelar
        </DetectiveButton>
        <div className="flex gap-3">
          {step > 1 && (
            <DetectiveButton variant="secondary" onClick={handleBack}>
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </DetectiveButton>
          )}
          {step < 3 ? (
            <DetectiveButton onClick={handleNext} disabled={!canProceed()}>
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </DetectiveButton>
          ) : (
            <DetectiveButton onClick={handleComplete} disabled={!canProceed()}>
              <Check className="w-4 h-4" />
              Crear Asignación
            </DetectiveButton>
          )}
        </div>
      </div>
    </div>
  );
}
