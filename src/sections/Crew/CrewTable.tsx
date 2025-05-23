'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
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
import { GetAllCrewService } from 'api/services';
import NoDataLottieComponent from 'components/CustomComponents/NoDataLottie';

interface Customer {
  id: number;
  name: string;
}

function TabPanel(props: { children?: React.ReactNode; value: number; index: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function CrewTable() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchCrews = async () => {
    try {
      setIsLoading(true);
      const crewRows = await GetAllCrewService();
      setRows(Array.isArray(crewRows) ? crewRows : []); // Ensure array
    } catch (error) {
      console.error('Failed to fetch crews:', error);
      setRows([]); // Reset to empty array on error
    } finally {
      setIsLoading(false);
    }
  };
  fetchCrews();
}, []);


  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setPage(0);
  };

  const handleCreatePage = () => {
    router.push(`/crew/create`);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

const searchQueryLower = searchQuery.toLowerCase();
const filteredRows = Array.isArray(rows) 
  ? rows.filter(row => row?.name?.toLowerCase().includes(searchQueryLower)) 
  : [];

// 4. Safe pagination
const currentRows = filteredRows.slice(
  page * rowsPerPage, 
  page * rowsPerPage + rowsPerPage
);

  return (
    <MainCard>
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h3">Crews</Typography>
          <Button variant="contained" onClick={handleCreatePage} startIcon={<FaPlus />}>
            Add
          </Button>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Tabs value={tab} onChange={handleChangeTab} aria-label="crew tabs" />
          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '300px' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search crews..."
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </Stack>
        </Stack>

        <TabPanel value={tab} index={tab}>
          {isLoading ? (
            <div>
              <Typography>Loading crews...</Typography>
            </div>
          ) : (
            <CrewTableContent rows={currentRows} />
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

function CrewTableContent({ rows }: { rows: Customer[] }) {
  const router = useRouter();

  const handleViewPage = (id: number) => {
    router.push(`/crew/view/${id}`);
  };

  const handleEditPage = (id: number) => {
    router.push(`/crew/edit/${id}`);
  };

  if (rows.length === 0) {
    return <NoDataLottieComponent />;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>S.NO</TableCell>
            <TableCell>Crew Name</TableCell>
            <TableCell>Leader Name</TableCell>
            <TableCell>Leader Email</TableCell>
            <TableCell>Leader Phone</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.id} hover>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row?.name}</TableCell>
              <TableCell>{row?.users?.name}</TableCell>
              <TableCell>{row?.users?.email}</TableCell>
              <TableCell>{row?.users?.phone}</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Tooltip title="View Details">
                    <IconButton
                      sx={{
                        color: '#1778ff',
                        '&:hover': {
                          backgroundColor: 'rgba(23, 120, 255, 0.1)',
                        },
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
                          backgroundColor: 'rgba(23, 120, 255, 0.1)',
                        },
                      }}
                      onClick={() => handleEditPage(row.id)}
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