'use client';

import { Box, Button, Stack, Typography } from "@mui/material";
import MainCard from "components/MainCard";
import NextLink from "next/link"
import { FiPlus } from "react-icons/fi";

import EmployeeTable from "sections/Employee/EmployeeTable";

export default function EmployeePage() {

    return (
        <MainCard>
            <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h3">Crew Members</Typography>
                    <Button 
                        LinkComponent={NextLink}
                        href = {"/employees/create"}
                        variant="contained" 
                        startIcon={<FiPlus/>}> Create Employee
                    </Button>
                </Stack>
            </Box>
            <EmployeeTable />
        </MainCard>  
    )
}