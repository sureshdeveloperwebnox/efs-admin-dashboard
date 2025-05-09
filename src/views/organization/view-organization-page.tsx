'use client';

import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import { useParams } from 'next/navigation';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import { GetOrganizationService } from 'api/services/OrganizationService';
import Avatar from '@mui/material/Avatar';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import BackButton from 'components/CustomComponents/BackButton';

type OrganizationData = {
  name?: string;
  industry_name?: string;
  email?: string;
  phone?: string;
  pincode?: string;
  plan_type?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  address?: string;
  website?: string;
};

export default function OrganizationViewPage({}: OrganizationData) {
  const params = useParams();
  const [data, setData] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(true);

  const organizationId = params.id;

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const organizationRows = await GetOrganizationService(Number(organizationId));
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
    return <Typography>No organization data found</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <BackButton />
      <Grid item xs={12} md={12}>
        <MainCard title="Organization Details">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Stack spacing={0.5} alignItems="center">
                <Avatar
                  src={data?.name}
                  alt={data?.name || 'Organization Avatar'}
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
                        <Typography variant="subtitle1">{data?.industry_name || '-'}</Typography>
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
                          Pincode:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{data?.pincode || '-'}</Typography>
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
                          Plan Type:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{data?.plan_type || '-'}</Typography>
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
                          Subscription Start Date:
                        </Typography>
                      </TableCell>
                      <TableCell>
                      {data?.subscription_start_date ? new Date(data?.subscription_start_date).toLocaleDateString() : 'No start date'}
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
                          Subscription End Date:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">
                          {data?.subscription_end_date ? new Date(data?.subscription_end_date).toLocaleDateString() : 'No end date'}
                        </Typography>{' '}
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
                        <Typography variant="subtitle1">
                          {data?.address}
                        </Typography>{' '}
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
                        <Typography variant="subtitle1">
                          {data?.website}
                        </Typography>{' '}
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
