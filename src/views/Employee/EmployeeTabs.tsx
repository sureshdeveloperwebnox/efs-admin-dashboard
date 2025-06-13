import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Chip } from '@mui/material';
import { Box, Button, Stack, Tab, Typography } from '@mui/material';
import MainCard from 'components/MainCard'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa6';
import EmployeeTable from "sections/Employee/EmployeeTable";
import { useEmployeeStore } from "store/useEmployeeStore";

const EmployeeTabs = () => {

    const router = useRouter();
    const {
        employees, activeEmployees, inactiveEmployees,
        getAllEmployees
    } = useEmployeeStore();

    useEffect(() => {
        getAllEmployees();
    }, []);

    const [tabValue, setTabValue] = useState<string>("all");

    const handleTabs = (_: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    const handleCreatePage = () => {
        router.push("/employees/create");
    };



    return (
        <MainCard>
            <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h3">Employees</Typography>
                    <Button variant="contained" onClick={handleCreatePage} startIcon={<FaPlus />}>
                        Create Employee
                    </Button>
                </Stack>
            </Box>

            <Box>
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <TabList onChange={handleTabs}>
                            <Tab
                                label={
                                    <Box display="flex" gap={1} alignItems="center">
                                        All <Chip label={employees.length} size="small" variant="outlined" color="primary" />
                                    </Box>
                                }
                                value="all"
                            />
                            <Tab
                                label={
                                    <Box display="flex" gap={1} alignItems="center">
                                        Active <Chip label={activeEmployees.length} size="small" variant="outlined" color="primary" />
                                    </Box>
                                }
                                value="active"
                            />
                            <Tab
                                label={
                                    <Box display="flex" gap={1}>
                                        Inactive <Chip label={inactiveEmployees.length} size="small" variant="outlined" color="primary" />
                                    </Box>
                                }
                                value="inactive"
                            />
                        </TabList>
                    </Box>

                    <TabPanel value="all">
                        <EmployeeTable employeeListType={"all"} />
                    </TabPanel>
                    <TabPanel value="active">
                        <EmployeeTable employeeListType={"active"} />
                    </TabPanel>
                    <TabPanel value="inactive">
                        <EmployeeTable employeeListType={"inactive"} />
                    </TabPanel>
                </TabContext>
            </Box>

        </MainCard>
    )
}

export default EmployeeTabs