'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import Grid from '@mui/material/Grid';

import { CreateEquipmentService } from 'api/services';
import DatePickerComponent from 'components/CustomComponents/DatePickerComponent';
import dayjs from 'dayjs';
import DateTimePickerComponent from 'components/CustomComponents/DateTimePickerComponent';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function CreateEquipment() {
  const router = useRouter();
  const [selectStatus, setSelectStatus] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    equipment_type: '',
    status: '',
    availability_date: '',
    location: '',
    date_time: ''
  });

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
      const result = await CreateEquipmentService(formData);
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
      <MainCard title="Create Equipment">
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

          <Grid item xs={12} md={6}>
            <DateTimePickerComponent
              label="Date Time"
              value={dayjs(formData.date_time)}
              onChange={handleDateTimeChange}
              fullWidth
              required
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
                Create
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
    </Box>
  );
}
