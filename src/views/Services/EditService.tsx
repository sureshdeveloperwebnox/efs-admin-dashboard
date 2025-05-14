'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MainCard from 'components/MainCard';
import { GetServiceService, UpdateServiceService } from 'api/services';
import MultiTextInput from 'components/CustomComponents/MultiTextInput'; // Make sure this component exists

export default function EditService() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    required_skills: [] as string[]
  });

  // Fetch Service Data
  useEffect(() => {
    if (id) {
      const fetchService = async () => {
        try {
          setIsLoading(true);
          const data = await GetServiceService(id);
          if (!data) {
            alert('Service not found');
            router.back();
            return;
          }

          setFormData({
            name: data?.name || '',
            description: data?.description || '',
            duration: data?.duration || '',
            price: data?.price || '',
            required_skills: data?.required_skills || []
          });
          setRequiredSkills(data?.required_skills || []);
        } catch (error) {
          console.error('Failed to fetch service:', error);
          alert('Failed to fetch service data');
          router.back();
        } finally {
          setIsLoading(false);
        }
      };
      fetchService();
    }
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, duration, price } = formData;
    if (!name || !duration || !price) {
      alert('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await UpdateServiceService({
        ...formData,
        required_skills: requiredSkills,
        id: id,
      });
      if (result?.data) {
        router.back();
      }
    } catch (error) {
      console.error('Failed to update service:', error);
      alert('Failed to update service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Stack direction="row" justifyContent="right" spacing={2} mt={2} padding={2}>
        <Button variant="contained" onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleBack}>
          Back
        </Button>
      </Stack>
      <MainCard title="Edit Service">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField name="name" label="Service Name" value={formData.name} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                type="number"
                name="duration" 
                label="Duration" 
                value={formData.duration} 
                onChange={handleChange} 
                fullWidth 
                required 
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                type="number"
                name="price" 
                label="Price" 
                value={formData.price} 
                onChange={handleChange} 
                fullWidth
                required
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12}>
              <MultiTextInput
                label="Required Skills"
                values={requiredSkills}
                onChange={setRequiredSkills}
                maxItems={10}
              />
            </Grid>
          </Grid>
        </form>
      </MainCard>
    </Box>
  );
}