'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { FaPlus, FaEye, FaEdit } from 'react-icons/fa';
import MainCard from 'components/MainCard';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/navigation';
import { GetAllAssetService, GetAllCustomerService, GetAllServiceService, UpdateCustomerStatusService } from 'api/services';
import Switch from '@mui/material/Switch';
import NoDataLottieComponent from 'components/CustomComponents/NoDataLottie';

type Customer = {
  id: number;
  name: string;
  description: string;
  duration?: string;
  price?: string;
  required_skills?: string;
};

function TabPanel(props: { children?: React.ReactNode; value: number; index: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function ServiceTable() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const serviceRows = await GetAllServiceService();
        setRows(serviceRows || []);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setPage(0);
  };

  const handleCreatePage = () => {
    router.push(`/services/create`);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = rows
    // .filter((row) => {
    //   if (tab === 1) return row.is_active === 1;
    //   if (tab === 2) return row.is_active === 0;
    //   return true;
    // })
    .filter((row) => row.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const currentRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <MainCard>
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h3">Services</Typography>
          <Button variant="contained" onClick={handleCreatePage} startIcon={<FaPlus />}>
            Add
          </Button>
        </Stack>

        {/* Modified section: Combined tabs and search in one row */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Tabs value={tab} onChange={handleChangeTab} aria-label="customer tabs">
            {/* <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  All
                  <Chip label={rows.length} size="small" variant="outlined" color="primary" />
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Active
                  <Chip label={rows.filter((r) => r.is_active === 1).length} size="small" variant="outlined" color="primary" />
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Inactive
                  <Chip label={rows.filter((r) => r.is_active === 0).length} size="small" variant="outlined" color="primary" />
                </Box>
              }
            /> */}
          </Tabs>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '300px' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search services..."
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </Stack>
        </Stack>

        <TabPanel value={tab} index={tab}>
          {isLoading ? <Typography>Loading services...</Typography> : <ServiceTableContent rows={currentRows} />}
        </TabPanel>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </MainCard>
  );
}

function ServiceTableContent({ rows }: { rows: Customer[] }) {
  const router = useRouter();
  const [localRows, setLocalRows] = useState<Customer[]>(rows);

  useEffect(() => {
    setLocalRows(rows);
  }, [rows]);

  const handleViewPage = (id: number) => {
    router.push(`/services/view/${id}`);
  };

  const handleEditPage = (id: number) => {
    router.push(`/services/edit/${id}`);
  };


  if (rows.length === 0) {
    return (
          <NoDataLottieComponent />
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>S.NO</TableCell>
            <TableCell>Service Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Price</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {localRows.map((row, index) => (
            <TableRow key={row.id} hover>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.description || '-'}</TableCell>
              <TableCell>{row.duration || '-'}</TableCell>
              <TableCell>{row.price || '-'}</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Tooltip title="View Details">
                    <IconButton
                      sx={{
                        color: '#1778ff',
                        '&:hover': {
                          backgroundColor: 'rgba(23, 120, 255, 0.1)'
                        }
                      }}
                      onClick={() => handleViewPage(row.id)}
                    >
                      <FaEye />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Edit">
                    <IconButton
                      sx={{
                        color: '#1778ff',
                        '&:hover': {
                          backgroundColor: 'rgba(23, 120, 255, 0.1)'
                        }
                      }}
                      onClick={() => handleEditPage(row.id)}
                    >
                      <FaEdit />
                    </IconButton>
                  </Tooltip>

                  {/* <Tooltip title={row.is_active === 1 ? 'Deactivate' : 'Activate'}>
                    <IconButton>
                      <Switch checked={row.is_active === 1} size="small" onChange={(e) => handleStatusChange(e, row)} />
                    </IconButton>
                  </Tooltip> */}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
