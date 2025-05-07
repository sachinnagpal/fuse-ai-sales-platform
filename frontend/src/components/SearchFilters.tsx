import React from 'react';
import {
  Paper,
  TextField,
  Grid,
  MenuItem,
  Button,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchFiltersProps {
  filters: {
    name: string;
    industry: string;
    country: string;
    companySize: string;
  };
  onFilterChange: (filters: {
    name: string;
    industry: string;
    country: string;
    companySize: string;
  }) => void;
  onSearch: () => void;
  industries: string[];
  countries: string[];
}

const companySizes = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5001-10000',
  '10001+'
];

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFilterChange, onSearch, industries, countries }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (field: keyof typeof filters) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFilterChange({
      ...filters,
      [field]: event.target.value
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Company Name"
              value={filters.name}
              onChange={handleChange('name')}
              margin="normal"
              size={isMobile ? 'small' : 'medium'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Industry"
              value={filters.industry}
              onChange={handleChange('industry')}
              margin="normal"
              size={isMobile ? 'small' : 'medium'}
            >
              <MenuItem value="">
                <em>Any</em>
              </MenuItem>
              {industries.map((industry) => (
                <MenuItem key={industry} value={industry}>
                  {industry}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Country"
              value={filters.country}
              onChange={handleChange('country')}
              margin="normal"
              size={isMobile ? 'small' : 'medium'}
            >
              <MenuItem value="">
                <em>Any</em>
              </MenuItem>
              {countries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Company Size"
              value={filters.companySize}
              onChange={handleChange('companySize')}
              margin="normal"
              size={isMobile ? 'small' : 'medium'}
            >
              <MenuItem value="">
                <em>Any</em>
              </MenuItem>
              {companySizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size} employees
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          size={isMobile ? 'small' : 'medium'}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </Box>
    </Paper>
  );
};

export default SearchFilters; 