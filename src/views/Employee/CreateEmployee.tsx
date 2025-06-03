"use client";

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CreateEmployeeService } from "api/services/EmployeeAPIService";
import { GetAllEmployeeRoleService } from "api/services/EmployeeRolesAPIService";

import MultiTextInput from "components/CustomComponents/MultiTextInput";
import MainCard from "components/MainCard";
import PhoneInputField from "components/phone/PhoneInputField";

interface FormData {
  user_id: string;
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

interface EmployeeRole {
  id: string;
  name: string;
  is_active: number;
}

export default function CreateEmployee() {
  const router = useRouter();

  const initialFormData: FormData = {
    user_id : "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    job_title: "",
    employee_role_id: "",
    gender: "male",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    skill: [],
    experience_years: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [employeeRoles, setEmployeeRoles] = useState<EmployeeRole[]>([]);

  useEffect(() => {
    async function getEmployeeRoles() {
      try {
        const response: any = await GetAllEmployeeRoleService();
        setEmployeeRoles(response);
        console.log("EmployeeRoles>>>", response);
      } catch (error) {
        console.error("Error fetching employee roles:", error);
      }
    }
    getEmployeeRoles();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, skill: requiredSkills }));
  }, [requiredSkills]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, gender: e.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await CreateEmployeeService(formData);
      console.log("CreateEmployee>>>>", response);
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  const goToPreviousPage = () => {
    router.back();
  };

  return (
    <form>
      <Grid container spacing={2}>
        {/* Employee Details */}
        <Grid item xs={12} md={6}>
          <MainCard>
            <Typography variant="h5">Employee</Typography>

            <TextField
              name="user_id"
              label="ID No"
              margin="normal"
              value={formData.user_id}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              name="first_name"
              label="First Name"
              margin="normal"
              value={formData.first_name}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              name="last_name"
              label="Last Name"
              margin="normal"
              value={formData.last_name}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              name="email"
              label="Email"
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />

            <PhoneInputField
              value={formData.phone}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, phone: value }))
              }
              defaultCountry="IN"
            />

            <TextField
              name="password"
              label="Password"
              margin="normal"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
            />

            <Box mt={2}>
              <Typography>Gender:</Typography>
              <RadioGroup
                row
                name="gender"
                value={formData.gender}
                onChange={handleGenderChange}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
            </Box>
          </MainCard>
        </Grid>

        {/* Other Details */}
        <Grid item xs={12} md={6}>
          <MainCard>
            <Typography variant="h5">Other Details</Typography>

            <Box mt={2}>
              <FormControl fullWidth>
                <InputLabel id="employee-role-label">Employee Role</InputLabel>
                <Select
                  labelId="employee-role-label"
                  name="employee_role_id"
                  value={formData.employee_role_id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      employee_role_id: e.target.value,
                    }))
                  }
                  fullWidth
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
            </Box>

            <Box mt={2}>
              <MultiTextInput
                label="Required Skills"
                values={requiredSkills}
                onChange={setRequiredSkills}
                maxItems={10}
              />
            </Box>

            <TextField
              name="address"
              label="Location"
              fullWidth
              margin="normal"
              value={formData.address}
              onChange={handleChange}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="city"
                  label="City"
                  fullWidth
                  margin="normal"
                  value={formData.city}
                  onChange={handleChange}
                />
                <TextField
                  name="state"
                  label="State"
                  fullWidth
                  margin="normal"
                  value={formData.state}
                  onChange={handleChange}
                />
                <TextField
                  name="experience_years"
                  label="Total Experience (years)"
                  fullWidth
                  margin="normal"
                  value={formData.experience_years}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="country"
                  label="Country"
                  fullWidth
                  margin="normal"
                  value={formData.country}
                  onChange={handleChange}
                />
                <TextField
                  name="pincode"
                  label="Pincode"
                  fullWidth
                  margin="normal"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={3}
        mb={2}
      >
        <Button variant="outlined" onClick={goToPreviousPage}>
          Back
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create Employee
        </Button>
      </Stack>
    </form>
  );
}
