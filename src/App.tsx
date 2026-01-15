import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Onboarding } from './pages/Onboarding';
import { DashboardView } from './pages/DashboardView';
import { CampaignsView } from './pages/CampaignsView';
import { ContactsView } from './pages/ContactsView';
import { TemplatesView } from './pages/TemplatesView';
import { SettingsView } from './pages/SettingsView';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Authentication Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
          </Route>

          {/* Onboarding - Protected but Standalone */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          {/* Protected Dashboard Routes */}
          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
          >
            <Route path="/dashboard" element={<DashboardView />} />
            <Route path="/campaigns" element={<CampaignsView />} />
            <Route path="/contacts" element={<ContactsView />} />
            <Route path="/templates" element={<TemplatesView />} />
            <Route path="/settings" element={<SettingsView />} />

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;