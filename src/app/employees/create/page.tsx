'use client';

import { Box, Stack, Typography } from "@mui/material";
import MainCard from "components/MainCard";
import CreateEmployee from "views/Employee/CreateEmployee";


export default function CreateEmployeePage() {
    return(
        <>
            <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h3">Create Employees</Typography>
                </Stack>
            </Box>
            <CreateEmployee />
        </>
    )
}