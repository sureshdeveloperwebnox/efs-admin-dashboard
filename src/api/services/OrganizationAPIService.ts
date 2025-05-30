
import { organization_id } from 'utils';
import { GETAPIService, GETALLAPIService, POSTAPIService, PUTAPIService } from './MainAPIService';



export const CreateOrganizationService = async (orgdata: any) => {
   const response = await POSTAPIService({
    routename: "organization",
    payload: {...orgdata, organization_id} 
   });
    return response;
};


export const GetOrganizationService = async (id: number) => {
   const response = await GETAPIService({ 
    routename: "organization",
    id: Number(id)
   });
    return response;
};



export const UpdateOrganizationService = async (orgdata: any) => {
  const { id } = orgdata;
   const response = await PUTAPIService({
    routename: "organization",
    id: Number(id),
    payload: orgdata
   });
    return response;
};


export const GetAllOrganizationService = async () => {
   const response = await GETALLAPIService({
    routename: "organization/getAllOrganization"
   });
    return response;
};


