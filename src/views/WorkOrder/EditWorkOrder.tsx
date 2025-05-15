'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import {
    GetAllAssetByIDService,
    GetAllCompanyService,
    GetAllCustomerByIDService,
    GetAllServiceByIDService,
    GetWorkOrderService,
    UpdateWorkOrderService
} from 'api/services';
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
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { DeleteTwoTone } from '@ant-design/icons';



export default function EditWorkOrder() {
    const params = useParams();
    const id = Number(params.id);

    const router = useRouter();
    const [customerData, setCustomerData] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [assetData, setAssetData] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectStatus, setSelectStatus] = useState('');
    const [selectPriorityStatus, setSelectPriorityStatus] = useState('');
    const [companyData, setCompanyData] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [serviceData, setServiceData] = useState([]);
    const [selectedService, setSelectedService] = useState(null);

    const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

    const [formData, setFormData] = useState({
        title: '',
        company_id: '',
        customer_id: '',
        asset_id: '',
        description: '',
        priority: '',
        status: '',
        scheduled_start_date: dayjs().toISOString(),
        scheduled_end_date: dayjs().toISOString(),
        actual_start_date: dayjs().toISOString(),
        actual_end_date: dayjs().toISOString(),
        estimated_cost: 0,
        actual_cost: 0,
        address: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        services: [],
        tasks: [],
        assets: [],
    });

    const WorkOrderStatus = ['DRAFT', 'OPEN', 'SCHEDULED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'];
    const PriorityStatus = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    const WorkOrderTaskStatus = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'];

    // Fetch Customers
    useEffect(() => {
        const fetchCustomers = async () => {
            if (!organization_id) return;
            try {
                setIsLoading(true);
                const response = await GetAllCustomerByIDService({ organization_id: organization_id });
                const customers = response
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

    // Fetch Companies
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setIsLoading(true);
                const response = await GetAllCompanyService();
                const companies = Array.isArray(response) ? response : [];
                setCompanyData(companies);
            } catch (error) {
                console.error('Failed to fetch companies:', error);
                setCompanyData([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    // Fetch Assets
    useEffect(() => {
        const fetchAssets = async () => {
            try {
                setIsLoading(true);
                const response = await GetAllAssetByIDService({ organization_id: organization_id });
                const assets = Array.isArray(response) ? response.map(asset => ({
                    ...asset,
                    id: asset.id // Convert to string for consistency
                })) : [];
                setAssetData(assets);
            } catch (error) {
                console.error('Failed to fetch assets:', error);
                setAssetData([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAssets();
    }, [organization_id]);

    // Fetch Services
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setIsLoading(true);
                const response = await GetAllServiceByIDService({ organization_id: organization_id });
                const services = Array.isArray(response) ? response.map(service => ({
                    ...service,
                    id: service.id // Convert to string for consistency
                })) : [];
                setServiceData(services);

                console.log("services", services);
                
            } catch (error) {
                console.error('Failed to fetch services:', error);
                setServiceData([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
    }, [organization_id]);

    // Fetch Work Order
    useEffect(() => {
        if (id) {
            const fetchWorkOrder = async () => {
                try {
                    setIsLoading(true);
                    const data = await GetWorkOrderService(id);
                    if (!data) {
                        alert('Work Order not found');
                        router.back();
                        return;
                    }

                    // Convert numeric IDs to strings for form compatibility
                    const formattedData = {
                        id: id,
                        title: data.title || '',
                        company_id: data.company_id?.toString() || '',
                        customer_id: data.customer_id?.toString() || '',
                        asset_id: data.asset_id?.toString() || '',
                        description: data.description || '',
                        priority: data.priority || '',
                        status: data.status || '',
                        scheduled_start_date: data.scheduled_start_date || dayjs().toISOString(),
                        scheduled_end_date: data.scheduled_end_date || dayjs().toISOString(),
                        actual_start_date: data.actual_start_date || dayjs().toISOString(),
                        actual_end_date: data.actual_end_date || dayjs().toISOString(),
                        estimated_cost: data.estimated_cost || 0,
                        actual_cost: data.actual_cost || 0,
                        address: data.address || '',
                        city: data.city || '',
                        state: data.state || '',
                        country: data.country || '',
                        postal_code: data.postal_code || '',
                        services: data.services?.map((service: any) => ({
                            service_id: service.service_id || '',
                            quantity: service.quantity || '',
                            service_cost: service.service_cost || ''
                        })) || [],
                        tasks: data.tasks?.map((task: any) => ({
                            task_name: task.task_name || '',
                            task_description: task.task_description || '',
                            assigned_to: task.assigned_to || '',
                            status: task.status || '',
                            due_date: task || ''
                        })) || [],
                        assets: data.assets?.map((asset: any) => ({
                            asset_id: asset.asset_id || '',
                            quantity: asset.quantity || ''

                        })) || []
                    };

                    setFormData(formattedData);
                    setSelectStatus(data.status || '');
                    setSelectPriorityStatus(data.priority || '');

                    // Set selected customer if customer_id exists
                    if (data.customer_id) {
                        const customers = await GetAllCustomerByIDService({ organization_id: organization_id });
                        const customer = customers.find((c) => c.id === data.customer_id.toString());
                        if (customer) setSelectedCustomer(customer);
                    }

                    // Set selected company if company_id exists
                    if (data.company_id) {
                        const companies = await GetAllCompanyService();
                        const company = companies.find((c) => c.id === data.company_id.toString());
                        if (company) setSelectedCompany(company);
                    }

                    // Set selected asset if asset_id exists
                    if (data.asset_id) {
                        const assets = await GetAllAssetByIDService({ organization_id: organization_id });
                        const asset = assets.find((a) => a.id.toString() === data.asset_id.toString());
                        if (asset) setSelectedAsset(asset);
                    }
                } catch (err) {
                    console.error('Failed to fetch work order:', err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchWorkOrder();
        }
    }, [id, router]);

    const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
        if (place?.geometry?.location && place.formatted_address) {
            const address = place.formatted_address;
            setFormData((prev) => ({
                ...prev,
                address: address
            }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCustomerChange = (event: any, newValue:null) => {
        setSelectedCustomer(newValue);
        setFormData((prev) => ({
            ...prev,
            customer_id: newValue?.id || ''
        }));
    };

    const handleCompanyChange = (event: any, newValue: null) => {
        setSelectedCompany(newValue);
        setFormData((prev) => ({
            ...prev,
            company_id: newValue?.id || ''
        }));
    };

    const handleAssetChange = (event: any, newValue: null) => {
        setSelectedAsset(newValue);
        setFormData((prev) => ({
            ...prev,
            asset_id: newValue?.id?.toString() || ''
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

    const handlePriorityStatusChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        setSelectPriorityStatus(value);
        setFormData((prev) => ({
            ...prev,
            priority: value
        }));
    };

    const handleWorkOrderTaskStatusChange = (event: SelectChangeEvent, index: number) => {
        const value = event.target.value;
        const updatedTasks = [...formData.tasks];
        updatedTasks[index].status = value;
        setFormData({ ...formData, tasks: updatedTasks });
    };

    const handleScheduledStartDateChange = (date: Dayjs | null) => {
        setFormData((prev) => ({
            ...prev,
            scheduled_start_date: date ? date.toISOString() : dayjs().toISOString()
        }));
    };

    const handleScheduledEndDateChange = (date: Dayjs | null) => {
        setFormData((prev) => ({
            ...prev,
            scheduled_end_date: date ? date.toISOString() : dayjs().toISOString()
        }));
    };

    const handleActualStartDateChange = (date: Dayjs | null) => {
        setFormData((prev) => ({
            ...prev,
            actual_start_date: date ? date.toISOString() : dayjs().toISOString()
        }));
    };

    const handleActualEndDateChange = (date: Dayjs | null) => {
        setFormData((prev) => ({
            ...prev,
            actual_end_date: date ? date.toISOString() : dayjs().toISOString()
        }));
    };

    const handleTaskDueDateChange = (date: Dayjs | null, index: number) => {
        const updatedTasks = [...formData.tasks];
        updatedTasks[index].due_date = date ? date.toISOString() : '';
        setFormData({ ...formData, tasks: updatedTasks });
    };

    const handleServiceCardFieldChange = (index: number, field: any, value: string | number) => {
        const updatedServices = [...formData.services];
        updatedServices[index] = {
            ...updatedServices[index],
            [field]: value
        };
        setFormData({ ...formData, services: updatedServices });
    };

    const handleTaskCardFieldChange = (index: number, field: any, value: string) => {
        const updatedTasks = [...formData.tasks];
        updatedTasks[index] = {
            ...updatedTasks[index],
            [field]: value
        };
        setFormData({ ...formData, tasks: updatedTasks });
    };

    const handleAssetCardFieldChange = (index: number, field: any, value: string | number) => {
        const updatedAssets = [...formData.assets];
        updatedAssets[index] = {
            ...updatedAssets[index],
            [field]: value
        };
        setFormData({ ...formData, assets: updatedAssets });
    };

    // Service Card
    const handleAddMoreService = () => {
        setFormData((prevData) => ({
            ...prevData,
            services: [...prevData.services, { service_id: '', quantity: 1, service_cost: 0 }]
        }));
    };

    const handleRemoveServiceCard = (index: number) => {
        setFormData((prevData) => ({
            ...prevData,
            services: prevData.services.filter((_, i) => i !== index)
        }));
    };

    // Task Card
    const handleAddMoreTask = () => {
        setFormData((prevData) => ({
            ...prevData,
            tasks: [...prevData.tasks, { task_name: '', task_description: '', status: '', due_date: '' }]
        }));
    };

    const handleRemoveTaskCard = (index: number) => {
        setFormData((prevData) => ({
            ...prevData,
            tasks: prevData.tasks.filter((_, i) => i !== index)
        }));
    };

    // Asset Card
    const handleAddMoreAsset = () => {
        setFormData((prevData) => ({
            ...prevData,
            assets: [...prevData.assets, { asset_id: '', quantity: 1 }]
        }));
    };

    const handleRemoveAssetCard = (index: number) => {
        setFormData((prevData) => ({
            ...prevData,
            assets: prevData.assets.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const { title, customer_id, asset_id, status } = formData;
        if (!title || !customer_id || !asset_id || !status) {
            alert('Please fill in all required fields');
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const workOrderData = {
                ...formData,
                id: id
            };
            const result = await UpdateWorkOrderService(workOrderData);
            if (result) {
                router.back();
            }
        } catch (error) {
            console.error('Failed to update work order:', error);
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
            <MainCard title="Edit Work Order">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField name="title" label="Title" value={formData.title} onChange={handleChange} fullWidth required />
                        </Grid>

                        <Grid item xs={6}>
                            <Autocomplete
                                disablePortal
                                options={companyData}
                                getOptionLabel={(option) => option.name}
                                value={selectedCompany}
                                onChange={handleCompanyChange}
                                loading={isLoading}
                                renderInput={(params) => <TextField {...params} label="Company" placeholder="Select a company" />}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <Autocomplete
                                disablePortal
                                options={customerData}
                                getOptionLabel={(option) => option.first_name}
                                value={selectedCustomer}
                                onChange={handleCustomerChange}
                                loading={isLoading}
                                renderInput={(params) => <TextField {...params} label="Customer" placeholder="Select a customer" fullWidth required />}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Autocomplete
                                disablePortal
                                options={assetData}
                                getOptionLabel={(option) => option.asset_name}
                                value={selectedAsset}
                                onChange={handleAssetChange}
                                loading={isLoading}
                                renderInput={(params) => <TextField {...params} label="Asset" placeholder="Select a asset" fullWidth required />}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                name="description"
                                label="Description"
                                value={formData.description}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={2}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth required>
                                <InputLabel id="priority-label">Priority</InputLabel>
                                <Select labelId="priority-label" value={selectPriorityStatus} label="Priority" onChange={handlePriorityStatusChange}>
                                    {PriorityStatus.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth required>
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select labelId="status-label" value={selectStatus} label="Status" onChange={handleStatusChange}>
                                    {WorkOrderStatus.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <DatePickerComponent
                                label="Schedule Start Date"
                                value={dayjs(formData.scheduled_start_date)}
                                onChange={handleScheduledStartDateChange}
                                disablePast
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <DatePickerComponent
                                label="Schedule End Date"
                                value={dayjs(formData.scheduled_end_date)}
                                onChange={handleScheduledEndDateChange}
                                disablePast
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <DatePickerComponent
                                label="Order Start Date"
                                value={dayjs(formData.actual_start_date)}
                                onChange={handleActualStartDateChange}
                                disablePast
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <DatePickerComponent
                                label="Order End Date"
                                value={dayjs(formData.actual_end_date)}
                                onChange={handleActualEndDateChange}
                                disablePast
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                type="number"
                                name="estimated_cost"
                                label="Estimated cost"
                                value={formData.estimated_cost}
                                onChange={handleChange}
                                fullWidth
                                inputProps={{ min: 0 }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                type="number"
                                name="actual_cost"
                                label="Actual cost"
                                value={formData.actual_cost}
                                onChange={handleChange}
                                fullWidth
                                inputProps={{ min: 0 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
                                <LocationSearchInput onPlaceSelected={handlePlaceSelect} />
                            </LoadScript>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField name="city" label="City" value={formData.city} onChange={handleChange} fullWidth />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField name="state" label="State" value={formData.state} onChange={handleChange} fullWidth />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField name="country" label="Country" value={formData.country} onChange={handleChange} fullWidth />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField name="postal_code" label="Postal code" value={formData.postal_code} onChange={handleChange} fullWidth />
                        </Grid>

                        <Grid item xs={12} sm={12} lg={12}>
                            <MainCard title="Service Details">
                                <Stack spacing={3}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width={30}>#</TableCell>
                                                <TableCell>Service</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Service Cost</TableCell>
                                                <TableCell width={30}></TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {formData.services.map((card, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>
                                                        <Autocomplete
                                                            disablePortal
                                                            options={serviceData}
                                                            getOptionLabel={(option) => option.name}
                                                            value={serviceData.find(service => service.id == card.service_id) || null}
                                                            onChange={(e, newValue) => handleServiceCardFieldChange(index, 'service_id', newValue?.id || '')}
                                                            loading={isLoading}
                                                            renderInput={(params) => <TextField {...params} label="Service" placeholder="Select a service" />}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            name="quantity"
                                                            placeholder="Quantity"
                                                            fullWidth
                                                            value={card.quantity}
                                                            onChange={(e) => handleServiceCardFieldChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                                            inputProps={{ min: 1 }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            name="service_cost"
                                                            placeholder="Service Cost"
                                                            fullWidth
                                                            value={card.service_cost}
                                                            onChange={(e) => handleServiceCardFieldChange(index, 'service_cost', parseFloat(e.target.value) || 0)}
                                                            inputProps={{ min: 0, step: "0.01" }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton onClick={() => handleRemoveServiceCard(index)} size="medium">
                                                            <DeleteTwoTone />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <Button sx={{ ml: 2, mt: 2 }} onClick={handleAddMoreService} variant="dashed">
                                        + Add More Service
                                    </Button>
                                </Stack>
                            </MainCard>
                        </Grid>

                        <Grid item xs={12} sm={12} lg={12}>
                            <MainCard title="Task Details">
                                <Stack spacing={3}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width={30}>#</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Description</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Due Date</TableCell>
                                                <TableCell width={30}></TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {formData.tasks.map((card, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            name="task_name"
                                                            placeholder="Task Name"
                                                            fullWidth
                                                            value={card.task_name}
                                                            onChange={(e) => handleTaskCardFieldChange(index, 'task_name', e.target.value)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            name="task_description"
                                                            placeholder="Description"
                                                            fullWidth
                                                            value={card.task_description}
                                                            onChange={(e) => handleTaskCardFieldChange(index, 'task_description', e.target.value)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <FormControl fullWidth>
                                                            <InputLabel id={`task-status-label-${index}`}>Status</InputLabel>
                                                            <Select
                                                                labelId={`task-status-label-${index}`}
                                                                value={card.status}
                                                                label="Status"
                                                                onChange={(e) => handleWorkOrderTaskStatusChange(e, index)}
                                                            >
                                                                {WorkOrderTaskStatus.map((status) => (
                                                                    <MenuItem key={status} value={status}>
                                                                        {status}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </TableCell>
                                                    <TableCell>
                                                        <DatePickerComponent
                                                            label="Due Date"
                                                            value={card.due_date ? dayjs(card.due_date) : null}
                                                            onChange={(date) => handleTaskDueDateChange(date, index)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton onClick={() => handleRemoveTaskCard(index)} size="medium">
                                                            <DeleteTwoTone />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <Button sx={{ ml: 2, mt: 2 }} onClick={handleAddMoreTask} variant="dashed">
                                        + Add More Task
                                    </Button>
                                </Stack>
                            </MainCard>
                        </Grid>

                        <Grid item xs={12} sm={12} lg={12}>
                            <MainCard title="Asset Details">
                                <Stack spacing={3}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width={30}>#</TableCell>
                                                <TableCell>Asset</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell width={30}></TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {formData.assets.map((card, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>
                                                        <Autocomplete
                                                            disablePortal
                                                            options={assetData}
                                                            getOptionLabel={(option) => option.asset_name}
                                                            value={assetData.find(asset => asset.id == card.asset_id) || null}
                                                            onChange={(e, newValue) => handleAssetCardFieldChange(index, 'asset_id', newValue?.id || '')}
                                                            loading={isLoading}
                                                            renderInput={(params) => <TextField {...params} label="Asset" placeholder="Select an asset" />}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            name="quantity"
                                                            placeholder="Quantity"
                                                            fullWidth
                                                            value={card.quantity}
                                                            onChange={(e) => handleAssetCardFieldChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                                            inputProps={{ min: 1 }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton onClick={() => handleRemoveAssetCard(index)} size="medium">
                                                            <DeleteTwoTone />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <Button sx={{ ml: 2, mt: 2 }} onClick={handleAddMoreAsset} variant="dashed">
                                        + Add More Asset
                                    </Button>
                                </Stack>
                            </MainCard>
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </Box>
    );
}