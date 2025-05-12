import React, { useState } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Tooltip,
  Box,
  Chip,
  Typography,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface AISearchBarProps {
  onSearch: (query: string) => void;
  searchCriteria?: {
    industries?: string[];
    regions?: string[];
    countries?: string[];
    growthIndicators?: string[];
    technologies?: string[];
    yearFoundedRange?: {
      start?: number;
      end?: number;
    };
    size?: string[];
    sortBy?: string[];
  };
  isLoading?: boolean;
}

const AISearchBar: React.FC<AISearchBarProps> = ({ onSearch, searchCriteria, isLoading }) => {
  const [query, setQuery] = useState('');
  const theme = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const renderCriteriaTags = () => {
    if (!searchCriteria) return null;

    const tags: Array<{ label: string; value: string }> = [];

    if (searchCriteria.industries?.length) {
      tags.push({ label: 'Industries', value: searchCriteria.industries.join(', ') });
    }
    if (searchCriteria.regions?.length) {
      tags.push({ label: 'Regions', value: searchCriteria.regions.join(', ') });
    }
    if (searchCriteria.technologies?.length) {
      tags.push({ label: 'Technologies', value: searchCriteria.technologies.join(', ') });
    }
    if (searchCriteria.growthIndicators?.length) {
      tags.push({ label: 'Growth', value: searchCriteria.growthIndicators.join(', ') });
    }
    if (searchCriteria.yearFoundedRange) {
      const { start, end } = searchCriteria.yearFoundedRange;
      if (start || end) {
        tags.push({ 
          label: 'Founded', 
          value: `${start || 'Any'} - ${end || 'Present'}`
        });
      }
    }

    return (
      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1, alignSelf: 'center' }}>
          AI understood:
        </Typography>
        {tags.map(({ label, value }) => (
          <Tooltip key={label} title={value}>
            <Chip
              size="small"
              label={`${label}: ${value.length > 20 ? value.substring(0, 20) + '...' : value}`}
              color="primary"
              variant="outlined"
            />
          </Tooltip>
        ))}
      </Box>
    );
  };

  return (
    <Box>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          border: `1px solid ${theme.palette.divider}`,
          '&:hover': {
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        <AutoAwesomeIcon 
          sx={{ 
            ml: 1,
            color: theme.palette.primary.main
          }} 
        />
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Try 'Fastest growing AR companies in Silicon Valley' or 'Top fintechs in Europe'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
        <Tooltip title="Search with AI">
          <IconButton 
            type="submit" 
            sx={{ p: '10px' }} 
            aria-label="search"
            disabled={isLoading}
          >
            <SearchIcon />
          </IconButton>
        </Tooltip>
      </Paper>
      {renderCriteriaTags()}
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        AI-powered search finds companies from the web and matches them with our database
      </Typography>
    </Box>
  );
};

export default AISearchBar; 