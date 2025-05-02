'use client';

import React, { useState, FocusEvent, SyntheticEvent } from 'react';

// next
import Image from 'next/legacy/image';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

// material-ui
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// third-party
import * as Yup from 'yup';
import { preload } from 'swr';
import { Formik } from 'formik';

// project imports
import FirebaseSocial from './FirebaseSocial';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { APP_DEFAULT_PATH } from 'config';
import { fetcher } from 'utils/axios';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import { login } from 'api/services/login/index';

const GoogleIcon = '/assets/images/icons/google.svg';

// ============================|| AUTH LOGIN ||============================ //

export default function AuthLogin({ providers, csrfToken }: any) {
  const router = useRouter();
  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [checked, setChecked] = useState(false);
  const [capsWarning, setCapsWarning] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const onKeyDown = (keyEvent: any) => {
    if (keyEvent.getModifierState('CapsLock')) {
      setCapsWarning(true);
    } else {
      setCapsWarning(false);
    }
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);

    // Get current URL for proper redirect after authentication
    // const currentUrl = window.location.origin + APP_DEFAULT_PATH;

    // Redirect to backend Google auth endpoint with redirect URL as query parameter
    window.location.href = `http://localhost:3000/api/auth/google`;
  };

  return (
    <>
      {/* Social Login Options */}
      <Box sx={{ mt: 3 }}>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
          <AnimateButton>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth={downSM}
              startIcon={
                googleLoading ?
                  <CircularProgress size={16} color="inherit" /> :
                  <Image src={GoogleIcon} alt="Google" width={16} height={16} />
              }
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              sx={{
                justifyContent: 'center',
                height: 46,
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'rgba(66, 133, 244, 0.04)'
                }
              }}
            >
              {!downSM && (googleLoading ? 'Connecting...' : 'Sign in with Google')}
            </Button>
          </AnimateButton>
        </Stack>
      </Box>


      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string()
            .required('Password is required')
            .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim())
            .max(10, 'Password must be less than 10 characters')
        })}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          try {
            const trimmedEmail = values.email.trim();

            const payload = {
              email: trimmedEmail,
              password: values.password
            }
            const response = await login(payload);

            router.push("/dashboard")
          } catch (error: any) {
            console.error('Login error:', error);
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <Grid container spacing={3}>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    color={capsWarning ? 'warning' : 'primary'}
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={(event: FocusEvent<any, Element>) => {
                      setCapsWarning(false);
                      handleBlur(event);
                    }}
                    onKeyDown={onKeyDown}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                  {capsWarning && (
                    <Typography variant="caption" sx={{ color: 'warning.main' }} id="warning-helper-text-password-login">
                      Caps lock on!
                    </Typography>
                  )}
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>

              <Grid sx={{ mt: -1 }} size={12}>
                <Stack direction="row" sx={{ gap: 2, alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Keep me sign in</Typography>}
                  />

                  <Link variant="h6" component={NextLink} href={'/forget-pass'} color="text.primary">
                    Forgot Password?
                  </Link>
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid size={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid size={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
      {Object.values(providers).map((provider: any) => {

console.log("provider", provider);

if (provider.id === 'login' || provider.id === 'register') {
  return;
}
})}
    </>
  );
}