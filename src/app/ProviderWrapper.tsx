'use client';

import { ReactElement } from 'react';

// next
import { SessionProvider } from 'next-auth/react';

// project imports
import ThemeCustomization from 'themes';
import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';
import RTLLayout from 'components/RTLLayout';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';
import { ConfigProvider } from 'contexts/ConfigContext';

// ✅ Import Toaster from sonner
import { Toaster } from 'sonner';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function ProviderWrapper({ children }: { children: ReactElement }) {
  return (
    <ConfigProvider>
      <ThemeCustomization>
        <RTLLayout>
          <Locales>
            <ScrollTop>
              {/* <SessionProvider refetchInterval={0}> */}
                <Notistack>
                  <Snackbar />
                  <Toaster richColors position="top-right" /> {/* ✅ Add this */}
                  {children}
                </Notistack>
              {/* </SessionProvider> */}
            </ScrollTop>
          </Locales>
        </RTLLayout>
      </ThemeCustomization>
    </ConfigProvider>
  );
}
