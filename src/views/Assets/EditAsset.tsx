'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import { GetAllCustomerByIDService, GetAssetService, UpdateAssetService } from 'api/services';
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
import { organization_id } from 'utils';

interface Customer {
  id: string;
  first_name: string;
  last_name?: string;
}

interface AssetFormData {
  asset_name: string;
  serial_number: string;
  model: string;
  manufacturer: string;
  status: string;
  location: string;
  notes: string;
  purchase_date: string;
  warranty_expiry: string;
  customer_id: string;
}

export default function EditAsset() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();

  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectStatus, setSelectStatus] = useState('');

  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  const [formData, setFormData] = useState<AssetFormData>({
    asset_name: '',
    serial_number: '',
    model: '',
    manufacturer: '',
    status: '',
    location: '',
    notes: '',
    purchase_date: dayjs().toISOString(),
    warranty_expiry: dayjs().toISOString(),
    customer_id: ''
  });

  const AssetStatus = ['OPERATIONAL', 'NEEDS_MAINTENANCE', 'UNDER_REPAIR', 'DECOMMISSIONED'];

  const parseCustomDate = (dateString: string): Dayjs => {
    if (!dateString) return dayjs();
    // Handle both ISO format and your custom format
    if (dateString.includes('-')) {
      const parts = dateString.split('-');
      if (parts.length === 3 && parts[2].length === 4) {
        // DD-MM-YYYY format
        return dayjs(`${parts[2]}-${parts[1]}-${parts[0]}`);
      }
    }
    return dayjs(dateString);
  };

  // Fetch Customers
  useEffect(() => {
    const fetchCustomers = async () => {
      if (!organization_id) return;
      try {
        setIsLoading(true);
        const response = await GetAllCustomerByIDService({ organization_id: organization_id });
        const customers: Customer[] = Array.isArray(response) ? response : [];
        setCustomerData(customers);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
        setCustomerData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [organization_id]);

  // Fetch Asset Data
  useEffect(() => {
    if (id) {
      const fetchAsset = async () => {
        try {
          setIsLoading(true);
          const data = await GetAssetService(id);
          if (!data) {
            alert('Asset not found');
            router.back();
            return;
          }

          setFormData({
            asset_name: data.asset_name || '',
            serial_number: data.serial_number || '',
            model: data.model || '',
            manufacturer: data.manufacturer || '',
            status: data.status || '',
            location: data.location || '',
            notes: data.notes || '',
            purchase_date: data.purchase_date || dayjs().toISOString(),
            warranty_expiry: data.warranty_expiry || dayjs().toISOString(),
            customer_id: data.customer_id?.toString() || ''
          });

          setSelectStatus(data.status || '');

          // Set selected customer if customer_id exists
          if (data.customer_id) {
            const customers = await GetAllCustomerByIDService({ organization_id: organization_id });
            const customer = customers.find((c: Customer) => c.id === data.customer_id.toString());
            if (customer) setSelectedCustomer(customer);
          }
        } catch (err) {
          console.error('Failed to fetch asset:', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAsset();
    }
  }, [id, router]);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place?.geometry?.location && place.formatted_address) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address;
      setFormData((prev) => ({
        ...prev,
        location: `${address}`
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (event: any, newValue: Customer | null) => {
    setSelectedCustomer(newValue);
    setFormData((prev) => ({
      ...prev,
      customer_id: newValue?.id || ''
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
    console.log('date', date);

    setFormData((prev) => ({
      ...prev,
      purchase_date: date ? date.toISOString() : dayjs().toISOString()
    }));
  };

  const handleExpiryDateChange = (date: Dayjs | null) => {
    setFormData((prev) => ({
      ...prev,
      warranty_expiry: date ? date.toISOString() : dayjs().toISOString()
    }));
  };

  const validateForm = () => {
    const { asset_name, serial_number, status } = formData;
    if (!asset_name || !serial_number || !status) {
      alert('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await UpdateAssetService({
        ...formData,
        id: id,
        organization_id: organization_id
      });
      if (result?.data) {
        router.back();
      }
    } catch (error) {
      console.error('Failed to update asset:', error);
      // alert('Failed to update asset. Please try again.');
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
      <MainCard title="Edit Asset">
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
                options={customerData}
                getOptionLabel={(option) => `${option.first_name} ${option.last_name || ''}`.trim()}
                value={selectedCustomer}
                onChange={handleCustomerChange}
                loading={isLoading}
                renderInput={(params) => <TextField {...params} label="Customer" placeholder="Select a customer" fullWidth required />}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField name="asset_name" label="Asset Name" value={formData.asset_name} onChange={handleChange} fullWidth required />
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
              <TextField name="manufacturer" label="Manufacturer" value={formData.manufacturer} onChange={handleChange} fullWidth />
            </Grid>

            <Grid item xs={12}>
              <TextField name="model" label="Model" value={formData.model} onChange={handleChange} fullWidth />
            </Grid>

            <Grid item xs={12}>
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
                <LocationSearchInput
                  value={formData.location}
                  onChange={(val) => setFormData((prev) => ({ ...prev, location: val }))}
                  onPlaceSelected={handlePlaceSelect}
                />
              </LoadScript>
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePickerComponent
                label="Purchase Date"
                value={parseCustomDate(formData.purchase_date)}
                onChange={handlePurchaseDateChange}
                disablePast
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePickerComponent
                label="Warranty Expiry Date"
                value={parseCustomDate(formData.warranty_expiry)}
                onChange={handleExpiryDateChange}
                disablePast
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="asset-status-label">Status</InputLabel>
                <Select labelId="asset-status-label" value={selectStatus} label="Status" onChange={handleStatusChange}>
                  {AssetStatus.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField name="notes" label="Notes" value={formData.notes} onChange={handleChange} fullWidth multiline rows={4} />
            </Grid>
          </Grid>
        </form>
      </MainCard>
    </Box>
  );
}
