import express, { RequestHandler } from 'express';
import { companyController } from '../controllers/companyController';

const router = express.Router();

// Search companies
router.get('/search', companyController.searchCompanies as RequestHandler);
router.get('/industries', companyController.getUniqueIndustries as RequestHandler);
router.get('/countries', companyController.getUniqueCountries as RequestHandler);

// Get company by ID
router.get('/:id', companyController.getCompanyById as RequestHandler);

// Save company to prospects
router.post('/:id/save', companyController.saveCompany as RequestHandler);

// Get saved companies
router.get('/saved/list', companyController.getSavedCompanies as RequestHandler);

export default router; 