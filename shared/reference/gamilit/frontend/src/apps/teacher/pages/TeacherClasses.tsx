import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { Modal } from '@shared/components/common/Modal';
import { FormField } from '@shared/components/common/FormField';
import { ConfirmDialog } from '@shared/components/common/ConfirmDialog';
import { Users, Plus, Edit, Trash2, Search, BookOpen, GraduationCap, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useClassrooms } from '../hooks/useClassrooms';
import type { Classroom } from '../types';

export default function TeacherClasses() {
  const navigate = useNavigate();
  const {
    classrooms,
    loading,
    error,
    createClassroom: createClassroomAPI,
    updateClassroom: updateClassroomAPI,
    deleteClassroom: deleteClassroomAPI,
    refresh,
  } = useClassrooms();

  const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    grade_level: '',
  });

  // Search functionality
  useEffect(() => {
    const filtered = classrooms.filter((classroom) =>
      classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.grade_level.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClassrooms(filtered);
  }, [searchTerm, classrooms]);

  const handleCreateClassroom = async () => {
    try {
      await createClassroomAPI(formData);
      setIsCreateModalOpen(false);
      setFormData({ name: '', subject: '', grade_level: '' });
    } catch (err: any) {
      console.error('[TeacherClasses] Error creating classroom:', err);
      alert('Error al crear la clase. Por favor intenta nuevamente.');
    }
  };

  const handleEditClassroom = async () => {
    if (!selectedClassroom) return;

    try {
      await updateClassroomAPI(selectedClassroom.id, formData);
      setIsEditModalOpen(false);
      setSelectedClassroom(null);
      setFormData({ name: '', subject: '', grade_level: '' });
    } catch (err: any) {
      console.error('[TeacherClasses] Error updating classroom:', err);
      alert('Error al actualizar la clase. Por favor intenta nuevamente.');
    }
  };

  const handleDeleteClassroom = async () => {
    if (!selectedClassroom) return;

    try {
      await deleteClassroomAPI(selectedClassroom.id);
      setIsDeleteDialogOpen(false);
      setSelectedClassroom(null);
    } catch (err: any) {
      console.error('[TeacherClasses] Error deleting classroom:', err);
      alert('Error al eliminar la clase. Por favor intenta nuevamente.');
    }
  };

  const openEditModal = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setFormData({
      name: classroom.name,
      subject: classroom.subject,
      grade_level: classroom.grade_level,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-detective-bg to-detective-bg-secondary">
      <main className="detective-container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-detective-text mb-2">Mis Clases</h1>
          <p className="text-detective-text-secondary">
            Gestiona tus clases y estudiantes
          </p>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar clases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-detective-bg-secondary border border-gray-700 rounded-lg text-detective-text placeholder-gray-500 focus:outline-none focus:border-detective-orange"
            />
          </div>
          <DetectiveButton
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            Crear Nueva Clase
          </DetectiveButton>
          {!loading && !error && (
            <DetectiveButton variant="secondary" onClick={refresh}>
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </DetectiveButton>
          )}
        </div>

        {/* Error State */}
        {error && !loading && (
          <DetectiveCard variant="danger" className="mb-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-detective-text mb-2">
                  Error al cargar clases
                </h3>
                <p className="text-detective-text-secondary mb-4">
                  No se pudieron cargar las clases. Por favor, intenta nuevamente.
                </p>
                <p className="text-sm text-red-400 mb-4 font-mono bg-red-950 p-2 rounded">
                  {error.message}
                </p>
                <DetectiveButton onClick={refresh} variant="primary">
                  <RefreshCw className="w-4 h-4" />
                  Reintentar
                </DetectiveButton>
              </div>
            </div>
          </DetectiveCard>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-detective-orange animate-spin mb-4" />
            <p className="text-detective-text-secondary">Cargando clases...</p>
          </div>
        )}

        {/* Classrooms Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClassrooms.map((classroom) => (
            <DetectiveCard
              key={classroom.id}
              className="cursor-pointer hover:border-detective-orange transition-colors"
              onClick={() => navigate(`/teacher/classes/${classroom.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-detective-text">
                      {classroom.name}
                    </h3>
                    <p className="text-sm text-gray-400">{classroom.subject}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-detective-text">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <span>{classroom.grade_level}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-detective-text">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{classroom.student_count} estudiantes</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(classroom);
                  }}
                  className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 rounded-lg transition-colors text-sm font-medium"
                >
                  <Edit className="w-4 h-4 inline mr-1" />
                  Editar
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteDialog(classroom);
                  }}
                  className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Eliminar
                </button>
              </div>
            </DetectiveCard>
            ))}
          </div>
        )}

        {!loading && filteredClassrooms.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {searchTerm ? 'No se encontraron clases' : 'No tienes clases creadas aún'}
            </p>
          </div>
        )}
      </main>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormData({ name: '', subject: '', grade_level: '' });
        }}
        title="Crear Nueva Clase"
      >
        <div className="space-y-4">
          <FormField
            label="Nombre de la Clase"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Español 5to A"
            required
          />
          <FormField
            label="Materia"
            name="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Ej: Español, Matemáticas"
            required
          />
          <FormField
            label="Grado"
            name="grade_level"
            type="select"
            value={formData.grade_level}
            onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
            options={[
              { value: '1ro', label: '1ro' },
              { value: '2do', label: '2do' },
              { value: '3ro', label: '3ro' },
              { value: '4to', label: '4to' },
              { value: '5to', label: '5to' },
              { value: '6to', label: '6to' },
            ]}
            required
          />
          <div className="flex gap-3 justify-end pt-4">
            <DetectiveButton
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                setFormData({ name: '', subject: '', grade_level: '' });
              }}
            >
              Cancelar
            </DetectiveButton>
            <DetectiveButton
              variant="primary"
              onClick={handleCreateClassroom}
              disabled={!formData.name || !formData.subject || !formData.grade_level}
            >
              Crear Clase
            </DetectiveButton>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedClassroom(null);
          setFormData({ name: '', subject: '', grade_level: '' });
        }}
        title="Editar Clase"
      >
        <div className="space-y-4">
          <FormField
            label="Nombre de la Clase"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <FormField
            label="Materia"
            name="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
          <FormField
            label="Grado"
            name="grade_level"
            type="select"
            value={formData.grade_level}
            onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
            options={[
              { value: '1ro', label: '1ro' },
              { value: '2do', label: '2do' },
              { value: '3ro', label: '3ro' },
              { value: '4to', label: '4to' },
              { value: '5to', label: '5to' },
              { value: '6to', label: '6to' },
            ]}
            required
          />
          <div className="flex gap-3 justify-end pt-4">
            <DetectiveButton
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedClassroom(null);
                setFormData({ name: '', subject: '', grade_level: '' });
              }}
            >
              Cancelar
            </DetectiveButton>
            <DetectiveButton variant="primary" onClick={handleEditClassroom}>
              Guardar Cambios
            </DetectiveButton>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedClassroom(null);
        }}
        onConfirm={handleDeleteClassroom}
        title="Eliminar Clase"
        message={`¿Estás seguro de que deseas eliminar "${selectedClassroom?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
