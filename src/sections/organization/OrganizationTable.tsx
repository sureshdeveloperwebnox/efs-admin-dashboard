'use client';

import React from 'react';
import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

type Props = {};

const rows = [
  { id: 1, name: 'Org A', industry: 'Technology', employees: 120, status: 'Active' },
  { id: 2, name: 'Org B', industry: 'Finance', employees: 85, status: 'Inactive' },
  { id: 3, name: 'Org C', industry: 'Manufacturing', employees: 200, status: 'Active' },
  { id: 4, name: 'Org D', industry: 'Education', employees: 60, status: 'Pending' },
  { id: 5, name: 'Org E', industry: 'Healthcare', employees: 150, status: 'Active' }
];

function TabPanel(props: { children?: React.ReactNode; value: number; index: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-panel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function OrganizationTable({}: Props) {
  const [tab, setTab] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box>
      <Tabs value={tab} onChange={handleChange} aria-label="organization tabs">
        <Tab label="All" />
        <Tab label="Active" />
        <Tab label="Inactive" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <OrganizationTableContent rows={rows} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <OrganizationTableContent rows={rows.filter(row => row.status === 'Active')} />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <OrganizationTableContent rows={rows.filter(row => row.status === 'Inactive')} />
      </TabPanel>
    </Box>
  );
}

function OrganizationTableContent({ rows }: { rows: typeof rows }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>S.NO</TableCell>
            <TableCell>Organization Name</TableCell>
            <TableCell>Industry Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Pincode</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Plan Type</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.industry}</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
