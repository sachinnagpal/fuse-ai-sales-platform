import { Router, RequestHandler } from 'express';
import { companyController } from '../controllers/companyController';
import express from 'express';
import { CompanyDescriptionService } from '../services/CompanyDescriptionService';
import { QueueService } from '../services/QueueService';

const router = Router();

// Natural language to structured query search
router.get('/natural-search', companyController.naturalLanguageSearch as RequestHandler);

// AI-powered web search with enrichment
router.get('/ai-search', companyController.aiSearch as RequestHandler);

// Regular filter-based search
router.get('/search', companyController.searchCompanies as RequestHandler);

// Get unique industries
router.get('/industries', companyController.getUniqueIndustries as RequestHandler);

// Get unique countries
router.get('/countries', companyController.getUniqueCountries as RequestHandler);

// Get company by ID
router.get('/:id', companyController.getCompanyById as RequestHandler);

// Save company to prospects
router.post('/:id/save', companyController.saveCompany as RequestHandler);

// Unsave company from prospects
router.post('/:id/unsave', companyController.unsaveCompany as RequestHandler);

// Get saved companies
router.get('/saved/list', companyController.getSavedCompanies as RequestHandler);

// Generate description for a single company
router.post('/:id/generate-description', async (req, res) => {
  try {
    const jobId = await QueueService.addDescriptionJob(req.params.id);
    res.json({ 
      message: 'Description generation job added to queue',
      jobId 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Check description generation job status
router.get('/description-job/:jobId', async (req, res) => {
  try {
    const status = await QueueService.getJobStatus(req.params.jobId);
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all jobs for a company
router.get('/:id/jobs', async (req, res) => {
  try {
    const jobs = await QueueService.getCompanyJobs(req.params.id);
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 