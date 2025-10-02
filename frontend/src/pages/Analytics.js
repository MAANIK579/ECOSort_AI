import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Recycling as RecyclingIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import axios from 'axios';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('7');

  const COLORS = ['#4CAF50', '#2196F3', '#F44336'];

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  // Add a retry mechanism for failed requests
  const retryFetchAnalytics = () => {
    setError(null);
    fetchAnalytics();
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      console.log('Fetching analytics for date range:', startDate, 'to', endDate);
      
      const response = await axios.get('/analytics', {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
        timeout: 10000, // 10 second timeout
      });

      console.log('Analytics response:', response.data);
      setAnalyticsData(response.data);
    } catch (err) {
      console.error('Analytics fetch error:', err);
      const errorMessage = err.response?.data?.error || 
                          err.message || 
                          'Failed to fetch analytics data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'biodegradable':
        return '#4CAF50';
      case 'recyclable':
        return '#2196F3';
      case 'hazardous':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={retryFetchAnalytics}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Make sure the backend server is running on port 5000
        </Typography>
      </Container>
    );
  }

  if (!analyticsData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" textAlign="center">
          No analytics data available
        </Typography>
      </Container>
    );
  }

  const pieChartData = Object.entries(analyticsData.category_distribution || {}).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count,
    color: getCategoryColor(category),
  })).filter(item => item.value > 0); // Only show categories with data

  const lineChartData = (analyticsData.daily_statistics || []).map((day) => ({
    date: formatDate(day.date),
    biodegradable: day.biodegradable || 0,
    recyclable: day.recyclable || 0,
    hazardous: day.hazardous || 0,
    total: day.total || 0,
  }));

  const barChartData = [
    {
      name: 'Biodegradable',
      count: analyticsData.category_distribution.biodegradable || 0,
      color: '#4CAF50',
    },
    {
      name: 'Recyclable',
      count: analyticsData.category_distribution.recyclable || 0,
      color: '#2196F3',
    },
    {
      name: 'Hazardous',
      count: analyticsData.category_distribution.hazardous || 0,
      color: '#F44336',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <RecyclingIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Analytics Dashboard
        </Typography>
      </Box>
      <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
        Track waste generation patterns and environmental impact over time
      </Typography>

      {/* Date Range Selector */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Date Range</InputLabel>
          <Select
            value={dateRange}
            label="Date Range"
            onChange={(e) => setDateRange(e.target.value)}
          >
            <MenuItem value="7">Last 7 days</MenuItem>
            <MenuItem value="30">Last 30 days</MenuItem>
            <MenuItem value="90">Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <RecyclingIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
                {analyticsData.total_classifications}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Classifications
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="div" fontWeight="bold" color="primary.main">
                {analyticsData.category_distribution.biodegradable || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Biodegradable
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <BarChartIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" component="div" fontWeight="bold" color="info.main">
                {analyticsData.category_distribution.recyclable || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recyclable
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TimelineIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              <Typography variant="h4" component="div" fontWeight="bold" color="error.main">
                {analyticsData.category_distribution.hazardous || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hazardous
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={4}>
        {/* Category Distribution Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PieChartIcon sx={{ mr: 1 }} />
                Category Distribution
              </Typography>
              {pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                  <PieChartIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    No data available for the selected period
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Category Counts Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <BarChartIcon sx={{ mr: 1 }} />
                Category Counts
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8">
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Trends Line Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TimelineIcon sx={{ mr: 1 }} />
                Daily Trends
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="biodegradable"
                    stroke="#4CAF50"
                    strokeWidth={3}
                    name="Biodegradable"
                  />
                  <Line
                    type="monotone"
                    dataKey="recyclable"
                    stroke="#2196F3"
                    strokeWidth={3}
                    name="Recyclable"
                  />
                  <Line
                    type="monotone"
                    dataKey="hazardous"
                    stroke="#F44336"
                    strokeWidth={3}
                    name="Hazardous"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Insights Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          Key Insights
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: 'success.light', color: 'success.contrastText' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🎯 Most Common Category
                </Typography>
                <Typography variant="body1">
                  {(() => {
                    const maxCategory = Object.entries(analyticsData.category_distribution).reduce(
                      (a, b) => (a[1] > b[1] ? a : b)
                    );
                    return `${maxCategory[0].charAt(0).toUpperCase() + maxCategory[0].slice(1)} items are the most frequently classified, making up ${((maxCategory[1] / analyticsData.total_classifications) * 100).toFixed(1)}% of all classifications.`;
                  })()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: 'info.light', color: 'info.contrastText' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Classification Trends
                </Typography>
                <Typography variant="body1">
                  Over the selected period, the system processed an average of {(analyticsData.total_classifications / parseInt(dateRange)).toFixed(1)} items per day, providing valuable insights into waste generation patterns.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🌱 Environmental Impact
                </Typography>
                <Typography variant="body1">
                  The high proportion of biodegradable and recyclable items indicates good waste management practices, while proper handling of hazardous materials prevents environmental contamination.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Date Range Info */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          <CalendarIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
          Data shown for {formatDate(analyticsData.date_range.start)} to {formatDate(analyticsData.date_range.end)}
        </Typography>
      </Box>
    </Container>
  );
};

export default Analytics;
