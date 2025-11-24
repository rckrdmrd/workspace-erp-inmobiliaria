import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Loader, CheckCircle, AlertCircle, Calendar, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CreateAssignmentData, DashboardClassroom } from '../../types';

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAssignmentData) => Promise<void>;
  classrooms: DashboardClassroom[];
}

const assignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description is too long'),
  classroomId: z.string().min(1, 'Please select a classroom'),
  exerciseIds: z.array(z.string()).min(1, 'Please add at least one exercise'),
  dueDate: z.string().min(1, 'Due date is required'),
  maxAttempts: z.number().min(1, 'Must allow at least 1 attempt').max(10, 'Cannot exceed 10 attempts'),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

// Mock exercises - in real app, fetch from API
const MOCK_EXERCISES = [
  { id: 'ex1', title: 'Introduction to Variables', difficulty: 'easy' },
  { id: 'ex2', title: 'Loops and Iteration', difficulty: 'medium' },
  { id: 'ex3', title: 'Functions and Parameters', difficulty: 'medium' },
  { id: 'ex4', title: 'Object-Oriented Programming', difficulty: 'hard' },
  { id: 'ex5', title: 'Data Structures', difficulty: 'hard' },
];

export const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  classrooms,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: '',
      description: '',
      classroomId: '',
      exerciseIds: [],
      dueDate: '',
      maxAttempts: 3,
    },
  });

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setSelectedExercises([]);
      setSubmitStatus('idle');
      setErrorMessage('');
      onClose();
    }
  };

  const toggleExercise = (exerciseId: string) => {
    const newSelection = selectedExercises.includes(exerciseId)
      ? selectedExercises.filter((id) => id !== exerciseId)
      : [...selectedExercises, exerciseId];
    setSelectedExercises(newSelection);
    setValue('exerciseIds', newSelection);
  };

  const onFormSubmit = async (data: AssignmentFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const submitData = {
        ...data,
        dueDate: new Date(data.dueDate),
      };
      await onSubmit(submitData);
      setSubmitStatus('success');
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Create New Assignment</h2>
                    <p className="text-green-100 text-sm">Assign work to your students</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-5">
                  {/* Assignment Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Assignment Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('title')}
                      type="text"
                      placeholder="e.g., Week 5 Practice - Variables and Functions"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Classroom and Due Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Classroom <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('classroomId')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select classroom...</option>
                        {classrooms.map((classroom) => (
                          <option key={classroom.id} value={classroom.id}>
                            {classroom.name} ({classroom.studentCount} students)
                          </option>
                        ))}
                      </select>
                      {errors.classroomId && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.classroomId.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('dueDate')}
                        type="date"
                        min={minDate}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                      {errors.dueDate && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.dueDate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Max Attempts */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Max Attempts <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('maxAttempts', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max="10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                    {errors.maxAttempts && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.maxAttempts.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      placeholder="Provide instructions or context for this assignment..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Exercise Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Exercises <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {MOCK_EXERCISES.map((exercise) => (
                        <label
                          key={exercise.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedExercises.includes(exercise.id)
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedExercises.includes(exercise.id)}
                            onChange={() => toggleExercise(exercise.id)}
                            className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{exercise.title}</p>
                            <p className="text-xs text-gray-500 capitalize">{exercise.difficulty}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.exerciseIds && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.exerciseIds.message}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-gray-600">
                      {selectedExercises.length} exercise{selectedExercises.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>

                  {/* Status Messages */}
                  <AnimatePresence>
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-sm font-medium text-green-800">
                          Assignment created successfully!
                        </p>
                      </motion.div>
                    )}

                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-sm font-medium text-red-800">{errorMessage}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all font-semibold disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        Create Assignment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
