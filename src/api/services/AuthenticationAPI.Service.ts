import { toast } from "sonner";
import { setCookie } from 'cookies-next';

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