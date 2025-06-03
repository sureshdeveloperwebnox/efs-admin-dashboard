'use client';

import MainCard from "components/MainCard";

import EmployeeTable from "sections/Employee/EmployeeTable";

export default function handleCreatePage() {

    return (
        <MainCard> 
            <EmployeeTable />
        </MainCard>  
    )
} 