'use client';
import { Box, Button, IconButton, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import Paper from '@mui/material';
import { GetAllEmployeeService } from 'api/services/EmployeeAPIService';

import NoDataLottieComponent from 'components/CustomComponents/NoDataLottie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaEdit, FaEye, FaPlus } from 'react-icons/fa';
import {getEmployeeRoleById} from "utils/constants/EMPLOYEE_ROLE"

type Employee = {
    organization_id: string,
    employee_role_id: string,
    experience_years: string,
    is_active: boolean
    users : {
      first_name: string,
      last_name: string,
      email: string,
      phone: string,
      job_title: string
    }
}
 
export default function EmployeeTable() {

    const [employees, setEmployees] = useState<Employee[]>([])

    useEffect( () => {
      async function getEmployees() {
        const response: any = await GetAllEmployeeService();
        setEmployees(response);
      }
      getEmployees();
    },[])

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

    if (employees.length === 0) {
        return (
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h3">Employers</Typography>
                  <Button variant="contained" onClick={handleCreatePage} startIcon={<FaPlus />}>
                      Create Employee
                  </Button>
              </Stack>
              <NoDataLottieComponent />
          </Box>
        )
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
                        <TableCell>{row+1}</TableCell>
                        <TableCell>{employee.users.first_name +" "+ employee.users.last_name || "-"}</TableCell>
                        <TableCell>{employee.users.email || "-"}</TableCell>
                        <TableCell>{employee.users.phone || "-"}</TableCell>
                        <TableCell>{employee.users.job_title || "-"}</TableCell>
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