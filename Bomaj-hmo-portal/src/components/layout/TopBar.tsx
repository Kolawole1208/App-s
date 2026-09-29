import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  alpha,
  styled,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Help as HelpIcon,
} from '@mui/icons-material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(3),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '300px',
    },
  },
}));

interface TopBarProps {
  onMenuClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const notifications = [
    { id: 1, text: 'New claim submitted for review', time: '10 min ago' },
    { id: 2, text: 'Member registration pending approval', time: '25 min ago' },
    { id: 3, text: 'System maintenance scheduled', time: '1 hour ago' },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e0e0e0',
        zIndex: theme.zIndex.drawer + 1,
        width: { md: `calc(100% - 250px)` },
        ml: { md: '250px' },
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Search sx={{ flexGrow: { xs: 1, md: 0 } }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search members, providers, claims..."
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            color="inherit"
            onClick={handleNotificationsClick}
            sx={{ color: 'text.secondary' }}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 300,
                maxHeight: 400,
                overflow: 'auto',
              },
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Notifications
              </Typography>
            </Box>
            {notifications.map((notification) => (
              <MenuItem key={notification.id} sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {notification.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            <MenuItem sx={{ justifyContent: 'center', color: 'primary.main', fontWeight: 'medium' }}>
              View all notifications
            </MenuItem>
          </Menu>

          <IconButton color="inherit" sx={{ color: 'text.secondary' }}>
            <HelpIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
            <Box sx={{ textAlign: 'right', mr: 2, display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" fontWeight="medium">
                Dr. Abel Kolawole
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Super Admin
              </Typography>
            </Box>
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{ p: 0 }}
            >
              <Avatar
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  width: 40,
                  height: 40,
                  fontWeight: 'bold',
                }}
              >
                AK
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                },
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body2" fontWeight="bold">
                    Dr. Abel Kolawole
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    admin@bomajhmo.com
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>Profile Settings</MenuItem>
              <MenuItem onClick={handleMenuClose}>Account Settings</MenuItem>
              <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};