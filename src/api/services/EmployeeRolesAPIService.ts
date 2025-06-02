import { organization_id } from 'utils';
import { GETAPIService, POSTAPIService, PUTAPIService, GETALLAPIBYIDService } from './MainAPIService';

export const CreateEmployeeRoleService = async (employeeRoleData: any) => {
	try {
		const response = await POSTAPIService({
			routename: 'employee-role',
			payload: { ...employeeRoleData, organization_id }
		});
		return response;
	} catch (error) {
		console.error('Error creating employee role:', error);
		return null;
	}
};

export const GetEmployeeRoleService = async (id: number) => {
	try {
		if (!id) throw new Error('Invalid role ID');
		const response = await GETAPIService({
			routename: 'employee-role',
			id: id
		});
		return response;
	} catch (error) {
		console.error('Error fetching employee role:', error);
		return null;
	}
};

export const UpdateEmployeeRoleService = async (employeeRoleData: any) => {
	try {
		if (!employeeRoleData.id) throw new Error('Missing employee role ID');
		const response = await PUTAPIService({
			routename: 'employee-role',
			id: employeeRoleData.id,
			payload: employeeRoleData
		});
		return response;
	} catch (error) {
		console.error('Error updating employee role:', error);
		return null;
	}
};

export const GetAllEmployeeRoleService = async () => {
	try {
		const response = await GETALLAPIBYIDService({
			routename: 'employee-role/getAllEmployeeRole',
			payload: { organization_id }
		});
		return response;
	} catch (error) {
		console.error('Error fetching all employee roles:', error);
		return null;
	}
};

export const ToggleEmployeeRoleStatusService = async (data: { id: number }) => {
	try {
		const response = await PUTAPIService({
            routename: 'employee-role/toggleEmployeeRoleStatus',
            id: data.id,
            payload: undefined
        });
		return response;
	} catch (error) {
		console.error('Error toggling employee role status:', error);
		return null;
	}
};