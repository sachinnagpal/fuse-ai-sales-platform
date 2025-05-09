import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box,
  CircularProgress,
  Pagination,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Collapse,
  Button
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import SearchFilters from '../components/SearchFilters';
import AISearchBar from '../components/AISearchBar';
import CompanyCard from '../components/CompanyCard';
import { searchCompanies, aiSearchCompanies, getUniqueIndustries, getUniqueCountries } from '../services/api';
import type { Company, CompanySearchFilters } from '../types/company';

const SearchPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<CompanySearchFilters>({
    industry: undefined,
    size: undefined,
    locality: undefined,
    region: undefined,
    country: undefined,
    yearFoundStart: undefined,
    yearFoundEnd: undefined
  });
  const [industries, setIndustries] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<any>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCompanies: 0
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [industriesData, countriesData] = await Promise.all([
          getUniqueIndustries(),
          getUniqueCountries()
        ]);
        setIndustries(industriesData);
        setCountries(countriesData);
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    };
    fetchFilterOptions();
  }, []);

  const handleFilterChange = (newFilters: CompanySearchFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchCompanies({
        ...filters,
        page: 1,
        limit: 10
      });
      setCompanies(response.companies);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalCompanies: response.totalCompanies
      });
      setSearchCriteria(null);
    } catch (err) {
      setError('Error searching companies. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAISearch = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiSearchCompanies(query, 1, 10);
      setCompanies(response.companies);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalCompanies: response.totalCompanies
      });
      setSearchCriteria({
        ...response.searchCriteria,
        lastQuery: query
      });
    } catch (err) {
      setError('Error performing AI search. Please try again.');
      console.error('AI Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (event: React.ChangeEvent<unknown>, value: number) => {
    try {
      setLoading(true);
      if (searchCriteria?.lastQuery) {
        const response = await aiSearchCompanies(searchCriteria.lastQuery, value, 10);
        setCompanies(response.companies);
        setPagination({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalCompanies: response.totalCompanies
        });
        setSearchCriteria({
          ...response.searchCriteria,
          lastQuery: searchCriteria.lastQuery
        });
      } else {
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
      }
    } catch (err) {
      setError('Error loading page. Please try again.');
      console.error('Page change error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Search Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
          Company Search
        </Typography>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <AISearchBar 
            onSearch={handleAISearch}
            searchCriteria={searchCriteria}
            isLoading={loading}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              startIcon={<TuneIcon />}
              onClick={() => setShowFilters(!showFilters)}
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              {showFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Filters Section */}
        <Grid item xs={12} md={3}>
          <Collapse in={showFilters}>
            <Paper elevation={3} sx={{ p: 2, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom>
                Advanced Filters
              </Typography>
              <SearchFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                industries={industries}
                countries={countries}
              />
            </Paper>
          </Collapse>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={showFilters ? 9 : 12}>
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