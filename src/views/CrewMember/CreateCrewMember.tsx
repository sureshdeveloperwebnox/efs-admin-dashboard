'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import { GetAllUserService, GetAllCrewService, CreateCrewMemberService } from 'api/services';
import Grid from '@mui/material/Grid';
import { Autocomplete } from '@mui/material';

interface User {
    id: string;
    name: string;
}

interface Crew {
    id: string;
    name: string;
}

interface CrewMember {
    role: string;
    crew_id: string;
    user_id: string;
}

export default function CreateCrewMember() {
    const router = useRouter();
    const [crewData, setCrewData] = useState<User[]>([]);
    const [selectedCrew, setSelectedCrew] = useState<User | null>(null);
    const [userData, setUserData] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<CrewMember>({
        role: '',
        crew_id: '',
        user_id: ''
    });


    // Get User name
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const response = await GetAllUserService({ user_type: "STAFF" });
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

    // Get Crew name
    useEffect(() => {
        const fetchCrews = async () => {
            try {
                setIsLoading(true);
                const response = await GetAllCrewService();
                // Ensure the response is an array of Crew objects
                const crews: Crew[] = Array.isArray(response) ? response : [];
                setCrewData(crews);
            } catch (error) {
                console.error('Failed to fetch crews:', error);
                setCrewData([]); // Set empty array on error
            } finally {
                setIsLoading(false);
            }
        };
        fetchCrews();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUserChange = (event: any, newValue: User | null) => {
        setSelectedUser(newValue);
        setFormData((prev) => ({
            ...prev,
            user_id: newValue?.id || ''
        }));
    };

    
    const handleCrewChange = (event: any, newValue: User | null) => {
        setSelectedCrew(newValue);
        setFormData((prev) => ({
            ...prev,
            crew_id: newValue?.id || ''
        }));
    };



    const handleSave = async () => {
        try {
            const result = await CreateCrewMemberService(formData);
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
            <MainCard title="Create Crew Member">
                <Grid container spacing={2}>

                    {/* Select Crew  */}
                    <Grid item xs={12}>
                        <Autocomplete
                            disablePortal
                            options={crewData}
                            getOptionLabel={(option) => option.name}
                            value={selectedCrew}
                            onChange={handleCrewChange}
                            loading={isLoading}
                            renderInput={(params) => <TextField {...params} label="Crew" placeholder="Select a crew" />}
                        />
                    </Grid>


                    <Grid item xs={12}>
                        <Autocomplete
                            disablePortal
                            options={userData}
                            getOptionLabel={(option) => option.name}
                            value={selectedUser}
                            onChange={handleUserChange}
                            loading={isLoading}
                            renderInput={(params) => <TextField {...params} label="Technician" placeholder="Select a technician" />}
                        />
                    </Grid>


                    <Grid item xs={12}>
                        <TextField name="role" label="Role Name" value={formData.role} onChange={handleChange} fullWidth margin="normal" />
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
