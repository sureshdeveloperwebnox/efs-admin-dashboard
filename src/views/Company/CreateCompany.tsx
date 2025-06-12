'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import { CreateCompanyService } from 'api/services';
import PhoneInputField from 'components/phone/PhoneInputField';
import Grid from '@mui/material/Grid';
import { MenuItem } from '@mui/material';

import { IndustryTypes } from "utils/constants/INDUSTRY_TYPES"
import { Autocomplete } from '@mui/material';



export default function CreateCompany() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    industry: '',
    website: '',
    tax_id: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    console.log("CurrentValue>>>", formData);
  };

  const handleSave = async () => {
    try {
      const result = await CreateCompanyService(formData);

      console.log("company result", result);

      router.back();
    } catch (error) {
      console.error('Failed to create company:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Box sx={{ padding: 2 }}>
      <MainCard title="Create Company">
        <TextField name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth margin="normal" />
        <TextField fullWidth name="email" label="Email" value={formData.email} onChange={handleChange} margin="normal" />
        <PhoneInputField
          label="Mobile Number*"
          value={formData.phone}
          onChange={(value) => handleChange({ target: { name: 'phone', value } } as any)}
          defaultCountry="IN"
        />


        <Autocomplete
          options={IndustryTypes}
          value={formData.industry || null}
          onChange={(event, newValue: string | null) =>
            setFormData((prev) => ({ ...prev, industry: newValue || '' }))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Industry Name"
              margin="normal"
              fullWidth
            />
          )}
          filterSelectedOptions
          autoHighlight
          disableClearable
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


        <TextField name="website" label="Website" value={formData.website} onChange={handleChange} fullWidth margin="normal" />


        <TextField
          name="tax_id"
          label="Tax ID"
          value={formData.tax_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
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