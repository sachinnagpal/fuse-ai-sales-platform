import React from 'react';
import { GenerateDescriptionButton } from './GenerateDescriptionButton';
import type { Company } from '../types/company';

interface CompanyDetailProps {
  company: Company;
  onUpdate: (updatedCompany: Company) => void;
}

export const CompanyDetail: React.FC<CompanyDetailProps> = ({ company, onUpdate }) => {
  const handleDescriptionGenerated = (description: string) => {
    onUpdate({ ...company, description });
  };

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Description Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Company Description</h2>
            <GenerateDescriptionButton
              companyId={company._id}
              onDescriptionGenerated={handleDescriptionGenerated}
              disabled={!!company.description}
            />
          </div>
          {company.description ? (
            <p className="text-gray-700">{company.description}</p>
          ) : (
            <p className="text-gray-500 italic">No description available</p>
          )}
        </div>

        {/* Company Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Industry</h3>
            <p className="mt-1 text-gray-900">{company.industry}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Size</h3>
            <p className="mt-1 text-gray-900">{company.size}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Founded</h3>
            <p className="mt-1 text-gray-900">{company.founded}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Location</h3>
            <p className="mt-1 text-gray-900">{`${company.locality}, ${company.region}, ${company.country}`}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Website</h3>
            <a 
              href={company.website ? (company.website.startsWith('http') ? company.website : `https://${company.website}`) : '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-1 text-indigo-600 hover:text-indigo-500 block"
            >
              {company.website}
            </a>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500">LinkedIn</h3>
            <a 
              href={company.linkedin_url ? (company.linkedin_url.startsWith('http') ? company.linkedin_url : `https://${company.linkedin_url}`) : '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-1 text-indigo-600 hover:text-indigo-500 block"
            >
              {company.linkedin_url}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}; 