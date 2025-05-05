'use client';

import { useEffect } from 'react';

// next
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// project imports
import Loader from 'components/Loader';

// types
import { GuardProps } from 'types/auth';
import { setCookie } from 'cookies-next';

// ==============================|| AUTH GUARD ||============================== //

export default function AuthGuard({ children }: GuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/auth/protected');
      const json = await res?.json();

      console.log('json', json);

      console.log("sessionsss", session);


      setCookie('accessToken', session?.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
    
      
      
      if (!json?.protected) {
        router.push('/login');
      }
    };
    fetchData();

    // eslint-disable-next-line
  }, [session]);

  if (status === 'loading' || !session?.user) return <Loader />;

  return children;
}
