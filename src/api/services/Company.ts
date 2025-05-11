import { organization_id } from 'utils';
import { GETAPIService, GETALLAPIService, POSTAPIService, PUTAPIService } from './MainService';



export const CreateCompanyService = async (companydata: any) => {
   const response = await POSTAPIService({
    routename: "company",
    payload: {...companydata, organization_id} 
   });
    return response;
};


export const GetCompanyService = async (id: number) => {
   const response = await GETAPIService({
    routename: "company",
    id: Number(id)
   });
    return response;
};

export const UpdateCompanyService = async (companydata: any) => {
  const { id } = companydata;
   const response = await PUTAPIService({
    routename: "company",
    id: Number(id),
    payload: companydata
   });
    return response;
};


export const GetAllCompanyService = async () => {
   const response = await GETALLAPIService({
    routename: "company/getAllCompany"
   });
    return response;
};




