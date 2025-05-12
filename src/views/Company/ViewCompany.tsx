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
import { GetCompanyService } from 'api/services';


export default function ViewCompany() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const organizationId = params.id;

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const organizationRows = await GetCompanyService(Number(organizationId));
        setData(organizationRows);
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (organizationId) {
      fetchOrganizations();
    }
  }, [organizationId]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  console.log('data', data);

  if (!data) {
    return <Typography>No company data found</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <BackButton />
      <Grid item xs={12} md={12}>
        <MainCard title="Company Details">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Stack spacing={0.5} alignItems="center">
                <Avatar
                  src={data?.name}
                  alt={data?.name || 'Company Avatar'}
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <Stack spacing={0.2} alignItems="center">
                  <Typography variant="h5">{data?.name || 'No name available'}</Typography>
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
                          Industry Name:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{data?.industry || '-'}</Typography>
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
                          Website:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{data?.website}</Typography>{' '}
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
                          Tax ID:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{data?.tax_id || '-'}</Typography>
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
