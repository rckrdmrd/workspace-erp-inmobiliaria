import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  TrendingDown,
  UserX,
  Clock,
  Eye,
  MessageSquare,
  X,
  Filter,
  CheckCircle,
} from 'lucide-react';
import type { StudentAlert } from '../../types';

interface StudentAlertsProps {
  alerts: StudentAlert[];
  loading?: boolean;
  onViewStudent: (studentId: string) => void;
  onContactStudent: (studentId: string) => void;
  onDismissAlert: (alertId: string) => void;
}

const alertTypeConfig = {
  struggling: {
    icon: TrendingDown,
    label: 'Struggling Student',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-l-yellow-500',
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
  },
  inactive: {
    icon: UserX,
    label: 'Inactive Student',
    bgColor: 'bg-orange-50',
    borderColor: 'border-l-orange-500',
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-100',
  },
  at_risk: {
    icon: AlertTriangle,
    label: 'At-Risk Student',
    bgColor: 'bg-red-50',
    borderColor: 'border-l-red-500',
    iconColor: 'text-red-600',
    iconBg: 'bg-red-100',
  },
};

const severityConfig = {
  high: {
    badge: 'bg-red-100 text-red-700',
    label: 'High Priority',
    pulseColor: 'bg-red-500',
  },
  medium: {
    badge: 'bg-orange-100 text-orange-700',
    label: 'Medium Priority',
    pulseColor: 'bg-orange-500',
  },
  low: {
    badge: 'bg-blue-100 text-blue-700',
    label: 'Low Priority',
    pulseColor: 'bg-blue-500',
  },
};

const AlertCard: React.FC<{
  alert: StudentAlert;
  index: number;
  onViewStudent: (studentId: string) => void;
  onContactStudent: (studentId: string) => void;
  onDismiss: (alertId: string) => void;
}> = ({ alert, index, onViewStudent, onContactStudent, onDismiss }) => {
  const config = alertTypeConfig[alert.type];
  const severityInfo = severityConfig[alert.severity];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`relative ${config.bgColor} ${config.borderColor} border-l-4 border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all duration-300`}
    >
      {/* Pulse animation for high priority */}
      {alert.severity === 'high' && (
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute top-4 right-4 w-3 h-3 rounded-full ${severityInfo.pulseColor}`}
        />
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Alert Icon */}
          <div className={`p-3 ${config.iconBg} rounded-lg`}>
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>

          {/* Alert Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-800">{alert.studentName}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${severityInfo.badge}`}>
                {severityInfo.label}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{config.label}</p>
            <p className="text-sm text-gray-500">{alert.classroomName}</p>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => onDismiss(alert.id)}
          className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
          title="Dismiss alert"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Alert Message */}
      <div className="bg-white/60 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-800 font-medium mb-1">{alert.message}</p>
        <p className="text-xs text-gray-600">{alert.details}</p>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <Clock className="w-3 h-3" />
        <span>{new Date(alert.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewStudent(alert.studentId)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
        >
          <Eye className="w-4 h-4" />
          View Student
        </button>
        <button
          onClick={() => onContactStudent(alert.studentId)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
        >
          <MessageSquare className="w-4 h-4" />
          Contact
        </button>
      </div>
    </motion.div>
  );
};

const EmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl"
    >
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        All Students Are Doing Great!
      </h3>
      <p className="text-gray-600 text-sm">
        No alerts requiring attention at this time
      </p>
    </motion.div>
  );
};

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white border-l-4 border-l-gray-300 border border-gray-200 rounded-lg p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-11 h-11 bg-gray-200 rounded-lg" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-24 bg-gray-200 rounded mb-1" />
            <div className="h-3 w-28 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg p-3 mb-4">
        <div className="h-4 w-full bg-gray-200 rounded mb-1" />
        <div className="h-3 w-3/4 bg-gray-200 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-9 bg-gray-200 rounded-lg" />
        <div className="flex-1 h-9 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
};

export const StudentAlerts: React.FC<StudentAlertsProps> = ({
  alerts,
  loading = false,
  onViewStudent,
  onContactStudent,
  onDismissAlert,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'struggling' | 'inactive' | 'at_risk'>('all');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAlerts = alerts.filter((alert) => {
    if (filterType !== 'all' && alert.type !== filterType) return false;
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    return true;
  });

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    // Sort by severity first (high > medium > low)
    const severityOrder = { high: 3, medium: 2, low: 1 };
    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
    if (severityDiff !== 0) return severityDiff;

    // Then by date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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

  if (alerts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      {/* Header with Filters */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-800">
            Student Alerts ({sortedAlerts.length})
          </h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showFilters || filterType !== 'all' || filterSeverity !== 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {(filterType !== 'all' || filterSeverity !== 'all') && (
              <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                {(filterType !== 'all' ? 1 : 0) + (filterSeverity !== 'all' ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Filter Options */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 rounded-lg p-4 space-y-3 overflow-hidden"
            >
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Alert Type</p>
                <div className="flex flex-wrap gap-2">
                  {['all', 'struggling', 'inactive', 'at_risk'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type as any)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filterType === type
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {type === 'at_risk' ? 'At-Risk' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Severity</p>
                <div className="flex flex-wrap gap-2">
                  {['all', 'high', 'medium', 'low'].map((severity) => (
                    <button
                      key={severity}
                      onClick={() => setFilterSeverity(severity as any)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filterSeverity === severity
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {severity.charAt(0).toUpperCase() + severity.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Alerts List */}
      {sortedAlerts.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No alerts match your filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {sortedAlerts.map((alert, index) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                index={index}
                onViewStudent={onViewStudent}
                onContactStudent={onContactStudent}
                onDismiss={onDismissAlert}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
