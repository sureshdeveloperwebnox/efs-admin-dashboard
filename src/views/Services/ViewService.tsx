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
import { GetServiceService } from 'api/services';
import dayjs from 'dayjs';
import Chip from '@mui/material/Chip';
export default function ViewService() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = params.id;

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const assetRows = await GetServiceService(Number(id));
        setData(assetRows);
      } catch (error) {
        console.error('Failed to fetch services:', error);
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
    return <Typography>No services data found</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <BackButton />

        <MainCard title="Service Details">
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography variant="button">Service Name :</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{data?.name || '-'}</Typography>
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
                          Description :
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{data?.description || '-'}</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="button">Duration :</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" sx={{ textWrap: 'nowrap' }}>
                          {data?.duration || ''}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="button">Price :</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" sx={{ textWrap: 'nowrap' }}>
                          {data?.price || ''}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="button">Required Skills :</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" sx={{ textWrap: 'nowrap' }}>
                          {data?.required_skills.map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              size="small"
                              variant="outlined" // 'light' is not a valid variant in MUI by default
                              color="primary"
                            />
                          ))}
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

      <Grid item xs={12} md={12}>
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

    
    </Grid>
  );
}
