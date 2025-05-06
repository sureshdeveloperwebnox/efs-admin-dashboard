'use client'; // 👈 Required at the top for client components

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ✅ correct router for App Router
import { getSession } from 'next-auth/react';
import { setCookie } from 'cookies-next';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const redirectWithToken = async () => {
      const session = await getSession();
      const accessToken = session?.accessToken || "";

      setCookie('accessToken', accessToken, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });


    };

    redirectWithToken();
  }, [router]);

  return <div>Dashboard</div>;
}
