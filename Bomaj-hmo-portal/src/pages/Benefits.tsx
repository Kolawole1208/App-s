import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { BenefitsTable } from '../components/benefits/BenefitsTable';
import { apiClient } from '../services/apiClient';
import { Benefit } from '../types';

export const BenefitsPage: React.FC = () => {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [filteredBenefits, setFilteredBenefits] = useState<Benefit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    loadBenefits();
  }, []);

  const loadBenefits = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.getBenefits();
      setBenefits(response.data);
      setFilteredBenefits(response.data);
    } catch (err) {
      setError('Failed to load benefits. Please try again.');
      console.error('Error loading benefits:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = benefits;
    
    if (searchTerm) {
      filtered = filtered.filter(benefit =>
        benefit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        benefit.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(benefit => benefit.category === categoryFilter);
    }
    
    setFilteredBenefits(filtered);
  }, [searchTerm, categoryFilter, benefits]);

  const stats = {
    total: benefits.length,
    covered: benefits.filter(b => b.coverageStatus === 'covered').length,
    preventive: benefits.filter(b => b.category === 'preventive').length
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            My Benefits
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your healthcare coverage
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          {/* Export button */}
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ backgroundColor: '#e8f4fd', borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Benefits
              </Typography>
              <Typography variant="h3" fontWeight={700} color="#1a3a8f">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ backgroundColor: '#e8f7ef', borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Covered Services
              </Typography>
              <Typography variant="h3" fontWeight={700} color="#2e7d32">
                {stats.covered}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ backgroundColor: '#fff4e5', borderRadius: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Preventive Care
              </Typography>
              <Typography variant="h3" fontWeight={700} color="#ed6c02">
                {stats.preventive}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card elevation={0} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search benefits by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="preventive">Preventive</MenuItem>
                <MenuItem value="diagnostic">Diagnostic</MenuItem>
                <MenuItem value="therapeutic">Therapeutic</MenuItem>
                <MenuItem value="surgical">Surgical</MenuItem>
                <MenuItem value="wellness">Wellness</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredBenefits.length} of {benefits.length} benefits
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Benefits Table */}
      <BenefitsTable benefits={filteredBenefits} isLoading={isLoading} />
      
      {/* Help Section */}
      <Alert severity="info" sx={{ mt: 4 }}>
        <Typography variant="body2">
          Need help understanding your coverage? Contact our member services at{' '}
          <strong>1-800-BOMAJ-HMO</strong> or email{' '}
          <strong>memberservices@bomajhmo.com</strong>
        </Typography>
      </Alert>
    </Container>
  );
};