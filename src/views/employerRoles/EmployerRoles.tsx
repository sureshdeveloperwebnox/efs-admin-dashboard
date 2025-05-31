"use client";

import { Box, Dialog, DialogActions, Tab, TextField } from '@mui/material';
import { Button, Stack, Typography } from '@mui/material'
import MainCard from 'components/MainCard'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { TabContext, TabList, TabPanel } from '@mui/lab';
import EmployerRolesTable from 'sections/EmployerRoles/EmployerRolesTable';
import BackButton from 'components/CustomComponents/BackButton';
import { FaPlus } from 'react-icons/fa6';
import { DialogTitle } from '@mui/material';
import { DialogContent } from '@mui/material';


export const EmployerRoles = () => {

	const router = useRouter();
	const [tabValue, setTabValue] = useState("1");
	const [dialogueView, setDialogueView] = useState(false);

	const handleDialogueOpen = () => {
		setDialogueView(true);
	};

	const handleDialogueClose = () => {
		setDialogueView(false);
	};

	function handleCreate( event: any) {

	}

	function handleTabs(event: React.SyntheticEvent, newValue: string) {
    setTabValue(newValue);
  };


  return (
    <MainCard>
        <Stack direction={"row"} justifyContent={"space-between"}>
			<Box sx={{display:"flex"}}>
				<BackButton/>
				<Typography variant="h3">Employee Roles</Typography>
			</Box>
			<Button variant="contained" onClick={handleDialogueOpen} startIcon={<FaPlus/>}> New Roles </Button>
        </Stack>
		<TabContext value={tabValue}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<TabList onChange={handleTabs} aria-label="lab API tabs example">
					<Tab label="All" value="1" />
					<Tab label="Active" value="2" />
					<Tab label="Inactive" value="3" />
				</TabList>
			</Box>
			<TabPanel value="1"><EmployerRolesTable status="all"/></TabPanel>
			<TabPanel value="2"><EmployerRolesTable status="active"/></TabPanel>
			<TabPanel value="3"><EmployerRolesTable status="inactive"/></TabPanel>
		</TabContext>



		<Dialog
			open={dialogueView}
			onClose={handleDialogueClose}
			slotProps={{
			paper: {
				component: 'form',
				onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
				event.preventDefault();
				const formData = new FormData(event.currentTarget);
				const formJson = Object.fromEntries((formData as any).entries());
				const email = formJson.email;
				console.log(email);
				handleDialogueClose;
				},
			},
			}}
		>
			<DialogTitle>Create Employer Role</DialogTitle>
			<DialogContent>
			{/* <DialogContentText>
				To subscribe to this website, please enter your email address here. We
				will send updates occasionally.
			</DialogContentText> */}
			<TextField
				autoFocus
				required
				margin="dense"
				id="name"
				name="email"
				label="Role"
				type="email"
				fullWidth
				variant="standard"
			/>
			</DialogContent>
			<DialogActions>
			<Button onClick={handleDialogueClose}>Cancel</Button>
			<Button type="submit">Create</Button>
			</DialogActions>
		</Dialog>
    </MainCard>
  )
}
