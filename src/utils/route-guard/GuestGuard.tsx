'use client';

import { useEffect } from 'react';

// next
import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';

// project imports
import Loader from 'components/Loader';
import { APP_DEFAULT_PATH } from 'config';

// types
import { GuardProps } from 'types/auth';

// ==============================|| GUEST GUARD ||============================== //

export default function GuestGuard({ children }: GuardProps) {
  // const { data: session, status } = useSession();
  // const router = useRouter();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (json?.protected) {
  //       const redirectPath = APP_DEFAULT_PATH;
  //       router.push(redirectPath);
  //     }
  //   };
  //   fetchData();

  //   // eslint-disable-next-line
  // }, []);

  // if (status === 'loading') return <Loader />;

  return children;
}
