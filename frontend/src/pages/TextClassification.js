import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  Send as SendIcon,
  TextFields as TextIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Recycling as RecyclingIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import axios from 'axios';

const TextClassification = () => {
  const [text, setText] = useState('');
  const [classification, setClassification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClassify = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/classify/text', {
        text: text.trim()
      });

      setClassification(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during classification');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setClassification(null);
    setError(null);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !loading) {
      handleClassify();
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'biodegradable':
        return 'success';
      case 'recyclable':
        return 'primary';
      case 'hazardous':
        return 'error';
      default:
        return 'default';
    }
  };

  const getSustainabilityLevel = (score) => {
    if (score >= 7) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  };

  const exampleTexts = [
    'used plastic water bottle',
    'banana peel',
    'old batteries',
    'empty glass jar',
    'coffee grounds',
    'broken electronics',
    'newspaper',
    'paint cans'
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <RecyclingIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Text Classification
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Describe a waste item in text to get instant AI-powered classification and disposal recommendations.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
                Describe Waste Item
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="e.g., used plastic water bottle, banana peel, old batteries..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TextIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleClassify}
                  disabled={loading || !text.trim()}
                  startIcon={<SendIcon />}
                  sx={{ flex: 1 }}
                >
                  {loading ? 'Classifying...' : 'Classify Text'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClear}
                  startIcon={<ClearIcon />}
                >
                  Clear
                </Button>
              </Box>

              {loading && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Analyzing text with AI...
                  </Typography>
                  <LinearProgress />
                </Box>
              )}

              {/* Example Texts */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Try these examples:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {exampleTexts.map((example, index) => (
                    <Chip
                      key={index}
                      label={example}
                      variant="outlined"
                      size="small"
                      onClick={() => setText(example)}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={6}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {classification ? (
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
                  Classification Results
                </Typography>

                {/* Input Text */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Input Text
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                    <Typography variant="body1" fontStyle="italic">
                      "{text}"
                    </Typography>
                  </Paper>
                </Box>

                {/* Category and Confidence */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Waste Category
                  </Typography>
                  <Chip
                    label={classification.category}
                    color={getCategoryColor(classification.category)}
                    size="large"
                    sx={{ fontSize: '1.1rem', px: 2, py: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Confidence: {(classification.confidence * 100).toFixed(1)}%
                  </Typography>
                </Box>

                {/* Sustainability Score */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Sustainability Score
                  </Typography>
                  <Box
                    className={`sustainability-score ${getSustainabilityLevel(classification.sustainability_score)}`}
                  >
                    {classification.sustainability_score.toFixed(1)}
                  </Box>
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
                    Environmental Impact: {classification.environmental_impact}
                  </Typography>
                </Box>

                {/* Disposal Tips */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Disposal Tips
                  </Typography>
                  <List dense>
                    {classification.disposal_tips.map((tip, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={tip} />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                {/* Environmental Benefits */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Environmental Benefits
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'success.light', color: 'success.contrastText' }}>
                    <Typography variant="body2">
                      Proper disposal of this item helps reduce environmental impact and supports sustainable waste management practices.
                    </Typography>
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <RecyclingIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Text Classified Yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enter a description to get started with AI-powered waste classification
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* How It Works Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          How Text Classification Works
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <TextIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                1. Describe Item
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Simply type or describe the waste item you want to classify in natural language.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <SearchIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                2. AI Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our advanced NLP model analyzes the text and identifies key features to determine the waste category.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <RecyclingIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                3. Get Results
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Receive instant classification results with sustainability scores and detailed disposal recommendations.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Tips Section */}
      <Box sx={{ mt: 8, backgroundColor: 'grey.50', p: 4, borderRadius: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          Tips for Better Classification
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              ✅ Do's:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Be specific about the item (e.g., 'plastic water bottle' instead of just 'bottle')" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Include material type when possible (glass, plastic, metal, paper)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Mention the condition (used, empty, broken, old)" />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              ❌ Don'ts:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <ErrorIcon color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Use vague descriptions (e.g., 'thing', 'stuff')" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ErrorIcon color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Include unnecessary details that don't relate to the item" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ErrorIcon color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Use abbreviations that might not be understood" />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default TextClassification;
