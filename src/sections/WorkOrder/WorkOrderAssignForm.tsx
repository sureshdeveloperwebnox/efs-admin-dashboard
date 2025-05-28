import {
    Avatar,
    Button,
    Checkbox,
    DialogActions,
    Paper,
    Tab,
    TableBody,
    Tabs,
    Box,
    TableCell,
    TableHead,
    TableRow,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    TableContainer,
    TextField,
    Typography,
    Table,
    Grid
} from "@mui/material";
import { AssignWorkOrderToTechnician, GetAllCrewService, GetAllUserService } from "api/services";
import { CreateWorkOrderCrewService } from "api/services/WorkOrderCrew";
import MainCard from "components/MainCard";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import DatePickerComponent from "components/CustomComponents/DatePickerComponent";

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
    users?: CrewMember;
}

interface WorkOrderCrew {
    id: number;
    work_order_id: number;
    crew_id: number;
    assigned_at: string;
    created_at: string;
    updated_at: string;
}

interface WorkOrder {
    id: string;
    name: string;
    assigned_to: number | null;
    assigned_crew_id: number | null;
    crews: WorkOrderCrew[];
}

interface WorkOrderAssignFormProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    row: WorkOrder;
}

export default function WorkOrderAssignForm({ open, setOpen, row }: WorkOrderAssignFormProps) {
    const [searchText, setSearchText] = useState<string>('');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isLoader, setIsLoader] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [staffData, setStaffData] = useState<Staff[]>([]);
    const [crewData, setCrewData] = useState<Crew[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [workOrderDate, setWorkOrderDate] = useState<string>('');

    const handleWorkOrderDateChange = (date: Dayjs | null) => {
        setWorkOrderDate(date ? date.toISOString() : '');
    };

    useEffect(() => {
        if (open) {
            // Set initial selection based on existing assignment
            if (activeTab === 0 && row.assigned_to) {
                setSelectedId(row.assigned_to);
            } else if (activeTab === 1 && row.assigned_crew_id) {
                setSelectedId(row.assigned_crew_id);
            } else {
                setSelectedId(null);
            }

            // Set initial date from existing crew assignment if available
            if (row.crews?.length > 0) {
                setWorkOrderDate(row.crews[0].assigned_at);
            }
        }
    }, [open, activeTab, row.assigned_to, row.assigned_crew_id, row.crews]);

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
        setSelectedId(prevId => prevId === id ? null : id);
    };

    const isChecked = (id: number) => {
        if (selectedId !== null) {
            return selectedId == id;
        }
        if (activeTab == 0) {
            return row.assigned_to == id;
        } else {
            return row.assigned_crew_id == id || row.crews?.some(crew => crew.crew_id == id);
        }
    };

    const handleSubmit = async () => {
        if (selectedId === null) return;

        setIsLoader(true);

        try {
            const payload = {
                work_order_id: row.id,
                assigned_at: workOrderDate || new Date().toISOString(),
                [activeTab === 0 ? 'assigned_to' : 'crew_id']: selectedId,
            };

            if (activeTab === 0) {
                await AssignWorkOrderToTechnician(payload);
            } else {
                await CreateWorkOrderCrewService(payload);
            }
            setOpen(false);
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
                    <Grid item xs={2}>
                        <DatePickerComponent
                            label="Assign Date"
                            value={dayjs(workOrderDate || row.crews?.[0]?.assigned_at || new Date())}
                            onChange={handleWorkOrderDateChange}
                        />
                    </Grid>
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
                                                            checked={isChecked(staff.id)}
                                                            onChange={() => handleCheckBox(staff.id)}
                                                            color="primary"
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
                                                            checked={isChecked(crew.id)}
                                                            onChange={() => handleCheckBox(crew.id)}
                                                            color="primary"
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
    );
}