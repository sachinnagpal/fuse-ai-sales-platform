import { OpenAI } from 'openai';
import axios from 'axios';
import { Company } from '../models/Company';
import dotenv from 'dotenv';

dotenv.config();

export class AdvancedSearchService {
  private static openai: OpenAI;
  private static readonly SERP_API_KEY = process.env.SERP_API_KEY;
  private static readonly GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  private static readonly GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

  static {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  static async searchCompanies(query: string): Promise<any> {
    try {
      // 1. Use OpenAI to enhance the search query
      const enhancedQuery = await this.enhanceSearchQuery(query);

      // 2. Perform web search using Google Custom Search API
      const searchResults = await this.performWebSearch(enhancedQuery);

      // 3. Extract company information from search results
      const extractedCompanies = await this.extractCompanyInfo(searchResults);

      // 4. Match with our database
      const matchedCompanies = await this.matchWithDatabase(extractedCompanies);

      return {
        companies: matchedCompanies,
        searchMetadata: {
          originalQuery: query,
          enhancedQuery,
          totalResults: matchedCompanies.length
        }
      };
    } catch (error) {
      console.error('Error in advanced search:', error);
      throw error;
    }
  }

  private static async enhanceSearchQuery(query: string): Promise<string> {
    const prompt = `
      Enhance the following search query to better find relevant companies and their information.
      Original query: "${query}"
      
      Consider:
      - Adding relevant industry terms
      - Including company size indicators
      - Adding location context
      - Including technology or product terms
      
      Return only the enhanced search query, nothing else.
    `;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a search query enhancement assistant that helps improve search queries for finding company information."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    return completion.choices[0].message.content || query;
  }

  private static async performWebSearch(query: string): Promise<any[]> {
    try {
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: this.GOOGLE_API_KEY,
          cx: this.GOOGLE_SEARCH_ENGINE_ID,
          q: query,
          num: 10 // Number of results
        }
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error performing web search:', error);
      throw new Error('Failed to perform web search');
    }
  }

  private static async extractCompanyInfo(searchResults: any[]): Promise<any[]> {
    const companies = [];

    for (const result of searchResults) {
      const prompt = `
        Extract company information from the following search result:
        Title: ${result.title}
        Snippet: ${result.snippet}
        Link: ${result.link}
        
        Extract:
        - Company name
        - Industry
        - Location
        - Size (if mentioned)
        - Technologies/products (if mentioned)
        
        Return the information in JSON format.
      `;

      try {
        const completion = await this.openai.chat.completions.create({
          model: "gpt-4-turbo-preview",
          messages: [
            {
              role: "system",
              content: "You are a company information extraction assistant."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" }
        });

        const extractedInfo = JSON.parse(completion.choices[0].message.content || '{}');
        companies.push(extractedInfo);
      } catch (error) {
        console.error('Error extracting company info:', error);
        continue;
      }
    }

    return companies;
  }

  private static async matchWithDatabase(extractedCompanies: any[]): Promise<any[]> {
    const matchedCompanies = [];

    for (const company of extractedCompanies) {
      try {
        // Try to find matching companies in our database
        const matches = await Company.find({
          $or: [
            { name: { $regex: company.name, $options: 'i' } },
            { domain: { $regex: company.domain, $options: 'i' } }
          ]
        }).lean();

        if (matches.length > 0) {
          // Enrich the database entry with additional information from web search
          const enrichedCompany = {
            ...matches[0],
            webSearchData: {
              ...company,
              confidence: this.calculateMatchConfidence(matches[0], company)
            }
          };
          matchedCompanies.push(enrichedCompany);
        }
      } catch (error) {
        console.error('Error matching company:', error);
        continue;
      }
    }

    return matchedCompanies;
  }

  private static calculateMatchConfidence(dbCompany: any, webCompany: any): number {
    // Implement a simple confidence scoring system
    let score = 0;
    
    if (dbCompany.name.toLowerCase() === webCompany.name.toLowerCase()) {
      score += 0.5;
    }
    
    if (dbCompany.industry === webCompany.industry) {
      score += 0.3;
    }
    
    if (dbCompany.country === webCompany.country) {
      score += 0.2;
    }
    
    return score;
  }
} 