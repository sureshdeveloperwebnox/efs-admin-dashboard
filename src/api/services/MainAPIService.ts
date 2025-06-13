import { toast } from 'sonner';
import { getAccessTokenFromCookie } from 'utils';
import { APIURL } from 'utils/api-url';
import { CurrentDateTime } from 'utils/date-time';
const { accessToken } = getAccessTokenFromCookie();

interface GETModel {
    routename: string;
    id: number;
}

interface GETALLBYIDModel<T = unknown> {
    routename: string;
    payload: T
}

interface GETALLModel {
    routename: string;
}


interface POSTModel<T = unknown> {
    routename: string;
    payload: T;
}

interface PUTModel<T = unknown> {
    routename: string;
    id: number;
    payload: T;
}

interface APIResponse {
    message?: string;
    data?: any;
    [key: string]: any;
}

const commonHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    // date_time: CurrentDateTime
};

const handleResponse = async (response: Response): Promise<APIResponse> => {
    if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || 'Request failed');
    }
    // console.log("response", response);

    return await response.json();
};

export const POSTAPIService = async <T = unknown>(data: POSTModel<T>) => {
    const { routename, payload } = data;
    console.log("payload", payload);

    try {
        if (!accessToken) {
            throw new Error('Access token not found');
        }

        const response = await fetch(`${APIURL}${routename}`, {
            method: 'POST',
            headers: commonHeaders,
            body: JSON.stringify(payload)
        });

        const result = await handleResponse(response);
        toast.success(result?.message);
        return result;
    } catch (error: any) {
        console.error('POST Error:', error);
        toast.error(error.message || 'Unexpected error occurred');
        throw error;
    }
};

export const GETAPIService = async <R = unknown>(data: GETModel): Promise<R> => {
    const { routename, id } = data;

    console.log("dataGET", data);

    try {
        if (!accessToken) {
            throw new Error('Access token not found');
        }

        const response = await fetch(`${APIURL}${routename}/${id}`, {
            method: 'GET',
            headers: commonHeaders
        });

        const result = await handleResponse(response);
        // toast.success(result?.message);
        return result?.data;
    } catch (error: any) {
        console.error('GET Error:', error);
        toast.error(error.message || 'Unexpected error occurred');
        throw error;
    }
};

export const PUTAPIService = async <T = unknown>(data: PUTModel<T>) => {
    const { routename, id, payload } = data;
    try {
        if (!accessToken) {
            throw new Error('Access token not found');
        }

        const response = await fetch(`${APIURL}${routename}/${id}`, {
            method: 'PUT',
            headers: commonHeaders,
            body: JSON.stringify(payload)
        });

        const result = await handleResponse(response);
        toast.success(result?.message);
        return result;
    } catch (error: any) {
        console.error('PUT Error:', error);
        toast.error(error.message || 'Unexpected error occurred');
        throw error;
    }
};

export const GETALLAPIService = async <R = unknown>(data: GETALLModel): Promise<R> => {
    const { routename } = data;
    try {
        if (!accessToken) {
            throw new Error('Access token not found');
        }

        const response = await fetch(`${APIURL}${routename}`, {
            method: 'POST',
            headers: commonHeaders
        });

        const result = await handleResponse(response);
        // toast.success(result?.message);
        return result?.data;
    } catch (error: any) {
        console.error('GET Error:', error);
        toast.error(error.message || 'Unexpected error occurred');
        throw error;
    }
};

export const GETALLAPIBYIDService = async <R = unknown>(data: GETALLBYIDModel): Promise<R> => {
    const { routename, payload } = data;
    try {
        if (!accessToken) {
            throw new Error('Access token not found');
        }

        const response = await fetch(`${APIURL}${routename}`, {
            method: 'POST',
            headers: commonHeaders,
            body: JSON.stringify(payload)


        });

        const result = await handleResponse(response);
        // toast.success(result?.message);
        return result?.data;
    } catch (error: any) {
        console.error('GET Error:', error);
        toast.error(error.message || 'Unexpected error occurred');
        throw error;
    }
};


