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
import { useEffect } from "react";
import { FaEdit, FaEye, FaPlus } from "react-icons/fa";
import { useEmployeeStore } from "store/useEmployeeStore";
import { getEmployeeRoleById } from "utils/constants/EMPLOYEE_ROLE";

export default function EmployeeTable() {
  const router = useRouter();

  const {
    employees,
    isLoading,
    error,
    getAllEmployees,
    toggleEmployeeStatus
  } = useEmployeeStore();

  useEffect(() => {
    getAllEmployees();
  }, []);

  const handleCreatePage = () => {
    router.push("/employees/create");
  };

  const onView = (id: string) => {
    router.push("/employees/view/" + id);
  };

  const onEdit = (id: string) => {
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

  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h3">Employees</Typography>
          <Button variant="contained" onClick={handleCreatePage} startIcon={<FaPlus />}>
            Create Employee
          </Button>
        </Stack>
        <NoDataLottieComponent />
      </Box>
    );
  }

  return (
    <>
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h3">Employees</Typography>
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
                <TableCell>{emp.first_name + " " + emp.last_name || "-"}</TableCell>
                <TableCell>{emp.email || "-"}</TableCell>
                <TableCell>{emp.phone || "-"}</TableCell>
                <TableCell>{emp.job_title || "-"}</TableCell>
                <TableCell>{getEmployeeRoleById(emp.employee_role_id) || "-"}</TableCell>
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
    </>
  );
}
