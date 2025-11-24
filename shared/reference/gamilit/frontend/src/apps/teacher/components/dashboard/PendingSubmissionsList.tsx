import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Clock,
  FileCheck,
  Eye,
  CheckCircle,
  FileText,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import type { DashboardSubmission } from '../../types';

interface PendingSubmissionsListProps {
  submissions: DashboardSubmission[];
  loading?: boolean;
  onGradeSubmission: (submissionId: string) => void;
  onViewSubmission: (submissionId: string) => void;
}

const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  return `${days} day${days !== 1 ? 's' : ''} ago`;
};

const getPriorityLevel = (submittedAt: Date): 'high' | 'medium' | 'low' => {
  const hours = (new Date().getTime() - submittedAt.getTime()) / (1000 * 60 * 60);
  if (hours > 72) return 'high'; // Over 3 days
  if (hours > 24) return 'medium'; // Over 1 day
  return 'low';
};

const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high':
      return 'border-l-red-500 bg-red-50';
    case 'medium':
      return 'border-l-orange-500 bg-orange-50';
    case 'low':
      return 'border-l-blue-500 bg-blue-50';
  }
};

const SubmissionCard: React.FC<{
  submission: DashboardSubmission;
  index: number;
  onGrade: (id: string) => void;
  onView: (id: string) => void;
  selected: boolean;
  onSelect: (id: string) => void;
}> = ({ submission, index, onGrade, onView, selected, onSelect }) => {
  const priority = getPriorityLevel(submission.submittedAt);
  const priorityColor = getPriorityColor(priority);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className={`bg-white rounded-lg border-l-4 ${priorityColor} border border-gray-200 hover:shadow-lg transition-all duration-300 p-5 relative`}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-4 left-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(submission.id)}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="ml-8">
        {/* Student Info */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {submission.studentName.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{submission.studentName}</h3>
              <p className="text-sm text-gray-500">Attempt #{submission.attemptNumber}</p>
            </div>
          </div>

          {/* Priority Badge */}
          {priority === 'high' && (
            <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
              <AlertTriangle className="w-3 h-3" />
              Urgent
            </span>
          )}
        </div>

        {/* Assignment Info */}
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-gray-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">
                {submission.assignmentTitle}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {submission.answers.length} exercises completed
              </p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{getTimeAgo(submission.submittedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              {submission.submittedAt.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-600 font-medium mb-1">Questions</p>
            <p className="text-lg font-bold text-blue-700">
              {submission.answers.length}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-xs text-purple-600 font-medium mb-1">Max Score</p>
            <p className="text-lg font-bold text-purple-700">
              {submission.maxScore} pts
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onGrade(submission.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm font-semibold"
          >
            <CheckCircle className="w-4 h-4" />
            Grade Now
          </button>
          <button
            onClick={() => onView(submission.id)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileCheck className="w-10 h-10 text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">All Caught Up!</h3>
      <p className="text-gray-600 text-sm">
        No pending submissions to grade at the moment
      </p>
    </motion.div>
  );
};

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border-l-4 border-l-gray-300 border border-gray-200 p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div>
            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
        <div className="h-4 w-48 bg-gray-200 rounded mb-1" />
        <div className="h-3 w-32 bg-gray-200 rounded" />
      </div>
      <div className="flex gap-4 mb-4">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
        <div className="h-10 w-24 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
};

export const PendingSubmissionsList: React.FC<PendingSubmissionsListProps> = ({
  submissions,
  loading = false,
  onGradeSubmission,
  onViewSubmission,
}) => {
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(
    new Set()
  );
  const [sortBy, setSortBy] = useState<'oldest' | 'newest'>('oldest');

  const sortedSubmissions = [...submissions].sort((a, b) => {
    if (sortBy === 'oldest') {
      return a.submittedAt.getTime() - b.submittedAt.getTime();
    } else {
      return b.submittedAt.getTime() - a.submittedAt.getTime();
    }
  });

  const handleSelectSubmission = (id: string) => {
    const newSelected = new Set(selectedSubmissions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSubmissions(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedSubmissions.size === submissions.length) {
      setSelectedSubmissions(new Set());
    } else {
      setSelectedSubmissions(new Set(submissions.map((s) => s.id)));
    }
  };

  const handleBulkGrade = () => {
    if (selectedSubmissions.size === 0) return;
    // In a real implementation, this would open a bulk grading modal
    console.log('Bulk grading:', Array.from(selectedSubmissions));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      {/* Header with Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selectedSubmissions.size === submissions.length}
            onChange={handleSelectAll}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <h3 className="text-lg font-bold text-gray-800">
            Pending Submissions ({submissions.length})
          </h3>
          {selectedSubmissions.size > 0 && (
            <span className="text-sm text-blue-600 font-medium">
              {selectedSubmissions.size} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedSubmissions.size > 0 && (
            <button
              onClick={handleBulkGrade}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
            >
              <CheckCircle className="w-4 h-4" />
              Grade Selected
            </button>
          )}
          <button
            onClick={() => setSortBy('oldest')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'oldest'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Oldest First
          </button>
          <button
            onClick={() => setSortBy('newest')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'newest'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Newest First
          </button>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        <AnimatePresence>
          {sortedSubmissions.map((submission, index) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              index={index}
              onGrade={onGradeSubmission}
              onView={onViewSubmission}
              selected={selectedSubmissions.has(submission.id)}
              onSelect={handleSelectSubmission}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
