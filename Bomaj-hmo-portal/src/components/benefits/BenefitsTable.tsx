import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
  alpha
} from '@mui/material';
import {
  Info as InfoIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { Benefit } from '../../types';

interface BenefitsTableProps {
  benefits: Benefit[];
  isLoading?: boolean;
}

// Define types for the config objects to avoid TypeScript errors
type StatusConfig = {
  [key in Benefit['coverageStatus']]: {
    label: string;
    color: 'success' | 'error' | 'warning' | 'info' | 'default' | 'primary' | 'secondary';
    variant: 'filled' | 'outlined';
  };
};

type CategoryColors = {
  [key in Benefit['category']]: string;
};

const getStatusChip = (status: Benefit['coverageStatus']) => {
  const config: StatusConfig = {
    covered: { label: 'Covered', color: 'success', variant: 'filled' },
    'not-covered': { label: 'Not Covered', color: 'error', variant: 'outlined' },
    partial: { label: 'Partial', color: 'warning', variant: 'outlined' },
    'prior-auth': { label: 'Prior Auth', color: 'info', variant: 'outlined' },
  };
  
  const { label, color, variant } = config[status];
  return <Chip label={label} color={color} variant={variant} size="small" />;
};

const getCategoryChip = (category: Benefit['category']) => {
  const colors: CategoryColors = {
    preventive: '#4caf50',
    diagnostic: '#2196f3',
    therapeutic: '#ff9800',
    surgical: '#f44336',
    wellness: '#9c27b0'
  };
  
  // Ensure the category exists in colors object
  const color = colors[category] || '#757575'; // Default gray color if category not found
  
  return (
    <Chip
      label={category.charAt(0).toUpperCase() + category.slice(1)}
      size="small"
      sx={{
        backgroundColor: alpha(color, 0.1),
        color: color,
        fontWeight: 500,
        border: `1px solid ${alpha(color, 0.3)}`
      }}
    />
  );
};

export const BenefitsTable: React.FC<BenefitsTableProps> = ({ benefits = [], isLoading }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <Typography>Loading benefits...</Typography>
      </Box>
    );
  }

  // Handle empty benefits array
  if (!benefits || benefits.length === 0) {
    return (
      <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No benefits found</Typography>
      </Paper>
    );
  }

  const displayedBenefits = benefits.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 700, color: '#1a3a8f' }}>Benefit Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a3a8f' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a3a8f' }}>Coverage Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a3a8f' }}>Coverage Details</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1a3a8f' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedBenefits.map((benefit) => (
              <TableRow 
                key={benefit.id}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {benefit.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {benefit.code}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {getCategoryChip(benefit.category)}
                </TableCell>
                <TableCell>
                  {getStatusChip(benefit.coverageStatus)}
                </TableCell>
                <TableCell>
                  <Box>
                    {benefit.coverageDetails?.limit && (
                      <Typography variant="body2" color="text.secondary">
                        Limit: {benefit.coverageDetails.limit}
                      </Typography>
                    )}
                    {benefit.coverageDetails?.frequency && (
                      <Typography variant="body2" color="text.secondary">
                        Frequency: {benefit.coverageDetails.frequency}
                      </Typography>
                    )}
                    {!benefit.coverageDetails?.limit && !benefit.coverageDetails?.frequency && (
                      <Typography variant="body2" color="text.secondary" fontStyle="italic">
                        No specific limits
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title="View details">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download coverage letter">
                      <IconButton size="small">
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={benefits.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: '1px solid #e0e0e0',
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontWeight: 500
          }
        }}
      />
    </Paper>
  );
};