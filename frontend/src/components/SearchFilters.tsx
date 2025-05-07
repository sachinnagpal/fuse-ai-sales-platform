import { useState, useEffect } from 'react';
import type { CompanySearchFilters } from '../types/company';

interface SearchFiltersProps {
  filters: CompanySearchFilters;
  onFilterChange: (filters: CompanySearchFilters) => void;
  onSearch: () => void;
  industries: string[];
  countries: string[];
}

function SearchFilters({ filters, onFilterChange, onSearch, industries, countries }: SearchFiltersProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const handleChange = (field: keyof CompanySearchFilters, value: string | [number, number]) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Search Filters</h2>
      </div>

      <div className="p-6 space-y-6">
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
            <option value="1-50">1-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-1000">201-1000 employees</option>
            <option value="1001-5000">1001-5000 employees</option>
            <option value="5000+">5000+ employees</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Filter by number of employees
          </p>
        </div>

        {/* Revenue */}
        <div>
          <label htmlFor="revenue" className="block text-sm font-medium text-gray-700">
            Annual Revenue
          </label>
          <select
            id="revenue"
            value={filters.revenue || ''}
            onChange={(e) => handleChange('revenue', e.target.value)}
            className="select mt-1"
          >
            <option value="">Any Revenue</option>
            <option value="$0-$1M">$0-$1M</option>
            <option value="$1M-$10M">$1M-$10M</option>
            <option value="$10M-$50M">$10M-$50M</option>
            <option value="$50M-$100M">$50M-$100M</option>
            <option value="$100M+">$100M+</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Filter by annual revenue range
          </p>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input
              type="text"
              id="location"
              value={filters.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Enter city, state, or country"
              className="input pl-10"
              list="countries"
            />
            <datalist id="countries">
              {countries.map((country) => (
                <option key={country} value={country} />
              ))}
            </datalist>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Filter by company location
          </p>
        </div>

        {/* Year Founded Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Year Founded Range
          </label>
          <div className="mt-1 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="yearFoundedStart" className="sr-only">
                Start Year
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="yearFoundedStart"
                  value={filters.yearFounded?.[0] || 1900}
                  onChange={(e) => handleChange('yearFounded', [parseInt(e.target.value), filters.yearFounded?.[1] || 2024])}
                  min="1900"
                  max="2024"
                  className="input pr-12"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">Start</span>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="yearFoundedEnd" className="sr-only">
                End Year
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="yearFoundedEnd"
                  value={filters.yearFounded?.[1] || 2024}
                  onChange={(e) => handleChange('yearFounded', [filters.yearFounded?.[0] || 1900, parseInt(e.target.value)])}
                  min="1900"
                  max="2024"
                  className="input pr-12"
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
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <button
          type="submit"
          className="btn btn-primary w-full flex items-center justify-center"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Apply Filters
        </button>
      </div>
    </form>
  );
}

export default SearchFilters; 