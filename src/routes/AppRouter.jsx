import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import RoleBasedRoute from './RoleBasedRoute';

// Example pages/components
import MainLayout from '../components/layout/MainLayout';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';

// Add more imports for your actual pages as needed

const AppRouter = () => (
  <MainLayout>
    <Routes>
      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* Role-based route example */}
        <Route
          path="/admin"
          element={
            <RoleBasedRoute allowedRoles={['OWNER', 'ADMIN']}>
              <div>Admin Panel</div>
            </RoleBasedRoute>
          }
        />
      </Route>
      {/* Fallback for unknown routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </MainLayout>
);

export default AppRouter;