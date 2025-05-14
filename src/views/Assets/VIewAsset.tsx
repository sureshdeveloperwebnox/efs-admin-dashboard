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
import { GetAssetService } from 'api/services';
import { FaCalendarAlt, FaIdCard } from 'react-icons/fa';
import { MdProductionQuantityLimits } from 'react-icons/md';
import dayjs from 'dayjs';

export default function ViewAsset() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = params.id;

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const assetRows = await GetAssetService(Number(id));
        setData(assetRows);
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAssets();
    }
  }, [id]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  console.log('data', data);

  if (!data) {
    return <Typography>No assets data found</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <BackButton />

        <MainCard title="Asset Details">
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography variant="button">Asset Name :</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{data?.asset_name || '-'}</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="button">Serial Number :</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="primary" variant="subtitle1" sx={{ textWrap: 'nowrap' }}>
                          {data?.serial_number || ''}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="button">Model :</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="primary" variant="subtitle1" sx={{ textWrap: 'nowrap' }}>
                          {data?.model || ''}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="button">Manufacturer :</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" sx={{ textWrap: 'nowrap' }}>
                          {data?.manufacturer || ''}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="button">Location :</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" sx={{ textWrap: 'nowrap' }}>
                          {data?.location || ''}
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
                          Notes :
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{data?.notes || '-'}</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="button">Purchase Date :</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" sx={{ textWrap: 'nowrap' }}>
                          {dayjs(data?.purchase_date).isValid() ? dayjs(data.purchase_date).format('DD-MM-YYYY') : ''}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="button">Warranty Expiry Date :</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" sx={{ textWrap: 'nowrap' }}>
                          {dayjs(data?.warranty_expiry).isValid() ? dayjs(data.warranty_expiry).format('DD-MM-YYYY') : ''}
                        </Typography>
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
        <MainCard title="Customers Details">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <Stack spacing={0.5} alignItems="center">
                <Avatar
                  src={data?.customers?.first_name}
                  alt={data?.customers?.first_name || 'Customer Avatar'}
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
                        <Typography variant="subtitle1">{data?.customers?.first_name}</Typography>
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
                        <Typography variant="subtitle1">{data?.customers?.last_name}</Typography>
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
                        <Typography variant="subtitle1">{data?.customers?.phone}</Typography>
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
                        <Typography variant="subtitle1">{data?.customers?.email || '-'}</Typography>
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
