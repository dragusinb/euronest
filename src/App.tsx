import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import CityPage from './pages/CityPage';
import RegulationsPage from './pages/RegulationsPage';
import ComparePage from './pages/ComparePage';
import CalculatorPage from './pages/CalculatorPage';
import SearchPage from './pages/SearchPage';
import InsightsPage from './pages/InsightsPage';
import AboutPage from './pages/AboutPage';
import AIChatPanel from './components/AIChatPanel';
import { useUIStore } from './store';
import { useAccessStore } from './store/accessStore';
import { validateAccessCode } from './utils/accessCodes';

// Protects routes — redirects to landing page if not premium
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isPremium = useAccessStore(s => s.isPremium);

  if (!isPremium) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Detects access codes in URL (from Lightly.ro or Stripe redirect)
function AccessCodeDetector() {
  const navigate = useNavigate();
  const location = useLocation();
  const activate = useAccessStore(s => s.activate);
  const isPremium = useAccessStore(s => s.isPremium);

  useEffect(() => {
    // Parse ?code= from hash URL (e.g., /#/?code=XXX or /#/explore?code=XXX)
    const searchStr = location.search || '';
    const params = new URLSearchParams(searchStr);
    const code = params.get('code');

    if (code && !isPremium) {
      validateAccessCode(code).then(result => {
        if (result) {
          activate(result);
          // Remove code from URL and navigate to explore
          navigate('/explore', { replace: true });
        }
      });
    }
  }, [location.search, isPremium, activate, navigate]);

  return null;
}

function App() {
  const darkMode = useUIStore(s => s.darkMode);
  const isPremium = useAccessStore(s => s.isPremium);

  return (
    <HashRouter>
      <div className={`min-h-screen flex flex-col bg-gray-50 ${darkMode ? 'dark' : ''}`}>
        <Navbar />
        <ScrollToTop />
        <AccessCodeDetector />
        <Routes>
          {/* Landing page is always public */}
          <Route path="/" element={<LandingPage />} />

          {/* All other routes require premium access */}
          <Route path="/explore" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/city/:cityId" element={<ProtectedRoute><CityPage /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/regulations" element={<ProtectedRoute><RegulationsPage /></ProtectedRoute>} />
          <Route path="/regulations/:countryId" element={<ProtectedRoute><RegulationsPage /></ProtectedRoute>} />
          <Route path="/compare" element={<ProtectedRoute><ComparePage /></ProtectedRoute>} />
          <Route path="/calculator" element={<ProtectedRoute><CalculatorPage /></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
        </Routes>

        {/* AI Chat only visible to premium users */}
        {isPremium && <AIChatPanel />}
      </div>
    </HashRouter>
  );
}

export default App;
