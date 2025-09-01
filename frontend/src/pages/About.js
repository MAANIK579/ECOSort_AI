import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Psychology as AIIcon,
  Code as CodeIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  GitHub as GitHubIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  Security as SecurityIcon,
  Recycling as RecyclingIcon,
} from '@mui/icons-material';

const About = () => {
  const technologies = [
    { name: 'React.js', category: 'Frontend', description: 'Modern JavaScript library for building user interfaces' },
    { name: 'Material-UI', category: 'Frontend', description: 'React component library implementing Material Design' },
    { name: 'Python Flask', category: 'Backend', description: 'Lightweight web framework for building APIs' },
    { name: 'TensorFlow', category: 'AI/ML', description: 'Open-source machine learning framework' },
    { name: 'MobileNetV2', category: 'AI/ML', description: 'Pre-trained CNN model for image classification' },
    { name: 'scikit-learn', category: 'AI/ML', description: 'Machine learning library for Python' },
    { name: 'SQLite', category: 'Database', description: 'Lightweight, serverless database engine' },
    { name: 'Docker', category: 'DevOps', description: 'Containerization platform for deployment' },
  ];

  const features = [
    {
      title: 'Image Classification',
      description: 'Advanced computer vision using CNN models to classify waste items from images',
      icon: <AIIcon />,
      benefits: [
        'High accuracy classification (92%+)',
        'Real-time processing',
        'Support for multiple image formats',
        'Mobile-optimized models'
      ]
    },
    {
      title: 'Text Classification',
      description: 'Natural language processing to classify waste items from text descriptions',
      icon: <CodeIcon />,
      benefits: [
        'Keyword-based classification',
        'Fallback mechanisms',
        'Easy to extend and improve',
        'Fast response times'
      ]
    },
    {
      title: 'Sustainability Scoring',
      description: 'Environmental impact assessment and eco-friendly disposal recommendations',
      icon: <RecyclingIcon />,
      benefits: [
        'Comprehensive environmental metrics',
        'Actionable disposal tips',
        'Category-specific guidance',
        'Educational content'
      ]
    },
    {
      title: 'Analytics Dashboard',
      description: 'Data visualization and insights for waste management trends',
      icon: <TrendingIcon />,
      benefits: [
        'Interactive charts and graphs',
        'Historical data tracking',
        'Category distribution analysis',
        'Environmental impact metrics'
      ]
    }
  ];

  const projectGoals = [
    'Reduce improper waste disposal through AI-powered classification',
    'Educate users about sustainable waste management practices',
    'Provide data-driven insights for waste reduction strategies',
    'Support environmental conservation efforts',
    'Make waste classification accessible to everyone'
  ];

  const futurePlans = [
    'Mobile app development for iOS and Android',
    'Integration with smart waste bins and IoT devices',
    'Advanced machine learning models with larger datasets',
    'Multi-language support for global accessibility',
    'Community features and user contributions',
    'API for third-party integrations',
    'Real-time waste tracking and notifications',
    'Blockchain-based waste management verification'
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <RecyclingIcon sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom>
          About EcoSortAI
        </Typography>
      </Box>
      <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
        Empowering sustainable waste management through artificial intelligence
      </Typography>

      {/* Mission Statement */}
      <Paper sx={{ p: 4, mb: 6, background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 50%, #CDDC39 100%)', color: 'white' }}>
        <Box textAlign="center">
          <RecyclingIcon sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
            Our Mission
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 800, mx: 'auto' }}>
            To revolutionize waste management by making AI-powered classification accessible to everyone, 
            helping individuals and organizations make informed decisions that benefit our planet.
          </Typography>
        </Box>
      </Paper>

      {/* Project Overview */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ mr: 1, color: 'primary.main' }} />
                What is EcoSortAI?
              </Typography>
              <Typography variant="body1" paragraph>
                EcoSortAI is an intelligent waste classification system that combines computer vision and natural language processing 
                to help users properly categorize waste items. Our AI models can analyze images and text descriptions to determine 
                whether items are biodegradable, recyclable, or hazardous.
              </Typography>
              <Typography variant="body1" paragraph>
                The system provides sustainability scores, detailed disposal recommendations, and comprehensive analytics to help 
                users understand their waste generation patterns and make more environmentally conscious decisions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                Why It Matters
              </Typography>
              <Typography variant="body1" paragraph>
                Proper waste segregation is crucial for environmental sustainability. When waste is incorrectly disposed of, 
                it can lead to pollution, resource waste, and increased greenhouse gas emissions.
              </Typography>
              <Typography variant="body1" paragraph>
                By making waste classification easy and accurate, EcoSortAI helps reduce environmental impact, 
                promotes recycling, and supports circular economy principles. Every correctly classified item 
                contributes to a cleaner, more sustainable future.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Features */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          Key Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ mr: 2, color: 'primary.main' }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" component="h3">
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {feature.description}
                  </Typography>
                  <List dense>
                    {feature.benefits.map((benefit, idx) => (
                      <ListItem key={idx} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={benefit} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Technology Stack */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          Technology Stack
        </Typography>
        <Grid container spacing={2}>
          {technologies.map((tech, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Chip
                label={tech.name}
                variant="outlined"
                sx={{
                  width: '100%',
                  height: 'auto',
                  '& .MuiChip-label': {
                    display: 'block',
                    whiteSpace: 'normal',
                    textAlign: 'center',
                    py: 1,
                  },
                }}
              />
              <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 1, color: 'text.secondary' }}>
                {tech.category}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Project Goals */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          Project Goals
        </Typography>
        <Card>
          <CardContent>
            <List>
              {projectGoals.map((goal, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={goal} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>

      {/* Future Plans */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          Future Development Plans
        </Typography>
        <Grid container spacing={3}>
          {futurePlans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {plan}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          Frequently Asked Questions
        </Typography>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">How accurate is the AI classification?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Our image classification model achieves approximately 92% accuracy on test data. The text classification model 
              uses a combination of machine learning and keyword matching to provide reliable results. We continuously improve 
              our models with more training data.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Is my data secure and private?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Yes, we prioritize data privacy and security. Images and text are processed for classification but not permanently 
              stored. We use secure protocols and follow best practices for data protection. Your privacy is our priority.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Can I use this for commercial purposes?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              EcoSortAI is open-source and available under the MIT License. You can use it for commercial purposes, 
              modify it, and distribute it. We encourage contributions and collaboration to improve the system.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">How can I contribute to the project?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              We welcome contributions! You can help by reporting bugs, suggesting features, improving documentation, 
              or contributing code. Visit our GitHub repository to get started. Every contribution helps make EcoSortAI better.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Contact and Links */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Get Involved
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Join us in building a more sustainable future through intelligent waste management.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Chip
            icon={<GitHubIcon />}
            label="View on GitHub"
            variant="outlined"
            sx={{ mr: 2, mb: 2 }}
            clickable
          />
          <Chip
            icon={<GroupIcon />}
            label="Join Community"
            variant="outlined"
            sx={{ mr: 2, mb: 2 }}
            clickable
          />
          <Chip
            icon={<CodeIcon />}
            label="Contribute"
            variant="outlined"
            sx={{ mb: 2 }}
            clickable
          />
        </Box>
      </Box>
    </Container>
  );
};

export default About;
