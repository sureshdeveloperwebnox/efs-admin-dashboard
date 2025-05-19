import { organization_id } from 'utils';
import { GETAPIService, GETALLAPIService, POSTAPIService, PUTAPIService, GETALLAPIBYIDService } from './MainAPIService';

export const CreateEquipmentService = async (equipmentData: any) => {
  const response = await POSTAPIService({
    routename: 'equipments',
    payload: { ...equipmentData, organization_id }
  });
  return response;
};

export const GetEquipmentService = async (id: number) => {
  const response = await GETAPIService({
    routename: 'equipments',
    id: Number(id)
  });
  return response;
};

export const UpdateEquipmentService = async (equipmentData: any) => {
  const { id } = equipmentData;
  const response = await PUTAPIService({
    routename: 'equipments',
    id: Number(id),
    payload: equipmentData
  });
  return response;
};

export const GetAllEquipmentsService = async () => {
  const response = await GETALLAPIBYIDService({
    routename: 'equipments/getAllEquipment',
    payload: { organization_id: organization_id }
  });
  return response;
};

// You can add more specific equipment services as needed
export const GetAvailableEquipmentsService = async () => {
  const response = await GETALLAPIService({
    routename: 'equipments/getAvailableEquipments'
  });
  return response;
};

export const GetAllEquipmentByIDService = async (customerdata: any) => {
  const response = await GETALLAPIBYIDService({
    routename: 'equipments/getAllEquipmentByID',
    payload: customerdata
  });
  return response;
};
