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

export const login = async (data: LoginPayload) => {
  console.log("data", data);
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    const accessToken = result.data.accessToken;

    console.log('accessToken', accessToken);


    // setCookie('accessToken', accessToken, {
    //   path: '/',
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax',
    // });

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