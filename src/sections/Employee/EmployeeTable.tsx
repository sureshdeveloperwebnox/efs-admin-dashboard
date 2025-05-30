'use client';
import { Box, Button, IconButton, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import Paper from '@mui/material';

import NoDataLottieComponent from 'components/CustomComponents/NoDataLottie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaEdit, FaEye, FaPlus } from 'react-icons/fa';
import {getEmployeeRoleById} from "utils/constants/EMPLOYEE_ROLE"

type Employee = {
    organization_id: string,
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    job_title: string,
    employee_role_id: string,
    experience_years: string,
    is_active: boolean
}

export default function EmployeeTable() {

    const TEMP_EMPLOYEES = [
    {
      "organization_id": "ORG001",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "+91-9876543210",
      "job_title": "Software Engineer",
      "employee_role_id": "1",
      "experience_years": "5",
      "is_active": true
    },
    {
      "organization_id": "ORG001",
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@example.com",
      "phone": "+91-9876543211",
      "job_title": "Product Manager",
      "employee_role_id": "2",
      "experience_years": "7",
      "is_active": true
    },
    {
      "organization_id": "ORG002",
      "first_name": "Raj",
      "last_name": "Kumar",
      "email": "raj.kumar@example.com",
      "phone": "+91-9876543212",
      "job_title": "Data Analyst",
      "employee_role_id": "3",
      "experience_years": "4",
      "is_active": true
    },
    {
      "organization_id": "ORG002",
      "first_name": "Aditi",
      "last_name": "Sharma",
      "email": "aditi.sharma@example.com",
      "phone": "+91-9876543213",
      "job_title": "HR Manager",
      "employee_role_id": "4",
      "experience_years": "6",
      "is_active": false
    },
    {
      "organization_id": "ORG003",
      "first_name": "Robert",
      "last_name": "Brown",
      "email": "robert.brown@example.com",
      "phone": "+91-9876543214",
      "job_title": "Marketing Executive",
      "employee_role_id": "5",
      "experience_years": "3",
      "is_active": true
    },
    {
      "organization_id": "ORG003",
      "first_name": "Emily",
      "last_name": "Clark",
      "email": "emily.clark@example.com",
      "phone": "+91-9876543215",
      "job_title": "UX Designer",
      "employee_role_id": "6",
      "experience_years": "5",
      "is_active": true
    },
    {
      "organization_id": "ORG004",
      "first_name": "Mohammed",
      "last_name": "Ali",
      "email": "mohammed.ali@example.com",
      "phone": "+91-9876543216",
      "job_title": "DevOps Engineer",
      "employee_role_id": "7",
      "experience_years": "8",
      "is_active": false
    },
    {
      "organization_id": "ORG004",
      "first_name": "Sophia",
      "last_name": "Wilson",
      "email": "sophia.wilson@example.com",
      "phone": "+91-9876543217",
      "job_title": "Finance Analyst",
      "employee_role_id": "8",
      "experience_years": "6",
      "is_active": true
    },
    {
      "organization_id": "ORG005",
      "first_name": "David",
      "last_name": "Johnson",
      "email": "david.johnson@example.com",
      "phone": "+91-9876543218",
      "job_title": "Sales Manager",
      "employee_role_id": "9",
      "experience_years": "7",
      "is_active": false
    },
    {
      "organization_id": "ORG005",
      "first_name": "Priya",
      "last_name": "Verma",
      "email": "priya.verma@example.com",
      "phone": "+91-9876543219",
      "job_title": "Software Architect",
      "employee_role_id": "0",
      "experience_years": "10",
      "is_active": true
    }
  ]

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

    function onStatusChange(event: React.ChangeEvent<HTMLInputElement>, organization_id: string, row: number) {
        setEmployees((prev) => 
            prev.map((ele, i) => 
              row === i ? { ...ele, is_active: !ele.is_active } : ele
            )
        );    
    }

    const router = useRouter();

    const handleCreatePage = () => {
        router.push("/employees/create");
    }
    function onView(id: number) {
      router.push("/employees/view/"+id);
    }
    function onEdit(id: number) {
      router.push("/employees/edit/"+id);
    }

    return (
      <>
        <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h3">Employers</Typography>
                  <Button variant="contained" onClick={handleCreatePage} startIcon={<FaPlus />}>
                      Create Employee
                  </Button>
              </Stack>
          </Box>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>S.NO</TableCell>
                        <TableCell>Full Name</TableCell>
                        <TableCell>email</TableCell>
                        <TableCell>Phone Number</TableCell>
                        <TableCell>job_title</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>    
                {
                    employees.map((employee: any, row: any) => (   
                    <TableRow key={employee.organization_id+":"+employee.first_name}>
                        <TableCell>{employee.organization_id}</TableCell>
                        <TableCell>{employee.first_name +" "+ employee.last_name || "-"}</TableCell>
                        <TableCell>{employee.email || "-"}</TableCell>
                        <TableCell>{employee.phone || "-"}</TableCell>
                        <TableCell>{employee.job_title || "-"}</TableCell>
                        <TableCell>{ getEmployeeRoleById(employee.employee_role_id) || "-"}</TableCell>
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
                                    onClick={() => onView(employee.organization_id)}
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
                                    onClick={() => onEdit(employee.organization_id)}
                                    >
                                    <FaEdit />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={employee.is_active ? 'Deactivate' : 'Activate'}>
                                    <IconButton>
                                    <Switch 
                                        checked={employee.is_active === true} 
                                        size="small" 
                                        onChange={(e) => onStatusChange(e, employee.organization_id, row)} 
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
      </>
    )

}