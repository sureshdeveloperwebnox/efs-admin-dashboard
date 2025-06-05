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
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { FaPlus } from "react-icons/fa";

import MainCard from "components/MainCard";
import BackButton from "components/CustomComponents/BackButton";
import NoDataLottieComponent from "components/CustomComponents/NoDataLottie";
import Loader from "components/Loader";
import EmployerRolesTable from "sections/EmployerRoles/EmployerRolesTable";
import { useEmployeeRolesStore } from "store/useEmployeeRoleStore";

const EmployerRoles = () => {
  const [tabValue, setTabValue] = useState("all");
  const [dialogueView, setDialogueView] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const {
    employeeRoles,
    activeRoles,
    inactiveRoles,
    error,
    isLoading,
    getEmployeeRoles,
    createEmployeeRoles,
  } = useEmployeeRolesStore();

  useEffect(() => {
    getEmployeeRoles();
  }, []);

  const handleTabs = (_: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleDialogueOpen = () => {
    setRoleName("");
    setDialogueView(true);
  };

  const handleDialogueClose = () => {
    setRoleName("");
    setDialogueView(false);
  };

  const handleCreate = async () => {
    if (!roleName.trim()) {
      alert("Role name cannot be empty");
      return;
    }

    const exists = employeeRoles.some(
      (role) => role.name.toLowerCase() === roleName.toLowerCase()
    );
    if (exists) {
      alert("Role already exists");
      return;
    }

    setIsCreating(true);
    try {
      await createEmployeeRoles(roleName); // Will throw on error
      handleDialogueClose();
    } catch (err: any) {
      alert("Error saving role: " + (err.message || "Unknown error"));
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) return <Loader />;
  // if (error) return <Typography color="error">{error}</Typography>;

  return (
    <MainCard>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center">
          <BackButton />
          <Typography variant="h3">Employee Roles</Typography>
        </Box>
        <Button variant="contained" onClick={handleDialogueOpen} startIcon={<FaPlus />}>
          New Role
        </Button>
      </Stack>

      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleTabs}>
            <Tab
              label={
                <Box display="flex" gap={1} alignItems="center">
                  All <Chip label={employeeRoles.length} size="small" variant="outlined" color="primary" />
                </Box>
              }
              value="all"
            />
            <Tab
              label={
                <Box display="flex" gap={1} alignItems="center">
                  Active <Chip label={activeRoles.length} size="small" variant="outlined" color="primary" />
                </Box>
              }
              value="active"
            />
            <Tab
              label={
                <Box display="flex" gap={1}>
                  Inactive <Chip label={inactiveRoles.length} size="small" variant="outlined" color="primary" />
                </Box>
              }
              value="inactive"
            />
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

      <Dialog open={dialogueView} onClose={handleDialogueClose}>
        <DialogTitle>Create Employer Role</DialogTitle>
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
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default EmployerRoles;
