import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { Company } from '../models/Company';
import { z } from 'zod';
import dotenv from 'dotenv';
import { CompanySearchSchema } from './AISearchService';

dotenv.config();


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
        Given the query: "${query}", return a JSON array of companies (no markdown).

        Each object must have:
        {
          "name": "",
          "linkedinUrl": "",
          "website": "",
          "industry": "",
          "size": "", // One of: "1-10", "11-50", ..., "5000+"
          "location": {
            "country": "",
            "region": "",
            "city": ""
          },
          "founded": "",
          "description": ""
        }

        Only include companies likely to be on LinkedIn.
        Return only the array.
      `;


    const { text } = await generateText({
      model: openai('gpt-3.5-turbo'),
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
    const companiesToCreate = [];

    // Prepare arrays for batch lookup
    const linkedinUrls = companies
      .map(company => company.linkedinUrl)
      .filter((url): url is string => url !== undefined)
      .map(url => this.cleanLinkedInUrl(url))
      .filter((url): url is string => url !== null);

    const companyNames = companies
      .map(company => company.name)
      .filter(name => name);

    // Batch lookup by LinkedIn URLs
    const linkedinMatches = await Company.find({
      linkedin_url: { $in: linkedinUrls }
    });

    // Batch lookup by company names
    const nameMatches = await Company.find({
      name: { $in: companyNames }
    });

    // Create lookup maps for faster matching
    const linkedinMap = new Map(linkedinMatches.map(company => [company.linkedin_url, company]));
    const nameMap = new Map(nameMatches.map(company => [company.name, company]));

    // Process each company
    for (const company of companies) {
      try {
        const linkedinUrl = company.linkedinUrl ? this.cleanLinkedInUrl(company.linkedinUrl) : null;
        const companyName = company.name;

        if (!linkedinUrl && !companyName) continue;

        let dbCompany = null;

        // Try to find match using maps
        if (linkedinUrl && linkedinMap.has(linkedinUrl)) {
          dbCompany = linkedinMap.get(linkedinUrl);
        } else if (companyName && nameMap.has(companyName)) {
          dbCompany = nameMap.get(companyName);
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
          // Prepare company for batch creation
          companiesToCreate.push({
            name: company.name || 'Unknown Company',
            linkedin_url: linkedinUrl || 'unknown',
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
        }
      } catch (error) {
        console.error('Error processing company:', error);
        enrichedCompanies.push({
          ...company,
          isInDatabase: false,
          matchError: 'Failed to process company'
        });
      }
    }

    // Batch create new companies if any
    if (companiesToCreate.length > 0) {
      try {
        const savedCompanies = await Company.insertMany(companiesToCreate);
        
        // Add newly created companies to enriched results
        savedCompanies.forEach((savedCompany, index) => {
          const originalCompany = companies.find(c => 
            (c.linkedinUrl && this.cleanLinkedInUrl(c.linkedinUrl) === savedCompany.linkedin_url) ||
            c.name === savedCompany.name
          );

          if (originalCompany) {
            enrichedCompanies.push({
              ...originalCompany,
              _id: savedCompany._id,
              isInDatabase: true,
              databaseData: {
                saved: false,
                lastUpdated: savedCompany.updatedAt,
                additionalData: savedCompany
              }
            });
          }
        });
      } catch (error) {
        console.error('Error batch creating companies:', error);
        // Add companies that failed to be created
        companiesToCreate.forEach(company => {
          enrichedCompanies.push({
            ...company,
            isInDatabase: false,
            matchError: 'Failed to create company in database'
          });
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