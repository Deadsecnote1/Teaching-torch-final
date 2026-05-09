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
import Navbar from './components/common/Navbar';
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
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const SubjectHubPage = React.lazy(() => import('./pages/SubjectHubPage'));

// Lazy load AL Pages
const ALStreamsPage = React.lazy(() => import('./pages/al/ALStreamsPage'));
const ALResourceTypesPage = React.lazy(() => import('./pages/al/ALResourceTypesPage'));
const ALResourcesPage = React.lazy(() => import('./pages/al/ALResourcesPage'));

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/globals.css';

// 404 Not Found Component
const NotFound = () => (
  <div className="container text-center py-5">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="error-page">
          <h1 className="display-1 text-primary">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="mb-4">The page you're looking for doesn't exist.</p>
          <a href="/" className="btn btn-primary">
            <i className="bi bi-house me-2"></i>
            Go Home
          </a>
        </div>
      </div>
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
        <Navbar />
        <main className="main-content">
          <ErrorBoundary>
            <React.Suspense fallback={<div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>}>
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