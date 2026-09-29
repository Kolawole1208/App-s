import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Chip,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';

const benefitsData = [
  { benefit: '24 Hour Creatinine Clearance', status: 'Covered', statusColor: 'success' },
  { benefit: 'ALT (Sgpt) Serum', status: 'Covered', statusColor: 'success' },
  { benefit: 'Access To Gyms For Regular Exercise', status: 'COVERED (1 SESSIONS PER WEEK)', statusColor: 'success' },
  { benefit: 'Access To Prescribed Drugs', status: 'COVERED', statusColor: 'success' },
  { benefit: 'Advanced Ocular Tests', status: 'Not Covered', statusColor: 'error' },
  { benefit: 'After-Demise Compensation', status: 'COVERED (UP TO 50,000 NAIRA LIMIT)', statusColor: 'success' },
  { benefit: 'Annual Visual Acuity Check', status: 'Covered', statusColor: 'success' },
  { benefit: 'Arthroscopy', status: 'Not Covered', statusColor: 'error' },
  { benefit: 'Blood Group Check', status: 'Not Covered', statusColor: 'error' },
  { benefit: 'CT Scan', status: 'COVERED (1 SESSION PER ANNUM)', statusColor: 'success' },
  { benefit: 'Dialysis And All Related Care', status: 'COVERED (3 SESSIONS PER YEAR)', statusColor: 'success' },
];

const BenefitsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBenefits = benefitsData.filter(item =>
    item.benefit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const coveredCount = benefitsData.filter(item => item.statusColor === 'success').length;
  const coverageRate = Math.round((coveredCount / benefitsData.length) * 100);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          My Benefits
        </Typography>
        <TextField
          placeholder="Search Benefits..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Coverage Rate
              </Typography>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {coverageRate}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={coverageRate} 
                sx={{ height: 10, borderRadius: 5, mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                {coveredCount} of {benefitsData.length} benefits are covered
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              icon={<CheckCircle />} 
              label="Covered" 
              color="success" 
              variant="outlined"
            />
            <Chip 
              icon={<Cancel />} 
              label="Not Covered" 
              color="error" 
              variant="outlined"
            />
          </Box>
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: 2, boxShadow: 3 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: 'primary.light' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Benefit</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBenefits.map((item, index) => (
                <TableRow key={index} hover>
                  <TableCell sx={{ fontWeight: 'medium' }}>{item.benefit}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      color={item.statusColor as any}
                      icon={item.statusColor === 'success' ? <CheckCircle /> : <Cancel />}
                      sx={{ fontWeight: 'medium' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {filteredBenefits.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <SearchIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No benefits found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Try adjusting your search terms
          </Typography>
          <Button variant="contained" onClick={() => setSearchTerm('')}>
            Clear Search
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default BenefitsPage;
