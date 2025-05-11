'use client';

import React, { useState, FocusEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

import Image from 'next/legacy/image';
import NextLink from 'next/link';

// MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Link from '@mui/material/Link';
import { Theme } from '@mui/material/styles';

// Icons
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// Formik & Yup
import { Formik } from 'formik';
import * as Yup from 'yup';

// Project Components
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from 'components/@extended/IconButton';

// Config
import { APP_DEFAULT_PATH } from 'config';
// import { login } from 'api/services/login';

const GoogleIcon = '/assets/images/icons/google.svg';

export default function AuthLogin({ csrfToken }: { csrfToken: string }) {
  // const router = useRouter();
  const { data: session, status } = useSession();

  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [checked, setChecked] = useState(false);
  const [capsWarning, setCapsWarning] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
  }, [session, status]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.SyntheticEvent) => event.preventDefault();
  const onKeyDown = (e: React.KeyboardEvent) => setCapsWarning(e.getModifierState('CapsLock'));

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl: '/google', redirect: true });
  };
  

  return (
    <>
      {/* Google Sign-in */}
      <Box sx={{ mt: 3 }}>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
          <AnimateButton>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth={downSM}
              startIcon={
                googleLoading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <Image src={GoogleIcon} alt="Google" width={16} height={16} />
                )
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

      {/* Login Form */}
      <Formik
        initialValues={{ email: '', password: '', submit: null }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').required('Email is required'),
          password: Yup.string()
            .required('Password is required')
            .test('no-whitespace', 'Password cannot start or end with spaces', (val) => val === val?.trim())
            .max(20, 'Password must be less than 20 characters')
        })}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          try {
             await signIn('login', {
              redirect: false,
              email: values.email.trim(),
              password: values.password,
              callbackUrl: APP_DEFAULT_PATH
            });


          } catch (error: any) {
            console.error('Login error:', error);
            setErrors({ submit: error?.message || 'Login failed' });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

            <Grid container spacing={3}>
              {/* Email */}
              <Grid item xs={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    name="email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
              </Grid>

              {/* Password */}
              <Grid item xs={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    id="password-login"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={values.password}
                    onBlur={(e: FocusEvent<any>) => {
                      setCapsWarning(false);
                      handleBlur(e);
                    }}
                    onChange={handleChange}
                    onKeyDown={onKeyDown}
                    placeholder="Enter password"
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    color={capsWarning ? 'warning' : 'primary'}
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
                  />
                  {capsWarning && (
                    <Typography variant="caption" sx={{ color: 'warning.main' }}>
                      Caps lock on!
                    </Typography>
                  )}
                </Stack>
                {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
              </Grid>

              {/* Options */}
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Keep me signed in</Typography>}
                  />
                  <Link component={NextLink} href="/forget-pass" variant="h6">
                    Forgot Password?
                  </Link>
                </Stack>
              </Grid>

              {/* Submit error */}
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}

              {/* Submit button */}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    color="primary"
                    disabled={isSubmitting}
                    disableElevation
                  >
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
