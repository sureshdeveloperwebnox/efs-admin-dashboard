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
import { GetAllOrganizationService } from 'api/services/OrganizationAPIService';
import MainCard from 'components/MainCard';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/navigation';
import NoDataLottieComponent from 'components/CustomComponents/NoDataLottie';

type Organization = {
  id: number;
  name: string;
  industry: string;
  industry_name?: string;
  email?: string;
  phone?: string;
  plan_type?: string;
  status: string;
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

export default function OrganizationTable() {
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<Organization[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setIsLoading(true);
        const organizationRows = await GetAllOrganizationService();
        setRows(organizationRows || []);
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrganizations();
  }, []);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setPage(0);
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
      if (tab === 1) return row.status === 'Active';
      if (tab === 2) return row.status === 'Inactive';
      return true;
    })
    .filter(
      (row) =>
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (row.industry_name?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
        (row.email?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
        (row.phone?.toLowerCase() ?? '').includes(searchQuery.toLowerCase())
    );

  const currentRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <MainCard>
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h3">Organizations</Typography>
          {/* <Button variant="contained" startIcon={<FaPlus />}>
            Add
          </Button> */}
        </Stack>


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
                  <Chip label={rows.filter((r) => r.status === 0).length} size="small" variant="outlined" color="primary" />
                </Box>
              }
            /> */}
          </Tabs>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '300px' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search organizations..."
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </Stack>
        </Stack>

        <TabPanel value={tab} index={tab}>
          {isLoading ? (
            <Typography>Loading organizations...</Typography>
          ) : (
            <OrganizationTableContent rows={currentRows} />
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

function OrganizationTableContent({ rows }: { rows: Organization[] }) {
  const router = useRouter();

  const handleViewPage = (id: number) => {
    router.push(`/organization/${id}`);
  };

  const handleEditPage = (id:any) => {
    router.push(`/organization/edit/${id}`);
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
            <TableCell>Organization Name</TableCell>
            <TableCell>Industry</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Plan Type</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.id} hover>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.industry_name || '-'}</TableCell>
              <TableCell>{row.email || '-'}</TableCell>
              <TableCell>{row.phone || '-'}</TableCell>
              <TableCell>{row.plan_type || '-'}</TableCell>
              <TableCell align="center">
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
                      onClick={() => handleEditPage(row?.id)}
                    >
                      <FaEdit />
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