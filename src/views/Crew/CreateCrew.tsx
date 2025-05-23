'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import { GetAllCompanyService, CreateCustomerService, GetAllUserService } from 'api/services';
import PhoneInputField from 'components/phone/PhoneInputField';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import { isValidEmail } from 'utils/check.isvalid.email';

interface Company {
  id: string;
  name: string;
}

export default function CreateCrew() {
  const router = useRouter();
  const [companyData, setCompanyData] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    user_id: ''
  });



  // Get User name
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await GetAllUserService({user_type: "TECHNICIAN"});
        // Ensure the response is an array of Company objects
        const users: Company[] = Array.isArray(response) ? response : [];
        setCompanyData(users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setCompanyData([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompanyChange = (event: any, newValue: Company | null) => {
    setSelectedCompany(newValue);
    setFormData((prev) => ({
      ...prev,
      company_id: newValue?.id || ''
    }));
  };



  const handleSave = async () => {
    try {
      const result = await CreateCustomerService(formData);
      console.log('result>>>>', result?.status);

      if (result?.data) {
        router.back();
      }
    } catch (error) {
      console.error('Failed to create customer:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Box sx={{ padding: 2 }}>
      <MainCard title="Create Customer">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              disablePortal
              options={companyData}
              getOptionLabel={(option) => option.name}
              value={selectedCompany}
              onChange={handleCompanyChange}
              loading={isLoading}
              renderInput={(params) => <TextField {...params} label="Company" placeholder="Select a company" />}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField name="first_name" label="First Name" value={formData.first_name} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={6}>
            <TextField name="last_name" label="Last Name" value={formData.last_name} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          type="email"
          error={!isValidEmail(formData.email) && formData.email !== ''}
          helperText={!isValidEmail(formData.email) && formData.email !== '' ? 'Please enter a valid email address' : ''}
        />
        <PhoneInputField
          value={formData.phone}
          onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
          defaultCountry="IN"
        />

        <TextField fullWidth name="job_title" label="Job Title" value={formData.job_title} onChange={handleChange} margin="normal" />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <TextField
          name="address"
          label="Address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />

        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="contained" onClick={handleSave}>
            Create
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleBack}>
            Back
          </Button>
        </Stack>
      </MainCard>
    </Box>
  );
}
