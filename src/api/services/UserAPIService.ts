import { organization_id } from 'utils';
import { GETAPIService, GETALLAPIService, POSTAPIService, PUTAPIService, GETALLAPIBYIDService } from './MainAPIService';


export const GetAllUserService = async (data: any) => {
   const response = await GETALLAPIBYIDService({
    routename: "auth/getAllUser",
    payload: { ...data, organization_id: organization_id }
   });
    return response;
};
