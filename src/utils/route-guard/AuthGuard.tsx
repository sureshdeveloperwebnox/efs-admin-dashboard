'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from 'components/Loader';
import { GuardProps } from 'types/auth';
import Cookies from 'js-cookie'; // Client-side alternative

// Client-side cookie access
export const getAccessTokenFromCookie = (): { accessToken: string | null } => {
  if (typeof window === 'undefined') {
    // Server-side - use different approach
    return { accessToken: null };
  }
  const accessToken = Cookies.get('accessToken') || null;
  return { accessToken };
};

// Server-side helper (for getServerSideProps)
export const getAccessTokenFromRequest = (req: any): { accessToken: string | null } => {
  const accessToken = req.cookies.accessToken || null;
  return { accessToken };
};


export default function AuthGuard({ children }: GuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAuth = () => {
      try {
        // Client-side token check
        const accessToken = getAccessTokenFromCookie().accessToken;
        
        if (!accessToken) {
          throw new Error('No token found');
        }

        // Simple token presence check - for more security, implement proper JWT validation
        // or call an API endpoint to verify the token
        const tokenParts = accessToken.split('.');
        if (tokenParts.length !== 3) {
          throw new Error('Invalid token format');
        }

        // For actual JWT validation without jsonwebtoken package, you could:
        // 1. Just check token presence (as above) and rely on backend validation
        // 2. Use a lightweight JWT library like jwt-decode
        // 3. Call an API endpoint to validate the token
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication error:', error);
        setIsAuthenticated(false);
        router.push('/login');
      }
    };

    verifyAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return null; // or redirect to login (handled by useEffect)
  }

  return children;
}