import { IconButton, Switch } from '@mui/material'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material'
import MainCard from 'components/MainCard'
import React, { useEffect, useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

export function EmployerRolesTable(props: any) {

	const temp_employee_role: any =[ 
    { organization_id: "ORG002", name: "Creative Solutions", active: false },
    { organization_id: "ORG001", name: "Tech Innovators", active: true },
    { organization_id: "ORG003", name: "Future Vision", active: true },
    { organization_id: "ORG004", name: "Green Earth", active: false },
    { organization_id: "ORG005", name: "NextGen Systems", active: true },
    { organization_id: "ORG006", name: "Skyline Technologies", active: false },
    { organization_id: "ORG007", name: "Elite Developers", active: true },
    { organization_id: "ORG008", name: "Cybernetics Inc.", active: false },
    { organization_id: "ORG009", name: "Quantum Solutions", active: true },
    { organization_id: "ORG010", name: "InnovateX", active: false },
    { organization_id: "ORG011", name: "Pioneer Labs", active: true },
    { organization_id: "ORG012", name: "Bright Future Corp.", active: false },
    { organization_id: "ORG013", name: "Virtuoso Tech", active: true },
    { organization_id: "ORG014", name: "Synergy Systems", active: false },
    { organization_id: "ORG015", name: "Dynamic Solutions", active: true },
    { organization_id: "ORG016", name: "Agile Innovations", active: false },
    { organization_id: "ORG017", name: "Visionary Enterprises", active: true },
    { organization_id: "ORG018", name: "EcoTech Solutions", active: false },
    { organization_id: "ORG019", name: "AI Nexus", active: true },
    { organization_id: "ORG020", name: "Urban Futurists", active: false },
    { organization_id: "ORG021", name: "DeepMind Labs", active: true },
    { organization_id: "ORG022", name: "Neural Analytics", active: false },
    { organization_id: "ORG023", name: "Hyperloop Innovations", active: true },
    { organization_id: "ORG024", name: "Omega Systems", active: false },
    { organization_id: "ORG025", name: "Blockchain Gurus", active: true },
    { organization_id: "ORG026", name: "NextWave Technologies", active: false },
    { organization_id: "ORG027", name: "Horizon Tech", active: true },
    { organization_id: "ORG028", name: "Elevate Solutions", active: false },
    { organization_id: "ORG029", name: "AI Disruptors", active: true },
    { organization_id: "ORG030", name: "SmartCity Innovations", active: false }
]

	const [ employeeRole, setEmployeeRole] = useState<any>(temp_employee_role);
	useEffect(()=>{
		switch (props.status) {
			case "all": {
				break;
			}
			case "active": {
				let activeRoles = employeeRole.filter((role: any)=>role.active===true);
				setEmployeeRole(activeRoles)
				break;
			}
			case "inactive": {
				let activeRoles = employeeRole.filter((role: any)=>role.active!==true);
				setEmployeeRole(activeRoles)
				break;
			}
		}
	},[])

	function onEdit( index: number) {
		
	}

	function onDelete( index: number){

	}
	function onStatusChange( event: any, organization_id: string, index: number) {
		setEmployeeRole((prev: any) => 
            prev.map((ele: any, i:number) => 
              ele.organization_id === organization_id ? { ...ele, active: !ele.active } : ele
            )
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
				{
					employeeRole.map((role: any, index: number)=>(
						<TableRow>
							<TableCell>{index+1}</TableCell>
							<TableCell>{role.name}</TableCell>
							<TableCell>
								<Tooltip title="Edit">
									<IconButton
										sx={{
											color: '#1778ff',
											'&:hover': {
											backgroundColor: 'rgba(23, 120, 255, 0.1)'
											}
										}}
										onClick={() => onEdit(index)}
									>
										<FaEdit />
									</IconButton>
								</Tooltip>
								<Tooltip title={role.active ? 'Deactivate' : 'Activate'}>
									<IconButton>
									<Switch
										checked={role.active === true} 
										size="small" 
										onChange={(e) => onStatusChange(e, role.organization_id, index)} 
									/>
									</IconButton>
								</Tooltip>
								{
									(props.status==="inactive")&&
									<Tooltip title="Drop">
										<IconButton
											sx={{
												color: '#1778ff',
												'&:hover': {
												backgroundColor: 'rgba(23, 120, 255, 0.1)'
												}
											}}
											onClick={() => onEdit(index)}
										>
											<MdDelete/>
										</IconButton>
									</Tooltip>
								}
							</TableCell>
						</TableRow>
					))
				}
						<TableRow>
								<TableCell></TableCell>
						</TableRow>
				</TableBody>
				</Table>
			</TableContainer>
    </MainCard>
  )
}

export default EmployerRolesTable