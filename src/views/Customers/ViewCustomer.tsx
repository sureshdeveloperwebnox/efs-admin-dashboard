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
import { GetCompanyService, GetCustomerService } from 'api/services';

export default function ViewCustomer() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = params.id;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const customerRows = await GetCustomerService(Number(id));
        setData(customerRows);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomers();
    }
  }, [id]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  console.log('data', data);

  if (!data) {
    return <Typography>No customer data found</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <BackButton />
      <Grid item xs={12} md={12}>
        <MainCard title="Customer Details">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Stack spacing={0.5} alignItems="center">
                <Avatar
                  src={data?.first_name}
                  alt={data?.first_name || 'Customer Avatar'}
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <Stack spacing={0.2} alignItems="center">
                  <Typography variant="h5">{data?.first_name + data?.last_name || 'No name available'}</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={8}>
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
                        <Typography variant="subtitle1">{data?.first_name || '-'}</Typography>
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
                        <Typography variant="subtitle1">{data?.last_name || '-'}</Typography>
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
                        <Typography variant="subtitle1">{data?.email || '-'}</Typography>
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
                        <Typography variant="subtitle1">{data?.phone || '-'}</Typography>
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
                          Address:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{data?.address}</Typography>{' '}
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
                          Job Title:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{data?.users?.job_title}</Typography>{' '}
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
                  src={data?.organizations?.name}
                  alt={data?.organizations?.name || 'Organization Avatar'}
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
                        <Typography variant="subtitle1">{data?.organizations?.name}</Typography>
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
                        <Typography variant="subtitle1">{data?.organizations?.phone}</Typography>
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
                        <Typography variant="subtitle1">{data?.organizations?.email || '-'}</Typography>
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
                        <Typography variant="subtitle1">{data?.organizations?.website || '-'}</Typography>
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
        <MainCard title="Company Details">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <Stack spacing={0.5} alignItems="center">
                <Avatar
                  src={data?.companies?.name}
                  alt={data?.companies?.name || 'Organization Avatar'}
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
                          Company Name:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{data?.companies?.name}</Typography>
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
                        <Typography variant="subtitle1">{data?.companies?.phone}</Typography>
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
                        <Typography variant="subtitle1">{data?.companies?.email || '-'}</Typography>
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
                        <Typography variant="subtitle1">{data?.companies?.website || '-'}</Typography>
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
