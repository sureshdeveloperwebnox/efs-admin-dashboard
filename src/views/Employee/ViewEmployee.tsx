"use client";

import { useEffect, useState } from "react";
import {
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Button,
  Grid,
  Stack,
  Table,
  TableContainer,
  Typography,
  Icon,
} from "@mui/material";
import MainCard from "components/MainCard";
import { useParams, useRouter } from "next/navigation";
import { useEmployeeRolesStore } from "store/useEmployeeRoleStore";
import { useEmployeeStore } from "store/useEmployeeStore";
import { GetEmployeeService } from "api/services/EmployeeAPIService";
import { Box } from "@mui/material";
import { FaDotCircle, FaFemale, FaMale } from "react-icons/fa";
import { FaPhone, FaTransgender } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { Tooltip } from "@mui/material";

export default function ViewEmployee() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const { selectedEmployee, setSelectedEmployee } = useEmployeeStore();
  const { getEmployeeRoleById } = useEmployeeRolesStore();

  const [employee, setEmployee] = useState(selectedEmployee);
  const [role, setRole] = useState("");

  const iconStyle = { color: "#5c6bc0", fontSize: "15px", marginRight: "8px" };


  useEffect(() => {
    const fetchEmployee = async () => {
      if (!selectedEmployee) {
        try {
          const response: any = await GetEmployeeService(id);
          if (!response) {
            throw new Error("No employee data received.");
          }
          setEmployee(response);
          setSelectedEmployee(response);
        } catch (error) {
          console.error("Error fetching employee:", error);
        }
      } else {
        setEmployee(selectedEmployee);
      }
    };

    fetchEmployee();
  }, [id]);

  useEffect(() => {
    const fetchRole = async () => {
      if (employee?.employee_role_id) {
        const roleName = await getEmployeeRoleById(employee.employee_role_id);
        setRole(roleName);
      }
    };

    fetchRole();
  }, [employee]);

  if (!employee) {
    return (
      <MainCard>
        <Typography variant="h4" align="center">Employee not found</Typography>
        <Button variant="outlined" onClick={() => router.back()}>
          Back
        </Button>
      </MainCard>
    );
  }

  return (
    <MainCard>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h3">View Employee</Typography>
            <Button variant="outlined" onClick={() => router.back()}>
              Back
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <MainCard >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Stack spacing={2} alignItems="center" direction={"row"} padding={2}>
                <Avatar alt={employee.first_name || "-"} sx={{ width: 50, height: 50, bgcolor: "#5c6bc0" }} />
                <Box>
                  <Typography variant="h5"> {employee.first_name} {employee.last_name} </Typography>
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <FaDotCircle fill={employee.is_active === 1 ? "#4caf50" : "#f44336"} size={10} />
                    <Typography variant="h6"> {employee.is_active === 1 ? "Active" : "Inactive"} </Typography>
                  </Stack>
                </Box>
              </Stack>

              <TableContainer sx={{ maxWidth: "fit-content", borderTop: "1px solid #c5cae9", padding: "1rem", overflowX:"auto" }}>
                <Table>
                  <TableBody>
                    {[
                      { label: "Email", value: employee.email, icon: <MdEmail /> },
                      { label: "Phone", value: employee.phone, icon: <FaPhone /> },
                      { label: "Gender", value: employee.gender, icon: (employee.gender === "male") ? <FaMale /> : (employee.gender === "female") ? <FaFemale /> : <FaTransgender /> },
                      { label: "Location", value: employee.city, icon: <IoLocationSharp /> },
                    ].map((row, idx) => (
                      <Tooltip title={row.label} placement="left" arrow>
                        <TableRow key={idx} sx={{ display: "flex", alignItems: "center" }}>
                          <TableCell>
                            <Box component="span" sx={iconStyle} >{row.icon}</Box>
                          </TableCell>
                          <TableCell sx={{ width: "fit-content"}}>
                            <Typography variant="subtitle1">{row.value || "-"}</Typography>
                          </TableCell>
                        </TableRow>
                      </Tooltip>
                    ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>
              
            </Box>
          </MainCard>
        </Grid>

        <Grid item xs={12} sm={6}>
          <MainCard>
            <TableContainer>
              <Table>
                <TableBody>
                  {[
                    { label: "Job Title", value: employee.job_title },
                    { label: "Employee Role", value: role || "-" },
                    { label: "Address", value: employee.address },
                    { label: "City", value: employee.city },
                    { label: "State", value: employee.state },
                    { label: "Country", value: employee.country },
                    { label: "Pincode", value: employee.pincode },
                    {
                      label: "Skills",
                      value: Array.isArray(employee.skill) && employee.skill.length > 0
                        ? employee.skill.join(", ")
                        : "-",
                    },
                    { label: "Experience (years)", value: employee.experience_years },
                  ].map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Typography variant="body1">{row.label}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">{row.value || "-"}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MainCard>
        </Grid>
      </Grid>
    </MainCard >
  );
}