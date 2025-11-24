import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { TeacherDashboardHero } from '../components/dashboard/TeacherDashboardHero';
import { QuickActionsPanel } from '../components/dashboard/QuickActionsPanel';
import { ClassroomsGrid } from '../components/dashboard/ClassroomsGrid';
import { RecentAssignmentsList } from '../components/dashboard/RecentAssignmentsList';
import { PendingSubmissionsList } from '../components/dashboard/PendingSubmissionsList';
import { StudentAlerts } from '../components/dashboard/StudentAlerts';
import { CreateClassroomModal } from '../components/dashboard/CreateClassroomModal';
import { CreateAssignmentModal } from '../components/dashboard/CreateAssignmentModal';
import { GradeSubmissionModal } from '../components/dashboard/GradeSubmissionModal';
import { useTeacherDashboard } from '../hooks/useTeacherDashboard';
import type { DashboardSubmission } from '../types';

/**
 * Comprehensive Teacher Dashboard
 *
 * Features:
 * - Hero section with animated stats
 * - Quick actions panel
 * - My Classrooms grid with create new classroom
 * - Recent assignments with submission tracking
 * - Pending submissions awaiting grading
 * - Student alerts for at-risk students
 * - Real-time auto-refresh every 60s
 * - Responsive design (desktop/tablet/mobile)
 *
 * Route: /teacher/dashboard
 */
export default function TeacherDashboardNew() {
  const {
    classrooms,
    assignments,
    submissions,
    alerts,
    stats,
    loading,
    error,
    createClassroom,
    deleteClassroom,
    createAssignment,
    closeAssignment,
    gradeSubmission,
    dismissAlert,
    refresh,
  } = useTeacherDashboard();

  // Modal states
  const [showCreateClassroom, setShowCreateClassroom] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showGradeSubmission, setShowGradeSubmission] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<DashboardSubmission | null>(null);

  // Mock teacher data - in real app, get from auth context
  const teacherName = 'Prof. Rodriguez';

  // Handlers
  const handleCreateClassroom = () => {
    setShowCreateClassroom(true);
  };

  const handleCreateAssignment = () => {
    setShowCreateAssignment(true);
  };

  const handleViewSubmissions = () => {
    // Scroll to submissions section
    const submissionsSection = document.getElementById('pending-submissions');
    submissionsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewAnalytics = () => {
    // Navigate to analytics page
    console.log('Navigate to analytics');
  };

  const handleViewClassroom = (id: string) => {
    console.log('View classroom:', id);
    // Navigate to classroom detail page
  };

  const handleEditClassroom = (id: string) => {
    console.log('Edit classroom:', id);
    // Open edit modal
  };

  const handleViewClassroomAnalytics = (id: string) => {
    console.log('View classroom analytics:', id);
    // Navigate to classroom analytics
  };

  const handleViewAssignmentSubmissions = (assignmentId: string) => {
    console.log('View assignment submissions:', assignmentId);
    // Navigate to assignment submissions page
  };

  const handleEditAssignment = (assignmentId: string) => {
    console.log('Edit assignment:', assignmentId);
    // Open edit modal
  };

  const handleGradeSubmission = (submissionId: string) => {
    const submission = submissions.find((s) => s.id === submissionId);
    if (submission) {
      setSelectedSubmission(submission);
      setShowGradeSubmission(true);
    }
  };

  const handleViewSubmission = (submissionId: string) => {
    const submission = submissions.find((s) => s.id === submissionId);
    if (submission) {
      setSelectedSubmission(submission);
      setShowGradeSubmission(true);
    }
  };

  const handleViewStudent = (studentId: string) => {
    console.log('View student:', studentId);
    // Navigate to student detail page
  };

  const handleContactStudent = (studentId: string) => {
    console.log('Contact student:', studentId);
    // Open contact modal or navigate to messaging
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={refresh}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header with Refresh */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your classrooms and track student progress</p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium text-gray-700">Refresh</span>
          </button>
        </motion.div>

        {/* Hero Section */}
        <TeacherDashboardHero teacherName={teacherName} stats={stats} loading={loading} />

        {/* Quick Actions Panel */}
        <QuickActionsPanel
          onCreateClass={handleCreateClassroom}
          onCreateAssignment={handleCreateAssignment}
          onViewSubmissions={handleViewSubmissions}
          onViewAnalytics={handleViewAnalytics}
        />

        {/* My Classrooms Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Classrooms</h2>
            <ClassroomsGrid
              classrooms={classrooms}
              loading={loading}
              onCreateClassroom={handleCreateClassroom}
              onViewClassroom={handleViewClassroom}
              onEditClassroom={handleEditClassroom}
              onViewAnalytics={handleViewClassroomAnalytics}
              onDeleteClassroom={deleteClassroom}
            />
          </div>
        </motion.section>

        {/* Two Column Layout: Assignments & Submissions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Assignments */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Assignments</h2>
              <RecentAssignmentsList
                assignments={assignments}
                loading={loading}
                onViewSubmissions={handleViewAssignmentSubmissions}
                onEditAssignment={handleEditAssignment}
                onCloseAssignment={closeAssignment}
              />
            </div>
          </motion.section>

          {/* Pending Submissions */}
          <motion.section
            id="pending-submissions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Submissions</h2>
              <PendingSubmissionsList
                submissions={submissions.filter((s) => s.status === 'pending')}
                loading={loading}
                onGradeSubmission={handleGradeSubmission}
                onViewSubmission={handleViewSubmission}
              />
            </div>
          </motion.section>
        </div>

        {/* Student Alerts Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Alerts</h2>
            <StudentAlerts
              alerts={alerts}
              loading={loading}
              onViewStudent={handleViewStudent}
              onContactStudent={handleContactStudent}
              onDismissAlert={dismissAlert}
            />
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-6 text-gray-500 text-sm"
        >
          <p>GLIT Platform - Teacher Dashboard</p>
          <p className="mt-1">Data refreshes automatically every 60 seconds</p>
        </motion.footer>
      </div>

      {/* Modals */}
      <CreateClassroomModal
        isOpen={showCreateClassroom}
        onClose={() => setShowCreateClassroom(false)}
        onSubmit={createClassroom}
      />

      <CreateAssignmentModal
        isOpen={showCreateAssignment}
        onClose={() => setShowCreateAssignment(false)}
        onSubmit={createAssignment}
        classrooms={classrooms}
      />

      <GradeSubmissionModal
        isOpen={showGradeSubmission}
        onClose={() => {
          setShowGradeSubmission(false);
          setSelectedSubmission(null);
        }}
        submission={selectedSubmission}
        onSubmit={gradeSubmission}
      />
    </div>
  );
}
