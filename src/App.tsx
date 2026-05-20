import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import DashboardLayout from './components/layout/DashboardLayout';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Toaster from './components/ui/Toaster';

// Lazy-loaded pages — each page gets its own chunk (split at route level)
const HomePage            = React.lazy(() => import('./pages/HomePage'));
const LoginPage           = React.lazy(() => import('./pages/LoginPage'));
const Dashboard           = React.lazy(() => import('./pages/Dashboard'));
const EventWizard         = React.lazy(() => import('./pages/EventWizard'));

const InvitationPage      = React.lazy(() => import('./pages/InvitationPage'));
const ExamplesPage        = React.lazy(() => import('./pages/ExamplesPage'));
const PlanesPage          = React.lazy(() => import('./pages/PlanesPage'));
const CheckoutPage        = React.lazy(() => import('./pages/CheckoutPage'));
const NotFoundPage        = React.lazy(() => import('./pages/NotFoundPage'));
const DashboardHome       = React.lazy(() => import('./pages/dashboard/DashboardHome'));
const EventRSVPs          = React.lazy(() => import('./pages/dashboard/EventRSVPs'));
const CheckIn             = React.lazy(() => import('./pages/dashboard/CheckIn'));
const SettingsPage        = React.lazy(() => import('./pages/dashboard/SettingsPage'));
const PrivacyPolicy       = React.lazy(() => import('./pages/PrivacyPolicy'));
const Terms               = React.lazy(() => import('./pages/Terms'));
const Concierge           = React.lazy(() => import('./pages/Concierge'));
const ConciergeLanding    = React.lazy(() => import('./pages/ConciergeLanding'));
const DesignEditor        = React.lazy(() => import('./pages/DesignEditor'));

// Minimal inline fallback — no external imports, matches app background
const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
    <div className="h-10 w-10 rounded-full border-2 border-stone-200 border-t-stone-800 animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageFallback />;
  if (!session) {
    const redirect = location.pathname + location.search;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />;
  }
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/"              element={<HomePage />} />
        <Route path="/ejemplos"      element={<ExamplesPage />} />
        <Route path="/planes"        element={<PlanesPage />} />
        <Route path="/checkout"      element={<CheckoutPage />} />
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/i/:slug"       element={<InvitationPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terminos"      element={<Terms />} />
        <Route path="/concierge"     element={<Concierge />} />
        <Route path="/concierge-service" element={<ConciergeLanding />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index                        element={<DashboardHome />} />
          <Route path="events"                element={<Dashboard />} />
          <Route path="rsvps"                 element={<EventRSVPs />} />
          <Route path="checkin/:eventId"      element={<CheckIn />} />
          <Route path="new"                   element={<EventWizard />} />
          <Route path="edit/:id"              element={<EventWizard />} />
          <Route path="design/:id"            element={<DesignEditor />} />
          <Route path="settings"              element={<SettingsPage />} />
          <Route path="event/:id"             element={<EventRSVPs />} />
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    // Boundary externo: captura errores en AuthProvider o BrowserRouter
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            {/* Reset scroll on navigation */}
            <ScrollToTop />
            {/* Boundary interno: captura errores de render en cualquier ruta */}
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </BrowserRouter>
        </AuthProvider>
        {/* Toaster fuera del router para que sobreviva navegaciones */}
        <Toaster />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
