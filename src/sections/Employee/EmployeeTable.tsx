'use client';
import { IconButton, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import Paper from '@mui/material';

import NoDataLottieComponent from 'components/CustomComponents/NoDataLottie';
import { useEffect, useState } from 'react';
import { FaEdit, FaEye } from 'react-icons/fa';

type Employee = {
    SNO: number,
    FullName: string,
    Email: string,
    PhoneNumber: string,
    Branch: string,
    Role: string,
    is_active: boolean
}

export default function EmployeeTable() {

    const TEMP_EMPLOYEES : any = [
        {
          SNO: 1,
          FullName: "John Doe",
          Email: "john.doe@example.com",
          PhoneNumber: "123-456-7890",
          Branch: "New York",
          Role: "Manager",
          is_active: true
        },
        {
          SNO: 2,
          FullName: "Jane Smith",
          Email: "jane.smith@example.com",
          PhoneNumber: "987-654-3210",
          Branch: "Los Angeles",
          Role: "Assistant Manager",
          is_active: true
        },
        {
          SNO: 3,
          FullName: "Alice Johnson",
          Email: "alice.johnson@example.com",
          PhoneNumber: "555-123-4567",
          Branch: "Chicago",
          Role: "HR",
          is_active: true
        },
        {
          SNO: 4,
          FullName: "Bob Brown",
          Email: "bob.brown@example.com",
          PhoneNumber: "444-987-6543",
          Branch: "Houston",
          Role: "Developer",
          is_active: true
        },
        {
          SNO: 5,
          FullName: "Charlie Davis",
          Email: "charlie.davis@example.com",
          PhoneNumber: "333-456-7890",
          Branch: "Phoenix",
          Role: "Designer",
          is_active: true
        },
        {
          SNO: 6,
          FullName: "Emily Wilson",
          Email: "emily.wilson@example.com",
          PhoneNumber: "222-123-4567",
          Branch: "Philadelphia",
          Role: "QA Engineer",
          is_active: true
        },
        {
          SNO: 7,
          FullName: "Frank Thomas",
          Email: "frank.thomas@example.com",
          PhoneNumber: "111-987-6543",
          Branch: "San Antonio",
          Role: "Support",
          is_active: true
        },
        {
          SNO: 8,
          FullName: "Grace Lee",
          Email: "grace.lee@example.com",
          PhoneNumber: "999-456-7890",
          Branch: "San Diego",
          Role: "Product Manager",
          is_active: true
        },
        {
          SNO: 9,
          FullName: "Henry Martin",
          Email: "henry.martin@example.com",
          PhoneNumber: "888-123-4567",
          Branch: "Dallas",
          Role: "Sales",
          is_active: true
        },
        {
          SNO: 10,
          FullName: "Ivy Moore",
          Email: "ivy.moore@example.com",
          PhoneNumber: "777-987-6543",
          Branch: "San Jose",
          Role: "Marketing",
          is_active: true
        }
    ];

    const employeeCount : number= 1;
    const [employees, setEmployees] = useState<Employee[]>(TEMP_EMPLOYEES)
    console.log("Current Employees",employees)

    if (employeeCount === 0) {
        return (
            <NoDataLottieComponent />
        )
    }

    useEffect(() => {

    },[employees])

    function onView(id: number) {

    }
    function onEdit(id: number) {

    }
    function onStatusChange(event: React.ChangeEvent<HTMLInputElement>, row: number) {
        setEmployees((prev) => 
            prev.map((ele, i) => 
              row === i ? { ...ele, is_active: !ele.is_active } : ele
            )
        );    
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>S.NO</TableCell>
                        <TableCell>Full Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone Number</TableCell>
                        <TableCell>Branch</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>    
                {
                    employees.map((employee: any, row: any) => (   
                    <TableRow key={employee.SNO+":"+employee.FullName}>
                        <TableCell>{employee.SNO}</TableCell>
                        <TableCell>{employee.FullName || "-"}</TableCell>
                        <TableCell>{employee.Email || "-"}</TableCell>
                        <TableCell>{employee.PhoneNumber || "-"}</TableCell>
                        <TableCell>{employee.Branch || "-"}</TableCell>
                        <TableCell>{employee.Role || "-"}</TableCell>
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
                                    onClick={() => onView(row)}
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
                                    onClick={() => onEdit(row)}
                                    >
                                    <FaEdit />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={employee.is_active ? 'Deactivate' : 'Activate'}>
                                    <IconButton>
                                    <Switch 
                                        checked={employee.is_active === true} 
                                        size="small" 
                                        onChange={(e) => onStatusChange(e, row)} 
                                    />
                                    </IconButton>
                                </Tooltip>

                            </Stack>
                        </TableCell>
                    </TableRow>
                    ))
                }
                </TableBody>
            </Table>
        </TableContainer>
    )

}