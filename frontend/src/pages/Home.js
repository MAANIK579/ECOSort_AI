import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  TextFields as TextIcon,
  Analytics as AnalyticsIcon,
  Recycling as RecyclingIcon,
  CloudUpload as UploadIcon,
  TrendingUp as TrendingIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const Home = () => {
  const features = [
    {
      icon: <CameraIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Image Classification',
      description: 'Upload photos of waste items and get instant AI-powered classification into biodegradable, recyclable, or hazardous categories.',
      action: 'Try Image Classification',
      path: '/image-classification',
    },
    {
      icon: <TextIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Text Classification',
      description: 'Describe waste items in text and receive accurate classification with detailed disposal recommendations.',
      action: 'Try Text Classification',
      path: '/text-classification',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Analytics Dashboard',
      description: 'Track waste generation patterns, view sustainability metrics, and monitor environmental impact over time.',
      action: 'View Analytics',
      path: '/analytics',
    },
  ];

  const benefits = [
    {
      icon: <RecyclingIcon sx={{ fontSize: 32, color: 'success.main' }} />,
      title: 'AI-Powered',
      description: 'Advanced machine learning models provide accurate waste classification with high confidence scores.',
    },
    {
      icon: <UploadIcon sx={{ fontSize: 32, color: 'success.main' }} />,
      title: 'Easy to Use',
      description: 'Simple upload interface and intuitive design make waste classification accessible to everyone.',
    },
    {
      icon: <TrendingIcon sx={{ fontSize: 32, color: 'success.main' }} />,
      title: 'Real-time Results',
      description: 'Get instant classification results with detailed sustainability scores and disposal tips.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 32, color: 'success.main' }} />,
      title: 'Secure & Private',
      description: 'Your data is processed securely and never stored permanently for privacy protection.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 50%, #CDDC39 100%)',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <RecyclingIcon sx={{ fontSize: 80, mb: 3 }} />
            <Typography variant="h2" component="h1" gutterBottom>
              EcoSortAI
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
              Smart Waste Segregation Assistant
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
              Leverage the power of Artificial Intelligence to accurately classify waste items and make informed decisions about proper disposal methods.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={RouterLink}
                to="/image-classification"
                variant="contained"
                size="large"
                startIcon={<CameraIcon />}
                sx={{ px: 4, py: 1.5 }}
              >
                Start with Image
              </Button>
              <Button
                component={RouterLink}
                to="/text-classification"
                variant="outlined"
                size="large"
                startIcon={<TextIcon />}
                sx={{ px: 4, py: 1.5 }}
              >
                Start with Text
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          How It Works
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'translateY(-8px)' },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" component="h3" gutterBottom fontWeight="600">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    component={RouterLink}
                    to={feature.path}
                    variant="contained"
                    size="large"
                    sx={{ px: 4 }}
                  >
                    {feature.action}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ mb: 6 }}>
            Why Choose EcoSortAI?
          </Typography>
          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box textAlign="center">
                  <Box sx={{ mb: 2 }}>{benefit.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight="600">
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom fontWeight="600">
          Ready to Make a Difference?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Join thousands of users who are already making smarter waste disposal decisions with EcoSortAI.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={RouterLink}
            to="/image-classification"
            variant="contained"
            size="large"
            startIcon={<RecyclingIcon />}
            sx={{ px: 4, py: 1.5 }}
          >
            Get Started
          </Button>
          <Button
            component={RouterLink}
            to="/about"
            variant="outlined"
            size="large"
            startIcon={<RecyclingIcon />}
            sx={{ px: 4, py: 1.5 }}
          >
            Learn More
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
