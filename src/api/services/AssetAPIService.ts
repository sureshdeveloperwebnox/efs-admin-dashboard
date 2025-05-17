import { organization_id } from 'utils';
import { GETAPIService, GETALLAPIService, POSTAPIService, PUTAPIService, GETALLAPIBYIDService, GETALLAPIBYService } from './MainAPIService';



export const CreateAssetService = async (assetdata: any) => {
   const response = await POSTAPIService({
    routename: "assets",
    payload: {...assetdata, organization_id} 
   });
    return response;
};


export const GetAssetService = async (id: number) => {
   const response = await GETAPIService({
    routename: "assets",
    id: Number(id)
   });
    return response;
};

export const UpdateAssetService = async (assetdata: any) => {
  const { id } = assetdata;
   const response = await PUTAPIService({
    routename: "assets",
    id: Number(id),
    payload: assetdata
   });
    return response;
};


export const GetAllAssetService = async () => {
   const response = await GETALLAPIBYIDService({
    routename: "assets/getAllAssets",
    payload: {organization_id: organization_id}
   });
    return response;
};


export const UpdateAssetStatusService = async (assetdata: any) => {
  const { id } = assetdata;
   const response = await PUTAPIService({
    routename: "assets/updateCustomerStatus",
    id: Number(id),
    payload: assetdata
   });
    return response;
};



export const GetAllAssetByIDService = async (assetdata: any) => {
   const response = await GETALLAPIBYIDService({
    routename: "assets/getAllAssetByID",
    payload: assetdata
   });
    return response;
};