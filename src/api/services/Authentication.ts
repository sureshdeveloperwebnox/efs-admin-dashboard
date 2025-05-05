import { toast } from 'sonner';
import { setCookie } from 'cookies-next';



export const GoogleSignup = async () => {

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/google`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    const accessToken = result.data.accessToken;

    console.log('accessToken', accessToken);

    setCookie('accessToken', accessToken, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

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
