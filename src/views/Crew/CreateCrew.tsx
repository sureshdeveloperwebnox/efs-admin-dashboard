'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import {  GetAllUserService, CreateCrewService } from 'api/services';
import Grid from '@mui/material/Grid';
import { Autocomplete } from '@mui/material';

interface User {
  id: string;
  name: string;
}

interface Crew{
  name: string;
  leader_id: string;
}

export default function CreateCrew() {
  const router = useRouter();
  const [userData, setUserData] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Crew>({
    name: '',
    leader_id: ''
  });



  // Get User name
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await GetAllUserService({user_type: "TECHNICIAN"});
        // Ensure the response is an array of User objects
        const users: User[] = Array.isArray(response) ? response : [];
        setUserData(users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setUserData([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserChange = (event: any, newValue: User | null) => {
    setSelectedUser(newValue);
    setFormData((prev) => ({
      ...prev,
      leader_id: newValue?.id || ''
    }));
  };



  const handleSave = async () => {
    try {
      const result = await CreateCrewService(formData);
      console.log('result>>>>', result?.status);

      if (result?.data) {
        router.back();
      }
    } catch (error) {
      console.error('Failed to create crew:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Box sx={{ padding: 2 }}>
      <MainCard title="Create Crew">
        <Grid container spacing={2}>

          <Grid item xs={12}>
            <TextField name="name" label="Crew Name" value={formData.name} onChange={handleChange} fullWidth margin="normal" />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              disablePortal
              options={userData}
              getOptionLabel={(option) => option.first_name}
              value={selectedUser}
              onChange={handleUserChange}
              loading={isLoading}
              renderInput={(params) => <TextField {...params} label="Technician" placeholder="Select a technician" />}
            />
          </Grid>
     
        </Grid>

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
