'use client';

import { useEffect, useState, SyntheticEvent } from 'react';
import Image from 'next/legacy/image';
import NextLink from 'next/link';
import { signIn } from 'next-auth/react';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import * as Yup from 'yup';
import { Formik } from 'formik';

// Components
import FirebaseSocial from './FirebaseSocial';

// Config and utils

// Icons
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { authRegister } from 'api/services/authRegister';
import { APP_DEFAULT_PATH } from 'config';
import PhoneInputField from 'components/phone/PhoneInputField';
import { IconButton } from '@mui/material';
import { StringColorProps } from 'types/password';
import AnimateButton from 'components/@extended/AnimateButton';
import { authOrganizationRegister } from 'api/services/authOrganizationRegister';

// Assets
const Auth0 = '/assets/images/icons/auth0.svg';
const Cognito = '/assets/images/icons/aws-cognito.svg';
const Google = '/assets/images/icons/google.svg';

interface AuthRegisterProps {
  providers?: any;
  csrfToken?: any;
}

export default function AuthOrganizationRegister({ providers, csrfToken }: AuthRegisterProps) {
  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [level, setLevel] = useState<StringColorProps>();
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (values: any, { setErrors, setSubmitting }: any) => {
    try {
      const trimmedEmail = values.email.trim();
      


      const payload = {
        organization_name: values.organization_name.trim(),
        industry_name: values.industry_name.trim(),
        email: trimmedEmail,
        pincode: values.pincode,
        website: values.website,
        address: values.address
      };

      const result = await authOrganizationRegister(payload);
      
      if (result.error) {
        setErrors({ submit: result.error });
      } else {
        window.location.href = APP_DEFAULT_PATH;
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          organization_name: '',
          industry_name: '',
          email: '',
          pincode: '',
          website: '',
          address: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
        organization_name: Yup.string().max(255).required('Organization Name is required'),
        industry_name: Yup.string().max(255).required('Industry Name is required'),
        email: Yup.string()
            .email('Must be a valid email')
            .max(255)
            .required('Email is required'),
        pincode: Yup.string().required("Pincode is required"),
        website: Yup.string().required("Website is required"),
        address: Yup.string().required("Address is required"),
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            {csrfToken && <input name="csrfToken" type="hidden" defaultValue={csrfToken} />}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="organization_name-signup">Organization Name*</InputLabel>
                  <OutlinedInput
                    id="organization_name-signup"
                    type="text"
                    value={values.organization_name}
                    name="organization_name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your organization name"
                    fullWidth
                    error={Boolean(touched.organization_name && errors.organization_name)}
                  />
                  {touched.organization_name && errors.organization_name && (
                    <FormHelperText error id="helper-text-organization_name-signup">
                      {errors.organization_name}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="industry_name-signup">Industry Name*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.industry_name && errors.industry_name)}
                    id="industry_name-signup"
                    type="text"
                    value={values.industry_name}
                    name="industry_name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your industry name"
                  />
                  {touched.industry_name && errors.industry_name && (
                    <FormHelperText error id="helper-text-industry_name-signup">
                      {errors.industry_name}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-signup"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email-signup">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sm={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="pincode-signup">Pincode</InputLabel>
                  <OutlinedInput
                    id="pincode-signup"
                    type="text"
                    value={values.pincode}
                    name="pincode"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your pincode"
                    fullWidth
                    error={Boolean(touched.pincode && errors.pincode)}
                  />
                  {touched.pincode && errors.pincode && (
                    <FormHelperText error id="helper-text-pincode-signup">
                      {errors.pincode}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
           
              <Grid item xs={12} sm={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="website-signup">Website</InputLabel>
                  <OutlinedInput
                    id="website-signup"
                    type="text"
                    value={values.website}
                    name="website"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your website"
                    fullWidth
                    error={Boolean(touched.website && errors.website)}
                  />
                  {touched.website && errors.website && (
                    <FormHelperText error id="helper-text-website-signup">
                      {errors.website}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>


              <Grid item xs={12} sm={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="website-address">Address</InputLabel>
                  <OutlinedInput
                    id="address-signup"
                    type="text"
                    value={values.address}
                    name="address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    fullWidth
                    error={Boolean(touched.address && errors.address)}
                  />
                  {touched.address && errors.address && (
                    <FormHelperText error id="helper-text-address-signup">
                      {errors.address}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
           
           
              <Grid item xs={12} sx={{ mt: -1 }}>
                <Typography variant="body2">
                  By Signing up, you agree to our &nbsp;
                  <Link variant="subtitle2" component={NextLink} href="/terms-of-service">
                    Terms of Service
                  </Link>
                  &nbsp; and &nbsp;
                  <Link variant="subtitle2" component={NextLink} href="/privacy-policy">
                    Privacy Policy
                  </Link>
                </Typography>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
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
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
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