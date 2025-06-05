'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
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
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { FaPlus, FaEye, FaEdit, FaRegUser } from 'react-icons/fa';
import MainCard from 'components/MainCard';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/navigation';
import { GetAllWorkOrderService } from 'api/services';
import dayjs from 'dayjs';
import Avatar from '@mui/material/Avatar';
import { getInitials, stringToColor } from 'utils/color.code';
import NoDataLottieComponent from 'components/CustomComponents/NoDataLottie';
import WorkOrderAssignForm from './WorkOrderAssignForm';
interface Customer {
  id: number;
  email?: string;
  phone?: string;
  name?: string;
}

interface WorkOrder {
  id: number;
  title: string;
  work_order_number?: string;
  scheduled_start_date?: string;
  scheduled_end_date?: string;
  actual_start_date?: string;
  actual_end_date?: string;
  priority?: string;
  estimated_cost?: number;
  actual_cost?: number;
  status?: string;
  is_active?: number;
  customer: Customer;
}

function TabPanel(props: { children?: React.ReactNode; value: number; index: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const iconButtonStyles = {
  color: '#1778ff',
  '&:hover': {
    backgroundColor: 'rgba(23, 120, 255, 0.1)'
  }
};

function WorkOrderTableContent({ rows }: { rows: WorkOrder[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);


  const handleViewPage = (id: number) => {
    router.push(`/work-orders/view/${id}`);
  };

  const handleEditPage = (id: number) => {
    router.push(`/work-orders/edit/${id}`);
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  if (rows.length === 0) {
    return (
      <NoDataLottieComponent />
    );
  }



  return (
    <>
      <TableContainer
        component={Paper}
      >
        <Table aria-label="Work orders table">
          <TableHead sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>S.NO</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Work Order</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Schedule Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Work Order Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Estimated Cost</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actual Cost</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <>
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    '&:last-child td': { borderBottom: 0 },
                    '&:hover': { backgroundColor: (theme) => theme.palette.action.hover }
                  }}
                >
                  <TableCell sx={{ color: 'text.secondary' }}>{index + 1}</TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>{row.title || '-'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: 14,
                          bgcolor: stringToColor(row?.customer?.name || '')
                        }}
                      >
                        {getInitials(row?.customer?.first_name || '')}
                      </Avatar>
                      <Typography>{row?.customer?.name || '-'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column">
                      <Typography variant="body2" fontWeight={500}>
                        {dayjs(row.scheduled_start_date).format('DD-MM-YYYY')}
                      </Typography>
                      {row.scheduled_end_date && (
                        <Typography variant="caption" color="text.secondary">
                          to {dayjs(row.scheduled_end_date).format('DD-MM-YYYY')}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column">
                      <Typography variant="body2">
                        {row.actual_start_date ? dayjs(row.actual_start_date).format('DD-MM-YYYY') : '-'}
                      </Typography>
                      {row.actual_end_date && (
                        <Typography variant="caption" color="text.secondary">
                          to {dayjs(row.actual_end_date).format('DD-MM-YYYY')}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.priority || '-'}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        backgroundColor:
                          row.priority === 'High' ? 'error.light' : row.priority === 'Medium' ? 'warning.light' : 'success.light',
                        color:
                          row.priority === 'High'
                            ? 'error.contrastText'
                            : row.priority === 'Medium'
                              ? 'warning.contrastText'
                              : 'success.contrastText'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>{formatCurrency(row.estimated_cost)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      fontWeight={500}
                      color={
                        row.actual_cost > row.estimated_cost ? 'error.main' : row.actual_cost < row.estimated_cost ? 'success.main' : 'inherit'
                      }
                    >
                      {formatCurrency(row.actual_cost)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status || 'Unknown'}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        backgroundColor:
                          row.status === 'Completed'
                            ? 'success.light'
                            : row.status === 'In Progress'
                              ? 'warning.light'
                              : row.status === 'Pending'
                                ? 'info.light'
                                : 'default',
                        color:
                          row.status === 'Completed'
                            ? 'success.dark'
                            : row.status === 'In Progress'
                              ? 'warning.dark'
                              : row.status === 'Pending'
                                ? 'info.dark'
                                : 'text.primary'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="View Details">
                        <IconButton
                          sx={{
                            ...iconButtonStyles,
                            '&:hover': { backgroundColor: 'primary.light', color: 'primary.main' }
                          }}
                          onClick={() => handleViewPage(row.id)}
                          aria-label="View details"
                        >
                          <FaEye />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          sx={{
                            ...iconButtonStyles,
                            '&:hover': { backgroundColor: 'secondary.light', color: 'secondary.main' }
                          }}
                          onClick={() => handleEditPage(row.id)}
                          aria-label="Edit"
                        >
                          <FaEdit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Assign">
                        <IconButton color="primary" aria-label="assign" size="medium" onClick={() => setOpen(true)}>
                          <FaRegUser />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
                {open && <WorkOrderAssignForm open={open} setOpen={setOpen} row={row} />}

              </>

            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </>


  );

}


export default function WorkOrderTable() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<WorkOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const workOrderRows = await GetAllWorkOrderService();
        setRows(workOrderRows || []);
      } catch (error) {
        console.error('Failed to fetch workorders:', error);
        setError('Failed to load work orders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkOrder();
  }, []);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setPage(0);
  };

  const handleCreatePage = () => {
    router.push(`/work-orders/create`);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // Filter by tab (All/Active/Inactive)
      const matchesTab = tab === 0 || (tab === 1 && row.is_active === 1) || (tab === 2 && row.is_active === 0);

      // Filter by search query
      const matchesSearch =
        (row?.customer?.email?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
        (row?.customer?.phone?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
        (row?.title?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
        (row?.work_order_number?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
        (row?.customer.name?.toLowerCase() ?? '').includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [rows, tab, searchQuery]);

  const currentRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (isLoading) {
    return (
      <MainCard>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  if (error) {
    return (
      <MainCard>
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </MainCard>
    );
  }

  return (
    <MainCard>
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h3">Work Orders</Typography>
          <Button variant="contained" onClick={handleCreatePage} startIcon={<FaPlus />}>
            Add Work Order
          </Button>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Tabs value={tab} onChange={handleChangeTab} aria-label="Work order tabs">
            {/* <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  All
                  <Chip label={rows.length} size="small" variant="outlined" color="primary" />
                </Box>
              }
              id="tab-0"
              aria-controls="tabpanel-0"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Active
                  <Chip label={rows.filter((r) => r.is_active === 1).length} size="small" variant="outlined" color="primary" />
                </Box>
              }
              id="tab-1"
              aria-controls="tabpanel-1"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Inactive
                  <Chip label={rows.filter((r) => r.is_active === 0).length} size="small" variant="outlined" color="primary" />
                </Box>
              }
              id="tab-2"
              aria-controls="tabpanel-2"
            /> */}
          </Tabs>

          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by name, email, or work order"
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: '350px' }}
            aria-label="Search work orders"
          />
        </Stack>

        <TabPanel value={tab} index={tab}>
          <WorkOrderTableContent rows={currentRows} />
        </TabPanel>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rows per page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        />
      </Box>
    </MainCard>
  );
}
