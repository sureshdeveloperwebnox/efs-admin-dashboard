'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import { GetAllUserService, GetAllCrewService, CreateCrewMemberService, GetCrewMemberService, UpdateCrewMemberService } from 'api/services';
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
       const params = useParams();
        const id = Number(params.id);
    const [crewData, setCrewData] = useState<User[]>([]);
    const [selectedCrew, setSelectedCrew] = useState<User | null>(null);
    const [userData, setUserData] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCrewLoading, setIsCrewLoading] = useState(false);

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
                const response = await GetAllUserService({ user_type: "TECHNICIAN" });
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


    // Get Crew Member

    // Fetch Crew Data
    useEffect(() => {
        if (id) {
            const fetchService = async () => {
                try {
                    setIsCrewLoading(true);
                    const data = await GetCrewMemberService(id);
                    if (!data) {
                        alert('Crew not found');
                        router.back();
                        return;
                    }
                    setFormData({
                        id: data?.id || '',
                        role: data?.role || '',
                        user_id: data?.user_id || '',
                        crew_id: data?.crew_id || ''
                    });

                    // Find the corresponding user in userData
                    if (data?.user_id && userData.length > 0) {
                        const user = userData.find(user => user.id === data.user_id);
                        setSelectedUser(user || null);
                    }

                       if (data?.crew_id && crewData.length > 0) {
                        const crew = crewData.find(user => user.id === data.crew_id);
                        setSelectedCrew(crew || null);
                    }
                } catch (error) {
                    console.error('Failed to fetch crew:', error);
                    router.back();
                } finally {
                    setIsCrewLoading(false);
                }
            };
            fetchService();
        }
    }, [id, router, userData]); // Added userData to dependencies


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
            const result = await UpdateCrewMemberService(formData);
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
            <MainCard title="Edit Crew Member">
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
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={isCrewLoading}
                    >
                        {isCrewLoading ? 'Updating...' : 'Update'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleBack}
                        disabled={isCrewLoading}
                    >
                        Back
                    </Button>
                </Stack>
            </MainCard>
        </Box>
    );
}
