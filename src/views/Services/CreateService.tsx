'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import { CreateServiceService } from 'api/services';
import Grid from '@mui/material/Grid';
import MultiTextInput from 'components/CustomComponents/MultiTextInput';

export default function CreateService() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    required_skills: [] as string[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update formData when requiredSkills change
  useEffect(() => {
    setFormData(prev => ({ ...prev, required_skills: requiredSkills }));
  }, [requiredSkills]);

  const validateForm = () => {
    const { name, duration, price } = formData;
    if (!name || !duration || !price) {
      alert('Please fill in all required fields');
      return false;
    }
    if (isNaN(Number(duration)) || isNaN(Number(price))) {
      alert('Duration and Price must be valid numbers');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Convert string numbers to actual numbers before sending
      const payload = {
        ...formData,
        duration: Number(formData.duration),
        price: Number(formData.price)
      };
      
      console.log('payload', payload);
      const result = await CreateServiceService(payload);
      if (result?.data) {
        router.back();
      }
    } catch (error) {
      console.error('Failed to create service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="right" spacing={2} mt={2} padding={2}>
        <Button variant="contained" onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Create'}
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleBack}>
          Back
        </Button>
      </Stack>
      <MainCard title="Create Service">
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