'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import { GetAllUserService, UpdateCrewService, GetCrewService } from 'api/services';
import Grid from '@mui/material/Grid';
import { Autocomplete } from '@mui/material';

interface User {
    id: string;
    name: string;
}

interface Crew {
    id: number;
    name: string;
    leader_id: string;
}

export default function EditCrew() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);
    const [userData, setUserData] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isUserLoading, setIsUserLoading] = useState(false);
    const [isCrewLoading, setIsCrewLoading] = useState(false);

    const [formData, setFormData] = useState<Crew>({
        id: '',
        name: '',
        leader_id: ''
    });

    // Get User name
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsUserLoading(true);
                const response = await GetAllUserService({ user_type: "STAFF" });
                const users: User[] = Array.isArray(response) ? response : [];
                setUserData(users);
            } catch (error) {
                console.error('Failed to fetch users:', error);
                setUserData([]);
            } finally {
                setIsUserLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Fetch Crew Data
    useEffect(() => {
        if (id) {
            const fetchService = async () => {
                try {
                    setIsCrewLoading(true);
                    const data = await GetCrewService(id);
                    if (!data) {
                        alert('Crew not found');
                        router.back();
                        return;
                    }
                    setFormData({
                        id: data?.id || '',
                        name: data?.name || '',
                        leader_id: data?.leader_id || ''
                    });

                    // Find the corresponding user in userData
                    if (data?.leader_id && userData.length > 0) {
                        const leader = userData.find(user => user.id === data.leader_id);
                        setSelectedUser(leader || null);
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
            leader_id: newValue?.id || ''
        }));
    };

    const handleSave = async () => {
        try {
            const result = await UpdateCrewService({
                ...formData
            }); // Make sure to include id in the update
            if (result?.data) {
                router.back();
            }
        } catch (error) {
            console.error('Failed to update crew:', error);
            alert('Failed to update crew. Please try again.');
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <Box sx={{ padding: 2 }}>
            <MainCard title="Edit Crew">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            name="name"
                            label="Crew Name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            disablePortal
                            options={userData}
                            getOptionLabel={(option) => option.name}
                            value={selectedUser}
                            onChange={handleUserChange}
                            loading={isUserLoading}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Technician"
                                    placeholder="Select a technician"
                                />
                            )}
                        />
                    </Grid>
                </Grid>

                <Stack direction="row" spacing={2} mt={2}>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={isCrewLoading || isUserLoading}
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