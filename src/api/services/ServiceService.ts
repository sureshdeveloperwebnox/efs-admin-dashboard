import { organization_id } from 'utils';
import { GETAPIService, GETALLAPIService, POSTAPIService, PUTAPIService, GETALLAPIBYIDService } from './MainService';



export const CreateServiceService = async (customerdata: any) => {
   const response = await POSTAPIService({
    routename: "service",
    payload: {...customerdata, organization_id} 
   });
    return response;
};


export const GetServiceService = async (id: number) => {
   const response = await GETAPIService({
    routename: "service",
    id: Number(id)
   });
    return response;
};

export const UpdateServiceService = async (customerdata: any) => {
  const { id } = customerdata;
   const response = await PUTAPIService({
    routename: "service",
    id: Number(id),
    payload: customerdata
   });
    return response;
};


export const GetAllServiceService = async () => {
   const response = await GETALLAPIService({
    routename: "service/getAllService"
   });
    return response;
};





export const GetAllServiceByIDService = async (customerdata: any) => {
   const response = await GETALLAPIBYIDService({
    routename: "service/getAllServiceByID",
    payload: customerdata
   });
    return response;
};
