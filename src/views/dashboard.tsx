'use client';
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  username?: string;
  email?: string;
  exp?: number;
  [key: string]: any; // For additional JWT claims
}

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  console.log("userData", userData);
  

  useEffect(() => {
    const handleAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const accessToken = getCookie('accessToken');
        
        if (!accessToken || typeof accessToken !== 'string') {
          throw new Error('No access token found');
        }

        // Basic JWT payload parsing (without verification)
        const payload = parseJwtPayload(accessToken);
        
        // Check token expiration
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          throw new Error('Token expired');
        }

        setUserData(payload);
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err instanceof Error ? err.message : 'Failed to authenticate');
        router.push('/login'); // Redirect to login on error
      } finally {
        setIsLoading(false);
      }
    };

    handleAuth();
  }, [router]);

  const parseJwtPayload = (token: string): UserData => {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) throw new Error('Invalid token format');
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error('Token parsing error:', err);
      throw new Error('Failed to parse token');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {userData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
          <div className="space-y-2">
            {userData.name && (
              <p className="text-gray-700">
                <span className="font-medium">Username:</span> {userData.name}
              </p>
            )}
            {userData.email && (
              <p className="text-gray-700">
                <span className="font-medium">Email:</span> {userData.email}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}