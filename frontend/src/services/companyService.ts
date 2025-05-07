import axios from 'axios';
import type { Company, CompanySearchFilters, CompanySearchResponse } from '../types/company';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const companyService = {
  // Search companies with filters
  async searchCompanies(filters: CompanySearchFilters): Promise<CompanySearchResponse> {
    const response = await axios.get(`${API_URL}/companies/search`, {
      params: filters
    });
    return response.data;
  },

  // Get company by ID
  async getCompanyById(id: string): Promise<Company> {
    const response = await axios.get(`${API_URL}/companies/${id}`);
    return response.data;
  },

  // Save company to prospects
  async saveCompany(id: string): Promise<Company> {
    const response = await axios.post(`${API_URL}/companies/${id}/save`);
    return response.data;
  },

  // Get saved companies
  async getSavedCompanies(page: number = 1, limit: number = 10): Promise<CompanySearchResponse> {
    const response = await axios.get(`${API_URL}/companies/saved/list`, {
      params: { page, limit }
    });
    return response.data;
  }
};

export default companyService; 