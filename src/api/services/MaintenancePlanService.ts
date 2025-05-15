import { organization_id } from 'utils';
import { GETAPIService, GETALLAPIService, POSTAPIService, PUTAPIService, GETALLAPIBYIDService } from './MainService';



export const CreateMaintenancePlanService = async (plandata: any) => {
   const response = await POSTAPIService({
    routename: "maintenance_plan",
    payload: {...plandata, organization_id} 
   });
    return response;
};


export const GetMaintenancePlanService = async (id: number) => {
   const response = await GETAPIService({
    routename: "maintenance_plan",
    id: Number(id)
   });
    return response;
};

export const UpdateMaintenancePlanService = async (plandata: any) => {
  const { id } = plandata;
   const response = await PUTAPIService({
    routename: "maintenance_plan",
    id: Number(id),
    payload: plandata
   });
    return response;
};


export const GetAllMaintenancePlanService = async () => {
   const response = await GETALLAPIService({
    routename: "maintenance_plan/getAllMaintenancePlan"
   });
    return response;
};

export const GetAllMaintenancePlanByID = async (plandata: any) => {
   const response = await GETALLAPIBYIDService({
    routename: "maintenance_plan/getAllMaintenancePlanByID",
    payload: plandata
   });
    return response;
};



