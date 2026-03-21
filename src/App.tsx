import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import CityPage from './pages/CityPage';
import RegulationsPage from './pages/RegulationsPage';
import ComparePage from './pages/ComparePage';
import CalculatorPage from './pages/CalculatorPage';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';
import InsightsPage from './pages/InsightsPage';
import AboutPage from './pages/AboutPage';
import AIChatPanel from './components/AIChatPanel';
import { useUIStore } from './store';

function App() {
  const darkMode = useUIStore(s => s.darkMode);

  return (
    <HashRouter>
      <div className={`min-h-screen flex flex-col bg-gray-50 ${darkMode ? 'dark' : ''}`}>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<HomePage />} />
          <Route path="/city/:cityId" element={<CityPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/regulations" element={<RegulationsPage />} />
          <Route path="/regulations/:countryId" element={<RegulationsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <AIChatPanel />
      </div>
    </HashRouter>
  );
}

export default App;
