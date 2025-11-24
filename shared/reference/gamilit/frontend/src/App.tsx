import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/app/providers/AuthContext';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import DashboardComplete from '@/apps/student/pages/DashboardComplete';
import { MyProgressPage } from '@/pages/MyProgressPage';
import { ModuleDetailsPage } from '@/pages/ModuleDetailsPage';
import { AchievementsPage } from '@/pages/AchievementsPage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import PasswordResetPage from '@/apps/student/pages/PasswordResetPage';
import EmailVerificationPage from '@/apps/student/pages/EmailVerificationPage';
import SettingsPage from '@/apps/student/pages/SettingsPage';
import MissionsPage from '@/apps/student/pages/MissionsPage';
import ExercisePage from '@/apps/student/pages/ExercisePage';
import NotFoundPage from '@/apps/student/pages/NotFoundPage';
import FriendsPage from '@/apps/student/pages/FriendsPage';
import ShopPage from '@/apps/student/pages/ShopPage';
import InventoryPage from '@/apps/student/pages/InventoryPage';
import GuildsPage from '@/apps/student/pages/GuildsPage';
import ModuleDetailPage from '@/apps/student/pages/ModuleDetailPage';
import EnhancedProfilePage from '@/apps/student/pages/EnhancedProfilePage';
import { NotificationPreferencesPage } from '@/apps/student/pages/NotificationPreferencesPage';
import { DeviceManagementSection } from '@/apps/student/pages/DeviceManagementSection';

// Teacher Portal Pages
import TeacherDashboardPage from '@/apps/teacher/pages/TeacherDashboardPage';
import TeacherAlertsPage from '@/apps/teacher/pages/TeacherAlertsPage';
import TeacherAnalyticsPage from '@/apps/teacher/pages/TeacherAnalyticsPage';
import TeacherAssignmentsPage from '@/apps/teacher/pages/TeacherAssignmentsPage';
import TeacherCommunicationPage from '@/apps/teacher/pages/TeacherCommunicationPage';
import TeacherContentPage from '@/apps/teacher/pages/TeacherContentPage';
import TeacherGamificationPage from '@/apps/teacher/pages/TeacherGamificationPage';
import TeacherMonitoringPage from '@/apps/teacher/pages/TeacherMonitoringPage';
import TeacherProgressPage from '@/apps/teacher/pages/TeacherProgressPage';
import TeacherReportsPage from '@/apps/teacher/pages/TeacherReportsPage';
import TeacherResourcesPage from '@/apps/teacher/pages/TeacherResourcesPage';

// Admin Portal Pages
import AdminDashboardPage from '@/apps/admin/pages/AdminDashboardPage';
import AdminInstitutionsPage from '@/apps/admin/pages/AdminInstitutionsPage';
import AdminUsersPage from '@/apps/admin/pages/AdminUsersPage';
import AdminRolesPage from '@/apps/admin/pages/AdminRolesPage';
import AdminContentPage from '@/apps/admin/pages/AdminContentPage';
import AdminApprovalsPage from '@/apps/admin/pages/AdminApprovalsPage';
import AdminGamificationPage from '@/apps/admin/pages/AdminGamificationPage';
import AdminMonitoringPage from '@/apps/admin/pages/AdminMonitoringPage';
import AdminAdvancedPage from '@/apps/admin/pages/AdminAdvancedPage';
import AdminReportsPage from '@/apps/admin/pages/AdminReportsPage';
import AdminSettingsPage from '@/apps/admin/pages/AdminSettingsPage';

/**
 * App Component
 * Main application component with routing and authentication
 *
 * Routes:
 * - / : Redirects to /dashboard
 * - /dashboard : Protected dashboard page
 * - /progress : User progress page
 * - /progress/modules/:moduleId : Module details page
 * - /achievements : Achievements page with filtering and claiming
 * - /leaderboard : Leaderboard page with global/school/classroom tabs
 *
 * TODO: Add more routes:
 * - /register : Registration page
 * - /exercises/:exerciseId/player : Exercise player page
 * - /missions : Missions page
 * - /learning : Learning page
 * - /profile : User profile page
 * - /settings : Settings page
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<PasswordResetPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* ===== STUDENT PORTAL ===== */}
          {/* Dashboard (protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardComplete />
              </ProtectedRoute>
            }
          />

          {/* ===== TEACHER PORTAL ===== */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute>
                <TeacherDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/alerts"
            element={
              <ProtectedRoute>
                <TeacherAlertsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/analytics"
            element={
              <ProtectedRoute>
                <TeacherAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/assignments"
            element={
              <ProtectedRoute>
                <TeacherAssignmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/communication"
            element={
              <ProtectedRoute>
                <TeacherCommunicationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/content"
            element={
              <ProtectedRoute>
                <TeacherContentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/gamification"
            element={
              <ProtectedRoute>
                <TeacherGamificationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/monitoring"
            element={
              <ProtectedRoute>
                <TeacherMonitoringPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/progress"
            element={
              <ProtectedRoute>
                <TeacherProgressPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/reports"
            element={
              <ProtectedRoute>
                <TeacherReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/resources"
            element={
              <ProtectedRoute>
                <TeacherResourcesPage />
              </ProtectedRoute>
            }
          />

          {/* ===== ADMIN PORTAL ===== */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/institutions"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <AdminInstitutionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/roles"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <AdminRolesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <AdminContentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/approvals"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <AdminApprovalsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gamification"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <AdminGamificationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/monitoring"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <AdminMonitoringPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/advanced"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <AdminAdvancedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <AdminReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <AdminSettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Progress Pages (protected) */}
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <MyProgressPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress/modules/:moduleId"
            element={
              <ProtectedRoute>
                <ModuleDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Achievements Page (protected) */}
          <Route
            path="/achievements"
            element={
              <ProtectedRoute>
                <AchievementsPage />
              </ProtectedRoute>
            }
          />

          {/* Leaderboard Page (protected) */}
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            }
          />

          {/* Exercise Player */}
          <Route
            path="/exercises/:exerciseId"
            element={
              <ProtectedRoute>
                <ExercisePage />
              </ProtectedRoute>
            }
          />

          {/* Missions Page */}
          <Route
            path="/missions"
            element={
              <ProtectedRoute>
                <MissionsPage />
              </ProtectedRoute>
            }
          />

          {/* Module Detail Page */}
          <Route
            path="/modules/:moduleId"
            element={
              <ProtectedRoute>
                <ModuleDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Profile Pages */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <EnhancedProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Settings Page */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Notification Settings */}
          <Route
            path="/settings/notifications"
            element={
              <ProtectedRoute>
                <NotificationPreferencesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/devices"
            element={
              <ProtectedRoute>
                <DeviceManagementSection />
              </ProtectedRoute>
            }
          />

          {/* Social Features */}
          <Route
            path="/friends"
            element={
              <ProtectedRoute>
                <FriendsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guilds"
            element={
              <ProtectedRoute>
                <GuildsPage />
              </ProtectedRoute>
            }
          />

          {/* Shop & Inventory */}
          <Route
            path="/shop"
            element={
              <ProtectedRoute>
                <ShopPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <InventoryPage />
              </ProtectedRoute>
            }
          />

          {/* 404 - Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
