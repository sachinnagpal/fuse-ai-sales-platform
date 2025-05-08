import { Link } from 'react-router-dom';
import type { Company } from '../types/company';

interface CompanyCardProps {
  company: Company;
  onSave?: (id: string, isSaved: boolean) => Promise<void>;
}

function CompanyCard({ company, onSave }: CompanyCardProps) {
  // Format location string
  const location = [company.locality, company.region, company.country]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <Link to={`/companies/${company._id}`} className="block">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-indigo-600">
                {company.name}
              </h3>
              <div className="mt-1 flex items-center text-sm text-gray-500 space-x-3">
                <div className="flex items-center">
                  <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Founded {company.founded}</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{location}</span>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              {company.website && (
                <a
                  href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-50"
                  title="Visit website"
                >
                  <span className="sr-only">Visit website</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </a>
              )}
              {company.linkedin_url && (
                <a
                  href={company.linkedin_url.startsWith('http') ? company.linkedin_url : `https://${company.linkedin_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-50"
                  title="View on LinkedIn"
                >
                  <span className="sr-only">View on LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
              {onSave && (
                <button
                  onClick={() => onSave(company._id, !company.isSaved)}
                  className={`text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-50 ${
                    company.isSaved ? 'text-indigo-600' : ''
                  }`}
                  title={company.isSaved ? 'Remove from saved' : 'Save company'}
                >
                  <span className="sr-only">{company.isSaved ? 'Remove from saved' : 'Save company'}</span>
                  <svg className="h-5 w-5" fill={company.isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          {company.description && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 line-clamp-2">
                {company.description}
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="badge badge-blue">
              {company.industry}
            </span>
            <span className="badge badge-green">
              {company.size} employees
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CompanyCard; 