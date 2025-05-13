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
import { UpdateCustomerStatusService } from 'api/services';
import Switch from '@mui/material/Switch';
import { GetAllAssetService } from 'api/services/AssetService';
import Avatar from '@mui/material/Avatar';
type Organization = {
  id: number;
  name: string;
  organization_name: string;
  email: string;
  phone: string;
};

type Customer = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

type Assets = {
  asset_name: string;
  serial_number: string;
  model: string;
  manufacturer: string;
  status: string;
  location: string;
  notes: string;
  purchase_date: string;
  warranty_expiry: string;
  organizations?: Organization[];
  customers?: Customer[];
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

export default function AssetTable() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<Assets[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setIsLoading(true);
        const assetRows = await GetAllAssetService();
        setRows(assetRows || []);
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setPage(0);
  };

  const handleCreatePage = () => {
    router.push(`/assets/create`);
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
        row.asset_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (row.serial_number?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
        (row.model?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
        (row.manufacturer?.toLowerCase() ?? '').includes(searchQuery.toLowerCase())
    );

  const currentRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <MainCard>
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h3">Assets</Typography>
          <Button variant="contained" onClick={handleCreatePage} startIcon={<FaPlus />}>
            Add
          </Button>
        </Stack>

        {/* Modified section: Combined tabs and search in one row */}
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
              placeholder="Search assets..."
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </Stack>
        </Stack>

        <TabPanel value={tab} index={tab}>
          {isLoading ? <Typography>Loading assets...</Typography> : <AssetTableContent rows={currentRows} />}
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

function AssetTableContent({ rows }: { rows: Assets[] }) {
  const router = useRouter();
  const [localRows, setLocalRows] = useState<Assets[]>(rows);

  useEffect(() => {
    setLocalRows(rows);
  }, [rows]);

  const handleViewPage = (id: number) => {
    router.push(`/assets/view/${id}`);
  };

  const handleEditPage = (id: number) => {
    router.push(`/assets/edit/${id}`);
  };

  const handleStatusChange = async (event: React.ChangeEvent<HTMLInputElement>, row: Assets) => {
    const newStatus = event.target.checked ? 1 : 0;

    // Optimistic UI update
    setLocalRows((prevRows) => prevRows.map((asset) => (asset.id === row.id ? { ...asset, is_active: newStatus } : asset)));

    try {
      await UpdateCustomerStatusService({
        id: row.id,
        status: newStatus
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      // Revert on error
      setLocalRows((prevRows) => prevRows.map((asset) => (asset.id === row.id ? { ...asset, is_active: row.is_active } : asset)));
    }
  };

  if (rows.length === 0) {
    return <Typography>No assets found</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>S.NO</TableCell>
            <TableCell>Asset Name</TableCell>
            <TableCell>Serial Number</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>ManuFacturer</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {localRows.map((row, index) => (
            <TableRow key={row.id} hover>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.asset_name}</TableCell>
              <TableCell>{row.serial_number || '-'}</TableCell>
              <TableCell>{row.model || '-'}</TableCell>
              <TableCell>{row.manufacturer || '-'}</TableCell>
              <TableCell>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'center'
                  }}
                >
                  <Avatar src={row?.customers?.first_name} />
                  <Box>
                    <Typography variant="body1" color="initial">
                      {row?.customers?.first_name + row?.customers?.last_name || '-'}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {row?.customers?.email || '-'}
                    </Typography>
                    <Typography variant="body2" color="secondary">
                      {row?.customers?.phone || '-'}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{row.status || '-'}</TableCell>
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

                  <Tooltip title={row.is_active === 1 ? 'Deactivate' : 'Activate'}>
                    <IconButton>
                      <Switch checked={row.is_active === 1} size="small" onChange={(e) => handleStatusChange(e, row)} />
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
