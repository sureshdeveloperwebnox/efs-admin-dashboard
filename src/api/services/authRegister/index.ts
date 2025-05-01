import { toast } from "sonner";

export interface AuthRegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
}

export const authRegister = async (data: AuthRegisterPayload) => {
  console.log('data', data);
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/authRegister`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
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