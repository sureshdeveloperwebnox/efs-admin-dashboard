import { organization_id } from 'utils';
import { GETAPIService, POSTAPIService, PUTAPIService, GETALLAPIBYIDService } from './MainAPIService';



export const CreateWorkOrderCrewService = async (workorderdata: any) => {
   const response = await POSTAPIService({
    routename: "work-order-crew",
    payload: {...workorderdata, organization_id} 
   });
    return response;
};


export const GetWorkOrderCrewService = async (id: number) => {
   const response = await GETAPIService({
    routename: "work-order-crew",
    id: Number(id)
   });
    return response;
};

export const UpdateWorkOrderCrewService = async (workorderdata: any) => {
  const { id } = workorderdata;
   const response = await PUTAPIService({
    routename: "work-order-crew",
    id: Number(id),
    payload: workorderdata
   });
    return response;
};


export const GetAllWorkOrderCrewService = async () => {
   const response = await GETALLAPIBYIDService({
    routename: "work-order-crew/getAllOrder",
    payload: {organization_id: organization_id}
   });
    return response;
};



