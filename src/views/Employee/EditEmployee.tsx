"use client";

import {
  InputLabel,
  TextField,
  Button,
  Grid,
  Typography,
  FormControlLabel,
  FormControl,
  MenuItem,
  Select,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import MainCard from "components/MainCard";
import MultiTextInput from "components/CustomComponents/MultiTextInput";
import PhoneInputField from "components/phone/PhoneInputField";
import { useEmployeeRolesStore } from "store/useEmployeeRoleStore";
import { useEmployeeStore, Employee } from "store/useEmployeeStore";
import { GetEmployeeService } from "api/services/EmployeeAPIService"; // API Call

export default function EditEmployee() {
  const params = useParams();
  const id = String(params.id); // Employee ID from route params
  const router = useRouter();

  const { employeeRoles, getEmployeeRoles } = useEmployeeRolesStore();
  const { selectedEmployee, setSelectedEmployee, updateEmployee, error } = useEmployeeStore();

  // **Local State for Employee Data**
  const [formData, setFormData] = useState<Employee | null>(selectedEmployee);

  // **Fetch Employee if Zustand clears (like after refresh)**
  useEffect(() => {
    const fetchEmployee = async () => {
      if (!selectedEmployee) {
        try {
          const response = await GetEmployeeService(id);
          if (!response) {
            throw new Error("No employee data received.");
          }
          setFormData(response); // Store in local state
          setSelectedEmployee(response); // Update Zustand store
        } catch (error) {
          console.error("Error fetching employee:", error);
        }
      } else {
        setFormData(selectedEmployee); // Use Zustand data
      }
    };

    getEmployeeRoles();
    fetchEmployee();
  }, [id, selectedEmployee, setSelectedEmployee, getEmployeeRoles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData) return;

    await updateEmployee(formData);
    if (!error) {
      router.back();
    }
  };

  const goToPreviousPage = () => router.back();

  if (!formData) return <Typography>Loading employee data...</Typography>;

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <MainCard>
            <Typography variant="h5">Employee</Typography>

            <TextField name="first_name" label="First Name" value={formData.first_name} onChange={handleChange} fullWidth margin="normal" />
            <TextField name="last_name" label="Last Name" value={formData.last_name} onChange={handleChange} fullWidth margin="normal" />
            <TextField name="email" label="Email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
            <PhoneInputField
              value={formData.phone}
              onChange={(value) => setFormData((prev) => (prev ? { ...prev, phone: value } : null))}
              defaultCountry="IN"
            />
            <TextField name="job_title" label="Job Title" value={formData.job_title} onChange={handleChange} fullWidth margin="normal" />
            <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
          </MainCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <MainCard>
            <Typography variant="h5">Other Details</Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel id="employee_role_label">Employee Role</InputLabel>
              <Select labelId="employee_role_label" name="employee_role_id" value={formData.employee_role_id} onChange={handleSelectChange}>
                {employeeRoles.filter((role) => role.is_active === 1).map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <MultiTextInput
              sx={{marginTop: "5px"}}
              label="Required Skills"
              values={formData.skill}
              onChange={(skills) => setFormData(prev => ({ ...prev, skill: skills }))}
              maxItems={10}
            />

            <TextField name="address" label="Address" value={formData.address} onChange={handleChange} fullWidth margin="normal" />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField name="city" label="City" value={formData.city} onChange={handleChange} fullWidth margin="normal" />
                <TextField name="state" label="State" value={formData.state} onChange={handleChange} fullWidth margin="normal" />
                <TextField name="experience_years" label="Experience (years)" value={formData.experience_years} onChange={handleChange} fullWidth margin="normal" />
              </Grid>
              <Grid item xs={6}>
                <TextField name="country" label="Country" value={formData.country} onChange={handleChange} fullWidth margin="normal" />
                <TextField name="pincode" label="Pincode" value={formData.pincode} onChange={handleChange} fullWidth margin="normal" />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="space-between" alignItems="center" my={2}>
        <Button variant="outlined" onClick={goToPreviousPage}>
          Back
        </Button>
        <Button variant="contained" type="submit">
          Update Employee
        </Button>
      </Stack>
    </form>
  );
}