import { organization_id } from 'utils';
import { GETAPIService, POSTAPIService, PUTAPIService, GETALLAPIBYIDService } from './MainAPIService';



export const CreateEmployeeService = async (employeeData: any) => {
   const response = await POSTAPIService({
    routename: "employee",
    payload: {...employeeData, organization_id} 
   });
    return response;
}; 

 
export const GetEmployeeService = async (id: string) => {
   const response = await GETAPIService({
    routename: "employee",
    id: Number(id)
   });
    return response;
}; 

export const UpdateEmployeeService = async (employeeData: any) => {
  const { id } = employeeData;
   const response = await PUTAPIService({
    routename: "employee",
    id: Number(id),
    payload: employeeData
   });
    return response;
};


export const GetAllEmployeeService = async () => {
   const response = await GETALLAPIBYIDService({
    routename: "employee/getAllEmployee",
    payload: {organization_id: organization_id}
   });
    return response; 
};


export const UpdateEmployeeStatusService = async (employeeData: any) => {
  const { id } = employeeData;
   const response = await PUTAPIService({
    routename: "employee/updateEmployeeStatus",
    id: Number(id),
    payload: employeeData
   });
    return response;
};


export const GetAllEmployeeByIDService = async (employeeData: any) => {
   const response = await GETALLAPIBYIDService({
    routename: "employee/getAllCustomerByID",
    payload: employeeData
   });
    return response;
};

export const ToggleEmployeeStatusService = async (data: { id: number, is_active: number }) => {
	try {
		const response = await PUTAPIService({
            routename: 'employee/toggleEmployeeStatus',
            id: data.id,
            payload: data
        });
		return response;
	} catch (error) {
		console.error('Error toggling employee role status:', error);
		return null;
	}
};