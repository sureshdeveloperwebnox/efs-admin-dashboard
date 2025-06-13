"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  CircularProgress,
  Tooltip,
  IconButton,
  Switch,
} from "@mui/material";
import { FaEdit, FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEmployeeStore } from "store/useEmployeeStore";
import { useEmployeeRolesStore } from "store/useEmployeeRoleStore";
import NoDataLottieComponent from "components/CustomComponents/NoDataLottie";

export interface Employee {
  id: string; 
  user_id: string; 
  organization_id: string; 
  first_name: string; 
  last_name: string; 
  email: string; 
  phone: string; 
  job_title: string; 
  gender: string; 
  address: string; 
  city: string; 
  state: string; 
  country: string; 
  pincode: string; 
  skill: string[]; 
  experience_years: string; 
  employee_role_id: string; 
  is_active: number; 
}

interface EmployeeTableProps {
  employeeListType: string;
}


const EmployeeTable: React.FC<EmployeeTableProps> = ({ employeeListType }) => {
  const router = useRouter();
  const { setSelectedEmployee, toggleEmployeeStatus, isLoading, employees, activeEmployees, inactiveEmployees } = useEmployeeStore();

  // const { getEmployeeRoles, getEmployeeRoleById } = useEmployeeRolesStore();

  // const [roleNames, setRoleNames] = useState<Record<string, string>>({});
  // const [loadingRoles, setLoadingRoles] = useState<boolean>(true);

  // useEffect(() => {
  //   const fetchRoles = async () => {
  //     setLoadingRoles(true);
  //     try {
  //       await getEmployeeRoles(); // Fetch all roles first

  //       const rolePromises = employeeList.map(async (emp) => {
  //         if (emp.employee_role_id) {
  //           return { id: emp.id, roleName: await getEmployeeRoleById(emp.employee_role_id) };
  //         }
  //         // return { id: emp.id, roleName: "-" };
  //       });

  //       const roleResults = await Promise.all(rolePromises);
  //       const roleMap = roleResults.reduce((acc, { id, roleName }) => {
  //         acc[id] = roleName;
  //         return acc;
  //       }, {} as Record<string, string>);

  //       setRoleNames(roleMap);
  //     } catch (error) {
  //       console.error("Error fetching roles:", error);
  //     } finally {
  //       setLoadingRoles(false);
  //     }
  //   };
  // }, []);

  const employeeList : Employee[] = (employeeListType==="all")? employees: (employeeListType==="active")? activeEmployees: inactiveEmployees;

  const onView = (id: string) => {
    setSelectedEmployee(id);
    router.push(`/employees/view/${id}`);
  };

  const onEdit = (id: string) => {
    setSelectedEmployee(id);
    router.push(`/employees/edit/${id}`);
  };

  const onStatusChange = async (id: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    await toggleEmployeeStatus(id, newStatus);
  };

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" height={300}>
        <CircularProgress />
      </Stack>
    );
  }

  if (!employeeList || employeeList.length === 0) {
    return <NoDataLottieComponent />;
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
            <TableCell>Job Title</TableCell>
            {/* <TableCell>Role</TableCell> */}
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employeeList.map((emp, index) => (
            <TableRow key={emp.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{`${emp.first_name} ${emp.last_name}` || "-"}</TableCell>
              <TableCell>{emp.email || "-"}</TableCell>
              <TableCell>{emp.phone || "-"}</TableCell>
              <TableCell>{emp.job_title || "-"}</TableCell>
              {/* <TableCell>{roleNames[emp.id] || "-"}</TableCell> */}
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Tooltip title="View Details">
                    <IconButton
                      sx={{
                        color: "#1778ff",
                        "&:hover": { backgroundColor: "rgba(23, 120, 255, 0.1)" },
                      }}
                      onClick={() => onView(emp.id)}
                    >
                      <FaEye />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Edit">
                    <IconButton
                      sx={{
                        color: "#1778ff",
                        "&:hover": { backgroundColor: "rgba(23, 120, 255, 0.1)" },
                      }}
                      onClick={() => onEdit(emp.id)}
                    >
                      <FaEdit />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title={emp.is_active === 1 ? "Deactivate" : "Activate"}>
                    <IconButton>
                      <Switch
                        checked={emp.is_active === 1}
                        size="small"
                        onChange={() => onStatusChange(emp.user_id, emp.is_active)}
                      />
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
};

export default EmployeeTable;