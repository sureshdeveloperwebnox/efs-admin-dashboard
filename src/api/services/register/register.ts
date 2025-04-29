// services/registerService.ts
export interface RegisterPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  organization?: string;
  pincode?: string;
  website?: string;
  address?: string;
}

export const registerUser = async (data: RegisterPayload) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }

    return result;
  } catch (error: any) {
    throw new Error(error.message || 'Unexpected error occurred');
  }
};
