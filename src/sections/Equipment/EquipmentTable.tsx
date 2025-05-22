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
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { FaSearch, FaPlus, FaEye, FaEdit } from 'react-icons/fa';
import MainCard from 'components/MainCard';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { GetAllEquipmentsService } from 'api/services';
import NoDataLottieComponent from 'components/CustomComponents/NoDataLottie';

type Equipment = {
  id: number;
  name: string;
  equipment_type: string;
  availability_date: string;
  location?: string;
  status: string;
};

function TabPanel(props: { children?: React.ReactNode; value: number; index: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function EquipmentTable() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<Equipment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setIsLoading(true);
        const equipmentrows = await GetAllEquipmentsService();
        setRows(equipmentrows as Equipment[]);
      } catch (error) {
        console.error('Failed to fetch equipments:', error);
        toast.error('Failed to load equipment data');  
      } finally {
        setIsLoading(false);
      }
    };
    fetchEquipments();
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
    // .filter((row) => {
    //   if (tab === 1) return row.status === 'Active';
    //   if (tab === 2) return row.status === 'Inactive';
    //   return true;
    // })
    .filter(
      (row) =>
        row?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row?.equipment_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (row?.location?.toLowerCase() ?? '').includes(searchQuery.toLowerCase())
    );

  const currentRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleAdd = () => router.push('/equipment/create');

  return (
    <MainCard>
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h3">Equipment</Typography>
          <Button variant="contained" startIcon={<FaPlus />} onClick={handleAdd}>
            Add 
          </Button>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          {/* <Tabs value={tab} onChange={handleChangeTab} aria-label="equipment tabs"> */}
            {/* <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  All <Chip label={rows.length} size="small" variant="outlined" color="primary" />
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Available{' '}
                  <Chip
                    label={rows.filter((e) => e.status === 'Active').length}
                    size="small"
                    variant="outlined"
                    color="success"
                  />
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Unavailable{' '}
                  <Chip
                    label={rows.filter((e) => e.status === 'Inactive').length}
                    size="small"
                    variant="outlined"
                    color="error"
                  />
                </Box>
              }
            />
          </Tabs> */}

          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '300px' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search equipment..."
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: <FaSearch style={{ marginRight: 8, color: '#999' }} />,
              }}
            />
          </Stack>
        </Stack>

        <TabPanel value={tab} index={tab}>
          {isLoading ? (
            <Typography>Loading equipment...</Typography>
          ) : (
            <EquipmentTableContent rows={currentRows} />
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

function EquipmentTableContent({ rows }: { rows: Equipment[] }) {
  const router = useRouter();

  const handleViewPage = (id: number) => router.push(`/equipment/view/${id}`);
  const handleEditPage = (id: number) => router.push(`/equipment/edit/${id}`);

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
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.equipment_type}</TableCell>
              <TableCell>{row.location || '-'}</TableCell>
              <TableCell>
                <Chip
                  label={row.status}
                  color={
                    row.status === 'Active'
                      ? 'success'
                      : row.status === 'Inactive'
                      ? 'error'
                      : 'warning'
                  }
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Tooltip title="View">
                    <IconButton onClick={() => handleViewPage(row.id)}>
                      <FaEye />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleEditPage(row.id)}>
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
