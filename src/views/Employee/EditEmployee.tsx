"use client";

import { Box, InputLabel, TextField } from "@mui/material";
import { RadioGroup } from "@mui/material";
import { Button, Grid, Typography } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import { FormControl } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Select } from "@mui/material";
import { Radio } from "@mui/material";
import { Stack } from "@mui/material";
import MultiTextInput from "components/CustomComponents/MultiTextInput";
import MainCard from "components/MainCard";
import PhoneInputField from "components/phone/PhoneInputField";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { employee_role } from "utils/constants/EMPLOYEE_ROLE";

export default function EditEmployee() {
  const employerRole = employee_role;
  const params = useParams();
  const id = params.id;

  interface FormData {
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
    skill: Array<string>;
    experience_years: string;
  }

  const initialFormData: FormData = {
    organization_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    job_title: "",
    employee_role_id: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    skill: [] as string[],
    experience_years: "",
  }

  const [ formData, setFormData] = useState(initialFormData)
  const [ requiredSkills, setRequiredSkills] = useState<string[]>([])

  useEffect(() => {
    setFormData(prev => ({ ...prev, skill: requiredSkills }));
}, [requiredSkills]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value} = e.target;
    setFormData((prev)=>({...prev, [name]:value }))
  }
  function handleSubmit(event: any) {
    event.preventDefault();
  }

  const router = useRouter();
  function goToPreviousPage(e: any) {
    router.back();
  }

  return (

    <form action="">
      <Grid container spacing={2}>
        {/* Employee Details */}
        <Grid item xs={12} md={6}>
          <MainCard>
            <Box>
              <Typography variant="h5">Employee</Typography>
            </Box>

            {/* organizationID */}
            <TextField
              name="organization_id" 
              label="ID NO" 
              margin="normal" 
              value={id} 
              onChange={handleChange}
              inputProps={{ readOnly: true }}
              fullWidth 
            />

            {/* FIRST NAME */}
            <TextField 
              name="first_name" 
              label="First Name"
              margin="normal" 
              value={formData.first_name}
              onChangeCapture={handleChange}
              fullWidth 
            />

            {/* LAST NAME */}
            <TextField 
              name="last_name" 
              label="Last Name"
              margin="normal" 
              value={formData.last_name} 
              onChange={handleChange}
              fullWidth
            />

            {/* EMAIL */}
            <TextField 
              name="email" 
              label="Email" 
              margin="normal" 
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />

            {/* PHONE */}
            <PhoneInputField
              value={formData.phone}
              onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
              defaultCountry="IN"
            />

            {/* PASSWORD */}
            <TextField 
              name="password" 
              label="Password" 
              margin="normal" 
              value={formData.password}
              onChange={handleChange}
              fullWidth 
            />

            {/* GENDER  */}
            <RadioGroup 
              aria-labelledby="employee_creation_gender_label" 
              defaultValue={(formData.gender==="")?"male":formData.gender} 
              name="gender" 
              row
            >
              <p>Gender:&emsp;</p>
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
            </RadioGroup>

          </MainCard>
        </Grid>

        {/* Other Details */}
        <Grid item xs={12} md={6}>
          <MainCard>
            <Box>
              <Typography variant="h5">Other Details</Typography>
            </Box>

            {/* EMPLOYEE ROLE */}
            <Box marginTop={2}>
              <FormControl fullWidth>
                <InputLabel id="create_employee_role_id">Employer Role</InputLabel>
                <Select
                  labelId="create_employee_role_id"
                  name="employee_role_id"
                  value={formData.employee_role_id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, employee_role_id: e.target.value }))}
                  fullWidth
                >
                  {employerRole.map((ele, index) => (
                    <MenuItem key={index} value={String(index)}>
                      {ele}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* SKILL  */}
            <Box sx={{marginTop: "1rem"}}>
                <MultiTextInput
                    label="Required Skills"
                    values={requiredSkills}
                    onChange={setRequiredSkills}
                    maxItems={10}
                />
            </Box>

            {/* ADDRESS  */}
            <TextField name="address" label="Location" fullWidth margin="normal" value={formData.address} onChange={handleChange}/>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField name="city" label="City" fullWidth margin="normal" value={formData.city} onChange={handleChange}/>
                <TextField name="state" label="State" fullWidth margin="normal" value={formData.state} onChange={handleChange}/>
                <TextField name="experience_years" label="Total Experience (years)" fullWidth margin="normal" value={formData.experience_years} onChange={handleChange}/>
              </Grid>
              <Grid item xs={6}>
                <TextField name="country" label="Country" fullWidth margin="normal" value={formData.country} onChange={handleChange}/>
                <TextField name="pincode" label="Pincode" fullWidth margin="normal" value={formData.pincode} onChange={handleChange}/>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Button variant="outlined" onClick={goToPreviousPage}>Back</Button>
        <Button variant="contained" onClick={handleSubmit}>Update Employee</Button>
      </Stack>
    </form>
    
  );
}