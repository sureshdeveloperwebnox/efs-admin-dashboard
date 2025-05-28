'use client';

import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import { useParams } from 'next/navigation';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import BackButton from 'components/CustomComponents/BackButton';
import { GetWorkOrderService } from 'api/services';
import dayjs from 'dayjs';
import { Chip, TableHead } from '@mui/material';
import {
    FaFileAlt,
    FaCalendarAlt,
    FaCalendarCheck,
    FaDollarSign,
    FaMapMarkerAlt,
    FaFlag,
    FaExclamation
} from 'react-icons/fa';

export default function ViewWorkOrder() {
    const params = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const id = params.id;

    useEffect(() => {
        const fetchWorkOrder = async () => {
            try {
                setLoading(true);
                const workOrderRows = await GetWorkOrderService(Number(id));
                setData(workOrderRows);
            } catch (error) {
                console.error('Failed to fetch workorder:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchWorkOrder();
        }
    }, [id]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    console.log('data', data);

    if (!data) {
        return <Typography>No orders data found</Typography>;
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
                <BackButton />


                <MainCard title="Work Order Details">
                    <Grid container spacing={2}>
                        {/* Left Column */}
                        <Grid item xs={12} md={6}>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '60%' }}>
                                                <FaFileAlt size={16} />
                                                <Typography variant="button">Work Order Name</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">{data?.title || '-'}</Typography>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FaFlag size={16} />
                                                <Typography variant="button">Status</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography color="primary" variant="subtitle1">
                                                    {<Chip label={data?.status} />}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FaExclamation size={16} />
                                                <Typography variant="button">Priority</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography color="primary" variant="subtitle1">
                                                    {<Chip label={data?.priority} />}

                                                </Typography>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FaCalendarAlt size={16} />
                                                <Typography variant="button">Scheduled Start</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography color="info" variant="subtitle1">
                                                    {dayjs(data?.scheduled_start_date).format('DD-MM-YYYY') || '-'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FaCalendarAlt size={16} />
                                                <Typography variant="button">Scheduled End</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography color="info" variant="subtitle1">
                                                    {dayjs(data?.scheduled_end_date).format('DD-MM-YYYY') || '-'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>


                                        <TableRow>
                                            <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FaCalendarCheck size={16} />
                                                <Typography variant="button">Actual Start</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography color="success" variant="subtitle1">
                                                    {dayjs(data?.actual_start_date).format('DD-MM-YYYY') || '-'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FaCalendarCheck size={16} />
                                                <Typography variant="button">Actual End</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography color="success" variant="subtitle1">
                                                    {dayjs(data?.actual_end_date).format('DD-MM-YYYY') || '-'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>

                        {/* Right Column */}
                        <Grid item xs={12} md={6}>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FaDollarSign size={16} />
                                                <Typography variant="button">Estimated Cost</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">
                                                    {data?.estimated_cost || '-'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FaDollarSign size={16} />
                                                <Typography variant="button">Actual Cost</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">
                                                    {data?.actual_cost || '-'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FaMapMarkerAlt size={16} />
                                                <Typography variant="button">Address</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">{data?.address || '-'}</Typography>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FaMapMarkerAlt size={16} />
                                                <Typography variant="button">State</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">{data?.state || '-'}</Typography>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FaMapMarkerAlt size={16} />
                                                <Typography variant="button">City</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">{data?.city || '-'}</Typography>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FaMapMarkerAlt size={16} />
                                                <Typography variant="button">Postal Code</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">{data?.postal_code || '-'}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>

            <Grid item xs={12} md={6}>
                <MainCard title="Organization Details">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <Stack spacing={0.5} alignItems="center">
                                <Avatar
                                    src={data?.organization?.name}
                                    alt={data?.organization?.name || 'Organization Avatar'}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <Typography
                                                    variant="body"
                                                    sx={{
                                                        textWrap: 'nowrap'
                                                    }}
                                                >
                                                    Organization Name:
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">{data?.organization?.name}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <Typography
                                                    variant="body"
                                                    sx={{
                                                        textWrap: 'nowrap'
                                                    }}
                                                >
                                                    Phone:
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">{data?.organization?.phone}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <Typography
                                                    variant="body"
                                                    sx={{
                                                        textWrap: 'nowrap'
                                                    }}
                                                >
                                                    Email:
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">{data?.organization?.email || '-'}</Typography>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                <Typography
                                                    variant="body"
                                                    sx={{
                                                        textWrap: 'nowrap'
                                                    }}
                                                >
                                                    Website:
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">{data?.organization?.website || '-'}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>

            <Grid item xs={12} md={6}>
                <MainCard title="Customers Details">
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <Stack spacing={0.5} alignItems="center">
                                <Avatar
                                    src={data?.customer?.first_name}
                                    alt={data?.customer?.first_name || 'Customer Avatar'}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={9}>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <Typography
                                                    variant="body"
                                                    sx={{
                                                        textWrap: 'nowrap'
                                                    }}
                                                >
                                                    First Name:
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">{data?.customer?.first_name}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <Typography
                                                    variant="body"
                                                    sx={{
                                                        textWrap: 'nowrap'
                                                    }}
                                                >
                                                    Last Name:
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">{data?.customer?.last_name}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <Typography
                                                    variant="body"
                                                    sx={{
                                                        textWrap: 'nowrap'
                                                    }}
                                                >
                                                    Phone:
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">{data?.customer?.phone}</Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <Typography
                                                    variant="body"
                                                    sx={{
                                                        textWrap: 'nowrap'
                                                    }}
                                                >
                                                    Email:
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">{data?.customer?.email || '-'}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
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
                                {data?.tasks.map((task, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            {task.task_name}
                                        </TableCell>
                                        <TableCell>
                                            {task?.task_description}
                                        </TableCell>
                                        <TableCell>
                                            {task?.status}
                                        </TableCell>
                                        <TableCell>
                                            {dayjs(task?.due_date).format('DD-MM-YYYY')}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Stack>
                </MainCard>
            </Grid>


            <Grid item xs={12} sm={12} lg={12}>
                <MainCard title="Service Details">
                    <Stack spacing={3}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell width={30}>#</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Duration</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell width={30}></TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {data?.services?.map((service, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            {service.name}
                                        </TableCell>
                                        <TableCell>
                                            {service?.description}
                                        </TableCell>
                                        <TableCell>
                                            {service?.duration}
                                        </TableCell>
                                        <TableCell>
                                            {service?.price}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Stack>
                </MainCard>
            </Grid>


            <Grid item xs={12} sm={12} lg={12}>
                <MainCard title="Assets Details">
                    <Stack spacing={3}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell width={30}>#</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Serial Number</TableCell>
                                    <TableCell>Model</TableCell>
                                    <TableCell>status</TableCell>
                                    <TableCell width={30}></TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {data?.assets?.map((asset, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            {asset.asset_name}
                                        </TableCell>
                                        <TableCell>
                                            {asset?.serial_number}
                                        </TableCell>
                                        <TableCell>
                                            {asset?.model}
                                        </TableCell>
                                        <TableCell>
                                            {asset?.status}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Stack>
                </MainCard>
            </Grid>
            {(data?.crew) && (
                <Grid item xs={12} sm={12} lg={12}>
                    <MainCard title="Crew Details">
                        <Stack spacing={3}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={30}>#</TableCell>
                                        <TableCell>Crew Name</TableCell>
                                        <TableCell>Assigned Date</TableCell>
                                        <TableCell>Leader Name</TableCell>
                                        <TableCell>Leader Email</TableCell>
                                        <TableCell width={30}></TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {data?.crew?.map((crew, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                {crew.name}
                                            </TableCell>
                                            <TableCell>
                                                {dayjs(crew?.assigned_at).format('DD-MM-YYYY')}
                                            </TableCell>
                                            <TableCell>
                                                {crew?.leader_first_name + crew?.leader_last_name}
                                            </TableCell>
                                            <TableCell>
                                                {crew?.leader_email}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Stack>
                    </MainCard>
                </Grid>
            )}

            {(data?.technicians) && (
                <Grid item xs={12} sm={12} lg={12}>
                    <MainCard title="Technician Details">
                        <Stack spacing={3}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={30}>#</TableCell>
                                        <TableCell>Technician Name</TableCell>
                                        <TableCell>Technician Email</TableCell>
                                        <TableCell>Technician Phone</TableCell>
                                        <TableCell width={30}></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{"#"}</TableCell>
                                        <TableCell>
                                            {data?.technicians?.first_name + data?.technicians?.last_name}
                                        </TableCell>
                                        <TableCell>
                                            {data?.technicians?.email}
                                        </TableCell>
                                        <TableCell>
                                            {data?.technicians?.phone}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Stack>
                    </MainCard>
                </Grid>
            )}

        </Grid>
    );
}
