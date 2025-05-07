export interface Company {
  _id: string;
  name: string;
  industry: string;
  size: string;
  revenue: string;
  location: string;
  yearFounded: number;
  description: string;
  website?: string;
  linkedin?: string;
  isSaved?: boolean;
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
  name?: string;
  industry?: string;
  size?: string;
  revenue?: string;
  location?: string;
  yearFounded?: [number, number];
} 