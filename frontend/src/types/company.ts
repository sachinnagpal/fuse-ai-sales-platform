export interface Company {
  _id: string;
  name: string;
  size: string;
  website: string;
  founded: number;
  locality: string;
  region: string;
  country: string;
  industry: string;
  linkedin_url: string;
  description?: string;
  isSaved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanySearchResponse {
  companies: Company[];
  currentPage: number;
  totalPages: number;
  totalCompanies: number;
}

export interface CompanySearchFilters {
  name?: string;
  industry?: string;
  country?: string;
  size?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} 