'use client';

import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import { useParams } from 'next/navigation';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import BackButton from 'components/CustomComponents/BackButton';
import { GetCrewService } from 'api/services'; // Replace with your actual API function
import NoDataLottieComponent from 'components/CustomComponents/NoDataLottie';

interface users {
    name: string;
    email: string;
    phone: string;
}

interface Crew{
    name: string;
    email?: string;
    users: users
}

export default function ViewCrew() {
  const params = useParams();
  const [data, setData] = useState<Crew | null>(null);
  const [loading, setLoading] = useState(true);

  const id = params.id;

  useEffect(() => {
    const fetchCrew = async () => {
      try {
        setLoading(true);
        const crewData = await GetCrewService(Number(id)) as Crew; // Replace with your fetch logic
        setData(crewData);
      } catch (error) {
        console.error('Failed to fetch crew:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCrew();
    }
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!data) return (
    <NoDataLottieComponent />
  )

  return (
    <Grid container spacing={3}>
      <BackButton />
      <Grid item xs={12}>
        <MainCard title="Crew Details">
          <Grid container spacing={2} alignItems="center">
        
            <Grid item xs={12} md={8}>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body">Crew Name:</Typography>
                      </TableCell>
                       <TableCell>
                        <Typography variant="subtitle1">{data.name}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body">Leader Name:</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{data.users?.name}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body">Leader Email:</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{data?.users?.email}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body">Leader Phone:</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{data?.users?.phone}</Typography>
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
