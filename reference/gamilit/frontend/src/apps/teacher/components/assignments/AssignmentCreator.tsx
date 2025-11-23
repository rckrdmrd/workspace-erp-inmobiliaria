import React, { useState, useEffect } from 'react';
import { Plus, List } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { AssignmentWizard } from './AssignmentWizard';
import { AssignmentList } from './AssignmentList';
import type { Assignment } from '../../types';

interface AssignmentCreatorProps {
  classroomId: string;
}

export function AssignmentCreator({ classroomId }: AssignmentCreatorProps) {
  const [showWizard, setShowWizard] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - integrar con API
  const mockModules = [
    {
      id: '1',
      title: 'Los Primeros Pasos de Marie Curie',
      exercises: [
        { id: 'e1', title: 'Crucigrama: Vida temprana' },
        { id: 'e2', title: 'Línea de tiempo: Estudios' },
        { id: 'e3', title: 'Mapa conceptual: Influencias' },
      ],
    },
    {
      id: '2',
      title: 'Descubrimientos Científicos',
      exercises: [
        { id: 'e4', title: 'Experimento: Radiactividad' },
        { id: 'e5', title: 'Crucigrama: Elementos químicos' },
        { id: 'e6', title: 'Emparejamiento: Descubrimientos' },
      ],
    },
  ];

  const mockStudents = [
    { id: 's1', full_name: 'Ana García' },
    { id: 's2', full_name: 'Carlos Ruiz' },
    { id: 's3', full_name: 'María López' },
    { id: 's4', full_name: 'Juan Martínez' },
  ];

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        // Simulación - reemplazar con llamada real
        const response = await fetch(`/api/classroom/assignments?classroom_id=${classroomId}`);
        if (response.ok) {
          const data = await response.json();
          setAssignments(data.assignments || []);
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
        // Mock data para desarrollo
        setAssignments([
          {
            id: 'a1',
            title: 'Práctica Semanal: Marie Curie',
            module_id: '1',
            module_name: 'Los Primeros Pasos de Marie Curie',
            exercise_ids: ['e1', 'e2'],
            start_date: '2025-10-16',
            end_date: '2025-10-23',
            max_attempts: 3,
            allow_powerups: true,
            custom_points: null,
            assigned_to: ['s1', 's2', 's3', 's4'],
            created_at: '2025-10-15T10:00:00Z',
            status: 'active',
          },
          {
            id: 'a2',
            title: 'Evaluación: Descubrimientos',
            module_id: '2',
            module_name: 'Descubrimientos Científicos',
            exercise_ids: ['e4', 'e5', 'e6'],
            start_date: '2025-10-20',
            end_date: '2025-10-27',
            max_attempts: 2,
            allow_powerups: false,
            custom_points: 200,
            assigned_to: ['s1', 's2'],
            created_at: '2025-10-14T15:30:00Z',
            status: 'draft',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [classroomId]);

  const handleCreateAssignment = async (data: any) => {
    try {
      const response = await fetch('/api/classroom/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          classroom_id: classroomId,
        }),
      });

      if (response.ok) {
        const newAssignment = await response.json();
        setAssignments([newAssignment, ...assignments]);
        setShowWizard(false);
      } else {
        console.error('Error creating assignment');
      }
    } catch (error) {
      console.error('Error:', error);
      // Para desarrollo, agregar mock
      const newAssignment: Assignment = {
        id: `a${Date.now()}`,
        ...data,
        module_name: mockModules.find((m) => m.id === data.module_id)?.title || '',
        created_at: new Date().toISOString(),
        status: 'active',
      };
      setAssignments([newAssignment, ...assignments]);
      setShowWizard(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <List className="w-8 h-8 text-detective-orange" />
          <div>
            <h2 className="text-2xl font-bold text-detective-text">Asignaciones</h2>
            <p className="text-detective-text-secondary">Gestiona y crea nuevas asignaciones</p>
          </div>
        </div>
        {!showWizard && (
          <DetectiveButton onClick={() => setShowWizard(true)}>
            <Plus className="w-5 h-5" />
            Nueva Asignación
          </DetectiveButton>
        )}
      </div>

      {/* Content */}
      {showWizard ? (
        <AssignmentWizard
          modules={mockModules}
          students={mockStudents}
          onComplete={handleCreateAssignment}
          onCancel={() => setShowWizard(false)}
        />
      ) : loading ? (
        <DetectiveCard>
          <div className="text-center py-12">
            <p className="text-detective-text-secondary">Cargando asignaciones...</p>
          </div>
        </DetectiveCard>
      ) : (
        <AssignmentList assignments={assignments} />
      )}
    </div>
  );
}
