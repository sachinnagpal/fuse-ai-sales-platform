import { Request, Response } from 'express';
import { Company, ICompany } from '../models/Company';

export const companyController = {
  // Search companies with filters and pagination
  async searchCompanies(req: Request, res: Response) {
    try {
      const {
        name,
        industry,
        country,
        size,
        page = 1,
        limit = 10,
        region,
        locality,
        yearFoundStart,
        yearFoundEnd,

      } = req.query;

      let query: any = {};
      

      if (name) {
        query.$text = { $search: name };
      }
      if (industry) {
        query.industry = industry;
      }
      if (country) {
        query.country = country;
      }
      if (size) {
        query.size = size;
      }
      
      if (region) {
        query.region = region;
      }
      if (locality) {
        query.locality = locality;
      }
      if (yearFoundStart && yearFoundEnd) {
          query.founded = { $gte: yearFoundStart, $lte: yearFoundEnd };
      }
      
      

      // Calculate skip value for pagination
      const skip = (Number(page) - 1) * Number(limit);

      console.log(query);
      // Execute query with pagination
      const companies = await Company.find(query)
        .skip(skip)
        .limit(Number(limit))
        .lean();
     
        
      const total = await Company.count(query);
      
      const results = {
        companies,
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalCompanies: total
      };

      res.json(results);
    } catch (error) {
      console.error('Error searching companies:', error);
      res.status(500).json({ message: 'Error searching companies' });
    }
  },

  // Get company by ID
  async getCompanyById(req: Request, res: Response) {
    try {
      const company = await Company.findById(req.params.id);
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching company', error });
    }
  },

  // Save company to prospects
  async saveCompany(req: Request, res: Response) {
    try {
      const company = await Company.findByIdAndUpdate(
        req.params.id,
        { isSaved: true },
        { new: true }
      );
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: 'Error saving company', error });
    }
  },

  // Unsave company from prospects
  async unsaveCompany(req: Request, res: Response) {
    try {
      const company = await Company.findByIdAndUpdate(
        req.params.id,
        { isSaved: false },
        { new: true }
      );
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: 'Error unsaving company', error });
    }
  },

  // Get saved companies
  async getSavedCompanies(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 10
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);
      
      const companies = await Company.find({ isSaved: true })
        .skip(skip)
        .limit(Number(limit));

      const total = await Company.countDocuments({ isSaved: true });

      res.json({
        companies,
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalCompanies: total
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching saved companies', error });
    }
  },

  // Get unique industries
  async getUniqueIndustries(req: Request, res: Response) {
    try {
      const industries = await Company.distinct('industry');
      res.json(industries);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching industries', error });
    }
  },

  // Get unique countries
  async getUniqueCountries(req: Request, res: Response) {
    try {
      const countries = await Company.distinct('country');
      res.json(countries);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching countries', error });
    }
  }
}; 