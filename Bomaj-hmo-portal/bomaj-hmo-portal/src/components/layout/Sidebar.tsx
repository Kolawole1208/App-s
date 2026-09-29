import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  ListItemButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocalHospital as HospitalIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  CreditCard as CreditCardIcon,
  Settings as SettingsIcon,
  MedicalServices as MedicalServicesIcon,
  Medication as MedicationIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: <DashboardIcon />, label: 'Dashboard', path: '/' },
  { icon: <PeopleIcon />, label: 'Members', path: '/members' },
  { icon: <HospitalIcon />, label: 'Providers', path: '/providers' },
  { icon: <ReceiptIcon />, label: 'Claims', path: '/claims' },
  { icon: <CreditCardIcon />, label: 'Billing', path: '/billing' },
  { icon: <MedicalServicesIcon />, label: 'Consult Doctor', path: '/consult' },
  { icon: <MedicationIcon />, label: 'Benefits', path: '/benefits' },
  { icon: <SettingsIcon />, label: 'Settings', path: '/settings' },
];

export const Sidebar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const drawerContent = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="white">
              B
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight="bold" color="primary">
            Bomaj HMO
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      
      <Divider />
      
      {/* Navigation Menu */}
      <List sx={{ p: 2, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.label}
            disablePadding
            sx={{ mb: 1 }}
          >
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(76, 201, 255, 0.15)',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: 'rgba(76, 201, 255, 0.2)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(76, 201, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: isActive(item.path) ? theme.palette.primary.main : 'text.secondary',
                minWidth: 40 
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      {/* Support Section */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          backgroundColor: '#e3f2fd', 
          borderRadius: 2, 
          p: 2,
          border: '1px solid #bbdefb'
        }}>
          <Typography variant="body2" fontWeight="medium" color="primary" gutterBottom>
            Need help?
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Contact support at support@bomajhmo.com
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 'medium',
              mt: 1,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Contact Support →
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 280,
              boxShadow: '4px 0 15px rgba(0, 0, 0, 0.1)'
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          borderRight: '1px solid #e0e0e0',
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};