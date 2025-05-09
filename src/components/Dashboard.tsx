import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Slider,
  Select,
  MenuItem,
  Rating,
  IconButton,
  Button,
  Box,
  CircularProgress,
  Pagination,
  Paper,
  InputAdornment,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CropVariety, FilterOptions } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const getCardColor = (healthRating: number) => {
  switch (healthRating) {
    case 5:
      return 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)';
    case 4:
      return 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)';
    case 2:
      return 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)';
    default:
      return 'linear-gradient(135deg, #F44336 0%, #E57373 100%)';
  }
};

const DefaultCropImage = ({ letter }: { letter: string }) => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="30" cy="30" r="28" fill="rgba(255, 255, 255, 0.2)" />
    <path
      d="M30 15C22.268 15 16 21.268 16 29C16 36.732 22.268 43 30 43C37.732 43 44 36.732 44 29C44 21.268 37.732 15 30 15ZM30 17C36.627 17 42 22.373 42 29C42 35.627 36.627 41 30 41C23.373 41 18 35.627 18 29C18 22.373 23.373 17 30 17Z"
      fill="rgba(255, 255, 255, 0.8)"
    />
    <path
      d="M30 20C25.582 20 22 23.582 22 28C22 32.418 25.582 36 30 36C34.418 36 38 32.418 38 28C38 23.582 34.418 20 30 20ZM30 22C33.314 22 36 24.686 36 28C36 31.314 33.314 34 30 34C26.686 34 24 31.314 24 28C24 24.686 26.686 22 30 22Z"
      fill="rgba(255, 255, 255, 0.6)"
    />
    <text
      x="30"
      y="35"
      textAnchor="middle"
      dominantBaseline="middle"
      fill="white"
      fontSize="24"
      fontWeight="bold"
    >
      {letter}
    </text>
  </svg>
);

