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
import { FaSearch, FaPlus, FaEye, FaEdit } from 'react-icons/fa';
import MainCard from 'components/MainCard';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/navigation';
import { GetAllCustomerService, UpdateCustomerStatusService } from 'api/services';
import Switch from '@mui/material/Switch';
import NoDataLottieComponent from 'components/CustomComponents/NoDataLottie';

type Organization = {
  id: number;
  name: string;
};

type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  status: string;
  is_active: number;
  organizations?: Organization[];
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

function CustomerTableContent({ 
  rows, 
  onStatusChange,
  onView,
  onEdit 
}: { 
  rows: Customer[];
  onStatusChange: (event: React.ChangeEvent<HTMLInputElement>, row: Customer) => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
}) {
  if (rows.length === 0) {
    return <NoDataLottieComponent />;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>S.NO</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Organization Name</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.id} hover>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.first_name}</TableCell>
              <TableCell>{row.last_name || '-'}</TableCell>
              <TableCell>{row.email || '-'}</TableCell>
              <TableCell>{row.phone || '-'}</TableCell>
              <TableCell>{row.organizations?.name || '-'}</TableCell>
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
                      onClick={() => onView(row.id)}
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
                      onClick={() => onEdit(row.id)}
                    >
                      <FaEdit />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title={row.is_active === 1 ? 'Deactivate' : 'Activate'}>
                    <IconButton>
                      <Switch 
                        checked={row.is_active === 1} 
                        size="small" 
                        onChange={(e) => onStatusChange(e, row)} 
                      />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function CustomerTable() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const customerRows = await GetAllCustomerService();
        setRows(customerRows || []);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setPage(0);
  };

  const handleCreatePage = () => {
    router.push(`/customers/create`);
  };

  const handleViewPage = (id: number) => {
    router.push(`/customers/view/${id}`);
  };

  const handleEditPage = (id: number) => {
    router.push(`/customers/edit/${id}`);
  };

  const handleStatusChange = async (event: React.ChangeEvent<HTMLInputElement>, row: Customer) => {
    const newStatus = event.target.checked ? 1 : 0;

    // Optimistic UI update
    setRows(prevRows =>
      prevRows.map(customer =>
        customer.id === row.id ? { ...customer, is_active: newStatus } : customer
      )
    );

    try {
      await UpdateCustomerStatusService({
        id: row.id,
        status: newStatus
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      // Revert on error
      setRows(prevRows =>
        prevRows.map(customer =>
          customer.id === row.id ? { ...customer, is_active: row.is_active } : customer
        )
      );
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = rows
    .filter((row) => {
      if (tab === 1) return row.is_active === 1;
      if (tab === 2) return row.is_active === 0;
      return true;
    })
    .filter(
      (row) =>
        row.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (row.last_name?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
        (row.email?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
        (row.phone?.toLowerCase() ?? '').includes(searchQuery.toLowerCase())
    );

  const currentRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <MainCard>
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h3">Customers</Typography>
          <Button variant="contained" onClick={handleCreatePage} startIcon={<FaPlus />}>
            Add
          </Button>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Tabs value={tab} onChange={handleChangeTab} aria-label="customer tabs">
            <Tab
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
            />
          </Tabs>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '300px' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search customers..."
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </Stack>
        </Stack>

        <TabPanel value={tab} index={tab}>
          {isLoading ? (
            <Typography>Loading customers...</Typography>
          ) : (
            <CustomerTableContent
              rows={currentRows}
              onStatusChange={handleStatusChange}
              onView={handleViewPage}
              onEdit={handleEditPage}
            />
          )}
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