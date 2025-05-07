import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Box,
  Link,
  Chip,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import type { Company } from '../types/company';

interface CompanyCardProps {
  company: Company;
  onSave: (id: string) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onSave }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="div">
            {company.name}
          </Typography>
          <Chip 
            label={company.size}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <BusinessIcon sx={{ mr: 1, fontSize: 'small' }} />
          <Typography variant="body2" color="text.secondary">
            {company.industry}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOnIcon sx={{ mr: 1, fontSize: 'small' }} />
          <Typography variant="body2" color="text.secondary">
            {company.locality}, {company.region}, {company.country}
          </Typography>
        </Box>

        {company.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {company.description}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary">
          Founded: {company.founded}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Box>
          <Link href={company.website} target="_blank" rel="noopener noreferrer">
            <Button size="small">Website</Button>
          </Link>
          <Link href={company.linkedin_url} target="_blank" rel="noopener noreferrer">
            <Button size="small">LinkedIn</Button>
          </Link>
        </Box>
        <Button
          size="small"
          onClick={() => onSave(company._id)}
          startIcon={company.isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          color={company.isSaved ? 'primary' : 'inherit'}
        >
          {company.isSaved ? 'Saved' : 'Save'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default CompanyCard; 