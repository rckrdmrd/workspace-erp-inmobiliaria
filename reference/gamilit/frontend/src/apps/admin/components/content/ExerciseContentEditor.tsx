import React, { useState } from 'react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { useExercises, Exercise } from '../../hooks/useContentManagement';
import { useSanitizedHTML } from '@shared/hooks/useSanitizedHTML';
import { Plus, Edit, Copy, Trash2, Eye, Save, X } from 'lucide-react';

export const ExerciseContentEditor: React.FC = () => {
  const { exercises, loading, createExercise, updateExercise, deleteExercise, duplicateExercise } = useExercises();
  const [editingExercise, setEditingExercise] = useState<Partial<Exercise> | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Sanitize HTML content to prevent XSS attacks (GLIT-SEC-005)
  // Admin role allows full educational content including iframes from trusted domains
  const sanitizedInstructions = useSanitizedHTML(editingExercise?.instructions || '', { role: 'admin' });

  const handleCreate = () => {
    setEditingExercise({
      title: '',
      description: '',
      difficulty: 'facil',
      points: 100,
      type: 'multiple-choice',
      instructions: '',
      content: {},
      status: 'draft',
    });
    setPreviewMode(false);
  };

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setPreviewMode(false);
  };

  const handleSave = async () => {
    if (!editingExercise) return;

    try {
      if (editingExercise.id) {
        await updateExercise(editingExercise.id, editingExercise);
      } else {
        await createExercise(editingExercise);
      }
      setEditingExercise(null);
    } catch (error) {
      console.error('Failed to save exercise:', error);
      alert('Failed to save exercise');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExercise(id);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete exercise:', error);
      alert('Failed to delete exercise');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateExercise(id);
    } catch (error) {
      console.error('Failed to duplicate exercise:', error);
      alert('Failed to duplicate exercise');
    }
  };

  if (loading && !editingExercise) {
    return (
      <DetectiveCard>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-detective-orange border-t-transparent"></div>
        </div>
      </DetectiveCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-detective-subtitle">Exercise Content Editor</h2>
        <DetectiveButton variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleCreate}>
          New Exercise
        </DetectiveButton>
      </div>

      {/* Editor Modal */}
      {editingExercise && (
        <DetectiveCard className="border-2 border-detective-orange">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-detective-subtitle">
              {editingExercise.id ? 'Edit Exercise' : 'Create New Exercise'}
            </h3>
            <div className="flex items-center gap-2">
              <DetectiveButton
                variant="blue"

                icon={previewMode ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? 'Edit' : 'Preview'}
              </DetectiveButton>
              <DetectiveButton variant="green" icon={<Save className="w-4 h-4" />} onClick={handleSave}>
                Save
              </DetectiveButton>
              <DetectiveButton
                variant="primary"

                icon={<X className="w-4 h-4" />}
                onClick={() => setEditingExercise(null)}
              >
                Cancel
              </DetectiveButton>
            </div>
          </div>

          {previewMode ? (
            <div className="p-6 bg-detective-bg-secondary rounded-lg">
              <h4 className="text-xl font-bold mb-2">{editingExercise.title || 'Untitled Exercise'}</h4>
              <p className="text-gray-400 mb-4">{editingExercise.description}</p>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-detective-orange/20 text-detective-orange rounded-lg text-sm">
                  {editingExercise.difficulty}
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-lg text-sm">
                  {editingExercise.points} points
                </span>
              </div>
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizedInstructions }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-detective-small text-gray-400 mb-2">Title *</label>
                <input
                  type="text"
                  className="input-detective"
                  value={editingExercise.title || ''}
                  onChange={(e) => setEditingExercise({ ...editingExercise, title: e.target.value })}
                  placeholder="Exercise title..."
                />
              </div>

              <div>
                <label className="block text-detective-small text-gray-400 mb-2">Type</label>
                <select
                  className="input-detective"
                  value={editingExercise.type || 'multiple-choice'}
                  onChange={(e) => setEditingExercise({ ...editingExercise, type: e.target.value })}
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                  <option value="fill-blank">Fill in the Blank</option>
                  <option value="code">Code Exercise</option>
                  <option value="essay">Essay</option>
                </select>
              </div>

              <div>
                <label className="block text-detective-small text-gray-400 mb-2">Difficulty</label>
                <select
                  className="input-detective"
                  value={editingExercise.difficulty || 'facil'}
                  onChange={(e) =>
                    setEditingExercise({
                      ...editingExercise,
                      difficulty: e.target.value as 'facil' | 'medio' | 'dificil' | 'experto',
                    })
                  }
                >
                  <option value="facil">Fácil</option>
                  <option value="medio">Medio</option>
                  <option value="dificil">Difícil</option>
                  <option value="experto">Experto</option>
                </select>
              </div>

              <div>
                <label className="block text-detective-small text-gray-400 mb-2">Points</label>
                <input
                  type="number"
                  className="input-detective"
                  value={editingExercise.points || 100}
                  onChange={(e) => setEditingExercise({ ...editingExercise, points: parseInt(e.target.value) })}
                  min="0"
                  step="10"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-detective-small text-gray-400 mb-2">Description</label>
                <textarea
                  className="input-detective"
                  rows={3}
                  value={editingExercise.description || ''}
                  onChange={(e) => setEditingExercise({ ...editingExercise, description: e.target.value })}
                  placeholder="Brief description..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-detective-small text-gray-400 mb-2">Instructions (HTML supported)</label>
                <textarea
                  className="input-detective font-mono text-sm"
                  rows={8}
                  value={editingExercise.instructions || ''}
                  onChange={(e) => setEditingExercise({ ...editingExercise, instructions: e.target.value })}
                  placeholder="<p>Complete the following exercise...</p>"
                />
              </div>

              <div>
                <label className="block text-detective-small text-gray-400 mb-2">Status</label>
                <select
                  className="input-detective"
                  value={editingExercise.status || 'draft'}
                  onChange={(e) =>
                    setEditingExercise({
                      ...editingExercise,
                      status: e.target.value as 'draft' | 'published' | 'archived',
                    })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          )}
        </DetectiveCard>
      )}

      {/* Exercise List */}
      <DetectiveCard>
        <h3 className="text-detective-subtitle mb-4">All Exercises ({exercises.length})</h3>
        <div className="space-y-3">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="p-4 bg-detective-bg-secondary rounded-lg hover:bg-detective-bg-secondary/70 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-detective-base font-semibold mb-1">{exercise.title}</h4>
                  <p className="text-detective-small text-gray-400 mb-2">{exercise.description}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        exercise.difficulty === 'facil'
                          ? 'bg-green-500/20 text-green-500'
                          : exercise.difficulty === 'medio'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : exercise.difficulty === 'dificil'
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-purple-500/20 text-purple-500'
                      }`}
                    >
                      {exercise.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-xs">
                      {exercise.points} pts
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        exercise.status === 'published'
                          ? 'bg-green-500/20 text-green-500'
                          : exercise.status === 'draft'
                          ? 'bg-gray-500/20 text-gray-400'
                          : 'bg-orange-500/20 text-orange-500'
                      }`}
                    >
                      {exercise.status}
                    </span>
                    <span className="text-xs text-gray-500">{exercise.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(exercise)}
                    className="p-2 hover:bg-blue-500/20 text-blue-500 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(exercise.id)}
                    className="p-2 hover:bg-purple-500/20 text-purple-500 rounded transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(exercise.id)}
                    className="p-2 hover:bg-red-500/20 text-red-500 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {showDeleteConfirm === exercise.id && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-500 mb-3">
                    Are you sure you want to delete this exercise? This action cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <DetectiveButton
                      variant="primary"

                      onClick={() => handleDelete(exercise.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Confirm Delete
                    </DetectiveButton>
                    <DetectiveButton variant="primary" onClick={() => setShowDeleteConfirm(null)}>
                      Cancel
                    </DetectiveButton>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </DetectiveCard>
    </div>
  );
};
