import { toast } from 'sonner';

export const GetAllOrganizationService = async () => {
  try {
    // Get accessToken from cookies
    const getAccessTokenFromCookie = () => {
      const match = document.cookie.match(new RegExp('(^| )accessToken=([^;]+)'));
      return match ? match[2] : null;
    };

    const accessToken = getAccessTokenFromCookie();

    if (!accessToken) {
      throw new Error('Access token not found in cookies');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}organization/getAllOrganzation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
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
