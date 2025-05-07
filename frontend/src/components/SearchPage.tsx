import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box,
  CircularProgress,
  Pagination,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchFilters from './SearchFilters';
import CompanyCard from './CompanyCard';
import { searchCompanies } from '../services/api';
import { Company } from '../types/company';

const SearchPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    name: '',
    industry: '',
    country: '',
    companySize: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCompanies: 0
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearch = async (searchFilters: typeof filters) => {
    try {
      setLoading(true);
      setError(null);
      setFilters(searchFilters);
      const response = await searchCompanies({
        ...searchFilters,
        page: 1,
        limit: 10
      });
      setCompanies(response.companies);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalCompanies: response.totalCompanies
      });
    } catch (err) {
      setError('Error searching companies. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (event: React.ChangeEvent<unknown>, value: number) => {
    try {
      setLoading(true);
      const response = await searchCompanies({
        ...filters,
        page: value,
        limit: 10
      });
      setCompanies(response.companies);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalCompanies: response.totalCompanies
      });
    } catch (err) {
      setError('Error loading page. Please try again.');
      console.error('Page change error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Filters Section */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Search Filters
            </Typography>
            <SearchFilters onSearch={handleSearch} />
          </Paper>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={9}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Search Results
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pagination.totalCompanies.toLocaleString()} companies found
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error" sx={{ py: 2 }}>
                {error}
              </Typography>
            ) : (
              <>
                <Grid container spacing={2}>
                  {companies.map((company) => (
                    <Grid item xs={12} sm={6} md={4} key={company._id}>
                      <CompanyCard company={company} />
                    </Grid>
                  ))}
                </Grid>

                {pagination.totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={pagination.totalPages}
                      page={pagination.currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size={isMobile ? 'small' : 'medium'}
                    />
                  </Box>
                )}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchPage; 