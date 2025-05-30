import { toast } from "sonner";
import { setCookie } from 'cookies-next';
import { POSTAPIService } from "./MainAPIService";
import { CurrentDateTime } from "utils";

export interface LoginPayload {
    email: string;
    password: string;
    organization?: string;
    pincode?: string;
    website?: string;
    address?: string;
}

interface LoginResponse {
    data?: {
        accessToken: string;
        [key: string]: any;
    };
    message?: string;
    success?: boolean;
    [key: string]: any;
}

export interface RegisterPayload {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    user_type: string;
}

export const Login = async (data: LoginPayload): Promise<LoginResponse> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include' // Important for cookies

        });

        const result: LoginResponse = await response.json();

        if (!response.ok) {
            const errorMessage = result.message || 'Login failed';
            toast.error(errorMessage);
            throw new Error(errorMessage);
        }

        if (!result.data?.accessToken) {
            throw new Error('No access token received');
        }
        setCookie('accessToken', result.data?.accessToken, {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        setCookie('refreshToken', result.data?.refreshToken, {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        toast.success(result.message || 'Login successful');
        return result;
    } catch (error: any) {
        console.error('Login error:', error);

        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            toast.error('Network error. Please check your connection.');
            throw new Error('Network error');
        }

        toast.error(error.message || 'An unexpected error occurred');
        throw error;
    }
};

export const Register = async (data: RegisterPayload) => {
    console.log('data', data);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({...data, date_time: CurrentDateTime})
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Login failed');
        }

        toast.success(result.message); // Show success toast only after confirming success

        return result;
    } catch (error: any) {
        toast.error(error.message || 'Unexpected error occurred'); // Optional: show an error toast too
        throw new Error(error.message || 'Unexpected error occurred');
    }
};




