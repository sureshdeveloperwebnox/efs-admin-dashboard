"use client";

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
} from "@mui/material";
import MainCard from "components/MainCard";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useEmployeeRolesStore } from "store/useEmployeeRoleStore";
import { useEmployeeStore } from "store/useEmployeeStore";
import { GetEmployeeService } from "api/services/EmployeeAPIService"; // API Call

export default function ViewEmployee() {
  const params = useParams();
  const id = params.id; // Employee ID
  const router = useRouter();

  // Zustand stores
  const { selectedEmployee, setSelectedEmployee } = useEmployeeStore();
  const { getEmployeeRoleById } = useEmployeeRolesStore();

  // **Local State** for storing employee details
  const [employee, setEmployee] = useState(selectedEmployee);

  // Fetch Employee if `selectedEmployee` is missing (after refresh)
  useEffect(() => {
    const fetchEmployee = async () => {
      if (!selectedEmployee) {
        try {
          const response = await GetEmployeeService(id);
          if (!response) {
            throw new Error("No employee data received.");
          }
          setEmployee(response); // Store in local state
          setSelectedEmployee(response); // Also update Zustand store
        } catch (error) {
          console.error("Error fetching employee:", error);
        }
      } else {
        setEmployee(selectedEmployee); // Use existing Zustand data
      }
    };

    fetchEmployee();
  }, [id, selectedEmployee, setSelectedEmployee]);

  // Show error screen if employee isn't found
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
        <Grid item xs={12} sm={4}>
          <Stack spacing={0.5} alignItems="center">
            <Avatar alt={employee.first_name || "-"} sx={{ width: 100, height: 100 }} />
            <Typography variant="h5">
              {employee.first_name} {employee.last_name}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={8}>
          <TableContainer>
            <Table>
              <TableBody>
                {[
                  { label: "Name", value: `${employee.first_name} ${employee.last_name}` },
                  { label: "Email", value: employee.email },
                  { label: "Phone", value: employee.phone },
                  { label: "Gender", value: employee.gender },
                  { label: "Job Title", value: employee.job_title },
                  { label: "Employee Role", value: getEmployeeRoleById(employee.employee_role_id) || "-" },
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
        </Grid>
      </Grid>
    </MainCard>
  );
}