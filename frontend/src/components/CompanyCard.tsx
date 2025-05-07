import type { Company } from '../types/company';

interface CompanyCardProps {
  company: Company;
  onSave?: (id: string) => Promise<void>;
}

function CompanyCard({ company, onSave }: CompanyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow duration-200">
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
                <span>Founded {company.yearFounded}</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center">
                <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{company.location}</span>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-1 flex-shrink-0 ml-4">
            {company.website && (
              <a
                href={company.website}
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
            {company.linkedin && (
              <a
                href={company.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-50"
                title="View on LinkedIn"
              >
                <span className="sr-only">View on LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            )}
            {onSave && (
              <button
                onClick={() => onSave(company._id)}
                disabled={company.isSaved}
                className={`text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${
                  company.isSaved ? 'text-indigo-600' : ''
                }`}
                title={company.isSaved ? 'Already saved' : 'Save company'}
              >
                <span className="sr-only">Save company</span>
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
          <span className="badge badge-purple">
            {company.revenue}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CompanyCard; 