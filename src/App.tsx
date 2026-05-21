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
const AvisoPrivacidadPage  = React.lazy(() => import('./pages/AvisoPrivacidadPage'));
const Terms               = React.lazy(() => import('./pages/Terms'));
const Concierge           = React.lazy(() => import('./pages/Concierge'));
const ConciergeLanding    = React.lazy(() => import('./pages/ConciergeLanding'));
const DesignEditor        = React.lazy(() => import('./pages/DesignEditor'));

// Plan landing pages
const PlanClasica          = React.lazy(() => import('./pages/planes/PlanClasicaPage'));
const PlanPro              = React.lazy(() => import('./pages/planes/PlanProPage'));
const PlanPremium          = React.lazy(() => import('./pages/planes/PlanPremiumPage'));
const PlanConcierge        = React.lazy(() => import('./pages/planes/PlanConciergePage'));

// Blog pages
const BlogIndex            = React.lazy(() => import('./pages/blog/BlogIndexPage'));
const BlogPost             = React.lazy(() => import('./pages/blog/BlogPostPage'));

// SEO programmatic landing pages
const InvitacionesBoda       = React.lazy(() => import('./pages/seo/InvitacionesBodaPage'));
const InvitacionesXV         = React.lazy(() => import('./pages/seo/InvitacionesXVPage'));
const InvitacionesCumpleanos = React.lazy(() => import('./pages/seo/InvitacionesCumpleanosPage'));
const InvitacionesCDMX       = React.lazy(() => import('./pages/seo/InvitacionesCDMXPage'));
const InvitacionesGDL        = React.lazy(() => import('./pages/seo/InvitacionesGuadalajaraPage'));
const InvitacionesMTY        = React.lazy(() => import('./pages/seo/InvitacionesMonterreyPage'));
const InvitacionesVsPapel    = React.lazy(() => import('./pages/seo/InvitacionesVsPapelPage'));
const InvittoVsPaperless     = React.lazy(() => import('./pages/seo/InvittoVsPaperlessPage'));
const InvittoVsGreenvelope   = React.lazy(() => import('./pages/seo/InvittoVsGreenvelopePage'));
const ComparativasHub        = React.lazy(() => import('./pages/seo/ComparativasHub'));

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
        <Route path="/aviso-de-privacidad" element={<AvisoPrivacidadPage />} />
        <Route path="/terminos"      element={<Terms />} />
        <Route path="/concierge"     element={<Concierge />} />
        <Route path="/concierge-service" element={<ConciergeLanding />} />

        {/* SEO Programmatic Landing Pages */}
        <Route path="/invitaciones-digitales-boda"         element={<InvitacionesBoda />} />
        <Route path="/invitaciones-digitales-xv-anos"      element={<InvitacionesXV />} />
        <Route path="/invitaciones-digitales-cumpleanos"   element={<InvitacionesCumpleanos />} />
        <Route path="/invitaciones-digitales-cdmx"         element={<InvitacionesCDMX />} />
        <Route path="/invitaciones-digitales-guadalajara"  element={<InvitacionesGDL />} />
        <Route path="/invitaciones-digitales-monterrey"    element={<InvitacionesMTY />} />
        <Route path="/invitaciones-digitales-vs-papel"     element={<InvitacionesVsPapel />} />
        <Route path="/invitto-vs-paperless-post"           element={<InvittoVsPaperless />} />
        <Route path="/invitto-vs-greenvelope"              element={<InvittoVsGreenvelope />} />
        <Route path="/comparativas"                        element={<ComparativasHub />} />

        {/* Plan Landing Pages */}
        <Route path="/planes/clasica"                      element={<PlanClasica />} />
        <Route path="/planes/pro"                          element={<PlanPro />} />
        <Route path="/planes/premium"                      element={<PlanPremium />} />
        <Route path="/planes/concierge"                    element={<PlanConcierge />} />

        {/* Blog Routes */}
        <Route path="/blog"                                element={<BlogIndex />} />
        <Route path="/blog/:slug"                          element={<BlogPost />} />

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
const LaunchPromoPopup = React.lazy(() => import('./components/LaunchPromoPopup'));

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
            {/* Launch promo popup — self-contained, only renders on public routes */}
            <Suspense fallback={null}>
              <LaunchPromoPopup />
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
        {/* Toaster fuera del router para que sobreviva navegaciones */}
        <Toaster />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
