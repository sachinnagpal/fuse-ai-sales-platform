import axios from 'axios';
import { Company } from '../types/company';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

export const searchCompanies = async (params: SearchParams): Promise<SearchResponse> => {
  const response = await axios.get(`${API_URL}/companies/search`, { params });
  return response.data;
};

export const getCompanyById = async (id: string): Promise<Company> => {
  const response = await axios.get(`${API_URL}/companies/${id}`);
  return response.data;
};

export const saveCompany = async (companyId: string): Promise<void> => {
  await axios.post(`${API_URL}/companies/save/${companyId}`);
};

export const getSavedCompanies = async (): Promise<Company[]> => {
  const response = await axios.get(`${API_URL}/companies/saved`);
  return response.data;
}; 