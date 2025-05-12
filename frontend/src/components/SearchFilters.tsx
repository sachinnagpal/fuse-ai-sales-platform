import { useState, useEffect } from 'react';
import type { CompanySearchFilters } from '../types/company';

interface SearchFiltersProps {
  filters: CompanySearchFilters;
  onFilterChange: (filters: CompanySearchFilters) => void;
  onSearch: () => void;
  onAISearch: (query: string) => void;
  industries: string[];
  countries: string[];
  searchCriteria?: {
    industries?: string[];
    regions?: string[];
    countries?: string[];
    size?: string[];
    yearFoundedRange?: {
      start?: number;
      end?: number;
    };
  };
}

function SearchFilters({ filters, onFilterChange, onSearch, onAISearch, industries, countries, searchCriteria }: SearchFiltersProps) {
  const [aiQuery, setAiQuery] = useState('');
  const [isAISearchMode, setIsAISearchMode] = useState(true);

  // Update form fields when AI search criteria changes
  useEffect(() => {
    if (searchCriteria) {
      const newFilters: CompanySearchFilters = {
        ...filters,
        industry: searchCriteria.industries?.[0] || undefined,
        country: searchCriteria.countries?.[0] || undefined,
        region: searchCriteria.regions?.[0] || undefined,
        size: searchCriteria.size?.[0] || undefined,
        yearFoundStart: searchCriteria.yearFoundedRange?.start,
        yearFoundEnd: searchCriteria.yearFoundedRange?.end
      };
      onFilterChange(newFilters);
    }
  }, [searchCriteria]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAISearchMode && aiQuery.trim()) {
      onAISearch(aiQuery);
    } else {
      onSearch();
    }
  };

  const handleChange = (field: keyof CompanySearchFilters, value: string | number | undefined) => {
    onFilterChange({
      ...filters,
      [field]: value === '' ? undefined : value,
    });
  };

  const handleYearChange = (field: 'yearFoundStart' | 'yearFoundEnd', value: string) => {
    const yearValue = value === '' ? undefined : parseInt(value);
    handleChange(field, yearValue);
  };

  const toggleSearchMode = () => {
    setIsAISearchMode(!isAISearchMode);
    // Clear AI query when switching to traditional mode
    if (isAISearchMode) {
      setAiQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Search Filters</h2>
        <button
          type="button"
          onClick={toggleSearchMode}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          {isAISearchMode ? 'Use Traditional Filters' : 'Use AI Search'}
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* AI Search Input */}
        {isAISearchMode && (
          <div>
            <label htmlFor="aiSearch" className="block text-sm font-medium text-gray-700">
              AI-Powered Search
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="aiSearch"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="e.g., companies in manufacturing with more than 200 employees"
                className="input w-full"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Describe what you're looking for in natural language
            </p>
          </div>
        )}

        {/* Traditional Filters */}
        {!isAISearchMode && (
          <>
            {/* Industry */}
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <select
                id="industry"
                value={filters.industry || ''}
                onChange={(e) => handleChange('industry', e.target.value)}
                className="select mt-1"
              >
                <option value="">All Industries</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Filter companies by their primary industry
              </p>
            </div>

            {/* Company Size */}
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                Company Size
              </label>
              <select
                id="size"
                value={filters.size || ''}
                onChange={(e) => handleChange('size', e.target.value)}
                className="select mt-1"
              >
                <option value="">Any Size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1001-5000">1001-5000 employees</option>
                <option value="5000+">5000+ employees</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Filter by number of employees
              </p>
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                id="country"
                value={filters.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
                className="select mt-1"
              >
                <option value="">Any Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Filter by company's country
              </p>
            </div>

            {/* Region */}
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                Region/State/Province
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="region"
                  value={filters.region || ''}
                  onChange={(e) => handleChange('region', e.target.value)}
                  placeholder="e.g. California, Ontario"
                  className="input"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Filter by region, state, or province
              </p>
            </div>

            {/* Locality */}
            <div>
              <label htmlFor="locality" className="block text-sm font-medium text-gray-700">
                City/Town
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="locality"
                  value={filters.locality || ''}
                  onChange={(e) => handleChange('locality', e.target.value)}
                  placeholder="e.g. San Francisco, Toronto"
                  className="input"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Filter by city or town
              </p>
            </div>

            {/* Year Founded Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Year Founded Range
              </label>
              <div className="mt-1 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="yearFoundStart" className="sr-only">
                    Start Year
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="yearFoundStart"
                      value={filters.yearFoundStart || ''}
                      onChange={(e) => handleYearChange('yearFoundStart', e.target.value)}
                      min="1900"
                      max="2024"
                      className="input pr-12"
                      placeholder="1900"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">Start</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="yearFoundEnd" className="sr-only">
                    End Year
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="yearFoundEnd"
                      value={filters.yearFoundEnd || ''}
                      onChange={(e) => handleYearChange('yearFoundEnd', e.target.value)}
                      min="1900"
                      max="2024"
                      className="input pr-12"
                      placeholder="2024"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">End</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Filter by company founding year range
              </p>
            </div>
          </>
        )}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <button
          type="submit"
          className="btn btn-primary w-full flex items-center justify-center"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {isAISearchMode ? 'Search with AI' : 'Apply Filters'}
        </button>
      </div>
    </form>
  );
}

export default SearchFilters; 