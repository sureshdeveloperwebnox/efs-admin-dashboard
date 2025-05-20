'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import Grid from '@mui/material/Grid';

import { CreateEquipmentService, GetEquipmentService, UpdateEquipmentService } from 'api/services';
import DatePickerComponent from 'components/CustomComponents/DatePickerComponent';
import dayjs from 'dayjs';
import DateTimePickerComponent from 'components/CustomComponents/DateTimePickerComponent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function EditEquipment() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const id = Number(params.id);
  const [selectStatus, setSelectStatus] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    equipment_type: '',
    status: '',
    availability_date: '',
    location: '',
    date_time: ''
  });


  // Fetch Work Order
  useEffect(() => {
    if (id) {
      const fetchWorkOrder = async () => {
        try {
          setIsLoading(true);
          const data = await GetEquipmentService(id);
          console.log("data", data);

          if (!data) {
            alert('Equipment not found');
            router.back();
            return;
          }



          // Convert numeric IDs to strings for form compatibility
          const formattedData = {
            id: id,
            name: data?.name || '',
            equipment_type: data?.equipment_type || '',
            availability_date: data?.availability_date || '',
            location: data?.location || '',
            date_time: data?.date_time || ''
          };

          setFormData(formattedData);
          setSelectStatus(data.status || '');

        } catch (err) {
          console.error('Failed to fetch equipments:', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchWorkOrder();
    }
  }, [id, router]);

  const EquipmentStatus = ['AVAILABLE', 'IN_USE', 'UNDER_MAINTENANCE', 'DAMAGED'];

  const handleAvailabilityDateChange = (date: any) => {
    setFormData((prev) => ({
      ...prev,
      availability_date: date ? date.toISOString() : ''
    }));
  };

  const handleDateTimeChange = (date: any) => {
    setFormData((prev) => ({
      ...prev,
      date_time: date ? date : ''
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const result = await UpdateEquipmentService(formData);
      console.log('result>>>>', result?.status);

      if (result?.data) {
        router.back();
      }
    } catch (error) {
      console.error('Failed to create Equipment:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Box sx={{ padding: 2 }}>
      <MainCard title="Edit Equipment">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField name="name" label="Equipment Name" value={formData.name} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField name="equipment_type" label="Equipment Type" value={formData.equipment_type} onChange={handleChange} fullWidth />
          </Grid>

          <Grid item xs={12} md={6}>
            <DatePickerComponent
              label="Availability Date"
              value={dayjs(formData.availability_date)}
              onChange={handleAvailabilityDateChange}
              required
              fullWidth
            />
          </Grid>

         

          <Grid item xs={6}>
            <TextField name="location" label="Location" value={formData.location} onChange={handleChange} fullWidth />
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth required>
              <InputLabel id="asset-status-label">Status</InputLabel>
              <Select labelId="asset-status-label" value={selectStatus} label="Status" onChange={handleStatusChange}>
                {EquipmentStatus.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" color="secondary" onClick={handleBack}>
                Back
              </Button>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
    </Box>
  );
}
