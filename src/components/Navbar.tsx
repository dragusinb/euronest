import { Link, useLocation } from 'react-router-dom';
import { Map, BarChart3, ScrollText, Scale, Search, LayoutDashboard, TrendingUp, Moon, Sun, Menu, X } from 'lucide-react';
import { useUIStore } from '../store';
import { useState } from 'react';
import DataFreshness from './DataFreshness';

const navItems = [
  { to: '/explore', label: 'Explore', icon: Map },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/insights', label: 'Insights', icon: TrendingUp },
  { to: '/regulations', label: 'Regulations', icon: ScrollText },
  { to: '/compare', label: 'Compare', icon: Scale },
  { to: '/calculator', label: 'Calculator', icon: BarChart3 },
  { to: '/dashboard', label: 'Portfolio', icon: LayoutDashboard },
];

export default function Navbar() {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useUIStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLanding = location.pathname === '/';

  return (
    <nav className={`border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-[1000] ${isLanding ? 'bg-white/80 backdrop-blur-md' : 'bg-white'}`}>
      <Link to="/" className="flex items-center gap-2 no-underline">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Map className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900">EuroNest</span>
        <span className="text-xs text-gray-500 hidden sm:inline ml-1">AI Investment Advisor</span>
        <div className="hidden sm:block ml-2">
          <DataFreshness />
        </div>
      </Link>

      {/* Desktop nav */}
      <div className="hidden lg:flex items-center gap-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.to ||
            (item.to !== '/' && location.pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium no-underline transition-colors
                ${isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={toggleDarkMode}
          className="ml-2 p-2 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer border-0 bg-transparent"
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile hamburger */}
      <div className="lg:hidden flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer border-0 bg-transparent"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer border-0 bg-transparent"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-[999]">
          <div className="p-4 space-y-1">
            {navItems.map(item => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium no-underline
                    ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
