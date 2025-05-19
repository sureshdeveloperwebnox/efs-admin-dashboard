'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import Grid from '@mui/material/Grid';
import { GetEquipmentService, UpdateEquipmentService } from 'api/services/EquipmentService';

type Equipment = {
  id: number;
  name: string;
  equipment_type: string;
  description: string;
  status: string;
  availability_date: string;
  location: string;
  date_time: string; // changed from number to string for datetime-local compatibility
};

export default function EditEquipment() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [editedEquipment, setEditedEquipment] = useState<Equipment | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    equipment_type: '',
    description: '',
    status: '',
    availability_date: '',
    location: '',
    date_time: ''
  });

  useEffect(() => {
    if (id) {
      GetEquipmentService(Number(id))
        .then((data) => {
          const equipment = data as Equipment;
          setEditedEquipment(equipment);
          setFormData({
            name: equipment.name,
            equipment_type: equipment.equipment_type,
            description: equipment.description,
            status: equipment.status,
            availability_date: equipment.availability_date,
            location: equipment.location,
            date_time: equipment.date_time || ''
          });
        })
        .catch((err) => {
          console.error('Failed to fetch equipment:', err);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editedEquipment) return;
    try {
      const updatedEquipment: Equipment = { ...editedEquipment, ...formData };
      await UpdateEquipmentService(updatedEquipment);
      router.back();
    } catch (error) {
      console.error('Failed to update equipment:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!editedEquipment) return null;

  return (
    <Box sx={{ padding: 2 }}>
      <MainCard title="Edit Equipment">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField name="name" label="Name" value={formData.name} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="equipment_type" label="Equipment Type" value={formData.equipment_type} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
        </Grid>

        <TextField
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField name="status" label="Status" value={formData.status} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="availability_date"
              label="Availability Date"
              type="date"
              value={formData.availability_date}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <TextField name="location" label="Location" value={formData.location} onChange={handleChange} fullWidth margin="normal" />

        <TextField
          name="date_time"
          label="Date and Time"
          type="datetime-local"
          value={formData.date_time}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

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
