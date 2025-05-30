'use client';

import { Box, Button, Stack, Typography } from "@mui/material";
import MainCard from "components/MainCard";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";

import EmployeeTable from "sections/Employee/EmployeeTable";

export default function handleCreatePage() {

    return (
        <MainCard> 
            <EmployeeTable />
        </MainCard>  
    )
}