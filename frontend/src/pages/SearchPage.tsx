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
import SearchFilters from '../components/SearchFilters';
import companyService from '../services/companyService';
import type { Company, CompanySearchFilters } from '../types/company';

const SearchPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<CompanySearchFilters>({
    page: 1,
    limit: 12,
  });
  const [industries, setIndustries] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    companyService.getIndustries().then(setIndustries);
    companyService.getCountries().then(setCountries);
  }, []);

  const searchCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyService.searchCompanies(filters);
      setCompanies(response.companies);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error searching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchCompanies();
  }, [filters.page]);

  const handleFilterChange = (newFilters: CompanySearchFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handleSearch = () => {
    searchCompanies();
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setFilters(prev => ({ ...prev, page: value }));
  };

  const handleSaveCompany = async (id: string) => {
    try {
      await companyService.saveCompany(id);
      // Update the company in the list
      setCompanies(prevCompanies =>
        prevCompanies.map(company =>
          company._id === id ? { ...company, isSaved: true } : company
        )
      );
    } catch (error) {
      console.error('Error saving company:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Company Search
      </Typography>

      <SearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        industries={industries}
        countries={countries}
      />

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
                No companies found. Try adjusting your search filters.
              </Typography>
            </Box>
          )}

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={filters.page}
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

export default SearchPage; 