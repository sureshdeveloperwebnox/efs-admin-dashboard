"use client";

import React, { useEffect, useState } from "react";
import {
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Tab,
	TextField,
	Button,
	Stack,
	Typography,
	Chip,
	TableContainer,
	TableHead,
	TableRow,
	TableBody,
	IconButton,
	Switch,
	Table,
	TableCell,
	Tooltip
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { FaPlus, FaEdit } from "react-icons/fa";

import MainCard from "components/MainCard";
import BackButton from "components/CustomComponents/BackButton";
import NoDataLottieComponent from "components/CustomComponents/NoDataLottie";
import Loader from "components/Loader";
import {
	CreateEmployeeRoleService,
	GetAllEmployeeRoleService,
	ToggleEmployeeRoleStatusService,
	UpdateEmployeeRoleService
} from "api/services/EmployeeRolesAPIService";

interface EmployeeRole {
	id: number;
	name: string;
	is_active: number;
}

const EmployerRoles = () => {
	const [tabValue, setTabValue] = useState("all");
	const [dialogueView, setDialogueView] = useState(false);
	const [employeeRoles, setEmployeeRoles] = useState<EmployeeRole[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [roleName, setRoleName] = useState("");
	const [selectedRole, setSelectedRole] = useState<EmployeeRole | null>(null);

	useEffect(() => {
		const fetchRoles = async () => {
			try {
				const response: any = await GetAllEmployeeRoleService();
				setEmployeeRoles(response);
			} catch (err: any) {
				setError(err.message || "Failed to load roles");
			} finally {
				setIsLoading(false);
			}
		};
		fetchRoles();
	}, [isLoading]);

	const handleTabs = (_: React.SyntheticEvent, newValue: string) => {
		setTabValue(newValue);
	};

	const handleDialogueOpen = (role: EmployeeRole | null = null) => {
		setSelectedRole(role);
		setRoleName(role ? role.name : "");
		setDialogueView(true);
	};

	const handleDialogueClose = () => {
		setSelectedRole(null);
		setRoleName("");
		setDialogueView(false);
	};

	const handleCreateOrUpdate = async () => {
		if (!roleName.trim()) return;

		try {
			setIsLoading(true)
			if (selectedRole) {
				const updated: any = await UpdateEmployeeRoleService({ id: selectedRole.id, name: roleName });
				setEmployeeRoles((prev) =>
					prev.map((r) => (r.id === updated.id ? { ...r, name: updated.name } : r))
				);
			} else {
				const created = await CreateEmployeeRoleService({ name: roleName });
				setEmployeeRoles((prev: any) => [...prev, created]);
			}
			handleDialogueClose();
		} catch (err: any) {
			alert("Error saving role: " + err.message);
		} finally {
			setIsLoading(false)
		}
	};

	const onStatusChange = async (id: number, is_active: number) => {
		try {
			setIsLoading(true);
			const updated: any = await ToggleEmployeeRoleStatusService({ id, is_active });
			setEmployeeRoles((prev) =>
				prev.map((r) => (r.id === id ? { ...r, is_active: updated.is_active } : r))
			);
		} catch (err) {
			console.error("Status update failed", err);
		} finally {
			setIsLoading(false)
		}
	};

	const activeRoles = employeeRoles.filter((r) => r.is_active === 1);
	const inactiveRoles = employeeRoles.filter((r) => r.is_active !== 1);

	if (isLoading) return <Loader />;
	if (error) return <Typography color="error">{error}</Typography>;

	const renderTable = (roles: EmployeeRole[]) => (
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>SNO</TableCell>
						<TableCell>Role</TableCell>
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{roles.length ? (
						roles.map((role, index) => (
							<TableRow key={role.id}>
								<TableCell>{index + 1}</TableCell>
								<TableCell>{role.name}</TableCell>
								<TableCell>
									<Stack direction={"row"}>
										<Tooltip title="Edit">
											<IconButton onClick={() => handleDialogueOpen(role)}>
												<FaEdit />
											</IconButton>
										</Tooltip>
										<Tooltip title={role.is_active === 1 ? "Deactivate" : "Activate"}>
											<Switch
												checked={role.is_active === 1}
												onChange={() => onStatusChange(role.id, role.is_active)}
												size="small"
											/>
										</Tooltip>
									</Stack>
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={3}>
								<NoDataLottieComponent />
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);

	return (
		<MainCard>
			<Stack direction="row" justifyContent="space-between" mb={2}>
				<Box display="flex" alignItems="center">
					<BackButton />
					<Typography variant="h3">Employee Roles</Typography>
				</Box>
				<Button variant="contained" onClick={() => handleDialogueOpen()} startIcon={<FaPlus />}>
					New Role
				</Button>
			</Stack>

			<TabContext value={tabValue}>
				<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
					<TabList onChange={handleTabs}>
						<Tab
							label={
								<Box display="flex" gap={1} alignItems={"center"}>
									All <Chip label={employeeRoles.length} size="small" variant="outlined" color="primary" />
								</Box>
							}
							value="all"
						/>
						<Tab
							label={
								<Box display="flex" gap={1} alignItems={"center"}>
									Active <Chip label={activeRoles.length} size="small" variant="outlined" color="primary" />
								</Box>
							}
							value="active"
						/>
						<Tab
							label={
								<Box display="flex" gap={1}>
									Inactive <Chip label={inactiveRoles.length} size="small" variant="outlined" color="primary"/>
								</Box>
							}
							value="inactive"
						/>
					</TabList>
				</Box>

				<TabPanel value="all">{renderTable(employeeRoles)}</TabPanel>
				<TabPanel value="active">{renderTable(activeRoles)}</TabPanel>
				<TabPanel value="inactive">{renderTable(inactiveRoles)}</TabPanel>
			</TabContext>

			<Dialog open={dialogueView} onClose={handleDialogueClose}>
				<DialogTitle>{selectedRole ? "Edit" : "Create"} Employer Role</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Role"
						fullWidth
						variant="standard"
						value={roleName}
						onChange={(e) => setRoleName(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogueClose}>Cancel</Button>
					<Button onClick={handleCreateOrUpdate}>{selectedRole ? "Update" : "Create"}</Button>
				</DialogActions>
			</Dialog>
		</MainCard>
	);
};

export default EmployerRoles;