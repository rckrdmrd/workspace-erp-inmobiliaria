import React from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  FileText,
  ClipboardList,
  BarChart3,
  Users,
  Calendar,
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  gradientFrom: string;
  gradientTo: string;
  onClick: () => void;
}

interface QuickActionsPanelProps {
  onCreateClass: () => void;
  onCreateAssignment: () => void;
  onViewSubmissions: () => void;
  onViewAnalytics: () => void;
  onViewStudents?: () => void;
  onViewCalendar?: () => void;
}

const ActionButton: React.FC<{
  action: QuickAction;
  index: number;
}> = ({ action, index }) => {
  const Icon = action.icon;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        type: "spring",
        stiffness: 200
      }}
      whileHover={{
        scale: 1.05,
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      onClick={action.onClick}
      className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${action.gradientFrom} ${action.gradientTo} text-white shadow-lg hover:shadow-2xl transition-shadow duration-300 group`}
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <Icon className="w-6 h-6" />
          </div>
        </div>

        <h3 className="text-lg font-bold mb-1">{action.label}</h3>
        <p className="text-sm text-white/90">{action.description}</p>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full"></div>
    </motion.button>
  );
};

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  onCreateClass,
  onCreateAssignment,
  onViewSubmissions,
  onViewAnalytics,
  onViewStudents,
  onViewCalendar,
}) => {
  const actions: QuickAction[] = [
    {
      id: 'create-class',
      label: 'Create New Class',
      description: 'Set up a new classroom',
      icon: Plus,
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600',
      onClick: onCreateClass,
    },
    {
      id: 'create-assignment',
      label: 'Create Assignment',
      description: 'Assign work to students',
      icon: FileText,
      gradientFrom: 'from-green-500',
      gradientTo: 'to-green-600',
      onClick: onCreateAssignment,
    },
    {
      id: 'view-submissions',
      label: 'View Submissions',
      description: 'Review pending work',
      icon: ClipboardList,
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-orange-600',
      onClick: onViewSubmissions,
    },
    {
      id: 'view-analytics',
      label: 'View Analytics',
      description: 'Check class performance',
      icon: BarChart3,
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-purple-600',
      onClick: onViewAnalytics,
    },
  ];

  // Optional actions
  if (onViewStudents) {
    actions.push({
      id: 'view-students',
      label: 'Manage Students',
      description: 'View student roster',
      icon: Users,
      gradientFrom: 'from-pink-500',
      gradientTo: 'to-pink-600',
      onClick: onViewStudents,
    });
  }

  if (onViewCalendar) {
    actions.push({
      id: 'view-calendar',
      label: 'View Calendar',
      description: 'Check upcoming events',
      icon: Calendar,
      gradientFrom: 'from-indigo-500',
      gradientTo: 'to-indigo-600',
      onClick: onViewCalendar,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
          <p className="text-gray-600 text-sm mt-1">
            Common tasks at your fingertips
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <ActionButton key={action.id} action={action} index={index} />
        ))}
      </div>
    </motion.div>
  );
};
