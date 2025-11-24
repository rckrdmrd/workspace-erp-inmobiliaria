import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Activity,
  MoreVertical,
  Eye,
  Edit,
  BarChart3,
  Trash2,
  BookOpen,
} from 'lucide-react';
import type { DashboardClassroom, SubjectColor } from '../../types';

interface ClassroomCardProps {
  classroom: DashboardClassroom;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onViewAnalytics: (id: string) => void;
  onDelete?: (id: string) => void;
}

const subjectColors: Record<string, { from: string; to: string; accent: string }> = {
  Math: {
    from: 'from-blue-500',
    to: 'to-blue-600',
    accent: 'bg-blue-100 text-blue-700',
  },
  Science: {
    from: 'from-green-500',
    to: 'to-green-600',
    accent: 'bg-green-100 text-green-700',
  },
  History: {
    from: 'from-purple-500',
    to: 'to-purple-600',
    accent: 'bg-purple-100 text-purple-700',
  },
  Language: {
    from: 'from-orange-500',
    to: 'to-orange-600',
    accent: 'bg-orange-100 text-orange-700',
  },
  default: {
    from: 'from-gray-500',
    to: 'to-gray-600',
    accent: 'bg-gray-100 text-gray-700',
  },
};

const getSubjectColor = (subject: string) => {
  return subjectColors[subject] || subjectColors.default;
};

const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export const ClassroomCard: React.FC<ClassroomCardProps> = ({
  classroom,
  onView,
  onEdit,
  onViewAnalytics,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const colors = getSubjectColor(classroom.subject);

  const capacityPercentage = (classroom.studentCount / classroom.capacity) * 100;
  const isNearCapacity = capacityPercentage > 80;

  const menuItems = [
    {
      icon: Eye,
      label: 'View Details',
      onClick: () => {
        onView(classroom.id);
        setShowMenu(false);
      },
    },
    {
      icon: Edit,
      label: 'Edit Classroom',
      onClick: () => {
        onEdit(classroom.id);
        setShowMenu(false);
      },
    },
    {
      icon: BarChart3,
      label: 'View Analytics',
      onClick: () => {
        onViewAnalytics(classroom.id);
        setShowMenu(false);
      },
    },
  ];

  if (onDelete) {
    menuItems.push({
      icon: Trash2,
      label: 'Delete Classroom',
      onClick: () => {
        if (window.confirm('Are you sure you want to delete this classroom?')) {
          onDelete(classroom.id);
        }
        setShowMenu(false);
      },
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
    >
      {/* Gradient Header */}
      <div className={`h-32 bg-gradient-to-br ${colors.from} ${colors.to} p-6 relative overflow-hidden`}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex-1">
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors.accent} bg-white/90 mb-2`}>
              {classroom.subject}
            </div>
            <h3 className="text-xl font-bold text-white truncate">{classroom.name}</h3>
            <p className="text-white/80 text-sm mt-1">Grade {classroom.grade}</p>
          </div>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-white" />
            </button>

            <AnimatePresence>
              {showMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />

                  {/* Menu */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
                  >
                    {menuItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={index}
                          onClick={item.onClick}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <Icon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">{item.label}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{classroom.studentCount}</p>
              <p className="text-xs text-gray-500">Students</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{classroom.averageScore}%</p>
              <p className="text-xs text-gray-500">Avg Score</p>
            </div>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600 font-medium">Capacity</span>
            <span className={`text-xs font-semibold ${isNearCapacity ? 'text-orange-600' : 'text-gray-600'}`}>
              {classroom.studentCount}/{classroom.capacity}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${capacityPercentage}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`h-full rounded-full ${
                isNearCapacity ? 'bg-orange-500' : 'bg-blue-500'
              }`}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Activity className="w-4 h-4" />
          <span>Last activity: {getTimeAgo(new Date(classroom.recentActivity))}</span>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              classroom.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full mr-2 ${classroom.isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
            {classroom.isActive ? 'Active' : 'Inactive'}
          </span>

          <button
            onClick={() => onView(classroom.id)}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Open
          </button>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className={`absolute inset-0 border-2 border-transparent group-hover:border-blue-400 rounded-xl pointer-events-none transition-colors duration-300`} />
    </motion.div>
  );
};
