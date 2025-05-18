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
        <Grid size={6}>
          <NextLink href="/register" passHref legacyBehavior>
            <Link variant="body1" color="primary">
              Register a user?
            </Link>
          </NextLink>
        </Grid>
        <Grid size={6}>
          <NextLink href="/login" passHref legacyBehavior>
            <Link variant="body1" color="primary">
              Already have an account?
            </Link>
          </NextLink>
        </Grid>

        <Grid size={12}>
          <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h3">Registration a Organization</Typography>
            </Box>

          </Stack>
        </Grid>
        <Grid size={12}>
          <AuthOrganizationRegister providers={providers} csrfToken={csrfToken} />
        </Grid>

      </Grid>
    </AuthWrapper>
  );
}
