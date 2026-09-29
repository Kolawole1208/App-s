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
  AccountBalance as AccountBalanceIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: <DashboardIcon />, label: 'Dashboard', path: '/' },
  { icon: <PeopleIcon />, label: 'Members', path: '/members' },
  { icon: <HospitalIcon />, label: 'Providers', path: '/providers' },
  { icon: <ReceiptIcon />, label: 'Claims', path: '/claims' },
  { icon: <AccountBalanceIcon />, label: 'Billing', path: '/billing' },
  { icon: <HospitalIcon />, label: 'Hospitals', path: '/hospitals' },
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

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logout clicked');
  };

  const drawerContent = (
    <Box sx={{ width: 250, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 40,
            height: 40,
            fontWeight: 'bold',
          }}
        >
          BH
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold" color="primary">
            Bomaj HMO
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Admin Portal
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ ml: 'auto' }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      
      <Divider />
      
      {/* Navigation Menu */}
      <List sx={{ p: 2, flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main + '10',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main + '20',
                  },
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: location.pathname === item.path 
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary,
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  color: location.pathname === item.path 
                    ? theme.palette.primary.main 
                    : theme.palette.text.primary,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      {/* Support Section */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ backgroundColor: '#e3f2fd', borderRadius: 2, p: 2, mb: 2 }}>
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
        
        {/* Logout Button */}
        <ListItemButton
          sx={{
            borderRadius: 2,
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.error.main,
              backgroundColor: theme.palette.error.main + '10',
            },
          }}
          onClick={handleLogout}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ position: 'fixed', left: 16, top: 16, zIndex: theme.zIndex.drawer + 1 }}
        >
          <MenuIcon />
        </IconButton>
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
              width: 250,
              borderRight: '1px solid #e0e0e0',
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
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};