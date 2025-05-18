import { organization_id } from 'utils';
import { GETAPIService, POSTAPIService, PUTAPIService, GETALLAPIBYIDService } from './MainAPIService';



export const CreateCustomerService = async (customerdata: any) => {
   const response = await POSTAPIService({
    routename: "customers",
    payload: {...customerdata, organization_id} 
   });
    return response;
};


export const GetCustomerService = async (id: number) => {
   const response = await GETAPIService({
    routename: "customers",
    id: Number(id)
   });
    return response;
};

export const UpdateCustomerService = async (customerdata: any) => {
  const { id } = customerdata;
   const response = await PUTAPIService({
    routename: "customers",
    id: Number(id),
    payload: customerdata
   });
    return response;
};


export const GetAllCustomerService = async () => {
   const response = await GETALLAPIBYIDService({
    routename: "customers/getAllCustomer",
    payload: {organization_id: organization_id}
   });
    return response;
};


export const UpdateCustomerStatusService = async (customerdata: any) => {
  const { id } = customerdata;
   const response = await PUTAPIService({
    routename: "customers/updateCustomerStatus",
    id: Number(id),
    payload: customerdata
   });
    return response;
};


export const GetAllCustomerByIDService = async (customerdata: any) => {
   const response = await GETALLAPIBYIDService({
    routename: "customers/getAllCustomerByID",
    payload: customerdata
   });
    return response;
};
