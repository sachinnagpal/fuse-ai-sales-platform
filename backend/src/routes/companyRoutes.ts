import { Router, RequestHandler } from 'express';
import { companyController } from '../controllers/companyController';

const router = Router();

// Search companies
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

export default router; 