const getCropImage = (cropName: string) => {
  const letter = cropName.charAt(0).toUpperCase();
  return <DefaultCropImage letter={letter} />;
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [varieties, setVarieties] = useState<CropVariety[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    healthRating: null,
    minYield: 0,
    maxYield: 100,
    sortBy: 'harvest-asc'
  });

  useEffect(() => {
    fetchVarieties();
  }, []);

  const fetchVarieties = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/varieties`);
      setVarieties(response.data);
    } catch (error) {
      console.error('Error fetching varieties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this variety?')) {
      try {
        await axios.delete(`${API_URL}/api/varieties/${id}`);
        setVarieties(varieties.filter(v => v.id !== id));
      } catch (error) {
        console.error('Error deleting variety:', error);
      }
    }
  };

  const filteredVarieties = varieties
    .filter(v => {
      const matchesSearch = v.cropName.toLowerCase().includes(filters.search.toLowerCase()) ||
                          v.varietyName.toLowerCase().includes(filters.search.toLowerCase());
      const matchesHealth = filters.healthRating === null || v.healthRating === filters.healthRating;
      const matchesYield = v.expectedYield >= filters.minYield && v.expectedYield <= filters.maxYield;
      return matchesSearch && matchesHealth && matchesYield;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'yield-asc':
          return a.expectedYield - b.expectedYield;
        case 'yield-desc':
          return b.expectedYield - a.expectedYield;
        case 'harvest-asc':
          return new Date(a.estimatedHarvestDate).getTime() - new Date(b.estimatedHarvestDate).getTime();
        case 'harvest-desc':
          return new Date(b.estimatedHarvestDate).getTime() - new Date(a.estimatedHarvestDate).getTime();
        default:
          return 0;
      }
    });

  const paginatedVarieties = filteredVarieties.slice((page - 1) * 10, page * 10);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 600,
            background: 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Crop Varieties Dashboard
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/manage')}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1,
              background: 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
                background: 'linear-gradient(45deg, #F57C00 30%, #FFB300 90%)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Add New Variety
          </Button>
        </Box>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            background: 'linear-gradient(to right, #f5f5f5, #ffffff)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Filters & Search
            </Typography>
            {isMobile && (
              <IconButton 
                onClick={() => setShowFilters(!showFilters)}
                sx={{ ml: 'auto' }}
              >
                <FilterListIcon />
              </IconButton>
            )}
          </Box>
          
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#FF9800' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#FF9800',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography gutterBottom sx={{ color: 'text.secondary' }}>
                Health Rating
              </Typography>
              <Rating
                value={filters.healthRating}
                onChange={(_, value) => setFilters({ ...filters, healthRating: value })}
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: '#FFD700',
                  },
                  '& .MuiRating-iconEmpty': {
                    color: 'rgba(0, 0, 0, 0.3)',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography gutterBottom sx={{ color: 'text.secondary' }}>
                Expected Yield Range
              </Typography>
              <Slider
                value={[filters.minYield, filters.maxYield]}
                onChange={(_, value) => setFilters({
                  ...filters,
                  minYield: Array.isArray(value) ? value[0] : 0,
                  maxYield: Array.isArray(value) ? value[1] : 100
                })}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                sx={{
                  color: 'primary.main',
                  '& .MuiSlider-thumb': {
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0 0 0 8px rgba(46, 125, 50, 0.16)',
                    },
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption">{filters.minYield}%</Typography>
                <Typography variant="caption">{filters.maxYield}%</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography gutterBottom sx={{ color: 'text.secondary' }}>
                Sort By
              </Typography>
              <Select
                fullWidth
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon color="action" />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <MenuItem value="yield-asc">Yield (Low to High)</MenuItem>
                <MenuItem value="yield-desc">Yield (High to Low)</MenuItem>
                <MenuItem value="harvest-asc">Harvest Date (Early to Late)</MenuItem>
                <MenuItem value="harvest-desc">Harvest Date (Late to Early)</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Grid container spacing={3}>
        {paginatedVarieties.map((variety) => (
          <Grid item xs={12} sm={6} md={4} key={variety.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                background: getCardColor(variety.healthRating),
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3, color: 'white' }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  gap: 2,
                }}>
                  <Box
                    component="div"
                    sx={{
                      width: 60,
                      height: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      padding: 1,
                    }}
                  >
                    {getCropImage(variety.cropName)}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600,
                      color: 'white',
                    }}>
                      {variety.cropName}
                    </Typography>
                    <Typography sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}>
                      {variety.varietyName}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    Expected Yield
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    {variety.expectedYield}%
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    Harvest Date
                  </Typography>
                  <Typography sx={{ color: 'white' }}>
                    {new Date(variety.estimatedHarvestDate).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }} gutterBottom>
                    Health Rating
                  </Typography>
                  <Rating 
                    value={variety.healthRating} 
                    readOnly 
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#FFD700',
                      },
                      '& .MuiRating-iconEmpty': {
                        color: 'rgba(0, 0, 0, 0.3)',
                      },
                    }}
                  />
                </Box>
                <Box sx={{ 
                  mt: 'auto', 
                  pt: 2, 
                  display: 'flex', 
                  justifyContent: 'flex-end',
                  gap: 1,
                }}>
                  <IconButton 
                    onClick={() => navigate(`/manage/${variety.id}`)}
                    sx={{
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(variety.id)}
                    sx={{
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ 
        mt: 4, 
        display: 'flex', 
        justifyContent: 'center',
        '& .MuiPaginationItem-root': {
          borderRadius: 1,
          '&.Mui-selected': {
            backgroundColor: '#FF9800',
            color: 'white',
            '&:hover': {
              backgroundColor: '#F57C00',
            },
          },
        },
      }}>
        <Pagination
          count={Math.ceil(filteredVarieties.length / 10)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          size="large"
        />
      </Box>
    </Container>
  );
};

export default Dashboard; 