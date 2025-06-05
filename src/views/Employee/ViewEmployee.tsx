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
  CircularProgress
} from "@mui/material";
import { GetEmployeeService } from "api/services/EmployeeAPIService";
import MainCard from "components/MainCard";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getEmployeeRoleById } from "utils/constants/EMPLOYEE_ROLE";

interface Employee {
  organization_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  job_title: string;
  employee_role_id: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  skill: string[];
  experience_years: string;
}

export default function ViewEmployee() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const response = await GetEmployeeService(id);
        if (!response) {
          throw new Error("No employee data received.");
        }

        const emp: any = response;
        const user = emp?.users;

        const data: Employee = {
          organization_id: user?.organization_id || "-",
          first_name: user?.first_name || "-",
          last_name: user?.last_name || "-",
          email: user?.email || "-",
          phone: user?.phone || "-",
          password: "-",
          job_title: user?.job_title || "-",
          employee_role_id: emp?.employee_role_id || "-",
          gender: emp?.gender || "-",
          address: emp?.address || "-",
          city: emp?.city || "-",
          state: emp?.state || "-",
          country: emp?.country || "-",
          pincode: emp?.pincode || "-",
          skill: Array.isArray(emp?.skill) ? emp.skill : [],
          experience_years: emp?.experience_years || "0"
        };

        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee:", error);
        setErrorMsg("Failed to load employee data.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEmployee();
  }, [id]);

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" height={300}>
        <CircularProgress />
      </Stack>
    );
  }

  if (errorMsg || !employee) {
    return (
      <Typography color="error" align="center" mt={4}>
        {errorMsg || "Employee not found."}
      </Typography>
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
            <Avatar
              alt={employee.first_name}
              sx={{ width: 100, height: 100 }}
            />
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
                      : "-"
                  },
                  { label: "Experience (years)", value: employee.experience_years }
                ].map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Typography variant="body1">{row.label}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">{row.value}</Typography>
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
