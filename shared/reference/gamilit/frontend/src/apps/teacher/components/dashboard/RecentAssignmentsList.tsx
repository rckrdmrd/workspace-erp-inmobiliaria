import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  XCircle,
  FileText,
  AlertCircle,
} from 'lucide-react';
import type { DashboardAssignment } from '../../types';

interface RecentAssignmentsListProps {
  assignments: DashboardAssignment[];
  loading?: boolean;
  onViewSubmissions: (assignmentId: string) => void;
  onEditAssignment: (assignmentId: string) => void;
  onCloseAssignment: (assignmentId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700';
    case 'draft':
      return 'bg-gray-100 text-gray-700';
    case 'closed':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return CheckCircle;
    case 'draft':
      return Clock;
    case 'closed':
      return XCircle;
    default:
      return Clock;
  }
};

const getDaysUntilDue = (dueDate: Date): number => {
  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const formatDueDate = (dueDate: Date): string => {
  const days = getDaysUntilDue(dueDate);

  if (days < 0) return `Overdue by ${Math.abs(days)} days`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days <= 7) return `Due in ${days} days`;

  return dueDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const AssignmentCard: React.FC<{
  assignment: DashboardAssignment;
  index: number;
  onViewSubmissions: (id: string) => void;
  onEditAssignment: (id: string) => void;
  onCloseAssignment: (id: string) => void;
}> = ({
  assignment,
  index,
  onViewSubmissions,
  onEditAssignment,
  onCloseAssignment,
}) => {
  const StatusIcon = getStatusIcon(assignment.status);
  const submissionPercentage = (assignment.submissionCount / assignment.totalStudents) * 100;
  const daysUntilDue = getDaysUntilDue(assignment.dueDate);
  const isOverdue = daysUntilDue < 0;
  const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg mb-1">
                {assignment.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {assignment.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">
                  {assignment.classroomName}
                </span>
              </div>
            </div>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            assignment.status
          )}`}
        >
          <StatusIcon className="w-3 h-3" />
          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
        </span>
      </div>

      {/* Due Date and Submission Progress */}
      <div className="space-y-3 mb-4">
        {/* Due Date */}
        <div className="flex items-center gap-2">
          <Calendar className={`w-4 h-4 ${isOverdue ? 'text-red-500' : isDueSoon ? 'text-orange-500' : 'text-gray-500'}`} />
          <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-700'}`}>
            {formatDueDate(assignment.dueDate)}
          </span>
          {(isOverdue || isDueSoon) && (
            <AlertCircle className={`w-4 h-4 ${isOverdue ? 'text-red-500' : 'text-orange-500'}`} />
          )}
        </div>

        {/* Submission Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {assignment.submissionCount} of {assignment.totalStudents} submitted
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {Math.round(submissionPercentage)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${submissionPercentage}%` }}
              transition={{ duration: 1, delay: index * 0.05 }}
              className={`h-full rounded-full ${
                submissionPercentage === 100
                  ? 'bg-green-500'
                  : submissionPercentage > 50
                  ? 'bg-blue-500'
                  : 'bg-orange-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onViewSubmissions(assignment.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
        >
          <Eye className="w-4 h-4" />
          View Submissions
        </button>
        <button
          onClick={() => onEditAssignment(assignment.id)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        {assignment.status === 'active' && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to close this assignment?')) {
                onCloseAssignment(assignment.id);
              }
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold"
          >
            <XCircle className="w-4 h-4" />
            Close
          </button>
        )}
      </div>
    </motion.div>
  );
};

const EmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-700 mb-2">No Assignments Yet</h3>
      <p className="text-gray-500 text-sm">
        Create your first assignment to get started
      </p>
    </motion.div>
  );
};

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-1" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
      </div>
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-2 bg-gray-200 rounded-full" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
        <div className="h-10 w-20 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
};

export const RecentAssignmentsList: React.FC<RecentAssignmentsListProps> = ({
  assignments,
  loading = false,
  onViewSubmissions,
  onEditAssignment,
  onCloseAssignment,
}) => {
  const [sortBy, setSortBy] = useState<'dueDate' | 'submissions'>('dueDate');

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return a.dueDate.getTime() - b.dueDate.getTime();
    } else {
      const aPercentage = (a.submissionCount / a.totalStudents) * 100;
      const bPercentage = (b.submissionCount / b.totalStudents) * 100;
      return aPercentage - bPercentage;
    }
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (assignments.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      {/* Sort Options */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          Recent Assignments ({assignments.length})
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('dueDate')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'dueDate'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            By Due Date
          </button>
          <button
            onClick={() => setSortBy('submissions')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'submissions'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            By Submissions
          </button>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        <AnimatePresence>
          {sortedAssignments.map((assignment, index) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              index={index}
              onViewSubmissions={onViewSubmissions}
              onEditAssignment={onEditAssignment}
              onCloseAssignment={onCloseAssignment}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
