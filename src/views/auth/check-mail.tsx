'use client';

// next
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';
import AuthWrapper from 'sections/auth/AuthWrapper';
import FirebaseSocial from 'sections/auth/auth-forms/FirebaseSocial';

// ================================|| CHECK MAIL ||================================ //

export default function CheckMail() {
  const { data: session } = useSession();
  const downSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Box sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Hi, Check Your Mail</Typography>
            <Typography color="secondary" sx={{ mb: 0.5, mt: 1.25 }}>
              We have sent a password recover instructions to your email.
            </Typography>
          </Box>
        </Grid>
        <Grid size={12}>
          <AnimateButton>
            <NextLink href={session ? '/pages/login' : '/login'}>
              <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="primary">
                Sign in
              </Button>
            </NextLink>
          </AnimateButton>
        </Grid>
        <Grid size={12}>
          <Divider>
            <Typography variant={downSM ? 'subtitle1' : 'h5'}>Sign up with</Typography>
          </Divider>
        </Grid>
        <Grid size={12}>
          <FirebaseSocial />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
