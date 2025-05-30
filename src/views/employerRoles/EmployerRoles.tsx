"use client";

import { Box, IconButton, Tab, TableBody } from '@mui/material';
import { Tooltip } from '@mui/material';
import { TableRow } from '@mui/material';
import { Button, Stack, Table, TableCell, TableContainer, TableHead, Typography } from '@mui/material'
import MainCard from 'components/MainCard'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FaEdit } from 'react-icons/fa';
import { employee_role } from 'utils/constants/EMPLOYEE_ROLE';
import { MdDelete } from "react-icons/md";
import { TabContext, TabList, TabPanel } from '@mui/lab';


export const EmployerRoles = () => {

	const router = useRouter();
	const [tabValue, setTabValue] = useState("1");

	function handleChange(event: any) {
		console.log("Hi from employee roles")
	}

	function handleBack(event: any) {
			router.back();
	}

	function handleTabs(event: React.SyntheticEvent, newValue: string) {
    setTabValue(newValue);
  };



  return (
    <MainCard>
        <Stack direction={"row"} justifyContent={"space-between"}>
					<Typography variant="h3">Employee Roles</Typography>
					<Button variant="outlined" onClick={handleBack}> Back </Button>
        </Stack>
				<TabContext value={tabValue}>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<TabList onChange={handleTabs} aria-label="lab API tabs example">
							<Tab label="All" value="1" />
							<Tab label="Active" value="2" />
							<Tab label="Inactive" value="3" />
						</TabList>
					</Box>
					<TabPanel value="1">Item One</TabPanel>
					<TabPanel value="2">Item Two</TabPanel>
					<TabPanel value="3">Item Three</TabPanel>
				</TabContext>
    </MainCard>
  )
}
