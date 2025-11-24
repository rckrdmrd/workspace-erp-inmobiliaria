import React from 'react';
import { motion } from 'framer-motion';
import { Plus, BookOpen } from 'lucide-react';
import { ClassroomCard } from './ClassroomCard';
import type { DashboardClassroom } from '../../types';

interface ClassroomsGridProps {
  classrooms: DashboardClassroom[];
  loading?: boolean;
  onCreateClassroom: () => void;
  onViewClassroom: (id: string) => void;
  onEditClassroom: (id: string) => void;
  onViewAnalytics: (id: string) => void;
  onDeleteClassroom?: (id: string) => void;
}

const EmptyState: React.FC<{ onCreateClassroom: () => void }> = ({
  onCreateClassroom,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-16"
    >
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <BookOpen className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">No Classrooms Yet</h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Get started by creating your first classroom. You can manage students, assignments, and track progress all in one place.
      </p>
      <button
        onClick={onCreateClassroom}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
      >
        <Plus className="w-5 h-5" />
        Create Your First Classroom
      </button>
    </motion.div>
  );
};

const CreateClassroomCard: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all duration-300 p-8 flex flex-col items-center justify-center min-h-[300px] group"
    >
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors duration-300 shadow-lg">
        <Plus className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="text-lg font-bold text-gray-700 group-hover:text-blue-700 mb-2">
        Create New Classroom
      </h3>
      <p className="text-sm text-gray-500 group-hover:text-blue-600 text-center">
        Set up a new learning space for your students
      </p>
    </motion.button>
  );
};

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-32 bg-gray-300" />
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
            <div>
              <div className="h-6 w-12 bg-gray-200 rounded mb-1" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
            <div>
              <div className="h-6 w-12 bg-gray-200 rounded mb-1" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="flex items-center justify-between">
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export const ClassroomsGrid: React.FC<ClassroomsGridProps> = ({
  classrooms,
  loading = false,
  onCreateClassroom,
  onViewClassroom,
  onEditClassroom,
  onViewAnalytics,
  onDeleteClassroom,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (classrooms.length === 0) {
    return <EmptyState onCreateClassroom={onCreateClassroom} />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {classrooms.map((classroom) => (
        <ClassroomCard
          key={classroom.id}
          classroom={classroom}
          onView={onViewClassroom}
          onEdit={onEditClassroom}
          onViewAnalytics={onViewAnalytics}
          onDelete={onDeleteClassroom}
        />
      ))}
      <CreateClassroomCard onClick={onCreateClassroom} />
    </motion.div>
  );
};
