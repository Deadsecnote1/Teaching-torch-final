import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { GradeProvider } from './context/GradeContext';
import { ResourceProvider } from './context/ResourceContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ALProvider } from './context/ALContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Components
import ModernNavbar from './components/common/ModernNavbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import SplashScreen from './components/common/SplashScreen';

// Pages
// Lazy load Pages
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const GradePage = React.lazy(() => import('./pages/GradePage'));
const ResourcesPage = React.lazy(() => import('./pages/ResourcesPage'));
const TextbooksPage = React.lazy(() => import('./pages/TextbooksPage'));
const PapersPage = React.lazy(() => import('./pages/PapersPage'));
const NotesPage = React.lazy(() => import('./pages/NotesPage'));
const VideosPage = React.lazy(() => import('./pages/VideosPage'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const AdminLogin = React.lazy(() => import('./pages/admin/Login'));
import { Home as HomeIcon } from 'lucide-react';

const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const SubjectHubPage = React.lazy(() => import('./pages/SubjectHubPage'));

// Lazy load AL Pages
const ALStreamsPage = React.lazy(() => import('./pages/al/ALStreamsPage'));
const ALResourceTypesPage = React.lazy(() => import('./pages/al/ALResourceTypesPage'));
const ALResourcesPage = React.lazy(() => import('./pages/al/ALResourcesPage'));

// Styles
// Bootstrap icons removed
import './styles/globals.css';

const NotFound = () => (
  <div className="flex items-center justify-center min-h-[70vh] px-4 py-16 bg-bg-primary">
    <div className="text-center max-w-md w-full bg-card rounded-2xl p-10 shadow-sm border border-border">
      <h1 className="text-7xl font-extrabold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-bold text-text-primary mb-4">Page Not Found</h2>
      <p className="text-text-muted mb-8 text-lg">The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all bg-primary text-white hover:bg-primary-dark shadow-sm">
        <HomeIcon className="w-5 h-5 mr-2" />
        Go Home
      </a>
    </div>
  </div>
);

// Inner component to handle initialization state
const AppContent = () => {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" />
      <div className="App">
        <ModernNavbar />
        <main className="main-content">
          <ErrorBoundary>
            <React.Suspense fallback={<div className="flex items-center justify-center p-12"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div></div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/grade/:gradeId" element={<GradePage />} />
                <Route path="/grade/:gradeId/:streamId" element={<GradePage />} />
                <Route path="/grade/:gradeId/:streamId/:subjectId" element={<SubjectHubPage />} />
                <Route path="/grade/:gradeId/:streamId/:subjectId/textbooks" element={<TextbooksPage />} />
                <Route path="/grade/:gradeId/:streamId/:subjectId/papers" element={<PapersPage />} />
                <Route path="/grade/:gradeId/:streamId/:subjectId/notes" element={<NotesPage />} />
                <Route path="/grade/:gradeId/:streamId/:subjectId/videos" element={<VideosPage />} />
                <Route path="/grade/:gradeId/:streamId/:subjectId/:resourceType" element={<ResourcesPage />} />
                <Route path="/grade/:gradeId/textbooks" element={<TextbooksPage />} />
                <Route path="/grade/:gradeId/papers" element={<PapersPage />} />
                <Route path="/grade/:gradeId/notes" element={<NotesPage />} />
                <Route path="/grade/:gradeId/videos" element={<VideosPage />} />
                <Route path="/grade/:gradeId/:resourceType" element={<ResourcesPage />} />
                
                {/* AL Independent Routes */}
                <Route path="/al" element={<ALStreamsPage />} />
                <Route path="/al/:streamId/:subjectId" element={<ALResourceTypesPage />} />
                <Route path="/al/:streamId/:subjectId/:resourceTypeId" element={<ALResourcesPage />} />

                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </React.Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <GradeProvider>
            <ResourceProvider>
              <DataProvider>
                <ALProvider>
                  <AppContent />
                </ALProvider>
              </DataProvider>
            </ResourceProvider>
          </GradeProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;