import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CompanyDetail } from '../components/CompanyDetail';
import companyService from '../services/companyService';
import type { Company } from '../types/company';

const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const data = await companyService.getCompanyById(id!);
        setCompany(data);
      } catch (err) {
        setError('Failed to load company details');
        console.error('Error fetching company:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompany();
    }
  }, [id]);

  const handleCompanyUpdate = (updatedCompany: Company) => {
    setCompany(updatedCompany);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {error || 'Company not found'}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <CompanyDetail company={company} onUpdate={handleCompanyUpdate} />
    </div>
  );
};

export default CompanyDetailPage; 