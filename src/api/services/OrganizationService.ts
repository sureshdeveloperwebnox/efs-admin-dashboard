import { toast } from 'sonner';

export const GetOrganizationService = async (id: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}organization/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // This enables cookie sending
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || 'Request failed');
    }

    const result = await response.json();

    console.log("result organization", result);
    
    toast.success(result.message);
    return result;
  } catch (error: any) {
    console.error(error);
    toast.error(error.message || 'Unexpected error occurred');
    throw new Error(error.message || 'Unexpected error occurred');
  }
};
