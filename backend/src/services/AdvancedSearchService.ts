import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { Company } from '../models/Company';
import { z } from 'zod';
import dotenv from 'dotenv';
import { CompanySearchSchema } from './AISearchService';

dotenv.config();

// Define the schema for company data
// const CompanyDataSchema = z.object({
//   name: z.string(),
//   linkedinUrl: z.string().url(),
//   website: z.string().url().optional(),
//   industry: z.string(),
//   size: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+']),
//   location: z.object({
//     country: z.string(),
//     region: z.string().optional(),
//     city: z.string().optional()
//   }),
//   founded: z.number().optional(),
//   description: z.string(),
//   products: z.array(z.string()).optional()
// });

// Schema for the array response
const CompanyArraySchema = z.array(CompanySearchSchema);

type CompanyData = z.infer<typeof CompanySearchSchema>;

export class AdvancedSearchService {
  static async searchCompanies(query: string): Promise<any> {
    try {
      // 1. Use AI to directly get company information
      const companies = await this.getCompaniesFromAI(query);

      // 2. Match with database using LinkedIn URLs
      const enrichedCompanies = await this.matchWithDatabase(companies);

      return {
        companies: enrichedCompanies,
        searchMetadata: {
          originalQuery: query,
          totalResults: enrichedCompanies.length,
          searchType: 'ai_direct_search'
        }
      };
    } catch (error) {
      console.error('Error in advanced search:', error);
      throw error;
    }
  }

  private static async getCompaniesFromAI(query: string): Promise<CompanyData[]> {
    const prompt = `
      Given the following search query about companies, provide a list of relevant companies with their details.
      Query: "${query}"
      
      For each company, provide the following information in JSON format:
      {
        "name": "Company name",
        "linkedinUrl": "LinkedIn profile URL",
        "website": "Company website",
        "industry": "Primary industry",
        "size": "Company size (must be one of: "1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+")",
        "location": {
          "country": "Country",
          "region": "Region/State",
          "city": "City"
        },
        "founded": "Year founded",
        "description": "Brief company description",
      }

      Return an array of company objects. Focus on providing accurate LinkedIn URLs as they are crucial for matching.
      Include only companies that are likely to have a LinkedIn presence.
      Return the response as a JSON array, not an object with a companies property.
    `;

    const { text } = await generateText({
      model: openai('gpt-4-turbo-preview'),
      system: 'You are a company information assistant that provides accurate company details with a focus on LinkedIn URLs for matching. Return only valid JSON array without any markdown formatting.',
      prompt,
    });

    try {
      // Clean the response text to ensure it's valid JSON
      const cleanedText = text.trim().replace(/^```json\n?|\n?```$/g, '');
      const response = JSON.parse(cleanedText);
      const validatedResponse = CompanyArraySchema.parse(response);
      return validatedResponse;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.error('Raw response:', text);
      throw new Error('Failed to parse company data from AI response');
    }
  }

  private static async matchWithDatabase(companies: CompanyData[]): Promise<any[]> {
    const enrichedCompanies = [];

    for (const company of companies) {
      try {
        // Try to find matching company in database using LinkedIn URL or name
        const linkedinUrl = company.linkedinUrl;
        const companyName = company.name;

        if (!linkedinUrl && !companyName) continue;

        let dbCompany = null;

        if (linkedinUrl) {
          // Clean LinkedIn URL to match format in database
          const cleanLinkedInUrl = this.cleanLinkedInUrl(linkedinUrl);
          if (cleanLinkedInUrl) {
            dbCompany = await Company.findOne({ linkedin_url: cleanLinkedInUrl });
          }
        }

        // If no match found by LinkedIn URL, try company name
        if (!dbCompany && companyName) {
          dbCompany = await Company.findOne({ name: companyName });
        }

        if (dbCompany) {
          // Enrich with database data
          enrichedCompanies.push({
            ...company,
            _id: dbCompany._id,
            isInDatabase: true,
            databaseData: {
              saved: dbCompany.isSaved,
              lastUpdated: dbCompany.updatedAt,
              additionalData: dbCompany
            }
          });
        } else {
          // Create new company in database with required fields
          const newCompany = new Company({
            name: company.name || 'Unknown Company',
            linkedin_url: company.linkedinUrl ? this.cleanLinkedInUrl(company.linkedinUrl) || 'unknown' : 'unknown',
            website: company.website || 'unknown',
            industry: company.industry || 'Unknown',
            size: company.size || 'Unknown',
            country: company.country || 'Unknown',
            region: company.region || 'Unknown',
            locality: company.locality || 'Unknown',
            founded: company.yearFoundStart || new Date().getFullYear(),
            description: company.description || '',
            isSaved: false
          });

          const savedCompany = await newCompany.save();

          // Return in same format as existing companies
          enrichedCompanies.push({
            ...company,
            _id: savedCompany._id,
            isInDatabase: true,
            databaseData: {
              saved: false,
              lastUpdated: savedCompany.updatedAt,
              additionalData: savedCompany
            }
          });
        }
      } catch (error) {
        console.error('Error matching/saving company:', error);
        // Include company even if matching/saving fails
        enrichedCompanies.push({
          ...company,
          isInDatabase: false,
          matchError: 'Failed to match or save with database'
        });
      }
    }

    return enrichedCompanies;
  }

  private static cleanLinkedInUrl(url: string): string | null {
    try {
      // Remove protocol and www if present
      const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/i, '');
      
      // Extract company identifier
      const match = cleanUrl.match(/linkedin\.com\/company\/([^\/\?]+)/i);
      if (match && match[1]) {
        return `linkedin.com/company/${match[1].toLowerCase()}`;
      }
      
      return null;
    } catch (error) {
      console.error('Error cleaning LinkedIn URL:', error);
      return null;
    }
  }
} 