import React, { useState, useEffect } from 'react';
import CompanyCard from '../components/CompanyCard';
import SearchFilters from '../components/SearchFilters';
import companyService from '../services/companyService';
import type { Company, CompanySearchFilters, CompanySearchResponse } from '../types/company';

// Helper function to generate pagination range
function generatePaginationRange(currentPage: number, totalPages: number) {
  const delta = 2; // Number of pages to show on each side of current page
  const range = [];
  const rangeWithDots = [];
  let l;

  range.push(1);

  if (totalPages <= 1) {
    return range;
  }

  for (let i = currentPage - delta; i <= currentPage + delta; i++) {
    if (i > 1 && i < totalPages) {
      range.push(i);
    }
  }
  range.push(totalPages);

  for (let i = 0; i < range.length; i++) {
    if (l) {
      if (range[i] - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (range[i] - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(range[i]);
    l = range[i];
  }

  return rangeWithDots;
}

const SearchPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [filters, setFilters] = useState<CompanySearchFilters>({
    page: 1,
    limit: 12,
  });
  const [industries, setIndustries] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    companyService.getIndustries().then(setIndustries);
    companyService.getCountries().then(setCountries);
  }, []);

  const searchCompanies = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await companyService.searchCompanies(filters);
      setCompanies(response.companies);
      setTotalPages(response.totalPages);
      setTotalCompanies(response.totalCompanies);
    } catch (err) {
      setError('Failed to load companies');
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchCompanies();
  }, [filters.page]);

  const handleFilterChange = (newFilters: CompanySearchFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handleSearch = () => {
    searchCompanies();
    if (window.innerWidth < 768) {
      setMobileFiltersOpen(false);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setFilters(prev => ({ ...prev, page: pageNumber }));
  };

  const handleSaveCompany = async (id: string) => {
    try {
      await companyService.saveCompany(id);
      setCompanies(prevCompanies =>
        prevCompanies.map(company =>
          company._id === id ? { ...company, isSaved: true } : company
        )
      );
    } catch (error) {
      console.error('Error saving company:', error);
    }
  };

  const paginationRange = generatePaginationRange(filters.page || 1, totalPages);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Company Search</h1>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden btn btn-outline inline-flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <div className="sticky top-8">
              <SearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                industries={industries}
                countries={countries}
              />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Search Results</h2>
                  <p className="text-sm text-gray-500">{totalCompanies.toLocaleString()} companies found</p>
                </div>
              </div>

              <div className="p-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
                  </div>
                ) : companies.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {companies.map((company) => (
                      <CompanyCard
                        key={company._id}
                        company={company}
                        onSave={handleSaveCompany}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No companies found</h3>
                    <p className="mt-1 text-gray-500">Try adjusting your search filters or try a different search term.</p>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      {/* Previous Page */}
                      <button
                        onClick={() => handlePageChange(Math.max(1, (filters.page || 1) - 1))}
                        disabled={filters.page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      {/* Page Numbers */}
                      {paginationRange.map((pageNumber, idx) => (
                        pageNumber === '...' ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(Number(pageNumber))}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pageNumber === (filters.page || 1)
                                ? 'z-10 bg-indigo-600 border-indigo-600 text-white'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        )
                      ))}

                      {/* Next Page */}
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, (filters.page || 1) + 1))}
                        disabled={filters.page === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filters Dialog */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md transform transition-transform duration-300 ease-in-out">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close filters</span>
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6">
                    <SearchFilters
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      onSearch={handleSearch}
                      industries={industries}
                      countries={countries}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage; 