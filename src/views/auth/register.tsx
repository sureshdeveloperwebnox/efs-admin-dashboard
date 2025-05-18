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
import AuthRegister from 'sections/auth/auth-forms/AuthRegister';

// ================================|| REGISTER ||================================ //

export default function Register() {
  const csrfToken = getCsrfToken();
  const providers = getProviders();

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={6}>
          <NextLink href="/organization-register" passHref legacyBehavior>
            <Link variant="body1" color="primary">
              Register a organization?
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
          <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Register a user</Typography>

          </Stack>
        </Grid>
        <Grid size={12}>
          <AuthRegister providers={providers} csrfToken={csrfToken} />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
