import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CameraAlt as CameraIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Recycling as RecyclingIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

const ImageClassification = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [classification, setClassification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setClassification(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp']
    },
    multiple: false
  });

  const handleClassify = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('/classify/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setClassification(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during classification');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setClassification(null);
    setError(null);
    if (preview) {
      URL.revokeObjectURL(preview);
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <RecyclingIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Image Classification
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Upload an image of a waste item to get instant AI-powered classification and disposal recommendations.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Upload Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
                Upload Image
              </Typography>
              
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed',
                  borderColor: isDragActive ? 'primary.main' : 'grey.300',
                  borderRadius: 3,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: isDragActive ? 'primary.light' : 'grey.50',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.light',
                  },
                }}
              >
                <input {...getInputProps()} />
                <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  or click to select a file
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  Supports: JPEG, PNG, GIF, BMP
                </Typography>
              </Box>

              {preview && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 200,
                      borderRadius: 8,
                      objectFit: 'contain',
                    }}
                  />
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleClassify}
                      disabled={loading}
                      startIcon={<CameraIcon />}
                      sx={{ mr: 1 }}
                    >
                      {loading ? 'Classifying...' : 'Classify Image'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleClear}
                      startIcon={<DeleteIcon />}
                    >
                      Clear
                    </Button>
                  </Box>
                </Box>
              )}

              {loading && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Analyzing image with AI...
                  </Typography>
                  <LinearProgress />
                </Box>
              )}
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
                <RecyclingIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Image Classified Yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload an image to get started with AI-powered waste classification
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* How It Works Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          How Image Classification Works
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                1. Upload Image
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Simply drag and drop or click to upload an image of the waste item you want to classify.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <CameraIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                2. AI Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our advanced computer vision model analyzes the image and identifies key features to determine the waste category.
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
    </Container>
  );
};

export default ImageClassification;
