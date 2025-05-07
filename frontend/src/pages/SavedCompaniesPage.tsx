import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Pagination,
  Box,
  CircularProgress,
} from '@mui/material';
import CompanyCard from '../components/CompanyCard';
import companyService from '../services/companyService';
import type { Company } from '../types/company';

const SavedCompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 12;

  const fetchSavedCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyService.getSavedCompanies(page, limit);
      setCompanies(response.companies);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching saved companies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedCompanies();
  }, [page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSaveCompany = async (id: string) => {
    try {
      await companyService.saveCompany(id);
      // Update the company in the list
      setCompanies(prevCompanies =>
        prevCompanies.map(company =>
          company._id === id ? { ...company, isSaved: false } : company
        )
      );
      // Refresh the list if the company was removed
      fetchSavedCompanies();
    } catch (error) {
      console.error('Error updating saved company:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Saved Companies
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {companies.map((company) => (
              <Grid key={company._id} item xs={12} sm={6} md={4}>
                <CompanyCard
                  company={company}
                  onSave={handleSaveCompany}
                />
              </Grid>
            ))}
          </Grid>

          {companies.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No saved companies yet. Start saving companies from the search page.
              </Typography>
            </Box>
          )}

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default SavedCompaniesPage; 