import {
    Avatar,
    Button,
    Checkbox,
    DialogActions,
    FormControlLabel,
    Paper,
    Tab,
    TableBody,
    Tabs
} from "@mui/material";
import { Box } from "@mui/material";
import { TableCell, TableHead, TableRow } from "@mui/material";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Chip,
    Divider,
    Stack,
    TableContainer,
    TextField,
    Typography,
    Table
} from "@mui/material";
import { GetAllCrewService, GetAllUserService } from "api/services";
import { CreateWorkOrderCrewService } from "api/services/WorkOrderCrew";
import MainCard from "components/MainCard";
import { useEffect, useState } from "react";

interface Staff {
    id: number;
    user_id?: number;
    first_name: string;
    last_name: string;
    user_type: string;
    phone: string;
    email: string;
    avatar_url?: string;
}

interface CrewMember {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface Crew {
    id: number;
    name: string;
    members?: Staff[];
    leader?: CrewMember;
}

interface WorkOrder {
    id: string;
    name: string;
}

interface WorkOrderAssignFormProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    row: WorkOrder;
}

export default function WorkOrderAssignForm({ open, setOpen, row }: WorkOrderAssignFormProps) {
    const [searchText, setSearchText] = useState<string>('');
    const [selectedId, setSelectedId] = useState<number | null>(null); // Changed to single selection
    const [isLoader, setIsLoader] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [staffData, setStaffData] = useState<Staff[]>([]);
    const [crewData, setCrewData] = useState<Crew[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                if (activeTab === 0) {
                    const response = await GetAllUserService({ user_type: "TECHNICIAN" });
                    setStaffData(Array.isArray(response) ? response : []);
                } else {
                    const response = await GetAllCrewService();
                    setCrewData(Array.isArray(response) ? response : []);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
                if (activeTab === 0) {
                    setStaffData([]);
                } else {
                    setCrewData([]);
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (open) {
            fetchData();
        }
    }, [activeTab, open]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        setSelectedId(null); // Reset selection when changing tabs
        setSearchText('');
    };

    const filteredData = activeTab === 0
        ? staffData.filter(staff =>
            `${staff.first_name} ${staff.last_name}`.toLowerCase().includes(searchText.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchText.toLowerCase()) ||
            staff.phone.includes(searchText))
        : crewData.filter(crew =>
            crew.name.toLowerCase().includes(searchText.toLowerCase()));

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleCheckBox = (id: number) => {
        setSelectedId(prevId => prevId === id ? null : id); // Toggle selection
    };

    const handleSubmit = async () => {
        if (selectedId === null) return;

        setIsLoader(true);
        try {
            const payload = {
                work_order_id: row.id,
                assignee: {
                    id: selectedId,
                }
            };

            const result = await CreateWorkOrderCrewService(id)

            // Replace with your actual API call
            // const response = await yourAssignmentApiCall(payload);

            setOpen(false);
            setSelectedId(null);
        } catch (error) {
            console.error('Assignment error:', error);
        } finally {
            setIsLoader(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedId(null);
        setSearchText('');
    };

    return (
        <Dialog open={open} fullWidth maxWidth="xl">
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h3">Assign Work Order</Typography>
                    <Chip label={row.name} color="primary" />
                </Stack>
            </DialogTitle>
            <Divider />

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Technicians" />
                    <Tab label="Crews" />
                </Tabs>
            </Box>

            <DialogContent>
                <MainCard>
                    <Stack sx={{ marginBottom: '10px' }} direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                        <TextField
                            label={`Search ${activeTab === 0 ? 'Technicians' : 'Crews'}`}
                            variant="outlined"
                            value={searchText}
                            onChange={handleSearchChange}
                        />
                    </Stack>

                    {isLoading ? (
                        <Box display="flex" justifyContent="center" p={4}>
                            <Typography>Loading...</Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table aria-label="assignment table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>{activeTab === 0 ? 'Technician' : 'Crew'}</TableCell>
                                        <TableCell>{activeTab === 0 ? 'Contact' : 'Leader'}</TableCell>
                                        <TableCell>Select</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData.length > 0 ? (
                                        activeTab === 0 ? (
                                            filteredData.map((staff, index) => (
                                                <TableRow key={staff.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Avatar src={staff.avatar_url}>
                                                                {staff.first_name.charAt(0)}{staff.last_name.charAt(0)}
                                                            </Avatar>
                                                            <Stack>
                                                                <Typography variant="subtitle1">
                                                                    {staff.first_name} {staff.last_name}
                                                                </Typography>
                                                                <Typography variant="caption" color="textSecondary">
                                                                    {staff.user_type}
                                                                </Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <Typography variant="body1">{staff.email}</Typography>
                                                            <Typography variant="subtitle1">{staff.phone}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedId === staff.id}
                                                            onChange={() => handleCheckBox(staff.id)}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            filteredData.map((crew, index) => (
                                                <TableRow key={crew.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Avatar>{crew.name.charAt(0)}</Avatar>
                                                            <Typography variant="subtitle1">{crew.name}</Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell>
                                                        {crew.users ? (
                                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                                <Typography variant="body1">
                                                                    {crew.users.first_name} {crew.users.last_name}
                                                                </Typography>
                                                                <Typography variant="subtitle1">
                                                                    {crew.users.email}
                                                                </Typography>
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="body1">No leader assigned</Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedId === crew.id}
                                                            onChange={() => handleCheckBox(crew.id)}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                <Typography variant="body1">No {activeTab === 0 ? 'technicians' : 'crews'} found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </MainCard>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    size="medium"
                    disabled={isLoader || selectedId === null}
                >
                    {isLoader ? 'Assigning...' : 'Assign'}
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setSelectedId(null)}
                    size="medium"
                    disabled={selectedId === null}
                >
                    Reset
                </Button>
                <Button variant="contained" onClick={handleClose} color="error" size="medium">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}