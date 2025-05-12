import type { Company, CompanySearchFilters } from '../types/company';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface SearchParams {
  name?: string;
  industry?: string;
  country?: string;
  companySize?: string;
  page?: number;
  limit?: number;
}

interface SearchResponse {
  companies: Company[];
  currentPage: number;
  totalPages: number;
  totalCompanies: number;
}

interface AISearchResponse extends SearchResponse {
  searchCriteria: {
    industries?: string[];
    regions?: string[];
    countries?: string[];
    growthIndicators?: string[];
    technologies?: string[];
    yearFoundedRange?: {
      start?: number;
      end?: number;
    };
    size?: string[];
    sortBy?: string[];
  };
}

export async function searchCompanies(params: CompanySearchFilters & { page: number; limit: number }): Promise<SearchResponse> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  const response = await fetch(`${API_BASE_URL}/companies/search?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to search companies');
  }
  return response.json();
}

export async function aiSearchCompanies(query: string, page: number = 1, limit: number = 10): Promise<AISearchResponse> {
  const queryParams = new URLSearchParams({
    query,
    page: page.toString(),
    limit: limit.toString()
  });

  const response = await fetch(`${API_BASE_URL}/companies/ai-search?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to perform AI search');
  }
  return response.json();
}

export async function naturalSearchCompanies(query: string, page: number = 1, limit: number = 10): Promise<AISearchResponse> {
  const queryParams = new URLSearchParams({
    query,
    page: page.toString(),
    limit: limit.toString()
  });

  const response = await fetch(`${API_BASE_URL}/companies/natural-search?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to perform natural language search');
  }
  return response.json();
}

export async function getCompanyById(id: string): Promise<Company> {
  const response = await fetch(`${API_BASE_URL}/companies/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch company');
  }
  return response.json();
}

export async function saveCompany(companyId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/companies/${companyId}/save`, {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error('Failed to save company');
  }
}

export async function getSavedCompanies(): Promise<Company[]> {
  const response = await fetch(`${API_BASE_URL}/companies/saved`);
  if (!response.ok) {
    throw new Error('Failed to fetch saved companies');
  }
  return response.json();
}

export async function getUniqueIndustries(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/companies/industries`);
  if (!response.ok) {
    throw new Error('Failed to fetch industries');
  }
  return response.json();
}

export async function getUniqueCountries(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/companies/countries`);
  if (!response.ok) {
    throw new Error('Failed to fetch countries');
  }
  return response.json();
} 