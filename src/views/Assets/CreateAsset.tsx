'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import { GetAllCompanyService, CreateAssetService } from 'api/services';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import dayjs, { Dayjs } from 'dayjs';
import LocationSearchInput from 'components/CustomComponents/LocationSearchInput';
import { LoadScript } from '@react-google-maps/api';
import DatePickerComponent from 'components/CustomComponents/DatePickerComponent';

interface Company {
  id: string;
  name: string;
}

export default function CreateAsset() {
  const router = useRouter();
  const [companyData, setCompanyData] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectStatus, setSelectStatus] = useState('');

  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  const [formData, setFormData] = useState({
    asset_name: '',
    serial_number: '',
    model: '',
    manufacturer: '',
    status: '',
    location: '',
    notes: '',
    purchase_date: dayjs().toISOString(),
    warranty_expiry: dayjs().toISOString(),
    company_id: '',
    customer_id: ''
  });

  const AssetStatus = ['OPERATIONAL', 'NEEDS_MAINTENANCE', 'UNDER_REPAIR', 'DECOMMISSIONED'];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await GetAllCompanyService();
        const companies: Company[] = Array.isArray(response) ? response : [];
        setCompanyData(companies);
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
        setCompanyData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place?.geometry?.location && place.formatted_address) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address;
      setFormData((prev) => ({
        ...prev,
        location: `${address} (${lat}, ${lng})`
      }));
    }
  };

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

  const handleStatusChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSelectStatus(value);
    setFormData((prev) => ({
      ...prev,
      status: value
    }));
  };

  const handlePurchaseDateChange = (date: Dayjs | null) => {
    setFormData((prev) => ({
      ...prev,
      purchase_date: date ? date.toISOString() : ''
    }));
  };

  const handleExpiryDateChange = (date: Dayjs | null) => {
    setFormData((prev) => ({
      ...prev,
      warranty_expiry: date ? date.toISOString() : ''
    }));
  };

  const validateForm = () => {
    const { asset_name, serial_number, status, company_id } = formData;
    if (!asset_name || !serial_number || !status || !company_id) {
      alert('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      console.log('formData', formData);
      const result = await CreateAssetService(formData);
      if (result?.data) {
        router.back();
      }
    } catch (error) {
      console.error('Failed to create asset:', error);
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
          {isLoading ? 'Saving...' : 'Create'}
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleBack}>
          Back
        </Button>
      </Stack>
      <MainCard title="Create Asset">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                disablePortal
                options={companyData}
                getOptionLabel={(option) => option.name}
                value={selectedCompany}
                onChange={handleCompanyChange}
                loading={isLoading}
                renderInput={(params) => <TextField {...params} label="Company" placeholder="Select a company" fullWidth required />}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                name="asset_name"
                label="Asset Name"
                value={formData.asset_name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="serial_number"
                label="Serial Number"
                value={formData.serial_number}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField name="model" label="Model" value={formData.model} onChange={handleChange} fullWidth />
            </Grid>

            <Grid item xs={12}>
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
                <LocationSearchInput onPlaceSelected={handlePlaceSelect} />
              </LoadScript>
            </Grid>

            <Grid item xs={12}>
              <DatePickerComponent
                label="Purchase Date"
                value={dayjs(formData.purchase_date)}
                onChange={handlePurchaseDateChange}
                disablePast
                required
              />
            </Grid>

            <Grid item xs={12}>
              <DatePickerComponent
                label="Expiry Date"
                value={dayjs(formData.warranty_expiry)}
                onChange={handleExpiryDateChange}
                disablePast
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="asset-status-label">Status</InputLabel>
                <Select
                  labelId="asset-status-label"
                  value={selectStatus}
                  label="Status"
                  onChange={handleStatusChange}
                >
                  {AssetStatus.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notes"
                value={formData.notes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </form>
      </MainCard>
    </Box>
  );
}
