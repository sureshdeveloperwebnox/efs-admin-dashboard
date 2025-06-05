import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Switch,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import NoDataLottieComponent from "components/CustomComponents/NoDataLottie";
import { useEmployeeRolesStore } from "store/useEmployeeRoleStore";

interface EmployeeRole {
  id: string;
  organization_id: string;
  name: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface EmployeeRolesTableProps {
  roles: EmployeeRole[];
}

export const EmployerRolesTable = ({ roles }: EmployeeRolesTableProps) => {
  const {
    selectedRole,
    setSelectedRole,
    toggleEmployeeRole,
    updateEmployeeRole,
  } = useEmployeeRolesStore();

  const [dialogueView, setDialogueView] = useState(false);
  const [roleName, setRoleName] = useState("");

  // Open dialog and set role name
  const handleDialogueOpen = (role: EmployeeRole) => {
    setSelectedRole(role);
    setRoleName(role.name); // initialize input
    setDialogueView(true);
  };

  // Close dialog
  const handleDialogueClose = () => {
    setDialogueView(false);
    setRoleName("");
    setSelectedRole(null);
  };

  // Handle update click
  const handleUpdate = async () => {
    if (!selectedRole) return;
    await updateEmployeeRole({
      ...selectedRole,
      name: roleName,
    });
    handleDialogueClose(); // close after update
  };

  // Toggle status
  const onStatusChange = async (id: string, is_active: number) => {
    await toggleEmployeeRole(id, is_active);
  };

  return (
    <Box>
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
                    <Stack direction="row">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleDialogueOpen(role)}>
                          <FaEdit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={
                          role.is_active === 1 ? "Deactivate" : "Activate"
                        }
                      >
                        <Switch
                          checked={role.is_active === 1}
                          onChange={() =>
                            onStatusChange(role.id, role.is_active)
                          }
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

      <Dialog open={dialogueView} onClose={handleDialogueClose}>
        <DialogTitle>Update Employee Role</DialogTitle>
        <DialogContent>
          <DialogContentText>Update the role name below:</DialogContentText>
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
          <Button onClick={handleUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployerRolesTable;