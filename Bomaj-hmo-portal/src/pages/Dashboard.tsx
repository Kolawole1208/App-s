import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  People as PeopleIcon,
  LocalHospital as HospitalIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const DashboardPage = () => {
  const statsData = [
    {
      title: 'Total Members',
      value: '12,847',
      change: '+5.2%',
      trend: 'up',
      icon: <PeopleIcon sx={{ color: '#0d1b4c' }} />,
      color: '#e3f2fd',
    },
    {
      title: 'Active Providers',
      value: '342',
      change: '+2.1%',
      trend: 'up',
      icon: <HospitalIcon sx={{ color: '#2e7d32' }} />,
      color: '#e8f5e9',
    },
    {
      title: 'Pending Claims',
      value: '189',
      change: '+8.3%',
      trend: 'down',
      icon: <ReceiptIcon sx={{ color: '#ed6c02' }} />,
      color: '#fff3e0',
    },
    {
      title: 'Monthly Revenue',
      value: '₦245.3M',
      change: '+12.7%',
      trend: 'up',
      icon: <MoneyIcon sx={{ color: '#9c27b0' }} />,
      color: '#f3e5f5',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      activity: 'New member registration - John Doe',
      time: '10 min ago',
      type: 'member',
      icon: '👤',
    },
    {
      id: 2,
      activity: 'Claim #2345 approved',
      time: '25 min ago',
      type: 'claim',
      icon: '✅',
    },
    {
      id: 3,
      activity: 'Provider Dr. Smith added',
      time: '1 hour ago',
      type: 'provider',
      icon: '🏥',
    },
    {
      id: 4,
      activity: 'Monthly premium payment received',
      time: '2 hours ago',
      type: 'payment',
      icon: '💰',
    },
    {
      id: 5,
      activity: 'Authorization request #789 approved',
      time: '3 hours ago',
      type: 'auth',
      icon: '🔒',
    },
  ];

  const claimsData = [
    {
      id: 'CL-2345',
      member: 'John Doe',
      provider: 'City Hospital',
      amount: '₦85,000',
      status: 'Pending',
      date: '2024-01-15',
      statusColor: 'warning',
    },
    {
      id: 'CL-2344',
      member: 'Sarah Johnson',
      provider: 'Medicare Clinic',
      amount: '₦42,500',
      status: 'Approved',
      date: '2024-01-14',
      statusColor: 'success',
    },
    {
      id: 'CL-2343',
      member: 'Mike Wilson',
      provider: 'General Hospital',
      amount: '₦120,000',
      status: 'Processing',
      date: '2024-01-14',
      statusColor: 'info',
    },
    {
      id: 'CL-2342',
      member: 'Emily Brown',
      provider: 'Dental Care Ltd',
      amount: '₦25,000',
      status: 'Rejected',
      date: '2024-01-13',
      statusColor: 'error',
    },
    {
      id: 'CL-2341',
      member: 'David Lee',
      provider: 'Eye Clinic',
      amount: '₦68,000',
      status: 'Pending',
      date: '2024-01-13',
      statusColor: 'warning',
    },
  ];

  return (
    <Box>
      {/* Welcome Banner */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
          Bomaj HMO Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your HMO today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e0e0e0',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      backgroundColor: stat.color,
                      borderRadius: 2,
                      p: 1.5,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {stat.value}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      {stat.trend === 'up' ? (
                        <TrendingUpIcon sx={{ color: '#2e7d32', fontSize: 16, mr: 0.5 }} />
                      ) : (
                        <TrendingDownIcon sx={{ color: '#d32f2f', fontSize: 16, mr: 0.5 }} />
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          color: stat.trend === 'up' ? '#2e7d32' : '#d32f2f',
                          fontWeight: 'medium',
                        }}
                      >
                        {stat.change} from last month
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts and Activities Section */}
      <Grid container spacing={3} mb={4}>
        {/* Member Growth Chart */}
        <Grid item xs={12} lg={8}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              height: '100%',
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold">
                Member Growth Trend
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select defaultValue="6months">
                  <MenuItem value="6months">Last 6 months</MenuItem>
                  <MenuItem value="year">Last year</MenuItem>
                  <MenuItem value="3years">Last 3 years</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                height: 300,
                border: '2px dashed #e0e0e0',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fafafa',
              }}
            >
              <Typography color="text.secondary">
                Chart: Member growth over time will appear here
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
              height: '100%',
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Recent Activities
            </Typography>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {recentActivities.map((activity) => (
                <ListItem
                  key={activity.id}
                  sx={{
                    py: 1.5,
                    px: 0,
                    borderBottom: '1px solid #f0f0f0',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Avatar
                      sx={{
                        bgcolor:
                          activity.type === 'member'
                            ? '#e3f2fd'
                            : activity.type === 'claim'
                            ? '#e8f5e9'
                            : '#f3e5f5',
                        width: 32,
                        height: 32,
                        fontSize: '0.875rem',
                      }}
                    >
                      {activity.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight="medium">
                        {activity.activity}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Button
              variant="text"
              size="small"
              endIcon={<ArrowForwardIcon />}
              sx={{ mt: 2, color: '#0d1b4c' }}
            >
              View all activities
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Claims Table */}
      <Paper
        sx={{
          borderRadius: 2,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e0e0e0',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" fontWeight="bold">
            Recent Claims
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pending claims requiring attention
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f7fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>Claim ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>Member</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>Provider</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {claimsData.map((claim) => (
                <TableRow
                  key={claim.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={{ fontWeight: 'medium' }}>{claim.id}</TableCell>
                  <TableCell>{claim.member}</TableCell>
                  <TableCell>{claim.provider}</TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{claim.amount}</TableCell>
                  <TableCell>
                    <Chip
                      label={claim.status}
                      color={claim.statusColor as any}
                      size="small"
                      sx={{ fontWeight: 'medium' }}
                    />
                  </TableCell>
                  <TableCell>{claim.date}</TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      size="small"
                      sx={{ color: '#0d1b4c', fontWeight: 'medium' }}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button
            variant="text"
            endIcon={<ArrowForwardIcon />}
            sx={{ color: '#0d1b4c', fontWeight: 'medium' }}
          >
            View all claims
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DashboardPage;