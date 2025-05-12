import { OpenAI } from 'openai';
import { z } from 'zod';
import dotenv from 'dotenv';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Load environment variables
dotenv.config();

// Define the schema for company search criteria
export const CompanySearchSchema = z.object({
  industry: z.string().optional(),
  size: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  locality: z.string().optional(),
  yearFoundStart: z.number().optional(),
  yearFoundEnd: z.number().optional(),
  linkedinUrl: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  products: z.array(z.string()).optional(),
  website: z.string().optional(),
});

type CompanySearchCriteria = z.infer<typeof CompanySearchSchema>;

export class NaturalLanguageSearchService {
  private static cleanJsonResponse(text: string): string {
    // Remove markdown code block formatting
    return text.replace(/```json\n?|\n?```/g, '').trim();
  }

  static async parseNaturalLanguageQuery(query: string): Promise<CompanySearchCriteria> {
    const prompt = `
      Given the following natural language query about company search, extract the relevant search criteria.
      The query is: "${query}"
      
      Please extract the following information if present:
      - industry
      - size (must be one of: "1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+")
      - country
      - region
      - locality
      - yearFoundStart
      - yearFoundEnd (if not present, set to current year, only use if present in the query or yearFoundStart is present)
      
      For the size, if the query mentions a minimum or maximum number of employees, map it to the closest matching range from the allowed values above.
      Return the information in a structured format that matches our schema.
      If a field is not mentioned in the query, omit it from the response.
      Return ONLY the JSON object, without any markdown formatting or code blocks.
    `;

    try {
      const { text } = await generateText({
        model: openai('gpt-4-turbo-preview'),
        system: 'You are a search query parser that extracts structured criteria from natural language queries about companies. Return only valid JSON without any markdown formatting.',
        prompt,
      });

      const cleanedText = this.cleanJsonResponse(text);
      const response = JSON.parse(cleanedText);
      return CompanySearchSchema.parse(response);
    } catch (error) {
      console.error('Error parsing natural language query:', error);
      throw new Error('Failed to parse search query');
    }
  }

  static buildMongoQuery(criteria: CompanySearchCriteria): any {
    const query: any = {};

    // Support free-text search
    if ((criteria as any).name) {
      query.$text = { $search: (criteria as any).name };
    }
    if (criteria.industry) {
      query.industry = criteria.industry;
    }
    if (criteria.size) {
      query.size = criteria.size;
    }
    if (criteria.country) {
      query.country = criteria.country;
    }
    if (criteria.region) {
      query.region = criteria.region;
    }
    if (criteria.locality) {
      query.locality = criteria.locality;
    }
    if (criteria.yearFoundStart || criteria.yearFoundEnd) {
      query.founded = {};
      if (criteria.yearFoundStart) {
        query.founded.$gte = criteria.yearFoundStart;
      }
      if (criteria.yearFoundEnd) {
        query.founded.$lte = criteria.yearFoundEnd;
      }
    }
    return query;
  }

  static getSortOptions(criteria: CompanySearchCriteria): any {
    // Only use textScore if a $text search is present
    if ((criteria as any).name) {
      return { score: { $meta: "textScore" } };
    }
    return { _id: -1 }; // Default sort
  }
} 