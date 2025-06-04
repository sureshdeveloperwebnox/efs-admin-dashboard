"use client";

import {
  Box,
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
  Stack
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { GetEmployeeService, UpdateEmployeeService } from "api/services/EmployeeAPIService";
import { GetAllEmployeeRoleService } from "api/services/EmployeeRolesAPIService";
import MultiTextInput from "components/CustomComponents/MultiTextInput";
import MainCard from "components/MainCard";
import PhoneInputField from "components/phone/PhoneInputField";

interface FormData {
  id: string,
  user_id: string,
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
}

export default function EditEmployee() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();

  const [formData, setFormData] = useState<FormData | null>(null);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [employeeRoles, setEmployeeRoles] = useState<any[]>([]);
  const [prevEmployee, setPrevEmployee] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      try {
        const [rolesResponse, employeeResponse] = await Promise.all([
          GetAllEmployeeRoleService(),
          GetEmployeeService(id)
        ]);

        setEmployeeRoles(rolesResponse || []);

        if (employeeResponse) {
          const emp = employeeResponse;
          const user = emp.users;

          setFormData({
            id: user.id || "",
            user_id: emp.id || "",
            organization_id: emp.organization_id || "",
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            phone: user.phone || "",
            job_title: user.job_title || "",
            gender: emp.gender || "male",
            address: emp.address || "",
            city: emp.city || "",
            state: emp.state || "",
            country: emp.country || "",
            pincode: emp.pincode || "",
            skill: emp.skill || [],
            experience_years: emp.experience_years || "",
            employee_role_id: emp.employee_role_id || ""
          });

          setRequiredSkills(emp.skill || []);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    setFormData((prev) => prev ? { ...prev, skill: requiredSkills } : null);
  }, [requiredSkills]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form Data Submitted:", formData);
    try {
      const response = await UpdateEmployeeService(formData);
      if (response?.data) {
        router.back();
      }
    } catch (error) {
      console.error('Failed to update Employee:', error);
      alert('Failed to update Employee. Please try again.');
    }
  };

  const goToPreviousPage = () => router.back();

  if (!formData) return <Typography>Loading...</Typography>;

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <MainCard>
            <Typography variant="h5">Employee</Typography>

            <TextField
              name="first_name"
              label="First Name"
              value={formData.first_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="last_name"
              label="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <PhoneInputField
              value={formData.phone}
              onChange={(value) =>
                setFormData((prev) => prev ? { ...prev, phone: value } : null)
              }
              defaultCountry="IN"
            />
            <TextField
              name="job_title"
              label="Job Title"
              value={formData.job_title}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <RadioGroup
              row
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
            </RadioGroup>
          </MainCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <MainCard>
            <Typography variant="h5">Other Details</Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel id="employee_role_label">Employee Role</InputLabel>
              <Select
                labelId="employee_role_label"
                name="employee_role_id"
                value={formData.employee_role_id}
                onChange={(e) =>
                  setFormData((prev) =>
                    prev ? { ...prev, employee_role_id: e.target.value } : null
                  )
                }
              >
                {employeeRoles
                  .filter((role) => role.is_active === 1)
                  .map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <MultiTextInput
              label="Required Skills"
              values={requiredSkills}
              onChange={setRequiredSkills}
              maxItems={10}
            />

            <TextField
              name="address"
              label="Location"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="city"
                  label="City"
                  value={formData.city}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  name="state"
                  label="State"
                  value={formData.state}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  name="experience_years"
                  label="Total Experience (years)"
                  value={formData.experience_years}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="country"
                  label="Country"
                  value={formData.country}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  name="pincode"
                  label="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
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
