import type { Metadata } from 'next';

import './globals.css';

// project imports
import ProviderWrapper from './ProviderWrapper';

export const metadata: Metadata = {
  title: 'Easy Field Services',
  description: 'Easy Field Services'
};

export default function RootLayout({ children }: { children: React.ReactElement }) {
  return (
    <html lang="en">
      <body> 
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
