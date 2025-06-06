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

import { useEmployeeStore } from "store/useEmployeeStore";
import { useEmployeeRolesStore } from "store/useEmployeeRoleStore";

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
  is_active: number;
}

const CreateEmployee = () => {
  const router = useRouter();
  const { createEmployee, error } = useEmployeeStore();
  const { employeeRoles, getEmployeeRoles } = useEmployeeRolesStore();

  const [formData, setFormData] = useState<FormData>({
    user_id: "",
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
    is_active: 1
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getEmployeeRoles();
    console.log("Employee Roles>>>> ", employeeRoles)
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, gender: e.target.value }));
  };

  const validateForm = (): string | null => {
    const {
      user_id,
      first_name,
      last_name,
      email,
      phone,
      password,
      job_title,
      employee_role_id,
      address,
      city,
      state,
      country,
      pincode,
      experience_years,
      skill
    } = formData;

    if (
      !user_id || !first_name || !last_name || !email || !phone || !password ||
      !job_title || !employee_role_id || !address || !city || !state || !country ||
      !pincode || !experience_years || skill.length === 0
    ) {
      return "Please fill in all required fields.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format.";

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) return "Invalid phone number.";

    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const errorMsg = validateForm();
    if (errorMsg) {
      setFormError(errorMsg);
      return;
    }

    setIsSubmitting(true);
    
    await createEmployee(formData);
    setIsSubmitting(false);

    if (!error) {
      router.back();
    } else {
      setFormError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {formError && (
        <Typography color="error" sx={{ mb: 2 }}>
          {formError}
        </Typography>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <MainCard>
            <Typography variant="h5">Employee</Typography>

            {[
              { name: "user_id", label: "ID No" },
              { name: "first_name", label: "First Name" },
              { name: "last_name", label: "Last Name" },
              { name: "email", label: "Email" },
              { name: "password", label: "Password", type: "password" },
              { name: "job_title", label: "Job Title" }
            ].map(({ name, label, type = "text" }) => (
              <TextField
                key={name}
                name={name}
                label={label}
                type={type}
                margin="normal"
                value={(formData as any)[name]}
                onChange={handleChange}
                fullWidth
              />
            ))}

            <PhoneInputField
              value={formData.phone}
              onChange={(val) => setFormData(prev => ({ ...prev, phone: val }))}
              defaultCountry="IN"
            />

            <Box mt={2}>
              <Typography>Gender:</Typography>
              <RadioGroup
                row
                name="gender"
                value={formData.gender}
                onChange={handleGenderChange}
              >
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
              </RadioGroup>
            </Box>
          </MainCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <MainCard>
            <Typography variant="h5">Other Details</Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Employee Role</InputLabel>
              <Select
                labelId="role-label"
                name="employee_role_id"
                value={formData.employee_role_id}
                onChange={handleSelectChange}
              >
                {employeeRoles
                  .filter(role => role.is_active === 1)
                  .map(role => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <MultiTextInput
              label="Required Skills"
              values={formData.skill}
              onChange={(skills) => setFormData(prev => ({ ...prev, skill: skills }))}
              maxItems={10}
            />

            <TextField
              name="address"
              label="Location"
              margin="normal"
              value={formData.address}
              onChange={handleChange}
              fullWidth
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="city"
                  label="City"
                  margin="normal"
                  value={formData.city}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  name="state"
                  label="State"
                  margin="normal"
                  value={formData.state}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  name="experience_years"
                  label="Total Experience (years)"
                  margin="normal"
                  value={formData.experience_years}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="country"
                  label="Country"
                  margin="normal"
                  value={formData.country}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  name="pincode"
                  label="Pincode"
                  margin="normal"
                  value={formData.pincode}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={3} mb={2}>
        <Button variant="outlined" onClick={() => router.back()}>
          Back
        </Button>
        <Button
          variant="contained"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Employee"}
        </Button>
      </Stack>
    </form>
  );
};

export default CreateEmployee;
