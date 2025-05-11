'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import { UpdateOrganizationService } from 'api/services/OrganizationService';
import PhoneInputField from 'components/phone/PhoneInputField';
import Grid from '@mui/material/Grid';
import { GetCompanyService, UpdateCompanyService } from 'api/services';
type Organization = {
  id: number;
  name: string;
  industry: string;
  address: string;
  website: string;
  email: string;
  phone: string;
  tax_id: string
};

export default function EditCompanyPage() {
  const params = useParams();
  const router = useRouter();
  const id =  Number(params.id);

  console.log("id", (id));
  

  const [editedOrg, setEditedOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    email: '',
    phone: '',
    industry: '',
    address: '',
    website: '',
    tax_id: ''
  });

  useEffect(() => {
    if (id) {
      GetCompanyService(id)
        .then((companydata: any) => {
          setEditedOrg(companydata);
          setFormData({
            id: companydata?.id,
            name: companydata?.name,
            industry: companydata?.industry,
            address: companydata?.address,
            website: companydata?.website,
            tax_id: companydata?.tax_id,
            email: companydata?.email,
            phone: companydata?.phone
          });
        })
        .catch((err) => {
          console.error('Failed to fetch companies:', err);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editedOrg) return;
    try {
      const updatedOrg = { ...editedOrg, ...formData };
      await UpdateCompanyService(updatedOrg);
      router.back();
    } catch (error) {
      console.error('Failed to update company:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!editedOrg) return null;

  return (
    <Box sx={{ padding: 2 }}>
      <MainCard title="Edit Company">
        <TextField name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth margin="normal" />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField fullWidth name="email" label="Email" value={formData.email} onChange={handleChange} margin="normal" />
          </Grid>
          <Grid item xs={6}>
            <PhoneInputField
              label="Mobile Number*"
              value={formData.phone}
              onChange={(value) => handleChange({ target: { name: 'phone', value } })}
              defaultCountry="IN"
            />
          </Grid>
        </Grid>

      
        <TextField
          name="industry"
          label="Industry Name"
          value={formData.industry}
          onChange={handleChange}
          fullWidth
          margin="normal"
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

        <TextField name="tax_id" label="Tax ID" value={formData.tax_id} onChange={handleChange} fullWidth margin="normal" />

        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleBack}>
            Back
          </Button>
        </Stack>
      </MainCard>
    </Box>
  );
}
