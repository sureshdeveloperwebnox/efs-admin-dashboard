'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import { GetOrganizationService, UpdateOrganizationService } from 'api/services/OrganizationAPIService';
import PhoneInputField from 'components/phone/PhoneInputField';
import Grid from '@mui/material/Grid';
type Organization = {
  id: string;
  name: string;
  organization_name: string;
  industry_name: string;
  address: string;
  description: string;
  website: string;
  pincode: string;
  email: string;
  phone: string;
};

export default function EditOrganizationPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [editedOrg, setEditedOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization_name: '',
    industry_name: '',
    address: '',
    website: '',
    pincode: ''
  });

  useEffect(() => {
    if (id) {
      GetOrganizationService(Number(id))
        .then((data: Organization) => {
          setEditedOrg(data);
          setFormData({
            name: data?.name,
            organization_name: data?.organization_name,
            industry_name: data?.industry_name,
            address: data?.address,
            website: data?.website,
            pincode: data?.pincode,
            email: data?.email,
            phone: data?.phone
          });
        })
        .catch((err) => {
          console.error('Failed to fetch organization:', err);
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
      await UpdateOrganizationService(updatedOrg);
      router.back();
    } catch (error) {
      console.error('Failed to update organization:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!editedOrg) return null;

  return (
    <Box sx={{ padding: 2 }}>
      <MainCard title="Edit Organization">
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
          name="organization_name"
          label="Organization Name"
          value={formData.organization_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="industry_name"
          label="Industry Name"
          value={formData.industry_name}
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

        <TextField name="pincode" label="Pincode" value={formData.pincode} onChange={handleChange} fullWidth margin="normal" />

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
