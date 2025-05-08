export interface Company {
  _id: string;
  name: string;
  size: string;
  website?: string;
  founded: number;
  locality: string;
  region: string;
  country: string;
  industry: string;
  linkedin_url?: string;
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
  page?: number;
  limit?: number;
  industry?: string;
  size?: string;
  locality?: string;
  region?: string;
  country?: string;
  yearFoundStart?: number;
  yearFoundEnd?: number;
} 