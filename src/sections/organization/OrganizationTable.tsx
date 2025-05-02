'use client';

import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

type Props = {};

const rows = [
  { id: 1, name: 'Org A', industry: 'Technology', employees: 120, status: 'Active' },
  { id: 2, name: 'Org B', industry: 'Finance', employees: 85, status: 'Inactive' },
  { id: 3, name: 'Org C', industry: 'Manufacturing', employees: 200, status: 'Active' },
  { id: 4, name: 'Org D', industry: 'Education', employees: 60, status: 'Pending' },
  { id: 5, name: 'Org Es', industry: 'Healthcare', employees: 150, status: 'Active' }
];

export default function OrganizationTable({}: Props) {
  return (
    <Box>
    
      <TableContainer component={Paper} >
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
              <TableCell>Employees</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.industry}</TableCell>
                <TableCell>{row.employees}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
