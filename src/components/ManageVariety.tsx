import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Rating,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { CropVariety } from '../types';

const ManageVariety: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variety, setVariety] = useState<CropVariety>({
    id: '',
    cropName: '',
    varietyName: '',
    expectedYield: 0,
    estimatedHarvestDate: new Date().toISOString().split('T')[0],
    healthRating: 0,
  });

  useEffect(() => {
  const fetchVariety = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/varieties/${id}`);
      setVariety(response.data);
    } catch (err) {
      setError('Failed to fetch variety details');
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchVariety();
  }
}, [id]);

const fetchVariety = useCallback(async () => {
  try {
    setLoading(true);
    const response = await axios.get(`/api/varieties/${id}`);
    setVariety(response.data);
  } catch (err) {
    setError('Failed to fetch variety details');
  } finally {
    setLoading(false);
  }
}, [id]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await axios.put(`/api/varieties/${id}`, variety);
      } else {
        await axios.post('/api/varieties', variety);
      }
      navigate('/');
    } catch (err) {
      setError('Failed to save variety');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      setLoading(true);
      await axios.delete(`/api/varieties/${id}`);
      navigate('/');
    } catch (err) {
      setError('Failed to delete variety');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: 'linear-gradient(to right, #f5f5f5, #ffffff)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={() => navigate('/')}
            sx={{ 
              mr: 2,
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(46, 125, 50, 0.08)',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ 
            fontWeight: 600,
            background: 'linear-gradient(45deg, #2e7d32 30%, #66bb6a 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {id ? 'Edit Variety' : 'Add New Variety'}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Crop Name"
                value={variety.cropName}
                onChange={(e) => setVariety({ ...variety, cropName: e.target.value })}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Variety Name"
                value={variety.varietyName}
                onChange={(e) => setVariety({ ...variety, varietyName: e.target.value })}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expected Yield (%)"
                type="number"
                value={variety.expectedYield}
                onChange={(e) => setVariety({ ...variety, expectedYield: Number(e.target.value) })}
                required
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estimated Harvest Date"
                type="date"
                value={variety.estimatedHarvestDate}
                onChange={(e) => setVariety({ ...variety, estimatedHarvestDate: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Health Rating
                </Typography>
                <Rating
                  value={variety.healthRating}
                  onChange={(_, value) => setVariety({ ...variety, healthRating: value || 0 })}
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: 'primary.main',
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ 
            mt: 4, 
            display: 'flex', 
            justifyContent: 'flex-end',
            gap: 2,
          }}>
            {id && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
                startIcon={<DeleteIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                  },
                }}
              >
                Delete
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                py: 1,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Save
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ManageVariety; 
