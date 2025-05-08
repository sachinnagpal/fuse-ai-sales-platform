import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import SearchPage from './pages/SearchPage';
import SavedCompaniesPage from './pages/SavedCompaniesPage';
import CompanyDetailPage from './pages/CompanyDetailPage';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen w-full bg-gray-50">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Logo */}
              <Link 
                to="/" 
                className="text-lg sm:text-xl font-bold text-primary-main whitespace-nowrap mr-8"
              >
                Company Prospector
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                <Link 
                  to="/" 
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </Link>
                <Link 
                  to="/saved" 
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Saved Companies
                </Link>
              </div>

              {/* Spacer */}
              <div className="flex-grow" />

              {/* Action Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                <button className="btn btn-outline">
                  Talk to Sales
                </button>
                <button className="btn btn-primary">
                  Start Free Trial
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-4 py-3 space-y-3">
                <Link 
                  to="/" 
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </Link>
                <Link 
                  to="/saved" 
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Saved Companies
                </Link>
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <button className="btn btn-outline w-full">
                    Talk to Sales
                  </button>
                  <button className="btn btn-primary w-full">
                    Start Free Trial
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="w-full">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/saved" element={<SavedCompaniesPage />} />
              <Route path="/companies/:id" element={<CompanyDetailPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
