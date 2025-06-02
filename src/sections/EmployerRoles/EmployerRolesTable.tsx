import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Switch, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import NoDataLottieComponent from 'components/CustomComponents/NoDataLottie';
import MainCard from 'components/MainCard';
import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { UpdateEmployeeRoleService, ToggleEmployeeRoleStatusService } from 'api/services/EmployeeRolesAPIService';

export function EmployerRolesTable(props: { roles: any[] }) {
	const [employeeRoles, setEmployeeRoles] = useState(props.roles || []);
	const [dialogueView, setDialogueView] = useState(false);
	const [selectedRole, setSelectedRole] = useState<string>("");

	// Toggle role status using API
	async function onStatusChange(id: number) {
		try {
			const updatedRole = await ToggleEmployeeRoleStatusService({ id });
			if (updatedRole) {
				setEmployeeRoles((prev) =>
					prev.map((ele) => (ele.id === id ? { ...ele, is_active: updatedRole.is_active } : ele))
				);
			}
		} catch (error) {
			console.error("Failed to update role status:", error);
		}
	}

	const handleDialogueOpen = () => setDialogueView(true);
	const handleDialogueClose = () => setDialogueView(false);

	function handleEdit(index: number) {
		console.log(`Editing role at index ${index}`);
	}

	// Handle new role creation
	async function handleUpdate(roleName: string) {
		try {
			if (!roleName.trim()) return;
			const response = await UpdateEmployeeRoleService({ name: roleName });
			if (response) {
				console.log(response);
				setEmployeeRoles((prev) =>
					prev.map((ele) => (ele.id === response.id ? { ...ele, name: response.name } : ele))
				);
			}
			handleDialogueClose();
		} catch (error) {
			console.error("Error updating role:", error);
		}
	}

	function DialogueForRole() {
		return (
			<Dialog open={dialogueView} onClose={handleDialogueClose}>
				<DialogTitle>Create Employer Role</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						required
						margin="dense"
						id="role"
						name="role"
						label="Role"
						fullWidth
						variant="standard"
						onChange={(e) => setSelectedRole(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogueClose}>Cancel</Button>
					<Button type="submit" onClick={() => handleUpdate(selectedRole)}>Create</Button>
				</DialogActions>
			</Dialog>
		);
	}

	return (
		<MainCard>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>SNO</TableCell>
							<TableCell>Employer Roles</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{employeeRoles.length > 0 ? (
							employeeRoles.map((role, index) => (
								<TableRow key={role.id || index}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>{role.name}</TableCell>
									<TableCell>
										<Tooltip title="Edit">
											<IconButton
												sx={{
													color: '#1778ff',
													'&:hover': { backgroundColor: 'rgba(23, 120, 255, 0.1)' }
												}}
												onClick={() => handleEdit(index)}
											>
												<FaEdit />
											</IconButton>
										</Tooltip>
										<Tooltip title={role.is_active === 1 ? 'Deactivate' : 'Activate'}>
											<IconButton>
												<Switch
													checked={role.is_active === 1}
													size="small"
													onChange={() => onStatusChange(role.id)}
												/>
											</IconButton>
										</Tooltip>
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
			<DialogueForRole />
		</MainCard>
	);
}

export default EmployerRolesTable;