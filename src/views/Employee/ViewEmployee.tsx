"use client";

import { TableBody, TableRow } from "@mui/material";
import { TableCell } from "@mui/material";
import { Avatar, Button, Grid, Stack, Table, TableContainer, Typography } from "@mui/material";
// import BackButton from "components/CustomComponents/BackButton";
import MainCard from "components/MainCard";
import { useRouter } from "next/navigation";
import { getEmployeeRoleById } from "utils/constants/EMPLOYEE_ROLE";


export default function ViewEmployee(){
    const router = useRouter();
    interface Employee {
        organization_id: string;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        password: string;
        job_title: string;
        employee_role_id: string;
        gender: string;
        address: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
        skill: Array<string>;
        experience_years: string;
    }

    const data: Employee = {
        organization_id: "21221",
        first_name: "Emily",
        last_name: "Smith",
        email: "emily.smith@example.com",
        phone: "+1987654321",
        password: "hr@secure2024",
        job_title: "HR Manager",
        employee_role_id: "1",
        gender: "Female",
        address: "456 Oak Avenue",
        city: "Chicago",
        state: "IL",
        country: "USA",
        pincode: "60601",
        skill: ["Recruitment", "Employee Relations", "Payroll"],
        experience_years: "8",
    }

    return(
        <MainCard>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h3">View Employee</Typography>
                        <Button variant="outlined" onClick={()=>{router.back()}}>Back</Button>
                        {/* <BackButton /> */}
                    </Stack>
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                    <Stack spacing={0.5} alignItems="center">
                        <Avatar
                        src={data?.first_name+" "+data?.last_name}
                        alt={data?.first_name || 'Customer Avatar'}
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <Stack spacing={0.2} alignItems="center">
                        <Typography variant="h5">{data?.first_name + " " + data?.last_name || 'No name available'}</Typography>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={8} >
                    <TableContainer>
                        <Table>
                            <>
                            {/* <TableBody>
                                {
                                    Object.keys(data).map((key)=>(
                                        (key !== "organization_id") &&
                                        <TableRow>
                                            <TableCell>
                                                <Typography
                                                    variant="body"
                                                    sx={{
                                                    textWrap: 'nowrap'
                                                    }}
                                                >
                                                    {formatUnderScoreString(key)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle1">{ (Array.isArray(data[key])? formatArrayAsString(data[key], ", ") : data[key]) || "-"}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody> */}
                            </>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="body"sx={{textWrap: 'nowrap'}}>Name</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{data?.first_name + " " + data?.last_name  || "-"}</Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <Typography variant="body"sx={{textWrap: 'nowrap'}}>Email:</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{data?.email || "-"}</Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <Typography variant="body"sx={{textWrap: 'nowrap'}}>Phone:</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{data?.phone || "-"}</Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <Typography variant="body"sx={{textWrap: 'nowrap'}}>Gender:</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{data?.gender || "-"}</Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <Typography variant="body"sx={{textWrap: 'nowrap'}}>Job Title</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{data?.job_title || "-"}</Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <Typography variant="body"sx={{textWrap: 'nowrap'}}>Employer Role:</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{ getEmployeeRoleById(data?.employee_role_id || "-")}</Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <Typography variant="body"sx={{textWrap: 'nowrap'}}>Gender:</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{data?.gender || "-"}</Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <Typography variant="body"sx={{textWrap: 'nowrap'}}>Address</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{data?.address || "-"}</Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <Typography variant="body"sx={{textWrap: 'nowrap'}}>City:</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{data?.city || "-"}</Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <Typography variant="body"sx={{textWrap: 'nowrap'}}>State</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{data?.state || "-"}</Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <Typography variant="body"sx={{textWrap: 'nowrap'}}>Country:</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{data?.country || "-"}</Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <Typography variant="body"sx={{textWrap: 'nowrap'}}>Pincode:</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{data?.pincode || "-"}</Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <Typography variant="body"sx={{textWrap: 'nowrap'}}>Skill</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{data?.skill || "-"}</Typography>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <Typography variant="body"sx={{textWrap: 'nowrap'}}>Experience</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle1">{data?.experience_years}</Typography>
                                    </TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </MainCard>
    )
}