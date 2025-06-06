'use client';

import MainCard from "components/MainCard";

import EmployeeTable from "sections/Employee/EmployeeTable";
import EmployeeTabs from "views/Employee/EmployeeTabs";

export default function handleCreatePage() {

    return (
        <MainCard> 
            <EmployeeTabs />
        </MainCard>  
    )
} 