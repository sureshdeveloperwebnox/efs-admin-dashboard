"use client";

import {
  Box,
  Button,
  IconButton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  CircularProgress
} from "@mui/material";
import Paper from "@mui/material/Paper";
import NoDataLottieComponent from "components/CustomComponents/NoDataLottie";
import { useRouter } from "next/navigation";
import { FaEdit, FaEye } from "react-icons/fa";
import { useEmployeeStore } from "store/useEmployeeStore";
import { useEffect } from "react";
import { useEmployeeRolesStore } from "store/useEmployeeRoleStore";

// Define employee type based on usage
export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  job_title: string;
  employee_role_id: string;
  is_active: number;
}

interface EmployeeTableProps {
  employeeList: Employee[];
}

const EmployeeTable: React.FC<EmployeeTableProps> = (props) => {
  const router = useRouter();
  const employees = props.employeeList;
  const { setSelectedEmployee} = useEmployeeStore()
  const { getEmployeeRoles, getEmployeeRoleById, employeeRoles} = useEmployeeRolesStore();

  useEffect(()=>{
    getEmployeeRoles();
  }, []);

  const {
    isLoading,
    toggleEmployeeStatus
  } = useEmployeeStore();

  const onView = (id: string) => {
    setSelectedEmployee(id);
    router.push("/employees/view/" + id);
  };

  const onEdit = ( id: string) => {
    setSelectedEmployee(id);
    router.push("/employees/edit/" + id);
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

  if (!employees || employees.length === 0) {
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
            <TableCell>Role</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((emp, index) => (
            <TableRow key={emp.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{`${emp.first_name} ${emp.last_name}` || "-"}</TableCell>
              <TableCell>{emp.email || "-"}</TableCell>
              <TableCell>{emp.phone || "-"}</TableCell>
              <TableCell>{emp.job_title || "-"}</TableCell>
              <TableCell>{ emp.employee_role_id && employeeRoles.length > 0 ? getEmployeeRoleById(emp.employee_role_id) : "-" }</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Tooltip title="View Details">
                    <IconButton
                      sx={{
                        color: "#1778ff",
                        "&:hover": {
                          backgroundColor: "rgba(23, 120, 255, 0.1)"
                        }
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
                        "&:hover": {
                          backgroundColor: "rgba(23, 120, 255, 0.1)"
                        }
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
                        onChange={() => onStatusChange(emp.id, emp.is_active)}
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
