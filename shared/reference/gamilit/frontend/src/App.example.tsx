/**
 * App.tsx - Router Configuration Example
 *
 * This is an example App.tsx showing how to integrate the auth pages
 * Copy this content to your App.tsx after installing dependencies
 *
 * Dependencies required:
 * npm install zod @hookform/resolvers
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/app/providers/AuthContext';
import { LoginPage, RegisterPage, ForgotPasswordPage } from '@/pages/auth';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import { useAuth } from '@/app/providers/AuthContext';

/**
 * Temporary Dashboard Component
 * Replace this with your actual Dashboard component
 */
const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-primary-600 bg-primary-50 p-4">
              <p className="text-sm font-medium text-primary-900">
                Welcome to GAMILIT!
              </p>
              <p className="text-sm text-primary-700 mt-1">
                You are successfully logged in as: <strong>{user?.email}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">User ID</h3>
                <p className="text-sm text-gray-600 mt-1">{user?.id}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">Role</h3>
                <p className="text-sm text-gray-600 mt-1">{user?.role}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">Status</h3>
                <p className="text-sm text-gray-600 mt-1">{user?.isActive ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main App Component
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes - Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Role-based protected route example */}
          {/*
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          */}

          {/* Default Route - Redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 Not Found - Redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
