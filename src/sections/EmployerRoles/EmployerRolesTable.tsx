import { IconButton } from '@mui/material'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material'
import MainCard from 'components/MainCard'
import React from 'react'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { employee_role } from 'utils/constants/EMPLOYEE_ROLE'

const EmployerRolesTable = () => {

	function onEdit( index: number) {

	}

	function onDelete( index: number){

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
						employee_role.map((role, index)=>(
							<TableRow>
								<TableCell>{index+1}</TableCell>
								<TableCell>{role}</TableCell>
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