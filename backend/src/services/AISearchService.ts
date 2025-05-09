import OpenAI from 'openai';
import { config } from '../config';

interface SearchCriteria {
  industries?: string[];
  regions?: string[];
  countries?: string[];
  growthIndicators?: string[];
  technologies?: string[];
  yearFoundedRange?: {
    start?: number;
    end?: number;
  };
  size?: string[];
  sortBy?: string[];
}

export class AISearchService {
  private static openai = new OpenAI({
    apiKey: config.OPENAI_API_KEY
  });

  static async parseNaturalLanguageQuery(query: string): Promise<SearchCriteria> {
    try {
      const prompt = `Parse the following company search query into structured criteria. Extract relevant information about industries, regions, countries, growth indicators, technologies, founding year range, company size, and sorting preferences. Format the response as a JSON object.

Query: "${query}"

Example format:
{
  "industries": ["fintech", "banking"],
  "regions": ["Silicon Valley", "Europe"],
  "countries": ["United States", "Germany"],
  "growthIndicators": ["fastest growing", "high revenue"],
  "technologies": ["AR", "VR", "CRM"],
  "yearFoundedRange": {"start": 2020, "end": 2024},
  "size": ["startup", "enterprise"],
  "sortBy": ["growth", "revenue"]
}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a search query parser that extracts structured criteria from natural language queries about companies. Return only valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1
      });

      const parsedCriteria = JSON.parse(response.choices[0].message.content || '{}');
      return parsedCriteria;
    } catch (error) {
      console.error('Error parsing search query:', error);
      throw new Error('Failed to parse search query');
    }
  }

  static buildMongoQuery(criteria: SearchCriteria): any {
    const query: any = {};
    
    if (criteria.industries && criteria.industries.length > 0) {
      query.industry = { $in: criteria.industries.map(i => new RegExp(i, 'i')) };
    }

    if (criteria.regions && criteria.regions.length > 0) {
      query.region = { $in: criteria.regions.map(r => new RegExp(r, 'i')) };
    }

    if (criteria.countries && criteria.countries.length > 0) {
      query.country = { $in: criteria.countries.map(c => new RegExp(c, 'i')) };
    }

    if (criteria.technologies && criteria.technologies.length > 0) {
      // Search for technologies in company description
      query.description = {
        $regex: new RegExp(criteria.technologies.join('|'), 'i')
      };
    }

    if (criteria.yearFoundedRange) {
      query.founded = {};
      if (criteria.yearFoundedRange.start) {
        query.founded.$gte = criteria.yearFoundedRange.start;
      }
      if (criteria.yearFoundedRange.end) {
        query.founded.$lte = criteria.yearFoundedRange.end;
      }
    }

    if (criteria.size && criteria.size.length > 0) {
      query.size = { $in: criteria.size.map(s => new RegExp(s, 'i')) };
    }

    return query;
  }

  static getSortOptions(criteria: SearchCriteria): any {
    const sortOptions: any = {};

    if (criteria.sortBy && criteria.sortBy.length > 0) {
      criteria.sortBy.forEach(sort => {
        switch (sort.toLowerCase()) {
          case 'growth':
          case 'revenue':
            // If we had these fields, we would sort by them
            // For now, we'll use founded as a proxy for growth
            sortOptions.founded = -1;
            break;
          case 'newest':
            sortOptions.founded = -1;
            break;
          case 'oldest':
            sortOptions.founded = 1;
            break;
          default:
            break;
        }
      });
    }

    // Default sort if no valid sort criteria
    if (Object.keys(sortOptions).length === 0) {
      sortOptions.founded = -1;
    }

    return sortOptions;
  }
} 