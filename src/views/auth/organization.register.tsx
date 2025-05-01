'use client';

// next
import NextLink from 'next/link';
import { getProviders, getCsrfToken } from 'next-auth/react';

// material-ui
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthOrganizationRegister from 'sections/auth/auth-forms/AuthOrganizationRegister';
import { Box } from '@mui/material';

// ================================|| ORGANIZATION REGISTER ||================================ //

export default function OrganizationRegister() {
  const csrfToken = getCsrfToken();
  const providers = getProviders();

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Box>
          <Typography variant="h3">Organization Registration</Typography>
          </Box>
            {/* <NextLink href="/login" passHref legacyBehavior>
              <Link variant="body1" color="primary">
                Already have an account?
              </Link>
            </NextLink> */}
          </Stack>
        </Grid>
        <Grid size={12}>
          <AuthOrganizationRegister providers={providers} csrfToken={csrfToken} />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
