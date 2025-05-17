// next
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';

interface UserData {
  username?: string;
  email?: string;
  exp?: number;
  [key: string]: any; // For additional JWT claims
}


export default function useUser() {

  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  console.log("userData", userData);


  useEffect(() => {
    const handleAuth = async () => {
      try {

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



  if (userData) {
    const user = userData?.user;
    const provider = userData?.provider;
    let thumb = userData?.image || '/assets/images/users/avatar-1.png';
    if (provider === 'cognito') {
      const email = user?.email?.split('@');
      user!.name = email ? email[0] : 'Jone Doe';
    }

    // if (!user?.image) {
    //   user!.image = '/assets/images/users/avatar-1.png';
    //   thumb = '/assets/images/users/avatar-thumb-1.png';
    // }

    const newUser: UserData = {
      name: user?.name || '',
      email: user?.email || 'doe@codedthemes.com',
      avatar: user?.image || '/assets/images/users/avatar-1.png',
      thumb,
      role: 'UI/UX Designer'
    };

    return newUser;
  }
  return false;
}
