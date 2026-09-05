import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import DashboardLayout from './components/layout/DashboardLayout';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Toaster from './components/ui/Toaster';
import { getPlatformContext } from './utils/context';

// Lazy-loaded pages — each page gets its own chunk (split at route level)
const HomePage            = React.lazy(() => import('./pages/HomePage'));
const LoginPage           = React.lazy(() => import('./pages/LoginPage'));
const Dashboard           = React.lazy(() => import('./pages/Dashboard'));
const EventWizard         = React.lazy(() => import('./pages/EventWizard'));

const InvitationPage      = React.lazy(() => import('./pages/InvitationPage'));
const ExamplesPage        = React.lazy(() => import('./pages/ExamplesPage'));
const PlanesPage          = React.lazy(() => import('./pages/PlanesPage'));
const FaqPage             = React.lazy(() => import('./pages/FaqPage'));
const CheckoutPage        = React.lazy(() => import('./pages/CheckoutPage'));
const NotFoundPage        = React.lazy(() => import('./pages/NotFoundPage'));
const CarlosYFrida        = React.lazy(() => import('./pages/carlos-y-frida'));
const DashboardHome       = React.lazy(() => import('./pages/dashboard/DashboardHome'));
const EventRSVPs          = React.lazy(() => import('./pages/dashboard/EventRSVPs'));
const CheckIn             = React.lazy(() => import('./pages/dashboard/CheckIn'));
const SettingsPage        = React.lazy(() => import('./pages/dashboard/SettingsPage'));
const AvisoPrivacidadPage  = React.lazy(() => import('./pages/AvisoPrivacidadPage'));
const Terms               = React.lazy(() => import('./pages/Terms'));
const Concierge           = React.lazy(() => import('./pages/Concierge'));
const ConciergeLanding    = React.lazy(() => import('./pages/ConciergeLanding'));
const DesignEditor        = React.lazy(() => import('./pages/DesignEditor'));

// Corporate B2B Branch (Invitto One)
const OneHomePage         = React.lazy(() => import('./pages/corporate/OneHomePage'));

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
const InvitacionesLeon       = React.lazy(() => import('./pages/seo/InvitacionesLeonPage'));
const InvitacionesVsPapel    = React.lazy(() => import('./pages/seo/InvitacionesVsPapelPage'));
const InvitacionesRevelacion = React.lazy(() => import('./pages/seo/InvitacionesRevelacionPage'));
const InvittoVsPaperless     = React.lazy(() => import('./pages/seo/InvittoVsPaperlessPage'));
const InvittoVsGreenvelope   = React.lazy(() => import('./pages/seo/InvittoVsGreenvelopePage'));
const InvittoVsOtras         = React.lazy(() => import('./pages/seo/InvittoVsOtrasPage'));
const ComparativasHub        = React.lazy(() => import('./pages/seo/ComparativasHub'));

// Minimal inline fallback with Invitto brand logo
const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
    <div className="flex flex-col items-center justify-center space-y-3">
      <img src="/logo.png?v=3" alt="Invitto" className="h-9 sm:h-10 w-auto animate-pulse object-contain drop-shadow-sm" />
    </div>
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

const RootIndexRoute = () => {
  const { isCorporate } = getPlatformContext();
  return isCorporate ? <OneHomePage /> : <HomePage />;
};

function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/"              element={<RootIndexRoute />} />
        <Route path="/ejemplos"      element={<ExamplesPage />} />
        <Route path="/planes"        element={<PlanesPage />} />
        <Route path="/faq"           element={<FaqPage />} />
        <Route path="/checkout"      element={<CheckoutPage />} />
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/i/:slug"          element={<InvitationPage />} />
        <Route path="/preview/:slug"    element={<InvitationPage />} />
        <Route path="/invitacion/:slug" element={<InvitationPage />} />
        <Route path="/aviso-de-privacidad" element={<AvisoPrivacidadPage />} />
        <Route path="/terminos"      element={<Terms />} />
        <Route path="/concierge"     element={<Concierge />} />
        <Route path="/concierge-service" element={<ConciergeLanding />} />
        <Route path="/one"           element={<OneHomePage />} />
        <Route path="/corporativo"   element={<OneHomePage />} />

        {/* SEO Programmatic Landing Pages */}
        <Route path="/invitaciones-digitales-boda"         element={<InvitacionesBoda />} />
        <Route path="/invitaciones-digitales-xv-anos"      element={<InvitacionesXV />} />
        <Route path="/invitaciones-digitales-cumpleanos"   element={<InvitacionesCumpleanos />} />
        <Route path="/invitaciones-digitales-cdmx"         element={<InvitacionesCDMX />} />
        <Route path="/invitaciones-digitales-guadalajara"  element={<InvitacionesGDL />} />
        <Route path="/invitaciones-digitales-monterrey"    element={<InvitacionesMTY />} />
        <Route path="/invitaciones-digitales-leon"         element={<InvitacionesLeon />} />
        <Route path="/invitaciones-digitales-vs-papel"     element={<InvitacionesVsPapel />} />
        <Route path="/invitaciones-digitales-revelacion-de-genero" element={<InvitacionesRevelacion />} />
        <Route path="/invitto-vs-paperless-post"           element={<InvittoVsPaperless />} />
        <Route path="/invitto-vs-greenvelope"              element={<InvittoVsGreenvelope />} />
        <Route path="/invitto-vs-otras-plataformas"        element={<InvittoVsOtras />} />
        <Route path="/ejemplos"                            element={<ExamplesPage />} />
        <Route path="/carlos-y-frida"                      element={<CarlosYFrida />} />
        <Route path="/carlosyfrida"                        element={<CarlosYFrida />} />
        <Route path="/i/carlos-y-frida"                    element={<CarlosYFrida />} />
        <Route path="/i/carlosyfrida"                      element={<CarlosYFrida />} />

        {/* SEO programmatic landing pages */}
        <Route path="/planes/clasica"                      element={<PlanClasica />} />
        <Route path="/planes/pro"                          element={<PlanPro />} />
        <Route path="/planes/premium"                      element={<PlanPremium />} />
        <Route path="/planes/concierge"                    element={<PlanConcierge />} />
        <Route path="/comparativas"                        element={<ComparativasHub />} />

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
          <Route path="events/:id"            element={<EventRSVPs />} />
          <Route path="event/:id"             element={<EventRSVPs />} />
          <Route path="rsvps"                 element={<EventRSVPs />} />
          <Route path="checkin"               element={<CheckIn />} />
          <Route path="checkin/:eventId"      element={<CheckIn />} />
          <Route path="new"                   element={<EventWizard />} />
          <Route path="edit/:id"              element={<EventWizard />} />
          <Route path="design/:id"            element={<DesignEditor />} />
          <Route path="settings"              element={<SettingsPage />} />
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
