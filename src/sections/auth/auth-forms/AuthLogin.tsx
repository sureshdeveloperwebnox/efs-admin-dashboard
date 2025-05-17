'use client';

import React, { useState, FocusEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/legacy/image';
import NextLink from 'next/link';

// MUI imports (unchanged)
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

// Icons (unchanged)
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// Formik & Yup (unchanged)
import { Formik } from 'formik';
import * as Yup from 'yup';

// Project Components (unchanged)
import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from 'components/@extended/IconButton';

// Config (unchanged)
import { APP_DEFAULT_PATH } from 'config';
import { Login } from 'api/services/AuthenticationAPI.Service';

interface FormValues {
  email: string;
  password: string;
  submit: string | null;
}

export default function AuthLogin({ csrfToken }: { csrfToken: string }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  
  const [checked, setChecked] = useState(false);
  const [capsWarning, setCapsWarning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.SyntheticEvent) => event.preventDefault();
  const onKeyDown = (e: React.KeyboardEvent) => setCapsWarning(e.getModifierState('CapsLock'));

  const handleSubmit = async (values: FormValues, { setErrors, setSubmitting }: { 
    setErrors: (errors: { submit?: string }) => void;
    setSubmitting: (isSubmitting: boolean) => void;
  }) => {
    try {
      const result = await Login({
        email: values.email,
        password: values.password
      });

      if (result) {
        router.push(APP_DEFAULT_PATH); // Use configured default path
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({ submit: error.message || 'Login failed. Please check your credentials.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{ email: '', password: '', submit: null }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email('Must be a valid email')
            .required('Email is required'),
          password: Yup.string()
            .required('Password is required')
            .test('no-whitespace', 'Password cannot start or end with spaces', (val) => val === val?.trim())
            .max(20, 'Password must be less than 20 characters')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

            <Grid container spacing={3}>
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
                {touched.email && errors.email && (
                  <FormHelperText error>{errors.email}</FormHelperText>
                )}
              </Grid>

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
                {touched.password && errors.password && (
                  <FormHelperText error>{errors.password}</FormHelperText>
                )}
              </Grid>

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
                </Stack>
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}

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