import { toast } from "sonner";

export interface AuthOrganizationRegisterPayload {
  organization_name: string;
  industry_name: string;
  email: string;
  pincode: string;
  website: string;
  address: string;
}

export const authOrganizationRegister = async (data: any) => {
  console.log('data', data);
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/organizationRegister`, {
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