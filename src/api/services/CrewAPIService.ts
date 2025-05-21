import { organization_id } from 'utils';
import { GETAPIService, POSTAPIService, PUTAPIService, GETALLAPIBYIDService } from './MainAPIService';



export const CreateCrewService = async (crewdata: any) => {
   const response = await POSTAPIService({
    routename: "crew",
    payload: {...crewdata, organization_id} 
   });
    return response;
};


export const GetCrewService = async (id: number) => {
   const response = await GETAPIService({
    routename: "crew",
    id: Number(id)
   });
    return response;
};

export const UpdateCrewService = async (crewdata: any) => {
  const { id } = crewdata;
   const response = await PUTAPIService({
    routename: "crew",
    id: Number(id),
    payload: crewdata
   });
    return response;
};


export const GetAllCrewService = async () => {
   const response = await GETALLAPIBYIDService({
    routename: "crew/getAllCrew",
    payload: { organization_id: organization_id }
   });
    return response;
};

