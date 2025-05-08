import { Company, ICompany } from '../models/Company';
import { WebScraperService } from './WebScraperService';
import { LLMService } from './LLMService';

export class CompanyDescriptionService {
  static async generateAndSaveDescription(companyId: string): Promise<ICompany> {
    try {
      // Get company from database
      const company = await Company.findById(companyId).lean();
      if (!company) {
        throw new Error('Company not found');
      }

      // Scrape website content
      const websiteContent = await WebScraperService.scrapeWebsite(company.website);

      // Generate description using LLM
      const description = await LLMService.generateCompanyDescription(
        company.name,
        websiteContent
      );

      // Update company in database
      company.description = description;
      await Company.findByIdAndUpdate(companyId, { description });

      return company;
    } catch (error) {
      console.error('Error generating company description:', error);
      throw new Error('Failed to generate and save company description');
    }
  }

  static async generateDescriptionForAllCompanies(): Promise<void> {
    try {
      const companies = await Company.find({ description: { $exists: false } });
      
      for (const company of companies) {
        try {
          await this.generateAndSaveDescription(company._id);
          // Add delay to respect API rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error processing company ${company.name}:`, error);
          continue;
        }
      }
    } catch (error) {
      console.error('Error in batch description generation:', error);
      throw new Error('Failed to process companies batch');
    }
  }
} 