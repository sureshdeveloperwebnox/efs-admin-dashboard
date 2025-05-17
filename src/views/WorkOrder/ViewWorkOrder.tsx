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
import { GetAssetService, GetWorkOrderService } from 'api/services';
import dayjs from 'dayjs';
import { TableHead } from '@mui/material';

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
                        <Grid item xs={12} md={12}>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="button">Work Order Name :</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">{data?.title || '-'}</Typography>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="button">Status :</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography color="primary" variant="subtitle1" sx={{ textWrap: 'nowrap' }}>
                                                    {data?.status || ''}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>



                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="button">Priority :</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography color="primary" variant="subtitle1" sx={{ textWrap: 'nowrap' }}>
                                                    {data?.priority || ''}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>




                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="button">Scheduled Start Date :</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography color="info" variant="subtitle1" sx={{ textWrap: 'nowrap' }}>
                                                    {dayjs(data?.scheduled_start_date).format('DD-MM-YYYY') || ''}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="button">Scheduled End Date :</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography color="info" variant="subtitle1" sx={{ textWrap: 'nowrap' }}>
                                                    {dayjs(data?.scheduled_end_date).format('DD-MM-YYYY') || ''}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>


                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="button">Work Order Start Date :</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography color="success" variant="subtitle1" sx={{ textWrap: 'nowrap' }}>
                                                    {dayjs(data?.actual_start_date).format('DD-MM-YYYY') || ''}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>


                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="button">Work Order End Date :</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography color="success" variant="subtitle1" sx={{ textWrap: 'nowrap' }}>
                                                    {dayjs(data?.actual_end_date).format('DD-MM-YYYY') || ''}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>


                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="button">Estimated Cost :</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1" sx={{ textWrap: 'nowrap' }}>
                                                    {data?.estimated_cost || ''}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="button">Actual Cost :</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1" sx={{ textWrap: 'nowrap' }}>
                                                    {data?.actual_cost || ''}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        textWrap: 'nowrap'
                                                    }}
                                                >
                                                    Address :
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">{data?.address || '-'}</Typography>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        textWrap: 'nowrap'
                                                    }}
                                                >
                                                    State :
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">{data?.state || '-'}</Typography>
                                            </TableCell>
                                        </TableRow>


                                        <TableRow>
                                            <TableCell>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        textWrap: 'nowrap'
                                                    }}
                                                >
                                                    City :
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">{data?.city || '-'}</Typography>
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        textWrap: 'nowrap'
                                                    }}
                                                >
                                                    Postal Code :
                                                </Typography>
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
        </Grid>
    );
}
