import { organization_id } from 'utils';
import { GETAPIService, GETALLAPIService, POSTAPIService, PUTAPIService } from './MainService';



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
   const response = await GETALLAPIService({
    routename: "assets/getAllAssets"
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



