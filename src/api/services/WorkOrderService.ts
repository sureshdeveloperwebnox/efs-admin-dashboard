import { organization_id } from 'utils';
import { GETAPIService, GETALLAPIService, POSTAPIService, PUTAPIService, GETALLAPIBYIDService } from './MainService';



export const CreateWorkOrderService = async (workorderdata: any) => {
   const response = await POSTAPIService({
    routename: "work-order",
    payload: {...workorderdata, organization_id} 
   });
    return response;
};


export const GetWorkOrderService = async (id: number) => {
   const response = await GETAPIService({
    routename: "work-order",
    id: Number(id)
   });
    return response;
};

export const UpdateWorkOrderService = async (workorderdata: any) => {
  const { id } = workorderdata;
   const response = await PUTAPIService({
    routename: "work-order",
    id: Number(id),
    payload: workorderdata
   });
    return response;
};


export const GetAllWorkOrderService = async () => {
   const response = await GETALLAPIService({
    routename: "work-order/getAllOrder"
   });
    return response;
};



