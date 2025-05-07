export interface Company {
  id: number;
  name: string;
  industry: string;
  size: string;
  revenue: string;
  location: string;
  yearFounded: number;
  description: string;
  website?: string;
  linkedin?: string;
}

export interface SearchFilters {
  industry: string;
  size: string;
  revenue: string;
  location: string;
  yearFounded: [number, number];
} 