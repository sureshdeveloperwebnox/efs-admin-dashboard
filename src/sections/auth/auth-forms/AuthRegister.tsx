'use client';

import { useEffect, useState, SyntheticEvent } from 'react';

// next
import Image from 'next/legacy/image';
import NextLink from 'next/link';
import { signIn } from 'next-auth/react';

// material-ui
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import FirebaseSocial from './FirebaseSocial';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { APP_DEFAULT_PATH } from 'config';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// types
import { StringColorProps } from 'types/password';
import PhoneInputField from 'components/phone/PhoneInputField';
import TextField from '@mui/material/TextField';
const Auth0 = '/assets/images/icons/auth0.svg';
const Cognito = '/assets/images/icons/aws-cognito.svg';
const Google = '/assets/images/icons/google.svg';

// ============================|| AWS CONNITO - LOGIN ||============================ //

export default function AuthRegister({ providers, csrfToken }: any) {
  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const [level, setLevel] = useState<StringColorProps>();
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [phone, setPhone] = useState('');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          name: '',
          lastname: '',
          email: '',
          phone: '',
          organization: '',
          password: '',
          pincode: '',
          website: '',
          address: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
          organization: Yup.string().max(255).required('Organization is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string()
            .required('Password is required')
            .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim())
            .max(10, 'Password must be less than 10 characters')
        })}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          const trimmedEmail = values.email.trim();
          signIn('register', {
            redirect: false,
            firstname: values.name,
            lastname: values.lastname,
            email: trimmedEmail,
            password: values.password,
            organization: values.organization,
            pincode: values.pincode,
            website: values.website,
            address: values.address,
            callbackUrl: APP_DEFAULT_PATH
          }).then((res: any) => {
            if (res?.error) {
              setErrors({ submit: res.error });
              setSubmitting(false);
            }
          });
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

            {/* Step 1 : Registration Details */}
            {currentStep === 1 && (
              <Grid container spacing={3}>
                {/* Name Field */}
                <Grid size={12}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="name-signup">Name*</InputLabel>
                    <OutlinedInput
                      id="name-login"
                      type="name"
                      value={values.name}
                      name="name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter your Name"
                      fullWidth
                      error={Boolean(touched.name && errors.name)}
                    />
                  </Stack>
                  {touched.name && errors.name && (
                    <FormHelperText error id="helper-text-name-signup">
                      {errors.name}
                    </FormHelperText>
                  )}
                </Grid>

                {/* Organization Name */}
                <Grid size={12}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="organization-signup">Organization Name</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.organization && errors.organization)}
                      id="organization-signup"
                      value={values.organization}
                      name="organization name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter your organization name"
                      inputProps={{}}
                    />
                  </Stack>
                  {touched.organization && errors.organization && (
                    <FormHelperText error id="helper-text-organization-signup">
                      {errors.organization}
                    </FormHelperText>
                  )}
                </Grid>

                {/* Email Address */}
                <Grid size={12}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.email && errors.email)}
                      id="email-login"
                      type="email"
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      inputProps={{}}
                    />
                  </Stack>
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email-signup">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Grid>

                {/* Phone */}
                <Grid size={12}>
                  <Stack sx={{ gap: 1 }}>
                    <PhoneInputField
                      value={phone}
                      onChange={setPhone} // clean one-argument function
                      label="Mobile Number"
                      defaultCountry="IN"
                    />
                  </Stack>
                  {touched.phone && errors.phone && (
                    <FormHelperText error id="helper-text-phone-signup">
                      {errors.phone}
                    </FormHelperText>
                  )}
                </Grid>

                {/* Password */}
                <Grid size={12}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="password-signup">Password</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      id="password-signup"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      name="password"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        changePassword(e.target.value);
                      }}
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
                  </Stack>
                  {touched.password && errors.password && (
                    <FormHelperText error id="helper-text-password-signup">
                      {errors.password}
                    </FormHelperText>
                  )}
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid>
                        <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                      </Grid>
                      <Grid>
                        <Typography variant="subtitle1" fontSize="0.75rem">
                          {level?.label}
                        </Typography>
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>

                {/* Privacy Policy */}
                <Grid sx={{ mt: -1 }} size={12}>
                  <Typography variant="body2">
                    By Signing up, you agree to our &nbsp;
                    <Link variant="subtitle2" component={NextLink} href="#">
                      Terms of Service
                    </Link>
                    &nbsp; and &nbsp;
                    <Link variant="subtitle2" component={NextLink} href="#">
                      Privacy Policy
                    </Link>
                  </Typography>
                </Grid>
                {errors.submit && (
                  <Grid size={12}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Grid>
                )}
              </Grid>
            )}
            {/*  Step 2 : User Details */}
            {currentStep === 2 && (
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="address-signup">Address</InputLabel>
                    <Box sx={{ width: 500, maxWidth: '100%' }}>
                      <TextField
                        fullWidth
                        id="address"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.address && errors.address)}
                        multiline
                        rows={4}
                        placeholder="Enter your address"
                      />
                    </Box>
                    {touched.address && errors.address && (
                      <FormHelperText error id="helper-text-address-signup">
                        {errors.address}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid size={12}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="pincode-signup">Pincode</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.pincode && errors.pincode)}
                      id="pincode-signup"
                      value={values.pincode}
                      name="pincode name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter your pincode"
                      inputProps={{}}
                    />
                  </Stack>
                  {touched.pincode && errors.pincode && (
                    <FormHelperText error id="helper-text-pincode-signup">
                      {errors.pincode}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid size={12}>
                  <Stack sx={{ gap: 1 }}>
                    <InputLabel htmlFor="website-signup">Website</InputLabel>
                    <OutlinedInput
                      fullWidth
                      error={Boolean(touched.website && errors.website)}
                      id="website-signup"
                      value={values.website}
                      name="website name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter your website"
                      inputProps={{}}
                    />
                  </Stack>
                  {touched.website && errors.website && (
                    <FormHelperText error id="helper-text-website-signup">
                      {errors.website}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
            )}

            {/* Navigation Buttons */}
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
              <Button variant="outlined" disabled={currentStep === 1} onClick={() => setCurrentStep((prev) => prev - 1)}>
                Previous
              </Button>
              {currentStep < 2 ? (
                <Button variant="contained" onClick={() => setCurrentStep((prev) => prev + 1)}>
                  Next
                </Button>
              ) : (
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Create Account
                  </Button>
                </AnimateButton>
              )}
            </Stack>
          </form>
        )}
      </Formik>
      {providers && (
        <Stack
          direction="row"
          sx={{
            gap: { xs: 1, sm: 2 },
            justifyContent: { xs: 'space-around', sm: 'space-between' },
            mt: 3,
            '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 }, ml: { xs: 0, sm: -0.5 } }
          }}
        >
          {Object.values(providers).map((provider: any) => {
            if (provider.id === 'login' || provider.id === 'register') {
              return;
            }
            return (
              <Box key={provider.name} sx={{ width: '100%' }}>
                <Divider sx={{ mt: 2 }}>
                  <Typography variant="caption"> Sign up with</Typography>
                </Divider>
                {provider.id === 'google' && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth={!downSM}
                    startIcon={<Image src={Google} alt="Twitter" width={16} height={16} />}
                    onClick={() => signIn(provider.id, { callbackUrl: APP_DEFAULT_PATH })}
                  >
                    {!downSM && 'Google'}
                  </Button>
                )}
                {provider.id === 'auth0' && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth={!downSM}
                    startIcon={<Image src={Auth0} alt="Twitter" width={16} height={16} />}
                    onClick={() => signIn(provider.id, { callbackUrl: APP_DEFAULT_PATH })}
                  >
                    {!downSM && 'Auth0'}
                  </Button>
                )}
                {provider.id === 'cognito' && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth={!downSM}
                    startIcon={<Image src={Cognito} alt="Twitter" width={16} height={16} />}
                    onClick={() => signIn(provider.id, { callbackUrl: APP_DEFAULT_PATH })}
                  >
                    {!downSM && 'Cognito'}
                  </Button>
                )}
              </Box>
            );
          })}
        </Stack>
      )}
      {!providers && (
        <Box sx={{ mt: 3 }}>
          <FirebaseSocial />
        </Box>
      )}
    </>
  );
}
