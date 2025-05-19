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
import { GetEquipmentService } from 'api/services'; // Replace with your actual API function

export default function ViewEquipment() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = params.id;

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const equipmentData = await GetEquipmentService(Number(id)); // Replace with your fetch logic
        setData(equipmentData);
      } catch (error) {
        console.error('Failed to fetch equipment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEquipment();
    }
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!data) return <Typography>No equipment data found</Typography>;

  return (
    <Grid container spacing={3}>
      <BackButton />
      <Grid item xs={12}>
        <MainCard title="Equipment Details">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Stack spacing={0.5} alignItems="center">
                <Avatar
                  alt={data.name}
                  style={{ width: 100, height: 100, fontSize: 32, backgroundColor: '#1976d2' }}
                >
                  {data.name?.charAt(0)}
                </Avatar>
                <Typography variant="h5">{data.name}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={8}>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body">Equipment Type:</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{data.equipment_type}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body">Status:</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{data.status}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body">Location:</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{data.location}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body">Availability Date:</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">
                          {new Date(data.availability_date).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body">Created At:</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">
                          {new Date(data.created_at).toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body">Organization ID:</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{data.organization_id}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
}
