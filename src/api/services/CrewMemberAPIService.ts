import { organization_id } from 'utils';
import { GETAPIService, POSTAPIService, PUTAPIService, GETALLAPIBYIDService } from './MainAPIService';



export const CreateCrewMemberService = async (crewdata: any) => {
   const response = await POSTAPIService({
    routename: "crew-members",
    payload: {...crewdata, organization_id} 
   });
    return response;
};

export const GetCrewMemberService = async (id: number) => {
   const response = await GETAPIService({
    routename: "crew-members",
    id: Number(id)
   });
    return response;
};

export const UpdateCrewMemberService = async (crewdata: any) => {
  const { id } = crewdata;
   const response = await PUTAPIService({
    routename: "crew-members",
    id: Number(id),
    payload: crewdata
   });
    return response;
};

export const GetAllCrewMemberService = async () => {
   const response = await GETALLAPIBYIDService({
    routename: "crew-members/getAllCrewMember",
    payload: { organization_id: organization_id }
   });
    return response;
};


export const GetAllCrewMemberByIDService = async (crewdata: any) => {
   const response = await GETALLAPIBYIDService({
    routename: "crew-members/getAllCrewByID",
    payload: crewdata
   });
    return response;
};

