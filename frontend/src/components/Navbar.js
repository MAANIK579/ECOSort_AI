import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  CameraAlt as CameraIcon,
  TextFields as TextIcon,
  Analytics as AnalyticsIcon,
  Info as InfoIcon,
  Recycling as RecyclingIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const navItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Image Classification', path: '/image-classification', icon: <CameraIcon /> },
    { text: 'Text Classification', path: '/text-classification', icon: <TextIcon /> },
    { text: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
    { text: 'About', path: '/about', icon: <InfoIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <RecyclingIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography variant="h6" color="primary" fontWeight="bold">
          EcoSortAI
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            component={RouterLink}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            sx={{
              backgroundColor: isActive(item.path) ? 'primary.light' : 'transparent',
              color: isActive(item.path) ? 'white' : 'inherit',
              '&:hover': {
                backgroundColor: isActive(item.path) ? 'primary.main' : 'action.hover',
              },
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? 'white' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <RecyclingIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              EcoSortAI
            </Typography>
            <Typography
              variant="body2"
              sx={{ ml: 2, color: 'text.secondary', display: { xs: 'none', lg: 'block' } }}
            >
              Smart Waste Segregation Assistant
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navItems.map((item) => (
              <Button
                key={item.text}
                component={RouterLink}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  mx: 1,
                  color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                  backgroundColor: isActive(item.path) ? 'primary.light' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive(item.path) ? 'primary.main' : 'action.hover',
                    color: isActive(item.path) ? 'white' : 'primary.main',
                  },
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
