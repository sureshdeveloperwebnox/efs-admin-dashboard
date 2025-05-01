import GuestGuard from 'utils/route-guard/GuestGuard';
import { Toaster } from 'sonner';
import { GuardProps } from 'types/auth';
import React from 'react';

export default function Layout({ children }: GuardProps) {
  return (
    <GuestGuard>
      <>
        <Toaster richColors position="top-right" />
        {children}
      </>
    </GuestGuard>
  );
}
