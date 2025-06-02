"use client";

import { Box, Dialog, DialogActions, Tab, TextField, Button, Stack, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import React, { useEffect, useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import EmployerRolesTable from 'sections/EmployerRoles/EmployerRolesTable';
import BackButton from 'components/CustomComponents/BackButton';
import { FaPlus } from 'react-icons/fa6';
import { DialogTitle, DialogContent } from '@mui/material';
import { CreateEmployeeRoleService, GetAllEmployeeRoleService } from 'api/services/EmployeeRolesAPIService';
import NoDataLottieComponent from 'components/CustomComponents/NoDataLottie';
import Loader from 'components/Loader';

export const EmployerRoles = () => {
	const [tabValue, setTabValue] = useState("all");
	const [dialogueView, setDialogueView] = useState(false);
	const [employeeRoles, setEmployeeRoles] = useState<{ id: number; name: string; is_active: number }[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		const fetchRoles = async () => {
			try {
				const response: any = await GetAllEmployeeRoleService();
				if (response) setEmployeeRoles(response);
				else throw new Error("Failed to fetch employee roles");
			} catch (error: any) {
				setError(error.message);
			} finally {
				setIsLoading(false);
			}
		};
		fetchRoles();
	}, []);

	const handleDialogueOpen = () => setDialogueView(true);
	const handleDialogueClose = () => setDialogueView(false);

	async function handleCreate(role: string) {
		if (!role.trim()) return;
		const response: any = await CreateEmployeeRoleService({name: role});
		if (response.staus==="success") {
			console.log("Create Role response : ",response);
			alert("Role created: "+ response.name)
      	}
		handleDialogueClose();
	}

	function handleTabs(event: React.SyntheticEvent, newValue: string) {
		setTabValue(newValue);
	}

	const activeRoles = employeeRoles.filter((role) => role.is_active === 1);
	const inactiveRoles = employeeRoles.filter((role) => role.is_active !== 1);

	if (isLoading) return <Loader />;
	if (error) return <Typography color="error">{error}</Typography>;

	return (
		<MainCard>
			<Stack direction="row" justifyContent="space-between">
				<Box sx={{ display: "flex" }}>
					<BackButton />
					<Typography variant="h3">Employee Roles</Typography>
				</Box>
				<Button variant="contained" onClick={handleDialogueOpen} startIcon={<FaPlus />}>
					New Role
				</Button>
			</Stack>

			{employeeRoles.length === 0 ? (
				<NoDataLottieComponent />
			) : (
				<TabContext value={tabValue}>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<TabList onChange={handleTabs}>
							<Tab label="All" value="all" />
							<Tab label="Active" value="active" />
							<Tab label="Inactive" value="inactive" />
						</TabList>
					</Box>
					<TabPanel value="all">
						<EmployerRolesTable roles={employeeRoles} />
					</TabPanel>
					<TabPanel value="active">
						<EmployerRolesTable roles={activeRoles} />
					</TabPanel>
					<TabPanel value="inactive">
						<EmployerRolesTable roles={inactiveRoles} />
					</TabPanel>
				</TabContext>
			)}

			<DialogueForRole />
		</MainCard>
	);

	function DialogueForRole() {
		return (
			<Dialog open={dialogueView} onClose={handleDialogueClose}>
				<DialogTitle>Create Employer Role</DialogTitle>
				<DialogContent>
					<TextField autoFocus required margin="dense" id="role" name="role" label="Role" fullWidth variant="standard" />
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogueClose}>Cancel</Button>
					<Button type="submit" onClick={() => handleCreate(document.getElementById('role')?.value)}>Create</Button>
				</DialogActions>
			</Dialog>
		);
	}
}